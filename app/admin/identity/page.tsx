"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { ApiException } from "@/lib/admin/client";
import { useAuth } from "../_components/useAuth";
import { permissionDomains } from "../_components/nav";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, EmptyState, LoadingRows, ErrorBanner,
} from "../_components/ui";
import StatusBadge from "../_components/StatusBadge";
import { buildInvite, CopyButton, generatePassword } from "../_components/invite";

type Tab = "users" | "sessions" | "roles" | "groups" | "policies";

interface User { user_id?: string; id?: string; email?: string; full_name?: string; status?: string; brand_id?: string; }
interface Session { session_id?: string; id?: string; user_id?: string; status?: string; created_at?: string; device_fingerprint?: string; ip_address?: string; }
interface Role { role_id?: string; id?: string; name?: string; description?: string; }
interface Group { group_id?: string; id?: string; name?: string; }
interface PolicyRule { effect: string; action_pattern: string; resource_pattern: string; }

export default function IdentityPage() {
  const [tab, setTab] = useState<Tab>("users");
  return (
    <div>
      <SectionHeader title="Identity & Tenancy" subtitle="Operators, sessions, roles, groups and access policies for this tenant." />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--ax-border)" }}>
        {(["users", "sessions", "roles", "groups", "policies"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {tab === "users" && <UsersTab />}
      {tab === "sessions" && <SessionsTab />}
      {tab === "roles" && <RolesTab />}
      {tab === "groups" && <GroupsTab />}
      {tab === "policies" && <PoliciesTab />}
    </div>
  );
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: "9px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13,
    color: active ? "var(--ax-text)" : "var(--ax-text-dim)", fontWeight: active ? 600 : 400,
    borderBottom: active ? "2px solid var(--ax-accent)" : "2px solid transparent", marginBottom: -1,
  };
}

/* ───────── Users ───────── */
function UsersTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const q = useQuery({
    queryKey: ["identity", "users"],
    queryFn: () => api.get<{ users?: User[]; items?: User[] }>("identity", "/v1/users"),
  });
  const users = q.data?.users ?? q.data?.items ?? [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New user</Button>
      </div>
      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>User ID</Th><Th>Email</Th><Th>Name</Th><Th>Status</Th></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={4} /> : users.length === 0 ? (
              <tr><Td style={{ padding: 0 }}><div style={{ gridColumn: "1 / -1" }}><EmptyState title="No users" hint="Create your first operator for this tenant." /></div></Td></tr>
            ) : users.map((u) => (
              <Tr key={u.user_id || u.id}>
                <Td><CopyId value={u.user_id || u.id} /></Td>
                <Td>{u.email || "—"}</Td>
                <Td style={{ color: "var(--ax-text-dim)" }}>{u.full_name || "—"}</Td>
                <Td><StatusBadge status={u.status} /></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {open && <NewUserModal onClose={() => setOpen(false)} onDone={() => qc.invalidateQueries({ queryKey: ["identity", "users"] })} />}
    </div>
  );
}

/* ───────── New user: identity + permissions in one screen ───────── */
function NewUserModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { session } = useAuth();
  const domains = permissionDomains();
  const [form, setForm] = useState({
    email: "", full_name: "", password: "",
    brand_id: session?.brandId || "",
  });
  const [granted, setGranted] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ email: string; password: string } | null>(null);

  const toggle = (domain: string) => {
    const next = new Set(granted);
    if (next.has(domain)) next.delete(domain); else next.add(domain);
    setGranted(next);
  };

  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/users", {
      email: form.email, full_name: form.full_name, brand_id: form.brand_id, password: form.password,
      rules: Array.from(granted).map((domain) => ({ effect: "allow", action_pattern: `${domain}:*`, resource_pattern: "*" })),
    }),
    onSuccess: () => { toast.success("User created"); onDone(); setResult({ email: form.email, password: form.password }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create user"),
  });

  const valid = form.email && form.full_name && form.brand_id && form.password.length >= 12;

  if (result) {
    const invite = buildInvite({ label: "your account", tenantId: session?.tenantId, email: result.email, password: result.password });
    return (
      <Modal open onClose={onClose} title="User created" width={460}
        footer={<Button variant="primary" onClick={onClose}>Done</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>
            This is the only time the temporary password is shown. Copy it now and share it with them securely.
          </p>
          <pre className="mono" style={{ fontSize: 12.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", margin: 0 }}>{invite}</pre>
          <CopyButton text={invite} label="Copy login details" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="New user" width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} loading={create.isPending} onClick={() => create.mutate()}>Create user</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
        <Field label="Temporary password" hint="At least 12 characters — shown once after creation, so save it.">
          <div style={{ display: "flex", gap: 8 }}>
            <Input type="text" className="mono" style={{ flex: 1 }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button variant="default" type="button" onClick={() => setForm({ ...form, password: generatePassword() })}>Generate</Button>
          </div>
        </Field>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 10 }}>
            What can they access?
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
            {domains.map((d) => (
              <label key={d.domain} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={granted.has(d.domain)} onChange={() => toggle(d.domain)} />
                {d.label}
              </label>
            ))}
          </div>
          {granted.size === 0 && (
            <p style={{ fontSize: 12, color: "var(--ax-text-faint)", marginTop: 8 }}>
              Nothing selected — this user will be able to sign in but won&apos;t see any dashboard section yet.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ───────── Sessions ───────── */
function SessionsTab() {
  const q = useQuery({
    queryKey: ["identity", "sessions"],
    queryFn: () => api.get<{ sessions?: Session[] }>("identity", "/v1/sessions"),
  });
  const sessions = q.data?.sessions ?? [];
  return q.isError ? <ErrorBanner error={q.error} /> : (
    <Table>
      <thead><tr><Th>Session ID</Th><Th>User</Th><Th>Status</Th><Th>Device</Th></tr></thead>
      <tbody>
        {q.isLoading ? <LoadingRows cols={4} /> : sessions.length === 0 ? (
          <Tr><Td>—</Td><Td /><Td /><Td /></Tr>
        ) : sessions.map((s, i) => (
          <Tr key={s.session_id || s.id || i}>
            <Td><CopyId value={s.session_id || s.id} /></Td>
            <Td><CopyId value={s.user_id} /></Td>
            <Td><StatusBadge status={s.status || "ACTIVE"} /></Td>
            <Td className="mono" style={{ color: "var(--ax-text-dim)", fontSize: 12 }}>{s.device_fingerprint || s.ip_address || "—"}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

/* ───────── Roles ───────── */
function RolesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [managing, setManaging] = useState<Role | null>(null);

  const q = useQuery({
    queryKey: ["identity", "roles"],
    queryFn: () => api.get<{ roles?: Role[] }>("identity", "/v1/roles"),
  });
  const roles = q.data?.roles ?? [];

  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/roles", form),
    onSuccess: () => { toast.success("Role created"); setOpen(false); setForm({ name: "", description: "" }); qc.invalidateQueries({ queryKey: ["identity", "roles"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          A role bundles a set of dashboard permissions. Create a role, pick which sections it can access,
          then assign users to it — a user with only a &quot;Billing&quot; role will only see Billing &amp;
          Payments in their sidebar.
        </p>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New role</Button>
      </div>

      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Role</Th><Th>Description</Th><Th /></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={3} /> : roles.length === 0 ? (
              <tr><Td style={{ padding: 0 }}><EmptyState title="No roles yet" hint="Create one to start assigning granular permissions to users." /></Td><Td /><Td /></tr>
            ) : roles.map((r) => (
              <Tr key={r.role_id || r.id}>
                <Td style={{ fontWeight: 500 }}>{r.name}</Td>
                <Td style={{ color: "var(--ax-text-dim)" }}>{r.description || "—"}</Td>
                <Td style={{ textAlign: "right" }}><Button variant="default" onClick={() => setManaging(r)}>Manage</Button></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New role"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="finance_operator" /></Field>
          <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        </div>
      </Modal>

      {managing && <RoleManageModal role={managing} onClose={() => setManaging(null)} />}
    </div>
  );
}

/* ───────── Role permission + member management ───────── */
function RoleManageModal({ role, onClose }: { role: Role; onClose: () => void }) {
  const qc = useQueryClient();
  const roleId = (role.role_id || role.id)!;
  const domains = permissionDomains();

  const permsQ = useQuery({
    queryKey: ["identity", "roles", roleId, "permissions"],
    queryFn: () => api.get<{ rules?: PolicyRule[] }>("identity", `/v1/roles/${roleId}/permissions`),
  });
  const membersQ = useQuery({
    queryKey: ["identity", "roles", roleId, "members"],
    queryFn: () => api.get<{ user_ids?: string[] }>("identity", `/v1/roles/${roleId}/members`),
  });
  const usersQ = useQuery({
    queryKey: ["identity", "users"],
    queryFn: () => api.get<{ users?: User[]; items?: User[] }>("identity", "/v1/users"),
  });
  const users = usersQ.data?.users ?? usersQ.data?.items ?? [];
  const emailFor = (userId: string) => users.find((u) => (u.user_id || u.id) === userId)?.email || userId;

  const [checked, setChecked] = useState<Set<string> | null>(null);
  const grantedDomains = checked ?? new Set(
    (permsQ.data?.rules ?? [])
      .filter((rule) => rule.effect?.toLowerCase() === "allow")
      .flatMap((rule) => domains.filter((d) => rule.action_pattern === "*" || rule.action_pattern.startsWith(`${d.domain}:`)).map((d) => d.domain)),
  );

  const toggle = (domain: string) => {
    const next = new Set(grantedDomains);
    if (next.has(domain)) next.delete(domain); else next.add(domain);
    setChecked(next);
  };

  const savePermissions = useMutation({
    mutationFn: () => api.put("identity", `/v1/roles/${roleId}/permissions`, {
      rules: Array.from(grantedDomains).map((domain) => ({ effect: "allow", action_pattern: `${domain}:*`, resource_pattern: "*" })),
    }),
    onSuccess: () => { toast.success("Permissions saved"); qc.invalidateQueries({ queryKey: ["identity", "roles", roleId, "permissions"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to save permissions"),
  });

  const [assignId, setAssignId] = useState("");
  const assign = useMutation({
    mutationFn: () => api.post("identity", `/v1/roles/${roleId}/members`, { user_id: assignId }),
    onSuccess: () => { toast.success("User assigned"); setAssignId(""); qc.invalidateQueries({ queryKey: ["identity", "roles", roleId, "members"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to assign user"),
  });
  const unassign = useMutation({
    mutationFn: (userId: string) => api.del("identity", `/v1/roles/${roleId}/members/${userId}`),
    onSuccess: () => { toast.success("User removed"); qc.invalidateQueries({ queryKey: ["identity", "roles", roleId, "members"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to remove user"),
  });

  return (
    <Modal open onClose={onClose} title={`Manage "${role.name}"`} width={560}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button variant="primary" loading={savePermissions.isPending} onClick={() => savePermissions.mutate()}>Save permissions</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 10 }}>
            Dashboard access
          </div>
          {permsQ.isLoading ? <div style={{ fontSize: 13, color: "var(--ax-text-faint)" }}>Loading…</div> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {domains.map((d) => (
                <label key={d.domain} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={grantedDomains.has(d.domain)} onChange={() => toggle(d.domain)} />
                  {d.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 10 }}>
            Assigned users
          </div>
          {membersQ.isLoading ? <div style={{ fontSize: 13, color: "var(--ax-text-faint)" }}>Loading…</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {(membersQ.data?.user_ids ?? []).length === 0 ? (
                <div style={{ fontSize: 12.5, color: "var(--ax-text-faint)" }}>No users assigned yet.</div>
              ) : membersQ.data!.user_ids!.map((userId) => (
                <div key={userId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--ax-border)" }}>
                  <span style={{ fontSize: 13 }}>{emailFor(userId)}</span>
                  <Button variant="ghost" onClick={() => unassign.mutate(userId)} loading={unassign.isPending}>Remove</Button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Select value={assignId} onChange={(e) => setAssignId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select a user to assign…</option>
              {users.map((u) => {
                const id = u.user_id || u.id;
                return <option key={id} value={id}>{u.email || id}</option>;
              })}
            </Select>
            <Button variant="default" disabled={!assignId} loading={assign.isPending} onClick={() => assign.mutate()}>Assign</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ───────── Groups ───────── */
function GroupsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [managing, setManaging] = useState<Group | null>(null);

  const q = useQuery({
    queryKey: ["identity", "groups"],
    queryFn: () => api.get<{ groups?: Group[] }>("identity", "/v1/groups"),
  });
  const groups = q.data?.groups ?? [];

  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/groups", { name }),
    onSuccess: () => { toast.success("Group created"); setOpen(false); setName(""); qc.invalidateQueries({ queryKey: ["identity", "groups"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create group"),
  });

  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          A group is a team you add people to — for example &quot;Order Managers&quot; or
          &quot;Support Team&quot;. Pick which dashboard sections the group can access, then
          add whoever needs that access. Everyone in the group gets the same access
          automatically, and removing someone from the group removes their access too.
          Groups are for people only — service accounts and integrations get access a
          different way, from the Policies tab.
        </p>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New group</Button>
      </div>

      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Group</Th><Th /></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={2} /> : groups.length === 0 ? (
              <tr><Td style={{ padding: 0 }}><EmptyState title="No groups yet" hint="Create one to start bundling access for a team." /></Td><Td /></tr>
            ) : groups.map((g) => (
              <Tr key={g.group_id || g.id}>
                <Td style={{ fontWeight: 500 }}>{g.name}</Td>
                <Td style={{ textAlign: "right" }}><Button variant="default" onClick={() => setManaging(g)}>Manage</Button></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New group"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" disabled={!name.trim()} loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Group name" hint="A short, recognizable name for the team, e.g. &quot;Order Managers&quot;.">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Order Managers" />
          </Field>
        </div>
      </Modal>

      {managing && <GroupManageModal group={managing} onClose={() => setManaging(null)} />}
    </div>
  );
}

/* ───────── Group permission + member management ───────── */
function GroupManageModal({ group, onClose }: { group: Group; onClose: () => void }) {
  const qc = useQueryClient();
  const groupId = (group.group_id || group.id)!;
  const domains = permissionDomains();

  const permsQ = useQuery({
    queryKey: ["identity", "groups", groupId, "permissions"],
    queryFn: () => api.get<{ rules?: PolicyRule[] }>("identity", `/v1/groups/${groupId}/permissions`),
  });
  const membersQ = useQuery({
    queryKey: ["identity", "groups", groupId, "members"],
    queryFn: () => api.get<{ user_ids?: string[] }>("identity", `/v1/groups/${groupId}/members`),
  });
  const usersQ = useQuery({
    queryKey: ["identity", "users"],
    queryFn: () => api.get<{ users?: User[]; items?: User[] }>("identity", "/v1/users"),
  });
  const users = usersQ.data?.users ?? usersQ.data?.items ?? [];
  const emailFor = (userId: string) => users.find((u) => (u.user_id || u.id) === userId)?.email || userId;

  const [checked, setChecked] = useState<Set<string> | null>(null);
  const grantedDomains = checked ?? new Set(
    (permsQ.data?.rules ?? [])
      .filter((rule) => rule.effect?.toLowerCase() === "allow")
      .flatMap((rule) => domains.filter((d) => rule.action_pattern === "*" || rule.action_pattern.startsWith(`${d.domain}:`)).map((d) => d.domain)),
  );

  const toggle = (domain: string) => {
    const next = new Set(grantedDomains);
    if (next.has(domain)) next.delete(domain); else next.add(domain);
    setChecked(next);
  };

  const savePermissions = useMutation({
    mutationFn: () => api.put("identity", `/v1/groups/${groupId}/permissions`, {
      rules: Array.from(grantedDomains).map((domain) => ({ effect: "allow", action_pattern: `${domain}:*`, resource_pattern: "*" })),
    }),
    onSuccess: () => { toast.success("Permissions saved"); qc.invalidateQueries({ queryKey: ["identity", "groups", groupId, "permissions"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to save permissions"),
  });

  const [assignId, setAssignId] = useState("");
  const assign = useMutation({
    mutationFn: () => api.post("identity", `/v1/groups/${groupId}/members`, { user_id: assignId }),
    onSuccess: () => { toast.success("User added"); setAssignId(""); qc.invalidateQueries({ queryKey: ["identity", "groups", groupId, "members"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to add user — service accounts can't join groups, see Policies tab instead"),
  });
  const unassign = useMutation({
    mutationFn: (userId: string) => api.del("identity", `/v1/groups/${groupId}/members/${userId}`),
    onSuccess: () => { toast.success("User removed"); qc.invalidateQueries({ queryKey: ["identity", "groups", groupId, "members"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to remove user"),
  });

  return (
    <Modal open onClose={onClose} title={`Manage "${group.name}"`} width={560}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button variant="primary" loading={savePermissions.isPending} onClick={() => savePermissions.mutate()}>Save permissions</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 10 }}>
            Dashboard access
          </div>
          {permsQ.isLoading ? <div style={{ fontSize: 13, color: "var(--ax-text-faint)" }}>Loading…</div> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {domains.map((d) => (
                <label key={d.domain} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={grantedDomains.has(d.domain)} onChange={() => toggle(d.domain)} />
                  {d.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 10 }}>
            People in this group
          </div>
          {membersQ.isLoading ? <div style={{ fontSize: 13, color: "var(--ax-text-faint)" }}>Loading…</div> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {(membersQ.data?.user_ids ?? []).length === 0 ? (
                <div style={{ fontSize: 12.5, color: "var(--ax-text-faint)" }}>Nobody in this group yet.</div>
              ) : membersQ.data!.user_ids!.map((userId) => (
                <div key={userId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--ax-border)" }}>
                  <span style={{ fontSize: 13 }}>{emailFor(userId)}</span>
                  <Button variant="ghost" onClick={() => unassign.mutate(userId)} loading={unassign.isPending}>Remove</Button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Select value={assignId} onChange={(e) => setAssignId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select a person to add…</option>
              {users.map((u) => {
                const id = u.user_id || u.id;
                return <option key={id} value={id}>{u.email || id}</option>;
              })}
            </Select>
            <Button variant="default" disabled={!assignId} loading={assign.isPending} onClick={() => assign.mutate()}>Add</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ───────── Policies ───────── */
function PoliciesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject_id: "", subject_type: "User", effect: "allow", action: "", resource: "" });
  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/policies", {
      subject_id: form.subject_id, subject_type: form.subject_type,
      rules: [{ effect: form.effect, action_pattern: form.action, resource_pattern: form.resource }],
    }),
    onSuccess: () => { toast.success("Policy created"); setOpen(false); qc.invalidateQueries({ queryKey: ["identity", "policies"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          Policies bind a subject (user/role/group) to access rules. Each rule is an effect + action + resource.
        </p>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New policy</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New policy"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Subject ID" hint="UUID of the user, role or group."><Input className="mono" value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} /></Field>
          <Field label="Subject type">
            <Select value={form.subject_type} onChange={(e) => setForm({ ...form, subject_type: e.target.value })}>
              <option value="User">User</option>
              <option value="Group">Group</option>
              <option value="ServiceAccount">Service account</option>
            </Select>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Effect">
              <Select value={form.effect} onChange={(e) => setForm({ ...form, effect: e.target.value })}>
                <option value="allow">allow</option>
                <option value="deny">deny</option>
              </Select>
            </Field>
            <Field label="Action pattern" hint="domain:subdomain:action, or * for every action."><Input value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} placeholder="billing:invoice:read" /></Field>
          </div>
          <Field label="Resource"><Input value={form.resource} onChange={(e) => setForm({ ...form, resource: e.target.value })} placeholder="*" /></Field>
        </div>
      </Modal>
    </div>
  );
}
