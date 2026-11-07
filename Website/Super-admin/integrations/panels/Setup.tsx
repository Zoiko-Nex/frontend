"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type Connector } from "@/lib/admin/integration";
import { Field, KV, Modal, PanelError, StatusChip, TableState, VocabSelect, inputStyle } from "../console";

const TOPOLOGY: { key: keyof Connector; label: string }[] = [
  { key: "tenancy_mode", label: "Tenancy mode" },
  { key: "contracting_entity", label: "Contracting entity" },
  { key: "credential_scope", label: "Credential scope" },
  { key: "funds_flow_mode", label: "Funds flow" },
  { key: "merchant_or_payee_role", label: "Merchant / payee role" },
  { key: "regulated_role", label: "Regulated role" },
  { key: "data_processing_role", label: "Data processing role" },
  { key: "revenue_presentation", label: "Revenue presentation" },
  { key: "arrangement_version", label: "Arrangement version" },
];

/** Step 1 — what this connector is, exactly as the backend holds it. */
export function TopologyPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [reason, setReason] = useState("");
  const missing = TOPOLOGY.filter((f) => !connector[f.key]);

  const suspend = useMutation({
    mutationFn: () => integrationApi.suspendConnector(tenant, connector.connector_id, reason.trim()),
    onSuccess: () => {
      toast.success("Connector suspended");
      setSuspendOpen(false);
      setReason("");
      qc.invalidateQueries({ queryKey: integrationKeys.all(tenant) });
    },
    onError: (e) => toast.error(errMessage(e, "Could not suspend the connector")),
  });

  return (
    <div className="panel">
      <h3>Connector</h3>
      <KV k="Provider"><span className="mono">{connector.provider_name}</span></KV>
      <KV k="Type"><span className="mono">{connector.connector_type}</span></KV>
      <KV k="Auth"><span className="mono">{connector.auth_type}</span></KV>
      <KV k="Base URL"><span className="mono">{connector.base_url || "— not set (connector cannot be called)"}</span></KV>
      <KV k="UAT mode"><span className="mono">{connector.uat_mode}</span></KV>
      <KV k="Timeout"><span className="mono">{connector.timeout_ms} ms</span></KV>
      <KV k="Status"><StatusChip status={connector.status} /></KV>

      <div className="sectitle" style={{ marginTop: 14 }}>Commercial topology (§4.1)</div>
      {TOPOLOGY.map((f) => (
        <KV key={f.key} k={f.label}>
          {connector[f.key] ? <span className="mono">{String(connector[f.key])}</span> : <span style={{ color: "var(--danger)" }}>not declared</span>}
        </KV>
      ))}
      {missing.length > 0 && (
        <p style={{ fontSize: 12, marginTop: 8 }}>
          {missing.length} topology field{missing.length === 1 ? " is" : "s are"} undeclared. A production activation is refused until
          every field is declared; nothing is filled in for you.
        </p>
      )}

      {connector.status !== "SUSPENDED" && connector.status !== "RETIRED" && (
        <div style={{ marginTop: 14 }}>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => setSuspendOpen(true)}>
            Emergency suspend
          </button>
        </div>
      )}

      {suspendOpen && (
        <Modal
          title="Suspend connector"
          subtitle="Every call through this connector stops immediately."
          onClose={() => setSuspendOpen(false)}
          footer={
            <button type="button" className="btn btn-danger" disabled={!reason.trim() || suspend.isPending} onClick={() => suspend.mutate()}>
              {suspend.isPending ? "Suspending…" : "Suspend"}
            </button>
          }
        >
          <Field label="Reason" hint="Recorded on the connector's evidence trail.">
            <textarea style={inputStyle} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
        </Modal>
      )}
    </div>
  );
}

