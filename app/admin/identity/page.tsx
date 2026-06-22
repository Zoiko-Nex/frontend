"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { ApiException } from "@/lib/admin/client";
import { useAuth } from "../_components/useAuth";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Modal,
  CopyId, EmptyState, LoadingRows, ErrorBanner,
} from "../_components/ui";
import StatusBadge from "../_components/StatusBadge";

type Tab = "users" | "sessions" | "roles" | "policies";

interface User { user_id?: string; id?: string; email?: string; full_name?: string; status?: string; brand_id?: string; }
interface Session { session_id?: string; id?: string; user_id?: string; status?: string; created_at?: string; device_fingerprint?: string; ip_address?: string; }

export default function IdentityPage() {
  const [tab, setTab] = useState<Tab>("users");
  return (
    <div>
      <SectionHeader title="Identity & Tenancy" subtitle="Operators, sessions, roles and access policies for this tenant." />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--ax-border)" }}>
        {(["users", "sessions", "roles", "policies"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {tab === "users" && <UsersTab />}
      {tab === "sessions" && <SessionsTab />}
      {tab === "roles" && <RolesTab />}
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
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", full_name: "", brand_id: session?.brandId || "" });

  const q = useQuery({
    queryKey: ["identity", "users"],
    queryFn: () => api.get<{ users?: User[]; items?: User[] }>("identity", "/v1/users"),
  });
  const users = q.data?.users ?? q.data?.items ?? [];

  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/users", form),
    onSuccess: () => { toast.success("User created"); setOpen(false); setForm({ email: "", full_name: "", brand_id: session?.brandId || "" }); qc.invalidateQueries({ queryKey: ["identity", "users"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create user"),
  });

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

      <Modal open={open} onClose={() => setOpen(false)} title="New user"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create user</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
          <Field label="Brand ID" hint="UUID of the brand this user belongs to."><Input className="mono" value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
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
  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/roles", form),
    onSuccess: () => { toast.success("Role created"); setOpen(false); setForm({ name: "", description: "" }); qc.invalidateQueries({ queryKey: ["identity", "roles"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          Roles carry the scopes the JWT presents on every protected route. Creating a role requires the
          <span className="mono" style={{ color: "var(--ax-text)" }}> tenant:auth:write</span> scope.
        </p>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New role</Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New role"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="finance_operator" /></Field>
          <Field label="Description"><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

/* ───────── Policies ───────── */
function PoliciesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject_id: "", subject_type: "USER", effect: "ALLOW", action: "", resource: "" });
  const create = useMutation({
    mutationFn: () => api.post("identity", "/v1/policies", {
      subject_id: form.subject_id, subject_type: form.subject_type,
      rules: [{ effect: form.effect, action: form.action, resource: form.resource }],
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Effect"><Input value={form.effect} onChange={(e) => setForm({ ...form, effect: e.target.value })} /></Field>
            <Field label="Action"><Input value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} placeholder="billing:invoice:read" /></Field>
          </div>
          <Field label="Resource"><Input value={form.resource} onChange={(e) => setForm({ ...form, resource: e.target.value })} placeholder="*" /></Field>
        </div>
      </Modal>
    </div>
  );
}
