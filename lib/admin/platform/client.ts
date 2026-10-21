"use client";

/**
 * API client for the platform-wide super-admin console.
 *
 * This exists separately from `lib/admin/client.ts` for two reasons, and both
 * matter:
 *
 *   1. **Different session.** The tenant console stores its token under
 *      `zx_admin_session`; the platform console uses `zx_platform_session`
 *      (see ./session.ts). The tenant client reads the wrong key entirely, so
 *      calling it from here sends either no token or a tenant admin's.
 *
 *   2. **Cross-tenant reads.** A super admin looks *across* tenants, but every
 *      backend derives `tenant_id` from the caller's JWT — and a platform
 *      admin's JWT carries the synthetic platform tenant, which owns no
 *      customer data. Two services (and only two) let a caller holding
 *      `role_platform_admin` override the tenant with an `X-Tenant-ID` header:
 *
 *        identity-tenancy   RequireTenantMatchOrPlatformAdmin (middleware.go)
 *        order-management   resolveTenantAndBrand              (middleware.go)
 *
 *      `asTenant` below sends that header. Passing it to any OTHER service is
 *      silently ignored — the header is simply not read, and the response is
 *      the platform tenant's own (empty) data rather than an error. That is
 *      why CROSS_TENANT_SERVICES is enforced here rather than left to the
 *      caller to remember: a silently-empty table reads as "this tenant has no
 *      data", which is the single most misleading failure this console can
 *      produce.
 *
 * Everything else — proxy transport, the 200-wrapping envelope, silent refresh
 * on 401 — mirrors the tenant client deliberately, so the two behave the same
 * way when they can.
 */

import { getService, type ServiceDef } from "../services";
import { ApiException, genUuid } from "../client";
import { getPlatformSession, setPlatformSession, clearPlatformSession, type PlatformSession } from "./session";

/**
 * The only services whose middleware honours an X-Tenant-ID override from a
 * platform admin. Verified against each service's middleware.go — do not add
 * to this list without checking the chain actually calls resolveTenantAndBrand
 * (or an equivalent), because the failure mode is silent.
 */
export const CROSS_TENANT_SERVICES = new Set(["identity", "order", "integration"]);

export interface PlatformApiOpts {
  /**
   * Read/write as this tenant instead of the platform tenant. Only honoured by
   * CROSS_TENANT_SERVICES; throws for anything else rather than quietly
   * returning the platform tenant's data.
   */
  asTenant?: string;
  asBrand?: string;
  idempotencyKey?: string;
  correlationId?: string;
  signal?: AbortSignal;
}

let inFlightRefresh: Promise<PlatformSession | null> | null = null;

function refreshOnce(session: PlatformSession): Promise<PlatformSession | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = tryRefresh(session).finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}

/**
 * Refresh tokens are single-use, so concurrent 401s must share one refresh —
 * same reasoning as the tenant client. The console fires a dozen queries at
 * once on load, and without this all but one would fail the moment a token
 * expires mid-session.
 */
async function tryRefresh(session: PlatformSession): Promise<PlatformSession | null> {
  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        port: 8080,
        method: "POST",
        path: "/v1/sessions/refresh",
        body: { refresh_token: session.refreshToken },
      }),
    });
    if (!res.ok) return null;
    const payload = await res.json();
    if (!payload.ok || !payload.data?.access_token) return null;

    const next: PlatformSession = {
      ...session,
      accessToken: payload.data.access_token,
      refreshToken: payload.data.refresh_token ?? session.refreshToken,
      expiresAt: Date.now() + (payload.data.expires_in ?? 900) * 1000,
    };
    setPlatformSession(next);
    return next;
  } catch {
    return null;
  }
}

function buildHeaders(
  svc: ServiceDef,
  session: PlatformSession | null,
  opts: PlatformApiOpts,
  hasBody: boolean,
): Record<string, string> {
  const h: Record<string, string> = {};
  if (hasBody) h["content-type"] = "application/json";
  h["x-correlation-id"] = opts.correlationId || genUuid();
  if (opts.idempotencyKey) h["idempotency-key"] = opts.idempotencyKey;
  if (!session) return h;

  h["authorization"] = `Bearer ${session.accessToken}`;

  if (opts.asTenant) {
    h["x-tenant-id"] = opts.asTenant;
    if (opts.asBrand) h["x-brand-id"] = opts.asBrand;
  } else if (svc.headerStyle === "tenant-header" || svc.headerStyle === "tenant-brand-idem") {
    h["x-tenant-id"] = session.tenantId;
  }
  return h;
}

