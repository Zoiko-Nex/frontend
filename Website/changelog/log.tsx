"use client";

import React, { useState } from 'react';

// Mock structural representation of the changelog updates matching the design
const changelogData = [
  {
    version: 'v0.9.4',
    date: 'October 24, 2024',
    type: 'IMPROVED',
    typeColor: 'bg-lime-300/20 text-lime-800 outline-lime-300/30',
    tagColor: 'bg-sky-600/10 text-sky-600 outline-sky-600/20',
    domain: 'BILLING',
    impact: 'IMPACT: MEDIUM',
    indicatorColor: 'bg-sky-600',
    title: 'Precision Billing Engine Enhancements',
    description: "This update optimizes the tax-calculation latency for cross-border transactions, reducing high-volume reconciliation errors by approximately 14%. We've refined the batch-processing logic for sovereign taxing entities in the APAC region.",
    hasExtraContent: true,
    isDarkAlert: false,
    hasDocs: true, // Keep link here
  },
  {
    version: 'v0.9.3',
    date: 'October 18, 2024',
    type: 'API DEVELOPER ALERT',
    indicatorColor: 'bg-stone-900',
    title: 'v0.9.3: Global API Schema Refactor',
    description: 'Standardizing GraphQL query structures across the CRM and Provisioning endpoints. This release introduces deprecation notices for legacy SOAP-style XML wrappers.',
    hasExtraContent: false,
    isDarkAlert: true,
    hasDocs: false,
  },
  {
    version: 'v0.9.2',
    date: 'October 12, 2024',
    type: 'NEW',
    typeColor: 'bg-neutral-200 text-slate-600 outline-transparent',
    tagColor: 'bg-sky-600/10 text-sky-600 outline-sky-600/20',
    domain: 'COMPLIANCE',
    impact: null,
    indicatorColor: 'bg-slate-600',
    title: 'SOC2 Type II Automated Evidence Collection',
    description: 'Automating the extraction of platform audit logs for compliance officers. This streamlines the evidence gathering process for yearly security audits, ensuring continuous compliance monitoring without manual export.',
    hasExtraContent: false,
    isDarkAlert: false,
    quote: '"The automation of these evidence trails saves our compliance team roughly 40 hours per audit cycle."',
    hasDocs: false, // Removed link
  },
  {
    version: 'v0.9.1',
    date: 'September 30, 2024',
    type: 'SECURITY',
    typeColor: 'bg-red-700/10 text-red-700 outline-red-700/20',
    tagColor: 'bg-neutral-200 text-slate-600 outline-transparent',
    domain: 'CRITICAL',
    impact: null,
    indicatorColor: 'bg-red-700',
    title: 'Hardened Session Controls & MFA Logic',
    description: 'Critical patch addressing a race condition in concurrent administrative sessions. Enforces stricter re-authentication for configuration changes affecting core infrastructure settings.',
    hasExtraContent: false,
    isDarkAlert: false,
    hasDocs: false, // Removed link
  }
];

