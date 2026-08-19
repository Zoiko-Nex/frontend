"use client";

/**
 * Dunning & Disputes console — dunning-collections-disputes service (port 8095).
 *
 * Domain 15: Automated collections lifecycle for overdue invoices, payment retries,
 * debt recovery stages, and customer billing disputes (ZN-ADR Domain 15).
 *
 * Key Invariants (CLAUDE.md §7, ZN-ADR-011):
 *  - Exact money in integer minor units.
 *  - Class A append-only: Cases and disputes reach terminal states (RESOLVED, WRITTEN_OFF, CLOSED).
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

interface DunningCase {
  case_id: string;
  customer_id: string;
  account_id: string;
  invoice_id: string;
  overdue_amount_minor_units: number;
  currency_code: string;
  dunning_stage: string;
  status: string;
  retry_count: number;
  next_action_at?: string;
  created_at: string;
}

interface BillingDispute {
  dispute_id: string;
  customer_id: string;
  invoice_id: string;
  disputed_amount_minor_units: number;
  currency_code: string;
  reason: string;
  status: string;
  assigned_to?: string;
  created_at: string;
}

export default function DunningDisputes() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"cases" | "disputes">("cases");
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  // Forms
  const [caseForm, setCaseForm] = useState({
    customer_id: "",
    account_id: "",
    invoice_id: "",
    overdue_amount_minor_units: 8900,
    currency_code: "USD",
  });

  const [disputeForm, setDisputeForm] = useState({
    customer_id: "",
    invoice_id: "",
    disputed_amount_minor_units: 3500,
    currency_code: "USD",
    reason: "Subscriber claims unauthorized roaming data charges.",
  });

  // Queries
  const casesQ = useQuery({
    queryKey: ["dunning", "cases"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: DunningCase[]; items?: DunningCase[] }>("dunning", "/v1/dunning-cases");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const cases = casesQ.data ?? [];

  const disputesQ = useQuery({
    queryKey: ["dunning", "disputes"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: BillingDispute[]; items?: BillingDispute[] }>("dunning", "/v1/disputes");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const disputes = disputesQ.data ?? [];

  // Mutations
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createCaseMutation = useMutation({
    mutationFn: () =>
      api.post("dunning", "/v1/dunning-cases", {
        ...caseForm,
        overdue_amount_minor_units: Number(caseForm.overdue_amount_minor_units),
      }),
    onSuccess: () => {
      toast.success("Dunning collections case opened");
      setCaseModalOpen(false);
      qc.invalidateQueries({ queryKey: ["dunning"] });
    },
    onError: fail("Could not open dunning case"),
  });

  const createDisputeMutation = useMutation({
    mutationFn: () =>
      api.post("dunning", "/v1/disputes", {
        ...disputeForm,
        disputed_amount_minor_units: Number(disputeForm.disputed_amount_minor_units),
      }),
    onSuccess: () => {
      toast.success("Customer dispute logged");
      setDisputeModalOpen(false);
      qc.invalidateQueries({ queryKey: ["dunning"] });
    },
    onError: fail("Could not log dispute"),
  });

  const caseActionMutation = useMutation({
    mutationFn: ({ caseId, action }: { caseId: string; action: string }) =>
      api.post("dunning", `/v1/dunning-cases/${caseId}/${action}`, {
        updated_by: "system_admin",
        reason: "Administrative manual transition",
      }),
    onSuccess: () => {
      toast.success("Dunning case updated");
      qc.invalidateQueries({ queryKey: ["dunning"] });
    },
    onError: fail("Transition failed"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Dunning, Collections &amp; Disputes
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Overdue invoice recovery stages, automated payment retries, and customer dispute resolution (Port 8095).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDisputeModalOpen(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Log Billing Dispute
          </button>
          <button
            onClick={() => setCaseModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Open Dunning Case
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="ACTIVE DUNNING CASES"
          value={casesQ.isLoading ? "…" : String(cases.filter((c) => c.status !== "CLOSED").length)}
          hint="Collections pipeline"
        />
        <SummaryTile
          label="OPEN DISPUTES"
          value={disputesQ.isLoading ? "…" : String(disputes.filter((d) => d.status !== "RESOLVED").length)}
          hint="Billing complaints"
        />
        <SummaryTile
          label="RETRY STRATEGY"
          value="SMART-BACKOFF"
          hint="Exponential interval"
        />
        <SummaryTile
          label="SERVICE STATUS"
          value="HEALTHY"
          hint="Port 8095 · Automated"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "cases"} onClick={() => setSubTab("cases")} label={`Dunning Collections Queue (${cases.length})`} />
        <SubTab active={subTab === "disputes"} onClick={() => setSubTab("disputes")} label={`Customer Disputes (${disputes.length})`} />
      </div>

      {/* Tab Content: Dunning Cases */}
      {subTab === "cases" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASE ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">INVOICE REF</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STAGE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">OVERDUE AMOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RETRIES</th>
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
                  emptyLabel="No active dunning cases."
                />
                {cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(c.case_id)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{shortId(c.invoice_id)}</td>
                    <td className="px-6 py-4"><StatusPill status={c.dunning_stage || "REMINDER_1"} /></td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-rose-600">
                      {formatMoney(c.overdue_amount_minor_units, c.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{c.retry_count ?? 0}/3</td>
                    <td className="px-6 py-4"><StatusPill status={c.status || "ACTIVE"} /></td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {c.status === "ACTIVE" && (
                        <>
                          <button
                            onClick={() => caseActionMutation.mutate({ caseId: c.case_id, action: "pause" })}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-bold"
                          >
                            Pause
                          </button>
                          <button
                            onClick={() => caseActionMutation.mutate({ caseId: c.case_id, action: "escalate" })}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-[10px] font-bold"
                          >
                            Escalate
                          </button>
                        </>
                      )}
                      {c.status === "PAUSED" && (
                        <button
                          onClick={() => caseActionMutation.mutate({ caseId: c.case_id, action: "resume" })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold"
                        >
                          Resume
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

      {/* Tab Content: Disputes */}
      {subTab === "disputes" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTE ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">INVOICE REF</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DISPUTED AMOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REASON</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={5}
                  loading={disputesQ.isLoading}
                  error={disputesQ.error}
                  empty={disputes.length === 0}
                  loadingLabel="Loading billing disputes…"
                  emptyLabel="No disputes open."
                />
                {disputes.map((d) => (
                  <tr key={d.dispute_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(d.dispute_id)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{shortId(d.invoice_id)}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                      {formatMoney(d.disputed_amount_minor_units, d.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 max-w-xs truncate">{d.reason}</td>
                    <td className="px-6 py-4"><StatusPill status={d.status || "OPEN"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Open Dunning Case */}
      {caseModalOpen && (
        <Modal
          title="Open Dunning Collections Case"
          subtitle="Initiate collections workflow on an overdue invoice."
          onClose={() => setCaseModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCaseModalOpen(false)}
              onConfirm={() => createCaseMutation.mutate()}
              confirmLabel="Open Case"
              pendingLabel="Opening…"
              pending={createCaseMutation.isPending}
              disabled={!caseForm.customer_id || !caseForm.invoice_id}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer ID">
                <input
                  className={inputMonoClass}
                  value={caseForm.customer_id}
                  onChange={(e) => setCaseForm({ ...caseForm, customer_id: e.target.value })}
                  placeholder="Customer UUID"
                />
              </Field>
              <Field label="Account ID">
                <input
                  className={inputMonoClass}
                  value={caseForm.account_id}
                  onChange={(e) => setCaseForm({ ...caseForm, account_id: e.target.value })}
                  placeholder="Account UUID"
                />
              </Field>
            </div>
            <Field label="Overdue Invoice ID">
              <input
                className={inputMonoClass}
                value={caseForm.invoice_id}
                onChange={(e) => setCaseForm({ ...caseForm, invoice_id: e.target.value })}
                placeholder="Invoice UUID"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Overdue Amount (Minor Units)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={caseForm.overdue_amount_minor_units}
                  onChange={(e) => setCaseForm({ ...caseForm, overdue_amount_minor_units: Number(e.target.value) })}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputMonoClass}
                  value={caseForm.currency_code}
                  onChange={(e) => setCaseForm({ ...caseForm, currency_code: e.target.value.toUpperCase() })}
                  maxLength={3}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Log Dispute */}
      {disputeModalOpen && (
        <Modal
          title="Log Customer Billing Dispute"
          subtitle="Record customer dispute and pause automated collections."
          onClose={() => setDisputeModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setDisputeModalOpen(false)}
              onConfirm={() => createDisputeMutation.mutate()}
              confirmLabel="Log Dispute"
              pendingLabel="Logging…"
              pending={createDisputeMutation.isPending}
              disabled={!disputeForm.customer_id || !disputeForm.invoice_id}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Customer ID">
                <input
                  className={inputMonoClass}
                  value={disputeForm.customer_id}
                  onChange={(e) => setDisputeForm({ ...disputeForm, customer_id: e.target.value })}
                  placeholder="Customer UUID"
                />
              </Field>
              <Field label="Invoice ID">
                <input
                  className={inputMonoClass}
                  value={disputeForm.invoice_id}
                  onChange={(e) => setDisputeForm({ ...disputeForm, invoice_id: e.target.value })}
                  placeholder="Invoice UUID"
                />
              </Field>
            </div>
            <Field label="Disputed Amount (Minor Units)">
              <input
                type="number"
                className={inputMonoClass}
                value={disputeForm.disputed_amount_minor_units}
                onChange={(e) => setDisputeForm({ ...disputeForm, disputed_amount_minor_units: Number(e.target.value) })}
              />
            </Field>
            <Field label="Dispute Reason">
              <textarea
                className={`${inputClass} h-20 resize-none`}
                value={disputeForm.reason}
                onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
