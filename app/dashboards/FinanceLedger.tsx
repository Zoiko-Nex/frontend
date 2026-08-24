"use client";

/**
 * Finance Fabric & Ledger console — finance-fabric-ledger service (port 8084).
 *
 * A general ledger has exactly one correction mechanism: you post a reversal.
 * Nothing here offers an edit or a delete, because the service offers neither —
 * journal entries are Class A, append-only (CLAUDE.md §7).
 *
 * Double-entry is enforced server-side: an entry needs at least two lines and
 * total debits must equal total credits, or the post is rejected 422. The form
 * shows the running debit/credit totals and refuses to submit while they differ,
 * so the operator sees the imbalance before the backend tells them about it.
 *
 * Note on ledger lines: `GET /v1/ledger-lines` requires `account_code` — there
 * is no "all lines" query. The tab asks for an account rather than rendering an
 * empty table.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { errMessage, shortId } from "@/lib/admin/envelope";
import {
  DetailToggle,
  Field,
  Modal,
  ModalActions,
  StatusPill,
  TableState,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";
import { CurrencySelect, JurisdictionSelect } from "./CodeFields";

interface LedgerLine {
  ledger_line_id: string;
  journal_entry_id?: string;
  account_code: string;
  account_name: string;
  debit_credit: string;
  amount_minor_units: number;
  currency_code: string;
  tax_category?: string;
  description?: string;
  posted_at: string;
}

interface JournalEntry {
  journal_entry_id: string;
  entry_type: string;
  source_aggregate_type: string;
  source_aggregate_id: string;
  total_debit_minor_units: number;
  total_credit_minor_units: number;
  currency_code: string;
  description?: string;
  reversal_of_entry_id?: string;
  ledger_period: string;
  posted_at: string;
  lines?: LedgerLine[];
}

interface LedgerSummary {
  account_code: string;
  ledger_period?: string;
  total_debit_minor_units: number;
  total_credit_minor_units: number;
  net_minor_units: number;
  lines: LedgerLine[];
  count: number;
}

const ENTRY_TYPES = ["INVOICE", "PAYMENT", "REFUND", "SETTLEMENT", "ADJUSTMENT", "ACCRUAL", "REVERSAL"];
const AGGREGATE_TYPES = ["INVOICE", "PAYMENT_INTENT", "REFUND", "SETTLEMENT", "BILL_CYCLE", "MANUAL"];

/** "2026-08" — the ledger_period the service filters on. */
function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7);
}

type DraftLine = {
  account_code: string;
  account_name: string;
  debit_credit: "D" | "C";
  amount_minor_units: number;
  tax_category: string;
  description: string;
};

const emptyLine = (): DraftLine => ({
  account_code: "",
  account_name: "",
  debit_credit: "D",
  amount_minor_units: 0,
  tax_category: "",
  description: "",
});

