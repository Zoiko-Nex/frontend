"use client";

/**
 * Billing & Invoice console — billing-invoice service (port 8092).
 *
 * The domain's central rule (CLAUDE.md P1-6, ZN-ADR-012) is that an ISSUED
 * invoice is immutable. That shapes this screen more than anything else:
 *
 *   - Line items can only be added while the invoice is a DRAFT. After issuance
 *     the backend returns 422 ErrImmutableAfterIssuance, so the "+ Line" control
 *     disappears rather than offering an action that cannot succeed.
 *   - A wrong amount is corrected with a credit or debit note against the issued
 *     invoice, never by editing it. Those two forms are only reachable from an
 *     ISSUED row for the same reason (ErrInvoiceNotIssued).
 *   - Issuance is one-way. `issue` auto-submits a DRAFT through PENDING_APPROVAL
 *     in a single transaction, and re-issuing is a 422.
 *
 * Amounts are integer minor units end to end. Nothing here does arithmetic on
 * them beyond what formatMoney renders for display.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { BILL_CYCLE_TRANSITIONS, INVOICE_TRANSITIONS } from "@/lib/admin/transitions";
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

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  account_id: string;
  customer_id: string;
  currency_code: string;
  subtotal_minor_units: number;
  tax_amount_minor_units: number;
  total_minor_units: number;
  issue_date?: string;
  due_date?: string;
  issued_at?: string;
  language_code?: string;
}

interface BillCycle {
  id: string;
  status: string;
  cycle_type: string;
  jurisdiction_code: string;
  start_at: string;
  end_at: string;
}

interface CorrectionNote {
  id: string;
  note_number: string;
  invoice_id: string;
  status: string;
  reason_code: string;
  reason_description?: string;
  amount_minor_units: number;
  currency_code: string;
  issued_at: string;
}

/** GET /v1/invoices/{id} returns the invoice AND its line items, unlike the list. */
interface InvoiceDetail {
  invoice: Invoice;
  line_items?: LineItem[];
}

interface LineItem {
  id: string;
  product_id: string;
  description: string;
  quantity: number;
  quantity_unit: string;
  line_amount_minor_units: number;
  tax_amount_minor_units: number;
  total_amount_minor_units: number;
}

const CYCLE_TYPES = ["MONTHLY", "QUARTERLY", "ANNUAL", "CUSTOM"];

/** Reason codes the operator picks from; the backend accepts any non-empty string. */
const NOTE_REASONS = [
  "BILLING_ERROR",
  "SERVICE_CREDIT",
  "GOODWILL",
  "DISPUTE_RESOLUTION",
  "PRICE_CORRECTION",
  "TAX_CORRECTION",
];

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function plusDays(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString().split("T")[0];
}

/** A date input gives "YYYY-MM-DD"; the Go handlers decode time.Time (RFC3339). */
function asRFC3339(date: string): string {
  return new Date(`${date}T00:00:00Z`).toISOString();
}

