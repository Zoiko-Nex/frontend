"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  Plus,
  X,
} from "lucide-react";

interface DecisionItem {
  id: string;
  useCase: string;
  object: string;
  recommendation: string;
  risk: "Low" | "Medium" | "High";
  policy: "Pass" | "Constrained" | "Block" | "Not evaluated";
  state: "Review required" | "Blocked" | "Approved" | "Executed within controls" | "Superseded";
  incident: string;
  trigger: string;
  supportingFacts: string;
  model: string;
  policyRule: string;
  policyVersion: string;
  condition: string;
  requiredApproval: string;
  evidenceRef: string;
}

const DECISIONS_DATA: DecisionItem[] = [
  {
    id: "DEC-88213",
    useCase: "Revenue Assurance",
    object: "Batch 4471 · Prepaid",
    recommendation: "Draft credit note",
    risk: "Medium",
    policy: "Constrained",
    state: "Review required",
    incident:
      "Rating engine applied a superseded tariff snapshot to Batch 4471 for 214 prepaid subscribers, producing a systematic overage of ~6% per affected line. Pattern matches 2 prior confirmed incidents (RA-Q2-118, RA-Q1-064).",
    trigger: "Usage-mediation late-arrival flag",
    supportingFacts: "214 lines · 3 mediation batches",
    model: "rating-anomaly · v2.3.1",
    policyRule: "RA-CREDIT-LIMIT-002",
    policyVersion: "v4.2 · eff. 2026-06-01",
    condition: "Credit > $500 requires approval",
    requiredApproval: "Revenue Assurance Lead",
    evidenceRef: "EVD-2C19-8813",
  },
  {
    id: "DEC-88190",
    useCase: "Fraud / Risk",
    object: "SIM Cluster GH-2291",
    recommendation: "Suspend for review",
    risk: "High",
    policy: "Block",
    state: "Blocked",
    incident:
      "Rapid activation of 150 eSIM profiles from an anomalous IP ASN with zero initial balance usage followed by concurrent high-rate SMS bursts.",
    trigger: "Velocity burst anomaly > 1200 msg/min",
    supportingFacts: "150 eSIM profiles · Single roaming partner route",
    model: "fraud-velocity · v3.0.4",
    policyRule: "FRAUD-AUTO-SUSPEND-09",
    policyVersion: "v1.8 · eff. 2026-05-15",
    condition: "Autonomous suspension forbidden on corporate tier",
    requiredApproval: "Fraud Operations Manager",
    evidenceRef: "EVD-9B41-1102",
  },
  {
    id: "DEC-88177",
    useCase: "Tax Anomalies",
    object: "Invoice INV-330219",
    recommendation: "Flag jurisdiction mismatch",
    risk: "Medium",
    policy: "Pass",
    state: "Approved",
    incident:
      "Billing address state does not match cell site centroid location for primary data consumption during invoicing cycle, triggering USF delta.",
    trigger: "Geofence jurisdiction divergence > 80%",
    supportingFacts: "1 enterprise account · 42 lines impacted",
    model: "tax-situs-detector · v1.4.2",
    policyRule: "TAX-SITUS-USF-001",
    policyVersion: "v3.0 · eff. 2026-01-01",
    condition: "Flagged for manual situs override review",
    requiredApproval: "Tax & Compliance Lead",
    evidenceRef: "EVD-4A02-7721",
  },
  {
    id: "DEC-88104",
    useCase: "Retention / Churn",
    object: "Account 771–AC",
    recommendation: "Prioritize outreach",
    risk: "Low",
    policy: "Pass",
    state: "Executed within controls",
    incident:
      "Subscriber experienced 3 dropped sessions post network slice reconfiguration and visited support portal billing FAQ 4 times.",
    trigger: "QoD degradation + churn probability > 0.78",
    supportingFacts: "Contract renewal in 45 days · $180 ARPU",
    model: "churn-propensity · v4.1.0",
    policyRule: "RETENTION-ROUTING-004",
    policyVersion: "v2.1 · eff. 2026-03-10",
    condition: "Low risk outreach within approved templates",
    requiredApproval: "Commercial Customer Success",
    evidenceRef: "EVD-88C1-3319",
  },
  {
    id: "DEC-87950",
    useCase: "Billing",
    object: "Bill Run BR–0921",
    recommendation: "Hold disputed line item",
    risk: "Low",
    policy: "Not evaluated",
    state: "Superseded",
    incident:
      "Disputed roaming CDR arrived post bill close but was reconciled automatically by the partner clearing house before human review.",
    trigger: "Late TAP file reconciliation",
    supportingFacts: "1 CDR line item · $14.20 delta",
    model: "billing-reconcile · v1.9.0",
    policyRule: "BILL-DISPUTE-HOLD-003",
    policyVersion: "v2.0 · eff. 2025-11-01",
    condition: "Threshold < $50 auto-cleared by partner credit",
    requiredApproval: "Billing Operations",
    evidenceRef: "EVD-1F88-0092",
  },
];

