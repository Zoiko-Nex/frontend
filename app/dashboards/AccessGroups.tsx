"use client";

/**
 * Access Groups — identity-tenancy (8080).
 *
 * The other half of RBAC. The dashboard already manages roles and binds policy
 * rules to them; groups were the nine endpoints nobody called, which meant a
 * tenant could only grant access user-by-user through roles. A group is the
 * layer that makes "everyone in Billing Ops" a thing you can grant to once
 * rather than per person.
 *
 * Permission resolution matters here and is easy to get wrong: GET /v1/me
 * returns the caller's effective rules resolved from roles AND group
 * membership together (authorization.go GetEffectivePermissions). So a user can
 * hold a permission that appears on no role they have — it came through a
 * group. That is exactly why this screen needs to exist: without it, an
 * operator auditing "why can this person do that" has no way to see the group
 * half of the answer.
 *
 * Deny overrides allow, platform-wide. A DENY rule here beats an ALLOW on the
 * user's role, so the effect column says so rather than leaving it implied.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { errMessage, shortId } from "@/lib/admin/envelope";
import { PermissionPicker, type PolicyRule } from "../components/admin/PermissionPicker";
import {
  Field,
  Modal,
  ModalActions,
  StatusPill,
  TableState,
  inputClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";

interface Group {
  group_id?: string;
  id?: string;
  name?: string;
  description?: string;
  created_at?: string;
}

interface TenantUser {
  id?: string;
  user_id?: string;
  email?: string;
  full_name?: string;
  status?: string;
}

/** The service returns group ids under either key depending on the handler. */
const gid = (g: Group) => g.group_id ?? g.id ?? "";