export default function FinanceLedger() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"entries" | "account">("entries");
  const [period, setPeriod] = useState(currentPeriod());
  const [expanded, setExpanded] = useState<string | null>(null);

  const [postOpen, setPostOpen] = useState(false);
  const [reverseFor, setReverseFor] = useState<JournalEntry | null>(null);

  // Account enquiry
  const [accountInput, setAccountInput] = useState("");
  const [accountQueryCode, setAccountQueryCode] = useState("");

  // ─── Queries ────────────────────────────────────────────────────────────────

  const entriesQ = useQuery({
    queryKey: ["finance", "journal-entries", period],
    queryFn: async () => {
      const res = await api.get<{ journal_entries?: JournalEntry[]; count?: number }>(
        "finance",
        `/v1/journal-entries?limit=100${period ? `&ledger_period=${encodeURIComponent(period)}` : ""}`,
      );
      return res.journal_entries ?? [];
    },
  });
  const entries = entriesQ.data ?? [];

  const accountQ = useQuery({
    queryKey: ["finance", "ledger-lines", accountQueryCode, period],
    enabled: !!accountQueryCode,
    queryFn: () =>
      api.get<LedgerSummary>(
        "finance",
        `/v1/ledger-lines?account_code=${encodeURIComponent(accountQueryCode)}&limit=200${
          period ? `&ledger_period=${encodeURIComponent(period)}` : ""
        }`,
      ),
  });

  // ─── Post-entry form ────────────────────────────────────────────────────────

  const [entryForm, setEntryForm] = useState({
    entry_type: ENTRY_TYPES[0],
    source_aggregate_type: AGGREGATE_TYPES[0],
    source_aggregate_id: "",
    currency_code: "GBP",
    description: "",
    jurisdiction_code: "GB",
    policy_version_id: "",
    ledger_period: currentPeriod(),
  });
  const [lines, setLines] = useState<DraftLine[]>([
    { ...emptyLine(), debit_credit: "D" },
    { ...emptyLine(), debit_credit: "C" },
  ]);

  const draftDebit = lines.filter((l) => l.debit_credit === "D").reduce((s, l) => s + (l.amount_minor_units || 0), 0);
  const draftCredit = lines.filter((l) => l.debit_credit === "C").reduce((s, l) => s + (l.amount_minor_units || 0), 0);
  const balanced = draftDebit === draftCredit && draftDebit > 0;
  const linesComplete = lines.every((l) => l.account_code && l.amount_minor_units > 0);

  const setLine = (idx: number, patch: Partial<DraftLine>) =>
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

  const resetForm = () => {
    setEntryForm((f) => ({ ...f, source_aggregate_id: "", description: "" }));
    setLines([
      { ...emptyLine(), debit_credit: "D" },
      { ...emptyLine(), debit_credit: "C" },
    ]);
  };

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const postEntry = useMutation({
    mutationFn: () =>
      api.post("finance", "/v1/journal-entries", {
        entry_type: entryForm.entry_type,
        source_aggregate_type: entryForm.source_aggregate_type,
        source_aggregate_id: entryForm.source_aggregate_id,
        currency_code: entryForm.currency_code,
        description: entryForm.description,
        jurisdiction_code: entryForm.jurisdiction_code,
        policy_version_id: entryForm.policy_version_id,
        ledger_period: entryForm.ledger_period,
        lines: lines.map((l) => ({
          account_code: l.account_code,
          account_name: l.account_name,
          debit_credit: l.debit_credit,
          amount_minor_units: l.amount_minor_units,
          currency_code: entryForm.currency_code,
          tax_category: l.tax_category,
          description: l.description,
        })),
      }),
    onSuccess: () => {
      toast.success("Journal entry posted");
      setPostOpen(false);
      resetForm();
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
    onError: fail("Could not post the journal entry"),
  });

  const postReversal = useMutation({
    mutationFn: () => api.post("finance", `/v1/journal-entries/${reverseFor!.journal_entry_id}/reversal`, {}),
    onSuccess: () => {
      toast.success("Reversal posted — the original entry is untouched");
      setReverseFor(null);
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
    onError: fail("Could not post the reversal"),
  });

  // ─── Period summary ─────────────────────────────────────────────────────────

  // Grouped by currency: a ledger can carry several, and summing minor units
  // across them would be meaningless.
  const byCurrency = entries.reduce<Record<string, { debit: number; credit: number }>>((acc, e) => {
    const cur = (acc[e.currency_code] ??= { debit: 0, credit: 0 });
    cur.debit += e.total_debit_minor_units;
    cur.credit += e.total_credit_minor_units;
    return acc;
  }, {});
  const currencies = Object.keys(byCurrency);
  const reversals = entries.filter((e) => e.reversal_of_entry_id).length;

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Finance Fabric &amp; Ledger
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Double-entry general ledger. Entries are append-only — a mistake is corrected by posting a reversal, never an edit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-sky-500"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            title="Ledger period"
          />
          <button
            onClick={() => {
              setEntryForm((f) => ({ ...f, ledger_period: period || currentPeriod() }));
              setPostOpen(true);
            }}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Post Journal Entry
          </button>
        </div>
      </div>

      {/* Period summary */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="ENTRIES IN PERIOD" value={entriesQ.isLoading ? "…" : String(entries.length)} hint={period || "all periods"} />
        <SummaryTile
          label="TOTAL DEBITS"
          value={
            currencies.length === 0
              ? "—"
              : currencies.map((c) => formatMoney(byCurrency[c].debit, c)).join("  ·  ")
          }
          hint={currencies.length > 1 ? "Per currency" : undefined}
        />
        <SummaryTile
          label="TOTAL CREDITS"
          value={
            currencies.length === 0
              ? "—"
              : currencies.map((c) => formatMoney(byCurrency[c].credit, c)).join("  ·  ")
          }
          hint={currencies.length > 1 ? "Per currency" : undefined}
        />
        <SummaryTile
          label="REVERSALS"
          value={String(reversals)}
          hint={reversals > 0 ? "Corrections posted this period" : "No corrections"}
        />
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "entries"} onClick={() => setSubTab("entries")} label={`Journal Entries (${entries.length})`} />
        <SubTab active={subTab === "account"} onClick={() => setSubTab("account")} label="Account Enquiry" />
      </div>

      {/* Journal entries */}
      {subTab === "entries" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ENTRY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SOURCE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DEBIT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CREDIT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">POSTED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={entriesQ.isLoading}
                  error={entriesQ.error}
                  empty={entries.length === 0}
                  loadingLabel="Loading journal entries…"
                  emptyLabel={`No journal entries posted in ${period || "any period"}.`}
                />
                {entries.map((e) => (
                  <tr key={e.journal_entry_id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(e.journal_entry_id)}</div>
                      {e.description && <div className="text-[10px] text-slate-500 mt-0.5">{e.description}</div>}
                      {e.reversal_of_entry_id && (
                        <div className="text-[10px] text-orange-600 font-mono mt-0.5">
                          reverses {shortId(e.reversal_of_entry_id)}
                        </div>
                      )}
                      <DetailToggle
                        open={expanded === e.journal_entry_id}
                        onToggle={() => setExpanded(expanded === e.journal_entry_id ? null : e.journal_entry_id)}
                      />
                      {expanded === e.journal_entry_id && <EntryLines entryId={e.journal_entry_id} />}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={e.entry_type} />
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                      <div className="text-slate-600">{e.source_aggregate_type}</div>
                      <div>{shortId(e.source_aggregate_id)}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-800">
                      {formatMoney(e.total_debit_minor_units, e.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-800">
                      {formatMoney(e.total_credit_minor_units, e.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(e.posted_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {/* A reversal of a reversal is legal but almost always a mistake,
                          so it is not offered from an entry that is already one. */}
                      {e.reversal_of_entry_id ? (
                        <span className="text-[10px] text-slate-400">reversal entry</span>
                      ) : (
                        <button
                          onClick={() => setReverseFor(e)}
                          className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Post reversal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account enquiry */}
      {subTab === "account" && (
        <div className="self-stretch flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[240px]">
              <Field label="Account code" hint="Required — the service has no all-lines query.">
                <input
                  className={inputMonoClass}
                  value={accountInput}
                  onChange={(e) => setAccountInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setAccountQueryCode(accountInput.trim())}
                  placeholder="4000-REVENUE"
                />
              </Field>
            </div>
            <button
              onClick={() => setAccountQueryCode(accountInput.trim())}
              disabled={!accountInput.trim()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Run enquiry
            </button>
          </div>

          {accountQueryCode && (
            <>
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryTile label="ACCOUNT" value={accountQ.data?.account_code ?? accountQueryCode} hint={period || "all periods"} />
                <SummaryTile
                  label="DEBITS"
                  value={accountQ.data ? formatMoney(accountQ.data.total_debit_minor_units, accountQ.data.lines[0]?.currency_code) : "…"}
                />
                <SummaryTile
                  label="CREDITS"
                  value={accountQ.data ? formatMoney(accountQ.data.total_credit_minor_units, accountQ.data.lines[0]?.currency_code) : "…"}
                />
                <SummaryTile
                  label="NET"
                  value={accountQ.data ? formatMoney(accountQ.data.net_minor_units, accountQ.data.lines[0]?.currency_code) : "…"}
                  hint="Debits − credits"
                />
              </div>

              <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                    <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">LINE</th>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ENTRY</th>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">D/C</th>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AMOUNT</th>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TAX CATEGORY</th>
                        <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">POSTED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      <TableState
                        colSpan={6}
                        loading={accountQ.isLoading}
                        error={accountQ.error}
                        empty={(accountQ.data?.lines ?? []).length === 0}
                        loadingLabel="Running enquiry…"
                        emptyLabel={`No ledger lines on ${accountQueryCode}${period ? ` in ${period}` : ""}.`}
                      />
                      {(accountQ.data?.lines ?? []).map((l) => (
                        <tr key={l.ledger_line_id} className="hover:bg-slate-50/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-mono text-[11px] text-slate-700">{shortId(l.ledger_line_id)}</div>
                            {l.description && <div className="text-[10px] text-slate-500">{l.description}</div>}
                          </td>
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{shortId(l.journal_entry_id)}</td>
                          <td className="px-6 py-4">
                            <DebitCreditPill dc={l.debit_credit} />
                          </td>
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                            {formatMoney(l.amount_minor_units, l.currency_code)}
                          </td>
                          <td className="px-6 py-4 text-[11px] text-slate-500">{l.tax_category || "—"}</td>
                          <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(l.posted_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── Post journal entry ─────────────────────────────────────────────── */}
      {postOpen && (
        <Modal
          title="Post a journal entry"
          subtitle="Double-entry: at least two lines, and debits must equal credits."
          width="w-[760px]"
          onClose={() => setPostOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setPostOpen(false)}
              onConfirm={() => postEntry.mutate()}
              confirmLabel="Post entry"
              pendingLabel="Posting…"
              pending={postEntry.isPending}
              disabled={!balanced || !linesComplete || !entryForm.source_aggregate_id || lines.length < 2}
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Entry type">
              <select
                className={inputClass}
                value={entryForm.entry_type}
                onChange={(e) => setEntryForm({ ...entryForm, entry_type: e.target.value })}
              >
                {ENTRY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Source aggregate type">
              <select
                className={inputClass}
                value={entryForm.source_aggregate_type}
                onChange={(e) => setEntryForm({ ...entryForm, source_aggregate_type: e.target.value })}
              >
                {AGGREGATE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Source aggregate ID" hint="What this entry is the accounting consequence of — an invoice id, a payment intent id.">
            <input
              className={inputMonoClass}
              value={entryForm.source_aggregate_id}
              onChange={(e) => setEntryForm({ ...entryForm, source_aggregate_id: e.target.value })}
            />
          </Field>
          <Field label="Description">
            <input
              className={inputClass}
              value={entryForm.description}
              onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })}
              placeholder="Revenue recognition — August postpaid run"
            />
          </Field>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Currency">
              <CurrencySelect
                value={entryForm.currency_code}
                onChange={(v) => setEntryForm({ ...entryForm, currency_code: v })}
                className={inputMonoClass}
              />
            </Field>
            <Field label="Ledger period">
              <input
                type="month"
                className={inputClass}
                value={entryForm.ledger_period}
                onChange={(e) => setEntryForm({ ...entryForm, ledger_period: e.target.value })}
              />
            </Field>
            <Field label="Jurisdiction">
              <JurisdictionSelect
                value={entryForm.jurisdiction_code}
                onChange={(v) => setEntryForm({ ...entryForm, jurisdiction_code: v })}
                className={inputMonoClass}
              />
            </Field>
            <Field label="Policy version">
              <input
                className={inputMonoClass}
                value={entryForm.policy_version_id}
                onChange={(e) => setEntryForm({ ...entryForm, policy_version_id: e.target.value })}
              />
            </Field>
          </div>

          {/* Lines */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 font-semibold">Ledger lines</label>
              <button
                onClick={() => setLines([...lines, emptyLine()])}
                className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[10px] font-bold transition cursor-pointer"
              >
                + Add line
              </button>
            </div>

            {lines.map((l, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className={`${inputMonoClass} col-span-3`}
                  value={l.account_code}
                  onChange={(e) => setLine(idx, { account_code: e.target.value })}
                  placeholder="Account code"
                />
                <input
                  className={`${inputClass} col-span-3`}
                  value={l.account_name}
                  onChange={(e) => setLine(idx, { account_name: e.target.value })}
                  placeholder="Account name"
                />
                <select
                  className={`${inputClass} col-span-2`}
                  value={l.debit_credit}
                  onChange={(e) => setLine(idx, { debit_credit: e.target.value as "D" | "C" })}
                >
                  <option value="D">Debit</option>
                  <option value="C">Credit</option>
                </select>
                <input
                  type="number"
                  className={`${inputMonoClass} col-span-3`}
                  value={l.amount_minor_units}
                  onChange={(e) => setLine(idx, { amount_minor_units: Number(e.target.value) })}
                  placeholder="Minor units"
                />
                <button
                  onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                  disabled={lines.length <= 2}
                  title={lines.length <= 2 ? "An entry needs at least two lines" : "Remove line"}
                  className="col-span-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}

            {/* Balance check — shown before submit so an imbalance is caught here
                rather than coming back as a 422 the operator has to decode. */}
            <div
              className={`flex justify-between items-center px-3 py-2 rounded-lg text-[11px] font-mono ${
                balanced
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              <span>
                Debits {formatMoney(draftDebit, entryForm.currency_code)} · Credits {formatMoney(draftCredit, entryForm.currency_code)}
              </span>
              <span className="font-bold">
                {draftDebit === 0 && draftCredit === 0
                  ? "Enter amounts"
                  : balanced
                    ? "Balanced"
                    : `Out by ${formatMoney(Math.abs(draftDebit - draftCredit), entryForm.currency_code)}`}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Reversal ───────────────────────────────────────────────────────── */}
      {reverseFor && (
        <Modal
          title="Post a reversal"
          subtitle="The original entry stays exactly as posted. A mirror entry with debits and credits swapped is added, so the net effect is nil and both remain auditable."
          onClose={() => setReverseFor(null)}
          footer={
            <ModalActions
              onCancel={() => setReverseFor(null)}
              onConfirm={() => postReversal.mutate()}
              confirmLabel="Post reversal"
              pendingLabel="Posting…"
              pending={postReversal.isPending}
              destructive
            />
          }
        >
          <dl className="grid grid-cols-2 gap-y-2 text-[11px]">
            <dt className="text-slate-400">Entry</dt>
            <dd className="font-mono text-slate-700 break-all">{reverseFor.journal_entry_id}</dd>
            <dt className="text-slate-400">Type</dt>
            <dd className="font-mono text-slate-700">{reverseFor.entry_type}</dd>
            <dt className="text-slate-400">Debits</dt>
            <dd className="font-mono text-slate-700">
              {formatMoney(reverseFor.total_debit_minor_units, reverseFor.currency_code)}
            </dd>
            <dt className="text-slate-400">Credits</dt>
            <dd className="font-mono text-slate-700">
              {formatMoney(reverseFor.total_credit_minor_units, reverseFor.currency_code)}
            </dd>
            <dt className="text-slate-400">Period</dt>
            <dd className="font-mono text-slate-700">{reverseFor.ledger_period}</dd>
          </dl>
        </Modal>
      )}
    </div>
  );
}

// ─── Local components ─────────────────────────────────────────────────────────

function DebitCreditPill({ dc }: { dc: string }) {
  const debit = dc === "D";
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
        debit ? "bg-sky-50 text-sky-700 outline-sky-500/30" : "bg-violet-50 text-violet-700 outline-violet-500/30"
      }`}
    >
      {debit ? "DEBIT" : "CREDIT"}
    </span>
  );
}

/**
 * The list endpoint returns entries without their lines (`lines` is omitempty and
 * ListJournalEntries does not hydrate them), so an expanded row reads the entry
 * back by id to show the double-entry detail.
 */
function EntryLines({ entryId }: { entryId: string }) {
  const q = useQuery({
    queryKey: ["finance", "journal-entry", entryId],
    queryFn: () => api.get<JournalEntry>("finance", `/v1/journal-entries/${entryId}`),
  });

  if (q.isLoading) return <div className="text-[10px] text-slate-400 italic mt-1.5">Loading lines…</div>;
  if (q.isError)
    return <div className="text-[10px] text-rose-600 mt-1.5">{errMessage(q.error, "Could not load the entry.")}</div>;

  const lines = q.data?.lines ?? [];
  if (lines.length === 0) return <div className="text-[10px] text-slate-400 mt-1.5">No lines returned.</div>;

  return (
    <table className="mt-1.5 w-full bg-white rounded border border-slate-200 text-[10px]">
      <tbody className="divide-y divide-slate-100">
        {lines.map((l) => (
          <tr key={l.ledger_line_id}>
            <td className="px-2 py-1 font-mono text-slate-600">{l.account_code}</td>
            <td className="px-2 py-1 text-slate-500">{l.account_name}</td>
            <td className="px-2 py-1">
              <DebitCreditPill dc={l.debit_credit} />
            </td>
            <td className="px-2 py-1 font-mono text-right text-slate-800">
              {formatMoney(l.amount_minor_units, l.currency_code)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
