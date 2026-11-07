"use client";

import React from 'react';
import Image from 'next/image';

export default function ZoikoNexIntelligenceHub() {
  return (
    <div className="w-full min-h-screen bg-stone-50 text-slate-600 selection:bg-lime-400 selection:text-zinc-900">
      
      <main className="w-full flex flex-col items-center">
        
        {/* --- HERO SECTION --- */}
        <section className="w-full relative bg-gradient-to-b from-zinc-900 via-gray-900 to-zinc-900 py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(at_top_left,rgba(190,242,94,0.15),transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Dynamic Copy Container */}
            <div className="flex flex-col items-start gap-6 max-w-xl">
              <div className="px-4 py-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-[6px] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0px_0px_15px_rgba(191,243,101,0.6)]" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  INTELLIGENCE HUB
                </span>
              </div>
              <h1 className="text-white text-4xl sm:text-5xl font-semibold leading-[1.2] tracking-tight">
                Insights for building, monetizing, and governing modern telecom services.
              </h1>
              <p className="text-gray-400 text-lg font-light leading-relaxed">
                A dedicated knowledge base for institutional stakeholders navigating the transition from legacy OSS/BSS to sovereign, infrastructure-grade monetize systems.
              </p>
            </div>
            
            {/* Right Abstract Visual Wrapper */}
            <div className="w-full aspect-[4/3] max-w-lg lg:max-w-none mx-auto relative shadow-2xl overflow-hidden flex items-center justify-center group">
              <img
                src="/image/blogs/Telecom Operating.png"
                alt="hero"
              />
            </div>
          </div>
        </section>

        {/* --- FEATURED INTELLIGENCE SECTION --- */}
        <section className="w-full py-24 bg-stone-50 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-lime-300/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-black text-3xl sm:text-4xl font-semibold tracking-tight">
                  Featured Intelligence
                </h2>
                <p className="text-slate-600 text-base font-light mt-2">
                  Critical analysis on global telecom monetization architecture.
                </p>
              </div>
              <a href="#" className="flex items-center gap-2 text-sky-600 font-semibold text-sm group hover:text-sky-700 transition-colors">
                View All Articles <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Structured Post Card Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Card One */}
              <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="relative w-full h-64 sm:h-80 bg-slate-100">
                  <Image src="/image/blogs/card1.png" alt="Revenue Assurance Cover" fill className="object-cover" unoptimized />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-medium text-white border border-white/20">EVALUATE</span>
                    <span className="px-3 py-1 bg-lime-300/90 rounded-md text-[10px] font-bold text-lime-950 shadow-sm">STRATEGY</span>
                  </div>
                </div>
                <div className="p-8 sm:p-10 flex flex-col flex-1 gap-4">
                  <div className="flex items-center gap-3 text-xs ">
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-slate-600">12 MIN READ</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-semibold text-black/60 tracking-wider">REVENUE ASSURANCE</span>
                  </div>
                  <h3 className="text-black text-2xl font-semibold leading-tight tracking-tight group-hover:text-sky-600 transition-colors">
                    Stopping the Bleed: A New Architecture for Real-Time Revenue Leakage Detection
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed mb-6">
                    How cloud-native sovereign stacks identify discrepancies in milliseconds rather than billing cycles.
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-stone-200 to-neutral-200 rounded-xl border border-slate-200 overflow-hidden" />
                      <div>
                        <p className="text-sm font-semibold text-black">Dr. Elena Vance</p>
                        <p className="text-[10px] font-light text-slate-500 tracking-wider uppercase">Chief Architecture Officer</p>
                      </div>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold group-hover:bg-sky-600 group-hover:text-white transition-all">→</span>
                  </div>
                </div>
              </article>

              {/* Card Two */}
              <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                <div className="relative w-full h-64 sm:h-80 bg-slate-100">
                  <Image src="/image/blogs/card2.png" alt="Sovereign Cloud Compliance Cover" fill className="object-cover" unoptimized />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-medium text-white border border-white/20">IMPLEMENT</span>
                    <span className="px-3 py-1 bg-lime-300/90 rounded-md text-[10px] font-bold text-lime-950 shadow-sm">TECHNICAL</span>
                  </div>
                </div>
                <div className="p-8 sm:p-10 flex flex-col flex-1 gap-4">
                  <div className="flex items-center gap-3 text-xs ">
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-slate-600">18 MIN READ</span>
                    <span className="text-stone-300">•</span>
                    <span className="font-semibold text-black/60 tracking-wider">GOVERNANCE</span>
                  </div>
                  <h3 className="text-black text-2xl font-semibold leading-tight tracking-tight group-hover:text-sky-600 transition-colors">
                    The CTO's Guide to Multi-Jurisdiction Sovereign Cloud Compliance
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed mb-6">
                    Navigating the regulatory matrix of 50+ markets with a unified automated enforcement layer.
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-stone-200 to-neutral-200 rounded-xl border border-slate-200 overflow-hidden" />
                      <div>
                        <p className="text-sm font-semibold text-black">Marcus Thorne</p>
                        <p className="text-[10px] font-light text-slate-500 tracking-wider uppercase">Head of Regulatory Engineering</p>
                      </div>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 font-bold group-hover:bg-sky-600 group-hover:text-white transition-all">→</span>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* --- NAVIGATE INTELLIGENCE BY DOMAIN SECTION --- */}
        <section className="w-full py-24 bg-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_top_left,rgba(190,242,94,0.03),transparent_40%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
            <h2 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight text-center">
              Navigate Intelligence by Domain
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Domain Core Box 1 */}
              <div className="p-10 h-96 bg-zinc-950/40 border border-white/10 rounded-2xl flex flex-col justify-end gap-4 relative overflow-hidden group hover:border-white/20 transition-all">
                {/* FIXED: Removed -z-10 to stop image hiding behind parent element background color layer */}
                <div className="absolute inset-0 opacity-45 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <Image src="/image/blogs/card3.png" alt="Executive Strategy Background" fill className="object-cover mix-blend-luminosity" unoptimized />
                </div>
                {/* Content layers above image overlay using relative position styling */}
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                    <img className="w-6 h-6 " 
                        src="/image/blogs/Icon.png"
                        alt="icon"
                    />
                  </div>
                  <h3 className="text-white text-2xl font-semibold mt-4">Executive Strategy</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    Market positioning, ROI models, and commercial acceleration paths.
                  </p>
                </div>
              </div>

              {/* Domain Core Box 2 */}
              <div className="p-10 h-96 bg-zinc-950/40 border border-white/10 rounded-2xl flex flex-col justify-end gap-4 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="absolute inset-0 opacity-45 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <Image src="/image/blogs/card4.png" alt="Technical Architecture Background" fill className="object-cover mix-blend-luminosity" unoptimized />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
             <img className="w-6 h-6 " 
                        src="/image/blogs/Icon (1).png"
                        alt="icon"
                    />                  </div>
                  <h3 className="text-white text-2xl font-semibold mt-4">Technical Architecture</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    System design, API documentation, and sovereign migration paths.
                  </p>
                </div>
              </div>

              {/* Domain Core Box 3 */}
              <div className="p-10 h-96 bg-zinc-950/40 border border-white/10 rounded-2xl flex flex-col justify-end gap-4 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="absolute inset-0 opacity-45 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <Image src="/image/blogs/card5.png" alt="Monetization Background" fill className="object-cover mix-blend-luminosity" unoptimized />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                   <img className="w-6 h-6 " 
                        src="/image/blogs/Icon (2).png"
                        alt="icon"
                    />                  </div>
                  <h3 className="text-white text-2xl font-semibold mt-4">Monetization & Revenue</h3>
                  <p className="text-gray-300 text-sm font-light leading-relaxed">
                    Charging models, billing efficiency, and cross-border settlement.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- LATEST INDUSTRY ANALYSIS SECTION --- */}
        <section className="w-full py-24 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <h2 className="text-black text-3xl font-semibold tracking-tight">
                Latest Industry Analysis
              </h2>
              {/* Category Segment Selectors */}
              <div className="flex flex-wrap gap-3 text-xs">
                <button className="px-5 py-2 bg-cyan-700 text-white rounded-xl font-medium shadow-md">ALL TOPICS</button>
                {['MVNO LAUNCH', 'CHARGING', 'BILLING', 'APIS', 'ESIM'].map((topic) => (
                  <button key={topic} className="px-5 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-stone-100 transition-colors font-medium">
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Dynamic Content Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: "How MVNOs are winning with High-Density Charging Architecture", 
                  desc: "A breakdown of cost-per-subscriber advantages in modern SaaS deployments.", 
                  meta: "EXPLORE • 5 MIN",
                  imgSrc: "/image/blogs/card.png" // FIXED: Distinct image mapping assigned to each data entity
                },
                { 
                  title: "Governing Sovereign Data: Compliance at the Edge", 
                  desc: "Legal frameworks and technical implementations for localized data residency.", 
                  meta: "EVALUATE • 8 MIN",
                  imgSrc: "/image/blogs/card7.png"
                },
                { 
                  title: "API-First Monetization: A Developer's Onboarding Guide", 
                  desc: "A deep dive into our SDKs and the transition from legacy integration protocols.", 
                  meta: "IMPLEMENT • 15 MIN",
                  imgSrc: "/image/blogs/card8.png"
                }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  <div className="w-full h-56 bg-slate-200 relative">
                    {/* FIXED: Dynamic source path applied using the updated list entries */}
                    <Image src={item.imgSrc} alt={item.title} fill className="object-cover" unoptimized />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 bg-white/10 border border-white/20 text-white text-[9px] tracking-wider rounded backdrop-blur-[6px]">
                        {item.meta}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 justify-between gap-6">
                    <div>
                      <h3 className="text-black text-xl font-semibold leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 font-light text-base mt-3 line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-normal text-black group-hover:text-sky-600 transition-colors">
                      Read Article <span className="  block rounded-xs shrink-0" >→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ROADMAPS & COMPLIANCE GRID --- */}
        <section className="w-full py-24 bg-white border-t border-slate-200 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-lime-300/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Column 1 */}
            <div className="pl-8 border-l-4 border-lime-300 flex flex-col gap-6">
              <h3 className="text-zinc-900 text-2xl font-semibold tracking-tight">Launch a Telecom Brand</h3>
              <ul className="flex flex-col gap-4 text-base text-slate-600 font-light">
                {['Zero-to-Launch Roadmap', 'Choosing Your Host Operator', 'Commercial Packaging Strategies'].map((li) => (
                  <li key={li} className="py-2 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:text-black transition-colors">
                    {li} <span className="text-xs opacity-40">→</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div className="pl-8 border-l-4 border-sky-600 flex flex-col gap-6">
              <h3 className="text-zinc-900 text-2xl font-semibold tracking-tight">Protect Revenue</h3>
              <ul className="flex flex-col gap-4 text-base text-slate-600 font-light">
                {['Real-Time Fraud Prevention', 'Settlement & Reconciliation', 'Minimizing Churn with Data'].map((li) => (
                  <li key={li} className="py-2 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:text-black transition-colors">
                    {li} <span className="text-xs opacity-40">→</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="pl-8 border-l-4 border-black flex flex-col gap-6">
              <h3 className="text-zinc-900 text-2xl font-semibold tracking-tight">Govern Compliance</h3>
              <ul className="flex flex-col gap-4 text-base text-slate-600 font-light">
                {['Sovereign Data Residency', 'Taxation Jurisdiction Engine', 'Audit Logs & Transparency'].map((li) => (
                  <li key={li} className="py-2 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:text-black transition-colors">
                    {li} <span className="text-xs opacity-40">→</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* --- BRIEFING SUBSCRIPTION FORM --- */}
        <section className="w-full py-24 bg-zinc-900 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-gray-900/40 to-zinc-900" />
          
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 relative z-10">
            <h2 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">
              Telecom Monetization Intelligence
            </h2>
            <p className="text-gray-400 font-light max-w-xl leading-relaxed text-base">
              Get a weekly briefing on global monetization trends and sovereign architecture delivered to your inbox.
            </p>
            
            <form className="w-full max-w-sm flex flex-col gap-4 mt-6" onSubmit={(e) => e.preventDefault()}>
              <div className="w-full relative">
                <input 
                  type="email" 
                  placeholder="Business Email" 
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 text-lg focus:outline-none focus:border-lime-400 transition-colors text-center backdrop-blur-sm"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-base tracking-tight transition-all shadow-[0px_15px_30px_-10px_rgba(191,243,101,0.25)]">
                Subscribe to Intelligence Briefing
              </button>
            </form>
            
            <span className="text-[10px] text-gray-500/70 uppercase tracking-widest mt-4">
              TIER-1 INFRASTRUCTURE INSIGHTS • ZERO SPAM POLICY
            </span>
          </div>
        </section>

      </main>

    </div>
  );
}