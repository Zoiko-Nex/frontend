"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys } from "@/lib/admin/integration";
import { Field, Modal, PanelError, inputStyle } from "./console";

const EMPTY = {
  connector_name: "", provider_name: "", connector_type: "", auth_type: "", base_url: "", api_version: "",
  timeout_ms: "", uat_mode: "", tenancy_mode: "", contracting_entity: "", credential_scope: "", funds_flow_mode: "",
  merchant_or_payee_role: "", regulated_role: "", data_processing_role: "", revenue_presentation: "", arrangement_version: "",
};

/**
 * Registers a connector in the selected tenant. Every option comes from the
 * backend's vocabulary — the wizard this replaces offered tenancy modes the
 * API refused — and nothing is pre-filled: the commercial topology is a legal
 * declaration, and production activation is refused until it is complete.
 */
export function RegisterConnectorModal({ tenant, tenantName, onClose, onCreated }: {
  tenant: string;
  tenantName: string;
  onClose: () => void;
  onCreated: (connectorId: string) => void;
}) {
  const vocab = useQuery({ queryKey: integrationKeys.vocabulary(), queryFn: integrationApi.vocabulary, staleTime: Infinity });
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const register = useMutation({
    mutationFn: () => {
      const body: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(f)) if (v.trim()) body[k] = k === "timeout_ms" ? Number(v) : v.trim();
      return integrationApi.registerConnector(tenant, body);
    },
    onSuccess: (r) => { toast.success("Connector registered (DRAFT)"); onCreated(r.connector_id); },
    onError: (e) => toast.error(errMessage(e, "Registration refused")),
  });

  const ready = f.connector_name.trim() && f.provider_name.trim() && f.connector_type && f.auth_type && f.uat_mode;
  const select = (k: keyof typeof EMPTY, options: string[] | undefined) => (
    <select style={inputStyle} value={f[k]} onChange={set(k)}>
      <option value="">— select —</option>
      {(options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <Modal
      title="Register connector"
      subtitle={`In tenant ${tenantName}. One connector per parent brand; sub-brands are approved on it later.`}
      onClose={onClose}
      maxWidth={720}
      footer={<button type="button" className="btn btn-primary" disabled={!ready || register.isPending || !vocab.data} onClick={() => register.mutate()}>
        {register.isPending ? "Registering…" : "Register"}
      </button>}
    >
      {vocab.error ? <PanelError error={vocab.error} fallback="Could not load the allowed values from integration-ecosystem." /> : null}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Field label="Name"><input style={inputStyle} value={f.connector_name} onChange={set("connector_name")} placeholder="e.g. Nexus — Zoiko Mobile" /></Field>
        <Field label="Provider" hint="Matches an adapter, e.g. nexus."><input style={inputStyle} value={f.provider_name} onChange={set("provider_name")} /></Field>
        <Field label="Connector type">{select("connector_type", vocab.data?.connector_types)}</Field>
        <Field label="Auth type">{select("auth_type", vocab.data?.auth_types)}</Field>
        <Field label="Base URL" hint="Without it the connector cannot be called."><input style={inputStyle} value={f.base_url} onChange={set("base_url")} placeholder="https://…" /></Field>
        <Field label="API version"><input style={inputStyle} value={f.api_version} onChange={set("api_version")} /></Field>
        <Field label="Timeout (ms)"><input style={inputStyle} inputMode="numeric" value={f.timeout_ms} onChange={set("timeout_ms")} /></Field>
        <Field label="UAT mode" hint="PRODUCTION_TEST_SUBSCRIBERS for a provider with no sandbox (MVNOC Nexus).">{select("uat_mode", vocab.data?.uat_modes)}</Field>
      </div>
      <div className="sectitle">Commercial topology (§4.1) — may be completed later</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Field label="Tenancy mode">{select("tenancy_mode", vocab.data?.tenancy_modes)}</Field>
        <Field label="Credential scope">{select("credential_scope", vocab.data?.credential_scopes)}</Field>
        <Field label="Contracting entity"><input style={inputStyle} value={f.contracting_entity} onChange={set("contracting_entity")} /></Field>
        <Field label="Funds flow"><input style={inputStyle} value={f.funds_flow_mode} onChange={set("funds_flow_mode")} /></Field>
        <Field label="Merchant / payee role">{select("merchant_or_payee_role", vocab.data?.merchant_or_payee_roles)}</Field>
        <Field label="Regulated role"><input style={inputStyle} value={f.regulated_role} onChange={set("regulated_role")} /></Field>
        <Field label="Data processing role">{select("data_processing_role", vocab.data?.data_processing_roles)}</Field>
        <Field label="Revenue presentation">{select("revenue_presentation", vocab.data?.revenue_presentations)}</Field>
        <Field label="Arrangement version"><input style={inputStyle} value={f.arrangement_version} onChange={set("arrangement_version")} /></Field>
      </div>
    </Modal>
  );
}
