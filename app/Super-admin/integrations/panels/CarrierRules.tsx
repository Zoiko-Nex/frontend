"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type Connector } from "@/lib/admin/integration";
import { Chip, Field, Modal, StatusChip, TableState, inputStyle } from "../console";

/** Reads a JSON file the operator picked (a provider reference document). */
function useJsonFile(onLoaded: (doc: unknown, name: string) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const input = (
    <input
      ref={ref}
      type="file"
      accept="application/json,.json"
      style={{ display: "none" }}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        try {
          onLoaded(JSON.parse(await file.text()), file.name);
        } catch {
          toast.error(`${file.name} is not valid JSON`);
        }
      }}
    />
  );
  return { input, open: () => ref.current?.click() };
}

/**
 * Step 3 — the carrier's rules, held as data: what its result codes mean, its
 * rate limits, the SIMs UAT may touch, and which sub-brands it has approved.
 */
export interface BrandOption {
  id: string;
  name: string;
}

export function CarrierRulesPanel({ tenant, connector, brands }: { tenant: string; connector: Connector; brands: BrandOption[] }) {
  return (
    <>
      <ResultCodes tenant={tenant} connector={connector} />
      <RatePolicies tenant={tenant} connector={connector} />
      <TestSubscribers tenant={tenant} connector={connector} />
      <BrandAuthorizations tenant={tenant} connector={connector} brands={brands} />
    </>
  );
}

