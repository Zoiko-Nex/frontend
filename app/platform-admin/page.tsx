"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchTenants, provisionTenant, createTenantAdmin, updateTenantLifecycle,
  type PlatformTenant, type TenantLifecycleAction,
} from "@/lib/admin/platform/auth";
import { ApiException } from "@/lib/admin/client";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, LoadingRows, EmptyState, ErrorBanner,
} from "../admin/_components/ui";
import StatusBadge from "../admin/_components/StatusBadge";

export default function PlatformControlRoom() {
  const qc = useQueryClient();
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [addAdminFor, setAddAdminFor] = useState<PlatformTenant | null>(null);

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

  return (
    <div>
      <SectionHeader
        title="Platform Control Room"
        subtitle="Cross-tenant view of the ZoikoNex platform — every tenant onboarded, its brands and lifecycle status."
        actions={<Button variant="primary" onClick={() => setOnboardOpen(true)}>+ Onboard tenant</Button>}
      />

      {tenants.isError ? (
        <ErrorBanner error={tenants.error} />
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 22 }}>
            <Stat label="Total tenants" value={list.length} loading={tenants.isLoading} />
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
                  <Th>Tenant ID</Th>
                  <Th>Onboarded</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {tenants.isLoading ? (
                  <LoadingRows cols={7} />
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 0 }}>
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
                      <Td><CopyId value={t.tenant_id} /></Td>
                      <Td>{t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}</Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
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
    onSuccess: () => { toast.success(`${form.name} onboarded — share the admin credentials securely.`); onDone(); onClose(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Onboarding failed"),
  });

  const valid = form.name && form.domain_suffix && form.brand_name && form.brand_code
    && form.admin_email && form.admin_full_name && form.admin_password.length >= 12;

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
        <Field label="Temporary password" hint="At least 12 characters — share this with the customer to log in at /admin."><Input type="password" value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

/* ───────── Add an admin user to an existing tenant ───────── */
function AddAdminUserModal({ tenant, onClose, onDone }: { tenant: PlatformTenant; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ email: "", full_name: "", password: "", brand_id: tenant.brands?.[0]?.id || "" });

  const submit = useMutation({
    mutationFn: () => createTenantAdmin(tenant.tenant_id, form),
    onSuccess: () => { toast.success(`Admin user created for ${tenant.name}.`); onDone(); onClose(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create admin user"),
  });

  const valid = form.email && form.full_name && form.password.length >= 12 && form.brand_id;

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
