"use client";

/**
 * Partner Settlement console — partner-settlement service (8086).
 *
 * Wholesale/interconnect economics: what each partner cost us, what we owe or
 * are owed for a period, and what they are disputing.
 *
 * Two rules the screen is built around:
 *
 *   - **A cost line is never edited.** A wrong line is reversed, which writes a
 *     compensating record and leaves the original intact (Class A, CLAUDE.md
 *     §7). The row offers "Reverse", never "Edit".
 *   - **Settlement is a one-way ladder.** OPEN → CLOSED → STATEMENT_GENERATED →
 *     APPROVED → PAYMENT_INITIATED → SETTLED, with DISPUTE available at every
 *     rung before payment. Once SETTLED, money has moved, so the only remaining
 *     move is flagging an adjustment — the run is never reopened.
 *
 * Net settlement is computed by the service, not here. The console shows cost,
 * revenue and net side by side so a wrong sign is visible, but never derives it.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { PARTNER_DISPUTE_TRANSITIONS, SETTLEMENT_RUN_TRANSITIONS } from "@/lib/admin/transitions";
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

interface CostLine {
  id: string;
  partner_id: string;
  partner_name: string;
  settlement_type: string;
  status: string;
  cost_amount_minor_units: number;
  revenue_amount_minor_units?: number;
  share_percentage?: string;
  currency_code: string;
  settlement_period?: string;
  recorded_at: string;
}

interface SettlementRun {
  id: string;
  partner_id: string;
  partner_name: string;
  status: string;
  period_start: string;
  period_end: string;
  total_cost_minor_units: number;
  total_revenue_minor_units: number;
  net_settlement_minor_units: number;
  currency_code: string;
  settlement_currency: string;
  cost_line_count: number;
  statement_ref?: string;
  created_at: string;
}

interface PartnerDispute {
  id: string;
  run_id: string;
  partner_id: string;
  status: string;
  reason: string;
  resolution_notes?: string;
  adjustment_amount_minor_units?: number;
  currency_code?: string;
  opened_at: string;
  resolved_at?: string;
}

const SETTLEMENT_TYPES = ["INTERCONNECT", "ROAMING", "REVENUE_SHARE", "COMMISSION", "WHOLESALE", "MVNA"];

function today(): string {
  return new Date().toISOString().split("T")[0];
}
function monthStart(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString().split("T")[0];
}
function asRFC3339(date: string): string {
  return new Date(`${date}T00:00:00Z`).toISOString();
}

export default function PartnerSettlement() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"runs" | "costs" | "disputes">("runs");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [runOpen, setRunOpen] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [reverseFor, setReverseFor] = useState<CostLine | null>(null);
  /** A run action that needs an operator-supplied field before it can fire. */
  const [runAction, setRunAction] = useState<{ run: SettlementRun; action: string } | null>(null);
  const [disputeAction, setDisputeAction] = useState<{ dispute: PartnerDispute; action: string } | null>(null);
  const [newDisputeFor, setNewDisputeFor] = useState<SettlementRun | null>(null);
  /** Disputes filed against one run — its own endpoint, not a client-side filter. */
  const [runDisputesFor, setRunDisputesFor] = useState<SettlementRun | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refresh = () => qc.invalidateQueries({ queryKey: ["partner"] });

  // ─── Queries ────────────────────────────────────────────────────────────────

  const runsQ = useQuery({
    queryKey: ["partner", "runs"],
    queryFn: async () =>
      listOf<SettlementRun>(await api.get("partner", "/v1/settlement-runs?page_size=100"), ENVELOPE.assurance),
  });
  const runs = runsQ.data ?? [];

  const costsQ = useQuery({
    queryKey: ["partner", "cost-lines"],
    enabled: tab === "costs",
    queryFn: async () =>
      listOf<CostLine>(await api.get("partner", "/v1/partner-cost-lines?page_size=100"), ENVELOPE.assurance),
  });
  const costs = costsQ.data ?? [];

  const disputesQ = useQuery({
    queryKey: ["partner", "disputes"],
    enabled: tab === "disputes",
    queryFn: async () =>
      listOf<PartnerDispute>(await api.get("partner", "/v1/settlement-disputes?page_size=100"), ENVELOPE.assurance),
  });
  const disputes = disputesQ.data ?? [];

  /** Backend-computed counts — not derived from the page above, which is paginated. */
  const runDashQ = useQuery({
    queryKey: ["partner", "runs", "dashboard"],
    queryFn: () => api.get<{ status_counts?: Record<string, number> }>("partner", "/v1/settlement-runs/dashboard"),
  });
  /**
   * Cost totals grouped by settlement type, computed by the service rather than
   * summed from the page. The page is capped at 100 rows, so a client-side sum
   * would silently under-report as soon as a partner exceeds that.
   */
  const sumsQ = useQuery({
    queryKey: ["partner", "sums-by-type"],
    enabled: tab === "costs",
    queryFn: () =>
      api.get<{ sums_by_type?: Record<string, number>; currency_code?: string }>(
        "partner",
        "/v1/partner-cost-lines/sum-by-type",
      ),
  });

  /**
   * Exposure to ONE partner, totalled by the service.
   *
   * sum-by-type answers "what do we owe in total, broken down by kind";
   * this answers "what do we owe THIS partner" — the question asked before a
   * settlement run is approved or a partner is suspended. partner_id is
   * required: the service casts it to uuid and 400s on an empty value rather
   * than quietly totalling everybody.
   */
  const [partnerSumId, setPartnerSumId] = useState("");
  const [partnerSumCurrency, setPartnerSumCurrency] = useState("");
  const [partnerSumFor, setPartnerSumFor] = useState<{ id: string; currency: string } | null>(null);

  const partnerSumQ = useQuery({
    queryKey: ["partner", "sum-by-partner", partnerSumFor?.id, partnerSumFor?.currency],
    enabled: !!partnerSumFor,
    retry: false,
    queryFn: () => {
      const qs = new URLSearchParams({ partner_id: partnerSumFor!.id });
      if (partnerSumFor!.currency) qs.set("currency_code", partnerSumFor!.currency);
      return api.get<{ partner_id?: string; total_minor_units?: number; currency_code?: string }>(
        "partner",
        `/v1/partner-cost-lines/sum-by-partner?${qs}`,
      );
    },
  });

  const disputeDashQ = useQuery({
    queryKey: ["partner", "disputes", "dashboard"],
    queryFn: () => api.get<{ status_counts?: Record<string, number> }>("partner", "/v1/settlement-disputes/dashboard"),
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const runDisputesQ = useQuery({
    queryKey: ["partner", "run-disputes", runDisputesFor?.id],
    enabled: !!runDisputesFor,
    queryFn: async () =>
      listOf<PartnerDispute>(
        await api.get("partner", `/v1/settlement-runs/${runDisputesFor!.id}/disputes`),
        ENVELOPE.assurance,
      ),
  });

  const [runForm, setRunForm] = useState({
    partner_id: "",
    partner_name: "",
    currency_code: "GBP",
    period_start: monthStart(),
    period_end: today(),
  });

  const [costForm, setCostForm] = useState({
    partner_id: "",
    partner_name: "",
    rated_charge_id: "",
    settlement_type: SETTLEMENT_TYPES[0],
    cost_amount_minor_units: 0,
    revenue_amount_minor_units: 0,
    share_percentage: "",
    currency_code: "GBP",
    settlement_period: "",
  });

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [statementRef, setStatementRef] = useState("");
  const [adjustment, setAdjustment] = useState(0);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createRun = useMutation({
    mutationFn: () =>
      api.post(
        "partner",
        "/v1/settlement-runs",
        {
          partner_id: runForm.partner_id,
          partner_name: runForm.partner_name,
          currency_code: runForm.currency_code,
          period_start: asRFC3339(runForm.period_start),
          period_end: asRFC3339(runForm.period_end),
          created_by: "console",
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Settlement run opened");
      setRunOpen(false);
      refresh();
    },
    onError: fail("Could not open the settlement run"),
  });

  const createCost = useMutation({
    mutationFn: () =>
      api.post(
        "partner",
        "/v1/partner-cost-lines",
        {
          partner_id: costForm.partner_id,
          partner_name: costForm.partner_name,
          rated_charge_id: costForm.rated_charge_id,
          settlement_type: costForm.settlement_type,
          cost_amount_minor_units: costForm.cost_amount_minor_units,
          // Optional: a pure-cost line has no revenue side and no share.
          ...(costForm.revenue_amount_minor_units ? { revenue_amount_minor_units: costForm.revenue_amount_minor_units } : {}),
          ...(costForm.share_percentage ? { share_percentage: costForm.share_percentage } : {}),
          currency_code: costForm.currency_code,
          settlement_period: costForm.settlement_period,
          created_by: "console",
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Cost line recorded");
      setCostOpen(false);
      refresh();
    },
    onError: fail("Could not record the cost line"),
  });

  const reverseCost = useMutation({
    mutationFn: () =>
      api.post(
        "partner",
        `/v1/partner-cost-lines/${reverseFor!.id}/reverse`,
        { reason, updated_by: "console" },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Cost line reversed — the original record is retained");
      setReverseFor(null);
      setReason("");
      refresh();
    },
    onError: fail("Could not reverse the cost line"),
  });

  /**
   * Run lifecycle. Each action maps to its own route; three of them carry a
   * body, the rest take only updated_by. Mapping them here keeps the transition
   * table free of transport detail.
   */
  const runTransition = useMutation({
    mutationFn: ({ run, action }: { run: SettlementRun; action: string }) => {
      const base = `/v1/settlement-runs/${run.id}`;
      const idem = { idempotencyKey: api.uuid() };
      switch (action) {
        case "CLOSE":
          return api.post("partner", `${base}/close`, {
            total_cost_minor_units: run.total_cost_minor_units,
            total_revenue_minor_units: run.total_revenue_minor_units,
            net_settlement_minor_units: run.net_settlement_minor_units,
            cost_line_count: run.cost_line_count,
            updated_by: "console",
          }, idem);
        case "GENERATE_STATEMENT":
          return api.post("partner", `${base}/generate-statement`, { statement_ref: statementRef, updated_by: "console" }, idem);
        case "APPROVE":
          return api.post("partner", `${base}/approve`, { approved_by: "console", updated_by: "console" }, idem);
        case "INITIATE_PAYMENT":
          return api.post("partner", `${base}/initiate-payment`, { updated_by: "console" }, idem);
        case "SETTLE":
          return api.post("partner", `${base}/settle`, { updated_by: "console" }, idem);
        case "DISPUTE":
          return api.post("partner", `${base}/dispute`, { reason, updated_by: "console" }, idem);
        case "ADJUSTMENT_PENDING":
          return api.post("partner", `${base}/adjustment-pending`, { updated_by: "console" }, idem);
        default:
          return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Run ${v.action.replace(/_/g, " ").toLowerCase()}`);
      setRunAction(null);
      setReason("");
      setStatementRef("");
      refresh();
    },
    onError: fail("The run transition was rejected"),
  });

  const createDispute = useMutation({
    mutationFn: () =>
      api.post(
        "partner",
        "/v1/settlement-disputes",
        { run_id: newDisputeFor!.id, partner_id: newDisputeFor!.partner_id, reason, created_by: "console" },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: () => {
      toast.success("Dispute opened");
      setNewDisputeFor(null);
      setReason("");
      refresh();
    },
    onError: fail("Could not open the dispute"),
  });

  const disputeTransition = useMutation({
    mutationFn: ({ dispute, action }: { dispute: PartnerDispute; action: string }) => {
      const base = `/v1/settlement-disputes/${dispute.id}`;
      const idem = { idempotencyKey: api.uuid() };
      switch (action) {
        case "INVESTIGATE":
          return api.post("partner", `${base}/investigate`, { updated_by: "console" }, idem);
        case "ESCALATE":
          return api.post("partner", `${base}/escalate`, { reason, updated_by: "console" }, idem);
        case "RESOLVE":
          return api.post("partner", `${base}/resolve`, {
            resolution_notes: notes,
            // An adjustment of zero means "resolved with no money moving", which
            // is different from omitting it, so it is always sent.
            adjustment_amount_minor_units: adjustment,
            updated_by: "console",
          }, idem);
        case "REJECT":
          return api.post("partner", `${base}/reject`, { reason, updated_by: "console" }, idem);
        default:
          return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Dispute ${v.action.toLowerCase()}d`);
      setDisputeAction(null);
      setReason("");
      setNotes("");
      setAdjustment(0);
      refresh();
    },
    onError: fail("The dispute transition was rejected"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  // Grouped by currency: netting GBP against USD minor units would be a fiction.
  const netByCurrency = runs.reduce<Record<string, number>>((acc, r) => {
    acc[r.settlement_currency || r.currency_code] =
      (acc[r.settlement_currency || r.currency_code] ?? 0) + r.net_settlement_minor_units;
    return acc;
  }, {});
  const currencies = Object.keys(netByCurrency);
  const runCounts = runDashQ.data?.status_counts ?? {};
  const disputeCounts = disputeDashQ.data?.status_counts ?? {};
  const openDisputes = (disputeCounts.OPEN ?? 0) + (disputeCounts.UNDER_INVESTIGATION ?? 0) + (disputeCounts.ESCALATED ?? 0);

  /** Actions needing an extra field open a modal; the rest fire immediately. */
  const RUN_NEEDS_INPUT = new Set(["GENERATE_STATEMENT", "DISPUTE"]);
  const DISPUTE_NEEDS_INPUT = new Set(["ESCALATE", "RESOLVE", "REJECT"]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Partner &amp; Settlement
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Wholesale cost, revenue share and interconnect settlement. Cost lines are reversed, never edited.
          </p>
        </div>
        <button
          onClick={() => (tab === "costs" ? setCostOpen(true) : setRunOpen(true))}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {tab === "costs" ? "+ Cost Line" : "+ Settlement Run"}
        </button>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="SETTLEMENT RUNS" value={runsQ.isLoading ? "…" : String(runs.length)} />
        <SummaryTile label="AWAITING APPROVAL" value={runDashQ.isLoading ? "…" : String(runCounts.STATEMENT_GENERATED ?? 0)} />
        <SummaryTile
          label="NET POSITION"
          value={currencies.length === 0 ? "—" : currencies.map((c) => formatMoney(netByCurrency[c], c)).join("  ·  ")}
          hint={currencies.length > 1 ? "Per currency — not summed" : "Cost − revenue, per the service"}
        />
        <SummaryTile
          label="OPEN DISPUTES"
          value={disputeDashQ.isLoading ? "…" : String(openDisputes)}
          hint={openDisputes > 0 ? "Blocking settlement" : "None"}
        />
      </div>

      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={tab === "runs"} onClick={() => setTab("runs")} label={`Settlement Runs (${runs.length})`} />
        <SubTab active={tab === "costs"} onClick={() => setTab("costs")} label="Cost Lines" />
        <SubTab active={tab === "disputes"} onClick={() => setTab("disputes")} label="Disputes" />
      </div>

      {/* Runs */}
      {tab === "runs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PARTNER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">COST</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REVENUE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">NET</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">LINES</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={8}
                  loading={runsQ.isLoading}
                  error={runsQ.error}
                  empty={runs.length === 0}
                  loadingLabel="Loading settlement runs…"
                  emptyLabel="No settlement runs. Open one to start a partner period."
                />
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{r.partner_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{shortId(r.partner_id)}</div>
                      <DetailToggle
                        open={expanded === r.id}
                        onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                      />
                      {expanded === r.id && (
                        <RecordDetail service="partner" path={`/v1/settlement-runs/${r.id}`} queryKey={["partner", "run", r.id]} />
                      )}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(r.period_start).toLocaleDateString()} → {new Date(r.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{formatMoney(r.total_cost_minor_units, r.currency_code)}</td>
                    <td className="px-6 py-4 font-mono text-xs">{formatMoney(r.total_revenue_minor_units, r.currency_code)}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {formatMoney(r.net_settlement_minor_units, r.settlement_currency || r.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{r.cost_line_count}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={r.status} />
                      {r.statement_ref && <div className="text-[10px] text-slate-400 font-mono mt-1">{r.statement_ref}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        <button
                          onClick={() => setRunDisputesFor(r)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Disputes
                        </button>
                        <TransitionButtons
                          table={SETTLEMENT_RUN_TRANSITIONS}
                          status={r.status}
                          pending={runTransition.isPending}
                          onAction={(action) =>
                            RUN_NEEDS_INPUT.has(action)
                              ? setRunAction({ run: r, action })
                              : runTransition.mutate({ run: r, action })
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

      {/* Cost lines */}
      {tab === "costs" && Object.keys(sumsQ.data?.sums_by_type ?? {}).length > 0 && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="text-slate-800 text-sm font-bold mb-1">Cost by settlement type</div>
          <p className="text-[11px] text-slate-500 mb-3">
            Totalled by the service across every cost line, not just the rows below.
          </p>
          <div className="flex flex-wrap gap-6">
            {Object.entries(sumsQ.data!.sums_by_type!).map(([type, amount]) => (
              <div key={type}>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{type}</div>
                <div className="font-mono font-bold text-slate-800 text-sm">
                  {formatMoney(amount, sumsQ.data?.currency_code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "costs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="text-slate-800 text-sm font-bold mb-1">Exposure to one partner</div>
          <p className="text-[11px] text-slate-500 mb-3">
            The total owed to a single partner across every cost line. Ask this before approving a settlement run.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Partner id</label>
              <input
                className={inputMonoClass}
                value={partnerSumId}
                onChange={(e) => setPartnerSumId(e.target.value)}
                placeholder="uuid"
              />
            </div>
            <div className="w-32">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency</label>
              <input
                className={inputMonoClass}
                value={partnerSumCurrency}
                onChange={(e) => setPartnerSumCurrency(e.target.value.toUpperCase())}
                placeholder="all"
              />
            </div>
            <button
              onClick={() => setPartnerSumFor({ id: partnerSumId.trim(), currency: partnerSumCurrency.trim() })}
              disabled={!partnerSumId.trim()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Total
            </button>
          </div>
          {partnerSumFor && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              {partnerSumQ.isLoading && <div className="text-xs text-slate-400">Totalling…</div>}
              {partnerSumQ.error && (
                <div className="text-xs text-rose-600">{errMessage(partnerSumQ.error, "Could not total this partner")}</div>
              )}
              {partnerSumQ.data && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Total owed{partnerSumFor.currency ? ` · ${partnerSumFor.currency}` : " · all currencies"}
                  </div>
                  <div className="font-mono font-bold text-slate-800 text-lg">
                    {formatMoney(partnerSumQ.data.total_minor_units ?? 0, partnerSumQ.data.currency_code)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {tab === "costs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PARTNER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">COST</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REVENUE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SHARE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={8}
                  loading={costsQ.isLoading}
                  error={costsQ.error}
                  empty={costs.length === 0}
                  loadingLabel="Loading cost lines…"
                  emptyLabel="No partner cost lines recorded."
                />
                {costs.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{c.partner_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{shortId(c.id)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.settlement_type}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {formatMoney(c.cost_amount_minor_units, c.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {c.revenue_amount_minor_units != null ? formatMoney(c.revenue_amount_minor_units, c.currency_code) : "—"}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{c.share_percentage ?? "—"}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{c.settlement_period || "—"}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {c.status === "REVERSED" ? (
                        <span className="text-[10px] text-slate-400">reversed</span>
                      ) : (
                        <button
                          onClick={() => setReverseFor(c)}
                          className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Reverse
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

      {/* Disputes */}
      {tab === "disputes" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RUN</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ADJUSTMENT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">OPENED</th>
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
                  emptyLabel="No partner disputes open."
                />
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-700">{shortId(d.id)}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{shortId(d.run_id)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-normal max-w-[260px]">
                      {d.reason}
                      {d.resolution_notes && <div className="text-[10px] text-slate-400 mt-1">{d.resolution_notes}</div>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {d.adjustment_amount_minor_units != null
                        ? formatMoney(d.adjustment_amount_minor_units, d.currency_code)
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(d.opened_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={d.status} />
                    </td>
                    <td className="px-6 py-4">
                      <TransitionButtons
                        table={PARTNER_DISPUTE_TRANSITIONS}
                        status={d.status}
                        pending={disputeTransition.isPending}
                        onAction={(action) =>
                          DISPUTE_NEEDS_INPUT.has(action)
                            ? setDisputeAction({ dispute: d, action })
                            : disputeTransition.mutate({ dispute: d, action })
                        }
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

      {/* ─── Open settlement run ──────────────────────────────────────────── */}
      {runOpen && (
        <Modal
          title="Open a settlement run"
          subtitle="Opens a period for one partner. Cost lines accumulate into it until it is closed."
          onClose={() => setRunOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setRunOpen(false)}
              onConfirm={() => createRun.mutate()}
              confirmLabel="Open run"
              pendingLabel="Opening…"
              pending={createRun.isPending}
              disabled={!runForm.partner_id || !runForm.partner_name}
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Partner ID">
              <input className={inputMonoClass} value={runForm.partner_id} onChange={(e) => setRunForm({ ...runForm, partner_id: e.target.value })} />
            </Field>
            <Field label="Partner name">
              <input className={inputClass} value={runForm.partner_name} onChange={(e) => setRunForm({ ...runForm, partner_name: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Currency">
              <input className={inputMonoClass} maxLength={3} value={runForm.currency_code} onChange={(e) => setRunForm({ ...runForm, currency_code: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Period start">
              <input type="date" className={inputClass} value={runForm.period_start} onChange={(e) => setRunForm({ ...runForm, period_start: e.target.value })} />
            </Field>
            <Field label="Period end">
              <input type="date" className={inputClass} value={runForm.period_end} onChange={(e) => setRunForm({ ...runForm, period_end: e.target.value })} />
            </Field>
          </div>
        </Modal>
      )}

      {/* ─── Record cost line ─────────────────────────────────────────────── */}
      {costOpen && (
        <Modal
          title="Record a partner cost line"
          subtitle="What this partner charged us for a rated charge. Corrections are reversals, not edits."
          width="w-[560px]"
          onClose={() => setCostOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCostOpen(false)}
              onConfirm={() => createCost.mutate()}
              confirmLabel="Record line"
              pendingLabel="Recording…"
              pending={createCost.isPending}
              disabled={!costForm.partner_id || costForm.cost_amount_minor_units <= 0}
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Partner ID">
              <input className={inputMonoClass} value={costForm.partner_id} onChange={(e) => setCostForm({ ...costForm, partner_id: e.target.value })} />
            </Field>
            <Field label="Partner name">
              <input className={inputClass} value={costForm.partner_name} onChange={(e) => setCostForm({ ...costForm, partner_name: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rated charge ID" hint="The charge this cost is against.">
              <input className={inputMonoClass} value={costForm.rated_charge_id} onChange={(e) => setCostForm({ ...costForm, rated_charge_id: e.target.value })} />
            </Field>
            <Field label="Settlement type">
              <select className={inputClass} value={costForm.settlement_type} onChange={(e) => setCostForm({ ...costForm, settlement_type: e.target.value })}>
                {SETTLEMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Cost (minor)">
              <input type="number" className={inputMonoClass} value={costForm.cost_amount_minor_units} onChange={(e) => setCostForm({ ...costForm, cost_amount_minor_units: Number(e.target.value) })} />
            </Field>
            <Field label="Revenue (minor)" hint="Optional.">
              <input type="number" className={inputMonoClass} value={costForm.revenue_amount_minor_units} onChange={(e) => setCostForm({ ...costForm, revenue_amount_minor_units: Number(e.target.value) })} />
            </Field>
            <Field label="Share %" hint="Optional.">
              <input className={inputMonoClass} value={costForm.share_percentage} onChange={(e) => setCostForm({ ...costForm, share_percentage: e.target.value })} placeholder="12.50" />
            </Field>
            <Field label="Currency">
              <input className={inputMonoClass} maxLength={3} value={costForm.currency_code} onChange={(e) => setCostForm({ ...costForm, currency_code: e.target.value.toUpperCase() })} />
            </Field>
          </div>
          <Field label="Settlement period" hint="Free text, e.g. 2026-08.">
            <input className={inputMonoClass} value={costForm.settlement_period} onChange={(e) => setCostForm({ ...costForm, settlement_period: e.target.value })} />
          </Field>
        </Modal>
      )}

      {/* ─── Reverse cost line ────────────────────────────────────────────── */}
      {reverseFor && (
        <Modal
          title="Reverse this cost line"
          subtitle={`${formatMoney(reverseFor.cost_amount_minor_units, reverseFor.currency_code)} · ${reverseFor.partner_name}. A compensating record is written; the original stays.`}
          onClose={() => setReverseFor(null)}
          footer={
            <ModalActions
              onCancel={() => setReverseFor(null)}
              onConfirm={() => reverseCost.mutate()}
              confirmLabel="Reverse line"
              pendingLabel="Reversing…"
              pending={reverseCost.isPending}
              disabled={!reason.trim()}
              destructive
            />
          }
        >
          <Field label="Reason" hint="Required — recorded on the reversal.">
            <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
        </Modal>
      )}

      {/* ─── Run action needing input ─────────────────────────────────────── */}
      {runAction && (
        <Modal
          title={runAction.action === "DISPUTE" ? "Dispute this run" : "Generate statement"}
          subtitle={`${runAction.run.partner_name} · ${formatMoney(runAction.run.net_settlement_minor_units, runAction.run.settlement_currency || runAction.run.currency_code)}`}
          onClose={() => { setRunAction(null); setReason(""); setStatementRef(""); }}
          footer={
            <ModalActions
              onCancel={() => { setRunAction(null); setReason(""); setStatementRef(""); }}
              onConfirm={() => runTransition.mutate({ run: runAction.run, action: runAction.action })}
              confirmLabel={runAction.action === "DISPUTE" ? "Raise dispute" : "Generate"}
              pendingLabel="Working…"
              pending={runTransition.isPending}
              disabled={runAction.action === "DISPUTE" ? !reason.trim() : !statementRef.trim()}
              destructive={runAction.action === "DISPUTE"}
            />
          }
        >
          {runAction.action === "DISPUTE" ? (
            <Field label="Reason" hint="Recorded against the run and visible to the partner.">
              <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Field>
          ) : (
            <Field label="Statement reference" hint="The document reference sent to the partner.">
              <input className={inputMonoClass} value={statementRef} onChange={(e) => setStatementRef(e.target.value)} placeholder="STMT-2026-08-0001" />
            </Field>
          )}
        </Modal>
      )}

      {/* ─── Dispute action needing input ─────────────────────────────────── */}
      {disputeAction && (
        <Modal
          title={`${disputeAction.action.charAt(0)}${disputeAction.action.slice(1).toLowerCase()} dispute`}
          subtitle={disputeAction.dispute.reason}
          onClose={() => { setDisputeAction(null); setReason(""); setNotes(""); setAdjustment(0); }}
          footer={
            <ModalActions
              onCancel={() => { setDisputeAction(null); setReason(""); setNotes(""); setAdjustment(0); }}
              onConfirm={() => disputeTransition.mutate({ dispute: disputeAction.dispute, action: disputeAction.action })}
              confirmLabel="Confirm"
              pendingLabel="Working…"
              pending={disputeTransition.isPending}
              disabled={disputeAction.action === "RESOLVE" ? !notes.trim() : !reason.trim()}
              destructive={disputeAction.action !== "RESOLVE"}
            />
          }
        >
          {disputeAction.action === "RESOLVE" ? (
            <>
              <Field label="Resolution notes">
                <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Field>
              <Field
                label="Adjustment (minor units)"
                hint="Zero means resolved with no money moving — different from omitting it, so it is always sent."
              >
                <input type="number" className={inputMonoClass} value={adjustment} onChange={(e) => setAdjustment(Number(e.target.value))} />
              </Field>
            </>
          ) : (
            <Field label="Reason">
              <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Field>
          )}
        </Modal>
      )}

      {/* ─── Disputes filed against one run ───────────────────────────────── */}
      {runDisputesFor && (
        <Modal
          title={`Disputes · ${runDisputesFor.partner_name}`}
          subtitle={`${new Date(runDisputesFor.period_start).toLocaleDateString()} → ${new Date(runDisputesFor.period_end).toLocaleDateString()}`}
          width="w-[620px]"
          onClose={() => setRunDisputesFor(null)}
          footer={
            <button
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              onClick={() => { setNewDisputeFor(runDisputesFor); setRunDisputesFor(null); }}
            >
              Open a new dispute
            </button>
          }
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr><th className="px-3 py-2">DISPUTE</th><th className="px-3 py-2">REASON</th><th className="px-3 py-2">ADJUSTMENT</th><th className="px-3 py-2">STATUS</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={4}
                  loading={runDisputesQ.isLoading}
                  error={runDisputesQ.error}
                  empty={(runDisputesQ.data ?? []).length === 0}
                  emptyLabel="No disputes against this run."
                />
                {(runDisputesQ.data ?? []).map((d) => (
                  <tr key={d.id}>
                    <td className="px-3 py-2 font-mono text-slate-600">{shortId(d.id)}</td>
                    <td className="px-3 py-2 text-slate-700">{d.reason}</td>
                    <td className="px-3 py-2 font-mono">
                      {d.adjustment_amount_minor_units != null ? formatMoney(d.adjustment_amount_minor_units, d.currency_code) : "—"}
                    </td>
                    <td className="px-3 py-2"><StatusPill status={d.status} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* ─── New dispute from a run ───────────────────────────────────────── */}
      {newDisputeFor && (
        <Modal
          title="Open a settlement dispute"
          subtitle={`Against ${newDisputeFor.partner_name}`}
          onClose={() => { setNewDisputeFor(null); setReason(""); }}
          footer={
            <ModalActions
              onCancel={() => { setNewDisputeFor(null); setReason(""); }}
              onConfirm={() => createDispute.mutate()}
              confirmLabel="Open dispute"
              pendingLabel="Opening…"
              pending={createDispute.isPending}
              disabled={!reason.trim()}
            />
          }
        >
          <Field label="Reason">
            <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
        </Modal>
      )}
    </div>
  );
}
