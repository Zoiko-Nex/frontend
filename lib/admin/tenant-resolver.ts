export interface ResolvedTenant {
  tenant_id: string;
  name: string;
  status: string;
  domain_suffix: string;
}

const APEX_DOMAINS = new Set([
  "localhost",
  "127.0.0.1",
  "zoikonex.com",
  "www.zoikonex.com",
  "platform.zoikonex.io",
  "app.zoikonex.com",
  // Super-admin console hosts — never a customer tenant. See
  // lib/admin/platform/host.ts.
  "super-admin.zoikonex.com",
  "superadmin.zoikonex.com",
]);

/**
 * True for hosts that serve the marketing site or an internal console and can
 * therefore never be resolved to a customer tenant.
 */
export function isApexDomain(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/:\d+$/, "");
  return APEX_DOMAINS.has(host) || host.endsWith(".vercel.app");
}

/**
 * Extracts a target domain suffix from the current browser location or explicit input.
 */
export function extractDomainSlug(overrideDomain?: string): string | null {
  if (overrideDomain && overrideDomain.trim() !== "") {
    return cleanDomain(overrideDomain);
  }

  if (typeof window === "undefined") {
    return null;
  }

  // 1. Check for URL query parameter override (e.g. ?domain=golite.zoikonex.com or ?tenant=...)
  const params = new URLSearchParams(window.location.search);
  const queryDomain = params.get("domain") || params.get("tenant") || params.get("workspace");
  if (queryDomain && queryDomain.trim() !== "") {
    return cleanDomain(queryDomain);
  }

  // 2. Extract from hostname (e.g. golite.zoikonex.com)
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname || isApexDomain(hostname)) {
    return null;
  }

  return cleanDomain(hostname);
}

function cleanDomain(raw: string): string {
  let domain = raw.trim().toLowerCase();
  if (domain.includes("@")) {
    domain = domain.split("@")[1];
  }
  if (domain.includes("://")) {
    domain = domain.split("://")[1];
  }
  if (domain.includes("/")) {
    domain = domain.split("/")[0];
  }
  if (domain.includes(":")) {
    domain = domain.split(":")[0];
  }
  if (domain.startsWith("www.")) {
    domain = domain.substring(4);
  }
  return domain;
}

/**
 * Resolves tenant metadata (tenant_id, name, status) from a domain suffix or slug.
 */
export async function resolveTenant(overrideDomain?: string): Promise<ResolvedTenant | null> {
  const domain = extractDomainSlug(overrideDomain);
  if (!domain) {
    return null;
  }

  // If already a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(domain);
  if (isUuid) {
    return {
      tenant_id: domain,
      name: "Tenant Workspace",
      status: "ACTIVE",
      domain_suffix: domain,
    };
  }

  const candidateDomains = [domain];
  if (!domain.includes(".")) {
    candidateDomains.push(`${domain}.zoikonex.com`);
    candidateDomains.push(`${domain}.zoikonex.io`);
    candidateDomains.push(`${domain}.zoikonex.internal`);
  } else {
    // If domain is e.g. "temp.zoikonex.com", also test against the prefix slug "temp"
    const prefix = domain.split(".")[0];
    if (prefix && prefix !== "www" && prefix !== "app" && prefix !== "platform") {
      candidateDomains.push(prefix);
    }
  }

  for (const candidate of candidateDomains) {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          port: 8080,
          method: "GET",
          path: `/v1/tenants/resolve?domain=${encodeURIComponent(candidate)}`,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload.ok && payload.data && payload.data.tenant_id) {
          return payload.data as ResolvedTenant;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}
