"use client";

/**
 * Auth + data access for the platform-wide super-admin console. Mostly talks
 * to identity-tenancy (auth, tenants, staff, audit), plus explicit
 * cross-service calls for platform-level views into a specific tenant's data
 * (e.g. order-management-provisioning for the Order Activity view) — all via
 * the same `/api/proxy` route the tenant-scoped admin panel uses (see
 * lib/admin/client.ts), since direct browser calls hit CORS/mixed-content in
 * dev.
 *
 * Flow:
 *   1. Resolve the synthetic platform tenant's id from its domain slug
 *      (GET /v1/tenants/resolve — public, no auth) so the operator never
 *      has to know or paste a tenant UUID.
 *   2. POST /v1/sessions with that tenant id — identical to a normal login,
 *      except the account must carry `role_platform_admin` (granted to the
 *      bootstrap super-admin via its wildcard access policy).
 *   3. GET /v1/tenants (requires `platform:admin:read` scope) lists every
 *      tenant on the platform for the dashboard.
 */

import { decodeJwt } from "../session";
import { ApiException } from "../client";
import { SUPER_ADMIN_HOST, isSuperAdminHost } from "./host";
import {
  getPlatformSession,
  setPlatformSession,
  clearPlatformSession,
  type PlatformSession,
} from "./session";

const IDENTITY_PORT = 8080;
// order-management-provisioning (see services.ts SERVICES.order.port). Kept
// as a literal here rather than importing the tenant-panel's service
// registry, since this module intentionally has its own minimal port list
// for the handful of cross-service platform views it needs.
const ORDER_PORT = 8083;
const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN_SUFFIX || "platform.zoikonex.io";

interface ProxyPayload {
  status: number;
  ok: boolean;
  data: any;
}