const USE_CASES = [
  {
    id: "rev-assurance",
    name: "Revenue Assurance",
    permitted: [
      "Score revenue leakage likelihood per batch",
      "Draft a credit note for review",
      "Flag missing billable events within hours",
    ],
    forbidden: [
      "Post a financial adjustment directly",
      "Alter a tariff or rating rule",
      "Close a case without reviewer sign-off",
    ],
    reviewer: "Revenue Assurance Lead",
    maxAuthority: "Prepare",
    threshold: "Credit > $500 requires approval",
    evidence: "Full evidence record",
  },
  {
    id: "billing",
    name: "Billing",
    permitted: [
      "Flag CDR rating variance against baseline",
      "Prepare draft invoice adjustment batch",
      "Recommend bill-hold on disputed enterprise lines",
    ],
    forbidden: [
      "Release invoices with active unreviewed flags",
      "Modify tax calculation rules dynamically",
      "Suppress customer invoice delivery",
    ],
    reviewer: "Billing Operations Lead",
    maxAuthority: "Prepare",
    threshold: "Bill run variances > 2% halt batch",
    evidence: "Tariff snapshot & invoice diff manifest",
  },
  {
    id: "fraud",
    name: "Fraud / Risk",
    permitted: [
      "Detect SIM farm and velocity burst anomalies",
      "Route urgent alert to Fraud Operations queue",
      "Recommend targeted IMEI or IMSI quarantine",
    ],
    forbidden: [
      "Permanently terminate subscriber contract",
      "Blacklist corporate APNs autonomously",
      "Bypass lawful intercept or regulatory reporting",
    ],
    reviewer: "Fraud Operations Manager",
    maxAuthority: "Recommend",
    threshold: "High risk requires immediate P1 notification",
    evidence: "Call event sequence & IP ASN provenance",
  },
  {
    id: "tax",
    name: "Tax Anomalies",
    permitted: [
      "Identify nexus and situs location discrepancies",
      "Prepare tax recalculation draft for review",
      "Compare exemption certificates with jurisdiction updates",
    ],
    forbidden: [
      "Override jurisdiction tax pack rates in runtime",
      "Submit tax filings directly to government APIs",
      "Waive statutory surcharges or USF obligations",
    ],
    reviewer: "Tax & Compliance Lead",
    maxAuthority: "Prepare",
    threshold: "Cross-border tax delta > $1,000",
    evidence: "Situs coordinate log and tax rule version",
  },
  {
    id: "retention",
    name: "Retention / Churn",
    permitted: [
      "Calculate churn propensity scores per subscriber",
      "Suggest pre-approved discount offers from catalog",
      "Prioritize proactive support ticket routing",
    ],
    forbidden: [
      "Create custom unapproved contract terms",
      "Auto-commit commercial discounts above $50/mo",
      "Downgrade service SLA without customer consent",
    ],
    reviewer: "Commercial Retention Lead",
    maxAuthority: "Execute with Controls",
    threshold: "Discounts strictly bounded by catalog rules",
    evidence: "Interaction history & discount voucher ID",
  },
  {
    id: "support",
    name: "Support Triage",
    permitted: [
      "Classify incoming ticket urgency and category",
      "Retrieve relevant network diagnostic telemetry",
      "Draft resolution steps for tier-2 agent review",
    ],
    forbidden: [
      "Issue refund or credit directly from chat assistant",
      "Change subscriber SIM IMSI assignment",
      "Close unresolved network outage tickets",
    ],
    reviewer: "Customer Support Team Lead",
    maxAuthority: "Prepare",
    threshold: "P1 outage tickets escalate directly to NOC",
    evidence: "Diagnostic telemetry snapshot",
  },
];

const PERMISSIONS_MATRIX = [
  { role: "Operations Analyst", view: true, review: false, approve: false, execute: false, admin: false, export: false },
  { role: "Operations Lead", view: true, review: true, approve: false, execute: false, admin: false, export: false },
  { role: "Revenue Assurance Lead", view: true, review: true, approve: true, execute: false, admin: false, export: false },
  { role: "Finance / Billing Approver", view: true, review: true, approve: true, execute: true, admin: false, export: false },
  { role: "AI Governance Admin", view: true, review: false, approve: false, execute: false, admin: true, export: false },
  { role: "Policy Admin", view: true, review: false, approve: false, execute: false, admin: true, export: false },
  { role: "Security / Compliance Reviewer", view: true, review: false, approve: false, execute: false, admin: false, export: true },
  { role: "Auditor", view: true, review: false, approve: false, execute: false, admin: false, export: true },
];

const MODEL_REGISTRY = [
  { useCase: "Revenue Assurance", model: "rating-anomaly", version: "v2.3.1", status: "Active", drift: "Normal", lastChanged: "2026-07-02" },
  { useCase: "Fraud / Risk", model: "sim-cluster-risk", version: "v1.9.0", status: "Active", drift: "Needs review", lastChanged: "2026-06-18" },
  { useCase: "Tax Anomalies", model: "jurisdiction-check", version: "v3.1.4", status: "Active", drift: "Normal", lastChanged: "2026-05-27" },
  { useCase: "Retention / Churn", model: "churn-propensity", version: "v4.0.2", status: "Paused", drift: "—", lastChanged: "2026-04-11" },
];

const FAQS = [
  {
    q: "What is telecom AI decision intelligence?",
    a: "It's the layer that turns raw telecom signals into governed decisions — detecting anomalies, preparing recommendations, checking policy, and routing human approval before any action is taken.",
  },
  {
    q: "Can ZoikoNex AI make billing changes automatically?",
    a: "No. AI can detect anomalies, draft adjustments, and prepare credit notes for review, but no billing change is posted until a named human with the appropriate authority role authorizes it.",
  },
  {
    q: "How does human approval work?",
    a: "Each decision object is assigned to a named role based on the use case and authority level. That role reviews, authorizes, or dismisses the recommendation before it is recorded as the decision of record.",
  },
  {
    q: "How are AI recommendations explained?",
    a: "Every recommendation includes a layered reasoning chain: direct reason, supporting evidence, model and role context, known limitations, and a decision score with pending reviewer assignment.",
  },
  {
    q: "How are AI decisions audited?",
    a: "Every reviewed decision writes an immutable cryptographic payload: model version, input telemetry snapshot, active policy hash, reviewer identity, timestamp, and final authorized outcome.",
  },
  {
    q: "What happens when policy blocks AI?",
    a: "The recommendation is automatically blocked or downgraded to Level 01 (Inform) before entering any operational queue. No human sees a recommendation that has already failed policy evaluation.",
  },
  {
    q: "How are model changes handled?",
    a: "All operational models are registered with an owner, validation reference, and deployment scope. Any production service change requires the same discipline — no silent model swaps.",
  },
];

