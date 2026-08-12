"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/admin/session";
import { fetchMe, canAccessDomain, hasFullAccess, type Me } from "@/lib/admin/permissions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { PermissionPicker, type PolicyRule } from "../components/admin/PermissionPicker";
import { buildInvite, generatePassword } from "../components/admin/invite";
import IntegrationTab from "./IntegrationTab";

interface TenantRole { role_id?: string; id?: string; name?: string; description?: string; }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Maps this dashboard's own service-card ids and sidebar tabs to the real
// backend domain vocabulary (ServiceKey in lib/admin/services.ts) so a
// non-admin role's granted permissions (from GET /v1/me) can gate them.
// NOT the same as the dead, differently-named `serviceMapping` further down
// this file (used only for backend proxy port lookups) -- that one doesn't
// match SERVICES/NAV domain keys and isn't a permission map.
const SERVICE_DOMAIN: Record<string, string> = {
  "prod-catalog": "catalogue",
  "rt-charging": "rating",
  "rating-engine": "rating",
  "billing-invoice": "billing",
  "payments-collections": "payments",
  "partner-settlement": "partner",
  "cust-lifecycle": "customer",
  "notifications-campaigns": "integration",
  "esim-sim-mgmt": "order",
  "iot-connectivity": "order",
  "number-inventory": "order",
  "taxation-regulatory": "tax",
  "compliance-kyc": "kyc",
  "evidence-ledger": "evidence",
  "ai-gov-controls": "reporting",
  "analytics-reporting": "reporting",
  "mediation-usage": "usage",
  "api-gateway": "integration",
};

// Only tabs that map cleanly to one gated domain get whole-tab locking;
// Dashboard/Services/Deployment/Sandbox/Documentation/Support stay visible
// to everyone (Services is gated per-card instead, via SERVICE_DOMAIN).
const TAB_DOMAIN: Record<string, string> = {
  Trust: "evidence",
  Billing: "billing",
  Integration: "integration",
  Settings: "identity",
};

function LockedPanel({ label }: { label: string }) {
  return (
    <div className="self-stretch flex flex-col items-center justify-center gap-3 w-full py-24 bg-white rounded-2xl border border-slate-200">
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </div>
      <div className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans']">Access blocked</div>
      <div className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] text-center max-w-[360px]">
        Your role doesn&apos;t grant access to {label}. Request access from your company admin.
      </div>
    </div>
  );
}

interface Brand { id: string; name: string; code_name: string; created_at: string }

/**
 * Lets a multi-brand tenant (e.g. "VI Group") add every brand it operates
 * under this one account (Vodafone, Idea, Vi, ...) -- backed by the new
 * POST/GET /v1/brands endpoints (tenant-scoped via X-Tenant-ID, deliberately
 * NOT under /v1/tenants/{id}/* which is reserved for platform-admin-only
 * operations). Previously there was no way to add a brand after tenant
 * creation at all.
 */
