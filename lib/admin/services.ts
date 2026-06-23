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
} satisfies Record<string, ServiceDef>;

export type ServiceKey = keyof typeof SERVICES;

export function getService(key: string): ServiceDef | undefined {
  return (SERVICES as Record<string, ServiceDef>)[key];
}

/** Resolve a service's base URL from a NEXT_PUBLIC env var, falling back to localhost. */
export function serviceBaseUrl(svc: ServiceDef): string {
  // process.env.NEXT_PUBLIC_* is statically inlined by Next at build time.
  const fromEnv = (process.env as Record<string, string | undefined>)[svc.envVar];
  return fromEnv || `https://identity-tenancy-722985113446.europe-west1.run.app`;
}
