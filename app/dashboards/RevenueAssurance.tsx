"use client";

/**
 * Revenue Assurance console — revenue-assurance service (8087).
 *
 * Detects revenue *leakage*: money that should have been billed and was not.
 * Deliberately a separate engine from Fraud & Risk (CLAUDE.md P1-9) — RA finds
 * leakage, Fraud finds abuse. They may share a case layer but never a screen,
 * because conflating "we under-billed" with "someone is stealing" produces the
 * wrong response to both.
 *
 * The shape of the domain:
 *
 *   assurance rule  →  reconciliation run  →  leakage case
 *
 * A rule defines what to check; a run applies the active rules over a period
 * and reports checked/matched/mismatched/missing; each mismatch it cannot
 * explain becomes a leakage case an analyst works.
 *
 * WRITTEN_OFF and FALSE_POSITIVE are both terminal and both look like "closed",
 * but they mean opposite things — the leak was real and abandoned, versus there
 * was no leak. They are never merged in the tiles for that reason.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { LEAKAGE_CASE_TRANSITIONS, RECON_RUN_TRANSITIONS, RULE_TRANSITIONS } from "@/lib/admin/transitions";
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
import { CurrencySelect } from "./CodeFields";
import { asRFC3339, monthStart, today } from "@/lib/admin/dates";

interface ReconRun {
  id: string;
  run_type: string;
  status: string;
  period_start: string;
  period_end: string;
  records_checked: number;
  records_matched: number;
  records_mismatched: number;
  records_missing: number;
  leakage_cases_opened: number;
  started_at: string;
  completed_at?: string;
}

interface LeakageCase {
  id: string;
  run_id: string;
  leakage_type: string;
  severity: string;
  status: string;
  source_aggregate_type?: string;
  source_aggregate_id?: string;
  description: string;
  leakage_amount_minor_units?: number;
  currency_code?: string;
  resolution_notes?: string;
  assigned_to?: string;
  detected_at: string;
  resolved_at?: string;
}

interface AssuranceRule {
  id: string;
  name: string;
  description?: string;
  rule_type: string;
  status: string;
  config_json: string;
  applicable_run_type: string;
  created_at: string;
  updated_at: string;
}

const RUN_TYPES = ["USAGE_TO_RATED", "RATED_TO_INVOICE", "INVOICE_TO_PAYMENT", "PAYMENT_TO_LEDGER", "PARTNER_SETTLEMENT"];
const LEAKAGE_TYPES = ["UNRATED_USAGE", "UNBILLED_CHARGE", "UNDER_CHARGED", "MISSING_PAYMENT", "LEDGER_MISMATCH", "PARTNER_SHORTFALL"];
const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const RULE_TYPES = ["THRESHOLD", "COUNT_MATCH", "AMOUNT_MATCH", "COMPLETENESS", "DUPLICATE"];


export default function RevenueAssurance() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"cases" | "runs" | "rules">("cases");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [runOpen, setRunOpen] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [caseAction, setCaseAction] = useState<{ item: LeakageCase; action: string } | null>(null);
  const [runAction, setRunAction] = useState<{ item: ReconRun; action: string } | null>(null);
  const [severityFilter, setSeverityFilter] = useState("");
  const [editRule, setEditRule] = useState<AssuranceRule | null>(null);
  /** Leakage found by one run - its own endpoint, not a client-side filter. */
  const [runCasesFor, setRunCasesFor] = useState<ReconRun | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refresh = () => qc.invalidateQueries({ queryKey: ["ra"] });

  // ─── Queries ────────────────────────────────────────────────────────────────

  const casesQ = useQuery({
    queryKey: ["ra", "cases", severityFilter],
    queryFn: async () =>
      listOf<LeakageCase>(
        await api.get("revenueAssurance", `/v1/leakage-cases?page_size=100${severityFilter ? `&severity=${severityFilter}` : ""}`),
        ENVELOPE.assurance,
      ),
  });
  const cases = casesQ.data ?? [];

  const runsQ = useQuery({
    queryKey: ["ra", "runs"],
    enabled: tab === "runs",
    queryFn: async () =>
      listOf<ReconRun>(await api.get("revenueAssurance", "/v1/reconciliation-runs?page_size=100"), ENVELOPE.assurance),
  });
  const runs = runsQ.data ?? [];

  const rulesQ = useQuery({
    queryKey: ["ra", "rules"],
    enabled: tab === "rules",
    queryFn: async () =>
      listOf<AssuranceRule>(await api.get("revenueAssurance", "/v1/assurance-rules?page_size=100"), ENVELOPE.assurance),
  });
  const rules = rulesQ.data ?? [];

  /** Active rules only - "what is actually checking" vs "what exists". */
  const activeRulesQ = useQuery({
    queryKey: ["ra", "rules", "active"],
    queryFn: async () =>
      listOf<AssuranceRule>(await api.get("revenueAssurance", "/v1/assurance-rules/active"), ENVELOPE.assurance),
  });

  const runCasesQ = useQuery({
    queryKey: ["ra", "run-cases", runCasesFor?.id],
    enabled: !!runCasesFor,
    queryFn: async () =>
      listOf<LeakageCase>(
        await api.get("revenueAssurance", `/v1/reconciliation-runs/${runCasesFor!.id}/leakage-cases`),
        ENVELOPE.assurance,
      ),
  });

  const caseDashQ = useQuery({
    queryKey: ["ra", "cases", "dashboard"],
    queryFn: () => api.get<{ status_counts?: Record<string, number> }>("revenueAssurance", "/v1/leakage-cases/dashboard"),
  });
  const runDashQ = useQuery({
    queryKey: ["ra", "runs", "dashboard"],
    queryFn: () => api.get<{ status_counts?: Record<string, number> }>("revenueAssurance", "/v1/reconciliation-runs/dashboard"),
  });

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [runForm, setRunForm] = useState({ run_type: RUN_TYPES[0], period_start: monthStart(), period_end: today() });
  const [caseForm, setCaseForm] = useState({
    run_id: "",
    leakage_type: LEAKAGE_TYPES[0],
    severity: "MEDIUM",
    description: "",
    leakage_amount_minor_units: 0,
    currency_code: "GBP",
    source_aggregate_type: "",
    source_aggregate_id: "",
  });
  const [ruleForm, setRuleForm] = useState({
    name: "",
    description: "",
    rule_type: RULE_TYPES[0],
    applicable_run_type: RUN_TYPES[0],
    config_json: '{\n  "tolerance_bps": 100\n}',
  });
  const [configError, setConfigError] = useState<string | null>(null);

  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [runResult, setRunResult] = useState({
    records_checked: 0,
    records_matched: 0,
    records_mismatched: 0,
    records_missing: 0,
    leakage_cases_opened: 0,
    summary_notes: "",
    error_details: "",
  });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createRun = useMutation({
    mutationFn: () =>
      api.post("revenueAssurance", "/v1/reconciliation-runs", {
        run_type: runForm.run_type,
        period_start: asRFC3339(runForm.period_start),
        period_end: asRFC3339(runForm.period_end),
        created_by: "console",
      }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Reconciliation run started"); setRunOpen(false); refresh(); },
    onError: fail("Could not start the run"),
  });

  const createCase = useMutation({
    mutationFn: () =>
      api.post("revenueAssurance", "/v1/leakage-cases", {
        run_id: caseForm.run_id,
        leakage_type: caseForm.leakage_type,
        severity: caseForm.severity,
        description: caseForm.description,
        // Optional: some leakage is structural and has no quantified amount yet.
        ...(caseForm.leakage_amount_minor_units ? { leakage_amount_minor_units: caseForm.leakage_amount_minor_units } : {}),
        currency_code: caseForm.currency_code,
        source_aggregate_type: caseForm.source_aggregate_type,
        source_aggregate_id: caseForm.source_aggregate_id,
        created_by: "console",
      }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Leakage case opened"); setCaseOpen(false); refresh(); },
    onError: fail("Could not open the leakage case"),
  });

  const createRule = useMutation({
    mutationFn: () => {
      try {
        JSON.parse(ruleForm.config_json);
      } catch (err) {
        throw new Error(`config_json is not valid JSON: ${(err as Error).message}`);
      }
      return api.post("revenueAssurance", "/v1/assurance-rules", {
        name: ruleForm.name,
        description: ruleForm.description,
        rule_type: ruleForm.rule_type,
        applicable_run_type: ruleForm.applicable_run_type,
        config_json: ruleForm.config_json,
        created_by: "console",
      });
    },
    onSuccess: () => { toast.success("Rule created in DRAFT — activate it to include it in runs"); setRuleOpen(false); refresh(); },
    onError: fail("Could not create the rule"),
  });

  const caseTransition = useMutation({
    mutationFn: ({ item, action }: { item: LeakageCase; action: string }) => {
      const base = `/v1/leakage-cases/${item.id}`;
      switch (action) {
        case "INVESTIGATE":
          return api.post("revenueAssurance", `${base}/investigate`, { assigned_to: assignedTo, updated_by: "console" });
        case "RESOLVE":
          return api.post("revenueAssurance", `${base}/resolve`, { resolution_notes: notes, updated_by: "console" });
        case "WRITE_OFF":
          return api.post("revenueAssurance", `${base}/write-off`, { reason, updated_by: "console" });
        case "FALSE_POSITIVE":
          return api.post("revenueAssurance", `${base}/false-positive`, { reason, updated_by: "console" });
        default:
          return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Case ${v.action.replace(/_/g, " ").toLowerCase()}`);
      setCaseAction(null); setAssignedTo(""); setNotes(""); setReason("");
      refresh();
    },
    onError: fail("The case transition was rejected"),
  });

  const runTransition = useMutation({
    mutationFn: ({ item, action }: { item: ReconRun; action: string }) => {
      const base = `/v1/reconciliation-runs/${item.id}`;
      const body = {
        records_checked: runResult.records_checked,
        records_matched: runResult.records_matched,
        records_mismatched: runResult.records_mismatched,
        records_missing: runResult.records_missing,
        leakage_cases_opened: runResult.leakage_cases_opened,
        summary_notes: runResult.summary_notes,
        updated_by: "console",
      };
      switch (action) {
        case "COMPLETE":
          return api.post("revenueAssurance", `${base}/complete`, body);
        case "PARTIAL":
          return api.post("revenueAssurance", `${base}/partial`, { ...body, error_details: runResult.error_details });
        case "FAIL":
          return api.post("revenueAssurance", `${base}/fail`, { error_details: runResult.error_details, updated_by: "console" });
        default:
          return Promise.reject(new Error(`Unmapped action ${action}`));
      }
    },
    onSuccess: (_r, v) => { toast.success(`Run ${v.action.toLowerCase()}d`); setRunAction(null); refresh(); },
    onError: fail("The run transition was rejected"),
  });

  const saveRule = useMutation({
    mutationFn: () =>
      api.put("revenueAssurance", `/v1/assurance-rules/${editRule!.id}`, {
        name: editRule!.name,
        description: editRule!.description ?? "",
        config_json: editRule!.config_json,
        updated_by: "console",
      }),
    onSuccess: () => { toast.success("Rule updated"); setEditRule(null); refresh(); },
    onError: fail("Could not update the rule"),
  });

  const ruleTransition = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.post("revenueAssurance", `/v1/assurance-rules/${id}/${action.toLowerCase()}`, { updated_by: "console" }),
    onSuccess: (_r, v) => { toast.success(`Rule ${v.action.toLowerCase()}d`); refresh(); },
    onError: fail("The rule transition was rejected"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const counts = caseDashQ.data?.status_counts ?? {};
  const openCases = (counts.OPEN ?? 0) + (counts.UNDER_INVESTIGATION ?? 0);
  const leakByCurrency = cases
    .filter((c) => c.status === "OPEN" || c.status === "UNDER_INVESTIGATION")
    .reduce<Record<string, number>>((acc, c) => {
      if (c.leakage_amount_minor_units == null) return acc;
      const cur = c.currency_code || "GBP";
      acc[cur] = (acc[cur] ?? 0) + c.leakage_amount_minor_units;
      return acc;
    }, {});
  const leakCurrencies = Object.keys(leakByCurrency);

  const CASE_NEEDS_INPUT = new Set(["INVESTIGATE", "RESOLVE", "WRITE_OFF", "FALSE_POSITIVE"]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Revenue Assurance
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Leakage detection: revenue that should have been billed and was not. Separate from Fraud &amp; Risk by design.
          </p>
        </div>
        <button
          onClick={() => (tab === "rules" ? setRuleOpen(true) : tab === "runs" ? setRunOpen(true) : setCaseOpen(true))}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {tab === "rules" ? "+ Assurance Rule" : tab === "runs" ? "+ Reconciliation Run" : "+ Leakage Case"}
        </button>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="OPEN LEAKAGE" value={caseDashQ.isLoading ? "…" : String(openCases)} hint="Open + under investigation" />
        <SummaryTile
          label="QUANTIFIED LEAKAGE"
          value={leakCurrencies.length === 0 ? "—" : leakCurrencies.map((c) => formatMoney(leakByCurrency[c], c)).join("  ·  ")}
          hint="Open cases with an amount"
        />
        <SummaryTile label="WRITTEN OFF" value={caseDashQ.isLoading ? "…" : String(counts.WRITTEN_OFF ?? 0)} hint="Real, abandoned" />
        <SummaryTile
          label="ACTIVE RULES"
          value={activeRulesQ.isLoading ? "…" : String((activeRulesQ.data ?? []).length)}
          hint={(activeRulesQ.data ?? []).length === 0 ? "Runs will check nothing" : `${counts.FALSE_POSITIVE ?? 0} false positives`}
        />
      </div>

      <div className="self-stretch flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
          <SubTab active={tab === "cases"} onClick={() => setTab("cases")} label={`Leakage Cases (${cases.length})`} />
          <SubTab active={tab === "runs"} onClick={() => setTab("runs")} label="Reconciliation Runs" />
          <SubTab active={tab === "rules"} onClick={() => setTab("rules")} label="Assurance Rules" />
        </div>
        {tab === "cases" && (
          <select className={`${inputClass} w-auto`} value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="">All severities</option>
            {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        )}
      </div>

      {/* Leakage cases */}
      {tab === "cases" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SEVERITY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AMOUNT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SOURCE</th>
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
                  loadingLabel="Loading leakage cases…"
                  emptyLabel="No leakage cases. Either the runs are clean or no rules are active."
                />
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(c.id)}</div>
                      <div className="text-[11px] text-slate-600 whitespace-normal max-w-[220px] mt-0.5">{c.description}</div>
                      <DetailToggle open={expanded === c.id} onToggle={() => setExpanded(expanded === c.id ? null : c.id)} />
                      {expanded === c.id && (
                        <RecordDetail service="revenueAssurance" path={`/v1/leakage-cases/${c.id}`} queryKey={["ra", "case", c.id]} />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.leakage_type}</td>
                    <td className="px-6 py-4"><StatusPill status={c.severity} /></td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {c.leakage_amount_minor_units != null ? formatMoney(c.leakage_amount_minor_units, c.currency_code) : "unquantified"}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500">
                      {c.source_aggregate_type ? `${c.source_aggregate_type} ${shortId(c.source_aggregate_id)}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-600">{c.assigned_to || "—"}</td>
                    <td className="px-6 py-4"><StatusPill status={c.status} /></td>
                    <td className="px-6 py-4">
                      <TransitionButtons
                        table={LEAKAGE_CASE_TRANSITIONS}
                        status={c.status}
                        pending={caseTransition.isPending}
                        onAction={(action) =>
                          CASE_NEEDS_INPUT.has(action) ? setCaseAction({ item: c, action }) : caseTransition.mutate({ item: c, action })
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

      {/* Reconciliation runs */}
      {tab === "runs" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RUN</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CHECKED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MATCHED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MISMATCHED</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">MISSING</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CASES</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={9}
                  loading={runsQ.isLoading}
                  error={runsQ.error}
                  empty={runs.length === 0}
                  loadingLabel="Loading reconciliation runs…"
                  emptyLabel="No reconciliation runs yet."
                />
                {runs.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-700">{r.run_type}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{shortId(r.id)}</div>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(r.period_start).toLocaleDateString()} → {new Date(r.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{r.records_checked.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-600">{r.records_matched.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-amber-600">{r.records_mismatched.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-rose-600">{r.records_missing.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">{r.leakage_cases_opened}</td>
                    <td className="px-6 py-4"><StatusPill status={r.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                      {r.leakage_cases_opened > 0 && (
                        <button onClick={() => setRunCasesFor(r)} className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer">Leakage</button>
                      )}
                      <TransitionButtons
                        table={RECON_RUN_TRANSITIONS}
                        status={r.status}
                        pending={runTransition.isPending}
                        onAction={(action) => {
                          setRunResult((s) => ({
                            ...s,
                            records_checked: r.records_checked,
                            records_matched: r.records_matched,
                            records_mismatched: r.records_mismatched,
                            records_missing: r.records_missing,
                            leakage_cases_opened: r.leakage_cases_opened,
                          }));
                          setRunAction({ item: r, action });
                        }}
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

      {/* Rules */}
      {tab === "rules" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RULE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">APPLIES TO</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CONFIG</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={rulesQ.isLoading}
                  error={rulesQ.error}
                  empty={rules.length === 0}
                  loadingLabel="Loading rules…"
                  emptyLabel="No assurance rules. Without an active rule a reconciliation run checks nothing."
                />
                {rules.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{r.name}</div>
                      {r.description && <div className="text-[10px] text-slate-500 whitespace-normal max-w-[220px]">{r.description}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{r.rule_type}</td>
                    <td className="px-6 py-4 text-[11px] font-mono text-slate-500">{r.applicable_run_type}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500 whitespace-normal max-w-[200px] break-all">
                      {r.config_json}
                    </td>
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
      {runOpen && (
        <Modal
          title="Start a reconciliation run"
          subtitle="Applies every ACTIVE rule for this run type over the period."
          onClose={() => setRunOpen(false)}
          footer={<ModalActions onCancel={() => setRunOpen(false)} onConfirm={() => createRun.mutate()} confirmLabel="Start run" pendingLabel="Starting…" pending={createRun.isPending} />}
        >
          <Field label="Run type">
            <select className={inputClass} value={runForm.run_type} onChange={(e) => setRunForm({ ...runForm, run_type: e.target.value })}>
              {RUN_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Period start">
              <input type="date" className={inputClass} value={runForm.period_start} onChange={(e) => setRunForm({ ...runForm, period_start: e.target.value })} />
            </Field>
            <Field label="Period end">
              <input type="date" className={inputClass} value={runForm.period_end} onChange={(e) => setRunForm({ ...runForm, period_end: e.target.value })} />
            </Field>
          </div>
          <p className="text-[10px] text-slate-400">
            {rules.filter((r) => r.status === "ACTIVE" && r.applicable_run_type === runForm.run_type).length} active rule(s) apply to this run type.
          </p>
        </Modal>
      )}

      {caseOpen && (
        <Modal
          title="Open a leakage case"
          subtitle="Use this for leakage found outside a reconciliation run."
          width="w-[560px]"
          onClose={() => setCaseOpen(false)}
          footer={<ModalActions onCancel={() => setCaseOpen(false)} onConfirm={() => createCase.mutate()} confirmLabel="Open case" pendingLabel="Opening…" pending={createCase.isPending} disabled={!caseForm.run_id || !caseForm.description} />}
        >
          <Field label="Reconciliation run" hint="The run this leakage belongs to.">
            <select className={inputClass} value={caseForm.run_id} onChange={(e) => setCaseForm({ ...caseForm, run_id: e.target.value })}>
              <option value="">— select a run —</option>
              {runs.map((r) => (
                <option key={r.id} value={r.id}>{r.run_type} · {new Date(r.period_start).toLocaleDateString()}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Leakage type">
              <select className={inputClass} value={caseForm.leakage_type} onChange={(e) => setCaseForm({ ...caseForm, leakage_type: e.target.value })}>
                {LEAKAGE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Severity">
              <select className={inputClass} value={caseForm.severity} onChange={(e) => setCaseForm({ ...caseForm, severity: e.target.value })}>
                {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <input className={inputClass} value={caseForm.description} onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (minor)" hint="Leave zero if not yet quantified.">
              <input type="number" className={inputMonoClass} value={caseForm.leakage_amount_minor_units} onChange={(e) => setCaseForm({ ...caseForm, leakage_amount_minor_units: Number(e.target.value) })} />
            </Field>
            <Field label="Currency">
              <CurrencySelect
                value={caseForm.currency_code}
                onChange={(v) => setCaseForm({ ...caseForm, currency_code: v })}
                className={inputMonoClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source type" hint="e.g. INVOICE, RATED_USAGE.">
              <input className={inputMonoClass} value={caseForm.source_aggregate_type} onChange={(e) => setCaseForm({ ...caseForm, source_aggregate_type: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Source ID">
              <input className={inputMonoClass} value={caseForm.source_aggregate_id} onChange={(e) => setCaseForm({ ...caseForm, source_aggregate_id: e.target.value })} />
            </Field>
          </div>
        </Modal>
      )}

      {ruleOpen && (
        <Modal
          title="Create an assurance rule"
          subtitle="Created in DRAFT. A rule only participates in runs once ACTIVE."
          width="w-[560px]"
          onClose={() => setRuleOpen(false)}
          footer={<ModalActions onCancel={() => setRuleOpen(false)} onConfirm={() => createRule.mutate()} confirmLabel="Create rule" pendingLabel="Creating…" pending={createRule.isPending} disabled={!ruleForm.name || !!configError} />}
        >
          <Field label="Name">
            <input className={inputClass} value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} />
          </Field>
          <Field label="Description">
            <input className={inputClass} value={ruleForm.description} onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rule type">
              <select className={inputClass} value={ruleForm.rule_type} onChange={(e) => setRuleForm({ ...ruleForm, rule_type: e.target.value })}>
                {RULE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Applies to run type">
              <select className={inputClass} value={ruleForm.applicable_run_type} onChange={(e) => setRuleForm({ ...ruleForm, applicable_run_type: e.target.value })}>
                {RUN_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Config (JSON)" hint="The service stores this opaquely; shape is per rule type.">
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
        </Modal>
      )}

      {editRule && (
        <Modal
          title="Edit assurance rule"
          subtitle="Runs already completed keep the rule as it was; edits apply to future runs only."
          width="w-[560px]"
          onClose={() => setEditRule(null)}
          footer={<ModalActions onCancel={() => setEditRule(null)} onConfirm={() => saveRule.mutate()} confirmLabel="Save" pendingLabel="Saving…" pending={saveRule.isPending} disabled={!editRule.name.trim()} />}
        >
          <Field label="Name"><input className={inputClass} value={editRule.name} onChange={(e) => setEditRule({ ...editRule, name: e.target.value })} /></Field>
          <Field label="Description"><input className={inputClass} value={editRule.description ?? ""} onChange={(e) => setEditRule({ ...editRule, description: e.target.value })} /></Field>
          <Field label="Config (JSON)">
            <textarea className={`${inputMonoClass} h-32 resize-y`} value={editRule.config_json} onChange={(e) => setEditRule({ ...editRule, config_json: e.target.value })} />
          </Field>
        </Modal>
      )}

      {runCasesFor && (
        <Modal
          title="Leakage found by this run"
          subtitle={`${runCasesFor.run_type} · ${runCasesFor.leakage_cases_opened} case(s) opened`}
          width="w-[640px]"
          onClose={() => setRunCasesFor(null)}
        >
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <tr><th className="px-3 py-2">TYPE</th><th className="px-3 py-2">SEVERITY</th><th className="px-3 py-2">AMOUNT</th><th className="px-3 py-2">STATUS</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableState colSpan={4} loading={runCasesQ.isLoading} error={runCasesQ.error} empty={(runCasesQ.data ?? []).length === 0} emptyLabel="No leakage cases attached to this run." />
                {(runCasesQ.data ?? []).map((c) => (
                  <tr key={c.id}>
                    <td className="px-3 py-2 text-slate-700">{c.leakage_type}<div className="text-[9px] text-slate-400">{c.description}</div></td>
                    <td className="px-3 py-2"><StatusPill status={c.severity} size="xs" /></td>
                    <td className="px-3 py-2 font-mono">{c.leakage_amount_minor_units != null ? formatMoney(c.leakage_amount_minor_units, c.currency_code) : "—"}</td>
                    <td className="px-3 py-2"><StatusPill status={c.status} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {caseAction && (
        <Modal
          title={`${caseAction.action.replace(/_/g, " ").toLowerCase()} case`}
          subtitle={caseAction.item.description}
          onClose={() => { setCaseAction(null); setAssignedTo(""); setNotes(""); setReason(""); }}
          footer={
            <ModalActions
              onCancel={() => { setCaseAction(null); setAssignedTo(""); setNotes(""); setReason(""); }}
              onConfirm={() => caseTransition.mutate({ item: caseAction.item, action: caseAction.action })}
              confirmLabel="Confirm"
              pendingLabel="Working…"
              pending={caseTransition.isPending}
              disabled={
                caseAction.action === "INVESTIGATE" ? !assignedTo.trim()
                  : caseAction.action === "RESOLVE" ? !notes.trim()
                  : !reason.trim()
              }
              destructive={caseAction.action === "WRITE_OFF" || caseAction.action === "FALSE_POSITIVE"}
            />
          }
        >
          {caseAction.action === "INVESTIGATE" && (
            <Field label="Assign to"><input className={inputClass} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} /></Field>
          )}
          {caseAction.action === "RESOLVE" && (
            <Field label="Resolution notes"><input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
          )}
          {(caseAction.action === "WRITE_OFF" || caseAction.action === "FALSE_POSITIVE") && (
            <Field
              label="Reason"
              hint={
                caseAction.action === "WRITE_OFF"
                  ? "The leak was real and is being abandoned."
                  : "There was no leak — worth checking whether the rule needs tuning."
              }
            >
              <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} />
            </Field>
          )}
        </Modal>
      )}

      {runAction && (
        <Modal
          title={`${runAction.action.toLowerCase()} run`}
          subtitle={`${runAction.item.run_type} · the counts below are recorded as the run's result.`}
          width="w-[560px]"
          onClose={() => setRunAction(null)}
          footer={<ModalActions onCancel={() => setRunAction(null)} onConfirm={() => runTransition.mutate({ item: runAction.item, action: runAction.action })} confirmLabel="Confirm" pendingLabel="Working…" pending={runTransition.isPending} destructive={runAction.action === "FAIL"} />}
        >
          {runAction.action !== "FAIL" && (
            <div className="grid grid-cols-5 gap-2">
              <Field label="Checked"><input type="number" className={inputMonoClass} value={runResult.records_checked} onChange={(e) => setRunResult({ ...runResult, records_checked: Number(e.target.value) })} /></Field>
              <Field label="Matched"><input type="number" className={inputMonoClass} value={runResult.records_matched} onChange={(e) => setRunResult({ ...runResult, records_matched: Number(e.target.value) })} /></Field>
              <Field label="Mismatch"><input type="number" className={inputMonoClass} value={runResult.records_mismatched} onChange={(e) => setRunResult({ ...runResult, records_mismatched: Number(e.target.value) })} /></Field>
              <Field label="Missing"><input type="number" className={inputMonoClass} value={runResult.records_missing} onChange={(e) => setRunResult({ ...runResult, records_missing: Number(e.target.value) })} /></Field>
              <Field label="Cases"><input type="number" className={inputMonoClass} value={runResult.leakage_cases_opened} onChange={(e) => setRunResult({ ...runResult, leakage_cases_opened: Number(e.target.value) })} /></Field>
            </div>
          )}
          {runAction.action !== "FAIL" && (
            <Field label="Summary notes"><input className={inputClass} value={runResult.summary_notes} onChange={(e) => setRunResult({ ...runResult, summary_notes: e.target.value })} /></Field>
          )}
          {(runAction.action === "FAIL" || runAction.action === "PARTIAL") && (
            <Field label="Error details" hint="Why the run could not complete cleanly.">
              <input className={inputClass} value={runResult.error_details} onChange={(e) => setRunResult({ ...runResult, error_details: e.target.value })} />
            </Field>
          )}
        </Modal>
      )}
    </div>
  );
}
