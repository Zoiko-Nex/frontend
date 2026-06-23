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

/** Refresh against identity-tenancy. Returns the new session or null. */
async function tryRefresh(session: AdminSession): Promise<AdminSession | null> {
  const base = serviceBaseUrl(getService("identity")!);
  try {
    const res = await fetch(`${base}/v1/sessions/refresh`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refreshToken }),
    });
    if (!res.ok) return null;
    const body = await res.json();
    if (!body.access_token) return null;
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

  const base = serviceBaseUrl(svc);
  const hasBody = body !== undefined;
  let session = opts.noAuth ? null : getSession();

  const doFetch = (s: AdminSession | null) =>
    fetch(`${base}${path}`, {
      method,
      headers: buildHeaders(svc, s, opts, hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
      signal: opts.signal,
    });

  let res: Response;
  try {
    res = await doFetch(session);
  } catch {
    throw new ApiException(502, {
      code: "SERVICE_UNREACHABLE",
      message: `${svc.label} is not reachable at ${base}. Is the backend running, and is CORS allowing this origin?`,
      retryable: true,
    });
  }

  // Silent refresh-and-retry once on auth failure.
  if (res.status === 401 && !opts.noAuth && session) {
    const refreshed = await tryRefresh(session);
    if (refreshed) {
      session = refreshed;
      try {
        res = await doFetch(session);
      } catch {
        /* fall through */
      }
    }
    if (res.status === 401) {
      clearSession();
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    throw new ApiException(res.status, typeof payload === "object" ? payload : { message: String(payload) });
  }
  return payload as T;
}

export const api = {
  get: <T>(svc: string, path: string, opts?: ApiOpts) => request<T>("GET", svc, path, undefined, opts),
  post: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("POST", svc, path, body, opts),
  put: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("PUT", svc, path, body, opts),
  patch: <T>(svc: string, path: string, body?: unknown, opts?: ApiOpts) => request<T>("PATCH", svc, path, body, opts),
  del: <T>(svc: string, path: string, opts?: ApiOpts) => request<T>("DELETE", svc, path, undefined, opts),
  uuid: genUuid,
};
