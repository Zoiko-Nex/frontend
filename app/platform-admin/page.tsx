"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTenants, type PlatformTenant } from "@/lib/admin/platform/auth";
import { Card, SectionHeader, Table, Th, Td, Tr, CopyId, LoadingRows, EmptyState, ErrorBanner } from "../admin/_components/ui";
import StatusBadge from "../admin/_components/StatusBadge";

export default function PlatformControlRoom() {
  const tenants = useQuery({
    queryKey: ["platform", "tenants"],
    queryFn: fetchTenants,
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
                </tr>
              </thead>
              <tbody>
                {tenants.isLoading ? (
                  <LoadingRows cols={6} />
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <EmptyState title="No tenants yet" hint="Provision one via POST /v1/tenants on identity-tenancy." />
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
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </>
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
