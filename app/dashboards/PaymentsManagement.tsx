"use client";

/**
 * Payments console — payments service (port 8096).
 *
 * The screen is organised around the intent state machine rather than around
 * CRUD, because that is what the backend enforces:
 *
 *   CREATED ──authorise──▶ AUTHORISED ──capture──▶ CAPTURED ──settle──▶ SETTLED
 *      │                       │                       │
 *      ├──void──▶ VOIDED ◀─────┤                       └──refund──▶ REFUNDED
 *      └──fail──▶ FAILED ◀─────┘
 *
 * Two consequences worth stating, because both look like UI bugs otherwise:
 *
 *   - Async rails (ACH, DIRECT_DEBIT, MOBILE_MONEY, WIRE) stay CREATED after
 *     `authorise` succeeds. The provider confirms out-of-band via webhook, so
 *     the row does not move on the operator's click. The rail is labelled async
 *     in the table for exactly this reason.
 *   - An intent is immutable once CAPTURED. Refund and settlement are separate
 *     records against it, never an edit — so they are their own forms rather
 *     than lifecycle buttons.
 *
 * PCI boundary: only tokenised method references (`payment_method_token`) are
 * ever sent or shown. Raw card data must never reach this form.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { PAYMENT_TRANSITIONS } from "@/lib/admin/transitions";
import {
  DetailToggle,
  Field,
  Modal,
  ModalActions,
  RecordDetail,
  StatusPill,
  TableState,
  TransitionButtons,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";
import { CurrencySelect, JurisdictionSelect } from "./CodeFields";

interface PaymentIntent {
  payment_intent_id: string;
  status: string;
  payment_rail: string;
  provider_name: string;
  amount_minor_units: number;
  currency_code: string;
  settled_amount_minor_units?: number;
  settled_currency_code?: string;
  invoice_id?: string;
  account_id: string;
  customer_id: string;
  payment_method_token?: string;
  provider_payment_id?: string;
  authorised_at?: string;
  captured_at?: string;
  settled_at?: string;
  failed_at?: string;
  failure_reason?: string;
  version: number;
  created_at: string;
  updated_at: string;
}

interface Refund {
  refund_id: string;
  payment_intent_id: string;
  refund_amount_minor_units: number;
  currency_code: string;
  reason_code: string;
  reason_description?: string;
  status: string;
  requested_at: string;
  completed_at?: string;
}

interface Settlement {
  settlement_id: string;
  payment_intent_id: string;
  provider_name: string;
  settlement_batch_id?: string;
  gross_amount_minor_units: number;
  fee_amount_minor_units: number;
  net_amount_minor_units: number;
  currency_code: string;
  settled_at: string;
}

interface PaymentEvent {
  event_id: string;
  event_type: string;
  from_status?: string;
  to_status?: string;
  event_amount_minor_units?: number;
  currency_code?: string;
  occurred_at: string;
}

interface Dashboard {
  total_created: number;
  total_captured: number;
  total_failed: number;
  processing_rate_pct: number;
}

const RAILS = ["CARD", "ACH", "DIRECT_DEBIT", "MOBILE_MONEY", "WALLET", "WIRE", "MANUAL"];

/** Rails whose outcome arrives by webhook rather than on the API call. */
const ASYNC_RAILS = new Set(["ACH", "DIRECT_DEBIT", "MOBILE_MONEY", "WIRE"]);

const REFUND_REASONS = [
  "CUSTOMER_REQUEST",
  "DUPLICATE_CHARGE",
  "SERVICE_FAILURE",
  "FRAUD",
  "BILLING_ERROR",
  "GOODWILL",
];

const STATUS_FILTERS = ["", "CREATED", "AUTHORISED", "CAPTURED", "SETTLED", "REFUNDED", "VOIDED", "FAILED"];

