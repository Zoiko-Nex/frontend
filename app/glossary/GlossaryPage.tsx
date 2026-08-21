"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Database,
  Lock,
  Cpu,
  Sparkles,
  GitBranch,
  Copy,
  Check,
  Plus,
  Minus,
} from "lucide-react";

interface SeedTerm {
  id: string;
  num: string;
  name: string;
  shortDef: string;
  categoryBadge: string;
  quote: string;
  expandedExplanation: string;
  scope: string;
  whatItIsNot: string[];
  zoikoContext: string;
  authority: string;
  currentness: string;
  scopeTag: string;
  broader: string;
  narrower: string;
  usedBy: string;
  contrastsWith: string;
  sourceReviewed: string;
}

const SEED_TERMS: SeedTerm[] = [
  {
    id: "governed-monetization",
    num: "01",
    name: "Governed Monetization",
    shortDef: "Every charge, rate and revenue rule traces to an approved, versioned source of truth.",
    categoryBadge: "ZOIKONEX FRAMEWORK",
    quote: "A monetization approach where every charge, rate, and revenue rule is traceable to an approved, versioned source of truth.",
    expandedExplanation: "Rather than logic embedded ad hoc across billing systems, every pricing decision — from a rate card change to a one-time discount — is issued from a single controlled source, reviewed before it takes effect, and recorded so it can be reconstructed later.",
    scope: "Applies platform-wide across ZoikoNex charging, rating and billing modules. Does not describe a specific pricing model, tax treatment, or jurisdictional rule set.",
    whatItIsNot: [
      "Not a specific pricing strategy or discount structure",
      "Not a compliance or certification claim",
      "Not a synonym for \"real-time billing\"",
    ],
    zoikoContext: "Governed Monetization is the framework the Unified Revenue Ledger and Governed Rate Card enforce operationally — see Related below.",
    authority: "ZoikoNex framework",
    currentness: "Current",
    scopeTag: "#Platform-wide",
    broader: "Revenue Governance",
    narrower: "Governed Rate Card",
    usedBy: "Unified Revenue Ledger",
    contrastsWith: "Ad hoc Pricing",
    sourceReviewed: "ZoikoNex Glossary Term Registry · reviewed Aug 2026 · next review scheduled Feb 2027",
  },
  {
    id: "sovereign-oss-bss",
    num: "02",
    name: "Sovereign OSS/BSS",
    shortDef: "OSS/BSS deployed and controlled entirely within a defined jurisdiction's boundary.",
    categoryBadge: "ARCHITECTURAL CONCEPT",
    quote: "Operational and Business Support Systems deployed, managed, and audited completely within a sovereign geographic and legal perimeter.",
    expandedExplanation: "Ensures subscriber personal identifiable information (PII), Call Detail Records (CDRs), and taxation transactions never leave designated national boundaries without cryptographic verification and regulatory sign-off.",
    scope: "Applies to sovereign cloud deployments, multi-tenant telecom partitions, and private operator instances.",
    whatItIsNot: [
      "Not standard multi-region cloud hosting",
      "Not simple data encryption at rest without boundary controls",
      "Not a vendor lock-in mechanism",
    ],
    zoikoContext: "Sovereign OSS/BSS enables multi-jurisdiction telecom operations while remaining 100% compliant with local data residency mandates.",
    authority: "Regulatory / legal / tax",
    currentness: "Current",
    scopeTag: "#Sovereign-deployments",
    broader: "Telecom Architecture",
    narrower: "Jurisdiction Pack",
    usedBy: "Sovereign Core Module",
    contrastsWith: "Centralized Global BSS",
    sourceReviewed: "ZoikoNex Glossary Term Registry · reviewed Jul 2026 · next review scheduled Jan 2027",
  },
  {
    id: "real-time-rating-engine",
    num: "03",
    name: "Real-time Rating Engine",
    shortDef: "Prices a usage event at the moment it occurs, not in a later batch cycle.",
    categoryBadge: "CORE CAPABILITY",
    quote: "A low-latency computation service that calculates the exact monetary value of network usage events within sub-200ms SLAs.",
    expandedExplanation: "Evaluates multidimensional rate cards against live usage streams (voice, data slices, API invocations) without external batch dependencies or database locking.",
    scope: "Active across all 3GPP Rel 16/17 CHF/SMF network integrations and CAMARA API gateways.",
    whatItIsNot: [
      "Not batch CDR processing",
      "Not balance deduction (which is handled by Charging)",
      "Not an invoice generator",
    ],
    zoikoContext: "The rating engine calculates price; the charging core validates against subscriber balances and credit policies.",
    authority: "Industry conventional",
    currentness: "Current",
    scopeTag: "#Sub-200ms-rating",
    broader: "Monetization Core",
    narrower: "Tariff Snapshot",
    usedBy: "Real-time Charging (CHF)",
    contrastsWith: "Batch Rating",
    sourceReviewed: "ZoikoNex Glossary Term Registry · reviewed Aug 2026 · next review scheduled Feb 2027",
  },
  {
    id: "slice-billing",
    num: "04",
    name: "Slice Billing",
    shortDef: "Meters and charges a single network slice independently of the rest of the plan.",
    categoryBadge: "5G CAPABILITY",
    quote: "Independent metering, rating, and invoicing for dedicated 5G network slices based on dynamic QoS, bandwidth, and latency guarantees.",
    expandedExplanation: "Enables operators to monetize enterprise SLAs (e.g. low-latency drone control, dedicated video feeds) separately from standard subscriber mobile data plans.",
    scope: "Governs 5G standalone (SA) Network Exposure Function (NEF) and Network Slice Selection Function (NSSF) interfaces.",
    whatItIsNot: [
      "Not standard APN traffic throttling",
      "Not generic bulk data buckets",
      "Not non-standalone (NSA) prioritization",
    ],
    zoikoContext: "Slice Billing maps network slice instance IDs directly to enterprise contract terms and automated SLA credit rules.",
    authority: "External standard",
    currentness: "Current",
    scopeTag: "#5G-Network-Slicing",
    broader: "Network Monetization",
    narrower: "QoS Rating Formula",
    usedBy: "Enterprise Invoicing",
    contrastsWith: "Flat Rate Data Plans",
    sourceReviewed: "ZoikoNex Glossary Term Registry · reviewed Jun 2026 · next review scheduled Dec 2026",
  },
];

