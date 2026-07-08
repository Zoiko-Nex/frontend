"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchTenants, provisionTenant, createTenantAdmin, updateTenantLifecycle, fetchTenantUsers,
  fetchPlatformStaff, createPlatformStaffUser, fetchAuditTrails, fetchTenantOrders,
  type PlatformTenant, type TenantLifecycleAction, type PlatformStaffRole,
} from "@/lib/admin/platform/auth";
import { ApiException } from "@/lib/admin/client";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, LoadingRows, EmptyState, ErrorBanner,
} from "../admin/_components/ui";
import StatusBadge from "../admin/_components/StatusBadge";
import { loginUrl, buildInvite as buildInviteBase, CopyButton, generatePassword } from "../admin/_components/invite";

function buildInvite(opts: { tenantName: string; tenantId: string; email: string; password?: string }) {
  return buildInviteBase({ label: opts.tenantName, tenantId: opts.tenantId, email: opts.email, password: opts.password });
}

type PlatformTab = "tenants" | "team" | "audit";

export default function PlatformControlRoom() {
  const [tab, setTab] = useState<PlatformTab>("tenants");
  return (
    <div>
      <SectionHeader
        title="Platform Control Room"
        subtitle="Cross-tenant view of the ZoikoNex platform — tenants, your own team, and the audit trail."
      />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--ax-border)" }}>
        {(["tenants", "team", "audit"] as PlatformTab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
            {t === "tenants" ? "Tenants" : t === "team" ? "Platform Team" : "Audit Log"}
          </button>
        ))}
      </div>
      {tab === "tenants" && <TenantsTab />}
      {tab === "team" && <TeamTab />}
      {tab === "audit" && <AuditTab />}
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

