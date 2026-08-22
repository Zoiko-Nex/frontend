"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Check,
  Copy,
  Plus,
  Minus,
  ArrowRight,
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
    categoryBadge: "ZoikoNex framework",
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
    scopeTag: "Platform-wide",
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
    categoryBadge: "ZoikoNex framework",
    quote: "OSS/BSS deployed, managed, and audited completely within a sovereign geographic and legal perimeter.",
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
    scopeTag: "Sovereign-deployments",
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
    categoryBadge: "Industry conventional",
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
    scopeTag: "Sub-200ms-rating",
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
    categoryBadge: "External standard",
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
    scopeTag: "5G-Network-Slicing",
    broader: "Network Monetization",
    narrower: "QoS Rating Formula",
    usedBy: "Enterprise Invoicing",
    contrastsWith: "Flat Rate Data Plans",
    sourceReviewed: "ZoikoNex Glossary Term Registry · reviewed Jun 2026 · next review scheduled Dec 2026",
  },
];

const DOMAINS = [
  { name: "Identity / Account", count: 38, desc: "Customer, account and identity vocabulary." },
  { name: "Catalog / Order", count: 44, desc: "Product, catalog and order concepts." },
  { name: "Usage / Rating", count: 61, desc: "Mediation, rating and charging terms." },
  { name: "Billing / Payments", count: 57, desc: "Billing, payments and reconciliation." },
  { name: "Tax / Jurisdiction", count: 22, desc: "Jurisdictional tax and regulatory terms." },
  { name: "Voice / Carrier", count: 29, desc: "Voice, ILD and carrier partner terms." },
  { name: "eSIM / IoT / APIs", count: 33, desc: "eSIM, IoT and network API vocabulary." },
  { name: "Governance / Evidence", count: 26, desc: "Governance, evidence and AI-boundary terms." },
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
  { title: "Industry conventional", desc: "Common usage across telecoms, without a single owning body." },
  { title: "Regulatory / legal / tax", desc: "Defined by a regulator, statute or tax authority." },
  { title: "ZoikoNex framework", desc: "A ZoikoNex category or architectural concept." },
  { title: "ZoikoNex product", desc: "The name of a specific ZoikoNex product or module." },
  { title: "Acronym", desc: "An expansion of an existing approved term." },
  { title: "Legacy / deprecated", desc: "Superseded — retained for search and history only." },
];

const FAQS = [
  {
    q: "What is the ZoikoNex Glossary?",
    a: "A governed reference for telecom monetization terminology — reviewed, scoped and sourced, not an SEO dictionary.",
  },
  {
    q: "Does it replace Documentation or API Reference?",
    a: "No. API Reference and Documentation remain canonical for technical implementation, schemas, and endpoints. The glossary defines concept vocabulary and governance boundaries.",
  },
  {
    q: "Are all terms industry standards?",
    a: "No. Every term is explicitly tagged with its authority level: External standard (e.g. 3GPP/TM Forum), Industry conventional, Regulatory/legal/tax, or ZoikoNex framework/product.",
  },
  {
    q: "How are definitions reviewed?",
    a: "Definitions follow a 6-stage lifecycle: Source → Review → Approve → Publish → Monitor → Update/Supersede. All public terms require human approval.",
  },
  {
    q: "How do I know a definition is current?",
    a: "Each term displays its currentness status (Current, Updated, or Superseded) along with the review date and scheduled next review cycle.",
  },
  {
    q: "What happens when a term has multiple meanings?",
    a: "Collisions are never merged silently. The search interface opens a disambiguation panel showing explicit domain context and distinct definitions.",
  },
  {
    q: "Can I search acronyms and aliases?",
    a: "Yes. Acronym expansions and historical aliases are mapped to canonical records with visible matched-alias badges.",
  },
  {
    q: "Does AI publish definitions?",
    a: "No. While AI may assist internal drafting, no definition goes live without human editorial sign-off and linked source evidence.",
  },
  {
    q: "Where should developers go?",
    a: "Developers should consult the API Reference and Developer Portal for endpoints, authentication, webhooks, and SDKs.",
  },
  {
    q: "Can definitions be jurisdiction-specific?",
    a: "Yes. Tax and regulatory terminology highlights specific jurisdictional scope and applicable legal frameworks.",
  },
];

