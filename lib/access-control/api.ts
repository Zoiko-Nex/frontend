/**
 * api.ts — typed client for the identity-tenancy backend.
 *
 * Auth model (from the Go middleware): every call carries
 *   Authorization: Bearer <accessToken>
 *   X-Tenant-ID:   <tenantId>
 *
 * How you obtain those depends on your app. The client takes an async
 * `getAuth()` resolver so you can wire it to a cookie, a context, next-auth,
 * etc. without this file knowing the details.
 *
 * Endpoints marked (NEW) do not exist in the backend yet — see ACCESS_CONTROL.md.
 * They are small additions following the same handler pattern as POST /v1/roles.
 */

import type {
  ApiError,
  CreateBindingInput,
  CreateRoleInput,
  Role,
  RouteBinding,
  RouteConflict,
  UpdateBindingInput,
  UpdateRoleInput,
} from "./types";

export interface AuthTokens {
  accessToken: string;
  tenantId: string;
}

export type AuthResolver = () => Promise<AuthTokens> | AuthTokens;

/** Thrown for any non-2xx response. `conflict` is populated on a 409 route clash. */
export class ApiRequestError extends Error {
  status: number;
  body: ApiError | RouteConflict | null;
  conflict: RouteConflict | null;

  constructor(status: number, body: ApiError | RouteConflict | null) {
    super(body?.message || `Request failed (${status})`);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
    this.conflict =
      status === 409 && body && (body as RouteConflict).code === "ROUTE_ALREADY_BOUND"
        ? (body as RouteConflict)
        : null;
  }
}

export interface AccessControlClientOptions {
  baseUrl: string; // e.g. process.env.NEXT_PUBLIC_IDENTITY_API_URL
  getAuth: AuthResolver;
}

export class AccessControlClient {
  private baseUrl: string;
  private getAuth: AuthResolver;

  constructor(opts: AccessControlClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.getAuth = opts.getAuth;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const { accessToken, tenantId } = await this.getAuth();
    const res = await fetch(this.baseUrl + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Tenant-ID": tenantId,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });

    if (res.status === 204) return undefined as T;

    let parsed: unknown = null;
    const text = await res.text();
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        /* non-JSON error body */
      }
    }

    if (!res.ok) {
      throw new ApiRequestError(res.status, parsed as ApiError | RouteConflict);
    }
    return parsed as T;
  }

  // ── Roles ──────────────────────────────────────────────────────────────
  listRoles(): Promise<Role[]> {
    return this.request<Role[]>("GET", "/v1/roles");
  }
  createRole(input: CreateRoleInput): Promise<Role> {
    return this.request<Role>("POST", "/v1/roles", input);
  }
  updateRole(id: string, input: UpdateRoleInput): Promise<Role> {
    // (NEW) PATCH /v1/roles/{id}
    return this.request<Role>("PATCH", `/v1/roles/${id}`, input);
  }
  deleteRole(id: string): Promise<void> {
    // (NEW) DELETE /v1/roles/{id}
    return this.request<void>("DELETE", `/v1/roles/${id}`);
  }

  // ── Route bindings ─────────────────────────────────────────────────────
  listBindings(): Promise<RouteBinding[]> {
    // (NEW) GET /v1/authorization/route-bindings
    return this.request<RouteBinding[]>("GET", "/v1/authorization/route-bindings");
  }
  /**
   * Create a binding. On a semantically-equivalent duplicate the backend
   * returns 409; this surfaces as ApiRequestError with `.conflict` set to the
   * existing binding so the caller can show the "already assigned" form.
   */
  createBinding(input: CreateBindingInput): Promise<RouteBinding> {
    return this.request<RouteBinding>(
      "POST",
      "/v1/authorization/route-bindings",
      input
    );
  }
  updateBinding(id: string, input: UpdateBindingInput): Promise<RouteBinding> {
    // (NEW) PATCH /v1/authorization/route-bindings/{id}
    return this.request<RouteBinding>(
      "PATCH",
      `/v1/authorization/route-bindings/${id}`,
      input
    );
  }
  deleteBinding(id: string): Promise<void> {
    // (NEW) DELETE /v1/authorization/route-bindings/{id}
    return this.request<void>(
      "DELETE",
      `/v1/authorization/route-bindings/${id}`
    );
  }
  /** Optional live lookup so the UI can warn before submit. (NEW) */
  lookupRoute(url: string): Promise<{ match: string; existing: RouteBinding | null }> {
    const q = encodeURIComponent(url);
    return this.request("GET", `/v1/authorization/route-bindings/lookup?url=${q}`);
  }
}

export default AccessControlClient;