async function proxy(method: string, path: string, opts: { headers?: Record<string, string>; body?: unknown; port?: number } = {}): Promise<ProxyPayload> {
  const port = opts.port ?? IDENTITY_PORT;
  let res: Response;
  try {
    res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ port, method, path, headers: opts.headers, body: opts.body }),
    });
  } catch {
    throw new ApiException(502, { code: "SERVICE_UNREACHABLE", message: "Backend service unreachable via proxy.", retryable: true });
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

/**
 * A super-admin sign-in either completes or stops at the second factor. The
 * step-up token is the only link between the two halves, so it is returned to
 * the caller rather than stashed in module state: a login page that remounts
 * mid-flow should lose the challenge and start again, not silently resume one.
 */
export interface PlatformLoginResult {
  status: "ok" | "mfa";
  stepUpToken?: string;
  tenantId?: string;
}

export async function platformLogin(email: string, password: string): Promise<PlatformLoginResult> {
  // Super-admin credentials may only ever be posted from the dedicated
  // super-admin host (see ./host.ts). middleware.ts already prevents the console
  // from being served elsewhere; this guard means a stale bundle or a spoofed
  // local host still can't turn another origin into a super-admin login page.
  if (!isSuperAdminHost()) {
    throw new ApiException(403, {
      code: "WRONG_DOMAIN",
      message: `Platform super-admin sign-in is only available at https://${SUPER_ADMIN_HOST}.`,
    });
  }

  const tenantId = await resolvePlatformTenantId();

  const payload = await proxy("POST", "/v1/sessions", {
    headers: { "x-tenant-id": tenantId },
    body: { email, password },
  });

  const body = payload.data || {};

  // The password was accepted and a code is owed. Checked before the failure
  // branch: this is a 401, and treating it as one would show the challenge
  // prompt as a credential error.
  if (payload.status === 401 && (body.code === "MFA_REQUIRED" || body.error === "MFA_REQUIRED")) {
    return { status: "mfa", stepUpToken: body.step_up_token as string, tenantId };
  }

  if (!payload.ok || !body.access_token) {
    throw new ApiException(payload.status, {
      code: body.code || body.error || "UNAUTHORIZED",
      message: body.message || "Invalid email or password.",
    });
  }

  finishPlatformLogin(body, tenantId, email);
  return { status: "ok" };
}

/**
 * Completes a super-admin sign-in that stopped at the second factor.
 *
 * The platform-admin role check lives in finishPlatformLogin, which both paths
 * go through, so an MFA sign-in cannot end up holding a platform session that
 * an ordinary password sign-in would have refused.
 */
export async function completePlatformMfa(
  stepUpToken: string,
  mfaCode: string,
  tenantId: string,
  email: string,
): Promise<void> {
  if (!isSuperAdminHost()) {
    throw new ApiException(403, {
      code: "WRONG_DOMAIN",
      message: `Platform super-admin sign-in is only available at https://${SUPER_ADMIN_HOST}.`,
    });
  }

  const payload = await proxy("POST", "/v1/sessions/mfa", {
    headers: { "x-tenant-id": tenantId },
    body: { step_up_token: stepUpToken, mfa_code: mfaCode.trim() },
  });

  const body = payload.data || {};
  if (!payload.ok || !body.access_token) {
    throw new ApiException(payload.status, {
      code: body.code || "MFA_FAILED",
      message: body.message || "That code was not accepted.",
    });
  }

  finishPlatformLogin(body, tenantId, email);
}

function finishPlatformLogin(body: Record<string, any>, tenantId: string, email: string): void {
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

export interface PlatformBrand {
  id: string;
  name: string;
  code_name: string;
}

export interface PlatformTenant {
  tenant_id: string;
  name: string;
  domain_suffix: string;
  status: string;
  brand_count: number;
  brands: PlatformBrand[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

/** Authenticated request, with one silent refresh-and-retry on a 401 (refresh
 *  tokens rotate). Every platform-admin API call shares this so the retry
 *  logic lives in exactly one place. Defaults to identity-tenancy; pass
 *  `port` to reach a different backend (e.g. order-management-provisioning)
 *  — the platform admin's JWT is valid everywhere since every service
 *  verifies against the same identity-tenancy JWKS.
 *
 *  extraHeaders lets a platform-admin operate on a SPECIFIC tenant's
 *  tenant-scoped routes (e.g. listing that tenant's users or orders) by
 *  setting X-Tenant-ID directly — identity-tenancy's tenant-scoped routes
 *  read tenant from the header for role_platform_admin (see its
 *  RequireTenantMatchOrPlatformAdmin); other services' JWT-scoped routes
 *  recognize the same role via their own explicit override (see e.g.
 *  order-management-provisioning's resolveTenantAndBrand). Ordinary callers
 *  without that role never get either override. */
async function authedRequest(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>, port?: number): Promise<any> {
  let session = getPlatformSession();
  if (!session) throw new ApiException(401, { code: "UNAUTHENTICATED", message: "Not signed in." });

  const doFetch = (s: PlatformSession) => proxy(method, path, { headers: { authorization: `Bearer ${s.accessToken}`, ...extraHeaders }, body, port });

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
  return payload.data;
}

export async function fetchTenants(): Promise<PlatformTenant[]> {
  const data = await authedRequest("GET", "/v1/tenants");
  return (data?.tenants ?? []) as PlatformTenant[];
}

export interface ProvisionTenantInput {
  name: string;
  domain_suffix: string;
  brand_name: string;
  brand_code: string;
}

export async function provisionTenant(input: ProvisionTenantInput): Promise<{ tenant_id: string; brand_id: string }> {
  return authedRequest("POST", "/v1/tenants", input);
}

export interface CreateTenantAdminInput {
  email: string;
  full_name: string;
  password: string;
  brand_id: string;
}

export async function createTenantAdmin(tenantId: string, input: CreateTenantAdminInput): Promise<{ user_id: string; email: string }> {
  return authedRequest("POST", `/v1/tenants/${tenantId}/admin-user`, input);
}

export type TenantLifecycleAction = "ACTIVATE" | "SUSPEND" | "REACTIVATE" | "ARCHIVE";

export async function updateTenantLifecycle(tenantId: string, action: TenantLifecycleAction, reason?: string): Promise<void> {
  await authedRequest("PATCH", `/v1/tenants/${tenantId}`, { action, reason });
}

export interface TenantUser {
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
}

export async function fetchTenantUsers(tenantId: string): Promise<TenantUser[]> {
  const data = await authedRequest("GET", "/v1/users", undefined, { "x-tenant-id": tenantId });
  return (data?.users ?? []) as TenantUser[];
}

/**
 * Platform staff management. Zoiko's own team, not a customer tenant's
 * users — these accounts live in the synthetic platform tenant (see
 * migrations/000009_bootstrap_platform_tenant) and are managed through the
 * exact same generic identity endpoints as any tenant's users, just with
 * X-Tenant-ID pinned to the platform tenant.
 *
 * Only two tiers are meaningful given how the backend actually enforces
 * access (see identity-tenancy API.INTEGRATION.md gotcha on X-Tenant-ID):
 *   - "admin": a wildcard AccessPolicy (role_platform_admin) - full access,
 *     including drilling into any single tenant's users/audit trail.
 *   - "viewer": a scoped policy granting only platform:admin:read - can see
 *     the tenant list/counts (GET /v1/tenants), but CANNOT view any single
 *     tenant's users or audit trail. That drill-down is gated by
 *     RequireTenantMatchOrPlatformAdmin, which only recognizes the full
 *     role_platform_admin role, not a scoped grant - there is currently no
 *     backend concept of "read-only access to every tenant's own data."
 */
export type PlatformStaffRole = "admin" | "viewer";

let cachedPlatformTenant: { tenantId: string; brandId: string } | null = null;

async function resolvePlatformTenantAndBrand(): Promise<{ tenantId: string; brandId: string }> {
  if (cachedPlatformTenant) return cachedPlatformTenant;
  const tenants = await fetchTenants();
  const platform = tenants.find((t) => t.domain_suffix === PLATFORM_DOMAIN);
  if (!platform || !platform.brands?.[0]?.id) {
    throw new ApiException(500, {
      code: "PLATFORM_TENANT_MISCONFIGURED",
      message: "Platform tenant or its brand could not be resolved. Confirm migrations/000009 has run.",
    });
  }
  cachedPlatformTenant = { tenantId: platform.tenant_id, brandId: platform.brands[0].id };
  return cachedPlatformTenant;
}

export interface CreatePlatformStaffInput {
  email: string;
  full_name: string;
  password: string;
  role: PlatformStaffRole;
}

export async function createPlatformStaffUser(input: CreatePlatformStaffInput): Promise<{ user_id: string; email: string }> {
  const { tenantId, brandId } = await resolvePlatformTenantAndBrand();
  const rules =
    input.role === "admin"
      ? [{ effect: "allow", action_pattern: "*", resource_pattern: "*" }]
      : [{ effect: "allow", action_pattern: "platform:admin:read", resource_pattern: "*" }];

  return authedRequest(
    "POST",
    "/v1/users",
    { email: input.email, full_name: input.full_name, password: input.password, brand_id: brandId, rules },
    { "x-tenant-id": tenantId },
  );
}

export async function fetchPlatformStaff(): Promise<TenantUser[]> {
  const { tenantId } = await resolvePlatformTenantAndBrand();
  return fetchTenantUsers(tenantId);
}

export interface AuditTrailEntry {
  id: string;
  tenant_id: string;
  event_type: string;
  actor_id: string;
  actor_type: string;
  client_ip: string;
  user_agent: string;
  payload: string;
  timestamp: string;
}

export interface FetchAuditTrailsParams {
  actorId?: string;
  eventType?: string;
  limit?: number;
  cursor?: string;
}

/** Fetches a specific tenant's audit history. Drilling into any tenant OTHER
 *  than the platform tenant itself requires the caller to hold full
 *  role_platform_admin - see the module docstring above. */
export async function fetchAuditTrails(tenantId: string, params: FetchAuditTrailsParams = {}): Promise<{ trails: AuditTrailEntry[]; nextCursor: string }> {
  const q = new URLSearchParams();
  if (params.actorId) q.set("actor_id", params.actorId);
  if (params.eventType) q.set("event_type", params.eventType);
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  const qs = q.toString();

  const data = await authedRequest("GET", `/v1/audit-trails${qs ? `?${qs}` : ""}`, undefined, { "x-tenant-id": tenantId });
  return { trails: (data?.audit_trails ?? []) as AuditTrailEntry[], nextCursor: data?.next_cursor ?? "" };
}

export interface TenantOrder {
  id: string;
  status: string;
  order_type: string;
  customer_id: string;
  account_id: string;
  currency_code?: string;
  failure_reason?: string;
  created_at: string;
  updated_at?: string;
}

/** Fetches a specific tenant's recent order activity from
 *  order-management-provisioning (a different service, different port, than
 *  everything else in this file). Requires the caller to hold
 *  role_platform_admin - see that service's resolveTenantAndBrand. */
export async function fetchTenantOrders(tenantId: string, limit = 50): Promise<TenantOrder[]> {
  const data = await authedRequest(
    "GET",
    `/v1/orders?limit=${limit}`,
    undefined,
    { "x-tenant-id": tenantId },
    ORDER_PORT,
  );
  return (data?.items ?? []) as TenantOrder[];
}