function BrandsPanel() {
  const qc = useQueryClient();
  const brandsQ = useQuery({
    queryKey: ["dash", "brands"],
    queryFn: () => api.get<{ brands?: Brand[] }>("identity", "/v1/brands"),
  });
  const brands = brandsQ.data?.brands ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code_name: "" });
  const createBrand = useMutation({
    mutationFn: () => api.post("identity", "/v1/brands", form),
    onSuccess: () => {
      toast.success("Brand added");
      setCreateOpen(false);
      setForm({ name: "", code_name: "" });
      qc.invalidateQueries({ queryKey: ["dash", "brands"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to add brand"),
  });

  return (
    <>
      <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm mt-2">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Brands</h3>
            <p className="text-slate-500 text-xs mt-0.5">Every brand your company operates under this account (e.g. Vodafone, Idea, Vi).</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + New brand
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">BRAND</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CODE</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ADDED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {brandsQ.isLoading ? (
                <tr><td colSpan={3} className="px-6 py-6 text-xs text-slate-400">Loading brands…</td></tr>
              ) : brandsQ.isError ? (
                <tr><td colSpan={3} className="px-6 py-6 text-xs text-rose-500">Failed to load brands.</td></tr>
              ) : brands.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-6 text-xs text-slate-400">No additional brands yet — add one to run more than one storefront/brand under this account.</td></tr>
              ) : brands.map((b) => (
                <tr key={b.id}>
                  <td className="px-6 py-4 font-bold text-slate-800 text-xs">{b.name}</td>
                  <td className="px-6 py-4 text-xs font-mono">{b.code_name}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">New brand</h2>
              <button onClick={() => setCreateOpen(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold">Brand name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Idea"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold">Code name</label>
                <input
                  value={form.code_name}
                  onChange={(e) => setForm({ ...form, code_name: e.target.value.toLowerCase() })}
                  placeholder="idea"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm font-mono"
                />
                <span className="text-slate-400 text-xs">Lowercase letters, numbers and hyphens only.</span>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setCreateOpen(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-sm cursor-pointer shadow-sm">Cancel</button>
              <button
                onClick={() => createBrand.mutate()}
                disabled={createBrand.isPending || !form.name.trim() || !form.code_name.trim()}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {createBrand.isPending ? "Adding…" : "Add brand"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Real role management, ported from app/admin/identity's RolesTab +
 * RoleManageModal into this page's Tailwind visual language. This is now
 * where the tenant admin creates custom roles (e.g. "payment_operator"),
 * grants them real fine-grained permissions via PermissionPicker, and
 * assigns people to them -- /admin/identity remains a separate demo tool,
 * not the source of truth for this flow anymore.
 */
function RolesPanel({ tenantUsers, usersLoading, usersError }: { tenantUsers: any[]; usersLoading: boolean; usersError?: string | null }) {
  const qc = useQueryClient();

  const rolesQ = useQuery({
    queryKey: ["dash", "roles"],
    queryFn: () => api.get<{ roles?: TenantRole[] }>("identity", "/v1/roles"),
  });
  const roles = rolesQ.data?.roles ?? [];
  const roleIds = roles.map((r) => (r.role_id || r.id)!);

  const membersQ = useQuery({
    queryKey: ["dash", "role-members", roleIds.join(",")],
    queryFn: async () => {
      const entries = await Promise.all(
        roleIds.map(async (id) => {
          const res = await api.get<{ user_ids?: string[] }>("identity", `/v1/roles/${id}/members`);
          return [id, res.user_ids ?? []] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, string[]>;
    },
    enabled: roleIds.length > 0,
  });
  const roleMembers = membersQ.data ?? {};
  const rolesForUser = (userId: string) => roles.filter((r) => (roleMembers[(r.role_id || r.id)!] ?? []).includes(userId));

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const createRole = useMutation({
    mutationFn: () => api.post("identity", "/v1/roles", createForm),
    onSuccess: () => {
      toast.success("Role created");
      setCreateOpen(false);
      setCreateForm({ name: "", description: "" });
      qc.invalidateQueries({ queryKey: ["dash", "roles"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create role"),
  });

  const [managingRole, setManagingRole] = useState<TenantRole | null>(null);
  const [assigningUser, setAssigningUser] = useState<any | null>(null);

  return (
    <>
      {/* Roles card */}
      <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm mt-2">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Roles</h3>
            <p className="text-slate-500 text-xs mt-0.5">Create a role, pick its permissions, then assign people to it.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + New role
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ROLE</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DESCRIPTION</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MEMBERS</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {rolesQ.isLoading ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-slate-400">Loading roles…</td></tr>
              ) : rolesQ.isError ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-rose-500">Failed to load roles.</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-slate-400">No custom roles yet — create one to start assigning fine-grained access.</td></tr>
              ) : roles.map((r) => {
                const id = (r.role_id || r.id)!;
                return (
                  <tr key={id}>
                    <td className="px-6 py-4 font-bold text-slate-800 text-xs">{r.name}</td>
                    <td className="px-6 py-4 text-xs">{r.description || "—"}</td>
                    <td className="px-6 py-4 text-xs">{(roleMembers[id] ?? []).length}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setManagingRole(r)}
                        className="px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users & roles card */}
      <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm mt-2">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Users & roles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">USER</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ROLE</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {usersLoading ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-slate-400">Loading…</td></tr>
              ) : usersError ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-rose-500">{usersError}</td></tr>
              ) : tenantUsers.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-6 text-xs text-slate-400">No users yet.</td></tr>
              ) : tenantUsers.map((user) => {
                const userRoles = rolesForUser(user.id);
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-700 to-lime-600 flex items-center justify-center text-white text-xs font-bold">{user.initials}</div>
                      <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">{user.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {userRoles.length === 0 ? (
                        <span className="text-slate-400 text-xs">No role</span>
                      ) : userRoles.map((r) => (
                        <span key={r.role_id || r.id} className="px-2 py-1 bg-slate-50 rounded text-slate-600 border border-slate-200 text-[10px] font-semibold font-['IBM_Plex_Mono'] mr-1">{r.name}</span>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      {user.status === "ACTIVE" ? (
                        <span className="px-2 py-1 bg-stone-100 rounded text-lime-600 border border-lime-300 text-[10px] font-bold font-mono inline-flex items-center gap-1 uppercase">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-indigo-50 rounded text-indigo-500 border border-indigo-200 text-[10px] font-bold font-mono uppercase inline-flex items-center gap-1">{user.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setAssigningUser(user)}
                        className="px-3 py-1.5 bg-slate-50 rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <CreateRoleModal
          form={createForm}
          setForm={setCreateForm}
          onClose={() => setCreateOpen(false)}
          onSubmit={() => createRole.mutate()}
          loading={createRole.isPending}
        />
      )}
      {managingRole && <RoleManageModal role={managingRole} onClose={() => setManagingRole(null)} />}
      {assigningUser && (
        <AssignRoleModal
          user={assigningUser}
          roles={roles}
          assignedRoleIds={roleIds.filter((id) => (roleMembers[id] ?? []).includes(assigningUser.id))}
          onClose={() => setAssigningUser(null)}
        />
      )}
    </>
  );
}

function CreateRoleModal({ form, setForm, onClose, onSubmit, loading }: {
  form: { name: string; description: string };
  setForm: (f: { name: string; description: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">New role</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="payment_operator"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
            />
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-sm cursor-pointer shadow-sm">Cancel</button>
          <button
            onClick={onSubmit}
            disabled={loading || !form.name.trim()}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleManageModal({ role, onClose }: { role: TenantRole; onClose: () => void }) {
  const qc = useQueryClient();
  const roleId = (role.role_id || role.id)!;

  const permsQ = useQuery({
    queryKey: ["dash", "roles", roleId, "permissions"],
    queryFn: () => api.get<{ rules?: PolicyRule[] }>("identity", `/v1/roles/${roleId}/permissions`),
  });
  const membersQ = useQuery({
    queryKey: ["dash", "roles", roleId, "members"],
    queryFn: () => api.get<{ user_ids?: string[] }>("identity", `/v1/roles/${roleId}/members`),
  });
  const usersQ = useQuery({
    queryKey: ["dash", "identity-users"],
    queryFn: () => api.get<{ users?: any[] }>("identity", "/v1/users"),
  });
  const users = usersQ.data?.users ?? [];
  const emailFor = (userId: string) => users.find((u) => (u.user_id || u.id) === userId)?.email || userId;

  const [draftRules, setDraftRules] = useState<PolicyRule[] | null>(null);
  const currentRules = draftRules ?? permsQ.data?.rules ?? [];

  const savePermissions = useMutation({
    mutationFn: () => api.put("identity", `/v1/roles/${roleId}/permissions`, { rules: currentRules }),
    onSuccess: () => {
      toast.success("Permissions saved");
      qc.invalidateQueries({ queryKey: ["dash", "roles", roleId, "permissions"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to save permissions"),
  });

  const [assignId, setAssignId] = useState("");
  const assign = useMutation({
    mutationFn: () => api.post("identity", `/v1/roles/${roleId}/members`, { user_id: assignId }),
    onSuccess: () => {
      toast.success("User assigned");
      setAssignId("");
      qc.invalidateQueries({ queryKey: ["dash", "roles", roleId, "members"] });
      qc.invalidateQueries({ queryKey: ["dash", "role-members"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to assign user"),
  });
  const unassign = useMutation({
    mutationFn: (userId: string) => api.del("identity", `/v1/roles/${roleId}/members/${userId}`),
    onSuccess: () => {
      toast.success("User removed");
      qc.invalidateQueries({ queryKey: ["dash", "roles", roleId, "members"] });
      qc.invalidateQueries({ queryKey: ["dash", "role-members"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to remove user"),
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[600px] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Manage &quot;{role.name}&quot;</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-2.5">Dashboard access</div>
            {permsQ.isLoading ? (
              <div className="text-slate-400 text-sm">Loading…</div>
            ) : (
              <PermissionPicker rules={currentRules} onChange={setDraftRules} />
            )}
          </div>

          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-2.5">Assigned users</div>
            {membersQ.isLoading ? (
              <div className="text-slate-400 text-sm">Loading…</div>
            ) : (
              <div className="flex flex-col gap-1.5 mb-3">
                {(membersQ.data?.user_ids ?? []).length === 0 ? (
                  <div className="text-slate-400 text-xs">No users assigned yet.</div>
                ) : membersQ.data!.user_ids!.map((userId) => (
                  <div key={userId} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-700 text-xs">{emailFor(userId)}</span>
                    <button onClick={() => unassign.mutate(userId)} disabled={unassign.isPending} className="text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer">Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <select
                value={assignId}
                onChange={(e) => setAssignId(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs outline-none focus:border-sky-500"
              >
                <option value="">Select a user to assign…</option>
                {users.map((u) => {
                  const id = u.user_id || u.id;
                  return <option key={id} value={id}>{u.email || id}</option>;
                })}
              </select>
              <button
                onClick={() => assign.mutate()}
                disabled={!assignId || assign.isPending}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition disabled:opacity-60 cursor-pointer"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-sm cursor-pointer shadow-sm">Close</button>
          <button
            onClick={() => savePermissions.mutate()}
            disabled={savePermissions.isPending}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
          >
            {savePermissions.isPending ? "Saving…" : "Save permissions"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AssignRoleModal({ user, roles, assignedRoleIds, onClose }: {
  user: any;
  roles: TenantRole[];
  assignedRoleIds: string[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string[]>(assignedRoleIds);

  const save = useMutation({
    mutationFn: async () => {
      // role_members.user_id is a UUID column, so anything else (an email from a
      // half-populated users table, say) fails deep in the DB as a 500.
      if (!UUID_RE.test(String(user.id))) {
        throw new ApiException(400, {
          code: "INVALID_USER",
          message: "This row has no backend user id yet — reload the users list and try again.",
        });
      }
      const toAdd = selected.filter((id) => !assignedRoleIds.includes(id));
      const toRemove = assignedRoleIds.filter((id) => !selected.includes(id));
      await Promise.all([
        ...toAdd.map((roleId) => api.post("identity", `/v1/roles/${roleId}/members`, { user_id: user.id })),
        ...toRemove.map((roleId) => api.del("identity", `/v1/roles/${roleId}/members/${user.id}`)),
      ]);
    },
    onSuccess: () => {
      toast.success("Roles updated");
      qc.invalidateQueries({ queryKey: ["dash", "role-members"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to update roles"),
  });

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[440px] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Roles for {user.name}</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
          {roles.length === 0 ? (
            <div className="text-slate-400 text-sm">No roles exist yet — create one first.</div>
          ) : roles.map((r) => {
            const id = (r.role_id || r.id)!;
            return (
              <label key={id} className="flex items-center gap-2.5 text-sm cursor-pointer py-1">
                <input type="checkbox" checked={selected.includes(id)} onChange={() => toggle(id)} />
                <span className="text-slate-700 font-medium">{r.name}</span>
              </label>
            );
          })}
        </div>
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-sm cursor-pointer shadow-sm">Cancel</button>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DomainService {
  id: string;
  name: string;
  version: string;
  description: string;
  badges: string[];
  active: boolean;
  iconPath: string;
}

const trustDocuments = [
  { name: "MSA preview", category: "Legal", version: "2.1", status: "APPROVED" },
  { name: "Data Processing Addendum", category: "Legal", version: "1.4", status: "APPROVED" },
  { name: "Security overview", category: "Security", version: "3.0", status: "APPROVED" },
  { name: "Penetration test summary", category: "Security", version: "2026-Q1", status: "RESTRICTED" },
  { name: "Data residency overview", category: "Compliance", version: "1.2", status: "APPROVED" },
  { name: "AI governance overview", category: "Governance", version: "1.1", status: "REQUESTED" },
  { name: "SOC 2 report", category: "Compliance", version: "2026", status: "RESTRICTED" },
];

const docGuides = [
  { title: "Getting started", category: "PLATFORM", desc: "Overview & first steps" },
  { title: "Real-time charging", category: "MONETIZATION", desc: "Charging concepts & APIs" },
  { title: "Billing & invoicing", category: "MONETIZATION", desc: "Bill cycles & templates" },
  { title: "Taxation guide", category: "COMPLIANCE", desc: "Jurisdiction tax logic" },
  { title: "eSIM / RSP integration", category: "CONNECTIVITY", desc: "Profiles & sync" },
  { title: "API reference", category: "PLATFORM", desc: "Auth, endpoints, limits" },
  { title: "Webhooks", category: "PLATFORM", desc: "Events & retries" },
  { title: "Evidence ledger", category: "COMPLIANCE", desc: "Verification & exports" },
  { title: "AI governance", category: "INTELLIGENCE", desc: "Control tiers & approvals" },
];

export default function DashboardsPage() {
  const router = useRouter();
  const [sessionData, setSessionData] = useState<{ email?: string; tenantId?: string }>({});
  const [onlineCount, setOnlineCount] = useState(18);
  const [logs, setLogs] = useState<string[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);

  // While /v1/me hasn't resolved yet, treat everything as accessible so
  // nothing flickers locked-then-unlocked on first paint. A tenant admin or
  // platform admin (hasFullAccess) always sees everything; anyone else is
  // gated per-domain against their actual granted permissions.
  const canAccess = (domain?: string) =>
    !domain || !meLoaded || hasFullAccess(me) || canAccessDomain(domain, me);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  // Modal states for API client
  const [selectedService, setSelectedService] = useState<DomainService | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [requestPath, setRequestPath] = useState<string>("");
  const [requestMethod, setRequestMethod] = useState<string>("GET");
  const [requestHeaders, setRequestHeaders] = useState<string>("");
  const [requestBody, setRequestBody] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // Active Console View state (Tenant Admin, Super Admin, Customer Self-Service)
  const [currentConsole, setCurrentConsole] = useState<"tenant-admin" | "super-admin" | "customer-portal">("tenant-admin");

  // Active Tab state
  const [currentTab, setCurrentTab] = useState<string>("Services");

  // ── Navbar dynamic states ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [tenantInfoOpen, setTenantInfoOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const tenantRef = useRef<HTMLDivElement>(null);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  // Real policy rules from the backend permission catalog (GET /v1/permissions),
  // which is what POST /v1/users actually accepts as `rules`. The old 18
  // free-text checkbox labels were sent as `access_domains` -- a field no
  // endpoint has ever read.
  const [inviteRules, setInviteRules] = useState<PolicyRule[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createdUserDetails, setCreatedUserDetails] = useState<{
    email: string;
    password: string;
    tenantId: string;
  } | null>(null);

  const [tenantUsers, setTenantUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // GET /v1/users is tenant-scoped and requires a Bearer token
  // (authTenantChain + "tenant:user:read"). It must go through the api client,
  // which attaches the session token and X-Tenant-ID and throws on a non-2xx --
  // a raw fetch to /api/proxy sends no Authorization header and, because the
  // proxy always answers HTTP 200 wrapping {status, ok, data}, a bare `res.ok`
  // check reads a backend 401 as success.
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      // Backend returns {users: [{user_id, email, full_name, status, created_at}]} --
      // NOT {items: [...]} with roles/access_domains/is_active, which never existed
      // on this response and meant this table always rendered "User"/"None"/"INVITED".
      const data = await api.get<{ users?: any[] }>("identity", "/v1/users");
      const fetchedUsers = (data.users ?? [])
        // user_id is the only usable identity here: role membership is keyed on
        // a UUID (authorization.role_members.user_id), so a row without one
        // cannot be assigned a role and must not reach the table.
        .filter((u: any) => u.user_id)
        .map((u: any) => {
          const initials = u.full_name ? u.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "U";
          return {
            id: u.user_id,
            initials,
            name: u.full_name || u.email,
            email: u.email,
            status: (u.status || "invited").toUpperCase(),
          };
        });
      setTenantUsers(fetchedUsers);
    } catch (err) {
      console.warn("Failed to fetch users:", err);
      setUsersError(err instanceof ApiException ? err.message : "Failed to load users — check your connection and try again.");
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const closeInviteModal = () => {
    setInviteModalOpen(false);
    setInviteEmail("");
    setInviteName("");
    setInvitePassword("");
    setInviteRules([]);
  };

  /**
   * POST /v1/users (identity-tenancy OnboardUser). The backend requires
   * email + full_name + brand_id + password (>= 12 chars) and optional `rules`;
   * it is behind authTenantChain, so the call must carry the session Bearer
   * token. Going through the api client means a rejection throws instead of
   * being mistaken for success -- previously any backend error still showed the
   * "User created" modal and printed credentials for an account that did not
   * exist, which is exactly why those invitees could never sign in.
   */
  const handleCreateUser = async () => {
    if (!inviteEmail || !inviteName || !invitePassword) {
      toast.error("Please fill in email, name, and generate a password");
      return;
    }
    if (invitePassword.length < 12) {
      toast.error("Temporary password must be at least 12 characters");
      return;
    }

    const brandId = me?.brand_id || getSession()?.brandId;
    if (!brandId) {
      toast.error("No brand is associated with your session — sign out and back in, then try again.");
      return;
    }

    setIsCreatingUser(true);
    try {
      await api.post("identity", "/v1/users", {
        email: inviteEmail,
        full_name: inviteName,
        brand_id: brandId,
        password: invitePassword,
        rules: inviteRules,
      });

      setCreatedUserDetails({
        email: inviteEmail,
        password: invitePassword,
        tenantId: sessionData.tenantId || "",
      });
      closeInviteModal();
      // Re-read from the backend rather than appending a synthetic row: role
      // assignment needs the server-generated user_id (a UUID).
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof ApiException ? err.message : "Error creating user: " + String(err));
    } finally {
      setIsCreatingUser(false);
    }
  };

  const [notifications] = useState([
    { id: 1, type: "alert", title: "CDR ingestion spike detected", time: "2m ago", read: false },
    { id: 2, type: "success", title: "Billing cycle completed", time: "18m ago", read: false },
    { id: 3, type: "warning", title: "API rate limit at 85%", time: "1h ago", read: false },
    { id: 4, type: "info", title: "New SDK version v4.2.1 available", time: "3h ago", read: true },
    { id: 5, type: "success", title: "eSIM provisioning batch done", time: "5h ago", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Searchable items from sidebar + services
  const searchableItems = [
    { label: "Dashboard", tabKey: "Dashboard", category: "Navigation" },
    { label: "Services", tabKey: "Services", category: "Navigation" },
    { label: "Deployment", tabKey: "Deployment", category: "Navigation" },
    { label: "Sandbox / POC", tabKey: "Sandbox", category: "Navigation" },
    { label: "Trust Vault", tabKey: "Trust", category: "Navigation" },
    { label: "Documentation", tabKey: "Documentation", category: "Navigation" },
    { label: "Support & Success", tabKey: "Support", category: "Navigation" },
    { label: "Billing & Commercials", tabKey: "Billing", category: "Navigation" },
    { label: "Integrations", tabKey: "Integration", category: "Navigation" },
    { label: "Admin Settings", tabKey: "Settings", category: "Navigation" },
    { label: "Product Catalog", tabKey: "Services", category: "Service" },
    { label: "Real-Time Charging", tabKey: "Services", category: "Service" },
    { label: "Billing & Invoice", tabKey: "Services", category: "Service" },
    { label: "eSIM / SIM Management", tabKey: "Services", category: "Service" },
    { label: "Evidence Ledger", tabKey: "Services", category: "Service" },
    { label: "API Gateway", tabKey: "Services", category: "Service" },
  ];

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8)
    : [];

  // Close all navbar dropdowns on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const t = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(t)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(t)) setNotificationsOpen(false);
      if (helpRef.current && !helpRef.current.contains(t)) setHelpOpen(false);
      if (userRef.current && !userRef.current.contains(t)) setUserMenuOpen(false);
      if (tenantRef.current && !tenantRef.current.contains(t)) setTenantInfoOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchFocused(true);
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setNotificationsOpen(false);
        setHelpOpen(false);
        setUserMenuOpen(false);
        setTenantInfoOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Customer Self-Service Portal states
  const [custPortalCustomerId, setCustPortalCustomerId] = useState("1f211ae1-b736-43d2-86ff-08463bd7be36");
  const [custPortalAccountId, setCustPortalAccountId] = useState("393d645f-07ca-460c-93f1-939a7676bbe3");
  const [orderOfferId, setOrderOfferId] = useState("a0000002-0000-4000-8000-000000000002");
  const [orderProductId, setOrderProductId] = useState("a0000001-0000-4000-8000-000000000001");
  const [prepaidBalance, setPrepaidBalance] = useState(15.00);
  const [portalInvoices, setPortalInvoices] = useState<any[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalMessage, setPortalMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchPortalInvoices = async (accountId: string) => {
    if (!accountId) return;
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: 8092,
          method: "GET",
          path: `/v1/invoices?limit=20`,
          headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" }
        })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.status === 200 && result.data && result.data.items) {
          const filtered = result.data.items.filter((inv: any) => inv.account_id === accountId);
          setPortalInvoices(filtered);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch portal invoices:", err);
    }
  };

  useEffect(() => {
    if (currentConsole === "customer-portal" && custPortalAccountId) {
      fetchPortalInvoices(custPortalAccountId);
    }
  }, [currentConsole, custPortalAccountId]);

  const handlePlaceOrder = async () => {
    setPortalLoading(true);
    setPortalMessage(null);
    try {
      // 1. Place the order
      const resOrder = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: 8083,
          method: "POST",
          path: "/v1/orders",
          headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
          body: {
            customer_id: custPortalCustomerId,
            account_id: custPortalAccountId,
            order_type: "NEW_SERVICE",
            catalog_version_id: "CATALOG-2026-Q2",
            currency_code: "USD",
            country_code: "US",
            jurisdiction_code: "US-CA"
          }
        })
      });
      const resultOrder = await resOrder.json();

      if (!resOrder.ok || resultOrder.status !== 201) {
        const errMsg = resultOrder.data?.message || resultOrder.error || "";
        const backendUnavailable = errMsg.includes("relation") || errMsg.includes("does not exist") || resultOrder.status === 422 || resultOrder.status >= 500;
        if (backendUnavailable) {
          console.warn("Order backend unavailable:", errMsg);
          setPortalMessage({
            text: `Order was NOT placed — the order-management backend is unavailable right now (${errMsg || `HTTP ${resultOrder.status}`}). Nothing was provisioned or billed.`,
            type: "error"
          });
          return;
        }
        throw new Error(errMsg || "Failed to place order.");
      }

      const orderId = resultOrder.data?.id;

      // 2. Provision eSIM profile
      const resProv = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: 8083,
          method: "POST",
          path: "/v1/provisioning",
          headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
          body: {
            order_id: orderId,
            customer_id: custPortalCustomerId,
            account_id: custPortalAccountId,
            product_id: orderProductId,
            service_type: "MOBILE_DATA",
            jurisdiction_code: "US-CA"
          }
        })
      });
      const resultProv = await resProv.json();
      if (!resProv.ok || resultProv.status !== 201) {
        throw new Error(resultProv.data?.message || resultProv.error || "Order placed, but eSIM provisioning failed.");
      }

      setPortalMessage({
        text: `Order placed successfully (ID: ${orderId})! eSIM Profile provisioned (ID: ${resultProv.data?.id || "N/A"}) and registered.`,
        type: "success"
      });
    } catch (err: any) {
      setPortalMessage({ text: err.message || "Order placement failed.", type: "error" });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleRunBilling = async () => {
    setPortalLoading(true);
    setPortalMessage(null);
    try {
      // 1. Create draft invoice
      const resDraft = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: 8092,
          method: "POST",
          path: "/v1/invoices",
          headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
          body: {
            account_id: custPortalAccountId,
            customer_id: custPortalCustomerId,
            currency_code: "USD"
          }
        })
      });
      const resultDraft = await resDraft.json();

      if (!resDraft.ok || resultDraft.status !== 201) {
        const errMsg = resultDraft.data?.message || resultDraft.error || "";
        const backendUnavailable = errMsg.includes("relation") || errMsg.includes("does not exist") || resultDraft.status === 422 || resultDraft.status >= 500;
        if (backendUnavailable) {
          console.warn("Billing backend unavailable:", errMsg);
          setPortalMessage({
            text: `Billing run did NOT succeed — the billing backend is unavailable right now (${errMsg || `HTTP ${resultDraft.status}`}). No invoice was issued.`,
            type: "error"
          });
          return;
        }
        throw new Error(errMsg || "Failed to create draft invoice.");
      }

      const invoiceId = resultDraft.data?.id;

      // 2. Issue the invoice
      const resIssue = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          port: 8092,
          method: "POST",
          path: `/v1/invoices/${invoiceId}/issue`,
          headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
          body: {}
        })
      });
      const resultIssue = await resIssue.json();
      if (!resIssue.ok || resultIssue.status !== 200) {
        throw new Error(resultIssue.data?.message || resultIssue.error || "Failed to issue the invoice.");
      }

      setPortalMessage({ text: `Billing run succeeded! Invoice issued: ${invoiceId}`, type: "success" });
      fetchPortalInvoices(custPortalAccountId);
    } catch (err: any) {
      setPortalMessage({ text: err.message || "Billing cycle execution failed.", type: "error" });
    } finally {
      setPortalLoading(false);
    }
  };

  // State-bound list of the 18 BSS/OSS domains
  const [services, setServices] = useState<DomainService[]>([
    // Monetization & Revenue
    {
      id: "prod-catalog",
      name: "Product Catalog",
      version: "MONETIZATION · V4.6",
      description: "Plans, bundles, add-ons, eligibility, and versioned offer management.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/services.svg"
    },
    {
      id: "rt-charging",
      name: "Real-Time Charging",
      version: "MONETIZATION · V4.5",
      description: "Online charging, balances, policy, and real-time authorization.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/charging-lightning.svg"
    },
    {
      id: "rating-engine",
      name: "Rating & Pricing Engine",
      version: "MONETIZATION · V4.6",
      description: "Usage rating, tiering, discounts, and real-time price calculation.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/bar-chart.svg"
    },
    {
      id: "billing-invoice",
      name: "Billing & Invoicing",
      version: "MONETIZATION · V4.6",
      description: "Bill cycles, invoicing, dunning, and statements. Template v3 available.",
      badges: ["ACTIVE", "WATCH"],
      active: true,
      iconPath: "/image/dashboard/document.svg"
    },
    {
      id: "payments-collections",
      name: "Payments & Collections",
      version: "MONETIZATION · V4.5",
      description: "Payment methods, gateways, retries, refunds, and reconciliation.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/credit-card.svg"
    },
    {
      id: "partner-settlement",
      name: "Partner & Settlement",
      version: "MONETIZATION · V4.3",
      description: "Wholesale, interconnect, revenue share, and partner settlement.",
      badges: ["PROVISIONING"],
      active: false,
      iconPath: "/image/dashboard/user-profile.svg"
    },

    // Customer & Engagement
    {
      id: "cust-lifecycle",
      name: "Customer Lifecycle",
      version: "MONETIZATION · V4.6",
      description: "Accounts, subscriptions, lifecycle states, and self-care across brands.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/user-profile.svg"
    },
    {
      id: "notifications-campaigns",
      name: "Notifications & Campaigns",
      version: "ENGAGEMENT · V4.1",
      description: "Transactional and campaign messaging across SMS, email, and push.",
      badges: ["AVAILABLE"],
      active: false,
      iconPath: "/image/dashboard/notifications-bell.svg"
    },

    // Connectivity & Provisioning
    {
      id: "esim-sim-mgmt",
      name: "eSIM & SIM Management",
      version: "CONNECTIVITY · V4.3",
      description: "GSMA-aligned eSIM profiles, RSP sync, and SIM lifecycle.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/mobile-sim.svg"
    },
    {
      id: "iot-connectivity",
      name: "IoT Connectivity",
      version: "CONNECTIVITY · V4.2",
      description: "Device fleet orchestration, usage aggregation, and remote actions.",
      badges: ["AVAILABLE"],
      active: false,
      iconPath: "/image/dashboard/settings-compass.svg"
    },
    {
      id: "number-inventory",
      name: "Number & Inventory",
      version: "CONNECTIVITY · V4.4",
      description: "Number ranges, porting, reservation, and resource inventory.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/services.svg"
    },

    // Compliance & Trust
    {
      id: "taxation-regulatory",
      name: "Taxation & Regulatory",
      version: "COMPLIANCE · V4.4",
      description: "Jurisdiction tax logic, regulatory fees, and exemptions.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/shield.svg"
    },
    {
      id: "compliance-kyc",
      name: "Compliance & KYC",
      version: "COMPLIANCE · V4.4",
      description: "Identity verification, sanctions screening, and onboarding checks.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/shield-check.svg"
    },
    {
      id: "evidence-ledger",
      name: "Evidence Ledger",
      version: "COMPLIANCE · V4.5",
      description: "Immutable evidence of charging, billing, and governance events.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/document.svg"
    },

    // Intelligence
    {
      id: "ai-gov-controls",
      name: "AI Governance & Controls",
      version: "INTELLIGENCE · V4.2",
      description: "Tiered AI controls with human approval for material actions.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/code-tags.svg"
    },
    {
      id: "analytics-reporting",
      name: "Analytics & Reporting",
      version: "INTELLIGENCE · V4.6",
      description: "Operational dashboards, revenue assurance, and exports.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/bar-chart.svg"
    },

    // Platform & Integration
    {
      id: "mediation-usage",
      name: "Mediation & Usage",
      version: "PLATFORM · V4.5",
      description: "CDR ingestion, normalization, deduplication, and enrichment.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/activity-pulse.svg"
    },
    {
      id: "api-gateway",
      name: "API Gateway & Developer",
      version: "PLATFORM · V2.0",
      description: "Authenticated APIs, rate limits, webhooks, and developer keys.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/api-braces.svg"
    }
  ]);

  // Load session context and poll backend health checks and logs
  useEffect(() => {
    const session = getSession();
    if (session && session.accessToken) {
      setSessionData({ email: session.email, tenantId: session.tenantId });
      fetchUsers();
      fetchMe()
        .then((m) => setMe(m))
        .catch(() => setMe(null))
        .finally(() => setMeLoaded(true));
    } else {
      router.replace('/login');
    }

    const serviceMapping: Record<string, string> = {
      "prod-catalog": "product-catalogue-commercial",
      "rt-charging": "rating-charging",
      "rating-engine": "rating-charging",
      "billing-invoice": "billing-invoice",
      "payments-collections": "payments",
      "partner-settlement": "partner-settlement",
      "cust-lifecycle": "customer-account",
      "notifications-campaigns": "integration-ecosystem",
      "esim-sim-mgmt": "order-management-provisioning",
      "iot-connectivity": "order-management-provisioning",
      "number-inventory": "order-management-provisioning",
      "taxation-regulatory": "tax-jurisdiction",
      "compliance-kyc": "custmr-lfc-kyc",
      "evidence-ledger": "evidence-ledger",
      "ai-gov-controls": "reporting-regulatory",
      "analytics-reporting": "reporting-regulatory",
      "mediation-usage": "usage-ingestion-mediation",
      "api-gateway": "integration-ecosystem"
    };

    const checkBackendServices = async () => {
      try {
        const healthRes = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            port: 8080,
            method: "GET",
            path: "/v1/me",
            headers: { "X-Tenant-ID": sessionData.tenantId || "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" }
          })
        });
        if (healthRes.ok) {
          const payload = await healthRes.json();
          if (payload.ok) {
            setOnlineCount(18);

            setServices((prev) =>
              prev.map((s) => {
                let nextBadges = [...s.badges];
                if (!nextBadges.includes("INTEGRATED")) nextBadges.push("INTEGRATED");
                if (!nextBadges.includes("ACTIVE")) nextBadges.push("ACTIVE");
                if (!nextBadges.includes("HEALTHY")) nextBadges.push("HEALTHY");
                nextBadges = nextBadges.filter(b => b !== "AVAILABLE" && b !== "PROVISIONING");
                
                return {
                  ...s,
                  active: true,
                  badges: Array.from(new Set(nextBadges))
                };
              })
            );
          }
        }
      } catch (err) {
        console.warn("Backend endpoints sync bypassed:", err);
      }

      try {
        const logsRes = await fetch("/api/logs");
        if (logsRes.ok) {
          const logsData = await logsRes.json() as string[];
          setLogs(logsData);
        }
      } catch (err) {
        console.warn("Backend logs fetching bypassed:", err);
      }
    };

    checkBackendServices();
    const intervalId = setInterval(checkBackendServices, 4000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper to toggle domain active state
  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextActive = !s.active;
          let nextBadges = [...s.badges].filter(b => b !== "ACTIVE" && b !== "HEALTHY" && b !== "AVAILABLE" && b !== "PROVISIONING");

          if (s.id === "partner-settlement") {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["PROVISIONING", ...nextBadges];
          } else if (s.id === "notifications-campaigns" || s.id === "iot-connectivity") {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["AVAILABLE", ...nextBadges];
          } else {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["AVAILABLE", ...nextBadges];
          }

          return {
            ...s,
            active: nextActive,
            badges: nextBadges
          };
        }
        return s;
      })
    );
  };

  // Group definitions
  const groups = [
    {
      id: "monetization",
      title: "Monetization & Revenue",
      description: "Catalog, charging, rating, billing, payments, and settlement.",
      serviceIds: ["prod-catalog", "rt-charging", "rating-engine", "billing-invoice", "payments-collections", "partner-settlement"]
    },
    {
      id: "customer",
      title: "Customer & Engagement",
      description: "Lifecycle management and customer communications.",
      serviceIds: ["cust-lifecycle", "notifications-campaigns"]
    },
    {
      id: "connectivity",
      title: "Connectivity & Provisioning",
      description: "SIM/eSIM, IoT fleets, and number inventory.",
      serviceIds: ["esim-sim-mgmt", "iot-connectivity", "number-inventory"]
    },
    {
      id: "compliance",
      title: "Compliance & Trust",
      description: "Tax, KYC, and evidence-grade governance.",
      serviceIds: ["taxation-regulatory", "compliance-kyc", "evidence-ledger"]
    },
    {
      id: "intelligence",
      title: "Intelligence",
      description: "Governed AI and analytics.",
      serviceIds: ["ai-gov-controls", "analytics-reporting"]
    },
    {
      id: "platform",
      title: "Platform & Integration",
      description: "Mediation pipeline and the API gateway.",
      serviceIds: ["mediation-usage", "api-gateway"]
    }
  ];

  // Sidebar items config
  const sidebarItems = [
    {
      section: "WORKSPACE", items: [
        { label: "Dashboard", tabKey: "Dashboard", iconPath: "/image/dashboard/dashboard-grid.svg" },
        { label: "Services", tabKey: "Services", iconPath: "/image/dashboard/services.svg", badge: "18" },
        { label: "Deployment", tabKey: "Deployment", iconPath: "/image/dashboard/checkbox-list.svg" }
      ]
    },
    {
      section: "EVALUATE & TRUST", items: [
        { label: "Sandbox / POC", tabKey: "Sandbox", iconPath: "/image/dashboard/code-tags.svg" },
        { label: "Trust Vault", tabKey: "Trust", iconPath: "/image/dashboard/shield.svg" },
        { label: "Documentation", tabKey: "Documentation", iconPath: "/image/dashboard/document.svg" }
      ]
    },
    {
      section: "OPERATE", items: [
        { label: "Support & Success", tabKey: "Support", iconPath: "/image/dashboard/sidebar-notification.svg" },
        { label: "Billing & Commercials", tabKey: "Billing", iconPath: "/image/dashboard/credit-card.svg" },
        { label: "Integrations", tabKey: "Integration", iconPath: "/image/dashboard/api-braces.svg" },
        { label: "Admin Settings", tabKey: "Settings", iconPath: "/image/dashboard/settings-gear.svg" }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen flex flex-col justify-start items-start font-sans">

      {/* ═══ Top Header Navbar ═══ */}
      <div className="w-full h-14 px-4 bg-sky-950 border-b-[0.80px] border-white/5 flex justify-between items-center shrink-0 z-50">

        {/* Left Side: Logo & Context Pills */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <Link href="/dashboards" className="w-60 flex justify-start items-center hover:opacity-90 transition-opacity">
            <img src="/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png" alt="ZoikoNex Logo" className="h-8 object-contain" />
          </Link>

          {/* Context Pills */}
          <div className="flex items-center gap-4">
            {/* Tenant Info Pill */}
            <div className="relative" ref={tenantRef}>
              <button
                onClick={() => { setTenantInfoOpen(!tenantInfoOpen); setNotificationsOpen(false); setHelpOpen(false); setUserMenuOpen(false); }}
                className={`h-10 px-3 py-1.5 rounded-[10px] outline outline-1 flex items-center gap-2 cursor-pointer transition-all duration-200 ${tenantInfoOpen
                  ? "bg-white/20 outline-white/40 ring-1 ring-sky-400/40"
                  : "bg-white/10 outline-white/20 hover:bg-white/20"
                  }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <div className="text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">
                  Helios Mobile {sessionData.tenantId && `(${sessionData.tenantId.substring(0, 6)})`}
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`text-slate-400 transition-transform duration-200 ${tenantInfoOpen ? "rotate-180" : ""}`} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>

              {/* Tenant Info Dropdown */}
              {tenantInfoOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-[#0c1f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-[fadeSlideIn_0.15s_ease-out]">
                  <div className="p-4 border-b border-white/10">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2">Active Tenant</div>
                    <div className="text-white text-sm font-bold">Helios Mobile</div>
                    <div className="text-slate-400 text-[11px] font-mono mt-1">{sessionData.tenantId || "1a2b3c"}</div>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <span className="text-slate-300 text-xs">Region</span>
                      <span className="text-white text-xs font-medium">US-West-2</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <span className="text-slate-300 text-xs">Plan</span>
                      <span className="text-lime-300 text-xs font-semibold">Enterprise</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <span className="text-slate-300 text-xs">Services</span>
                      <span className="text-white text-xs font-medium">{onlineCount}/18 online</span>
                    </div>
                  </div>
                  <div className="p-3 border-t border-white/10">
                    <button onClick={() => { setCurrentTab("Settings"); setTenantInfoOpen(false); }} className="w-full text-center text-xs text-sky-400 font-semibold hover:text-sky-300 transition py-1 cursor-pointer">Manage Tenant Settings →</button>
                  </div>
                </div>
              )}
            </div>

            {/* Environment Badge */}
            <div className="h-10 px-4 py-2.5 bg-lime-500/20 rounded-[10px] outline outline-1 outline-lime-500/40 flex items-center gap-2 cursor-default" title="Environment: Production">
              <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm animate-pulse"></div>
              <div className="text-lime-200 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-3 tracking-wide">PRODUCTION</div>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-lg mx-4 relative" ref={searchRef}>
          <div className={`w-full px-4 py-2 rounded-[10px] outline outline-1 flex items-center gap-2 transition-all duration-200 ${searchFocused
            ? "bg-white/20 outline-sky-400/50 ring-1 ring-sky-400/30"
            : "bg-white/10 outline-white/20 hover:bg-white/15"
            }`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`transition-colors duration-200 ${searchFocused ? "text-sky-300" : "text-slate-400"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search services, docs, settings…"
              className="bg-transparent text-white text-xs font-normal font-['Plus_Jakarta_Sans'] flex-1 outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} aria-label="Clear search" className="text-slate-400 hover:text-white transition cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
            {!searchFocused && (
              <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono border border-white/10 rounded px-1.5 py-0.5">⌘K</div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchFocused && (searchQuery.trim() ? filteredSearch.length > 0 : true) && (
            <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[#0c1f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-[fadeSlideIn_0.15s_ease-out]">
              {searchQuery.trim() === "" ? (
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">Quick Navigation</div>
                  {["Dashboard", "Services", "Billing & Commercials", "Trust Vault", "Admin Settings"].map(label => (
                    <button key={label} onClick={() => { setCurrentTab(searchableItems.find(i => i.label === label)?.tabKey || "Dashboard"); setSearchFocused(false); setSearchQuery(""); }} className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition flex items-center gap-2 cursor-pointer">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-500" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2 max-h-64 overflow-y-auto">
                  {filteredSearch.map((item, i) => (
                    <button key={i} onClick={() => { setCurrentTab(item.tabKey); setSearchFocused(false); setSearchQuery(""); }} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-lg transition flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-sky-400" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <span className="text-white text-xs font-medium">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{item.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Icons */}
        <div className="flex items-center gap-3">

          {/* Help Button */}
          <div className="relative" ref={helpRef}>
            <button
              onClick={() => { setHelpOpen(!helpOpen); setNotificationsOpen(false); setUserMenuOpen(false); setTenantInfoOpen(false); }}
              className={`w-9 h-9 rounded-full outline outline-1 flex justify-center items-center transition-all duration-200 cursor-pointer ${helpOpen
                ? "bg-white/25 outline-sky-400/50 text-sky-300"
                : "bg-white/10 outline-white/20 text-indigo-50 hover:bg-white/20"
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </button>

            {/* Help Dropdown */}
            {helpOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-[#0c1f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-[fadeSlideIn_0.15s_ease-out]">
                <div className="p-4 border-b border-white/10">
                  <div className="text-white text-sm font-bold">Help & Resources</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Quick access to docs and support</div>
                </div>
                <div className="p-2 space-y-0.5">
                  {[
                    { label: "Getting Started Guide", icon: "📘", tabKey: "Documentation" },
                    { label: "API Reference", icon: "🔗", tabKey: "Documentation" },
                    { label: "Contact Support", icon: "💬", tabKey: "Support" },
                    { label: "Keyboard Shortcuts", icon: "⌨️", tabKey: "" },
                    { label: "What's New (v4.2)", icon: "🆕", tabKey: "" },
                  ].map(item => (
                    <button key={item.label} onClick={() => { if (item.tabKey) setCurrentTab(item.tabKey); setHelpOpen(false); }} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-lg transition flex items-center gap-3 cursor-pointer">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-slate-200 text-xs font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10 bg-white/[0.02]">
                  <div className="text-[10px] text-slate-500 text-center">Press <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-slate-400">Esc</span> to close · <span className="font-mono bg-white/10 px-1 py-0.5 rounded text-slate-400">⌘K</span> to search</div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setHelpOpen(false); setUserMenuOpen(false); setTenantInfoOpen(false); }}
              className={`w-9 h-9 relative rounded-full outline outline-1 flex justify-center items-center transition-all duration-200 cursor-pointer ${notificationsOpen
                ? "bg-white/25 outline-sky-400/50 text-sky-300"
                : "bg-white/10 outline-white/20 text-indigo-50 hover:bg-white/20"
                }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              {unreadCount > 0 && (
                <div className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full border-2 border-sky-950 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{unreadCount}</span>
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-[#0c1f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-[fadeSlideIn_0.15s_ease-out]">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-bold">Notifications</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{unreadCount} unread</div>
                  </div>
                  <button className="text-[10px] text-sky-400 font-semibold hover:text-sky-300 transition cursor-pointer">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/[0.03] transition cursor-pointer flex items-start gap-3 ${!n.read ? "bg-sky-500/[0.04]" : ""}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "alert" ? "bg-red-400" :
                        n.type === "success" ? "bg-lime-400" :
                          n.type === "warning" ? "bg-amber-400" : "bg-sky-400"
                        }`} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-xs font-medium leading-snug ${!n.read ? "text-white" : "text-slate-300"}`}>{n.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{n.time}</div>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <button onClick={() => { setCurrentTab("Support"); setNotificationsOpen(false); }} className="w-full text-center text-xs text-sky-400 font-semibold hover:text-sky-300 transition py-1 cursor-pointer">View All Notifications →</button>
                </div>
              </div>
            )}
          </div>

          {/* User Email + Logout (visible) */}
          {sessionData.email && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <div className="text-xs text-white font-medium">{sessionData.email}</div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-300 hover:text-red-400 font-bold transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          {/* User Avatar with Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setHelpOpen(false); setNotificationsOpen(false); setTenantInfoOpen(false); }}
              className={`w-9 h-9 rounded-full outline outline-1 flex justify-center items-center cursor-pointer transition-all duration-200 ${userMenuOpen
                ? "ring-2 ring-sky-400/50 outline-white/40 bg-gradient-to-br from-sky-600 to-lime-500"
                : "outline-white/20 bg-gradient-to-br from-sky-700 to-lime-600 hover:ring-2 hover:ring-white/20"
                }`}
            >
              <div className="text-white text-xs font-bold font-['Plus_Jakarta_Sans']">
                {sessionData.email ? sessionData.email.substring(0, 2).toUpperCase() : 'AM'}
              </div>
            </button>

            {/* User Menu Dropdown */}
            {userMenuOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[#0c1f3f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] animate-[fadeSlideIn_0.15s_ease-out]">
                <div className="p-4 border-b border-white/10">
                  <div className="text-white text-sm font-bold">{sessionData.email || "admin@acme.com"}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 font-mono">{sessionData.tenantId || "Tenant Admin"}</div>
                </div>
                <div className="p-2 space-y-0.5">
                  {[
                    { label: "Profile Settings", icon: "👤", action: () => setCurrentTab("Settings") },
                    { label: "Billing & Usage", icon: "💳", action: () => setCurrentTab("Billing") },
                    { label: "Team Members", icon: "👥", action: () => setCurrentTab("Settings") },
                    { label: "API Keys", icon: "🔑", action: () => setCurrentTab("Settings") },
                  ].map(item => (
                    <button key={item.label} onClick={() => { item.action(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-lg transition flex items-center gap-3 cursor-pointer">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-slate-200 text-xs font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-white/10">
                  <button onClick={() => { handleLogout(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2.5 hover:bg-red-500/10 rounded-lg transition flex items-center gap-3 cursor-pointer">
                    <span className="text-sm">🚪</span>
                    <span className="text-red-400 text-xs font-semibold">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Left Sidebar Section */}
        <aside className="w-64 h-[calc(100vh-3.5rem)] relative bg-white border-r-[0.80px] border-slate-200 overflow-y-auto shrink-0 select-none flex flex-col">

          {/* Sections headers and buttons (Mapped) */}
          <div className="flex-1 flex flex-col gap-6 pt-4 px-3">
            {sidebarItems.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="px-3 pb-1.5 flex flex-col justify-start items-start">
                  <div className="text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">{section.section}</div>
                </div>
                <div className="flex flex-col gap-0.5">
                  {section.items.map(item => {
                    const locked = !canAccess(TAB_DOMAIN[item.tabKey]);
                    return (
                    <button
                      key={item.tabKey}
                      onClick={() => setCurrentTab(item.tabKey as any)}
                      title={locked ? `Locked -- request access from your company admin` : undefined}
                      className={`w-full px-3 py-2.5 rounded-[10px] inline-flex justify-start items-center gap-2.5 transition-all ${
                        currentTab === item.tabKey
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 font-bold"
                          : locked
                          ? "text-slate-400 hover:bg-slate-100 font-medium"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      <img
                        src={item.iconPath}
                        className={`w-4 h-4 object-contain transition-all ${currentTab === item.tabKey ? "brightness-0 invert" : "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"}`}
                        alt={item.label}
                      />
                      <div className="justify-center text-sm">{item.label}</div>
                      {locked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-slate-400">
                          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                      )}
                      {!locked && (item.tabKey === "Services" || item.badge) && (
                        <div className="flex-1 min-w-6 inline-flex flex-col justify-start items-end">
                          <div className={`px-1.5 py-px rounded-[20px] flex flex-col justify-start items-start ${currentTab === item.tabKey ? "bg-white/20 text-white backdrop-blur-sm" : "bg-slate-200 text-slate-500"}`}>
                            <div className="justify-center text-[10px] font-semibold font-['IBM_Plex_Mono']">{item.tabKey === "Services" ? `${onlineCount}/18` : item.badge}</div>
                          </div>
                        </div>
                      )}
                    </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="px-3 pt-3.5 pb-3 border-t-[0.80px] border-slate-200 flex flex-col gap-1.5 mt-auto">
            <div className="pb-[0.60px] flex flex-col justify-start items-start">
              <a href="#" className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Trust Center</a>
            </div>
            <div className="pb-[0.60px] flex flex-col justify-start items-start">
              <a href="#" className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Privacy</a>
            </div>
            <div className="pb-[0.60px] flex flex-col justify-start items-start">
              <a href="#" className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Status page</a>
            </div>
            <div className="pb-[0.60px] flex flex-col justify-start items-start">
              <a href="#" className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Support SLA</a>
            </div>
            <div className="pt-[1.60px] flex flex-col justify-start items-start">
              <div className="text-slate-500 text-[10px] font-normal font-['IBM_Plex_Mono'] leading-4">Portal v4.2 · Helios tenant</div>
            </div>
          </div>
        </aside>

        {/* Main Panel Content Frame */}
        <main className="flex-1 px-7 pt-6 pb-14 flex flex-col justify-start items-start bg-slate-50 min-w-0">

          <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full">

            {/* Dashboard Tab */}
            {currentTab === "Dashboard" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full">
                <div className="self-stretch px-6 pt-7 pb-6 bg-white rounded-2xl border-l-[2.40px] border-r-[0.80px] border-t-[0.80px] border-b-[0.80px] border-lime-500 flex flex-col justify-start items-start gap-2 overflow-hidden">
                  <div className="px-2.5 py-[4.80px] bg-stone-100 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-lime-500/30 inline-flex justify-start items-center gap-1.5">
                    <div className="size-3 relative overflow-hidden flex justify-center items-center">
                      <div className="w-1.5 h-[5px] absolute outline outline-1 outline-offset-[-0.50px] outline-lime-500"></div>
                    </div>
                    <div className="justify-center text-lime-600 text-[10px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">OPERATOR WORKSPACE</div>
                  </div>
                  <div className="w-96 max-w-96 pt-[5px] flex flex-col justify-start items-start">
                    <div className="justify-center text-slate-800 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-9">Your ZoikoNex Operator<br />Workspace.</div>
                  </div>
                  <div className="w-[614.88px] max-w-[614.88px] flex flex-col justify-start items-start">
                    <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Monitor deployment, manage your 18 services, review support, and track account health.</div>
                  </div>
                  <div className="self-stretch pt-2.5 inline-flex justify-start items-start">
                    <button className="min-h-10 px-4 py-3 bg-[#1d64b8] hover:bg-[#154e93] transition rounded-[10px] outline outline-1 outline-offset-[-1px] outline-transparent flex justify-center items-center gap-2">
                      <div className="text-center justify-center text-white text-sm font-bold font-['Plus_Jakarta_Sans']">Review deployment health</div>
                      <div className="size-4 relative overflow-hidden flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="self-stretch pt-0.5 inline-flex justify-center items-start gap-3">
                  <div className="flex-1 px-4 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-1.5">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">ACCOUNT HEALTH</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">Healthy · 86</div>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-1.5">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">DEPLOYMENT</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">Go-Live · 82%</div>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-1.5">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">ACTIVE SERVICES</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">{onlineCount} / 18</div>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-1.5">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">OPEN TICKETS</div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">2</div>
                    </div>
                  </div>
                </div>

                <div className="self-stretch px-4 py-4 bg-white rounded-2xl border-l-[2.40px] border-r-[0.80px] border-t-[0.80px] border-b-[0.80px] border-yellow-600 inline-flex justify-start items-center gap-3.5">
                  <div className="size-9 py-2.5 bg-orange-100 rounded-[10px] inline-flex flex-col justify-start items-center justify-center">
                    <div className="size-5 relative overflow-hidden flex justify-center items-center">
                      <img src="/image/dashboard/warning-exclamation.svg" className="w-5 h-5 object-contain" alt="Warning" />
                    </div>
                  </div>
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-0.5">
                    <div className="justify-center text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">1 item needs attention</div>
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="self-stretch justify-center text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">Payment gateway test is failing in pre-production and may block go-live.</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-300 flex justify-center items-center hover:bg-slate-50 transition cursor-pointer">
                    <div className="text-center justify-center text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans'] leading-5">Review</div>
                  </button>
                </div>

                {/* Domain Workspaces Grid — All 18 TM Forum Aligned Microservice Domains */}
                <div className="self-stretch flex flex-col justify-start items-start gap-3.5 w-full mt-2">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-base font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">Domain Workspaces (18 Microservices + Security & Access)</h2>
                    <p className="text-xs text-slate-500 font-['Plus_Jakarta_Sans'] font-normal">
                      All TM Forum aligned OSS/BSS domain microservices and Role & Access Control. Select any domain card arrow to open its dedicated management workspace.
                    </p>
                  </div>

                  <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                    {[
                      {
                        id: "prod-catalog",
                        title: "Product Catalogue",
                        category: "Monetization",
                        desc: "Plans, bundles, add-ons, eligibility rules, and offer lifecycle.",
                        icon: "/image/dashboard/services.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "rt-charging",
                        title: "Real-Time Charging",
                        category: "Monetization",
                        desc: "Online charging, real-time balance reservations & policies.",
                        icon: "/image/dashboard/charging-lightning.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "rating-engine",
                        title: "Rating & Pricing",
                        category: "Monetization",
                        desc: "Usage rating matrix, tiering, discounts & price calculation.",
                        icon: "/image/dashboard/bar-chart.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "billing-invoice",
                        title: "Billing & Invoicing",
                        category: "Monetization",
                        desc: "Bill cycles, automated invoicing, statement PDF generation.",
                        icon: "/image/dashboard/billing-document.svg",
                        tabKey: "Billing",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "payments-collections",
                        title: "Payments & Collections",
                        category: "Monetization",
                        desc: "Payment methods, gateways, retries, refunds, and dunning.",
                        icon: "/image/dashboard/credit-card.svg",
                        tabKey: "Billing",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "partner-settlement",
                        title: "Partner & Settlement",
                        category: "Monetization",
                        desc: "Wholesale, interconnect, revenue share, and partner billing.",
                        icon: "/image/dashboard/user-profile.svg",
                        tabKey: "Services",
                        badge: "Provisioning",
                        badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200"
                      },
                      {
                        id: "cust-lifecycle",
                        title: "Customer Lifecycle",
                        category: "Customer & Engagement",
                        desc: "Subscriber accounts, lifecycle states, self-care & multi-brand CRM.",
                        icon: "/image/dashboard/user-profile.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "notifications-campaigns",
                        title: "Notifications & Campaigns",
                        category: "Customer & Engagement",
                        desc: "Transactional and promotional SMS, email, & push messaging.",
                        icon: "/image/dashboard/notifications-bell.svg",
                        tabKey: "Services",
                        badge: "Available",
                        badgeStyle: "bg-slate-100 text-slate-700 border-slate-300"
                      },
                      {
                        id: "esim-sim-mgmt",
                        title: "eSIM & SIM Management",
                        category: "Connectivity & Provisioning",
                        desc: "GSMA eSIM RSP profile sync, activation & SIM inventory.",
                        icon: "/image/dashboard/mobile-sim.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "iot-connectivity",
                        title: "IoT Connectivity",
                        category: "Connectivity & Provisioning",
                        desc: "Device fleet orchestration, usage aggregation, and remote actions.",
                        icon: "/image/dashboard/settings-compass.svg",
                        tabKey: "Services",
                        badge: "Available",
                        badgeStyle: "bg-slate-100 text-slate-700 border-slate-300"
                      },
                      {
                        id: "number-inventory",
                        title: "Number & Inventory",
                        category: "Connectivity & Provisioning",
                        desc: "MSISDN number ranges, MNP porting, reservation & inventory.",
                        icon: "/image/dashboard/services.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "taxation-regulatory",
                        title: "Taxation & Regulatory",
                        category: "Compliance & Trust",
                        desc: "Jurisdiction tax engine, regulatory fees, exemptions & rules.",
                        icon: "/image/dashboard/shield.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "compliance-kyc",
                        title: "Compliance & KYC",
                        category: "Compliance & Trust",
                        desc: "Identity verification, sanction screening & onboarding checks.",
                        icon: "/image/dashboard/shield-check.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "evidence-ledger",
                        title: "Evidence Ledger",
                        category: "Compliance & Trust",
                        desc: "Immutable evidence of charging, billing & governance events.",
                        icon: "/image/dashboard/document.svg",
                        tabKey: "Trust",
                        badge: "Protected",
                        badgeStyle: "bg-slate-100 text-slate-700 border-slate-300"
                      },
                      {
                        id: "ai-gov-controls",
                        title: "AI Governance",
                        category: "Intelligence",
                        desc: "Tiered AI controls with human approval for material actions.",
                        icon: "/image/dashboard/code-tags.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "analytics-reporting",
                        title: "Analytics & Reporting",
                        category: "Intelligence",
                        desc: "Operational dashboards, revenue assurance, and reports.",
                        icon: "/image/dashboard/bar-chart.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "mediation-usage",
                        title: "Mediation & Usage",
                        category: "Platform & Integration",
                        desc: "CDR ingestion, normalization, deduplication & enrichment.",
                        icon: "/image/dashboard/activity-pulse.svg",
                        tabKey: "Services",
                        badge: "Active",
                        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
                      },
                      {
                        id: "api-gateway",
                        title: "Integrations & Webhooks",
                        category: "Platform & Integration",
                        desc: "Stripe payment gateway, Vault keys, API allow-lists & webhooks.",
                        icon: "/image/dashboard/api-braces.svg",
                        tabKey: "Integration",
                        badge: "Configured",
                        badgeStyle: "bg-indigo-50 text-sky-700 border-sky-200"
                      },
                      {
                        id: "role-access-control",
                        title: "Role & Access Control",
                        category: "Identity & Security",
                        desc: "Team users, custom permission roles, SAML/OIDC SSO, & security rules.",
                        icon: "/image/dashboard/settings-gear.svg",
                        tabKey: "Settings",
                        badge: "Gated",
                        badgeStyle: "bg-[#1d64b8]/10 text-[#1d64b8] border-[#1d64b8]/30"
                      }
                    ].map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setCurrentTab(card.tabKey as any)}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#1d64b8]/40 transition-all flex flex-col justify-between group cursor-pointer min-h-[190px]"
                      >
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#1d64b8]/10 transition-colors flex items-center justify-center p-2">
                              <img src={card.icon} alt="" className="w-4 h-4 object-contain" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono uppercase tracking-wide ${card.badgeStyle}`}>
                              {card.badge}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1d64b8] transition-colors">{card.title}</h3>
                            <p className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wider mt-0.5">{card.category}</p>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#1d64b8] transition-colors">
                          <span>Manage Domain</span>
                          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#1d64b8] group-hover:text-white transition-all flex items-center justify-center">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Main Title Header */}
            {currentTab === "Services" && (
              <div className="self-stretch inline-flex justify-start items-center">
                <div className="w-[1132px] h-28 relative">
                  <div className="w-[704px] left-0 top-[20px] absolute inline-flex flex-col justify-start items-start">
                    <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
                      {currentConsole === "super-admin"
                        ? "Super Admin Console"
                        : currentConsole === "customer-portal"
                          ? "GoLite Customer Portal"
                          : "Telecom services"
                      }
                    </div>
                  </div>
                  <div className="w-[704px] max-w-[717.36px] pt-px left-0 top-[60px] absolute inline-flex flex-col justify-start items-start">
                    <div className="w-[902px] justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                      {currentConsole === "super-admin"
                        ? "Global operational command plane for governing tenants, platform integrity, and global infrastructure health."
                        : currentConsole === "customer-portal"
                          ? "White-label customer operating portal for managing connectivity plans, data usage, billing, and credentials."
                          : "Your 18 OSS/BSS domains, organized into six working groups. Toggle activation, check health, and open any service to configure it."
                      }
                    </div>
                    {currentConsole === "tenant-admin" && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50/50 border border-indigo-100/50 rounded-lg px-2.5 py-1 select-none">
                        <span className={`inline-block size-2 rounded-full ${onlineCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                        <span className="text-slate-600 text-[11px] font-semibold font-['IBM_Plex_Mono']">
                          {onlineCount === 18
                            ? "All 18 TM Forum-aligned Microservices Connected"
                            : `${onlineCount}/18 Microservices Connected`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tenant Admin view body */}
            {currentTab === "Services" && currentConsole === "tenant-admin" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-10 w-full transition-all duration-300">
                {/* Working groups */}
                <div className="self-stretch flex flex-col justify-start items-start gap-10 w-full">
                  {groups.map((group) => {
                    const groupServices = services.filter((s) => group.serviceIds.includes(s.id));
                    const activeCount = groupServices.filter((s) => s.active).length;
                    const totalCount = groupServices.length;

                    return (
                      <div key={group.id} className="self-stretch flex flex-col justify-start items-start gap-3.5 w-full">

                        {/* Group Header */}
                        <div className="self-stretch inline-flex justify-start items-end gap-2.5 w-full">
                          <div className="justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">{group.title}</div>
                          <div className="px-2 py-[2.80px] bg-slate-100 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200/50 flex justify-start items-center gap-[5px]">
                            <div className="justify-center text-slate-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">
                              {activeCount}/{totalCount} active
                            </div>
                          </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] w-full">
                          {groupServices.map((service) => {
                            const isProvisioning = service.id === "partner-settlement" && !service.active;
                            const cardLocked = !canAccess(SERVICE_DOMAIN[service.id]);

                            return (
                              <div
                                key={service.id}
                                className={`bg-white rounded-2xl border border-slate-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between p-6 transition duration-300 min-h-[220px] ${
                                  cardLocked ? "opacity-60 grayscale" : "hover:shadow-md"
                                }`}
                              >
                                <div className="self-stretch flex flex-col justify-start items-start w-full">
                                  {/* Card Header */}
                                  <div className="self-stretch inline-flex justify-start items-center gap-3.5 w-full">
                                    <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl flex justify-center items-center shrink-0 w-11 h-11 text-sky-700">
                                      <img src={service.iconPath} alt="" className="w-5 h-5 object-contain" />
                                    </div>
                                    <div className="flex-1 inline-flex flex-col justify-start items-start">
                                      <div className="justify-center text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">{service.name}</div>
                                      <div className="justify-center text-slate-400 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide mt-0.5">
                                        MONETIZATION · {service.version}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Badges */}
                                  <div className="self-stretch pt-3.5 flex flex-wrap justify-start items-start gap-1.5 w-full">
                                    {service.badges.map((badge) => {
                                      let badgeStyle = "bg-slate-50 text-slate-500 outline-slate-200/50";
                                      let icon = null;

                                      if (badge === "ACTIVE") {
                                        badgeStyle = "bg-indigo-50 text-sky-700 outline-sky-700/30";
                                        icon = (
                                          <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        );
                                      } else if (badge === "HEALTHY") {
                                        badgeStyle = "bg-stone-200/50 text-lime-600 outline-lime-500/30";
                                        icon = (
                                          <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        );
                                      } else if (badge === "WATCH") {
                                        badgeStyle = "bg-orange-100/60 text-yellow-600 outline-yellow-600/40";
                                        icon = (
                                          <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 2V6M5 8H5.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        );
                                      } else if (badge === "PROVISIONING") {
                                        badgeStyle = "bg-indigo-500/10 text-indigo-500 outline-indigo-500/40";
                                        icon = (
                                          <svg className="w-2.5 h-2.5 shrink-0 animate-spin" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 2V4M5 6V8M2 5H4M6 5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        );
                                      } else if (badge === "AVAILABLE") {
                                        badgeStyle = "bg-stone-50 text-slate-500 outline-slate-200/50";
                                        icon = (
                                          <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        );
                                      }

                                      return (
                                        <div
                                          key={badge}
                                          className={`px-2 pt-[2.50px] pb-[3.10px] rounded-md outline outline-1 outline-offset-[-1px] flex justify-start items-center gap-[5px] text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide ${badgeStyle}`}
                                        >
                                          {icon}
                                          <div>{badge}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Description */}
                                <div className="self-stretch pt-2.5 flex flex-col justify-start items-start">
                                  <div className="self-stretch flex flex-col justify-start items-start">
                                    <div className="self-stretch text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5 min-h-[40px]">
                                      {service.description}
                                    </div>
                                  </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="self-stretch pt-3.5 flex flex-col justify-start items-start">
                                  <div className="self-stretch pt-3 border-t-[0.80px] border-slate-200 inline-flex justify-start items-center gap-2.5 w-full">
                                    {cardLocked ? (
                                      <div className="w-full flex items-center gap-1.5 text-slate-500" title="Request access from your company admin">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                                          <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                                        </svg>
                                        <div className="text-[11px] font-semibold font-['Plus_Jakarta_Sans']">Access blocked — request access from your company admin</div>
                                      </div>
                                    ) : isProvisioning ? (
                                      <div className="px-2 py-[2.80px] bg-indigo-500/10 rounded-md outline outline-1 outline-offset-[-1px] outline-indigo-500/40 flex justify-start items-center gap-[5px] text-indigo-500">
                                        <svg className="w-2.5 h-2.5 shrink-0 animate-spin" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 2V4M5 6V8M2 5H4M6 5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="justify-center text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">PROVISIONING</div>
                                      </div>
                                    ) : (
                                      <>
                                      <div
                                        onClick={() => handleToggle(service.id)}
                                        className={`w-10 h-6 relative cursor-pointer rounded-[999px] transition-colors duration-300 flex flex-col justify-start items-start py-[3px] px-[3px] shrink-0 ${service.active ? "bg-lime-600 pl-5 pr-[3px]" : "bg-slate-200 pl-[3px] pr-5"
                                          }`}
                                      >
                                        <div className="size-4 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30)] transition-all duration-300"></div>
                                      </div>

                                      <div className="flex-1 min-w-20 inline-flex flex-col justify-start items-end">
                                        <button
                                          onClick={() => {
                                            setSelectedService(service);
                                            setRequestMethod("GET");
                                            setRequestPath("/health");
                                            setRequestHeaders(`{\n  "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"\n}`);
                                            setRequestBody("");
                                            setApiResponse(null);
                                            setSelectedEndpoint("");
                                          }}
                                          className="px-3 py-1.5 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center hover:bg-slate-100 transition"
                                        >
                                          <div className="text-center justify-center text-slate-600 text-xs font-bold font-['Plus_Jakarta_Sans']">Manage</div>
                                        </button>
                                      </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Super Admin view body */}
            {currentTab === "Services" && currentConsole === "super-admin" && (
              <div className="self-stretch flex flex-col gap-6 w-full transition-all duration-300">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tenants</span>
                    <span className="text-3xl font-extrabold text-slate-800 mt-1">12</span>
                    <span className="text-xs text-emerald-600 font-semibold mt-1">▲ +2 this month</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</span>
                    <span className="text-3xl font-extrabold text-slate-800 mt-1">2,408,190</span>
                    <span className="text-xs text-emerald-600 font-semibold mt-1">▲ +12.4% YoY</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global MRR</span>
                    <span className="text-3xl font-extrabold text-slate-800 mt-1">$18,402,900</span>
                    <span className="text-xs text-slate-500 mt-1">Convergent Mediated Feed</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-rose-100 bg-rose-50/10 shadow-sm flex flex-col justify-between min-h-[100px]">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Failed Provisioning</span>
                    <span className="text-3xl font-extrabold text-rose-600 mt-1">4</span>
                    <span className="text-xs text-rose-500 font-semibold mt-1">● 4 manual holds</span>
                  </div>
                </div>

                {/* Tenants Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Active Tenant Registry (Multi-Tenant Estate)</span>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono font-semibold">100% Isolation Enforced</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Tenant Name</th>
                          <th className="px-6 py-3">Market</th>
                          <th className="px-6 py-3">Primary Domain</th>
                          <th className="px-6 py-3">Subscribers</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-700">Acme Corporation</td>
                          <td className="px-6 py-4">US-NY (Telecom-Tax)</td>
                          <td className="px-6 py-4 font-mono text-xs">acme.zoikonex.com</td>
                          <td className="px-6 py-4">1.2M</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-700">SilverX Mobile</td>
                          <td className="px-6 py-4">UK (VAT-Compliant)</td>
                          <td className="px-6 py-4 font-mono text-xs">silverx.zoikonex.com</td>
                          <td className="px-6 py-4">850K</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-700">GoLite Connectivity</td>
                          <td className="px-6 py-4">EU (GDPR-Regulated)</td>
                          <td className="px-6 py-4 font-mono text-xs">golite.zoikonex.com</td>
                          <td className="px-6 py-4">350K</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-700">DriverX Telematics</td>
                          <td className="px-6 py-4">DE (IoT Fleet)</td>
                          <td className="px-6 py-4 font-mono text-xs">driverx.zoikonex.com</td>
                          <td className="px-6 py-4">8,190</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-bold font-mono">DEGRADED</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Platform Activity Feed */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-4">Platform Infrastructure Orchestration</h4>
                  <div className="space-y-3 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-2"><span className="text-emerald-500">●</span> [16:01:22] [GLOBAL] Kubernetes cluster nodes healthy. Pod replication factor 3x.</div>
                    <div className="flex items-center gap-2"><span className="text-indigo-500">○</span> [15:58:10] [IDENTITY] Seeding check completed for tenant Acme Corporation.</div>
                    <div className="flex items-center gap-2"><span className="text-rose-500">■</span> [15:45:00] [PROVISIONING] eSIM provision timeout for subscriber ID sub-0987. Escalated to Saga Action Queue.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Portal view body */}
            {currentTab === "Services" && currentConsole === "customer-portal" && (
              <div className="self-stretch flex flex-col gap-6 w-full transition-all duration-300">

                {/* Account Credentials Panel */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm font-sans flex flex-col md:flex-row gap-5 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">BSS Customer ID</label>
                    <input
                      type="text"
                      value={custPortalCustomerId}
                      onChange={(e) => setCustPortalCustomerId(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-lg px-3.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                      placeholder="e.g. eac403a6-bf76-49b3-907d-5a4bb6f81f4d"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">BSS Billing Account ID / Number</label>
                    <input
                      type="text"
                      value={custPortalAccountId}
                      onChange={(e) => setCustPortalAccountId(e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-lg px-3.5 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                      placeholder="e.g. 393d645f-07ca-460c-93f1-939a7676bbe3"
                    />
                  </div>
                  <button
                    onClick={() => fetchPortalInvoices(custPortalAccountId)}
                    className="h-10 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    Sync Invoices
                  </button>
                </div>

                {/* Status Banner */}
                {portalMessage && (
                  <div className={`p-4 rounded-xl border text-xs font-semibold font-sans text-left ${portalMessage.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-rose-50 border-rose-200 text-rose-600"
                    }`}>
                    {portalMessage.text}
                  </div>
                )}

                {/* Interactive Control Centre Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* 1. Placing eSIM orders */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase eSIM Plan (POST /v1/orders)</span>
                        <h3 className="text-sm font-bold text-slate-800 mt-2 font-mono">Offer: {orderOfferId.slice(0, 18)}...</h3>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Target Offer ID</label>
                          <input
                            type="text"
                            value={orderOfferId}
                            onChange={(e) => setOrderOfferId(e.target.value)}
                            className="w-full h-8 border border-slate-200 rounded px-2 text-[10px] text-slate-700 bg-slate-50 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Target Product ID</label>
                          <input
                            type="text"
                            value={orderProductId}
                            onChange={(e) => setOrderProductId(e.target.value)}
                            className="w-full h-8 border border-slate-200 rounded px-2 text-[10px] text-slate-700 bg-slate-50 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={portalLoading}
                      className="w-full py-2.5 mt-4 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-bold transition text-center disabled:bg-slate-400 flex items-center justify-center gap-1.5"
                    >
                      {portalLoading ? "Processing..." : "Place eSIM Order"}
                    </button>
                  </div>

                  {/* 2. Prepaid Balance Wallet */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prepaid Balance Wallet</span>
                      <h3 className="text-4xl font-extrabold text-slate-800 mt-3">${prepaidBalance.toFixed(2)}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 font-sans leading-relaxed">
                        Prepaid balance managed on rating-charging engine (port 8085).
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPrepaidBalance(prev => prev + 10);
                        setPortalMessage({ text: "Wallet top-up simulation completed! $10.00 added.", type: "success" });
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                    >
                      Top Up $10.00
                    </button>
                  </div>

                  {/* 3. Run Billing Invoice Cycle */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trigger Bill Run (TMF678)</span>
                      <h3 className="text-lg font-bold text-slate-800 mt-3">Account Invoice Cycle</h3>
                      <p className="text-xs text-slate-500 mt-1.5 font-sans leading-relaxed">
                        Invokes draft invoice generation on port 8092 and publishes to ledger.
                      </p>
                    </div>
                    <button
                      onClick={handleRunBilling}
                      disabled={portalLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition text-center disabled:bg-slate-400 flex items-center justify-center"
                    >
                      {portalLoading ? "Running Cycle..." : "Execute Billing Cycle"}
                    </button>
                  </div>

                </div>

                {/* Invoices List Registry Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Issued Invoices (Port 8092)</span>
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-mono font-semibold">Ledger Synced</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Invoice ID</th>
                          <th className="px-6 py-3">Bill Cycle</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3">Issued Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {portalLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-6">
                              <div className="flex flex-col gap-4">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="flex items-center justify-between animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-1/5"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ) : portalInvoices.length > 0 ? (
                          portalInvoices.map((inv: any) => (
                            <tr key={inv.id}>
                              <td className="px-6 py-4 font-mono text-xs font-bold text-sky-700">{inv.id}</td>
                              <td className="px-6 py-4 text-xs font-semibold">{inv.bill_cycle_id || "CURRENT_CYCLE"}</td>
                              <td className="px-6 py-4 text-xs font-bold">${((inv.amount_minor_units || 4500) / 100).toFixed(2)} {inv.currency_code || "USD"}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${inv.status === "ISSUED"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : inv.status === "DRAFT"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-50 text-slate-600"
                                  }`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-mono text-slate-400">
                                {new Date(inv.created_at || Date.now()).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-400 italic">
                              No billing invoice cycles found for this account. Click "Execute Billing Cycle" above to generate one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Dashboard Tab */}
            {currentTab === "Dashboard" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-start items-center">
                  <div className="w-[1132px] h-20 relative">
                    <div className="w-[704px] left-0 top-[20px] absolute inline-flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
                        Dashboard
                      </div>
                    </div>
                    <div className="w-[704px] max-w-[717.36px] pt-px left-0 top-[60px] absolute inline-flex flex-col justify-start items-start">
                      <div className="w-[902px] justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                        Operational dashboard and key tenant activity statistics.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant Health</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-2">100% Online</h3>
                    <p className="text-xs text-slate-500 mt-1">All TM Forum cores connected</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Subscribers</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-2">124,592</h3>
                    <p className="text-xs text-slate-500 mt-1">Across all registered brands</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data Ingested</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-2">42.8 GB</h3>
                    <p className="text-xs text-slate-500 mt-1">Real-time CDR rating mediation</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Vault Tab */}
            {currentTab === "Trust" && (canAccess(TAB_DOMAIN.Trust) ? (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-start items-center">
                  <div className="w-[1132px] h-20 relative">
                    <div className="w-[704px] left-0 top-[20px] absolute inline-flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
                        Trust & procurement vault
                      </div>
                    </div>
                    <div className="w-[704px] max-w-[717.36px] pt-px left-0 top-[60px] absolute inline-flex flex-col justify-start items-start">
                      <div className="w-[902px] justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                        Controlled access to procurement, security, and legal materials. Sensitive documents are gated and logged.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-stretch pt-2 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start overflow-hidden shadow-sm mt-4">
                  <div className="self-stretch min-w-[560px] flex flex-col justify-start items-start w-full">
                    <div className="self-stretch inline-flex justify-center items-start w-full">
                      <div className="w-80 px-4 py-3 bg-slate-50 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                        <div className="justify-center text-slate-500 text-[9.50px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">DOCUMENT</div>
                      </div>
                      <div className="w-44 px-4 py-3 bg-slate-50 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                        <div className="justify-center text-slate-500 text-[9.50px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">CATEGORY</div>
                      </div>
                      <div className="w-36 px-4 py-3 bg-slate-50 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                        <div className="justify-center text-slate-500 text-[9.50px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">VERSION</div>
                      </div>
                      <div className="w-52 px-4 py-3 bg-slate-50 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                        <div className="justify-center text-slate-500 text-[9.50px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">ACCESS</div>
                      </div>
                      <div className="flex-1 min-w-[12rem] h-10 bg-slate-50 border-b-[0.80px] border-slate-200"></div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start w-full">
                      {trustDocuments.map((doc, i) => (
                        <div key={i} className="self-stretch inline-flex justify-center items-start w-full hover:bg-slate-50/50 transition duration-150">
                          <div className="w-80 px-4 py-5 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">{doc.name}</div>
                          </div>
                          <div className="w-44 px-4 py-5 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">{doc.category}</div>
                          </div>
                          <div className="w-36 px-4 py-5 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-600 text-xs font-normal font-['IBM_Plex_Mono'] leading-5">{doc.version}</div>
                          </div>
                          <div className="w-52 px-4 py-4 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start">
                            {doc.status === "APPROVED" && (
                              <div className="px-2 py-[2.80px] bg-stone-200 rounded-md outline outline-1 outline-offset-[-1px] outline-lime-500/30 inline-flex justify-start items-center gap-[5px]">
                                <div className="size-2.5 relative overflow-hidden flex justify-center items-center">
                                  <svg className="w-2.5 h-2.5 text-lime-600" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="2.5"><path d="M2 5L4 7L8 3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <div className="justify-center text-lime-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">APPROVED</div>
                              </div>
                            )}
                            {doc.status === "RESTRICTED" && (
                              <div className="px-2 py-[2.80px] bg-slate-50 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex justify-start items-center gap-[5px]">
                                <div className="size-2.5 relative overflow-hidden flex justify-center items-center">
                                  <svg className="w-2.5 h-2.5 text-slate-500" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="3" width="6" height="5" rx="1" /><path d="M3.5 3V2a1.5 1.5 0 113 0v1" /></svg>
                                </div>
                                <div className="justify-center text-slate-500 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">RESTRICTED</div>
                              </div>
                            )}
                            {doc.status === "REQUESTED" && (
                              <div className="px-2 py-[2.80px] bg-indigo-500/10 rounded-md outline outline-1 outline-offset-[-1px] outline-indigo-500/40 inline-flex justify-start items-center gap-[5px]">
                                <div className="size-2.5 relative overflow-hidden flex justify-center items-center">
                                  <svg className="w-2.5 h-2.5 text-indigo-500 animate-pulse" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.8"><circle cx="5" cy="5" r="4" /><path d="M5 2.5v3M5.01 7.5h.01" /></svg>
                                </div>
                                <div className="justify-center text-indigo-500 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">REQUESTED</div>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-[12rem] px-4 py-3 border-b-[0.80px] border-slate-200 inline-flex flex-col justify-center items-end self-stretch">
                            {doc.status === "APPROVED" ? (
                              <div className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 transition cursor-pointer rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center">
                                <div className="text-center justify-center text-slate-600 text-xs font-bold font-['Plus_Jakarta_Sans']">Download</div>
                              </div>
                            ) : doc.status === "RESTRICTED" ? (
                              <div className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 transition cursor-pointer rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center">
                                <div className="text-center justify-center text-slate-600 text-xs font-bold font-['Plus_Jakarta_Sans']">Request access</div>
                              </div>
                            ) : (
                              <div className="text-right justify-center text-slate-400 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Pending</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="self-stretch inline-flex justify-start items-center gap-2 mt-2">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="10" cy="10" r="8" /><path d="M10 6v4M10 14h.01" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
                    Document access is recorded for controlled trust materials. Some items require NDA or qualified review.
                  </div>
                </div>
              </div>
            ) : (
              <LockedPanel label="Trust Vault" />
            ))}

            {/* Documentation Tab */}
            {currentTab === "Documentation" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch pb-1.5 inline-flex justify-start items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Documentation</div>
                    </div>
                    <div className="w-full max-w-[717.36px] pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Role-filtered guides and references for your enabled modules.</div>
                    </div>
                  </div>
                </div>

                <div className="w-96 px-3 py-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-start items-start overflow-hidden">
                  <div className="self-stretch flex flex-col justify-start items-start overflow-hidden">
                    <input type="text" placeholder="Search documentation…" className="w-full bg-transparent text-slate-700 text-sm font-normal font-['Plus_Jakarta_Sans'] outline-none placeholder-neutral-500" />
                  </div>
                </div>

                <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] w-full pt-1">
                  {docGuides.map((guide, i) => (
                    <div key={i} className="self-stretch px-5 py-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-1.5 hover:shadow-md transition cursor-pointer">
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch justify-center text-slate-500 text-[9px] font-normal font-['IBM_Plex_Mono'] uppercase leading-3 tracking-wide">{guide.category}</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch justify-center text-sky-700 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">{guide.title}</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch justify-center text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">{guide.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deployment Tab */}
            {currentTab === "Deployment" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Deployment readiness</div>
                    </div>
                    <div className="w-full max-w-[717.36px] pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Stage-driven, controlled implementation across environments and integrations.</div>
                    </div>
                  </div>
                  <div className="px-2 py-[2.80px] bg-indigo-50 rounded-md outline outline-1 outline-sky-700/30 flex justify-start items-center gap-1.5">
                    <svg className="w-3 h-3 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <div className="justify-center text-sky-700 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">MODEL: DEDICATED CLOUD</div>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="self-stretch px-5 pt-6 pb-5 bg-white rounded-2xl outline outline-1 outline-slate-200 flex flex-col justify-start items-start gap-1 shadow-sm">
                  <div className="self-stretch pb-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Current stage</div>
                  </div>
                  <div className="self-stretch pb-3.5 inline-flex flex-wrap justify-start items-start gap-2">
                    {["Discovery", "Architecture", "Integration", "Sandbox", "POC", "Contracting", "Build", "QA", "Pre-Production"].map(stage => (
                      <div key={stage} className="px-3 py-1.5 bg-stone-100 rounded-full outline outline-1 outline-lime-500/30">
                        <div className="justify-center text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">{stage}</div>
                      </div>
                    ))}
                    <div className="px-3 py-1.5 bg-sky-700 rounded-full outline outline-1 outline-sky-700">
                      <div className="justify-center text-white text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">Go-Live</div>
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-full outline outline-1 outline-slate-300">
                      <div className="justify-center text-slate-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-4">Hypercare</div>
                    </div>
                  </div>
                  <div className="self-stretch h-2 bg-slate-100 rounded-full overflow-hidden w-full relative">
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-700 to-lime-500 w-[82%] rounded-full"></div>
                  </div>
                  <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                    <div className="justify-center text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">82% ready · 9 of 11 milestones complete · 1 blocker</div>
                  </div>
                </div>

                {/* Grid Content */}
                <div className="self-stretch grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                  {/* Milestones */}
                  <div className="px-5 py-5 bg-white rounded-2xl outline outline-1 outline-slate-200 flex flex-col gap-1.5 shadow-sm">
                    <div className="justify-center text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6 mb-2">Milestones</div>
                    <div className="flex flex-col">
                      {[
                        { name: "Discovery & scoping", date: "Completed Apr 2", status: "done" },
                        { name: "Architecture review", date: "Completed Apr 18", status: "done" },
                        { name: "Integration mapping", date: "Completed May 5", status: "done" },
                        { name: "Sandbox validation", date: "Completed May 20", status: "done" },
                        { name: "POC sign-off", date: "Completed Jun 2", status: "done" },
                        { name: "Contracting", date: "Completed Jun 10", status: "done" },
                        { name: "Build", date: "Completed Jun 18", status: "done" },
                        { name: "QA", date: "Completed Jun 22", status: "done" },
                        { name: "Data migration dry-run", date: "Completed Jun 24", status: "done" },
                        { name: "Payment gateway certification", date: "Blocked — sandbox test failing", status: "blocked" },
                        { name: "Go-live readiness review", date: "In progress", status: "progress" }
                      ].map((item, i) => (
                        <div key={i} className={`py-3 ${i !== 10 ? 'border-b border-slate-200' : ''} flex items-center gap-3`}>
                          <div className={`w-6 h-6 rounded-xl flex justify-center items-center ${item.status === 'done' ? 'bg-stone-100 text-lime-600' : item.status === 'blocked' ? 'bg-rose-50 text-red-500' : 'bg-indigo-50 text-sky-700'}`}>
                            {item.status === 'done' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            {item.status === 'blocked' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            {item.status === 'progress' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans']">{item.name}</span>
                            <span className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans']">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Integration Readiness */}
                    <div className="px-5 py-5 bg-white rounded-2xl outline outline-1 outline-slate-200 shadow-sm flex flex-col gap-2.5">
                      <div className="justify-center text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">Integration readiness</div>
                      <div className="flex flex-col">
                        {[
                          { name: "Carrier / network", status: "READY", color: "lime" },
                          { name: "Tax engine", status: "READY", color: "lime" },
                          { name: "Payment gateway", status: "BLOCKED", color: "red" },
                          { name: "KYC provider", status: "READY", color: "lime" },
                          { name: "eSIM / RSP", status: "READY", color: "lime" },
                          { name: "CRM", status: "READY", color: "lime" },
                          { name: "Data warehouse", status: "IN PROGRESS", color: "yellow" }
                        ].map((item, i) => (
                          <div key={i} className={`py-2.5 ${i !== 6 ? 'border-b border-slate-200' : ''} flex justify-between items-center`}>
                            <div className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans']">{item.name}</div>
                            <div className={`px-2 py-1 rounded-md outline outline-1 flex items-center gap-1.5 ${item.color === 'lime' ? 'bg-stone-100 outline-lime-500/30 text-lime-600' :
                              item.color === 'red' ? 'bg-rose-50 outline-red-500/40 text-red-500' :
                                'bg-orange-50 outline-yellow-600/40 text-yellow-600'
                              }`}>
                              {item.color === 'lime' && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              {item.color === 'red' && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                              {item.color === 'yellow' && <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                              <span className="text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">{item.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Go-Live Checklist */}
                    <div className="self-stretch px-5 py-5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start gap-2.5">
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch justify-center text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">Go-live checklist</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start">
                        <div className="self-stretch py-2.5 border-b-[0.80px] border-slate-200 inline-flex justify-start items-start gap-2.5">
                          <div className="w-6 h-5 pl-1 pr-[3px] pt-px pb-[3px]">
                            <img src="/image/dashboard/green-check.svg" className="w-full h-full object-contain" alt="" />
                          </div>
                          <div className="justify-center text-slate-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] line-through leading-5">Security sign-off</div>
                        </div>
                        <div className="self-stretch py-2.5 border-b-[0.80px] border-slate-200 inline-flex justify-start items-start gap-2.5">
                          <div className="w-6 h-5 pl-1 pr-[3px] pt-px pb-[3px]">
                            <img src="/image/dashboard/green-check.svg" className="w-full h-full object-contain" alt="" />
                          </div>
                          <div className="justify-center text-slate-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] line-through leading-5">Data migration plan</div>
                        </div>
                        <div className="self-stretch py-2.5 border-b-[0.80px] border-slate-200 inline-flex justify-start items-start gap-2.5">
                          <div className="w-6 h-5 pl-1 pr-[3px] pt-px pb-[3px]">
                            <img src="/image/dashboard/green-check.svg" className="w-full h-full object-contain" alt="" />
                          </div>
                          <div className="justify-center text-slate-500 text-xs font-semibold font-['Plus_Jakarta_Sans'] line-through leading-5">Revenue assurance baseline</div>
                        </div>
                        <div className="self-stretch py-2.5 border-b-[0.80px] border-slate-200 inline-flex justify-start items-start gap-2.5">
                          <div className="w-6 h-5 pl-1 pr-[3px] pt-px pb-[3px] inline-flex flex-col justify-start items-start">
                            <div className="size-4 bg-white rounded-sm border border-neutral-500"></div>
                          </div>
                          <div className="justify-center text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">Support readiness</div>
                        </div>
                        <div className="self-stretch py-2.5 inline-flex justify-start items-start gap-2.5">
                          <div className="w-6 h-5 pl-1 pr-[3px] pt-px pb-[3px] inline-flex flex-col justify-start items-start">
                            <div className="size-4 bg-white rounded-sm border border-neutral-500"></div>
                          </div>
                          <div className="justify-center text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">Rollback plan</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sandbox Tab */}
            {currentTab === "Sandbox" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Evaluation Workspace</div>
                    </div>
                    <div className="w-full pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">A bounded, controlled sandbox for technical validation. No production data without an approved secure<br />channel.</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-orange-50 rounded outline outline-1 outline-yellow-600/30 flex justify-start items-center gap-1.5">
                    <svg className="w-3 h-3 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div className="justify-center text-yellow-600 text-xs font-bold font-['IBM_Plex_Mono'] uppercase tracking-wider">EXPIRES IN 71 DAYS</div>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-2">
                  {/* Sandbox Tenant */}
                  <div className="px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-2">Sandbox tenant</div>

                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Name</span>
                      <span className="text-slate-800 text-sm font-bold font-mono">helios-eval-01</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Region</span>
                      <span className="text-slate-800 text-sm font-bold font-mono">EU-West</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Status</span>
                      <div className="px-2 py-1 bg-stone-100 rounded text-lime-600 text-xs font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ACTIVE
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-500 text-sm">Access level</span>
                      <span className="text-slate-800 text-sm font-bold">Technical Evaluator</span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">API ACCESS</span>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="font-mono text-slate-800 text-sm flex-1 pl-2">zk_sbx_••••••••••••••••••••••••</span>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded text-slate-600 text-xs font-bold shadow-sm">Reveal</button>
                        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded text-slate-600 text-xs font-bold shadow-sm">Rotate</button>
                      </div>
                      <span className="text-slate-500 text-xs mt-1">Rate limit: 600 req/min · keys are masked after first reveal in production.</span>
                    </div>
                  </div>

                  {/* Test flows */}
                  <div className="px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">Test flows</div>
                    <div className="text-slate-500 text-sm mb-4">Run sample telecom scenarios end-to-end.</div>

                    {[
                      "Usage ingestion — rating",
                      "Rating — billing run",
                      "Tax calculation",
                      "Payment simulation",
                      "Webhook delivery",
                      "Evidence ledger verify"
                    ].map((flow, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600 text-sm">{flow}</span>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-slate-100 rounded text-slate-500 text-xs font-bold font-mono flex items-center gap-1 uppercase">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                            IDLE
                          </div>
                          <button className="px-4 py-1.5 bg-white border border-slate-200 rounded text-slate-700 text-xs font-bold shadow-sm hover:bg-slate-50">Run</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* POC Checklist */}
                  <div className="px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">POC checklist</div>
                      <div className="text-slate-400 text-sm font-mono">38%</div>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full w-full relative mb-2">
                      <div className="absolute left-0 top-0 h-full bg-lime-500 w-[38%] rounded-full"></div>
                    </div>

                    <div className="flex flex-col">
                      {[
                        { name: "Sandbox tenant provisioned", done: true },
                        { name: "API keys generated", done: true },
                        { name: "Ingest sample CDRs", done: true },
                        { name: "Validate rating scenario", done: false },
                        { name: "Validate billing run", done: false },
                        { name: "Tax & payment simulation", done: false },
                        { name: "Webhook integration test", done: false },
                        { name: "Evidence pack reviewed", done: false },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
                          <div className={`w-5 h-5 rounded flex justify-center items-center border ${item.done ? 'bg-stone-100 border-lime-300 text-lime-600' : 'bg-white border-slate-300'}`}>
                            {item.done && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-700 font-semibold'}`}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Pack */}
                  <div className="px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 h-fit">
                    <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">Evidence pack</div>
                    <div className="text-slate-500 text-sm mb-4">Generate an evaluation evidence pack from completed tests and findings.</div>

                    <div className="text-slate-500 text-sm mb-4">No evidence pack generated yet.</div>

                    <button className="w-full py-2.5 bg-[#1d64b8] text-white rounded-lg font-bold text-sm shadow-sm hover:bg-[#154e93] transition mb-2">
                      Generate evidence pack
                    </button>
                    <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition">
                      Schedule architecture review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Support Tab */}
            {currentTab === "Support" && (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Support & success</div>
                    </div>
                    <div className="w-full pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Open tickets, track SLAs, and reach your account team.</div>
                    </div>
                  </div>
                  <button className="px-4 py-2.5 bg-[#1d64b8] text-white rounded-lg font-bold text-sm shadow-sm hover:bg-[#154e93] transition flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Open a ticket
                  </button>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OPEN TICKETS</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-2">2</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA TIER</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">Enterprise</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">P1 RESPONSE</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">1 hour</span>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HYPERCARE</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">Active</span>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">SUBJECT</th>
                          <th className="px-6 py-4">SEVERITY</th>
                          <th className="px-6 py-4">MODULE</th>
                          <th className="px-6 py-4">STATUS</th>
                          <th className="px-6 py-4">UPDATED</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        <tr>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">ZK-4821</td>
                          <td className="px-6 py-4 font-bold text-slate-800">Invoice template v3 migration question</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded text-[10px] font-bold font-mono">↑ P2</span></td>
                          <td className="px-6 py-4 text-slate-500">Billing & Invoicing</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-200 rounded-md text-[10px] font-bold font-mono">OPEN</span></td>
                          <td className="px-6 py-4 text-slate-500">2h ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">ZK-4799</td>
                          <td className="px-6 py-4 font-bold text-slate-800">Webhook retries after timeout</td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold font-mono">↑ P3</span></td>
                          <td className="px-6 py-4 text-slate-500">API Gateway</td>
                          <td className="px-6 py-4">
                            <div className="px-2 py-[2.80px] bg-indigo-500/10 rounded-md outline outline-1 outline-offset-[-1px] outline-indigo-500/40 inline-flex justify-start items-center gap-[5px]">
                              <div className="size-2.5 relative overflow-hidden">
                                <div className="w-[1.38px] h-[2.75px] left-[5.50px] top-[3.67px] absolute outline outline-[1.19px] outline-offset-[-0.60px] outline-indigo-500"></div>
                              </div>
                              <div className="justify-center text-indigo-500 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">IN PROGRESS</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500">1d ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {currentTab === "Billing" && (canAccess(TAB_DOMAIN.Billing) ? (
              <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Billing & commercials</div>
                    </div>
                    <div className="w-full pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Contracted scope, usage bands, invoices, and renewal — visibility without surprises.</div>
                    </div>
                  </div>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition">
                    Request scope change
                  </button>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PATHWAY</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">Scale</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">USAGE BAND</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">100k-1M</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONTRACT TERM</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">Annual</span>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RENEWAL</span>
                    <span className="text-xl font-bold text-slate-800 mt-2">Mar 31, 2027</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Current Usage */}
                  <div className="px-6 py-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6">
                    <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">Current usage</div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Active subscribers</span>
                        <span className="text-slate-800 text-sm font-bold font-mono">412,800</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full w-full relative mb-2">
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-700 to-lime-500 w-[41%] rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0 border-t border-slate-100 pt-2">
                      <div className="flex justify-between items-center py-4 border-b border-slate-100">
                        <span className="text-slate-500 text-sm">API calls (month)</span>
                        <span className="text-slate-800 text-sm font-bold font-mono">18.4M</span>
                      </div>
                      <div className="flex justify-between items-center py-4 border-b border-slate-100">
                        <span className="text-slate-500 text-sm">Rated events</span>
                        <span className="text-slate-800 text-sm font-bold font-mono">126M</span>
                      </div>
                      <div className="flex justify-between items-center py-4">
                        <span className="text-slate-500 text-sm">Overage</span>
                        <div className="px-2 py-1 bg-stone-100 outline outline-1 outline-lime-500/30 rounded text-lime-600 text-[10px] font-bold font-mono flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          WITHIN BAND
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                    <div className="px-6 py-6 border-b border-slate-100">
                      <div className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">Invoices</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">INVOICE</th>
                            <th className="px-6 py-4">PERIOD</th>
                            <th className="px-6 py-4">AMOUNT</th>
                            <th className="px-6 py-4">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          <tr>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">INV-2026-05</td>
                            <td className="px-6 py-4 text-slate-600">May 2026</td>
                            <td className="px-6 py-4 font-bold text-slate-800 font-mono">$48,200</td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-stone-100 text-lime-600 outline outline-1 outline-lime-500/30 rounded-md text-[10px] font-bold font-mono flex items-center gap-1 w-fit"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>PAID</span></td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">INV-2026-06</td>
                            <td className="px-6 py-4 text-slate-600">Jun 2026</td>
                            <td className="px-6 py-4 font-bold text-slate-800 font-mono">$48,200</td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-orange-50 text-orange-600 outline outline-1 outline-orange-500/30 rounded-md text-[10px] font-bold font-mono flex items-center gap-1 w-fit"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>DUE</span></td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">INV-2026-04</td>
                            <td className="px-6 py-4 text-slate-600">Apr 2026</td>
                            <td className="px-6 py-4 font-bold text-slate-800 font-mono">$45,900</td>
                            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-stone-100 text-lime-600 outline outline-1 outline-lime-500/30 rounded-md text-[10px] font-bold font-mono flex items-center gap-1 w-fit"><svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>PAID</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LockedPanel label="Billing & Commercials" />
            ))}

            {/* Admin Settings Tab */}
            {currentTab === "Settings" && (canAccess(TAB_DOMAIN.Settings) ? (
              <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full font-sans transition-all duration-300">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">Admin & access</div>
                    </div>
                    <div className="w-full max-w-[717.36px] pt-px flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">Users, roles, SSO, and audit. Permission rule: deny overrides allow.</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setInviteModalOpen(true)}
                    className="min-h-10 px-4 py-3 bg-[#1d64b8] text-white hover:bg-[#154e93] transition rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Invite user
                  </button>
                </div>

                <div className="self-stretch pt-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Single Sign-on */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="pb-2.5">
                      <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Single sign-on</h3>
                    </div>
                    <div className="py-3 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-slate-800 text-xs font-bold leading-5">SAML / OIDC</span>
                        <span className="text-slate-500 text-xs leading-4">Okta connected</span>
                      </div>
                      <div className="px-2 py-1 bg-stone-200 rounded outline outline-1 outline-lime-500/30 flex items-center gap-1">
                        <svg className="w-2.5 h-2.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-slate-500 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">ON</span>
                      </div>
                    </div>
                    <div className="py-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-slate-800 text-xs font-bold leading-5">MFA enforcement</span>
                        <span className="text-slate-500 text-xs leading-4">Required for admins</span>
                      </div>
                      <div className="w-10 h-6 bg-lime-600 rounded-full p-[3px] flex items-center justify-end cursor-pointer">
                        <div className="size-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Tenant profile */}
                  <div className="px-5 pt-5 pb-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="pb-2.5">
                      <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Tenant profile</h3>
                    </div>
                    <div className="py-2.5 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600 text-xs leading-5">Tenant</span>
                      <span className="text-slate-800 text-xs font-semibold leading-5">Helios Mobile</span>
                    </div>
                    <div className="py-2.5 border-b border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600 text-xs leading-5">Residency</span>
                      <span className="text-slate-800 text-xs font-semibold leading-5">EU-West</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-600 text-xs leading-5">Brands</span>
                      <span className="text-slate-800 text-xs font-semibold leading-5">2</span>
                    </div>
                  </div>

                  {/* Session security */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="pb-2.5">
                      <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Session security</h3>
                    </div>
                    <div className="py-3 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-slate-800 text-xs font-bold leading-5">Idle timeout</span>
                        <span className="text-slate-500 text-xs leading-4">30 minutes</span>
                      </div>
                      <div className="w-10 h-6 bg-lime-600 rounded-full p-[3px] flex items-center justify-end cursor-pointer">
                        <div className="size-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <div className="py-3 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-slate-800 text-xs font-bold leading-5">Re-auth for sensitive actions</span>
                        <span className="text-slate-500 text-xs leading-4">Key rotation, billing</span>
                      </div>
                      <div className="w-10 h-6 bg-lime-600 rounded-full p-[3px] flex items-center justify-end cursor-pointer">
                        <div className="size-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <BrandsPanel />

                <RolesPanel tenantUsers={tenantUsers} usersLoading={usersLoading} usersError={usersError} />

                {/* Audit Log */}
                <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm mt-2">
                  <div className="px-5 py-4 border-b border-slate-200">
                    <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">Audit log</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TIME</th>
                          <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ACTOR</th>
                          <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        <tr>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">09:42</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">Alex Mercer</td>
                          <td className="px-6 py-4 text-xs text-slate-500">Enabled service: Notifications & Campaigns</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">09:38</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">Rhea Tan</td>
                          <td className="px-6 py-4 text-xs text-slate-500">Rotated sandbox API key</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">Yesterday</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">Sam Okafor</td>
                          <td className="px-6 py-4 text-xs text-slate-500">Generated evidence pack</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">Yesterday</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">Alex Mercer</td>
                          <td className="px-6 py-4 text-xs text-slate-500">Invited user: Dana Hill (Viewer)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">Jun 22</td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-700">System</td>
                          <td className="px-6 py-4 text-xs text-slate-500">SSO (Okta) connected</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <LockedPanel label="Admin Settings" />
            ))}

            {/* Integration Tab */}
            {currentTab === "Integration" && (canAccess(TAB_DOMAIN.Integration) ? (
              <IntegrationTab />
            ) : (
              <LockedPanel label="Integrations" />
            ))}


            {/* Live Integration Logs Terminal */}
            {currentTab === "Services" && (
              <section className="self-stretch mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-slate-300 w-full shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Live Integration Logs</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-sans">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Streaming
                  </div>
                </div>

                <div className="h-64 overflow-y-auto flex flex-col gap-1 text-[11px] leading-5">
                  {logs.length > 0 ? (
                    logs.map((log, idx) => {
                      let lineClass = "text-slate-300";
                      if (log.includes("ERROR") || log.includes("status\":4") || log.includes("status\":5") || log.includes("status\": 4") || log.includes("status\": 5")) {
                        lineClass = "text-rose-400";
                      } else if (log.includes("level\":\"WARN\"")) {
                        lineClass = "text-amber-400";
                      } else if (log.includes("level\":\"INFO\"") || log.includes("status\":2") || log.includes("status\": 2") || log.includes("gRPC server starting")) {
                        lineClass = "text-emerald-400/90";
                      }

                      return (
                        <div key={idx} className={`hover:bg-slate-800/40 px-2 py-0.5 rounded transition ${lineClass} break-all`}>
                          {log}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-500 italic text-center pt-24">No live logs received from backend. Check docker compose status.</div>
                  )}
                </div>
              </section>
            )}

          </div>

        </main>

        {/* Live Service Management Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${selectedService.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                    Manage: {selectedService.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Microservice Port: {selectedServicePort[selectedService.id]} · Status: {selectedService.active ? "ONLINE" : "OFFLINE"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setApiResponse(null);
                    setSelectedEndpoint("");
                  }}
                  className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5">

                {/* Endpoint Template Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select API Endpoint Template</label>
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => {
                      const idx = e.target.value === "" ? -1 : parseInt(e.target.value);
                      setSelectedEndpoint(e.target.value);
                      if (idx >= 0) {
                        const template = endpointTemplates[selectedService.id]?.[idx];
                        if (template) {
                          setRequestMethod(template.method);
                          setRequestPath(template.path);
                          setRequestHeaders(JSON.stringify(template.headers, null, 2));
                          setRequestBody(template.body ? JSON.stringify(template.body, null, 2) : "");
                        }
                      } else {
                        setRequestMethod("GET");
                        setRequestPath("/health");
                        setRequestHeaders(`{\n  "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"\n}`);
                        setRequestBody("");
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-sans"
                  >
                    <option value="">-- Custom Endpoint / Health Check --</option>
                    {endpointTemplates[selectedService.id]?.map((tmpl, idx) => (
                      <option key={idx} value={idx}>{tmpl.label}</option>
                    ))}
                  </select>
                </div>

                {/* Method & Path inputs */}
                <div className="flex gap-3">
                  <div className="w-24">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Method</label>
                    <select
                      value={requestMethod}
                      onChange={(e) => setRequestMethod(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none text-slate-700 font-bold font-mono"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Path</label>
                    <input
                      type="text"
                      value={requestPath}
                      onChange={(e) => setRequestPath(e.target.value)}
                      placeholder="/health"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-mono"
                    />
                  </div>
                </div>

                {/* Headers Editor */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Headers (JSON)</label>
                  <textarea
                    value={requestHeaders}
                    onChange={(e) => setRequestHeaders(e.target.value)}
                    rows={3}
                    placeholder='{ "X-Tenant-ID": "uuid" }'
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none font-mono text-slate-700"
                  />
                </div>

                {/* Body Editor (only for writing methods) */}
                {(requestMethod === "POST" || requestMethod === "PUT") && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Request Body (JSON)</label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={5}
                      placeholder="{}"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none font-mono text-slate-700"
                    />
                  </div>
                )}

                {/* API Response Console */}
                {apiResponse && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">API Response Console</label>
                    <div className={`p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-60 border ${apiResponse.ok ? "bg-slate-900 border-slate-800 text-emerald-400" : "bg-rose-950/20 border-rose-900/30 text-rose-300"
                      }`}>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                        <span className="font-bold">STATUS: {apiResponse.status} {apiResponse.ok ? "OK" : "ERROR"}</span>
                        <span className="text-[10px] text-slate-500">Universal API Proxy Active</span>
                      </div>
                      <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedService(null);
                    setApiResponse(null);
                    setSelectedEndpoint("");
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition font-bold"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    setApiLoading(true);
                    setApiResponse(null);
                    try {
                      let parsedHeaders = {};
                      if (requestHeaders.trim()) {
                        parsedHeaders = JSON.parse(requestHeaders);
                      }
                      let parsedBody = null;
                      if (requestBody.trim() && (requestMethod === "POST" || requestMethod === "PUT")) {
                        parsedBody = JSON.parse(requestBody);
                      }

                      let port = selectedServicePort[selectedService.id];
                      if (requestPath.startsWith("/api/v1/auth/") || requestPath.startsWith("/v1/tenants") || requestPath.startsWith("/v1/sessions")) {
                        port = 8080;
                      }

                      const res = await fetch("/api/proxy", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          port,
                          method: requestMethod,
                          path: requestPath,
                          headers: parsedHeaders,
                          body: parsedBody
                        })
                      });

                      if (res.ok) {
                        const data = await res.json();
                        setApiResponse(data);
                      } else {
                        setApiResponse({ status: res.status, ok: false, data: "Failed to communicate with proxy service." });
                      }
                    } catch (err) {
                      setApiResponse({ status: 400, ok: false, data: "JSON Parsing Error: " + String(err) });
                    } finally {
                      setApiLoading(false);
                    }
                  }}
                  disabled={apiLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition shadow flex items-center gap-2"
                >
                  {apiLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Executing...
                    </>
                  ) : (
                    "Execute API Call"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New User Invite Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[600px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-200">
                <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">New user</h2>
                <button
                  onClick={closeInviteModal}
                  aria-label="Close"
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Full name</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold">Temporary password</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="temp-password"
                      value={invitePassword}
                      onChange={(e) => setInvitePassword(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm font-mono"
                    />
                    <button
                      onClick={() => setInvitePassword(generatePassword())}
                      className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold transition border border-slate-300 shadow-sm cursor-pointer"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">At least 12 characters — shown once after creation, so save it.</p>
                </div>

                <div className="pt-2">
                  <h3 className="text-slate-500 text-[11px] font-bold tracking-wider uppercase mb-3">What can they access?</h3>
                  <PermissionPicker rules={inviteRules} onChange={setInviteRules} />
                  {inviteRules.length === 0 && (
                    <p className="text-slate-500 text-xs mt-2">
                      Nothing selected — this user will be able to sign in but won&apos;t see any dashboard
                      section yet. You can also assign them a role later.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={closeInviteModal}
                  className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-sm cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isCreatingUser}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-70 flex items-center gap-2"
                >
                  {isCreatingUser ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : "Create user"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Success Modal */}
        {createdUserDetails && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-[#0f172a] border border-slate-700/60 rounded-xl shadow-2xl w-[500px] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-700/60">
                <h2 className="text-white text-lg font-bold">User created</h2>
                <button
                  onClick={() => setCreatedUserDetails(null)}
                  aria-label="Close"
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-5">
                <p className="text-slate-300 text-sm leading-relaxed">
                  This is the only time the temporary password is shown. Copy it now and share it with them securely.
                </p>

                <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 font-mono text-[13px] text-slate-300 shadow-inner whitespace-pre-wrap">
                  {buildInvite({
                    label: "your account",
                    tenantId: createdUserDetails.tenantId,
                    email: createdUserDetails.email,
                    password: createdUserDetails.password,
                  })}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(buildInvite({
                      label: "your account",
                      tenantId: createdUserDetails.tenantId,
                      email: createdUserDetails.email,
                      password: createdUserDetails.password,
                    }));
                    toast.success("Login details copied");
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white border border-slate-600 rounded-lg text-sm font-semibold transition cursor-pointer"
                >
                  Copy login details
                </button>
              </div>

              {/* Footer */}
              <div className="p-5 flex justify-end gap-3">
                <button
                  onClick={() => setCreatedUserDetails(null)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg text-sm font-bold transition shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Config mappings for BSS cockpit API client
const selectedServicePort: Record<string, number> = {
  "prod-catalog": 8082,
  "rt-charging": 8085,
  "rating-engine": 8085,
  "billing-invoice": 8092,
  "payments-collections": 8096,
  "partner-settlement": 8086,
  "cust-lifecycle": 8081,
  "notifications-campaigns": 8097,
  "esim-sim-mgmt": 8083,
  "iot-connectivity": 8083,
  "number-inventory": 8083,
  "taxation-regulatory": 8089,
  "compliance-kyc": 8091,
  "evidence-ledger": 8093,
  "ai-gov-controls": 8098,
  "analytics-reporting": 8098,
  "mediation-usage": 8094,
  "api-gateway": 8097,
};

interface EndpointTemplate {
  label: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: any;
}

const endpointTemplates: Record<string, EndpointTemplate[]> = {
  "prod-catalog": [
    {
      label: "Step 3a: Create Product Specification (POST /v1/products)",
      method: "POST",
      path: "/v1/products",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        product_name: "Premium 5G Unlimited Plan",
        product_type: "DATA",
        charging_model: "RECURRING",
        charge_structure: "FLAT",
        currency_code: "USD",
        tax_category: "TELECOM",
        country_code: "US",
        jurisdiction_code: "US-NY"
      }
    },
    {
      label: "Step 3b: Create Commercial Offer (POST /v1/offers)",
      method: "POST",
      path: "/v1/offers",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        product_id: "prod-1234",
        offer_name: "Promo Offer June 2026",
        description: "Discounted monthly recurring plan",
        country_code: "US",
        jurisdiction_code: "US-NY",
        validity_days: 30
      }
    },
    {
      label: "Step 3c: Associate Price Rule (POST /v1/price-rules)",
      method: "POST",
      path: "/v1/price-rules",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        product_id: "prod-1234",
        offer_id: "offer-1234",
        country_code: "US",
        jurisdiction_code: "US-NY",
        amount_minor_units: 4500,
        currency_code: "USD",
        charge_structure: "FLAT",
        billing_period: "MONTHLY",
        rounding_policy_id: "ROUND_HALF_UP"
      }
    }
  ],
  "rt-charging": [
    {
      label: "Prepaid: Initiate Balance Reservation (POST /v1/charging/reservations)",
      method: "POST",
      path: "/v1/charging/reservations",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        session_id: "charge-session-9988",
        subscriber_id: "sub-0987",
        requested_units: 500,
        service_identifier: "DATA_LTE"
      }
    }
  ],
  "rating-engine": [
    {
      label: "Prepaid: Process Usage CDR (POST /v1/rating/calculate)",
      method: "POST",
      path: "/v1/rating/calculate",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        subscriber_id: "sub-0987",
        volume: 1024,
        unit_type: "OCTETS",
        usage_type: "ROAMING"
      }
    }
  ],
  "billing-invoice": [
    {
      label: "Step 8: Create Draft Invoice (POST /v1/invoices)",
      method: "POST",
      path: "/v1/invoices",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        account_id: "acc-1234",
        billing_period: "2026-06",
        amount_minor_units: 4500,
        currency_code: "USD"
      }
    },
    {
      label: "Trigger Billing Cycle Run (POST /v1/billing/runs)",
      method: "POST",
      path: "/v1/billing/runs",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        bill_cycle_id: "cycle-2026-06",
        account_id: "acc-1234",
        force_run: true
      }
    }
  ],
  "payments-collections": [
    {
      label: "Step 9: Create Payment Intent (POST /v1/payment-intents)",
      method: "POST",
      path: "/v1/payment-intents",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        amount_minor_units: 4500,
        currency: "USD",
        payment_method_token: "tok_visa_4242",
        account_id: "acc-1234"
      }
    }
  ],
  "partner-settlement": [
    {
      label: "Calculate Interconnect Revenue Share (POST /v1/settlements)",
      method: "POST",
      path: "/v1/settlements",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        partner_id: "partner-helios-net",
        traffic_period: "2026-06",
        total_minutes: 45000,
        settlement_rate: 0.02
      }
    }
  ],
  "cust-lifecycle": [
    {
      label: "Step 1: Authenticate / User Login (POST /v1/sessions)",
      method: "POST",
      path: "/v1/sessions",
      headers: {
        "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "X-Brand-ID": "b1a2b3c4-d5e6-47a8-89c0-d1e2f3a4b5c6"
      },
      body: {
        email: "admin@acme.com",
        password: "SecurePassword123",
        device_fingerprint: "browser-chrome-windows-12345"
      }
    },
    {
      label: "Step 2a: Create Party Profile (POST /v1/parties)",
      method: "POST",
      path: "/v1/parties",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        party_type: "INDIVIDUAL",
        pii_token: "f2220099-0000-4000-8000-000000000099",
        data_residency_region: "us-east-1",
        jurisdiction_code: "US-CA"
      }
    },
    {
      label: "Step 2b: Create Customer Profile (POST /v1/customers)",
      method: "POST",
      path: "/v1/customers",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        party_id: "party-5678",
        customer_type: "RETAIL",
        status: "ACTIVE"
      }
    },
    {
      label: "Step 2c: Create Billing Account (POST /v1/accounts)",
      method: "POST",
      path: "/v1/accounts",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        customer_id: "cust-1234",
        account_number: "ACC-54321",
        account_type: "RETAIL",
        currency_code: "USD",
        credit_limit_minor_units: 100000,
        credit_limit_currency_code: "USD"
      }
    }
  ],
  "notifications-campaigns": [
    {
      label: "Send Campaign Push Alert (POST /v1/campaigns/send)",
      method: "POST",
      path: "/v1/campaigns/send",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        campaign_name: "Summer Unlimited Upgrade",
        target_group: "high_data_users",
        message_template: "Upgrade to unlimited 5G data today for only $10 extra!"
      }
    }
  ],
  "esim-sim-mgmt": [
    {
      label: "Step 4: Place Product Order (POST /v1/orders)",
      method: "POST",
      path: "/v1/orders",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        customer_id: "cust-1234",
        account_id: "acc-1234",
        order_type: "NEW_SERVICE",
        catalog_version_id: "CATALOG-2026-Q2",
        currency_code: "USD",
        country_code: "US",
        jurisdiction_code: "US-CA"
      }
    },
    {
      label: "Step 5a: Provision eSIM Profile (POST /v1/provisioning)",
      method: "POST",
      path: "/v1/provisioning",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        order_id: "order-1234",
        customer_id: "cust-1234",
        account_id: "acc-1234",
        product_id: "prod-1234",
        service_type: "MOBILE_DATA",
        jurisdiction_code: "US-CA"
      }
    },
    {
      label: "Step 5b: Register SIM (POST /v1/sims)",
      method: "POST",
      path: "/v1/sims",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        iccid: "8904903200000888990",
        imsi: "310410123456789",
        status: "INVENTORY"
      }
    },
    {
      label: "Step 5c: Activate SIM Profile (PATCH /v1/sims/{id})",
      method: "PATCH",
      path: "/v1/sims/8904903200000888990",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        action: "ACTIVATE"
      }
    }
  ],
  "iot-connectivity": [
    {
      label: "Register IoT Device Fleet (POST /v1/iot/devices)",
      method: "POST",
      path: "/v1/iot/devices",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        device_imei: "354920009988221",
        model: "SensNode-v2",
        activation_profile: "IOT_LIGHT"
      }
    }
  ],
  "number-inventory": [
    {
      label: "Reserve MSISDN Phone Number (POST /v1/numbers/reserve)",
      method: "POST",
      path: "/v1/numbers/reserve",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        msisdn: "+12125550199",
        reservation_timeout_seconds: 600
      }
    }
  ],
  "taxation-regulatory": [
    {
      label: "Step 7a: Create Jurisdiction Policy (POST /v1/jurisdiction-policies)",
      method: "POST",
      path: "/v1/jurisdiction-policies",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        jurisdiction_code: "US-NY",
        tax_rate: 0.0875,
        status: "ACTIVE"
      }
    },
    {
      label: "Step 7b: Request Tax Decision (POST /v1/tax-decisions)",
      method: "POST",
      path: "/v1/tax-decisions",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        amount_minor_units: 5000,
        tax_category: "TELECOM",
        country_code: "US",
        jurisdiction_code: "US-NY"
      }
    }
  ],
  "compliance-kyc": [
    {
      label: "Step 6a: Start KYC Verification (POST /v1/kyc/cases)",
      method: "POST",
      path: "/v1/kyc/cases",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        customer_id: "cust-1234",
        document_type: "PASSPORT",
        document_number: "US1234567"
      }
    },
    {
      label: "Step 6b: Submit KYC Documentation (PATCH /v1/kyc/cases/{id}/submit)",
      method: "PATCH",
      path: "/v1/kyc/cases/kyc-case-9988/submit",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: {
        verification_status: "SUBMITTED"
      }
    }
  ],
  "evidence-ledger": [
    {
      label: "Step 10: Verify Audit/Evidence Chain (GET /v1/evidence/verify)",
      method: "GET",
      path: "/v1/evidence/verify",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: null
    },
    {
      label: "Append Auditing Log Evidence (POST /v1/evidence)",
      method: "POST",
      path: "/v1/evidence",
      headers: {},
      body: {
        subject_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        action: "BILL_CYCLE_COMPLETE",
        payload_hash: "8f7d9a1b6c0e3a5f4d2c8b7a69f0e1d2c3b4a5d6e7f8",
        signed_by: "billing-invoice-service"
      }
    }
  ],
  "ai-gov-controls": [
    {
      label: "Get AI Governance Status (GET /v1/ai/controls)",
      method: "GET",
      path: "/v1/ai/controls",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: null
    }
  ],
  "analytics-reporting": [
    {
      label: "Generate Revenue Report (GET /v1/reports/revenue)",
      method: "GET",
      path: "/v1/reports/revenue",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: null
    }
  ],
  "mediation-usage": [
    {
      label: "Mediate Ingested CDR record (POST /v1/usage/cdrs)",
      method: "POST",
      path: "/v1/usage/cdrs",
      headers: {},
      body: {
        calling_party: "+12125550199",
        called_party: "+12125550100",
        duration_seconds: 120,
        usage_type: "VOICE",
        timestamp: "2026-06-29T10:00:00Z"
      }
    }
  ],
  "api-gateway": [
    {
      label: "List Active Webhook Subscriptions (GET /v1/developer/keys)",
      method: "GET",
      path: "/v1/developer/keys",
      headers: { "X-Tenant-ID": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
      body: null
    }
  ]
};
