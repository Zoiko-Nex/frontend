"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, LoadingRows, EmptyState, ErrorBanner, DetailGrid, Detail,
} from "../components/admin/ui";
import StatusBadge from "../components/admin/StatusBadge";

/* ───────── Types mirroring integration-ecosystem domain models ───────── */

export interface Connector {
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

export interface Operation {
  operation_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  is_retryable: boolean;
  certification_status: string;
  certified_by?: string;
  description?: string;
}

export interface CredentialView {
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

export interface Approval {
  approval_role: string;
  approver_identity: string;
  decision: string;
  note?: string;
  decided_at: string;
}

export interface Activation {
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

export interface WebhookSubscription {
  subscription_id: string;
  callback_url: string;
  event_types: string[];
  status: string;
  created_at: string;
  description?: string;
}

/* ───────── Reference Data ───────── */

const CONNECTOR_TYPES = [
  "PAYMENT_GATEWAY", "MOBILE_MONEY", "TAX_PROVIDER", "KYC_VENDOR",
  "ESIM_RSP", "ILD_CARRIER", "ROAMING_CLEARING", "DEVICE_PROTECTION",
  "CRM", "ERP", "ANALYTICS",
];

const AUTH_TYPES = [
  { value: "API_KEY", label: "API Key", supported: true },
  { value: "HMAC", label: "HMAC Signed Request", supported: true },
  { value: "OAUTH2_CLIENT_CREDENTIALS", label: "OAuth2 Client Credentials (not yet supported)", supported: false },
  { value: "MTLS", label: "Mutual TLS (not yet supported)", supported: false },
];

const TENANCY_MODES = [
  { value: "TENANT_MANAGED", label: "Tenant-managed — tenant contracts directly with provider (e.g. Stripe)" },
  { value: "PROVIDER_SUBACCOUNT", label: "Provider subaccount — Zoiko holds master, tenant gets scoped account" },
  { value: "ZOIKO_MANAGED", label: "Zoiko-managed — Zoiko contracts and meters usage to tenant" },
];

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

function credentialFieldsFor(authType: string): string[] {
  switch (authType) {
    case "API_KEY": return ["value", "header_name", "scheme"];
    case "HMAC": return ["value"];
    case "OAUTH2_CLIENT_CREDENTIALS": return ["client_id", "client_secret", "token_url", "scope"];
    case "MTLS": return ["client_cert", "client_key"];
    default: return ["value"];
  }
}

/* ───────── Main Integration Component ───────── */

export default function IntegrationTab() {
  const [tab, setTab] = useState<"providers" | "webhooks">("providers");

  return (
    <div className="w-full flex flex-col gap-6 font-['Plus_Jakarta_Sans']">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-slate-800">Integration Ecosystem</h1>
        <p className="text-sm text-slate-600">
          Connect third-party services (Stripe, tax engines, KYC vendors) and configure outbound webhooks to your website or platform.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("providers")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "providers"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Provider Connections
        </button>
        <button
          onClick={() => setTab("webhooks")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "webhooks"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Outbound Webhooks
        </button>
      </div>

      {tab === "providers" ? <ProvidersTab /> : <WebhooksTab />}
    </div>
  );
}

/* ───────── Providers Sub-Tab ───────── */

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
          title="Provider Connections"
          subtitle="A connection is callable once it has a base URL, credentials stored in Vault, certified operations, and an approved activation."
          actions={
            <Button variant="primary" onClick={() => setAddOpen(true)}>
              + Connect a Provider
            </Button>
          }
        />
        {q.isError ? (
          <ErrorBanner error={q.error} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Provider</Th>
                <Th>Type</Th>
                <Th>Tenancy Mode</Th>
                <Th>Auth</Th>
                <Th>Status</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <LoadingRows cols={6} />
              ) : connectors.length === 0 ? (
                <tr>
                  <Td style={{ padding: 0 }}>
                    <EmptyState
                      title="No Provider Connections"
                      hint="Connect Stripe, a tax engine, or a KYC vendor. Credentials stay in Vault; ZoikoNex securely proxies calls for your application."
                      action={
                        <Button variant="primary" onClick={() => setAddOpen(true)}>
                          + Connect a Provider
                        </Button>
                      }
                    />
                  </Td>
                  <Td /><Td /><Td /><Td />
                </tr>
              ) : (
                connectors.map((c) => (
                  <Tr key={c.connector_id} onClick={() => setSelected(c)}>
                    <Td>
                      <div className="font-semibold text-slate-800">{c.connector_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.provider_name}</div>
                    </Td>
                    <Td><span className="text-xs text-slate-600">{c.connector_type.replace(/_/g, " ")}</span></Td>
                    <Td>
                      {c.tenancy_mode ? (
                        <span className="text-xs text-slate-600">{c.tenancy_mode.replace(/_/g, " ")}</span>
                      ) : (
                        <span className="text-xs text-rose-500 font-semibold">Not declared</span>
                      )}
                    </Td>
                    <Td><span className="text-xs text-slate-600">{c.auth_type.replace(/_/g, " ")}</span></Td>
                    <Td><StatusBadge status={c.status} /></Td>
                    <Td>
                      <Button variant="default" onClick={(e) => { e.stopPropagation(); setSelected(c); }}>
                        Manage
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
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

/* ───────── Register Provider Modal ───────── */

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
    mutationFn: () =>
      api.post<{ connector_id: string }>("integration", "/v1/connectors", {
        ...form,
        vault_credential_path: `zoikonex/pending/${form.provider_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      }),
    onSuccess: () => {
      toast.success("Connector registered in DRAFT state");
      onDone();
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register connector"),
  });

  const valid = form.connector_name && form.provider_name && form.base_url && form.tenancy_mode;

  return (
    <Modal
      open
      onClose={onClose}
      title="Connect a Provider"
      width={640}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!valid} loading={create.isPending} onClick={() => create.mutate()}>
            Register Connection
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-xs text-slate-600">
        <p className="text-slate-500">
          This registers the connection in <strong>DRAFT</strong> state. Next, submit credentials (stored directly in Vault), register permitted operations, and request activation.
        </p>

        <Field label="Display Name">
          <Input
            value={form.connector_name}
            placeholder="Stripe — Card Acquiring"
            onChange={(e) => setForm({ ...form, connector_name: e.target.value })}
          />
        </Field>
        <Field label="Provider Identifier" hint="Unique provider slug (e.g. stripe, suretax, onfido)">
          <Input
            value={form.provider_name}
            placeholder="stripe"
            onChange={(e) => setForm({ ...form, provider_name: e.target.value })}
          />
        </Field>

        <Field label="Connector Capability">
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
            {CONNECTOR_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </Field>

        <Field label="Authentication Scheme">
          <Select value={form.auth_type} onChange={(e) => setForm({ ...form, auth_type: e.target.value })}>
            {AUTH_TYPES.map((a) => (
              <option key={a.value} value={a.value} disabled={!a.supported}>{a.label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Base Endpoint URL" hint="Base URL for outbound API calls (e.g. https://api.stripe.com)">
          <Input
            value={form.base_url}
            placeholder="https://api.stripe.com"
            onChange={(e) => setForm({ ...form, base_url: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Timeout (ms)">
            <Input
              type="number"
              value={form.timeout_ms}
              onChange={(e) => setForm({ ...form, timeout_ms: Number(e.target.value) })}
            />
          </Field>
          <Field label="Rate Limit / min" hint="0 = provider default">
            <Input
              type="number"
              value={form.rate_limit_per_minute}
              onChange={(e) => setForm({ ...form, rate_limit_per_minute: Number(e.target.value) })}
            />
          </Field>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Commercial & Regulatory Topology
          </div>
          <p className="text-[11px] text-slate-500">
            Defines contractual boundaries, money flow, and data roles before production activation.
          </p>

          <Field label="Account Ownership / Tenancy Mode">
            <Select value={form.tenancy_mode} onChange={(e) => setForm({ ...form, tenancy_mode: e.target.value })}>
              {TENANCY_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </Field>

          {isPaymentLike && form.tenancy_mode === "ZOIKO_MANAGED" && (
            <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-300 rounded-lg p-2.5">
              ⚠️ Zoiko-managed card acquiring means tenant payments flow through a central Zoiko account. This requires payment facilitator licensing approval before production activation.
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contracting Entity">
              <Input
                value={form.contracting_entity}
                placeholder="Acme Telecom Inc"
                onChange={(e) => setForm({ ...form, contracting_entity: e.target.value })}
              />
            </Field>
            <Field label="Credential Scope">
              <Select value={form.credential_scope} onChange={(e) => setForm({ ...form, credential_scope: e.target.value })}>
                <option value="TENANT">Tenant</option>
                <option value="PLATFORM">Platform</option>
                <option value="PROVIDER_SUBACCOUNT">Provider Subaccount</option>
              </Select>
            </Field>
            <Field label="Funds Flow Mode">
              <Input
                value={form.funds_flow_mode}
                placeholder="direct-to-tenant"
                onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })}
              />
            </Field>
            <Field label="Merchant of Record">
              <Select value={form.merchant_or_payee_role} onChange={(e) => setForm({ ...form, merchant_or_payee_role: e.target.value })}>
                <option value="TENANT">Tenant</option>
                <option value="ZOIKO">Zoiko</option>
                <option value="PROVIDER">Provider</option>
                <option value="N-A">N/A</option>
              </Select>
            </Field>
            <Field label="Regulated Role">
              <Input
                value={form.regulated_role}
                placeholder="none / agent / e-money"
                onChange={(e) => setForm({ ...form, regulated_role: e.target.value })}
              />
            </Field>
            <Field label="Data Processing Role">
              <Select value={form.data_processing_role} onChange={(e) => setForm({ ...form, data_processing_role: e.target.value })}>
                <option value="PROCESSOR">Processor</option>
                <option value="CONTROLLER">Controller</option>
                <option value="SUBPROCESSOR">Subprocessor</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ───────── Connector Management Modal ───────── */

function ConnectorDetailModal({
  connector,
  onClose,
  onChanged,
}: {
  connector: Connector;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [step, setStep] = useState<"credential" | "operations" | "activation">("credential");

  return (
    <Modal open onClose={onClose} title={connector.connector_name} width={740} footer={<Button variant="ghost" onClick={onClose}>Close</Button>}>
      <div className="flex flex-col gap-4">
        <DetailGrid>
          <Detail label="Provider">{connector.provider_name}</Detail>
          <Detail label="Status"><StatusBadge status={connector.status} /></Detail>
          <Detail label="Connector ID"><CopyId value={connector.connector_id} /></Detail>
          <Detail label="Base URL">{connector.base_url || "— Not configured —"}</Detail>
          <Detail label="Tenancy">{connector.tenancy_mode?.replace(/_/g, " ") || "Not declared"}</Detail>
          <Detail label="Auth Type">{connector.auth_type}</Detail>
        </DetailGrid>

        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setStep("credential")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              step === "credential" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            1. Vault Credentials
          </button>
          <button
            onClick={() => setStep("operations")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              step === "operations" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            2. Permitted Operations
          </button>
          <button
            onClick={() => setStep("activation")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              step === "activation" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            3. Activation & Approvals
          </button>
        </div>

        {step === "credential" && <CredentialSection connector={connector} />}
        {step === "operations" && <OperationsSection connector={connector} />}
        {step === "activation" && <ActivationSection connector={connector} onChanged={onChanged} />}
      </div>
    </Modal>
  );
}

/* ───────── Step 1: Credential Management (Vault integration) ───────── */

function CredentialSection({ connector }: { connector: Connector }) {
  const qc = useQueryClient();
  const [environment, setEnvironment] = useState("PRODUCTION");
  const [material, setMaterial] = useState<Record<string, string>>({});

  const q = useQuery({
    queryKey: ["integration", "credentials", connector.connector_id],
    queryFn: () =>
      api.get<{ credentials?: CredentialView[] }>("integration", `/v1/connectors/${connector.connector_id}/credentials`),
  });

  const submit = useMutation({
    mutationFn: () =>
      api.post("integration", `/v1/connectors/${connector.connector_id}/credentials`, {
        environment,
        credential_type: connector.auth_type,
        ...material,
      }),
    onSuccess: () => {
      toast.success("Credential securely submitted directly to Vault");
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
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to revoke credential"),
  });

  const fields = credentialFieldsFor(connector.auth_type);
  const required = fields.filter((f) => !["header_name", "scheme", "scope"].includes(f));
  const valid = required.every((f) => (material[f] || "").trim() !== "");
  const credentials = q.data?.credentials ?? [];

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-800">
        🔒 Credentials (e.g. Stripe <code>sk_live_...</code>) are stored directly in HashiCorp Vault. They are never written to standard database tables and cannot be viewed after submission.
      </div>

      <Field label="Environment">
        <Select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
          <option value="PRODUCTION">Production</option>
          <option value="SANDBOX">Sandbox</option>
        </Select>
      </Field>

      {fields.map((f) => (
        <Field
          key={f}
          label={f.replace(/_/g, " ").toUpperCase()}
          hint={f === "value" ? "Enter your secret API key (e.g. Stripe sk_live_...)" : undefined}
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
        Store Credential in Vault
      </Button>

      <div className="mt-4 flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Installed Credentials</div>
        {q.isError ? (
          <ErrorBanner error={q.error} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Environment</Th>
                <Th>Fingerprint / Hint</Th>
                <Th>Status</Th>
                <Th>Last Used</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <LoadingRows cols={5} />
              ) : credentials.length === 0 ? (
                <tr>
                  <Td style={{ padding: 0 }}><EmptyState title="No Credentials Stored" hint="Install a Vault key to enable this connector." /></Td>
                  <Td /><Td /><Td /><Td />
                </tr>
              ) : (
                credentials.map((c) => (
                  <Tr key={c.credential_id}>
                    <Td>{c.environment}</Td>
                    <Td><span className="font-mono text-xs">{c.hint || c.fingerprint}</span></Td>
                    <Td><StatusBadge status={c.status} /></Td>
                    <Td>{c.last_used_at ? new Date(c.last_used_at).toLocaleString() : "Never"}</Td>
                    <Td>
                      {c.status === "ACTIVE" && (
                        <Button variant="danger" onClick={() => revoke.mutate(c.credential_id)}>
                          Revoke
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

/* ───────── Step 2: Permitted Operations ───────── */

function OperationsSection({ connector }: { connector: Connector }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    operation_name: "",
    http_method: "POST",
    path_template: "",
    is_retryable: false,
    description: "",
  });

  const q = useQuery({
    queryKey: ["integration", "operations", connector.connector_id],
    queryFn: () =>
      api.get<{ operations?: Operation[] }>("integration", `/v1/connectors/${connector.connector_id}/operations`),
  });

  const register = useMutation({
    mutationFn: () => api.post("integration", `/v1/connectors/${connector.connector_id}/operations`, form),
    onSuccess: () => {
      toast.success("Operation added to allow-list");
      setForm({ operation_name: "", http_method: "POST", path_template: "", is_retryable: false, description: "" });
      qc.invalidateQueries({ queryKey: ["integration", "operations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register operation"),
  });

  const certify = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.post("integration", `/v1/operations/${id}/certify`, { status }),
    onSuccess: () => {
      toast.success("Operation certification updated");
      qc.invalidateQueries({ queryKey: ["integration", "operations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to certify operation"),
  });

  const ops = q.data?.operations ?? [];

  return (
    <div className="flex flex-col gap-4 text-xs">
      <p className="text-slate-500">
        Operations form a strict allow-list. Apps execute provider actions by operation name (e.g. <code>charge_card</code>) rather than direct URLs.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Operation Name" hint="Neutral slug (e.g. charge_card, create_customer)">
          <Input
            value={form.operation_name}
            placeholder="charge_card"
            onChange={(e) => setForm({ ...form, operation_name: e.target.value })}
          />
        </Field>
        <Field label="HTTP Method">
          <Select value={form.http_method} onChange={(e) => setForm({ ...form, http_method: e.target.value })}>
            {["POST", "GET", "PUT", "PATCH", "DELETE"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Path Template" hint="Path appended to base URL (e.g. /v1/payment_intents)">
        <Input
          value={form.path_template}
          placeholder="/v1/payment_intents"
          onChange={(e) => setForm({ ...form, path_template: e.target.value })}
        />
      </Field>

      <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_retryable}
          onChange={(e) => setForm({ ...form, is_retryable: e.target.checked })}
        />
        <span>Safe to retry automatically on network failure (Idempotent)</span>
      </label>

      <Button
        variant="primary"
        disabled={!form.operation_name || !form.path_template}
        loading={register.isPending}
        onClick={() => register.mutate()}
      >
        Register Permitted Operation
      </Button>

      {q.isError ? (
        <ErrorBanner error={q.error} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Operation</Th>
              <Th>Endpoint</Th>
              <Th>Retryable</Th>
              <Th>Certification</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {q.isLoading ? (
              <LoadingRows cols={5} />
            ) : ops.length === 0 ? (
              <tr>
                <Td style={{ padding: 0 }}><EmptyState title="No Operations Registered" hint="Add at least one operation allow-list entry." /></Td>
                <Td /><Td /><Td /><Td />
              </tr>
            ) : (
              ops.map((op) => (
                <Tr key={op.operation_id}>
                  <Td><span className="font-semibold text-slate-800">{op.operation_name}</span></Td>
                  <Td><span className="font-mono text-xs">{op.http_method} {op.path_template}</span></Td>
                  <Td>{op.is_retryable ? "Yes" : "No"}</Td>
                  <Td><StatusBadge status={op.certification_status} /></Td>
                  <Td>
                    {op.certification_status === "UNCERTIFIED" && (
                      <Button variant="default" onClick={() => certify.mutate({ id: op.operation_id, status: "SANDBOX_PASSED" })}>
                        Mark Sandbox Passed
                      </Button>
                    )}
                    {op.certification_status === "SANDBOX_PASSED" && (
                      <Button variant="primary" onClick={() => certify.mutate({ id: op.operation_id, status: "CERTIFIED" })}>
                        Certify for Production
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

/* ───────── Step 3: Activation & Maker-Checker Flow ───────── */

function ActivationSection({ connector, onChanged }: { connector: Connector; onChanged: () => void }) {
  const qc = useQueryClient();
  const [environment, setEnvironment] = useState("PRODUCTION");

  const q = useQuery({
    queryKey: ["integration", "activations", connector.connector_id],
    queryFn: () =>
      api.get<{ activations?: Activation[]; required_approvals?: string[] }>(
        "integration",
        `/v1/connectors/${connector.connector_id}/activation-requests`
      ),
  });

  const request = useMutation({
    mutationFn: () =>
      api.post("integration", `/v1/connectors/${connector.connector_id}/activation-requests`, { environment }),
    onSuccess: () => {
      toast.success("Activation request created");
      qc.invalidateQueries({ queryKey: ["integration", "activations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to request activation"),
  });

  const approve = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.post("integration", `/v1/activations/${id}/approvals`, { role, decision: "APPROVED" }),
    onSuccess: () => {
      toast.success("Approval recorded");
      qc.invalidateQueries({ queryKey: ["integration", "activations", connector.connector_id] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to record approval"),
  });

  const activate = useMutation({
    mutationFn: (id: string) => api.post("integration", `/v1/activations/${id}/activate`, {}),
    onSuccess: () => {
      toast.success("Connector activated successfully!");
      qc.invalidateQueries({ queryKey: ["integration", "activations", connector.connector_id] });
      onChanged();
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Activation failed (Maker cannot be Checker)"),
  });

  const activations = q.data?.activations ?? [];
  const required = q.data?.required_approvals ?? [];
  const open = activations.find((a) => !["ACTIVATED", "REJECTED", "WITHDRAWN"].includes(a.state));

  return (
    <div className="flex flex-col gap-4 text-xs">
      <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-800">
        🛡️ <strong>Maker-Checker Guard:</strong> The user who configures a connector (Maker) cannot approve or perform final activation (Checker).
      </div>

      {!open && (
        <div className="flex gap-3 items-end">
          <Field label="Target Environment">
            <Select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
              <option value="PRODUCTION">Production</option>
              <option value="SANDBOX">Sandbox</option>
            </Select>
          </Field>
          <Button variant="primary" loading={request.isPending} onClick={() => request.mutate()}>
            Submit Activation Request
          </Button>
        </div>
      )}

      {q.isError ? (
        <ErrorBanner error={q.error} />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Environment</Th>
              <Th>Maker Identity</Th>
              <Th>Qualification</Th>
              <Th>State</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading ? (
              <LoadingRows cols={5} />
            ) : activations.length === 0 ? (
              <tr>
                <Td style={{ padding: 0 }}><EmptyState title="No Activation Requests" hint="Submit a request to activate this connector." /></Td>
                <Td /><Td /><Td /><Td />
              </tr>
            ) : (
              activations.map((a) => (
                <Tr key={a.activation_id}>
                  <Td>{a.environment}</Td>
                  <Td><span className="font-mono text-xs">{a.maker_identity}</span></Td>
                  <Td><StatusBadge status={a.qualification_status} /></Td>
                  <Td><StatusBadge status={a.state} /></Td>
                  <Td>
                    {a.state !== "ACTIVATED" && (
                      <div className="flex gap-2">
                        {required.map((role) => (
                          <Button key={role} variant="default" onClick={() => approve.mutate({ id: a.activation_id, role })}>
                            Approve ({role})
                          </Button>
                        ))}
                        <Button variant="primary" loading={activate.isPending} onClick={() => activate.mutate(a.activation_id)}>
                          Activate Connection
                        </Button>
                      </div>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

/* ───────── Outbound Webhooks Tab ───────── */

function WebhooksTab() {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [signingSecret, setSigningSecret] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["integration", "webhooks"],
    queryFn: () => api.get<{ subscriptions?: WebhookSubscription[] }>("integration", "/v1/hub"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.del("integration", `/v1/hub/${id}`),
    onSuccess: () => {
      toast.success("Webhook subscription deleted");
      qc.invalidateQueries({ queryKey: ["integration", "webhooks"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to delete webhook"),
  });

  const subscriptions = q.data?.subscriptions ?? [];

  return (
    <>
      <Card>
        <SectionHeader
          title="Outbound Webhook Hub"
          subtitle="Configure callback endpoints for real-time events (payment captures, invoice creations, account updates) sent from ZoikoNex."
          actions={
            <Button variant="primary" onClick={() => setAddOpen(true)}>
              + Register Webhook Endpoint
            </Button>
          }
        />

        {signingSecret && (
          <div className="m-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col gap-2">
            <div className="font-bold text-emerald-900 text-sm">
              🔑 Webhook Signing Secret (Copy Now! Shown only once):
            </div>
            <div className="p-2.5 bg-white border border-emerald-200 rounded font-mono text-xs text-slate-800 select-all">
              {signingSecret}
            </div>
            <p className="text-xs text-emerald-700">
              Use this secret on your receiving server to verify the <code>X-ZoikoNex-Signature</code> header.
            </p>
            <Button variant="default" onClick={() => setSigningSecret(null)}>
              I Have Saved This Secret
            </Button>
          </div>
        )}

        {q.isError ? (
          <ErrorBanner error={q.error} />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Callback URL</Th>
                <Th>Subscribed Events</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <LoadingRows cols={5} />
              ) : subscriptions.length === 0 ? (
                <tr>
                  <Td style={{ padding: 0 }}>
                    <EmptyState
                      title="No Outbound Webhooks Configured"
                      hint="Register your website or server URL to receive webhook notifications for business events."
                      action={
                        <Button variant="primary" onClick={() => setAddOpen(true)}>
                          + Register Webhook Endpoint
                        </Button>
                      }
                    />
                  </Td>
                  <Td /><Td /><Td /><Td />
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <Tr key={s.subscription_id}>
                    <Td><span className="font-mono text-xs text-slate-800">{s.callback_url}</span></Td>
                    <Td>
                      <span className="text-xs text-slate-600">
                        {s.event_types?.length ? s.event_types.join(", ") : "All Events"}
                      </span>
                    </Td>
                    <Td><StatusBadge status={s.status} /></Td>
                    <Td>{new Date(s.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Button variant="danger" onClick={() => remove.mutate(s.subscription_id)}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {addOpen && (
        <RegisterWebhookModal
          onClose={() => setAddOpen(false)}
          onCreated={(secret) => {
            setAddOpen(false);
            setSigningSecret(secret);
            qc.invalidateQueries({ queryKey: ["integration", "webhooks"] });
          }}
        />
      )}
    </>
  );
}

/* ───────── Register Webhook Endpoint Modal ───────── */

function RegisterWebhookModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (signingSecret: string) => void;
}) {
  const [callbackUrl, setCallbackUrl] = useState("");
  const [eventTypes, setEventTypes] = useState("");
  const [description, setDescription] = useState("");

  const register = useMutation({
    mutationFn: () =>
      api.post<{ subscription_id: string; signing_secret: string }>("integration", "/v1/hub", {
        callback_url: callbackUrl,
        event_types: eventTypes.trim() ? eventTypes.split(",").map((s) => s.trim()) : undefined,
        description: description.trim() || undefined,
      }),
    onSuccess: (data) => {
      toast.success("Webhook endpoint registered");
      onCreated(data.signing_secret);
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register webhook"),
  });

  return (
    <Modal
      open
      onClose={onClose}
      title="Register Outbound Webhook"
      width={560}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!callbackUrl} loading={register.isPending} onClick={() => register.mutate()}>
            Register Webhook
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 text-xs">
        <Field label="Callback Endpoint URL" hint="HTTPS URL on your server where ZoikoNex posts event payloads">
          <Input
            value={callbackUrl}
            placeholder="https://my-tenant-website.com/webhooks/zoikonex"
            onChange={(e) => setCallbackUrl(e.target.value)}
          />
        </Field>

        <Field label="Subscribed Event Types" hint="Comma separated list (e.g. payment.captured, invoice.created). Leave empty for all events.">
          <Input
            value={eventTypes}
            placeholder="payment.captured, invoice.created"
            onChange={(e) => setEventTypes(e.target.value)}
          />
        </Field>

        <Field label="Description / Notes">
          <Input
            value={description}
            placeholder="Main production payment webhooks receiver"
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  );
}
