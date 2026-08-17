/**
 * Response-envelope handling for the ZoikoNex service APIs.
 *
 * Every service names its list key differently — `items`, `customers`, `products`,
 * `accounts`, `price_rules`, `offers`. Reading the wrong one does not throw: it
 * yields an empty array, which renders as "no data" and looks like an empty tenant
 * rather than a bug. Three dashboards shipped permanently empty for exactly that
 * reason, so the keys live here, in one place, verified against the handlers.
 */

import { ApiException } from "@/lib/admin/client";

/** List keys, each verified against the service's respondJSON call. */
export const ENVELOPE = {
  /** order-management: orders, order items, SIMs */
  items: "items",
  /** customer-account: GET /v1/customers */
  customers: "customers",
  /** customer-account: GET /v1/customers/{id}/accounts */
  accounts: "accounts",
  /** catalogue: GET /v1/products */
  products: "products",
  /** catalogue: GET /v1/products/{id}/price-rules */
  priceRules: "price_rules",
  /** catalogue: GET /v1/products/{id}/offers */
  offers: "offers",
  /** custmr-lfc-kyc: cases, documents, lifecycle events */
  kyc: "items",
  /**
   * billing-invoice: invoices, bill cycles, credit notes, debit notes. All four
   * list handlers wrap in {"items": [...]} (handlers.go ListInvoices,
   * ListBillCycles, ListCreditNotes, ListDebitNotes).
   */
  billing: "items",
  /**
   * payments: intents, events, refunds, settlements — every list is {"data": [...]}.
   * Intent lists additionally carry "next_cursor".
   */
  payments: "data",
  /** tax-jurisdiction: policies, decisions, exemptions — all {"data": [...]}. */
  tax: "data",
  /** finance-fabric-ledger: GET /v1/journal-entries → {"journal_entries": [...], "count": n} */
  journalEntries: "journal_entries",
  /** finance-fabric-ledger: GET /v1/ledger-lines → LedgerSummaryResponse.lines */
  ledgerLines: "lines",
  /**
   * usage-ingestion-mediation: normalised, rated and suspense lists all use the
   * same {data, pagination, meta} envelope — the only service here that returns
   * pagination metadata alongside the rows.
   */
  usage: "data",
} as const;

/** Read a list out of a response envelope, tolerating a missing or non-array key. */
export function listOf<T>(res: unknown, key: string): T[] {
  if (!res || typeof res !== "object") return [];
  const v = (res as Record<string, unknown>)[key];
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * A message worth showing an operator. ApiException already carries the backend's
 * error envelope message; anything else falls back to the caller's wording rather
 * than leaking a stack trace into the UI.
 */
export function errMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiException) return e.message;
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

/** True when a failure was a 404, which several endpoints use as a legitimate state. */
export function isNotFound(e: unknown): boolean {
  return e instanceof ApiException && e.status === 404;
}

/** First 8 characters of an id, for tables where the full UUID is noise. */
export function shortId(id: string | undefined | null): string {
  return id ? id.slice(0, 8) : "—";
}
