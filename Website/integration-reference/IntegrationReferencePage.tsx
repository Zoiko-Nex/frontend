"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Check,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Shield,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  Server,
  Zap,
} from "lucide-react";

interface RegistryItem {
  id: string;
  name: string;
  domain: string;
  pattern: string;
  direction: "Bidirectional" | "Inbound" | "Outbound";
  environment: string;
  status:
    | "Available"
    | "Requires setup"
    | "Gated"
    | "Partner-managed"
    | "Limited"
    | "Needs review"
    | "Not verified"
    | "Planned";
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
    id: "soap-bridge",
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
    id: "camara-api",
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

export default function IntegrationReferencePage() {
  const [selectedPattern, setSelectedPattern] = useState("api");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedSystemType, setSelectedSystemType] = useState("All");
  const [selectedEnvironment, setSelectedEnvironment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredRegistry = REGISTRY_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.pattern.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    const matchesEnv =
      selectedEnvironment === "All" ||
      item.environment.includes(selectedEnvironment);
    return matchesSearch && matchesStatus && matchesEnv;
  });

  const getStatusBadge = (status: RegistryItem["status"]) => {
    switch (status) {
      case "Available":
        return (
          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-200">
            <span className="size-1.5 bg-emerald-500 rounded-full" />
            Available
          </span>
        );
      case "Requires setup":
        return (
          <span className="px-2 py-1 bg-indigo-50 text-sky-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-blue-200">
            <span className="size-1.5 bg-blue-500 rounded-full" />
            Requires setup
          </span>
        );
      case "Gated":
        return (
          <span className="px-2 py-1 bg-violet-50 text-violet-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-violet-200">
            <span className="size-1.5 bg-violet-500 rounded-full" />
            Gated
          </span>
        );
      case "Partner-managed":
        return (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-yellow-200">
            <span className="size-1.5 bg-yellow-600 rounded-full" />
            Partner-managed
          </span>
        );
      case "Limited":
        return (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-yellow-200">
            <span className="size-1.5 bg-yellow-600 rounded-full" />
            Limited
          </span>
        );
      case "Needs review":
        return (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-orange-400">
            <span className="size-1.5 bg-yellow-600 rounded-full" />
            Needs review
          </span>
        );
      case "Not verified":
        return (
          <span className="px-2 py-1 bg-white text-slate-500 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-slate-300">
            <span className="size-1.5 bg-slate-300 rounded-full" />
            Not verified
          </span>
        );
      case "Planned":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold inline-flex items-center gap-1.5 border border-gray-200">
            <span className="size-1.5 bg-gray-400 rounded-full" />
            Planned
          </span>
        );
      default:
        return null;
    }
  };

  const FAQS = [
    {
      q: "What's the difference between an API and a webhook integration here?",
      a: "API request/response is synchronous — you call ZoikoNex and get a response in the same exchange. Webhooks are asynchronous — ZoikoNex delivers an event when something happens on its side, with retry and ordering behavior defined per integration.",
    },
    {
      q: "How does legacy OSS/BSS modernization actually work?",
      a: "We deploy bidirectional adapters that speak SFTP, SOAP, MQ or native SQL while communicating with ZoikoNex via modern REST and gRPC interfaces. Systems run in parallel with real-time reconciliation until cutover.",
    },
    {
      q: "What happens on retries and idempotency?",
      a: "Every consequential write requires an Idempotency-Key header. If a timeout occurs after commit, the transaction transitions into an 'Unknown outcome' state and is resolved via the reconciliation ledger before any retry is attempted.",
    },
    {
      q: "Does sandbox access mean I'm approved for production?",
      a: "No. Sandbox access provides synthetic test environments. Production access requires passing security readiness, mTLS validation, and formal architectural review.",
    },
    {
      q: "How is compatibility verified and kept current?",
      a: "Every integration entry in the registry is audited against active runtime versions. Entries display exact verified dates, change notes, and deprecation schedules with strict freshness windows.",
    },
  ];

  return (
    <div className="w-full bg-white text-zinc-900 font-['Plus_Jakarta_Sans'] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900/95 via-sky-950/90 to-sky-950/95 text-white pt-24 pb-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 -z-10 opacity-25 mix-blend-luminosity pointer-events-none">
          <Image
            src="/image/integration/integration-hero-bg.png"
            alt="Data Center Server Rack"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-4 h-[1.5px] bg-blue-300 rounded-[1px] inline-block" />
              Integration Reference
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[48.40px] tracking-tight">
              Connect ZoikoNex with a<br />
              contract you can inspect.
            </h1>

            <p className="text-slate-300 text-base leading-7 max-w-lg">
              Find integration patterns, compatibility context, schemas, security
              requirements and current runtime behavior for connecting ZoikoNex
              to telecom and enterprise systems — before you write a line of
              code.
            </p>

            <div className="pt-2">
              <Link
                href="/api-reference"
                className="px-6 py-3.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-lg transition-colors inline-block shadow-md cursor-pointer"
              >
                Open API Reference
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                18 governed domains
              </span>
              <span className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                Evidence-ledger backed
              </span>
              <span className="pl-4 pr-3 py-1.5 bg-white/5 rounded-full border border-white/20 text-slate-200 text-xs font-semibold">
                Sandbox before production
              </span>
            </div>
          </div>

          {/* Right Column Mockup Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-[0px_20px_60px_0px_rgba(8,18,34,0.16)] border border-white/10 overflow-hidden">
              {/* Window Header */}
              <div className="px-4 py-3.5 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 bg-gray-300 rounded-full inline-block" />
                    <span className="size-2 bg-gray-300 rounded-full inline-block" />
                    <span className="size-2 bg-gray-300 rounded-full inline-block" />
                  </div>
                  <span className="text-gray-700 text-xs font-bold pl-2">
                    Integration Registry
                  </span>
                </div>
                <div className="px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-600 text-xs font-semibold">
                  Overview · Registry · APIs · Events · Security
                </div>
              </div>

              {/* Window Image */}
              <div className="relative h-[320px] sm:h-[380px] w-full">
                <Image
                  src="/image/integration/integration-hero.png"
                  alt="Integration preview with laptop and paperwork"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE THE MODEL BEFORE THE DETAIL */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-10">
        <div className="space-y-3 max-w-[720px]">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
            How are you connecting?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
            Choose the model before the detail.
          </h2>
          <p className="text-gray-600 text-base leading-6">
            Pick the pattern closest to what you&apos;re building. It narrows the
            registry below to the fields that actually matter for that
            connection.
          </p>
        </div>

        {/* 6 Integration Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: API request/response */}
          <div
            onClick={() => setSelectedPattern("api")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "api"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ⇄
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              API request/response
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              Synchronous calls for reads, writes or lookups against a ZoikoNex
              domain.
            </p>
          </div>

          {/* Card 2: Webhooks / events */}
          <div
            onClick={() => setSelectedPattern("webhook")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "webhook"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ⇢
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              Webhooks / events
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              Asynchronous delivery when usage, billing or lifecycle events
              occur.
            </p>
          </div>

          {/* Card 3: Batch / file */}
          <div
            onClick={() => setSelectedPattern("batch")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "batch"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ▤
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              Batch / file
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              Scheduled file exchange for reconciliation, mediation or bulk
              load.
            </p>
          </div>

          {/* Card 4: Legacy adapter */}
          <div
            onClick={() => setSelectedPattern("legacy")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "legacy"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ⌂
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              Legacy adapter
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              SFTP, MQ, SOAP or DB-level bridges into older OSS/BSS systems.
            </p>
          </div>

          {/* Card 5: Private network */}
          <div
            onClick={() => setSelectedPattern("private")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "private"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ◈
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              Private network
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              Direct connectivity for latency- or residency-sensitive workloads.
            </p>
          </div>

          {/* Card 6: Partner / ecosystem */}
          <div
            onClick={() => setSelectedPattern("partner")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
              selectedPattern === "partner"
                ? "bg-indigo-50/80 border-blue-500 shadow-sm"
                : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="size-9 bg-cyan-900 rounded-lg flex items-center justify-center text-white text-base font-bold">
              ⛨
            </div>
            <h3 className="text-zinc-900 text-base font-bold pt-1">
              Partner / ecosystem
            </h3>
            <p className="text-gray-600 text-xs leading-5">
              Connectivity brokered through a partner-managed integration.
            </p>
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="p-4 bg-neutral-100 rounded-xl border border-slate-300 text-gray-600 text-sm">
          Not sure which applies? Tell us the{" "}
          <strong className="text-zinc-900">direction</strong> (in, out, both),{" "}
          <strong className="text-zinc-900">timing</strong> (real-time or
          scheduled) and{" "}
          <strong className="text-zinc-900">system type</strong> — we&apos;ll
          narrow it down.
        </div>
      </section>

      {/* 3. CONNECTOR REGISTRY */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto space-y-8">
          {/* Header and Disclaimer */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-[720px]">
              <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
                <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
                Connector Registry
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
                Compatibility you can inspect, not a logo wall.
              </h2>
              <p className="text-gray-600 text-base leading-6">
                Search by system, protocol, object or pattern. Every row carries
                direction, environment, status, version and the date it was last
                verified.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-300 bg-white/60 text-slate-500 text-xs leading-5 max-w-xs shrink-0">
              Status reflects current product authority. Not supported, Not
              applicable, Unknown and Not verified are always shown distinctly —
              never collapsed into one dash.
            </div>
          </div>

          {/* Search & Dropdown Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <div className="flex-1 min-w-[240px] px-3.5 py-2.5 bg-white rounded-lg border border-slate-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search systems, protocols, objects or patterns…"
                className="w-full text-zinc-900 bg-transparent outline-hidden text-sm"
              />
            </div>

            <select
              value={selectedSystemType}
              onChange={(e) => setSelectedSystemType(e.target.value)}
              className="px-3 py-2.5 bg-white rounded-lg border border-slate-300 text-gray-700 text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="All">System type ▾</option>
              <option value="Billing">Billing</option>
              <option value="Usage">Usage Mediation</option>
              <option value="Tax">Tax</option>
              <option value="Payment">Payments</option>
            </select>

            <select
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="px-3 py-2.5 bg-white rounded-lg border border-slate-300 text-gray-700 text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="all">Pattern ▾</option>
              <option value="api">API</option>
              <option value="webhook">Webhook</option>
              <option value="batch">Batch</option>
              <option value="legacy">Legacy</option>
            </select>

            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="px-3 py-2.5 bg-white rounded-lg border border-slate-300 text-gray-700 text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="All">Environment ▾</option>
              <option value="Sandbox">Sandbox</option>
              <option value="Prod">Production</option>
              <option value="Partner">Partner</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 bg-white rounded-lg border border-slate-300 text-gray-700 text-xs font-semibold outline-hidden cursor-pointer"
            >
              <option value="All">Status ▾</option>
              <option value="Available">Available</option>
              <option value="Requires setup">Requires setup</option>
              <option value="Gated">Gated</option>
              <option value="Partner-managed">Partner-managed</option>
              <option value="Limited">Limited</option>
              <option value="Needs review">Needs review</option>
            </select>
          </div>

          {/* Registry Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Integration</th>
                  <th className="px-4 py-3.5">Pattern</th>
                  <th className="px-4 py-3.5">Direction</th>
                  <th className="px-4 py-3.5">Environment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Version</th>
                  <th className="px-4 py-3.5">Last verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistry.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      idx === 0 ? "bg-indigo-50/40" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-zinc-900 font-bold text-xs sm:text-sm">
                        {row.name}
                      </div>
                      <div className="text-slate-500 text-xs">{row.domain}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{row.pattern}</td>
                    <td className="px-4 py-3.5 text-gray-600">{row.direction}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {row.environment}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(row.status)}</td>
                    <td className="px-4 py-3.5 text-gray-600">{row.version}</td>
                    <td className="px-4 py-3.5 text-gray-600">
                      {row.lastVerified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Capability Matrix — Compare Mode */}
          <div className="space-y-4 pt-6">
            <h3 className="text-zinc-900 text-lg font-bold">
              Capability matrix — compare mode
            </h3>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-5 py-3.5">Capability</th>
                    <th className="px-4 py-3.5">Billing Sync</th>
                    <th className="px-4 py-3.5">Usage Stream</th>
                    <th className="px-4 py-3.5">Mobile Money</th>
                    <th className="px-4 py-3.5">Legacy CDR Batch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-5 py-3.5 text-zinc-900 font-bold">
                      Real-time delivery
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-yellow-600 rounded-full" />
                        Limited
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-white text-slate-500 rounded-md font-bold border border-slate-300 inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-slate-300 rounded-full" />
                        Not applicable
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-zinc-900 font-bold">
                      Idempotent retries
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md font-bold border border-orange-400 inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-yellow-600 rounded-full" />
                        Needs review
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-gray-400 rounded-full" />
                        Not supported
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-zinc-900 font-bold">
                      Sandbox parity
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-yellow-600 rounded-full" />
                        Limited
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-zinc-900 font-bold">
                      Reconciliation evidence
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-white text-slate-500 rounded-md font-bold border border-slate-300 inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-slate-300 rounded-full" />
                        Unknown
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-emerald-500 rounded-full" />
                        Supported
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded-md font-bold inline-flex items-center gap-1.5">
                        <span className="size-1.5 bg-yellow-600 rounded-full" />
                        Limited
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTEGRATION CONTRACT */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-10">
        <div className="space-y-3 max-w-[720px]">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
            Integration Contract
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
            Exactly what a connection means
          </h2>
          <p className="text-gray-600 text-base leading-6">
            Every integration exposes the same contract anatomy. Endpoint-level
            and schema-level truth is routed to its canonical owner rather than
            duplicated here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Photo: integration-contract.png (Woman & Man on laptop) */}
          <div className="lg:col-span-5 relative min-h-[380px] rounded-2xl overflow-hidden border border-gray-200 shadow-md">
            <Image
              src="/image/integration/integration-contract.png"
              alt="Engineering team reviewing integration contract"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Contract Anatomy Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
            <div className="px-5 py-4 bg-neutral-100 border-b border-gray-200 flex items-center justify-between">
              <span className="text-zinc-900 text-sm font-bold">
                Contract anatomy — Billing &amp; Invoicing Sync
              </span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
                <span className="size-1.5 bg-emerald-500 rounded-full" />
                Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-b border-gray-200 text-xs">
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Purpose
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Keep external billing systems consistent with ZoikoNex invoice
                  and dispute state.
                </p>
              </div>
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Parties / systems
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  ZoikoNex Billing Core ⇄ operator ERP or CRM
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-b border-gray-200 text-xs">
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Data boundary
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Invoice line items only — no raw usage or payment credentials.
                </p>
              </div>
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Delivery contract
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  At-least-once, ordered per account, idempotency key required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-b border-gray-200 text-xs">
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Unknown outcome
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Timeout after commit → reconcile before repeating.
                </p>
              </div>
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Reconciliation
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Nightly checkpoint against Revenue Assurance ledger.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-xs">
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Evidence
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Hash-chained delivery + configuration events.
                </p>
              </div>
              <div className="p-5 space-y-1">
                <div className="text-slate-500 font-bold uppercase tracking-wider">
                  Limitations
                </div>
                <p className="text-zinc-900 text-sm leading-5">
                  Credit-note bulk export not yet generally available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELIABILITY & DIAGNOSTICS */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="space-y-3 max-w-[720px]">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
              <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
              Reliability &amp; Diagnostics
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
              What happens when delivery is uncertain
            </h2>
            <p className="text-gray-600 text-base leading-6">
              Execution state is explicit end to end. A timeout after commit
              becomes an unknown outcome to reconcile — never a silent retry.
            </p>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 py-4 overflow-x-auto">
            {[
              { label: "Configured", status: "done" },
              { label: "Connecting", status: "done" },
              { label: "Delivering", status: "done" },
              { label: "Unknown outcome", status: "warning" },
              { label: "Reconciling", status: "pending" },
              { label: "Replayed", status: "pending" },
              { label: "Confirmed", status: "pending" },
            ].map((step, idx) => (
              <div key={idx} className="space-y-2 relative">
                <div className="flex items-center gap-2">
                  {step.status === "done" && (
                    <div className="size-3.5 bg-emerald-500 rounded-full border-2 border-emerald-500" />
                  )}
                  {step.status === "warning" && (
                    <div className="size-4 bg-yellow-600 rounded-full ring-4 ring-amber-100 flex items-center justify-center">
                      <span className="size-1.5 bg-white rounded-full" />
                    </div>
                  )}
                  {step.status === "pending" && (
                    <div className="size-3.5 bg-white rounded-full border-2 border-slate-300" />
                  )}
                  {idx < 6 && (
                    <div
                      className={`h-0.5 flex-1 hidden lg:block ${
                        idx < 3 ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
                <div className="text-zinc-700 text-xs font-bold">
                  {step.label}
                </div>
              </div>
            ))}
          </div>

          {/* 2 Diagnostic Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
              <div className="text-zinc-900 text-sm font-bold">
                Failure contract
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Retry eligible
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Idempotency key required
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Ordering preserved
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  30s timeout
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Partial success flagged
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  DLQ after 5 attempts
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Replay from checkpoint
                </span>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
              <div className="text-zinc-900 text-sm font-bold">
                What separates from platform state
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Provider outage ≠ ZoikoNex outage
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Credential expiry → rotation flow
                </span>
                <span className="px-3 py-1.5 bg-neutral-100 rounded-md border border-gray-200 text-gray-700 font-semibold">
                  Network timeout → unknown, not failed
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Drawer Bar */}
          <div className="p-6 bg-sky-950 text-white rounded-2xl space-y-4">
            <div className="text-white text-sm font-bold">
              Diagnostic drawer — usage-stream-prod-14
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-slate-400 font-bold uppercase">
                  Last success
                </div>
                <div className="text-white font-bold mt-1">
                  Aug 20, 2026 · 06:12 UTC
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-bold uppercase">
                  Failure class
                </div>
                <div className="text-white font-bold mt-1">Unknown outcome</div>
              </div>
              <div>
                <div className="text-slate-400 font-bold uppercase">
                  Correlation ID
                </div>
                <div className="text-white font-bold font-mono mt-1">
                  evd_9f21c4a0
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-bold uppercase">
                  Retry / replay
                </div>
                <div className="text-white font-bold mt-1">
                  Eligible after reconcile
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & ACCESS */}
      <section className="relative py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-r from-teal-950/95 via-sky-950/90 to-sky-950/70 text-white overflow-hidden">
        {/* Padlock on Keyboard Background */}
        <div className="absolute inset-0 -z-10 opacity-20 mix-blend-luminosity pointer-events-none">
          <Image
            src="/image/integration/integration-security-bg.png"
            alt="Padlock on Keyboard Security"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="space-y-3 max-w-[720px]">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-4 h-[1.5px] bg-blue-300 rounded-[1px] inline-block" />
              Security &amp; Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-10">
              A visible contract, not a checklist
            </h2>
            <p className="text-slate-300 text-base leading-6">
              Least privilege, data boundaries and environment access are shown
              per integration — never assumed from region or user location.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Glass Spec Table */}
            <div className="lg:col-span-6 p-6 bg-white/5 backdrop-blur-[2px] rounded-2xl border border-white/10 divide-y divide-white/10 text-xs space-y-0">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">
                  Credential / service identity
                </span>
                <span className="text-white font-bold">
                  Scoped service account
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">Scope</span>
                <span className="text-white font-bold">
                  Invoice read/write only
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">Secret owner</span>
                <span className="text-white font-bold">
                  Operator-held, vault-issued
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">Network boundary</span>
                <span className="text-white font-bold">
                  mTLS, allow-listed egress
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">Data classification</span>
                <span className="text-white font-bold">
                  Financial — no PII fields
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-300">Jurisdiction / residency</span>
                <span className="text-white font-bold">
                  Set by tenant configuration
                </span>
              </div>
            </div>

            {/* Right 4 Access Readiness Cards */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="size-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <span className="text-white text-sm font-semibold">
                  Public reference — open, no gate
                </span>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="size-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <span className="text-white text-sm font-semibold">
                  Sandbox available — synthetic data only
                </span>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3.5">
                <div className="size-6 bg-white/10 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <span className="text-white text-sm font-semibold">
                  Staging / partner — access under review
                </span>
              </div>

              <div className="p-4 bg-red-600/10 rounded-xl border border-red-600/50 flex items-center gap-3.5">
                <div className="size-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  4
                </div>
                <span className="text-white text-sm font-semibold">
                  Production blocked — readiness checks incomplete
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SANDBOX → PRODUCTION & LEGACY MODERNIZATION */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-12">
        <div className="space-y-3 max-w-[720px]">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
            Sandbox → Production
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
            Test safely. Modernize without a rewrite
          </h2>
          <p className="text-gray-600 text-base leading-6">
            Promotion runs through explicit gates. Legacy examples show
            pattern-level support — exact compatibility stays registry- and
            evidence-dependent.
          </p>
        </div>

        {/* 4 Environment Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
            <div className="text-zinc-900 text-xs font-bold">Public docs</div>
            <div className="text-slate-500 text-xs">No access required</div>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
            <div className="text-zinc-900 text-xs font-bold">Sandbox</div>
            <div className="text-slate-500 text-xs">Synthetic test data</div>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
            <div className="text-zinc-900 text-xs font-bold">
              Staging / Partner
            </div>
            <div className="text-slate-500 text-xs">Approved test evidence</div>
          </div>

          <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
            <div className="text-zinc-900 text-xs font-bold">Production</div>
            <div className="text-slate-500 text-xs">
              Readiness gate + approval
            </div>
          </div>
        </div>

        {/* Legacy Modernization Pattern */}
        <div className="pt-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-zinc-900 text-lg font-bold">
              Legacy modernization pattern
            </h3>
            <p className="text-gray-600 text-sm leading-6">
              SFTP, Kafka, MQ, Oracle/DB2 and SOAP-to-REST adapters coexist with
              real-time charging during migration.
            </p>
          </div>

          {/* Architecture Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center pt-2">
            <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-zinc-900 text-xs font-bold">
                Existing OSS/BSS
              </div>
              <div className="text-slate-500 text-xs">
                SFTP · SOAP · Oracle/DB2
              </div>
            </div>

            <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-zinc-900 text-xs font-bold">
                Adapter layer
              </div>
              <div className="text-slate-500 text-xs">
                Transformation + mapping
              </div>
            </div>

            <div className="p-5 bg-sky-950 rounded-xl border border-sky-900 text-center space-y-1 text-white shadow-md">
              <div className="text-white text-xs font-bold">ZoikoNex</div>
              <div className="text-slate-300 text-xs">
                Rating, billing, evidence
              </div>
            </div>

            <div className="p-5 bg-stone-50 rounded-xl border border-gray-200 text-center space-y-1">
              <div className="text-zinc-900 text-xs font-bold">
                Reconciliation
              </div>
              <div className="text-slate-500 text-xs">
                Rollback-ready checkpoint
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OPERATE & EVIDENCE */}
      <section className="relative py-24 px-4 sm:px-8 lg:px-16 bg-[#08182B] text-white overflow-hidden">
        {/* Network Globe Map Background */}
        <div className="absolute inset-0 -z-10 opacity-20 mix-blend-luminosity pointer-events-none">
          <Image
            src="/image/integration/integration-operate-bg.png"
            alt="Network Nodes Topology Map"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="space-y-3 max-w-[760px]">
            <div className="inline-flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-4 h-[1.5px] bg-blue-300 rounded-[1px] inline-block" />
              Operate &amp; Evidence
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-10">
              Built for the life of the integration, not just the launch
            </h2>
            <p className="text-slate-300 text-base leading-6">
              Health, freshness, change and evidence stay first-class after
              go-live. Existing customers get support paths, not a sales funnel.
            </p>
          </div>

          {/* 4 Health Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                Configuration
              </div>
              <div className="text-white text-base font-bold flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Valid
              </div>
              <div className="text-slate-400 text-xs">Checked 4 min ago</div>
            </div>

            <div className="p-5 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                Connectivity
              </div>
              <div className="text-white text-base font-bold flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Reachable
              </div>
              <div className="text-slate-400 text-xs">Checked 4 min ago</div>
            </div>

            <div className="p-5 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                Delivery
              </div>
              <div className="text-white text-base font-bold flex items-center gap-1.5">
                <span className="text-yellow-400">⚠</span> Degraded
              </div>
              <div className="text-slate-400 text-xs">Since 06:12 UTC</div>
            </div>

            <div className="p-5 bg-white/10 rounded-xl border border-white/10 space-y-1.5">
              <div className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                Reconciliation
              </div>
              <div className="text-white text-base font-bold flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Current
              </div>
              <div className="text-slate-400 text-xs">Last run 02:00 UTC</div>
            </div>
          </div>

          {/* Change Timeline & Verification Notes */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/10 divide-y divide-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-2">
              <span className="text-slate-400 text-xs font-bold w-28 shrink-0">
                Sep 02, 2026
              </span>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  Billing Sync v2.3 → v2.4 (breaking)
                </div>
                <p className="text-slate-300 text-xs leading-5">
                  Credit-note payload adds a required reasonCode field. Required
                  action: update mapping before Sep 02. Authority: API Reference
                  changelog.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-4">
              <span className="text-slate-400 text-xs font-bold w-28 shrink-0">
                Jul 15, 2026
              </span>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  Legacy CDR Batch — evidence format change
                </div>
                <p className="text-slate-300 text-xs leading-5">
                  Reconciliation evidence now includes file-level checksums. No
                  action required for existing integrations.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4 pt-4">
              <span className="text-slate-400 text-xs font-bold w-28 shrink-0">
                Jun 01, 2026
              </span>
              <div className="space-y-1">
                <div className="text-white text-sm font-bold">
                  eSIM Profile Provisioning marked Needs review
                </div>
                <p className="text-slate-300 text-xs leading-5">
                  Verification lapsed past freshness window. Registry entry held
                  at last-known state pending re-verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER */}
      <section className="py-16 px-4 sm:px-8 max-w-[1240px] mx-auto">
        <div className="p-10 sm:p-12 bg-teal-950 text-white rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to see the contract for your integration?
            </h3>
            <p className="text-slate-300 text-sm leading-6 max-w-xl">
              Technical clarity first. Commercial conversation only once the
              compatibility, security and failure behavior make sense for your
              environment.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/request-a-demo"
              className="px-6 py-3.5 bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold rounded-lg transition-colors inline-block shadow-md cursor-pointer"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION */}
      <section className="py-16 px-4 sm:px-8 max-w-[960px] mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <span className="w-4 h-[1.5px] bg-blue-500 rounded-[1px] inline-block" />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Direct answers, no gate.
          </h2>
        </div>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <span className="text-zinc-900 text-base font-bold group-hover:text-blue-600 transition-colors">
                    {faq.q}
                  </span>
                  <span className="text-blue-500 text-xl font-bold font-mono shrink-0">
                    {isOpen ? "×" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-gray-600 text-sm leading-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
