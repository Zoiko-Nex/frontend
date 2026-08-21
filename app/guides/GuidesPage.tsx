"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Copy,
  Check,
  Plus,
  Minus,
} from "lucide-react";

interface PlaybookStep {
  title: string;
  desc: string;
  codeSnippet?: string;
  codeLang?: string;
}

interface Playbook {
  id: string;
  title: string;
  outcome: "Launch" | "Migrate" | "Integrate" | "Operate" | "Govern";
  role: "CTO / Architect" | "Developer" | "DevOps / SRE" | "Compliance & Tax" | "Billing Ops";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  summary: string;
  prerequisites: string[];
  steps: PlaybookStep[];
  badgeColor: string;
  domain: string;
}

const PLAYBOOKS_DATA: Playbook[] = [
  {
    id: "bss-migration-strangler",
    title: "Zero-Downtime BSS Migration: Strangler Fig Pattern for Rating Engines",
    outcome: "Migrate",
    role: "CTO / Architect",
    difficulty: "Advanced",
    readTime: "35 min read",
    domain: "Rating & Charging",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    summary:
      "A phased architectural blueprint for running ZoikoNex in shadow mode alongside legacy BSS (Amdocs/Netcracker) with deterministic delta reconciliation.",
    prerequisites: [
      "Access to legacy CDR / TAP file mirror stream",
      "ZoikoNex Sandbox tenant with provisioned Rate Catalog",
      "Network routing egress for shadow HTTP mediation",
    ],
    steps: [
      {
        title: "1. Configure Shadow Mediation Pipeline",
        desc: "Ingest duplicated network telemetry without altering live charging loops. ZoikoNex normalizes raw 3GPP CDRs and writes them to the shadow queue.",
        codeSnippet: `// ZoikoNex Mediation Shadow Ingestion
POST /api/v2/mediation/shadow-stream
Headers: { "X-Zoiko-Tenant": "tenant_live_01", "Authorization": "Bearer zn_sec_..." }
Body: {
  "source_stream": "kafka://cdrs.core.prod:9092/cdr-tap",
  "replay_mode": "shadow_evaluate",
  "sample_rate": 1.0
}`,
        codeLang: "json",
      },
      {
        title: "2. Dual-Rating Verification & Delta Engine",
        desc: "Run identical usage events through both engines concurrently. The Delta Engine flags variances exceeding ±0.01% for automated root-cause analysis.",
      },
      {
        title: "3. Tariff Snapshot Lock",
        desc: "Freeze active rate card versions to guarantee reproducible rating calculations during cutover rehearsals.",
      },
      {
        title: "4. Live Traffic Cutover with Idempotent Fallback",
        desc: "Switch active Diameter Ro/Gy or 5G Nchf traffic to ZoikoNex with automatic zero-loss failback to legacy if latency exceeds 200ms.",
      },
    ],
  },
  {
    id: "mvno-launch-90-days",
    title: "Launching a Multi-Brand Digital MVNO in Under 90 Days",
    outcome: "Launch",
    role: "CTO / Architect",
    difficulty: "Intermediate",
    readTime: "25 min read",
    domain: "MVNO Launch",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    summary:
      "End-to-end operational guide for configuring multi-tenant brand hierarchies, eSIM profile provisioning, and automated payment gateways.",
    prerequisites: [
      "Host MNO wholesale interconnect credentials",
      "Stripe / Adyen payment merchant account",
      "ZoikoNex Multi-Tenant Organization ID",
    ],
    steps: [
      {
        title: "1. Tenant & Brand Hierarchy Definition",
        desc: "Create isolated brand spaces with dedicated currency scales, invoice templates, and support permissions.",
        codeSnippet: `curl -X POST https://api.zoikonex.com/v2/brands \\
  -H "Authorization: Bearer zn_admin_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "brand_name": "NexMobile US",
    "currency": "USD",
    "parent_tenant": "org_7721",
    "jurisdiction_pack": "US-FEDERAL-TAX-2026"
  }'`,
        codeLang: "bash",
      },
      {
        title: "2. Connect GSMA SM-DP+ eSIM Provider",
        desc: "Configure automated profile reservation and instant QR code activation for digital onboarding.",
      },
      {
        title: "3. Publish Governed Rate Catalog",
        desc: "Define prepaid bundle plans, auto-topup thresholds, and roaming data tiers with cryptographic versioning.",
      },
      {
        title: "4. Go-Live Certification & Rehearsal",
        desc: "Execute the 24-point pre-flight checklist covering payment capture, invoice generation, and emergency SIM suspension.",
      },
    ],
  },
  {
    id: "camara-qod-charging",
    title: "Configuring Real-Time Charging for CAMARA Quality-on-Demand APIs",
    outcome: "Integrate",
    role: "Developer",
    difficulty: "Advanced",
    readTime: "20 min read",
    domain: "Network API",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    summary:
      "Step-by-step developer tutorial for exposing 5G network slice QoD sessions with sub-200ms balance reservations and token authorization.",
    prerequisites: [
      "CAMARA Open Gateway API Client ID",
      "ZoikoNex Charging Gateway API Key",
      "5G Core NEF / SCEF test harness",
    ],
    steps: [
      {
        title: "1. Create CAMARA Developer Client & Rate Card",
        desc: "Define per-minute or per-session pricing for Quality on Demand (QoD) profiles (e.g. LOW_LATENCY_QOS).",
        codeSnippet: `import { ZoikoClient } from "@zoikonex/sdk";

const zoiko = new ZoikoClient({ apiKey: process.env.ZOIKO_API_KEY });

// Reserve balance for 15-minute 4K video stream session
const reservation = await zoiko.charging.reserve({
  subscriberId: "sub_99214_device",
  apiService: "camara-qod-high-bandwidth",
  durationSeconds: 900,
  unitRate: 0.05
});

console.log("Reservation Token:", reservation.token);`,
        codeLang: "typescript",
      },
      {
        title: "2. Listen for Session Complete Webhooks",
        desc: "Handle real-time session commit, debit, or partial-refund events idempotently.",
      },
      {
        title: "3. Partner Revenue Share Settlement",
        desc: "Automatically calculate developer revenue split and write signed ledger transaction.",
      },
    ],
  },
  {
    id: "multi-jurisdiction-tax-usf",
    title: "Automating Multi-Jurisdiction Telecom VAT & USF Tax Calculations",
    outcome: "Govern",
    role: "Compliance & Tax",
    difficulty: "Intermediate",
    readTime: "15 min read",
    domain: "Tax & Compliance",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    summary:
      "Setting up runtime jurisdiction packs, geo-situs coordinate mapping, and generating statutory USF filing packages without core redeployment.",
    prerequisites: [
      "Active Jurisdiction Packs for target regions",
      "Cell site latitude/longitude mapping tables",
    ],
    steps: [
      {
        title: "1. Activate State & Federal Jurisdiction Packs",
        desc: "Load versioned tax packs into runtime. Rules evaluate automatically during bill generation.",
      },
      {
        title: "2. Geofence & Situs Resolution",
        desc: "Map subscriber data consumption centroids against municipal and state tax boundaries.",
      },
      {
        title: "3. Audit-Ready Filing Package Export",
        desc: "Generate ZIP bundle containing XML filing manifests, signature hashes, and summary ledgers.",
      },
    ],
  },
  {
    id: "evidence-ledger-exports",
    title: "Building Tamper-Evident Billing Evidence Exports for Financial Audits",
    outcome: "Govern",
    role: "Compliance & Tax",
    difficulty: "Intermediate",
    readTime: "18 min read",
    domain: "Evidence & Audit",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    summary:
      "Exporting cryptographic Merkle-proof manifests and CDR hash chains for SOC 2 Type II and tax auditor defense.",
    prerequisites: [
      "Auditor role permissions in ZoikoNex",
      "GPG Public Key registered for signature verification",
    ],
    steps: [
      {
        title: "1. Scope Export Timeframe & Entity",
        desc: "Select billing period, tenant, and transaction classes for audit export.",
      },
      {
        title: "2. Generate Merkle Hash Chain Manifest",
        desc: "ZoikoNex computes the root hash across all rating events in the selected scope.",
      },
      {
        title: "3. Download Cryptographically Sealed Archive",
        desc: "Auditor verifies signature with offline tool without needing database access.",
      },
    ],
  },
  {
    id: "esim-provisioning-pipeline",
    title: "eSIM Provisioning & Profile Switching with GSMA RSP SM-DP+",
    outcome: "Operate",
    role: "DevOps / SRE",
    difficulty: "Advanced",
    readTime: "30 min read",
    domain: "eSIM & IoT",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    summary:
      "Managing eSIM profiles, SM-DP+ certificate bindings, activation codes, and fallback OTA profile switches.",
    prerequisites: [
      "GSMA SAS-UP certified SM-DP+ endpoint",
      "EID inventory batch uploaded to ZoikoNex",
    ],
    steps: [
      {
        title: "1. Bind SM-DP+ Certificates & Root CAs",
        desc: "Establish mutual TLS with certified eSIM preparation servers.",
      },
      {
        title: "2. Orchestrate Profile Reservation",
        desc: "Allocate matching ICCID and profile package upon subscriber order confirmation.",
      },
      {
        title: "3. Handle OTA Profile Swap & Deactivation",
        desc: "Automate fallback profile triggers for international roaming transitions.",
      },
    ],
  },
];

