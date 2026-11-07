"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiException } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type CallbackEndpointSettings, type Connector, type CreatedCallbackEndpoint } from "@/lib/admin/integration";
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
        // The API's own "no endpoint yet". A bare 404 from a proxy or an older
        // deployment is an error, not an empty state.
        if (e instanceof ApiException && e.status === 404 && e.code === "NOT_FOUND") return null;
        throw e;
      }
    },
  });
  const callbacks = useQuery({ queryKey: cbKey, queryFn: () => integrationApi.listCallbacks(tenant, connector.connector_id) });

  const [cidrs, setCidrs] = useState("");
  // undefined = untouched: the server's value stands and is not sent.
  const [enforce, setEnforce] = useState<boolean | undefined>(undefined);
  const [fallback, setFallback] = useState("");
  const [windowSecs, setWindowSecs] = useState("");
  const [created, setCreated] = useState<CreatedCallbackEndpoint | null>(null);
  const [rotateOpen, setRotateOpen] = useState(false);

  // Only what the operator typed is sent: the backend keeps every absent field,
  // and an explicit empty source list would mean "accept from nowhere".
  const body = (): CallbackEndpointSettings => ({
    allowed_source_cidrs: cidrs.trim() ? cidrList(cidrs) : undefined,
    enforce_source_allowlist: enforce,
    // ^ undefined unless the operator changed the checkbox
    port_out_unavailable_code: fallback || undefined,
    redelivery_window_seconds: windowSecs.trim() ? Number(windowSecs) : undefined,
  });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: epKey });
    qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
  };

  const create = useMutation({
    mutationFn: (rotate: boolean) => integrationApi.createCallbackEndpoint(tenant, connector.connector_id, { ...body(), rotate: rotate || undefined }),
    // The secret leaves the mutation cache at once; it lives only in `created`
    // until the operator closes the dialog.
    onSuccess: (r) => { setCreated(r); create.reset(); setRotateOpen(false); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not create the endpoint")),
  });
  const update = useMutation({
    mutationFn: () => integrationApi.updateCallbackEndpoint(tenant, connector.connector_id, endpoint.data!.callback_endpoint_id, body()),
    onSuccess: () => { toast.success("Callback endpoint updated"); setEnforce(undefined); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not update the endpoint")),
  });

  const ep = endpoint.data;
  const edit = (
    <>
      <Field label="MVNOC source addresses" hint="CIDRs or IPs, separated by commas or spaces. Until MVNOC provides them, every callback is refused.">
        <textarea style={inputStyle} rows={2} value={cidrs} placeholder={ep ? ep.allowed_source_cidrs.join(", ") : "e.g. 203.0.113.10, 198.51.100.0/24"} onChange={(e) => setCidrs(e.target.value)} />
      </Field>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, marginBottom: 12 }}>
        <input type="checkbox" checked={enforce ?? ep?.enforce_source_allowlist ?? true} onChange={(e) => setEnforce(e.target.checked)} />
        Enforce the source allowlist (turning this off leaves only the URL secret)
      </label>
      <Field label="Port-out answer when validation is impossible" hint="Must be one of the provider's port-out codes and never an approval; the server refuses anything else. Blank keeps the current value (or the server default).">
        <input style={inputStyle} value={fallback} placeholder={ep?.port_out_unavailable_code ?? "server default"} onChange={(e) => setFallback(e.target.value.toUpperCase())} />
      </Field>
      <Field label="Redelivery window (seconds)" hint="An identical notification with no transaction or batch id (device swap, SMS reply) inside this window is counted as a redelivery, not a new event.">
        <input style={inputStyle} inputMode="numeric" value={windowSecs} placeholder={ep ? String(ep.redelivery_window_seconds) : "server default"} onChange={(e) => setWindowSecs(e.target.value.replace(/\D/g, ""))} />
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
          <KV k="Redelivery window"><span className="mono">{ep.redelivery_window_seconds}s</span></KV>
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
          <button type="button" className="btn btn-primary btn-sm" disabled={create.isPending} onClick={() => create.mutate(false)}>Create endpoint</button>
        </>
      )}

      <div className="sectitle" style={{ marginTop: 16 }}>Recent notifications</div>
      <div className="tablewrap" style={{ maxHeight: 300, overflow: "auto" }}>
        <table>
          <thead><tr><th>Received</th><th>Type</th><th>Transaction</th><th>Result</th><th>Status</th><th>Deliveries</th></tr></thead>
          <tbody>
            <TableState colSpan={6} loading={callbacks.isLoading} error={callbacks.error} empty={(callbacks.data ?? []).length === 0}
              emptyLabel="No notifications received." />
            {(callbacks.data ?? []).map((cb) => (
              <tr key={cb.callback_id}>
                <td className="mono" style={{ fontSize: 11 }}>{new Date(cb.received_at).toLocaleString()}</td>
                <td className="mono">{cb.request_type}</td>
                <td className="mono" style={{ fontSize: 11 }}>{cb.provider_transaction_id ?? cb.batch_id ?? "—"}</td>
                <td className="mono">{cb.answered_code ? `answered ${cb.answered_code}` : cb.result_code ?? "—"}{cb.result_class && <div style={{ fontSize: 10, opacity: 0.6 }}>{cb.result_class}{cb.outcome && !cb.outcome_final ? " · not final" : ""}</div>}</td>
                <td><StatusChip status={cb.status} /></td>
                <td className="mono">{cb.delivery_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rotateOpen && (
        <Modal title="Rotate callback URL" subtitle="The current URL stops working immediately. MVNOC must be given the new one." onClose={() => setRotateOpen(false)}
          footer={<button type="button" className="btn btn-danger" disabled={create.isPending} onClick={() => create.mutate(true)}>Rotate</button>}>
          <p style={{ fontSize: 13 }}>Current settings are carried to the new endpoint, with any changes typed above applied.</p>
        </Modal>
      )}
      {created && (
        <Modal title="Callback URL — copy it now" subtitle="It contains a secret and will not be shown again." dismissible={false}
          closeLabel="I have stored it" onClose={() => setCreated(null)}>
          <p className="mono" style={{ wordBreak: "break-all", fontSize: 12, padding: 10, background: "var(--bg2, #f1f5f9)", borderRadius: 6, userSelect: "all" }}>
            {created.url ?? created.url_path}
          </p>
          {!created.url && <p style={{ fontSize: 12 }}>Prefix it with the public https address MVNOC reaches us on (PUBLIC_CALLBACK_BASE_URL is not set).</p>}
          <button type="button" className="btn btn-primary btn-sm" onClick={async () => {
            try {
              await navigator.clipboard.writeText(created.url ?? created.url_path);
              toast.success("Copied to the clipboard");
            } catch {
              toast.error("The browser refused clipboard access — select the URL above and copy it by hand.");
            }
          }}>
            Copy
          </button>
        </Modal>
      )}
    </div>
  );
}