async function request<T>(
  method: string,
  serviceKey: string,
  path: string,
  body?: unknown,
  opts: PlatformApiOpts = {},
): Promise<T> {
  const svc = getService(serviceKey);
  if (!svc) {
    throw new ApiException(404, { code: "UNKNOWN_SERVICE", message: `Unknown service "${serviceKey}".` });
  }

  // Fail loudly rather than returning the platform tenant's empty data dressed
  // up as the requested tenant's.
  if (opts.asTenant && !CROSS_TENANT_SERVICES.has(serviceKey)) {
    throw new ApiException(501, {
      code: "CROSS_TENANT_UNSUPPORTED",
      message:
        `${svc.label} derives tenant from the JWT and ignores X-Tenant-ID, so it cannot be read ` +
        `on behalf of another tenant. Only ${[...CROSS_TENANT_SERVICES].join(" and ")} support the override.`,
    });
  }

  let session = getPlatformSession();
  const hasBody = body !== undefined;

  const doFetch = async (s: PlatformSession | null) => {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        port: svc.port,
        method,
        path,
        headers: buildHeaders(svc, s, opts, hasBody),
        body,
      }),
      signal: opts.signal,
    });
    if (!res.ok) throw new Error("Proxy failed");
    return res.json() as Promise<{ status: number; ok: boolean; data: unknown }>;
  };

  let payload: { status: number; ok: boolean; data: any };
  try {
    payload = await doFetch(session);
  } catch {
    throw new ApiException(502, {
      code: "SERVICE_UNREACHABLE",
      message: `${svc.label} is not reachable via the proxy.`,
      retryable: true,
    });
  }

  if (payload.status === 401 && session) {
    const refreshed = await refreshOnce(session);
    if (refreshed) {
      session = refreshed;
      try {
        payload = await doFetch(session);
      } catch {
        /* fall through to the 401 handling below */
      }
    }
    if (payload.status === 401) {
      clearPlatformSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/Super-admin/login")) {
        window.location.href = "/Super-admin/login?reason=session_expired";
      }
    }
  }

  if (!payload.ok) {
    const errorBody = typeof payload.data === "object" && payload.data !== null ? payload.data : { message: String(payload.data) };
    throw new ApiException(payload.status, errorBody);
  }

  return payload.data as T;
}

export const platformApi = {
  get: <T>(svc: string, path: string, opts?: PlatformApiOpts) => request<T>("GET", svc, path, undefined, opts),
  post: <T>(svc: string, path: string, body?: unknown, opts?: PlatformApiOpts) => request<T>("POST", svc, path, body, opts),
  put: <T>(svc: string, path: string, body?: unknown, opts?: PlatformApiOpts) => request<T>("PUT", svc, path, body, opts),
  patch: <T>(svc: string, path: string, body?: unknown, opts?: PlatformApiOpts) => request<T>("PATCH", svc, path, body, opts),
  del: <T>(svc: string, path: string, opts?: PlatformApiOpts) => request<T>("DELETE", svc, path, undefined, opts),
  delWithBody: <T>(svc: string, path: string, body: unknown, opts?: PlatformApiOpts) => request<T>("DELETE", svc, path, body, opts),
  uuid: genUuid,
};

/**
 * Liveness probe for the domain-health grid. Deliberately not routed through
 * `request` — /health is public on every service, needs no token, and a 401 or
 * a 500 are equally "this service answered", which is all the grid claims.
 */
export async function probeHealth(serviceKey: string, signal?: AbortSignal): Promise<"live" | "degraded" | "down"> {
  const svc = getService(serviceKey);
  if (!svc) return "down";
  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ port: svc.port, method: "GET", path: "/health" }),
      signal,
    });
    if (!res.ok) return "down";
    const payload = await res.json();
    if (payload.ok) return "live";
    // The proxy reached the service but it answered non-2xx — reachable but unhealthy.
    return payload.status >= 400 && payload.status < 600 ? "degraded" : "down";
  } catch {
    return "down";
  }
}
