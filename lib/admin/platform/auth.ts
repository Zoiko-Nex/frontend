"use client";

/**
 * Auth + data access for the platform-wide super-admin console. Talks to
 * identity-tenancy only, via the same `/api/proxy` route the tenant-scoped
 * admin panel uses (see lib/admin/client.ts) — direct browser calls to the
 * backend hit CORS/mixed-content in dev, so everything goes through it.
 *
 * Flow:
 *   1. Resolve the synthetic platform tenant's id from its domain slug
 *      (GET /v1/tenants/resolve — public, no auth) so the operator never
 *      has to know or paste a tenant UUID.
 *   2. POST /v1/sessions with that tenant id — identical to a normal login,
 *      except the account must carry `role_platform_admin` (granted to the
 *      bootstrap super-admin via its wildcard access policy).
 *   3. GET /v1/tenants (requires `platform:admin` scope) lists every tenant
 *      on the platform for the dashboard.
 */

import { decodeJwt } from "../session";
import { ApiException } from "../client";
import {
  getPlatformSession,
  setPlatformSession,
  clearPlatformSession,
  type PlatformSession,
} from "./session";

const IDENTITY_PORT = 8080;
const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN_SUFFIX || "platform.zoikonex.io";

interface ProxyPayload {
  status: number;
  ok: boolean;
  data: any;
}

async function proxy(method: string, path: string, opts: { headers?: Record<string, string>; body?: unknown } = {}): Promise<ProxyPayload> {
  let res: Response;
  try {
    res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ port: IDENTITY_PORT, method, path, headers: opts.headers, body: opts.body }),
    });
  } catch {
    throw new ApiException(502, { code: "SERVICE_UNREACHABLE", message: "Identity service unreachable via proxy.", retryable: true });
  }
  if (!res.ok) throw new ApiException(502, { code: "SERVICE_UNREACHABLE", message: "Proxy request failed.", retryable: true });
  return res.json();
}

async function resolvePlatformTenantId(): Promise<string> {
  const payload = await proxy("GET", `/v1/tenants/resolve?domain=${encodeURIComponent(PLATFORM_DOMAIN)}`);
  if (!payload.ok || !payload.data?.tenant_id) {
    throw new ApiException(payload.status || 404, {
      code: payload.data?.code || "PLATFORM_TENANT_NOT_FOUND",
      message:
        payload.data?.message ||
        "Platform tenant not found. Confirm migrations/000009 has run and BOOTSTRAP_SUPERADMIN_ENABLED=true on identity-tenancy.",
    });
  }
  return payload.data.tenant_id as string;
}

export async function platformLogin(email: string, password: string): Promise<void> {
  const tenantId = await resolvePlatformTenantId();

  const payload = await proxy("POST", "/v1/sessions", {
    headers: { "x-tenant-id": tenantId },
    body: { email, password },
  });

  const body = payload.data || {};
  if (!payload.ok || !body.access_token) {
    throw new ApiException(payload.status, {
      code: body.code || body.error || "UNAUTHORIZED",
      message: body.message || "Invalid email or password.",
    });
  }

  const claims = decodeJwt(body.access_token) || {};
  const roles = (claims.roles as string[]) || [];
  if (!roles.includes("role_platform_admin")) {
    throw new ApiException(403, {
      code: "NOT_PLATFORM_ADMIN",
      message: "This account is not a platform super-admin.",
    });
  }

  const session: PlatformSession = {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    sessionId: body.session_id,
    expiresAt: Date.now() + (body.expires_in ?? 900) * 1000,
    tenantId,
    email: (claims.email as string) || email,
    userId: (claims.sub as string) || undefined,
    roles,
  };
  setPlatformSession(session);
}

export function platformLogout(): void {
  clearPlatformSession();
}

async function tryRefresh(session: PlatformSession): Promise<PlatformSession | null> {
  try {
    const payload = await proxy("POST", "/v1/sessions/refresh", { body: { refresh_token: session.refreshToken } });
    if (!payload.ok || !payload.data?.access_token) return null;
    const next: PlatformSession = {
      ...session,
      accessToken: payload.data.access_token,
      refreshToken: payload.data.refresh_token ?? session.refreshToken, // rotates
      expiresAt: Date.now() + (payload.data.expires_in ?? 900) * 1000,
    };
    setPlatformSession(next);
    return next;
  } catch {
    return null;
  }
}

export interface PlatformTenant {
  tenant_id: string;
  name: string;
  domain_suffix: string;
  status: string;
  brand_count: number;
  created_at: string;
  updated_at: string;
}

export async function fetchTenants(): Promise<PlatformTenant[]> {
  let session = getPlatformSession();
  if (!session) throw new ApiException(401, { code: "UNAUTHENTICATED", message: "Not signed in." });

  const doFetch = (s: PlatformSession) => proxy("GET", "/v1/tenants", { headers: { authorization: `Bearer ${s.accessToken}` } });

  let payload = await doFetch(session);
  if (payload.status === 401) {
    const refreshed = await tryRefresh(session);
    if (refreshed) {
      session = refreshed;
      payload = await doFetch(session);
    }
  }
  if (!payload.ok) {
    if (payload.status === 401) clearPlatformSession();
    throw new ApiException(payload.status, typeof payload.data === "object" ? payload.data : { message: String(payload.data) });
  }
  return (payload.data?.tenants ?? []) as PlatformTenant[];
}