export default function BillingManagement() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"invoices" | "cycles">("invoices");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const [createCycleOpen, setCreateCycleOpen] = useState(false);
  const [lineItemFor, setLineItemFor] = useState<Invoice | null>(null);
  const [noteFor, setNoteFor] = useState<{ invoice: Invoice; kind: "credit" | "debit" } | null>(null);
  const [cancelFor, setCancelFor] = useState<Invoice | null>(null);
  const [notesFor, setNotesFor] = useState<Invoice | null>(null);

  // ─── Queries ────────────────────────────────────────────────────────────────

  const invoicesQ = useQuery({
    queryKey: ["billing", "invoices"],
    queryFn: async () => listOf<Invoice>(await api.get("billing", "/v1/invoices?limit=100"), ENVELOPE.billing),
  });
  const invoices = invoicesQ.data ?? [];

  const cyclesQ = useQuery({
    queryKey: ["billing", "bill-cycles"],
    queryFn: async () => listOf<BillCycle>(await api.get("billing", "/v1/bill-cycles?limit=100"), ENVELOPE.billing),
  });
  const cycles = cyclesQ.data ?? [];

  // Line items only exist on the single-invoice read, so the expanded row fetches
  // its own. Kept separate from RecordDetail because that renders flat key/values
  // and a line-item table is the whole point of opening a draft.
  const linesQ = useQuery({
    queryKey: ["billing", "invoice-lines", lineItemFor?.id],
    enabled: !!lineItemFor?.id,
    queryFn: () => api.get<InvoiceDetail>("billing", `/v1/invoices/${lineItemFor!.id}`),
  });

  const notesQ = useQuery({
    queryKey: ["billing", "notes", notesFor?.id],
    enabled: !!notesFor?.id,
    queryFn: async () => {
      // Credit and debit notes are separate endpoints; an operator reviewing a
      // correction wants both together, and one failing must not hide the other.
      const [credits, debits] = await Promise.all([
        api
          .get<{ items?: CorrectionNote[] }>("billing", `/v1/invoices/${notesFor!.id}/credit-notes`)
          .then((r) => (r.items ?? []).map((n) => ({ ...n, kind: "CREDIT" as const })))
          .catch(() => []),
        api
          .get<{ items?: CorrectionNote[] }>("billing", `/v1/invoices/${notesFor!.id}/debit-notes`)
          .then((r) => (r.items ?? []).map((n) => ({ ...n, kind: "DEBIT" as const })))
          .catch(() => []),
      ]);
      return [...credits, ...debits];
    },
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [invoiceForm, setInvoiceForm] = useState({
    account_id: "",
    customer_id: "",
    bill_cycle_id: "",
    invoice_number: "",
    currency_code: "GBP",
    issue_date: today(),
    due_date: plusDays(30),
  });

  const [cycleForm, setCycleForm] = useState({
    account_id: "",
    customer_id: "",
    cycle_type: "MONTHLY",
    jurisdiction_code: "GB",
    cycle_start_at: today(),
    cycle_end_at: plusDays(30),
  });

  const [lineForm, setLineForm] = useState({
    product_id: "",
    line_description: "",
    usage_type: "RECURRING",
    quantity: 1,
    quantity_unit: "UNIT",
    unit_amount_minor_units: 0,
    tax_amount_minor_units: 0,
  });

  const [noteForm, setNoteForm] = useState({
    note_number: "",
    reason_code: NOTE_REASONS[0],
    reason_description: "",
    amount_minor_units: 0,
    tax_minor_units: 0,
  });

  const [cancelReason, setCancelReason] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createInvoice = useMutation({
    mutationFn: () =>
      api.post(
        "billing",
        "/v1/invoices",
        {
          account_id: invoiceForm.account_id,
          customer_id: invoiceForm.customer_id,
          // Optional: an invoice may be raised outside a cycle. Sending "" would
          // be stored as an empty FK reference, so the key is dropped instead.
          ...(invoiceForm.bill_cycle_id ? { bill_cycle_id: invoiceForm.bill_cycle_id } : {}),
          ...(invoiceForm.invoice_number ? { invoice_number: invoiceForm.invoice_number } : {}),
          currency_code: invoiceForm.currency_code,
          issue_date: asRFC3339(invoiceForm.issue_date),
          due_date: asRFC3339(invoiceForm.due_date),
        },
        // Mandated on billing mutations (CLAUDE.md §9). A retried create must not
        // raise a second invoice against the same account.
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Draft invoice created — add line items before issuing");
      setCreateInvoiceOpen(false);
      setInvoiceForm((f) => ({ ...f, account_id: "", customer_id: "", invoice_number: "" }));
      qc.invalidateQueries({ queryKey: ["billing", "invoices"] });
    },
    onError: fail("Could not create the invoice"),
  });

  const addLineItem = useMutation({
    mutationFn: () =>
      api.post(
        "billing",
        `/v1/invoices/${lineItemFor!.id}/line-items`,
        {
          product_id: lineForm.product_id,
          line_description: lineForm.line_description,
          usage_type: lineForm.usage_type,
          quantity: lineForm.quantity,
          quantity_unit: lineForm.quantity_unit,
          unit_amount_minor_units: lineForm.unit_amount_minor_units,
          // line and total are derived server-side when omitted:
          // line = unit, total = line + tax. Sending our own arithmetic would be a
          // second source of truth for money.
          tax_amount_minor_units: lineForm.tax_amount_minor_units,
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Line item added");
      setLineForm((f) => ({ ...f, product_id: "", line_description: "", unit_amount_minor_units: 0, tax_amount_minor_units: 0 }));
      qc.invalidateQueries({ queryKey: ["billing", "invoice-lines"] });
      qc.invalidateQueries({ queryKey: ["billing", "invoices"] });
    },
    onError: fail("Could not add the line item"),
  });

  const issueInvoice = useMutation({
    mutationFn: (id: string) =>
      api.post("billing", `/v1/invoices/${id}/issue`, {}, { idempotencyKey: api.uuid() }),
    onSuccess: () => {
      toast.success("Invoice issued — it is now immutable");
      qc.invalidateQueries({ queryKey: ["billing", "invoices"] });
    },
    onError: fail("Could not issue the invoice"),
  });

  const cancelInvoice = useMutation({
    mutationFn: () =>
      api.post(
        "billing",
        `/v1/invoices/${cancelFor!.id}/cancel`,
        { reason: cancelReason },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Invoice cancelled");
      setCancelFor(null);
      setCancelReason("");
      qc.invalidateQueries({ queryKey: ["billing", "invoices"] });
    },
    onError: fail("Could not cancel the invoice"),
  });

  const createNote = useMutation({
    mutationFn: () =>
      api.post(
        "billing",
        `/v1/invoices/${noteFor!.invoice.id}/${noteFor!.kind}-notes`,
        {
          note_number: noteForm.note_number,
          reason_code: noteForm.reason_code,
          reason_description: noteForm.reason_description,
          amount_minor_units: noteForm.amount_minor_units,
          tax_minor_units: noteForm.tax_minor_units,
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success(`${noteFor!.kind === "credit" ? "Credit" : "Debit"} note issued`);
      setNoteFor(null);
      setNoteForm((f) => ({ ...f, note_number: "", reason_description: "", amount_minor_units: 0, tax_minor_units: 0 }));
      qc.invalidateQueries({ queryKey: ["billing", "notes"] });
    },
    onError: fail("Could not issue the note"),
  });

  const createCycle = useMutation({
    mutationFn: () =>
      api.post(
        "billing",
        "/v1/bill-cycles",
        {
          account_id: cycleForm.account_id,
          customer_id: cycleForm.customer_id,
          cycle_type: cycleForm.cycle_type,
          jurisdiction_code: cycleForm.jurisdiction_code,
          cycle_start_at: asRFC3339(cycleForm.cycle_start_at),
          cycle_end_at: asRFC3339(cycleForm.cycle_end_at),
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Bill cycle opened");
      setCreateCycleOpen(false);
      setCycleForm((f) => ({ ...f, account_id: "", customer_id: "" }));
      qc.invalidateQueries({ queryKey: ["billing", "bill-cycles"] });
    },
    onError: fail("Could not open the bill cycle"),
  });

  const closeCycle = useMutation({
    mutationFn: (id: string) =>
      api.post("billing", `/v1/bill-cycles/${id}/close`, {}, { idempotencyKey: api.uuid() }),
    onSuccess: () => {
      toast.success("Bill cycle closed");
      qc.invalidateQueries({ queryKey: ["billing", "bill-cycles"] });
    },
    onError: fail("Could not close the bill cycle"),
  });

  // ─── Derived summary ────────────────────────────────────────────────────────

  // Totals are grouped by currency rather than summed across them. A single
  // "outstanding" figure mixing GBP and USD minor units would be a fiction.
  const issuedByCurrency = invoices
    .filter((i) => i.status === "ISSUED")
    .reduce<Record<string, number>>((acc, i) => {
      acc[i.currency_code] = (acc[i.currency_code] ?? 0) + i.total_minor_units;
      return acc;
    }, {});

  const counts = {
    draft: invoices.filter((i) => i.status === "DRAFT").length,
    issued: invoices.filter((i) => i.status === "ISSUED").length,
    cancelled: invoices.filter((i) => i.status === "CANCELLED").length,
    openCycles: cycles.filter((c) => c.status === "OPEN").length,
  };

  const onInvoiceAction = (invoice: Invoice, action: string) => {
    if (action === "ISSUE") issueInvoice.mutate(invoice.id);
    if (action === "CANCEL") setCancelFor(invoice);
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Billing &amp; Invoice
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Bill cycles, invoice composition and issuance. Issued invoices are immutable — corrections are credit or debit notes.
          </p>
        </div>
        <button
          onClick={() => (subTab === "invoices" ? setCreateInvoiceOpen(true) : setCreateCycleOpen(true))}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {subTab === "invoices" ? "+ Draft Invoice" : "+ Open Bill Cycle"}
        </button>
      </div>

      {/* Summary tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="DRAFT INVOICES" value={String(counts.draft)} hint="Editable" />
        <SummaryTile label="ISSUED" value={String(counts.issued)} hint="Immutable" />
        <SummaryTile label="OPEN BILL CYCLES" value={String(counts.openCycles)} hint="Accumulating" />
        <SummaryTile
          label="ISSUED VALUE"
          value={
            Object.keys(issuedByCurrency).length === 0
              ? "—"
              : Object.entries(issuedByCurrency)
                  .map(([cur, amt]) => formatMoney(amt, cur))
                  .join("  ·  ")
          }
          hint={Object.keys(issuedByCurrency).length > 1 ? "Per currency — not summed" : "Total issued"}
        />
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "invoices"} onClick={() => setSubTab("invoices")} label={`Invoices (${invoices.length})`} />
        <SubTab active={subTab === "cycles"} onClick={() => setSubTab("cycles")} label={`Bill Cycles (${cycles.length})`} />
      </div>

      {/* Invoices */}
      {subTab === "invoices" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">INVOICE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ACCOUNT / CUSTOMER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBTOTAL</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TAX</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TOTAL</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DUE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={8}
                  loading={invoicesQ.isLoading}
                  error={invoicesQ.error}
                  empty={invoices.length === 0}
                  loadingLabel="Loading invoices…"
                  emptyLabel="No invoices raised yet. Draft one to begin a billing run."
                />
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{inv.invoice_number}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{shortId(inv.id)}</div>
                      <DetailToggle
                        open={expanded === `inv:${inv.id}`}
                        onToggle={() => setExpanded(expanded === `inv:${inv.id}` ? null : `inv:${inv.id}`)}
                      />
                      {expanded === `inv:${inv.id}` && (
                        <RecordDetail
                          service="billing"
                          path={`/v1/invoices/${inv.id}`}
                          queryKey={["billing", "invoice", inv.id]}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                      <div>{shortId(inv.account_id)}</div>
                      <div className="text-slate-400">{shortId(inv.customer_id)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {formatMoney(inv.subtotal_minor_units, inv.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {formatMoney(inv.tax_amount_minor_units, inv.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">
                      {formatMoney(inv.total_minor_units, inv.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={inv.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end items-center flex-wrap">
                        {/* Line items are only addable while DRAFT — after issuance the
                            backend rejects with ErrImmutableAfterIssuance. */}
                        {inv.status === "DRAFT" && (
                          <button
                            onClick={() => setLineItemFor(inv)}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            + Line
                          </button>
                        )}
                        {/* Correction notes require an ISSUED invoice (ErrInvoiceNotIssued). */}
                        {inv.status === "ISSUED" && (
                          <>
                            <button
                              onClick={() => setNoteFor({ invoice: inv, kind: "credit" })}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Credit note
                            </button>
                            <button
                              onClick={() => setNoteFor({ invoice: inv, kind: "debit" })}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Debit note
                            </button>
                            <button
                              onClick={() => setNotesFor(inv)}
                              className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                            >
                              Notes
                            </button>
                          </>
                        )}
                        <TransitionButtons
                          table={INVOICE_TRANSITIONS}
                          status={inv.status}
                          pending={issueInvoice.isPending}
                          onAction={(action) => onInvoiceAction(inv, action)}
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

      {/* Bill cycles */}
      {subTab === "cycles" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CYCLE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">WINDOW</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={cyclesQ.isLoading}
                  error={cyclesQ.error}
                  empty={cycles.length === 0}
                  loadingLabel="Loading bill cycles…"
                  emptyLabel="No bill cycles. Open one so postpaid usage has a window to accumulate into."
                />
                {cycles.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(c.id)}</div>
                      <DetailToggle
                        open={expanded === `cyc:${c.id}`}
                        onToggle={() => setExpanded(expanded === `cyc:${c.id}` ? null : `cyc:${c.id}`)}
                      />
                      {expanded === `cyc:${c.id}` && (
                        <RecordDetail
                          service="billing"
                          path={`/v1/bill-cycles/${c.id}`}
                          queryKey={["billing", "bill-cycle", c.id]}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.cycle_type}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{c.jurisdiction_code || "—"}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(c.start_at).toLocaleDateString()} → {new Date(c.end_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <TransitionButtons
                        table={BILL_CYCLE_TRANSITIONS}
                        status={c.status}
                        pending={closeCycle.isPending}
                        onAction={() => closeCycle.mutate(c.id)}
                        className="justify-end"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Create invoice ─────────────────────────────────────────────────── */}
      {createInvoiceOpen && (
        <Modal
          title="Draft a new invoice"
          subtitle="Created in DRAFT. Add line items, then issue — issuance is one-way."
          onClose={() => setCreateInvoiceOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCreateInvoiceOpen(false)}
              onConfirm={() => createInvoice.mutate()}
              confirmLabel="Create draft"
              pendingLabel="Creating…"
              pending={createInvoice.isPending}
              disabled={!invoiceForm.account_id || !invoiceForm.customer_id || !invoiceForm.currency_code}
            />
          }
        >
          <Field label="Account ID">
            <input
              className={inputMonoClass}
              value={invoiceForm.account_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, account_id: e.target.value })}
              placeholder="acc00001-0000-4000-8000-000000000001"
            />
          </Field>
          <Field label="Customer ID">
            <input
              className={inputMonoClass}
              value={invoiceForm.customer_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, customer_id: e.target.value })}
              placeholder="c0570001-0000-4000-8000-000000000001"
            />
          </Field>
          <Field
            label="Bill cycle"
            hint="Optional. Leave unset for an ad-hoc invoice outside a cycle."
          >
            <select
              className={inputClass}
              value={invoiceForm.bill_cycle_id}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, bill_cycle_id: e.target.value })}
            >
              <option value="">— none —</option>
              {cycles
                .filter((c) => c.status === "OPEN")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.cycle_type} · {new Date(c.start_at).toLocaleDateString()} → {new Date(c.end_at).toLocaleDateString()}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Invoice number" hint="Leave blank to let the service generate one.">
            <input
              className={inputMonoClass}
              value={invoiceForm.invoice_number}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
              placeholder="INV-2026-08-0001"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Currency">
              <input
                className={inputMonoClass}
                value={invoiceForm.currency_code}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, currency_code: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </Field>
            <Field label="Issue date">
              <input
                type="date"
                className={inputClass}
                value={invoiceForm.issue_date}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, issue_date: e.target.value })}
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                className={inputClass}
                value={invoiceForm.due_date}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* ─── Line items ─────────────────────────────────────────────────────── */}
      {lineItemFor && (
        <Modal
          title={`Line items · ${lineItemFor.invoice_number}`}
          subtitle="Only a DRAFT invoice accepts line items. Amounts are minor units."
          width="w-[640px]"
          onClose={() => setLineItemFor(null)}
          footer={
            <ModalActions
              onCancel={() => setLineItemFor(null)}
              onConfirm={() => addLineItem.mutate()}
              confirmLabel="Add line item"
              pendingLabel="Adding…"
              pending={addLineItem.isPending}
              disabled={!lineForm.product_id || !lineForm.line_description}
            />
          }
        >
          {/* Existing lines, so the operator can see the invoice building up. */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2">DESCRIPTION</th>
                  <th className="px-3 py-2">QTY</th>
                  <th className="px-3 py-2">LINE</th>
                  <th className="px-3 py-2">TAX</th>
                  <th className="px-3 py-2">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={5}
                  loading={linesQ.isLoading}
                  error={linesQ.error}
                  empty={(linesQ.data?.line_items ?? []).length === 0}
                  loadingLabel="Loading lines…"
                  emptyLabel="No line items yet."
                />
                {(linesQ.data?.line_items ?? []).map((li) => (
                  <tr key={li.id}>
                    <td className="px-3 py-2 text-slate-700">{li.description}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">
                      {li.quantity} {li.quantity_unit}
                    </td>
                    <td className="px-3 py-2 font-mono">{formatMoney(li.line_amount_minor_units, lineItemFor.currency_code)}</td>
                    <td className="px-3 py-2 font-mono">{formatMoney(li.tax_amount_minor_units, lineItemFor.currency_code)}</td>
                    <td className="px-3 py-2 font-mono font-bold text-slate-800">
                      {formatMoney(li.total_amount_minor_units, lineItemFor.currency_code)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Product ID">
              <input
                className={inputMonoClass}
                value={lineForm.product_id}
                onChange={(e) => setLineForm({ ...lineForm, product_id: e.target.value })}
              />
            </Field>
            <Field label="Usage type">
              <select
                className={inputClass}
                value={lineForm.usage_type}
                onChange={(e) => setLineForm({ ...lineForm, usage_type: e.target.value })}
              >
                {["RECURRING", "ONE_OFF", "USAGE", "DISCOUNT"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <input
              className={inputClass}
              value={lineForm.line_description}
              onChange={(e) => setLineForm({ ...lineForm, line_description: e.target.value })}
              placeholder="Unlimited 5G — August 2026"
            />
          </Field>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Quantity">
              <input
                type="number"
                className={inputMonoClass}
                value={lineForm.quantity}
                onChange={(e) => setLineForm({ ...lineForm, quantity: Number(e.target.value) })}
              />
            </Field>
            <Field label="Unit">
              <input
                className={inputMonoClass}
                value={lineForm.quantity_unit}
                onChange={(e) => setLineForm({ ...lineForm, quantity_unit: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label={`Unit amount (${lineItemFor.currency_code} minor)`}>
              <input
                type="number"
                className={inputMonoClass}
                value={lineForm.unit_amount_minor_units}
                onChange={(e) => setLineForm({ ...lineForm, unit_amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Tax (minor)">
              <input
                type="number"
                className={inputMonoClass}
                value={lineForm.tax_amount_minor_units}
                onChange={(e) => setLineForm({ ...lineForm, tax_amount_minor_units: Number(e.target.value) })}
              />
            </Field>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Line and total amounts are derived server-side (line = unit, total = line + tax) so there is one source of truth for the arithmetic.
          </p>
        </Modal>
      )}

      {/* ─── Correction note ────────────────────────────────────────────────── */}
      {noteFor && (
        <Modal
          title={`${noteFor.kind === "credit" ? "Credit" : "Debit"} note · ${noteFor.invoice.invoice_number}`}
          subtitle={
            noteFor.kind === "credit"
              ? "Reduces what the customer owes against an issued invoice."
              : "Increases what the customer owes against an issued invoice."
          }
          onClose={() => setNoteFor(null)}
          footer={
            <ModalActions
              onCancel={() => setNoteFor(null)}
              onConfirm={() => createNote.mutate()}
              confirmLabel={`Issue ${noteFor.kind} note`}
              pendingLabel="Issuing…"
              pending={createNote.isPending}
              disabled={!noteForm.note_number || !noteForm.reason_code || noteForm.amount_minor_units <= 0}
            />
          }
        >
          <Field label="Note number">
            <input
              className={inputMonoClass}
              value={noteForm.note_number}
              onChange={(e) => setNoteForm({ ...noteForm, note_number: e.target.value })}
              placeholder={noteFor.kind === "credit" ? "CN-2026-0001" : "DN-2026-0001"}
            />
          </Field>
          <Field label="Reason code">
            <select
              className={inputClass}
              value={noteForm.reason_code}
              onChange={(e) => setNoteForm({ ...noteForm, reason_code: e.target.value })}
            >
              {NOTE_REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Reason description">
            <input
              className={inputClass}
              value={noteForm.reason_description}
              onChange={(e) => setNoteForm({ ...noteForm, reason_description: e.target.value })}
              placeholder="Double-charged for the August data add-on"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Amount (${noteFor.invoice.currency_code} minor)`}>
              <input
                type="number"
                className={inputMonoClass}
                value={noteForm.amount_minor_units}
                onChange={(e) => setNoteForm({ ...noteForm, amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Tax (minor)">
              <input
                type="number"
                className={inputMonoClass}
                value={noteForm.tax_minor_units}
                onChange={(e) => setNoteForm({ ...noteForm, tax_minor_units: Number(e.target.value) })}
              />
            </Field>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Invoice total is {formatMoney(noteFor.invoice.total_minor_units, noteFor.invoice.currency_code)}.
          </p>
        </Modal>
      )}

      {/* ─── Notes list ─────────────────────────────────────────────────────── */}
      {notesFor && (
        <Modal
          title={`Corrections · ${notesFor.invoice_number}`}
          subtitle="Credit and debit notes raised against this invoice."
          width="w-[600px]"
          onClose={() => setNotesFor(null)}
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2">NOTE</th>
                  <th className="px-3 py-2">KIND</th>
                  <th className="px-3 py-2">REASON</th>
                  <th className="px-3 py-2">AMOUNT</th>
                  <th className="px-3 py-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={5}
                  loading={notesQ.isLoading}
                  error={notesQ.error}
                  empty={(notesQ.data ?? []).length === 0}
                  loadingLabel="Loading notes…"
                  emptyLabel="No corrections raised against this invoice."
                />
                {(notesQ.data ?? []).map((n) => (
                  <tr key={n.id}>
                    <td className="px-3 py-2 font-mono text-slate-700">{n.note_number}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                          n.kind === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {n.kind}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <div>{n.reason_code}</div>
                      {n.reason_description && <div className="text-slate-400">{n.reason_description}</div>}
                    </td>
                    <td className="px-3 py-2 font-mono font-bold text-slate-800">
                      {formatMoney(n.amount_minor_units, n.currency_code)}
                    </td>
                    <td className="px-3 py-2">
                      <StatusPill status={n.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* ─── Cancel invoice ─────────────────────────────────────────────────── */}
      {cancelFor && (
        <Modal
          title={`Cancel ${cancelFor.invoice_number}`}
          subtitle={
            cancelFor.status === "ISSUED"
              ? "This invoice is issued. Cancelling it is a governed correction and is recorded as evidence — it does not delete anything."
              : "Cancelling a draft invoice is final; it cannot be returned to DRAFT."
          }
          onClose={() => setCancelFor(null)}
          footer={
            <ModalActions
              onCancel={() => setCancelFor(null)}
              onConfirm={() => cancelInvoice.mutate()}
              confirmLabel="Cancel invoice"
              pendingLabel="Cancelling…"
              pending={cancelInvoice.isPending}
              disabled={!cancelReason.trim()}
              destructive
            />
          }
        >
          <Field label="Reason" hint="Recorded on the cancellation. Required.">
            <input
              className={inputClass}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Raised against the wrong account"
            />
          </Field>
        </Modal>
      )}

      {/* ─── Open bill cycle ────────────────────────────────────────────────── */}
      {createCycleOpen && (
        <Modal
          title="Open a bill cycle"
          subtitle="Postpaid usage accumulates into an OPEN cycle until it is closed."
          onClose={() => setCreateCycleOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCreateCycleOpen(false)}
              onConfirm={() => createCycle.mutate()}
              confirmLabel="Open cycle"
              pendingLabel="Opening…"
              pending={createCycle.isPending}
              disabled={!cycleForm.account_id || !cycleForm.customer_id}
            />
          }
        >
          <Field label="Account ID">
            <input
              className={inputMonoClass}
              value={cycleForm.account_id}
              onChange={(e) => setCycleForm({ ...cycleForm, account_id: e.target.value })}
            />
          </Field>
          <Field label="Customer ID">
            <input
              className={inputMonoClass}
              value={cycleForm.customer_id}
              onChange={(e) => setCycleForm({ ...cycleForm, customer_id: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cycle type">
              <select
                className={inputClass}
                value={cycleForm.cycle_type}
                onChange={(e) => setCycleForm({ ...cycleForm, cycle_type: e.target.value })}
              >
                {CYCLE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Jurisdiction code">
              <input
                className={inputMonoClass}
                value={cycleForm.jurisdiction_code}
                onChange={(e) => setCycleForm({ ...cycleForm, jurisdiction_code: e.target.value.toUpperCase() })}
                placeholder="GB"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input
                type="date"
                className={inputClass}
                value={cycleForm.cycle_start_at}
                onChange={(e) => setCycleForm({ ...cycleForm, cycle_start_at: e.target.value })}
              />
            </Field>
            <Field label="End">
              <input
                type="date"
                className={inputClass}
                value={cycleForm.cycle_end_at}
                onChange={(e) => setCycleForm({ ...cycleForm, cycle_end_at: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Local presentation helpers ───────────────────────────────────────────────

export function SummaryTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-slate-800 font-mono break-words">{value}</span>
      {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
    </div>
  );
}

export function SubTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
        active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
