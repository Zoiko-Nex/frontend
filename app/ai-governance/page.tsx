"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, AlertTriangle, Settings, Layout, Key, UserCheck, FileText, CheckCircle, MessageSquare } from "lucide-react";

// EDIT IMAGE LINKS HERE
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";
const LEDGER_IMAGE_URL = "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop";

export default function AIGovernance() {
  return (
    <div className="bg-[#0f121b] text-white min-h-screen font-sans">
      
      {/* HERO SECTION */}
      <section className="w-full relative overflow-hidden pt-16 pb-32 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-start items-start gap-8 relative z-10">
            <div className="px-3 py-2.5 bg-lime-300/10 rounded-sm outline outline-1 outline-offset-[-1px] outline-lime-300/30 inline-flex justify-start items-start">
              <div className="justify-center text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">ENTERPRISE AI CONTROL</div>
            </div>
            <div className="flex flex-col justify-start items-start">
              <h1 className="justify-center text-white text-6xl font-bold font-['Hanken_Grotesk'] leading-[75px]">
                AI that accelerates<br/>telecom operations —<br/>without surrendering<br/>control.
              </h1>
            </div>
            <div className="max-w-[576px] flex flex-col justify-start items-start">
              <p className="justify-center text-gray-400 text-lg font-normal font-['Inter'] leading-7">
                ZoikoNex governs AI across telecom workflows with policy<br className="hidden md:block"/>boundaries, permission controls, human approvals, evidence<br className="hidden md:block"/>records and risk-tiered automation.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row justify-start items-start gap-4">
              <Link href="#" className="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-sm flex flex-col justify-center items-center">
                <span className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Request an AI Governance Briefing</span>
              </Link>
              <Link href="#" className="px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white hover:bg-white/10 transition-colors flex flex-col justify-center items-center">
                <span className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Explore the Evidence Ledger</span>
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col justify-start items-start w-full mt-10 lg:mt-0 z-10">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-sky-600 to-lime-300 rounded-lg blur-xl transform scale-105"></div>
            <div className="w-full p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-md flex flex-col justify-start items-start overflow-hidden relative z-10 shadow-2xl">
              
              <div className="w-full pb-4 flex flex-col justify-start items-start">
                <div className="w-full pb-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <span className="justify-center text-white/40 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">ZOIKONEX_CONTROL_PLANE_V2.4</span>
                  </div>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                
                {/* Left Column */}
                <div className="w-full md:pr-6 md:border-r border-white/10 flex flex-col justify-start items-start gap-6">
                  <div className="w-full p-4 bg-white/5 rounded-sm border border-white/5 flex flex-col justify-start items-start gap-2">
                    <span className="text-white/50 text-[10px] font-normal font-['Inter'] leading-4">AI SUGGESTION [TOKEN_RETENTION]</span>
                    <span className="text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-5">ADJUST CUSTOMER BILLING -15%<br/>FOR OUTAGE RECOVERY</span>
                  </div>
                  
                  <div className="w-full p-4 relative bg-white/5 rounded-sm border border-sky-600/30 flex flex-col justify-start items-start gap-2">
                    <div className="absolute right-4 -top-2.5 px-2 py-0.5 bg-sky-600 rounded-sm flex flex-col justify-start items-start shadow-md">
                      <span className="justify-center text-white text-[9px] font-bold font-['JetBrains_Mono'] leading-3">POLICY_GATE</span>
                    </div>
                    <span className="text-white/50 text-[10px] font-normal font-['Inter'] leading-4">THRESHOLD CHECK</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-white text-xs font-normal font-['Inter'] leading-5">MAX ADJUSTMENT: 10% |</span>
                      <span className="text-red-500 text-xs font-normal font-['Inter'] leading-5">EXCEEDED</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <div className="w-full flex justify-between items-center pb-2">
                    <span className="text-white/50 text-[10px] font-bold font-['Inter'] uppercase tracking-wider leading-4">EVIDENCE LEDGER</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/image/governance/icon8.svg" className="w-4 h-4 opacity-80" alt="Evidence Ledger" />
                  </div>
                  <div className="w-full flex flex-col justify-start items-start gap-4">
                    <div className="w-full pb-3 border-b border-white/5">
                      <span className="text-white/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-tight block mb-1">[2024-05-12T14:30:21Z]</span>
                      <span className="text-white/90 text-[11px] font-normal font-['JetBrains_Mono'] leading-tight block">AUTH_LEVEL: L3_PREPARE</span>
                    </div>
                    <div className="w-full pb-3 border-b border-white/5">
                      <span className="text-white/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-tight block mb-1">[2024-05-12T14:30:22Z]</span>
                      <span className="text-white/90 text-[11px] font-normal font-['JetBrains_Mono'] leading-tight block">POLICY: RETENTION_OFFER_LIMIT_V1</span>
                    </div>
                    <div className="w-full pb-3 border-b border-transparent">
                      <span className="text-white/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-tight block mb-1">[2024-05-12T14:30:25Z]</span>
                      <span className="text-white/90 text-[11px] font-normal font-['JetBrains_Mono'] leading-tight block">STATUS: BLOCKED - HUMAN_SIG_REQ</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* RISKS SECTION */}
      <section className="w-full py-28 bg-[#0f121b] border-t border-b border-white/5 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
          
          <div className="w-full max-w-[768px] flex flex-col justify-start items-start gap-6">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
              Telecom AI must be fast enough to help —<br className="hidden md:block"/>and controlled enough to trust.
            </h2>
            <div className="w-24 h-1 bg-cyan-700"></div>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Commercial Risk */}
            <div className="w-full p-8 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/governance/icon9.svg" className="w-8 h-6 object-contain" alt="Commercial Risk" />
              <div className="pt-2 flex flex-col justify-start items-start w-full">
                <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Commercial Risk</h3>
              </div>
              <div className="flex flex-col justify-start items-start w-full">
                <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                  Prevent AI from auto-generating margin-dilutive offers or incorrect loyalty incentives that compromise long-term ARPU targets.
                </p>
              </div>
            </div>

            {/* Financial Risk */}
            <div className="w-full p-8 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/governance/icon10.svg" className="w-7 h-7 object-contain" alt="Financial Risk" />
              <div className="pt-2 flex flex-col justify-start items-start w-full">
                <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Financial Risk</h3>
              </div>
              <div className="flex flex-col justify-start items-start w-full">
                <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                  Mitigate incorrect adjustments in automated billing reconciliation and credit control, ensuring ledger integrity across complex BSS stacks.
                </p>
              </div>
            </div>

            {/* Compliance Risk */}
            <div className="w-full p-8 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/governance/icon11.svg" className="w-6 h-7 object-contain" alt="Compliance Risk" />
              <div className="pt-2 flex flex-col justify-start items-start w-full">
                <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Compliance Risk</h3>
              </div>
              <div className="flex flex-col justify-start items-start w-full">
                <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                  Enforce strict data boundaries and PII protection within LLM prompts, ensuring every AI transaction adheres to local regulatory sovereign mandates.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="w-full py-24 bg-[#0f121b] border-t border-white/5 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-start items-start gap-6">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[50px]">
              Four authority levels.<br/>Clear boundaries.<br/>No black-box control.
            </h2>
            <p className="text-gray-500 text-lg font-normal font-['Inter'] leading-7">
              Every AI implementation in ZoikoNex is assigned a specific risk tier<br className="hidden lg:block"/>that determines exactly how much autonomous power it<br className="hidden lg:block"/>possesses.
            </p>
            <div className="pt-2.5 flex justify-start items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/governance/icon12.svg" className="w-4 h-6 object-contain" alt="NIST" />
              <span className="text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">ALIGNED WITH NIST AI RMF FRAMEWORK</span>
            </div>
          </div>

          <div className="relative pl-10 md:pl-12 flex flex-col justify-start items-start gap-8">
            {/* Gradient Line */}
            <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-gradient-to-b from-lime-300 via-sky-600 to-white/10 opacity-50"></div>
            
            {/* LEVEL 4 */}
            <div className="relative w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-full flex justify-between items-center">
                <span className="text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">LEVEL 4</span>
                <div className="px-2 py-1 bg-lime-300/20 rounded-sm">
                  <span className="text-lime-300 text-[10px] font-normal font-['Inter'] leading-4">EXECUTE WITH CONTROLS</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                AI executes actions automatically within strict, predefined budget and<br className="hidden lg:block"/>operational guardrails. Immediate audit log creation.
              </p>
              <div className="absolute left-[-45px] md:left-[-53px] top-6 w-3 h-3 bg-lime-300 rounded-full shadow-[0px_0px_10px_0px_rgba(191,243,101,0.8)] ring-[6px] ring-[#0f121b]"></div>
            </div>

            {/* LEVEL 3 */}
            <div className="relative w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-full flex justify-between items-center">
                <span className="text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">LEVEL 3</span>
                <div className="px-2 py-1 bg-sky-600/20 rounded-sm">
                  <span className="text-sky-600 text-[10px] font-normal font-['Inter'] leading-4">PREPARE</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                AI stages technical workflows and drafts response packets. Action is<br className="hidden lg:block"/>suspended until a qualified human operator clicks &quot;Deploy&quot;.
              </p>
              <div className="absolute left-[-45px] md:left-[-53px] top-6 w-3 h-3 bg-sky-600 rounded-full ring-[6px] ring-[#0f121b]"></div>
            </div>

            {/* LEVEL 2 */}
            <div className="relative w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-full flex justify-between items-center">
                <span className="text-white/60 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">LEVEL 2</span>
                <div className="px-2 py-1 bg-white/10 rounded-sm">
                  <span className="text-white/60 text-[10px] font-normal font-['Inter'] leading-4">RECOMMEND</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                AI analyzes options and presents the best course of action to the<br className="hidden lg:block"/>operator. No capability to interact with live downstream systems.
              </p>
              <div className="absolute left-[-45px] md:left-[-53px] top-6 w-3 h-3 bg-white/40 rounded-full ring-[6px] ring-[#0f121b]"></div>
            </div>

            {/* LEVEL 1 */}
            <div className="relative w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start items-start gap-4 shadow-lg backdrop-blur-sm">
              <div className="w-full flex justify-between items-center">
                <span className="text-white/30 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">LEVEL 1</span>
                <div className="px-2 py-1 bg-white/5 rounded-sm">
                  <span className="text-white/40 text-[10px] font-normal font-['Inter'] leading-4">INFORM</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Passive analysis and pattern detection. AI provides dashboard-level<br className="hidden lg:block"/>intelligence without any direct operational influence.
              </p>
              <div className="absolute left-[-45px] md:left-[-53px] top-6 w-3 h-3 bg-white/20 rounded-full ring-[6px] ring-[#0f121b]"></div>
            </div>

          </div>

        </div>
      </section>

      {/* CONTROL PLANE GRID */}
      <section className="w-full px-6 pt-14 pb-20 bg-[#0f121b] border-t border-white/5 flex flex-col justify-center items-center gap-16">
        <div className="w-full max-w-[1280px] flex flex-col justify-start items-center gap-4">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">The control plane around every AI action.</h2>
          </div>
          <div className="w-full max-w-[672px] flex flex-col justify-start items-center">
            <p className="text-center text-gray-500 text-base font-normal font-['Inter'] leading-6">
              Enterprise-grade architecture for managing large-scale AI deployments within Tier-1<br className="hidden md:block"/>telecom infrastructure.
            </p>
          </div>
        </div>

        <div className="w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* AI Use-Case Registry */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon13.svg" className="w-6 h-6 object-contain" alt="AI Use-Case Registry" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">AI Use-Case Registry</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Centralized database of every active AI model, its training source, and its assigned operational domain.
              </p>
            </div>
          </div>

          {/* Policy Engine */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon14.svg" className="w-6 h-5 object-contain" alt="Policy Engine" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Policy Engine</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Deterministic rules that intercept AI outputs and validate them against business constraints before execution.
              </p>
            </div>
          </div>

          {/* Prompt Governance */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon15.svg" className="w-6 h-5 object-contain" alt="Prompt Governance" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Prompt Governance</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Hard-coded system prompts that prevent LLM drift and enforce sovereign data residency and privacy rules.
              </p>
            </div>
          </div>

          {/* Permission Scope */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon16.svg" className="w-6 h-6 object-contain" alt="Permission Scope" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Permission Scope</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Role-based access control (RBAC) extended to AI agents, defining which API endpoints an AI can hit.
              </p>
            </div>
          </div>

          {/* Human-in-the-Loop Gates */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon17.svg" className="w-6 h-6 object-contain" alt="Human-in-the-Loop Gates" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Human-in-the-Loop Gates</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Dynamic routing of AI actions to specific operational supervisors based on risk tier and value threshold.
              </p>
            </div>
          </div>

          {/* Evidence & Audit Trail */}
          <div className="w-full p-8 bg-white/5 outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-sm flex flex-col justify-start items-start gap-2 hover:bg-white/10 transition-colors rounded-sm shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/image/governance/icon18.svg" className="w-6 h-5 object-contain" alt="Evidence & Audit Trail" />
            <div className="pt-2 flex flex-col justify-start items-start w-full">
              <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Evidence & Audit Trail</h3>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">
                Immutable ledger of every AI decision, including the prompt, the response, and the policy check result.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* TABLE SECTION */}
      <section className="w-full py-28 bg-[#0f121b] flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-12">
          
          <div className="flex flex-col justify-start items-start">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Governance Applied: Telecom Workflows</h2>
          </div>
          
          <div className="w-full flex flex-col justify-start items-start overflow-x-auto">
            <div className="min-w-[1000px] w-full flex flex-col justify-start items-start">
              
              {/* Header */}
              <div className="w-full border-b border-white/20 grid grid-cols-[240px_320px_384px_1fr]">
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Use Case</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">AI Role</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-white text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Governance Boundary</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Outcome</span>
                </div>
              </div>

              {/* Row 1 */}
              <div className="w-full border-b border-white/10 grid grid-cols-[240px_320px_384px_1fr]">
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-white text-base font-bold font-['Inter'] leading-6">Revenue Assurance</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-white text-sm font-normal font-['Inter'] leading-5">Identify leaked revenue patterns</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">L1: Inform - Analyst Review Required</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-sky-600 text-base font-bold font-['Inter'] leading-6">0% Erroneous Adjustments</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="w-full border-b border-white/10 grid grid-cols-[240px_320px_384px_1fr]">
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-white text-base font-bold font-['Inter'] leading-6">Customer Retention</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-white text-sm font-normal font-['Inter'] leading-5">Predict churn & draft offers</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">L3: Prepare - Max Offer Value Cap</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-sky-600 text-base font-bold font-['Inter'] leading-6">22% Increased Margin</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="w-full border-b border-white/10 grid grid-cols-[240px_320px_384px_1fr]">
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-white text-base font-bold font-['Inter'] leading-6">Billing Support</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-white text-sm font-normal font-['Inter'] leading-5">Summarize billing disputes</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">L2: Recommend - PII Sanitized</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-sky-600 text-base font-bold font-['Inter'] leading-6">40% Faster Resolution</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="w-full border-b border-white/10 grid grid-cols-[240px_320px_384px_1fr]">
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-white text-base font-bold font-['Inter'] leading-6">Compliance Review</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-white text-sm font-normal font-['Inter'] leading-5">Audit call center transcripts</span>
                </div>
                <div className="px-4 pt-6 pb-7 flex flex-col justify-start items-start">
                  <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">L4: Auto-Flag - Regulatory Policy</span>
                </div>
                <div className="px-4 py-6 flex flex-col justify-start items-start">
                  <span className="text-sky-600 text-base font-bold font-['Inter'] leading-6">100% Audit Coverage</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM FEATURE */}
      <section className="w-full py-28 bg-black/40 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col justify-start items-start gap-8">
            <div className="flex flex-col justify-start items-start">
              <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
                Built for accountable AI<br className="hidden md:block"/>management — not unbounded<br className="hidden md:block"/>automation.
              </h2>
            </div>
            <div className="flex flex-col justify-start items-start">
              <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">
                ZoikoNex is designed to support the highest global standards for AI safety<br className="hidden md:block"/>and institutional control. Our architecture allows for rapid adoption of AI<br className="hidden md:block"/>capabilities while maintaining the strict evidence requirements of Tier-1<br className="hidden md:block"/>operators.
              </p>
            </div>
            
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <span className="text-lime-300 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">FRAMEWORK ALIGNMENT</span>
                <span className="text-white text-sm font-bold font-['Inter'] leading-5">NIST AI RMF 1.0</span>
              </div>
              <div className="p-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <span className="text-lime-300 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">GLOBAL STANDARD</span>
                <span className="text-white text-sm font-bold font-['Inter'] leading-5">ISO/IEC 42001</span>
              </div>
              <div className="p-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <span className="text-lime-300 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">REGULATORY COMPLIANCE</span>
                <span className="text-white text-sm font-bold font-['Inter'] leading-5">EU AI Act Support</span>
              </div>
              <div className="p-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <span className="text-lime-300 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">SECURITY OPS</span>
                <span className="text-white text-sm font-bold font-['Inter'] leading-5">SOC2 Type II</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="w-80 h-80 relative flex justify-center items-center group">
              {/* Outer Glow & Border */}
              <div className="absolute inset-0 bg-sky-600/20 rounded-xl blur-[32px] group-hover:bg-sky-600/30 transition-colors duration-500"></div>
              <div className="absolute inset-0 rounded-xl border-4 border-white/10"></div>
              
              {/* Inner Card */}
              <div className="relative w-48 h-48 p-4 bg-[#151926] rounded-lg outline outline-2 outline-offset-[-2px] outline-lime-300 flex flex-col justify-center items-center shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500">
                <div className="pb-6 flex flex-col justify-start items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/image/governance/icon19.svg" className="w-11 h-11 object-contain" alt="Sovereign Control" />
                </div>
                <div className="flex flex-col justify-start items-center text-center">
                  <span className="text-white text-xs font-normal font-['JetBrains_Mono'] leading-4 tracking-wider uppercase">SOVEREIGN<br/>CONTROL</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full relative overflow-hidden py-28 border-t border-white/5 flex justify-center items-center bg-[#0f121b]">
        {/* Subtle radial glow matching user request */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-600/10 via-[#0f121b]/0 to-transparent"></div>
        
        <div className="relative w-full max-w-[896px] px-6 flex flex-col justify-start items-center gap-10">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-4xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight md:leading-[66px]">
              Bring AI into telecom operations<br className="hidden md:block"/>without losing control.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full sm:w-auto">
            <Link href="#" className="w-full sm:w-auto px-10 py-5 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-sm flex flex-col justify-center items-center">
              <span className="text-center text-white text-lg font-semibold font-['Inter'] leading-7">Request an AI Governance Briefing</span>
            </Link>
            <Link href="#" className="w-full sm:w-auto px-10 py-5 bg-transparent hover:bg-white/5 transition-colors rounded-sm outline outline-1 outline-offset-[-1px] outline-white/30 flex flex-col justify-center items-center">
              <span className="text-center text-white text-lg font-semibold font-['Inter'] leading-7">View Evidence Ledger</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