const OUTCOMES = ["All Playbooks", "Launch", "Migrate", "Integrate", "Operate", "Govern"];
const FAQS = [
  {
    q: "What's the difference between a guide and API Reference?",
    a: "API Reference documents individual endpoints and schemas. Guides provide end-to-end operational blueprints showing sequence, failure modes, rollback strategies, and verification checkpoints.",
  },
  {
    q: "Can I use these guides in production without ZoikoNex support?",
    a: "Yes. Every playbook is designed for autonomous execution with pre-flight checklists and idempotent recovery procedures. For complex MNO cutovers, our solutions engineering team provides co-pilot assistance.",
  },
  {
    q: "How often are guides updated and verified?",
    a: "All playbooks are tested against current release builds on a bi-weekly cadence. When 3GPP standards or tax jurisdiction regulations change, affected guides are updated and versioned.",
  },
  {
    q: "How do I request a guide for a specific legacy BSS or protocol?",
    a: "You can submit a request through our developer portal or contact our solutions architecture team to co-develop custom adapter blueprints.",
  },
];

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("All Playbooks");
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredPlaybooks = useMemo(() => {
    return PLAYBOOKS_DATA.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOutcome =
        selectedOutcome === "All Playbooks" || p.outcome === selectedOutcome;

      return matchesSearch && matchesOutcome;
    });
  }, [searchQuery, selectedOutcome]);

  return (
    <div className="w-full bg-[#EEF2F7] text-slate-900 min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white text-slate-900 pt-16 pb-16 lg:pt-20 lg:pb-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
            <span className="w-4 h-[2px] bg-blue-600 inline-block" />
            GUIDES & RUNBOOKS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight sm:leading-[1.15]">
            Practical guidance for launching, migrating, integrating, and operating telecom services.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Step-by-step technical guides, architectural runbooks, and operator blueprints for high-stakes telecom operations.
          </p>

          {/* Centered Large Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-300 bg-white">
              <div className="absolute left-4 flex items-center pointer-events-none">
                <Image
                  src="/image/guides/icon-search.svg"
                  alt="Search"
                  width={18}
                  height={18}
                  className="opacity-60"
                />
              </div>
              <input
                type="text"
                placeholder="Search guides by keyword, domain, or outcome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-28 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button className="absolute right-2 px-5 py-2.5 rounded-xl bg-[#08182B] hover:bg-slate-800 text-white font-semibold text-xs transition-colors">
                Search
              </button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-4">
              <span className="font-medium">Recent:</span>
              {["Zero-Downtime BSS Migration (35 min read)", "Launching a Multi-Brand Digital MVNO (25 min read)", "Configuring Real-Time Charging for CAMARA (20 min read)"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.split(" (")[0])}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT APPLIES BEFORE YOU FOLLOW IT (5 Cards with SVGs) */}
      <section className="py-12 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — OPERATIONAL CONSTRAINTS
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              What applies before you follow it
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white border-t-2 border-t-blue-500 border-x border-b border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">01 · SCOPE</span>
                <Image src="/image/guides/icon-circle-info.svg" alt="Scope" width={16} height={16} />
              </div>
              <div className="text-xs font-bold text-slate-900">Clear Operational Boundaries</div>
              <p className="text-[11px] text-slate-500">Every guide indicates its explicit domain bounds.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-t-2 border-t-emerald-500 border-x border-b border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">02 · PREREQUISITES</span>
                <Image src="/image/guides/icon-check.svg" alt="Prerequisites" width={16} height={16} />
              </div>
              <div className="text-xs font-bold text-slate-900">Host Credentials &amp; Access</div>
              <p className="text-[11px] text-slate-500">Required credentials and network permissions.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-t-2 border-t-purple-500 border-x border-b border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">03 · SIGNALS</span>
                <Image src="/image/guides/icon-sliders.svg" alt="Signals" width={16} height={16} />
              </div>
              <div className="text-xs font-bold text-slate-900">Real-Time Telemetry</div>
              <p className="text-[11px] text-slate-500">Diameter Ro/Gy and 5G Nchf input signals.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-t-2 border-t-amber-500 border-x border-b border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">04 · OUTCOMES</span>
                <Image src="/image/guides/icon-layers.svg" alt="Outcomes" width={16} height={16} />
              </div>
              <div className="text-xs font-bold text-slate-900">Deterministic Lock</div>
              <p className="text-[11px] text-slate-500">Tariff snapshot lock and delta verification.</p>
            </div>

            <div className="p-4 rounded-xl bg-white border-t-2 border-t-rose-500 border-x border-b border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">05 · EVIDENCE</span>
                <Image src="/image/guides/icon-shield.svg" alt="Evidence" width={16} height={16} />
              </div>
              <div className="text-xs font-bold text-slate-900">Tamper-Evident Ledgers</div>
              <p className="text-[11px] text-slate-500">Cryptographic audit-trail for every run.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT TO CHECK BEFORE EXECUTING (Photo guide-hero.png on Right) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  — OPERATIONAL READINESS
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  What to check before executing an issue in production
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every guide provides pre-execution checklists tailored to your specific telecom architecture and domain.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { title: "MNO Core", desc: "3GPP Rel 17 CHF/SMF interface binding.", icon: "/image/guides/icon-cpu.svg" },
                  { title: "MVNO Stack", desc: "Host MNO mediation feeds, CDR batching.", icon: "/image/guides/icon-layers-2.svg" },
                  { title: "MVNE Platform", desc: "Tenant isolation, partitioned rate cards.", icon: "/image/guides/icon-database.svg" },
                  { title: "Roaming", desc: "TAP/RAP exchange, SDR settlement.", icon: "/image/guides/icon-globe.svg" },
                  { title: "Enterprise IoT", desc: "APN traffic pools, telemetry buckets.", icon: "/image/guides/icon-sliders.svg" },
                  { title: "Media / OTT", desc: "Zero-rated bundles, carrier billing.", icon: "/image/guides/icon-sparkles-star.svg" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200 space-y-1.5 hover:bg-white hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                      <Image src={item.icon} alt={item.title} width={18} height={18} />
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <div className="relative h-72 sm:h-96 w-full">
                  <Image
                    src="/image/guides/guide-hero.png"
                    alt="Engineer reviewing deployment readiness"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs border border-slate-700/60">
                    <span className="font-semibold text-emerald-400">Pre-Flight Verification:</span> 14 guardrail checks passed before deployment authorization.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURE & INTEGRATION GUIDES (Playbook Catalog) */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                — PLAYBOOK CATALOG
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Playbooks — launch, test and verify in your env
              </h2>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {OUTCOMES.map((outcome) => (
                <button
                  key={outcome}
                  onClick={() => setSelectedOutcome(outcome)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedOutcome === outcome
                      ? "bg-[#08182B] text-white shadow-sm"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs"
                  }`}
                >
                  {outcome}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaybooks.map((playbook) => (
              <div
                key={playbook.id}
                onClick={() => setActivePlaybook(playbook)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${playbook.badgeColor}`}>
                      {playbook.outcome.toUpperCase()} · {playbook.domain}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Image src="/image/guides/icon-clock.svg" alt="Clock" width={13} height={13} />
                      {playbook.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 leading-snug">{playbook.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">{playbook.summary}</p>
                </div>
                <div>
                  <div className="border-t border-slate-100 pt-3 mb-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Target: <strong className="text-slate-800">{playbook.role}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-700">{playbook.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Read implementation guide</span>
                    <Image src="/image/guides/icon-arrow-right.svg" alt="Arrow" width={14} height={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CODE BLUEPRINT (Dark Navy `#08182B`) */}
      <section className="py-16 sm:py-20 bg-[#08182B] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
                <span className="w-4 h-[2px] bg-sky-400 inline-block" />
                DEVELOPER BLUEPRINT
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                A single blueprint, never a duplicate of API Reference.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our guides focus on real-time orchestration logic, dual-rating verification, and cryptographic rollback handlers rather than simple CRUD endpoints.
              </p>
            </div>
            <div className="lg:col-span-7 w-full">
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <Image src="/image/guides/icon-terminal-window.svg" alt="Terminal" width={16} height={16} />
                    <span className="text-emerald-400 font-bold">POST /v1/rating/sessions/commit</span>
                  </div>
                  <span className="text-[10px] text-slate-500">cURL · Idempotent</span>
                </div>
                <pre className="p-5 text-xs font-mono text-slate-200 overflow-x-auto">
                  <code>{`curl -X POST https://api.zoikonex.com/v1/rating/sessions/commit \\
  -H "Authorization: Bearer zn_live_token" \\
  -H "X-Idempotency-Key: idm_8829141" \\
  -d '{
    "sessionId": "ses_991204a",
    "consumedUnits": 42000000,
    "tariffSnapshotId": "sn_2026_q3_v2"
  }'`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTION SAFETY (Guardrails & Limits) */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">— PRODUCTION SAFETY</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Do not touch, evaluating a guide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <Image src="/image/guides/icon-check.svg" alt="Permitted" width={18} height={18} />
                <span>Permitted Actions</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Dry-run synthetic rating evaluation against test queues.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Dual-write CDR replication into shadow mediation pipelines.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Read-only rate catalog version inspection.</span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <Image src="/image/guides/icon-alert-triangle.svg" alt="Restricted" width={18} height={18} />
                <span>Restricted Actions</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Mutating live rate cards without multi-party cryptographic signature.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Bulk profile migration exceeding 10k SIMs/hr on primary host interconnects.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Direct production database modifications bypassing the ledger.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEQUENCE OF GUIDES (Timeline with Photo guide-diagram.png on Right) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content with Timeline */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  — EXECUTION PATHWAY
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Sequence of 6 guides, sequential vs solo
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Follow proven multi-phase delivery paths from initial evaluation to full operator scale.
                </p>
              </div>

              {/* Progress Steps 1 to 6 */}
              <div className="flex items-center justify-between relative py-2 overflow-x-auto">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                {[
                  { num: "1", label: "Scope" },
                  { num: "2", label: "Shadow" },
                  { num: "3", label: "Dual Rating" },
                  { num: "4", label: "Reconcile" },
                  { num: "5", label: "Cutover" },
                  { num: "6", label: "Verify" },
                ].map((step, idx) => (
                  <div key={step.num} className="relative z-10 flex flex-col items-center gap-1.5 min-w-[50px]">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? "bg-[#08182B] text-white ring-4 ring-blue-100" : "bg-white border-2 border-slate-300 text-slate-600"}`}>
                      {step.num}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 text-center">{step.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Phase 1: Architecture Boundary Definition</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Map existing mediation records, subscriber tables, and tariff matrices.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#EEF2F7] border border-slate-200">
                  <div className="text-xs font-bold text-slate-900">Phase 2: Synthetic Shadow Rehearsal</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Simulate 10M CDR batches to ensure penny-perfect rating reconciliation.</p>
                </div>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                <div className="relative h-72 sm:h-96 w-full">
                  <Image
                    src="/image/guides/guide-diagram.png"
                    alt="Engineering team collaborating on deployment"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs border border-slate-700/60">
                    <span className="font-semibold text-sky-400">Collaboration Blueprint:</span> Architecture and DevOps alignment across strangler-fig migration phases.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ENVIRONMENT-AWARE CODE EXAMPLES (The truth in execution is specific) */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
              — SDK & TOOLING SUPPORT
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The truth in execution is specific
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Node.js / TS", "Go SDK", "Python", "Java / Spring", "Rust Core", "REST / cURL"].map((env) => (
              <div key={env} className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-[#08182B] text-white flex items-center justify-center mx-auto text-xs font-mono font-bold mb-2">
                  {env.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs font-bold text-slate-900">{env}</div>
                <div className="text-[10px] text-slate-500">Official SDK</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER (Dark Navy `#08182B`) */}
      <section className="py-12 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#08182B] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to launch with governed precision?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Explore how ZoikoNex accelerates BSS modernization, MVNO launch, and network API monetization.
              </p>
            </div>
            <Link
              href="/request-a-demo"
              className="px-6 py-3.5 rounded-lg bg-[#63B233] hover:bg-[#549c29] text-white font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION (Direct answers, no digging) */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">— FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Direct answers, no digging.
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-600 text-lg font-bold">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {activePlaybook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white text-slate-900 p-8 space-y-6">
            <button onClick={() => setActivePlaybook(null)} className="absolute top-5 right-5 text-slate-500">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold">{activePlaybook.title}</h3>
            <p className="text-sm text-slate-600">{activePlaybook.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
