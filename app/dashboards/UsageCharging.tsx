"use client";

/**
 * Usage & Charging console — two services, one operator workflow.
 *
 *   usage-ingestion-mediation (8094)   CDR in → normalise → rate → suspense
 *   rating-charging           (8085)   prepaid OCS balances + postpaid rating
 *
 * They are separate deployables with separate failure domains (ADR-005), but an
 * operator chasing "why was this subscriber charged that" crosses both, so they
 * share a screen rather than being split by service boundary.
 *
 * Two things worth knowing before reading the code:
 *
 *   - **Rating inputs come from the caller.** This domain owns mediation, not
 *     pricing: Product Catalogue owns the rate and Tax & Jurisdiction owns the
 *     tax. The rate form therefore asks for them rather than deriving them,
 *     which is exactly what the backend expects.
 *   - **Prepaid is lookup-by-subscriber, not a list.** rating-charging has no
 *     scan endpoint for balances (no supporting index), so the prepaid tab is
 *     built around entering a subscriber id. That is the OCS access pattern
 *     anyway — balances are per-subscriber by nature.
 *
 * Money is integer minor units throughout; formatMoney is display only.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, isNotFound, listOf, shortId } from "@/lib/admin/envelope";
import {
  Field,
  Modal,
  ModalActions,
  StatusPill,
  TableState,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";

// ─── usage-ingestion-mediation ────────────────────────────────────────────────

interface NormalisedRecord {
  id: string;
  subscriber_id: string;
  usage_type: string;
  quantity: number;
  unit: string;
  start_at: string;
  end_at?: string;
  status: string;
  rated_amount_minor_units?: number;
  rated_currency_code?: string;
  roaming_partner?: string;
}

interface RatedRecord {
  id: string;
  normalised_id: string;
  usage_type: string;
  is_billable: boolean;
  non_billable_reason?: string;
  product_id?: string;
  charge_code?: string;
  rate_per_unit: number;
  quantity_rated: number;
  charge_amount_minor_units: number;
  currency_code: string;
  tax_category?: string;
  tax_rate_bps: number;
  tax_amount_minor_units: number;
  partner_cost_minor_units?: number;
  jurisdiction_code?: string;
  rated_at: string;
}

interface SuspenseEntry {
  id: string;
  subscriber_id?: string;
  suspense_code: string;
  suspense_reason: string;
  retry_count: number;
  suspended_at: string;
}

interface Pagination {
  offset: number;
  limit: number;
  total: number;
  has_more: boolean;
}

// ─── rating-charging ──────────────────────────────────────────────────────────

interface BalanceAccount {
  subscriber_id: string;
  balance_minor_units: number;
  reserved_minor_units: number;
  currency: string;
  status: string;
  account_type?: string;
}

interface Reservation {
  reservation_id: string;
  subscriber_id: string;
  status: string;
  currency: string;
  reserved_units: number;
  debited_units?: number;
  expires_at?: string;
  reserved_at?: string;
}

interface RatedCharge {
  rated_charge_id: string;
  usage_type: string;
  quantity: string;
  unit: string;
  amount_minor_units: number;
  currency: string;
  usage_occurred_at: string;
  rated_at: string;
}

const USAGE_TYPES = ["VOICE", "DATA", "SMS", "MMS", "ROAMING_DATA"];
const UNITS = ["SECONDS", "BYTES", "COUNT"];

function nowIso(): string {
  return new Date().toISOString();
}

export default function UsageCharging() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"normalised" | "rated" | "suspense" | "prepaid" | "postpaid">("normalised");

  const [ingestOpen, setIngestOpen] = useState(false);
  const [rateFor, setRateFor] = useState<NormalisedRecord | null>(null);
  const [reviewFor, setReviewFor] = useState<SuspenseEntry | null>(null);
  const [writeOffFor, setWriteOffFor] = useState<SuspenseEntry | null>(null);

  const [billableFilter, setBillableFilter] = useState<"" | "true" | "false">("");
  const [usageTypeFilter, setUsageTypeFilter] = useState("");

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  // ─── Queries: usage ─────────────────────────────────────────────────────────

  const normalisedQ = useQuery({
    queryKey: ["usage", "normalised"],
    enabled: tab === "normalised",
    queryFn: async () => {
      const res = await api.get<{ data?: NormalisedRecord[]; pagination?: Pagination }>(
        "usage",
        "/v1/usage/normalised?limit=100",
      );
      return { rows: res.data ?? [], page: res.pagination };
    },
  });

  const ratedQ = useQuery({
    queryKey: ["usage", "rated", usageTypeFilter, billableFilter],
    enabled: tab === "rated",
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "100" });
      if (usageTypeFilter) params.set("usage_type", usageTypeFilter);
      if (billableFilter) params.set("is_billable", billableFilter);
      const res = await api.get<{ data?: RatedRecord[] }>("usage", `/v1/usage/rated?${params}`);
      return res.data ?? [];
    },
  });

  const suspenseQ = useQuery({
    queryKey: ["usage", "suspense"],
    enabled: tab === "suspense",
    queryFn: async () =>
      listOf<SuspenseEntry>(await api.get("usage", "/v1/usage/suspense?limit=100"), ENVELOPE.usage),
  });

  // ─── Queries: rating (lookup-driven) ────────────────────────────────────────

  const [subscriberLookup, setSubscriberLookup] = useState("");
  const [activeSubscriber, setActiveSubscriber] = useState("");

  const balanceQ = useQuery({
    queryKey: ["rating", "balance", activeSubscriber],
    enabled: !!activeSubscriber,
    // A subscriber with no prepaid account is a legitimate answer, not an error.
    retry: false,
    queryFn: async () => {
      try {
        return await api.get<BalanceAccount>("rating", `/v1/balance-accounts/${activeSubscriber}`);
      } catch (e) {
        if (isNotFound(e)) return null;
        throw e;
      }
    },
  });

  const [reservationLookup, setReservationLookup] = useState("");
  const [activeReservation, setActiveReservation] = useState("");

  const reservationQ = useQuery({
    queryKey: ["rating", "reservation", activeReservation],
    enabled: !!activeReservation,
    retry: false,
    queryFn: async () => {
      try {
        return await api.get<Reservation>("rating", `/v1/prepaid/reservations/${activeReservation}`);
      } catch (e) {
        if (isNotFound(e)) return null;
        throw e;
      }
    },
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [ingestForm, setIngestForm] = useState({
    network_element: "pgw-01",
    subscriber_id: "",
    usage_type: "DATA",
    quantity: 1024,
    unit: "BYTES",
  });

  const [rateForm, setRateForm] = useState({
    product_id: "",
    charge_code: "",
    rate_per_unit: 0,
    currency_code: "GBP",
    tax_category: "STANDARD",
    tax_rate_bps: 2000,
    is_billable: true,
    non_billable_reason: "",
  });

  const [accountForm, setAccountForm] = useState({
    subscriber_id: "",
    account_id: "",
    customer_id: "",
    brand_id: "",
    currency_code: "GBP",
    initial_balance: 0,
  });
  const [accountOpen, setAccountOpen] = useState(false);

  const [reserveForm, setReserveForm] = useState({ subscriber_id: "", currency_code: "GBP", amount: 0 });
  const [debitForm, setDebitForm] = useState({ reservation_id: "", amount: 0, evidence_id: "" });

  const [postpaidForm, setPostpaidForm] = useState({
    subscriber_id: "",
    account_id: "",
    customer_id: "",
    normalised_usage_id: "",
    product_id: "",
    currency_code: "GBP",
    usage_type: "DATA",
    quantity: "1",
    quantity_unit: "BYTES",
    amount_minor_units: 0,
    bill_cycle_id: "",
  });
  const [lastCharge, setLastCharge] = useState<RatedCharge | null>(null);

  const [assignedTo, setAssignedTo] = useState("");
  const [writeOffNotes, setWriteOffNotes] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const ingest = useMutation({
    mutationFn: () =>
      api.post("usage", "/v1/usage/ingest", {
        event_id: api.uuid(),
        network_element: ingestForm.network_element,
        occurred_at: nowIso(),
        events: [
          {
            subscriber_id: ingestForm.subscriber_id,
            usage_type: ingestForm.usage_type,
            quantity: ingestForm.quantity,
            unit: ingestForm.unit,
            start_at: nowIso(),
          },
        ],
      }),
    onSuccess: () => {
      toast.success("CDR accepted into the pipeline");
      setIngestOpen(false);
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
    onError: fail("Ingest was rejected"),
  });

  const rate = useMutation({
    mutationFn: () =>
      api.post("usage", `/v1/usage/normalised/${rateFor!.id}/rate`, {
        product_id: rateForm.product_id,
        charge_code: rateForm.charge_code,
        rate_per_unit: rateForm.rate_per_unit,
        currency_code: rateForm.currency_code,
        tax_category: rateForm.tax_category,
        tax_rate_bps: rateForm.tax_rate_bps,
        is_billable: rateForm.is_billable,
        non_billable_reason: rateForm.is_billable ? "" : rateForm.non_billable_reason,
        rated_by: "console",
      }),
    onSuccess: () => {
      toast.success("Record rated");
      setRateFor(null);
      qc.invalidateQueries({ queryKey: ["usage"] });
    },
    onError: fail("Rating failed"),
  });

  const review = useMutation({
    mutationFn: () => api.post("usage", `/v1/usage/suspense/${reviewFor!.id}/review`, { assigned_to: assignedTo }),
    onSuccess: () => {
      toast.success("Assigned for review");
      setReviewFor(null);
      setAssignedTo("");
      qc.invalidateQueries({ queryKey: ["usage", "suspense"] });
    },
    onError: fail("Could not assign the entry"),
  });

  const writeOff = useMutation({
    mutationFn: () => api.post("usage", `/v1/usage/suspense/${writeOffFor!.id}/write-off`, { notes: writeOffNotes }),
    onSuccess: () => {
      toast.success("Written off — the record is retained, not deleted");
      setWriteOffFor(null);
      setWriteOffNotes("");
      qc.invalidateQueries({ queryKey: ["usage", "suspense"] });
    },
    onError: fail("Could not write off the entry"),
  });

  const createAccount = useMutation({
    mutationFn: () =>
      api.post("rating", "/v1/balance-accounts", {
        subscriber_id: accountForm.subscriber_id,
        account_id: accountForm.account_id,
        customer_id: accountForm.customer_id,
        brand_id: accountForm.brand_id,
        currency_code: accountForm.currency_code,
        initial_balance: accountForm.initial_balance,
      }),
    onSuccess: () => {
      toast.success("Balance account opened");
      setAccountOpen(false);
      setActiveSubscriber(accountForm.subscriber_id);
      setSubscriberLookup(accountForm.subscriber_id);
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Could not open the balance account"),
  });

  const reserve = useMutation({
    mutationFn: () =>
      api.post<Reservation>("rating", "/v1/prepaid/reserve", {
        subscriber_id: reserveForm.subscriber_id,
        // The backend dedupes on this key, so a double-click cannot hold funds twice.
        idempotency_key: api.uuid(),
        currency_code: reserveForm.currency_code,
        amount: reserveForm.amount,
      }),
    onSuccess: (res) => {
      toast.success(`Reserved ${formatMoney(res.reserved_units, res.currency)} — ${res.status}`);
      setDebitForm((f) => ({ ...f, reservation_id: res.reservation_id, amount: res.reserved_units }));
      setActiveReservation(res.reservation_id);
      setReservationLookup(res.reservation_id);
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Reservation failed"),
  });

  const debit = useMutation({
    mutationFn: () =>
      api.post("rating", "/v1/prepaid/debit", {
        reservation_id: debitForm.reservation_id,
        amount: debitForm.amount,
        evidence_id: debitForm.evidence_id || undefined,
      }),
    onSuccess: () => {
      toast.success("Debited — unused reservation released");
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Debit failed"),
  });

  const ratePostpaid = useMutation({
    mutationFn: () =>
      api.post<RatedCharge>("rating", "/v1/postpaid/rate", {
        ...postpaidForm,
        usage_occurred_at: nowIso(),
      }),
    onSuccess: (charge) => {
      setLastCharge(charge);
      toast.success(`Rated ${formatMoney(charge.amount_minor_units, charge.currency)}`);
    },
    onError: fail("Postpaid rating failed"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const rated = ratedQ.data ?? [];
  const suspense = suspenseQ.data ?? [];
  const normalised = normalisedQ.data?.rows ?? [];
  const balance = balanceQ.data;

  const ratedTotals = rated.reduce<Record<string, { charge: number; tax: number }>>((acc, r) => {
    const cur = (acc[r.currency_code] ??= { charge: 0, tax: 0 });
    cur.charge += r.charge_amount_minor_units;
    cur.tax += r.tax_amount_minor_units;
    return acc;
  }, {});
  const ratedCurrencies = Object.keys(ratedTotals);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Usage &amp; Charging
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            CDR mediation and the charging engines. Raw usage is immutable — bad records go to suspense, never deletion.
          </p>
        </div>
        {tab === "normalised" && (
          <button
            onClick={() => setIngestOpen(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Ingest CDR
          </button>
        )}
        {tab === "prepaid" && (
          <button
            onClick={() => setAccountOpen(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Balance Account
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={tab === "normalised"} onClick={() => setTab("normalised")} label="Mediation" />
        <SubTab active={tab === "rated"} onClick={() => setTab("rated")} label="Rated Usage" />
        <SubTab active={tab === "suspense"} onClick={() => setTab("suspense")} label="Suspense" />
        <SubTab active={tab === "prepaid"} onClick={() => setTab("prepaid")} label="Prepaid (OCS)" />
        <SubTab active={tab === "postpaid"} onClick={() => setTab("postpaid")} label="Postpaid Rating" />
      </div>

      {/* ─── Mediation ────────────────────────────────────────────────────── */}
      {tab === "normalised" && (
        <>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
            <SummaryTile label="NORMALISED RECORDS" value={normalisedQ.isLoading ? "…" : String(normalised.length)} hint="This page" />
            <SummaryTile label="TOTAL IN PIPELINE" value={normalisedQ.isLoading ? "…" : String(normalisedQ.data?.page?.total ?? normalised.length)} />
            <SummaryTile
              label="AWAITING RATING"
              value={normalisedQ.isLoading ? "…" : String(normalised.filter((n) => n.status === "NORMALISED").length)}
              hint="Status NORMALISED"
            />
          </div>

          <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RECORD</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">QUANTITY</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">WINDOW</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <TableState
                    colSpan={7}
                    loading={normalisedQ.isLoading}
                    error={normalisedQ.error}
                    empty={normalised.length === 0}
                    loadingLabel="Loading normalised usage…"
                    emptyLabel="No normalised usage. Ingest a CDR to put something through the pipeline."
                  />
                  {normalised.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-700">{shortId(n.id)}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-600">{n.subscriber_id}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {n.usage_type}
                        {n.roaming_partner && <div className="text-[10px] text-slate-400">via {n.roaming_partner}</div>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {n.quantity} {n.unit}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-500">
                        {new Date(n.start_at).toLocaleString()}
                        {n.end_at ? ` → ${new Date(n.end_at).toLocaleTimeString()}` : ""}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={n.status} />
                        {n.rated_amount_minor_units != null && (
                          <div className="text-[10px] text-slate-500 font-mono mt-1">
                            {formatMoney(n.rated_amount_minor_units, n.rated_currency_code)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {n.status === "RATED" ? (
                          <span className="text-[10px] text-slate-400">rated</span>
                        ) : (
                          <button
                            onClick={() => setRateFor(n)}
                            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Rate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── Rated ────────────────────────────────────────────────────────── */}
      {tab === "rated" && (
        <>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryTile label="RATED RECORDS" value={ratedQ.isLoading ? "…" : String(rated.length)} />
            <SummaryTile label="BILLABLE" value={ratedQ.isLoading ? "…" : String(rated.filter((r) => r.is_billable).length)} />
            <SummaryTile
              label="CHARGES"
              value={ratedCurrencies.length === 0 ? "—" : ratedCurrencies.map((c) => formatMoney(ratedTotals[c].charge, c)).join("  ·  ")}
              hint={ratedCurrencies.length > 1 ? "Per currency — not summed" : undefined}
            />
            <SummaryTile
              label="TAX"
              value={ratedCurrencies.length === 0 ? "—" : ratedCurrencies.map((c) => formatMoney(ratedTotals[c].tax, c)).join("  ·  ")}
            />
          </div>

          <div className="self-stretch flex flex-wrap gap-2">
            <select className={`${inputClass} w-auto`} value={usageTypeFilter} onChange={(e) => setUsageTypeFilter(e.target.value)}>
              <option value="">All usage types</option>
              {USAGE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              className={`${inputClass} w-auto`}
              value={billableFilter}
              onChange={(e) => setBillableFilter(e.target.value as "" | "true" | "false")}
            >
              <option value="">Billable: either</option>
              <option value="true">Billable only</option>
              <option value="false">Non-billable only</option>
            </select>
          </div>

          <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RATED</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">QTY × RATE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CHARGE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TAX</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">BILLABLE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <TableState
                    colSpan={7}
                    loading={ratedQ.isLoading}
                    error={ratedQ.error}
                    empty={rated.length === 0}
                    loadingLabel="Loading rated usage…"
                    emptyLabel="No rated usage matches this filter."
                  />
                  {rated.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-slate-700">{shortId(r.id)}</div>
                        <div className="text-[10px] text-slate-400 font-mono">from {shortId(r.normalised_id)}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {r.usage_type}
                        {r.charge_code && <div className="text-[10px] text-slate-400 font-mono">{r.charge_code}</div>}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {r.quantity_rated} × {r.rate_per_unit}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                        {formatMoney(r.charge_amount_minor_units, r.currency_code)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {formatMoney(r.tax_amount_minor_units, r.currency_code)}
                        <div className="text-[10px] text-slate-400">{(r.tax_rate_bps / 100).toFixed(2)}%</div>
                      </td>
                      <td className="px-6 py-4">
                        {r.is_billable ? (
                          <StatusPill status="BILLABLE" />
                        ) : (
                          <>
                            <StatusPill status="EXCLUDED" />
                            {r.non_billable_reason && (
                              <div className="text-[10px] text-slate-400 mt-1 whitespace-normal max-w-[160px]">
                                {r.non_billable_reason}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(r.rated_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── Suspense ─────────────────────────────────────────────────────── */}
      {tab === "suspense" && (
        <>
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
            <SummaryTile label="IN SUSPENSE" value={suspenseQ.isLoading ? "…" : String(suspense.length)} hint="Failed mediation" />
            <SummaryTile
              label="RETRIED"
              value={suspenseQ.isLoading ? "…" : String(suspense.filter((s) => s.retry_count > 0).length)}
              hint="At least one automated attempt"
            />
            <SummaryTile
              label="UNRESOLVED SUBSCRIBER"
              value={suspenseQ.isLoading ? "…" : String(suspense.filter((s) => !s.subscriber_id).length)}
              hint="Unknown IMSI"
            />
          </div>

          <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ENTRY</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CODE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RETRIES</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUSPENDED</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <TableState
                    colSpan={7}
                    loading={suspenseQ.isLoading}
                    error={suspenseQ.error}
                    empty={suspense.length === 0}
                    loadingLabel="Loading the suspense queue…"
                    emptyLabel="Suspense queue is clear — every CDR mediated cleanly."
                  />
                  {suspense.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-700">{shortId(s.id)}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                        {s.subscriber_id ?? <span className="text-amber-600">unresolved</span>}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={s.suspense_code} />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 whitespace-normal max-w-[280px]">{s.suspense_reason}</td>
                      <td className="px-6 py-4 font-mono text-xs">{s.retry_count}</td>
                      <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(s.suspended_at).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => setReviewFor(s)}
                            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setWriteOffFor(s)}
                            className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Write off
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── Prepaid (OCS) ────────────────────────────────────────────────── */}
      {tab === "prepaid" && (
        <div className="self-stretch flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[260px]">
              <Field
                label="Subscriber ID"
                hint="Prepaid balances are per-subscriber; the service has no list endpoint to scan."
              >
                <input
                  className={inputMonoClass}
                  value={subscriberLookup}
                  onChange={(e) => setSubscriberLookup(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setActiveSubscriber(subscriberLookup.trim())}
                  placeholder="sub00001-0000-4000-8000-000000000001"
                />
              </Field>
            </div>
            <button
              onClick={() => setActiveSubscriber(subscriberLookup.trim())}
              disabled={!subscriberLookup.trim()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Look up balance
            </button>
          </div>

          {activeSubscriber && (
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryTile
                label="BALANCE"
                value={balanceQ.isLoading ? "…" : balance ? formatMoney(balance.balance_minor_units, balance.currency) : "—"}
              />
              <SummaryTile
                label="RESERVED"
                value={balanceQ.isLoading ? "…" : balance ? formatMoney(balance.reserved_minor_units, balance.currency) : "—"}
                hint="Held by open reservations"
              />
              <SummaryTile
                label="AVAILABLE"
                value={
                  balanceQ.isLoading
                    ? "…"
                    : balance
                      ? formatMoney(balance.balance_minor_units - balance.reserved_minor_units, balance.currency)
                      : "—"
                }
                hint="Balance − reserved"
              />
              <SummaryTile label="STATUS" value={balanceQ.isLoading ? "…" : (balance?.status ?? "no account")} />
            </div>
          )}

          {activeSubscriber && !balanceQ.isLoading && !balance && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-xs text-amber-800">
              No prepaid balance account for <span className="font-mono">{activeSubscriber}</span>. Open one before reserving.
            </div>
          )}
          {balanceQ.isError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 text-xs text-rose-700">
              {errMessage(balanceQ.error, "Could not read the balance account.")}
            </div>
          )}

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Reserve */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <div className="text-slate-800 text-sm font-bold">Reserve funds</div>
              <p className="text-[11px] text-slate-500">
                Holds an amount against the balance. Unused reservations are released on debit, or expire on the OCS timeout.
              </p>
              <Field label="Subscriber ID">
                <input
                  className={inputMonoClass}
                  value={reserveForm.subscriber_id}
                  onChange={(e) => setReserveForm({ ...reserveForm, subscriber_id: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (minor)">
                  <input
                    type="number"
                    className={inputMonoClass}
                    value={reserveForm.amount}
                    onChange={(e) => setReserveForm({ ...reserveForm, amount: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Currency">
                  <input
                    className={inputMonoClass}
                    maxLength={3}
                    value={reserveForm.currency_code}
                    onChange={(e) => setReserveForm({ ...reserveForm, currency_code: e.target.value.toUpperCase() })}
                  />
                </Field>
              </div>
              <button
                onClick={() => reserve.mutate()}
                disabled={reserve.isPending || !reserveForm.subscriber_id || reserveForm.amount <= 0}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer self-start"
              >
                {reserve.isPending ? "Reserving…" : "Reserve"}
              </button>
            </div>

            {/* Debit */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <div className="text-slate-800 text-sm font-bold">Debit a reservation</div>
              <p className="text-[11px] text-slate-500">
                Consumes part or all of a held reservation. Anything unused is released back to the balance.
              </p>
              <Field label="Reservation ID" hint="Auto-filled by the reserve above.">
                <input
                  className={inputMonoClass}
                  value={debitForm.reservation_id}
                  onChange={(e) => setDebitForm({ ...debitForm, reservation_id: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (minor)">
                  <input
                    type="number"
                    className={inputMonoClass}
                    value={debitForm.amount}
                    onChange={(e) => setDebitForm({ ...debitForm, amount: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Evidence ID">
                  <input
                    className={inputMonoClass}
                    value={debitForm.evidence_id}
                    onChange={(e) => setDebitForm({ ...debitForm, evidence_id: e.target.value })}
                  />
                </Field>
              </div>
              <button
                onClick={() => debit.mutate()}
                disabled={debit.isPending || !debitForm.reservation_id || debitForm.amount <= 0}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer self-start"
              >
                {debit.isPending ? "Debiting…" : "Debit"}
              </button>
            </div>
          </div>

          {/* Reservation inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
            <div className="text-slate-800 text-sm font-bold">Inspect a reservation</div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[260px]">
                <Field label="Reservation ID">
                  <input
                    className={inputMonoClass}
                    value={reservationLookup}
                    onChange={(e) => setReservationLookup(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setActiveReservation(reservationLookup.trim())}
                  />
                </Field>
              </div>
              <button
                onClick={() => setActiveReservation(reservationLookup.trim())}
                disabled={!reservationLookup.trim()}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Fetch
              </button>
            </div>
            {activeReservation && reservationQ.data && (
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-[11px] mt-1">
                <dt className="text-slate-400">Status</dt>
                <dd><StatusPill status={reservationQ.data.status} /></dd>
                <dt className="text-slate-400">Reserved</dt>
                <dd className="font-mono text-slate-700">
                  {formatMoney(reservationQ.data.reserved_units, reservationQ.data.currency)}
                </dd>
                <dt className="text-slate-400">Debited</dt>
                <dd className="font-mono text-slate-700">
                  {reservationQ.data.debited_units != null
                    ? formatMoney(reservationQ.data.debited_units, reservationQ.data.currency)
                    : "—"}
                </dd>
                <dt className="text-slate-400">Expires</dt>
                <dd className="font-mono text-slate-700">
                  {reservationQ.data.expires_at ? new Date(reservationQ.data.expires_at).toLocaleString() : "—"}
                </dd>
              </dl>
            )}
            {activeReservation && !reservationQ.isLoading && !reservationQ.data && (
              <p className="text-[11px] text-amber-700">No reservation with that id.</p>
            )}
          </div>
        </div>
      )}

      {/* ─── Postpaid rating ──────────────────────────────────────────────── */}
      {tab === "postpaid" && (
        <div className="self-stretch flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div>
              <div className="text-slate-800 text-sm font-bold">Rate postpaid usage</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Accumulates a rated charge into the account&apos;s open bill cycle. The amount is supplied by the
                caller — this engine accumulates, it does not price.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Subscriber ID">
                <input className={inputMonoClass} value={postpaidForm.subscriber_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, subscriber_id: e.target.value })} />
              </Field>
              <Field label="Account ID">
                <input className={inputMonoClass} value={postpaidForm.account_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, account_id: e.target.value })} />
              </Field>
              <Field label="Customer ID">
                <input className={inputMonoClass} value={postpaidForm.customer_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, customer_id: e.target.value })} />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Normalised usage ID">
                <input className={inputMonoClass} value={postpaidForm.normalised_usage_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, normalised_usage_id: e.target.value })} />
              </Field>
              <Field label="Product ID">
                <input className={inputMonoClass} value={postpaidForm.product_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, product_id: e.target.value })} />
              </Field>
              <Field label="Bill cycle ID">
                <input className={inputMonoClass} value={postpaidForm.bill_cycle_id} onChange={(e) => setPostpaidForm({ ...postpaidForm, bill_cycle_id: e.target.value })} />
              </Field>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Field label="Usage type">
                <select className={inputClass} value={postpaidForm.usage_type} onChange={(e) => setPostpaidForm({ ...postpaidForm, usage_type: e.target.value })}>
                  {USAGE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Quantity">
                <input className={inputMonoClass} value={postpaidForm.quantity} onChange={(e) => setPostpaidForm({ ...postpaidForm, quantity: e.target.value })} />
              </Field>
              <Field label="Unit">
                <select className={inputClass} value={postpaidForm.quantity_unit} onChange={(e) => setPostpaidForm({ ...postpaidForm, quantity_unit: e.target.value })}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Amount (minor)">
                <input type="number" className={inputMonoClass} value={postpaidForm.amount_minor_units} onChange={(e) => setPostpaidForm({ ...postpaidForm, amount_minor_units: Number(e.target.value) })} />
              </Field>
              <Field label="Currency">
                <input className={inputMonoClass} maxLength={3} value={postpaidForm.currency_code} onChange={(e) => setPostpaidForm({ ...postpaidForm, currency_code: e.target.value.toUpperCase() })} />
              </Field>
            </div>

            <button
              onClick={() => ratePostpaid.mutate()}
              disabled={ratePostpaid.isPending || !postpaidForm.subscriber_id || !postpaidForm.account_id || postpaidForm.amount_minor_units <= 0}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer self-start"
            >
              {ratePostpaid.isPending ? "Rating…" : "Rate usage"}
            </button>
          </div>

          {lastCharge && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex justify-between items-start">
                <div className="text-slate-800 text-sm font-bold">Rated charge</div>
                <button onClick={() => setLastCharge(null)} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                  Dismiss
                </button>
              </div>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-[11px] mt-3">
                <dt className="text-slate-400">Charge ID</dt>
                <dd className="font-mono text-slate-700 break-all">{lastCharge.rated_charge_id}</dd>
                <dt className="text-slate-400">Amount</dt>
                <dd className="font-mono font-bold text-slate-800">
                  {formatMoney(lastCharge.amount_minor_units, lastCharge.currency)}
                </dd>
                <dt className="text-slate-400">Usage</dt>
                <dd className="font-mono text-slate-700">
                  {lastCharge.quantity} {lastCharge.unit} · {lastCharge.usage_type}
                </dd>
                <dt className="text-slate-400">Rated at</dt>
                <dd className="font-mono text-slate-700">{new Date(lastCharge.rated_at).toLocaleString()}</dd>
              </dl>
            </div>
          )}
        </div>
      )}

      {/* ─── Ingest CDR ───────────────────────────────────────────────────── */}
      {ingestOpen && (
        <Modal
          title="Ingest a CDR"
          subtitle="Enters the mediation pipeline. Duplicate event ids within 24h are deduplicated, not rejected."
          onClose={() => setIngestOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setIngestOpen(false)}
              onConfirm={() => ingest.mutate()}
              confirmLabel="Ingest"
              pendingLabel="Ingesting…"
              pending={ingest.isPending}
              disabled={!ingestForm.subscriber_id || ingestForm.quantity <= 0}
            />
          }
        >
          <Field label="Network element">
            <input className={inputMonoClass} value={ingestForm.network_element} onChange={(e) => setIngestForm({ ...ingestForm, network_element: e.target.value })} />
          </Field>
          <Field label="Subscriber ID">
            <input className={inputMonoClass} value={ingestForm.subscriber_id} onChange={(e) => setIngestForm({ ...ingestForm, subscriber_id: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Usage type">
              <select className={inputClass} value={ingestForm.usage_type} onChange={(e) => setIngestForm({ ...ingestForm, usage_type: e.target.value })}>
                {USAGE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Quantity">
              <input type="number" className={inputMonoClass} value={ingestForm.quantity} onChange={(e) => setIngestForm({ ...ingestForm, quantity: Number(e.target.value) })} />
            </Field>
            <Field label="Unit">
              <select className={inputClass} value={ingestForm.unit} onChange={(e) => setIngestForm({ ...ingestForm, unit: e.target.value })}>
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </Field>
          </div>
          <p className="text-[10px] text-slate-400">
            A CDR whose subscriber cannot be resolved lands in suspense rather than being dropped.
          </p>
        </Modal>
      )}

      {/* ─── Rate a normalised record ─────────────────────────────────────── */}
      {rateFor && (
        <Modal
          title="Rate this record"
          subtitle={`${rateFor.usage_type} · ${rateFor.quantity} ${rateFor.unit} · subscriber ${shortId(rateFor.subscriber_id)}`}
          width="w-[560px]"
          onClose={() => setRateFor(null)}
          footer={
            <ModalActions
              onCancel={() => setRateFor(null)}
              onConfirm={() => rate.mutate()}
              confirmLabel="Rate record"
              pendingLabel="Rating…"
              pending={rate.isPending}
              disabled={!rateForm.currency_code || (!rateForm.is_billable && !rateForm.non_billable_reason)}
            />
          }
        >
          <p className="text-[11px] text-slate-500 -mt-1">
            The rate and tax are inputs, not lookups: Product Catalogue owns the price and Tax &amp; Jurisdiction owns
            the rate. This engine records what it is told and evidences it.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product ID">
              <input className={inputMonoClass} value={rateForm.product_id} onChange={(e) => setRateForm({ ...rateForm, product_id: e.target.value })} />
            </Field>
            <Field label="Charge code">
              <input className={inputMonoClass} value={rateForm.charge_code} onChange={(e) => setRateForm({ ...rateForm, charge_code: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Rate / unit">
              <input type="number" className={inputMonoClass} value={rateForm.rate_per_unit} onChange={(e) => setRateForm({ ...rateForm, rate_per_unit: Number(e.target.value) })} />
            </Field>
            <Field label="Currency">
              <input className={inputMonoClass} maxLength={3} value={rateForm.currency_code} onChange={(e) => setRateForm({ ...rateForm, currency_code: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Tax category">
              <input className={inputMonoClass} value={rateForm.tax_category} onChange={(e) => setRateForm({ ...rateForm, tax_category: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Tax (bps)">
              <input type="number" className={inputMonoClass} value={rateForm.tax_rate_bps} onChange={(e) => setRateForm({ ...rateForm, tax_rate_bps: Number(e.target.value) })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={rateForm.is_billable}
              onChange={(e) => setRateForm({ ...rateForm, is_billable: e.target.checked })}
            />
            Billable
          </label>
          {!rateForm.is_billable && (
            <Field label="Non-billable reason" hint="Required — a zero charge must say why.">
              <input className={inputClass} value={rateForm.non_billable_reason} onChange={(e) => setRateForm({ ...rateForm, non_billable_reason: e.target.value })} />
            </Field>
          )}
          <p className="text-[11px] text-slate-500">
            Estimated charge:{" "}
            <strong className="font-mono">
              {formatMoney(Math.round(rateForm.rate_per_unit * rateFor.quantity), rateForm.currency_code)}
            </strong>
            <span className="text-slate-400"> — the backend computes the authoritative figure.</span>
          </p>
        </Modal>
      )}

      {/* ─── Open balance account ─────────────────────────────────────────── */}
      {accountOpen && (
        <Modal
          title="Open a prepaid balance account"
          subtitle="Every id must be a valid UUID — the columns are UUID NOT NULL and a blank comes back as a 400."
          onClose={() => setAccountOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setAccountOpen(false)}
              onConfirm={() => createAccount.mutate()}
              confirmLabel="Open account"
              pendingLabel="Opening…"
              pending={createAccount.isPending}
              disabled={!accountForm.subscriber_id || !accountForm.account_id || !accountForm.customer_id}
            />
          }
        >
          <Field label="Subscriber ID">
            <input className={inputMonoClass} value={accountForm.subscriber_id} onChange={(e) => setAccountForm({ ...accountForm, subscriber_id: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account ID">
              <input className={inputMonoClass} value={accountForm.account_id} onChange={(e) => setAccountForm({ ...accountForm, account_id: e.target.value })} />
            </Field>
            <Field label="Customer ID">
              <input className={inputMonoClass} value={accountForm.customer_id} onChange={(e) => setAccountForm({ ...accountForm, customer_id: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Brand ID" hint="Optional.">
              <input className={inputMonoClass} value={accountForm.brand_id} onChange={(e) => setAccountForm({ ...accountForm, brand_id: e.target.value })} />
            </Field>
            <Field label="Currency">
              <input className={inputMonoClass} maxLength={3} value={accountForm.currency_code} onChange={(e) => setAccountForm({ ...accountForm, currency_code: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Initial balance (minor)">
              <input type="number" className={inputMonoClass} value={accountForm.initial_balance} onChange={(e) => setAccountForm({ ...accountForm, initial_balance: Number(e.target.value) })} />
            </Field>
          </div>
        </Modal>
      )}

      {/* ─── Suspense: assign ─────────────────────────────────────────────── */}
      {reviewFor && (
        <Modal
          title="Assign for review"
          subtitle={`${reviewFor.suspense_code} · ${reviewFor.suspense_reason}`}
          onClose={() => setReviewFor(null)}
          footer={
            <ModalActions
              onCancel={() => setReviewFor(null)}
              onConfirm={() => review.mutate()}
              confirmLabel="Assign"
              pendingLabel="Assigning…"
              pending={review.isPending}
              disabled={!assignedTo.trim()}
            />
          }
        >
          <Field label="Assign to">
            <input className={inputClass} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="billing.ops@zoikogroup.com" />
          </Field>
        </Modal>
      )}

      {/* ─── Suspense: write off ──────────────────────────────────────────── */}
      {writeOffFor && (
        <Modal
          title="Write off this record"
          subtitle="Records that the CDR will not be recycled. Raw usage is immutable — nothing is deleted."
          onClose={() => setWriteOffFor(null)}
          footer={
            <ModalActions
              onCancel={() => setWriteOffFor(null)}
              onConfirm={() => writeOff.mutate()}
              confirmLabel="Write off"
              pendingLabel="Writing off…"
              pending={writeOff.isPending}
              disabled={!writeOffNotes.trim()}
              destructive
            />
          }
        >
          <Field label="Notes" hint="Required — a write-off must record why the revenue was abandoned.">
            <input className={inputClass} value={writeOffNotes} onChange={(e) => setWriteOffNotes(e.target.value)} />
          </Field>
        </Modal>
      )}
    </div>
  );
}
