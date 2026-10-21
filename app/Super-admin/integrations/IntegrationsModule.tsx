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
 * Deep-linkable: ?module=integrations&tenant=<id>&connector=<id>&step=<step>.
 */

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiException } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type Connector } from "@/lib/admin/integration";
import { StatusChip, TableState, TenantPicker, useVocabulary, type TenantOption } from "./console";
import { RegisterConnectorModal } from "./RegisterConnector";
import { TopologyPanel, CredentialsPanel } from "./panels/Setup";
import { CarrierRulesPanel } from "./panels/CarrierRules";
import { CallbacksPanel } from "./panels/Callbacks";
import { OperationsPanel } from "./panels/Operations";
import { ReadinessPanel, ActivationPanel, CallsPanel } from "./panels/Lifecycle";

const readParam = (name: string) =>
  typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get(name) ?? "";

/** Sets or clears query parameters in one history entry. */
function writeParams(values: Record<string, string>) {
  const url = new URL(window.location.href);
  for (const [name, v] of Object.entries(values)) {
    if (v) url.searchParams.set(name, v);
    else url.searchParams.delete(name);
  }
  window.history.pushState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/** A query parameter as state, kept in step with Back/Forward. */
function useUrlParam(name: string): string {
  const [value, setValue] = useState(() => readParam(name));
  useEffect(() => {
    const onPop = () => setValue(readParam(name));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [name]);
  return value;
}

export default function IntegrationsModule({ tenants, tenantsLoading, tenantsError }: {
  tenants: TenantOption[];
  tenantsLoading?: boolean;
  tenantsError?: unknown;
}) {
  const tenant = useUrlParam("tenant");
  const connectorId = useUrlParam("connector");
  const openConnector = useCallback((id: string) => writeParams({ connector: id, step: "" }), []);
  const [registerOpen, setRegisterOpen] = useState(false);
  const qc = useQueryClient();

  const tenantInfo = tenants.find((t) => t.tenant_id === tenant);
  const connectors = useQuery({
    queryKey: integrationKeys.connectors(tenant),
    queryFn: () => integrationApi.listConnectors(tenant),
    enabled: !!tenantInfo,
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
          <TenantPicker tenants={tenants} value={tenant} onChange={(v) => writeParams({ tenant: v, connector: "", step: "" })} />
          {tenantInfo && !connectorId && (
            <button type="button" className="btn btn-primary" onClick={() => setRegisterOpen(true)}>+ Register connector</button>
          )}
        </div>
      </div>

      {tenantsError ? (
        <div className="empty" role="alert">{errMessage(tenantsError, "Could not load the tenant list from identity-tenancy.")}</div>
      ) : tenantsLoading ? (
        <div className="empty">Loading tenants…</div>
      ) : !tenant ? (
        <div className="empty">Select the tenant whose connectors you want to manage. Each parent brand (e.g. Zoiko Mobile, DriverX) has its own.</div>
      ) : !tenantInfo ? (
        <div className="empty" role="alert">The tenant in this link is not one you can see. Choose a tenant above.</div>
      ) : connectorId ? (
        <ConnectorWorkspace tenant={tenant} connectorId={connectorId} brands={tenantInfo.brands ?? []} onBack={() => writeParams({ connector: "", step: "" })} />
      ) : (
        <div className="tablewrap">
          <table>
            <thead><tr><th>Connector</th><th>Provider</th><th>Type</th><th>UAT mode</th><th>Status</th></tr></thead>
            <tbody>
              <TableState colSpan={5} loading={connectors.isLoading} error={connectors.error}
                empty={(connectors.data ?? []).length === 0} emptyLabel={`No connectors in ${tenantInfo.name} yet.`} />
              {(connectors.data ?? []).map((c) => (
                <tr key={c.connector_id}>
                  <td className="strong"><button type="button" className="linkish" onClick={() => openConnector(c.connector_id)}>{c.connector_name}</button></td>
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

      {registerOpen && tenantInfo && (
        <RegisterConnectorModal
          tenant={tenant}
          tenantName={tenantInfo.name}
          onClose={() => setRegisterOpen(false)}
          onCreated={(id) => {
            setRegisterOpen(false);
            qc.invalidateQueries({ queryKey: integrationKeys.connectors(tenant) });
            openConnector(id);
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
  const step = useUrlParam("step");
  const current: StepId = STEPS.find((s) => s.id === step)?.id ?? "connector";

  const connector = useQuery({
    queryKey: integrationKeys.connector(tenant, connectorId),
    queryFn: () => integrationApi.getConnector(tenant, connectorId),
    // A 404 (wrong tenant, deleted connector) will not fix itself on retry.
    retry: (count, e) => !(e instanceof ApiException && e.status === 404) && count < 2,
  });
  const vocab = useVocabulary();
  const readiness = useQuery({
    queryKey: integrationKeys.part(tenant, connectorId, "readiness"),
    queryFn: () => integrationApi.readiness(tenant, connectorId),
    retry: false,
  });
  // How many gates the readiness report says are blocked. Which step clears a
  // gate is the report's business, so the count is shown on Readiness only.
  const blockedGates = (readiness.data?.readiness.gates ?? []).filter((g) => (g.blockers?.length ?? 0) > 0).length;

  if (connector.isLoading) return <div className="panel"><p style={{ fontSize: 12, opacity: 0.6 }}>Loading connector…</p></div>;
  if (connector.error || !connector.data) {
    return (
      <div className="panel">
        <p role="alert" style={{ color: "var(--danger)" }}>{errMessage(connector.error, "This connector could not be loaded in the selected tenant.")}</p>
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
        {STEPS.map((s) => (
          <button key={s.id} type="button" onClick={() => writeParams({ step: s.id })} aria-current={current === s.id ? "step" : undefined}
            className={`btn btn-sm ${current === s.id ? "btn-primary" : "btn-ghost"}`}
            style={{ display: "flex", width: "100%", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{s.label}</span>
            {s.id === "readiness" && blockedGates > 0 && (
              <span className="chip c-amber" style={{ fontSize: 10 }}>
                {blockedGates}<span className="sr-only"> gates blocked</span>
              </span>
            )}
          </button>
        ))}
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
