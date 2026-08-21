"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Layers,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RefreshCw,
  Lock,
  ExternalLink,
  Check,
  X,
  Server,
  Zap,
  Terminal,
  Database,
} from "lucide-react";

interface RegistryItem {
  id: string;
  name: string;
  domain: string;
  pattern: string;
  direction: "Bidirectional" | "Inbound" | "Outbound";
  environment: string;
  status: "Available" | "Requires setup" | "Gated" | "Partner-managed" | "Limited" | "Needs review" | "Not verified" | "Planned";
  version: string;
  lastVerified: string;
}

const REGISTRY_ITEMS: RegistryItem[] = [
  {
    id: "billing-sync",
    name: "Billing & Invoicing Sync",
    domain: "Billing, Invoicing & Disputes domain",
    pattern: "API",
    direction: "Bidirectional",
    environment: "Sandbox, Prod",
    status: "Available",
    version: "v2.3",
    lastVerified: "Aug 14, 2026",
  },
  {
    id: "usage-stream",
    name: "Usage Event Stream",
    domain: "Usage Ingestion & Mediation domain",
    pattern: "Webhook",
    direction: "Outbound",
    environment: "Sandbox, Prod",
    status: "Requires setup",
    version: "v1.4",
    lastVerified: "Aug 09, 2026",
  },
  {
    id: "tax-failover",
    name: "Tax Provider Failover",
    domain: "Tax & Jurisdiction Engine domain",
    pattern: "API",
    direction: "Outbound",
    environment: "Prod only",
    status: "Gated",
    version: "v1.0",
    lastVerified: "Jul 30, 2026",
  },
  {
    id: "mobile-money",
    name: "Mobile Money Settlement",
    domain: "Payments, Wallets & Reconciliation domain",
    pattern: "API",
    direction: "Bidirectional",
    environment: "Sandbox, Partner",
    status: "Partner-managed",
    version: "v1.1",
    lastVerified: "Aug 02, 2026",
  },
  {
    id: "legacy-cdr",
    name: "Legacy CDR Batch Import",
    domain: "Legacy / SFTP adapter pattern",
    pattern: "Batch",
    direction: "Inbound",
    environment: "Sandbox, Prod",
    status: "Limited",
    version: "v1.0",
    lastVerified: "Jul 22, 2026",
  },
  {
    id: "esim-provisioning",
    name: "eSIM Profile Provisioning",
    domain: "eSIM & IoT Lifecycle domain",
    pattern: "API",
    direction: "Bidirectional",
    environment: "Sandbox only",
    status: "Needs review",
    version: "v0.9",
    lastVerified: "Jun 03, 2026",
  },
  {
    id: "soap-rest-bridge",
    name: "SOAP-to-REST Charging Bridge",
    domain: "Legacy modernization pattern",
    pattern: "Legacy",
    direction: "Bidirectional",
    environment: "Not verified",
    status: "Not verified",
    version: "—",
    lastVerified: "—",
  },
  {
    id: "camara-network-api",
    name: "Network API Exposure (CAMARA)",
    domain: "Network API Monetization domain",
    pattern: "API",
    direction: "Outbound",
    environment: "Planned",
    status: "Planned",
    version: "—",
    lastVerified: "—",
  },
];

const CONNECTION_PATTERNS = [
  {
    id: "api",
    icon: "⇄",
    title: "API request/response",
    desc: "Synchronous calls for reads, writes or lookups against a ZoikoNex domain.",
  },
  {
    id: "webhooks",
    icon: "⇢",
    title: "Webhooks / events",
    desc: "Asynchronous delivery when usage, billing or lifecycle events occur.",
  },
  {
    id: "batch",
    icon: "▤",
    title: "Batch / file",
    desc: "Scheduled file exchange for reconciliation, mediation or bulk load.",
  },
  {
    id: "legacy",
    icon: "⌂",
    title: "Legacy adapter",
    desc: "SFTP, MQ, SOAP or DB-level bridges into older OSS/BSS systems.",
  },
  {
    id: "private",
    icon: "◈",
    title: "Private network",
    desc: "Direct connectivity for latency- or residency-sensitive workloads.",
  },
  {
    id: "partner",
    icon: "❖",
    title: "Partner / ecosystem",
    desc: "Connectivity brokered through a partner-managed integration.",
  },
];

