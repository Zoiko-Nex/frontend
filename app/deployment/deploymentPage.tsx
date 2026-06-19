"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ChevronRight,
  Layers,
  Settings,
  Shield,
  Info,
  Server,
  Cloud
} from "lucide-react";

// Types for Fit Engine
type SovereigntyOption = "no" | "eu_us" | "strict";
type ComplianceOption = "standard" | "custom_keys" | "airgapped";
type LegacyOption = "cloud_native" | "hybrid_bridge";

interface FitAnswers {
  sovereignty: SovereigntyOption;
  compliance: ComplianceOption;
  legacy: LegacyOption;
}

export default function DeploymentPage() {
  // Navigation active tab for the Hero Timeline
  const [activeHeroTab, setActiveHeroTab] = useState<string>("SaaS");

  // Fit Engine constraint finder state
  const [engineMode, setEngineMode] = useState<"finder" | "revenue">("finder");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<FitAnswers>({
    sovereignty: "no",
    compliance: "standard",
    legacy: "cloud_native",
  });

  // Revenue-based calculator state
  const [subscriberCount, setSubscriberCount] = useState<string>("under_100k");
  const [isCriticalLegacy, setIsCriticalLegacy] = useState<boolean>(false);

  const handleOptionChange = (key: keyof FitAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const calculateRecommendation = () => {
    if (engineMode === "finder") {
      if (answers.sovereignty === "strict" || answers.compliance === "airgapped") {
        return {
          title: "Sovereign Deployment",
          desc: "Based on your strict data sovereignty and air-gapped security compliance requirements, we recommend a Sovereign deployment on your local private infrastructure.",
          badge: "Maximum Autonomy",
          color: "border-lime-500 text-lime-400",
          link: "#sovereign"
        };
      }
      if (answers.legacy === "hybrid_bridge") {
        return {
          title: "Hybrid Mesh",
          desc: "Since you need to bridge legacy billing systems with modern cloud infrastructure, the Hybrid Mesh deployment model will ensure smooth co-existence and phased migration.",
          badge: "Coexistence",
          color: "border-sky-500 text-sky-400",
          link: "#hybrid"
        };
      }
      if (answers.sovereignty === "eu_us" || answers.compliance === "custom_keys") {
        return {
          title: "Dedicated Cloud",
          desc: "A Dedicated Cloud instance provides isolation and dedicated database instances under your control, ideal for regional regulatory compliance (US/EU) without managing underlying hardware.",
          badge: "Enterprise Isolation",
          color: "border-teal-500 text-teal-400",
          link: "#dedicated"
        };
      }
      return {
        title: "Shared SaaS",
        desc: "A fully managed multi-tenant environment. This offers the fastest speed-to-market and lowest operational overhead for cloud-native setups.",
        badge: "Fastest Launch",
        color: "border-blue-500 text-blue-400",
        link: "/sharedsaas"
      };
    } else {
      if (subscriberCount === "over_5m" || isCriticalLegacy) {
        return {
          title: "Sovereign / Hybrid Mesh",
          desc: "For operators with over 5M subscribers or mission-critical legacy integrations, we recommend a Hybrid Mesh or air-gapped Sovereign architecture to protect core transactions and preserve legacy investments.",
          badge: "Enterprise / Carrier Grade",
          color: "border-lime-500 text-lime-400",
          link: "/hybrid"
        };
      }
      if (subscriberCount === "1m_5m") {
        return {
          title: "Dedicated Cloud",
          desc: "For mid-to-large tier operators, Dedicated Cloud ensures performance guarantees, isolated databases, and customized maintenance windows suitable for 1M+ subscribers.",
          badge: "Enterprise Performance",
          color: "border-teal-500 text-teal-400",
          link: "#dedicated"
        };
      }
      return {
        title: "Shared SaaS",
        desc: "Perfect for new market entrants and MVNOs with under 1M subscribers looking for a pay-as-you-grow pricing model and rapid deployment.",
        badge: "Highly Efficient",
        color: "border-blue-500 text-blue-400",
        link: "/sharedsaas"
      };
    }
  };

  const recommendation = calculateRecommendation();

  const resetFinder = () => {
    setAnswers({
      sovereignty: "no",
      compliance: "standard",
      legacy: "cloud_native",
    });
    setCurrentStep(0);
  };

  return (
    <div className="bg-[#111625] min-h-screen text-slate-100 selection:bg-sky-500 selection:text-white font-sans overflow-x-hidden">

      {/* SECTION 1: HERO SECTION */}
      <section className="relative pt-24 pb-28 overflow-hidden bg-[#111625]">
        {/* Glow Effects */}
        <div className="absolute right-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute left-[-150px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-lime-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex justify-center items-start mb-6">
            <div className="text-center text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">DEPLOYMENT ARCHITECTURE</div>
          </div>

          <div className="max-w-[896px] flex flex-col items-center">
            <h1 className="text-center text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Deploy ZoikoNex the Way Your<br />Operator Requires
            </h1>
          </div>

          <div className="max-w-[672px] pt-6 pb-2 flex flex-col items-center">
            <p className="text-center text-slate-300 text-base md:text-lg font-normal leading-relaxed">
              Unified monetization logic across every infrastructure footprint. From rapid<br className="hidden md:block" />
              SaaS activation to air-gapped sovereign control, ZoikoNex provides sovereign<br className="hidden md:block" />
              control for global infrastructure.
            </p>
          </div>

          <div className="w-full max-w-[896px] pt-16 flex flex-col items-start gap-4 overflow-x-auto pb-6 custom-scrollbar">
            <div className="w-[800px] md:w-full flex flex-col gap-4">
              <div className="w-full flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <div className="text-center text-white/60 text-xs font-bold font-mono tracking-[2px] uppercase">FASTEST LAUNCH</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-center text-white/60 text-xs font-bold font-mono tracking-[2px] uppercase">MAXIMUM CONTROL</div>
                </div>
              </div>

              <div className="w-full h-2 relative bg-gradient-to-r from-[#89D050] via-teal-400 to-sky-600 rounded-xl my-2">
                <div className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-[#111625]"></div>
                <div className="w-4 h-4 absolute left-[33.33%] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-[#111625]"></div>
                <div className="w-4 h-4 absolute left-[66.66%] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-[#111625]"></div>
                <div className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full border-4 border-[#111625]"></div>
              </div>

              <div className="w-full relative h-16 pt-4 text-left">
                <div className="absolute left-0 top-4 flex flex-col items-start">
                  <div className="text-white text-sm md:text-base font-bold leading-6">Shared SaaS</div>
                  <div className="text-white/40 text-xs font-normal leading-4">Days to Live</div>
                </div>
                <div className="absolute left-[33.33%] top-4 flex flex-col items-start">
                  <div className="text-white text-sm md:text-base font-bold leading-6">Dedicated Cloud</div>
                  <div className="text-white/40 text-xs font-normal leading-4">Weeks to Live</div>
                </div>
                <div className="absolute left-[66.66%] top-4 flex flex-col items-start">
                  <div className="text-white text-sm md:text-base font-bold leading-6">Hybrid Mesh</div>
                  <div className="text-white/40 text-xs font-normal leading-4">Custom Phasing</div>
                </div>
                <div className="absolute right-0 top-4 flex flex-col items-end text-right">
                  <div className="text-white text-sm md:text-base font-bold leading-6">Sovereign</div>
                  <div className="text-white/40 text-xs font-normal leading-4">Full Autonomy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DEPLOYMENT FIT ENGINE (LIGHT BACKGROUND) */}
      <section className="py-24 bg-[#F8FAFC] text-slate-900 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Heading, description, toggles */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-4xl font-semibold text-zinc-900 leading-[48px] tracking-tight">
                  Deployment Fit Engine
                </h2>
                <p className="mt-6 text-slate-600 text-lg font-normal leading-7">
                  Identify the optimal deployment model for your commercial and<br className="hidden lg:block" />
                  regulatory requirements. Our engine analyzes residency, control,<br className="hidden lg:block" />
                  and scale needs to recommend your architectural path.
                </p>
              </div>

              <div className="space-y-4 pt-2.5">
                <button
                  onClick={() => {
                    setEngineMode("finder");
                    resetFinder();
                  }}
                  className={`w-full text-left px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] transition-all duration-300 ${engineMode === "finder"
                    ? "bg-stone-200 outline-stone-300/30 text-zinc-900"
                    : "bg-stone-100 outline-stone-300/10 text-zinc-900 hover:bg-stone-200"
                    }`}
                >
                  <span className="text-base font-normal leading-6">Guaranteed Compliance Routing</span>
                </button>

                <button
                  onClick={() => setEngineMode("revenue")}
                  className={`w-full text-left px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] transition-all duration-300 ${engineMode === "revenue"
                    ? "bg-stone-200 outline-stone-300/30 text-zinc-900"
                    : "bg-stone-100 outline-stone-300/10 text-zinc-900 hover:bg-stone-200"
                    }`}
                >
                  <span className="text-base font-normal leading-6">Optimized Speed-to-Revenue</span>
                </button>
              </div>
            </div>

            {/* Right Column: Question Card Panel (DARK BACKGROUND CARD) */}
            <div className="lg:col-span-7">
              <div className="bg-gray-800 rounded-lg p-8 shadow-2xl relative overflow-hidden flex flex-col items-start gap-8">

                {engineMode === "finder" ? (
                  // Constraint Finder Steps
                  <div className="w-full space-y-8">
                    {/* Header with step count */}
                    <div className="flex flex-col items-start gap-2 relative">
                      <h3 className="text-2xl font-semibold text-white leading-8">Data Sovereignty</h3>
                      <p className="text-white/60 text-base font-normal leading-6">
                        Does your jurisdiction require transaction data to remain within<br className="hidden lg:block" />
                        physical national borders?
                      </p>
                      <div className="absolute top-0 right-0">
                        <span className="text-white/20 text-xs font-semibold font-mono leading-3 tracking-wider">QUESTION 01/06</span>
                      </div>
                    </div>

                    {currentStep === 0 && (
                      <div className="w-full space-y-4 animate-fadeIn">

                        <button
                          onClick={() => handleOptionChange("sovereignty", "strict")}
                          className={`w-full text-left p-6 rounded-sm outline outline-1 outline-offset-[-1px] transition ${answers.sovereignty === "strict"
                            ? "bg-white/10 outline-white/40 text-white"
                            : "bg-transparent outline-white/20 text-white hover:bg-white/5"
                            }`}
                        >
                          <span className="text-base font-normal leading-6">Strict Residency Required (On-Prem/National Cloud)</span>
                        </button>

                        <button
                          onClick={() => handleOptionChange("sovereignty", "eu_us")}
                          className={`w-full text-left p-6 rounded-sm outline outline-1 outline-offset-[-1px] transition ${answers.sovereignty === "eu_us"
                            ? "bg-white/10 outline-white/40 text-white"
                            : "bg-transparent outline-white/20 text-white hover:bg-white/5"
                            }`}
                        >
                          <span className="text-base font-normal leading-6">Regional Sovereignty (Shared Cluster per Continent)</span>
                        </button>

                        <button
                          onClick={() => handleOptionChange("sovereignty", "no")}
                          className={`w-full text-left p-6 rounded-sm outline outline-1 outline-offset-[-1px] transition ${answers.sovereignty === "no"
                            ? "bg-white/10 outline-white/40 text-white"
                            : "bg-transparent outline-white/20 text-white hover:bg-white/5"
                            }`}
                        >
                          <span className="text-base font-normal leading-6">Global SaaS (Fastest Global Deployment)</span>
                        </button>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-1">
                          <span className="text-[#89D050] text-[10px] font-bold uppercase tracking-[2px] block">
                            Compliance
                          </span>
                          <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                            What compliance tier does your regulatory environment mandate?
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#1E2538]/40 cursor-pointer transition">
                            <input
                              type="radio"
                              name="compliance"
                              value="standard"
                              checked={answers.compliance === "standard"}
                              onChange={() => handleOptionChange("compliance", "standard")}
                              className="mt-1 accent-[#89D050]"
                            />
                            <div>
                              <span className="font-bold text-xs md:text-sm text-white block">Standard Compliant SaaS (GDPR, FCC aligned)</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#1E2538]/40 cursor-pointer transition">
                            <input
                              type="radio"
                              name="compliance"
                              value="custom_keys"
                              checked={answers.compliance === "custom_keys"}
                              onChange={() => handleOptionChange("compliance", "custom_keys")}
                              className="mt-1 accent-[#89D050]"
                            />
                            <div>
                              <span className="font-bold text-xs md:text-sm text-white block">Private Root Authority & Dedicated Database Key Control</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#1E2538]/40 cursor-pointer transition">
                            <input
                              type="radio"
                              name="compliance"
                              value="airgapped"
                              checked={answers.compliance === "airgapped"}
                              onChange={() => handleOptionChange("compliance", "airgapped")}
                              className="mt-1 accent-[#89D050]"
                            />
                            <div>
                              <span className="font-bold text-xs md:text-sm text-white block">Air-gapped Government/Military Telemetry Isolation</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-1">
                          <span className="text-[#89D050] text-[10px] font-bold uppercase tracking-[2px] block">
                            Legacy Coexistence
                          </span>
                          <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                            Do you require integration with existing on-premises core billing legacy engines?
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#1E2538]/40 cursor-pointer transition">
                            <input
                              type="radio"
                              name="legacy"
                              value="cloud_native"
                              checked={answers.legacy === "cloud_native"}
                              onChange={() => handleOptionChange("legacy", "cloud_native")}
                              className="mt-1 accent-[#89D050]"
                            />
                            <div>
                              <span className="font-bold text-xs md:text-sm text-white block">No, fully cloud-native API integration is clean</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-[#1E2538]/40 cursor-pointer transition">
                            <input
                              type="radio"
                              name="legacy"
                              value="hybrid_bridge"
                              checked={answers.legacy === "hybrid_bridge"}
                              onChange={() => handleOptionChange("legacy", "hybrid_bridge")}
                              className="mt-1 accent-[#89D050]"
                            />
                            <div>
                              <span className="font-bold text-xs md:text-sm text-white block">Yes, need on-prem edge mediation & real-time sync</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fadeIn text-center py-4">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                          <Check size={24} />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[#89D050] text-[10px] font-bold uppercase tracking-widest block">
                            REFERRED RECOMMENDATION
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {recommendation.title}
                          </h3>
                          <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 rounded-full mt-1">
                            {recommendation.badge}
                          </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                          {recommendation.desc}
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                          <button
                            onClick={resetFinder}
                            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                          >
                            Reset Finder
                          </button>
                          <Link
                            href={recommendation.link}
                            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition inline-flex items-center justify-center gap-2"
                          >
                            Explore Specs
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    {currentStep < 3 && (
                      <div className="flex justify-between items-center pt-6 border-t border-slate-800/80">
                        <button
                          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                          disabled={currentStep === 0}
                          className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition"
                        >
                          Back
                        </button>

                        <button
                          onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          {currentStep === 2 ? "Get Recommendation" : "Next Step"}
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    )}

                  </div>
                ) : (
                  // Scale Optimizer Card panel
                  <div className="space-y-6 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[#89D050] text-[10px] font-bold uppercase tracking-[2px] block">
                        Volume Optimization
                      </span>
                      <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                        Select your active subscriber base to calculate structural model mapping.
                      </h3>
                    </div>

                    {/* Subscriber Count Input */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-300 block">
                        Subscribers Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setSubscriberCount("under_100k")}
                          className={`p-3 rounded-xl border text-[11px] font-bold transition text-center ${subscriberCount === "under_100k"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                        >
                          &lt; 100K
                        </button>
                        <button
                          onClick={() => setSubscriberCount("1m_5m")}
                          className={`p-3 rounded-xl border text-[11px] font-bold transition text-center ${subscriberCount === "1m_5m"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                        >
                          100K — 5M
                        </button>
                        <button
                          onClick={() => setSubscriberCount("over_5m")}
                          className={`p-3 rounded-xl border text-[11px] font-bold transition text-center ${subscriberCount === "over_5m"
                            ? "bg-sky-500/10 border-sky-500 text-sky-400"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                        >
                          &gt; 5M
                        </button>
                      </div>
                    </div>

                    {/* Infrastructure Risk profile */}
                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        Operational Priority
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-800 bg-[#1E2538]/40 cursor-pointer transition">
                          <input
                            type="checkbox"
                            checked={isCriticalLegacy}
                            onChange={(e) => setIsCriticalLegacy(e.target.checked)}
                            className="mt-1 accent-[#89D050]"
                          />
                          <div>
                            <span className="font-bold text-xs md:text-sm text-white block">Requires zero-downtime transactional database cutover sync</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Result Block */}
                    <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-4">
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                        <Info size={16} className="text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-widest">
                            Recommended Model: {recommendation.badge}
                          </span>
                          <h4 className="font-bold text-white text-sm md:text-base mt-1">
                            {recommendation.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {recommendation.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={recommendation.link}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
                        >
                          View Details
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: FOUR DEPLOYMENT MODELS (LIGHT BACKGROUND) */}
      <section className="py-24 bg-stone-100 text-slate-900 scroll-mt-16" id="models-list">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">

          {/* Header */}
          <div className="flex flex-col items-center gap-3.5">
            <h2 className="text-center text-4xl font-semibold text-zinc-900 leading-[48px]">
              Four Deployment Models. Zero Compromise.
            </h2>
            <div className="max-w-[768px]">
              <p className="text-center text-slate-600 text-lg font-normal leading-7">
                ZoikoNex runs the exact same unified BSS kernel regardless of the deployment model,<br className="hidden md:block" />
                ensuring consistency in logic and compliance.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1: Shared SaaS */}
            <div className="p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col items-start h-full">
              <div className="mb-4">
                <span className="text-sky-600 text-xs font-bold font-mono leading-3 tracking-wider block mb-4 uppercase">
                  Fastest Launch
                </span>
                <h3 className="text-2xl font-semibold text-zinc-900 leading-8 mb-4">Shared SaaS</h3>
                <p className="text-slate-600 text-base font-normal leading-6">
                  Multi-tenant efficiency with logical isolation. Perfect for new market entrants and MVNOs needing immediate activation.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2 mb-8 flex-1 w-full">
                {["Zero Infra Management", "Instant Feature Updates", "Global Elasticity"].map((pt) => (
                  <div key={pt} className="text-zinc-900 text-sm font-normal leading-5">
                    {pt}
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-auto w-full">
                <Link href="/sharedsaas" className="text-sky-600 text-base font-bold leading-6 hover:text-sky-700 transition">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Card 2: Dedicated Cloud */}
            <div className="px-8 pt-8 pb-14 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col items-start h-full">
              <div className="mb-4">
                <span className="text-lime-800 text-xs font-bold font-mono leading-3 tracking-wider block mb-4 uppercase">
                  Enterprise Isolation
                </span>
                <h3 className="text-2xl font-semibold text-zinc-900 leading-8 mb-4">Dedicated Cloud</h3>
                <p className="text-slate-600 text-base font-normal leading-6">
                  Your own instance in our managed cloud environment. High performance with total resource isolation.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2 mb-8 flex-1 w-full">
                {["Custom Update Cycles", "Dedicated Databases", "Advanced VPN peering"].map((pt) => (
                  <div key={pt} className="text-zinc-900 text-sm font-normal leading-5">
                    {pt}
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-auto w-full">
                <Link href="/dedicate" className="text-sky-600 text-base font-bold leading-6 hover:text-sky-700 transition">
                  Explore Specs
                </Link>
              </div>
            </div>

            {/* Card 3: Hybrid Mesh */}
            <div className="p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col items-start h-full">
              <div className="mb-4">
                <span className="text-zinc-700 text-xs font-bold font-mono leading-3 tracking-wider block mb-4 uppercase">
                  Coexistence
                </span>
                <h3 className="text-2xl font-semibold text-zinc-900 leading-8 mb-4">Hybrid Mesh</h3>
                <p className="text-slate-600 text-base font-normal leading-6">
                  Bridge legacy on-prem systems with modern cloud monetization. Gradual migration without service disruption.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2 mb-8 flex-1 w-full">
                {["Legacy Integration Bus", "Edge Mediation", "Phased Cutover"].map((pt) => (
                  <div key={pt} className="text-zinc-900 text-sm font-normal leading-5">
                    {pt}
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-auto w-full">
                <Link href="/Hybrid" className="text-sky-600 text-base font-bold leading-6 hover:text-sky-700 transition">
                  View Roadmap
                </Link>
              </div>
            </div>

            {/* Card 4: Sovereign */}
            <div className="px-8 pt-8 pb-14 bg-gray-800 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col items-start h-full">
              <div className="mb-4">
                <span className="text-lime-300 text-xs font-bold font-mono leading-3 tracking-wider block mb-4 uppercase">
                  Maximum Autonomy
                </span>
                <h3 className="text-2xl font-semibold text-white leading-8 mb-4">Sovereign</h3>
                <p className="text-white/60 text-base font-normal leading-6">
                  Full physical deployment on your own infrastructure or government cloud. Complete air-gapped capability.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2 mb-8 flex-1 w-full">
                {["Local Data Control", "Private Root Authority", "On-Site Auditing"].map((pt) => (
                  <div key={pt} className="text-white text-sm font-normal leading-5">
                    {pt}
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-auto w-full">
                <Link href="/sovereign" className="text-lime-300 text-base font-bold leading-6 hover:text-lime-400 transition">
                  Request Details
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: GLOBAL SCALE, LOCAL JURISDICTION (DARK BACKGROUND) */}
      <section className="py-24 bg-[#111625] border-t border-slate-900 relative overflow-hidden">
        <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content Column */}
            <div className="flex flex-col items-start gap-6">
              <h2 className="text-white text-4xl font-semibold leading-[48px]">
                Global Scale. Local Jurisdiction.
              </h2>

              <p className="text-white/70 text-lg font-normal leading-7">
                ZoikoNex is architected for region-aware monetization. Our<br className="hidden lg:block" />
                jurisdiction packs automatically apply local tax, compliance, and<br className="hidden lg:block" />
                currency rules regardless of where your instance is hosted.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-2.5">
                <div className="p-6 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] flex flex-col items-start min-w-[200px]">
                  <h4 className="text-white text-4xl font-semibold leading-[48px] mb-1">24+</h4>
                  <p className="text-white text-xs font-bold font-mono tracking-wider uppercase">REGIONAL NODES</p>
                </div>

                <div className="p-6 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] flex flex-col items-start min-w-[200px]">
                  <h4 className="text-white text-4xl font-semibold leading-[48px] mb-1">100%</h4>
                  <p className="text-white text-xs font-bold font-mono tracking-wider uppercase">GDPR/CCPA COMPLIANT</p>
                </div>
              </div>
            </div>

            {/* Right Map Column (Image) */}
            <div className="relative flex items-center justify-center">
              <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/image/globalscale.png" alt="Global Jurisdiction Map" className="w-full h-auto object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: TECHNICAL COMPARISON TABLE (LIGHT BACKGROUND) */}
      <section className="py-24 bg-[#F8FAFC] text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">

          <div className="mb-14">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Technical Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-slate-950 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  <th className="py-4 pr-6">Attribute</th>
                  <th className="px-6 py-4 text-[#00A3FF]">Shared SaaS</th>
                  <th className="px-6 py-4 text-[#89D050]">Dedicated</th>
                  <th className="px-6 py-4 text-slate-900">Hybrid</th>
                  <th className="px-6 py-4 text-slate-900">Sovereign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[13px]">

                <tr className="hover:bg-slate-50/40 transition">
                  <td className="py-5 pr-6 font-bold text-slate-900">Speed to Market</td>
                  <td className="px-6 py-5 text-slate-600">1-2 Weeks</td>
                  <td className="px-6 py-5 text-slate-600">4-8 Weeks</td>
                  <td className="px-6 py-5 text-slate-600">Varies (Phased)</td>
                  <td className="px-6 py-5 text-slate-600">Custom Baseline</td>
                </tr>

                <tr className="hover:bg-slate-50/40 transition">
                  <td className="py-5 pr-6 font-bold text-slate-900">Infrastructure Owner</td>
                  <td className="px-6 py-5 text-slate-600">ZoikoNex</td>
                  <td className="px-6 py-5 text-slate-600">ZoikoNex (Private)</td>
                  <td className="px-6 py-5 text-slate-600">Shared / Client</td>
                  <td className="px-6 py-5 text-slate-600">Client / Gov</td>
                </tr>

                <tr className="hover:bg-slate-50/40 transition">
                  <td className="py-5 pr-6 font-bold text-slate-900">Data Control</td>
                  <td className="px-6 py-5 text-slate-600">Logical Isolation</td>
                  <td className="px-6 py-5 text-slate-600">Physical DB Isolation</td>
                  <td className="px-6 py-5 text-slate-600">Local Residency</td>
                  <td className="px-6 py-5 text-slate-600">Total Autonomy</td>
                </tr>

                <tr className="hover:bg-slate-50/40 transition">
                  <td className="py-5 pr-6 font-bold text-slate-900">Update Frequency</td>
                  <td className="px-6 py-5 text-slate-600">Bi-Weekly (Auto)</td>
                  <td className="px-6 py-5 text-slate-600">Scheduled</td>
                  <td className="px-6 py-5 text-slate-600">Manual Gated</td>
                  <td className="px-6 py-5 text-slate-600">Client Managed</td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* SECTION 6: IMPLEMENTATION PATHWAY (LIGHT BACKGROUND) */}
      <section className="py-24 bg-[#F1F5F9] text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4.5xl font-extrabold text-slate-950 tracking-tight">
              Implementation Pathway
            </h2>
            <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed">
              Every deployment follows a mathematically precise cutover process.
            </p>
          </div>

          {/* Pathway Process Line */}
          <div className="relative px-4">
            {/* Connector Bar */}
            <div className="absolute top-[20px] left-[8%] right-[8%] h-[2px] bg-slate-200 hidden lg:block" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">

              {/* Step 1 */}
              <div className="group space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#111625] text-white flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  1
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Discovery</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Architectural audit and regulatory mapping.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#111625] text-white flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  2
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Configuration</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Jurisdiction pack setup and currency nodes.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#111625] text-white flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  3
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Activation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Environment spin-up and logic validation.
                </p>
              </div>

              {/* Step 4 */}
              <div className="group space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#111625] text-white flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  4
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Parallel Run</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Revenue testing against legacy outputs.
                </p>
              </div>

              {/* Step 5 */}
              <div className="group space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105">
                  5
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm md:text-base">Cutover</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Zero-downtime traffic migration.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7: CTA SECTION (DARK BACKGROUND) */}
      <section id="contact" className="py-24 bg-[#111625] text-center relative overflow-hidden flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 relative z-10 flex flex-col justify-start items-center gap-6">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-4xl font-semibold leading-[48px]">
              Ready to secure your operator's future?
            </h2>
          </div>

          <div className="max-w-[672px] flex flex-col justify-start items-center">
            <p className="text-center text-white/70 text-lg font-normal leading-7">
              Our solution architects are ready to blueprint your optimal deployment<br className="hidden sm:block" />
              architecture.
            </p>
          </div>

          <div className="pt-6 inline-flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/request-a-demo"
              className="w-full sm:w-auto px-8 py-4 bg-cyan-700 hover:bg-cyan-600 rounded-sm inline-flex flex-col justify-center items-center transition"
            >
              <span className="text-center text-white text-base font-normal leading-6">Contact Architecture Team</span>
            </Link>

            <button
              onClick={() => alert("Downloading Specifications PDF...")}
              className="w-full sm:w-auto px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/20 hover:bg-white/5 inline-flex flex-col justify-center items-center transition"
            >
              <span className="text-center text-white text-base font-normal leading-6">Download Technical Specs</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
