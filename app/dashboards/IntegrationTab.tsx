"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { getSession } from "@/lib/admin/session";
import { errMessage } from "@/lib/admin/envelope";

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

export interface Brand {
  id: string;
  name: string;
  code_name: string;
  created_at: string;
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
  const [tab, setTab] = useState<"providers" | "webhooks" | "mft" | "quarantine" | "reconciliation" | "connections" | "telecom" | "b2b" | "mtls" | "idds" | "invocations" | "governance">("providers");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Integration Ecosystem</h1>
        <p className="text-sm text-slate-600 font-normal">
          Connect third-party services (Stripe, tax engines, KYC vendors), manage telecom gateways (SMPP, eSIM RSP, roaming), configure AS2/B2B, enforce mTLS profiles, and track 3-way financial reconciliation — all in compliance with ZN-INT-EXT-001 v2.1.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
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
        <button
          onClick={() => setTab("mft")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "mft"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Managed File Transfer (MFT)
        </button>
        <button
          onClick={() => setTab("quarantine")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "quarantine"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Quarantine Records
        </button>
        <button
          onClick={() => setTab("reconciliation")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "reconciliation"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          3-Way Reconciliation
        </button>
        <button
          onClick={() => setTab("connections")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "connections"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setTab("telecom")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "telecom"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Telecom Gateways
        </button>
        <button
          onClick={() => setTab("b2b")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "b2b"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          B2B / AS2
        </button>
        <button
          onClick={() => setTab("mtls")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "mtls"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          mTLS Security
        </button>
        <button
          onClick={() => setTab("idds")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "idds"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          IDD Registry
        </button>
        <button
          onClick={() => setTab("invocations")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "invocations"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Invocations
        </button>
        <button
          onClick={() => setTab("governance")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === "governance"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Governance
        </button>
      </div>

      {tab === "providers" && <ProvidersTab />}
      {tab === "webhooks" && <WebhooksTab />}
      {tab === "mft" && <MFTTab />}
      {tab === "quarantine" && <QuarantineTab />}
      {tab === "reconciliation" && <ReconciliationTab />}
      {tab === "connections" && <ConnectionsTab />}
      {tab === "telecom" && <TelecomTab />}
      {tab === "b2b" && <B2BTab />}
      {tab === "mtls" && <MTLSTab />}
      {tab === "idds" && <IDDRegistryTab />}
      {tab === "invocations" && <InvocationsTab />}
      {tab === "governance" && <GovernanceTab />}
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
    brand_id: getSession()?.brandId || "",
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

  const brandsQ = useQuery({
    queryKey: ["dash", "brands"],
    queryFn: () => api.get<{ brands?: Brand[] }>("identity", "/v1/brands"),
  });
  const brands = brandsQ.data?.brands ?? [];

  const create = useMutation({
    mutationFn: () =>
      api.post<{ connector_id: string }>("integration", "/v1/connectors", {
        ...form,
        brand_id: form.brand_id || "00000000-0000-0000-0000-000000000000",
        vault_credential_path: `zoikonex/pending/${form.provider_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      }),
    onSuccess: () => {
      toast.success("Connector registered in DRAFT state");
      onDone();
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to register connector"),
  });

  const valid = form.connector_name && form.provider_name && form.base_url && form.tenancy_mode && form.brand_id;

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
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Brand</label>
            <select
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8] cursor-pointer"
              value={form.brand_id}
              onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
            >
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code_name})
                </option>
              ))}
            </select>
          </div>

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
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8] cursor-pointer"
                  value={form.funds_flow_mode}
                  onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  <option value="direct-to-tenant">Direct to Tenant</option>
                  <option value="direct-to-customer">Direct to Customer</option>
                  <option value="escrow">Escrow / Deferred Settlement</option>
                  <option value="zoiko-facilitated">Zoiko Facilitated</option>
                  <option value="n-a">Not Applicable (N/A)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Merchant of Record</label>
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8] cursor-pointer"
                  value={form.merchant_or_payee_role}
                  onChange={(e) => setForm({ ...form, merchant_or_payee_role: e.target.value })}
                >
                  <option value="TENANT">Tenant</option>
                  <option value="ZOIKO">Zoiko</option>
                  <option value="PROVIDER">Provider</option>
                  <option value="N-A">N/A</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Regulated Role</label>
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8] cursor-pointer"
                  value={form.regulated_role}
                  onChange={(e) => setForm({ ...form, regulated_role: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  <option value="n-a">Not Applicable (N/A)</option>
                  <option value="licensed-intermediary">Licensed Intermediary / Agent</option>
                  <option value="payment-facilitator">Payment Facilitator</option>
                  <option value="e-money-issuer">E-Money Issuer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Revenue Presentation</label>
                <select
                  className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d64b8]/20 focus:border-[#1d64b8] cursor-pointer"
                  value={form.revenue_presentation}
                  onChange={(e) => setForm({ ...form, revenue_presentation: e.target.value })}
                >
                  <option value="N-A">Not Applicable (N/A)</option>
                  <option value="GROSS">Gross Revenue</option>
                  <option value="NET">Net Revenue</option>
                  <option value="UNDER_REVIEW">Under Review</option>
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

  /**
   * Qualification is the pre-flight the activation workflow expects before
   * approvals are collected. It was registered and unreachable, which meant the
   * gate could only ever be skipped.
   */
  const qualify = useMutation({
    mutationFn: (id: string) => api.post("integration", `/v1/activations/${id}/qualification`, {}),
    onSuccess: () => {
      toast.success("Qualification recorded");
      qc.invalidateQueries({ queryKey: ["integration", "activations"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Qualification failed"),
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
                        {/* Qualification is the pre-flight the workflow expects
                            before approvals. Offered only while it is still
                            outstanding, so it reads as a gate rather than a
                            button that can be pressed forever. */}
                        {String(a.qualification_status ?? "").toUpperCase() !== "QUALIFIED" && (
                          <button
                            onClick={() => qualify.mutate(a.activation_id)}
                            disabled={qualify.isPending}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[11px] rounded-md border border-amber-200 transition cursor-pointer disabled:opacity-50"
                          >
                            {qualify.isPending ? "Qualifying…" : "Run qualification"}
                          </button>
                        )}
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

  /**
   * Rotating a signing secret invalidates the old one immediately, and the new
   * value is returned exactly once. It goes into the same one-time reveal the
   * create flow already uses rather than a toast that scrolls away.
   */
  const rotate = useMutation({
    mutationFn: (id: string) => api.post<{ signing_secret?: string }>("integration", `/v1/hub/${id}/rotate-secret`, {}),
    onSuccess: (res) => {
      if (res?.signing_secret) setSigningSecret(res.signing_secret);
      toast.success("Signing secret rotated — the previous one no longer validates");
      qc.invalidateQueries({ queryKey: ["integration", "webhooks"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Secret rotation failed"),
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
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => rotate.mutate(s.subscription_id)}
                          disabled={rotate.isPending}
                          title="Invalidates the current signing secret immediately"
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-xs rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                          {rotate.isPending ? "Rotating…" : "Rotate secret"}
                        </button>
                        <button
                          onClick={() => remove.mutate(s.subscription_id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-lg transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
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

/* ───────── MFT (Managed File Transfer) Sub-Tab ───────── */

function MFTTab() {
  const qProfiles = useQuery({
    queryKey: ["integration", "mft", "profiles"],
    queryFn: () => api.get<{ profiles?: any[] }>("integration", "/v1/mft/profiles"),
  });
  const qTransfers = useQuery({
    queryKey: ["integration", "mft", "transfers"],
    queryFn: () => api.get<{ transfers?: any[] }>("integration", "/v1/mft/transfers"),
  });

  const profiles = qProfiles.data?.profiles ?? [];
  const transfers = qTransfers.data?.transfers ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Managed File Transfer (MFT) Profiles (§19)</h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated batch file profiles with OpenPGP encryption & SHA-256 integrity verification.</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Dataset</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Pattern</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Format</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Encryption</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Max Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {profiles.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No MFT profiles registered.</td></tr>
              ) : (
                profiles.map((p: any) => (
                  <tr key={p.profile_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.dataset_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{p.file_pattern}</td>
                    <td className="px-4 py-3 text-slate-700">{p.format}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">{p.is_encrypted ? `Protected (${p.encryption_algorithm})` : 'Plain'}</td>
                    <td className="px-4 py-3 text-slate-500">{(p.max_size_bytes / 1024 / 1024).toFixed(0)} MB</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">File Transfer Audit Execution Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">8-Stage atomic lifecycle tracking (DETECTED → INTEGRITY_VERIFIED → ACKNOWLEDGED).</p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">File Name</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">SHA-256 Checksum</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Records</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transfers.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No transfer executions recorded yet.</td></tr>
              ) : (
                transfers.map((t: any) => (
                  <tr key={t.transfer_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{t.file_name}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 shrink">{t.sha256_checksum.substring(0, 16)}...</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{t.status}</td>
                    <td className="px-4 py-3 text-slate-700">{t.processed_count} / {t.record_count}</td>
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

/* ───────── Quarantine Records Sub-Tab ───────── */

function QuarantineTab() {
  const qQuarantine = useQuery({
    queryKey: ["integration", "quarantine"],
    queryFn: () => api.get<{ records?: any[] }>("integration", "/v1/quarantine"),
  });
  const records = qQuarantine.data?.records ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Quarantine Payload Inspection (§27.2)</h2>
        <p className="text-xs text-slate-500 mt-0.5">Isolated records failed due to security signatures, ambiguous tenancy, or payload integrity issues.</p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Quarantine ID</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Source</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Reason Code</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Description</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No quarantine records. System healthy.</td></tr>
            ) : (
              records.map((r: any) => (
                <tr key={r.quarantine_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-rose-700">{r.quarantine_id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{r.source_type}</td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{r.reason_code}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3 font-bold text-amber-600">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── 3-Way Reconciliation Sub-Tab ───────── */

function ReconciliationTab() {
  const qProfiles = useQuery({
    queryKey: ["integration", "reconciliation", "profiles"],
    queryFn: () => api.get<{ profiles?: any[] }>("integration", "/v1/reconciliation/profiles"),
  });
  const qRuns = useQuery({
    queryKey: ["integration", "reconciliation", "runs"],
    queryFn: () => api.get<{ runs?: any[] }>("integration", "/v1/reconciliation/runs"),
  });

  const profiles = qProfiles.data?.profiles ?? [];
  const runs = qRuns.data?.runs ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">3-Way Reconciliation Profiles (§28)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated 3-way matching: ZoikoNex Domain State vs Provider Statement vs Authoritative Ledger.</p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Domain</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Partner</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Type</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Tolerance</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {profiles.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No reconciliation profiles configured.</td></tr>
              ) : (
                profiles.map((p: any) => (
                  <tr key={p.profile_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.domain_name}</td>
                    <td className="px-4 py-3 text-slate-700">{p.partner_name}</td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{p.reconciliation_type}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono">${p.tolerance_amount.toFixed(2)} {p.currency}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{p.is_active ? 'Active' : 'Disabled'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Reconciliation Run Audit History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Execution logs and discrepancy detection summaries.</p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Run ID</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Matched Records</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Discrepancies</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Total Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {runs.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No reconciliation runs recorded.</td></tr>
              ) : (
                runs.map((r: any) => (
                  <tr key={r.run_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">{r.run_id}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{r.status}</td>
                    <td className="px-4 py-3 text-slate-700">{r.matched_records} / {r.total_records}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{r.discrepancy_records}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">${r.total_variance.toFixed(2)} {r.currency}</td>
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

/* ───────── §36 Connections Registry Tab ───────── */

function ConnectionsTab() {
  const q = useQuery({
    queryKey: ["integration", "connections"],
    queryFn: () => api.get<{ connections?: any[]; count?: number }>("integration", "/v1/connections"),
  });
  const connections = q.data?.connections ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Connection Registry</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          §36 — Each connection is independently disableable (INT-ARC-003). Emergency kill switch ≤15 min (NFR-INT-05).
        </p>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Name</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Environment</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Mode</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Region</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Endpoint</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {q.isLoading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
            ) : connections.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">No connections registered.</td></tr>
            ) : connections.map((c: any) => (
              <tr key={c.connection_id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900">{c.connection_name}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.connection_id}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={c.environment} /></td>
                <td className="px-4 py-3 text-slate-600 text-[11px] font-medium">{c.connection_mode?.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{c.region}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 font-mono text-slate-600 text-[11px] truncate max-w-[180px]">{c.endpoint_url}</td>
                <td className="px-4 py-3 text-right">
                  <KillSwitchButton connectionId={c.connection_id} name={c.connection_name} status={c.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── §22 Telecom Gateways Tab ───────── */

function TelecomTab() {
  const gatewaysQ = useQuery({
    queryKey: ["integration", "telecom", "gateways"],
    queryFn: () => api.get<{ gateways?: any[] }>("integration", "/v1/telecom/gateways"),
  });
  const roamingQ = useQuery({
    queryKey: ["integration", "telecom", "roaming"],
    queryFn: () => api.get<{ batches?: any[] }>("integration", "/v1/telecom/roaming/batches"),
  });
  const esimQ = useQuery({
    queryKey: ["integration", "telecom", "esim"],
    queryFn: () => api.get<{ esim_profiles?: any[] }>("integration", "/v1/telecom/esim/profiles"),
  });
  const portQ = useQuery({
    queryKey: ["integration", "telecom", "portability"],
    queryFn: () => api.get<{ portability_requests?: any[] }>("integration", "/v1/telecom/portability/requests"),
  });
  const gateways = gatewaysQ.data?.gateways ?? [];
  const batches = roamingQ.data?.batches ?? [];
  const esimProfiles = esimQ.data?.esim_profiles ?? [];
  const portRequests = portQ.data?.portability_requests ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Telecom Gateways</h2>
          <p className="text-xs text-slate-500 mt-0.5">§22 — SMPP, SIP/SBC, eSIM RSP (SGP.22/SGP.32), TAP3/NRTRDE, Number Portability.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gatewaysQ.isLoading ? <div className="text-slate-400 text-xs p-4">Loading...</div>
            : gateways.map((gw: any) => (
            <div key={gw.gateway_id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{gw.gateway_name}</span>
                <StatusBadge status={gw.status} />
              </div>
              <div className="text-[11px] text-slate-500">{gw.provider_name} · {gw.gateway_type}</div>
              <div className="font-mono text-[11px] text-slate-600">{gw.host}:{gw.port}</div>
              {gw.rsp_spec_version && <div className="text-[10px] text-indigo-700 font-bold bg-indigo-50 rounded px-2 py-0.5 inline-block w-fit">{gw.rsp_spec_version}</div>}
              {gw.smpp_throughput_tps && <div className="text-[11px] text-slate-500">{gw.smpp_throughput_tps} TPS · window {gw.smpp_window_size}</div>}
              {gw.nrtrde_enabled && <div className="text-[11px] text-emerald-700 font-semibold">NRTRDE enabled</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-900">TAP3 / NRTRDE Roaming Batches <span className="text-xs font-normal text-slate-500 ml-1">INT-TEL-005/006</span></h2>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">File</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Type</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Seq #</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Records</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">State</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Timeliness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {batches.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No batches.</td></tr>
                : batches.map((b: any) => (
                <tr key={b.batch_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-900">{b.file_name}</td>
                  <td className="px-4 py-3"><span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded">{b.file_type}</span></td>
                  <td className="px-4 py-3 font-mono text-slate-700">{b.sequence_number}</td>
                  <td className="px-4 py-3 text-slate-700">{b.actual_records} / {b.expected_records}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.state} /></td>
                  <td className="px-4 py-3">{b.timeliness_breach ? <span className="text-rose-600 font-bold text-[11px]">BREACH</span> : <span className="text-emerald-600 font-semibold text-[11px]">On Time</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-900">eSIM Profiles <span className="text-xs font-normal text-slate-500 ml-1">INT-TEL-009 — vault refs only</span></h2>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">ICCID</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Type</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">RSP Spec</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">State</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Activation Code (Vault Ref)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {esimProfiles.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No eSIM profiles.</td></tr>
                : esimProfiles.map((p: any) => (
                <tr key={p.profile_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 text-[11px]">{p.iccid}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium text-[11px]">{p.profile_type}</td>
                  <td className="px-4 py-3"><span className="text-indigo-700 font-bold bg-indigo-50 rounded px-2 py-0.5 text-[10px]">{p.rsp_spec_version}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={p.state} /></td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[220px]">{p.activation_code_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-900">Number Portability Requests <span className="text-xs font-normal text-slate-500 ml-1">INT-TEL-011</span></h2>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">MSISDN</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Jurisdiction</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Donor</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Recipient</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {portRequests.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No portability requests.</td></tr>
                : portRequests.map((r: any) => (
                <tr key={r.request_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.msisdn}</td>
                  <td className="px-4 py-3"><span className="bg-slate-100 font-bold text-[11px] px-2 py-0.5 rounded">{r.jurisdiction_code}</span></td>
                  <td className="px-4 py-3 text-slate-600">{r.donor_operator}</td>
                  <td className="px-4 py-3 text-slate-600">{r.recipient_operator}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── §20 B2B / AS2 Tab ───────── */

function B2BTab() {
  const partnersQ = useQuery({
    queryKey: ["integration", "b2b", "partners"],
    queryFn: () => api.get<{ as2_partners?: any[] }>("integration", "/v1/b2b/as2/partners"),
  });
  const exchangesQ = useQuery({
    queryKey: ["integration", "b2b", "exchanges"],
    queryFn: () => api.get<{ exchanges?: any[] }>("integration", "/v1/b2b/as2/exchanges"),
  });
  const certsQ = useQuery({
    queryKey: ["integration", "b2b", "certificates"],
    queryFn: () => api.get<{ certificates?: any[] }>("integration", "/v1/b2b/as2/certificates"),
  });
  const partners = partnersQ.data?.as2_partners ?? [];
  const exchanges = exchangesQ.data?.exchanges ?? [];
  const certs = certsQ.data?.certificates ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">AS2 B2B Partners</h2>
          <p className="text-xs text-slate-500 mt-0.5">INT-B2B-001 — RFC 4130 signed/encrypted exchanges. Signed MDN required for financially significant payloads.</p>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Partner</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Local AS2 ID</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Remote AS2 ID</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">MDN</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Cert Expires</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {partners.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No AS2 partners configured.</td></tr>
                : partners.map((p: any) => (
                <tr key={p.as2_partner_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{p.partner_name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{p.partner_url}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{p.as2_id_local}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{p.as2_id_remote}</td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] font-bold text-slate-700">{p.mdn_mode}</div>
                    <div className="text-[10px] text-slate-400">{p.mdn_signing_required ? 'Signed' : 'Unsigned'}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{p.cert_expires_at ? new Date(p.cert_expires_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">AS2 Exchange Log</h2>
          <p className="text-xs text-slate-500 mt-0.5">INT-B2B-002 — MDN receipt status reconciled to IntegrationExecution evidence.</p>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Message ID</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Direction</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Financial</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">MDN</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Signed</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {exchanges.length === 0 ? <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No exchanges logged.</td></tr>
                : exchanges.map((ex: any) => (
                <tr key={ex.exchange_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-700 truncate max-w-[160px]">{ex.message_id}</td>
                  <td className="px-4 py-3"><span className={`font-bold text-[11px] ${ex.direction === 'OUTBOUND' ? 'text-blue-600' : 'text-purple-600'}`}>{ex.direction}</span></td>
                  <td className="px-4 py-3">{ex.is_financial ? <span className="text-amber-700 font-bold text-[11px]">Yes</span> : <span className="text-slate-400">No</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={ex.mdn_status} /></td>
                  <td className="px-4 py-3">{ex.is_signed ? <span className="text-emerald-600 font-bold">Y</span> : <span className="text-rose-500 font-bold">N</span>}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[140px]">{ex.evidence_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">B2B Certificate Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">INT-B2B-003 / INT-SEC-009 — Alerts begin 30 days before expiry; escalated at 7 days.</p>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Serial</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Subject</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Valid From</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Expires</th>
                <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {certs.length === 0 ? <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No certificates.</td></tr>
                : certs.map((cert: any) => {
                const daysLeft = Math.ceil((new Date(cert.not_after).getTime() - Date.now()) / 86400000);
                const c = daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-emerald-600';
                return (
                  <tr key={cert.cert_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 text-[11px]">{cert.serial_number}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 truncate max-w-[200px]">{cert.subject}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{new Date(cert.not_before).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className={`font-bold text-[11px] ${c}`}>{new Date(cert.not_after).toLocaleDateString()}</div>
                      <div className={`text-[10px] ${c}`}>{daysLeft}d left</div>
                    </td>
                    <td className="px-4 py-3">{cert.is_revoked ? <StatusBadge status="REVOKED" /> : <StatusBadge status="ACTIVE" />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── §23 mTLS Security Profiles Tab ───────── */

function MTLSTab() {
  const q = useQuery({
    queryKey: ["integration", "mtls", "profiles"],
    queryFn: () => api.get<{ mtls_profiles?: any[] }>("integration", "/v1/security/mtls-profiles"),
  });
  const profiles = q.data?.mtls_profiles ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">mTLS Security Profiles</h2>
        <p className="text-xs text-slate-500 mt-0.5">ADR-013 / INT-SEC-005/006 — Mutual TLS for HIGH-risk connections. Zero-downtime rotation. TLS 1.0/1.1 PROHIBITED (BCP 195).</p>
      </div>
      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs">
        TLS 1.3 preferred · TLS 1.2 permitted · <strong className="text-rose-600">TLS 1.0/1.1 PROHIBITED</strong> (INT-SEC-004 / BCP 195). Certs in Vault (INT-SEC-007). Alerts 30d before expiry (INT-SEC-009).
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Connection</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Risk</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">TLS Min</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Cert Serial</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Expires</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Vault Path</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {q.isLoading ? <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
              : profiles.length === 0 ? <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">No mTLS profiles configured.</td></tr>
              : profiles.map((p: any) => {
              const daysLeft = Math.ceil((new Date(p.cert_expires_at).getTime() - Date.now()) / 86400000);
              const ec = daysLeft <= 7 ? 'text-rose-600' : daysLeft <= 30 ? 'text-amber-600' : 'text-emerald-600';
              const rc = p.risk_tier === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' : p.risk_tier === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600';
              return (
                <tr key={p.mtls_profile_id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{p.connection_id}</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${rc}`}>{p.risk_tier}</span></td>
                  <td className="px-4 py-3 font-mono font-bold text-[11px]">{p.tls_min_version}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">{p.cert_serial}</td>
                  <td className="px-4 py-3">
                    <div className={`font-bold text-[11px] ${ec}`}>{new Date(p.cert_expires_at).toLocaleDateString()}</div>
                    <div className={`text-[10px] ${ec}`}>{daysLeft}d left</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] text-slate-500 truncate max-w-[160px]">{p.client_cert_vault_path}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────── §11 IDD Registry Tab ───────── */

function IDDRegistryTab() {
  const q = useQuery({
    queryKey: ["integration", "idds"],
    queryFn: () => api.get<{ idds?: any[] }>("integration", "/v1/idds"),
  });
  const idds = q.data?.idds ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Integration Design Document (IDD) Registry</h2>
        <p className="text-xs text-slate-500 mt-0.5">§11 / INT-SEC-001 — Every production integration requires a registered, versioned, certified IDD. DRAFT IDDs block production activation.</p>
      </div>
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
        <strong>Certification Requirement:</strong> IDD must identify provider, pin contracted API version, declare auth scheme, document data classification, specify monitoring thresholds, and be approved before production activation.
      </div>
      <div className="grid grid-cols-1 gap-4">
        {q.isLoading ? <div className="text-slate-400 text-xs p-4">Loading IDD registry...</div>
          : idds.length === 0 ? <div className="text-slate-400 text-xs p-4">No IDDs registered.</div>
          : idds.map((idd: any) => (
          <div key={idd.idd_id} className={`border rounded-2xl p-5 flex flex-col gap-3 ${idd.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50/30' : idd.status === 'DRAFT' ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-extrabold text-slate-900">{idd.idd_reference} — {idd.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Provider: <strong>{idd.provider_name}</strong> · Type: <strong>{idd.connector_type}</strong> · v{idd.idd_version}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={idd.status} />
                {idd.is_certified && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">CERTIFIED</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Standard", value: idd.standard_ref },
                { label: "Schema Ver.", value: idd.schema_version || "—" },
                { label: "Certified At", value: idd.certified_at ? new Date(idd.certified_at).toLocaleDateString() : "Pending" },
                { label: "Production Gate", value: idd.is_certified ? "Ready" : "BLOCKED — DRAFT" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
                  <div className={`font-bold text-xs mt-0.5 ${label === "Production Gate" && !idd.is_certified ? "text-rose-600" : label === "Production Gate" ? "text-emerald-700" : "text-slate-800"}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Invocations Sub-Tab ─────────
 *
 * The outbound call log: every time this platform invoked a connector, what it
 * asked for and what came back. This is the answer to "did we actually call
 * them, and what did they say" from our side, where the webhook delivery log
 * answers it from theirs.
 *
 * Governance registries (schema versions, mapping versions, SLA and rate-limit
 * profiles) used to return hardcoded arrays from the handler; they now read the
 * tables migrations 000009/000010 created, so they are wired below.
 *
 * What is still NOT wired, and why: AS2 exchanges and certificates, eSIM
 * profiles, roaming batches, portability requests, IDDs and telecom gateway
 * sessions have no table at all yet — their handlers are annotated as such in
 * ext_handlers.go. Wiring them would put fabricated data on screen dressed as
 * live, which is the exact failure this console was cleaned up to remove.
 */
function InvocationsTab() {
  const qc = useQueryClient();
  const [replayFor, setReplayFor] = useState<any | null>(null);
  const [invokeForm, setInvokeForm] = useState({ connector_id: "", operation: "", path_params: "{}" });
  const [invokeOpen, setInvokeOpen] = useState(false);

  const q = useQuery({
    queryKey: ["integration", "invocations"],
    refetchInterval: 30_000,
    queryFn: () => api.get<{ invocations?: any[] }>("integration", "/v1/invocations"),
  });
  const invocations = q.data?.invocations ?? [];

  const connectorsQ = useQuery({
    queryKey: ["integration", "connectors"],
    queryFn: () => api.get<{ connectors?: Connector[] }>("integration", "/v1/connectors"),
  });

  /**
   * A manual invoke is a real outbound call to a real partner, so it is behind
   * an explicit form rather than a one-click button on a row.
   */
  const invoke = useMutation({
    mutationFn: () => {
      let pathParams: unknown = {};
      try {
        pathParams = JSON.parse(invokeForm.path_params);
      } catch (err) {
        throw new Error(`path_params is not valid JSON: ${(err as Error).message}`);
      }
      return api.post("integration", `/v1/connectors/${invokeForm.connector_id}/invoke`, {
        operation: invokeForm.operation,
        path_params: pathParams,
      });
    },
    onSuccess: () => {
      toast.success("Invocation sent");
      setInvokeOpen(false);
      qc.invalidateQueries({ queryKey: ["integration", "invocations"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Invocation failed"),
  });

  const succeeded = invocations.filter((i: any) => {
    const s = String(i.status ?? i.outcome ?? "").toUpperCase();
    return s === "SUCCESS" || s === "SUCCEEDED" || s === "OK";
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Outbound Invocations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calls this platform made to a partner. The webhook delivery log covers the opposite direction.
          </p>
        </div>
        <button
          onClick={() => setInvokeOpen(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
        >
          Invoke a connector
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invocations</div>
          <div className="text-lg font-bold text-slate-800 font-mono">{q.isLoading ? "…" : invocations.length}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Succeeded</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">{q.isLoading ? "…" : succeeded}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Failed</div>
          <div className="text-lg font-bold text-rose-600 font-mono">
            {q.isLoading ? "…" : invocations.length - succeeded}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Invocation</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Connector</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Operation</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Status</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">Latency</th>
              <th className="px-4 py-3 font-bold text-slate-500 uppercase text-[10px]">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {q.isLoading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
            ) : q.isError ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-rose-600">{errMessage(q.error, "Could not load invocations.")}</td></tr>
            ) : invocations.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No outbound invocations recorded.</td></tr>
            ) : (
              invocations.map((iv: any, i: number) => {
                const id = iv.invocation_id ?? iv.id ?? String(i);
                const status = String(iv.status ?? iv.outcome ?? "—").toUpperCase();
                const ok = ["SUCCESS", "SUCCEEDED", "OK"].includes(status);
                return (
                  <tr key={id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{String(id).slice(0, 8)}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                      {String(iv.connector_id ?? "—").slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{iv.operation ?? iv.operation_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                        {status}
                      </span>
                      {iv.http_status ? <span className="ml-1.5 text-[10px] text-slate-400 font-mono">HTTP {iv.http_status}</span> : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">{iv.latency_ms != null ? `${iv.latency_ms} ms` : "—"}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {iv.created_at ? new Date(iv.created_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {invokeOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[520px] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold">Invoke a connector</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                This makes a real outbound call to the partner. It is not a dry run.
              </p>
            </div>
            <div className="p-6 flex flex-col gap-4 text-xs">
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 font-semibold">Connector</span>
                <select
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  value={invokeForm.connector_id}
                  onChange={(e) => setInvokeForm({ ...invokeForm, connector_id: e.target.value })}
                >
                  <option value="">— select —</option>
                  {(connectorsQ.data?.connectors ?? []).map((c) => (
                    <option key={c.connector_id} value={c.connector_id}>
                      {c.connector_name} · {c.status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 font-semibold">Operation</span>
                <input
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono outline-none focus:border-sky-500"
                  value={invokeForm.operation}
                  onChange={(e) => setInvokeForm({ ...invokeForm, operation: e.target.value })}
                  placeholder="getBalance"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 font-semibold">Path params (JSON)</span>
                <textarea
                  className="w-full h-24 bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono outline-none focus:border-sky-500 resize-y"
                  value={invokeForm.path_params}
                  onChange={(e) => setInvokeForm({ ...invokeForm, path_params: e.target.value })}
                />
              </label>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setInvokeOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => invoke.mutate()}
                disabled={invoke.isPending || !invokeForm.connector_id || !invokeForm.operation}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                {invoke.isPending ? "Invoking…" : "Invoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Emergency kill switch ─────────
 *
 * INT-ARC-003 / NFR-INT-05: every connection must be independently disableable
 * within 15 minutes. That guarantee is worth nothing if the only way to invoke
 * it is a curl command, so it lives on the row.
 *
 * Deliberately two-step. This severs live traffic to a partner — the kind of
 * action where a misclick is an outage — so it asks for a reason first, and the
 * reason is what gets recorded against the connection.
 */
function KillSwitchButton({ connectionId, name, status }: { connectionId: string; name?: string; status?: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const kill = useMutation({
    mutationFn: () => api.post("integration", `/v1/connections/${connectionId}/kill-switch`, { reason }),
    onSuccess: () => {
      toast.success("Kill switch engaged — traffic to this connection is stopped");
      setOpen(false);
      setReason("");
      qc.invalidateQueries({ queryKey: ["integration", "connections"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Kill switch failed"),
  });

  if (String(status ?? "").toUpperCase() === "DISABLED") {
    return <span className="text-[10px] text-slate-400">disabled</span>;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
      >
        Kill switch
      </button>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[460px] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold">Engage kill switch</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Stops all traffic to <strong>{name ?? connectionId}</strong> immediately. Anything in flight to this
                partner will fail.
              </p>
            </div>
            <div className="p-6 text-xs">
              <label className="flex flex-col gap-1.5">
                <span className="text-slate-700 font-semibold">Reason</span>
                <input
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Partner returning malformed responses since 14:02"
                />
                <span className="text-[10px] text-slate-400">Recorded against the connection.</span>
              </label>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => kill.mutate()}
                disabled={kill.isPending || !reason.trim()}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                {kill.isPending ? "Engaging…" : "Engage kill switch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ───────── Contract Governance Sub-Tab ─────────
 *
 * Schema versions, mapping versions, SLA profiles and rate-limit profiles —
 * the four registries that decide whether an integration is contract-governed
 * (P1-10) or just a URL someone configured.
 *
 * All four returned hardcoded arrays from the handler until the ExtRepository
 * was added; they now read the tables migrations 000009/000010 created. Empty
 * here means genuinely empty, which is itself the finding: an integration
 * estate with no registered schemas has no compatibility gate.
 */
function GovernanceTab() {
  const schemasQ = useQuery({
    queryKey: ["integration", "schema-versions"],
    queryFn: () => api.get<{ schema_versions?: any[] }>("integration", "/v1/schema-versions"),
  });
  const mappingsQ = useQuery({
    queryKey: ["integration", "mapping-versions"],
    queryFn: () => api.get<{ mapping_versions?: any[] }>("integration", "/v1/mapping-versions"),
  });
  const slaQ = useQuery({
    queryKey: ["integration", "sla-profiles"],
    queryFn: () => api.get<{ sla_profiles?: any[] }>("integration", "/v1/sla-profiles"),
  });
  const rateQ = useQuery({
    queryKey: ["integration", "rate-limit-profiles"],
    queryFn: () => api.get<{ rate_limit_profiles?: any[] }>("integration", "/v1/rate-limit-profiles"),
  });

  const schemas = schemasQ.data?.schema_versions ?? [];
  const mappings = mappingsQ.data?.mapping_versions ?? [];
  const slas = slaQ.data?.sla_profiles ?? [];
  const rates = rateQ.data?.rate_limit_profiles ?? [];

  const cell = "px-4 py-3";
  const th = "px-4 py-3 font-bold text-slate-500 uppercase text-[10px]";

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900">Contract Governance</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          P1-10 — every external integration needs a versioned contract, a compatibility mode, an SLA and a rate limit.
          An empty registry here is a finding, not a blank screen.
        </p>
      </div>

      {/* Schema versions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-bold text-slate-900">Schema versions</h3>
          <span className="text-[10px] font-mono text-slate-400">{schemas.length} registered</span>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={th}>Schema</th><th className={th}>Type</th><th className={th}>Version</th>
                <th className={th}>Compatibility</th><th className={th}>Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemasQ.isLoading ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
              ) : schemasQ.isError ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-rose-600">{errMessage(schemasQ.error, "Could not load schema versions.")}</td></tr>
              ) : schemas.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No schemas registered — nothing gates a breaking change.</td></tr>
              ) : schemas.map((v: any) => (
                <tr key={v.schema_version_id} className="hover:bg-slate-50/50">
                  <td className={`${cell} font-bold text-slate-800`}>{v.schema_name}</td>
                  <td className={`${cell} font-mono`}>{v.schema_type}</td>
                  <td className={`${cell} font-mono`}>{v.version}</td>
                  <td className={cell}><StatusBadge status={v.compatibility_mode} /></td>
                  <td className={cell}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${v.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {v.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapping versions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-bold text-slate-900">Mapping versions</h3>
          <span className="text-[10px] font-mono text-slate-400">{mappings.length} registered</span>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={th}>Mapping</th><th className={th}>Version</th>
                <th className={th}>Registered</th><th className={th}>Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappingsQ.isLoading ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
              ) : mappings.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No canonical mappings registered.</td></tr>
              ) : mappings.map((m: any) => (
                <tr key={m.mapping_id} className="hover:bg-slate-50/50">
                  <td className={`${cell} font-bold text-slate-800`}>{m.mapping_name}</td>
                  <td className={`${cell} font-mono`}>{m.version}</td>
                  <td className={cell}>{m.is_registered ? "yes" : "no"}</td>
                  <td className={cell}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${m.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {m.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA + rate limits side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900">SLA profiles</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className={th}>Profile</th><th className={th}>Availability</th><th className={th}>RTO</th><th className={th}>RPO</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slaQ.isLoading ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
                ) : slas.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No SLA profiles defined.</td></tr>
                ) : slas.map((p: any) => (
                  <tr key={p.sla_profile_id}>
                    <td className={`${cell} font-bold text-slate-800`}>{p.profile_name}</td>
                    <td className={`${cell} font-mono`}>{p.availability_target}%</td>
                    <td className={`${cell} font-mono`}>{p.rto_minutes}m</td>
                    <td className={`${cell} font-mono`}>{p.rpo_minutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900">Rate-limit profiles</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr><th className={th}>Profile</th><th className={th}>Per min</th><th className={th}>Burst</th><th className={th}>Concurrency</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rateQ.isLoading ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading...</td></tr>
                ) : rates.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No rate-limit profiles defined — nothing throttles an outbound partner.</td></tr>
                ) : rates.map((p: any) => (
                  <tr key={p.rate_profile_id}>
                    <td className={`${cell} font-bold text-slate-800`}>{p.profile_name}</td>
                    <td className={`${cell} font-mono`}>{p.requests_per_minute}</td>
                    <td className={`${cell} font-mono`}>{p.burst_allowance}</td>
                    <td className={`${cell} font-mono`}>{p.concurrency_limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
