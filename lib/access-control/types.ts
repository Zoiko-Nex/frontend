/** types.ts — shared types for the Access Control screens. */

export interface Role {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  version: number;
  created_at: string;
}

export interface RouteBinding {
  id: string;
  tenant_id: string;
  role_id: string;
  role_name: string;
  label: string; // friendly "route name", e.g. "Product Edit Page"
  raw_url: string;
  canonical_key: string;
  host: string;
  resource_path: string;
  action: string;
  created_by?: string;
  created_at: string;
}

/** Returned as the body of a 409 when an equivalent route already exists. */
export interface RouteConflict {
  code: "ROUTE_ALREADY_BOUND";
  message: string;
  match: "equivalent" | "exact";
  existing: RouteBinding;
  attempted_url: string;
  canonical_key: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable?: boolean;
}

export type CreateRoleInput = { name: string; description: string };
export type UpdateRoleInput = { name?: string; description?: string };
export type CreateBindingInput = { role_name: string; url: string; label?: string };
export type UpdateBindingInput = { role_name?: string; url?: string; label?: string };
