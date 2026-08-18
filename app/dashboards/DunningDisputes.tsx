"use client";

/**
 * Dunning, Collections & Disputes console — dunning-collections-disputes (8095).
 *
 * What happens after an invoice goes unpaid, and what happens when the customer
 * says the invoice is wrong. The two are linked: a dispute can be raised against
 * a dunning case, and an open dispute is the usual reason to stop escalating.
 *
 * The dunning ladder is strict and one-directional:
 *
 *   PENDING → GRACE_PERIOD → WARNING → FINAL_NOTICE → RESTRICTED → SUSPENDED
 *           → COLLECTIONS → WRITTEN_OFF
 *
 * RESOLVE is available at every rung, because payment can land at any moment.
 * Rungs cannot be skipped — the backend rejects it — so the console never
 * offers a jump. That matters commercially as much as technically: suspending a
 * subscriber who never received a warning is the kind of thing that ends up in
 * front of a regulator.
 *
 * RESTRICT and SUSPEND are styled destructive because they degrade live service
 * for a real person, not because they are hard to undo.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { BILLING_DISPUTE_TRANSITIONS, DUNNING_CASE_TRANSITIONS } from "@/lib/admin/transitions";
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

interface DunningCase {
  id: string;
  invoice_id: string;
  customer_id: string;
  account_id: string;
  overdue_amount_minor_units: number;
  currency_code: string;
  status: string;
  retry_count: number;
  last_retry_at?: string;
  grace_period_ends_at?: string;
  restricted_at?: string;
  suspended_at?: string;
  collections_ref?: string;
  resolved_at?: string;
  resolution_reason?: string;
  created_at: string;
}

interface Dispute {
  id: string;
  invoice_id: string;
  customer_id: string;
  dunning_case_id?: string;
  dispute_reason: string;
  description?: string;
  status: string;
  disputed_amount_minor_units: number;
  adjusted_amount_minor_units?: number;
  currency_code: string;
  resolved_at?: string;
  closed_at?: string;
  created_at: string;
}

interface EvidenceItem {
  id?: string;
  evidence_id?: string;
  evidence_type?: string;
  evidence_ref?: string;
  description?: string;
  created_at?: string;
}

const DISPUTE_REASONS = ["INCORRECT_AMOUNT", "SERVICE_NOT_RECEIVED", "DUPLICATE_CHARGE", "UNAUTHORISED", "TAX_INCORRECT", "PLAN_MISMATCH"];
const EVIDENCE_TYPES = ["CUSTOMER_STATEMENT", "USAGE_RECORD", "CONTRACT", "CORRESPONDENCE", "PAYMENT_PROOF", "OTHER"];

export default function DunningDisputes() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"dunning" | "disputes">("dunning");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const [caseOpen, setCaseOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [caseAction, setCaseAction] = useState<{ item: DunningCase; action: string } | null>(null);
  const [disputeAction, setDisputeAction] = useState<{ item: Dispute; action: string } | null>(null);
  const [evidenceFor, setEvidenceFor] = useState<Dispute | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refresh = () => qc.invalidateQueries({ queryKey: ["dunning"] });

  // ─── Queries ────────────────────────────────────────────────────────────────

  const casesQ = useQuery({
    queryKey: ["dunning", "cases", statusFilter],
    queryFn: async () =>
      listOf<DunningCase>(
        await api.get("dunning", `/v1/dunning-cases?limit=100${statusFilter ? `&status=${statusFilter}` : ""}`),
        ENVELOPE.dunningCases,
      ),
  });
  const cases = casesQ.data ?? [];

  const disputesQ = useQuery({
    queryKey: ["dunning", "disputes"],
    queryFn: async () => listOf<Dispute>(await api.get("dunning", "/v1/disputes?limit=100"), ENVELOPE.disputes),
  });
  const disputes = disputesQ.data ?? [];

  const evidenceQ = useQuery({
    queryKey: ["dunning", "evidence", evidenceFor?.id],
    enabled: !!evidenceFor,
    queryFn: async () =>
      listOf<EvidenceItem>(await api.get("dunning", `/v1/disputes/${evidenceFor!.id}/evidence`), ENVELOPE.evidenceItems),
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [caseForm, setCaseForm] = useState({
    invoice_id: "",
    customer_id: "",
    account_id: "",
    jurisdiction_code: "GB",
    overdue_amount_minor_units: 0,
    currency_code: "GBP",
  });
  const [disputeForm, setDisputeForm] = useState({
    invoice_id: "",
    customer_id: "",
    dunning_case_id: "",
    dispute_reason: DISPUTE_REASONS[0],
    description: "",
    disputed_amount_minor_units: 0,
    currency_code: "GBP",
  });
  const [evidenceForm, setEvidenceForm] = useState({ evidence_type: EVIDENCE_TYPES[0], evidence_ref: "", description: "" });

  const [collectionsRef, setCollectionsRef] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [journalId, setJournalId] = useState("");
  const [adjusted, setAdjusted] = useState(0);
  const [evidenceId, setEvidenceId] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createCase = useMutation({
    mutationFn: () =>
      api.post("dunning", "/v1/dunning-cases", { ...caseForm, created_by: "console" }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Dunning case opened"); setCaseOpen(false); refresh(); },
    onError: fail("Could not open the dunning case"),
  });

  const createDispute = useMutation({
    mutationFn: () =>
      api.post("dunning", "/v1/disputes", {
        invoice_id: disputeForm.invoice_id,
        customer_id: disputeForm.customer_id,
        // Optional link: a dispute can exist without a dunning case behind it.
        ...(disputeForm.dunning_case_id ? { dunning_case_id: disputeForm.dunning_case_id } : {}),
        dispute_reason: disputeForm.dispute_reason,
        description: disputeForm.description,
        disputed_amount_minor_units: disputeForm.disputed_amount_minor_units,
        currency_code: disputeForm.currency_code,
        created_by: "console",
      }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Dispute raised"); setDisputeOpen(false); refresh(); },
    onError: fail("Could not raise the dispute"),
  });

  /** Route per rung. Only three of the nine carry a body beyond updated_by. */
  const caseTransition = useMutation({
    mutationFn: ({ item, action }: { item: DunningCase; action: string }) => {
      const base = `/v1/dunning-cases/${item.id}`;
      const idem = { idempotencyKey: api.uuid() };
      const by = { updated_by: "console" };
      switch (action) {
        case "GRACE_PERIOD": return api.post("dunning", `${base}/grace-period`, by, idem);
        case "WARNING": return api.post("dunning", `${base}/warning`, by, idem);
        case "FINAL_NOTICE": return api.post("dunning", `${base}/final-notice`, by, idem);
        case "RESTRICT": return api.post("dunning", `${base}/restrict`, by, idem);
        case "SUSPEND": return api.post("dunning", `${base}/suspend`, by, idem);
        case "COLLECTIONS": return api.post("dunning", `${base}/collections`, { collections_ref: collectionsRef, ...by }, idem);
        case "RESOLVE": return api.post("dunning", `${base}/resolve`, { reason, ...by }, idem);
        case "WRITE_OFF": return api.post("dunning", `${base}/write-off`, { write_off_journal_id: journalId, ...by }, idem);
        default: return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Case → ${v.action.replace(/_/g, " ").toLowerCase()}`);
      setCaseAction(null); setCollectionsRef(""); setReason(""); setJournalId("");
      refresh();
    },
    onError: fail("The dunning transition was rejected"),
  });

  const retryPayment = useMutation({
    mutationFn: (id: string) => api.post("dunning", `/v1/dunning-cases/${id}/retry-payment`, { updated_by: "console" }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Payment retry requested"); refresh(); },
    onError: fail("Could not request a payment retry"),
  });

  const disputeTransition = useMutation({
    mutationFn: ({ item, action }: { item: Dispute; action: string }) => {
      const base = `/v1/disputes/${item.id}`;
      const by = { updated_by: "console" };
      switch (action) {
        case "INVESTIGATE": return api.post("dunning", `${base}/investigate`, { assigned_to: assignedTo, ...by });
        case "RESOLVE_IN_FAVOUR": return api.post("dunning", `${base}/resolve-in-favour`, { resolution_notes: notes, evidence_id: evidenceId, ...by });
        case "RESOLVE_AGAINST": return api.post("dunning", `${base}/resolve-against`, { resolution_notes: notes, ...by });
        case "PARTIALLY_ADJUST": return api.post("dunning", `${base}/partially-adjust`, { adjusted_amount_minor_units: adjusted, resolution_notes: notes, ...by });
        case "WRITE_OFF": return api.post("dunning", `${base}/write-off`, { resolution_notes: notes, ...by });
        case "CLOSE": return api.post("dunning", `${base}/close`, by);
        default: return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Dispute ${v.action.replace(/_/g, " ").toLowerCase()}`);
      setDisputeAction(null); setAssignedTo(""); setNotes(""); setAdjusted(0); setEvidenceId("");
      refresh();
    },
    onError: fail("The dispute transition was rejected"),
  });

  const addEvidence = useMutation({
    mutationFn: () => api.post("dunning", `/v1/disputes/${evidenceFor!.id}/evidence`, { ...evidenceForm, created_by: "console" }),
    onSuccess: () => {
      toast.success("Evidence attached");
      setEvidenceForm({ evidence_type: EVIDENCE_TYPES[0], evidence_ref: "", description: "" });
      qc.invalidateQueries({ queryKey: ["dunning", "evidence"] });
    },
    onError: fail("Could not attach the evidence"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const active = cases.filter((c) => c.status !== "RESOLVED" && c.status !== "WRITTEN_OFF");
  const overdueByCurrency = active.reduce<Record<string, number>>((acc, c) => {
    acc[c.currency_code] = (acc[c.currency_code] ?? 0) + c.overdue_amount_minor_units;
    return acc;
  }, {});
  const currencies = Object.keys(overdueByCurrency);
  const serviceAffecting = cases.filter((c) => c.status === "RESTRICTED" || c.status === "SUSPENDED").length;
  const openDisputes = disputes.filter((d) => d.status === "OPEN" || d.status === "INVESTIGATING").length;

  const CASE_NEEDS_INPUT = new Set(["COLLECTIONS", "RESOLVE", "WRITE_OFF"]);
  const DISPUTE_NEEDS_INPUT = new Set(["INVESTIGATE", "RESOLVE_IN_FAVOUR", "RESOLVE_AGAINST", "PARTIALLY_ADJUST", "WRITE_OFF"]);

  /** Disputes attached to a case — an open one is a reason not to escalate. */
  const disputesForCase = (caseId: string) =>
    disputes.filter((d) => d.dunning_case_id === caseId && (d.status === "OPEN" || d.status === "INVESTIGATING"));

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Dunning, Collections &amp; Disputes
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            The unpaid-invoice ladder and the customer&apos;s right to challenge it. Rungs cannot be skipped.
          </p>
        </div>
        <button
          onClick={() => (tab === "disputes" ? setDisputeOpen(true) : setCaseOpen(true))}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {tab === "disputes" ? "+ Raise Dispute" : "+ Dunning Case"}
        </button>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="ACTIVE CASES" value={casesQ.isLoading ? "…" : String(active.length)} hint="Not resolved or written off" />
        <SummaryTile
          label="OVERDUE"
          value={currencies.length === 0 ? "—" : currencies.map((c) => formatMoney(overdueByCurrency[c], c)).join("  ·  ")}
          hint={currencies.length > 1 ? "Per currency — not summed" : "Across active cases"}
        />
        <SummaryTile
          label="SERVICE AFFECTED"
          value={casesQ.isLoading ? "…" : String(serviceAffecting)}
          hint={serviceAffecting > 0 ? "Restricted or suspended" : "None"}
        />
        <SummaryTile label="OPEN DISPUTES" value={disputesQ.isLoading ? "…" : String(openDisputes)} hint={openDisputes > 0 ? "Escalation should pause" : "None"} />
      </div>

      <div className="self-stretch flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
          <SubTab active={tab === "dunning"} onClick={() => setTab("dunning")} label={`Dunning Cases (${cases.length})`} />
          <SubTab active={tab === "disputes"} onClick={() => setTab("disputes")} label={`Disputes (${disputes.length})`} />
        </div>
        {tab === "dunning" && (
          <select className={`${inputClass} w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {["PENDING", "GRACE_PERIOD", "WARNING", "FINAL_NOTICE", "RESTRICTED", "SUSPENDED", "COLLECTIONS", "RESOLVED", "WRITTEN_OFF"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {/* Dunning cases */}
      {tab === "dunning" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CUSTOMER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">OVERDUE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RETRIES</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MILESTONES</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={casesQ.isLoading}
                  error={casesQ.error}
                  empty={cases.length === 0}
                  loadingLabel="Loading dunning cases…"
                  emptyLabel="No dunning cases — nothing is overdue."
                />
                {cases.map((c) => {
                  const blocking = disputesForCase(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/40 transition align-top">
                      <td className="px-6 py-4">
                        <div className="font-mono text-[11px] text-slate-700">{shortId(c.id)}</div>
                        <div className="text-[10px] text-slate-400 font-mono">inv {shortId(c.invoice_id)}</div>
                        <DetailToggle open={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} />
                        {expanded === c.id && (
                          <RecordDetail service="dunning" path={`/v1/dunning-cases/${c.id}`} queryKey={["dunning", "case", c.id]} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                        <div>{shortId(c.customer_id)}</div>
                        <div className="text-slate-400">{shortId(c.account_id)}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                        {formatMoney(c.overdue_amount_minor_units, c.currency_code)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {c.retry_count}
                        {c.last_retry_at && <div className="text-[10px] text-slate-400">{new Date(c.last_retry_at).toLocaleDateString()}</div>}
                      </td>
                      <td className="px-6 py-4 text-[10px] text-slate-500">
                        {c.grace_period_ends_at && <div>grace ends {new Date(c.grace_period_ends_at).toLocaleDateString()}</div>}
                        {c.restricted_at && <div className="text-amber-600">restricted {new Date(c.restricted_at).toLocaleDateString()}</div>}
                        {c.suspended_at && <div className="text-rose-600">suspended {new Date(c.suspended_at).toLocaleDateString()}</div>}
                        {c.collections_ref && <div className="font-mono">{c.collections_ref}</div>}
                        {!c.grace_period_ends_at && !c.restricted_at && !c.suspended_at && !c.collections_ref && "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={c.status} />
                        {blocking.length > 0 && (
                          <div className="text-[10px] text-amber-600 mt-1 whitespace-normal max-w-[140px]">
                            {blocking.length} open dispute — escalation should pause
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 justify-end flex-wrap">
                          {c.status !== "RESOLVED" && c.status !== "WRITTEN_OFF" && (
                            <button
                              onClick={() => retryPayment.mutate(c.id)}
                              disabled={retryPayment.isPending}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[10px] font-bold transition cursor-pointer disabled:opacity-50"
                            >
                              Retry payment
                            </button>
                          )}
                          <TransitionButtons
                            table={DUNNING_CASE_TRANSITIONS}
                            status={c.status}
                            pending={caseTransition.isPending}
                            onAction={(action) =>
                              CASE_NEEDS_INPUT.has(action) ? setCaseAction({ item: c, action }) : caseTransition.mutate({ item: c, action })
                            }
                            className="justify-end"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disputes */}
      {tab === "disputes" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ADJUSTED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RAISED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={disputesQ.isLoading}
                  error={disputesQ.error}
                  empty={disputes.length === 0}
                  loadingLabel="Loading disputes…"
                  emptyLabel="No billing disputes raised."
                />
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(d.id)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">inv {shortId(d.invoice_id)}</div>
                      {d.dunning_case_id && <div className="text-[10px] text-slate-400 font-mono">case {shortId(d.dunning_case_id)}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-normal max-w-[220px]">
                      <div className="font-semibold text-slate-700">{d.dispute_reason}</div>
                      {d.description && <div className="text-[10px] text-slate-500">{d.description}</div>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {formatMoney(d.disputed_amount_minor_units, d.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {d.adjusted_amount_minor_units != null ? formatMoney(d.adjusted_amount_minor_units, d.currency_code) : "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusPill status={d.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        <button
                          onClick={() => setEvidenceFor(d)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Evidence
                        </button>
                        <TransitionButtons
                          table={BILLING_DISPUTE_TRANSITIONS}
                          status={d.status}
                          pending={disputeTransition.isPending}
                          onAction={(action) =>
                            DISPUTE_NEEDS_INPUT.has(action) ? setDisputeAction({ item: d, action }) : disputeTransition.mutate({ item: d, action })
                          }
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

      {/* ─── Modals ───────────────────────────────────────────────────────── */}
      {caseOpen && (
        <Modal
          title="Open a dunning case"
          subtitle="Starts at PENDING. The ladder is walked one rung at a time from there."
          onClose={() => setCaseOpen(false)}
          footer={<ModalActions onCancel={() => setCaseOpen(false)} onConfirm={() => createCase.mutate()} confirmLabel="Open case" pendingLabel="Opening…" pending={createCase.isPending} disabled={!caseForm.invoice_id || !caseForm.customer_id || caseForm.overdue_amount_minor_units <= 0} />}
        >
          <Field label="Invoice ID"><input className={inputMonoClass} value={caseForm.invoice_id} onChange={(e) => setCaseForm({ ...caseForm, invoice_id: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer ID"><input className={inputMonoClass} value={caseForm.customer_id} onChange={(e) => setCaseForm({ ...caseForm, customer_id: e.target.value })} /></Field>
            <Field label="Account ID"><input className={inputMonoClass} value={caseForm.account_id} onChange={(e) => setCaseForm({ ...caseForm, account_id: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Overdue (minor)"><input type="number" className={inputMonoClass} value={caseForm.overdue_amount_minor_units} onChange={(e) => setCaseForm({ ...caseForm, overdue_amount_minor_units: Number(e.target.value) })} /></Field>
            <Field label="Currency"><input className={inputMonoClass} maxLength={3} value={caseForm.currency_code} onChange={(e) => setCaseForm({ ...caseForm, currency_code: e.target.value.toUpperCase() })} /></Field>
            <Field label="Jurisdiction" hint="Drives the notice rules that apply."><input className={inputMonoClass} value={caseForm.jurisdiction_code} onChange={(e) => setCaseForm({ ...caseForm, jurisdiction_code: e.target.value.toUpperCase() })} /></Field>
          </div>
        </Modal>
      )}

      {disputeOpen && (
        <Modal
          title="Raise a billing dispute"
          subtitle="A dispute against an invoice. Linking it to a dunning case pauses escalation in practice."
          width="w-[560px]"
          onClose={() => setDisputeOpen(false)}
          footer={<ModalActions onCancel={() => setDisputeOpen(false)} onConfirm={() => createDispute.mutate()} confirmLabel="Raise dispute" pendingLabel="Raising…" pending={createDispute.isPending} disabled={!disputeForm.invoice_id || !disputeForm.customer_id || disputeForm.disputed_amount_minor_units <= 0} />}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Invoice ID"><input className={inputMonoClass} value={disputeForm.invoice_id} onChange={(e) => setDisputeForm({ ...disputeForm, invoice_id: e.target.value })} /></Field>
            <Field label="Customer ID"><input className={inputMonoClass} value={disputeForm.customer_id} onChange={(e) => setDisputeForm({ ...disputeForm, customer_id: e.target.value })} /></Field>
          </div>
          <Field label="Dunning case" hint="Optional — link if this invoice is already in dunning.">
            <select className={inputClass} value={disputeForm.dunning_case_id} onChange={(e) => setDisputeForm({ ...disputeForm, dunning_case_id: e.target.value })}>
              <option value="">— none —</option>
              {cases.map((c) => <option key={c.id} value={c.id}>{shortId(c.id)} · {c.status} · {formatMoney(c.overdue_amount_minor_units, c.currency_code)}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Reason">
              <select className={inputClass} value={disputeForm.dispute_reason} onChange={(e) => setDisputeForm({ ...disputeForm, dispute_reason: e.target.value })}>
                {DISPUTE_REASONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Disputed (minor)"><input type="number" className={inputMonoClass} value={disputeForm.disputed_amount_minor_units} onChange={(e) => setDisputeForm({ ...disputeForm, disputed_amount_minor_units: Number(e.target.value) })} /></Field>
            <Field label="Currency"><input className={inputMonoClass} maxLength={3} value={disputeForm.currency_code} onChange={(e) => setDisputeForm({ ...disputeForm, currency_code: e.target.value.toUpperCase() })} /></Field>
          </div>
          <Field label="Description"><input className={inputClass} value={disputeForm.description} onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })} /></Field>
        </Modal>
      )}

      {caseAction && (
        <Modal
          title={`${caseAction.action.replace(/_/g, " ").toLowerCase()}`}
          subtitle={`${formatMoney(caseAction.item.overdue_amount_minor_units, caseAction.item.currency_code)} overdue · currently ${caseAction.item.status}`}
          onClose={() => { setCaseAction(null); setCollectionsRef(""); setReason(""); setJournalId(""); }}
          footer={
            <ModalActions
              onCancel={() => { setCaseAction(null); setCollectionsRef(""); setReason(""); setJournalId(""); }}
              onConfirm={() => caseTransition.mutate({ item: caseAction.item, action: caseAction.action })}
              confirmLabel="Confirm"
              pendingLabel="Working…"
              pending={caseTransition.isPending}
              disabled={
                caseAction.action === "COLLECTIONS" ? !collectionsRef.trim()
                  : caseAction.action === "RESOLVE" ? !reason.trim()
                  : !journalId.trim()
              }
              destructive={caseAction.action !== "RESOLVE"}
            />
          }
        >
          {caseAction.action === "COLLECTIONS" && (
            <Field label="Collections reference" hint="The agency case reference.">
              <input className={inputMonoClass} value={collectionsRef} onChange={(e) => setCollectionsRef(e.target.value)} />
            </Field>
          )}
          {caseAction.action === "RESOLVE" && (
            <Field label="Resolution reason" hint="Usually the payment that cleared it.">
              <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Field>
          )}
          {caseAction.action === "WRITE_OFF" && (
            <Field label="Write-off journal ID" hint="The finance-ledger entry recording the loss. Required — a write-off must be booked.">
              <input className={inputMonoClass} value={journalId} onChange={(e) => setJournalId(e.target.value)} />
            </Field>
          )}
        </Modal>
      )}

      {disputeAction && (
        <Modal
          title={`${disputeAction.action.replace(/_/g, " ").toLowerCase()}`}
          subtitle={`${disputeAction.item.dispute_reason} · ${formatMoney(disputeAction.item.disputed_amount_minor_units, disputeAction.item.currency_code)}`}
          onClose={() => { setDisputeAction(null); setAssignedTo(""); setNotes(""); setAdjusted(0); setEvidenceId(""); }}
          footer={
            <ModalActions
              onCancel={() => { setDisputeAction(null); setAssignedTo(""); setNotes(""); setAdjusted(0); setEvidenceId(""); }}
              onConfirm={() => disputeTransition.mutate({ item: disputeAction.item, action: disputeAction.action })}
              confirmLabel="Confirm"
              pendingLabel="Working…"
              pending={disputeTransition.isPending}
              disabled={
                disputeAction.action === "INVESTIGATE" ? !assignedTo.trim()
                  : disputeAction.action === "PARTIALLY_ADJUST" ? (!notes.trim() || adjusted <= 0)
                  : !notes.trim()
              }
              destructive={disputeAction.action === "RESOLVE_AGAINST" || disputeAction.action === "WRITE_OFF"}
            />
          }
        >
          {disputeAction.action === "INVESTIGATE" ? (
            <Field label="Assign to"><input className={inputClass} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} /></Field>
          ) : (
            <>
              <Field label="Resolution notes"><input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
              {disputeAction.action === "PARTIALLY_ADJUST" && (
                <Field
                  label="Adjusted amount (minor)"
                  hint={`Must be less than the disputed ${formatMoney(disputeAction.item.disputed_amount_minor_units, disputeAction.item.currency_code)}.`}
                >
                  <input type="number" className={inputMonoClass} value={adjusted} onChange={(e) => setAdjusted(Number(e.target.value))} />
                </Field>
              )}
              {disputeAction.action === "RESOLVE_IN_FAVOUR" && (
                <Field label="Evidence ID" hint="Optional — the evidence-ledger record supporting the decision.">
                  <input className={inputMonoClass} value={evidenceId} onChange={(e) => setEvidenceId(e.target.value)} />
                </Field>
              )}
            </>
          )}
        </Modal>
      )}

      {evidenceFor && (
        <Modal
          title={`Evidence · ${shortId(evidenceFor.id)}`}
          subtitle="What supports or refutes this dispute."
          width="w-[600px]"
          onClose={() => setEvidenceFor(null)}
          footer={
            <ModalActions
              onCancel={() => setEvidenceFor(null)}
              onConfirm={() => addEvidence.mutate()}
              confirmLabel="Attach evidence"
              pendingLabel="Attaching…"
              pending={addEvidence.isPending}
              disabled={!evidenceForm.evidence_ref.trim()}
            />
          }
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr><th className="px-3 py-2">TYPE</th><th className="px-3 py-2">REFERENCE</th><th className="px-3 py-2">DESCRIPTION</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={3}
                  loading={evidenceQ.isLoading}
                  error={evidenceQ.error}
                  empty={(evidenceQ.data ?? []).length === 0}
                  emptyLabel="No evidence attached yet."
                />
                {(evidenceQ.data ?? []).map((e, i) => (
                  <tr key={e.evidence_id ?? e.id ?? i}>
                    <td className="px-3 py-2 font-mono text-slate-600">{e.evidence_type ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{e.evidence_ref ?? shortId(e.evidence_id ?? e.id)}</td>
                    <td className="px-3 py-2 text-slate-500">{e.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Evidence type">
              <select className={inputClass} value={evidenceForm.evidence_type} onChange={(e) => setEvidenceForm({ ...evidenceForm, evidence_type: e.target.value })}>
                {EVIDENCE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Reference"><input className={inputMonoClass} value={evidenceForm.evidence_ref} onChange={(e) => setEvidenceForm({ ...evidenceForm, evidence_ref: e.target.value })} /></Field>
          </div>
          <Field label="Description"><input className={inputClass} value={evidenceForm.description} onChange={(e) => setEvidenceForm({ ...evidenceForm, description: e.target.value })} /></Field>
        </Modal>
      )}
    </div>
  );
}