export default function PaymentsManagement() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"intents" | "refunds" | "settlements">("intents");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [refundFor, setRefundFor] = useState<PaymentIntent | null>(null);
  const [settleFor, setSettleFor] = useState<PaymentIntent | null>(null);
  const [voidFor, setVoidFor] = useState<PaymentIntent | null>(null);
  const [eventsFor, setEventsFor] = useState<PaymentIntent | null>(null);
  /** Selected in the refunds/settlements tabs — both are per-intent endpoints. */
  const [focusIntentId, setFocusIntentId] = useState<string>("");

  // ─── Queries ────────────────────────────────────────────────────────────────

  const dashQ = useQuery({
    queryKey: ["payments", "dashboard"],
    queryFn: () => api.get<Dashboard>("payments", "/v1/payment-intents/dashboard"),
  });

  const intentsQ = useQuery({
    queryKey: ["payments", "intents", statusFilter],
    queryFn: async () =>
      listOf<PaymentIntent>(
        await api.get(
          "payments",
          `/v1/payment-intents?page_size=100${statusFilter ? `&status=${statusFilter}` : ""}`,
        ),
        ENVELOPE.payments,
      ),
  });
  const intents = intentsQ.data ?? [];

  // Refunds and settlements have no tenant-wide list endpoint — both are only
  // reachable per intent. The tab therefore asks the operator to pick one rather
  // than rendering a permanently empty table.
  const focusIntent = intents.find((i) => i.payment_intent_id === focusIntentId);

  const refundsQ = useQuery({
    queryKey: ["payments", "refunds", focusIntentId],
    enabled: !!focusIntentId && subTab === "refunds",
    queryFn: async () =>
      listOf<Refund>(await api.get("payments", `/v1/payment-intents/${focusIntentId}/refunds`), ENVELOPE.payments),
  });

  const settlementsQ = useQuery({
    queryKey: ["payments", "settlements", focusIntentId],
    enabled: !!focusIntentId && subTab === "settlements",
    queryFn: async () =>
      listOf<Settlement>(
        await api.get("payments", `/v1/payment-intents/${focusIntentId}/settlements`),
        ENVELOPE.payments,
      ),
  });

  const eventsQ = useQuery({
    queryKey: ["payments", "events", eventsFor?.payment_intent_id],
    enabled: !!eventsFor,
    queryFn: async () =>
      listOf<PaymentEvent>(
        await api.get("payments", `/v1/payment-intents/${eventsFor!.payment_intent_id}/events`),
        ENVELOPE.payments,
      ),
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [intentForm, setIntentForm] = useState({
    invoice_id: "",
    account_id: "",
    customer_id: "",
    payment_rail: "CARD",
    provider_name: "STRIPE",
    amount_minor_units: 0,
    currency_code: "GBP",
    payment_method_token: "",
    jurisdiction_code: "GB",
  });

  const [refundForm, setRefundForm] = useState({
    refund_amount_minor_units: 0,
    reason_code: REFUND_REASONS[0],
    reason_description: "",
  });

  const [settleForm, setSettleForm] = useState({
    provider_name: "",
    settlement_batch_id: "",
    settlement_file_ref: "",
    gross_amount_minor_units: 0,
    fee_amount_minor_units: 0,
    currency_code: "",
    fx_rate_id: "",
    fx_rate_source: "",
    fx_rate_value: "",
  });

  const [voidReason, setVoidReason] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refreshIntents = () => {
    qc.invalidateQueries({ queryKey: ["payments", "intents"] });
    qc.invalidateQueries({ queryKey: ["payments", "dashboard"] });
  };

  const createIntent = useMutation({
    mutationFn: () =>
      api.post(
        "payments",
        "/v1/payment-intents",
        {
          ...(intentForm.invoice_id ? { invoice_id: intentForm.invoice_id } : {}),
          account_id: intentForm.account_id,
          customer_id: intentForm.customer_id,
          payment_rail: intentForm.payment_rail,
          provider_name: intentForm.provider_name,
          amount_minor_units: intentForm.amount_minor_units,
          currency_code: intentForm.currency_code,
          payment_method_token: intentForm.payment_method_token,
          jurisdiction_code: intentForm.jurisdiction_code,
        },
        // Mandatory here: without it a retried create charges twice.
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Payment intent created");
      setCreateOpen(false);
      setIntentForm((f) => ({ ...f, invoice_id: "", account_id: "", customer_id: "", amount_minor_units: 0, payment_method_token: "" }));
      refreshIntents();
    },
    onError: fail("Could not create the payment intent"),
  });

  const authorise = useMutation({
    mutationFn: (intent: PaymentIntent) =>
      api.post("payments", `/v1/payment-intents/${intent.payment_intent_id}/authorise`, {}, { idempotencyKey: api.uuid() }),
    onSuccess: (_r, intent) => {
      toast.success(
        ASYNC_RAILS.has(intent.payment_rail)
          ? `Authorisation sent on ${intent.payment_rail} — the intent stays CREATED until the provider's webhook confirms`
          : "Payment authorised",
      );
      refreshIntents();
    },
    onError: fail("Could not authorise the payment"),
  });

  const capture = useMutation({
    mutationFn: (id: string) =>
      api.post("payments", `/v1/payment-intents/${id}/capture`, {}, { idempotencyKey: api.uuid() }),
    onSuccess: () => {
      toast.success("Payment captured — the intent is now immutable");
      refreshIntents();
    },
    onError: fail("Could not capture the payment"),
  });

  const voidIntent = useMutation({
    mutationFn: () =>
      api.post(
        "payments",
        `/v1/payment-intents/${voidFor!.payment_intent_id}/void`,
        { reason: voidReason },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Payment voided");
      setVoidFor(null);
      setVoidReason("");
      refreshIntents();
    },
    onError: fail("Could not void the payment"),
  });

  const createRefund = useMutation({
    mutationFn: () =>
      api.post(
        "payments",
        `/v1/payment-intents/${refundFor!.payment_intent_id}/refunds`,
        {
          refund_amount_minor_units: refundForm.refund_amount_minor_units,
          // Currency must match the intent's — a mismatch is a 422, so it is
          // taken from the intent rather than typed.
          currency_code: refundFor!.currency_code,
          reason_code: refundForm.reason_code,
          reason_description: refundForm.reason_description,
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Refund submitted");
      setRefundFor(null);
      setRefundForm((f) => ({ ...f, refund_amount_minor_units: 0, reason_description: "" }));
      qc.invalidateQueries({ queryKey: ["payments", "refunds"] });
      refreshIntents();
    },
    onError: fail("Could not submit the refund"),
  });

  const recordSettlement = useMutation({
    mutationFn: () => {
      const crossCurrency = settleForm.currency_code !== settleFor!.currency_code;
      return api.post(
        "payments",
        `/v1/payment-intents/${settleFor!.payment_intent_id}/settlements`,
        {
          provider_name: settleForm.provider_name,
          settlement_batch_id: settleForm.settlement_batch_id,
          settlement_file_ref: settleForm.settlement_file_ref,
          gross_amount_minor_units: settleForm.gross_amount_minor_units,
          fee_amount_minor_units: settleForm.fee_amount_minor_units,
          currency_code: settleForm.currency_code,
          // The FX snapshot is only meaningful — and only required — when the
          // settlement currency differs from the intent's (ZN-ADR-011 §6).
          ...(crossCurrency
            ? {
                fx_rate_id: settleForm.fx_rate_id,
                fx_rate_source: settleForm.fx_rate_source,
                fx_rate_value: settleForm.fx_rate_value,
              }
            : {}),
        },
        { idempotencyKey: api.uuid() },
      );
    },
    onSuccess: () => {
      toast.success("Settlement recorded");
      setSettleFor(null);
      qc.invalidateQueries({ queryKey: ["payments", "settlements"] });
      refreshIntents();
    },
    onError: fail("Could not record the settlement"),
  });

  const onIntentAction = (intent: PaymentIntent, action: string) => {
    if (action === "AUTHORISE") authorise.mutate(intent);
    if (action === "CAPTURE") capture.mutate(intent.payment_intent_id);
    if (action === "VOID") setVoidFor(intent);
  };

  const dash = dashQ.data;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Payments &amp; Collections
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Payment intents across rails — authorise, capture, refund and settle. Captured payments are immutable.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          + Payment Intent
        </button>
      </div>

      {/* Dashboard tiles — served by the backend, not counted client-side. */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="CREATED" value={dashQ.isLoading ? "…" : String(dash?.total_created ?? 0)} hint="Awaiting authorisation" />
        <SummaryTile label="CAPTURED" value={dashQ.isLoading ? "…" : String(dash?.total_captured ?? 0)} hint="Funds taken" />
        <SummaryTile label="FAILED" value={dashQ.isLoading ? "…" : String(dash?.total_failed ?? 0)} hint="Declined by the rail" />
        <SummaryTile
          label="PROCESSING RATE"
          value={dashQ.isLoading ? "…" : `${dash?.processing_rate_pct ?? 0}%`}
          hint="Captured ÷ (created + captured + failed)"
        />
      </div>

      {/* Sub tabs + filter */}
      <div className="self-stretch flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
          <SubTab active={subTab === "intents"} onClick={() => setSubTab("intents")} label={`Intents (${intents.length})`} />
          <SubTab active={subTab === "refunds"} onClick={() => setSubTab("refunds")} label="Refunds" />
          <SubTab active={subTab === "settlements"} onClick={() => setSubTab("settlements")} label="Settlements" />
        </div>

        {subTab === "intents" ? (
          <select
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-sky-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s || "all"} value={s}>
                {s || "All statuses"}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-sky-500 min-w-[280px]"
            value={focusIntentId}
            onChange={(e) => setFocusIntentId(e.target.value)}
          >
            <option value="">— select a payment intent —</option>
            {intents.map((i) => (
              <option key={i.payment_intent_id} value={i.payment_intent_id}>
                {shortId(i.payment_intent_id)} · {formatMoney(i.amount_minor_units, i.currency_code)} · {i.status}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Intents */}
      {subTab === "intents" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">INTENT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RAIL / PROVIDER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AMOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ACCOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={intentsQ.isLoading}
                  error={intentsQ.error}
                  empty={intents.length === 0}
                  loadingLabel="Loading payment intents…"
                  emptyLabel={statusFilter ? `No intents in ${statusFilter}.` : "No payment intents yet."}
                />
                {intents.map((pi) => (
                  <tr key={pi.payment_intent_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(pi.payment_intent_id)}</div>
                      {pi.invoice_id && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">inv {shortId(pi.invoice_id)}</div>
                      )}
                      <DetailToggle
                        open={expanded === pi.payment_intent_id}
                        onToggle={() => setExpanded(expanded === pi.payment_intent_id ? null : pi.payment_intent_id)}
                      />
                      {expanded === pi.payment_intent_id && (
                        <RecordDetail
                          service="payments"
                          path={`/v1/payment-intents/${pi.payment_intent_id}`}
                          queryKey={["payments", "intent", pi.payment_intent_id]}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-slate-700">
                        {pi.payment_rail}
                        {ASYNC_RAILS.has(pi.payment_rail) && (
                          <span
                            className="ml-1.5 px-1 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono"
                            title="Outcome confirmed by provider webhook, not on the API call"
                          >
                            async
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{pi.provider_name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">
                      {formatMoney(pi.amount_minor_units, pi.currency_code)}
                      {pi.settled_amount_minor_units != null && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          settled {formatMoney(pi.settled_amount_minor_units, pi.settled_currency_code ?? pi.currency_code)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">{shortId(pi.account_id)}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={pi.status} />
                      {pi.failure_reason && (
                        <div className="text-[10px] text-rose-500 mt-1 max-w-[160px] whitespace-normal">{pi.failure_reason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end items-center flex-wrap">
                        {pi.status === "CAPTURED" && (
                          <>
                            <button
                              onClick={() => {
                                setRefundForm((f) => ({ ...f, refund_amount_minor_units: pi.amount_minor_units }));
                                setRefundFor(pi);
                              }}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Refund
                            </button>
                            <button
                              onClick={() => {
                                setSettleForm((f) => ({
                                  ...f,
                                  provider_name: pi.provider_name,
                                  gross_amount_minor_units: pi.amount_minor_units,
                                  currency_code: pi.currency_code,
                                }));
                                setSettleFor(pi);
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Settle
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setEventsFor(pi)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Events
                        </button>
                        <TransitionButtons
                          table={PAYMENT_TRANSITIONS}
                          status={pi.status}
                          pending={authorise.isPending || capture.isPending}
                          onAction={(action) => onIntentAction(pi, action)}
                          className="justify-end"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refunds */}
      {subTab === "refunds" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          {!focusIntentId ? (
            <PickIntentPrompt what="refunds" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REFUND</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AMOUNT</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REQUESTED</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <TableState
                    colSpan={5}
                    loading={refundsQ.isLoading}
                    error={refundsQ.error}
                    empty={(refundsQ.data ?? []).length === 0}
                    loadingLabel="Loading refunds…"
                    emptyLabel="No refunds against this payment intent."
                  />
                  {(refundsQ.data ?? []).map((r) => (
                    <tr key={r.refund_id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-slate-700">{shortId(r.refund_id)}</div>
                        <DetailToggle open={expanded === r.refund_id} onToggle={() => setExpanded(expanded === r.refund_id ? null : r.refund_id)} />
                        {expanded === r.refund_id && (
                          <RecordDetail service="payments" path={`/v1/refunds/${r.refund_id}`} queryKey={["payments", "refund", r.refund_id]} />
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                        {formatMoney(r.refund_amount_minor_units, r.currency_code)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        <div>{r.reason_code}</div>
                        {r.reason_description && <div className="text-[10px] text-slate-400">{r.reason_description}</div>}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(r.requested_at).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settlements */}
      {subTab === "settlements" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          {!focusIntentId ? (
            <PickIntentPrompt what="settlements" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SETTLEMENT</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PROVIDER / BATCH</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">GROSS</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">FEE</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">NET</th>
                    <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SETTLED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <TableState
                    colSpan={6}
                    loading={settlementsQ.isLoading}
                    error={settlementsQ.error}
                    empty={(settlementsQ.data ?? []).length === 0}
                    loadingLabel="Loading settlements…"
                    emptyLabel="No settlements recorded against this payment intent."
                  />
                  {(settlementsQ.data ?? []).map((s) => (
                    <tr key={s.settlement_id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-slate-700">{shortId(s.settlement_id)}</div>
                        <DetailToggle open={expanded === s.settlement_id} onToggle={() => setExpanded(expanded === s.settlement_id ? null : s.settlement_id)} />
                        {expanded === s.settlement_id && (
                          <RecordDetail service="payments" path={`/v1/settlements/${s.settlement_id}`} queryKey={["payments", "settlement", s.settlement_id]} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-700">{s.provider_name}</div>
                        {s.settlement_batch_id && (
                          <div className="text-[10px] text-slate-400 font-mono">{s.settlement_batch_id}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{formatMoney(s.gross_amount_minor_units, s.currency_code)}</td>
                      <td className="px-6 py-4 font-mono text-xs text-rose-600">
                        −{formatMoney(s.fee_amount_minor_units, s.currency_code)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                        {formatMoney(s.net_amount_minor_units, s.currency_code)}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(s.settled_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── Create intent ──────────────────────────────────────────────────── */}
      {createOpen && (
        <Modal
          title="Create a payment intent"
          subtitle="Opens in CREATED. Authorise, then capture, to take the money."
          onClose={() => setCreateOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCreateOpen(false)}
              onConfirm={() => createIntent.mutate()}
              confirmLabel="Create intent"
              pendingLabel="Creating…"
              pending={createIntent.isPending}
              disabled={
                !intentForm.account_id ||
                !intentForm.customer_id ||
                !intentForm.provider_name ||
                intentForm.amount_minor_units <= 0
              }
            />
          }
        >
          <Field label="Invoice ID" hint="Optional — links the payment to an issued invoice.">
            <input
              className={inputMonoClass}
              value={intentForm.invoice_id}
              onChange={(e) => setIntentForm({ ...intentForm, invoice_id: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account ID">
              <input
                className={inputMonoClass}
                value={intentForm.account_id}
                onChange={(e) => setIntentForm({ ...intentForm, account_id: e.target.value })}
              />
            </Field>
            <Field label="Customer ID">
              <input
                className={inputMonoClass}
                value={intentForm.customer_id}
                onChange={(e) => setIntentForm({ ...intentForm, customer_id: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Payment rail"
              hint={
                ASYNC_RAILS.has(intentForm.payment_rail)
                  ? "Async rail — the intent stays CREATED after authorise until the provider's webhook confirms."
                  : undefined
              }
            >
              <select
                className={inputClass}
                value={intentForm.payment_rail}
                onChange={(e) => setIntentForm({ ...intentForm, payment_rail: e.target.value })}
              >
                {RAILS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Provider">
              <input
                className={inputMonoClass}
                value={intentForm.provider_name}
                onChange={(e) => setIntentForm({ ...intentForm, provider_name: e.target.value.toUpperCase() })}
                placeholder="STRIPE"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Amount (minor units)">
              <input
                type="number"
                className={inputMonoClass}
                value={intentForm.amount_minor_units}
                onChange={(e) => setIntentForm({ ...intentForm, amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Currency">
              <CurrencySelect
                value={intentForm.currency_code}
                onChange={(v) => setIntentForm({ ...intentForm, currency_code: v })}
                className={inputMonoClass}
              />
            </Field>
            <Field label="Jurisdiction">
              <JurisdictionSelect
                value={intentForm.jurisdiction_code}
                onChange={(v) => setIntentForm({ ...intentForm, jurisdiction_code: v })}
                className={inputMonoClass}
              />
            </Field>
          </div>
          <Field
            label="Payment method token"
            hint="Tokenised reference only. Raw card numbers must never be entered here — they are refused at the PCI boundary."
          >
            <input
              className={inputMonoClass}
              value={intentForm.payment_method_token}
              onChange={(e) => setIntentForm({ ...intentForm, payment_method_token: e.target.value })}
              placeholder="pm_visa_4242"
            />
          </Field>
          {intentForm.amount_minor_units > 0 && (
            <p className="text-[11px] text-slate-500">
              Charging <strong className="font-mono">{formatMoney(intentForm.amount_minor_units, intentForm.currency_code)}</strong>
            </p>
          )}
        </Modal>
      )}

      {/* ─── Refund ─────────────────────────────────────────────────────────── */}
      {refundFor && (
        <Modal
          title="Refund a captured payment"
          subtitle={`Intent ${shortId(refundFor.payment_intent_id)} · captured ${formatMoney(refundFor.amount_minor_units, refundFor.currency_code)}`}
          onClose={() => setRefundFor(null)}
          footer={
            <ModalActions
              onCancel={() => setRefundFor(null)}
              onConfirm={() => createRefund.mutate()}
              confirmLabel="Submit refund"
              pendingLabel="Submitting…"
              pending={createRefund.isPending}
              disabled={
                refundForm.refund_amount_minor_units <= 0 ||
                refundForm.refund_amount_minor_units > refundFor.amount_minor_units
              }
              destructive
            />
          }
        >
          <Field
            label={`Refund amount (${refundFor.currency_code} minor units)`}
            hint="Partial refunds are allowed. More than the captured amount is refused with a 422."
          >
            <input
              type="number"
              className={inputMonoClass}
              value={refundForm.refund_amount_minor_units}
              onChange={(e) => setRefundForm({ ...refundForm, refund_amount_minor_units: Number(e.target.value) })}
            />
          </Field>
          <Field label="Reason code">
            <select
              className={inputClass}
              value={refundForm.reason_code}
              onChange={(e) => setRefundForm({ ...refundForm, reason_code: e.target.value })}
            >
              {REFUND_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Reason description">
            <input
              className={inputClass}
              value={refundForm.reason_description}
              onChange={(e) => setRefundForm({ ...refundForm, reason_description: e.target.value })}
            />
          </Field>
          <p className="text-[11px] text-slate-500">
            Refunding <strong className="font-mono">{formatMoney(refundForm.refund_amount_minor_units, refundFor.currency_code)}</strong>
            {refundForm.refund_amount_minor_units < refundFor.amount_minor_units && refundForm.refund_amount_minor_units > 0 && (
              <span className="text-slate-400"> (partial)</span>
            )}
          </p>
        </Modal>
      )}

      {/* ─── Settlement ─────────────────────────────────────────────────────── */}
      {settleFor && (
        <Modal
          title="Record a settlement"
          subtitle={`Intent ${shortId(settleFor.payment_intent_id)} · moves CAPTURED → SETTLED. Net = gross − fee.`}
          width="w-[560px]"
          onClose={() => setSettleFor(null)}
          footer={
            <ModalActions
              onCancel={() => setSettleFor(null)}
              onConfirm={() => recordSettlement.mutate()}
              confirmLabel="Record settlement"
              pendingLabel="Recording…"
              pending={recordSettlement.isPending}
              disabled={
                !settleForm.provider_name ||
                settleForm.gross_amount_minor_units <= 0 ||
                !settleForm.currency_code ||
                // Cross-currency settlement needs the FX snapshot or the backend rejects it.
                (settleForm.currency_code !== settleFor.currency_code &&
                  (!settleForm.fx_rate_id || !settleForm.fx_rate_value))
              }
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Provider">
              <input
                className={inputMonoClass}
                value={settleForm.provider_name}
                onChange={(e) => setSettleForm({ ...settleForm, provider_name: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Batch ID">
              <input
                className={inputMonoClass}
                value={settleForm.settlement_batch_id}
                onChange={(e) => setSettleForm({ ...settleForm, settlement_batch_id: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Settlement file reference">
            <input
              className={inputMonoClass}
              value={settleForm.settlement_file_ref}
              onChange={(e) => setSettleForm({ ...settleForm, settlement_file_ref: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Gross (minor)">
              <input
                type="number"
                className={inputMonoClass}
                value={settleForm.gross_amount_minor_units}
                onChange={(e) => setSettleForm({ ...settleForm, gross_amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Fee (minor)">
              <input
                type="number"
                className={inputMonoClass}
                value={settleForm.fee_amount_minor_units}
                onChange={(e) => setSettleForm({ ...settleForm, fee_amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Currency">
              <CurrencySelect
                value={settleForm.currency_code}
                onChange={(v) => setSettleForm({ ...settleForm, currency_code: v })}
                className={inputMonoClass}
              />
            </Field>
          </div>

          <p className="text-[11px] text-slate-500">
            Net to the merchant:{" "}
            <strong className="font-mono">
              {formatMoney(
                settleForm.gross_amount_minor_units - settleForm.fee_amount_minor_units,
                settleForm.currency_code || settleFor.currency_code,
              )}
            </strong>
            <span className="text-slate-400"> (computed server-side; shown here as a check)</span>
          </p>

          {settleForm.currency_code !== settleFor.currency_code && (
            <div className="border border-amber-200 bg-amber-50/60 rounded-lg p-3 flex flex-col gap-3">
              <p className="text-[11px] text-amber-700 font-semibold">
                Cross-currency settlement ({settleFor.currency_code} → {settleForm.currency_code}). The FX snapshot is
                required (ZN-ADR-011 §6).
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="FX rate ID">
                  <input
                    className={inputMonoClass}
                    value={settleForm.fx_rate_id}
                    onChange={(e) => setSettleForm({ ...settleForm, fx_rate_id: e.target.value })}
                  />
                </Field>
                <Field label="Source">
                  <input
                    className={inputMonoClass}
                    value={settleForm.fx_rate_source}
                    onChange={(e) => setSettleForm({ ...settleForm, fx_rate_source: e.target.value })}
                  />
                </Field>
                <Field label="Rate">
                  <input
                    className={inputMonoClass}
                    value={settleForm.fx_rate_value}
                    onChange={(e) => setSettleForm({ ...settleForm, fx_rate_value: e.target.value })}
                    placeholder="1.2734"
                  />
                </Field>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ─── Void ───────────────────────────────────────────────────────────── */}
      {voidFor && (
        <Modal
          title="Void this payment intent"
          subtitle={`Intent ${shortId(voidFor.payment_intent_id)} · ${formatMoney(voidFor.amount_minor_units, voidFor.currency_code)}. A void releases the authorisation; it cannot be undone.`}
          onClose={() => setVoidFor(null)}
          footer={
            <ModalActions
              onCancel={() => setVoidFor(null)}
              onConfirm={() => voidIntent.mutate()}
              confirmLabel="Void payment"
              pendingLabel="Voiding…"
              pending={voidIntent.isPending}
              disabled={!voidReason.trim()}
              destructive
            />
          }
        >
          <Field label="Reason" hint="Recorded on the payment event log.">
            <input
              className={inputClass}
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="Customer cancelled before fulfilment"
            />
          </Field>
        </Modal>
      )}

      {/* ─── Event log ──────────────────────────────────────────────────────── */}
      {eventsFor && (
        <Modal
          title={`Event log · ${shortId(eventsFor.payment_intent_id)}`}
          subtitle="Append-only. Every state change and provider callback lands here."
          width="w-[620px]"
          onClose={() => setEventsFor(null)}
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2">OCCURRED</th>
                  <th className="px-3 py-2">EVENT</th>
                  <th className="px-3 py-2">TRANSITION</th>
                  <th className="px-3 py-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={4}
                  loading={eventsQ.isLoading}
                  error={eventsQ.error}
                  empty={(eventsQ.data ?? []).length === 0}
                  loadingLabel="Loading events…"
                  emptyLabel="No events recorded."
                />
                {(eventsQ.data ?? []).map((ev) => (
                  <tr key={ev.event_id}>
                    <td className="px-3 py-2 text-slate-500">{new Date(ev.occurred_at).toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{ev.event_type}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">
                      {ev.from_status || ev.to_status ? `${ev.from_status ?? "—"} → ${ev.to_status ?? "—"}` : "—"}
                    </td>
                    <td className="px-3 py-2 font-mono">
                      {ev.event_amount_minor_units
                        ? formatMoney(ev.event_amount_minor_units, ev.currency_code ?? eventsFor.currency_code)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 * Refunds and settlements are only listable per intent — there is no
 * tenant-wide endpoint. Saying so beats rendering an empty table that reads as
 * "this tenant has no refunds".
 */
function PickIntentPrompt({ what }: { what: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-xs text-slate-500">
        Select a payment intent above to see its {what}.
      </p>
      <p className="text-[10px] text-slate-400 mt-1">
        The payments service exposes {what} per intent only — there is no tenant-wide list endpoint.
      </p>
    </div>
  );
}
