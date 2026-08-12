"use client";

/**
 * Browser-side API client. Calls the ZoikoNex backend services DIRECTLY,
 * injecting the correct per-service header convention (jwt / tenant-header /
 * tenant-brand-idem) from the registry. On a 401 it attempts a single silent
 * token refresh against identity-tenancy, then retries once; if that fails it
 * clears the session so the UI can route to login.
 */

import { getService, serviceBaseUrl, type ServiceDef } from "./services";
import { getSession, setSession, clearSession, type AdminSession } from "./session";

/** The platform's standard error envelope (CLAUDE.md §9). */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  correlation_id?: string;
  retryable?: boolean;
}

export class ApiException extends Error {
  code: string;
  status: number;
  correlationId?: string;
  retryable: boolean;
  details?: Record<string, unknown>;

  constructor(status: number, body: Partial<ApiError>) {
    super(body.message || "Request failed");
    this.name = "ApiException";
    this.status = status;
    this.code = body.code || "UNKNOWN";
    this.correlationId = body.correlation_id;
    this.retryable = body.retryable ?? false;
    this.details = body.details;
  }
}

export interface ApiOpts {
  idempotencyKey?: string;
  correlationId?: string;
  signal?: AbortSignal;
  /** Skip auth header (used for the login call itself). */
  noAuth?: boolean;
}

export function genUuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function buildHeaders(svc: ServiceDef, session: AdminSession | null, opts: ApiOpts, hasBody: boolean): Headers {
  const h = new Headers();
  if (hasBody) h.set("content-type", "application/json");
  h.set("x-correlation-id", opts.correlationId || genUuid());
  if (opts.idempotencyKey) h.set("idempotency-key", opts.idempotencyKey);

  if (!opts.noAuth && session) {
    h.set("authorization", `Bearer ${session.accessToken}`);
    if (svc.headerStyle === "tenant-header" || svc.headerStyle === "tenant-brand-idem") {
      h.set("x-tenant-id", session.tenantId);
    }
    if (svc.headerStyle === "tenant-brand-idem" && session.brandId) {
      h.set("x-brand-id", session.brandId);
    }
  }
  return h;
}

// Concurrent requests that all hold the same (now-expired) access token will
// all get a 401 at roughly the same instant. Refresh tokens are single-use
// (the backend atomically consumes them — see ConsumeByRefreshToken), so if
// each request independently calls tryRefresh with the same stale refresh
// token, only the first one to land actually succeeds; every other
// concurrent caller finds the token already consumed and fails outright.
// This dedupes concurrent refreshes into one in-flight call that every
// caller awaits, so a page that fires several queries at once (e.g. a modal
// loading roles + permissions + members together) doesn't spuriously fail
// most of them the moment the token expires mid-session.
let inFlightRefresh: Promise<AdminSession | null> | null = null;

function refreshOnce(session: AdminSession): Promise<AdminSession | null> {
  if (!inFlightRefresh) {
    inFlightRefresh = tryRefresh(session).finally(() => {
      inFlightRefresh = null;
    });
  }
  return inFlightRefresh;
}

/** Refresh against identity-tenancy. Returns the new session or null. */
async function tryRefresh(session: AdminSession): Promise<AdminSession | null> {
  try {
    const res = await fetch(`/api/proxy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        port: 8080,
        method: "POST",
        path: "/v1/sessions/refresh",
        body: { refresh_token: session.refreshToken }
      }),
    });
    if (!res.ok) return null;
    const proxyData = await res.json();
    if (!proxyData.ok || !proxyData.data?.access_token) return null;
    
    const body = proxyData.data;
    const next: AdminSession = {
      ...session,
      accessToken: body.access_token,
      refreshToken: body.refresh_token ?? session.refreshToken, // rotates!
      expiresAt: Date.now() + (body.expires_in ?? 900) * 1000,
    };
    setSession(next);
    return next;
  } catch {
    return null;
  }
}

async function request<T>(method: string, serviceKey: string, path: string, body?: unknown, opts: ApiOpts = {}): Promise<T> {
  const svc = getService(serviceKey);
  if (!svc) throw new ApiException(404, { code: "UNKNOWN_SERVICE", message: `Unknown service "${serviceKey}".` });

  const hasBody = body !== undefined;
  let session = opts.noAuth ? null : getSession();

  const doFetch = async (s: AdminSession | null) => {
    const headersObj: Record<string, string> = {};
    buildHeaders(svc, s, opts, hasBody).forEach((val, key) => { headersObj[key] = val; });
    
    const res = await fetch(`/api/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        port: svc.port,
        method,
        path,
        headers: headersObj,
        body: body,
      }),
      signal: opts.signal,
    });
    if (!res.ok) throw new Error("Proxy failed");
    return res.json();
  };

  let proxyPayload: { status: number, ok: boolean, data: any };
  try {
    proxyPayload = await doFetch(session);
  } catch (error) {
    console.error(`[API Network Error] Service "${svc.label}" unreachable via proxy at path "${path}":`, error);
    throw new ApiException(502, {
      code: "SERVICE_UNREACHABLE",
      message: `${svc.label} is not reachable via proxy. Ensure the backend is running.`,
      retryable: true,
    });
  }

  // Silent refresh-and-retry once on auth failure.
  if (proxyPayload.status === 401 && !opts.noAuth && session) {
    const refreshed = await refreshOnce(session);
    if (refreshed) {
      session = refreshed;
      try {
        proxyPayload = await doFetch(session);
      } catch (error) {
        console.error(`[API Retry Network Error] Retry failed to reach service "${svc.label}" via proxy at path "${path}":`, error);
      }
    }
    if (proxyPayload.status === 401) {
      clearSession();
      // Without this, the caller just gets a thrown ApiException and every
      // subsequent request on the page silently fails with no auth header --
      // the admin is stuck on a dead dashboard with no prompt to re-login.
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?reason=session_expired&next=${encodeURIComponent(window.location.pathname)}`;
      }
    }
  }

  if (!proxyPayload.ok) {
    const errorBody = typeof proxyPayload.data === "object" ? proxyPayload.data : { message: String(proxyPayload.data) };
    console.error(`[API Error] Request failed status=${proxyPayload.status} service=${serviceKey} path=${path}:`, errorBody);
    throw new ApiException(proxyPayload.status, errorBody);
  }

  return proxyPayload.data as T;
}

export const api = {
  get: <T>(svc: string, path: string, opts?: ApiOpts) => request<T>("GET", svc, path, undefined, opts),
  post: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("POST", svc, path, body, opts),
  put: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("PUT", svc, path, body, opts),
  patch: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("PATCH", svc, path, body, opts),
  del: <T>(svc: string, path: string, opts?: ApiOpts) => request<T>("DELETE", svc, path, undefined, opts),
  uuid: genUuid,
};
