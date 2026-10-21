/**
 * integration-ecosystem from the super-admin console: every record shape and
 * every call, in one place.
 *
 * Each screen used to declare its own partial `Connector` and call the API with
 * its own guess at field names, and they drifted: the activation screen read
 * `role` where the API sends `approval_role`, the credential form sent
 * `value`/`header_name` where the API needs `username`/`password`/`login_url`,
 * and the mapping form posted fields the API does not accept. Types here mirror
 * the Go DTOs field for field; change them only alongside the backend.
 *
 * Every call takes the tenant it acts for. Connectors live in a tenant (one per
 * parent brand), and a platform admin reads them with an `X-Tenant-ID`
 * override — without it the platform tenant's own, empty, data comes back and
 * looks like "no connectors". Every mutation sends an `Idempotency-Key`, so a
 * double click or a retried request does not register a connector twice.
 */

import { platformApi } from "./platform/client";

const SVC = "integration";

// ─── Records ──────────────────────────────────────────────────────────────────

export interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  api_version?: string;
  timeout_ms: number;
  rate_limit_per_minute?: number;
  scope_type: string;
  uat_mode: string;
  certified_at?: string;
  certified_by?: string;

  // ── §4.1 commercial topology: declared, never defaulted ──
  tenancy_mode?: string;
  contracting_entity?: string;
  credential_scope?: string;
  funds_flow_mode?: string;
  merchant_or_payee_role?: string;
  regulated_role?: string;
  data_processing_role?: string;
  revenue_presentation?: string;
  arrangement_version?: string;

  created_at: string;
  updated_at: string;
}

/** The allowed values for connector fields, served by the backend. */
export interface ConnectorVocabulary {
  connector_types: string[];
  auth_types: string[];
  tenancy_modes: string[];
  credential_scopes: string[];
  revenue_presentations: string[];
  merchant_or_payee_roles: string[];
  data_processing_roles: string[];
  uat_modes: string[];
  approval_roles: string[];
  environments: string[];
}

export interface Credential {
  credential_id: string;
  connector_id: string;
  environment: string;
  credential_type: string;
  fingerprint: string;
  status: string;
  submitted_by: string;
  created_at: string;
  hint?: string;
  expires_at?: string;
  last_used_at?: string;
}

export interface Operation {
  operation_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  is_retryable: boolean;
  certification_status: string;
  certified_at?: string;
  certified_by?: string;
  description?: string;
}

export interface Approval {
  approval_id: string;
  approval_role: string;
  approver_identity: string;
  decision: "APPROVED" | "REJECTED";
  note?: string;
  decided_at: string;
}

export interface Activation {
  activation_id: string;
  connector_id: string;
  environment: string;
  maker_identity: string;
  maker_at: string;
  adapter_version?: string;
  qualification_status: string;
  qualification_suite?: string;
  qualification_digest?: string;
  qualification_at?: string;
  approvals_complete: boolean;
  checker_identity?: string;
  checked_at?: string;
  state: string;
  reject_reason?: string;
  approvals?: Approval[];
  created_at: string;
}

export interface ReadinessGate {
  id: string;
  name: string;
  status: "BLOCKED" | "PARTIAL" | "READY_TO_ASSESS" | string;
  blockers?: string[];
  done?: string[];
}

export interface Readiness {
  connector_id: string;
  connector_status: string;
  operations_registered: number;
  operations_certified: number;
  note?: string;
  readiness: {
    idd: string;
    idd_version: string;
    provider: string;
    gates: ReadinessGate[];
    operations_catalogued: number;
    verified_result_codes: number;
    captured_fixtures: number;
    activatable: boolean;
    why_not?: string;
  };
}

export interface ResultCode {
  code: string;
  message_match?: string;
  code_family: string;
  severity: string;
  outcome_class: string;
  provider_resubmittable?: boolean;
  requires_escalation: boolean;
  message: string;
  action_to_fix?: string;
  source_document: string;
  source_version?: string;
  version: number;
}