const FAQS = [
  {
    q: "What's the difference between an API and a webhook integration here?",
    a: "API request/response is synchronous — you call ZoikoNex and get a response in the same exchange. Webhooks are asynchronous — ZoikoNex delivers an event when something happens on its side, with retry and ordering behavior defined per integration.",
  },
  {
    q: "How does legacy OSS/BSS modernization actually work?",
    a: "SFTP, Kafka, MQ, Oracle/DB2, and SOAP-to-REST adapters run concurrently with real-time rating and billing. You transform incoming records into standardized event streams, validate them in a sandbox environment, and reconcile nightly checkpoints before switching active production routes.",
  },
  {
    q: "What happens on retries and idempotency?",
    a: "Every mutation endpoint requires an idempotency key. In the event of a network timeout after a commit, the execution state is classified as 'Unknown outcome' and audited against the revenue ledger rather than blindly repeated.",
  },
  {
    q: "Does sandbox access mean I'm approved for production?",
    a: "No. Sandbox environments use synthetic data for contract testing. Promotion to production requires an explicit readiness check, network allow-listing, and compliance review.",
  },
  {
    q: "How is compatibility verified and kept current?",
    a: "Our Integration Registry runs continuous automated contract tests against our staging clusters. Status changes, version bumps, and breaking API updates are posted to the changelog and verified with timestamped evidence.",
  },
];

