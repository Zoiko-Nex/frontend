"use client";

/**
 * Provider integrations in the super-admin console.
 *
 * Replaces the MVNO module that lived inline in page.tsx, which showed
 * fabricated connectors whenever the list was empty or failed, read connectors
 * as the platform tenant (so a newly registered one "disappeared"), and spread
 * one carrier's setup over a dozen unordered buttons and modals. Here a tenant
 * is chosen first, every list is real or says why it is not, and a connector's
 * setup is one page of ordered steps whose state comes from the backend.
 *
 * Deep-linkable: ?module=integrations&tenant=<id>&connector=<id>.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { integrationApi, integrationKeys, type Connector } from "@/lib/admin/integration";
import { StatusChip, TableState, TenantPicker, type TenantOption } from "./console";
import { RegisterConnectorModal } from "./RegisterConnector";
import { TopologyPanel, CredentialsPanel } from "./panels/Setup";
import { CarrierRulesPanel } from "./panels/CarrierRules";
import { CallbacksPanel } from "./panels/Callbacks";
import { OperationsPanel } from "./panels/Operations";
import { ReadinessPanel, ActivationPanel, CallsPanel } from "./panels/Lifecycle";

function useUrlParam(name: string): [string, (v: string) => void] {
  const read = () => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get(name) ?? "");
  const [value, setValue] = useState(read);
  useEffect(() => {
    const onPop = () => setValue(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read is stable per name
  }, [name]);
  const update = useCallback((v: string) => {
    const url = new URL(window.location.href);
    if (v) url.searchParams.set(name, v);
    else url.searchParams.delete(name);
    window.history.pushState(null, "", url);
    setValue(v);
  }, [name]);
  return [value, update];
}

export default function IntegrationsModule({ tenants }: { tenants: TenantOption[] }) {
  const [tenant, setTenant] = useUrlParam("tenant");
  const [connectorId, setConnectorId] = useUrlParam("connector");
  const [registerOpen, setRegisterOpen] = useState(false);
  const qc = useQueryClient();

  const tenantInfo = tenants.find((t) => t.tenant_id === tenant);
  const connectors = useQuery({
    queryKey: integrationKeys.connectors(tenant),
    queryFn: () => integrationApi.listConnectors(tenant),
    enabled: !!tenant,
  });

  return (
    <section className="module active">
      <div className="headrow">
        <div>
          <div className="crumb">Platform / <b>Integrations</b>{connectorId && <> / <b>Connector</b></>}</div>
          <div className="ptitle">Provider integrations</div>
          <div className="psub">Carrier and provider connectors, per tenant. Each one is set up in order: credentials, the carrier&apos;s rules, callbacks, operations, then governed activation.</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <TenantPicker tenants={tenants} value={tenant} onChange={(v) => { setConnectorId(""); setTenant(v); }} />
          {tenant && !connectorId && (
            <button type="button" className="btn btn-primary" onClick={() => setRegisterOpen(true)}>+ Register connector</button>
          )}
        </div>
      </div>

      {!tenant ? (
        <div className="empty">Select the tenant whose connectors you want to manage. Each parent brand (e.g. Zoiko Mobile, DriverX) has its own.</div>
      ) : connectorId ? (
        <ConnectorWorkspace tenant={tenant} connectorId={connectorId} brands={tenantInfo?.brands ?? []} onBack={() => setConnectorId("")} />
      ) : (
        <div className="tablewrap">
          <table>
            <thead><tr><th>Connector</th><th>Provider</th><th>Type</th><th>UAT mode</th><th>Status</th></tr></thead>
            <tbody>
              <TableState colSpan={5} loading={connectors.isLoading} error={connectors.error}
                empty={(connectors.data ?? []).length === 0} emptyLabel={`No connectors in ${tenantInfo?.name ?? "this tenant"} yet.`} />
              {(connectors.data ?? []).map((c) => (
                <tr key={c.connector_id} style={{ cursor: "pointer" }} onClick={() => setConnectorId(c.connector_id)}>
                  <td className="strong"><button type="button" className="linkish" onClick={() => setConnectorId(c.connector_id)}>{c.connector_name}</button></td>
                  <td className="mono">{c.provider_name}</td>
                  <td className="mono">{c.connector_type}</td>
                  <td className="mono">{c.uat_mode}</td>
                  <td><StatusChip status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {registerOpen && tenant && (
        <RegisterConnectorModal
          tenant={tenant}
          tenantName={tenantInfo?.name ?? tenant}
          onClose={() => setRegisterOpen(false)}
          onCreated={(id) => {
            setRegisterOpen(false);
            qc.invalidateQueries({ queryKey: integrationKeys.connectors(tenant) });
            setConnectorId(id);
          }}
        />
      )}
    </section>
  );
}

const STEPS = [
  { id: "connector", label: "1 · Connector" },
  { id: "credentials", label: "2 · Credentials" },
  { id: "rules", label: "3 · Carrier rules" },
  { id: "callbacks", label: "4 · Callbacks" },
  { id: "operations", label: "5 · Operations" },
  { id: "readiness", label: "6 · Readiness" },
  { id: "activation", label: "7 · Activation" },
  { id: "calls", label: "8 · Calls" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function ConnectorWorkspace({ tenant, connectorId, brands, onBack }: {
  tenant: string;
  connectorId: string;
  brands: { id: string; name: string }[];
  onBack: () => void;
}) {
  const [step, setStep] = useUrlParam("step");
  const current: StepId = (STEPS.find((s) => s.id === step)?.id ?? "connector") as StepId;

  const connector = useQuery({
    queryKey: integrationKeys.connector(tenant, connectorId),
    queryFn: () => integrationApi.getConnector(tenant, connectorId),
  });
  const vocab = useQuery({ queryKey: integrationKeys.vocabulary(), queryFn: integrationApi.vocabulary, staleTime: Infinity });
  const readiness = useQuery({
    queryKey: integrationKeys.part(tenant, connectorId, "readiness"),
    queryFn: () => integrationApi.readiness(tenant, connectorId),
    retry: false,
  });

  // Which steps the readiness report says are blocked, by gate.
  const blockedGates = useMemo(() => new Set((readiness.data?.readiness.gates ?? [])
    .filter((g) => (g.blockers?.length ?? 0) > 0).map((g) => g.id)), [readiness.data]);
  const stepGates: Partial<Record<StepId, string[]>> = {
    credentials: ["G2"], rules: ["G1", "G5", "G7"], callbacks: ["G3"], operations: ["G1"],
  };

  if (connector.isLoading) return <div className="panel"><p style={{ fontSize: 12, opacity: 0.6 }}>Loading connector…</p></div>;
  if (connector.error || !connector.data) {
    return (
      <div className="panel">
        <p role="alert" style={{ color: "var(--danger)" }}>This connector could not be loaded in the selected tenant.</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← All connectors</button>
      </div>
    );
  }
  const c: Connector = connector.data;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "start" }}>
      <nav aria-label="Connector setup steps" className="panel" style={{ position: "sticky", top: 12 }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 8 }}>← All connectors</button>
        <div className="strong" style={{ marginBottom: 4 }}>{c.connector_name}</div>
        <div style={{ marginBottom: 10 }}><StatusChip status={c.status} /></div>
        {STEPS.map((s) => {
          const blocked = (stepGates[s.id] ?? []).some((g) => blockedGates.has(g));
          return (
            <button key={s.id} type="button" onClick={() => setStep(s.id)} aria-current={current === s.id ? "step" : undefined}
              className={`btn btn-sm ${current === s.id ? "btn-primary" : "btn-ghost"}`}
              style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{s.label}</span>{blocked && <span title="Readiness reports a blocker here" aria-label="has blockers">●</span>}
            </button>
          );
        })}
      </nav>
      <div>
        {current === "connector" && <TopologyPanel tenant={tenant} connector={c} />}
        {current === "credentials" && <CredentialsPanel tenant={tenant} connector={c} />}
        {current === "rules" && <CarrierRulesPanel tenant={tenant} connector={c} brands={brands} />}
        {current === "callbacks" && <CallbacksPanel tenant={tenant} connector={c} />}
        {current === "operations" && <OperationsPanel tenant={tenant} connector={c} />}
        {current === "readiness" && <ReadinessPanel tenant={tenant} connector={c} />}
        {current === "activation" && <ActivationPanel tenant={tenant} connector={c} approvalRoles={vocab.data?.approval_roles ?? []} />}
        {current === "calls" && <CallsPanel tenant={tenant} connector={c} />}
      </div>
    </div>
  );
}
