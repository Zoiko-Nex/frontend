"use client";

/**
 * Tax & Jurisdiction console — tax-jurisdiction service (port 8089).
 *
 * This is the runtime Billing asks before it puts tax on an invoice (CLAUDE.md
 * P1-7), so the screen is built around the three things that decide an answer:
 *
 *   1. Jurisdiction policies — versioned rate maps. Exactly one is ACTIVE per
 *      jurisdiction at a time; activating a new one supersedes the old.
 *   2. Tax decisions — the evidenced output. Append-only: a decision is never
 *      edited, a new one is determined. A decision flagged `is_fallback` means
 *      no policy matched and the engine used its default — that is a gap in the
 *      policy set, not a normal outcome, so it is surfaced prominently.
 *   3. Exemptions — per-customer certificates that zero the tax.
 *
 * Rates are basis points (725 = 7.25%), never floats.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatBps, formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, isNotFound, listOf, shortId } from "@/lib/admin/envelope";
import {
  DetailToggle,
  Field,
  Modal,
  ModalActions,
  RecordDetail,
  StatusPill,
  TableState,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";

interface Policy {
  policy_id: string;
  jurisdiction_code: string;
  country_code: string;
  provider_name: string;
  policy_version: string;
  tax_category_map: Record<string, unknown>;
  currency_code: string;
  invoice_language_code: string;
  status: string;
  effective_from: string;
  effective_to?: string;
}

interface Breakdown {
  name: string;
  rate_bps: number;
  amount_minor_units: number;
}

interface TaxDecision {
  tax_decision_id: string;
  jurisdiction_code: string;
  country_code: string;
  tax_category: string;
  taxable_amount_minor_units: number;
  tax_amount_minor_units: number;
  currency_code: string;
  tax_breakdown: Breakdown[];
  is_fallback: boolean;
  exemption_id?: string;
  decided_at: string;
}

interface Exemption {
  exemption_id: string;
  customer_id: string;
  jurisdiction_code: string;
  tax_category?: string;
  certificate_ref: string;
  exemption_reason?: string;
  status: string;
  valid_from: string;
  valid_to?: string;
}

interface TaxDashboard {
  decisions_by_jurisdiction: Record<string, number>;
  fallback_decision_count: number;
}

const TAX_CATEGORIES = ["STANDARD", "REDUCED", "ZERO_RATED", "EXEMPT", "TELECOM", "DIGITAL_SERVICE"];
const AGGREGATE_TYPES = ["INVOICE", "INVOICE_LINE", "ORDER", "USAGE", "QUOTE"];

export default function TaxJurisdiction() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"decisions" | "policies" | "exemptions">("decisions");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [determineOpen, setDetermineOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [exemptionOpen, setExemptionOpen] = useState(false);
  const [revokeFor, setRevokeFor] = useState<Exemption | null>(null);
  const [supersedeFor, setSupersedeFor] = useState<Policy | null>(null);
  const [editFor, setEditFor] = useState<Policy | null>(null);
  /** The result of the most recent determination, shown inline rather than in a toast. */
  const [lastDecision, setLastDecision] = useState<TaxDecision | null>(null);
  /** Which jurisdiction the active-policy lookup is asking about. */
  const [activeLookup, setActiveLookup] = useState("");

  // ─── Queries ────────────────────────────────────────────────────────────────

  const dashQ = useQuery({
    queryKey: ["tax", "dashboard"],
    queryFn: () => api.get<TaxDashboard>("tax", "/v1/tax-decisions/dashboard"),
  });

  const decisionsQ = useQuery({
    queryKey: ["tax", "decisions"],
    queryFn: async () => listOf<TaxDecision>(await api.get("tax", "/v1/tax-decisions?page_size=100"), ENVELOPE.tax),
  });
  const decisions = decisionsQ.data ?? [];

  const policiesQ = useQuery({
    queryKey: ["tax", "policies"],
    queryFn: async () => listOf<Policy>(await api.get("tax", "/v1/jurisdiction-policies?page_size=100"), ENVELOPE.tax),
  });
  const policies = policiesQ.data ?? [];

  /**
   * The one policy actually governing a jurisdiction right now. Derivable
   * from the list, but the service answers it directly and authoritatively -
   * the list is paginated and could omit the active one.
   */
  const activePolicyQ = useQuery({
    queryKey: ["tax", "active-policy", activeLookup],
    enabled: !!activeLookup,
    retry: false,
    queryFn: async () => {
      try {
        return await api.get<Policy>("tax", `/v1/jurisdiction-policies/active?jurisdiction_code=${encodeURIComponent(activeLookup)}`);
      } catch (e) {
        if (isNotFound(e)) return null;
        throw e;
      }
    },
  });

  const exemptionsQ = useQuery({
    queryKey: ["tax", "exemptions"],
    queryFn: async () => listOf<Exemption>(await api.get("tax", "/v1/tax-exemptions?page_size=100"), ENVELOPE.tax),
  });
  const exemptions = exemptionsQ.data ?? [];

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [decisionForm, setDecisionForm] = useState({
    customer_id: "",
    aggregate_type: AGGREGATE_TYPES[0],
    aggregate_id: "",
    jurisdiction_code: "GB",
    tax_category: TAX_CATEGORIES[0],
    usage_type: "",
    taxable_amount_minor_units: 0,
    currency_code: "GBP",
  });

  const [policyForm, setPolicyForm] = useState({
    jurisdiction_code: "",
    country_code: "",
    provider_name: "INTERNAL",
    policy_version: "",
    currency_code: "GBP",
    /**
     * The backend takes an arbitrary category → rule map, so this is raw JSON
     * rather than a fixed set of fields. A structured editor would silently
     * constrain what the engine actually supports.
     */
    tax_category_map: '{\n  "STANDARD": { "rate_bps": 2000, "name": "VAT" }\n}',
  });
  const [policyMapError, setPolicyMapError] = useState<string | null>(null);

  /**
   * PUT /v1/jurisdiction-policies/{id} takes only these four fields —
   * jurisdiction_code and country_code are NOT updatable, because a policy that
   * changes which jurisdiction it applies to is a different policy. Editing is
   * therefore limited to a DRAFT one; an ACTIVE policy is superseded, never
   * amended, or the tax already calculated under it stops being reproducible.
   */
  const [editForm, setEditForm] = useState({
    provider_name: "",
    policy_version: "",
    currency_code: "",
    tax_category_map: "{}",
  });
  const [editMapError, setEditMapError] = useState<string | null>(null);

  const openEdit = (p: Policy) => {
    setEditForm({
      provider_name: p.provider_name ?? "",
      policy_version: p.policy_version ?? "",
      currency_code: p.currency_code ?? "GBP",
      tax_category_map: JSON.stringify(p.tax_category_map ?? {}, null, 2),
    });
    setEditMapError(null);
    setEditFor(p);
  };

  const [exemptionForm, setExemptionForm] = useState({
    customer_id: "",
    jurisdiction_code: "GB",
    tax_category: "",
    certificate_ref: "",
    exemption_reason: "",
    valid_to: "",
  });

  const [revokedBy, setRevokedBy] = useState("");

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const determineTax = useMutation({
    mutationFn: () =>
      api.post<TaxDecision>(
        "tax",
        "/v1/tax-decisions",
        {
          customer_id: decisionForm.customer_id,
          aggregate_type: decisionForm.aggregate_type,
          aggregate_id: decisionForm.aggregate_id,
          jurisdiction_code: decisionForm.jurisdiction_code,
          tax_category: decisionForm.tax_category,
          usage_type: decisionForm.usage_type,
          taxable_amount_minor_units: decisionForm.taxable_amount_minor_units,
          currency_code: decisionForm.currency_code,
        },
        { idempotencyKey: api.uuid() },
      ),
    onSuccess: (decision) => {
      setLastDecision(decision);
      setDetermineOpen(false);
      toast[decision.is_fallback ? "warning" : "success"](
        decision.is_fallback
          ? "Decision used the FALLBACK rate — no active policy matched this jurisdiction"
          : `Tax determined: ${formatMoney(decision.tax_amount_minor_units, decision.currency_code)}`,
      );
      qc.invalidateQueries({ queryKey: ["tax"] });
    },
    onError: fail("Could not determine tax"),
  });

  const createPolicy = useMutation({
    mutationFn: () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(policyForm.tax_category_map);
      } catch (err) {
        // Thrown rather than toasted so the mutation lands in its error state and
        // the button stops spinning.
        throw new Error(`tax_category_map is not valid JSON: ${(err as Error).message}`);
      }
      return api.post("tax", "/v1/jurisdiction-policies", {
        jurisdiction_code: policyForm.jurisdiction_code,
        country_code: policyForm.country_code,
        provider_name: policyForm.provider_name,
        policy_version: policyForm.policy_version,
        currency_code: policyForm.currency_code,
        tax_category_map: parsed,
      });
    },
    onSuccess: () => {
      toast.success("Policy created — activate it to make it the one the engine uses");
      setPolicyOpen(false);
      setPolicyForm((f) => ({ ...f, jurisdiction_code: "", country_code: "", policy_version: "" }));
      qc.invalidateQueries({ queryKey: ["tax", "policies"] });
    },
    onError: fail("Could not create the policy"),
  });

  const updatePolicy = useMutation({
    mutationFn: () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(editForm.tax_category_map);
      } catch (err) {
        throw new Error(`tax_category_map is not valid JSON: ${(err as Error).message}`);
      }
      return api.put("tax", `/v1/jurisdiction-policies/${editFor!.policy_id}`, {
        provider_name: editForm.provider_name,
        policy_version: editForm.policy_version,
        currency_code: editForm.currency_code,
        tax_category_map: parsed,
      });
    },
    onSuccess: () => { toast.success("Policy updated"); setEditFor(null); qc.invalidateQueries({ queryKey: ["tax", "policies"] }); },
    onError: (e) => {
      const msg = errMessage(e, "Could not update the policy");
      setEditMapError(msg.includes("JSON") ? msg : null);
      toast.error(msg);
    },
  });

  const activatePolicy = useMutation({
    mutationFn: (id: string) => api.post("tax", `/v1/jurisdiction-policies/${id}/activate`, {}),
    onSuccess: () => {
      toast.success("Policy activated — it now decides tax for its jurisdiction");
      qc.invalidateQueries({ queryKey: ["tax", "policies"] });
    },
    onError: fail("Could not activate the policy"),
  });

  const supersedePolicy = useMutation({
    mutationFn: () => api.post("tax", `/v1/jurisdiction-policies/${supersedeFor!.policy_id}/supersede`, {}),
    onSuccess: () => {
      toast.success("Policy superseded");
      setSupersedeFor(null);
      qc.invalidateQueries({ queryKey: ["tax", "policies"] });
    },
    onError: fail("Could not supersede the policy"),
  });

  const createExemption = useMutation({
    mutationFn: () =>
      api.post("tax", "/v1/tax-exemptions", {
        customer_id: exemptionForm.customer_id,
        jurisdiction_code: exemptionForm.jurisdiction_code,
        tax_category: exemptionForm.tax_category,
        certificate_ref: exemptionForm.certificate_ref,
        exemption_reason: exemptionForm.exemption_reason,
        // Open-ended when blank; the handler only parses a non-empty string.
        valid_to: exemptionForm.valid_to ? new Date(`${exemptionForm.valid_to}T23:59:59Z`).toISOString() : "",
      }),
    onSuccess: () => {
      toast.success("Exemption recorded");
      setExemptionOpen(false);
      setExemptionForm((f) => ({ ...f, customer_id: "", certificate_ref: "", exemption_reason: "" }));
      qc.invalidateQueries({ queryKey: ["tax", "exemptions"] });
    },
    onError: fail("Could not record the exemption"),
  });

  const revokeExemption = useMutation({
    mutationFn: () =>
      api.post("tax", `/v1/tax-exemptions/${revokeFor!.exemption_id}/revoke`, { updated_by: revokedBy }),
    onSuccess: () => {
      toast.success("Exemption revoked");
      setRevokeFor(null);
      setRevokedBy("");
      qc.invalidateQueries({ queryKey: ["tax", "exemptions"] });
    },
    onError: fail("Could not revoke the exemption"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const dash = dashQ.data;
  const jurisdictionCount = Object.keys(dash?.decisions_by_jurisdiction ?? {}).length;
  const totalDecisions = Object.values(dash?.decisions_by_jurisdiction ?? {}).reduce((a, b) => a + b, 0);
  const activePolicies = policies.filter((p) => p.status === "ACTIVE").length;
  const activeExemptions = exemptions.filter((e) => e.status === "ACTIVE").length;

  // Jurisdictions that have produced decisions but have no ACTIVE policy — every
  // one of those is being taxed at the fallback rate.
  const activeJurisdictions = new Set(policies.filter((p) => p.status === "ACTIVE").map((p) => p.jurisdiction_code));
  const uncoveredJurisdictions = Object.keys(dash?.decisions_by_jurisdiction ?? {}).filter(
    (j) => !activeJurisdictions.has(j),
  );

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Tax &amp; Jurisdiction
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            The runtime Billing asks before taxing an invoice. Policies are versioned, decisions are evidenced and never edited.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDetermineOpen(true)}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Determine tax
          </button>
          <button
            onClick={() => (subTab === "exemptions" ? setExemptionOpen(true) : setPolicyOpen(true))}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            {subTab === "exemptions" ? "+ Exemption" : "+ Policy"}
          </button>
        </div>
      </div>

      {/* Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="DECISIONS" value={dashQ.isLoading ? "…" : String(totalDecisions)} hint={`${jurisdictionCount} jurisdiction(s)`} />
        <SummaryTile label="ACTIVE POLICIES" value={policiesQ.isLoading ? "…" : String(activePolicies)} hint={`${policies.length} total`} />
        <SummaryTile label="ACTIVE EXEMPTIONS" value={exemptionsQ.isLoading ? "…" : String(activeExemptions)} />
        <SummaryTile
          label="FALLBACK DECISIONS"
          value={dashQ.isLoading ? "…" : String(dash?.fallback_decision_count ?? 0)}
          hint={dash?.fallback_decision_count ? "No policy matched — review" : "All decisions matched a policy"}
        />
      </div>

      {/* A fallback decision means tax was applied without a governing policy.
          That is a compliance gap, so it gets a banner rather than a table cell. */}
      {(dash?.fallback_decision_count ?? 0) > 0 && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex flex-col gap-1">
          <div className="text-xs font-bold text-amber-800">
            {dash!.fallback_decision_count} decision{dash!.fallback_decision_count === 1 ? " was" : "s were"} taxed at the fallback rate
          </div>
          <div className="text-[11px] text-amber-700">
            The engine found no active policy for the requested jurisdiction and used its default.
            {uncoveredJurisdictions.length > 0 && (
              <>
                {" "}
                Jurisdictions with decisions but no ACTIVE policy:{" "}
                <span className="font-mono font-semibold">{uncoveredJurisdictions.join(", ")}</span>.
              </>
            )}
          </div>
        </div>
      )}

      {/* Result of the last determination */}
      {lastDecision && (
        <div className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Determination · {lastDecision.jurisdiction_code} · {lastDecision.tax_category}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{lastDecision.tax_decision_id}</div>
            </div>
            <button
              onClick={() => setLastDecision(null)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-wrap gap-6 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Taxable</div>
              <div className="font-mono font-bold text-slate-800">
                {formatMoney(lastDecision.taxable_amount_minor_units, lastDecision.currency_code)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tax</div>
              <div className="font-mono font-bold text-slate-800">
                {formatMoney(lastDecision.tax_amount_minor_units, lastDecision.currency_code)}
              </div>
            </div>
            {lastDecision.tax_breakdown?.map((b) => (
              <div key={b.name}>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  {b.name} ({formatBps(b.rate_bps)})
                </div>
                <div className="font-mono text-slate-700">{formatMoney(b.amount_minor_units, lastDecision.currency_code)}</div>
              </div>
            ))}
            {lastDecision.is_fallback && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 outline outline-1 outline-amber-500/30 rounded text-[10px] font-bold font-mono self-center">
                FALLBACK
              </span>
            )}
          </div>
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "decisions"} onClick={() => setSubTab("decisions")} label={`Decisions (${decisions.length})`} />
        <SubTab active={subTab === "policies"} onClick={() => setSubTab("policies")} label={`Policies (${policies.length})`} />
        <SubTab active={subTab === "exemptions"} onClick={() => setSubTab("exemptions")} label={`Exemptions (${exemptions.length})`} />
      </div>

      {/* Decisions */}
      {subTab === "decisions" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DECISION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CATEGORY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TAXABLE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TAX</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">BREAKDOWN</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DECIDED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={decisionsQ.isLoading}
                  error={decisionsQ.error}
                  empty={decisions.length === 0}
                  loadingLabel="Loading tax decisions…"
                  emptyLabel="No tax decisions recorded. Run a determination to see how the engine answers."
                />
                {decisions.map((d) => (
                  <tr key={d.tax_decision_id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{shortId(d.tax_decision_id)}</div>
                      {d.is_fallback && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold font-mono">
                          FALLBACK
                        </span>
                      )}
                      {d.exemption_id && (
                        <div className="text-[10px] text-emerald-600 font-mono mt-0.5">exempt {shortId(d.exemption_id)}</div>
                      )}
                      <DetailToggle
                        open={expanded === d.tax_decision_id}
                        onToggle={() => setExpanded(expanded === d.tax_decision_id ? null : d.tax_decision_id)}
                      />
                      {expanded === d.tax_decision_id && (
                        <RecordDetail
                          service="tax"
                          path={`/v1/tax-decisions/${d.tax_decision_id}`}
                          queryKey={["tax", "decision", d.tax_decision_id]}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-700">
                      <div>{d.jurisdiction_code}</div>
                      <div className="text-[10px] text-slate-400">{d.country_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={d.tax_category} />
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {formatMoney(d.taxable_amount_minor_units, d.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {formatMoney(d.tax_amount_minor_units, d.currency_code)}
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-500 whitespace-normal max-w-[220px]">
                      {(d.tax_breakdown ?? []).length === 0
                        ? "—"
                        : d.tax_breakdown.map((b) => (
                            <div key={b.name} className="font-mono">
                              {b.name} {formatBps(b.rate_bps)} → {formatMoney(b.amount_minor_units, d.currency_code)}
                            </div>
                          ))}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">{new Date(d.decided_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Which policy actually governs a jurisdiction right now. */}
      {subTab === "policies" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[240px]">
            <Field label="Active policy lookup" hint="Asks the engine which policy governs this jurisdiction now.">
              <input
                className={inputMonoClass}
                value={activeLookup}
                onChange={(e) => setActiveLookup(e.target.value.toUpperCase())}
                placeholder="GB"
              />
            </Field>
          </div>
          {activeLookup && (
            <div className="text-xs pb-2">
              {activePolicyQ.isLoading ? (
                <span className="text-slate-400">Looking up…</span>
              ) : activePolicyQ.data ? (
                <span className="text-slate-700">
                  <StatusPill status="ACTIVE" />{" "}
                  <span className="font-mono">{activePolicyQ.data.policy_version}</span> by{" "}
                  {activePolicyQ.data.provider_name}
                </span>
              ) : (
                <span className="text-amber-700">
                  No active policy for {activeLookup} — decisions there use the fallback rate.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Policies */}
      {subTab === "policies" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">POLICY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PROVIDER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CATEGORIES</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">EFFECTIVE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={policiesQ.isLoading}
                  error={policiesQ.error}
                  empty={policies.length === 0}
                  loadingLabel="Loading policies…"
                  emptyLabel="No jurisdiction policies. Without one, every decision falls back to the default rate."
                />
                {policies.map((p) => (
                  <tr key={p.policy_id} className="hover:bg-slate-50/40 transition align-top">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{p.policy_version || shortId(p.policy_id)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{shortId(p.policy_id)}</div>
                      <DetailToggle
                        open={expanded === p.policy_id}
                        onToggle={() => setExpanded(expanded === p.policy_id ? null : p.policy_id)}
                      />
                      {expanded === p.policy_id && (
                        <RecordDetail
                          service="tax"
                          path={`/v1/jurisdiction-policies/${p.policy_id}`}
                          queryKey={["tax", "policy", p.policy_id]}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-700">
                      <div>{p.jurisdiction_code}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.country_code} · {p.currency_code} · {p.invoice_language_code || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">{p.provider_name}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-slate-500 whitespace-normal max-w-[200px]">
                      {Object.keys(p.tax_category_map ?? {}).join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(p.effective_from).toLocaleDateString()}
                      {p.effective_to ? ` → ${new Date(p.effective_to).toLocaleDateString()}` : " → open"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        {p.status !== "ACTIVE" && p.status !== "SUPERSEDED" && (
                          <button
                            onClick={() => openEdit(p)}
                            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                        {p.status !== "ACTIVE" && p.status !== "SUPERSEDED" && (
                          <button
                            onClick={() => activatePolicy.mutate(p.policy_id)}
                            disabled={activatePolicy.isPending}
                            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold transition cursor-pointer disabled:opacity-50"
                          >
                            Activate
                          </button>
                        )}
                        {p.status === "ACTIVE" && (
                          <button
                            onClick={() => setSupersedeFor(p)}
                            className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Supersede
                          </button>
                        )}
                        {p.status === "SUPERSEDED" && <span className="text-[10px] text-slate-400">superseded</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exemptions */}
      {subTab === "exemptions" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CERTIFICATE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CUSTOMER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CATEGORY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">VALIDITY</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={exemptionsQ.isLoading}
                  error={exemptionsQ.error}
                  empty={exemptions.length === 0}
                  loadingLabel="Loading exemptions…"
                  emptyLabel="No tax exemptions recorded."
                />
                {exemptions.map((ex) => (
                  <tr key={ex.exemption_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{ex.certificate_ref}</div>
                      <DetailToggle open={expanded === ex.exemption_id} onToggle={() => setExpanded(expanded === ex.exemption_id ? null : ex.exemption_id)} />
                      {expanded === ex.exemption_id && (
                        <RecordDetail service="tax" path={`/v1/tax-exemptions/${ex.exemption_id}`} queryKey={["tax", "exemption", ex.exemption_id]} />
                      )}
                      {ex.exemption_reason && <div className="text-[10px] text-slate-500">{ex.exemption_reason}</div>}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-500">{shortId(ex.customer_id)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{ex.jurisdiction_code}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{ex.tax_category || "all"}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      {new Date(ex.valid_from).toLocaleDateString()}
                      {ex.valid_to ? ` → ${new Date(ex.valid_to).toLocaleDateString()}` : " → open"}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={ex.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ex.status === "ACTIVE" ? (
                        <button
                          onClick={() => setRevokeFor(ex)}
                          className="px-2.5 py-1.5 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded text-[10px] font-bold transition cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">{ex.status.toLowerCase()}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Determine tax ──────────────────────────────────────────────────── */}
      {determineOpen && (
        <Modal
          title="Determine tax"
          subtitle="Asks the engine what tax applies. The answer is recorded as an evidenced decision — it is not a preview."
          onClose={() => setDetermineOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setDetermineOpen(false)}
              onConfirm={() => determineTax.mutate()}
              confirmLabel="Determine"
              pendingLabel="Determining…"
              pending={determineTax.isPending}
              disabled={
                !decisionForm.jurisdiction_code ||
                !decisionForm.aggregate_id ||
                decisionForm.taxable_amount_minor_units <= 0
              }
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Aggregate type">
              <select
                className={inputClass}
                value={decisionForm.aggregate_type}
                onChange={(e) => setDecisionForm({ ...decisionForm, aggregate_type: e.target.value })}
              >
                {AGGREGATE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Aggregate ID" hint="What is being taxed — an invoice or line id.">
              <input
                className={inputMonoClass}
                value={decisionForm.aggregate_id}
                onChange={(e) => setDecisionForm({ ...decisionForm, aggregate_id: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Customer ID" hint="Used to match an active exemption certificate.">
            <input
              className={inputMonoClass}
              value={decisionForm.customer_id}
              onChange={(e) => setDecisionForm({ ...decisionForm, customer_id: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Jurisdiction code"
              hint={
                decisionForm.jurisdiction_code && !activeJurisdictions.has(decisionForm.jurisdiction_code)
                  ? "No ACTIVE policy for this jurisdiction — the engine will use its fallback rate."
                  : undefined
              }
            >
              <input
                className={inputMonoClass}
                value={decisionForm.jurisdiction_code}
                onChange={(e) => setDecisionForm({ ...decisionForm, jurisdiction_code: e.target.value.toUpperCase() })}
                placeholder="GB"
              />
            </Field>
            <Field label="Tax category">
              <select
                className={inputClass}
                value={decisionForm.tax_category}
                onChange={(e) => setDecisionForm({ ...decisionForm, tax_category: e.target.value })}
              >
                {TAX_CATEGORIES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Taxable (minor units)">
              <input
                type="number"
                className={inputMonoClass}
                value={decisionForm.taxable_amount_minor_units}
                onChange={(e) =>
                  setDecisionForm({ ...decisionForm, taxable_amount_minor_units: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Currency">
              <input
                className={inputMonoClass}
                value={decisionForm.currency_code}
                onChange={(e) => setDecisionForm({ ...decisionForm, currency_code: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </Field>
            <Field label="Usage type">
              <input
                className={inputMonoClass}
                value={decisionForm.usage_type}
                onChange={(e) => setDecisionForm({ ...decisionForm, usage_type: e.target.value })}
                placeholder="VOICE"
              />
            </Field>
          </div>
        </Modal>
      )}

      {/* ─── Create policy ──────────────────────────────────────────────────── */}
      {policyOpen && (
        <Modal
          title="Create a jurisdiction policy"
          subtitle="Created inactive. Activating it supersedes whatever policy currently governs that jurisdiction."
          width="w-[620px]"
          onClose={() => setPolicyOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setPolicyOpen(false)}
              onConfirm={() => createPolicy.mutate()}
              confirmLabel="Create policy"
              pendingLabel="Creating…"
              pending={createPolicy.isPending}
              disabled={
                !policyForm.jurisdiction_code ||
                !policyForm.country_code ||
                !policyForm.policy_version ||
                !!policyMapError
              }
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jurisdiction code">
              <input
                className={inputMonoClass}
                value={policyForm.jurisdiction_code}
                onChange={(e) => setPolicyForm({ ...policyForm, jurisdiction_code: e.target.value.toUpperCase() })}
                placeholder="US-CA"
              />
            </Field>
            <Field label="Country code">
              <input
                className={inputMonoClass}
                value={policyForm.country_code}
                onChange={(e) => setPolicyForm({ ...policyForm, country_code: e.target.value.toUpperCase() })}
                placeholder="US"
                maxLength={2}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Provider">
              <input
                className={inputMonoClass}
                value={policyForm.provider_name}
                onChange={(e) => setPolicyForm({ ...policyForm, provider_name: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Policy version">
              <input
                className={inputMonoClass}
                value={policyForm.policy_version}
                onChange={(e) => setPolicyForm({ ...policyForm, policy_version: e.target.value })}
                placeholder="2026.08"
              />
            </Field>
            <Field label="Currency">
              <input
                className={inputMonoClass}
                value={policyForm.currency_code}
                onChange={(e) => setPolicyForm({ ...policyForm, currency_code: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </Field>
          </div>
          <Field
            label="Tax category map (JSON)"
            hint="Rates are basis points — 2000 = 20.00%. The engine takes an open map, so this is raw JSON rather than fixed fields."
          >
            <textarea
              className={`${inputMonoClass} h-40 resize-y`}
              value={policyForm.tax_category_map}
              onChange={(e) => {
                setPolicyForm({ ...policyForm, tax_category_map: e.target.value });
                try {
                  JSON.parse(e.target.value);
                  setPolicyMapError(null);
                } catch (err) {
                  setPolicyMapError((err as Error).message);
                }
              }}
            />
          </Field>
          {policyMapError && <p className="text-[11px] text-rose-600 -mt-2">Invalid JSON: {policyMapError}</p>}
        </Modal>
      )}

      {/* ─── Edit policy ────────────────────────────────────────────────────── */}
      {editFor && (
        <Modal
          title="Edit jurisdiction policy"
          subtitle="Draft only. An active policy is superseded, never amended — otherwise tax already calculated under it stops being reproducible."
          width="w-[640px]"
          onClose={() => setEditFor(null)}
          footer={
            <ModalActions
              onCancel={() => setEditFor(null)}
              onConfirm={() => updatePolicy.mutate()}
              confirmLabel="Save policy"
              pendingLabel="Saving…"
              pending={updatePolicy.isPending}
              disabled={!editForm.policy_version.trim()}
            />
          }
        >
          <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-1 leading-relaxed">
            Jurisdiction <span className="font-mono text-slate-700">{editFor.jurisdiction_code}</span> and country{" "}
            <span className="font-mono text-slate-700">{editFor.country_code}</span> are fixed. A policy that changes
            which jurisdiction it applies to is a different policy — create one instead.
          </p>
          <Field label="Provider name">
            <input className={inputClass} value={editForm.provider_name} onChange={(e) => setEditForm({ ...editForm, provider_name: e.target.value })} />
          </Field>
          <Field label="Policy version">
            <input className={inputClass} value={editForm.policy_version} onChange={(e) => setEditForm({ ...editForm, policy_version: e.target.value })} />
          </Field>
          <Field label="Currency code">
            <input className={inputClass} value={editForm.currency_code} onChange={(e) => setEditForm({ ...editForm, currency_code: e.target.value.toUpperCase() })} />
          </Field>
          <Field label="Tax category map (JSON)">
            <textarea
              className={`${inputMonoClass} h-40`}
              value={editForm.tax_category_map}
              onChange={(e) => { setEditForm({ ...editForm, tax_category_map: e.target.value }); setEditMapError(null); }}
            />
          </Field>
          {editMapError && <p className="text-[11px] text-rose-600">{editMapError}</p>}
        </Modal>
      )}

      {/* ─── Supersede policy ───────────────────────────────────────────────── */}
      {supersedeFor && (
        <Modal
          title="Supersede this policy"
          subtitle="The policy stops governing new decisions. Decisions already made under it keep their policy version — they are not recalculated."
          onClose={() => setSupersedeFor(null)}
          footer={
            <ModalActions
              onCancel={() => setSupersedeFor(null)}
              onConfirm={() => supersedePolicy.mutate()}
              confirmLabel="Supersede"
              pendingLabel="Superseding…"
              pending={supersedePolicy.isPending}
              destructive
            />
          }
        >
          <dl className="grid grid-cols-2 gap-y-2 text-[11px]">
            <dt className="text-slate-400">Jurisdiction</dt>
            <dd className="font-mono text-slate-700">{supersedeFor.jurisdiction_code}</dd>
            <dt className="text-slate-400">Version</dt>
            <dd className="font-mono text-slate-700">{supersedeFor.policy_version}</dd>
            <dt className="text-slate-400">Provider</dt>
            <dd className="font-mono text-slate-700">{supersedeFor.provider_name}</dd>
          </dl>
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            With no other active policy for {supersedeFor.jurisdiction_code}, subsequent decisions there will use the
            fallback rate.
          </p>
        </Modal>
      )}

      {/* ─── Create exemption ───────────────────────────────────────────────── */}
      {exemptionOpen && (
        <Modal
          title="Record a tax exemption"
          subtitle="Matched by customer and jurisdiction when a decision is determined."
          onClose={() => setExemptionOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setExemptionOpen(false)}
              onConfirm={() => createExemption.mutate()}
              confirmLabel="Record exemption"
              pendingLabel="Recording…"
              pending={createExemption.isPending}
              disabled={!exemptionForm.customer_id || !exemptionForm.certificate_ref || !exemptionForm.jurisdiction_code}
            />
          }
        >
          <Field label="Customer ID">
            <input
              className={inputMonoClass}
              value={exemptionForm.customer_id}
              onChange={(e) => setExemptionForm({ ...exemptionForm, customer_id: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jurisdiction code">
              <input
                className={inputMonoClass}
                value={exemptionForm.jurisdiction_code}
                onChange={(e) => setExemptionForm({ ...exemptionForm, jurisdiction_code: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Tax category" hint="Blank exempts every category in the jurisdiction.">
              <select
                className={inputClass}
                value={exemptionForm.tax_category}
                onChange={(e) => setExemptionForm({ ...exemptionForm, tax_category: e.target.value })}
              >
                <option value="">— all categories —</option>
                {TAX_CATEGORIES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Certificate reference">
            <input
              className={inputMonoClass}
              value={exemptionForm.certificate_ref}
              onChange={(e) => setExemptionForm({ ...exemptionForm, certificate_ref: e.target.value })}
              placeholder="CERT-GB-2026-00184"
            />
          </Field>
          <Field label="Reason">
            <input
              className={inputClass}
              value={exemptionForm.exemption_reason}
              onChange={(e) => setExemptionForm({ ...exemptionForm, exemption_reason: e.target.value })}
              placeholder="Registered charity — VAT relief"
            />
          </Field>
          <Field label="Valid to" hint="Leave blank for an open-ended exemption.">
            <input
              type="date"
              className={inputClass}
              value={exemptionForm.valid_to}
              onChange={(e) => setExemptionForm({ ...exemptionForm, valid_to: e.target.value })}
            />
          </Field>
        </Modal>
      )}

      {/* ─── Revoke exemption ───────────────────────────────────────────────── */}
      {revokeFor && (
        <Modal
          title="Revoke this exemption"
          subtitle="Future determinations for this customer will be taxed. Decisions already made keep the exemption they were granted."
          onClose={() => setRevokeFor(null)}
          footer={
            <ModalActions
              onCancel={() => setRevokeFor(null)}
              onConfirm={() => revokeExemption.mutate()}
              confirmLabel="Revoke"
              pendingLabel="Revoking…"
              pending={revokeExemption.isPending}
              disabled={!revokedBy.trim()}
              destructive
            />
          }
        >
          <dl className="grid grid-cols-2 gap-y-2 text-[11px] mb-1">
            <dt className="text-slate-400">Certificate</dt>
            <dd className="font-mono text-slate-700">{revokeFor.certificate_ref}</dd>
            <dt className="text-slate-400">Customer</dt>
            <dd className="font-mono text-slate-700 break-all">{revokeFor.customer_id}</dd>
          </dl>
          <Field label="Revoked by" hint="Recorded as updated_by on the exemption.">
            <input
              className={inputClass}
              value={revokedBy}
              onChange={(e) => setRevokedBy(e.target.value)}
              placeholder="your.name@zoikogroup.com"
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}