export default function IntegrationReferencePage() {
  const [selectedPattern, setSelectedPattern] = useState("api");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getStatusBadge = (status: RegistryItem["status"]) => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        );
      case "Requires setup":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-sky-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Requires setup
          </span>
        );
      case "Gated":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            Gated
          </span>
        );
      case "Partner-managed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-50 text-yellow-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Partner-managed
          </span>
        );
      case "Limited":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-50 text-yellow-800 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Limited
          </span>
        );
      case "Needs review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-yellow-50 text-yellow-800 text-xs font-bold border border-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Needs review
          </span>
        );
      case "Not verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-500 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            Not verified
          </span>
        );
      case "Planned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Planned
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRegistry = REGISTRY_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === "All" || item.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (Dark Navy Gradient) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900/95 via-sky-950/90 via-55% to-sky-950/95 text-white pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-[1.50px] bg-blue-300" />
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                  Integration Reference
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Connect ZoikoNex with a<br />contract you can inspect.
              </h1>

              <p className="text-slate-300 text-base font-normal max-w-xl leading-relaxed">
                Find integration patterns, compatibility context, schemas, security requirements and
                current runtime behavior for connecting ZoikoNex to telecom and enterprise systems —
                before you write a line of code.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/api-reference"
                  className="px-6 py-3.5 bg-[#63B233] hover:bg-[#549c29] text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2 shadow-md"
                >
                  Open API Reference
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                <div className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                  18 governed domains
                </div>
                <div className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                  Evidence-ledger backed
                </div>
                <div className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                  Sandbox before production
                </div>
              </div>
            </div>

            {/* Right Column: Hero Preview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-200 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                    <span className="text-gray-700 text-xs font-bold ml-1">
                      Integration Registry
                    </span>
                  </div>
                  <div className="px-2.5 py-1 bg-slate-50 rounded-full border border-gray-200 text-gray-600 text-[11px] font-semibold">
                    Overview · Registry · APIs · Events · Security
                  </div>
                </div>
                <div className="relative h-72 sm:h-80 w-full bg-slate-100">
                  <Image
                    src="/image/guides/guide-hero.png"
                    alt="Engineers reviewing integration contracts"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW ARE YOU CONNECTING? (Choose the model before detail) */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-500" />
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                How are you connecting?
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-10">
              Choose the model before the detail.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Pick the pattern closest to what you&apos;re building. It narrows the registry below to the
              fields that actually matter for that connection.
            </p>
          </div>

          {/* 6 Connection Model Cards (3x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONNECTION_PATTERNS.map((pattern) => {
              const isSelected = selectedPattern === pattern.id;
              return (
                <div
                  key={pattern.id}
                  onClick={() => setSelectedPattern(pattern.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 space-y-3 ${
                    isSelected
                      ? "bg-indigo-50/70 border-2 border-blue-500 shadow-sm"
                      : "bg-white border border-gray-200 hover:border-gray-300 shadow-xs"
                  }`}
                >
                  <div className="w-9 h-9 bg-cyan-900 text-white rounded-lg flex items-center justify-center text-base font-normal">
                    {pattern.icon}
                  </div>
                  <h3 className="text-gray-900 text-base font-bold">{pattern.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{pattern.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Hint Banner */}
          <div className="px-4 py-3.5 bg-neutral-100 rounded-xl border border-slate-300 text-sm text-gray-700">
            <span>Not sure which applies? Tell us the </span>
            <strong className="text-gray-900 font-bold">direction</strong>
            <span> (in, out, both), </span>
            <strong className="text-gray-900 font-bold">timing</strong>
            <span> (real-time or scheduled) and </span>
            <strong className="text-gray-900 font-bold">system type</strong>
            <span> — we&apos;ll narrow it down.</span>
          </div>
        </div>
      </section>

      {/* 3. CONNECTOR REGISTRY (Compatibility you can inspect) */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-[1.50px] bg-blue-500" />
                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                  Connector Registry
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-10">
                Compatibility you can inspect, not a logo wall.
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                Search by system, protocol, object or pattern. Every row carries direction,
                environment, status, version and the date it was last verified.
              </p>
            </div>

            {/* Right Status Definition Callout */}
            <div className="max-w-xs p-3 rounded-lg border border-slate-300 bg-white text-slate-500 text-xs leading-relaxed">
              Status reflects current product authority. Not supported, Not applicable, Unknown and
              Not verified are always shown distinctly — never collapsed into one dash.
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="flex-1 min-w-[260px] relative">
              <input
                type="text"
                placeholder="Search systems, protocols, objects or patterns…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 text-sm text-gray-900 placeholder-neutral-500 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-gray-600 text-xs font-semibold cursor-pointer">
              System type ▾
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-gray-600 text-xs font-semibold cursor-pointer">
              Pattern ▾
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-gray-600 text-xs font-semibold cursor-pointer">
              Environment ▾
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-gray-600 text-xs font-semibold cursor-pointer">
              Status ▾
            </div>
            <div className="px-3 py-2 bg-white rounded-lg border border-slate-300 text-gray-600 text-xs font-semibold cursor-pointer">
              Last verified ▾
            </div>
          </div>

          {/* Registry Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-gray-200 text-slate-500 uppercase font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-72">INTEGRATION</th>
                    <th className="py-3 px-4 w-28">PATTERN</th>
                    <th className="py-3 px-4 w-32">DIRECTION</th>
                    <th className="py-3 px-4 w-40">ENVIRONMENT</th>
                    <th className="py-3 px-4 w-48">STATUS</th>
                    <th className="py-3 px-4 w-24">VERSION</th>
                    <th className="py-3 px-4 w-32">LAST VERIFIED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistry.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        idx === 0 ? "bg-indigo-50/50" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900 text-xs">{item.name}</div>
                        <div className="text-slate-500 text-xs font-normal mt-0.5">{item.domain}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-normal">{item.pattern}</td>
                      <td className="py-3 px-4 text-gray-600 font-normal">{item.direction}</td>
                      <td className="py-3 px-4 text-gray-600 font-normal">{item.environment}</td>
                      <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                      <td className="py-3 px-4 text-gray-600 font-normal">{item.version}</td>
                      <td className="py-3 px-4 text-gray-600 font-normal">{item.lastVerified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Capability Matrix — Compare Mode */}
          <div className="pt-6 space-y-4">
            <h3 className="text-gray-900 text-lg font-bold">Capability matrix — compare mode</h3>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead className="bg-neutral-100 border-b border-gray-200 text-slate-500 uppercase font-bold tracking-wide">
                    <tr>
                      <th className="py-3 px-4 w-72">CAPABILITY</th>
                      <th className="py-3 px-4 w-48">BILLING SYNC</th>
                      <th className="py-3 px-4 w-48">USAGE STREAM</th>
                      <th className="py-3 px-4 w-56">MOBILE MONEY</th>
                      <th className="py-3 px-4 w-56">LEGACY CDR BATCH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-gray-900 border-r border-gray-200">
                        Real-time delivery
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" /> Limited
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 bg-white border border-slate-300 text-slate-500 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Not applicable
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-gray-900 border-r border-gray-200">
                        Idempotent retries
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-yellow-50 border border-orange-400 text-yellow-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" /> Needs review
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> Not supported
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-gray-900 border-r border-gray-200">
                        Sandbox parity
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" /> Limited
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-gray-900 border-r border-gray-200">
                        Reconciliation evidence
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-white border border-slate-300 text-slate-500 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> Unknown
                        </span>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-200">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Supported
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-1 bg-yellow-50 text-yellow-800 font-bold rounded-md inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full" /> Limited
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTEGRATION CONTRACT (Exactly what a connection means) */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-500" />
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                Integration Contract
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-10">
              Exactly what a connection means
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Every integration exposes the same contract anatomy. Endpoint-level and schema-level
              truth is routed to its canonical owner rather than duplicated here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Photo */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image
                    src="/image/ai-decision/analysts-review.png"
                    alt="Engineers reviewing integration contracts"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Contract Anatomy Grid */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-neutral-100 border-b border-gray-200 flex justify-between items-center">
                <span className="text-gray-900 text-sm font-bold">
                  Contract anatomy — Billing &amp; Invoicing Sync
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-md inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-xs">
                {/* Column 1 */}
                <div className="divide-y divide-gray-200">
                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      PURPOSE
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Keep external billing systems consistent with ZoikoNex invoice and dispute state.
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      DATA BOUNDARY
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Invoice line items only — no raw usage or payment credentials.
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      UNKNOWN OUTCOME
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Timeout after commit → reconcile before repeating.
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      EVIDENCE
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Hash-chained delivery + configuration events.
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="divide-y divide-gray-200">
                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      PARTIES / SYSTEMS
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      ZoikoNex Billing Core ⇄ operator ERP or CRM
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      DELIVERY CONTRACT
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      At-least-once, ordered per account, idempotency key required.
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      RECONCILIATION
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Nightly checkpoint against Revenue Assurance ledger.
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="text-slate-500 uppercase text-[10px] font-bold tracking-wide">
                      LIMITATIONS
                    </div>
                    <div className="text-gray-900 text-sm leading-snug">
                      Credit-note bulk export not yet generally available.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELIABILITY & DIAGNOSTICS (What happens when delivery is uncertain) */}
      <section className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-500" />
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                Reliability &amp; Diagnostics
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-10">
              What happens when delivery is uncertain
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Execution state is explicit end to end. A timeout after commit becomes an unknown
              outcome to reconcile — never a silent retry.
            </p>
          </div>

          {/* Stepper Bar */}
          <div className="pt-6 pb-2 overflow-x-auto">
            <div className="min-w-[700px] flex items-center justify-between relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-500" />
                <span className="text-xs font-bold text-gray-700">Configured</span>
              </div>
              <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-500" />
                <span className="text-xs font-bold text-gray-700">Connecting</span>
              </div>
              <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-emerald-500" />
                <span className="text-xs font-bold text-gray-700">Delivering</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2" />

              {/* Step 4: Unknown outcome (Active Yellow) */}
              <div className="flex flex-col items-center gap-2 relative">
                <div className="w-5 h-5 bg-yellow-600 rounded-full ring-4 ring-yellow-100 flex items-center justify-center" />
                <span className="text-xs font-bold text-yellow-800">Unknown outcome</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2" />

              {/* Step 5 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300" />
                <span className="text-xs font-bold text-gray-500">Reconciling</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2" />

              {/* Step 6 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300" />
                <span className="text-xs font-bold text-gray-500">Replayed</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-300 mx-2" />

              {/* Step 7 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-slate-300" />
                <span className="text-xs font-bold text-gray-500">Confirmed</span>
              </div>
            </div>
          </div>

          {/* Failure Contract & Separation from Platform State Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            {/* Failure Contract */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-3.5 shadow-xs">
              <h3 className="text-gray-900 text-sm font-bold">Failure contract</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "Retry eligible",
                  "Idempotency key required",
                  "Ordering preserved",
                  "30s timeout",
                  "Partial success flagged",
                  "DLQ after 5 attempts",
                  "Replay from checkpoint",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1.5 bg-neutral-100 text-gray-600 rounded-md border border-gray-200 font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* What separates from platform state */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-3.5 shadow-xs">
              <h3 className="text-gray-900 text-sm font-bold">What separates from platform state</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "Provider outage ≠ ZoikoNex outage",
                  "Credential expiry → rotation flow",
                  "Network timeout → unknown, not failed",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1.5 bg-neutral-100 text-gray-600 rounded-md border border-gray-200 font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnostic Drawer */}
          <div className="p-5 bg-[#062030] text-white rounded-2xl space-y-3 shadow-lg border border-slate-800">
            <div className="text-white text-sm font-bold">
              Diagnostic drawer — usage-stream-prod-14
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1 border-t border-slate-800">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">LAST SUCCESS</div>
                <div className="text-white font-bold mt-0.5">Aug 20, 2026 · 06:12 UTC</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">FAILURE CLASS</div>
                <div className="text-white font-bold mt-0.5">Unknown outcome</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">CORRELATION ID</div>
                <div className="text-white font-mono font-bold mt-0.5">evd_9f21c4a0</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">RETRY / REPLAY</div>
                <div className="text-white font-bold mt-0.5">Eligible after reconcile</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & ACCESS (A visible contract, not a checklist) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-teal-950/95 via-sky-950/90 via-62% to-sky-950/70 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-300" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                Security &amp; Access
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight leading-10">
              A visible contract, not a checklist
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Least privilege, data boundaries and environment access are shown per integration —
              never assumed from region or user location.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Glass Card */}
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm divide-y divide-white/10 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Credential / service identity</span>
                <span className="text-white font-bold">Scoped service account</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Scope</span>
                <span className="text-white font-bold">Invoice read/write only</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Secret owner</span>
                <span className="text-white font-bold">Operator-held, vault-issued</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Network boundary</span>
                <span className="text-white font-bold">mTLS, allow-listed egress</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Data classification</span>
                <span className="text-white font-bold">Financial — no PII fields</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-slate-300">Jurisdiction / residency</span>
                <span className="text-white font-bold">Set by tenant configuration</span>
              </div>
            </div>

            {/* Right Numbered Access Tiers */}
            <div className="space-y-2.5">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                  1
                </div>
                <div className="text-white text-sm font-semibold">
                  Public reference — open, no gate
                </div>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                  2
                </div>
                <div className="text-white text-sm font-semibold">
                  Sandbox available — synthetic data only
                </div>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                  3
                </div>
                <div className="text-white text-sm font-semibold">
                  Staging / partner — access under review
                </div>
              </div>

              <div className="p-3.5 bg-red-600/10 rounded-xl border border-red-600/50 flex items-center gap-3.5">
                <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0">
                  4
                </div>
                <div className="text-white text-sm font-semibold">
                  Production blocked — readiness checks incomplete
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SANDBOX → PRODUCTION (Test safely. Modernize without a rewrite) */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-500" />
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                Sandbox → Production
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-10">
              Test safely. Modernize without a rewrite
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Promotion runs through explicit gates. Legacy examples show pattern-level support —
              exact compatibility stays registry- and evidence-dependent.
            </p>
          </div>

          {/* 4-Step Promotion Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div className="p-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-gray-900 text-xs font-bold">Public docs</div>
              <div className="text-slate-500 text-xs">No access required</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-gray-900 text-xs font-bold">Sandbox</div>
              <div className="text-slate-500 text-xs">Synthetic test data</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-gray-900 text-xs font-bold">Staging / Partner</div>
              <div className="text-slate-500 text-xs">Approved test evidence</div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-gray-900 text-xs font-bold">Production</div>
              <div className="text-slate-500 text-xs">Readiness gate + approval</div>
            </div>
          </div>

          {/* Legacy Modernization Pattern */}
          <div className="pt-6 space-y-4">
            <div>
              <h3 className="text-gray-900 text-lg font-bold">Legacy modernization pattern</h3>
              <p className="text-gray-600 text-sm max-w-2xl mt-1">
                SFTP, Kafka, MQ, Oracle/DB2 and SOAP-to-REST adapters coexist with real-time charging
                during migration.
              </p>
            </div>

            {/* Adapter Flow sequence */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-5 py-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1 flex-1 min-w-[160px]">
                <div className="text-gray-900 text-xs font-bold">Existing OSS/BSS</div>
                <div className="text-slate-500 text-[11px]">SFTP · SOAP · Oracle/DB2</div>
              </div>

              <span className="text-slate-400 font-bold text-lg">→</span>

              <div className="px-5 py-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1 flex-1 min-w-[160px]">
                <div className="text-gray-900 text-xs font-bold">Adapter layer</div>
                <div className="text-slate-500 text-[11px]">Transformation + mapping</div>
              </div>

              <span className="text-slate-400 font-bold text-lg">→</span>

              <div className="px-5 py-4 bg-teal-950 text-white rounded-xl border border-sky-950 text-center space-y-1 flex-1 min-w-[160px]">
                <div className="text-white text-xs font-bold">ZoikoNex</div>
                <div className="text-slate-300 text-[11px]">Rating, billing, evidence</div>
              </div>

              <span className="text-slate-400 font-bold text-lg">→</span>

              <div className="px-5 py-4 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1 flex-1 min-w-[160px]">
                <div className="text-gray-900 text-xs font-bold">Reconciliation</div>
                <div className="text-slate-500 text-[11px]">Rollback-ready checkpoint</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OPERATE & EVIDENCE (Built for life of integration, not just launch) */}
      <section className="py-16 sm:py-20 bg-[#08182B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-300" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">
                Operate &amp; Evidence
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight leading-10">
              Built for the life of the integration, not just the launch
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Health, freshness, change and evidence stay first-class after go-live. Existing
              customers get support paths, not a sales funnel.
            </p>
          </div>

          {/* 4 Status Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-zinc-400 text-xs uppercase font-medium">CONFIGURATION</div>
              <div className="text-white text-sm font-bold flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> Valid
              </div>
              <div className="text-zinc-400 text-xs">Checked 4 min ago</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-zinc-400 text-xs uppercase font-medium">CONNECTIVITY</div>
              <div className="text-white text-sm font-bold flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> Reachable
              </div>
              <div className="text-zinc-400 text-xs">Checked 4 min ago</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-zinc-400 text-xs uppercase font-medium">DELIVERY</div>
              <div className="text-white text-sm font-bold flex items-center gap-1.5">
                <span className="text-yellow-400 font-bold">⚠</span> Degraded
              </div>
              <div className="text-zinc-400 text-xs">Since 06:12 UTC</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-zinc-400 text-xs uppercase font-medium">RECONCILIATION</div>
              <div className="text-white text-sm font-bold flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> Current
              </div>
              <div className="text-zinc-400 text-xs">Last run 02:00 UTC</div>
            </div>
          </div>

          {/* Change Timeline Entries */}
          <div className="p-6 bg-white/10 rounded-2xl divide-y divide-white/10 text-xs">
            <div className="py-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-28 text-zinc-400 font-bold flex-shrink-0">Sep 02, 2026</div>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  Billing Sync v2.3 → v2.4 (breaking)
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Credit-note payload adds a required <code className="text-sky-300 font-mono">reasonCode</code> field. Required action: update mapping before Sep 02. Authority: API Reference changelog.
                </p>
              </div>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-28 text-zinc-400 font-bold flex-shrink-0">Jul 15, 2026</div>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  Legacy CDR Batch — evidence format change
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Reconciliation evidence now includes file-level checksums. No action required for existing integrations.
                </p>
              </div>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-28 text-zinc-400 font-bold flex-shrink-0">Jun 01, 2026</div>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  eSIM Profile Provisioning marked Needs review
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Verification lapsed past freshness window. Registry entry held at last-known state pending re-verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 bg-[#0A2638] text-white rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <h3 className="text-2xl font-bold text-white">
                Ready to see the contract for your integration?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Technical clarity first. Commercial conversation only once the compatibility,
                security and failure behavior make sense for your environment.
              </p>
            </div>
            <div>
              <Link
                href="/contact-us"
                className="px-6 py-3.5 bg-[#63B233] hover:bg-[#549c29] text-white text-sm font-semibold rounded-lg transition-colors inline-block whitespace-nowrap shadow-md"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION (Direct answers, no gate) */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-[1.50px] bg-blue-500" />
              <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Direct answers, no gate.
            </h2>
          </div>

          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-base font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-500 text-xl font-normal">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
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