function ResultCodes({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "result-codes");
  const codes = useQuery({ queryKey: key, queryFn: () => integrationApi.listResultCodes(tenant, connector.connector_id) });
  const [filter, setFilter] = useState("");

  const importDoc = useMutation({
    mutationFn: (doc: unknown) => integrationApi.importResultCodes(tenant, connector.connector_id, doc),
    onSuccess: (r) => {
      toast.success(`Result codes imported: ${r.created} new, ${r.updated} changed, ${r.unchanged} unchanged`);
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
    },
    onError: (e) => toast.error(errMessage(e, "Import refused")),
  });
  const file = useJsonFile((doc) => importDoc.mutate(doc));

  const rows = (codes.data ?? []).filter((c) =>
    !filter || `${c.code} ${c.message} ${c.outcome_class}`.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="panel">
      <h3>Result codes <Chip tone="c-grey">{codes.data?.length ?? 0}</Chip></h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        What each provider code means. Nexus answers refusals with HTTP 200, so without these every answer is UNMAPPED.
        Import <span className="mono">reference-data/nexus/result-codes.json</span> from the backend repository.
      </p>
      {file.input}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button type="button" className="btn btn-primary btn-sm" disabled={importDoc.isPending} onClick={file.open}>
          {importDoc.isPending ? "Importing…" : "Import document…"}
        </button>
        <input aria-label="Filter result codes" placeholder="Filter: code, message, class" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: 1 }} />
      </div>
      <div className="tablewrap" style={{ maxHeight: 320, overflow: "auto" }}>
        <table>
          <thead><tr><th>Code</th><th>Class</th><th>Message</th><th>What to do</th></tr></thead>
          <tbody>
            <TableState colSpan={4} loading={codes.isLoading} error={codes.error} empty={rows.length === 0}
              emptyLabel={filter ? "No code matches." : "No result codes imported."} />
            {rows.map((c) => (
              <tr key={c.code + (c.message_match ?? "")}>
                <td className="mono">{c.code}{c.message_match && <div style={{ fontSize: 10, opacity: 0.6 }}>when “{c.message_match}”</div>}</td>
                <td><StatusChip status={c.outcome_class} />{c.requires_escalation && <Chip tone="c-red">escalate</Chip>}</td>
                <td style={{ fontSize: 12 }}>{c.message}</td>
                <td style={{ fontSize: 12 }}>{c.action_to_fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RatePolicies({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "rate-policies");
  const policies = useQuery({ queryKey: key, queryFn: () => integrationApi.listRatePolicies(tenant, connector.connector_id) });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
  };

  const apply = useMutation({
    mutationFn: (doc: unknown) => integrationApi.setRatePolicies(tenant, connector.connector_id, doc),
    onSuccess: (r) => { toast.success(`${r.rate_policies.length} rate polic${r.rate_policies.length === 1 ? "y" : "ies"} applied`); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Rate policies refused")),
  });
  const remove = useMutation({
    mutationFn: (id: string) => integrationApi.removeRatePolicy(tenant, connector.connector_id, id),
    onSuccess: () => { toast.success("Rate policy removed"); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not remove the policy")),
  });
  const file = useJsonFile((doc) => apply.mutate(doc));
  const [confirm, setConfirm] = useState<string | null>(null);

  return (
    <div className="panel">
      <h3>Rate limits</h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        The provider&apos;s limits, enforced before every call and across every server. Apply
        <span className="mono"> reference-data/nexus/rate-policies.json</span>; re-applying keeps budgets already spent.
      </p>
      {file.input}
      <button type="button" className="btn btn-primary btn-sm" style={{ marginBottom: 10 }} disabled={apply.isPending} onClick={file.open}>
        {apply.isPending ? "Applying…" : "Apply policy document…"}
      </button>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Policy</th><th>Limit</th><th>Applies to</th><th>Source</th><th /></tr></thead>
          <tbody>
            <TableState colSpan={5} loading={policies.isLoading} error={policies.error} empty={(policies.data ?? []).length === 0}
              emptyLabel="No rate policies — the provider's limits are not enforced." />
            {(policies.data ?? []).map((p) => (
              <tr key={p.rate_policy_id}>
                <td className="strong">{p.policy_name}<div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>v{p.version} · {p.scope}</div></td>
                <td className="mono">{p.max_requests} / {p.window_seconds}s{p.min_interval_seconds > 0 && ` · ≥${p.min_interval_seconds}s apart`}</td>
                <td className="mono" style={{ fontSize: 11 }}>{p.applies_to.join(", ")}</td>
                <td style={{ fontSize: 11 }}>{p.source_reference}</td>
                <td style={{ textAlign: "right" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(p.rate_policy_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirm && (
        <Modal title="Remove rate policy" subtitle="The provider's limit stops being enforced." onClose={() => setConfirm(null)}
          footer={<button type="button" className="btn btn-danger" onClick={() => { remove.mutate(confirm); setConfirm(null); }}>Remove</button>}>
          <p style={{ fontSize: 13 }}>Calls will no longer be held to this limit. Remove it only if the provider has withdrawn it.</p>
        </Modal>
      )}
    </div>
  );
}

function TestSubscribers({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "test-subscribers");
  const subs = useQuery({ queryKey: key, queryFn: () => integrationApi.listTestSubscribers(tenant, connector.connector_id) });
  const [form, setForm] = useState({ identifier_type: "MSISDN", identifier: "", label: "", expires_at: "" });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
  };

  const add = useMutation({
    mutationFn: () => integrationApi.addTestSubscriber(tenant, connector.connector_id, {
      identifier_type: form.identifier_type, identifier: form.identifier.trim(), label: form.label.trim(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : undefined,
    }),
    onSuccess: () => { toast.success("Test SIM registered"); setForm({ ...form, identifier: "", label: "" }); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not register the test SIM")),
  });
  const remove = useMutation({
    mutationFn: (id: string) => integrationApi.removeTestSubscriber(tenant, connector.connector_id, id),
    onSuccess: () => { toast.success("Test SIM removed"); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Could not remove the test SIM")),
  });

  const isUAT = connector.uat_mode === "PRODUCTION_TEST_SUBSCRIBERS";
  return (
    <div className="panel">
      <h3>UAT test SIMs</h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        {isUAT
          ? "This provider has no test environment: before go-live, calls may only change these SIMs. Register Zoiko inventory SIMs by MSISDN and ICCID."
          : "Used only when the connector's UAT mode is PRODUCTION_TEST_SUBSCRIBERS."}
        {" "}The number is stored as a keyed hash; only the last four digits are shown.
      </p>
      <form style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 160px auto", gap: 8, alignItems: "end", marginBottom: 10 }}
        onSubmit={(e) => { e.preventDefault(); if (form.identifier.trim() && form.label.trim()) add.mutate(); }}>
        <select aria-label="Identifier type" value={form.identifier_type} onChange={(e) => setForm({ ...form, identifier_type: e.target.value })}>
          <option value="MSISDN">MSISDN</option>
          <option value="ICCID">ICCID</option>
        </select>
        <input aria-label="Identifier" placeholder="number" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
        <input aria-label="Label" placeholder="label, e.g. UAT SIM 3" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input aria-label="Expires" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!form.identifier.trim() || !form.label.trim() || add.isPending}>Register</button>
      </form>
      <div className="tablewrap">
        <table>
          <thead><tr><th>Type</th><th>Ends</th><th>Label</th><th>Expires</th><th>Added by</th><th /></tr></thead>
          <tbody>
            <TableState colSpan={6} loading={subs.isLoading} error={subs.error} empty={(subs.data ?? []).length === 0}
              emptyLabel="No test SIMs registered." />
            {(subs.data ?? []).map((s) => (
              <tr key={s.test_subscriber_id}>
                <td className="mono">{s.identifier_type}</td>
                <td className="mono">…{s.identifier_last4}</td>
                <td>{s.label}</td>
                <td className="mono">{s.expires_at ? new Date(s.expires_at).toLocaleDateString() : "—"}</td>
                <td>{s.created_by}</td>
                <td style={{ textAlign: "right" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => remove.mutate(s.test_subscriber_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BrandAuthorizations({ tenant, connector, brands }: { tenant: string; connector: Connector; brands: BrandOption[] }) {
  const brandName = (id: string) => brands.find((b) => b.id === id)?.name ?? id;
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "brand-authorizations");
  const auths = useQuery({ queryKey: key, queryFn: () => integrationApi.listBrandAuthorizations(tenant, connector.connector_id) });
  const [form, setForm] = useState({ authorized_brand: "", authorization_reference: "", authorized_on: "", expires_on: "" });

  const add = useMutation({
    mutationFn: () => integrationApi.addBrandAuthorization(tenant, connector.connector_id, {
      authorized_brand: form.authorized_brand.trim(), authorization_reference: form.authorization_reference.trim(),
      authorized_on: form.authorized_on, expires_on: form.expires_on || undefined,
    }),
    onSuccess: () => { toast.success("Carrier approval recorded"); setForm({ authorized_brand: "", authorization_reference: "", authorized_on: "", expires_on: "" }); qc.invalidateQueries({ queryKey: key }); },
    onError: (e) => toast.error(errMessage(e, "Could not record the approval")),
  });
  const revoke = useMutation({
    mutationFn: (id: string) => integrationApi.revokeBrandAuthorization(tenant, connector.connector_id, id),
    onSuccess: () => { toast.success("Approval revoked"); qc.invalidateQueries({ queryKey: key }); },
    onError: (e) => toast.error(errMessage(e, "Could not revoke")),
  });
  const ready = form.authorized_brand.trim() && form.authorization_reference.trim() && form.authorized_on;

  return (
    <div className="panel">
      <h3>Sub-brand approvals</h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        A sub-brand provisions through its parent brand&apos;s connector only once T-Mobile has approved its Third-Party Reseller application.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); if (ready) add.mutate(); }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Sub-brand" hint={brands.length === 0 ? "This tenant has no brands registered in identity." : undefined}>
            <select style={inputStyle} value={form.authorized_brand} onChange={(e) => setForm({ ...form, authorized_brand: e.target.value })}>
              <option value="">— select a brand —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Carrier approval reference"><input style={inputStyle} value={form.authorization_reference} onChange={(e) => setForm({ ...form, authorization_reference: e.target.value })} /></Field>
          <Field label="Approved on"><input style={inputStyle} type="date" value={form.authorized_on} onChange={(e) => setForm({ ...form, authorized_on: e.target.value })} /></Field>
          <Field label="Expires on (optional)"><input style={inputStyle} type="date" value={form.expires_on} onChange={(e) => setForm({ ...form, expires_on: e.target.value })} /></Field>
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={!ready || add.isPending}>Record approval</button>
      </form>
      <div className="tablewrap" style={{ marginTop: 10 }}>
        <table>
          <thead><tr><th>Sub-brand</th><th>Reference</th><th>Approved</th><th>Expires</th><th /></tr></thead>
          <tbody>
            <TableState colSpan={5} loading={auths.isLoading} error={auths.error} empty={(auths.data ?? []).length === 0}
              emptyLabel="No sub-brand approvals: only the parent brand can provision." />
            {(auths.data ?? []).map((a) => (
              <tr key={a.brand_authorization_id}>
                <td>{brandName(a.authorized_brand)}</td>
                <td>{a.authorization_reference}</td>
                <td className="mono">{a.authorized_on}</td>
                <td className="mono">{a.expires_on ?? "—"}</td>
                <td style={{ textAlign: "right" }}><button type="button" className="btn btn-ghost btn-sm" onClick={() => revoke.mutate(a.brand_authorization_id)}>Revoke</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
