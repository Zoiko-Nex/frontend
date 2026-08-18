/**
 * ZoikoNex service registry — the single source of truth for how the admin
 * panel (browser) reaches each of the 18 backend domains DIRECTLY.
 *
 * The 18 services do NOT share one auth/header convention. There are three:
 *
 *   1. "jwt"          — tenant/brand derived from the JWT claims. Send only the
 *                       Bearer token. (Most services.)
 *   2. "tenant-header"— tenant sent via X-Tenant-ID header, NOT from the token.
 *                       (identity-tenancy login + rating-charging.)
 *   3. "tenant-brand-idem" — X-Tenant-ID + X-Brand-ID required, Idempotency-Key
 *                       required on mutations. (reporting-regulatory.)
 *
 * The client (client.ts) reads `headerStyle` here and injects the right headers
 * so the rest of the app never has to think about it.
 *
 * Base URLs are public (NEXT_PUBLIC_*) because the browser calls them directly.
 * Each non-identity service must allow the panel's origin in its CORS config.
 */

export type HeaderStyle = "jwt" | "tenant-header" | "tenant-brand-idem";

export interface ServiceDef {
  key: string;
  label: string;
  /** NEXT_PUBLIC env var holding the base URL (browser-visible). */
  envVar: string;
  /** Local dev port (documentation / fallback). */
  port: number;
  headerStyle: HeaderStyle;
  idempotent?: boolean;
}

export const SERVICES = {
  identity: { key: "identity", label: "Identity & Tenancy", envVar: "NEXT_PUBLIC_SVC_IDENTITY", port: 8080, headerStyle: "tenant-header" },
  customer: { key: "customer", label: "Customer & Account", envVar: "NEXT_PUBLIC_SVC_CUSTOMER", port: 8081, headerStyle: "jwt" },
  catalogue: { key: "catalogue", label: "Product Catalogue", envVar: "NEXT_PUBLIC_SVC_CATALOGUE", port: 8082, headerStyle: "jwt" },
  order: { key: "order", label: "Orders & Provisioning", envVar: "NEXT_PUBLIC_SVC_ORDER", port: 8083, headerStyle: "jwt" },
  finance: { key: "finance", label: "Finance Fabric & Ledger", envVar: "NEXT_PUBLIC_SVC_FINANCE", port: 8084, headerStyle: "jwt" },
  rating: { key: "rating", label: "Rating & Charging", envVar: "NEXT_PUBLIC_SVC_RATING", port: 8085, headerStyle: "tenant-header" },
  partner: { key: "partner", label: "Partner Settlement", envVar: "NEXT_PUBLIC_SVC_PARTNER", port: 8086, headerStyle: "jwt" },
  revenueAssurance: { key: "revenueAssurance", label: "Revenue Assurance", envVar: "NEXT_PUBLIC_SVC_REVENUE_ASSURANCE", port: 8087, headerStyle: "jwt" },
  tax: { key: "tax", label: "Tax & Jurisdiction", envVar: "NEXT_PUBLIC_SVC_TAX", port: 8089, headerStyle: "jwt" },
  fraud: { key: "fraud", label: "Fraud & Risk", envVar: "NEXT_PUBLIC_SVC_FRAUD", port: 8090, headerStyle: "jwt" },
  kyc: { key: "kyc", label: "Customer Lifecycle & KYC", envVar: "NEXT_PUBLIC_SVC_KYC", port: 8091, headerStyle: "jwt" },
  billing: { key: "billing", label: "Billing & Invoice", envVar: "NEXT_PUBLIC_SVC_BILLING", port: 8092, headerStyle: "jwt" },
  evidence: { key: "evidence", label: "Evidence Ledger", envVar: "NEXT_PUBLIC_SVC_EVIDENCE", port: 8093, headerStyle: "jwt" },
  usage: { key: "usage", label: "Usage & Mediation", envVar: "NEXT_PUBLIC_SVC_USAGE", port: 8094, headerStyle: "jwt" },
  dunning: { key: "dunning", label: "Dunning & Disputes", envVar: "NEXT_PUBLIC_SVC_DUNNING", port: 8095, headerStyle: "jwt" },
  payments: { key: "payments", label: "Payments", envVar: "NEXT_PUBLIC_SVC_PAYMENTS", port: 8096, headerStyle: "jwt", idempotent: true },
  integration: { key: "integration", label: "Integration Ecosystem", envVar: "NEXT_PUBLIC_SVC_INTEGRATION", port: 8097, headerStyle: "jwt", idempotent: true },
  reporting: { key: "reporting", label: "Reporting & Regulatory", envVar: "NEXT_PUBLIC_SVC_REPORTING", port: 8098, headerStyle: "tenant-brand-idem", idempotent: true },
  /**
   * The 19th service, and the odd one out: request-forms backs the PUBLIC
   * marketing forms (demo request, contact, careers, press, terms review) and
   * every route on it is unauthenticated by design — a prospect filling in a
   * form has no tenant and no token.
   *
   * It is registered here anyway so the read side (listing what was submitted)
   * goes through the same client as everything else instead of a bare fetch.
   * headerStyle is "jwt" only because the client needs a value; with no session
   * it simply sends no Authorization header, which is what this service wants.
   */
  requestForms: { key: "requestForms", label: "Request Forms", envVar: "NEXT_PUBLIC_SVC_REQUEST_FORMS", port: 8099, headerStyle: "jwt" },
} satisfies Record<string, ServiceDef>;