export default function AiDecisionPage() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionItem>(DECISIONS_DATA[0]);
  const [selectedUseCase, setSelectedUseCase] = useState(USE_CASES[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleActionClick = (actionName: string) => {
    setActionFeedback(`Action "${actionName}" recorded for decision ${selectedDecision.id}.`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const stateBadge = (state: DecisionItem["state"]) => {
    if (state === "Review required") return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
    if (state === "Blocked") return "bg-rose-500/20 text-rose-300 border border-rose-500/40";
    if (state === "Approved") return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40";
    if (state === "Executed within controls") return "bg-blue-500/20 text-blue-300 border border-blue-500/40";
    return "bg-slate-700/40 text-slate-400 border border-slate-600/40";
  };

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (Dark Navy `#08182B` with decision-telemetry.png) */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_55%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-widest font-['Plus_Jakarta_Sans']">
                <span className="w-4 h-0.5 bg-sky-400 inline-block" />
                AI &amp; DECISION INTELLIGENCE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
                Turn AI signals into governed telecom decisions.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-['Plus_Jakarta_Sans']">
                Detect anomalies, prioritize issues, and prepare recommendations — then apply policy
                guardrails, route human approval, and preserve decision evidence. Every step accountable,
                every action bounded.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold transition-all text-sm inline-flex items-center gap-2 shadow-md cursor-pointer font-['Plus_Jakarta_Sans']"
                >
                  Contact Support
                </Link>
                <Link
                  href="/request-a-demo"
                  className="px-6 py-3 rounded-md bg-transparent hover:bg-white/10 border border-slate-600 text-white font-semibold transition-all text-sm cursor-pointer font-['Plus_Jakarta_Sans']"
                >
                  Request a Demo
                </Link>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300 pt-1 font-['Plus_Jakarta_Sans']">
                <Image
                  src="/image/ai-decision/icon-check.svg"
                  alt="Check"
                  width={16}
                  height={16}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  Decision support with explicit authority, policy, provenance, and evidence — never
                  autonomous action on high-impact outcomes.
                </span>
              </div>
            </div>

            {/* Right Visual Image (decision-telemetry.png) */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                <Image
                  src="/image/ai-decision/decision-telemetry.png"
                  alt="AI Decision Telemetry Network"
                  width={540}
                  height={440}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-emerald-400 font-bold">Signal: Telemetry Anomaly Detected</span>
                    <span className="text-slate-400 font-mono">v2.3.1</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Sub-200ms policy evaluation across real-time mediation events.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GOVERNANCE MODEL — analysts-review.png */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-500 font-['Plus_Jakarta_Sans']">
              GOVERNANCE MODEL
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight font-['Plus_Jakarta_Sans'] leading-[51px]">
              Accountability before capability
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl font-['Plus_Jakarta_Sans'] leading-6">
              Before you see the product, see the boundary. Nothing here acts on your business
              without a policy check and a named human decision.
            </p>
          </div>

          {/* Full-width Photo Banner (analysts-review.png) */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src="/image/ai-decision/analysts-review.png"
                alt="Governance and compliance analyst review"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-slate-700/50 shadow-lg max-w-md font-['Plus_Jakarta_Sans']">
                  Human review checkpoint — a flagged decision is authorized, not auto-executed
                </div>
              </div>
            </div>
          </div>

          {/* 4 Dark Navy Cards with SVGs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "/image/ai-decision/icon-user-check.svg",
                title: "Human accountability",
                desc: "A named role reviews, authorizes, or dismisses — AI output is never the decision of record on its own.",
              },
              {
                icon: "/image/ai-decision/icon-lock.svg",
                title: "Policy-bounded authority",
                desc: "Every recommendation is checked against versioned policy before it can reach an approval queue or an action.",
              },
              {
                icon: "/image/ai-decision/icon-circle-info.svg",
                title: "Explainable context",
                desc: "Reasons, supporting evidence, model context and known limitations are attached to every recommendation.",
              },
              {
                icon: "/image/ai-decision/icon-shield.svg",
                title: "Evidence traceability",
                desc: "Every reviewed decision writes an immutable record — model version, policy result, reviewer, and outcome.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0D2137] text-white border border-slate-800 space-y-3 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#08182B] flex items-center justify-center border border-slate-700/50">
                  <Image src={card.icon} alt={card.title} width={22} height={22} />
                </div>
                <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-['Plus_Jakarta_Sans']">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT PROOF — Decision Queue */}
      <section id="decision-queue" className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="space-y-2 mb-8">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-500 font-['Plus_Jakarta_Sans']">
              PRODUCT PROOF
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-['Plus_Jakarta_Sans']">
              An operational decision queue, not a dashboard.
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl font-['Plus_Jakarta_Sans']">
              Synthetic data shown for illustration. Every row is a real decision object with authority,
              policy, and reviewer state attached.
            </p>
          </div>

          {actionFeedback && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-sm font-['Plus_Jakarta_Sans']">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Dark Dashboard Container */}
          <div className="rounded-2xl bg-[#08182B] text-white border border-slate-800 overflow-hidden shadow-2xl font-['Plus_Jakarta_Sans']">
            {/* Toolbar */}
            <div className="px-4 py-3 bg-[#060F1C] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="font-bold text-white">Decision Queue</span>
                {["Jurisdiction: All", "Brand: All", "Tenant: Revenue Assurance", "Authority Key", "State: Open", "Date: Last 7 days"].map((f) => (
                  <span key={f} className="hidden sm:inline px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-400 text-[11px]">{f}</span>
                ))}
              </div>
            </div>

            {/* Left sidebar nav + main content */}
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar nav */}
              <div className="lg:w-36 border-b lg:border-b-0 lg:border-r border-slate-800 text-xs text-slate-400">
                {["Use Cases", "Models", "Datasets", "Approvals", "Drift Monitoring", "Guidance", "Settings"].map((item, i) => (
                  <div
                    key={item}
                    className={`px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors ${i === 0 ? "bg-slate-800/40 text-slate-200 border-l-2 border-sky-500" : ""}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Table + Inspector */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
                {/* Queue Table */}
                <div className="lg:col-span-8 overflow-x-auto border-b lg:border-b-0 lg:border-r border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">USE CASE</th>
                        <th className="py-3 px-3">OBJECT</th>
                        <th className="py-3 px-3">RECOMMENDATION</th>
                        <th className="py-3 px-3">RISK</th>
                        <th className="py-3 px-3">POLICY</th>
                        <th className="py-3 px-3">STATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {DECISIONS_DATA.map((item) => {
                        const isSelected = selectedDecision.id === item.id;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedDecision(item)}
                            className={`cursor-pointer transition-colors ${isSelected ? "bg-slate-700/50" : "hover:bg-slate-800/40"}`}
                          >
                            <td className="py-3 px-3 font-mono text-sky-400 font-bold text-[11px]">{item.id}</td>
                            <td className="py-3 px-3 text-slate-200">{item.useCase}</td>
                            <td className="py-3 px-3 text-slate-400">{item.object}</td>
                            <td className="py-3 px-3 text-slate-300">{item.recommendation}</td>
                            <td className="py-3 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.risk === "High"
                                  ? "bg-rose-500/20 text-rose-300"
                                  : item.risk === "Medium"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}>{item.risk}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.policy === "Constrained" ? "bg-amber-500/20 text-amber-300"
                                  : item.policy === "Block" ? "bg-rose-500/20 text-rose-300"
                                  : item.policy === "Pass" ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-slate-700/40 text-slate-400"
                              }`}>{item.policy}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${stateBadge(item.state)}`}>
                                {item.state}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Detail Strip below Table */}
                  <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-xs space-y-3">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">SELECTED · {selectedDecision.id}</div>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px]">
                      {selectedDecision.incident}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Policy Rule</div>
                        <div className="text-amber-400 font-mono">{selectedDecision.policyRule}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Version</div>
                        <div className="text-slate-300">{selectedDecision.policyVersion}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Condition</div>
                        <div className="text-slate-300">{selectedDecision.condition}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Outcome</div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${stateBadge(selectedDecision.state)}`}>
                          {selectedDecision.state}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Triggering signal</div>
                        <div className="text-slate-300">{selectedDecision.trigger}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Supporting facts</div>
                        <div className="text-slate-300">{selectedDecision.supportingFacts}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[10px] uppercase mb-0.5">Model version</div>
                        <div className="text-sky-400 font-mono">{selectedDecision.model}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button onClick={() => handleActionClick("Review decision")} className="px-3 py-1.5 rounded bg-[#55A630] hover:bg-[#478f28] text-white font-bold text-[11px] transition-colors cursor-pointer">
                        Review decision
                      </button>
                      <button onClick={() => handleActionClick("Open evidence")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors cursor-pointer">
                        Open evidence
                      </button>
                      <button onClick={() => handleActionClick("Compare policy")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors cursor-pointer">
                        Compare policy
                      </button>
                      <button onClick={() => handleActionClick("Escalate")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-[11px] border border-slate-700 transition-colors cursor-pointer">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inspector Drawer */}
                <div className="lg:col-span-4 p-4 bg-slate-900/80 flex flex-col space-y-4 border-t lg:border-t-0 border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">Policy check</div>
                      <div className="text-sm font-bold text-white mt-0.5">{selectedDecision.policyRule}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stateBadge(selectedDecision.state)}`}>
                      {selectedDecision.policy}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Rule ID</span>
                      <span className="text-slate-200 font-mono text-[10px]">{selectedDecision.policyRule}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Version</span>
                      <span className="text-slate-200 text-[10px]">{selectedDecision.policyVersion}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Condition</span>
                      <span className="text-slate-200 text-[10px]">{selectedDecision.condition}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Outcome</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stateBadge(selectedDecision.state)}`}>
                        {selectedDecision.state}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Required approval</span>
                      <span className="text-slate-200 text-[10px]">{selectedDecision.requiredApproval}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2 py-1">
                      <span className="text-slate-400">Evidence ref</span>
                      <span className="text-sky-400 font-mono text-[10px]">{selectedDecision.evidenceRef}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TELECOM USE CASES — Permitted & Forbidden */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-500 font-['Plus_Jakarta_Sans']">
              TELECOM USE CASES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-['Plus_Jakarta_Sans']">
              What can AI do here?
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl font-['Plus_Jakarta_Sans']">
              Exact use cases and availability are subject to product approval. Select a use case to
              see its permitted and forbidden actions.
            </p>
          </div>

          {/* Use Case Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {USE_CASES.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setSelectedUseCase(uc)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer font-['Plus_Jakarta_Sans'] ${
                  selectedUseCase.id === uc.id
                    ? "bg-[#08182B] text-white shadow"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm"
                }`}
              >
                {uc.name}
              </button>
            ))}
          </div>

          {/* Permitted / Forbidden with exact SVGs */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm font-['Plus_Jakarta_Sans']">
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Permitted */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                    <Image src="/image/ai-decision/icon-check-2.svg" alt="Permitted" width={18} height={18} />
                    <span>PERMITTED OUTPUTS</span>
                  </div>
                  <div className="space-y-3">
                    {selectedUseCase.permitted.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Image src="/image/ai-decision/icon-check-2.svg" alt="Permitted" width={16} height={16} className="shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forbidden */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <Image src="/image/ai-decision/icon-close-cross.svg" alt="Forbidden" width={18} height={18} />
                    <span>FORBIDDEN ACTIONS</span>
                  </div>
                  <div className="space-y-3">
                    {selectedUseCase.forbidden.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <Image src="/image/ai-decision/icon-close-cross.svg" alt="Forbidden" width={16} height={16} className="shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer metadata */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Required Reviewer</div>
                  <div className="text-slate-900 font-semibold">{selectedUseCase.reviewer}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Max Authority</div>
                  <div className="text-blue-600 font-semibold">{selectedUseCase.maxAuthority}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Threshold</div>
                  <div className="text-slate-700">{selectedUseCase.threshold}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase font-semibold mb-0.5">Evidence Requirement</div>
                  <div className="text-emerald-700 font-semibold">{selectedUseCase.evidence}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HUMAN DECISION RIGHTS — Figma Exact */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col justify-start items-start gap-10 font-['Plus_Jakarta_Sans']">
          <div className="w-full max-w-[640px] pt-1 flex flex-col justify-start items-start gap-3.5">
            <div className="justify-center text-blue-500 text-xs font-bold uppercase leading-4 tracking-widest">
              HUMAN DECISION RIGHTS
            </div>
            <div className="self-stretch pt-[1.50px] flex flex-col justify-start items-start">
              <h2 className="self-stretch text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Authority is a permission, not a badge.
              </h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="self-stretch text-slate-500 text-base font-normal leading-6">
                Each level changes exactly what AI is allowed to produce — and where an<br className="hidden sm:inline" />
                accountable human must step in.
              </p>
            </div>
          </div>

          {/* 4 Authority Level Cards */}
          <div className="self-stretch pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level 01 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-start items-start gap-2 shadow-xs">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal font-['IBM_Plex_Mono'] leading-4">LEVEL 01</div>
              </div>
              <div className="self-stretch pt-[2.70px] flex flex-col justify-start items-start">
                <div className="self-stretch text-gray-900 text-base font-bold leading-6">Inform</div>
              </div>
              <div className="self-stretch pb-2 flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal leading-5">Surfaces a signal or metric. No<br />recommendation is generated.</div>
              </div>
              <div className="self-stretch px-3 py-2.5 bg-slate-50 rounded-lg flex flex-col justify-start items-start border border-slate-100">
                <div className="text-slate-600 text-xs font-normal leading-5">Example: flags a usage spike for<br />analyst awareness.</div>
              </div>
            </div>

            {/* Level 02 */}
            <div className="p-5 relative bg-white rounded-2xl border border-slate-900 flex flex-col justify-start items-start gap-2 shadow-lg">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal font-['IBM_Plex_Mono'] leading-4">LEVEL 02</div>
              </div>
              <div className="self-stretch pt-[2.70px] flex flex-col justify-start items-start">
                <div className="self-stretch text-gray-900 text-base font-bold leading-6">Recommend</div>
              </div>
              <div className="self-stretch pb-2 flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal leading-5">Proposes an action with rationale.<br />Cannot be executed by AI.</div>
              </div>
              <div className="self-stretch px-3 py-2.5 bg-slate-50 rounded-lg flex flex-col justify-start items-start border border-slate-100">
                <div className="text-slate-600 text-xs font-normal leading-5">Example: suggests a credit note<br />for a rating error.</div>
              </div>
            </div>

            {/* Level 03 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-start items-start gap-2 shadow-xs">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal font-['IBM_Plex_Mono'] leading-4">LEVEL 03</div>
              </div>
              <div className="self-stretch pt-[2.70px] flex flex-col justify-start items-start">
                <div className="self-stretch text-gray-900 text-base font-bold leading-6">Prepare</div>
              </div>
              <div className="self-stretch pb-2 flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-500 text-xs font-normal leading-5">Drafts the action object for review —<br />the draft is not live.</div>
              </div>
              <div className="self-stretch px-3 py-2.5 bg-slate-50 rounded-lg flex flex-col justify-start items-start border border-slate-100">
                <div className="text-slate-600 text-xs font-normal leading-5">Example: prepares a case file,<br />unsent to billing.</div>
              </div>
            </div>

            {/* Level 04 */}
            <div className="p-5 bg-teal-950 rounded-2xl border border-slate-900 flex flex-col justify-start items-start gap-2 shadow-md">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch text-white text-xs font-normal font-['IBM_Plex_Mono'] leading-4">LEVEL 04</div>
              </div>
              <div className="self-stretch pt-[2.70px] flex flex-col justify-start items-start">
                <div className="self-stretch text-white text-base font-bold leading-6">Execute with Controls</div>
              </div>
              <div className="self-stretch pb-2 flex flex-col justify-start items-start">
                <div className="self-stretch text-slate-300 text-xs font-normal leading-5">Acts only within pre-approved,<br />policy-bounded limits.</div>
              </div>
              <div className="self-stretch px-3 py-2.5 bg-white/5 rounded-lg flex flex-col justify-start items-start border border-white/10">
                <div className="text-slate-300 text-xs font-normal leading-5">Example: auto-tags a duplicate<br />ticket under $0 impact.</div>
              </div>
            </div>
          </div>

          {/* Role Authority Matrix Table */}
          <div className="self-stretch rounded-2xl border border-slate-200 flex flex-col justify-start items-start overflow-hidden shadow-xs">
            <div className="self-stretch min-w-[760px] bg-white flex flex-col justify-start items-start overflow-x-auto">
              <div className="self-stretch inline-flex justify-center items-start">
                <div className="w-80 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-start">
                  <div className="text-gray-900 text-xs font-semibold uppercase leading-4 tracking-wide">Role</div>
                </div>
                <div className="w-20 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">View</div>
                </div>
                <div className="w-24 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Review</div>
                </div>
                <div className="w-28 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Approve</div>
                </div>
                <div className="w-28 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Execute</div>
                </div>
                <div className="w-56 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Policy / Model Admin</div>
                </div>
                <div className="w-48 px-4 pt-2.5 pb-3 bg-slate-50 border-b border-slate-200 inline-flex flex-col justify-start items-center">
                  <div className="text-center text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Evidence Export</div>
                </div>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start divide-y divide-slate-100">
                {PERMISSIONS_MATRIX.map((row, idx) => (
                  <div key={idx} className="self-stretch inline-flex justify-center items-start hover:bg-slate-50/60 transition-colors">
                    <div className="w-80 px-4 py-3 bg-white inline-flex flex-col justify-start items-start">
                      <div className="text-gray-900 text-xs font-semibold leading-5">{row.role}</div>
                    </div>
                    <div className="w-20 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.view ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                    <div className="w-24 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.review ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                    <div className="w-28 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.approve ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                    <div className="w-28 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.execute ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                    <div className="w-56 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.admin ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                    <div className="w-48 px-4 py-3 inline-flex flex-col justify-start items-center">
                      {row.export ? <span className="text-center text-emerald-600 text-xs font-extrabold leading-5">✓</span> : <span className="text-center text-slate-300 text-xs leading-5">—</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POLICY GUARDRAILS — Figma Exact */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col justify-start items-start gap-4 font-['Plus_Jakarta_Sans']">
          <div className="w-full max-w-[640px] pt-1 pb-6 flex flex-col justify-start items-start gap-3.5">
            <div className="text-blue-500 text-xs font-bold uppercase leading-4 tracking-widest">
              POLICY GUARDRAILS
            </div>
            <div className="self-stretch pt-[1.50px] flex flex-col justify-start items-start">
              <h2 className="self-stretch text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Policy is inspectable, not a green light.
              </h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="self-stretch text-slate-500 text-base font-normal leading-6">
                Every recommendation is checked against a versioned, scoped rule set. The<br className="hidden sm:inline" />
                outcome always shows its reasoning.
              </p>
            </div>
          </div>

          {/* Card 1 — Constrained */}
          <div className="self-stretch p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-start items-start gap-3.5 shadow-xs">
            <div className="self-stretch flex justify-between items-start flex-wrap gap-2">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-gray-900 text-base font-bold leading-6">RA-CREDIT-LIMIT-002</div>
                <div className="text-slate-500 text-xs font-normal font-['IBM_Plex_Mono'] leading-4">
                  Version v4.2 · Effective 2026-06-01 · Scope: Revenue Assurance / All Jurisdictions
                </div>
              </div>
              <div className="px-2.5 py-1 bg-yellow-950/20 rounded-full border border-amber-400/30 flex justify-start items-center">
                <span className="text-amber-600 text-xs font-bold leading-4 tracking-tight">Constrained</span>
              </div>
            </div>

            <div className="self-stretch py-3.5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Condition evaluated</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">Credit amount &gt; $500</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Observed value</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">$612.40</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Override allowed</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">Yes, with Finance Approver</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Changed since decision</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">No</div>
              </div>
            </div>

            <div className="self-stretch px-4 py-3.5 bg-slate-50 rounded-xl flex justify-between items-center flex-wrap gap-3 border border-slate-100">
              <div>
                <span className="text-slate-600 text-xs font-normal leading-5">Proposed action </span>
                <span className="text-gray-900 text-xs font-bold leading-5">&quot;Issue credit note&quot;</span>
                <span className="text-slate-600 text-xs font-normal leading-5"> is held pending Finance / Billing Approver sign-off.</span>
              </div>
              <div className="flex justify-start items-start gap-2">
                <button className="px-3.5 py-1.5 bg-white rounded-lg border border-slate-200 text-gray-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  Compare policy
                </button>
                <button className="px-3.5 py-1.5 bg-white rounded-lg border border-slate-200 text-gray-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  Open evidence
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 — Block */}
          <div className="self-stretch p-5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-start items-start gap-3.5 shadow-xs">
            <div className="self-stretch flex justify-between items-start flex-wrap gap-2">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-gray-900 text-base font-bold leading-6">FRAUD-SUSPEND-011</div>
                <div className="text-slate-500 text-xs font-normal font-['IBM_Plex_Mono'] leading-4">
                  Version v2.0 · Effective 2026-03-14 · Scope: Fraud / Risk / GH, NG
                </div>
              </div>
              <div className="px-2.5 py-1 bg-rose-950/20 rounded-full border border-red-400/30 flex justify-start items-center">
                <span className="text-rose-600 text-xs font-bold leading-4 tracking-tight">Block</span>
              </div>
            </div>

            <div className="self-stretch py-3.5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Condition evaluated</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">Auto-suspend without case review</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Observed value</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">Not permitted</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Override allowed</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">No — requires Policy Admin change</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-slate-500 text-xs uppercase leading-4 tracking-wide">Changed since decision</div>
                <div className="text-gray-900 text-xs font-semibold leading-5">No</div>
              </div>
            </div>

            <div className="self-stretch px-4 py-3.5 bg-slate-50 rounded-xl flex justify-between items-center flex-wrap gap-3 border border-slate-100">
              <div>
                <span className="text-slate-600 text-xs font-normal leading-5">Proposed action </span>
                <span className="text-gray-900 text-xs font-bold leading-5">&quot;Auto-suspend cluster&quot;</span>
                <span className="text-slate-600 text-xs font-normal leading-5"> is blocked. Routed instead to a manual fraud case for review.</span>
              </div>
              <div className="flex justify-start items-start gap-2">
                <button className="px-3.5 py-1.5 bg-white rounded-lg border border-slate-200 text-gray-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  Compare policy
                </button>
                <button className="px-3.5 py-1.5 bg-white rounded-lg border border-slate-200 text-gray-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                  Open evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPLAINABILITY & EVIDENCE — Figma Exact */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 font-['Plus_Jakarta_Sans']">
          <div className="w-full max-w-[640px] pt-1 mb-10 flex flex-col justify-start items-start gap-3.5">
            <div className="text-blue-500 text-xs font-bold uppercase leading-4 tracking-widest">
              EXPLAINABILITY &amp; EVIDENCE
            </div>
            <div className="self-stretch pt-[1.50px] flex flex-col justify-start items-start">
              <h2 className="self-stretch text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Why did this recommendation appear?
              </h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="self-stretch text-slate-500 text-base font-normal leading-6">
                Layered, traceable context — not a single confidence score standing in for proof.
              </p>
            </div>
          </div>

          {/* 5-layer vertical reasoning chain with exact Figma styling */}
          <div className="relative max-w-4xl pl-8 space-y-7 before:absolute before:left-2 before:top-2 before:bottom-6 before:w-0.5 before:bg-slate-300">
            {/* Layer 1 */}
            <div className="relative flex flex-col justify-start items-start gap-1.5">
              <div className="absolute -left-[30px] top-1 w-4 h-4 bg-white rounded-lg border-2 border-slate-900 z-10" />
              <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">
                Layer 1 — Direct reason
              </div>
              <div className="text-gray-900 text-base font-bold leading-6">
                Systematic overage from a superseded tariff snapshot
              </div>
              <div className="text-slate-600 text-sm font-normal leading-6">
                The rating engine applied tariff version t-2026.02 instead of the active t-2026.03 snapshot to 214 prepaid lines in Batch 4471.
              </div>
            </div>

            {/* Layer 2 */}
            <div className="relative flex flex-col justify-start items-start gap-1.5">
              <div className="absolute -left-[30px] top-1 w-4 h-4 bg-white rounded-lg border-2 border-slate-900 z-10" />
              <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">
                Layer 2 — Supporting evidence
              </div>
              <div className="text-gray-900 text-base font-bold leading-6">
                Correlated mediation events
              </div>
              <div className="text-slate-600 text-sm font-normal leading-6">
                Three late-arriving usage batches, all timestamped before the tariff cutover, matched the same rating path.
              </div>
              <div className="pt-1 flex flex-wrap gap-2">
                {["EVT-99013", "EVT-99014", "EVT-99041"].map((code) => (
                  <span
                    key={code}
                    className="px-2 py-1 bg-slate-50 rounded-md border border-slate-200 text-slate-600 text-xs font-mono leading-4"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Layer 3 */}
            <div className="relative flex flex-col justify-start items-start gap-1.5">
              <div className="absolute -left-[30px] top-1 w-4 h-4 bg-white rounded-lg border-2 border-slate-900 z-10" />
              <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">
                Layer 3 — Model / rule context
              </div>
              <div className="text-gray-900 text-base font-semibold font-mono leading-6">
                rating-anomaly · v2.3.1
              </div>
              <div className="text-slate-600 text-sm font-normal leading-6">
                Trained for tariff-mismatch detection in prepaid rating pipelines. Known scope: real-time and near-real-time batches only.
              </div>
            </div>

            {/* Layer 4 */}
            <div className="relative flex flex-col justify-start items-start gap-1.5">
              <div className="absolute -left-[30px] top-1 w-4 h-4 bg-white rounded-lg border-2 border-amber-400 z-10" />
              <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">
                Layer 4 — Limitations
              </div>
              <div className="text-gray-900 text-base font-bold leading-6">
                Partial batch coverage
              </div>
              <div className="text-slate-600 text-sm font-normal leading-6">
                Two of five affected mediation batches were outside the model&apos;s ingestion window. Confidence is reduced for the remaining scope.
              </div>
            </div>

            {/* Layer 5 (Layer 6) */}
            <div className="relative flex flex-col justify-start items-start gap-1.5">
              <div className="absolute -left-[30px] top-1 w-4 h-4 bg-white rounded-lg border-2 border-emerald-400 z-10" />
              <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">
                Layer 6 — Decision record
              </div>
              <div className="text-gray-900 text-base font-bold leading-6">
                Pending reviewer action
              </div>
              <div className="text-slate-600 text-sm font-normal leading-6">
                Assigned to Revenue Assurance Lead. No action taken yet — this recommendation is not the decision of record until reviewed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MODEL GOVERNANCE & BOUNDARY — Figma Exact */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col justify-start items-start gap-12 font-['Plus_Jakarta_Sans']">
          <div className="w-full max-w-[640px] pt-1 flex flex-col justify-start items-start gap-3.5">
            <div className="justify-center text-blue-500 text-xs font-bold uppercase leading-4 tracking-widest">
              MODEL GOVERNANCE &amp; BOUNDARY
            </div>
            <div className="self-stretch pt-[1.50px] flex flex-col justify-start items-start">
              <h2 className="text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Every decision keeps its original context
              </h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="text-slate-500 text-base font-normal leading-6">
                Model and policy versions are tied to the decision that used them — updating a model never rewrites history.
              </p>
            </div>
          </div>

          {/* Side-by-Side: Left text + Right Image (governance-meeting.png) */}
          <div className="self-stretch grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 leading-8">Registry-backed, not best-effort.</h3>
              <p className="text-slate-500 text-sm leading-6 max-w-md">
                Each model or rule version is registered with an owner, a validation reference, and a deployment scope — the same discipline used for any production service change.
              </p>
            </div>

            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-2xl h-72">
              <Image
                src="/image/ai-decision/governance-meeting.png"
                alt="Model governance and policy registry"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-normal leading-5">
                Model and policy registry — versioned like any production deployment
              </div>
            </div>
          </div>

          {/* Model Registry Table */}
          <div className="self-stretch rounded-2xl border border-slate-200 flex flex-col justify-start items-start overflow-hidden shadow-xs">
            <div className="self-stretch min-w-[760px] bg-white flex flex-col justify-start items-start overflow-x-auto">
              <div className="self-stretch inline-flex justify-center items-start">
                <div className="w-56 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Use Case</div>
                </div>
                <div className="w-64 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Model / Rule ID</div>
                </div>
                <div className="w-32 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Version</div>
                </div>
                <div className="w-36 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Status</div>
                </div>
                <div className="w-48 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Drift</div>
                </div>
                <div className="w-44 px-3.5 py-3 bg-slate-50 inline-flex flex-col justify-start items-start border-b border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase leading-4 tracking-wide">Last Changed</div>
                </div>
              </div>

              <div className="self-stretch flex flex-col justify-start items-start">
                {MODEL_REGISTRY.map((row, idx) => (
                  <div key={idx} className="self-stretch inline-flex justify-center items-start border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                    <div className="w-56 px-3.5 py-4 inline-flex flex-col justify-start items-start">
                      <div className="text-gray-900 text-xs font-normal leading-5">{row.useCase}</div>
                    </div>
                    <div className="w-64 px-3.5 py-4 inline-flex flex-col justify-start items-start">
                      <div className="text-gray-900 text-xs font-normal font-['IBM_Plex_Mono'] leading-5">{row.model}</div>
                    </div>
                    <div className="w-32 px-3.5 py-4 inline-flex flex-col justify-start items-start">
                      <div className="text-gray-900 text-xs font-normal font-['IBM_Plex_Mono'] leading-5">{row.version}</div>
                    </div>
                    <div className="w-36 px-3.5 py-3 inline-flex flex-col justify-start items-start">
                      <div className="px-2.5 py-1 bg-cyan-950/20 rounded-full border border-teal-400/30 inline-flex justify-start items-center">
                        <span className={`text-xs font-bold leading-4 tracking-tight ${row.status === "Active" ? "text-teal-600" : "text-slate-400"}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-48 px-3.5 py-3 inline-flex flex-col justify-start items-start">
                      <div className="px-2.5 py-1 bg-teal-950/20 rounded-full border border-emerald-400/30 inline-flex justify-start items-center">
                        <span className={`text-xs font-bold leading-4 tracking-tight ${row.drift === "Normal" ? "text-emerald-600" : row.drift === "Needs review" ? "text-amber-600" : "text-slate-400"}`}>
                          {row.drift}
                        </span>
                      </div>
                    </div>
                    <div className="w-44 px-3.5 py-4 inline-flex flex-col justify-start items-start">
                      <div className="text-gray-900 text-xs font-normal leading-5">{row.lastChanged}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Connected Step Cards Below Table */}
          <div className="self-stretch flex justify-between items-center flex-wrap gap-2 pt-2">
            <div className="flex-1 min-w-32 px-4 pt-3.5 pb-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-start items-center shadow-2xs">
              <div className="text-center text-gray-900 text-xs font-bold leading-5">Upstream signals</div>
              <div className="text-center text-slate-500 text-xs font-normal leading-4">Usage, billing, network events</div>
            </div>
            <span className="text-slate-300 text-base font-normal">→</span>
            <div className="flex-1 min-w-32 px-4 pt-3.5 pb-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-start items-center shadow-2xs">
              <div className="text-center text-gray-900 text-xs font-bold leading-5">Decision service</div>
              <div className="text-center text-slate-500 text-xs font-normal leading-4">Analyze → recommend</div>
            </div>
            <span className="text-slate-300 text-base font-normal">→</span>
            <div className="flex-1 min-w-32 px-4 pt-3.5 pb-4 bg-amber-50 rounded-xl border border-amber-400 flex flex-col justify-start items-center shadow-2xs">
              <div className="text-center text-gray-900 text-xs font-bold leading-5">Policy / Authority</div>
              <div className="text-center text-slate-500 text-xs font-normal leading-4">Boundary: review required</div>
            </div>
            <span className="text-slate-300 text-base font-normal">→</span>
            <div className="flex-1 min-w-32 px-4 pt-3.5 pb-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-start items-center shadow-2xs">
              <div className="text-center text-gray-900 text-xs font-bold leading-5">Downstream action</div>
              <div className="text-center text-slate-500 text-xs font-normal leading-4">Approved write / event</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE TRUST — Figma Exact */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col justify-start items-start gap-12 font-['Plus_Jakarta_Sans']">
          <div className="w-full max-w-[640px] pt-1 flex flex-col justify-start items-start gap-3.5">
            <div className="justify-center text-blue-500 text-xs font-bold uppercase leading-4 tracking-widest">
              ENTERPRISE TRUST
            </div>
            <div className="self-stretch pt-[1.50px] flex flex-col justify-start items-start">
              <h2 className="text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Built for the questions architecture and compliance ask first
              </h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="text-slate-500 text-base font-normal leading-6">
                Public evidence, not a sales pitch, resolves most evaluation questions before the first call.
              </p>
            </div>
          </div>

          {/* Side-by-Side: Left Image (human-checkpoint.png) + Right Steps 01 to 05 */}
          <div className="self-stretch grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-2xl h-96">
              <Image
                src="/image/ai-decision/human-checkpoint.png"
                alt="Governance and compliance review walkthrough"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-normal leading-5">
                Governance and compliance review — evaluation pathway walkthrough
              </div>
            </div>

            {/* Right Steps */}
            <div className="lg:col-span-6 flex flex-col justify-start items-start gap-4">
              <div className="self-stretch">
                <h3 className="text-gray-900 text-2xl font-bold leading-9">Evaluate at your own pace.</h3>
                <p className="text-slate-500 text-sm leading-6 mt-1">
                  Architecture, governance, compliance and procurement teams can inspect authority, policy, and evidence design before any commercial conversation starts. Trust links route to the same authoritative pages used internally — nothing here duplicates or overstates a claim.
                </p>
              </div>

              {/* Grid of Steps with arrows */}
              <div className="self-stretch grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-start items-start gap-1 relative">
                  <div className="text-slate-400 text-xs font-mono">01</div>
                  <div className="text-gray-900 text-xs font-bold leading-4">Choose use cases</div>
                  <div className="text-slate-500 text-[11px] leading-4">Pick priority decision types</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-start items-start gap-1 relative">
                  <div className="text-slate-400 text-xs font-mono">02</div>
                  <div className="text-gray-900 text-xs font-bold leading-4">Review decision object</div>
                  <div className="text-slate-500 text-[11px] leading-4">Inspect a real workflow</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-start items-start gap-1 relative">
                  <div className="text-slate-400 text-xs font-mono">03</div>
                  <div className="text-gray-900 text-xs font-bold leading-4">Inspect controls</div>
                  <div className="text-slate-500 text-[11px] leading-4">Authority, policy, evidence</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-start items-start gap-1 relative sm:col-span-1">
                  <div className="text-slate-400 text-xs font-mono">04</div>
                  <div className="text-gray-900 text-xs font-bold leading-4">Assess integration</div>
                  <div className="text-slate-500 text-[11px] leading-4">Upstream/downstream fit</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-start items-start gap-1 relative sm:col-span-2">
                  <div className="text-slate-400 text-xs font-mono">05</div>
                  <div className="text-gray-900 text-xs font-bold leading-4">Request briefing</div>
                  <div className="text-slate-500 text-[11px] leading-4">Talk to the team</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Bottom Cards with Links */}
          <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <Link
              href="/governance"
              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <div className="text-gray-900 text-sm font-bold leading-5">Access &amp; Permissions</div>
                <div className="text-slate-500 text-xs leading-5 mt-1">Role-based decision rights, mapped and enforced per authority level.</div>
              </div>
              <div className="text-cyan-700 text-xs font-bold leading-5">AI Governance →</div>
            </Link>

            <Link
              href="/trust"
              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <div className="text-gray-900 text-sm font-bold leading-5">Data Minimization</div>
                <div className="text-slate-500 text-xs leading-5 mt-1">Decision context uses only what a use case requires — nothing more.</div>
              </div>
              <div className="text-cyan-700 text-xs font-bold leading-5">Trust Center →</div>
            </Link>

            <Link
              href="/evidence"
              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <div className="text-gray-900 text-sm font-bold leading-5">Auditability</div>
                <div className="text-slate-500 text-xs leading-5 mt-1">Every reviewed decision is reconstructable from its evidence record.</div>
              </div>
              <div className="text-cyan-700 text-xs font-bold leading-5">Evidence Ledger →</div>
            </Link>

            <Link
              href="/platform-architecture"
              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md transition-shadow cursor-pointer"
            >
              <div>
                <div className="text-gray-900 text-sm font-bold leading-5">Architecture</div>
                <div className="text-slate-500 text-xs leading-5 mt-1">Decision service boundaries and integration points, explained.</div>
              </div>
              <div className="text-cyan-700 text-xs font-bold leading-5">Platform Architecture →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER (Dark Navy `#08182B` with chips) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 font-['Plus_Jakarta_Sans']">
          <div className="relative rounded-2xl overflow-hidden bg-[#08182B] text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="text-xs font-bold uppercase tracking-widest text-sky-400">NEXT STEP</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                See governed decision intelligence on your own use cases.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Request a briefing to walk through authority, policy and evidence design — or
                start a technical evaluation with your architecture team.
              </p>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Signal",
                  "Recommendation",
                  "Policy check",
                  "Authority",
                  "Human accountability",
                  "Controlled action",
                  "Evidence preserved",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
                >
                  Request an AI Decision Briefing
                </Link>
                <Link
                  href="/request-a-demo"
                  className="px-6 py-3 rounded-md bg-transparent hover:bg-white/10 border border-slate-600 text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Start Technical Evaluation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION — Figma Exact */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200 font-['Plus_Jakarta_Sans']">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 flex flex-col justify-start items-start gap-12">
          <div className="self-stretch pt-1 flex flex-col justify-start items-center gap-4">
            <div className="text-center justify-center text-cyan-700 text-xs font-bold uppercase leading-4 tracking-widest">
              FAQ
            </div>
            <div className="self-stretch flex flex-col justify-start items-center">
              <h2 className="text-center text-gray-900 text-3xl sm:text-4xl font-bold leading-[51px]">
                Direct answers
              </h2>
            </div>
          </div>

          <div className="self-stretch flex flex-col justify-start items-start divide-y divide-slate-200 border-b border-slate-200">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="self-stretch flex flex-col justify-start items-start py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <span className="text-gray-900 text-base font-semibold group-hover:text-blue-600 transition-colors">
                      {faq.q}
                    </span>
                    <div className="w-5 h-5 flex items-center justify-center text-slate-500 shrink-0">
                      {isOpen ? <X className="w-4 h-4 text-slate-600" /> : <Plus className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pt-3 max-w-3xl">
                      <p className="text-slate-500 text-sm font-normal leading-6">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