/* ───────── Tenants ───────── */
function TenantsTab() {
  const qc = useQueryClient();
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [addAdminFor, setAddAdminFor] = useState<PlatformTenant | null>(null);
  const [viewUsersFor, setViewUsersFor] = useState<PlatformTenant | null>(null);
  const [viewOrdersFor, setViewOrdersFor] = useState<PlatformTenant | null>(null);

  const tenants = useQuery({
    queryKey: ["platform", "tenants"],
    queryFn: fetchTenants,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["platform", "tenants"] });

  const lifecycle = useMutation({
    mutationFn: ({ tenantId, action }: { tenantId: string; action: TenantLifecycleAction }) => updateTenantLifecycle(tenantId, action),
    onSuccess: () => { toast.success("Tenant updated"); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to update tenant"),
  });

  const list = tenants.data ?? [];
  const byStatus = list.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});
  const totalUsers = list.reduce((sum, t) => sum + (t.user_count ?? 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOnboardOpen(true)}>+ Onboard tenant</Button>
      </div>

      {tenants.isError ? (
        <ErrorBanner error={tenants.error} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 22 }}>
            <Stat label="Total tenants" value={list.length} loading={tenants.isLoading} />
            <Stat label="Total users" value={totalUsers} loading={tenants.isLoading} />
            <Stat label="Active" value={byStatus["Active"] ?? 0} loading={tenants.isLoading} status="Active" />
            <Stat label="Provisioned" value={byStatus["Provisioned"] ?? 0} loading={tenants.isLoading} status="Provisioned" />
            <Stat label="Suspended" value={byStatus["Suspended"] ?? 0} loading={tenants.isLoading} status="Suspended" />
            <Stat label="Archived" value={byStatus["Archived"] ?? 0} loading={tenants.isLoading} status="Archived" />
          </div>

          <Card style={{ padding: 20 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 14 }}>
              Onboarded tenants
            </h2>
            <Table>
              <thead>
                <tr>
                  <Th>Tenant</Th>
                  <Th>Domain</Th>
                  <Th>Status</Th>
                  <Th>Brands</Th>
                  <Th>Users</Th>
                  <Th>Tenant ID</Th>
                  <Th>Onboarded</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {tenants.isLoading ? (
                  <LoadingRows cols={8} />
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 0 }}>
                      <EmptyState title="No tenants yet" hint="Onboard your first telecom/MVNO customer above." />
                    </td>
                  </tr>
                ) : (
                  list.map((t: PlatformTenant) => (
                    <Tr key={t.tenant_id}>
                      <Td style={{ fontWeight: 500 }}>{t.name}</Td>
                      <Td className="mono">{t.domain_suffix}</Td>
                      <Td><StatusBadge status={t.status} /></Td>
                      <Td>{t.brand_count}</Td>
                      <Td>
                        <button onClick={() => setViewUsersFor(t)} style={{ background: "none", border: "none", color: "var(--ax-accent)", cursor: "pointer", fontSize: 13, padding: 0, font: "inherit" }}>
                          {t.user_count ?? 0}
                        </button>
                      </Td>
                      <Td><CopyId value={t.tenant_id} /></Td>
                      <Td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}</Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <Button variant="ghost" onClick={() => setViewUsersFor(t)}>Users</Button>
                          <Button variant="ghost" onClick={() => setViewOrdersFor(t)}>Orders</Button>
                          <Button variant="ghost" onClick={() => setAddAdminFor(t)}>+ Admin user</Button>
                          {t.status === "Provisioned" && (
                            <Button variant="default" loading={lifecycle.isPending} onClick={() => lifecycle.mutate({ tenantId: t.tenant_id, action: "ACTIVATE" })}>Activate</Button>
                          )}
                          {t.status === "Active" && (
                            <Button variant="danger" loading={lifecycle.isPending} onClick={() => lifecycle.mutate({ tenantId: t.tenant_id, action: "SUSPEND" })}>Suspend</Button>
                          )}
                          {t.status === "Suspended" && (
                            <>
                              <Button variant="default" loading={lifecycle.isPending} onClick={() => lifecycle.mutate({ tenantId: t.tenant_id, action: "REACTIVATE" })}>Reactivate</Button>
                              <Button variant="danger" loading={lifecycle.isPending} onClick={() => lifecycle.mutate({ tenantId: t.tenant_id, action: "ARCHIVE" })}>Archive</Button>
                            </>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </>
      )}

      {onboardOpen && <OnboardTenantModal onClose={() => setOnboardOpen(false)} onDone={invalidate} />}
      {addAdminFor && <AddAdminUserModal tenant={addAdminFor} onClose={() => setAddAdminFor(null)} onDone={invalidate} />}
      {viewUsersFor && <TenantUsersModal tenant={viewUsersFor} onClose={() => setViewUsersFor(null)} />}
      {viewOrdersFor && <TenantOrdersModal tenant={viewOrdersFor} onClose={() => setViewOrdersFor(null)} />}
    </div>
  );
}

