"use client";

/**
 * Fraud & Risk console — fraud-risk service (8090).
 *
 * Detects *abuse*. Deliberately a separate engine from Revenue Assurance
 * (CLAUDE.md P1-9): RA finds money we failed to bill, Fraud finds someone
 * taking money they should not. Same case-management shape, opposite response.
 *
 * The AI boundary matters here more than anywhere else in the platform.
 * Risk signals carry a model id, version, confidence and explanation, and a
 * scorer may raise or re-score a case — but P1-11 forbids AI from mutating a
 * Class A record or closing a case on its own. Every terminal transition on
 * this screen is an operator action with an attributed `updated_by`, and the
 * resolve form labels its AI field as a recommendation, never a decision.
 *
 * A risk score is 0–100 and is PATCHed, not transitioned: re-scoring an open
 * case as new signals arrive is routine and is not a lifecycle change.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { FRAUD_CASE_TRANSITIONS, RULE_TRANSITIONS } from "@/lib/admin/transitions";
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

interface FraudCase {
  id: string;
  country_code: string;
  jurisdiction_code: string;
  case_type: string;
  status: string;
  risk_level: string;
  priority: string;
  description?: string;
  assigned_to?: string;
  resolution_notes?: string;
  customer_id?: string;
  subscriber_id?: string;
  account_id?: string;
  version: number;
  detected_at: string;
  resolved_at?: string;
}

interface RiskSignal {
  id: string;
  signal_source: string;
  signal_type: string;
  detected_at: string;
  model_confidence?: number;
}

interface FraudRule {
  id: string;
  name: string;
  description?: string;
  rule_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const CASE_TYPES = ["SUBSCRIPTION_FRAUD", "PAYMENT_FRAUD", "SIM_SWAP", "ROAMING_ABUSE", "IRSF", "BYPASS", "IDENTITY_THEFT"];
const RISK_LEVELS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "CLEAR"];
const RULE_TYPES = ["VELOCITY", "THRESHOLD", "PATTERN", "GEO", "DEVICE", "ML_SCORE"];
const SIGNAL_SOURCES = ["NETWORK", "PAYMENT_GATEWAY", "KYC", "ML_SCORER", "MANUAL", "PARTNER"];

export default function FraudRisk() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"cases" | "signals" | "rules">("cases");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  const [caseOpen, setCaseOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [signalOpen, setSignalOpen] = useState(false);
  const [caseAction, setCaseAction] = useState<{ item: FraudCase; action: string } | null>(null);
  const [editRule, setEditRule] = useState<FraudRule | null>(null);
  const [scoreFor, setScoreFor] = useState<FraudCase | null>(null);
  const [signalsFor, setSignalsFor] = useState<FraudCase | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refresh = () => qc.invalidateQueries({ queryKey: ["fraud"] });

  // ─── Queries ────────────────────────────────────────────────────────────────

  const casesQ = useQuery({
    queryKey: ["fraud", "cases", statusFilter, riskFilter],
    queryFn: async () => {
      const p = new URLSearchParams({ page_size: "100" });
      if (statusFilter) p.set("status", statusFilter);
      if (riskFilter) p.set("risk_level", riskFilter);
      return listOf<FraudCase>(await api.get("fraud", `/v1/fraud-cases?${p}`), ENVELOPE.assurance);
    },
  });
  const cases = casesQ.data ?? [];

  const signalsQ = useQuery({
    queryKey: ["fraud", "signals"],
    enabled: tab === "signals",
    queryFn: async () => listOf<RiskSignal>(await api.get("fraud", "/v1/risk-signals?page_size=100"), ENVELOPE.assurance),
  });

  const rulesQ = useQuery({
    queryKey: ["fraud", "rules"],
    enabled: tab === "rules",
    queryFn: async () => listOf<FraudRule>(await api.get("fraud", "/v1/fraud-rules?page_size=100"), ENVELOPE.assurance),
  });
  const rules = rulesQ.data ?? [];

  /**
   * Active rules only. Separate from the full list because "how many rules are
   * actually scoring traffic" is a different question from "how many exist",
   * and the service answers it directly rather than making us filter.
   */
  const activeRulesQ = useQuery({
    queryKey: ["fraud", "rules", "active"],
    queryFn: async () => listOf<FraudRule>(await api.get("fraud", "/v1/fraud-rules/active"), ENVELOPE.assurance),
  });

  const dashQ = useQuery({
    queryKey: ["fraud", "dashboard"],
    queryFn: () => api.get<{ status_counts?: Record<string, number> }>("fraud", "/v1/fraud-cases/dashboard"),
  });

  const caseSignalsQ = useQuery({
    queryKey: ["fraud", "case-signals", signalsFor?.id],
    enabled: !!signalsFor,
    queryFn: async () =>
      listOf<RiskSignal>(await api.get("fraud", `/v1/fraud-cases/${signalsFor!.id}/signals`), ENVELOPE.assurance),
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [caseForm, setCaseForm] = useState({
    case_type: CASE_TYPES[0],
    description: "",
    risk_score: 50,
    customer_id: "",
    subscriber_id: "",
    account_id: "",
  });
  const [ruleForm, setRuleForm] = useState({
    name: "",
    description: "",
    rule_type: RULE_TYPES[0],
    config_json: '{\n  "window_minutes": 60,\n  "max_attempts": 5\n}',
    output_type: "SCORE",
    output_score: 40,
  });
  const [configError, setConfigError] = useState<string | null>(null);
  const [signalForm, setSignalForm] = useState({
    fraud_case_id: "",
    signal_source: SIGNAL_SOURCES[0],
    signal_type: "",
    signal_score: 0,
    raw_signal: "{}",
    model_id: "",
    model_version: "",
    model_confidence: 0,
    model_explanation: "",
  });

  const [assignedTo, setAssignedTo] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendedAction, setRecommendedAction] = useState("");
  const [newScore, setNewScore] = useState(0);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createCase = useMutation({
    mutationFn: () =>
      api.post("fraud", "/v1/fraud-cases", {
        case_type: caseForm.case_type,
        description: caseForm.description,
        risk_score: caseForm.risk_score,
        customer_id: caseForm.customer_id,
        subscriber_id: caseForm.subscriber_id,
        account_id: caseForm.account_id,
      }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Fraud case opened"); setCaseOpen(false); refresh(); },
    onError: fail("Could not open the fraud case"),
  });

  const createRule = useMutation({
    mutationFn: () => {
      try { JSON.parse(ruleForm.config_json); } catch (err) {
        throw new Error(`config_json is not valid JSON: ${(err as Error).message}`);
      }
      return api.post("fraud", "/v1/fraud-rules", { ...ruleForm, created_by: "console" });
    },
    onSuccess: () => { toast.success("Rule created in DRAFT — activate it to start scoring"); setRuleOpen(false); refresh(); },
    onError: fail("Could not create the rule"),
  });

  const createSignal = useMutation({
    mutationFn: () => {
      try { JSON.parse(signalForm.raw_signal); } catch (err) {
        throw new Error(`raw_signal is not valid JSON: ${(err as Error).message}`);
      }
      return api.post("fraud", "/v1/risk-signals", signalForm);
    },
    onSuccess: () => { toast.success("Risk signal recorded"); setSignalOpen(false); refresh(); },
    onError: fail("Could not record the signal"),
  });

  const caseTransition = useMutation({
    mutationFn: ({ item, action }: { item: FraudCase; action: string }) => {
      const base = `/v1/fraud-cases/${item.id}`;
      switch (action) {
        case "INVESTIGATE":
          return api.post("fraud", `${base}/investigate`, { assigned_to: assignedTo, updated_by: "console" });
        case "ESCALATE":
          return api.post("fraud", `${base}/escalate`, { reason, updated_by: "console" });
        case "RESOLVE":
          // recommended_action is explicitly an AI recommendation field on the
          // backend. The human decision is the transition itself plus updated_by.
          return api.post("fraud", `${base}/resolve`, {
            resolution_notes: notes,
            recommended_action: recommendedAction,
            updated_by: "console",
          });
        case "FALSE_POSITIVE":
          return api.post("fraud", `${base}/false-positive`, { reason, updated_by: "console" });
        case "CLOSE":
          return api.post("fraud", `${base}/close`, { updated_by: "console" });
        default:
          return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Case ${v.action.replace(/_/g, " ").toLowerCase()}`);
      setCaseAction(null); setAssignedTo(""); setReason(""); setNotes(""); setRecommendedAction("");
      refresh();
    },
    onError: fail("The case transition was rejected"),
  });

  const saveRule = useMutation({
    mutationFn: () =>
      api.put("fraud", `/v1/fraud-rules/${editRule!.id}`, {
        name: editRule!.name,
        description: editRule!.description ?? "",
        updated_by: "console",
      }),
    onSuccess: () => { toast.success("Rule updated"); setEditRule(null); refresh(); },
    onError: fail("Could not update the rule"),
  });

  const rescore = useMutation({
    mutationFn: () =>
      api.patch("fraud", `/v1/fraud-cases/${scoreFor!.id}/risk-score`, { risk_score: newScore, updated_by: "console" }),
    onSuccess: () => { toast.success("Risk score updated"); setScoreFor(null); refresh(); },
    onError: fail("Could not update the risk score"),
  });

  const ruleTransition = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.post("fraud", `/v1/fraud-rules/${id}/${action.toLowerCase()}`, { updated_by: "console" }),
    onSuccess: (_r, v) => { toast.success(`Rule ${v.action.toLowerCase()}d`); refresh(); },
    onError: fail("The rule transition was rejected"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const counts = dashQ.data?.status_counts ?? {};
  const openCases = (counts.OPEN ?? 0) + (counts.INVESTIGATING ?? 0) + (counts.ESCALATED ?? 0);
  const criticalOpen = cases.filter((c) => c.risk_level === "CRITICAL" && c.status !== "CLOSED").length;

  const CASE_NEEDS_INPUT = new Set(["INVESTIGATE", "ESCALATE", "RESOLVE", "FALSE_POSITIVE"]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Fraud &amp; Risk
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Abuse detection and case management. AI scores and recommends; every case decision here is a human one.
          </p>
        </div>
        <button
          onClick={() => (tab === "rules" ? setRuleOpen(true) : tab === "signals" ? setSignalOpen(true) : setCaseOpen(true))}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {tab === "rules" ? "+ Fraud Rule" : tab === "signals" ? "+ Risk Signal" : "+ Fraud Case"}
        </button>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="OPEN CASES" value={dashQ.isLoading ? "…" : String(openCases)} hint="Open + investigating + escalated" />
        <SummaryTile label="ESCALATED" value={dashQ.isLoading ? "…" : String(counts.ESCALATED ?? 0)} hint={(counts.ESCALATED ?? 0) > 0 ? "Needs senior review" : "None"} />
        <SummaryTile label="CRITICAL RISK" value={casesQ.isLoading ? "…" : String(criticalOpen)} hint="Unclosed, this page" />
        <SummaryTile
          label="ACTIVE RULES"
          value={activeRulesQ.isLoading ? "…" : String((activeRulesQ.data ?? []).length)}
          hint={(activeRulesQ.data ?? []).length === 0 ? "Nothing is being scored" : `${counts.FALSE_POSITIVE ?? 0} false positives — retune?`}
        />
      </div>

      <div className="self-stretch flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
          <SubTab active={tab === "cases"} onClick={() => setTab("cases")} label={`Cases (${cases.length})`} />
          <SubTab active={tab === "signals"} onClick={() => setTab("signals")} label="Risk Signals" />
          <SubTab active={tab === "rules"} onClick={() => setTab("rules")} label="Fraud Rules" />
        </div>
        {tab === "cases" && (
          <div className="flex gap-2">
            <select className={`${inputClass} w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {["OPEN", "INVESTIGATING", "ESCALATED", "RESOLVED", "FALSE_POSITIVE", "CLOSED"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className={`${inputClass} w-auto`} value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="">All risk levels</option>
              {RISK_LEVELS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Cases */}
      {tab === "cases" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RISK</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PRIORITY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBJECT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ASSIGNED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={8}
                  loading={casesQ.isLoading}
                  error={casesQ.error}
                  empty={cases.length === 0}
                  loadingLabel="Loading fraud cases…"
                  emptyLabel="No fraud cases match this filter."
                />
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(c.id)}</div>
                      {c.description && <div className="text-[11px] text-slate-600 whitespace-normal max-w-[200px] mt-0.5">{c.description}</div>}
                      <DetailToggle open={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} />
                      {expanded === c.id && (
                        <RecordDetail service="fraud" path={`/v1/fraud-cases/${c.id}`} queryKey={["fraud", "case", c.id]} />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                      {c.case_type}
                      <div className="text-[10px] text-slate-400 font-mono">{c.jurisdiction_code || c.country_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => { setNewScore(0); setScoreFor(c); }}
                        title="Re-score this case"
                        className="cursor-pointer"
                      >
                        <StatusPill status={c.risk_level} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs">{c.priority}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                      {c.customer_id && <div>cust {shortId(c.customer_id)}</div>}
                      {c.subscriber_id && <div>sub {shortId(c.subscriber_id)}</div>}
                      {c.account_id && <div>acct {shortId(c.account_id)}</div>}
                      {!c.customer_id && !c.subscriber_id && !c.account_id && "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-600">{c.assigned_to || "—"}</td>
                    <td className="px-6 py-4"><StatusPill status={c.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        <button
                          onClick={() => setSignalsFor(c)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Signals
                        </button>
                        <TransitionButtons
                          table={FRAUD_CASE_TRANSITIONS}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Signals */}
      {tab === "signals" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SIGNAL</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SOURCE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MODEL CONFIDENCE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DETECTED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={5}
                  loading={signalsQ.isLoading}
                  error={signalsQ.error}
                  empty={(signalsQ.data ?? []).length === 0}
                  loadingLabel="Loading risk signals…"
                  emptyLabel="No risk signals recorded."
                />
                {(signalsQ.data ?? []).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-700">{shortId(s.id)}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{s.signal_source}</td>
                    <td className="px-6 py-4 text-xs">{s.signal_type}</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {s.model_confidence != null ? `${(s.model_confidence * 100).toFixed(1)}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(s.detected_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rules */}
      {tab === "rules" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RULE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CREATED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={5}
                  loading={rulesQ.isLoading}
                  error={rulesQ.error}
                  empty={rules.length === 0}
                  loadingLabel="Loading rules…"
                  emptyLabel="No fraud rules. Nothing is being scored automatically."
                />
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{r.name}</div>
                      {r.description && <div className="text-[10px] text-slate-500 whitespace-normal max-w-[260px]">{r.description}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{r.rule_type}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusPill status={r.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        <button
                          onClick={() => setEditRule(r)}
                          className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <TransitionButtons
                          table={RULE_TRANSITIONS}
                          status={r.status}
                          pending={ruleTransition.isPending}
                          onAction={(action) => ruleTransition.mutate({ id: r.id, action })}
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
          title="Open a fraud case"
          subtitle="At least one subject (customer, subscriber or account) should be set so the case is actionable."
          onClose={() => setCaseOpen(false)}
          footer={<ModalActions onCancel={() => setCaseOpen(false)} onConfirm={() => createCase.mutate()} confirmLabel="Open case" pendingLabel="Opening…" pending={createCase.isPending} disabled={!caseForm.description} />}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Case type">
              <select className={inputClass} value={caseForm.case_type} onChange={(e) => setCaseForm({ ...caseForm, case_type: e.target.value })}>
                {CASE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Initial risk score" hint="0–100. Drives the case risk level.">
              <input type="number" min={0} max={100} className={inputMonoClass} value={caseForm.risk_score} onChange={(e) => setCaseForm({ ...caseForm, risk_score: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Description">
            <input className={inputClass} value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Customer ID"><input className={inputMonoClass} value={caseForm.customer_id} onChange={(e) => setCaseForm({ ...caseForm, customer_id: e.target.value })} /></Field>
            <Field label="Subscriber ID"><input className={inputMonoClass} value={caseForm.subscriber_id} onChange={(e) => setCaseForm({ ...caseForm, subscriber_id: e.target.value })} /></Field>
            <Field label="Account ID"><input className={inputMonoClass} value={caseForm.account_id} onChange={(e) => setCaseForm({ ...caseForm, account_id: e.target.value })} /></Field>
          </div>
        </Modal>
      )}

      {ruleOpen && (
        <Modal
          title="Create a fraud rule"
          subtitle="Created in DRAFT. A rule only scores traffic once ACTIVE."
          width="w-[560px]"
          onClose={() => setRuleOpen(false)}
          footer={<ModalActions onCancel={() => setRuleOpen(false)} onConfirm={() => createRule.mutate()} confirmLabel="Create rule" pendingLabel="Creating…" pending={createRule.isPending} disabled={!ruleForm.name || !!configError} />}
        >
          <Field label="Name"><input className={inputClass} value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} /></Field>
          <Field label="Description"><input className={inputClass} value={ruleForm.description} onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })} /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Rule type">
              <select className={inputClass} value={ruleForm.rule_type} onChange={(e) => setRuleForm({ ...ruleForm, rule_type: e.target.value })}>
                {RULE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Output type">
              <select className={inputClass} value={ruleForm.output_type} onChange={(e) => setRuleForm({ ...ruleForm, output_type: e.target.value })}>
                {["SCORE", "FLAG", "BLOCK"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Output score" hint="Contribution to the case score.">
              <input type="number" className={inputMonoClass} value={ruleForm.output_score} onChange={(e) => setRuleForm({ ...ruleForm, output_score: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Config (JSON)">
            <textarea
              className={`${inputMonoClass} h-32 resize-y`}
              value={ruleForm.config_json}
              onChange={(e) => {
                setRuleForm({ ...ruleForm, config_json: e.target.value });
                try { JSON.parse(e.target.value); setConfigError(null); } catch (err) { setConfigError((err as Error).message); }
              }}
            />
          </Field>
          {configError && <p className="text-[11px] text-rose-600 -mt-2">Invalid JSON: {configError}</p>}
          <p className="text-[10px] text-slate-400">
            A rule may score and flag. It cannot suspend a subscriber or close a case on its own — that is a governed
            human action (P1-11).
          </p>
        </Modal>
      )}

      {signalOpen && (
        <Modal
          title="Record a risk signal"
          subtitle="Model provenance is mandatory for an AI-sourced signal: id, version, confidence and explanation."
          width="w-[560px]"
          onClose={() => setSignalOpen(false)}
          footer={<ModalActions onCancel={() => setSignalOpen(false)} onConfirm={() => createSignal.mutate()} confirmLabel="Record signal" pendingLabel="Recording…" pending={createSignal.isPending} disabled={!signalForm.signal_type} />}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fraud case" hint="Optional — a signal can precede a case.">
              <select className={inputClass} value={signalForm.fraud_case_id} onChange={(e) => setSignalForm({ ...signalForm, fraud_case_id: e.target.value })}>
                <option value="">— none —</option>
                {cases.map((c) => <option key={c.id} value={c.id}>{shortId(c.id)} · {c.case_type}</option>)}
              </select>
            </Field>
            <Field label="Source">
              <select className={inputClass} value={signalForm.signal_source} onChange={(e) => setSignalForm({ ...signalForm, signal_source: e.target.value })}>
                {SIGNAL_SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Signal type"><input className={inputMonoClass} value={signalForm.signal_type} onChange={(e) => setSignalForm({ ...signalForm, signal_type: e.target.value.toUpperCase() })} placeholder="VELOCITY_BREACH" /></Field>
            <Field label="Signal score"><input type="number" className={inputMonoClass} value={signalForm.signal_score} onChange={(e) => setSignalForm({ ...signalForm, signal_score: Number(e.target.value) })} /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Model ID"><input className={inputMonoClass} value={signalForm.model_id} onChange={(e) => setSignalForm({ ...signalForm, model_id: e.target.value })} /></Field>
            <Field label="Model version"><input className={inputMonoClass} value={signalForm.model_version} onChange={(e) => setSignalForm({ ...signalForm, model_version: e.target.value })} /></Field>
            <Field label="Confidence" hint="0–1.">
              <input type="number" step="0.01" min={0} max={1} className={inputMonoClass} value={signalForm.model_confidence} onChange={(e) => setSignalForm({ ...signalForm, model_confidence: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Model explanation" hint="Required by P1-11 for any AI-derived signal.">
            <input className={inputClass} value={signalForm.model_explanation} onChange={(e) => setSignalForm({ ...signalForm, model_explanation: e.target.value })} />
          </Field>
          <Field label="Raw signal (JSON)">
            <textarea className={`${inputMonoClass} h-24 resize-y`} value={signalForm.raw_signal} onChange={(e) => setSignalForm({ ...signalForm, raw_signal: e.target.value })} />
          </Field>
        </Modal>
      )}

      {caseAction && (
        <Modal
          title={`${caseAction.action.replace(/_/g, " ").toLowerCase()} case`}
          subtitle={caseAction.item.description ?? shortId(caseAction.item.id)}
          onClose={() => { setCaseAction(null); setAssignedTo(""); setReason(""); setNotes(""); setRecommendedAction(""); }}
          footer={
            <ModalActions
              onCancel={() => { setCaseAction(null); setAssignedTo(""); setReason(""); setNotes(""); setRecommendedAction(""); }}
              onConfirm={() => caseTransition.mutate({ item: caseAction.item, action: caseAction.action })}
              confirmLabel="Confirm"
              pendingLabel="Working…"
              pending={caseTransition.isPending}
              disabled={
                caseAction.action === "INVESTIGATE" ? !assignedTo.trim()
                  : caseAction.action === "RESOLVE" ? !notes.trim()
                  : !reason.trim()
              }
              destructive={caseAction.action === "ESCALATE" || caseAction.action === "FALSE_POSITIVE"}
            />
          }
        >
          {caseAction.action === "INVESTIGATE" && (
            <Field label="Assign to"><input className={inputClass} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} /></Field>
          )}
          {caseAction.action === "RESOLVE" && (
            <>
              <Field label="Resolution notes" hint="The human decision. Required.">
                <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Field>
              <Field
                label="AI recommended action"
                hint="Recorded as a recommendation only — it does not itself change anything (P1-11)."
              >
                <input className={inputClass} value={recommendedAction} onChange={(e) => setRecommendedAction(e.target.value)} />
              </Field>
            </>
          )}
          {(caseAction.action === "ESCALATE" || caseAction.action === "FALSE_POSITIVE") && (
            <Field label="Reason"><input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
          )}
        </Modal>
      )}

      {scoreFor && (
        <Modal
          title="Re-score this case"
          subtitle={`Currently ${scoreFor.risk_level}. Re-scoring is not a lifecycle change — the case stays ${scoreFor.status}.`}
          onClose={() => setScoreFor(null)}
          footer={<ModalActions onCancel={() => setScoreFor(null)} onConfirm={() => rescore.mutate()} confirmLabel="Update score" pendingLabel="Updating…" pending={rescore.isPending} />}
        >
          <Field label="Risk score" hint="0–100. The service derives the risk level from it.">
            <input type="number" min={0} max={100} className={inputMonoClass} value={newScore} onChange={(e) => setNewScore(Number(e.target.value))} />
          </Field>
        </Modal>
      )}

      {editRule && (
        <Modal
          title="Edit rule"
          subtitle="Name and description only. Changing what a rule DOES means retiring it and creating a new one, so its scoring history stays attributable."
          onClose={() => setEditRule(null)}
          footer={<ModalActions onCancel={() => setEditRule(null)} onConfirm={() => saveRule.mutate()} confirmLabel="Save" pendingLabel="Saving…" pending={saveRule.isPending} disabled={!editRule.name.trim()} />}
        >
          <Field label="Name">
            <input className={inputClass} value={editRule.name} onChange={(e) => setEditRule({ ...editRule, name: e.target.value })} />
          </Field>
          <Field label="Description">
            <input className={inputClass} value={editRule.description ?? ""} onChange={(e) => setEditRule({ ...editRule, description: e.target.value })} />
          </Field>
        </Modal>
      )}

      {signalsFor && (
        <Modal
          title={`Signals · ${shortId(signalsFor.id)}`}
          subtitle="Everything the detection layer contributed to this case."
          width="w-[600px]"
          onClose={() => setSignalsFor(null)}
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr><th className="px-3 py-2">SOURCE</th><th className="px-3 py-2">TYPE</th><th className="px-3 py-2">CONFIDENCE</th><th className="px-3 py-2">DETECTED</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState
                  colSpan={4}
                  loading={caseSignalsQ.isLoading}
                  error={caseSignalsQ.error}
                  empty={(caseSignalsQ.data ?? []).length === 0}
                  emptyLabel="No signals attached to this case."
                />
                {(caseSignalsQ.data ?? []).map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2 font-mono text-slate-600">{s.signal_source}</td>
                    <td className="px-3 py-2">{s.signal_type}</td>
                    <td className="px-3 py-2 font-mono">{s.model_confidence != null ? `${(s.model_confidence * 100).toFixed(1)}%` : "—"}</td>
                    <td className="px-3 py-2 text-slate-500">{new Date(s.detected_at).toLocaleString()}</td>
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
