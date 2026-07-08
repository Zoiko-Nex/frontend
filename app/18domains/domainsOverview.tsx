"use client";
import React from "react";
import Link from "next/link";
import { Server, Shield, Zap, Layers, Cpu, Box, Database, Network, FileText, CheckCircle } from "lucide-react";

// EDIT IMAGE LINKS HERE
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop";
const CHIP_IMAGE_URL = "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop";

export default function Domains() {
  return (
    <div className="bg-[#0f121b] text-white min-h-screen font-sans">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20 flex flex-col lg:flex-row justify-center items-center gap-16">
        <div className="w-full lg:w-[671px] flex flex-col justify-start items-start gap-6">
          <div className="text-sky-600 text-xs font-bold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">
            SOVEREIGN ARCHITECTURE
          </div>
          <h1 className="text-white text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[66px]">
            18 domains. One<br />telecom operating<br />system.
          </h1>
          <p className="max-w-[576px] text-gray-500 text-lg font-normal font-['Inter'] leading-7">
            ZoikoNex unifies the critical domains required to launch, monetize, manage, govern, and scale modern telecom services—from customer onboarding and product catalog to real-time charging, billing, taxation, eSIM lifecycle management, compliance, APIs, AI governance, and evidence-grade operational control.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-4">
            <Link href="/contact-us" className="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 rounded-xl flex justify-center items-center gap-2 transition">
              <span className="text-white text-lg font-normal font-['Inter'] leading-7">Request a Platform Briefing</span>
              <svg className="w-5 h-5 text-white ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
            <Link href="#18-domains" className="px-8 py-4 rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-500 hover:outline-zinc-300 hover:bg-white/5 transition flex justify-center items-center">
              <span className="text-white text-lg font-normal font-['Inter'] leading-7">Explore the 18 Domains</span>
            </Link>
          </div>
        </div>
        <div className="flex-1 h-[600px] lg:h-[688px] relative flex justify-center items-center w-full lg:w-auto mt-12 lg:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/10 to-sky-600/0 rounded-xl blur-[50px]"></div>
          <div className="w-full max-w-[575px] h-full max-h-[600px] relative flex justify-center items-center">
            <div className="w-72 h-72 absolute rounded-xl outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex justify-center items-center">
              <div className="w-4 h-4 absolute -top-2 bg-sky-600 rounded-full"></div>
              <div className="w-4 h-4 absolute -bottom-2 bg-sky-600 rounded-full"></div>
            </div>
            <div className="w-96 h-96 absolute rounded-xl outline outline-1 outline-offset-[-1px] outline-stone-300/10 flex justify-center items-center">
              <div className="w-4 h-4 absolute -right-2 top-1/4 bg-lime-300 rounded-full"></div>
              <div className="w-4 h-4 absolute -left-2 bottom-1/4 bg-lime-300 rounded-full"></div>
            </div>
            <div className="w-full h-full max-w-[600px] max-h-[600px] absolute rounded-xl border border-stone-300/5 hidden md:block"></div>
            <div className="w-48 h-48 bg-gray-800 rounded-xl shadow-[0px_0px_50px_0px_rgba(191,243,101,0.20)] outline outline-4 outline-offset-[-4px] outline-lime-300 flex justify-center items-center relative z-10">
              <div className="text-lime-300 text-2xl font-bold font-['Hanken_Grotesk'] tracking-wider">CORE</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CARDS */}
      <section className="w-full bg-[#161a25] border-t border-b border-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col justify-center items-center gap-16">
          <div className="w-full max-w-5xl flex flex-col justify-start items-center gap-6 text-center">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
              Telecom growth breaks when critical domains are fragmented.
            </h2>
            <p className="max-w-3xl text-gray-500 text-lg font-normal font-['Inter'] leading-7">
              Legacy telecom stacks often separate billing, charging, SIM management, and compliance<br className="hidden md:block" />across disconnected tools. That fragmentation creates revenue leakage and integration<br className="hidden md:block" />debt.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-gray-900/60 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/18domain/icon8.svg" alt="Launch Faster" className="w-8 h-8 mb-2" />
              <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Launch Faster</div>
              <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Unified catalogs and automated<br />workflows reduce time-to-market<br />from months to days.</div>
            </div>
            <div className="p-8 bg-gray-900/60 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/18domain/icon9.svg" alt="Monetize Accurately" className="w-8 h-8 mb-2" />
              <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Monetize Accurately</div>
              <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Real-time charging across all<br />event types ensures zero<br />revenue leakage.</div>
            </div>
            <div className="p-8 bg-gray-900/60 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/18domain/icon10.svg" alt="Retain More" className="w-8 h-8 mb-2" />
              <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Retain More</div>
              <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Predictive CX and sovereign data<br />control build lasting institutional<br />trust.</div>
            </div>
            <div className="p-8 bg-gray-900/60 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/18domain/icon11.svg" alt="Govern Confidence" className="w-8 h-8 mb-2" />
              <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Govern Confidence</div>
              <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Automated evidence ledgers and<br />AI-driven compliance mitigate<br />global risks.</div>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINS GRID */}
      <section id="18-domains" className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <div className="text-sky-600 text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider mb-2">THE ARCHITECTURE</div>
          <h2 className="text-white text-3xl font-semibold font-['Hanken_Grotesk']">A Unified Sovereign Ecosystem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">

          {/* Layer 01 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-[#0088cc] p-4 flex flex-col justify-center">
              <div className="text-[#0088cc] text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 01</div>
              <div className="text-white text-xs font-medium">Commercial & Customer Ops</div>
            </div>
            {["1|Customer Management", "2|Product Catalog", "3|Order Management"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

          {/* Layer 02 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-[#a3e635] p-4 flex flex-col justify-center">
              <div className="text-[#a3e635] text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 02</div>
              <div className="text-white text-xs font-medium">Monetization & Revenue</div>
            </div>
            {["4|Real-Time Charging", "5|Billing & Invoicing", "6|Payments & Wallets", "7|Taxation Engine", "8|Revenue Assurance"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-[#a3e635]/10 text-[#a3e635] flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

          {/* Layer 03 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-gray-400 p-4 flex flex-col justify-center">
              <div className="text-gray-400 text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 03</div>
              <div className="text-white text-xs font-medium">Network & Service Lifecycle</div>
            </div>
            {["9|SIM/eSIM Lifecycle", "10|Network Integration", "11|Usage/Event Processing"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-gray-400/10 text-gray-400 flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

          {/* Layer 04 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-red-600 p-4 flex flex-col justify-center">
              <div className="text-red-600 text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 04</div>
              <div className="text-white text-xs font-medium">Compliance & Evidence</div>
            </div>
            {["12|Compliance Controls", "13|Evidence Ledger", "14|AI Governance"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-red-600/10 text-red-600 flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

          {/* Layer 05 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-[#b48238] p-4 flex flex-col justify-center">
              <div className="text-[#b48238] text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 05</div>
              <div className="text-white text-xs font-medium">Experience & Ops</div>
            </div>
            {["15|CX Support", "16|Analytics Intelligence"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-[#b48238]/10 text-[#b48238] flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

          {/* Layer 06 */}
          <div className="space-y-2">
            <div className="bg-[#161a25] border-l-2 border-[#00e5ff] p-4 flex flex-col justify-center">
              <div className="text-[#00e5ff] text-[8px] font-bold uppercase tracking-wider mb-1">LAYER 06</div>
              <div className="text-white text-xs font-medium">Ecosystem & APIs</div>
            </div>
            {["17|API/Integration Layer", "18|Partner/Wholesale Ops"].map((t, i) => (
              <div key={i} className="bg-[#161a25]/60 p-3 flex items-center rounded-sm">
                <div className="w-6 h-6 bg-[#00e5ff]/10 text-[#00e5ff] flex items-center justify-center text-[10px] font-bold mr-4 rounded-sm">{t.split('|')[0]}</div>
                <div className="text-xs font-semibold text-gray-200">{t.split('|')[1]}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TABLE */}
      <section className="w-full bg-[#191a21] py-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px] mb-4">Value Architecture</h2>
            <p className="text-gray-500 text-[11px] font-medium">Strategic impact mapped by institutional role.</p>
          </div>

          <div className="w-full">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#2d303f]/70">
                  <th className="pb-6 font-['JetBrains_Mono'] font-medium text-[#a3e635] text-[11px] w-[35%] tracking-wide">Stakeholder</th>
                  <th className="pb-6 font-['JetBrains_Mono'] font-medium text-[#a3e635] text-[11px] w-[35%] tracking-wide">Primary Domain Focus</th>
                  <th className="pb-6 font-['JetBrains_Mono'] font-medium text-[#a3e635] text-[11px] w-[30%] tracking-wide">Core Value Metric</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Founder / CEO", "Ecosystem & Experience", "Valuation & Market Expansion"],
                  ["CTO / Architect", "APIs & Network Integration", "Infrastructure Stability & Scalability"],
                  ["CFO / Finance", "Monetization & Revenue", "Zero Revenue Leakage & DSO"],
                  ["Compliance / Legal", "Compliance & Evidence Ledger", "Regulatory De-risking"],
                  ["Commercial Director", "Product Catalog & Order Management", "Time-to-Market & ARPU Growth"],
                  ["CX / Operations", "Customer Mgmt & Support", "Churn Reduction & NPS"]
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[#2d303f]/50">
                    <td className="py-7 font-bold text-white text-xs">{row[0]}</td>
                    <td className="py-7 text-slate-300 text-xs">{row[1]}</td>
                    <td className="py-7 text-slate-200 text-xs">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="w-full max-w-7xl mx-auto px-6 py-28 flex flex-col justify-center items-center gap-12 overflow-hidden">
        <div className="w-full flex flex-col justify-start items-center">
          <div className="text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Unified Lifecycle Journey</div>
        </div>
        <div className="w-full py-12 relative flex flex-col justify-start items-center">
          <div className="hidden md:block w-full max-w-[1024px] h-[2px] absolute top-[80px] bg-stone-300/20 z-0"></div>

          <div className="w-full flex flex-col md:flex-row justify-center items-start gap-8 z-10">
            {/* Step 1 */}
            <div className="w-full md:w-56 pb-2 flex flex-col justify-start items-center gap-2">
              <div className="w-16 h-16 bg-[#161a25] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#0088cc] flex justify-center items-center bg-[#0f121b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon12.svg" alt="Plan Creation" className="w-6 h-6" />
              </div>
              <div className="pt-2 flex flex-col justify-start items-center">
                <div className="text-center text-white text-base font-bold font-['Inter'] leading-6">Plan Creation</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">Domain 2: Catalog</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="w-full md:w-56 pb-2 flex flex-col justify-start items-center gap-2">
              <div className="w-16 h-16 bg-[#161a25] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#0088cc] flex justify-center items-center bg-[#0f121b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon13.svg" alt="Subscriber Sync" className="w-6 h-6" />
              </div>
              <div className="pt-2 flex flex-col justify-start items-center">
                <div className="text-center text-white text-base font-bold font-['Inter'] leading-6">Subscriber Sync</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">Domain 1 & 9: CRM/eSIM</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2">
              <div className="w-16 h-16 bg-[#161a25] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#0088cc] flex justify-center items-center bg-[#0f121b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon14.svg" alt="Live Usage" className="w-6 h-6" />
              </div>
              <div className="pt-2 flex flex-col justify-start items-center">
                <div className="text-center text-white text-base font-bold font-['Inter'] leading-6">Live Usage</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">Domain 4: Charging</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="w-full md:w-56 pb-2 flex flex-col justify-start items-center gap-2">
              <div className="w-16 h-16 bg-[#161a25] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#0088cc] flex justify-center items-center bg-[#0f121b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon15.svg" alt="Audit & Verify" className="w-6 h-6" />
              </div>
              <div className="pt-2 flex flex-col justify-start items-center">
                <div className="text-center text-white text-base font-bold font-['Inter'] leading-6">Audit & Verify</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">Domain 13: Evidence</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="w-full md:w-56 pb-2 flex flex-col justify-start items-center gap-2">
              <div className="w-16 h-16 bg-[#161a25] rounded-xl outline outline-2 outline-offset-[-2px] outline-lime-400 flex justify-center items-center bg-[#0f121b]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon16.svg" alt="Exec Visibility" className="w-6 h-6" />
              </div>
              <div className="pt-2 flex flex-col justify-start items-center">
                <div className="text-center text-white text-base font-bold font-['Inter'] leading-6">Exec Visibility</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">Domain 16: Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-28 flex flex-col justify-start items-start">
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-20">
          <div className="flex-1 flex flex-col justify-center items-start gap-10">
            {/* Item 1 */}
            <div className="flex justify-start items-start gap-4">
              <div className="flex flex-col justify-start items-start pt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon17.svg" alt="Modular by Design" className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Inter'] leading-5">Modular by Design</div>
                <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-5">
                  Deploy only what you need. Each domain operates independently or as a unified<br className="hidden lg:block" />swarm.
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex justify-start items-start gap-4">
              <div className="flex flex-col justify-start items-start pt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon18.svg" alt="API-First Integration" className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Inter'] leading-5">API-First Integration</div>
                <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-5">
                  Every domain is exposed via high-performance gRPC/REST APIs for seamless<br className="hidden lg:block" />stack injection.
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex justify-start items-start gap-4">
              <div className="flex flex-col justify-start items-start pt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon19.svg" alt="Evidence-Aware Operations" className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Inter'] leading-5">Evidence-Aware Operations</div>
                <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-5">
                  Every system state change is hashed and written to a secure immutable<br className="hidden lg:block" />evidence ledger.
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex justify-start items-start gap-4">
              <div className="flex flex-col justify-start items-start pt-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/18domain/icon20.svg" alt="AI Under Governance" className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-white text-sm font-bold font-['Inter'] leading-5">AI Under Governance</div>
                <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-5">
                  Automated reasoning is constrained by human-defined legal and technical<br className="hidden lg:block" />guardrails.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative flex flex-col justify-center items-center mt-12 lg:mt-0">
            <div className="absolute inset-[-4px] opacity-25 bg-gradient-to-r from-sky-600 to-lime-300 rounded-lg blur-[2px] pointer-events-none z-0"></div>
            <div className="w-full p-8 bg-gray-900/60 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex justify-center items-center overflow-hidden relative z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/18domain/eight.png" alt="Microchip" className="w-full h-auto object-cover rounded-sm shadow-2xl opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-28 flex justify-center items-center">
        <div className="w-full max-w-[896px] p-8 md:p-12 bg-gray-900/60 rounded-3xl border border-white/10 backdrop-blur-[6px] flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-center text-white text-3xl md:text-5xl font-normal font-['Hanken_Grotesk'] leading-tight md:leading-[58px]">
              Map ZoikoNex to your telecom<br className="hidden md:block"/>operating model.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 w-full">
            <Link href="/contact-us" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-xl flex justify-center items-center">
              <span className="text-center text-white text-lg md:text-xl font-normal font-['Inter'] leading-7">Request a Platform Briefing</span>
            </Link>
            <Link href="/api-reference" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 rounded-xl border border-zinc-500 hover:bg-white/5 transition-colors flex justify-center items-center">
              <span className="text-center text-white text-lg md:text-xl font-normal font-['Inter'] leading-7">View API Reference</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