/* ───────── View a tenant's recent order activity (cross-service, platform-admin only) ───────── */
function TenantOrdersModal({ tenant, onClose }: { tenant: PlatformTenant; onClose: () => void }) {
  const orders = useQuery({
    queryKey: ["platform", "tenant-orders", tenant.tenant_id],
    queryFn: () => fetchTenantOrders(tenant.tenant_id),
  });
  const list = orders.data ?? [];

  return (
    <Modal open onClose={onClose} title={`Recent orders — ${tenant.name}`} width={620}
      footer={<Button variant="ghost" onClick={onClose}>Close</Button>}>
      {orders.isError ? <ErrorBanner error={orders.error} /> : (
        <Table>
          <thead><tr><Th>Order</Th><Th>Type</Th><Th>Status</Th><Th>Created</Th></tr></thead>
          <tbody>
            {orders.isLoading ? <LoadingRows cols={4} /> : list.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 0 }}><EmptyState title="No orders yet" hint="Nothing has been placed by this tenant." /></td></tr>
            ) : list.map((o) => (
              <Tr key={o.id}>
                <Td><CopyId value={o.id} /></Td>
                <Td style={{ color: "var(--ax-text-dim)" }}>{o.order_type || "—"}</Td>
                <Td><StatusBadge status={o.status} /></Td>
                <Td className="mono" style={{ fontSize: 12 }}>{o.created_at ? new Date(o.created_at).toLocaleString() : "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Modal>
  );
}

/* ───────── Platform Team ───────── */
function TeamTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const staff = useQuery({
    queryKey: ["platform", "staff"],
    queryFn: fetchPlatformStaff,
  });
  const list = staff.data ?? [];

  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          This is your own Zoiko team, not a customer&apos;s users — anyone added here can sign
          into this Platform Control Room. Give someone the <strong>Platform Admin</strong> role
          for full access (onboard/suspend tenants, view any tenant&apos;s users and audit history),
          or <strong>Platform Viewer</strong> for a read-only view of the tenant list only —
          viewers cannot open a specific tenant&apos;s users or audit log.
        </p>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="primary" onClick={() => setOpen(true)}>+ Add team member</Button>
      </div>

      {staff.isError ? <ErrorBanner error={staff.error} /> : (
        <Table>
          <thead><tr><Th>Email</Th><Th>Name</Th><Th>Status</Th><Th>Added</Th></tr></thead>
          <tbody>
            {staff.isLoading ? <LoadingRows cols={4} /> : list.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 0 }}><EmptyState title="No platform team members yet" hint="Add your first Zoiko teammate above." /></td></tr>
            ) : list.map((u) => (
              <Tr key={u.user_id}>
                <Td>{u.email}</Td>
                <Td style={{ color: "var(--ax-text-dim)" }}>{u.full_name || "—"}</Td>
                <Td><StatusBadge status={u.status} /></Td>
                <Td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      {open && <AddPlatformStaffModal onClose={() => setOpen(false)} onDone={() => qc.invalidateQueries({ queryKey: ["platform", "staff"] })} />}
    </div>
  );
}

function AddPlatformStaffModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  const [role, setRole] = useState<PlatformStaffRole>("viewer");
  const [result, setResult] = useState<{ email: string; password: string } | null>(null);

  const create = useMutation({
    mutationFn: () => createPlatformStaffUser({ ...form, role }),
    onSuccess: () => { toast.success("Team member added"); onDone(); setResult({ email: form.email, password: form.password }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to add team member"),
  });

  const valid = form.email && form.full_name && form.password.length >= 12;

  if (result) {
    const platformLoginUrl = typeof window !== "undefined" ? `${window.location.origin}/platform-admin` : "https://zoikonex.com/platform-admin";
    const invite = [
      "ZoikoNex Platform Control Room login",
      `URL: ${platformLoginUrl}`,
      `Email: ${result.email}`,
      `Temporary password: ${result.password}`,
    ].join("\n");
    return (
      <Modal open onClose={onClose} title="Team member added" width={460}
        footer={<Button variant="primary" onClick={onClose}>Done</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>
            This is the only time the temporary password is shown. Copy it now and share it with
            them securely.
          </p>
          <pre className="mono" style={{ fontSize: 12.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", margin: 0 }}>{invite}</pre>
          <CopyButton text={invite} label="Copy login details" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="Add platform team member" width={480}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} loading={create.isPending} onClick={() => create.mutate()}>Add</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
        <Field label="Temporary password" hint="At least 12 characters — shown once after creation, so save it.">
          <div style={{ display: "flex", gap: 8 }}>
            <Input type="text" className="mono" style={{ flex: 1 }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button variant="default" type="button" onClick={() => setForm({ ...form, password: generatePassword() })}>Generate</Button>
          </div>
        </Field>
        <Field label="Access level">
          <Select value={role} onChange={(e) => setRole(e.target.value as PlatformStaffRole)}>
            <option value="viewer">Platform Viewer — see the tenant list only</option>
            <option value="admin">Platform Admin — full access</option>
          </Select>
        </Field>
      </div>
    </Modal>
  );
}

/* ───────── Audit Log ───────── */
function AuditTab() {
  const [tenantId, setTenantId] = useState("");

  const tenants = useQuery({
    queryKey: ["platform", "tenants"],
    queryFn: fetchTenants,
  });
  const tenantList = tenants.data ?? [];

  const audit = useQuery({
    queryKey: ["platform", "audit", tenantId],
    queryFn: () => fetchAuditTrails(tenantId),
    enabled: !!tenantId,
  });
  const trails = audit.data?.trails ?? [];

  return (
    <div>
      <Card style={{ padding: 18, marginBottom: 14 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.6 }}>
          Pick a tenant to see who did what, when — every entry is cryptographically chained to
          the one before it, so a tampered record is detected and the view fails safe rather than
          showing possibly-altered history.
        </p>
      </Card>

      <div style={{ marginBottom: 14, maxWidth: 360 }}>
        <Field label="Tenant">
          <Select value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
            <option value="">Select a tenant…</option>
            {tenantList.map((t) => <option key={t.tenant_id} value={t.tenant_id}>{t.name}</option>)}
          </Select>
        </Field>
      </div>

      {!tenantId ? (
        <EmptyState title="Select a tenant above" hint="Its audit history will appear here." />
      ) : audit.isError ? (
        (audit.error instanceof ApiException && audit.error.code === "AUDIT_CHAIN_TAMPERED") ? (
          <Card style={{ padding: 18, border: "1px solid var(--ax-danger, #d33)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⚠ Audit chain verification failed</p>
            <p style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>
              This tenant&apos;s audit history did not pass hash-chain verification — a record may
              have been tampered with. This view is intentionally refusing to show it. Escalate to
              engineering rather than retrying.
            </p>
          </Card>
        ) : <ErrorBanner error={audit.error} />
      ) : (
        <Table>
          <thead><tr><Th>Timestamp</Th><Th>Event</Th><Th>Actor</Th><Th>IP</Th></tr></thead>
          <tbody>
            {audit.isLoading ? <LoadingRows cols={4} /> : trails.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 0 }}><EmptyState title="No audit history yet" hint="Nothing has been recorded for this tenant." /></td></tr>
            ) : trails.map((t) => (
              <Tr key={t.id}>
                <Td className="mono" style={{ fontSize: 12 }}>{new Date(t.timestamp).toLocaleString()}</Td>
                <Td style={{ fontWeight: 500 }}>{t.event_type}</Td>
                <Td><CopyId value={t.actor_id} /></Td>
                <Td className="mono" style={{ fontSize: 12, color: "var(--ax-text-dim)" }}>{t.client_ip || "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

function Stat({ label, value, loading, status }: { label: string; value: number; loading?: boolean; status?: string }) {
  return (
    <div style={{ background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: "13px 14px" }}>
      <div className="mono" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{loading ? "—" : value}</div>
      <div style={{ marginTop: 9, fontSize: 12, color: "var(--ax-text-dim)" }}>
        {status ? <StatusBadge status={status} /> : label}
      </div>
    </div>
  );
}

/* ───────── Onboard a brand-new tenant + its first admin ───────── */
function OnboardTenantModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    name: "", domain_suffix: "", brand_name: "", brand_code: "",
    admin_email: "", admin_full_name: "", admin_password: "",
  });
  const [result, setResult] = useState<{ tenantId: string } | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const { tenant_id, brand_id } = await provisionTenant({
        name: form.name, domain_suffix: form.domain_suffix,
        brand_name: form.brand_name, brand_code: form.brand_code,
      });
      await createTenantAdmin(tenant_id, {
        email: form.admin_email, full_name: form.admin_full_name,
        password: form.admin_password, brand_id,
      });
      return { tenant_id };
    },
    onSuccess: ({ tenant_id }) => { toast.success(`${form.name} onboarded.`); onDone(); setResult({ tenantId: tenant_id }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Onboarding failed"),
  });

  const valid = form.name && form.domain_suffix && form.brand_name && form.brand_code
    && form.admin_email && form.admin_full_name && form.admin_password.length >= 12;

  if (result) {
    const invite = buildInvite({ tenantName: form.name, tenantId: result.tenantId, email: form.admin_email, password: form.admin_password });
    return (
      <Modal open onClose={onClose} title={`${form.name} is onboarded`} width={480}
        footer={<Button variant="primary" onClick={onClose}>Done</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>
            This is the only time the temporary password is shown. Copy it now and share it with the customer securely.
          </p>
          <pre className="mono" style={{ fontSize: 12.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", margin: 0 }}>{invite}</pre>
          <CopyButton text={invite} label="Copy login details" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="Onboard tenant" width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} loading={submit.isPending} onClick={() => submit.mutate()}>Onboard</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-faint)" }}>Company</div>
        <Field label="Tenant name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Globex Mobile Ltd" /></Field>
        <Field label="Domain suffix" hint="A stable slug, e.g. globex.zoikonex.com"><Input className="mono" value={form.domain_suffix} onChange={(e) => setForm({ ...form, domain_suffix: e.target.value })} placeholder="globex.zoikonex.com" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Brand name"><Input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} placeholder="Globex Mobile" /></Field>
          <Field label="Brand code"><Input value={form.brand_code} onChange={(e) => setForm({ ...form, brand_code: e.target.value })} placeholder="globex-mobile" /></Field>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-faint)", marginTop: 6 }}>First admin user</div>
        <Field label="Email"><Input type="email" value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} placeholder="admin@globex.com" /></Field>
        <Field label="Full name"><Input value={form.admin_full_name} onChange={(e) => setForm({ ...form, admin_full_name: e.target.value })} /></Field>
        <Field label="Temporary password" hint="At least 12 characters."><Input type="password" value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

/* ───────── Add an admin user to an existing tenant ───────── */
function AddAdminUserModal({ tenant, onClose, onDone }: { tenant: PlatformTenant; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ email: "", full_name: "", password: "", brand_id: tenant.brands?.[0]?.id || "" });
  const [done, setDone] = useState(false);

  const submit = useMutation({
    mutationFn: () => createTenantAdmin(tenant.tenant_id, form),
    onSuccess: () => { toast.success(`Admin user created for ${tenant.name}.`); onDone(); setDone(true); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create admin user"),
  });

  const valid = form.email && form.full_name && form.password.length >= 12 && form.brand_id;

  if (done) {
    const invite = buildInvite({ tenantName: tenant.name, tenantId: tenant.tenant_id, email: form.email, password: form.password });
    return (
      <Modal open onClose={onClose} title="Admin user created" width={460}
        footer={<Button variant="primary" onClick={onClose}>Done</Button>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>
            This is the only time the temporary password is shown. Copy it now and share it with the customer securely.
          </p>
          <pre className="mono" style={{ fontSize: 12.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", margin: 0 }}>{invite}</pre>
          <CopyButton text={invite} label="Copy login details" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title={`New admin user — ${tenant.name}`} width={460}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={!valid} loading={submit.isPending} onClick={() => submit.mutate()}>Create</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Brand">
          <Select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })}>
            {(tenant.brands ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        </Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
        <Field label="Temporary password" hint="At least 12 characters."><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

/* ───────── View a tenant's users (cross-tenant, platform-admin only) ───────── */
function TenantUsersModal({ tenant, onClose }: { tenant: PlatformTenant; onClose: () => void }) {
  const users = useQuery({
    queryKey: ["platform", "tenant-users", tenant.tenant_id],
    queryFn: () => fetchTenantUsers(tenant.tenant_id),
  });
  const list = users.data ?? [];

  const shareText = [
    `ZoikoNex login — ${tenant.name}`,
    `URL: ${loginUrl()}`,
    `Tenant ID: ${tenant.tenant_id}`,
    ...(list.length ? [`Admins: ${list.map((u) => u.email).join(", ")}`] : []),
  ].join("\n");

  return (
    <Modal open onClose={onClose} title={`Users — ${tenant.name}`} width={520}
      footer={<><CopyButton text={shareText} label="Copy login link + admins" /><Button variant="ghost" onClick={onClose}>Close</Button></>}>
      {users.isError ? <ErrorBanner error={users.error} /> : (
        <Table>
          <thead><tr><Th>Email</Th><Th>Name</Th><Th>Status</Th><Th>Created</Th></tr></thead>
          <tbody>
            {users.isLoading ? <LoadingRows cols={4} /> : list.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 0 }}><EmptyState title="No users yet" hint="Use '+ Admin user' to create the first one." /></td></tr>
            ) : list.map((u) => (
              <Tr key={u.user_id}>
                <Td>{u.email}</Td>
                <Td style={{ color: "var(--ax-text-dim)" }}>{u.full_name || "—"}</Td>
                <Td><StatusBadge status={u.status} /></Td>
                <Td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Modal>
  );
}
