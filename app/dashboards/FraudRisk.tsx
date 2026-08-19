"use client";

/**
 * Fraud & Risk Management console — fraud-risk service (port 8090).
 *
 * Domain 12: Real-time fraud detection, AI anomaly scoring, SIM-swap alerts,
 * and fraud case investigations.
 *
 * Key Invariants (CLAUDE.md P1-9):
 *  - Separate from Revenue Assurance (RA = leakage; Fraud = abuse).
 *  - Lifecycles: OPEN -> INVESTIGATING -> ESCALATED -> RESOLVED / FALSE_POSITIVE -> CLOSED.
 *  - AI signals include model_id, model_version, model_confidence, model_explanation.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
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

interface FraudCase {
  case_id: string;
  case_type: string;
  description: string;
  risk_score: number;
  risk_level: string;
  status: string;
  customer_id?: string;
  subscriber_id?: string;
  account_id?: string;
  assigned_to?: string;
  created_at: string;
}

interface RiskSignal {
  signal_id: string;
  fraud_case_id?: string;
  signal_source: string;
  signal_type: string;
  signal_score: number;
  model_id?: string;
  model_version?: string;
  model_confidence?: number;
  model_explanation?: string;
  created_at: string;
}

export default function FraudRisk() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"cases" | "signals">("cases");
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [signalModalOpen, setSignalModalOpen] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [newScore, setNewScore] = useState(85);

  // Forms
  const [caseForm, setCaseForm] = useState({
    case_type: "SIM_SWAP_FRAUD",
    description: "",
    risk_score: 85,
    customer_id: "",
    subscriber_id: "",
    account_id: "",
  });

  const [signalForm, setSignalForm] = useState({
    signal_source: "AI_MODEL",
    signal_type: "SIM_SWAP_ALERT",
    signal_score: 92,
    model_id: "fraud-anomaly-detector-v2",
    model_version: "2.4.1",
    model_confidence: 0.942,
    model_explanation: "Sudden IP mismatch following three consecutive failed PIN attempts.",
    fraud_case_id: "",
  });

  // Queries
  const casesQ = useQuery({
    queryKey: ["fraud", "fraud-cases"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: FraudCase[]; items?: FraudCase[] }>("fraud", "/v1/fraud-cases");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const cases = casesQ.data ?? [];

  const signalsQ = useQuery({
    queryKey: ["fraud", "risk-signals"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: RiskSignal[]; items?: RiskSignal[] }>("fraud", "/v1/risk-signals");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const signals = signalsQ.data ?? [];

  // Mutations
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createCaseMutation = useMutation({
    mutationFn: () =>
      api.post("fraud", "/v1/fraud-cases", {
        ...caseForm,
        risk_score: Number(caseForm.risk_score),
      }),
    onSuccess: () => {
      toast.success("Fraud case opened");
      setCaseModalOpen(false);
      qc.invalidateQueries({ queryKey: ["fraud"] });
    },
    onError: fail("Could not open fraud case"),
  });

  const createSignalMutation = useMutation({
    mutationFn: () =>
      api.post("fraud", "/v1/risk-signals", {
        ...signalForm,
        signal_score: Number(signalForm.signal_score),
        model_confidence: Number(signalForm.model_confidence),
        raw_signal: { event: "ai_anomaly_detected", timestamp: new Date().toISOString() },
      }),
    onSuccess: () => {
      toast.success("AI risk signal ingested");
      setSignalModalOpen(false);
      qc.invalidateQueries({ queryKey: ["fraud"] });
    },
    onError: fail("Could not ingest risk signal"),
  });

  const updateScoreMutation = useMutation({
    mutationFn: () =>
      api.patch("fraud", `/v1/fraud-cases/${selectedCase!.case_id}/risk-score`, {
        risk_score: Number(newScore),
        updated_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Risk score updated");
      setScoreModalOpen(false);
      qc.invalidateQueries({ queryKey: ["fraud"] });
    },
    onError: fail("Could not update risk score"),
  });

  const actionMutation = useMutation({
    mutationFn: ({ caseId, action }: { caseId: string; action: string }) =>
      api.post("fraud", `/v1/fraud-cases/${caseId}/${action}`, {
        assigned_to: "fraud_investigator_1",
        resolution_notes: "Investigation complete. Confirmed security threat mitigated.",
        recommended_action: "ACCOUNT_SUSPENSION",
        updated_by: "system_admin",
      }),
    onSuccess: () => {
      toast.success("Fraud case status updated");
      qc.invalidateQueries({ queryKey: ["fraud"] });
    },
    onError: fail("Transition failed"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Fraud &amp; Risk Intelligence
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Real-time AI telemetry, SIM-swap anomaly detection, velocity checks, and investigative case management (Port 8090).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSignalModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            ⚡ Ingest AI Risk Signal
          </button>
          <button
            onClick={() => setCaseModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Open Fraud Case
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="ACTIVE FRAUD CASES"
          value={casesQ.isLoading ? "…" : String(cases.filter((c) => c.status !== "CLOSED").length)}
          hint="Investigating & escalated"
        />
        <SummaryTile
          label="AI SIGNALS INGESTED"
          value={signalsQ.isLoading ? "…" : String(signals.length)}
          hint="Sub-second streaming"
        />
        <SummaryTile
          label="CRITICAL RISK THRESHOLD"
          value="> 85"
          hint="Automated hold trigger"
        />
        <SummaryTile
          label="DETECTION ENGINE"
          value="ACTIVE"
          hint="Port 8090 · Real-time"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "cases"} onClick={() => setSubTab("cases")} label={`Fraud Cases (${cases.length})`} />
        <SubTab active={subTab === "signals"} onClick={() => setSubTab("signals")} label={`AI Risk Signals Feed (${signals.length})`} />
      </div>

      {/* Tab Content: Cases */}
      {subTab === "cases" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASE ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DESCRIPTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RISK SCORE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">LIFECYCLE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={casesQ.isLoading}
                  error={casesQ.error}
                  empty={cases.length === 0}
                  loadingLabel="Loading fraud cases…"
                  emptyLabel="No active fraud cases found."
                />
                {cases.map((c) => (
                  <tr key={c.case_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(c.case_id)}</td>
                    <td className="px-6 py-4"><StatusPill status={c.case_type} /></td>
                    <td className="px-6 py-4 text-xs text-slate-800 max-w-xs truncate">{c.description}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedCase(c);
                          setNewScore(c.risk_score);
                          setScoreModalOpen(true);
                        }}
                        className={`px-2 py-0.5 rounded font-mono text-xs font-bold transition hover:opacity-80 ${
                          c.risk_score >= 80 ? "bg-rose-50 text-rose-600 border border-rose-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        Score: {c.risk_score} ✎
                      </button>
                    </td>
                    <td className="px-6 py-4"><StatusPill status={c.status || "OPEN"} /></td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {c.status === "OPEN" && (
                        <button
                          onClick={() => actionMutation.mutate({ caseId: c.case_id, action: "investigate" })}
                          className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-bold"
                        >
                          Investigate
                        </button>
                      )}
                      {c.status === "INVESTIGATING" && (
                        <>
                          <button
                            onClick={() => actionMutation.mutate({ caseId: c.case_id, action: "escalate" })}
                            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded text-[10px] font-bold"
                          >
                            Escalate
                          </button>
                          <button
                            onClick={() => actionMutation.mutate({ caseId: c.case_id, action: "resolve" })}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      {(c.status === "RESOLVED" || c.status === "FALSE_POSITIVE") && (
                        <button
                          onClick={() => actionMutation.mutate({ caseId: c.case_id, action: "close" })}
                          className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[10px] font-bold"
                        >
                          Close Case
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

      {/* Tab Content: Risk Signals */}
      {subTab === "signals" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SIGNAL ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SOURCE / TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SCORE / CONFIDENCE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AI MODEL METADATA</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={5}
                  loading={signalsQ.isLoading}
                  error={signalsQ.error}
                  empty={signals.length === 0}
                  loadingLabel="Loading AI risk signals feed…"
                  emptyLabel="No risk signals logged."
                />
                {signals.map((s) => (
                  <tr key={s.signal_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(s.signal_id)}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{s.signal_type}</div>
                      <div className="font-mono text-[10px] text-slate-400">{s.signal_source}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="font-bold text-rose-600">{s.signal_score}/100</span>
                      {s.model_confidence && (
                        <span className="text-slate-400 text-[11px] ml-1">({(s.model_confidence * 100).toFixed(1)}% conf)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 max-w-sm">
                      <div className="font-semibold">{s.model_explanation || "Automated anomaly trigger"}</div>
                      <div className="text-[10px] font-mono text-slate-400">{s.model_id} v{s.model_version}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">{new Date(s.created_at || Date.now()).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Open Fraud Case */}
      {caseModalOpen && (
        <Modal
          title="Open Fraud Case"
          subtitle="Initiate an auditable security and risk investigation."
          onClose={() => setCaseModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCaseModalOpen(false)}
              onConfirm={() => createCaseMutation.mutate()}
              confirmLabel="Open Case"
              pendingLabel="Opening…"
              pending={createCaseMutation.isPending}
              disabled={!caseForm.description}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Case Type">
                <select
                  className={inputClass}
                  value={caseForm.case_type}
                  onChange={(e) => setCaseForm({ ...caseForm, case_type: e.target.value })}
                >
                  <option value="SIM_SWAP_FRAUD">SIM_SWAP_FRAUD</option>
                  <option value="ACCOUNT_TAKEOVER">ACCOUNT_TAKEOVER</option>
                  <option value="PAYMENT_FRAUD">PAYMENT_FRAUD</option>
                  <option value="USAGE_ABUSE">USAGE_ABUSE</option>
                  <option value="ROAMING_FRAUD">ROAMING_FRAUD</option>
                  <option value="SUBSCRIPTION_FRAUD">SUBSCRIPTION_FRAUD</option>
                </select>
              </Field>
              <Field label="Initial Risk Score (0-100)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={caseForm.risk_score}
                  onChange={(e) => setCaseForm({ ...caseForm, risk_score: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                className={`${inputClass} h-20 resize-none`}
                value={caseForm.description}
                onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })}
                placeholder="Explain the detected anomaly or subscriber report…"
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* Modal: Ingest Signal */}
      {signalModalOpen && (
        <Modal
          title="Ingest AI Risk Signal"
          subtitle="Stream real-time ML anomaly score with required model provenance."
          onClose={() => setSignalModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setSignalModalOpen(false)}
              onConfirm={() => createSignalMutation.mutate()}
              confirmLabel="Ingest Signal"
              pendingLabel="Ingesting…"
              pending={createSignalMutation.isPending}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Signal Source">
                <select
                  className={inputClass}
                  value={signalForm.signal_source}
                  onChange={(e) => setSignalForm({ ...signalForm, signal_source: e.target.value })}
                >
                  <option value="AI_MODEL">AI_MODEL</option>
                  <option value="USAGE_ANOMALY">USAGE_ANOMALY</option>
                  <option value="VELOCITY_CHECK">VELOCITY_CHECK</option>
                  <option value="SIM_SWAP_ALERT">SIM_SWAP_ALERT</option>
                </select>
              </Field>
              <Field label="Signal Score (0-100)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={signalForm.signal_score}
                  onChange={(e) => setSignalForm({ ...signalForm, signal_score: Number(e.target.value) })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Model ID">
                <input
                  className={inputMonoClass}
                  value={signalForm.model_id}
                  onChange={(e) => setSignalForm({ ...signalForm, model_id: e.target.value })}
                />
              </Field>
              <Field label="Model Version">
                <input
                  className={inputMonoClass}
                  value={signalForm.model_version}
                  onChange={(e) => setSignalForm({ ...signalForm, model_version: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Explanation">
              <input
                className={inputClass}
                value={signalForm.model_explanation}
                onChange={(e) => setSignalForm({ ...signalForm, model_explanation: e.target.value })}
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* Modal: Update Risk Score */}
      {scoreModalOpen && (
        <Modal
          title="Update Fraud Risk Score"
          subtitle="Adjust the composite risk score (0-100) based on new intelligence."
          onClose={() => setScoreModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setScoreModalOpen(false)}
              onConfirm={() => updateScoreMutation.mutate()}
              confirmLabel="Update Score"
              pendingLabel="Saving…"
              pending={updateScoreMutation.isPending}
            />
          }
        >
          <Field label="New Risk Score (0-100)">
            <input
              type="number"
              className={inputMonoClass}
              value={newScore}
              onChange={(e) => setNewScore(Number(e.target.value))}
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}