export type ServiceKey = keyof typeof SERVICES;

export function getService(key: string): ServiceDef | undefined {
  return (SERVICES as Record<string, ServiceDef>)[key];
}

/**
 * Static map of every service env var to its value.
 *
 * IMPORTANT: Next.js inlines `process.env.NEXT_PUBLIC_*` at build time ONLY when
 * the full var name is written as a LITERAL in the source. A dynamic lookup like
 * `process.env[svc.envVar]` is NOT inlined and resolves to `undefined` in the
 * browser bundle — which is why setting .env had no effect. Listing each var as a
 * literal here makes the inlining happen.
 */
const SERVICE_BASE_URLS: Record<string, string | undefined> = {
  NEXT_PUBLIC_SVC_IDENTITY: process.env.NEXT_PUBLIC_SVC_IDENTITY,
  NEXT_PUBLIC_SVC_CUSTOMER: process.env.NEXT_PUBLIC_SVC_CUSTOMER,
  NEXT_PUBLIC_SVC_CATALOGUE: process.env.NEXT_PUBLIC_SVC_CATALOGUE,
  NEXT_PUBLIC_SVC_ORDER: process.env.NEXT_PUBLIC_SVC_ORDER,
  NEXT_PUBLIC_SVC_FINANCE: process.env.NEXT_PUBLIC_SVC_FINANCE,
  NEXT_PUBLIC_SVC_RATING: process.env.NEXT_PUBLIC_SVC_RATING,
  NEXT_PUBLIC_SVC_PARTNER: process.env.NEXT_PUBLIC_SVC_PARTNER,
  NEXT_PUBLIC_SVC_REVENUE_ASSURANCE: process.env.NEXT_PUBLIC_SVC_REVENUE_ASSURANCE,
  NEXT_PUBLIC_SVC_TAX: process.env.NEXT_PUBLIC_SVC_TAX,
  NEXT_PUBLIC_SVC_FRAUD: process.env.NEXT_PUBLIC_SVC_FRAUD,
  NEXT_PUBLIC_SVC_KYC: process.env.NEXT_PUBLIC_SVC_KYC,
  NEXT_PUBLIC_SVC_BILLING: process.env.NEXT_PUBLIC_SVC_BILLING,
  NEXT_PUBLIC_SVC_EVIDENCE: process.env.NEXT_PUBLIC_SVC_EVIDENCE,
  NEXT_PUBLIC_SVC_USAGE: process.env.NEXT_PUBLIC_SVC_USAGE,
  NEXT_PUBLIC_SVC_DUNNING: process.env.NEXT_PUBLIC_SVC_DUNNING,
  NEXT_PUBLIC_SVC_PAYMENTS: process.env.NEXT_PUBLIC_SVC_PAYMENTS,
  NEXT_PUBLIC_SVC_INTEGRATION: process.env.NEXT_PUBLIC_SVC_INTEGRATION,
  NEXT_PUBLIC_SVC_REPORTING: process.env.NEXT_PUBLIC_SVC_REPORTING,
  NEXT_PUBLIC_SVC_REQUEST_FORMS: process.env.NEXT_PUBLIC_SVC_REQUEST_FORMS,
};

const PORT_TO_LIVE_URL: Record<number, string> = {
  8080: "https://identity.api.zoikonex.com",
  8081: "https://customer.api.zoikonex.com",
  8082: "https://catalogue.api.zoikonex.com",
  8083: "https://ordering.api.zoikonex.com",
  8084: "https://finance.api.zoikonex.com",
  8085: "https://rating.api.zoikonex.com",
  8086: "https://settlement.api.zoikonex.com",
  8087: "https://assurance.api.zoikonex.com",
  8089: "https://tax.api.zoikonex.com",
  8090: "https://fraud.api.zoikonex.com",
  8091: "https://kyc.api.zoikonex.com",
  8092: "https://billing.api.zoikonex.com",
  8093: "https://evidence.api.zoikonex.com",
  8094: "https://usage.api.zoikonex.com",
  8095: "https://dunning.api.zoikonex.com",
  8096: "https://payments.api.zoikonex.com",
  8097: "https://integration.api.zoikonex.com",
  8098: "https://reporting.api.zoikonex.com",
  8099: "https://forms.api.zoikonex.com",
};

/** Resolve a service's base URL from its NEXT_PUBLIC env var, falling back to the live domain or localhost. */
export function serviceBaseUrl(svc: ServiceDef): string {
  const fromEnv = SERVICE_BASE_URLS[svc.envVar];
  return fromEnv || PORT_TO_LIVE_URL[svc.port] || `http://localhost:${svc.port}`;
}
