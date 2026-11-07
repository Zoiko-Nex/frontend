"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HybridDeploymentPage() {
  return (
    <div className="bg-gray-950 min-h-screen text-slate-100 font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Blur */}
        <div className="absolute top-1/2 left-[60%] -translate-y-1/2 w-[744px] h-[467px] bg-gradient-to-br from-lime-400/20 to-lime-400/0 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 flex flex-col gap-8">
              <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full border border-white/20 w-max">
                <span className="text-cyan-400 text-xs font-semibold tracking-wider font-mono uppercase">HYBRID CLOUD NATIVE</span>
              </div>
              <h1 className="text-stone-50 text-5xl md:text-6xl font-bold leading-[1.1]">
                Hybrid Deployment:<br/>
                <span className="text-cyan-600">The Bridge to<br/>Modernization.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                Coexistence without compromise. Keep your legacy mediation while activating cloud-native monetization. Bridge the gap between legacy reliability and cloud agility.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/request-a-demo" className="bg-cyan-700 hover:bg-cyan-600 text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
                  Book a Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/api-reference" className="border border-zinc-700 hover:border-zinc-500 text-white px-8 py-4 rounded font-semibold transition-colors flex items-center justify-center">
                  Technical Specs
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg">
              <div className="p-8 bg-neutral-900 rounded-lg border border-zinc-700/50 backdrop-blur-sm flex flex-col gap-8 shadow-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-600 text-xs font-semibold font-mono tracking-wider uppercase">REAL-TIME MONITOR</span>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-lime-400/40"></div>
                    <div className="w-2 h-2 rounded-full bg-lime-400/20"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div className="w-3/4 h-full bg-cyan-600 rounded-full absolute left-0 top-0"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-stone-200 rounded outline outline-1 outline-zinc-700/20 flex flex-col gap-1">
                      <span className="text-slate-500 text-[10px] font-bold font-mono">LEGACY MEDIATION</span>
                      <span className="text-cyan-700 text-2xl font-semibold">Active</span>
                    </div>
                    <div className="flex-1 p-4 bg-stone-200 rounded outline outline-1 outline-zinc-700/20 flex flex-col gap-1">
                      <span className="text-slate-500 text-[10px] font-bold font-mono">CLOUD CORE</span>
                      <span className="text-cyan-700 text-2xl font-semibold animate-pulse">Syncing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MEDIATION BRIDGE VISUALIZATION */}
      <section className="py-24 bg-gray-950 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
            <h2 className="text-stone-50 text-4xl font-semibold">Mediation Bridge Visualization</h2>
            <p className="text-slate-400 text-base">
              A visual representation of our high-fidelity data orchestration between on-premise legacy systems and the ZoikoNex cloud core.
            </p>
          </div>
          
          <div className="bg-neutral-900 rounded-lg border border-zinc-800/50 p-8 md:p-16 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 min-h-[400px]">
             {/* Left Card */}
             <div className="w-full lg:w-1/3 p-8 bg-gray-900 rounded border border-zinc-800 flex flex-col items-center gap-4 text-center">
                <div className="mb-4">
                   <img src="/image/hybrid/icon1.svg" alt="On-Prem Edge" className="w-8 h-8 object-contain" />
                </div>
                <h3 className="text-stone-50 text-2xl font-semibold">On-Prem Edge</h3>
                <p className="text-slate-400 text-sm">Legacy Diameter/SS7<br/>TAP/RAP Files</p>
             </div>

             {/* Center Bridge */}
             <div className="flex-1 flex flex-col items-center justify-center relative min-h-[160px] w-full">
                {/* Horizontal connection line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-cyan-900/0 via-cyan-600 to-cyan-900/0 -translate-y-1/2 hidden lg:block"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                   <div className="w-20 h-20 bg-[#2b86a6] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(8,145,178,0.3)]">
                      <img src="/image/hybrid/icon2.svg" alt="ZoikoNex Bridge" className="w-10 h-10 object-contain" />
                   </div>
                   <div className="flex flex-col items-center gap-2">
                      <span className="text-cyan-600 text-[10px] font-bold font-mono tracking-widest uppercase">ZOIKONEX BRIDGE</span>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
                         <span className="text-cyan-500 text-[10px] font-mono">BIDIRECTIONAL SYNC</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Card */}
             <div className="w-full lg:w-1/3 p-8 bg-gray-900 rounded border border-cyan-800/40 flex flex-col items-center gap-4 text-center">
                <div className="mb-4">
                   <img src="/image/hybrid/icon3.svg" alt="Cloud-Native Core" className="w-8 h-8 object-contain" />
                </div>
                <h3 className="text-stone-50 text-2xl font-semibold">Cloud-Native Core</h3>
                <p className="text-slate-400 text-sm">HTTP/2 JSON API<br/>Real-time Monetization</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. PARALLEL RUN SUPPORT */}
      <section className="py-24 bg-zinc-950">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
               <div className="flex-1 w-full">
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-gray-900 shadow-2xl flex items-center justify-center aspect-square max-w-md mx-auto lg:max-w-none">
                     <img src="/image/hybrid/map.png" alt="Parallel Run Dashboard" className="w-full h-full object-cover" />
                  </div>
               </div>
               <div className="flex-1 flex flex-col gap-8">
                  <h2 className="text-stone-50 text-4xl font-semibold leading-tight">Parallel Run Support</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                     Minimize risk by running ZoikoNex in parallel with your existing BSS. Validate rating and billing accuracy before committing to a final cutover.
                  </p>
                  <div className="flex flex-col gap-8 mt-4">
                     <div className="flex gap-4">
                        <div className="mt-1 w-6 h-6 shrink-0 flex items-center justify-center">
                           <img src="/image/hybrid/icon31.svg" alt="Check" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h4 className="text-stone-50 text-xl font-semibold">Variance Detection</h4>
                           <p className="text-slate-400 text-base">Automated delta reporting between legacy output and ZoikoNex real-time results.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="mt-1 w-6 h-6 shrink-0 flex items-center justify-center">
                           <img src="/image/hybrid/icon31.svg" alt="Check" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h4 className="text-stone-50 text-xl font-semibold">Shadow Billing</h4>
                           <p className="text-slate-400 text-base">Process 100% of production traffic in a 'no-write' mode for safe validation.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. LEGACY CONNECTOR FRAMEWORK */}
      <section className="py-24 bg-gray-950">
         <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
               <h2 className="text-stone-50 text-4xl font-semibold">Legacy Connector Framework</h2>
               <p className="text-slate-400 text-lg">Plug-and-play connectors for every generation of telecommunications infrastructure.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                  { tag: "SIGNALING", title: "Diameter / Gx / Gy" },
                  { tag: "LEGACY DATA", title: "TAP3 / RAP / ASN.1" },
                  { tag: "INTEGRATION", title: "SFTP / Kafka / MQ" },
                  { tag: "CORE NETWORK", title: "3GPP Release 15/16/17" },
                  { tag: "VOICE", title: "CAMEL / INAP / ISUP" },
                  { tag: "DATABASE", title: "Oracle / DB2 Connectors" },
                  { tag: "API BRIDGE", title: "SOAP-to-REST Adapters" },
                  { tag: "PROVISIONING", title: "Legacy CRM Sync (XML)" },
               ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-neutral-900 border border-zinc-800 rounded flex flex-col gap-3 hover:border-lime-500/30 transition-colors">
                     <span className="text-lime-400 text-xs font-bold font-mono tracking-widest">{item.tag}</span>
                     <h4 className="text-stone-50 text-lg font-semibold">{item.title}</h4>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. RISK MITIGATION */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[150%] bg-lime-400/5 pointer-events-none -skew-y-3 origin-top-left -translate-y-24"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
               <div className="flex-1 flex flex-col gap-12">
                  <h2 className="text-stone-50 text-4xl font-semibold leading-tight">Risk Mitigation & Zero-<br className="hidden lg:block"/>Downtime Migration</h2>
                  <div className="flex flex-col gap-6">
                     <div className="p-8 bg-gray-900 border border-zinc-800 rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 shrink-0 bg-[#2f3b20] rounded flex items-center justify-center p-2">
                              <img src="/image/hybrid/icon4.svg" alt="Rollback" className="w-6 h-6 object-contain" />
                           </div>
                           <h4 className="text-stone-50 text-2xl font-semibold">Instant Rollback Controls</h4>
                        </div>
                        <p className="text-slate-400 text-base pl-[56px]">Traffic can be rerouted to legacy systems in under 50ms if any anomalies are detected during the migration phase.</p>
                     </div>
                     <div className="p-8 bg-gray-900 border border-zinc-800 rounded-lg flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 shrink-0 bg-[#2f3b20] rounded flex items-center justify-center p-2">
                              <img src="/image/hybrid/icon5.svg" alt="Structured Migration" className="w-6 h-6 object-contain" />
                           </div>
                           <h4 className="text-stone-50 text-2xl font-semibold">Structured Migration Paths</h4>
                        </div>
                        <p className="text-slate-400 text-base pl-[56px]">Migrate by subscriber segment, geography, or service type (e.g., Prepaid Data first, Postpaid Voice last).</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-lime-400/10 blur-[32px] rounded-full scale-110"></div>
                  <div className="relative p-2 bg-gray-800 border border-zinc-700/40 rounded-lg w-full max-w-md mx-auto lg:max-w-none flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] overflow-hidden h-[400px] lg:h-[500px]">
                     <img src="/image/hybrid/map2.png" alt="Server Rack" className="w-full h-full object-cover rounded" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. CTA */}
      <section className="py-28 bg-cyan-700 flex flex-col justify-center items-center w-full">
         <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-6">
            <div className="self-stretch flex flex-col justify-start items-center">
               <div className="text-center justify-center text-white text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight md:leading-[66px]">Ready for the Hybrid Leap?</div>
            </div>
            <div className="w-full max-w-[672px] pb-[0.69px] opacity-90 flex flex-col justify-start items-center">
               <div className="text-center justify-center text-white text-lg font-normal font-['Inter'] leading-7">
                  Schedule a migration workshop with our solution architects to map your legacy<br className="hidden md:block" />dependencies and plan a zero-risk cutover.
               </div>
            </div>
            <div className="self-stretch pt-4 inline-flex flex-col sm:flex-row justify-center items-center gap-6">
               <Link href="/request-a-demo" className="w-64 px-10 pt-5 pb-6 bg-white inline-flex flex-col justify-center items-center hover:bg-gray-50 transition-colors">
                  <div className="text-center justify-center text-cyan-700 text-lg font-semibold font-['Inter'] leading-7">Book a Demo</div>
               </Link>
               <Link href="/contact-us" className="px-10 py-5 outline outline-2 outline-offset-[-2px] outline-white inline-flex flex-col justify-center items-center hover:bg-white/10 transition-colors">
                  <div className="text-center justify-center text-white text-lg font-semibold font-['Inter'] leading-7">Contact Architect</div>
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}
