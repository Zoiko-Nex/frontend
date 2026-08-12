"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";

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

/* ───────── UI Helpers (Tailwind Native, High Contrast) ───────── */

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="text-slate-400">—</span>;
  const s = status.toUpperCase();
  let colorClass = "bg-slate-100 text-slate-600 border-slate-200";

  if (["ACTIVE", "ACTIVATED", "APPROVED", "CERTIFIED", "LIVE", "COMPLETED"].includes(s)) {
    colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (["DRAFT", "PENDING", "UNDER_REVIEW", "QUALIFIED", "SANDBOX_PASSED"].includes(s)) {
    colorClass = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (["SUSPENDED", "FAILED", "REJECTED", "CANCELLED", "ERROR"].includes(s)) {
    colorClass = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono uppercase tracking-wider ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ───────── Main Integration Component ───────── */

export default function IntegrationTab() {
  const [tab, setTab] = useState<"providers" | "webhooks">("providers");

  return (
    <div className="w-full flex flex-col gap-6 font-['Plus_Jakarta_Sans'] text-slate-800">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Integration Ecosystem</h1>
        <p className="text-sm text-slate-600 font-normal">
          Connect third-party services (Stripe, tax engines, KYC vendors) and configure outbound webhooks to your website or platform.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Provider Connections</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              A connection is callable once it has a base URL, credentials stored in Vault, certified operations, and an approved activation.
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Connect a Provider
          </button>
        </div>

        {/* Query Error Notice */}
        {q.isError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Integration Ecosystem Service Status
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {q.error instanceof ApiException ? q.error.message : "Service endpoint unreachable. Connectors can still be added via UI test mode."}
              </p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="px-3 py-1.5 bg-amber-900 text-white font-bold text-xs rounded-lg hover:bg-amber-950 transition cursor-pointer shrink-0"
            >
              Test Setup (+ Add Provider)
            </button>
          </div>
        )}

        {/* Connectors Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Provider</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Type</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tenancy Mode</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Auth</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {q.isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading connectors list...</td>
                </tr>
              ) : connectors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">No Provider Connections Yet</div>
                      <p className="text-xs text-slate-500 text-center leading-relaxed">
                        Connect Stripe, a tax engine, or a KYC vendor. Credentials stay in Vault; ZoikoNex securely proxies calls for your application.
                      </p>
                      <button
                        onClick={() => setAddOpen(true)}
                        className="mt-2 px-4 py-2 bg-[#1d64b8] text-white text-xs font-bold rounded-lg hover:bg-[#154e93] transition cursor-pointer"
                      >
                        + Connect a Provider
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                connectors.map((c) => (
                  <tr key={c.connector_id} onClick={() => setSelected(c)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{c.connector_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.provider_name}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{c.connector_type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3.5">
                      {c.tenancy_mode ? (
                        <span className="text-slate-700 font-medium">{c.tenancy_mode.replace(/_/g, " ")}</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Not declared</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{c.auth_type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all border border-slate-200 cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Connect a Provider</h3>
            <p className="text-xs text-slate-500 mt-0.5">Register third-party API details and commercial topology.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs text-slate-800">
          <p className="text-slate-600 leading-relaxed">
            This registers the connection in <strong>DRAFT</strong> state. Next, submit credentials (stored directly in Vault), register permitted operations, and request activation.
          </p>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Display Name</label>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={form.connector_name}
              placeholder="Stripe — Card Acquiring"
              onChange={(e) => setForm({ ...form, connector_name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-0.5 block">Provider Identifier</label>
            <span className="text-[11px] text-slate-400 mb-1 block">Unique provider slug (e.g. stripe, suretax, onfido)</span>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={form.provider_name}
              placeholder="stripe"
              onChange={(e) => setForm({ ...form, provider_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Connector Capability</label>
              <select
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
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
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Authentication Scheme</label>
              <select
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                value={form.auth_type}
                onChange={(e) => setForm({ ...form, auth_type: e.target.value })}
              >
                {AUTH_TYPES.map((a) => (
                  <option key={a.value} value={a.value} disabled={!a.supported}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-0.5 block">Base Endpoint URL</label>
            <span className="text-[11px] text-slate-400 mb-1 block">Base URL for outbound API calls (e.g. https://api.stripe.com)</span>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={form.base_url}
              placeholder="https://api.stripe.com"
              onChange={(e) => setForm({ ...form, base_url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Timeout (ms)</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                value={form.timeout_ms}
                onChange={(e) => setForm({ ...form, timeout_ms: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Rate Limit / min</label>
              <input
                type="number"
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                value={form.rate_limit_per_minute}
                onChange={(e) => setForm({ ...form, rate_limit_per_minute: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Commercial & Regulatory Topology section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              Commercial & Regulatory Topology
            </div>
            <p className="text-[11px] text-slate-500">
              Defines contractual boundaries, money flow, and data roles before production activation.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Account Ownership / Tenancy Mode</label>
              <select
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                value={form.tenancy_mode}
                onChange={(e) => setForm({ ...form, tenancy_mode: e.target.value })}
              >
                {TENANCY_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            {isPaymentLike && form.tenancy_mode === "ZOIKO_MANAGED" && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-300 rounded-lg p-2.5">
                ⚠️ Zoiko-managed card acquiring means tenant payments flow through a central Zoiko account. This requires payment facilitator licensing approval before production activation.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Contracting Entity</label>
                <input
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                  value={form.contracting_entity}
                  placeholder="Acme Telecom Inc"
                  onChange={(e) => setForm({ ...form, contracting_entity: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Credential Scope</label>
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                  value={form.credential_scope}
                  onChange={(e) => setForm({ ...form, credential_scope: e.target.value })}
                >
                  <option value="TENANT">Tenant</option>
                  <option value="PLATFORM">Platform</option>
                  <option value="PROVIDER_SUBACCOUNT">Provider Subaccount</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Funds Flow Mode</label>
                <input
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                  value={form.funds_flow_mode}
                  placeholder="direct-to-tenant"
                  onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Merchant of Record</label>
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
                  value={form.merchant_or_payee_role}
                  onChange={(e) => setForm({ ...form, merchant_or_payee_role: e.target.value })}
                >
                  <option value="TENANT">Tenant</option>
                  <option value="ZOIKO">Zoiko</option>
                  <option value="PROVIDER">Provider</option>
                  <option value="N-A">N/A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!valid}
            onClick={() => create.mutate()}
            className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            {create.isPending ? "Registering..." : "Register Connection"}
          </button>
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{connector.connector_name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Connector ID: <span className="font-mono text-slate-700">{connector.connector_id}</span></p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-slate-800">
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-3 gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Provider</div>
              <div className="font-bold text-slate-900 text-xs mt-0.5">{connector.provider_name}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
              <div className="mt-0.5"><StatusBadge status={connector.status} /></div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base URL</div>
              <div className="font-mono text-xs text-slate-700 mt-0.5 truncate">{connector.base_url || "—"}</div>
            </div>
          </div>

          {/* Sub-steps Navigation */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setStep("credential")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                step === "credential" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              1. Vault Credentials
            </button>
            <button
              onClick={() => setStep("operations")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                step === "operations" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              2. Permitted Operations
            </button>
            <button
              onClick={() => setStep("activation")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                step === "activation" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              3. Activation & Approvals
            </button>
          </div>

          {step === "credential" && <CredentialSection connector={connector} />}
          {step === "operations" && <OperationsSection connector={connector} />}
          {step === "activation" && <ActivationSection connector={connector} onChanged={onChanged} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
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
      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 leading-relaxed">
        🔒 <strong>Vault PCI Guard:</strong> Credentials (e.g. Stripe <code>sk_live_...</code>) are submitted directly to HashiCorp Vault. They are never stored in SQL databases and cannot be retrieved after saving.
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">Target Environment</label>
        <select
          className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
        >
          <option value="PRODUCTION">Production</option>
          <option value="SANDBOX">Sandbox</option>
        </select>
      </div>

      {fields.map((f) => (
        <div key={f}>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">
            {f.replace(/_/g, " ").toUpperCase()}
          </label>
          {f === "value" && (
            <span className="text-[11px] text-slate-400 mb-1 block">Enter your secret API key (e.g. Stripe sk_live_...)</span>
          )}
          <input
            type={f.includes("secret") || f === "value" || f === "client_key" ? "password" : "text"}
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
            autoComplete="off"
            value={material[f] || ""}
            onChange={(e) => setMaterial({ ...material, [f]: e.target.value })}
          />
        </div>
      ))}

      <button
        disabled={!valid}
        onClick={() => submit.mutate()}
        className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer self-start"
      >
        {submit.isPending ? "Storing..." : "Store Credential in Vault"}
      </button>

      <div className="mt-3 flex flex-col gap-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Installed Vault Credentials</div>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Environment</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Fingerprint / Hint</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Status</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Last Used</th>
                <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {q.isLoading ? (
                <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">Loading credentials...</td></tr>
              ) : credentials.length === 0 ? (
                <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">No credential installed in Vault yet.</td></tr>
              ) : (
                credentials.map((c) => (
                  <tr key={c.credential_id}>
                    <td className="px-3.5 py-2.5 font-medium text-slate-800">{c.environment}</td>
                    <td className="px-3.5 py-2.5 font-mono text-xs text-slate-700">{c.hint || c.fingerprint}</td>
                    <td className="px-3.5 py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="px-3.5 py-2.5 text-slate-500">{c.last_used_at ? new Date(c.last_used_at).toLocaleString() : "Never"}</td>
                    <td className="px-3.5 py-2.5 text-right">
                      {c.status === "ACTIVE" && (
                        <button
                          onClick={() => revoke.mutate(c.credential_id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] rounded-md border border-rose-200 transition cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
      <p className="text-slate-600 leading-relaxed">
        Operations form a strict allow-list. Apps execute provider actions by operation name (e.g. <code>charge_card</code>) rather than direct URLs.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">Operation Name</label>
          <input
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
            value={form.operation_name}
            placeholder="charge_card"
            onChange={(e) => setForm({ ...form, operation_name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1 block">HTTP Method</label>
          <select
            className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
            value={form.http_method}
            onChange={(e) => setForm({ ...form, http_method: e.target.value })}
          >
            {["POST", "GET", "PUT", "PATCH", "DELETE"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 mb-1 block">Path Template</label>
        <input
          className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
          value={form.path_template}
          placeholder="/v1/payment_intents"
          onChange={(e) => setForm({ ...form, path_template: e.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
        <input
          type="checkbox"
          checked={form.is_retryable}
          onChange={(e) => setForm({ ...form, is_retryable: e.target.checked })}
        />
        <span>Safe to retry automatically on network failure (Idempotent)</span>
      </label>

      <button
        disabled={!form.operation_name || !form.path_template}
        onClick={() => register.mutate()}
        className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer self-start"
      >
        {register.isPending ? "Registering..." : "Register Permitted Operation"}
      </button>

      <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Operation</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Endpoint</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Retryable</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Certification</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {q.isLoading ? (
              <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">Loading operations...</td></tr>
            ) : ops.length === 0 ? (
              <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">No operations registered on allow-list yet.</td></tr>
            ) : (
              ops.map((op) => (
                <tr key={op.operation_id}>
                  <td className="px-3.5 py-2.5 font-bold text-slate-800">{op.operation_name}</td>
                  <td className="px-3.5 py-2.5 font-mono text-xs text-slate-700">{op.http_method} {op.path_template}</td>
                  <td className="px-3.5 py-2.5 text-slate-600">{op.is_retryable ? "Yes" : "No"}</td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={op.certification_status} /></td>
                  <td className="px-3.5 py-2.5 text-right">
                    {op.certification_status === "UNCERTIFIED" && (
                      <button
                        onClick={() => certify.mutate({ id: op.operation_id, status: "SANDBOX_PASSED" })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-md border border-slate-200 transition cursor-pointer"
                      >
                        Mark Sandbox Passed
                      </button>
                    )}
                    {op.certification_status === "SANDBOX_PASSED" && (
                      <button
                        onClick={() => certify.mutate({ id: op.operation_id, status: "CERTIFIED" })}
                        className="px-2.5 py-1 bg-[#1d64b8] hover:bg-[#154e93] text-white font-bold text-[11px] rounded-md transition cursor-pointer"
                      >
                        Certify Production
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 leading-relaxed">
        🛡️ <strong>Maker-Checker Guard:</strong> The user who configures a connector (Maker) cannot approve or perform final activation (Checker).
      </div>

      {!open && (
        <div className="flex gap-3 items-end">
          <div className="w-48">
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Target Environment</label>
            <select
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
            >
              <option value="PRODUCTION">Production</option>
              <option value="SANDBOX">Sandbox</option>
            </select>
          </div>
          <button
            onClick={() => request.mutate()}
            className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            {request.isPending ? "Submitting..." : "Submit Activation Request"}
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Environment</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Maker Identity</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">Qualification</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px]">State</th>
              <th className="px-3.5 py-2.5 font-bold text-slate-500 uppercase text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {q.isLoading ? (
              <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">Loading activation requests...</td></tr>
            ) : activations.length === 0 ? (
              <tr><td colSpan={5} className="px-3.5 py-4 text-center text-slate-400">No activation request created yet.</td></tr>
            ) : (
              activations.map((a) => (
                <tr key={a.activation_id}>
                  <td className="px-3.5 py-2.5 font-bold text-slate-800">{a.environment}</td>
                  <td className="px-3.5 py-2.5 font-mono text-xs text-slate-700">{a.maker_identity}</td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={a.qualification_status} /></td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={a.state} /></td>
                  <td className="px-3.5 py-2.5 text-right">
                    {a.state !== "ACTIVATED" && (
                      <div className="flex gap-1.5 justify-end">
                        {required.map((role) => (
                          <button
                            key={role}
                            onClick={() => approve.mutate({ id: a.activation_id, role })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-md border border-slate-200 transition cursor-pointer"
                          >
                            Approve ({role})
                          </button>
                        ))}
                        <button
                          onClick={() => activate.mutate(a.activation_id)}
                          className="px-2.5 py-1 bg-[#1d64b8] hover:bg-[#154e93] text-white font-bold text-[11px] rounded-md transition cursor-pointer"
                        >
                          Activate Connector
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Outbound Webhook Hub</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure callback endpoints for real-time events (payment captures, invoice creations, account updates) sent from ZoikoNex.
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Register Webhook Endpoint
          </button>
        </div>

        {/* Signing Secret Flash Card */}
        {signingSecret && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex flex-col gap-2">
            <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              🔑 Webhook Signing Secret (Copy Now! Shown only once):
            </div>
            <div className="p-3 bg-white border border-emerald-200 rounded-lg font-mono text-xs text-slate-900 select-all font-bold">
              {signingSecret}
            </div>
            <p className="text-[11px] text-emerald-800">
              Use this secret on your receiving server to verify the <code>X-ZoikoNex-Signature</code> header.
            </p>
            <button
              onClick={() => setSigningSecret(null)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition cursor-pointer self-start mt-1"
            >
              I Have Saved This Secret
            </button>
          </div>
        )}

        {/* Webhooks Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Callback Endpoint URL</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Subscribed Events</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Created At</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {q.isLoading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Loading webhooks list...</td></tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">No Webhook Endpoints Configured</div>
                      <p className="text-xs text-slate-500 text-center leading-relaxed">
                        Register your website or server URL to receive real-time webhook notifications for payments, invoices, and customer events.
                      </p>
                      <button
                        onClick={() => setAddOpen(true)}
                        className="mt-2 px-4 py-2 bg-[#1d64b8] text-white text-xs font-bold rounded-lg hover:bg-[#154e93] transition cursor-pointer"
                      >
                        + Register Webhook Endpoint
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <tr key={s.subscription_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-900 font-medium">{s.callback_url}</td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {s.event_types?.length ? s.event_types.join(", ") : "All Events"}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5 text-slate-500">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => remove.mutate(s.subscription_id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Register Outbound Webhook</h3>
            <p className="text-xs text-slate-500 mt-0.5">Push events to your external server in real-time.</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4 text-xs text-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-0.5 block">Callback Endpoint URL</label>
            <span className="text-[11px] text-slate-400 mb-1 block">HTTPS URL on your receiving server (e.g. https://tenant-website.com/webhooks)</span>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={callbackUrl}
              placeholder="https://tenant-website.com/webhooks/zoikonex"
              onChange={(e) => setCallbackUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-0.5 block">Subscribed Event Types</label>
            <span className="text-[11px] text-slate-400 mb-1 block">Comma separated list (e.g. payment.captured, invoice.created). Leave empty for all events.</span>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={eventTypes}
              placeholder="payment.captured, invoice.created"
              onChange={(e) => setEventTypes(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Description / Notes</label>
            <input
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8]"
              value={description}
              placeholder="Main production payment webhooks receiver"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!callbackUrl}
            onClick={() => register.mutate()}
            className="px-4 py-2 bg-[#1d64b8] hover:bg-[#154e93] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition cursor-pointer"
          >
            {register.isPending ? "Registering..." : "Register Webhook"}
          </button>
        </div>
      </div>
    </div>
  );
}
