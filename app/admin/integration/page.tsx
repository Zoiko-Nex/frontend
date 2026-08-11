"use client";

/**
 * Integration Ecosystem — connect a third-party provider (Stripe, a tax engine,
 * a KYC vendor) to ZoikoNex, and connect a tenant's own systems to ZoikoNex via
 * webhooks.
 *
 * The flow this screen implements is not a single "connect" button, deliberately.
 * ED-2026-08 imposes four gates, and the UI makes each one visible rather than
 * hiding it:
 *
 *   1. §4.1  Declare the commercial/regulatory topology. tenancy_mode is data,
 *            and funds flow / merchant role / regulated role / accounting
 *            presentation are separate governed attributes — never derived from
 *            it (AC-11).
 *   2. §4.4  Submit the secret through this audited API. It goes to Vault and is
 *            never retrievable; the screen can only ever show a fingerprint and
 *            a last-four hint.
 *   3. §11   Register the operations the connector may perform (an allow-list),
 *            then certify them through the sandbox gate.
 *   4. §10   Maker–checker activation. Whoever configures the connection cannot
 *            qualify, approve or activate it, so the final step is deliberately
 *            not available to the person who filled in the form.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, LoadingRows, EmptyState, ErrorBanner, DetailGrid, Detail,
} from "../_components/ui";
import StatusBadge from "../_components/StatusBadge";

/* ───────── Types mirroring the integration-ecosystem contracts ───────── */

interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  rate_limit_per_minute?: number;
  timeout_ms?: number;
  tenancy_mode?: string;
  contracting_entity?: string;
  credential_scope?: string;
  funds_flow_mode?: string;
  merchant_or_payee_role?: string;
  regulated_role?: string;
  data_processing_role?: string;
  revenue_presentation?: string;
  arrangement_version?: string;
  created_at?: string;
}

interface Operation {
  operation_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  is_retryable: boolean;
  certification_status: string;
  certified_by?: string;
  description?: string;
}

interface CredentialView {
  credential_id: string;
  environment: string;
  credential_type: string;
  fingerprint: string;
  hint?: string;
  status: string;
  submitted_by: string;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
}

interface Approval {
  approval_role: string;
  approver_identity: string;
  decision: string;
  note?: string;
  decided_at: string;
}

interface Activation {
  activation_id: string;
  connector_id: string;
  environment: string;
  maker_identity: string;
  qualification_status: string;
  approvals_complete: boolean;
  checker_identity?: string;
  state: string;
  reject_reason?: string;
  approvals?: Approval[];
}

/* ───────── Reference data ───────── */

// Mirrors the CHECK constraint on integration.connectors.connector_type.
const CONNECTOR_TYPES = [
  "PAYMENT_GATEWAY", "MOBILE_MONEY", "TAX_PROVIDER", "KYC_VENDOR",
  "ESIM_RSP", "ILD_CARRIER", "ROAMING_CLEARING", "DEVICE_PROTECTION",
  "CRM", "ERP", "ANALYTICS",
];

const AUTH_TYPES = [
  { value: "API_KEY", label: "API key", supported: true },
  { value: "HMAC", label: "HMAC signed request", supported: true },
  { value: "OAUTH2_CLIENT_CREDENTIALS", label: "OAuth2 client credentials (not yet supported)", supported: false },
  { value: "MTLS", label: "Mutual TLS (not yet supported)", supported: false },
];

const TENANCY_MODES = [
  { value: "TENANT_MANAGED", label: "Tenant-managed — you contract with the provider" },
  { value: "PROVIDER_SUBACCOUNT", label: "Provider subaccount — Zoiko holds the master, you get a scoped account" },
  { value: "ZOIKO_MANAGED", label: "Zoiko-managed — Zoiko contracts and meters usage to you" },
];

/**
 * ED-2026-08 §4.2 / §4.5. Payments default to tenant-owned because the tenant is
 * merchant of record, funds settle to their account, and the card industry places
 * the checks on them. Running everyone's card traffic through one Zoiko account
 * would make Zoiko a payment facilitator — a licensing undertaking, not a
 * configuration choice.
 */
function defaultTenancyFor(connectorType: string): string {
  switch (connectorType) {
    case "PAYMENT_GATEWAY":
    case "MOBILE_MONEY":
      return "TENANT_MANAGED";
    case "KYC_VENDOR":
      return "PROVIDER_SUBACCOUNT";
    case "ANALYTICS":
    case "TAX_PROVIDER":
      return "ZOIKO_MANAGED";
    default:
      return "TENANT_MANAGED";
  }
}

/** Which secret fields a credential type needs — kept in step with Material.Validate. */
function credentialFieldsFor(authType: string): string[] {
  switch (authType) {
    case "API_KEY": return ["value", "header_name", "scheme"];
    case "HMAC": return ["value"];
    case "OAUTH2_CLIENT_CREDENTIALS": return ["client_id", "client_secret", "token_url", "scope"];
    case "MTLS": return ["client_cert", "client_key"];
    default: return ["value"];
  }
}

