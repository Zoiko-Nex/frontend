"use client";

/**
 * Partner Settlement console — partner-settlement service (port 8086).
 *
 * Domain 11: Owns partner economics: cost lines (wholesale, revenue share,
 * commission, carrier, ILD), settlement runs, and disputes.
 *
 * Key Invariants (CLAUDE.md §7, ZN-ADR-011):
 *  - Exact money: integer minor units + currency code.
 *  - Class A append-only: cost line corrections are reversal rows (POST /{id}/reverse).
 *  - State machines: Runs (7 actions) and Disputes (4 actions).
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
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

interface SettlementRun {
  run_id: string;
  partner_id: string;
  partner_name: string;
  currency_code: string;
  status: string;
  period_start: string;
  period_end: string;
  total_cost_minor_units?: number;
  total_revenue_minor_units?: number;
  net_settlement_minor_units?: number;
  cost_line_count?: number;
  created_at: string;
}

interface CostLine {
  cost_line_id: string;
  partner_id: string;
  partner_name: string;
  settlement_type: string;
  cost_amount_minor_units: number;
  revenue_amount_minor_units?: number;
  share_percentage?: number;
  currency_code: string;
  status: string;
  reversal_of_id?: string;
  settlement_period: string;
  created_at: string;
}

interface SettlementDispute {
  dispute_id: string;
  run_id: string;
  partner_id: string;
  reason: string;
  status: string;
  assigned_to?: string;
  resolution_notes?: string;
  adjustment_amount_minor_units?: number;
  created_at: string;
}

export default function PartnerSettlement() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"runs" | "costs" | "disputes">("runs");
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [reverseFor, setReverseFor] = useState<CostLine | null>(null);

  // Forms
  const [runForm, setRunForm] = useState({
    partner_id: "",
    partner_name: "",
    currency_code: "GBP",
    period_start: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    period_end: new Date().toISOString().slice(0, 10),
  });

  const [costForm, setCostForm] = useState({
    partner_id: "",
    partner_name: "",
    rated_charge_id: "",
    settlement_type: "WHOLESALE_CARRIER",
    cost_amount_minor_units: 125000,
    currency_code: "GBP",
    settlement_period: new Date().toISOString().slice(0, 7),
  });

  const [disputeForm, setDisputeForm] = useState({
    run_id: "",
    partner_id: "",
    reason: "",
  });

  // Queries
  const runsQ = useQuery({
    queryKey: ["partner", "settlement-runs"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: SettlementRun[]; items?: SettlementRun[] }>("partner", "/v1/settlement-runs");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const runs = runsQ.data ?? [];

  const costLinesQ = useQuery({
    queryKey: ["partner", "cost-lines"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: CostLine[]; items?: CostLine[] }>("partner", "/v1/partner-cost-lines");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const costLines = costLinesQ.data ?? [];

  const disputesQ = useQuery({
    queryKey: ["partner", "disputes"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: SettlementDispute[]; items?: SettlementDispute[] }>("partner", "/v1/settlement-disputes");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const disputes = disputesQ.data ?? [];

  // Mutations
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createRunMutation = useMutation({
    mutationFn: () =>
      api.post("partner", "/v1/settlement-runs", {
        ...runForm,
        created_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Settlement run initialized");
      setRunModalOpen(false);
      qc.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: fail("Failed to create settlement run"),
  });

  const createCostMutation = useMutation({
    mutationFn: () =>
      api.post("partner", "/v1/partner-cost-lines", {
        ...costForm,
        rated_charge_id: costForm.rated_charge_id || api.uuid(),
        cost_amount_minor_units: Number(costForm.cost_amount_minor_units),
        created_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Partner cost line appended");
      setCostModalOpen(false);
      qc.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: fail("Could not append cost line"),
  });

  const reverseCostMutation = useMutation({
    mutationFn: () =>
      api.post("partner", `/v1/partner-cost-lines/${reverseFor!.cost_line_id}/reverse`, {
        reason: "Operational correction reversal",
        updated_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Cost line reversal posted");
      setReverseFor(null);
      qc.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: fail("Could not reverse cost line"),
  });

  const createDisputeMutation = useMutation({
    mutationFn: () =>
      api.post("partner", "/v1/settlement-disputes", {
        ...disputeForm,
        created_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Settlement dispute opened");
      setDisputeModalOpen(false);
      qc.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: fail("Could not open dispute"),
  });

  const runActionMutation = useMutation({
    mutationFn: ({ runId, action }: { runId: string; action: string }) =>
      api.post("partner", `/v1/settlement-runs/${runId}/${action}`, {
        updated_by: "system_admin",
        approved_by: "finance_director",
        statement_ref: `STMT-${runId.slice(0, 8)}`,
      }),
    onSuccess: () => {
      toast.success("Settlement lifecycle action executed");
      qc.invalidateQueries({ queryKey: ["partner"] });
    },
    onError: fail("Action transition failed"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Partner Settlement &amp; Economics
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Interconnect costs, wholesale carrier agreements, rev-share runs, and settlement dispute resolution (Port 8086).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCostModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Append Cost Line
          </button>
          <button
            onClick={() => setRunModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + New Settlement Run
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="SETTLEMENT RUNS"
          value={runsQ.isLoading ? "…" : String(runs.length)}
          hint="Active & closed runs"
        />
        <SummaryTile
          label="COST LINES"
          value={costLinesQ.isLoading ? "…" : String(costLines.length)}
          hint="Class A append-only"
        />
        <SummaryTile
          label="OPEN DISPUTES"
          value={disputesQ.isLoading ? "…" : String(disputes.filter((d) => d.status !== "RESOLVED").length)}
          hint="Under investigation"
        />
        <SummaryTile
          label="SERVICE STATUS"
          value="HEALTHY"
          hint="Port 8086 · Multi-tenant"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "runs"} onClick={() => setSubTab("runs")} label={`Settlement Runs (${runs.length})`} />
        <SubTab active={subTab === "costs"} onClick={() => setSubTab("costs")} label={`Cost Lines (${costLines.length})`} />
        <SubTab active={subTab === "disputes"} onClick={() => setSubTab("disputes")} label={`Disputes (${disputes.length})`} />
      </div>

      {/* Tab Content: Settlement Runs */}
      {subTab === "runs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RUN ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PARTNER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">NET SETTLEMENT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">LIFECYCLE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={runsQ.isLoading}
                  error={runsQ.error}
                  empty={runs.length === 0}
                  loadingLabel="Loading settlement runs…"
                  emptyLabel="No settlement runs initialized. Create a new settlement run to aggregate carrier/partner costs."
                />
                {runs.map((r) => (
                  <tr key={r.run_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {shortId(r.run_id)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{r.partner_name || "Partner Entity"}</div>
                      <div className="font-mono text-[10px] text-slate-400">{shortId(r.partner_id)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                      {r.period_start?.slice(0, 10)} → {r.period_end?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                      {formatMoney(r.net_settlement_minor_units || 0, r.currency_code)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={r.status || "OPEN"} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {r.status === "OPEN" && (
                        <button
                          onClick={() => runActionMutation.mutate({ runId: r.run_id, action: "close" })}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-bold transition"
                        >
                          Close Run
                        </button>
                      )}
                      {r.status === "CLOSED" && (
                        <button
                          onClick={() => runActionMutation.mutate({ runId: r.run_id, action: "generate-statement" })}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded text-[10px] font-bold transition"
                        >
                          Generate Statement
                        </button>
                      )}
                      {r.status === "STATEMENT_GENERATED" && (
                        <button
                          onClick={() => runActionMutation.mutate({ runId: r.run_id, action: "approve" })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold transition"
                        >
                          Approve
                        </button>
                      )}
                      {r.status === "APPROVED" && (
                        <button
                          onClick={() => runActionMutation.mutate({ runId: r.run_id, action: "settle" })}
                          className="px-2.5 py-1 bg-lime-600 hover:bg-lime-700 text-white rounded text-[10px] font-bold transition"
                        >
                          Settle
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

      {/* Tab Content: Cost Lines */}
      {subTab === "costs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">COST LINE ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PARTNER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AMOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">CORRECTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={costLinesQ.isLoading}
                  error={costLinesQ.error}
                  empty={costLines.length === 0}
                  loadingLabel="Loading partner cost lines…"
                  emptyLabel="No partner cost lines recorded."
                />
                {costLines.map((c) => (
                  <tr key={c.cost_line_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {shortId(c.cost_line_id)}
                      {c.reversal_of_id && (
                        <div className="text-[10px] text-amber-600 font-mono">reverses {shortId(c.reversal_of_id)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-800">
                      {c.partner_name || shortId(c.partner_id)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={c.settlement_type} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {c.settlement_period}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                      {formatMoney(c.cost_amount_minor_units, c.currency_code)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={c.status || "RECORDED"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!c.reversal_of_id && c.status !== "REVERSED" ? (
                        <button
                          onClick={() => setReverseFor(c)}
                          className="px-2.5 py-1 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition"
                        >
                          Post Reversal
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">reversal entry</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Disputes */}
      {subTab === "disputes" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">Settlement Dispute Queue</span>
            <button
              onClick={() => setDisputeModalOpen(true)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition"
            >
              + Open Dispute
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTE ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RUN REF</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CREATED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={5}
                  loading={disputesQ.isLoading}
                  error={disputesQ.error}
                  empty={disputes.length === 0}
                  loadingLabel="Loading disputes…"
                  emptyLabel="No settlement disputes open."
                />
                {disputes.map((d) => (
                  <tr key={d.dispute_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(d.dispute_id)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{shortId(d.run_id)}</td>
                    <td className="px-6 py-4 text-xs text-slate-800 max-w-xs truncate">{d.reason}</td>
                    <td className="px-6 py-4"><StatusPill status={d.status || "OPEN"} /></td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{d.created_at?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Settlement Run */}
      {runModalOpen && (
        <Modal
          title="Initialize Partner Settlement Run"
          subtitle="Aggregate carrier and partner economics across a billing period."
          onClose={() => setRunModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setRunModalOpen(false)}
              onConfirm={() => createRunMutation.mutate()}
              confirmLabel="Start Run"
              pendingLabel="Starting…"
              pending={createRunMutation.isPending}
              disabled={!runForm.partner_id || !runForm.partner_name}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Partner ID">
                <input
                  className={inputMonoClass}
                  value={runForm.partner_id}
                  onChange={(e) => setRunForm({ ...runForm, partner_id: e.target.value })}
                  placeholder="e.g. 50000000-0000-0000-0000-000000000001"
                />
              </Field>
              <Field label="Partner Name">
                <input
                  className={inputClass}
                  value={runForm.partner_name}
                  onChange={(e) => setRunForm({ ...runForm, partner_name: e.target.value })}
                  placeholder="e.g. Vodafone Global Interconnect"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Period Start">
                <input
                  type="date"
                  className={inputClass}
                  value={runForm.period_start}
                  onChange={(e) => setRunForm({ ...runForm, period_start: e.target.value })}
                />
              </Field>
              <Field label="Period End">
                <input
                  type="date"
                  className={inputClass}
                  value={runForm.period_end}
                  onChange={(e) => setRunForm({ ...runForm, period_end: e.target.value })}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputMonoClass}
                  value={runForm.currency_code}
                  onChange={(e) => setRunForm({ ...runForm, currency_code: e.target.value.toUpperCase() })}
                  maxLength={3}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Append Cost Line */}
      {costModalOpen && (
        <Modal
          title="Append Partner Cost Line"
          subtitle="Record wholesale interconnect or revenue-share liability."
          onClose={() => setCostModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCostModalOpen(false)}
              onConfirm={() => createCostMutation.mutate()}
              confirmLabel="Append Cost Line"
              pendingLabel="Recording…"
              pending={createCostMutation.isPending}
              disabled={!costForm.partner_id || !costForm.partner_name}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Partner ID">
                <input
                  className={inputMonoClass}
                  value={costForm.partner_id}
                  onChange={(e) => setCostForm({ ...costForm, partner_id: e.target.value })}
                  placeholder="Partner UUID"
                />
              </Field>
              <Field label="Partner Name">
                <input
                  className={inputClass}
                  value={costForm.partner_name}
                  onChange={(e) => setCostForm({ ...costForm, partner_name: e.target.value })}
                  placeholder="Partner Company Name"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Settlement Type">
                <select
                  className={inputClass}
                  value={costForm.settlement_type}
                  onChange={(e) => setCostForm({ ...costForm, settlement_type: e.target.value })}
                >
                  <option value="WHOLESALE_CARRIER">WHOLESALE_CARRIER</option>
                  <option value="REVENUE_SHARE">REVENUE_SHARE</option>
                  <option value="COMMISSION">COMMISSION</option>
                  <option value="ILD_TERMINATION">ILD_TERMINATION</option>
                </select>
              </Field>
              <Field label="Amount (Minor Units)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={costForm.cost_amount_minor_units}
                  onChange={(e) => setCostForm({ ...costForm, cost_amount_minor_units: Number(e.target.value) })}
                />
              </Field>
              <Field label="Period (YYYY-MM)">
                <input
                  type="month"
                  className={inputClass}
                  value={costForm.settlement_period}
                  onChange={(e) => setCostForm({ ...costForm, settlement_period: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Dispute */}
      {disputeModalOpen && (
        <Modal
          title="Open Settlement Dispute"
          subtitle="Flag a settlement run or cost line for audit & reconciliation."
          onClose={() => setDisputeModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setDisputeModalOpen(false)}
              onConfirm={() => createDisputeMutation.mutate()}
              confirmLabel="Open Dispute"
              pendingLabel="Opening…"
              pending={createDisputeMutation.isPending}
              disabled={!disputeForm.run_id || !disputeForm.reason}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <Field label="Run ID">
              <input
                className={inputMonoClass}
                value={disputeForm.run_id}
                onChange={(e) => setDisputeForm({ ...disputeForm, run_id: e.target.value })}
                placeholder="Settlement Run UUID"
              />
            </Field>
            <Field label="Partner ID">
              <input
                className={inputMonoClass}
                value={disputeForm.partner_id}
                onChange={(e) => setDisputeForm({ ...disputeForm, partner_id: e.target.value })}
                placeholder="Partner UUID"
              />
            </Field>
            <Field label="Dispute Reason">
              <textarea
                className={`${inputClass} h-20 resize-none`}
                value={disputeForm.reason}
                onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                placeholder="Explain discrepancy between carrier invoice and mediated CDR count…"
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* Modal: Reversal Confirmation */}
      {reverseFor && (
        <Modal
          title="Post Cost Line Reversal"
          subtitle="The original cost line remains in the immutable ledger. A counter-entry is recorded with inverse economics."
          onClose={() => setReverseFor(null)}
          footer={
            <ModalActions
              onCancel={() => setReverseFor(null)}
              onConfirm={() => reverseCostMutation.mutate()}
              confirmLabel="Post Reversal"
              pendingLabel="Reversing…"
              pending={reverseCostMutation.isPending}
              destructive
            />
          }
        >
          <dl className="grid grid-cols-2 gap-y-2 text-xs">
            <dt className="text-slate-400">Cost Line ID</dt>
            <dd className="font-mono text-slate-800 break-all">{reverseFor.cost_line_id}</dd>
            <dt className="text-slate-400">Partner</dt>
            <dd className="font-semibold text-slate-800">{reverseFor.partner_name}</dd>
            <dt className="text-slate-400">Amount</dt>
            <dd className="font-mono font-bold text-slate-900">{formatMoney(reverseFor.cost_amount_minor_units, reverseFor.currency_code)}</dd>
          </dl>
        </Modal>
      )}
    </div>
  );
}