const DOMAINS = [
  { name: "Identity / Account", count: "33", desc: "Customer, account and identity vocabulary." },
  { name: "Catalog / Order", count: "44", desc: "Product, catalog and order concepts." },
  { name: "Usage / Rating", count: "41", desc: "Mediation, rating and charging terms." },
  { name: "Billing / Payments", count: "57", desc: "Billing, payments and reconciliation." },
  { name: "Tax / Jurisdiction", count: "22", desc: "Jurisdictional tax and regulatory terms." },
  { name: "Voice / Carrier", count: "29", desc: "Voice, ILD and carrier partner terms." },
  { name: "eSIM / IoT / APIs", count: "37", desc: "eSIM, IoT and network API vocabulary." },
  { name: "Governance / Evidence", count: "26", desc: "Governance, evidence and AI-boundary terms." },
];

const ROLES = [
  "Executive",
  "CTO / Architect",
  "Commercial",
  "Finance",
  "Security / Compliance",
  "Developer",
  "Operator",
];

const AUTHORITY_TYPES = [
  { title: "External standard", desc: "Defined by a recognized external standards body." },
  { title: "Industry conventional", desc: "Common usage across telecom, without a single owning body." },
  { title: "Regulatory / legal / tax", desc: "Defined by a regulator, statute or tax authority." },
  { title: "ZoikoNex framework", desc: "A ZoikoNex category or architectural concept." },
  { title: "ZoikoNex product", desc: "The name of a specific ZoikoNex product or module." },
  { title: "Acronym", desc: "An expansion of an existing approved term." },
  { title: "Legacy / deprecated", desc: "Superseded — retained for search and history-only." },
];

