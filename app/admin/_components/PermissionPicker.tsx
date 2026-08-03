"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin/client";

export interface PolicyRule {
  effect: string;
  action_pattern: string;
  resource_pattern: string;
}

interface Permission {
  id: string;
  name: string;
  action: string;
  resource_pattern: string;
  group_label: string;
  description: string;
}

/**
 * Real, backend-driven permission catalog picker — replaces the old
 * hardcoded 19-module checkbox grid with the actual fine-grained actions
 * identity-tenancy enforces (GET /v1/permissions), grouped and labeled.
 *
 * PUT .../permissions fully replaces the rule set on save, so any rule that
 * doesn't match a known catalog action (e.g. a pre-existing "*" or an old
 * "<domain>:*" grant from before this picker existed) is preserved untouched
 * and re-emitted alongside the catalog-derived rules — never silently dropped.
 */
export function PermissionPicker({ rules, onChange }: { rules: PolicyRule[]; onChange: (rules: PolicyRule[]) => void }) {
  const q = useQuery({
    queryKey: ["identity", "permissions"],
    queryFn: () => api.get<{ permissions?: Permission[] }>("identity", "/v1/permissions"),
  });
  const catalog = q.data?.permissions ?? [];

  const allowRules = rules.filter((r) => r.effect?.toLowerCase() === "allow");
  const checkedActions = new Set(
    allowRules
      .filter((r) => r.action_pattern === "*" || catalog.some((p) => p.action === r.action_pattern))
      .flatMap((r) => (r.action_pattern === "*" ? catalog.map((p) => p.action) : [r.action_pattern])),
  );
  const legacyRules = allowRules.filter((r) => r.action_pattern !== "*" && !catalog.some((p) => p.action === r.action_pattern));

  const toggle = (permission: Permission) => {
    const next = new Set(checkedActions);
    if (next.has(permission.action)) next.delete(permission.action); else next.add(permission.action);
    onChange([
      ...legacyRules,
      ...catalog.filter((p) => next.has(p.action)).map((p) => ({ effect: "allow", action_pattern: p.action, resource_pattern: p.resource_pattern })),
    ]);
  };

  if (q.isLoading) return <div style={{ fontSize: 13, color: "var(--ax-text-faint)" }}>Loading permissions…</div>;
  if (q.isError) return <div style={{ fontSize: 13, color: "var(--ax-red)" }}>Failed to load the permission catalog.</div>;

  const groups = new Map<string, Permission[]>();
  for (const p of catalog) {
    if (!groups.has(p.group_label)) groups.set(p.group_label, []);
    groups.get(p.group_label)!.push(p);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[...groups.entries()].map(([group, perms]) => (
        <details key={group} open style={{ border: "1px solid var(--ax-border)", borderRadius: "var(--ax-radius-sm)" }}>
          <summary style={{
            cursor: "pointer", padding: "8px 12px", fontSize: 12, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.05em", color: "var(--ax-text-dim)", background: "var(--ax-bg-overlay)",
          }}>
            {group}
          </summary>
          <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            {perms.map((p) => (
              <label key={p.action} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" style={{ marginTop: 2 }} checked={checkedActions.has(p.action)} onChange={() => toggle(p)} />
                <span>
                  <span style={{ display: "block" }}>{p.description || p.name}</span>
                  <span className="mono" style={{ display: "block", fontSize: 11, color: "var(--ax-text-faint)" }}>{p.action}</span>
                </span>
              </label>
            ))}
          </div>
        </details>
      ))}
      {legacyRules.length > 0 && (
        <p style={{ fontSize: 11.5, color: "var(--ax-text-faint)" }}>
          {legacyRules.length} additional grant{legacyRules.length > 1 ? "s" : ""} not shown above (
          {legacyRules.map((r) => r.action_pattern).join(", ")}) will be kept as-is on save.
        </p>
      )}
    </div>
  );
}
