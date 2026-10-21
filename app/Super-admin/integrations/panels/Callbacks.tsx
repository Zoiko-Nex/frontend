"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiException } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type Connector, type CreatedCallbackEndpoint } from "@/lib/admin/integration";
import { Field, KV, Modal, StatusChip, TableState, inputStyle } from "../console";

const cidrList = (text: string) => text.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);

/**
 * Step 4 — where the provider's notifications arrive. Nexus signs nothing, so
 * the URL carries a secret (shown once) and only listed source addresses are
 * accepted. Port-out validation is answered from here; without a validator it
 * is never approved.
 */
export function CallbacksPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const epKey = integrationKeys.part(tenant, connector.connector_id, "callback-endpoint");
  const cbKey = integrationKeys.part(tenant, connector.connector_id, "callbacks");

  const endpoint = useQuery({
    queryKey: epKey,
    queryFn: async () => {
      try {
        return await integrationApi.getCallbackEndpoint(tenant, connector.connector_id);
      } catch (e) {
        if (e instanceof ApiException && e.status === 404) return null; // none yet
        throw e;
      }
    },
  });
  const callbacks = useQuery({ queryKey: cbKey, queryFn: () => integrationApi.listCallbacks(tenant, connector.connector_id) });

  const [cidrs, setCidrs] = useState("");
  const [enforce, setEnforce] = useState(true);
  const [fallback, setFallback] = useState("");
  const [created, setCreated] = useState<CreatedCallbackEndpoint | null>(null);
  const [rotateOpen, setRotateOpen] = useState(false);

  const body = () => ({ allowed_source_cidrs: cidrList(cidrs), enforce_source_allowlist: enforce, port_out_unavailable_code: fallback || undefined });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: epKey });
    qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
  };

  const create = useMutation({
    mutationFn: () => integrationApi.createCallbackEndpoint(tenant, connector.connector_id, body()),
    onSuccess: (r) => { setCreated(r); setRotateOpen(false); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not create the endpoint")),
  });
  const update = useMutation({
    mutationFn: () => integrationApi.updateCallbackEndpoint(tenant, connector.connector_id, endpoint.data!.callback_endpoint_id, body()),
    onSuccess: () => { toast.success("Callback endpoint updated"); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not update the endpoint")),
  });

  const ep = endpoint.data;
  const edit = (
    <>
      <Field label="MVNOC source addresses" hint="CIDRs or IPs, separated by commas or spaces. Until MVNOC provides them, every callback is refused.">
        <textarea style={inputStyle} rows={2} value={cidrs} placeholder={ep ? ep.allowed_source_cidrs.join(", ") : "e.g. 203.0.113.10, 198.51.100.0/24"} onChange={(e) => setCidrs(e.target.value)} />
      </Field>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, marginBottom: 12 }}>
        <input type="checkbox" checked={enforce} onChange={(e) => setEnforce(e.target.checked)} />
        Enforce the source allowlist (turning this off leaves only the URL secret)
      </label>
      <Field label="Port-out answer when validation is impossible" hint="Never 7A. Default 6H (SYSTEM_OUTAGES): the requesting carrier waits and retries.">
        <input style={inputStyle} value={fallback} placeholder={ep?.port_out_unavailable_code ?? "6H"} onChange={(e) => setFallback(e.target.value.toUpperCase())} />
      </Field>
    </>
  );

  return (
    <div className="panel">
      <h3>Provider callbacks</h3>
      {endpoint.isLoading ? <p style={{ fontSize: 12, opacity: 0.6 }}>Loading…</p> : endpoint.error ? (
        <p role="alert" style={{ color: "var(--danger)", fontSize: 12 }}>{errMessage(endpoint.error, "Could not load the endpoint.")}</p>
      ) : ep ? (
        <>
          <KV k="Endpoint"><span className="mono">{ep.url_path_template}</span></KV>
          <KV k="Allowed sources">
            {ep.enforce_source_allowlist
              ? ep.allowed_source_cidrs.length ? <span className="mono">{ep.allowed_source_cidrs.join(", ")}</span>
                : <span style={{ color: "var(--danger)" }}>none — every callback is refused</span>
              : <span style={{ color: "var(--danger)" }}>not enforced</span>}
          </KV>
          <KV k="Port-out fallback"><span className="mono">{ep.port_out_unavailable_code}</span></KV>
          <div className="sectitle" style={{ marginTop: 12 }}>Change settings</div>
          {edit}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-primary btn-sm" disabled={update.isPending} onClick={() => update.mutate()}>Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRotateOpen(true)}>Rotate URL…</button>
          </div>
        </>
      ) : (
        <>
          <p className="psub" style={{ margin: "4px 0 10px" }}>No endpoint yet. Create one and give MVNOC the URL it returns.</p>
          {edit}
          <button type="button" className="btn btn-primary btn-sm" disabled={create.isPending} onClick={() => create.mutate()}>Create endpoint</button>
        </>
      )}

      <div className="sectitle" style={{ marginTop: 16 }}>Recent notifications</div>
      <div className="tablewrap" style={{ maxHeight: 300, overflow: "auto" }}>
        <table>
          <thead><tr><th>Received</th><th>Type</th><th>Transaction</th><th>Result</th><th>Status</th></tr></thead>
          <tbody>
            <TableState colSpan={5} loading={callbacks.isLoading} error={callbacks.error} empty={(callbacks.data ?? []).length === 0}
              emptyLabel="No notifications received." />
            {(callbacks.data ?? []).map((cb) => (
              <tr key={cb.callback_id}>
                <td className="mono" style={{ fontSize: 11 }}>{new Date(cb.received_at).toLocaleString()}</td>
                <td className="mono">{cb.request_type}</td>
                <td className="mono" style={{ fontSize: 11 }}>{cb.provider_transaction_id ?? cb.batch_id ?? "—"}</td>
                <td className="mono">{cb.answered_code ? `answered ${cb.answered_code}` : cb.result_code ?? "—"}{cb.result_class && <div style={{ fontSize: 10, opacity: 0.6 }}>{cb.result_class}</div>}</td>
                <td><StatusChip status={cb.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rotateOpen && (
        <Modal title="Rotate callback URL" subtitle="The current URL stops working immediately. MVNOC must be given the new one." onClose={() => setRotateOpen(false)}
          footer={<button type="button" className="btn btn-danger" disabled={create.isPending} onClick={() => create.mutate()}>Rotate</button>}>
          <p style={{ fontSize: 13 }}>The settings above are carried to the new endpoint.</p>
        </Modal>
      )}
      {created && (
        <Modal title="Callback URL — copy it now" subtitle="It contains a secret and will not be shown again." onClose={() => setCreated(null)}>
          <p className="mono" style={{ wordBreak: "break-all", fontSize: 12, padding: 10, background: "var(--bg2, #f1f5f9)", borderRadius: 6 }}>
            {created.url ?? created.url_path}
          </p>
          {!created.url && <p style={{ fontSize: 12 }}>Prefix it with the public https address MVNOC reaches us on (PUBLIC_CALLBACK_BASE_URL is not set).</p>}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { void navigator.clipboard.writeText(created.url ?? created.url_path); toast.success("Copied"); }}>
            Copy
          </button>
        </Modal>
      )}
    </div>
  );
}