const FAQS = [
  {
    q: "What is the ZoikoNex Glossary?",
    a: "A governed reference for telecom monetization terminology — reviewed, scoped and sourced, not an SEO dictionary.",
  },
  {
    q: "Does it replace Documentation or API Reference?",
    a: "No. The glossary defines concept vocabulary and architectural boundaries. API endpoints, data models, schemas, and integration guides are canonical in our official Documentation and API Reference.",
  },
  {
    q: "Are all terms industry standards?",
    a: "No. Every term explicitly states its authority type: External Standard (e.g. 3GPP, TM Forum), Industry Conventional, Regulatory / Tax, or ZoikoNex Framework.",
  },
  {
    q: "How are definitions reviewed?",
    a: "Definitions follow a 6-step lifecycle: Source → Review → Approve → Publish → Monitor → Update/Supersede. All public definitions require human approval and verifiable citations.",
  },
  {
    q: "How do I know a definition is current?",
    a: "Each definition displays its currentness status (Current, Review Due, or Superseded) along with the date of last review and the next scheduled review cycle.",
  },
  {
    q: "What happens when a term has multiple meanings?",
    a: "ZoikoNex never merges collision terms silently. Homonyms (like 'Usage Rating' vs 'Service Rating') open a disambiguation panel with explicit domain scopes.",
  },
  {
    q: "Can I search acronyms and aliases?",
    a: "Yes. The search index supports acronyms (e.g. GRC, CHF, USF, CDR) and approved aliases, routing you directly to the canonical definition.",
  },
  {
    q: "Does AI publish definitions?",
    a: "No. While AI may assist in drafting or collision detection during internal review, every public record requires sign-off from a named domain editor.",
  },
  {
    q: "Where should developers go?",
    a: "Developers should follow the 'Continue to' links on any term to jump directly into the relevant API Reference endpoints, SDK guides, or code examples.",
  },
  {
    q: "Can definitions be jurisdiction-specific?",
    a: "Yes. Tax and compliance terms (such as USF, GST/PST, or VAT rules) specify their applicable geographic and legal jurisdictions in the scope metadata.",
  },
];

