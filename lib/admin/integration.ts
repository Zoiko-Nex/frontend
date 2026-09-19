/**
 * Shared shapes for integration-ecosystem records.
 *
 * `Connector` was declared separately in three screens with 27, 24 and 19
 * fields — three partial descriptions of one backend record. Nothing forced
 * them to agree, so a field added to the API reached whichever screen someone
 * remembered to update, and the narrower copies silently dropped the rest.
 *
 * The commercial-topology fields matter most here: tenancy mode, credential
 * scope, funds flow, merchant role, regulated role and data-processing role
 * decide who is liable, who is paid and which regulator applies. A screen
 * working from a copy that omits them cannot show what it does not know it has.
 */

export interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  brand_id?: string;
  rate_limit_per_minute?: number;
  timeout_ms?: number;

  // ── §4.1 commercial topology ────────────────────────────────────────────
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