export interface RatePolicy {
  rate_policy_id: string;
  policy_name: string;
  scope: "CONNECTOR" | "SUBSCRIBER" | string;
  applies_to: string[];
  max_requests: number;
  window_seconds: number;
  min_interval_seconds: number;
  source_reference: string;
  version: number;
  updated_at: string;
  updated_by: string;
}

export interface TestSubscriber {
  test_subscriber_id: string;
  identifier_type: "MSISDN" | "ICCID";
  identifier_last4: string;
  label: string;
  expires_at?: string;
  created_at: string;
  created_by: string;
}

export interface BrandAuthorization {
  brand_authorization_id: string;
  authorized_brand: string;
  authorization_reference: string;
  authorized_on: string;
  expires_on?: string;
  created_at: string;
  created_by: string;
}

export interface CallbackEndpoint {
  callback_endpoint_id: string;
  allowed_source_cidrs: string[];
  enforce_source_allowlist: boolean;
  port_out_unavailable_code: string;
  url_path_template: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface CreatedCallbackEndpoint {
  endpoint: CallbackEndpoint;
  url_path: string;
  url?: string;
  note: string;
}

export interface ProviderCallback {
  callback_id: string;
  request_type: string;
  provider_transaction_id?: string;
  batch_id?: string;
  result_code?: string;
  result_class?: string;
  matched_invocation_id?: string;
  status: string;
  answered_code?: string;
  received_at: string;
}

export interface Invocation {
  invocation_id: string;
  operation_name: string;
  http_method: string;
  response_status?: number;
  attempts: number;
  duration_ms: number;
  outcome: string;
  error_summary?: string;
  provider_result_code?: string;
  provider_result_class?: string;
  provider_warning_codes?: string[];
  provider_transaction_id?: string;
  is_uat: boolean;
  created_at: string;
}

export interface InvokeResult {
  invocation_id: string;
  provider: string;
  status: number;
  outcome: string;
  attempts: number;
  duration_ms: number;
  outcome_class?: string;
  provider_code?: string;
  provider_message?: string;
  action_to_fix?: string;
  requires_escalation?: boolean;
  warning_codes?: string[];
  provider_transaction_id?: string;
  uat?: boolean;
  response?: unknown;
  response_text?: string;
}

// ─── Query keys ───────────────────────────────────────────────────────────────

export const integrationKeys = {
  all: (tenant: string) => ["integration", tenant] as const,
  vocabulary: () => ["integration", "vocabulary"] as const,
  connectors: (tenant: string) => ["integration", tenant, "connectors"] as const,
  connector: (tenant: string, id: string) => ["integration", tenant, "connector", id] as const,
  part: (tenant: string, id: string, part: string) => ["integration", tenant, "connector", id, part] as const,
};

// ─── Calls ────────────────────────────────────────────────────────────────────

const as = (tenant: string) => ({ asTenant: tenant });
const mutate = (tenant: string) => ({ asTenant: tenant, idempotencyKey: platformApi.uuid() });
const c = (id: string) => `/v1/connectors/${encodeURIComponent(id)}`;

export const integrationApi = {
  vocabulary: () => platformApi.get<ConnectorVocabulary>(SVC, "/v1/connector-vocabulary"),

  listConnectors: async (tenant: string) =>
    (await platformApi.get<{ connectors: Connector[] }>(SVC, "/v1/connectors", as(tenant))).connectors ?? [],
  getConnector: (tenant: string, id: string) => platformApi.get<Connector>(SVC, c(id), as(tenant)),
  registerConnector: (tenant: string, body: Record<string, unknown>) =>
    platformApi.post<{ connector_id: string }>(SVC, "/v1/connectors", body, mutate(tenant)),
  suspendConnector: (tenant: string, id: string, reason: string) =>
    platformApi.post(SVC, `${c(id)}/suspend`, { reason }, mutate(tenant)),

  listCredentials: async (tenant: string, id: string) =>
    (await platformApi.get<{ credentials: Credential[] }>(SVC, `${c(id)}/credentials`, as(tenant))).credentials ?? [],
  submitCredential: (tenant: string, id: string, body: Record<string, unknown>) =>
    platformApi.post<Credential>(SVC, `${c(id)}/credentials`, body, mutate(tenant)),
  /** Revoke a credential; `compromised` starts the INT-LCM-005 one-hour clock. */
  revokeCredential: (tenant: string, credentialId: string, note: string, compromised: boolean) =>
    platformApi.delWithBody(SVC, `/v1/credentials/${encodeURIComponent(credentialId)}${compromised ? "?compromised=true" : ""}`,
      { note }, mutate(tenant)),

  listOperations: async (tenant: string, id: string) =>
    (await platformApi.get<{ operations: Operation[] }>(SVC, `${c(id)}/operations`, as(tenant))).operations ?? [],
  seedOperations: (tenant: string, id: string) =>
    platformApi.post<{ status: string; error?: string; registered?: number }>(SVC, `${c(id)}/operations/seed`, {}, mutate(tenant)),
  certifyOperation: (tenant: string, operationId: string, status: "SANDBOX_PASSED" | "CERTIFIED" | "REVOKED") =>
    platformApi.post(SVC, `/v1/operations/${encodeURIComponent(operationId)}/certify`, { status }, mutate(tenant)),

  readiness: (tenant: string, id: string) =>
    platformApi.get<Readiness>(SVC, `${c(id)}/certification-readiness`, as(tenant)),

  listResultCodes: async (tenant: string, id: string) =>
    (await platformApi.get<{ result_codes: ResultCode[] }>(SVC, `${c(id)}/result-codes`, as(tenant))).result_codes ?? [],
  importResultCodes: (tenant: string, id: string, document: unknown) =>
    platformApi.post<{ created: number; updated: number; unchanged: number }>(SVC, `${c(id)}/result-codes/import`,
      document, mutate(tenant)),

  listRatePolicies: async (tenant: string, id: string) =>
    (await platformApi.get<{ rate_policies: RatePolicy[] }>(SVC, `${c(id)}/rate-policies`, as(tenant))).rate_policies ?? [],
  setRatePolicies: (tenant: string, id: string, document: unknown) =>
    platformApi.put<{ rate_policies: RatePolicy[] }>(SVC, `${c(id)}/rate-policies`, document, mutate(tenant)),
  removeRatePolicy: (tenant: string, id: string, policyId: string) =>
    platformApi.del(SVC, `${c(id)}/rate-policies/${encodeURIComponent(policyId)}`, mutate(tenant)),

  listTestSubscribers: async (tenant: string, id: string) =>
    (await platformApi.get<{ test_subscribers: TestSubscriber[] }>(SVC, `${c(id)}/test-subscribers`, as(tenant))).test_subscribers ?? [],
  addTestSubscriber: (tenant: string, id: string, body: { identifier_type: string; identifier: string; label: string; expires_at?: string }) =>
    platformApi.post<TestSubscriber>(SVC, `${c(id)}/test-subscribers`, body, mutate(tenant)),
  removeTestSubscriber: (tenant: string, id: string, subscriberId: string) =>
    platformApi.del(SVC, `${c(id)}/test-subscribers/${encodeURIComponent(subscriberId)}`, mutate(tenant)),

  listBrandAuthorizations: async (tenant: string, id: string) =>
    (await platformApi.get<{ brand_authorizations: BrandAuthorization[] }>(SVC, `${c(id)}/brand-authorizations`, as(tenant))).brand_authorizations ?? [],
  addBrandAuthorization: (tenant: string, id: string, body: { authorized_brand: string; authorization_reference: string; authorized_on: string; expires_on?: string }) =>
    platformApi.post<BrandAuthorization>(SVC, `${c(id)}/brand-authorizations`, body, mutate(tenant)),
  revokeBrandAuthorization: (tenant: string, id: string, authorizationId: string) =>
    platformApi.del(SVC, `${c(id)}/brand-authorizations/${encodeURIComponent(authorizationId)}`, mutate(tenant)),

  getCallbackEndpoint: (tenant: string, id: string) =>
    platformApi.get<CallbackEndpoint>(SVC, `${c(id)}/callback-endpoints`, as(tenant)),
  createCallbackEndpoint: (tenant: string, id: string, body: { allowed_source_cidrs: string[]; enforce_source_allowlist: boolean; port_out_unavailable_code?: string }) =>
    platformApi.post<CreatedCallbackEndpoint>(SVC, `${c(id)}/callback-endpoints`, body, mutate(tenant)),
  updateCallbackEndpoint: (tenant: string, id: string, endpointId: string, body: { allowed_source_cidrs: string[]; enforce_source_allowlist: boolean; port_out_unavailable_code?: string }) =>
    platformApi.put<CallbackEndpoint>(SVC, `${c(id)}/callback-endpoints/${encodeURIComponent(endpointId)}`, body, mutate(tenant)),
  listCallbacks: async (tenant: string, id: string) =>
    (await platformApi.get<{ callbacks: ProviderCallback[] }>(SVC, `${c(id)}/callbacks?limit=50`, as(tenant))).callbacks ?? [],

  listActivations: (tenant: string, id: string) =>
    platformApi.get<{ activations: Activation[]; required_approvals: string[] }>(SVC, `${c(id)}/activation-requests`, as(tenant)),
  requestActivation: (tenant: string, id: string, environment: string, adapterVersion?: string) =>
    platformApi.post<{ activation: Activation; required_approvals: string[] }>(SVC, `${c(id)}/activation-requests`,
      { environment, adapter_version: adapterVersion }, mutate(tenant)),
  recordQualification: (tenant: string, activationId: string, body: { suite: string; digest: string; passed: boolean }) =>
    platformApi.post<Activation>(SVC, `/v1/activations/${encodeURIComponent(activationId)}/qualification`, body, mutate(tenant)),
  approve: (tenant: string, activationId: string, body: { role: string; decision: "APPROVED" | "REJECTED"; note?: string }) =>
    platformApi.post<Activation>(SVC, `/v1/activations/${encodeURIComponent(activationId)}/approvals`, body, mutate(tenant)),
  activate: (tenant: string, activationId: string) =>
    platformApi.post<Activation>(SVC, `/v1/activations/${encodeURIComponent(activationId)}/activate`, {}, mutate(tenant)),
  withdraw: (tenant: string, activationId: string, reason: string) =>
    platformApi.post<Activation>(SVC, `/v1/activations/${encodeURIComponent(activationId)}/withdraw`, { reason }, mutate(tenant)),

  listInvocations: async (tenant: string, id: string) =>
    (await platformApi.get<{ invocations: Invocation[] }>(SVC, `/v1/invocations?connector_id=${encodeURIComponent(id)}&limit=50`, as(tenant))).invocations ?? [],
  /**
   * Calls a provider operation. A provider refusal (422), a pending answer
   * (202) and an unknown outcome (502) all come back as an InvokeResult: they
   * are answers to show the operator — with the provider's code and remedy —
   * not exceptions. Only failures with no invocation behind them throw.
   */
  invoke: async (tenant: string, id: string, operation: string, payload: unknown): Promise<InvokeResult> => {
    try {
      return await platformApi.post<InvokeResult>(SVC, `${c(id)}/invoke`, { operation, payload }, mutate(tenant));
    } catch (e) {
      const body = (e as { body?: unknown }).body as Partial<InvokeResult> | undefined;
      if (body && typeof body === "object" && typeof body.invocation_id === "string") return body as InvokeResult;
      throw e;
    }
  },
};