export default function ZoikoNexChangelog() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-neutral-50 text-slate-600 antialiased font-sans pb-28">
      
      {/* 1. Hero Dynamic Stats Banner Section */}
      <section className="w-full bg-gray-800 px-6 md:px-28 pt-20 pb-24 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start gap-8">
            <div className="px-3 py-1 bg-lime-300/10 rounded-xl outline outline-1 outline-lime-300/20 flex items-center gap-2">
              <span className="w-2 h-2 bg-lime-300 rounded-full animate-pulse"></span>
              <span className="text-lime-300 text-xs font-semibold font-mono tracking-wider">LIVE UPDATES</span>
            </div>
            
            <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight font-sans leading-[1.1]">
              Track what is<br />changing across<br />ZoikoNex.
            </h1>
            
            <p className="text-gray-300 text-base md:text-lg max-w-[576px] leading-relaxed">
              Full transparency into our infrastructure-grade BSS platform. We document every evolution, 
              from minor billing enhancements to major architectural shifts, ensuring sovereign control for global operators.
            </p>
          </div>

          <div className="w-full h-auto bg-white/5 rounded-lg backdrop-blur-[6px] p-8 border border-white/10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <img className="w-5 h-4 rounded-xs"
                        src="/image/changelog/Icon (2).png"
                        alt="icon"
              />
              <span className="text-lime-300 text-xs font-semibold font-mono tracking-wider">LATEST_DEPLOYMENT_SUCCESS</span>
            </div>
            
            <div className="opacity-60 flex flex-col gap-4 text-xs font-mono">
              <div className="pb-2 border-b border-white/10 flex justify-between">
                <span className="text-gray-300 font-semibold">BUILD_ID:</span>
                <span className="text-gray-300 font-semibold">ZX-8829-PROD</span>
              </div>
              <div className="pb-2 border-b border-white/10 flex justify-between">
                <span className="text-gray-300 font-semibold">INTEGRITY_CHECK:</span>
                <span className="text-lime-300 font-semibold">VERIFIED</span>
              </div>
              <div className="pb-2 border-b border-white/10 flex justify-between">
                <span className="text-gray-300 font-semibold">AFFECTED_SERVICES:</span>
                <span className="text-gray-300 font-semibold">BILLING, AUTH, API</span>
              </div>
            </div>
            
            <div className="w-full h-24 bg-black/40 rounded-sm mt-4 flex items-center justify-center">
              <span className="text-white/20 font-mono text-[10px]">REALTIME_STREAM_ACTIVE</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Platform Core Version / Status Tracking Module */}
      <section className="max-w-[1232px] mx-auto px-6 w-full -mt-10 relative z-20">
        <div className="w-full bg-white rounded-lg border border-slate-200 p-6 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
          
          <div className="flex items-center gap-4 min-w-[200px]">
            <div className="p-3 bg-gray-900 rounded-sm text-lime-300">
              <img className="w-6 h-6 rounded-xs"
                        src="/image/changelog/Icon.png"
                        alt="icon"
              />
            </div>
            <div>
              <span className="text-slate-600 text-xs font-semibold font-mono block tracking-wider uppercase">Last Updated</span>
              <span className="text-zinc-900 text-2xl font-bold tracking-tight">24 OCT 2024</span>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-slate-200" />

          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-600 font-semibold tracking-wider">RELEASE MIX (Q4)</span>
              <span className="text-sky-600 font-semibold tracking-wider">84% IMPROVEMENT RATIO</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-xl flex overflow-hidden">
              <div className="w-[50%] h-full bg-sky-600" title="Improvements"></div>
              <div className="w-[30%] h-full bg-lime-300" title="Features"></div>
              <div className="w-[12%] h-full bg-red-700" title="Security"></div>
              <div className="w-[8%] h-full bg-zinc-700" title="Infrastructure"></div>
            </div>
          </div>

          <div className="text-center min-w-[80px]">
            <span className="text-black text-2xl font-bold block leading-none">v0.9.4</span>
            <span className="text-slate-600 text-[10px] font-mono uppercase tracking-widest mt-1 block">Current</span>
          </div>

        </div>
      </section>

      {/* 3. Main Operational Content Split Workspace Layout */}
      <main className="max-w-[1232px] mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Navigation Sidebar Context Utilities */}
        <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-8">
          
          {/* Navigation Category Segment Controls */}
          <div className="space-y-4">
            <h3 className="text-slate-600 text-xs font-bold font-mono tracking-wider">FILTER BY TYPE</h3>
            <nav className="flex flex-col gap-1 rounded-sm overflow-hidden">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`w-full px-4 py-2 flex justify-between items-center transition-colors ${activeFilter === 'all' ? 'bg-cyan-700 text-white' : 'hover:bg-neutral-100'}`}
              >
                <span className="text-sm font-medium">All Updates</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-xs ${activeFilter === 'all' ? 'bg-lime-300 text-lime-950' : 'bg-neutral-200 text-slate-600'}`}>128</span>
              </button>
              
              <button 
                onClick={() => setActiveFilter('features')}
                className={`w-full px-4 py-2 flex justify-between items-center transition-colors ${activeFilter === 'features' ? 'bg-cyan-700 text-white' : 'hover:bg-neutral-100'}`}
              >
                <span className="text-sm font-normal">New Features</span>
                <span className="text-slate-400 text-sm font-normal">12</span>
              </button>

              <button 
                onClick={() => setActiveFilter('improvements')}
                className={`w-full px-4 py-2 flex justify-between items-center transition-colors ${activeFilter === 'improvements' ? 'bg-cyan-700 text-white' : 'hover:bg-neutral-100'}`}
              >
                <span className="text-sm font-normal">Improvements</span>
                <span className="text-slate-400 text-sm font-normal">48</span>
              </button>

              <button 
                onClick={() => setActiveFilter('security')}
                className={`w-full px-4 py-2 flex justify-between items-center transition-colors ${activeFilter === 'security' ? 'bg-cyan-700 text-white' : 'hover:bg-neutral-100'}`}
              >
                <span className="text-sm font-normal">Security</span>
                <span className="text-slate-400 text-sm font-normal">6</span>
              </button>
            </nav>
          </div>

          {/* Module Domain Tags Meta Block */}
          <div className="space-y-4">
            <h3 className="text-slate-600 text-xs font-bold font-mono tracking-wider">DOMAIN IMPACT</h3>
            <div className="flex flex-wrap gap-2">
              {['BILLING', 'PROVISIONING', 'CRM', 'API', 'INFRA'].map((domain) => (
                <span key={domain} className="px-3 py-1 bg-neutral-200 text-zinc-900 text-[10px] font-mono rounded-xs">
                  {domain}
                </span>
              ))}
            </div>
          </div>

          {/* Platform SLA Informational Banner Card */}
          <div className="w-full bg-gray-900 px-6 pt-6 pb-7 rounded-lg flex flex-col gap-4 text-left">
            <img className="w-4 h-5 rounded-xs"
                    src="/image/changelog/Icon 3.png"
                    alt="icon"
            />
            <h4 className="text-white text-sm font-normal tracking-wide">Security Advisory</h4>
            <p className="text-gray-500 text-xs leading-relaxed">
              We release security patches immediately. Enable notifications for high-severity alerts.
            </p>
            <a href="#" className="text-lime-300 text-xs font-normal underline hover:text-lime-400 transition-colors">
              Learn about our SLA
            </a>
          </div>

        </aside>

        {/* Dynamic Timeline Content Stream */}
        <section className="lg:col-span-9 relative pl-0 md:pl-12 flex flex-col gap-16 border-l-0 md:border-l-2 md:border-dashed md:border-slate-200">
          
          {changelogData.map((item, index) => (
            <article key={index} className="relative w-full group">
              
              {/* Dynamic Absolute Timeline Target Node Bullet Pin Indicator */}
              <div className={`hidden md:block absolute -left-[54px] top-6 w-3 h-3 rounded-full border-4 border-neutral-50 shadow-[0_0_0_4px_rgba(245,245,245,1)] z-10 ${item.indicatorColor}`} />

              {/* Conditional Layout Formatting: Standard Card vs Dark Alert Notification */}
              {!item.isDarkAlert ? (
                <div className="w-full bg-white rounded-lg p-8 shadow-sm border border-slate-200 flex flex-col gap-4 transition-all hover:shadow-md">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-black text-2xl font-extrabold">{item.version}</span>
                      <div className="w-px h-6 bg-slate-200" />
                      <span className="text-slate-600 text-base font-medium">{item.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.type && (
                        <span className={`px-3 py-1 text-[10px] font-mono rounded-xs border ${item.typeColor}`}>
                          {item.type}
                        </span>
                      )}
                      {item.domain && (
                        <span className={`px-3 py-1 text-[10px] font-mono rounded-xs border ${item.tagColor}`}>
                          {item.domain}
                        </span>
                      )}
                      {item.impact && (
                        <span className="px-3 py-1 bg-neutral-200 text-slate-600 text-[10px] font-mono rounded-xs">
                          {item.impact}
                        </span>
                      )}
                    </div>
                  </div>

                  <h2 className="text-zinc-900 text-2xl font-semibold tracking-tight mt-2">
                    {item.title}
                  </h2>
                  
                  <p className="text-slate-600 text-base leading-relaxed">
                    {item.description}
                  </p>

                  {/* Conditional Blockquote Element Context Node */}
                  {item.quote && (
                    <div className="p-4 bg-stone-50 border-l-4 border-lime-300 italic text-sm font-medium text-slate-600 mt-2">
                      {item.quote}
                    </div>
                  )}

                  {/* Specific Action Mappings for High Impact Core Iterations */}
                  {item.hasExtraContent && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-stone-50 rounded-sm border border-slate-200">
                      <div className="flex flex-col gap-3">
                        <span className="text-black text-xs font-bold font-mono tracking-wider">BUSINESS VALUE</span>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Faster settlement times for multi-territory operators and improved audit compliance for regulatory reporting.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-red-700">
                          <span className="w-3 h-3 bg-red-700 rounded-xs"></span>
                          <span className="text-xs font-bold font-mono tracking-wider">CUSTOMER ACTION</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Action Recommended: Review updated tax logic mappings in the Billing Dashboard if operating in Thailand or Indonesia.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render Link with Arrow only if enabled in dataset configuration */}
                  {item.hasDocs && (
                    <div className="pt-2 flex items-center gap-2 text-sky-600 font-medium cursor-pointer hover:text-sky-700 transition-colors w-max group/link">
                      <span className="text-base">View Technical Documentation</span>
                      <span className="text-xl font-sans transition-transform group-hover/link:translate-x-1">&rarr;</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Native Dark API / Developer Exception Panel Interface Render */
                <div className="w-full bg-gray-900 rounded-lg p-8 flex flex-col gap-4 overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-3 text-lime-300">
                    <img className="w-5 h-3 rounded-xs"
                            src="/image/changelog/Icon (1).png"
                            alt="icon"
                    />
                    <span className="text-xs font-semibold font-mono tracking-wider">API DEVELOPER ALERT</span>
                  </div>
                  
                  <h2 className="text-white text-2xl font-semibold tracking-tight mt-2">
                    {item.title}
                  </h2>
                  
                  <p className="text-gray-500 text-base max-w-[672px] leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="pt-2 flex flex-wrap gap-4 font-mono">
                    <div className="px-4 py-2 bg-white/5 rounded-xs border border-white/10 flex flex-col">
                      <span className="text-gray-500 text-[10px] tracking-wider">DEPRECATION DATE</span>
                      <span className="text-white text-base font-semibold mt-0.5">JAN 01, 2025</span>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xs border border-white/10 flex flex-col">
                      <span className="text-gray-500 text-[10px] tracking-wider">MIGRATION PATH</span>
                      <span className="text-lime-300 text-base font-semibold mt-0.5">AVAILABLE</span>
                    </div>
                  </div>
                </div>
              )}

            </article>
          ))}

        </section>

      </main>

    </div>
  );
}