export default function GlossaryPage() {
  const [selectedSeed, setSelectedSeed] = useState<SeedTerm>(SEED_TERMS[0]);
  const [selectedRole, setSelectedRole] = useState<string>("Executive");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("gov");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/glossary#${selectedSeed.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen font-['Plus_Jakarta_Sans']">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(30,58,138,0.4),transparent_60%)] pointer-events-none" />
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-blue-300 font-medium text-xs uppercase tracking-widest font-['IBM_Plex_Mono']">
                <span className="w-4 h-px bg-blue-300 inline-block" />
                REFERENCE / GLOSSARY
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[54px]">
                Telecom monetization<br />
                terms, defined<br />
                precisely.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-7">
                A governed reference for language across charging, rating, billing,<br className="hidden sm:inline" />
                tax, payments, OSS/BSS, governance, APIs, evidence and modern<br className="hidden sm:inline" />
                telecom operations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/request-a-demo"
                  className="px-6 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-600 text-white font-semibold transition-all text-base inline-flex items-center gap-2 shadow-[0px_2px_12px_0px_rgba(43,126,193,0.30)] cursor-pointer"
                >
                  Request a Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/platform-architecture"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-gray-900 font-semibold transition-all text-base border border-slate-300 cursor-pointer"
                >
                  View Platform Architecture
                </Link>
              </div>
            </div>

            {/* Right Interactive Search Terminal Box */}
            <div className="lg:col-span-6 w-full">
              <div className="rounded-2xl bg-slate-900 shadow-[0px_30px_60px_-20px_rgba(0,0,0,0.50)] border border-cyan-900/60 overflow-hidden">
                {/* Search Bar Top */}
                <div className="px-4 py-3 border-b border-blue-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-cyan-900 rounded-xs" />
                    <div className="w-2 h-2 bg-cyan-900 rounded-xs" />
                    <div className="w-2 h-2 bg-cyan-900 rounded-xs" />
                  </div>
                  <div className="text-slate-500 text-xs font-['IBM_Plex_Mono']">
                    /glossary — search
                  </div>
                </div>

                {/* Search input + results */}
                <div className="p-4 space-y-3">
                  <div className="h-10 px-3 bg-slate-900 rounded-lg border border-blue-950 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300 text-xs font-normal">gov</span>
                    <span className="w-0.5 h-4 bg-blue-500 animate-pulse" />
                  </div>

                  {/* Active Match Card */}
                  <div className="p-4 bg-sky-950 rounded-xl border border-blue-500 space-y-2">
                    <div className="text-white text-base font-semibold">
                      Governed Monetization
                    </div>
                    <p className="text-slate-400 text-xs leading-5">
                      A monetization approach where every charge, rate, and revenue rule traces to an approved, versioned source of truth.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-violet-300 rounded-full border border-indigo-500/30 text-[10px] font-medium font-['IBM_Plex_Mono']">
                        ZoikoNex framework
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-300 rounded-full border border-emerald-600/30 text-[10px] font-medium font-['IBM_Plex_Mono']">
                        Current
                      </span>
                      <span className="px-2 py-0.5 bg-blue-950 text-slate-400 rounded-full border border-cyan-900 text-[10px] font-medium font-['IBM_Plex_Mono']">
                        Platform-wide
                      </span>
                    </div>
                  </div>

                  {/* Match 2 */}
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-blue-950 space-y-1">
                    <div className="text-white text-sm font-semibold">Governed Rate Card</div>
                    <div className="text-orange-300 text-xs font-['IBM_Plex_Mono']">
                      Matched alias: &quot;Rate governance&quot;
                    </div>
                  </div>

                  {/* Match 3 */}
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-blue-950 space-y-1">
                    <div className="text-white text-sm font-semibold">Governance Lifecycle</div>
                    <div className="text-slate-400 text-xs">
                      Source → Review → Approve → Publish → Monitor → Update.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GLOSSARY TRUST CONTRACT */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-12">
          {/* Top text + photo grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left text */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
                <span className="w-4 h-px bg-blue-500 inline-block" />
                Glossary trust contract
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-10">
                Know what you can rely on<br />
                before you rely on it.
              </h2>
              <p className="text-base text-gray-500 leading-6 max-w-xl">
                Every visible definition carries controlled authority, visible scope, a currentness state and an editorial owner. Corrections run through governed review — nothing here overrides API Reference, product documentation, standards, contracts or regulatory authority.
              </p>
            </div>

            {/* Right Photo: glossary-tax.png */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-xl h-72">
              <Image
                src="/image/glossary/glossary-tax.png"
                alt="Glossary trust contract verification"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-['IBM_Plex_Mono'] tracking-tight">
                registry_state: reviewed → approved → published
              </div>
            </div>
          </div>

          {/* Bottom 5 Trust Contract Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                title: "Reviewed definitions",
                desc: "Human review and approved source evidence, always.",
              },
              {
                title: "Scope shown",
                desc: "Jurisdiction, version and domain limits stated plainly.",
              },
              {
                title: "Currentness shown",
                desc: "Current, updated, or superseded — never ambiguous.",
              },
              {
                title: "Authority preserved",
                desc: "Standards and canonical sources stay authoritative.",
              },
              {
                title: "No fabricated answers",
                desc: "No match means approved alternatives — never an invented one.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-4 bg-slate-100/80 rounded-xl border border-gray-200 space-y-2"
              >
                <div className="w-4 h-4 text-blue-500 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 border border-blue-500 rounded-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                  </div>
                </div>
                <div className="text-zinc-900 text-sm font-bold leading-5">{card.title}</div>
                <p className="text-gray-500 text-xs leading-5">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRIORITY TERMS + TERM DETAIL */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-blue-500 inline-block" />
              Priority terms + term detail
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-10">
              The four evidence-backed seed terms
            </h2>
            <p className="text-base text-gray-500 leading-6 max-w-xl">
              Priority Terms surface only the evidence-backed seed set or approved registry records — never a generated placeholder.
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
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500"
                      : "bg-neutral-100 border-gray-200 hover:bg-neutral-200/60"
                  }`}
                >
                  <div className="text-zinc-400 text-xs font-['IBM_Plex_Mono'] mb-1">{term.num}</div>
                  <div className="text-zinc-900 text-base font-semibold leading-6 mb-1.5">{term.name}</div>
                  <p className="text-gray-500 text-xs leading-5">{term.shortDef}</p>
                </div>
              );
            })}
          </div>

          {/* Active Detail Inspection Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-[0px_24px_48px_-30px_rgba(20,30,50,0.22)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
              {/* Left 8 cols: Definition Details */}
              <div className="lg:col-span-8 p-8 sm:p-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                    {selectedSeed.name}
                  </h3>
                  <span className="px-2.5 py-1 bg-violet-100 text-indigo-600 rounded-full text-xs font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    {selectedSeed.categoryBadge}
                  </span>
                </div>

                <div className="pl-4 border-l-[3px] border-blue-500 py-1">
                  <p className="text-zinc-900 text-lg leading-7">
                    {selectedSeed.quote}
                  </p>
                </div>

                {/* Expanded Explanation */}
                <div className="space-y-1.5">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Expanded explanation
                  </div>
                  <p className="text-gray-500 text-sm leading-6">
                    {selectedSeed.expandedExplanation}
                  </p>
                </div>

                {/* Scope */}
                <div className="space-y-1.5">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Scope
                  </div>
                  <p className="text-gray-500 text-sm leading-6">
                    {selectedSeed.scope}
                  </p>
                </div>

                {/* What it is not */}
                <div className="space-y-2">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    What it is not
                  </div>
                  <div className="space-y-1.5">
                    {selectedSeed.whatItIsNot.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                        <span className="text-red-500 font-bold">✕</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ZoikoNex Context */}
                <div className="space-y-1.5">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    ZoikoNex context
                  </div>
                  <p className="text-gray-500 text-sm leading-6">
                    {selectedSeed.zoikoContext}
                  </p>
                </div>

                {/* Copy Link Button */}
                <div className="pt-2">
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 text-blue-500 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-blue-500" />}
                    <span>{copied ? "Copied link to clipboard" : `Copy link to ${selectedSeed.name}`}</span>
                  </button>
                </div>
              </div>

              {/* Right 4 cols: Authority & Metadata */}
              <div className="lg:col-span-4 p-6 sm:p-8 bg-neutral-100 space-y-6 text-xs">
                {/* Authority & State */}
                <div className="space-y-2">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Authority &amp; state
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-violet-100 text-indigo-600 rounded-full border border-violet-200 font-['IBM_Plex_Mono'] text-xs">
                      {selectedSeed.authority}
                    </span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-['IBM_Plex_Mono'] text-xs">
                      {selectedSeed.currentness}
                    </span>
                    <span className="px-2 py-1 bg-white text-gray-500 rounded-full border border-gray-200 font-['IBM_Plex_Mono'] text-xs">
                      {selectedSeed.scopeTag}
                    </span>
                  </div>
                </div>

                {/* Relationships */}
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Relationships
                  </div>
                  <div className="space-y-2.5 divide-y divide-gray-200">
                    <div className="pt-1">
                      <div className="text-zinc-400 text-[10px] uppercase font-['IBM_Plex_Mono']">Broader</div>
                      <div className="text-zinc-900 font-semibold text-xs mt-0.5">{selectedSeed.broader}</div>
                    </div>
                    <div className="pt-2">
                      <div className="text-zinc-400 text-[10px] uppercase font-['IBM_Plex_Mono']">Narrower</div>
                      <div className="text-zinc-900 font-semibold text-xs mt-0.5">{selectedSeed.narrower}</div>
                    </div>
                    <div className="pt-2">
                      <div className="text-zinc-400 text-[10px] uppercase font-['IBM_Plex_Mono']">Used by</div>
                      <div className="text-zinc-900 font-semibold text-xs mt-0.5">{selectedSeed.usedBy}</div>
                    </div>
                    <div className="pt-2">
                      <div className="text-zinc-400 text-[10px] uppercase font-['IBM_Plex_Mono']">Contrasts with</div>
                      <div className="text-zinc-900 font-semibold text-xs mt-0.5">{selectedSeed.contrastsWith}</div>
                    </div>
                  </div>
                </div>

                {/* Source / Currentness */}
                <div className="space-y-1 pt-3 border-t border-gray-200">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Source / currentness
                  </div>
                  <p className="text-gray-500 text-xs leading-5">
                    {selectedSeed.sourceReviewed}
                  </p>
                </div>

                {/* Continue To Links */}
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    Continue to
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <Link href="/platform" className="block text-blue-500 font-semibold hover:underline">
                      Platform → Revenue Governance
                    </Link>
                    <Link href="/guides" className="block text-blue-500 font-semibold hover:underline">
                      Documentation → Rate Card Guide
                    </Link>
                    <Link href="/api-reference" className="block text-blue-500 font-semibold hover:underline">
                      API Reference → Charging endpoints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BROWSE BY TELECOM DOMAIN + ROLE */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-blue-300 inline-block" />
              Browse by telecom domain + role
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-10">
              Discover vocabulary without needing the exact term
            </h2>
            <p className="text-base text-slate-400 leading-6 max-w-xl">
              Role tags are editorial relevance only — never behavioral profiling. A term can belong to several domains while keeping one canonical record.
            </p>
          </div>

          {/* Split: Photo on Left (glossary-governance.png) + 8 Domain Cards on Right */}
          <div className="rounded-2xl border border-blue-950 bg-slate-900 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Photo (glossary-governance.png) */}
              <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-[400px]">
                <Image
                  src="/image/glossary/glossary-governance.png"
                  alt="Browse by domain"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-slate-950/90" />
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-1">
                  <div className="text-slate-400 text-xs font-['IBM_Plex_Mono'] tracking-wide">10 registry domains</div>
                  <div className="text-white text-lg font-semibold leading-7">One canonical record, many entry points</div>
                </div>
              </div>

              {/* Right 8 Domain Rows */}
              <div className="lg:col-span-7 p-6 bg-blue-950/60 divide-y divide-slate-800/80">
                {DOMAINS.map((dom, i) => (
                  <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white text-sm font-bold">{dom.name}</div>
                      <div className="text-slate-400 text-xs leading-4 mt-0.5">{dom.desc}</div>
                    </div>
                    <span className="text-slate-400 text-xs font-['IBM_Plex_Mono'] bg-slate-900 px-2 py-0.5 rounded">
                      {dom.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Browse by Role Pills */}
          <div className="space-y-3 pt-2">
            <div className="text-slate-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
              Browse by role
            </div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                    selectedRole === role
                      ? "bg-blue-500 text-white font-semibold shadow-sm"
                      : "bg-sky-950 text-slate-300 border border-cyan-900 hover:bg-slate-800"
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
      <section className="py-16 sm:py-20 bg-neutral-100 border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-blue-500 inline-block" />
              Relationships + disambiguation + provenance
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-10">
              Never merge collisions silently
            </h2>
            <p className="text-base text-gray-500 leading-6 max-w-xl">
              Ambiguous terms open a decisive panel with visible scope and class metadata — the interpretation is never inferred from a guessed persona.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-11 items-start">
            {/* Left Card (Dark Disambiguation Panel) */}
            <div className="lg:col-span-6 p-7 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-4 shadow-xl">
              <div>
                <h3 className="text-white text-xl font-semibold leading-8">Which meaning do you need?</h3>
                <div className="text-slate-400 text-xs font-normal leading-5 mt-0.5">Search token: &quot;rating&quot;</div>
              </div>

              <div className="p-4 bg-sky-950 rounded-xl border border-blue-500 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white text-base font-semibold">Usage Rating</span>
                  <span className="text-slate-400 text-[10px] font-['IBM_Plex_Mono']">Industry conventional</span>
                </div>
                <p className="text-slate-400 text-xs leading-5">
                  Calculating the price of a metered usage event as it occurs. Domain: Usage / Charging.
                </p>
              </div>

              <div className="p-4 bg-sky-950 rounded-xl border border-cyan-900 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white text-base font-semibold">Service Rating</span>
                  <span className="text-slate-400 text-[10px] font-['IBM_Plex_Mono']">Industry conventional</span>
                </div>
                <p className="text-slate-400 text-xs leading-5">
                  A customer-facing satisfaction or quality score. Domain: Customer Experience.
                </p>
              </div>
            </div>

            {/* Right: Relationship Types Pills + Commonly Confused Box */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="text-zinc-400 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide">
                  Relationship types
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
                      className="px-3 py-1.5 bg-white rounded-full border border-gray-200 text-gray-500 text-xs font-['IBM_Plex_Mono']"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Commonly Confused Box */}
              <div className="p-5 bg-white rounded-xl border border-gray-200 space-y-2 shadow-xs">
                <div className="text-red-500 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide">
                  Commonly confused with
                </div>
                <div className="flex flex-wrap items-center gap-3 text-base font-semibold text-zinc-900">
                  <span>Real-time Rating Engine</span>
                  <span className="text-zinc-400 text-xs font-normal font-['IBM_Plex_Mono']">not the same as</span>
                  <span>Real-time Charging</span>
                </div>
                <p className="text-gray-500 text-xs leading-5">
                  Rating calculates the price of an event; charging applies that price against balance and policy. Related, not interchangeable — both records are sourced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STANDARDS / INDUSTRY / ZOIKONEX TERMINOLOGY + CURRENTNESS */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-indigo-500 inline-block" />
              Standards / industry / ZoikoNex terminology + currentness
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-10">
              Provenance and terminology age, made explicit
            </h2>
            <p className="text-base text-gray-500 leading-6 max-w-xl">
              Every term exposes its applicable authority label and source. Currentness chips stay visually distinct from authority chips — never collapsed into red/green alone.
            </p>
          </div>

          {/* 7 Authority Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {AUTHORITY_TYPES.map((auth, i) => (
              <div
                key={i}
                className="p-4 bg-neutral-100 rounded-xl border border-gray-200 space-y-1"
              >
                <div className="text-indigo-500 text-xs font-normal font-['IBM_Plex_Mono']">{auth.title}</div>
                <p className="text-gray-500 text-xs leading-5">{auth.desc}</p>
              </div>
            ))}
          </div>

          {/* Split: Superseded box on Left + Photo on Right (glossary-ledger.png) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-11 items-center pt-2">
            {/* Left Superseded Alert Box */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-zinc-400 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide">
                Recently updated / superseded
              </div>
              <div className="p-5 bg-rose-100 rounded-xl border border-rose-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-xs" />
                  <span className="text-orange-800 text-sm font-bold">Superseded — Jan 2026</span>
                </div>
                <p className="text-yellow-900 text-xs leading-5">
                  &quot;Convergent Billing&quot; has been replaced in current ZoikoNex terminology. Historic documentation retains the original dated term unchanged.
                </p>
                <div className="pt-1 text-zinc-900 text-sm font-semibold">
                  → Replaced by Unified Revenue Ledger
                </div>
              </div>
            </div>

            {/* Right Photo: glossary-ledger.png */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-xl h-80">
              <Image
                src="/image/glossary/glossary-ledger.png"
                alt="Provenance and terminology age"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white text-xs font-['IBM_Plex_Mono'] leading-4">
                every record: source, scope, review date, owner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOR BUILDERS + GOVERNED DEFINITIONS */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-blue-300 inline-block" />
              For builders + governed definitions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-10">
              Concept vocabulary, handed off to technical authority
            </h2>
            <p className="text-base text-slate-400 leading-6 max-w-3xl">
              API Reference and Documentation remain canonical for fields, schemas, endpoints and guarantees — the glossary never overrides them.
            </p>
          </div>

          {/* Split: Photo on Left (glossary-charging.png) + Governance steps on Right */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Photo on left (glossary-charging.png) */}
              <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[380px]">
                <Image
                  src="/image/glossary/glossary-charging.png"
                  alt="Engineers reviewing technical architecture"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
                <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-900/70 rounded-full border border-white/20 backdrop-blur-xs text-slate-200 text-xs font-['IBM_Plex_Mono']">
                    idempotency key
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900/70 rounded-full border border-white/20 backdrop-blur-xs text-slate-200 text-xs font-['IBM_Plex_Mono']">
                    event / domain concept
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900/70 rounded-full border border-white/20 backdrop-blur-xs text-slate-200 text-xs font-['IBM_Plex_Mono']">
                    evidence record
                  </span>
                  <span className="px-2.5 py-1 bg-slate-900/70 rounded-full border border-white/20 backdrop-blur-xs text-slate-200 text-xs font-['IBM_Plex_Mono']">
                    deployment boundary
                  </span>
                </div>
              </div>

              {/* Right: How definitions are governed */}
              <div className="lg:col-span-6 p-8 sm:p-10 space-y-6">
                <div className="space-y-2">
                  <div className="text-slate-400 text-xs font-['IBM_Plex_Mono'] uppercase tracking-wide">
                    How definitions are governed
                  </div>
                  <p className="text-slate-400 text-sm leading-6">
                    Every public definition — even where AI assisted the internal draft — requires human approval and stored source evidence before it publishes.
                  </p>
                </div>

                {/* 6-step flow */}
                <div className="flex flex-wrap items-center gap-y-3 gap-x-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">1</span>
                    <span className="text-slate-200 font-semibold">Source</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">2</span>
                    <span className="text-slate-200 font-semibold">Review</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">3</span>
                    <span className="text-slate-200 font-semibold">Approve</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">4</span>
                    <span className="text-slate-200 font-semibold">Publish</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">5</span>
                    <span className="text-slate-200 font-semibold">Monitor</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 bg-blue-950 rounded-lg border border-cyan-900 flex items-center justify-center text-blue-300 font-['IBM_Plex_Mono']">6</span>
                    <span className="text-slate-200 font-semibold">Update / Supersede</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-950 text-slate-400 text-xs leading-5">
                  Every technical term continues to current API Reference or Documentation. No schemas, private endpoints or internal event names are shown here.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RELATED RESOURCES */}
      <section className="py-16 sm:py-20 bg-neutral-100 border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
              <span className="w-4 h-px bg-blue-500 inline-block" />
              Related resources
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-10">
              A useful next step — not a lead form
            </h2>
            <p className="text-base text-gray-500 leading-6 max-w-2xl">
              Developer intent routes to API/Documentation. Architecture or governance intent routes to Platform/Trust. Evaluation only when explicitly chosen.
            </p>
          </div>

          {/* 4 Link Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 text-xs">
            {/* Documentation */}
            <div className="space-y-3">
              <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                Documentation
              </div>
              <ul className="space-y-1.5 divide-y divide-gray-200">
                <li className="pt-1.5">
                  <Link href="/guides" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Rate Card Guide
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/guides" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Billing Configuration
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/changelog" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Release Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* API Reference */}
            <div className="space-y-3">
              <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                API Reference
              </div>
              <ul className="space-y-1.5 divide-y divide-gray-200">
                <li className="pt-1.5">
                  <Link href="/api-reference" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Charging endpoints
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/api-reference" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Event schemas
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/api-reference" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Idempotency
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform / Architecture */}
            <div className="space-y-3">
              <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                Platform / Architecture
              </div>
              <ul className="space-y-1.5 divide-y divide-gray-200">
                <li className="pt-1.5">
                  <Link href="/platform" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Deployment models
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/platform" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Unified Revenue Ledger
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/platform" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Identity &amp; Trust
                  </Link>
                </li>
              </ul>
            </div>

            {/* Trust / Governance */}
            <div className="space-y-3">
              <div className="text-zinc-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide">
                Trust / Governance
              </div>
              <ul className="space-y-1.5 divide-y divide-gray-200">
                <li className="pt-1.5">
                  <Link href="/privacy-policy" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Term Registry policy
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/compliance" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Compliance overview
                  </Link>
                </li>
                <li className="pt-1.5">
                  <Link href="/contact-us" className="text-zinc-900 text-sm font-normal hover:text-blue-600 transition-colors">
                    Report a definition issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Evaluation Banner */}
          <div className="px-8 py-7 bg-neutral-100 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm">
              <span className="text-zinc-900 font-bold">Looking to evaluate ZoikoNex</span>
              <span className="text-gray-500"> rather than look something up? That&apos;s a separate, explicit path — we won&apos;t infer it from a glossary search.</span>
            </div>
            <Link
              href="/contact-us"
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-slate-900 text-sm font-semibold hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-medium font-['IBM_Plex_Mono'] uppercase tracking-widest">
            <span className="w-4 h-px bg-blue-500 inline-block" />
            FAQ
          </div>
          <h2 className="text-center text-zinc-900 text-3xl sm:text-4xl font-bold leading-10">
            Common questions, answered directly.
          </h2>

          <div className="w-full max-w-[760px] pt-6 divide-y divide-gray-200 border-b border-gray-200">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-zinc-900 text-base font-semibold group-hover:text-blue-600 transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-blue-500 text-lg font-semibold font-['IBM_Plex_Mono'] shrink-0">
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-gray-500 leading-6">
                      {faq.a}
                    </p>
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
