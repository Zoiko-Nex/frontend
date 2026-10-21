"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiException } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import { platformApi } from "@/lib/admin/platform/client";
import { integrationApi, integrationKeys, type Activation, type Connector, type InvokeResult } from "@/lib/admin/integration";
import { Field, KV, Modal, PanelError, StatusChip, TableState, VocabSelect, inputStyle } from "../console";

/** Step 6 — what still stands between this connector and live service. */
export function ReadinessPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const r = useQuery({
    queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness"),
    queryFn: () => integrationApi.readiness(tenant, connector.connector_id),
  });
  if (r.isLoading) return <div className="panel"><h3>Readiness</h3><p style={{ fontSize: 12, opacity: 0.6 }}>Loading…</p></div>;
  if (r.error || !r.data) {
    return <div className="panel"><h3>Readiness</h3><PanelError error={r.error} fallback="No readiness report for this provider." /></div>;
  }
  const rep = r.data.readiness;
  return (
    <div className="panel">
      <h3>Readiness <StatusChip status={rep.activatable ? "READY_TO_ASSESS" : "BLOCKED"} /></h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        Computed from this connector&apos;s configuration and the code ({rep.idd} v{rep.idd_version}). Nothing here can mark a gate
        passed — that takes evidence recorded against the provider.
      </p>
      <KV k="Operations">{r.data.operations_certified} of {r.data.operations_registered} certified · {rep.operations_catalogued} catalogued</KV>
      <KV k="Result codes">{rep.verified_result_codes}</KV>
      {rep.why_not && <KV k="First blocker"><span style={{ color: "var(--danger)" }}>{rep.why_not}</span></KV>}
      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {rep.gates.map((g) => (
          <details key={g.id} style={{ border: "1px solid var(--line, #e2e8f0)", borderRadius: 8, padding: "8px 10px" }}>
            <summary style={{ cursor: "pointer", display: "flex", gap: 8, alignItems: "center" }}>
              <span className="mono strong">{g.id}</span> {g.name} <StatusChip status={g.status} />
              {(g.blockers?.length ?? 0) > 0 && <span style={{ fontSize: 11, opacity: 0.7 }}>{g.blockers!.length} blocker{g.blockers!.length === 1 ? "" : "s"}</span>}
            </summary>
            {(g.blockers ?? []).map((b) => <p key={b} style={{ fontSize: 12, color: "var(--danger)", margin: "6px 0" }}>✗ {b}</p>)}
            {(g.done ?? []).map((d) => <p key={d} style={{ fontSize: 12, margin: "6px 0", opacity: 0.8 }}>✓ {d}</p>)}
          </details>
        ))}
      </div>
    </div>
  );
}

/**
 * Step 7 — the governed path to service (ED-2026-08 §10): request, automated
 * qualification, independent approvals, then a checker who is none of them.
 * Controls are shown only where the backend would accept the action.
 */
