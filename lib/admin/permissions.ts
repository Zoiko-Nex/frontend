"use client";

/**
 * Permission-aware UI support. Backed by `GET /v1/me` on identity-tenancy,
 * which resolves the caller's roles AND the actual policy rules bound to
 * them (directly or via group membership) — see
 * internal/usecase/authorization/authorization.go GetEffectivePermissions.
 *
 * Two tiers of access, matching the backend's own RequireScope logic
 * (internal/delivery/http/middleware.go):
 *   1. `role_tenant_admin` / `role_platform_admin` — full bypass, sees everything.
 *   2. Everyone else — gated per-domain by whether any ALLOW policy rule's
 *      action_pattern is "*" or starts with "<domain>:".
 *
 * Action strings follow "domain:subdomain:action" (e.g. "billing:invoice:read").
 * The identity-tenancy domain's own seeded actions predate this per-domain nav
 * convention and use a "tenant:" prefix (e.g. "tenant:user:create") — treated
 * as equivalent to "identity:" here for backward compatibility.
 */

import { api } from "./client";

export interface PolicyRule {
  effect: string;
  action_pattern: string;
  resource_pattern: string;
}

export interface Me {
  user_id: string;
  email: string;
  tenant_id: string;
  brand_id?: string;
  roles: string[];
  is_platform_admin: boolean;
  permissions: PolicyRule[];
}

const FULL_ACCESS_ROLES = new Set(["role_tenant_admin", "role_platform_admin"]);

export function fetchMe(): Promise<Me> {
  return api.get<Me>("identity", "/v1/me");
}

export function hasFullAccess(me: Me | undefined | null): boolean {
  if (!me) return false;
  return me.is_platform_admin || me.roles.some((r) => FULL_ACCESS_ROLES.has(r));
}

/** Domain aliases for action-prefix matching (see module docstring). */
const DOMAIN_ALIASES: Record<string, string[]> = {
  identity: ["identity", "tenant"],
};

export function canAccessDomain(domain: string, me: Me | undefined | null): boolean {
  if (domain === "overview") return true;
  if (!me) return false;
  if (hasFullAccess(me)) return true;

  const prefixes = DOMAIN_ALIASES[domain] ?? [domain];
  return me.permissions.some((rule) => {
    if (rule.effect?.toLowerCase() !== "allow") return false;
    if (rule.action_pattern === "*") return true;
    return prefixes.some((p) => rule.action_pattern.startsWith(`${p}:`));
  });
}
