"use client";
import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, Database, Server, RefreshCw, AlertCircle, FileText, Check, Link as LinkIcon, Lock, Activity, Users } from "lucide-react";

// EDIT IMAGE LINKS HERE
const HERO_DASHBOARD_IMAGE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";

export default function EvidenceLedger() {
  return (
    <div className="bg-[#0f121b] text-white min-h-screen font-sans">
      
      {/* EVIDENCE LEDGER HERO SECTION */}
      <section className="w-full py-28 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row justify-center items-center gap-16">
          <div className="flex-1 flex flex-col justify-start items-start gap-8 z-10">
            <div className="px-3 py-2.5 bg-white/10 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/40 flex justify-start items-start">
              <div className="text-white text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">EVIDENCE LEDGER</div>
            </div>
            <div className="w-full pt-1 flex flex-col justify-start items-start">
              <h1 className="text-white text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[66px]">Every critical telecom<br/>action should leave a<br/>governed record.</h1>
            </div>
            <div className="w-full max-w-[576px] flex flex-col justify-start items-start">
              <p className="text-gray-500 text-lg font-normal font-['Inter'] leading-7">The Nexus Sovereign Evidence Ledger is designed for preserving<br className="hidden lg:block"/>traceable records for billing, tax, and AI. Establish a mathematical<br className="hidden lg:block"/>proof-of-transaction that ensures regulatory compliance and<br className="hidden lg:block"/>absolute financial clarity.</p>
            </div>
            <div className="w-full pt-1 flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <Link href="/contact-us" className="w-full sm:w-80 px-12 py-4 bg-[#3182a4] hover:bg-[#2b728f] transition-colors rounded-sm flex flex-col justify-center items-center text-white text-sm font-semibold font-['Inter'] leading-4 text-center">
                Request an Evidence Architecture Briefing
              </Link>
              <Link href="/trust/evidence-architecture" className="w-full sm:w-64 px-16 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/40 hover:bg-white/5 transition-colors flex flex-col justify-center items-center text-white text-sm font-semibold font-['Inter'] leading-4 text-center">
                View Evidence<br/>Architecture
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative flex justify-center items-center mt-12 lg:mt-0 z-10">
            <div className="w-full max-w-[500px] bg-[#1a1c24] rounded-2xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col justify-center items-start overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-[498px] object-cover opacity-30 mix-blend-overlay" src="/image/evidence/overlay.svg" alt="Overlay" />
            </div>
            <div className="w-full max-w-[500px] lg:w-full h-[500px] p-8 absolute left-1/2 lg:left-0 top-0 transform -translate-x-1/2 lg:translate-x-0 flex flex-col justify-between items-start">
              <div className="w-full flex justify-between items-start">
                <div className="pt-1 flex flex-col justify-start items-start gap-3">
                  <div className="opacity-60 text-lime-300 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">INGESTION_LAYER_ALPHA</div>
                  <div className="w-24 h-1 relative bg-lime-300/20 overflow-hidden">
                    <div className="w-8 h-1 absolute left-0 top-0 bg-lime-300"></div>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image/evidence/icon9.svg" className="w-9 h-8" alt="Node" />
                </div>
              </div>

              <div className="w-full flex flex-col justify-start items-start gap-4 z-10 relative mt-16">
                {/* USAGE */}
                <div className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex justify-start items-center gap-4">
                  <div className="flex flex-col justify-start items-start">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon10.svg" className="w-4 h-4" alt="Usage" />
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <div className="w-full h-2 bg-white/10 rounded-sm"></div>
                    <div className="w-3/4 h-2 bg-white/10 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="text-gray-500 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">USAGE</div>
                  </div>
                </div>

                {/* BILLING */}
                <div className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex justify-start items-center gap-4">
                  <div className="flex flex-col justify-start items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon8.svg" className="w-4 h-4" alt="Billing" />
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <div className="w-full h-2 bg-white/10 rounded-sm"></div>
                    <div className="w-2/3 h-2 bg-white/10 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="text-gray-500 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">BILLING</div>
                  </div>
                </div>

                {/* AI_AGENTS */}
                <div className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex justify-start items-center gap-4">
                  <div className="flex flex-col justify-start items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon11.svg" className="w-4 h-4" alt="AI Agents" />
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start gap-2">
                    <div className="w-full h-2 bg-white/10 rounded-sm"></div>
                    <div className="w-5/6 h-2 bg-white/10 rounded-sm"></div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="text-gray-500 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">AI_AGENTS</div>
                  </div>
                </div>
              </div>

              <div className="w-full pt-5 pb-1 flex flex-col justify-start items-center">
                <div className="text-center text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">SECURE CONVERGENCE_INITIATED</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* WHY EVIDENCE MATTERS */}
      <section className="w-full py-20 bg-stone-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-12">
          
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Why Evidence Matters</h2>
            <div className="w-20 h-1 bg-[#0284c7]"></div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon12.svg" className="h-6" alt="Billing Disputes" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Billing Disputes</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Lack of granular audit trails leads to<br className="hidden lg:block"/>protracted customer disputes and credit<br className="hidden lg:block"/>notes.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">Atomic immutable event logging for every<br className="hidden lg:block"/>charge.</p>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon13.svg" className="h-6" alt="Revenue Leakage" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Revenue Leakage</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Unreconciled network events bypass<br className="hidden lg:block"/>billing systems, eroding Tier-1 margins.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">Real-time delta analysis between ledger<br className="hidden lg:block"/>and gateway.</p>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon14.svg" className="h-6" alt="Provisioning Uncertainty" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Provisioning Uncertainty</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Invisible activation failures create 'orphan'<br className="hidden lg:block"/>subscribers and billing gaps.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">Closed-loop state verification for every<br className="hidden lg:block"/>SIM life-cycle event.</p>
                    </div>
                </div>
            </div>

            {/* Card 4 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon15.svg" className="h-6" alt="Regulatory Review" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Regulatory Review</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Compliance audits fail due to fragmented,<br className="hidden lg:block"/>unverifiable historical data.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">One-click 'Chain of Custody' reporting for<br className="hidden lg:block"/>all transactions.</p>
                    </div>
                </div>
            </div>

            {/* Card 5 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon16.svg" className="h-6" alt="Partner Settlement" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Partner Settlement</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Inaccurate roaming and interconnect<br className="hidden lg:block"/>settlements strain global partnerships.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">Shared sovereign ledgers for multi-party<br className="hidden lg:block"/>verification.</p>
                    </div>
                </div>
            </div>

            {/* Card 6 */}
            <div className="w-full bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-200 p-8 flex flex-col justify-start items-start gap-2">
                <div className="flex justify-start items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon17.svg" className="h-6" alt="AI Accountability" />
                </div>
                <div className="w-full pt-2">
                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">AI Accountability</h3>
                </div>
                <div className="w-full pb-4">
                    <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Black-box AI decisions create<br className="hidden lg:block"/>unexplainable billing or policy changes.</p>
                </div>
                <div className="w-full pt-4 border-t border-stone-300/30 flex flex-col justify-start items-start gap-1 mt-auto">
                    <div className="w-full">
                        <span className="text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ZoikoNex Response</span>
                    </div>
                    <div className="w-full">
                        <p className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">Mandatory 'Decision Basis' evidence for<br className="hidden lg:block"/>every AI-driven action.</p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHAT IT CAPTURES */}
      <section className="w-full py-28 bg-[#15171e] flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full flex flex-col justify-start items-center gap-4 text-center">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">What the Evidence Ledger Captures</h2>
            <p className="text-gray-400 text-lg font-normal font-['Inter'] leading-7">Universal capture across the sovereign infrastructure stack.</p>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon18.svg" className="h-5" alt="Charging" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_01</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">Charging</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">Usage events, rating logic, and real-time<br className="hidden lg:block"/>balance deductions.</p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon19.svg" className="h-5" alt="Billing" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_02</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">Billing</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">Invoice generation, cycle shifts, and<br className="hidden lg:block"/>credit/debit adjustments.</p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon20.svg" className="h-5" alt="Tax" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_03</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">Tax</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">Jurisdictional calculation logic and sovereign<br className="hidden lg:block"/>tax filings.</p>
                </div>
            </div>

            {/* Card 4 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon21.svg" className="h-5" alt="SIM/Network" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_04</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">SIM/Network</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">Provisioning states, HLR updates, and<br className="hidden lg:block"/>authentication requests.</p>
                </div>
            </div>

            {/* Card 5 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon22.svg" className="h-5" alt="Policy/Compliance" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_05</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">Policy/Compliance</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">SLA monitoring, QoS adjustments, and<br className="hidden lg:block"/>access control changes.</p>
                </div>
            </div>

            {/* Card 6 */}
            <div className="w-full p-8 bg-[#1a1c24] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-6 transition hover:bg-[#1f222b]">
                <div className="w-full flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/evidence/icon23.svg" className="h-5" alt="AI/Automation" />
                    <span className="text-gray-500 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">DOMAIN_06</span>
                </div>
                <div className="w-full flex flex-col justify-start items-start gap-2">
                    <h3 className="text-white text-base font-semibold font-['Hanken_Grotesk'] leading-6">AI/Automation</h3>
                    <p className="text-gray-400 text-sm font-normal font-['Inter'] leading-5">Model inferences, prompt context, and<br className="hidden lg:block"/>autonomous logic execution.</p>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* EVENT TO EVIDENCE JOURNEY */}
      <section id="architecture" className="w-full py-20 bg-stone-50 flex flex-col justify-center items-center overflow-x-auto overflow-y-hidden">
          <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16 min-w-[1000px]">
              <div className="self-stretch flex flex-col justify-start items-center">
                  <div className="text-center justify-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Event-to-Evidence Journey</div>
              </div>
              <div className="self-stretch relative inline-flex justify-between items-start">
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">1</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Event Occurs</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Network or logic<br/>event triggers in<br/>the stack.</div>
                      </div>
                  </div>
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">2</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Extraction</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Atomic data<br/>capture from<br/>source stream.</div>
                      </div>
                  </div>
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">3</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Canonical Map</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Mapping raw data<br/>to Evidence<br/>Object Model.</div>
                      </div>
                  </div>
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">4</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Validation</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Schema and<br/>cryptographic<br/>integrity checks.</div>
                      </div>
                  </div>
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">5</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Persistence</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Immutable commit<br/>to the Sovereign<br/>Ledger.</div>
                      </div>
                  </div>
                  <div className="w-40 self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 relative">
                      <div className="w-12 h-12 bg-lime-300 rounded-xl inline-flex justify-center items-center">
                          <div className="text-center justify-center text-lime-950 text-lg font-bold font-['Nimbus_Sans'] leading-7">6</div>
                      </div>
                      <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Operational<br/>Use</div>
                      </div>
                      <div className="self-stretch px-4 flex flex-col justify-start items-center">
                          <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Nimbus_Sans'] leading-6">Audit, billing, and<br/>AI feedback ready.</div>
                      </div>
                  </div>
                  <div className="w-full h-0.5 left-0 top-[24px] absolute bg-gradient-to-r from-lime-300/0 via-lime-300 to-lime-300/0"></div>
              </div>
          </div>
      </section>

      {/* EVIDENCE OBJECT MODEL */}
      <section className="w-full py-28 bg-[#f0eff0] flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-12">
          
          <div className="w-full flex justify-between items-end">
            <div className="flex flex-col justify-start items-start gap-4">
              <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Evidence Object Model</h2>
              <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">The standardized data shape for every infrastructure event.</p>
            </div>
            <div className="px-3 py-1.5 bg-[#15171e] rounded-sm justify-center items-center flex mb-1">
              <div className="text-cyan-700 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">SCHEMA_VER: 4.2.0</div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">01_IDENTITY</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Subject ID, Device fingerprint,<br className="hidden xl:block"/>and Auth token hash.</p>
            </div>

            {/* Card 2 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">02_SOURCE</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Origin Node ID, API endpoint,<br className="hidden xl:block"/>and Gateway signature.</p>
            </div>

            {/* Card 3 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">03_TIME_STATE</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">UTC micro-timestamp, State<br className="hidden xl:block"/>Before/After, and TTL.</p>
            </div>

            {/* Card 4 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">04_DECISION_BASIS</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Rule ID triggered, AI prompt<br className="hidden xl:block"/>hash, and logic context.</p>
            </div>

            {/* Card 5 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">05_FINANCIAL</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Currency code, Gross/Net<br className="hidden xl:block"/>value, and Tax category.</p>
            </div>

            {/* Card 6 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">06_GOVERNANCE</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Retention policy, Access level,<br className="hidden xl:block"/>and Sovereignty zone.</p>
            </div>

            {/* Card 7 */}
            <div className="w-full p-6 bg-white flex flex-col justify-start items-start gap-4 transition hover:shadow-md">
              <div className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">07_INTEGRITY</div>
              <p className="text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Merkle tree leaf, block hash,<br className="hidden xl:block"/>and validator ID.</p>
            </div>

            {/* Card 8 - Dark Action */}
            <div className="w-full p-6 bg-[#15171e] flex justify-center items-center transition hover:bg-[#1f222b] cursor-pointer">
              <span className="text-[#3182a4] text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">EXPAND MODEL SCHEMA</span>
            </div>

          </div>
        </div>
      </section>

      {/* SALES & GOVERNANCE VALUE */}
      <section className="w-full py-28 bg-[#fafafa] flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full text-center">
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Sales & Governance Value</h2>
          </div>
          
          <div className="w-full flex flex-col justify-start items-start">
            
            {/* Table Header */}
            <div className="w-full py-6 border-t-2 border-b border-black flex justify-start items-center">
              <div className="w-[35%] text-gray-500 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ARCHITECTURAL FEATURE</div>
              <div className="w-[40%] text-gray-500 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">BUSINESS OUTCOME</div>
              <div className="w-[25%] text-gray-500 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">STAKEHOLDER IMPACT</div>
            </div>

            {/* Row 1 */}
            <div className="w-full py-6 border-b border-gray-200 flex justify-start items-center transition hover:bg-black/5">
              <div className="w-[35%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Atomic Ingestion</div>
              <div className="w-[40%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Faster Dispute Resolution</div>
              <div className="w-[25%] flex justify-start items-center">
                <div className="px-3 py-1 bg-[#f2ffcc] rounded-full justify-center items-center flex">
                  <span className="text-lime-800 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">CUSTOMER EXPERIENCE</span>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="w-full py-6 border-b border-gray-200 flex justify-start items-center transition hover:bg-black/5">
              <div className="w-[35%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Cross-Domain Mapping</div>
              <div className="w-[40%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Eliminated Revenue Leakage</div>
              <div className="w-[25%] flex justify-start items-center">
                <div className="px-3 py-1 bg-[#f2ffcc] rounded-full justify-center items-center flex">
                  <span className="text-lime-800 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">FINANCE / CFO</span>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="w-full py-6 border-b border-gray-200 flex justify-start items-center transition hover:bg-black/5">
              <div className="w-[35%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Immutable Chain of Custody</div>
              <div className="w-[40%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Enterprise Procurement Confidence</div>
              <div className="w-[25%] flex justify-start items-center">
                <div className="px-3 py-1 bg-[#f2ffcc] rounded-full justify-center items-center flex">
                  <span className="text-lime-800 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">SALES / LEGAL</span>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="w-full py-6 border-b border-gray-200 flex justify-start items-center transition hover:bg-black/5">
              <div className="w-[35%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">AI Decision Logging</div>
              <div className="w-[40%] text-zinc-900 text-sm font-normal font-['Inter'] leading-5">Regulatory De-risking</div>
              <div className="w-[25%] flex justify-start items-center">
                <div className="px-3 py-1 bg-[#f2ffcc] rounded-full justify-center items-center flex">
                  <span className="text-lime-800 text-[10px] font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">COMPLIANCE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full py-28 bg-[#3182a4] border-t-[6px] border-[#0ea5e9] border-b-[12px] border-[#0f172a] flex flex-col justify-center items-center relative overflow-hidden">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Make every critical telecom decision reviewable.</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6">
            <Link href="#" className="px-8 py-3.5 bg-white hover:bg-gray-50 transition-colors text-[#3182a4] text-xs font-semibold tracking-wide flex justify-center items-center">
              Request Architecture Briefing
            </Link>
            <Link href="#" className="px-8 py-3.5 bg-transparent border border-white hover:bg-white/10 transition-colors text-white text-xs font-semibold tracking-wide flex justify-center items-center">
              Schedule Technical Demo
            </Link>
          </div>

          <div className="flex justify-center items-center">
            <span className="text-white/60 text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-[0.2em]">DEPLOYED TO 12+ TIER-1 OPERATORS GLOBALLY</span>
          </div>
        </div>
      </section>
    </div>
  );
}