export default function AccessGroups() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [permsFor, setPermsFor] = useState<Group | null>(null);
  const [membersFor, setMembersFor] = useState<Group | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  // ─── Queries ────────────────────────────────────────────────────────────────

  const groupsQ = useQuery({
    queryKey: ["identity", "groups"],
    queryFn: async () => (await api.get<{ groups?: Group[] }>("identity", "/v1/groups")).groups ?? [],
  });
  const groups = groupsQ.data ?? [];

  const usersQ = useQuery({
    queryKey: ["identity", "users"],
    queryFn: async () => (await api.get<{ users?: TenantUser[] }>("identity", "/v1/users")).users ?? [],
  });
  const users = usersQ.data ?? [];

  const permsQ = useQuery({
    queryKey: ["identity", "group-permissions", permsFor && gid(permsFor)],
    enabled: !!permsFor,
    queryFn: async () =>
      (await api.get<{ rules?: PolicyRule[] }>("identity", `/v1/groups/${gid(permsFor!)}/permissions`)).rules ?? [],
  });

  const membersQ = useQuery({
    queryKey: ["identity", "group-members", membersFor && gid(membersFor)],
    enabled: !!membersFor,
    queryFn: async () =>
      (await api.get<{ user_ids?: string[] }>("identity", `/v1/groups/${gid(membersFor!)}/members`)).user_ids ?? [],
  });

  /**
   * Member counts for the table. There is no count on the group record and no
   * bulk endpoint, so this fans out one call per group. One failing must not
   * blank the column, so each is caught individually.
   */
  const countsQ = useQuery({
    queryKey: ["identity", "group-member-counts", groups.map(gid).join(",")],
    enabled: groups.length > 0,
    queryFn: async () => {
      const entries = await Promise.all(
        groups.map(async (g) => {
          try {
            const res = await api.get<{ user_ids?: string[] }>("identity", `/v1/groups/${gid(g)}/members`);
            return [gid(g), (res.user_ids ?? []).length] as const;
          } catch {
            return [gid(g), -1] as const; // -1 renders as "?" rather than 0
          }
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [form, setForm] = useState({ name: "", description: "" });
  const [draftRules, setDraftRules] = useState<PolicyRule[]>([]);
  const [addUserId, setAddUserId] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createGroup = useMutation({
    mutationFn: () => api.post("identity", "/v1/groups", { name: form.name, description: form.description }),
    onSuccess: () => {
      toast.success("Group created — it grants nothing until permissions are bound to it");
      setCreateOpen(false);
      setForm({ name: "", description: "" });
      qc.invalidateQueries({ queryKey: ["identity", "groups"] });
    },
    onError: fail("Could not create the group"),
  });

  const savePerms = useMutation({
    mutationFn: () => api.put("identity", `/v1/groups/${gid(permsFor!)}/permissions`, { rules: draftRules }),
    onSuccess: () => {
      toast.success("Group permissions replaced");
      qc.invalidateQueries({ queryKey: ["identity", "group-permissions"] });
      setPermsFor(null);
    },
    onError: fail("Could not save the group permissions"),
  });

  const addMember = useMutation({
    mutationFn: () => api.post("identity", `/v1/groups/${gid(membersFor!)}/members`, { user_id: addUserId }),
    onSuccess: () => {
      toast.success("Member added");
      setAddUserId("");
      qc.invalidateQueries({ queryKey: ["identity", "group-members"] });
      qc.invalidateQueries({ queryKey: ["identity", "group-member-counts"] });
    },
    onError: fail("Could not add the member"),
  });

  const removeMember = useMutation({
    mutationFn: (userId: string) => api.del("identity", `/v1/groups/${gid(membersFor!)}/members/${userId}`),
    onSuccess: () => {
      toast.success("Member removed");
      qc.invalidateQueries({ queryKey: ["identity", "group-members"] });
      qc.invalidateQueries({ queryKey: ["identity", "group-member-counts"] });
    },
    onError: fail("Could not remove the member"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const counts = countsQ.data ?? {};
  const totalMemberships = Object.values(counts).filter((n) => n >= 0).reduce((a, b) => a + b, 0);
  const emptyGroups = groups.filter((g) => counts[gid(g)] === 0).length;
  const memberEmail = (id: string) => users.find((u) => (u.id ?? u.user_id) === id)?.email ?? shortId(id);
  const currentMembers = membersQ.data ?? [];

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Access Groups
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Grant once to a group instead of per user. Effective permissions resolve from roles and groups together —
            deny overrides allow.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          + Create Group
        </button>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryTile label="GROUPS" value={groupsQ.isLoading ? "…" : String(groups.length)} />
        <SummaryTile label="MEMBERSHIPS" value={countsQ.isLoading ? "…" : String(totalMemberships)} hint="Across all groups" />
        <SummaryTile
          label="EMPTY GROUPS"
          value={countsQ.isLoading ? "…" : String(emptyGroups)}
          hint={emptyGroups > 0 ? "Granting to nobody" : "All groups have members"}
        />
      </div>

      <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">GROUP</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DESCRIPTION</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MEMBERS</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CREATED</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <TableState
                colSpan={5}
                loading={groupsQ.isLoading}
                error={groupsQ.error}
                empty={groups.length === 0}
                loadingLabel="Loading groups…"
                emptyLabel="No access groups. Permissions are being granted per user through roles only."
              />
              {groups.map((g) => {
                const n = counts[gid(g)];
                return (
                  <tr key={gid(g)} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{g.name ?? "—"}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{shortId(gid(g))}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-normal max-w-[280px]">
                      {g.description || "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {countsQ.isLoading ? "…" : n === -1 ? "?" : n === 0 ? <span className="text-amber-600">0</span> : n}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {g.created_at ? new Date(g.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => setMembersFor(g)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Members
                        </button>
                        <button
                          onClick={() => { setDraftRules([]); setPermsFor(g); }}
                          className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Permissions
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create ───────────────────────────────────────────────────────── */}
      {createOpen && (
        <Modal
          title="Create an access group"
          subtitle="A new group grants nothing until permissions are bound to it and members are added."
          onClose={() => setCreateOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCreateOpen(false)}
              onConfirm={() => createGroup.mutate()}
              confirmLabel="Create group"
              pendingLabel="Creating…"
              pending={createGroup.isPending}
              disabled={!form.name.trim()}
            />
          }
        >
          <Field label="Name">
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Billing Operations" />
          </Field>
          <Field label="Description">
            <input className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </Modal>
      )}

      {/* ─── Permissions ──────────────────────────────────────────────────── */}
      {permsFor && (
        <Modal
          title={`Permissions · ${permsFor.name ?? shortId(gid(permsFor))}`}
          subtitle="Saving REPLACES the group's whole rule set — it is a PUT, not a merge. Deny overrides allow."
          width="w-[640px]"
          onClose={() => setPermsFor(null)}
          footer={
            <ModalActions
              onCancel={() => setPermsFor(null)}
              onConfirm={() => savePerms.mutate()}
              confirmLabel="Replace permissions"
              pendingLabel="Saving…"
              pending={savePerms.isPending}
            />
          }
        >
          {permsQ.isLoading ? (
            <p className="text-[11px] text-slate-400">Loading current rules…</p>
          ) : permsQ.isError ? (
            <p className="text-[11px] text-rose-600">{errMessage(permsQ.error, "Could not load the current rules.")}</p>
          ) : (
            <>
              <div>
                <div className="text-[11px] font-semibold text-slate-700 mb-1">Currently bound</div>
                {(permsQ.data ?? []).length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No rules bound — this group grants nothing today.
                  </p>
                ) : (
                  <ul className="text-[10px] font-mono text-slate-600 space-y-0.5">
                    {(permsQ.data ?? []).map((r, i) => (
                      <li key={i}>
                        <span className={r.effect?.toUpperCase() === "DENY" ? "text-rose-600 font-bold" : "text-emerald-600"}>
                          {r.effect}
                        </span>{" "}
                        {r.action_pattern} on {r.resource_pattern}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="text-[11px] font-semibold text-slate-700 mb-1">New rule set</div>
                <PermissionPicker rules={draftRules} onChange={setDraftRules} />
              </div>

              {draftRules.length === 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Saving with an empty set strips every permission from this group. If that is not the intent, add the
                  rules you want kept — this endpoint replaces rather than merges.
                </p>
              )}
            </>
          )}
        </Modal>
      )}

      {/* ─── Members ──────────────────────────────────────────────────────── */}
      {membersFor && (
        <Modal
          title={`Members · ${membersFor.name ?? shortId(gid(membersFor))}`}
          subtitle="Everyone here inherits the group's permissions on top of whatever their roles grant."
          width="w-[560px]"
          onClose={() => setMembersFor(null)}
        >
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Field label="Add a user">
                <select className={inputClass} value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
                  <option value="">— select a user —</option>
                  {users
                    .filter((u) => !currentMembers.includes((u.id ?? u.user_id) ?? ""))
                    .map((u) => (
                      <option key={u.id ?? u.user_id} value={(u.id ?? u.user_id) ?? ""}>
                        {u.email} {u.full_name ? `· ${u.full_name}` : ""}
                      </option>
                    ))}
                </select>
              </Field>
            </div>
            <button
              onClick={() => addMember.mutate()}
              disabled={!addUserId || addMember.isPending}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer mb-[1px]"
            >
              {addMember.isPending ? "Adding…" : "Add"}
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr><th className="px-3 py-2">MEMBER</th><th className="px-3 py-2 text-right">ACTION</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={2}
                  loading={membersQ.isLoading}
                  error={membersQ.error}
                  empty={currentMembers.length === 0}
                  emptyLabel="No members — this group grants to nobody."
                />
                {currentMembers.map((uid) => (
                  <tr key={uid}>
                    <td className="px-3 py-2">
                      {memberEmail(uid)}
                      <div className="font-mono text-[9px] text-slate-400">{shortId(uid)}</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => removeMember.mutate(uid)}
                        disabled={removeMember.isPending}
                        className="px-2 py-1 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
