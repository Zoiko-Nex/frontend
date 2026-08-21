"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Plus,
  Minus,
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
  { useCase: "Revenue Assurance", model: "rating-anomaly", version: "v2.3.1", status: "Active", drift: "Normal", lastChanged: "2026-07-01" },
  { useCase: "Fraud / Risk", model: "sim-cluster-check", version: "v1.9.8", status: "Active", drift: "Needs review", lastChanged: "2026-06-19" },
  { useCase: "Tax Anomalies", model: "jurisdiction-check", version: "v3.1.4", status: "Active", drift: "Normal", lastChanged: "2026-05-17" },
  { useCase: "Retention / Churn", model: "churn-propensity", version: "v4.8.2", status: "Paused", drift: "—", lastChanged: "2026-04-09" },
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
    <div className="w-full bg-[#EEF2F7] text-slate-900 min-h-screen">
      {/* 1. HERO (Dark Navy `#08182B`) */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.10),transparent_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
                <span className="w-4 h-[2px] bg-sky-400 inline-block" />
                AI &amp; DECISION INTELLIGENCE
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Turn AI signals into governed telecom decisions.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Detect anomalies, prioritize issues, and prepare recommendations — then apply policy
                guardrails, route human approval, and preserve decision evidence. Every step accountable,
                every action bounded.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact-us"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold transition-all text-sm inline-flex items-center gap-2 shadow-md"
                >
                  Request an AI Decision Briefing
                </Link>
                <Link
                  href="/request-a-demo"
                  className="px-6 py-3 rounded-md bg-transparent hover:bg-white/10 border border-slate-600 text-white font-semibold transition-all text-sm"
                >
                  Start Technical Evaluation
                </Link>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <Image src="/image/ai-decision/icon-check.svg" alt="Check" width={16} height={16} className="mt-0.5" />
                <span>
                  Decision support with explicit authority, policy, provenance, and evidence — never
                  autonomous action on high-impact outcomes.
                </span>
              </div>
            </div>

            {/* Right: Decision Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                {/* Header strip */}
                <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-300 ml-2">Decision Review · DEC-88213</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Review required
                  </span>
                </div>

                {/* Network Graphic */}
                <div className="h-52 relative overflow-hidden bg-slate-950">
                  <Image
                    src="/image/ai-decision/hero-network.png"
                    alt="AI Decision Review — Network Telemetry"
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] z-10">
                    <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-slate-200 backdrop-blur">
                      Model: rating-anomaly · v2.3.1
                    </span>
                    <span className="bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-slate-200 backdrop-blur">
                      Policy: RA-CREDIT-LIMIT-002
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-lg bg-slate-950/90 backdrop-blur border border-slate-800 text-xs">
                    <div className="text-emerald-400 font-semibold mb-0.5">
                      Signal: 6% systematic overage across 214 prepaid lines
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Triggered by late-arrival mediation snapshot mismatch.
                    </div>
                  </div>
                </div>

                {/* Footer strip */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Assigned to: <span className="text-white font-medium">Revenue Assurance Lead</span>
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById("decision-queue");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                  >
                    Inspect in Queue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GOVERNANCE MODEL — Accountability before capability */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">
              GOVERNANCE MODEL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Accountability before capability
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Before you see the product, see the boundary. Nothing here acts on your business
              without a policy check and a named human decision.
            </p>
          </div>

          {/* Full-width photo banner */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src="/image/ai-decision/human-checkpoint.png"
                alt="Human review checkpoint in telecom operations"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
                <div className="px-4 py-2.5 rounded-xl bg-slate-950/75 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-slate-700/50 shadow-lg max-w-md">
                  Human review checkpoint — a flagged decision is authorized, not auto-executed
                </div>
              </div>
            </div>
          </div>

          {/* 4 Dark Teal Cards with exact SVGs */}
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
              <div key={i} className="p-6 rounded-2xl bg-[#103B56] text-white border border-[#1E4D6E]/60 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[#0B2A3E] flex items-center justify-center">
                  <Image src={card.icon} alt={card.title} width={22} height={22} />
                </div>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT PROOF — Decision Queue */}
      <section id="decision-queue" className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-8">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">
              PRODUCT PROOF
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              An operational decision queue, not a<br />dashboard.
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Synthetic data shown for illustration. Every row is a real decision object with authority,
              policy, and reviewer state attached.
            </p>
          </div>

          {actionFeedback && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{actionFeedback}</span>
            </div>
          )}

          {/* Dark Dashboard Container */}
          <div className="rounded-2xl bg-[#08182B] text-white border border-slate-800 overflow-hidden shadow-2xl">
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

                  {/* Expanded row detail */}
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
                      <button onClick={() => handleActionClick("Review decision")} className="px-3 py-1.5 rounded bg-[#55A630] hover:bg-[#478f28] text-white font-bold text-[11px] transition-colors">
                        Review decision
                      </button>
                      <button onClick={() => handleActionClick("Open evidence")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors">
                        Open evidence
                      </button>
                      <button onClick={() => handleActionClick("Compare policy")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors">
                        Compare policy
                      </button>
                      <button onClick={() => handleActionClick("Escalate")} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-[11px] border border-slate-700 transition-colors">
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inspector drawer */}
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

      {/* 4. TELECOM USE CASES */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">
              TELECOM USE CASES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What can AI do here?
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
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
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
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
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
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
                        <Image src="/image/ai-decision/icon-check-2.svg" alt="Permitted" width={16} height={16} className="flex-shrink-0 mt-0.5" />
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
                        <Image src="/image/ai-decision/icon-close-cross.svg" alt="Forbidden" width={16} height={16} className="flex-shrink-0 mt-0.5" />
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

      {/* 5. HUMAN DECISION RIGHTS — Authority is a permission */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">
              HUMAN DECISION RIGHTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Authority is a permission, not a badge.
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Each level changes exactly what AI is allowed to produce — and where an
              accountable human must step in.
            </p>
          </div>

          {/* 4 Authority level cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { level: "LEVEL 01", title: "Inform", desc: "Surfaces a signal or metric. No recommendation is generated. Cannot be acted on by AI.", example: "Example: flags a usage spike for analyst awareness.", dark: false },
              { level: "LEVEL 02", title: "Recommend", desc: "Proposes an action with rationale. Cannot be executed by AI.", example: "Example: suggests a credit note for a rating error.", dark: false },
              { level: "LEVEL 03", title: "Prepare", desc: "Drafts the action object for review — the draft is not live.", example: "Example: prepares a case file, unsent to billing.", dark: false },
              { level: "LEVEL 04", title: "Execute with Controls", desc: "Acts only within pre-approved, policy-bounded limits.", example: "Example: auto-tags a duplicate ticket under $0 impact, permitted actions only.", dark: true },
            ].map((card, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border space-y-3 ${
                  card.dark
                    ? "bg-[#08182B] border-slate-700 text-white"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-wider ${card.dark ? "text-sky-400" : "text-slate-500"}`}>
                  {card.level}
                </div>
                <h3 className={`text-sm font-bold ${card.dark ? "text-white" : "text-slate-900"}`}>{card.title}</h3>
                <p className={`text-xs leading-relaxed ${card.dark ? "text-slate-300" : "text-slate-600"}`}>{card.desc}</p>
                <div className={`text-[11px] p-2.5 rounded border ${card.dark ? "bg-slate-800/60 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                  <em>{card.example}</em>
                </div>
              </div>
            ))}
          </div>

          {/* Role Authority Matrix */}
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-600 tracking-wider">
              Role Authority Matrix
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-slate-600 font-semibold uppercase">ROLE</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">VIEW</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">REVIEW</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">APPROVE</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">EXECUTE</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">POLICY / MODEL ADMIN</th>
                    <th className="py-3 px-4 text-center text-slate-600 font-semibold uppercase">EVIDENCE EXPORT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PERMISSIONS_MATRIX.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{row.role}</td>
                      <td className="py-3.5 px-4 text-center">{row.view && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                      <td className="py-3.5 px-4 text-center">{row.review && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                      <td className="py-3.5 px-4 text-center">{row.approve && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                      <td className="py-3.5 px-4 text-center">{row.execute && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                      <td className="py-3.5 px-4 text-center">{row.admin && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                      <td className="py-3.5 px-4 text-center">{row.export && <Image src="/image/ai-decision/icon-check.svg" alt="Yes" width={14} height={14} className="mx-auto" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POLICY GUARDRAILS */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">POLICY GUARDRAILS</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Policy is inspectable, not a green light.
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Every recommendation is checked against a versioned, scoped ruleset. The
              outcome always shows its reasoning.
            </p>
          </div>

          {/* Policy inspection cards */}
          <div className="space-y-5">
            {/* Card 1 — Constrained */}
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-900 font-mono">RA-CREDIT-LIMIT-002</div>
                  <div className="text-xs text-slate-500 mt-0.5">Version v4.2 · Effective 2026-06-01 · Scope: Revenue Assurance / All · Jurisdiction: US-only</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex-shrink-0">Constrained</span>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-100">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Condition evaluates</div>
                  <div className="text-slate-700 font-medium">Credit amount &gt; $500</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Observed value</div>
                  <div className="text-slate-700 font-medium">$842.40</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">AI allowed to claim</div>
                  <div className="text-slate-700 font-medium">Yes, with Finance Approver</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Change/Prior Decision</div>
                  <div className="text-slate-700 font-medium">No</div>
                </div>
              </div>
              <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-600">
                  Proposed action: <strong>&quot;Issue credit note&quot;</strong> held pending Finance/Billing Approver sign-off.
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:underline font-semibold">Company policy</button>
                  <button className="text-blue-600 hover:underline font-semibold">Open evidence</button>
                </div>
              </div>
            </div>

            {/* Card 2 — Blocked */}
            <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-900 font-mono">FRAUD-SUSPEND-011</div>
                  <div className="text-xs text-slate-500 mt-0.5">Version v1.9 · Effective 2026-05-14 · Scope: Fraud / Exit / P4, P6</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex-shrink-0">Block</span>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-100">
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Condition evaluates</div>
                  <div className="text-slate-700 font-medium">Auto-suspend without case review</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Observed value</div>
                  <div className="text-slate-700 font-medium">Not permitted</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">AI allowed to claim</div>
                  <div className="text-slate-700 font-medium">No — requires Policy Admin change</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] uppercase mb-0.5">Change/Prior Decision</div>
                  <div className="text-slate-700 font-medium">No</div>
                </div>
              </div>
              <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-600">
                  Proposed action: <strong>&quot;Auto-suspend cluster&quot;</strong> is blocked. Rededicated to external manual escalation for review.
                </span>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:underline font-semibold">Company policy</button>
                  <button className="text-blue-600 hover:underline font-semibold">Open evidence</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPLAINABILITY & EVIDENCE */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">EXPLAINABILITY &amp; EVIDENCE</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why did this recommendation appear?
            </h2>
            <p className="text-sm text-slate-500">
              Layered, traceable context — not a single confidence score standing in for proof.
            </p>
          </div>

          {/* 5-layer reasoning chain */}
          <div className="space-y-0">
            {[
              {
                layer: "LAYER 1 — DIRECT REASON",
                title: "Systematic coverage from a superseded tariff snapshot",
                desc: "The rating engine applied tariff version 1-2024-Q2 instead of the active 1-2024-Q3 snapshot, for 214 impacted prepaid lines in Batch-4471.",
                chips: [],
                color: "emerald",
              },
              {
                layer: "LAYER 2 — SUPPORTING EVIDENCE",
                title: "Correlated mediation events",
                desc: "Three late-arriving usage batches all timestamps before the tariff cutover matched the same rating path.",
                chips: ["EVT-19861", "EVT-19964", "EVT-19981"],
                color: "emerald",
              },
              {
                layer: "LAYER 3 — MODEL / RULE CONTEXT",
                title: "rating-anomaly — v2.3.1",
                desc: "Trained for tariff-mismatch detection in prepaid rating pipelines. Known scope: real-time and near-real-time batches only.",
                chips: [],
                color: "slate",
              },
              {
                layer: "LAYER 4 — LIMITATIONS",
                title: "Partial batch coverage",
                desc: "Two of five affected mediation batches were outside the model's ingestion window. Confidence is reduced for the remaining scope.",
                chips: [],
                color: "slate",
              },
              {
                layer: "LAYER 5 — DECISION SCORE",
                title: "Pending reviewer action",
                desc: "Assigned to Revenue Assurance Lead. No action taken yet — this recommendation is not the decision of record until reviewed.",
                chips: [],
                color: "slate",
              },
            ].map((layer, i) => (
              <div key={i} className="flex gap-5">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 mt-5 flex-shrink-0 ${layer.color === "emerald" ? "border-emerald-500 bg-emerald-100" : "border-slate-300 bg-white"}`} />
                  {i < 4 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                </div>
                <div className="pb-7 flex-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">{layer.layer}</div>
                  <div className="text-sm font-bold text-slate-900 mb-1">{layer.title}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{layer.desc}</p>
                  {layer.chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {layer.chips.map((chip) => (
                        <span key={chip} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">{chip}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MODEL GOVERNANCE & BOUNDARY */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">MODEL GOVERNANCE &amp; BOUNDARY</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Every decision keeps its original context
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Model and policy versions are tied to the decision that used them — updating a model
              never rewrites its history.
            </p>
          </div>

          {/* Registry-backed + photo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Registry-backed, not best-effort.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Each model or rule version is registered with an owner, a validation reference, and a
                deployment scope — the same discipline used for any production service change.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-56 shadow-lg">
              <Image
                src="/image/ai-decision/governance-meeting.png"
                alt="Model governance and team review"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Model Registry Table */}
          <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">USE CASE</th>
                    <th className="py-3 px-4">MODEL / RULE ID</th>
                    <th className="py-3 px-4">VERSION</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">DRIFT</th>
                    <th className="py-3 px-4">LAST CHANGED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MODEL_REGISTRY.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-slate-800">{row.useCase}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{row.model}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{row.version}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.drift === "Normal" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : row.drift === "Needs review" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500"}`}>
                          {row.drift}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{row.lastChanged}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE TRUST */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">ENTERPRISE TRUST</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Built for the questions architecture and compliance ask first
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Public evidence, not a sales pitch, resolves most evaluation questions before the first call.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Photo */}
            <div className="relative rounded-2xl overflow-hidden h-72 shadow-lg">
              <Image
                src="/image/ai-decision/analysts-review.png"
                alt="Governance and compliance analyst review"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg bg-slate-950/80 text-white text-xs backdrop-blur border border-slate-700/50 max-w-[85%]">
                Governance and compliance review — evaluation at authority level
              </div>
            </div>

            {/* Evaluate at your own pace */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Evaluate at your own pace.</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Architecture, governance, compliance and procurement teams can inspect authority, policy,
                and evidence design before any commercial conversation starts. Trust links route to the
                same authoritative pages used internally — nothing here duplicates or overstates a claim.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                {[
                  { step: "01", title: "Choose use cases", desc: "Review permitted decision types." },
                  { step: "02", title: "Review decision object", desc: "Inspect a decision objects." },
                  { step: "03", title: "Inspect controls", desc: "Authority, policy, evidence." },
                  { step: "04", title: "Assess integration", desc: "Connect to existing APIs." },
                  { step: "05", title: "Request briefing", desc: "Talk to the team." },
                ].map((s) => (
                  <div key={s.step} className="space-y-1">
                    <div className="text-sky-500 font-bold text-[10px]">{s.step}</div>
                    <div className="font-bold text-slate-900">{s.title}</div>
                    <div className="text-slate-500">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER (Dark Navy `#08182B`) */}
      <section className="py-12 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-[#08182B] text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">NEXT STEP</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                See governed decision intelligence on your own use cases.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Request a briefing to walk through authority, policy and evidence design — or
                start a technical evaluation with your architecture team.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/contact-us"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold text-sm transition-all shadow-md"
                >
                  Request an AI Decision Briefing
                </Link>
                <Link
                  href="/request-a-demo"
                  className="px-6 py-3 rounded-md bg-transparent hover:bg-white/10 border border-slate-600 text-white font-semibold text-sm transition-all"
                >
                  Start Technical Evaluation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-500">FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Direct answers
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-600 text-lg font-bold">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
