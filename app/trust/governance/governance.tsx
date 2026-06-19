import React from "react";
import {
  Shield,
  FileSearch,
  Building2,
  GitMerge,
  Key,
  EyeOff,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
  Activity,
  AlertTriangle,
  FileText
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Governance() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 font-sans">
      {/* Hero Section */}
      <section className="w-full px-6 lg:px-28 pt-24 pb-32 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-center items-center gap-16">

          <div className="flex-1 flex flex-col justify-start items-start gap-8">
            <div className="px-3 py-1 bg-sky-600/10 rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-600/30 flex justify-start items-start">
              <div className="justify-center text-sky-500 text-sm font-bold font-mono leading-6 uppercase">GOVERNANCE CONTROL LAYER</div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-5">Govern every telecom decision before it becomes operational risk.</div>
            </div>
            <div className="w-full max-w-[576px] flex flex-col justify-start items-start">
              <div className="justify-center text-slate-400 text-base font-normal font-sans leading-6">ZoikoNex governance gives telecom operators a controlled way to manage<br className="hidden lg:block" />roles, approvals, policies, configuration changes, AI-assisted actions,<br className="hidden lg:block" />evidence trails, and operational decisions across brands, jurisdictions,<br className="hidden lg:block" />partners, products, and teams.</div>
            </div>
            <div className="w-full flex flex-col sm:flex-row justify-start items-start gap-4">
              <button className="px-8 py-4 bg-[#2B7EC1] hover:bg-sky-600 transition-colors rounded flex justify-start items-center gap-2">
                <span className="text-center justify-center text-white text-base font-normal font-sans leading-6">Request a Governance Briefing</span>
                <div className="flex flex-col justify-start items-center">
                  <Image src="/image/gover/icon20.svg" alt="Arrow Right" width={18} height={18} />
                </div>
              </button>
              <button className="px-8 py-4 rounded outline outline-1 outline-offset-[-1px] outline-slate-700 hover:bg-slate-800 transition-colors flex flex-col justify-center items-center">
                <span className="text-center justify-center text-white text-base font-normal font-sans leading-6">View Trust Pack</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full p-8 relative bg-gradient-to-br from-slate-800/40 to-transparent rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 backdrop-blur-md flex flex-col justify-start items-start gap-6">
            <div className="absolute inset-0 bg-white/0 rounded-lg shadow-2xl -z-10"></div>

            <div className="w-full pb-4 border-b border-slate-700/50 flex justify-between items-center">
              <div className="flex flex-col justify-start items-start">
                <div className="justify-center text-sky-500 text-sm font-bold font-mono leading-6 uppercase">RAILS: ACTIVE_MONITORING</div>
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="justify-center text-slate-500 text-xs font-bold font-mono leading-4 uppercase">SYS_ID: ZX-990</div>
              </div>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roles */}
              <div className="w-full p-4 bg-sky-900/10 rounded outline outline-1 outline-offset-[-1px] outline-sky-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-sky-500/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon21.svg" alt="Roles" width={24} height={24} className="text-sky-400" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">Roles</div>
                </div>
              </div>

              {/* Approvals */}
              <div className="w-full p-4 bg-lime-900/10 rounded outline outline-1 outline-offset-[-1px] outline-lime-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-lime-400/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon22.svg" alt="Approvals" width={24} height={24} className="text-lime-300" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">Approvals</div>
                </div>
              </div>

              {/* Policies */}
              <div className="w-full p-4 bg-sky-900/10 rounded outline outline-1 outline-offset-[-1px] outline-sky-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-sky-500/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon23.svg" alt="Policies" width={24} height={24} className="text-sky-400" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">Policies</div>
                </div>
              </div>

              {/* Configuration */}
              <div className="w-full p-4 bg-lime-900/10 rounded outline outline-1 outline-offset-[-1px] outline-lime-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-lime-400/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon24.svg" alt="Configuration" width={24} height={24} className="text-lime-300" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">Configuration</div>
                </div>
              </div>

              {/* AI Authority */}
              <div className="w-full p-4 bg-sky-900/10 rounded outline outline-1 outline-offset-[-1px] outline-sky-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-sky-500/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon25.svg" alt="AI Authority" width={24} height={24} className="text-sky-400" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">AI Authority</div>
                </div>
              </div>

              {/* Evidence */}
              <div className="w-full p-4 bg-lime-900/10 rounded outline outline-1 outline-offset-[-1px] outline-lime-700/30 flex flex-col justify-between items-start min-h-[100px] hover:outline-lime-400/50 transition-colors">
                <div className="w-full flex justify-start items-start">
                  <Image src="/image/gover/icon26.svg" alt="Evidence" width={24} height={24} className="text-lime-300" />
                </div>
                <div className="w-full flex flex-col justify-start items-start mt-4">
                  <div className="justify-center text-white text-base font-bold font-mono leading-6">Evidence</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Governance Importance Section */}
      <section className="w-full py-20 lg:py-24 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-start items-start gap-16">
          <div className="w-full max-w-3xl flex flex-col justify-start items-start gap-6">
            <div className="w-full flex flex-col justify-start items-start">
              <h2 className="justify-center text-zinc-900 text-3xl sm:text-4xl font-bold font-['Hanken_Grotesk'] leading-tight">
                Governance is how telecom operators move faster without losing control.
              </h2>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-slate-600 text-base font-normal font-sans leading-relaxed">
                Telecom growth creates configuration complexity. New plans, tax rules, SIM flows, partner offers,<br className="hidden lg:block" />roaming packages, and AI actions can create risk when no one can clearly prove who approved what,<br className="hidden lg:block" />when, and why.
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon8.svg" alt="Faster enterprise approval" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Faster enterprise approval</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Streamline complex decision cycles with<br />pre-defined governance tracks for rapid<br />deployment.</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon9.svg" alt="Lower operational leakage" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Lower operational leakage</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Prevent revenue erosion caused by<br />unauthorized plan changes or<br />misconfigured partner rules.</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon10.svg" alt="Stronger audit confidence" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Stronger audit confidence</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Maintain an immutable record of every<br />configuration change for instantaneous<br />compliance reporting.</div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon11.svg" alt="Clearer customer protection" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Clearer customer protection</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Enforce regulatory and privacy policies<br />automatically across all customer<br />touchpoints.</div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon12.svg" alt="Disciplined partner operations" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Disciplined partner operations</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Set strict boundaries for partner<br />interactions while enabling self-service<br />within approved limits.</div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="w-full p-8 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-shadow">
              <Image src="/image/gover/icon13.svg" alt="Better renewal confidence" width={32} height={32} />
              <div className="w-full pt-2 flex flex-col justify-start items-start">
                <h3 className="justify-center text-zinc-900 text-base font-bold font-['Hanken_Grotesk'] leading-6">Better renewal confidence</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div className="justify-center text-slate-600 text-sm font-normal font-sans leading-relaxed">Retain customers through consistent,<br />policy-driven engagement and renewal<br />logic.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The ZoikoNex governance model */}
      <section className="w-full py-24 bg-[#151E2D] flex flex-col justify-center items-center gap-16">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-start items-center gap-4">
          <div className="flex flex-col justify-start items-center">
            <h2 className="text-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">
              The ZoikoNex governance model
            </h2>
          </div>
          <div className="w-full max-w-2xl flex flex-col justify-start items-center">
            <p className="text-center text-slate-400 text-base font-normal font-sans leading-6">
              A sovereign architectural framework for institutional-grade telecom control.
            </p>
          </div>
        </div>

        <div className="w-full max-w-3xl px-6 flex flex-col justify-start items-start gap-4">
          {/* Item 1 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">01</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon14.svg" alt="Identity & Access Management" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Identity & Access Management</span>
            </div>
          </div>

          {/* Item 2 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">02</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon15.svg" alt="Roles & Decision Rights" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Roles & Decision Rights</span>
            </div>
          </div>

          {/* Item 3 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">03</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon16.svg" alt="Policy Control Engine" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Policy Control Engine</span>
            </div>
          </div>

          {/* Item 4 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">04</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon17.svg" alt="Workflow Approvals" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Workflow Approvals</span>
            </div>
          </div>

          {/* Item 5 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">05</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon18.svg" alt="Configuration Governance" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Configuration Governance</span>
            </div>
          </div>

          {/* Item 6 */}
          <div className="w-full p-6 bg-white/[0.02] rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-sky-500 text-base font-bold font-mono leading-6">06</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon19.svg" alt="AI Authority Framework" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">AI Authority Framework</span>
            </div>
          </div>

          {/* Item 7 */}
          <div className="w-full p-6 bg-sky-900/10 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center gap-6">
            <div className="w-8 flex flex-col justify-start items-start">
              <span className="justify-center text-lime-300 text-base font-bold font-mono leading-6">07</span>
            </div>
            <div className="flex flex-col justify-start items-center w-6">
              <Image src="/image/gover/icon27.svg" alt="Evidence & Auditability" width={20} height={20} />
            </div>
            <div className="flex flex-col justify-start items-start">
              <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Evidence & Auditability</span>
            </div>
          </div>

        </div>
      </section>

      {/* Clear Decision Rights Section */}
      <section className="w-full py-20 bg-[#F8FAFC] flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center justify-center text-zinc-900 text-3xl font-bold font-['Hanken_Grotesk'] leading-tight">
              Clear decision rights for high-impact telecom actions.
            </h2>
          </div>

          <div className="w-full max-w-5xl flex flex-col justify-start items-start gap-8">
            {/* Box 1 */}
            <div className="w-full p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-start items-start">
              <div className="w-full flex flex-col justify-start items-start gap-2 mb-8">
                <div className="flex flex-col justify-start items-start">
                  <span className="justify-center text-[#2B7EC1] text-sm font-bold font-mono uppercase tracking-wider">USE CASE</span>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <h3 className="justify-center text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">New Plan Approval</h3>
                </div>
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-12">
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon28.svg" alt="Requester" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">Requester</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon29.svg" alt="Reviewer" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">Reviewer</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#2B7EC1] rounded-xl flex justify-center items-center shadow-md shadow-sky-500/20">
                    <Image src="/image/gover/icon30.svg" alt="Evidence Capture" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase text-center max-w-[100px]">Evidence Capture</span>
                </div>
              </div>
            </div>

            {/* Box 2 */}
            <div className="w-full p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-start items-start">
              <div className="w-full flex flex-col justify-start items-start gap-2 mb-8">
                <div className="flex flex-col justify-start items-start">
                  <span className="justify-center text-[#2B7EC1] text-sm font-bold font-mono uppercase tracking-wider">USE CASE</span>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <h3 className="justify-center text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Billing Adjustment</h3>
                </div>
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-12">
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon31.svg" alt="Agent" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">Agent</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon33.svg" alt="Supervisor" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">Supervisor</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#2B7EC1] rounded-xl flex justify-center items-center shadow-md shadow-sky-500/20">
                    <Image src="/image/gover/icon32.svg" alt="Ledger Entry" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase text-center max-w-[100px]">Ledger Entry</span>
                </div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="w-full p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-start items-start">
              <div className="w-full flex flex-col justify-start items-start gap-2 mb-8">
                <div className="flex flex-col justify-start items-start">
                  <span className="justify-center text-[#2B7EC1] text-sm font-bold font-mono uppercase tracking-wider">USE CASE</span>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <h3 className="justify-center text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">AI-Assisted Escalation</h3>
                </div>
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-12">
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon34.svg" alt="AI Engine" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">AI Engine</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#1C1C2E] rounded-xl flex justify-center items-center">
                    <Image src="/image/gover/icon35.svg" alt="Ops Lead" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase">Ops Lead</span>
                </div>
                <div className="flex-1 h-[2px] bg-slate-100 hidden sm:block mx-4"></div>
                <div className="flex flex-col justify-start items-center gap-3">
                  <div className="w-14 h-14 bg-[#2B7EC1] rounded-xl flex justify-center items-center shadow-md shadow-sky-500/20">
                    <Image src="/image/gover/icon36.svg" alt="Decision Log" width={24} height={24} />
                  </div>
                  <span className="justify-center text-zinc-900 text-xs font-bold font-mono uppercase text-center max-w-[100px]">Decision Log</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visibility Section */}
      <section className="w-full py-24 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl px-6 flex flex-col lg:flex-row justify-center items-center gap-16">
          <div className="flex-1 flex flex-col justify-start items-start gap-12">
            <div className="w-full flex flex-col justify-start items-start">
              <h2 className="justify-center text-zinc-900 text-3xl font-bold font-['Hanken_Grotesk'] leading-tight">
                Governance leaders need visibility, not guesswork.
              </h2>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-8">
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start">
                  <CheckCircle2 className="w-6 h-6 text-sky-500" />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="w-full flex flex-col justify-start items-start mb-2">
                    <h3 className="justify-center text-zinc-900 text-lg font-bold font-sans leading-6">Real-time status tracking</h3>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start">
                    <p className="justify-center text-slate-600 text-base font-normal font-sans leading-relaxed">
                      Monitor every pending approval across your entire operation from a<br className="hidden lg:block"/>single pane of glass.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start">
                  <CheckCircle2 className="w-6 h-6 text-sky-500" />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="w-full flex flex-col justify-start items-start mb-2">
                    <h3 className="justify-center text-zinc-900 text-lg font-bold font-sans leading-6">Historical version control</h3>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start">
                    <p className="justify-center text-slate-600 text-base font-normal font-sans leading-relaxed">
                      Compare policy changes over time to identify what impacted<br className="hidden lg:block"/>operational metrics.
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start">
                  <CheckCircle2 className="w-6 h-6 text-sky-500" />
                </div>
                <div className="flex-1 flex flex-col justify-start items-start">
                  <div className="w-full flex flex-col justify-start items-start mb-2">
                    <h3 className="justify-center text-zinc-900 text-lg font-bold font-sans leading-6">Risk identification</h3>
                  </div>
                  <div className="w-full flex flex-col justify-start items-start">
                    <p className="justify-center text-slate-600 text-base font-normal font-sans leading-relaxed">
                      Automated flagging for high-risk exceptions that fall outside sovereign<br className="hidden lg:block"/>guardrails.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full p-6 lg:p-8 bg-zinc-100 rounded-2xl border border-slate-200 flex flex-col justify-start items-start shadow-inner">
            <div className="w-full bg-[#1C1C2E] rounded-xl shadow-2xl flex flex-col justify-start items-start overflow-hidden border border-slate-800">
              <div className="w-full p-4 border-b border-white/10 flex justify-between items-center bg-[#151A25]">
                <div className="flex flex-col justify-start items-start">
                  <span className="justify-center text-white text-xs font-bold font-mono tracking-wider leading-6">GOVERNANCE_CONSOLE_V4</span>
                </div>
                <div className="flex justify-start items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-lime-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="w-full p-6 flex flex-col justify-start items-start gap-4 bg-[#1E2532]">
                <div className="w-full flex flex-col sm:flex-row justify-between items-stretch gap-4">
                  <div className="flex-1 p-5 bg-[#252D3D] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-2 shadow-sm">
                    <div className="w-full flex flex-col justify-start items-start">
                      <span className="justify-center text-slate-400 text-xs font-bold font-mono uppercase tracking-widest">PENDING APPROVALS</span>
                    </div>
                    <div className="w-full flex flex-col justify-start items-start">
                      <span className="justify-center text-white text-4xl font-bold font-sans leading-none mt-1">12</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 bg-[#252D3D] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-2 shadow-sm">
                    <div className="w-full flex flex-col justify-start items-start">
                      <span className="justify-center text-slate-400 text-xs font-bold font-mono uppercase tracking-widest">POLICY CHANGES</span>
                    </div>
                    <div className="w-full flex flex-col justify-start items-start">
                      <span className="justify-center text-lime-400 text-4xl font-bold font-sans leading-none mt-1">04</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full p-5 bg-red-950/30 rounded-lg border border-red-900/50 flex flex-col justify-start items-start mt-2">
                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col justify-start items-start gap-1">
                      <div className="w-full flex flex-col justify-start items-start">
                        <span className="justify-center text-red-500 text-xs font-bold font-mono uppercase tracking-widest mb-1">HIGH-RISK EXCEPTIONS</span>
                      </div>
                      <div className="w-full flex flex-col justify-start items-start">
                        <span className="justify-center text-white text-2xl font-bold font-sans leading-none mt-1">02 DETECTED</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>
                
                <div className="w-full p-5 bg-[#252D3D] rounded-lg border border-white/5 flex flex-col justify-start items-start gap-4 mt-2 shadow-sm">
                  <div className="w-full flex flex-col justify-start items-start mb-1">
                    <span className="justify-center text-slate-400 text-xs font-bold font-mono uppercase tracking-widest">RECENT ACTIVITY</span>
                  </div>
                  <div className="w-full pb-3 border-b border-white/5 flex justify-between items-center">
                    <div className="flex flex-col justify-start items-start">
                      <span className="justify-center text-slate-300 text-sm font-medium font-sans">Roaming_Policy_v2.1</span>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <span className="justify-center text-lime-400 text-xs font-bold font-sans tracking-wide">APPROVED</span>
                    </div>
                  </div>
                  <div className="w-full pt-1 flex justify-between items-center">
                    <div className="flex flex-col justify-start items-start">
                      <span className="justify-center text-slate-300 text-sm font-medium font-sans">Ent_Plan_Gold_Adjust</span>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <span className="justify-center text-sky-400 text-xs font-bold font-sans tracking-wide">IN REVIEW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Review Timeline */}
      <section className="w-full py-24 bg-gray-800 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">
              Built to support enterprise review.
            </h2>
          </div>
          
          <div className="w-full relative flex flex-col justify-start items-center overflow-x-auto">
            <div className="min-w-[1152px] relative flex flex-col justify-start items-center mx-auto">
              <div className="w-[1152px] h-px absolute top-[48px] bg-stone-300/20 z-0"></div>
              
              <div className="w-full flex justify-center items-start gap-8 z-10">
                
                {/* 1 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-sky-600 inline-flex justify-center items-center">
                      <span className="text-center justify-center text-sky-600 text-base font-bold font-sans leading-6">1</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 01</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Initial Overview</span>
                </div>

                {/* 2 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-stone-300/30 inline-flex justify-center items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-bold font-sans leading-6">2</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 02</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Trust Pack Request</span>
                </div>

                {/* 3 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-stone-300/30 inline-flex justify-center items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-bold font-sans leading-6">3</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 03</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Architecture Briefing</span>
                </div>

                {/* 4 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-stone-300/30 inline-flex justify-center items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-bold font-sans leading-6">4</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 04</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Security Review</span>
                </div>

                {/* 5 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl outline outline-2 outline-offset-[-2px] outline-stone-300/30 inline-flex justify-center items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-bold font-sans leading-6">5</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 05</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Role Mapping</span>
                </div>

                {/* 6 */}
                <div className="w-44 inline-flex flex-col justify-start items-center">
                  <div className="w-12 h-16 pb-6 flex flex-col justify-start items-start">
                    <div className="w-12 h-12 bg-[#BFF059] rounded-xl flex justify-center items-center">
                      <span className="text-center justify-center text-lime-950 text-base font-bold font-sans leading-6">6</span>
                    </div>
                  </div>
                  <div className="pb-2 flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-center">
                      <span className="text-center justify-center text-gray-500 text-base font-normal font-mono leading-6">Phase 06</span>
                    </div>
                  </div>
                  <span className="text-center justify-center text-white text-base font-bold font-sans leading-6">Implementation</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="w-full py-32 bg-[#0284c7] flex flex-col justify-center items-center border-b-[16px] border-gray-900">
        <div className="w-full max-w-4xl px-6 flex flex-col justify-start items-center gap-10">
          <div className="flex flex-col justify-start items-center gap-6">
            <div className="text-center justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">
              Bring executive control to telecom monetization.
            </div>
            <div className="text-center justify-center text-white text-base font-normal font-['Inter'] leading-6">
              ZoikoNex governance gives your team a structured path to scale with confidence. Start<br />your transition to sovereign control today.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="px-6 py-3 bg-[#20232D] hover:bg-[#15171E] transition-colors rounded-md flex justify-center items-center">
              <span className="text-center text-white text-sm font-medium font-sans">Request a Governance Briefing</span>
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors rounded-md flex justify-center items-center">
              <span className="text-center text-white text-sm font-medium font-sans">View Evidence Ledger</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
