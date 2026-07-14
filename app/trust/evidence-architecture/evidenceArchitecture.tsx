import React from "react";
import {
  FileText,
  Scale,
  Cpu,
  Database,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe,
  ArrowRight,
  ShieldAlert,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EvidenceArchitecture() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-slate-300 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex-1 pt-2 inline-flex flex-col justify-start items-start gap-4">
            <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-[2.40px]">
              OPERATIONAL INTEGRITY
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-white text-4xl sm:text-5xl lg:text-6xl font-bold font-sans leading-tight">
                Designed evidence for every critical telecom decision.
              </div>
            </div>
            <div className="w-full max-w-[576px] pt-1.5 pb-[0.60px] flex flex-col justify-start items-start">
              <div className="justify-center text-slate-400 text-lg font-normal font-sans leading-7">
                ZoikoNex structures evidence across the operating events that
                matter most in telecom, transforming raw activity into immutable
                governance signals.
              </div>
            </div>
            <div className="self-stretch pt-4 inline-flex justify-start items-start">
              <Link href="/contact-us">
                <button className="px-8 py-4 bg-[#2B7EC1] hover:bg-sky-600 transition-colors rounded-lg flex justify-center items-center gap-2">
                  <span className="text-center justify-center text-white text-lg font-normal font-sans leading-7">
                    Request an Evidence Architecture Brief
                  </span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 flex-1 relative inline-flex flex-col justify-start items-start w-full mt-12 lg:mt-0">
            <div className="w-full h-full absolute opacity-25 bg-gradient-to-r from-lime-300 to-sky-600 rounded-lg blur-xl -z-10 scale-105"></div>
            <div className="self-stretch p-8 bg-gray-900/50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 backdrop-blur-md inline-flex justify-center items-center overflow-hidden w-full">
              <div className="flex-1 self-stretch flex flex-col sm:flex-row justify-center items-stretch w-full min-h-[300px]">

                {/* Left Column: Sources */}
                <div className="sm:pr-8 py-4 sm:py-10 border-b sm:border-b-0 sm:border-r border-slate-700/50 flex flex-col justify-between items-start gap-4">
                  <div className="w-full p-3 bg-zinc-900 rounded outline outline-1 outline-offset-[-1px] outline-lime-300/30 flex justify-start items-center gap-3">
                    <div className="flex flex-col justify-start items-start">
                      <div className="w-5 h-3.5 bg-lime-300"></div>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <div className="justify-center text-slate-300 text-[10px] font-normal font-mono leading-4"></div>
                    </div>
                  </div>
                  <div className="w-full p-3 bg-zinc-900 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center">
                    <Image src="/image/archi/source-user.svg" alt="Source Database" width={20} height={20} />
                  </div>
                  <div className="w-full p-3 bg-zinc-900 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex justify-start items-center">
                    <Image src="/image/archi/evidence-core.svg" alt="Source User" width={20} height={20} />
                  </div>
                </div>

                {/* Center Block: Evidence Core */}
                <div className="relative flex-1 flex justify-center items-center py-8 sm:py-0">
                  <div className="absolute w-full h-px top-1/2 -translate-y-1/2 bg-gradient-to-r from-lime-300/50 to-sky-600/50 -z-10"></div>
                  <div className="w-48 h-48 p-4 bg-zinc-900 rounded-xl outline outline-1 outline-offset-[-1px] outline-lime-300 flex flex-col justify-center items-center relative z-10 shadow-[0_0_30px_rgba(132,204,22,0.15)]">
                    <div className="pb-4 flex flex-col justify-start items-start">
                      <Image src="/image/archi/evidence-output.svg" alt="Evidence Core" width={36} height={36} />
                    </div>
                    <div className="flex flex-col justify-start items-center">
                      <div className="text-center justify-center text-white text-xs font-bold font-mono leading-4">EVIDENCE CORE</div>
                    </div>
                    <div className="pt-2 flex flex-col justify-start items-start">
                      <div className="flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-slate-400 text-[10px] font-normal font-sans leading-4 tracking-wider">REAL-TIME FABRIC</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Output */}
                <div className="sm:pl-8 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-700/50 flex flex-col justify-center items-start">
                  <div className="w-full p-4 bg-lime-300/10 rounded outline outline-1 outline-offset-[-1px] outline-lime-300/50 flex flex-col justify-start items-start gap-2 relative">
                    <div className="flex flex-col justify-start items-start">
                      <div className="justify-center text-lime-300 text-[10px] font-normal font-mono leading-4 tracking-wider">OUTPUT</div>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <div className="justify-center text-white/90 text-sm font-bold font-sans leading-5">GOVERNANCE<br />INSIGHTS</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Architecture Matters */}
      <section className="w-full pt-4 pb-11 bg-gray-900/20 border-t border-b border-slate-300/5 inline-flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full flex flex-col justify-start items-center gap-4">
            <div className="w-full flex flex-col justify-start items-center mt-12">
              <h2 className="text-center justify-center text-white text-4xl font-semibold font-sans leading-[48px]">
                Why Architecture Matters
              </h2>
            </div>
            <div className="w-full max-w-[672px] flex flex-col justify-start items-center">
              <p className="text-center justify-center text-gray-400 text-base font-normal font-sans leading-6">
                Randomly logging events isn&apos;t evidence. Structural integrity determines your resilience
                <br className="hidden sm:block" />
                against disputes and risk.
              </p>
            </div>
          </div>
          
          <div className="w-full inline-flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-8">
            <div className="flex-1 p-8 bg-gray-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-start items-start gap-3 transition-colors hover:outline-sky-500/50">
              <div className="w-12 h-12 bg-sky-600/10 rounded flex justify-center items-center">
                <Image src="/image/archi/billing-disputes.svg" alt="Billing Disputes" width={20} height={20} />
              </div>
              <div className="w-full pt-3 flex flex-col justify-start items-start">
                <h3 className="w-full text-white text-2xl font-semibold font-sans leading-8">Billing Disputes</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <p className="w-full text-gray-400 text-base font-normal font-sans leading-6">
                  Reduce resolution time by 80% with cross-referenced rating rules and event binding that provides undeniable proof of service.
                </p>
              </div>
            </div>
            
            <div className="flex-1 p-8 bg-gray-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-start items-start gap-3 transition-colors hover:outline-lime-300/50">
              <div className="w-12 h-12 bg-lime-300/10 rounded flex justify-center items-center">
                <Image src="/image/archi/tax-compliance.svg" alt="Tax & Compliance" width={20} height={20} />
              </div>
              <div className="w-full pt-3 flex flex-col justify-start items-start">
                <h3 className="w-full text-white text-2xl font-semibold font-sans leading-8">Tax & Compliance</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <p className="w-full text-gray-400 text-base font-normal font-sans leading-6">
                  Pass infrastructure-grade audits with structured evidence packages that meet global sovereign data requirements.
                </p>
              </div>
            </div>
            
            <div className="flex-1 p-8 bg-gray-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-start items-start gap-3 transition-colors hover:outline-red-700/50">
              <div className="w-12 h-12 bg-red-700/10 rounded flex justify-center items-center">
                <Image src="/image/archi/ai-risk.svg" alt="AI Risk" width={20} height={20} />
              </div>
              <div className="w-full pt-3 flex flex-col justify-start items-start">
                <h3 className="w-full text-white text-2xl font-semibold font-sans leading-8">AI Risk</h3>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <p className="w-full text-gray-400 text-base font-normal font-sans leading-6">
                  Govern automated decisions. Ensure your AI agents act on &quot;Known Truth&quot; evidence rather than hallucinated legacy data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Evidence Fabric Model */}
      <section className="py-24 w-full inline-flex justify-center items-center">
        <div className="w-full max-w-7xl px-6 lg:px-28 inline-flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20">
          <div className="flex-1 w-full relative rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] min-h-[250px]">
            <Image src="/image/archi/data.jpg" alt="Evidence Fabric Model Data" fill className="object-cover" />
          </div>
          
          <div className="flex-1 pt-2 inline-flex flex-col justify-start items-start gap-4 w-full">
            <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider">
              7-LAYER STACK
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <h2 className="self-stretch justify-center text-white text-3xl sm:text-4xl font-semibold font-sans leading-[48px]">
                The Evidence Fabric Model
              </h2>
            </div>
            
            <div className="self-stretch pt-4 flex flex-col justify-start items-start gap-4">
              {/* Layer 07 */}
              <div className="self-stretch p-4 bg-gray-900 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/50 inline-flex justify-start items-center gap-4">
                <div className="w-8 h-8 bg-lime-300 rounded flex justify-center items-center shrink-0">
                  <div className="text-center justify-center text-lime-950 text-base font-bold font-sans leading-6">07</div>
                </div>
                <div className="inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">Governance Insights</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-400 text-sm font-normal font-sans leading-5">Buyer Value: Institutional trust and executive risk clarity.</div>
                  </div>
                </div>
              </div>
              
              {/* Layer 06 */}
              <div className="self-stretch p-4 bg-gray-900/60 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/30 inline-flex justify-start items-center gap-4">
                <div className="w-8 h-8 bg-sky-600 rounded flex justify-center items-center shrink-0">
                  <div className="text-center justify-center text-white text-base font-bold font-sans leading-6">06</div>
                </div>
                <div className="inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">Review & Export</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-400 text-sm font-normal font-sans leading-5">Buyer Value: Drastic reduction in legal discovery costs.</div>
                  </div>
                </div>
              </div>
              
              {/* Layer 05 */}
              <div className="self-stretch p-4 opacity-80 bg-gray-900/40 rounded outline outline-1 outline-offset-[-1px] outline-slate-700/30 inline-flex justify-start items-center gap-4">
                <div className="w-8 h-8 bg-gray-500 rounded flex justify-center items-center shrink-0">
                  <div className="text-center justify-center text-gray-900 text-base font-bold font-sans leading-6">05</div>
                </div>
                <div className="inline-flex flex-col justify-start items-start">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">Protection</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-400 text-sm font-normal font-sans leading-5">Buyer Value: Zero-trust integrity for critical data assets.</div>
                  </div>
                </div>
              </div>
              
              <div className="self-stretch py-2 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-gray-500/40 text-base font-normal font-sans leading-6">... (View all 7 layers in the Architecture Brief) ...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Telecom Evidence Map */}
      <section className="w-full py-28 bg-zinc-900 inline-flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl px-6 flex flex-col justify-start items-start gap-12">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center justify-center text-white text-4xl font-semibold font-sans leading-[48px]">
              Telecom Evidence Map
            </h2>
          </div>
          
          <div className="w-full bg-gray-900/30 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 backdrop-blur-[2px] flex flex-col justify-start items-start overflow-x-auto">
            <div className="min-w-[1000px] w-full flex flex-col justify-start items-start">
              
              {/* Table Header */}
              <div className="w-full bg-gray-900 border-b border-slate-700/50 flex justify-start items-start">
                <div className="w-72 p-6 flex flex-col justify-start items-start shrink-0">
                  <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider">
                    Evidence Object
                  </div>
                </div>
                <div className="w-52 p-6 flex flex-col justify-start items-start shrink-0">
                  <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider">
                    Primary Stakeholder
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-start items-start min-w-[300px]">
                  <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider">
                    Sales & Retention Value
                  </div>
                </div>
                <div className="w-32 p-6 flex flex-col justify-start items-start shrink-0">
                  <div className="justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider">
                    Action
                  </div>
                </div>
              </div>
              
              {/* Table Body */}
              <div className="w-full flex flex-col justify-start items-start">
                
                {/* Row 1 */}
                <div className="w-full flex justify-start items-start hover:bg-slate-800/30 transition-colors">
                  <div className="w-72 px-6 py-6 flex flex-col justify-start items-start shrink-0">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">
                      Identity Verification (KYC)
                    </div>
                  </div>
                  <div className="w-52 px-6 pt-7 pb-6 flex flex-col justify-start items-start shrink-0">
                    <div className="px-3 py-1 bg-gray-500/10 rounded flex justify-start items-start">
                      <div className="justify-center text-gray-500 text-xs font-normal font-mono leading-4">
                        LEGAL / COMPLIANCE
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 px-6 py-6 flex flex-col justify-start items-start min-w-[300px]">
                    <div className="justify-center text-gray-500 text-base font-normal font-sans leading-6">
                      Reduces churn by simplifying secure re-authentication flows.
                    </div>
                  </div>
                  <div className="w-32 px-6 pt-7 pb-6 flex flex-col justify-start items-start shrink-0">
                    <Link href="#" className="justify-center text-lime-300 hover:text-lime-400 text-sm font-bold font-sans underline leading-5 transition-colors">
                      View Specs
                    </Link>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="w-full border-t border-slate-700/50 flex justify-start items-start hover:bg-slate-800/30 transition-colors">
                  <div className="w-72 px-6 py-6 flex flex-col justify-start items-start shrink-0">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">
                      Plan Configuration Snapshot
                    </div>
                  </div>
                  <div className="w-52 px-6 pt-7 pb-6 flex flex-col justify-start items-start shrink-0">
                    <div className="px-3 py-1 bg-gray-500/10 rounded flex justify-start items-start">
                      <div className="justify-center text-gray-500 text-xs font-normal font-mono leading-4">
                        FINANCE / PRODUCT
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 px-6 py-6 flex flex-col justify-start items-start min-w-[300px]">
                    <div className="justify-center text-gray-500 text-base font-normal font-sans leading-6">
                      Eliminates &apos;wrong billing&apos; disputes during grandfathered plan migrations.
                    </div>
                  </div>
                  <div className="w-32 px-6 pt-7 pb-6 flex flex-col justify-start items-start shrink-0">
                    <Link href="#" className="justify-center text-lime-300 hover:text-lime-400 text-sm font-bold font-sans underline leading-5 transition-colors">
                      View Specs
                    </Link>
                  </div>
                </div>
                
                {/* Row 3 */}
                <div className="w-full border-t border-slate-700/50 flex justify-start items-start hover:bg-slate-800/30 transition-colors">
                  <div className="w-72 p-6 flex flex-col justify-start items-start shrink-0">
                    <div className="justify-center text-white text-base font-bold font-sans leading-6">
                      Network Rating Rules
                    </div>
                  </div>
                  <div className="w-52 p-6 flex flex-col justify-start items-start shrink-0">
                    <div className="px-3 py-1 bg-gray-500/10 rounded flex justify-start items-start">
                      <div className="justify-center text-gray-500 text-xs font-normal font-mono leading-4">
                        OPERATIONS / BSS
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-start items-start min-w-[300px]">
                    <div className="justify-center text-gray-500 text-base font-normal font-sans leading-6">
                      Proves mathematical billing accuracy to wholesale partners.
                    </div>
                  </div>
                  <div className="w-32 px-6 pt-7 pb-6 flex flex-col justify-start items-start shrink-0">
                    <Link href="#" className="justify-center text-lime-300 hover:text-lime-400 text-sm font-bold font-sans underline leading-5 transition-colors">
                      View Specs
                    </Link>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle of an Evidence Object */}
      <section className="w-full max-w-7xl mx-auto px-6 py-28 flex flex-col justify-center items-center gap-16 overflow-hidden">
        <div className="w-full flex flex-col justify-start items-center">
          <h2 className="text-center justify-center text-white text-4xl font-semibold font-sans leading-[48px]">
            Lifecycle of an Evidence Object
          </h2>
        </div>
        
        <div className="w-full relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
          {/* Horizontal Line connecting steps (hidden on small screens) */}
          <div className="hidden md:block absolute h-[2px] bg-slate-700/50 top-10 left-10 right-10 z-0"></div>
          
          {/* Step 1 */}
          <div className="flex-1 flex flex-col justify-start items-start gap-2 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 bg-zinc-900 rounded-xl outline outline-4 outline-offset-[-4px] outline-lime-300 flex justify-center items-center relative">
              <div className="absolute inset-0 bg-white/0 rounded-xl shadow-[0px_4px_6px_-4px_rgba(191,243,101,0.20),0px_10px_15px_-3px_rgba(191,243,101,0.20)]"></div>
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/archi/lifecycle-trigger.svg" alt="Trigger" width={20} height={24} />
              </div>
            </div>
            <div className="w-full pt-4 flex flex-col justify-start items-start">
              <div className="justify-center text-lime-300 text-base font-normal font-mono leading-6">01 TRIGGER</div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">
                User event or system action occurs across<br className="hidden lg:block"/>the network.
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex-1 flex flex-col justify-start items-start gap-2 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 bg-zinc-900 rounded-xl outline outline-4 outline-offset-[-4px] outline-slate-700/50 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/archi/lifecycle-capture.svg" alt="Capture" width={24} height={24} />
              </div>
            </div>
            <div className="w-full pt-4 flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-normal font-mono leading-6">02 CAPTURE</div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">
                Atomic data point is isolated from<br className="hidden lg:block"/>ephemeral logs.
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex-1 flex flex-col justify-start items-start gap-2 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 bg-zinc-900 rounded-xl outline outline-4 outline-offset-[-4px] outline-slate-700/50 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/archi/lifecycle-bind.svg" alt="Bind" width={24} height={12} />
              </div>
            </div>
            <div className="w-full pt-4 flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-normal font-mono leading-6">03 BIND</div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">
                Context metadata (user ID, timestamp, IP)<br className="hidden lg:block"/>is attached.
              </div>
            </div>
          </div>
          
          {/* Step 4 */}
          <div className="flex-1 flex flex-col justify-start items-start gap-2 relative z-10 w-full md:w-auto">
            <div className="w-20 h-20 bg-zinc-900 rounded-xl outline outline-4 outline-offset-[-4px] outline-slate-700/50 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/archi/lifecycle-protect.svg" alt="Protect" width={20} height={28} />
              </div>
            </div>
            <div className="w-full pt-4 flex flex-col justify-start items-start">
              <div className="justify-center text-white text-base font-normal font-mono leading-6">04 PROTECT</div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">
                Cryptographic hashing ensures object<br className="hidden lg:block"/>integrity.
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Buyer Review Pathways */}
      <section className="w-full px-6 lg:px-28 pb-5 bg-gray-900/40 flex flex-col justify-center items-center">
        <div className="w-full max-w-7xl flex flex-col justify-start items-start">
          <div className="w-full pb-8 flex flex-col justify-start items-start">
            <div className="w-full flex flex-col justify-start items-start">
              <h2 className="justify-center text-white text-4xl font-semibold font-sans leading-[48px]">
                Buyer Review Pathways
              </h2>
              <div className="justify-center text-gray-500 text-base font-normal font-sans leading-6 mt-2">
                Tailored evidence frameworks for your leadership team.
              </div>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* CEO */}
            <div className="p-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-between items-start min-h-[288px] hover:outline-lime-300/30 transition-colors">
              <div className="w-full pb-6 flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-lime-300 text-xs font-normal font-mono leading-4">CEO</div>
                <div className="justify-center text-white text-base font-bold font-sans leading-6">&quot;Does this protect<br/>our market<br/>valuation?&quot;</div>
                <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">Learn how evidence<br/>architecture prevents<br/>brand-damaging billing<br/>scandals.</div>
              </div>
            </div>
            
            {/* CFO */}
            <div className="p-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-between items-start min-h-[288px] hover:outline-sky-600/30 transition-colors">
              <div className="w-full pb-6 flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-sky-600 text-xs font-normal font-mono leading-4">CFO</div>
                <div className="justify-center text-white text-base font-bold font-sans leading-6">&quot;How much revenue<br/>leakage are we<br/>stopping?&quot;</div>
                <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">Quantify the savings<br/>from reduced dispute<br/>resolution and audit<br/>readiness.</div>
              </div>
            </div>
            
            {/* CTO */}
            <div className="p-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-between items-start min-h-[288px] hover:outline-white/30 transition-colors">
              <div className="w-full pb-6 flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-white text-xs font-normal font-mono leading-4">CTO</div>
                <div className="justify-center text-white text-base font-bold font-sans leading-6">&quot;Will this slow down<br/>our network<br/>performance?&quot;</div>
                <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">Explore our asynchronous evidence capture engine that runs out-of-band.</div>
              </div>
            </div>
            
            {/* CISO */}
            <div className="p-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-between items-start min-h-[288px] hover:outline-red-700/30 transition-colors">
              <div className="w-full pb-6 flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-red-700 text-xs font-normal font-mono leading-4">CISO</div>
                <div className="justify-center text-white text-base font-bold font-sans leading-6">&quot;Is the evidence<br/>itself a security<br/>risk?&quot;</div>
                <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">See our zero-<br/>knowledge proof<br/>protocols for evidence<br/>review.</div>
              </div>
            </div>
            
            {/* LEGAL */}
            <div className="p-8 bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-between items-start min-h-[288px] hover:outline-lime-300/30 transition-colors">
              <div className="w-full pb-6 flex flex-col justify-start items-start gap-4">
                <div className="justify-center text-lime-300 text-xs font-normal font-mono leading-4">LEGAL</div>
                <div className="justify-center text-white text-base font-bold font-sans leading-6">&quot;Can this hold up in<br/>international<br/>court?&quot;</div>
                <div className="justify-center text-gray-500 text-sm font-normal font-sans leading-5">Review our RFC 3161<br/>compliant time-<br/>stamping and chain of<br/>custody.</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Useful, Protected, and Honestly Described */}
      <section className="w-full px-6 lg:px-28 py-12 flex justify-center items-center">
        <div className="w-full max-w-7xl px-8 py-12 bg-gray-900/20 rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-700/30 flex flex-col lg:flex-row justify-center items-start gap-16">
          <div className="flex-1 flex flex-col justify-start items-start gap-6">
            <h2 className="justify-center text-white text-4xl font-semibold font-sans leading-[48px]">
              Useful, Protected, and<br/>Honestly Described
            </h2>
            <div className="justify-center text-gray-500 text-base font-normal font-sans leading-6">
              We believe evidence architecture should be grounded in engineering<br className="hidden lg:block"/>reality, not marketing hyperbole. We maintain strict claim controls on<br className="hidden lg:block"/>how we describe our sovereign infrastructure.
            </div>
            
            <div className="w-full pt-2 flex flex-col justify-start items-start gap-4">
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-lime-300" />
                </div>
                <div className="justify-center lg:pr-14">
                  <span className="text-white text-sm font-bold font-sans leading-5">Useful: </span>
                  <span className="text-slate-400 text-sm font-bold font-sans leading-5">Evidence must provide a clear path to resolving a business question.</span>
                </div>
              </div>
              
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-lime-300" />
                </div>
                <div className="justify-center">
                  <span className="text-white text-sm font-bold font-sans leading-5">Protected: </span>
                  <span className="text-slate-400 text-sm font-bold font-sans leading-5">Evidence must be more secure than the events it describes.</span>
                </div>
              </div>
              
              <div className="w-full flex justify-start items-start gap-4">
                <div className="pt-1 flex flex-col justify-start items-start shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-lime-300" />
                </div>
                <div className="justify-center">
                  <span className="text-white text-sm font-bold font-sans leading-5">Honest: </span>
                  <span className="text-slate-400 text-sm font-bold font-sans leading-5">We define the limits of mathematical certainty for every claim.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 lg:pb-16 w-full flex flex-col justify-start items-start">
            <div className="w-full bg-zinc-900 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-700/50 flex flex-col justify-start items-start overflow-hidden">
              <div className="w-full p-4 bg-gray-900 border-b border-slate-700/50 flex flex-col justify-start items-start">
                <div className="justify-center text-gray-500 text-xs font-bold font-mono leading-4 uppercase tracking-wider">
                  COMMUNICATION STANDARDS
                </div>
              </div>
              <div className="w-full p-6 flex flex-col justify-start items-start gap-6">
                <div className="w-full flex justify-center items-start gap-4">
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-500 text-xs font-bold font-mono leading-4 uppercase tracking-wider">PUBLISHABLE LANGUAGE</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-500 text-xs font-bold font-mono leading-4 uppercase tracking-wider">VOID/AVOID</div>
                  </div>
                </div>
                
                <div className="w-full pb-4 border-b border-slate-700/50 flex justify-center items-start gap-4">
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-lime-300 text-sm font-bold font-sans leading-5">&quot;Tamper-evident&quot;</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-red-500/80 text-sm font-bold font-sans leading-5">&quot;Immutable forever&quot;</div>
                  </div>
                </div>
                
                <div className="w-full pb-4 border-b border-slate-700/50 flex justify-center items-start gap-4">
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-lime-300 text-sm font-bold font-sans leading-5">&quot;Independent Verification&quot;</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-red-500/80 text-sm font-bold font-sans leading-5">&quot;Absolute Truth&quot;</div>
                  </div>
                </div>
                
                <div className="w-full flex justify-center items-start gap-4">
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-lime-300 text-sm font-bold font-sans leading-5">&quot;High-Assurance Trail&quot;</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="justify-center text-red-500/80 text-sm font-bold font-sans leading-5">&quot;Unbreakable Audit&quot;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-28 flex justify-center items-center">
        <div className="w-full max-w-[896px] px-6 flex flex-col justify-start items-start gap-8">
          <div className="w-full flex flex-col justify-start items-center">
            <h2 className="text-center justify-center text-white text-6xl font-bold font-['Hanken_Grotesk'] leading-[66px]">
              Give your telecom operation an<br/>evidence layer buyers can trust.
            </h2>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/contact-us">
              <button className="px-10 py-5 bg-sky-700 hover:bg-sky-600 transition-colors rounded flex justify-center items-center">
                <span className="text-center justify-center text-white text-lg font-normal font-sans leading-7">Request Architecture Brief</span>
              </button>
            </Link>
            <button className="px-10 py-5 rounded outline outline-1 outline-offset-[-1px] outline-sky-700 hover:bg-sky-700/10 transition-colors flex flex-col justify-center items-center">
              <span className="text-center justify-center text-sky-500 text-lg font-normal font-sans leading-7">Request a Demo</span>
            </button>
          </div>
          <div className="w-full flex flex-col justify-start items-center mt-8">
            <div className="text-center justify-center text-gray-500 text-xs font-normal font-mono leading-4">
              Nexus Sovereign Infrastructure Node: 01-Evidence-Beta
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
