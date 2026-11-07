"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function DedicatedCloudPage() {
   return (
      <div className="bg-[#111625] min-h-screen text-slate-100 selection:bg-sky-500 selection:text-white font-sans overflow-x-hidden">

         {/* 1. HERO SECTION */}
         <section className="relative pt-32 pb-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="grid lg:grid-cols-2 gap-12 items-center">

                  {/* Left Content */}
                  <div className="flex flex-col items-start gap-8">
                     <div className="text-cyan-700 text-xs font-semibold font-mono uppercase tracking-wider">
                        ENTERPRISE ARCHITECTURE
                     </div>
                     <h1 className="text-black text-5xl md:text-6xl font-bold leading-[1.15] tracking-tight">
                        Dedicated Cloud:<br />
                        Enterprise Isolation,<br />
                        Retained Agility.
                     </h1>
                     <p className="text-slate-600 text-lg font-normal leading-7 max-w-[576px]">
                        Your own instance in our managed environment for stronger boundaries and controlled release governance. Build on the platform that powers Tier-1 global telcos with sovereign-grade security.
                     </p>
                     <div className="pt-2">
                        <Link href="/contact" className="px-8 py-4 bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold rounded-sm transition shadow-md inline-block">
                           Request Architecture Review
                        </Link>
                     </div>
                  </div>

                  {/* Right Image/Dashboard */}
                  <div className="relative h-[400px] md:h-[500px] rounded-2xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-stone-300/20 overflow-hidden group">
                     <img src="/image/dedicate/hero.jpg" alt="Dedicated Cloud Hero" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <div className="p-6 bg-white/10 rounded-sm outline outline-1 outline-white/20 backdrop-blur-[6px] flex flex-col gap-2">
                           <div className="text-white text-[10px] font-normal font-mono leading-4">LIVE ENVIRONMENT STATUS</div>
                           <div className="flex items-end gap-2 h-12">
                              <div className="w-1 bg-lime-500 rounded-xl animate-pulse" style={{ height: '60%' }}></div>
                              <div className="w-1 bg-lime-500 rounded-xl animate-pulse" style={{ height: '100%', animationDelay: '150ms' }}></div>
                              <div className="w-1 bg-lime-500 rounded-xl animate-pulse" style={{ height: '40%', animationDelay: '300ms' }}></div>
                              <div className="w-1 bg-lime-500 rounded-xl animate-pulse" style={{ height: '80%', animationDelay: '450ms' }}></div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

         {/* 2. HIGH-DENSITY INFRASTRUCTURE */}
         <section className="py-24 bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col items-center gap-6 mb-16 max-w-[768px] mx-auto text-center">
                  <h2 className="text-white text-4xl font-semibold leading-[48px]">High-Density Infrastructure</h2>
                  <p className="text-gray-400 text-lg font-normal leading-7">
                     Dedicated Cloud provides the performance of on-premise hardware with the elastic scalability of a managed SaaS platform.
                  </p>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  {/* Card 1 */}
                  <div className="p-8 bg-gray-800/50 rounded-lg outline outline-1 outline-stone-300/10 flex flex-col gap-8">
                     <div className="flex items-start gap-6">
                        <div className="w-12 h-12 shrink-0 bg-lime-800/10 rounded-sm outline outline-1 outline-lime-800/20 flex items-center justify-center">
                           <img src="/image/dedicate/icon3.svg" alt="Database" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h3 className="text-white text-2xl font-semibold">Dedicated Database Clusters</h3>
                           <p className="text-gray-400 text-base leading-6">
                              Physically isolated database instances ensuring zero cross-tenant contamination and predictable I/O performance for high-volume rating engines.
                           </p>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-stone-300/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                           <Check className="text-lime-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">Dedicated NVMe Storage Tiers</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Check className="text-lime-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">Point-in-time Recovery (PITR) isolation</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Check className="text-lime-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">Customer-managed encryption keys (BYOK)</span>
                        </div>
                     </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-8 bg-gray-800/50 rounded-lg outline outline-1 outline-stone-300/10 flex flex-col gap-8">
                     <div className="flex items-start gap-6">
                        <div className="w-12 h-12 shrink-0 bg-sky-600/10 rounded-sm outline outline-1 outline-sky-600/20 flex items-center justify-center">
                           <img src="/image/dedicate/icon1.svg" alt="Integration" className="w-6 h-6 object-contain" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <h3 className="text-white text-2xl font-semibold">Private Integration Pathways</h3>
                           <p className="text-gray-400 text-base leading-6">
                              Secure, low-latency connectivity via VPC Peering or Direct Connect, mapping directly into your existing enterprise network topology.
                           </p>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-stone-300/10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                           <Check className="text-sky-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">Bilateral gRPC/REST API isolation</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Check className="text-sky-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">Customized VPN/Direct Connect tunnels</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Check className="text-sky-500 w-4 h-4" />
                           <span className="text-gray-400 text-base">IP Whitelisting & Perimeter control</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 3. SOVEREIGN DOMAIN ARCHITECTURE */}
         <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                  <div className="max-w-[672px] flex flex-col gap-4">
                     <h2 className="text-zinc-900 text-4xl font-semibold leading-[48px]">Sovereign Domain Architecture</h2>
                     <p className="text-slate-600 text-lg leading-7">
                        How MVNEs and Multi-brand operators maintain absolute segregation without losing central visibility.
                     </p>
                  </div>
                  <div className="p-4 bg-zinc-100 rounded-sm outline outline-1 outline-stone-300/20 flex items-start gap-4">
                     <div className="flex flex-col items-end">
                        <span className="text-slate-500 text-[10px] font-mono leading-4 uppercase">CURRENT HIERARCHY</span>
                        <span className="text-zinc-900 text-2xl font-semibold">Level 3 Isolation</span>
                     </div>
                     <div className="w-8 h-8 bg-sky-600/10 flex items-center justify-center rounded">
                        <img src="/image/dedicate/icon3.svg" className="w-5 h-5 object-contain" alt="Level" />
                     </div>
                  </div>
               </div>

               <div className="grid lg:grid-cols-3 gap-6 items-stretch">
                  {/* Layer 1 */}
                  <div className="p-8 bg-stone-50 outline outline-1 outline-stone-300/50 rounded-lg flex flex-col justify-between items-start">
                     <div className="flex flex-col gap-4">
                        <span className="text-sky-600 text-xs font-bold font-mono uppercase">LAYER 01</span>
                        <h3 className="text-zinc-900 text-2xl font-semibold">Primary Operator Tenant</h3>
                        <p className="text-slate-600 text-base">The parent administrative domain for the MVNE. Manage platform-wide configurations and global product catalogs.</p>
                     </div>
                     <div className="w-full pt-8 border-t border-stone-300/20 flex flex-col gap-2 mt-auto">
                        <div className="w-full h-2 bg-sky-600 rounded-xl"></div>
                        <div className="w-3/4 h-2 bg-sky-600/20 rounded-xl"></div>
                     </div>
                  </div>

                  {/* Layer 02-A */}
                  <div className="p-8 bg-stone-200 outline outline-1 outline-stone-300 rounded-lg flex flex-col justify-start items-start gap-2 overflow-hidden">
                     <span className="text-lime-800 text-xs font-bold font-mono leading-4 uppercase">LAYER 02-A</span>
                     <h3 className="text-zinc-900 text-2xl font-semibold pt-2">Sub-Brand: Alpha Mobile</h3>
                     <p className="text-slate-600 text-base pb-6">Independent user database, localized currency, and brand-specific CRM workflows.</p>
                     <img src="/image/dedicate/page1.png" alt="Alpha Dashboard" className="w-full h-32 object-cover opacity-60 rounded shadow-sm mt-auto" />
                  </div>

                  {/* Layer 02-B */}
                  <div className="px-8 pt-8 pb-14 bg-stone-200 outline outline-1 outline-stone-300 rounded-lg flex flex-col justify-start items-start gap-2 overflow-hidden">
                     <span className="text-lime-800 text-xs font-bold font-mono leading-4 uppercase">LAYER 02-B</span>
                     <h3 className="text-zinc-900 text-2xl font-semibold pt-2">Sub-Brand: Beta Connect</h3>
                     <p className="text-slate-600 text-base pb-6">Alternative rating engine rules and dedicated support queue segregation.</p>
                     <img src="/image/dedicate/page2.png" alt="Beta Dashboard" className="w-full h-32 object-cover opacity-60 rounded shadow-sm mt-auto" />
                  </div>
               </div>
            </div>
         </section>

         {/* 4. RELEASE GOVERNANCE */}
         <section className="py-24 bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col lg:flex-row gap-24 items-center">

                  <div className="flex-1 flex flex-col gap-8">
                     <h2 className="text-white text-4xl font-semibold leading-[48px]">Release Governance:<br />Controlled Velocity</h2>
                     <p className="text-gray-500 text-lg leading-7">
                        Enterprise operators require predictability. Our Dedicated Cloud deployment allows you to dictate the tempo of innovation, ensuring mission-critical stability.
                     </p>
                     <div className="flex flex-col gap-6 pt-4">
                        <div className="flex gap-6">
                           <div className="w-10 h-10 shrink-0 bg-lime-800/10 rounded-sm flex items-center justify-center p-2">
                              <img src="/image/dedicate/icon41.svg" alt="Icon" className="w-full h-full object-contain" />
                           </div>
                           <div className="flex flex-col gap-1">
                              <h4 className="text-white text-2xl font-semibold">Configurable Release Windows</h4>
                              <p className="text-gray-500 text-base">You decide when core platform updates are applied. Delay major releases to align with your internal QA cycles and business peak periods.</p>
                           </div>
                        </div>
                        <div className="flex gap-6">
                           <div className="w-10 h-10 shrink-0 bg-lime-800/10 rounded-sm flex items-center justify-center p-2">
                              <img src="/image/dedicate/icon5.svg" alt="Icon" className="w-full h-full object-contain" />
                           </div>
                           <div className="flex flex-col gap-1">
                              <h4 className="text-white text-2xl font-semibold">Staging-to-Production Sync</h4>
                              <p className="text-gray-500 text-base">Mirror your dedicated production instance in an identical sandbox for rigorous UAT before the 'go-live' signal.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 p-8 bg-gray-900 rounded-lg shadow-inner outline outline-1 outline-stone-300/10 flex flex-col gap-8">
                     <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-[10px] font-mono">CHANGE MANAGEMENT PROTOCOL</span>
                        <span className="px-2 py-1 bg-lime-800/20 text-lime-800 text-[10px] font-mono rounded-sm">ACTIVE V.2.4.1</span>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="p-4 bg-gray-800 rounded-sm border-l-4 border-lime-800 flex justify-between items-center">
                           <span className="text-white text-base">Core Platform Patch v2.4.2</span>
                           <span className="text-gray-500 text-xs">Pending QA</span>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-sm border-l-4 border-sky-600 flex justify-between items-center">
                           <span className="text-white text-base">Billing Engine Optimization</span>
                           <span className="text-gray-500 text-xs">Scheduled: 02:00 UTC</span>
                        </div>
                        <div className="p-4 bg-gray-800/30 opacity-50 rounded-sm border-l-4 border-zinc-500 flex justify-between items-center">
                           <span className="text-white text-base">Legacy API Deprecation</span>
                           <span className="text-gray-500 text-xs">Deferred</span>
                        </div>
                     </div>
                     <button className="w-full py-3 text-center rounded outline outline-1 outline-stone-300/30 text-white text-sm font-semibold hover:bg-white/5 transition">
                        Access Deployment Console
                     </button>
                  </div>

               </div>
            </div>
         </section>

         {/* 5. TESTIMONIAL */}
         <section className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
               <div className="p-12 md:p-24 bg-zinc-100 rounded-3xl relative flex flex-col items-start mt-8">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10 w-full">
                     <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-white">
                        <img src="/image/dedicate/Ct.jpg" alt="Marcus Vandenberg" className="w-full h-full object-cover grayscale mix-blend-multiply" />
                     </div>
                     <div className="flex flex-col gap-6 flex-1">
                        <p className="text-black text-2xl md:text-3xl font-semibold leading-9">
                           "The transition to ZoikoNex Dedicated Cloud gave us the exact balance of isolation we required for compliance and the cloud-native efficiency we needed to launch 5 new MVNO brands in under three months. It's sovereign control without the infrastructure headache."
                        </p>
                        <div className="flex flex-col">
                           <span className="text-cyan-700 text-base font-bold font-mono">MARCUS VANDENBERG</span>
                           <span className="text-slate-600 text-base">CTO, Global Connectivity Group</span>
                        </div>
                     </div>
                  </div>
                  {/* Decorative Quote Mark */}
                  <div className="hidden md:flex absolute left-12 -top-8 w-16 h-16 bg-cyan-700 rounded-2xl items-center justify-center shadow-lg">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 11H5V7H9V11ZM9 11H5C5 14.5 7 16 9 17L10 15C9 14 8.5 13 8.5 11H9V11ZM19 11H15V7H19V11ZM19 11H15C15 14.5 17 16 19 17L20 15C19 14 18.5 13 18.5 11H19V11Z" fill="white"/>
                     </svg>
                  </div>
               </div>
            </div>
         </section>

      </div>
   );
}
