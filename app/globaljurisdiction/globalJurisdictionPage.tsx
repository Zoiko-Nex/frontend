"use client";
import React from "react";
import Link from "next/link";
import { Globe, Shield, RefreshCw, Layers, FileText, CheckCircle, Database, MapPin, Zap, Lock, Landmark, ArrowRight } from "lucide-react";

// EDIT IMAGE LINKS HERE
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop";

export default function GlobalJurisdiction() {
  return (
    <div className="bg-[#0f121b] text-white min-h-screen font-sans">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 flex flex-col lg:flex-row justify-center items-center gap-16 overflow-hidden">
        <div className="flex-1 flex flex-col justify-start items-start gap-6 z-10">
          <div className="flex flex-col justify-start items-start">
            <div className="text-[#0088cc] text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-widest uppercase">INFRASTRUCTURE-GRADE CONTROL</div>
          </div>
          <div className="flex flex-col justify-start items-start">
            <h1 className="text-white text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[1.1]">
              Launch across<br className="hidden lg:block" />markets without<br className="hidden lg:block" />losing control of tax,<br className="hidden lg:block" />fees, or policy.
            </h1>
          </div>
          <div className="max-w-[576px] pt-1.5 flex flex-col justify-start items-start">
            <p className="text-gray-500 text-lg font-normal font-['Inter'] leading-7">
              ZoikoNex Jurisdiction Engine helps telecom operators structure location-aware charging, billing, tax treatment, regulatory-fee logic, policy controls, and audit-ready evidence across customers, products, transactions, usage events, billing cycles, and markets.
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-start items-start gap-4">
            <Link href="/contact-us" className="px-8 py-4 bg-[#2b7a9f] hover:bg-[#226382] flex justify-center items-center gap-2 rounded-sm transition">
              <span className="text-white text-sm font-bold font-['Inter'] leading-4">Request a Jurisdiction Briefing</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <Link href="/domain-details" className="px-8 py-4 outline outline-1 outline-offset-[-1px] outline-stone-300/30 hover:bg-white/5 flex flex-col justify-center items-center rounded-sm transition">
              <span className="text-white text-sm font-bold font-['Inter'] leading-4">Explore the 18 Domains</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full lg:w-auto h-[584px] relative flex justify-center items-center mt-12 lg:mt-0">
          <div className="hidden lg:block w-[584px] h-[584px] absolute rounded-xl border border-[#0088cc]/20"></div>
          <div className="hidden lg:block w-[504px] h-[504px] absolute rounded-xl border border-[#0088cc]/10"></div>

          <div className="w-[518px] h-[518px] relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 bg-black/30 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/gjurisdiction/walk.jpg" alt="Global Market Dashboard" className="w-full h-full object-cover opacity-80" />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-80 p-8 bg-gray-800/70 rounded-lg outline outline-1 outline-offset-[-1px] outline-sky-600/40 backdrop-blur-[6px] inline-flex flex-col justify-start items-center gap-1">
              <div className="inline-flex justify-center items-start">
                <Landmark className="w-6 h-7 text-sky-600 stroke-[1.5]" />
              </div>
              <div className="px-7 pt-3 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-gray-500 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">ACTIVE ROUTING</div>
              </div>
              <div className="px-3 pt-1 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-cyan-700 text-sm font-normal font-['Liberation_Mono'] leading-5">SIGNAL: US_NY_0912</div>
              </div>
              <div className="flex flex-col justify-start items-center">
                <div className="text-center justify-center text-gray-500 text-sm font-normal font-['Liberation_Mono'] leading-5">APPLYING: USF_LEVEL_4</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-800 flex flex-col items-center">
        <h2 className="text-white text-3xl font-semibold mb-6 text-center">Telecom billing is not just usage multiplied by price.</h2>
        <div className="text-center justify-center text-gray-500 text-base font-normal font-['Inter'] leading-6 mb-16">
          Complexity is the silent killer of profitability and compliance in modern<br/>telecommunications.
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "/image/gjurisdiction/icon9.svg", title: "Wrong location logic", desc: "Inaccurate nexus determination leads to massive back-tax liabilities and regulatory fines in multi-state operations." },
            { icon: "/image/gjurisdiction/icon10.svg", title: "Weak evidence", desc: "Failing to capture and archive granular location signals results in audit failures when challenging sovereign tax claims." },
            { icon: "/image/gjurisdiction/icon11.svg", title: "Manual rule updates", desc: "Hard-coded legacy systems cannot adapt to monthly regulatory shifts, creating operational bottlenecks and leakages." },
            { icon: "/image/gjurisdiction/icon12.svg", title: "Disconnected systems", desc: "Siloed CRM, Billing, and ERP data creates conflicting jurisdiction narratives that expose the organization to legal risk." }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#151926] p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.icon} alt={item.title} className="w-6 h-6 mb-8" />
              <h3 className="text-white text-lg font-bold font-['Hanken_Grotesk'] mb-4">{item.title}</h3>
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTROL LAYER */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-800 flex justify-center items-center">
        <div className="w-full max-w-[1392px] px-0 lg:px-12 flex flex-col lg:flex-row justify-center items-center gap-20">
          <div className="flex-1 flex flex-col justify-start items-start gap-8 z-10">
            <div className="flex flex-col justify-start items-start w-full">
              <h2 className="w-full max-w-[528px] text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
                A policy-aware control layer for multi-market telecom<br className="hidden lg:block"/>monetization.
              </h2>
            </div>
            
            <div className="flex flex-col justify-start items-start gap-8 w-full">
              {/* Item 1 */}
              <div className="w-full flex flex-row justify-start items-start gap-6">
                <div className="w-12 h-12 bg-sky-600/10 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-600/20 flex justify-center items-center shrink-0">
                  <div className="flex flex-col justify-start items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/gjurisdiction/icon13.svg" className="w-5 h-5 text-sky-600" alt="icon" />
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Signal capture</h3>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                      Collects high-fidelity location data from network nodes, billing<br className="hidden lg:block"/>addresses, and device telemetry to establish a primary nexus.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="w-full flex flex-row justify-start items-start gap-6">
                <div className="w-12 h-12 bg-sky-600/10 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-600/20 flex justify-center items-center shrink-0">
                  <div className="flex flex-col justify-start items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/gjurisdiction/icon14.svg" className="w-5 h-5 text-sky-600" alt="icon" />
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Rule mapping</h3>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                      Maps signals against a centralized repository of tax, fee, and<br className="hidden lg:block"/>policy logic updated for 200+ global jurisdictions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="w-full flex flex-row justify-start items-start gap-6">
                <div className="w-12 h-12 bg-sky-600/10 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-600/20 flex justify-center items-center shrink-0">
                  <div className="flex flex-col justify-start items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/gjurisdiction/icon15.svg" className="w-5 h-5 text-sky-600" alt="icon" />
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Evidence generation</h3>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                      Creates immutable records of "why" a jurisdiction decision was<br className="hidden lg:block"/>made, ready for instant export for compliance auditors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto flex flex-col justify-start items-start z-10 mt-12 lg:mt-0">
            <div className="w-full p-10 bg-gray-800/70 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/5 backdrop-blur-[6px] flex flex-col justify-start items-start gap-4 shadow-2xl">
              
              <div className="w-full p-6 bg-white/5 border-l-4 border-sky-600 flex flex-col justify-start items-start gap-2 rounded-r-lg">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="text-sky-600 text-xs font-bold font-['JetBrains_Mono'] leading-4 tracking-wider">INTEGRATION LAYER</div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-xl flex flex-col justify-center items-start overflow-hidden mt-1">
                  <div className="h-full w-full bg-sky-600"></div>
                </div>
              </div>

              <div className="w-full p-6 bg-white/5 border-l-4 border-lime-300 flex flex-col justify-start items-start gap-2 rounded-r-lg">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="text-lime-300 text-xs font-bold font-['JetBrains_Mono'] leading-4 tracking-wider">WORKFLOW CONNECTION</div>
                </div>
                <div className="w-full h-2 relative bg-white/10 rounded-xl overflow-hidden mt-1">
                  <div className="w-[80%] lg:w-80 h-full left-0 top-0 absolute bg-lime-300"></div>
                </div>
              </div>

              <div className="w-full p-6 bg-white/5 border-l-4 border-gray-500 flex flex-col justify-start items-start gap-2 rounded-r-lg">
                <div className="w-full flex flex-col justify-start items-start">
                  <div className="text-gray-500 text-xs font-bold font-['JetBrains_Mono'] leading-4 tracking-wider">EVIDENCE REPOSITORY</div>
                </div>
                <div className="w-full h-2 relative bg-white/10 rounded-xl overflow-hidden mt-1">
                  <div className="w-[50%] lg:w-52 h-full left-0 top-0 absolute bg-gray-500"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="w-full py-28 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Jurisdiction Decision Flow</h2>
          </div>
          
          <div className="w-full relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
            {/* Horizontal Line connecting nodes - hidden on small screens */}
            <div className="hidden md:block w-full h-[1px] left-0 top-[32px] absolute bg-gradient-to-r from-sky-600/0 via-sky-600 to-sky-600/0 z-0"></div>
            
            {/* Step 1 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2 z-10">
              <div className="w-16 h-16 bg-[#1a1c24] rounded-xl outline outline-2 outline-offset-[-2px] outline-sky-600 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/gjurisdiction/icon16.svg" alt="Capture Signals" className="w-6 h-6 text-sky-600" />
              </div>
              <div className="w-full pt-4 flex flex-col justify-start items-center">
                <div className="text-center text-white text-lg font-normal font-['Hanken_Grotesk'] leading-7">Capture Signals</div>
              </div>
              <div className="w-full flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Ingest real-time usage & location<br className="hidden md:block"/>data</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2 z-10">
              <div className="w-16 h-16 bg-[#1a1c24] rounded-xl outline outline-2 outline-offset-[-2px] outline-sky-600/60 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/gjurisdiction/icon17.svg" alt="Classify Context" className="w-6 h-6 text-sky-600 opacity-80" />
              </div>
              <div className="w-full pt-4 flex flex-col justify-start items-center">
                <div className="text-center text-white text-lg font-normal font-['Hanken_Grotesk'] leading-7">Classify Context</div>
              </div>
              <div className="w-full flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Identify tax/fee relevance<br className="hidden md:block"/>category</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2 z-10">
              <div className="w-16 h-16 bg-[#1a1c24] rounded-xl outline outline-2 outline-offset-[-2px] outline-sky-600/40 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/gjurisdiction/icon18.svg" alt="Apply Rules" className="w-6 h-6 text-sky-600 opacity-60" />
              </div>
              <div className="w-full pt-4 flex flex-col justify-start items-center">
                <div className="text-center text-white text-lg font-normal font-['Hanken_Grotesk'] leading-7">Apply Rules</div>
              </div>
              <div className="w-full flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Trigger logic based on<br className="hidden md:block"/>jurisdiction</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2 z-10">
              <div className="w-16 h-16 bg-[#1a1c24] rounded-xl outline outline-2 outline-offset-[-2px] outline-sky-600/20 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/gjurisdiction/icon19.svg" alt="Generate Evidence" className="w-6 h-6 text-sky-600 opacity-40" />
              </div>
              <div className="w-full pt-4 flex flex-col justify-start items-center">
                <div className="text-center text-white text-lg font-normal font-['Hanken_Grotesk'] leading-7">Generate Evidence</div>
              </div>
              <div className="w-full flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Snapshot the decision &<br className="hidden md:block"/>rationale</div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="w-full md:w-56 flex flex-col justify-start items-center gap-2 z-10">
              <div className="w-16 h-16 bg-[#1a1c24] rounded-xl outline outline-2 outline-offset-[-2px] outline-lime-300 flex justify-center items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/gjurisdiction/icon20.svg" alt="Feed Operations" className="w-6 h-6 text-lime-300" />
              </div>
              <div className="w-full pt-4 flex flex-col justify-start items-center">
                <div className="text-center text-white text-lg font-normal font-['Hanken_Grotesk'] leading-7">Feed Operations</div>
              </div>
              <div className="w-full flex flex-col justify-start items-center">
                <div className="text-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Stream to Billing & Financial<br className="hidden md:block"/>Ledger</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE MATRIX */}
      <section className="w-full py-28 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Organizational Value Matrix</h2>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* FOUNDER / CEO */}
            <div className="w-full p-8 bg-[#1a1c24]/70 border border-gray-800 border-l-4 border-l-lime-300 backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-lime-300 text-sm font-bold font-['JetBrains_Mono'] leading-6 tracking-wide">FOUNDER / CEO</div>
              </div>
              <div className="w-full pt-1 flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Scale Without Friction</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Removes the &quot;tax tax&quot; on expansion. Enter new<br className="hidden xl:block"/>markets in weeks, not months, by automating<br className="hidden xl:block"/>sovereign logic from day one.</div>
              </div>
            </div>

            {/* CTO / ARCHITECT */}
            <div className="w-full p-8 bg-[#1a1c24]/70 border border-gray-800 border-l-4 border-l-[#0088cc] backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-[#0088cc] text-sm font-bold font-['JetBrains_Mono'] leading-6 tracking-wide">CTO / ARCHITECT</div>
              </div>
              <div className="w-full pt-1 flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Decoupled Complexity</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Keep your billing core lean. Offload jurisdiction-<br className="hidden xl:block"/>heavy logic to a specialized engine designed for<br className="hidden xl:block"/>high-density traffic.</div>
              </div>
            </div>

            {/* CFO / FINANCE */}
            <div className="w-full p-8 bg-[#1a1c24]/70 border border-gray-800 border-l-4 border-l-[#65a30d] backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-[#65a30d] text-sm font-bold font-['JetBrains_Mono'] leading-6 tracking-wide">CFO / FINANCE</div>
              </div>
              <div className="w-full pt-1 flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Zero Surprise Liability</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Ensures every transaction carries the correct<br className="hidden xl:block"/>fee and tax load, preventing massive end-of-<br className="hidden xl:block"/>year reconciliations.</div>
              </div>
            </div>

            {/* COMPLIANCE / LEGAL */}
            <div className="w-full p-8 bg-[#1a1c24]/70 border border-gray-800 border-l-4 border-l-[#b91c1c] backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-[#b91c1c] text-sm font-bold font-['JetBrains_Mono'] leading-6 tracking-wide">COMPLIANCE / LEGAL</div>
              </div>
              <div className="w-full pt-1 flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Audit-Ready Sovereignty</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Immutable evidence logs transform audit<br className="hidden xl:block"/>defense from a manual fire-drill into a single-<br className="hidden xl:block"/>click export.</div>
              </div>
            </div>

            {/* PRODUCT / COMMERCIAL */}
            <div className="w-full p-8 bg-[#1a1c24]/70 border border-gray-800 border-l-4 border-l-[#6b7280] backdrop-blur-[6px] flex flex-col justify-start items-start gap-3">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-[#6b7280] text-sm font-bold font-['JetBrains_Mono'] leading-6 tracking-wide">PRODUCT / COMMERCIAL</div>
              </div>
              <div className="w-full pt-1 flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Dynamic Monetization</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">Launch jurisdiction-specific promos or<br className="hidden xl:block"/>enterprise-grade exemption handling without<br className="hidden xl:block"/>developer tickets.</div>
              </div>
            </div>

            {/* Your Domain? */}
            <div className="w-full p-8 bg-sky-600/10 border border-[#0088cc]/20 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-sky-600/20 transition-all group">
              <div className="w-full pb-4 flex flex-col justify-start items-center">
                <div className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Your Domain?</div>
              </div>
              <div className="w-full pb-6 flex flex-col justify-start items-center">
                <div className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">See how ZoikoNex solves your specific<br className="hidden xl:block"/>functional pain points.</div>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 group-hover:gap-3 transition-all">
                <div className="text-[#0088cc] text-sm font-bold font-['Inter'] leading-6">Get a Custom Briefing</div>
                <ArrowRight className="w-4 h-4 text-[#0088cc]" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CAPABILITY MATRIX */}
      <section className="w-full max-w-[1280px] mx-auto px-6 py-28 flex flex-col justify-start items-start gap-12">
        <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk']">Capability Matrix</h2>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800/60">
                <th className="py-6 pr-4 font-bold uppercase text-xs text-gray-500 tracking-widest font-['JetBrains_Mono']">CAPABILITY</th>
                <th className="py-6 px-4 font-bold uppercase text-xs text-gray-500 tracking-widest font-['JetBrains_Mono']">CORE FUNCTION</th>
                <th className="py-6 pl-4 font-bold uppercase text-xs text-gray-500 tracking-widest font-['JetBrains_Mono']">INFRASTRUCTURE IMPACT</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Jurisdiction Signal Capture", "Multi-point location telemetry ingestion", "Ensures \"Physical Presence\" nexus accuracy"],
                ["Tax and Fee Rule Mapping", "Dynamic USF, Sales Tax, and VAT logic", "Prevents under-collection & leakage"],
                ["Policy Versioning", "Time-sensitive logic activation", "Supports retroactive billing adjustments"],
                ["Exemption Logic", "Automated non-profit & resale handling", "Reduces commercial dispute friction"],
                ["Evidence Generation", "Cryptographic proof of decision logic", "Provides sovereign-grade audit trails"],
                ["Integration Layer", "REST API & Event-driven triggers", "Low-latency sync with CRM & Billing"]
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 pr-4 font-medium text-white font-['Inter'] text-sm">{row[0]}</td>
                  <td className="py-6 px-4 text-gray-400 font-['Inter'] text-sm">{row[1]}</td>
                  <td className="py-6 pl-4 text-gray-400 font-['Inter'] text-sm">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>


      {/* CTA SECTION */}
      <section className="w-full max-w-[1100px] mx-auto px-6 py-32 flex flex-col justify-center items-center">
        <div className="w-full bg-[#15171e] p-16 rounded-[32px] border border-white/5 shadow-2xl flex flex-col items-center gap-10">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
              Make jurisdiction complexity manageable<br className="hidden lg:block"/>before it becomes operational debt.
            </h2>
          </div>
          <div className="w-full max-w-4xl flex flex-col items-center">
            <p className="text-center text-gray-500 text-lg font-normal font-['Inter'] leading-7">
              Whether you are launching a new MVNO, migrating from legacy billing, expanding into<br className="hidden lg:block"/>multiple states or countries, or supporting multiple telecom brands, ZoikoNex gives your<br className="hidden lg:block"/>team a structured foundation for jurisdiction-aware monetization and evidence-led<br className="hidden lg:block"/>control.
            </p>
          </div>
          <div className="pt-4 flex flex-col justify-center items-center">
            <Link href="/contact-us" className="px-8 py-3.5 bg-[#3182a4] hover:bg-[#2b728f] transition-all text-white text-sm font-bold tracking-wide shadow-[0_20px_50px_-10px_rgba(202,236,102,0.3)]">
              Request a Platform Briefing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