export function ActivationPanel({ tenant, connector, approvalRoles }: { tenant: string; connector: Connector; approvalRoles: string[] }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "activations");
  const acts = useQuery({ queryKey: key, queryFn: () => integrationApi.listActivations(tenant, connector.connector_id) });
  const invalidate = () => qc.invalidateQueries({ queryKey: integrationKeys.all(tenant) });
  const fail = (what: string) => (e: unknown) => toast.error(errMessage(e, what));

  const open = (acts.data?.activations ?? []).find((a) => !["ACTIVATED", "REJECTED", "WITHDRAWN"].includes(a.state));
  const history = (acts.data?.activations ?? []).filter((a) => a !== open);
  const required = acts.data?.required_approvals ?? [];

  // Chosen explicitly every time: which environments a request may target is
  // the backend's rule, and a defaulted PRODUCTION is one click from live.
  const [env, setEnv] = useState("");
  const [qual, setQual] = useState({ suite: "", digest: "", passed: true });
  const [decision, setDecision] = useState<{ role: string; decision: "APPROVED" | "REJECTED" } | null>(null);
  const [note, setNote] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [reason, setReason] = useState("");

  const request = useMutation({ mutationFn: () => integrationApi.requestActivation(tenant, connector.connector_id, env),
    onSuccess: () => { toast.success(`${env} activation requested`); invalidate(); }, onError: fail("Request refused") });
  const qualify = useMutation({ mutationFn: (a: Activation) => integrationApi.recordQualification(tenant, a.activation_id, { suite: qual.suite.trim(), digest: qual.digest.trim(), passed: qual.passed }),
    onSuccess: () => { toast.success("Qualification recorded"); invalidate(); }, onError: fail("Qualification refused") });
  const approve = useMutation({ mutationFn: (a: Activation) => integrationApi.approve(tenant, a.activation_id, { role: decision!.role, decision: decision!.decision, note: note.trim() || undefined }),
    onSuccess: () => { toast.success("Decision recorded"); setDecision(null); setNote(""); invalidate(); }, onError: fail("Decision refused") });
  const activate = useMutation({ mutationFn: (a: Activation) => integrationApi.activate(tenant, a.activation_id),
    onSuccess: (a) => { toast.success(a.environment === "SANDBOX" ? "UAT opened — the connector is in SANDBOX" : "Connector activated"); invalidate(); }, onError: fail("Activation refused") });
  const withdraw = useMutation({ mutationFn: (a: Activation) => integrationApi.withdraw(tenant, a.activation_id, reason.trim()),
    onSuccess: () => { toast.success("Request withdrawn"); setWithdrawOpen(false); setReason(""); invalidate(); }, onError: fail("Withdrawal refused") });

  const decided = (role: string) => open?.approvals?.find((a) => a.approval_role === role);
  const qualified = open?.qualification_status === "PASSED";
  const allApproved = !!open && required.every((r) => decided(r)?.decision === "APPROVED");

  return (
    <div className="panel">
      <h3>Activation</h3>
      {acts.error ? <PanelError error={acts.error} fallback="Could not load activation requests." /> : null}
      {acts.isLoading ? <p style={{ fontSize: 12, opacity: 0.6 }}>Loading…</p> : !open ? (
        <>
          <p className="psub" style={{ margin: "4px 0 10px" }}>
            {connector.uat_mode === "PRODUCTION_TEST_SUBSCRIBERS"
              ? "SANDBOX opens UAT on production, confined to the registered test SIMs. PRODUCTION puts the connector into live service."
              : "SANDBOX opens UAT. PRODUCTION puts the connector into live service."}
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <VocabSelect list="environments" label="Environment" value={env} onChange={setEnv} />
            <button type="button" className="btn btn-primary btn-sm" disabled={!env || request.isPending} onClick={() => request.mutate()}>Request activation</button>
          </div>
        </>
      ) : (
        <>
          <KV k="Request"><span className="mono">{open.environment}</span> · <StatusChip status={open.state} /> · opened by {open.maker_identity}</KV>

          <div className="sectitle" style={{ marginTop: 12 }}>1 · Qualification</div>
          {qualified ? (
            <KV k="Passed"><span className="mono">{open.qualification_suite} · {open.qualification_digest}</span></KV>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); qualify.mutate(open); }}>
              <p style={{ fontSize: 12 }}>Recorded by someone other than {open.maker_identity}, with the evidence approvers will sign off.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" }}>
                <Field label="Suite"><input style={inputStyle} value={qual.suite} onChange={(e) => setQual({ ...qual, suite: e.target.value })} /></Field>
                <Field label="Results digest"><input style={inputStyle} value={qual.digest} onChange={(e) => setQual({ ...qual, digest: e.target.value })} /></Field>
                <Field label="Result">
                  <select value={qual.passed ? "pass" : "fail"} onChange={(e) => setQual({ ...qual, passed: e.target.value === "pass" })}>
                    <option value="pass">Passed</option><option value="fail">Failed</option>
                  </select>
                </Field>
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={!qual.suite.trim() || !qual.digest.trim() || qualify.isPending}>Record qualification</button>
            </form>
          )}

          <div className="sectitle" style={{ marginTop: 12 }}>2 · Approvals {!qualified && <span style={{ fontWeight: 400, fontSize: 11 }}>(open once qualification has passed)</span>}</div>
          <div className="tablewrap">
            <table>
              <thead><tr><th>Role</th><th>Decision</th><th>By</th><th /></tr></thead>
              <tbody>
                {required.map((role) => {
                  const d = decided(role);
                  return (
                    <tr key={role}>
                      <td className="mono">{role}</td>
                      <td>{d ? <StatusChip status={d.decision} /> : <span style={{ opacity: 0.6 }}>awaiting</span>}{d?.note && <div style={{ fontSize: 11 }}>{d.note}</div>}</td>
                      <td>{d?.approver_identity ?? "—"}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        {!d && qualified && (
                          <>
                            <button type="button" className="btn btn-ghost btn-sm" aria-label={`Approve as ${role}`} onClick={() => { setNote(""); setDecision({ role, decision: "APPROVED" }); }}>Approve</button>
                            <button type="button" className="btn btn-ghost btn-sm" aria-label={`Reject as ${role}`} onClick={() => { setNote(""); setDecision({ role, decision: "REJECTED" }); }}>Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Each role is decided once, by a different person; the maker cannot decide any. Roles: {approvalRoles.join(", ")}.</p>

          <div className="sectitle" style={{ marginTop: 12 }}>3 · Activate</div>
          <p style={{ fontSize: 12 }}>By a checker who is neither the maker nor any approver.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-primary btn-sm" disabled={!qualified || !allApproved || activate.isPending} onClick={() => activate.mutate(open)}>
              {open.environment === "SANDBOX" ? "Open UAT" : "Activate"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setWithdrawOpen(true)}>Withdraw request…</button>
          </div>
        </>
      )}

      {history.length > 0 && (
        <>
          <div className="sectitle" style={{ marginTop: 14 }}>History</div>
          {history.map((a) => (
            <KV key={a.activation_id} k={new Date(a.created_at).toLocaleDateString()}>
              <span className="mono">{a.environment}</span> <StatusChip status={a.state} /> {a.reject_reason && <span style={{ fontSize: 11 }}>{a.reject_reason}</span>}
            </KV>
          ))}
        </>
      )}

      {decision && open && (
        <Modal title={`${decision.decision === "APPROVED" ? "Approve" : "Reject"} as ${decision.role}`} subtitle="Final: it cannot be changed afterwards." onClose={() => setDecision(null)}
          footer={<button type="button" className={`btn ${decision.decision === "APPROVED" ? "btn-primary" : "btn-danger"}`} disabled={approve.isPending} onClick={() => approve.mutate(open)}>Confirm</button>}>
          <Field label="Note"><textarea style={inputStyle} rows={3} value={note} onChange={(e) => setNote(e.target.value)} /></Field>
        </Modal>
      )}
      {withdrawOpen && open && (
        <Modal title="Withdraw activation request" onClose={() => setWithdrawOpen(false)}
          footer={<button type="button" className="btn btn-danger" disabled={!reason.trim() || withdraw.isPending} onClick={() => withdraw.mutate(open)}>Withdraw</button>}>
          <Field label="Reason"><textarea style={inputStyle} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        </Modal>
      )}
    </div>
  );
}

/** Step 8 — calls made through the connector, and a way to make one. */
export function CallsPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "invocations");
  const calls = useQuery({ queryKey: key, queryFn: () => integrationApi.listInvocations(tenant, connector.connector_id) });
  const ops = useQuery({ queryKey: integrationKeys.part(tenant, connector.connector_id, "operations"),
    queryFn: () => integrationApi.listOperations(tenant, connector.connector_id) });
  const [operation, setOperation] = useState("");
  const [payload, setPayload] = useState("{}");
  const [result, setResult] = useState<InvokeResult | null>(null);
  // One Idempotency-Key per logical call: pressing "Call provider" again after
  // a lost answer replays the first call instead of sending a second provider
  // write. A new key only once an answer arrived or the call itself changed.
  const [callKey, setCallKey] = useState(() => platformApi.uuid());
  const changeCall = (apply: () => void) => { apply(); setCallKey(platformApi.uuid()); };

  let parsed: unknown = null;
  let parseError = "";
  try { parsed = payload.trim() ? JSON.parse(payload) : {}; } catch { parseError = "Payload is not valid JSON."; }

  const invoke = useMutation({
    mutationFn: () => integrationApi.invoke(tenant, connector.connector_id, operation, parsed, callKey),
    onSuccess: (r) => { setResult(r); setCallKey(platformApi.uuid()); qc.invalidateQueries({ queryKey: key }); },
    onError: (e) => {
      // No status, a gateway error or a timeout means no answer came back: the
      // call may have reached the provider. The key is kept, so "Call provider"
      // again replays this call instead of sending a second write.
      const status = e instanceof ApiException ? e.status : 0;
      if (status === 0 || status === 502 || status === 503 || status === 504) {
        toast.warning("No answer received — the call may have reached the provider. Check the ledger below before anything else; calling again replays this same call.");
        qc.invalidateQueries({ queryKey: key });
        return;
      }
      toast.error(errMessage(e, "The call was refused before reaching the provider"));
    },
  });

  return (
    <div className="panel">
      <h3>Calls</h3>
      <form onSubmit={(e) => { e.preventDefault(); if (operation && !parseError) invoke.mutate(); }}>
        <Field label="Operation">
          <select style={inputStyle} value={operation} onChange={(e) => { const v = e.target.value; changeCall(() => setOperation(v)); }}>
            <option value="">— select —</option>
            {(ops.data ?? []).filter((o) => o.certification_status !== "REVOKED").map((o) => (
              <option key={o.operation_id} value={o.operation_name}>{o.operation_name} ({o.certification_status})</option>
            ))}
          </select>
        </Field>
        <Field label="Payload (JSON)" hint={connector.status === "SANDBOX" ? "UAT: every MSISDN/ICCID must be a registered test SIM." : undefined}>
          <textarea style={{ ...inputStyle, fontFamily: "monospace" }} rows={5} value={payload} onChange={(e) => { const v = e.target.value; changeCall(() => setPayload(v)); }} />
        </Field>
        {parseError && <p role="alert" style={{ color: "var(--danger)", fontSize: 12 }}>{parseError}</p>}
        <button type="submit" className="btn btn-primary btn-sm" disabled={!operation || !!parseError || invoke.isPending}>{invoke.isPending ? "Calling…" : "Call provider"}</button>
      </form>
      {result && (
        <div style={{ marginTop: 12, padding: 10, border: "1px solid var(--line, #e2e8f0)", borderRadius: 8 }}>
          <KV k="Outcome"><StatusChip status={result.outcome} /> {result.uat && <span className="chip c-amber">UAT</span>}</KV>
          {result.provider_code && <KV k="Provider said"><span className="mono">{result.provider_code}</span> {result.provider_message}</KV>}
          {result.action_to_fix && <KV k="What to do">{result.action_to_fix}</KV>}
          {result.requires_escalation && <KV k="Escalate"><span style={{ color: "var(--danger)" }}>The carrier says to raise a ticket.</span></KV>}
          {(result.warning_codes?.length ?? 0) > 0 && <KV k="Warnings"><span className="mono">{result.warning_codes!.join(", ")}</span></KV>}
          {result.outcome === "OUTCOME_UNKNOWN" && <KV k="Before retrying"><span style={{ color: "var(--danger)" }}>Query the subscriber&apos;s state — a retried write can apply twice.</span></KV>}
          <KV k="Transaction"><span className="mono">{result.provider_transaction_id ?? "—"}</span></KV>
        </div>
      )}

      <div className="sectitle" style={{ marginTop: 14 }}>Ledger</div>
      <div className="tablewrap" style={{ maxHeight: 320, overflow: "auto" }}>
        <table>
          <thead><tr><th>When</th><th>Operation</th><th>Outcome</th><th>Provider</th><th>Transaction</th></tr></thead>
          <tbody>
            <TableState colSpan={5} loading={calls.isLoading} error={calls.error} empty={(calls.data ?? []).length === 0} emptyLabel="No calls yet." />
            {(calls.data ?? []).map((c) => (
              <tr key={c.invocation_id}>
                <td className="mono" style={{ fontSize: 11 }}>{new Date(c.created_at).toLocaleString()}</td>
                <td className="mono" style={{ fontSize: 11 }}>{c.operation_name}</td>
                <td><StatusChip status={c.outcome} />{c.is_uat && <span className="chip c-amber">UAT</span>}</td>
                <td className="mono" style={{ fontSize: 11 }}>{c.provider_result_code ?? "—"}{c.error_summary && <div style={{ fontSize: 10, opacity: 0.7 }}>{c.error_summary}</div>}</td>
                <td className="mono" style={{ fontSize: 10 }}>{c.provider_transaction_id ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
