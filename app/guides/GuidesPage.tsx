"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("migrate legacy");
  const [selectedOutcome, setSelectedOutcome] = useState("Launch");
  const [activeBuilderTab, setActiveBuilderTab] = useState("Authentication");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`curl -X POST https://api.zoikonex.example/v1/oauth/token \\
  -d client_id="YOUR_CLIENT_ID" \\
  -d client_secret="YOUR_CLIENT_SECRET" \\
  -d grant_type=client_credentials`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const OUTCOMES = [
    {
      id: "Launch",
      name: "Launch",
      desc: "Stand up a new market or brand from zero.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.08L13.33 3.75V7.75C13.33 11.08 11 13.42 8 14.42C5 13.42 2.67 11.08 2.67 7.75V3.75L8 1.08Z"
            stroke="currentColor"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "Migrate",
      name: "Migrate",
      desc: "Move off a legacy stack with a controlled cutover.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8H13M9 4L13 8L9 12"
            stroke="#2E8FE0"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "Integrate",
      name: "Integrate",
      desc: "Connect systems through the platform's APIs.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3.5H3.5C2.95 3.5 2.5 3.95 2.5 4.5V7C2.5 7.55 2.95 8 3.5 8H6C6.55 8 7 7.55 7 7V4.5C7 3.95 6.55 3.5 6 3.5Z"
            stroke="#2E8FE0"
            strokeWidth="1.33"
          />
          <path
            d="M12.5 9H10C9.45 9 9 9.45 9 10V12.5C9 13.05 9.45 13.5 10 13.5H12.5C13.05 13.5 13.5 13.05 13.5 12.5V10C13.5 9.45 13.05 9 12.5 9Z"
            stroke="#2E8FE0"
            strokeWidth="1.33"
          />
          <path d="M7 5.75H11.25V9" stroke="#2E8FE0" strokeWidth="1.33" />
        </svg>
      ),
    },
    {
      id: "Operate",
      name: "Operate",
      desc: "Run day-to-day monetization at scale.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#2E8FE0" strokeWidth="1.33" />
          <path d="M8 4.67V8L10 10" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "Govern",
      name: "Govern",
      desc: "Set policy, approvals and evidence controls.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.33L10 6H14.67L11 8.87L12.33 14L8 11L3.67 14L5 8.87L1.33 6H6L8 1.33Z"
            stroke="#2E8FE0"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "Monetize",
      name: "Monetize",
      desc: "Design tariffs, bundles and revenue models.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2.5V13.5M10.5 5H6.75C6.06 5 5.5 5.56 5.5 6.25C5.5 6.94 6.06 7.5 6.75 7.5H9.25C9.94 7.5 10.5 8.06 10.5 8.75C10.5 9.44 9.94 10 9.25 10H5.5"
            stroke="#2E8FE0"
            strokeWidth="1.33"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const BUILDER_TABS = [
    { id: "Authentication", label: "Authentication", tag: "Customer-only", role: "Developer · Integrate", isPublic: false },
    { id: "Webhooks", label: "Webhooks", tag: "Public", role: "Developer · Integrate", isPublic: true },
    { id: "Error Handling", label: "Error Handling", tag: "Public", role: "Developer · Operate", isPublic: true },
    { id: "Rate Limiting", label: "Rate Limiting", tag: "Public", role: "Developer · Operate", isPublic: true },
    { id: "Sandbox", label: "Sandbox", tag: "Public", role: "Developer · Integrate", isPublic: true },
  ];

  const FAQS = [
    {
      q: "Do I need an account to read guides?",
      a: "No. Public guides are readable without signing in or submitting a form. Some technical and enterprise guides require Customer-only or Qualified access, and that's stated on the card before you open it.",
    },
    {
      q: "How do I know a guide is still current?",
      a: "Every guide displays its verified date, release version, and change note. If platform behavior changes, guides are updated or superseded with an explicit redirect.",
    },
    {
      q: "Why do some steps link out instead of explaining everything here?",
      a: "Guides are operational runbooks. Exact API specifications, token schemas, tax tables, and legal contracts belong in their authoritative systems of record.",
    },
    {
      q: "Does completing a guide mean I'm ready for production?",
      a: "Completing a guide signifies that technical and configuration steps have been performed. Production readiness requires formal testing, security audits, and commercial sign-offs.",
    },
  ];

  return (
    <div className="w-full bg-white text-zinc-900 font-['Plus_Jakarta_Sans'] min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="pt-16 pb-16 px-4 sm:px-8 max-w-[1240px] mx-auto flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
          <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
          Guides &amp; Playbooks
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 leading-[51.52px] tracking-tight max-w-4xl">
          Practical guidance for launching,<br />
          migrating, integrating, and operating<br />
          telecom services.
        </h1>

        <p className="text-gray-500 text-base max-w-2xl pt-1 pb-4 leading-6">
          Find task-based guidance by outcome, role, domain, access level and operating context.
        </p>

        {/* Search Bar Input */}
        <div className="w-full max-w-[760px] pl-5 pr-2 py-2 bg-white rounded-2xl border border-gray-200 shadow-[0px_18px_40px_-22px_rgba(10,37,64,0.18)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, playbooks, terms..."
              className="w-full text-zinc-900 text-base font-normal bg-transparent outline-hidden"
            />
          </div>
          <button className="px-4 py-2.5 bg-sky-950 hover:bg-slate-900 text-white text-sm font-bold rounded-[10px] transition-colors cursor-pointer shrink-0">
            Search
          </button>
        </div>

        {/* Live Search Categorized Dropdown Simulation */}
        <div className="w-full max-w-[760px] p-2 bg-white rounded-2xl border border-gray-200 shadow-[0px_14px_30px_-20px_rgba(10,37,64,0.20)] text-left space-y-1 mt-1">
          {/* Category: Guides */}
          <div className="px-3 pt-2 pb-1 text-gray-400 text-xs font-bold uppercase tracking-wide">
            Guides
          </div>
          <Link
            href="/guides"
            className="px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-zinc-900 text-sm font-semibold group-hover:text-blue-600 transition-colors">
              MNO Modernization: Assess to Cut Over
            </span>
            <span className="text-gray-400 text-xs">Migrate · CTO/Architect</span>
          </Link>
          <Link
            href="/guides"
            className="px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-zinc-900 text-sm font-semibold group-hover:text-blue-600 transition-colors">
              Coexistence Patterns During Migration
            </span>
            <span className="text-gray-400 text-xs">Migrate · Developer</span>
          </Link>

          {/* Category: Glossary */}
          <div className="px-3 pt-2 pb-1 text-gray-400 text-xs font-bold uppercase tracking-wide border-t border-gray-100">
            Glossary
          </div>
          <Link
            href="/glossary"
            className="px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-zinc-900 text-sm font-semibold group-hover:text-blue-600 transition-colors">
              Legacy BSS Coexistence
            </span>
            <span className="text-gray-400 text-xs">Glossary term</span>
          </Link>

          {/* Category: Documentation */}
          <div className="px-3 pt-2 pb-1 text-gray-400 text-xs font-bold uppercase tracking-wide border-t border-gray-100">
            Documentation
          </div>
          <Link
            href="/api-reference"
            className="px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors group"
          >
            <span className="text-zinc-900 text-sm font-semibold group-hover:text-blue-600 transition-colors">
              Migration Toolkit — API Reference
            </span>
            <span className="text-gray-400 text-xs">Authoritative source ↗</span>
          </Link>
        </div>
      </section>

      {/* 2. GUIDE TRUST CONTRACT */}
      <section className="py-20 px-4 sm:px-12 lg:px-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto space-y-8">
          <div className="space-y-3 max-w-[660px]">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
              <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
              Guide Trust Contract
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
              Know it applies before you follow it.
            </h2>
            <p className="text-gray-500 text-base leading-7">
              Every guide carries the same five-part contract, so you can tell what it covers, how current it is, who owns the rule, and what access you need — before you act on it.
            </p>
          </div>

          {/* 5-Column Grid Contract Container */}
          <div className="bg-white rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 overflow-hidden shadow-xs">
            {/* 1. Applicability */}
            <div className="p-6 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#3B82F6" strokeWidth="1.4" />
                  <path d="M5.5 8L7.2 9.7L10.5 6.3" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-extrabold leading-5 pt-1">
                Applicability
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Audience, assumptions, environment, region and prerequisites — and what&apos;s out of scope.
              </p>
            </div>

            {/* 2. Currentness */}
            <div className="p-6 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#22C55E" strokeWidth="1.4" />
                  <path d="M8 5V8L10 10" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-extrabold leading-5 pt-1">
                Currentness
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Last verified date and guide version — distinct from a generic &quot;updated&quot; timestamp.
              </p>
            </div>

            {/* 3. Authority */}
            <div className="p-6 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.5L13 4V7.5C13 10.5 10.8 12.8 8 13.8C5.2 12.8 3 10.5 3 7.5V4L8 1.5Z" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-extrabold leading-5 pt-1">
                Authority
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Consequential steps link to Documentation, API Reference, policy or a human authority.
              </p>
            </div>

            {/* 4. Access */}
            <div className="p-6 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3.5" y="7.5" width="9" height="6.5" rx="1.5" stroke="#D97706" strokeWidth="1.4" />
                  <path d="M5.5 7.5V4.8C5.5 3.4 6.6 2.3 8 2.3C9.4 2.3 10.5 3.4 10.5 4.8V7.5" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-extrabold leading-5 pt-1">
                Access
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Public, Qualified, NDA, Customer-only or Unavailable — stated explicitly before you act.
              </p>
            </div>

            {/* 5. Lifecycle */}
            <div className="p-6 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 11.5L8 14L12.5 11.5M3.5 8L8 10.5L12.5 8M8 2L3.5 4.5L8 7L12.5 4.5L8 2Z" stroke="#EA580C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-extrabold leading-5 pt-1">
                Lifecycle
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Superseded or withdrawn content routes you to its successor or authoritative fallback.
              </p>
            </div>
          </div>

          {/* Pill navigation chain */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3.5 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
              Applicability
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-3.5 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
              Currentness
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-3.5 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
              Authority
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-3.5 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
              Access
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="px-3.5 py-1.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
              Lifecycle
            </span>
          </div>
        </div>
      </section>

      {/* 3. CHOOSE YOUR OUTCOME (3x2 Grid Matching Screenshot) */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
              <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
              Choose Your Outcome
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
              Start from the job you&apos;re doing,<br />
              not our taxonomy.
            </h2>
            <p className="text-gray-500 text-base leading-7">
              Pick an outcome, then narrow by role. Both selections filter the governed library below — in place, with a URL you can share.
            </p>
          </div>

          {/* Right Image: guide-diagram.png (Man in glasses on laptop taking notes) */}
          <div className="lg:col-span-6 relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
            <Image
              src="/image/guides/guide-diagram.png"
              alt="Start from the job you are doing"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 6 Outcome Tiles in a 3-column, 2-row Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OUTCOMES.map((outcome) => {
            const isSelected = selectedOutcome === outcome.id;
            return (
              <div
                key={outcome.id}
                onClick={() => setSelectedOutcome(outcome.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-sky-950 border-sky-950 text-white shadow-lg shadow-sky-950/20"
                    : "bg-stone-50 border-gray-200 hover:bg-stone-100 text-zinc-900"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-white/10 text-white" : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {outcome.icon}
                </div>
                <div className="text-base font-extrabold leading-5 pt-1">
                  {outcome.name}
                </div>
                <p className={`text-xs leading-5 ${isSelected ? "text-slate-400" : "text-gray-500"}`}>
                  {outcome.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED & CURRENT GUIDES */}
      <section className="py-20 px-4 sm:px-12 lg:px-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="space-y-3 max-w-[760px]">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
              <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
              Featured &amp; Current Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
              Evidence-backed, not editorially guessed
            </h2>
            <p className="text-gray-500 text-base leading-7">
              Featured cards surface only when a current, approved guide exists behind them — the same registry that powers the full library.
            </p>
          </div>

          {/* Top 3 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">Guide</span>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-500" />
                    Public
                  </span>
                </div>
                <h3 className="text-zinc-900 text-base font-extrabold leading-6">
                  MVNO Launch Readiness Guide
                </h3>
                <p className="text-gray-500 text-sm leading-5">
                  A structured path from evaluation to go-live for new MVNO brands, covering scope, configuration, and validation.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Launch
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Founder / Executive
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" /> Verified Aug 12, 2026
                </span>
                <Link href="/guides" className="text-blue-500 text-sm font-bold hover:underline">
                  Open guide →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">Playbook</span>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold inline-flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-green-500" />
                    Public
                  </span>
                </div>
                <h3 className="text-zinc-900 text-base font-extrabold leading-6">
                  5G Monetization Framework
                </h3>
                <p className="text-gray-500 text-sm leading-5">
                  How to model tariffs, network slicing offers, and QoS-linked charging for 5G-native products.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Monetize
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Commercial
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" /> Verified Jul 30, 2026
                </span>
                <Link href="/guides" className="text-blue-500 text-sm font-bold hover:underline">
                  Open guide →
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">Quickstart</span>
                  <span className="px-2.5 py-1 bg-blue-500/10 text-sky-600 rounded-full text-xs font-bold">
                    Customer-only
                  </span>
                </div>
                <h3 className="text-zinc-900 text-base font-extrabold leading-6">
                  Authentication for Production Access
                </h3>
                <p className="text-gray-500 text-sm leading-5">
                  Set up OAuth credentials, rotate keys, and validate your first authenticated request safely.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Integrate
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                    Developer
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" /> Verified Aug 5, 2026
                </span>
                <Link href="/guides" className="text-blue-500 text-sm font-bold hover:underline">
                  Request access →
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Sidebar & Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            {/* Left Filter Sidebar (w-64) */}
            <div className="lg:col-span-4 p-5 bg-gray-100 rounded-2xl border border-gray-200 space-y-5 text-xs">
              <div className="space-y-2">
                <div className="text-gray-400 font-bold uppercase tracking-wide">
                  Search within results
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter guides…"
                    className="w-full text-zinc-900 bg-transparent outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Outcome Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="text-gray-400 font-bold uppercase tracking-wide">
                  Outcome
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" defaultChecked className="rounded accent-sky-950" />
                    Launch
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    Migrate
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    Integrate
                  </label>
                </div>
              </div>

              {/* Access Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="text-gray-400 font-bold uppercase tracking-wide">
                  Access
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" defaultChecked className="rounded accent-sky-950" />
                    Public
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    Customer-only
                  </label>
                </div>
              </div>

              {/* Format Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="text-gray-400 font-bold uppercase tracking-wide">
                  Format
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    HTML
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    Interactive
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                    <input type="checkbox" className="rounded accent-sky-950" />
                    PDF
                  </label>
                </div>
              </div>

              {/* Currentness Filter */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <div className="text-gray-400 font-bold uppercase tracking-wide">
                  Currentness
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 text-sm">
                  <input type="checkbox" className="rounded accent-sky-950" />
                  Verified last 90 days
                </label>
              </div>
            </div>

            {/* Right Results Grid */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm font-semibold">14 guides match your filters</span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                  Sorted by relevance
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Result 1 */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-bold uppercase">Guide</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Public
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-5">
                      MVNE &amp; Multi-Brand Onboarding
                    </div>
                    <p className="text-gray-500 text-sm leading-5">
                      Configure wholesale overlays and partner structures inside one tenant.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> Verified Aug 2
                    </span>
                    <Link href="/guides" className="text-blue-500 font-bold hover:underline">
                      Open →
                    </Link>
                  </div>
                </div>

                {/* Result 2 */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-bold uppercase">Guide</span>
                      <span className="px-2 py-0.5 bg-yellow-600/10 text-yellow-600 rounded-full text-xs font-bold">
                        Qualified
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-5">
                      MNO Modernization: Coexistence Design
                    </div>
                    <p className="text-gray-500 text-sm leading-5">
                      Run legacy and ZoikoNex billing in parallel during cutover.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> Verified Jul 18
                    </span>
                    <Link href="/guides" className="text-blue-500 font-bold hover:underline">
                      Request access →
                    </Link>
                  </div>
                </div>

                {/* Result 3 */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-bold uppercase">Playbook</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Public
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-5">
                      eSIM Fleet Provisioning at Scale
                    </div>
                    <p className="text-gray-500 text-sm leading-5">
                      GSMA-aligned profile management for device-fleet rollouts.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> Verified Jun 29
                    </span>
                    <Link href="/guides" className="text-blue-500 font-bold hover:underline">
                      Open →
                    </Link>
                  </div>
                </div>

                {/* Result 4 */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs font-bold uppercase">Guide</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                        Review due
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-5">
                      Revenue Assurance Baseline Setup
                    </div>
                    <p className="text-gray-500 text-sm leading-5">
                      Establish leakage-detection rules before go-live.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> Verified Mar 4
                    </span>
                    <Link href="/guides" className="text-blue-500 font-bold hover:underline">
                      Open →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Tip Banner */}
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/40 flex items-start gap-2.5 text-xs text-sky-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                  <circle cx="8" cy="8" r="6" stroke="#2563EB" strokeWidth="1.33" />
                  <path d="M8 7.5V11M8 5V5.5" stroke="#2563EB" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
                <span>
                  Selecting a card opens an applicability drawer with assumptions, access, verified date and authority — before any step begins.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BUILDER GUIDES */}
      <section className="py-20 px-4 sm:px-12 lg:px-24 bg-sky-950 text-white">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="space-y-3 max-w-[660px]">
            <div className="inline-flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wide">
              <span className="w-3.5 h-0.5 bg-sky-300 rounded-[1px] inline-block" />
              Builder Guides
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-10">
              A technical lane, not a duplicate of API Reference.
            </h2>
            <p className="text-slate-400 text-base leading-7">
              Concepts, setup sequence and validation live here. Exact scopes, endpoints, schemas and limits always resolve to current API and security authority.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Builder Tabs */}
            <div className="lg:col-span-4 space-y-3">
              {BUILDER_TABS.map((tab) => {
                const isActive = activeBuilderTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    onClick={() => setActiveBuilderTab(tab.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isActive
                        ? "bg-white/10 border-white/20 shadow-sm"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-bold leading-6">
                        {tab.label}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          tab.isPublic
                            ? "bg-green-500/10 text-green-500 inline-flex items-center gap-1"
                            : "bg-blue-500/10 text-sky-400"
                        }`}
                      >
                        {tab.isPublic && <Check className="w-2.5 h-2.5 text-green-500" />}
                        {tab.tag}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">{tab.role}</div>
                  </div>
                );
              })}
            </div>

            {/* Right Interactive Code Viewer */}
            <div className="lg:col-span-8 p-6 bg-slate-900 rounded-2xl border border-white/10 space-y-4 shadow-2xl">
              <div className="pb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-white text-lg font-extrabold">
                    Authentication — setup &amp; validation
                  </h3>
                  <div className="text-slate-400 text-xs">
                    Concept walkthrough · not a substitute for API Reference
                  </div>
                </div>
                <Link
                  href="/api-reference"
                  className="px-3.5 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs font-semibold hover:bg-blue-500/20 transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
                  API Reference — Auth ↗
                </Link>
              </div>

              <p className="text-slate-400 text-sm leading-6">
                Guides describe the setup sequence and how to validate a working credential. Exact scopes, token lifetimes and signature formats are owned by the API Reference — this guide links out rather than restating them.
              </p>

              {/* Code Snippet Box */}
              <div className="p-4 bg-gray-900 rounded-xl border border-white/10 space-y-2.5 font-['JetBrains_Mono'] text-xs">
                <div className="flex items-center justify-between text-slate-400 text-xs uppercase font-sans">
                  <span>bash</span>
                  <button
                    onClick={handleCopy}
                    className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "COPIED" : "COPY"}</span>
                  </button>
                </div>
                <div className="text-slate-400 leading-relaxed font-mono">
                  <span className="text-slate-500"># placeholder credentials only — never real secrets</span><br />
                  <span className="text-blue-200">curl -X POST https://api.zoikonex.example/v1/oauth/token \</span><br />
                  <span className="text-blue-200">&nbsp;&nbsp;-d client_id=</span><span className="text-green-300">&quot;YOUR_CLIENT_ID&quot;</span><span className="text-blue-200"> \</span><br />
                  <span className="text-blue-200">&nbsp;&nbsp;-d client_secret=</span><span className="text-green-300">&quot;YOUR_CLIENT_SECRET&quot;</span><span className="text-blue-200"> \</span><br />
                  <span className="text-blue-200">&nbsp;&nbsp;-d grant_type=</span><span className="text-sky-300">client_credentials</span>
                </div>
              </div>

              {/* Green Checkpoint Banner */}
              <div className="p-3 bg-green-500/20 rounded-lg text-green-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-green-300 shrink-0" />
                <span>Checkpoint: confirm the response returns a scoped, time-limited token before continuing.</span>
              </div>

              {/* Orange Warning Banner */}
              <div className="p-3 bg-yellow-600/10 rounded-lg border border-yellow-600/30 text-orange-300 text-xs flex items-center gap-2">
                <Image src="/image/guides/icon-alert-triangle.svg" alt="Alert" width={16} height={16} className="shrink-0" />
                <span>A recent release changed token expiry behavior — this guide was re-verified against it on Aug 14, 2026.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GUIDE READER — A runbook, not a long article */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-10">
        <div className="space-y-3 max-w-[660px]">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
            <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
            Guide Reader
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
            A runbook, not a long article
          </h2>
          <p className="text-gray-500 text-base leading-7">
            Every consequential step sits behind a clear applicability preflight, with checkpoints and authority links along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Reader Runbook Card */}
          <div className="lg:col-span-9 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-6">
            {/* Header */}
            <div className="pb-5 border-b border-gray-200 space-y-2">
              <h3 className="text-zinc-900 text-xl font-extrabold">
                MNO Modernization: Assess to Cut Over
              </h3>
              <p className="text-gray-500 text-sm">
                A controlled path for replacing legacy monetization systems without disrupting live traffic.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                  Migrate
                </span>
                <span className="px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 text-gray-500 text-xs font-bold">
                  CTO / Architect
                </span>
                <span className="px-2.5 py-1 bg-yellow-600/10 text-yellow-600 rounded-full text-xs font-bold">
                  Qualified
                </span>
                <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  Verified Aug 12 · v3.2
                </span>
              </div>
            </div>

            {/* Applicability Preflight Box */}
            <div className="p-5 bg-gray-100 rounded-xl border border-gray-200 space-y-3">
              <div className="text-zinc-900 text-sm font-bold">Applicability preflight</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-400 font-bold uppercase">Applies to</div>
                  <div className="text-zinc-900 text-sm font-normal mt-0.5">Live MNOs replacing legacy BSS/OSS</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase">Prerequisites</div>
                  <div className="text-zinc-900 text-sm font-normal mt-0.5">Current-state audit completed</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase">Environment</div>
                  <div className="text-zinc-900 text-sm font-normal mt-0.5">Dedicated Cloud or Sovereign</div>
                </div>
                <div>
                  <div className="text-gray-400 font-bold uppercase">Authority</div>
                  <div className="text-zinc-900 text-sm font-normal mt-0.5">Migration Toolkit — Documentation ↗</div>
                </div>
              </div>
            </div>

            {/* Step 01 */}
            <div className="pt-4 border-t border-gray-200 flex items-start gap-4">
              <div className="w-7 h-7 bg-sky-950 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0">
                01
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-zinc-900 text-base font-bold">Assess the current-state estate</h4>
                <p className="text-gray-500 text-sm leading-5">
                  Inventory existing billing, tax and payment integrations, and record known constraints before any configuration begins.
                </p>
                <div className="p-2.5 bg-green-500/10 rounded-lg text-green-600 text-xs font-semibold flex items-center gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Checkpoint: estate inventory signed off by architecture owner.
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="pt-4 border-t border-gray-200 flex items-start gap-4">
              <div className="w-7 h-7 bg-sky-950 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0">
                02
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-zinc-900 text-base font-bold">Map dependencies and coexistence rules</h4>
                <p className="text-gray-500 text-sm leading-5">
                  Identify systems that must run in parallel during migration and define the reconciliation approach between them.
                </p>
                <div className="p-2.5 bg-orange-600/10 rounded-lg text-orange-600 text-xs font-semibold flex items-center gap-1.5 mt-2">
                  <Image src="/image/guides/icon-alert-triangle.svg" alt="Warning" width={14} height={14} />
                  Production-sensitive: misaligned coexistence rules can cause duplicate billing events.
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="pt-4 border-t border-gray-200 flex items-start gap-4">
              <div className="w-7 h-7 bg-sky-950 text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0">
                03
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="text-zinc-900 text-base font-bold">Validate in a non-production tenant</h4>
                <p className="text-gray-500 text-sm leading-5">
                  Run end-to-end flows against representative traffic before scheduling cutover.
                </p>
                <div className="p-2.5 bg-green-500/10 rounded-lg text-green-600 text-xs font-semibold flex items-center gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Checkpoint: reconciliation variance under agreed threshold.
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar ("On this page") */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div className="text-gray-400 font-bold uppercase tracking-wide pb-1">
              On this page
            </div>
            <div className="space-y-1 border-l-2 border-gray-200 pl-3">
              <div className="text-sky-950 font-bold -ml-[13px] pl-2.5 border-l-2 border-blue-500 py-1">
                Applicability preflight
              </div>
              <div className="text-gray-500 py-1">01 · Assess estate</div>
              <div className="text-gray-500 py-1">02 · Map dependencies</div>
              <div className="text-gray-500 py-1">03 · Validate</div>
              <div className="text-gray-500 py-1">Related guides</div>
              <div className="text-gray-500 py-1">Continue with authority</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COLLECTIONS & JOURNEYS */}
      <section className="py-20 px-4 sm:px-12 lg:px-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="space-y-3 max-w-[760px]">
            <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
              <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
              Collections &amp; Journeys
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
              Sequences of guides, not a universal plan
            </h2>
            <p className="text-gray-500 text-base leading-7">
              A collection strings registered guides into a lifecycle order. Completion reflects progress through the guides — never production, security or compliance approval.
            </p>
          </div>

          {/* Journey Steps Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 py-4 overflow-x-auto">
            {[
              { num: "Assess", sub: "Current-state review", active: false },
              { num: "Map Dependencies", sub: "Coexistence design", active: true },
              { num: "Coexist", sub: "Run in parallel", active: false },
              { num: "Migrate", sub: "Move traffic", active: false },
              { num: "Reconcile", sub: "Validate parity", active: false },
              { num: "Cut Over", sub: "Go live", active: false },
              { num: "Decommission", sub: "Retire legacy", active: false },
            ].map((step, i) => (
              <div key={i} className="space-y-1 relative">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-xs border-2 ${
                      step.active ? "bg-blue-500 border-blue-500" : "bg-gray-300 border-gray-300"
                    }`}
                  />
                  {i < 6 && <div className="h-0.5 flex-1 bg-gray-300 hidden lg:block" />}
                </div>
                <div className="text-zinc-900 text-sm font-bold">{step.num}</div>
                <div className="text-zinc-500 text-xs">{step.sub}</div>
              </div>
            ))}
          </div>

          {/* Stage Details Split: Left cards + Right photo `guide-hero.png` */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Stage Container */}
            <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">
                Guides in this stage — Map Dependencies
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 rounded-2xl border border-gray-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-xs font-bold uppercase">Guide</span>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Public
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-6">
                      Coexistence Patterns During Migration
                    </div>
                    <p className="text-gray-500 text-xs leading-5">
                      Common parallel-run architectures and their reconciliation trade-offs.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-gray-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 text-xs font-bold uppercase">Playbook</span>
                      <span className="px-2 py-0.5 bg-yellow-600/10 text-yellow-600 rounded-full text-xs font-bold">
                        Qualified
                      </span>
                    </div>
                    <div className="text-zinc-900 text-base font-extrabold leading-6">
                      Dependency Mapping Template
                    </div>
                    <p className="text-gray-500 text-xs leading-5">
                      A structured worksheet for cataloguing integration dependencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Photo: guide-hero.png (Team on floor around architecture chart) */}
            <div className="lg:col-span-6 relative min-h-[260px] rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <Image
                src="/image/guides/guide-hero.png"
                alt="Guides in this stage"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom "How this guide is governed" Box */}
          <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200 space-y-4">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wide">
              How this guide is governed
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 text-sm divide-y sm:divide-y-0 lg:divide-x divide-gray-200">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs font-semibold">Version</div>
                <div className="text-zinc-900 font-semibold">3.2</div>
              </div>
              <div className="space-y-1 lg:pl-4">
                <div className="text-gray-400 text-xs font-semibold">Last verified</div>
                <div className="text-zinc-900 font-semibold">Aug 12, 2026</div>
              </div>
              <div className="space-y-1 lg:pl-4">
                <div className="text-gray-400 text-xs font-semibold">Authority</div>
                <div className="text-zinc-900 font-semibold">Migration Toolkit — Documentation ↗</div>
              </div>
              <div className="space-y-1 lg:pl-4">
                <div className="text-gray-400 text-xs font-semibold">Lifecycle state</div>
                <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold inline-block">
                  Published
                </span>
              </div>
              <div className="space-y-1 lg:pl-4">
                <div className="text-gray-400 text-xs font-semibold">Change note</div>
                <div className="text-zinc-900 text-xs leading-5">Updated coexistence checkpoint after Aug release</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONTINUE WITH THE AUTHORITY (2 Rows: 4 on top, 3 on bottom) */}
      <section className="py-20 px-4 sm:px-8 max-w-[1240px] mx-auto space-y-10">
        <div className="space-y-3 max-w-[660px]">
          <div className="inline-flex items-center gap-2 text-blue-500 text-xs font-bold uppercase tracking-wide">
            <span className="w-3.5 h-0.5 bg-blue-500 rounded-[1px] inline-block" />
            Continue With the Authority
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 leading-10">
            The next truth lives somewhere specific
          </h2>
          <p className="text-gray-500 text-base leading-7">
            Guides hand off deliberately instead of duplicating what another source already owns.
          </p>
        </div>

        {/* 7 Authority Cards: 4 on top row, 3 on bottom row */}
        <div className="space-y-5">
          {/* Row 1 (4 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/guides"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 2.5H10L13.5 6V13.5H3.5V2.5Z" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 2.5V6H13.5" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 9H10M6 11H9" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Documentation
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Authoritative product and implementation detail beyond guide scope.
              </p>
            </Link>

            <Link
              href="/api-reference"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 4H13.5M2.5 8H13.5M2.5 12H13.5" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" />
                  <circle cx="5.5" cy="4" r="1.5" fill="white" stroke="#2E8FE0" strokeWidth="1.33" />
                  <circle cx="10.5" cy="8" r="1.5" fill="white" stroke="#2E8FE0" strokeWidth="1.33" />
                  <circle cx="6.5" cy="12" r="1.5" fill="white" stroke="#2E8FE0" strokeWidth="1.33" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                API Reference
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Endpoint, schema, auth and rate-limit truth.
              </p>
            </Link>

            <Link
              href="/developer-portal"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2.5" y="3" width="11" height="10" rx="1.5" stroke="#2E8FE0" strokeWidth="1.33" />
                  <path d="M5 6.5L7.5 8.5L5 10.5M8.5 10.5H11" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Developer Portal
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Sandbox, SDKs and your builder environment.
              </p>
            </Link>

            <Link
              href="/webinars"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#2E8FE0" strokeWidth="1.33" />
                  <path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="#2E8FE0" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Webinars
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Live and recorded explanatory sessions.
              </p>
            </Link>
          </div>

          {/* Row 2 (3 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Link
              href="/glossary"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#2E8FE0" strokeWidth="1.33" />
                  <path d="M2.5 8H13.5M8 2.5C9.5 4.5 10.3 6.2 10.3 8C10.3 9.8 9.5 11.5 8 13.5M8 2.5C6.5 4.5 5.7 6.2 5.7 8C5.7 9.8 6.5 11.5 8 13.5" stroke="#2E8FE0" strokeWidth="1.33" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Glossary
              </div>
              <p className="text-gray-500 text-xs leading-5">
                Precise telecom and ZoikoNex definitions.
              </p>
            </Link>

            <Link
              href="/changelog"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#2E8FE0" strokeWidth="1.33" />
                  <path d="M8 5V8L10 10" stroke="#2E8FE0" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Release Notes
              </div>
              <p className="text-gray-500 text-xs leading-5">
                What changed, when, and why it matters.
              </p>
            </Link>

            <Link
              href="/resources"
              className="p-5 bg-stone-50 rounded-xl border border-gray-200 hover:border-blue-500/50 hover:bg-stone-100 transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.33L10 6H14.67L11 8.87L12.33 14L8 11L3.67 14L5 8.87L1.33 6H6L8 1.33Z"
                    stroke="#2E8FE0"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-zinc-900 text-sm font-bold group-hover:text-blue-600 transition-colors pt-1">
                Resources
              </div>
              <p className="text-gray-500 text-xs leading-5">
                White papers, case studies and research.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CTA & FAQ SECTION (Exact Match with Deep Navy Background and Clean Layout) */}
      <section className="py-24 px-4 sm:px-12 lg:px-24 bg-[#08182B] text-white">
        <div className="max-w-[880px] mx-auto space-y-20 flex flex-col items-center">
          {/* Top White CTA Card */}
          <div className="w-full bg-white rounded-3xl p-10 sm:p-12 text-center space-y-3.5 shadow-2xl">
            <div className="text-blue-500 text-xs font-bold uppercase tracking-widest">
              — CONTINUE
            </div>
            <h3 className="text-zinc-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to move past the guide?
            </h3>
            <p className="text-gray-500 text-sm sm:text-base leading-6 max-w-lg mx-auto">
              If you&apos;ve reached a genuine technical or commercial decision point,<br className="hidden sm:inline" />
              continue from here — nothing above required a form.
            </p>
            <div className="pt-2">
              <Link
                href="/contact-us"
                className="px-6 py-3 bg-[#2E8FE0] hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors inline-block shadow-md cursor-pointer"
              >
                Talk to a Solutions Architect
              </Link>
            </div>
          </div>

          {/* Bottom FAQ Section */}
          <div className="w-full space-y-8">
            <div className="text-center space-y-2">
              <div className="text-sky-400 text-xs font-bold uppercase tracking-widest">
                — FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Direct answers, no digging.
              </h2>
            </div>

            <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <span className="text-white text-sm sm:text-base font-bold group-hover:text-sky-300 transition-colors">
                        {faq.q}
                      </span>
                      <span className="text-sky-400 text-base font-bold font-mono shrink-0">
                        {isOpen ? "×" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