/** Step 2 — the carrier credential. Only metadata ever comes back. */
export function CredentialsPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "credentials");
  const creds = useQuery({ queryKey: key, queryFn: () => integrationApi.listCredentials(tenant, connector.connector_id) });

  const isJwt = connector.auth_type === "JWT_PASSWORD_GRANT";
  const [form, setForm] = useState({ environment: "", username: "", password: "", login_url: "", value: "" });
  const [revoke, setRevoke] = useState<{ id: string; compromised: boolean } | null>(null);
  const [note, setNote] = useState("");

  const submit = useMutation({
    mutationFn: () =>
      integrationApi.submitCredential(tenant, connector.connector_id, isJwt
        ? { environment: form.environment, credential_type: connector.auth_type, username: form.username.trim(), password: form.password, login_url: form.login_url.trim() }
        : { environment: form.environment, credential_type: connector.auth_type, value: form.value }),
    onSuccess: () => {
      toast.success("Credential stored in Vault");
      setForm((f) => ({ ...f, password: "", value: "" }));
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: integrationKeys.connector(tenant, connector.connector_id) });
    },
    onError: (e) => toast.error(errMessage(e, "Could not store the credential")),
  });

  const doRevoke = useMutation({
    mutationFn: () => integrationApi.revokeCredential(tenant, revoke!.id, note.trim(), revoke!.compromised),
    onSuccess: () => {
      toast.success(revoke?.compromised ? "Credential marked compromised and revoked" : "Credential revoked");
      setRevoke(null);
      setNote("");
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (e) => toast.error(errMessage(e, "Could not revoke the credential")),
  });

  const ready = !!form.environment && (isJwt ? !!form.username.trim() && !!form.password && /^https:\/\/\S+$/.test(form.login_url.trim()) : !!form.value);

  return (
    <div className="panel">
      <h3>Credentials</h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        Stored in Vault under a path derived for this connector. Only a fingerprint and hint are ever shown.
        MVNOC issues one account per parent brand; sub-brands use the parent&apos;s.
      </p>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Environment</th><th>Type</th><th>Fingerprint</th><th>Status</th><th>Submitted</th><th /></tr></thead>
          <tbody>
            <TableState colSpan={6} loading={creds.isLoading} error={creds.error} empty={(creds.data ?? []).length === 0}
              emptyLabel="No credential yet — nothing can authenticate to the provider." />
            {(creds.data ?? []).map((c) => (
              <tr key={c.credential_id}>
                <td className="mono">{c.environment}</td>
                <td className="mono">{c.credential_type}</td>
                <td className="mono">{c.fingerprint} {c.hint}</td>
                <td><StatusChip status={c.status} /></td>
                <td>{c.submitted_by}<div className="mono" style={{ fontSize: 11, opacity: 0.6 }}>{new Date(c.created_at).toLocaleString()}</div></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {c.status === "ACTIVE" && (
                    <>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRevoke({ id: c.credential_id, compromised: false })}>Revoke</button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => setRevoke({ id: c.credential_id, compromised: true })}>Compromised</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sectitle" style={{ marginTop: 14 }}>Submit or rotate</div>
      <form onSubmit={(e) => { e.preventDefault(); if (ready) submit.mutate(); }} autoComplete="off">
        <Field label="Environment" hint={connector.uat_mode === "PRODUCTION_TEST_SUBSCRIBERS" ? "This provider has no sandbox: UAT uses the production credential." : undefined}>
          <VocabSelect list="environments" style={inputStyle} value={form.environment} onChange={(v) => setForm({ ...form, environment: v })} />
        </Field>
        {isJwt ? (
          <>
            <Field label="Username"><input style={inputStyle} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field>
            <Field label="Password"><input style={inputStyle} type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
            <Field label="Login URL" hint="Must be https — the password is sent to it on every token refresh.">
              <input style={inputStyle} value={form.login_url} placeholder="https://…/auth/login" onChange={(e) => setForm({ ...form, login_url: e.target.value })} />
            </Field>
          </>
        ) : (
          <Field label="Secret"><input style={inputStyle} type="password" autoComplete="new-password" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
        )}
        <button type="submit" className="btn btn-primary btn-sm" disabled={!ready || submit.isPending}>
          {submit.isPending ? "Storing…" : "Store credential"}
        </button>
      </form>

      {revoke && (
        <Modal
          title={revoke.compromised ? "Mark credential compromised" : "Revoke credential"}
          subtitle={revoke.compromised ? "Revokes it now and starts the one-hour rotation clock (INT-LCM-005)." : "Calls using it stop immediately."}
          onClose={() => { setRevoke(null); setNote(""); }}
          footer={<button type="button" className="btn btn-danger" disabled={!note.trim() || doRevoke.isPending} onClick={() => doRevoke.mutate()}>Confirm</button>}
        >
          <Field label="Note"><textarea style={inputStyle} rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </Modal>
      )}
      {creds.error ? <PanelError error={creds.error} fallback="Could not load credentials." /> : null}
    </div>
  );
}