type Tab = "providers" | "webhooks";

export default function IntegrationEcosystemPage() {
  const [tab, setTab] = useState<Tab>("providers");

  return (
    <div>
      <SectionHeader
        title="Integration Ecosystem"
        subtitle="Connect third-party providers to ZoikoNex, and connect your own systems to ZoikoNex."
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["providers", "webhooks"] as Tab[]).map((t) => (
          <Button key={t} variant={tab === t ? "primary" : "default"} onClick={() => setTab(t)}>
            {t === "providers" ? "Provider connections" : "Your webhooks"}
          </Button>
        ))}
      </div>
      {tab === "providers" ? <ProvidersTab /> : <WebhooksTab />}
    </div>
  );
}

/* ═════════════════════════ Provider connections ═════════════════════════ */

function ProvidersTab() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<Connector | null>(null);

  const q = useQuery({
    queryKey: ["integration", "connectors"],
    queryFn: () => api.get<{ connectors?: Connector[] }>("integration", "/v1/connectors"),
  });
  const connectors = q.data?.connectors ?? [];

  return (
    <>
      <Card>
        <SectionHeader
          title="Provider connections"
          subtitle="A connection is only callable once it has a base URL, a credential, at least one certified operation, and an approved activation."
          actions={<Button variant="primary" onClick={() => setAddOpen(true)}>+ Connect a provider</Button>}
        />
        {q.isError ? <ErrorBanner error={q.error} /> : (
          <Table>
            <thead>
              <tr>
                <Th>Provider</Th><Th>Type</Th><Th>Tenancy</Th>
                <Th>Auth</Th><Th>Status</Th><Th />
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? <LoadingRows cols={6} /> : connectors.length === 0 ? (
                <tr>
                  <Td style={{ padding: 0 }} >
                    <EmptyState
                      title="No provider connections yet"
                      hint="Connect Stripe, a tax engine or a KYC vendor. ZoikoNex holds the credential and calls the provider for you, so your systems only ever talk to us."
                      action={<Button variant="primary" onClick={() => setAddOpen(true)}>+ Connect a provider</Button>}
                    />
                  </Td>
                  <Td /><Td /><Td /><Td /><Td />
                </tr>
              ) : connectors.map((c) => (
                <Tr key={c.connector_id} onClick={() => setSelected(c)}>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{c.connector_name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ax-text-faint)" }}>{c.provider_name}</div>
                  </Td>
                  <Td><span style={{ fontSize: 11.5 }}>{c.connector_type.replace(/_/g, " ")}</span></Td>
                  <Td>
                    {c.tenancy_mode
                      ? <span style={{ fontSize: 11.5 }}>{c.tenancy_mode.replace(/_/g, " ")}</span>
                      : <span style={{ fontSize: 11.5, color: "var(--ax-red, #f43f5e)" }}>not declared</span>}
                  </Td>
                  <Td><span style={{ fontSize: 11.5 }}>{c.auth_type.replace(/_/g, " ")}</span></Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td><Button variant="default" onClick={() => setSelected(c)}>Manage</Button></Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {addOpen && (
        <AddConnectorModal
          onClose={() => setAddOpen(false)}
          onDone={() => {
            setAddOpen(false);
            qc.invalidateQueries({ queryKey: ["integration", "connectors"] });
          }}
        />
      )}
      {selected && (
        <ConnectorDetailModal
          connector={selected}
          onClose={() => setSelected(null)}
          onChanged={() => qc.invalidateQueries({ queryKey: ["integration", "connectors"] })}
        />
      )}
    </>
  );
}

/* ───────── Step 1: register the connection + declare topology ───────── */

function AddConnectorModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    connector_name: "",
    provider_name: "",
    connector_type: "PAYMENT_GATEWAY",
    auth_type: "API_KEY",
    base_url: "",
    api_version: "",
    timeout_ms: 5000,
    rate_limit_per_minute: 0,
    // §4.1 topology
    tenancy_mode: defaultTenancyFor("PAYMENT_GATEWAY"),
    contracting_entity: "",
    credential_scope: "TENANT",
    funds_flow_mode: "",
    merchant_or_payee_role: "TENANT",
    regulated_role: "",
    data_processing_role: "PROCESSOR",
    revenue_presentation: "N-A",
    arrangement_version: "",
  });

  const isPaymentLike = form.connector_type === "PAYMENT_GATEWAY" || form.connector_type === "MOBILE_MONEY";

  const create = useMutation({
    mutationFn: () => api.post<{ connector_id: string }>("integration", "/v1/connectors", {
      ...form,
      // The API stores only a vault path; the actual secret is submitted
      // separately through the audited credential endpoint (§4.4).
      vault_credential_path: `zoikonex/pending/${form.provider_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    }),
    onSuccess: () => { toast.success("Connection registered in DRAFT"); onDone(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register connection"),
  });

  const valid = form.connector_name && form.provider_name && form.base_url && form.tenancy_mode;

  return (
    <Modal
      open onClose={onClose} title="Connect a provider" width={620}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!valid} loading={create.isPending} onClick={() => create.mutate()}>
          Register connection
        </Button>
      </>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 12.5, color: "var(--ax-text-dim)", margin: 0 }}>
          This registers the connection in <strong>DRAFT</strong>. You will then add
          the credential, register which operations are allowed, and request
          activation — which a different person has to approve.
        </p>

        <Field label="Display name">
          <Input value={form.connector_name} placeholder="Stripe — card acquiring"
            onChange={(e) => setForm({ ...form, connector_name: e.target.value })} />
        </Field>
        <Field label="Provider" hint="The provider's own name, e.g. stripe, suretax, onfido.">
          <Input value={form.provider_name} placeholder="stripe"
            onChange={(e) => setForm({ ...form, provider_name: e.target.value })} />
        </Field>

        <Field label="Capability">
          <Select
            value={form.connector_type}
            onChange={(e) => {
              const t = e.target.value;
              setForm({
                ...form,
                connector_type: t,
                tenancy_mode: defaultTenancyFor(t),
                merchant_or_payee_role: (t === "PAYMENT_GATEWAY" || t === "MOBILE_MONEY") ? "TENANT" : "N-A",
              });
            }}
          >
            {CONNECTOR_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
          </Select>
        </Field>

        <Field label="Authentication">
          <Select value={form.auth_type} onChange={(e) => setForm({ ...form, auth_type: e.target.value })}>
            {AUTH_TYPES.map((a) => (
              <option key={a.value} value={a.value} disabled={!a.supported}>{a.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Base URL" hint="Where ZoikoNex sends requests. Without this the connection can never be invoked.">
          <Input value={form.base_url} placeholder="https://api.stripe.com"
            onChange={(e) => setForm({ ...form, base_url: e.target.value })} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Timeout (ms)">
            <Input type="number" value={form.timeout_ms}
              onChange={(e) => setForm({ ...form, timeout_ms: Number(e.target.value) })} />
          </Field>
          <Field label="Rate limit / minute" hint="0 = provider default. Defends the provider's contract.">
            <Input type="number" value={form.rate_limit_per_minute}
              onChange={(e) => setForm({ ...form, rate_limit_per_minute: Number(e.target.value) })} />
          </Field>
        </div>

        {/* §4.1 topology — governed attributes, none derived from tenancy_mode. */}
        <div style={{
          border: "1px solid var(--ax-border)", borderRadius: 8, padding: 14,
          background: "var(--ax-bg-overlay)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            Commercial &amp; regulatory topology
          </div>
          <p style={{ fontSize: 11.5, color: "var(--ax-text-faint)", marginTop: 0, marginBottom: 12 }}>
            Required before production activation. These are recorded separately on
            purpose: who holds the contract does not determine who is merchant of
            record, whose money moves, or how revenue is presented.
          </p>

          <Field label="Whose provider account is used?">
            <Select value={form.tenancy_mode} onChange={(e) => setForm({ ...form, tenancy_mode: e.target.value })}>
              {TENANCY_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </Field>

          {isPaymentLike && form.tenancy_mode === "ZOIKO_MANAGED" && (
            <p style={{
              fontSize: 11.5, color: "var(--ax-amber, #f59e0b)", marginTop: 8,
              border: "1px solid var(--ax-amber, #f59e0b)", borderRadius: 6, padding: 10,
            }}>
              Zoiko-managed card acquiring means tenant receipts would flow through a
              Zoiko account. That makes Zoiko a payment facilitator and needs a
              written Legal/Compliance classification before it can reach
              production — it is not a configuration choice. Payments normally stay
              tenant-managed or use a provider subaccount.
            </p>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Field label="Contracting entity">
              <Input value={form.contracting_entity} placeholder="GoLite Mobile Inc"
                onChange={(e) => setForm({ ...form, contracting_entity: e.target.value })} />
            </Field>
            <Field label="Credential scope">
              <Select value={form.credential_scope} onChange={(e) => setForm({ ...form, credential_scope: e.target.value })}>
                <option value="TENANT">Tenant</option>
                <option value="PLATFORM">Platform</option>
                <option value="PROVIDER_SUBACCOUNT">Provider subaccount</option>
              </Select>
            </Field>
            <Field label="Funds flow" hint="&quot;no funds&quot; when nothing moves.">
              <Input value={form.funds_flow_mode} placeholder="direct-to-tenant"
                onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })} />
            </Field>
            <Field label="Merchant / payee">
              <Select value={form.merchant_or_payee_role}
                onChange={(e) => setForm({ ...form, merchant_or_payee_role: e.target.value })}>
                <option value="TENANT">Tenant</option>
                <option value="ZOIKO">Zoiko</option>
                <option value="PROVIDER">Provider</option>
                <option value="N-A">Not applicable</option>
              </Select>
            </Field>
            <Field label="Regulated role" hint="As classified by Legal/Compliance. Never inferred.">
              <Input value={form.regulated_role} placeholder="none / agent / e-money"
                onChange={(e) => setForm({ ...form, regulated_role: e.target.value })} />
            </Field>
            <Field label="Data-processing role">
              <Select value={form.data_processing_role}
                onChange={(e) => setForm({ ...form, data_processing_role: e.target.value })}>
                <option value="PROCESSOR">Processor</option>
                <option value="CONTROLLER">Controller</option>
                <option value="SUBPROCESSOR">Subprocessor</option>
                <option value="INDEPENDENT_CONTROLLER">Independent controller</option>
              </Select>
            </Field>
            <Field label="Revenue presentation" hint="UNDER_REVIEW blocks production activation for a resale arrangement.">
              <Select value={form.revenue_presentation}
                onChange={(e) => setForm({ ...form, revenue_presentation: e.target.value })}>
                <option value="N-A">Not applicable</option>
                <option value="GROSS">Gross</option>
                <option value="NET">Net</option>
                <option value="UNDER_REVIEW">Under review</option>
              </Select>
            </Field>
            <Field label="Arrangement version" hint="Immutable reference for the commercial/accounting assessment.">
              <Input value={form.arrangement_version} placeholder="ARR-2026-014"
                onChange={(e) => setForm({ ...form, arrangement_version: e.target.value })} />
            </Field>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ───────── Steps 2–4: credential, operations, activation ───────── */

function ConnectorDetailModal({ connector, onClose, onChanged }: {
  connector: Connector; onClose: () => void; onChanged: () => void;
}) {
  const [step, setStep] = useState<"credential" | "operations" | "activation">("credential");

  return (
    <Modal open onClose={onClose} title={connector.connector_name} width={720}
      footer={<Button variant="ghost" onClick={onClose}>Close</Button>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DetailGrid>
          <Detail label="Provider">{connector.provider_name}</Detail>
          <Detail label="Status"><StatusBadge status={connector.status} /></Detail>
          <Detail label="Connector ID"><CopyId value={connector.connector_id} /></Detail>
          <Detail label="Base URL">{connector.base_url || "— not set, cannot be invoked"}</Detail>
          <Detail label="Tenancy">{connector.tenancy_mode?.replace(/_/g, " ") || "not declared"}</Detail>
          <Detail label="Arrangement">{connector.arrangement_version || "—"}</Detail>
        </DetailGrid>

        <div style={{ display: "flex", gap: 6 }}>
          {([
            ["credential", "1 · Credential"],
            ["operations", "2 · Operations"],
            ["activation", "3 · Activation"],
          ] as const).map(([key, label]) => (
            <Button key={key} variant={step === key ? "primary" : "default"} onClick={() => setStep(key)}>
              {label}
            </Button>
          ))}
        </div>

        {step === "credential" && <CredentialSection connector={connector} />}
        {step === "operations" && <OperationsSection connector={connector} />}
        {step === "activation" && <ActivationSection connector={connector} onChanged={onChanged} />}
      </div>
    </Modal>
  );
}

function CredentialSection({ connector }: { connector: Connector }) {
  const qc = useQueryClient();
  const [environment, setEnvironment] = useState("PRODUCTION");
  const [material, setMaterial] = useState<Record<string, string>>({});

  const q = useQuery({
    queryKey: ["integration", "credentials", connector.connector_id],
    queryFn: () => api.get<{ credentials?: CredentialView[] }>(
      "integration", `/v1/connectors/${connector.connector_id}/credentials`),
  });

  const submit = useMutation({
    mutationFn: () => api.post("integration", `/v1/connectors/${connector.connector_id}/credentials`, {
      environment,
      credential_type: connector.auth_type,
      ...material,
    }),
    onSuccess: () => {
      toast.success("Credential stored in Vault");
      // Cleared immediately: the value must not linger in component state, and it
      // cannot be read back from the server either.
      setMaterial({});
      qc.invalidateQueries({ queryKey: ["integration", "credentials", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to store credential"),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => api.del("integration", `/v1/credentials/${id}`),
    onSuccess: () => {
      toast.success("Credential revoked");
      qc.invalidateQueries({ queryKey: ["integration", "credentials", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to revoke"),
  });

  const fields = credentialFieldsFor(connector.auth_type);
  const required = fields.filter((f) => !["header_name", "scheme", "scope"].includes(f));
  const valid = required.every((f) => (material[f] || "").trim() !== "");
  const credentials = q.data?.credentials ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12.5, color: "var(--ax-text-dim)", margin: 0 }}>
        The secret goes straight to the platform secrets vault. ZoikoNex cannot show
        it again afterwards — only a fingerprint and the last four characters, so
        you can confirm which key is installed against the provider&apos;s own
        dashboard.
      </p>

      <Field label="Environment" hint="Production and sandbox credentials are stored separately.">
        <Select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
          <option value="PRODUCTION">Production</option>
          <option value="SANDBOX">Sandbox</option>
        </Select>
      </Field>

      {fields.map((f) => (
        <Field
          key={f}
          label={f.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
          hint={f === "value" ? "Paste the provider's key, e.g. Stripe's sk_live_…" : undefined}
        >
          <Input
            type={f.includes("secret") || f === "value" || f === "client_key" ? "password" : "text"}
            autoComplete="off"
            value={material[f] || ""}
            onChange={(e) => setMaterial({ ...material, [f]: e.target.value })}
          />
        </Field>
      ))}

      <Button variant="primary" disabled={!valid} loading={submit.isPending} onClick={() => submit.mutate()}>
        Store credential
      </Button>

      <div>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Installed credentials
        </div>
        {q.isError ? <ErrorBanner error={q.error} /> : (
          <Table>
            <thead>
              <tr><Th>Environment</Th><Th>Key</Th><Th>Status</Th><Th>Last used</Th><Th /></tr>
            </thead>
            <tbody>
              {q.isLoading ? <LoadingRows cols={5} /> : credentials.length === 0 ? (
                <tr><Td style={{ padding: 0 }}><EmptyState title="No credential installed" hint="The connection cannot be activated until one is." /></Td><Td /><Td /><Td /><Td /></tr>
              ) : credentials.map((c) => (
                <Tr key={c.credential_id}>
                  <Td>{c.environment}</Td>
                  <Td>
                    <span className="mono" style={{ fontSize: 11.5 }}>{c.hint || c.fingerprint}</span>
                  </Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td><span style={{ fontSize: 11.5 }}>{c.last_used_at ? new Date(c.last_used_at).toLocaleString() : "never"}</span></Td>
                  <Td>
                    {c.status === "ACTIVE" && (
                      <Button variant="danger" onClick={() => revoke.mutate(c.credential_id)}>Revoke</Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

function OperationsSection({ connector }: { connector: Connector }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    operation_name: "", http_method: "POST", path_template: "",
    is_retryable: false, description: "",
  });

  const q = useQuery({
    queryKey: ["integration", "operations", connector.connector_id],
    queryFn: () => api.get<{ operations?: Operation[] }>(
      "integration", `/v1/connectors/${connector.connector_id}/operations`),
  });

  const register = useMutation({
    mutationFn: () => api.post("integration", `/v1/connectors/${connector.connector_id}/operations`, form),
    onSuccess: () => {
      toast.success("Operation registered");
      setForm({ operation_name: "", http_method: "POST", path_template: "", is_retryable: false, description: "" });
      qc.invalidateQueries({ queryKey: ["integration", "operations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register operation"),
  });

  const certify = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.post("integration", `/v1/operations/${id}/certify`, { status }),
    onSuccess: () => {
      toast.success("Certification updated");
      qc.invalidateQueries({ queryKey: ["integration", "operations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to certify"),
  });

  const ops = q.data?.operations ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12.5, color: "var(--ax-text-dim)", margin: 0 }}>
        Operations are an allow-list. Your systems name an operation, never a URL,
        so nothing can be called that isn&apos;t registered here. An operation must
        be certified before it can run against production credentials.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", gap: 12 }}>
        <Field label="Operation name" hint="Provider-neutral, so it survives changing provider: charge_card, not stripe_pi_create.">
          <Input value={form.operation_name} placeholder="charge_card"
            onChange={(e) => setForm({ ...form, operation_name: e.target.value })} />
        </Field>
        <Field label="Method">
          <Select value={form.http_method} onChange={(e) => setForm({ ...form, http_method: e.target.value })}>
            {["POST", "GET", "PUT", "PATCH", "DELETE"].map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="Path" hint="Appended to the base URL. {placeholders} are filled per call. No .. or // allowed.">
        <Input value={form.path_template} placeholder="/v1/payment_intents"
          onChange={(e) => setForm({ ...form, path_template: e.target.value })} />
      </Field>

      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5 }}>
        <input type="checkbox" checked={form.is_retryable} style={{ marginTop: 3 }}
          onChange={(e) => setForm({ ...form, is_retryable: e.target.checked })} />
        <span>
          Safe to retry automatically.
          <span style={{ color: "var(--ax-text-faint)" }}>
            {" "}Leave unticked for anything that must not repeat — charging a card,
            activating a SIM. Retrying after an ambiguous timeout would charge twice.
          </span>
        </span>
      </label>

      <Button variant="primary"
        disabled={!form.operation_name || !form.path_template}
        loading={register.isPending}
        onClick={() => register.mutate()}>
        Register operation
      </Button>

      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Operation</Th><Th>Request</Th><Th>Retry</Th><Th>Certification</Th><Th /></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={5} /> : ops.length === 0 ? (
              <tr><Td style={{ padding: 0 }}><EmptyState title="No operations registered" hint="Nothing can be invoked until at least one exists." /></Td><Td /><Td /><Td /><Td /></tr>
            ) : ops.map((op) => (
              <Tr key={op.operation_id}>
                <Td><span style={{ fontWeight: 600 }}>{op.operation_name}</span></Td>
                <Td><span className="mono" style={{ fontSize: 11 }}>{op.http_method} {op.path_template}</span></Td>
                <Td><span style={{ fontSize: 11.5 }}>{op.is_retryable ? "retryable" : "once only"}</span></Td>
                <Td><StatusBadge status={op.certification_status} /></Td>
                <Td>
                  {op.certification_status === "UNCERTIFIED" && (
                    <Button variant="default" onClick={() => certify.mutate({ id: op.operation_id, status: "SANDBOX_PASSED" })}>
                      Mark sandbox passed
                    </Button>
                  )}
                  {op.certification_status === "SANDBOX_PASSED" && (
                    <Button variant="primary" onClick={() => certify.mutate({ id: op.operation_id, status: "CERTIFIED" })}>
                      Certify for production
                    </Button>
                  )}
                  {op.certification_status === "CERTIFIED" && (
                    <Button variant="danger" onClick={() => certify.mutate({ id: op.operation_id, status: "REVOKED" })}>
                      Revoke
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

function ActivationSection({ connector, onChanged }: { connector: Connector; onChanged: () => void }) {
  const qc = useQueryClient();
  const [environment, setEnvironment] = useState("PRODUCTION");

  const q = useQuery({
    queryKey: ["integration", "activations", connector.connector_id],
    queryFn: () => api.get<{ activations?: Activation[]; required_approvals?: string[] }>(
      "integration", `/v1/connectors/${connector.connector_id}/activation-requests`),
  });

  const request = useMutation({
    mutationFn: () => api.post("integration", `/v1/connectors/${connector.connector_id}/activation-requests`, { environment }),
    onSuccess: () => { toast.success("Activation requested"); refresh(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to request activation"),
  });

  const approve = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.post("integration", `/v1/activations/${id}/approvals`, { role, decision: "APPROVED" }),
    onSuccess: () => { toast.success("Approval recorded"); refresh(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to approve"),
  });

  const activate = useMutation({
    mutationFn: (id: string) => api.post("integration", `/v1/activations/${id}/activate`, {}),
    onSuccess: () => { toast.success("Connection activated"); refresh(); onChanged(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to activate"),
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["integration", "activations", connector.connector_id] });
  }

  const activations = q.data?.activations ?? [];
  const required = q.data?.required_approvals ?? [];
  const open = activations.find((a) => !["ACTIVATED", "REJECTED", "WITHDRAWN"].includes(a.state));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 12.5, color: "var(--ax-text-dim)", margin: 0 }}>
        Activation needs a second person. Whoever configured this connection cannot
        approve or activate it — if the buttons below are refused for you, that is
        the control working, not a bug.
      </p>

      {required.length > 0 && (
        <div style={{ fontSize: 12, color: "var(--ax-text-dim)" }}>
          Approvals required for this connection:{" "}
          <strong>{required.join(", ")}</strong>
        </div>
      )}

      {!open && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <Field label="Environment">
            <Select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
              <option value="PRODUCTION">Production</option>
              <option value="SANDBOX">Sandbox</option>
            </Select>
          </Field>
          <Button variant="primary" loading={request.isPending} onClick={() => request.mutate()}>
            Request activation
          </Button>
        </div>
      )}

      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Environment</Th><Th>Maker</Th><Th>Qualification</Th><Th>Approvals</Th><Th>State</Th><Th /></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={6} /> : activations.length === 0 ? (
              <tr><Td style={{ padding: 0 }}><EmptyState title="No activation requests" hint="Register a credential and at least one certified operation first." /></Td><Td /><Td /><Td /><Td /><Td /></tr>
            ) : activations.map((a) => (
              <Tr key={a.activation_id}>
                <Td>{a.environment}</Td>
                <Td><span style={{ fontSize: 11.5 }}>{a.maker_identity}</span></Td>
                <Td><StatusBadge status={a.qualification_status} /></Td>
                <Td>
                  <span style={{ fontSize: 11.5 }}>
                    {(a.approvals ?? []).filter((ap) => ap.decision === "APPROVED").length} of {required.length}
                  </span>
                </Td>
                <Td><StatusBadge status={a.state} /></Td>
                <Td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {required
                      .filter((role) => !(a.approvals ?? []).some((ap) => ap.approval_role === role))
                      .map((role) => (
                        <Button key={role} variant="default"
                          onClick={() => approve.mutate({ id: a.activation_id, role })}>
                          Approve as {role}
                        </Button>
                      ))}
                    {a.state === "APPROVED" && (
                      <Button variant="primary" loading={activate.isPending}
                        onClick={() => activate.mutate(a.activation_id)}>
                        Activate
                      </Button>
                    )}
                  </div>
                  {a.reject_reason && (
                    <div style={{ fontSize: 11, color: "var(--ax-red, #f43f5e)", marginTop: 4 }}>{a.reject_reason}</div>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

/* ═════════════════════════ Your webhooks ═════════════════════════ */

interface Subscription {
  subscription_id: string;
  callback_url: string;
  event_types: string[];
  status: string;
  signing_key_id?: string;
  consecutive_failures?: number;
  last_success_at?: string;
  last_failure_reason?: string;
  created_at: string;
}

interface Delivery {
  delivery_id: string;
  event_id: string;
  event_type: string;
  status: string;
  attempts: number;
  outcome_class?: string;
  response_status?: number;
  deadline_at?: string;
  created_at: string;
}

function WebhooksTab() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [secret, setSecret] = useState<{ id: string; secret: string } | null>(null);

  const subs = useQuery({
    queryKey: ["integration", "hub"],
    queryFn: () => api.get<{ subscriptions?: Subscription[] }>("integration", "/v1/hub"),
  });
  const deliveries = useQuery({
    queryKey: ["integration", "deliveries"],
    queryFn: () => api.get<{ deliveries?: Delivery[] }>("integration", "/v1/webhooks/deliveries?limit=25"),
  });

  const pause = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch("integration", `/v1/hub/${id}`, { status }),
    onSuccess: () => { toast.success("Subscription updated"); qc.invalidateQueries({ queryKey: ["integration", "hub"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to update"),
  });

  const rotate = useMutation({
    mutationFn: (id: string) => api.post<{ signing_secret: string }>("integration", `/v1/hub/${id}/rotate-secret`, {}),
    onSuccess: (res, id) => {
      setSecret({ id, secret: res.signing_secret });
      qc.invalidateQueries({ queryKey: ["integration", "hub"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to rotate"),
  });

  const list = subs.data?.subscriptions ?? [];

  return (
    <>
      <Card>
        <SectionHeader
          title="Your webhook endpoints"
          subtitle="ZoikoNex pushes events to your systems, so you don't poll us. Deliveries are signed and retried for 24 hours."
          actions={<Button variant="primary" onClick={() => setAddOpen(true)}>+ Add endpoint</Button>}
        />
        {subs.isError ? <ErrorBanner error={subs.error} /> : (
          <Table>
            <thead><tr><Th>Endpoint</Th><Th>Events</Th><Th>Key</Th><Th>Status</Th><Th /></tr></thead>
            <tbody>
              {subs.isLoading ? <LoadingRows cols={5} /> : list.length === 0 ? (
                <tr>
                  <Td style={{ padding: 0 }}>
                    <EmptyState
                      title="No endpoints registered"
                      hint="Register a URL and we'll POST signed events to it as they happen."
                      action={<Button variant="primary" onClick={() => setAddOpen(true)}>+ Add endpoint</Button>}
                    />
                  </Td><Td /><Td /><Td /><Td />
                </tr>
              ) : list.map((s) => (
                <Tr key={s.subscription_id}>
                  <Td><span className="mono" style={{ fontSize: 11.5 }}>{s.callback_url}</span></Td>
                  <Td>
                    <span style={{ fontSize: 11.5 }}>
                      {s.event_types.length === 0 ? "all events" : s.event_types.join(", ")}
                    </span>
                  </Td>
                  <Td><span className="mono" style={{ fontSize: 11 }}>{s.signing_key_id || "v1"}</span></Td>
                  <Td>
                    <StatusBadge status={s.status} />
                    {(s.consecutive_failures ?? 0) > 0 && (
                      <div style={{ fontSize: 10.5, color: "var(--ax-amber, #f59e0b)", marginTop: 2 }}>
                        {s.consecutive_failures} consecutive failures
                      </div>
                    )}
                  </Td>
                  <Td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="default" onClick={() => rotate.mutate(s.subscription_id)}>Rotate secret</Button>
                      <Button variant="default"
                        onClick={() => pause.mutate({ id: s.subscription_id, status: s.status === "ACTIVE" ? "PAUSED" : "ACTIVE" })}>
                        {s.status === "ACTIVE" ? "Pause" : "Resume"}
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card style={{ marginTop: 16 }}>
        <SectionHeader title="Recent deliveries" subtitle="What we sent, and what your endpoint said." />
        {deliveries.isError ? <ErrorBanner error={deliveries.error} /> : (
          <Table>
            <thead><tr><Th>Event</Th><Th>Type</Th><Th>Attempts</Th><Th>Outcome</Th><Th>Status</Th></tr></thead>
            <tbody>
              {deliveries.isLoading ? <LoadingRows cols={5} /> : (deliveries.data?.deliveries ?? []).length === 0 ? (
                <tr><Td style={{ padding: 0 }}><EmptyState title="No deliveries yet" /></Td><Td /><Td /><Td /><Td /></tr>
              ) : (deliveries.data?.deliveries ?? []).map((d) => (
                <Tr key={d.delivery_id}>
                  <Td><CopyId value={d.event_id} /></Td>
                  <Td><span style={{ fontSize: 11.5 }}>{d.event_type}</span></Td>
                  <Td>{d.attempts}</Td>
                  <Td><span style={{ fontSize: 11.5 }}>{d.outcome_class || "—"}{d.response_status ? ` (${d.response_status})` : ""}</span></Td>
                  <Td><StatusBadge status={d.status} /></Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {addOpen && (
        <AddEndpointModal
          onClose={() => setAddOpen(false)}
          onCreated={(id, s) => {
            setAddOpen(false);
            setSecret({ id, secret: s });
            qc.invalidateQueries({ queryKey: ["integration", "hub"] });
          }}
        />
      )}
      {secret && <SecretShownOnceModal secret={secret.secret} onClose={() => setSecret(null)} />}
    </>
  );
}

function AddEndpointModal({ onClose, onCreated }: {
  onClose: () => void; onCreated: (id: string, secret: string) => void;
}) {
  const [callbackUrl, setCallbackUrl] = useState("");
  const [eventTypes, setEventTypes] = useState("");
  const [description, setDescription] = useState("");

  const create = useMutation({
    mutationFn: () => api.post<{ subscription_id: string; signing_secret: string }>(
      "integration", "/v1/hub", {
        callback_url: callbackUrl,
        event_types: eventTypes.split(",").map((s) => s.trim()).filter(Boolean),
        description,
      }),
    onSuccess: (res) => onCreated(res.subscription_id, res.signing_secret),
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register endpoint"),
  });

  return (
    <Modal open onClose={onClose} title="Add a webhook endpoint" width={540}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="primary" disabled={!callbackUrl} loading={create.isPending} onClick={() => create.mutate()}>
          Register endpoint
        </Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Callback URL" hint="Must be https, with no username or password in the URL.">
          <Input value={callbackUrl} placeholder="https://your-app.example.com/hooks/zoikonex"
            onChange={(e) => setCallbackUrl(e.target.value)} />
        </Field>
        <Field label="Event types" hint="Comma-separated. Leave blank for everything. A trailing * matches a prefix, e.g. billing.*">
          <Input value={eventTypes} placeholder="billing.invoice.generated.v1, payment.*"
            onChange={(e) => setEventTypes(e.target.value)} />
        </Field>
        <Field label="Description">
          <Input value={description} placeholder="Order fulfilment service"
            onChange={(e) => setDescription(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

/**
 * The signing secret is returned once and is not retrievable afterwards, so this
 * modal is the only chance to copy it. The verification recipe is shown alongside
 * it because a tenant that does not check the timestamp has a replayable endpoint.
 */
function SecretShownOnceModal({ secret, onClose }: { secret: string; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="Signing secret — shown once" width={560}
      footer={<Button variant="primary" onClick={onClose}>I have stored it</Button>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", margin: 0 }}>
          Store this now. It cannot be retrieved later — only rotated.
        </p>
        <pre className="mono" style={{
          fontSize: 12.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)",
          borderRadius: 8, padding: 14, whiteSpace: "pre-wrap", margin: 0,
        }}>{secret}</pre>
        <Button variant="default" onClick={() => { navigator.clipboard?.writeText(secret); toast.success("Copied"); }}>
          Copy secret
        </Button>

        <div style={{ fontSize: 12, color: "var(--ax-text-dim)" }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Verifying a delivery</div>
          <pre className="mono" style={{
            fontSize: 11.5, background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)",
            borderRadius: 8, padding: 12, whiteSpace: "pre-wrap", margin: 0,
          }}>{`X-ZoikoNex-Signature: t=<unix>,v1=<hex>
X-ZoikoNex-Timestamp: <unix>
X-ZoikoNex-Signing-Key-Id: v1
X-ZoikoNex-Event-Id: <dedupe on this>

expected = HMAC_SHA256(secret, "<t>.<raw body>")

1. Check t is within 5 minutes of now, then
2. compare digests in constant time.

Retries are expected: we deliver at least once for up to
24 hours, so dedupe on X-ZoikoNex-Event-Id and tolerate
out-of-order arrival.`}</pre>
        </div>
      </div>
    </Modal>
  );
}