export default function GlossaryPage() {
  const [selectedSeed, setSelectedSeed] = useState<SeedTerm>(SEED_TERMS[0]);
  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Executive");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-[#EEF2F7] text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (Dark Navy `#08182B`) */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12),transparent_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider">
                <span className="w-4 h-[2px] bg-sky-400 inline-block" />
                REFERENCE / GLOSSARY
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Telecom monetization terms, defined precisely.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                A governed reference for language across charging, rating, billing, tax, payments,
                OSS/BSS, governance, APIs, evidence and modern telecom operations.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact-us"
                  className="px-6 py-3.5 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold transition-all duration-200 text-sm shadow-md inline-flex items-center gap-2"
                >
                  Request a Demo →
                </Link>
                <Link
                  href="/documentation"
                  className="px-6 py-3.5 rounded-md bg-white hover:bg-slate-100 text-slate-900 font-semibold transition-all duration-200 text-sm shadow-md"
                >
                  View Platform Architecture
                </Link>
              </div>
            </div>

            {/* Right Terminal / Search Preview Widget */}
            <div className="lg:col-span-6 w-full">
              <div className="rounded-2xl bg-[#061424] border border-slate-700/80 p-5 sm:p-6 shadow-2xl space-y-4 text-xs font-mono">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  <span className="text-slate-500">zkx-glossary-query</span>
                </div>

                {/* Search Input Simulation */}
                <div className="flex items-center gap-2 bg-[#0B1E34] px-3.5 py-2 rounded-lg border border-slate-700 text-slate-200 text-xs">
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold text-white">gov</span>
                  <span className="w-1.5 h-3.5 bg-sky-400 animate-pulse" />
                </div>

                {/* Match 1 — Governed Monetization */}
                <div className="p-3.5 rounded-xl bg-[#0B1E34] border border-sky-500/40 space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Governed Monetization</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Current
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    A monetization approach where every charge, rate, and revenue rule traces to an
                    approved, versioned source of truth.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[#102A45] text-sky-300">
                      ZoikoNex framework
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      #Platform-wide
                    </span>
                  </div>
                </div>

                {/* Match 2 — Governed Rate Card */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="font-bold text-white text-xs">Governed Rate Card</div>
                  <div className="text-[10px] text-slate-400">
                    Matched alias: &quot;Rate governance&quot;
                  </div>
                </div>

                {/* Match 3 — Governance Lifecycle */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="font-bold text-white text-xs">Governance Lifecycle</div>
                  <div className="text-[10px] text-slate-400">
                    Source → Review → Approve → Publish → Monitor → Update.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GLOSSARY TRUST CONTRACT — Know what you can rely on */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                — GLOSSARY TRUST CONTRACT
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Know what you can rely on before you rely on it.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every visible definition carries controlled authority, visible scope, a currentness state
                and an editorial owner. Corrections run through governed review — nothing here
                overrides API Reference, product documentation, standards, contracts or regulatory
                authority.
              </p>
            </div>

            {/* Right Photo (`glossary-hero.jpg`) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                <div className="relative h-64 sm:h-72 w-full">
                  <Image
                    src="/image/glossary/glossary-hero.jpg"
                    alt="Editorial review and terminology governance"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-mono border border-slate-700/60">
                    registry_state: reviewed → approved → published
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Classification Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Reviewed definitions</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Human review and approved source evidence, always.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Scope shown</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Jurisdiction, version and domain limits stated plainly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Currentness shown</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Current, updated, or superseded — never ambiguous.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Authority preserved</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Standards and canonical sources stay authoritative.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 shadow-xs">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-xs">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">No fabricated answers</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                No match means approved alternatives — never an invented one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIORITY TERMS + TERM DETAIL — The four evidence-backed seed terms */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — PRIORITY TERMS + TERM DETAIL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The four evidence-backed seed terms
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Priority Terms surface only the evidence-backed seed set or approved registry records —
              never a generated placeholder.
            </p>
          </div>

          {/* 4 Seed Term Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEED_TERMS.map((term) => {
              const isSelected = selectedSeed.id === term.id;
              return (
                <div
                  key={term.id}
                  onClick={() => setSelectedSeed(term)}
                  className={`p-5 rounded-2xl bg-white border cursor-pointer transition-all duration-200 space-y-2 ${
                    isSelected
                      ? "border-blue-600 shadow-md ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 font-mono">{term.num}</div>
                  <h3 className="text-sm font-bold text-slate-900">{term.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{term.shortDef}</p>
                </div>
              );
            })}
          </div>

          {/* Expanded Dictionary Detail Card for Selected Seed */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left 8 cols: Definition Details */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedSeed.name}</h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedSeed.categoryBadge}
                  </span>
                </div>

                {/* Quote definition callout */}
                <div className="p-4 rounded-xl bg-blue-50/50 border-l-4 border-blue-600 text-sm font-medium text-slate-800 leading-relaxed">
                  {selectedSeed.quote}
                </div>

                {/* Expanded Explanation */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    EXPANDED EXPLANATION
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedSeed.expandedExplanation}
                  </p>
                </div>

                {/* Scope */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SCOPE
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedSeed.scope}
                  </p>
                </div>

                {/* What It Is Not */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    WHAT IT IS NOT
                  </div>
                  <div className="space-y-1.5">
                    {selectedSeed.whatItIsNot.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ZoikoNex Context */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ZOIKONEX CONTEXT
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedSeed.zoikoContext}
                  </p>
                </div>

                {/* Copy Link Action */}
                <div className="pt-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied link to clipboard" : `Copy link to ${selectedSeed.name}`}</span>
                  </button>
                </div>
              </div>

              {/* Right 4 cols: Authority, Relationships & Next Links */}
              <div className="lg:col-span-4 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-6 text-xs">
                {/* Authority & State */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    AUTHORITY & STATE
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                      {selectedSeed.authority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {selectedSeed.currentness}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px]">
                      {selectedSeed.scopeTag}
                    </span>
                  </div>
                </div>

                {/* Relationships */}
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    RELATIONSHIPS
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Broader:</span>
                      <div className="text-slate-900 font-semibold">{selectedSeed.broader}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Narrower:</span>
                      <div className="text-slate-900 font-semibold">{selectedSeed.narrower}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Used By:</span>
                      <div className="text-slate-900 font-semibold">{selectedSeed.usedBy}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Contrasts With:</span>
                      <div className="text-slate-900 font-semibold">{selectedSeed.contrastsWith}</div>
                    </div>
                  </div>
                </div>

                {/* Source / Currentness */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    SOURCE / CURRENTNESS
                  </div>
                  <p className="leading-relaxed">{selectedSeed.sourceReviewed}</p>
                </div>

                {/* Continue To Links */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    CONTINUE TO
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <Link href="/platform" className="block text-blue-600 hover:underline font-semibold">
                      Platform → Revenue Governance
                    </Link>
                    <Link href="/guides" className="block text-blue-600 hover:underline font-semibold">
                      Documentation → Rate Card Guide
                    </Link>
                    <Link href="/api-reference" className="block text-blue-600 hover:underline font-semibold">
                      API Reference → Charging endpoints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BROWSE BY TELECOM DOMAIN + ROLE (Dark Navy `#08182B`) */}
      <section className="py-16 sm:py-20 bg-[#08182B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              — BROWSE BY TELECOM DOMAIN + ROLE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Discover vocabulary without needing the exact term
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Role tags are editorial relevance only — never behavioral profiling. A term can belong to
              several domains while keeping one canonical record.
            </p>
          </div>

          {/* Main Domain Split: Photo on left + 8 Domain Cards on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Photo (`glossary-esim.png`) */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/image/glossary/glossary-esim.png"
                    alt="Domain vocabulary and taxonomy discovery"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md text-white text-xs border border-slate-700/60">
                    <div className="text-[10px] text-sky-400 font-mono">18 registry domains</div>
                    <div className="font-semibold mt-0.5">One canonical record, many entry points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 8 Domain Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DOMAINS.map((dom, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#0F243A] border border-slate-700 hover:border-sky-500/60 transition-colors space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                      {dom.name}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-slate-900 px-2 py-0.5 rounded">
                      {dom.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{dom.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Browse by Role Pills */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              BROWSE BY ROLE
            </div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-[#0F243A] text-slate-300 hover:bg-slate-800 border border-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELATIONSHIPS + DISAMBIGUATION — Never merge collisions silently */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — RELATIONSHIPS + DISAMBIGUATION + PROVENANCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Never merge collisions silently
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Ambiguous terms open a decisive panel with visible scope and class metadata — the
              interpretation is never inferred from a guessed persona.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Card (Dark Disambiguation Panel) */}
            <div className="lg:col-span-6 rounded-2xl bg-[#08182B] text-white p-6 border border-slate-800 shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Which meaning do you need?</h3>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Search token: &quot;rating&quot;</div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#0B2036] border border-blue-500/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Usage Rating</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      Industry conventional
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Calculating the price of a metered usage event as it occurs. Domain: Usage / Charging.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Service Rating</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                      Industry conventional
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A customer-facing satisfaction or quality score. Domain: Customer Experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Relationship Types Pills + Commonly Confused Box */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  RELATIONSHIP TYPES
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "broader",
                    "narrower",
                    "related",
                    "part of",
                    "used by / in",
                    "contrasts with",
                    "commonly confused with",
                    "supersedes",
                    "alias",
                    "deprecated alias",
                  ].map((rel) => (
                    <span
                      key={rel}
                      className="px-3 py-1 rounded-md bg-[#EEF2F7] border border-slate-200 text-slate-700 text-xs font-mono"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Commonly Confused With Box */}
              <div className="p-5 rounded-2xl bg-[#EEF2F7] border border-slate-300 space-y-2 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-mono">
                  COMMONLY CONFUSED WITH
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-900">
                  <span>Real-time Rating Engine</span>
                  <span className="text-xs text-slate-500 font-normal italic">not the same as</span>
                  <span>Real-time Charging</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rating calculates the price of an event; charging applies that price against balance
                  and policy. Related, not interchangeable — both records are sourced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STANDARDS / INDUSTRY / ZOIKONEX TERMINOLOGY + CURRENTNESS */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — STANDARDS / INDUSTRY / ZOIKONEX TERMINOLOGY + CURRENTNESS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Provenance and terminology age, made explicit
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Every term exposes its applicable authority label and source. Currentness chips stay
              visually distinct from authority chips — never collapsed into red/green alone.
            </p>
          </div>

          {/* 7 Authority Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AUTHORITY_TYPES.map((auth, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs ${
                  i === 6 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="text-xs font-bold text-blue-700">{auth.title}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{auth.desc}</p>
              </div>
            ))}
          </div>

          {/* Recently Updated Alert + Photo Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
            {/* Left Superseded Alert Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                RECENTLY UPDATED / SUPERSEDES
              </div>
              <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-rose-800">Superseded — Jan 2026</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  &quot;Convergent Billing&quot; has been replaced in current ZoikoNex terminology. Historic
                  documentation retains the original dated term unchanged.
                </p>
                <div className="pt-1">
                  <Link href="#governed-monetization" className="text-xs font-bold text-blue-600 hover:underline">
                    → Replaced by Unified Revenue Ledger
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Photo (`glossary-governance.png`) */}
            <div className="lg:col-span-6 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <div className="relative h-64 sm:h-72 w-full">
                  <Image
                    src="/image/glossary/glossary-governance.png"
                    alt="Corporate governance and terminology audit team"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-mono border border-slate-700/60">
                    every record: source, scope, review date, owner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOR BUILDERS + GOVERNED DEFINITIONS (Dark Navy `#08182B`) */}
      <section className="py-16 sm:py-20 bg-[#08182B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              — FOR BUILDERS + GOVERNED DEFINITIONS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Concept vocabulary, handed off to technical authority
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              API Reference and Documentation remain canonical for fields, schemas, endpoints and
              guarantees — the glossary never overrides them.
            </p>
          </div>

          {/* Technical Container with Photo on left and Governance flow on right */}
          <div className="rounded-2xl bg-[#061424] border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo on left (`glossary-architecture.jpg`) */}
              <div className="lg:col-span-6 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <div className="relative h-64 sm:h-80 w-full">
                    <Image
                      src="/image/glossary/glossary-architecture.jpg"
                      alt="Engineers reviewing telecom architecture"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-sky-300 border border-slate-700">
                        idempotency_key
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-emerald-300 border border-slate-700">
                        event / domain concept
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-amber-300 border border-slate-700">
                        evidence record
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-purple-300 border border-slate-700">
                        deployment boundary
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: How Definitions Are Governed */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                    HOW DEFINITIONS ARE GOVERNED
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Every public definition — even where AI assisted the internal draft — requires
                    human approval and stored source evidence before it publishes.
                  </p>
                </div>

                {/* 6 Step Sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">1</span> Source
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">2</span> Review
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">3</span> Approve
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">4</span> Publish
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">5</span> Monitor
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0D2138] border border-slate-700">
                    <span className="text-sky-400 font-bold">6</span> Update / Supersede
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                  Every technical term continues to current API Reference or Documentation. No schemas,
                  private endpoints or internal event names are shown here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RELATED RESOURCES — A useful next step, not a lead form */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — RELATED RESOURCES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              A useful next step — not a lead form
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              Developer intent routes to API/Documentation. Architecture or governance intent routes to
              Platform/Trust. Evaluation only when explicitly chosen.
            </p>
          </div>

          {/* 4 Link Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
            {/* Documentation */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                DOCUMENTATION
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/guides" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Rate Card Guide
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Billing Configuration
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Release Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* API Reference */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                API REFERENCE
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/api-reference" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Charging endpoints
                  </Link>
                </li>
                <li>
                  <Link href="/api-reference" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Event schemas
                  </Link>
                </li>
                <li>
                  <Link href="/api-reference" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Idempotency
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform / Architecture */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                PLATFORM / ARCHITECTURE
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/platform" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Deployment models
                  </Link>
                </li>
                <li>
                  <Link href="/platform" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Unified Revenue Ledger
                  </Link>
                </li>
                <li>
                  <Link href="/platform" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Identity & Trust
                  </Link>
                </li>
              </ul>
            </div>

            {/* Trust / Governance */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                TRUST / GOVERNANCE
              </div>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy-policy" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Term Registry policy
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Compliance overview
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-slate-800 hover:text-blue-600 font-semibold transition-colors">
                    Report a definition issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Evaluation Banner */}
          <div className="p-6 rounded-2xl bg-[#EEF2F7] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-700 max-w-xl">
              <strong>Looking to evaluate ZoikoNex</strong> rather than look something up? That&apos;s a
              separate, explicit path — we won&apos;t infer it from a glossary search.
            </div>
            <Link
              href="/contact-us"
              className="px-5 py-2.5 rounded-lg bg-[#08182B] hover:bg-slate-800 text-white font-semibold text-xs transition-colors whitespace-nowrap shadow-sm"
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION — Common questions, answered directly */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">— FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Common questions, answered directly.
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
                  {openFaq === idx ? (
                    <Minus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
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
