"use client"
import React, { useState } from 'react';

// Mock Data for the 18 API Domains
const apiDomains = [
  { id: 1, name: 'Billing & Charging', endpoints: 12, desc: 'Real-time rating engines and convergent billing architectures for global connectivity.',icon:"/image/developer/Icon.png" },
  { id: 2, name: 'Inventory Ops', endpoints: 8, desc: 'Automated resource lifecycle management from allocation to decommissioning.',icon:"/image/developer/Icon (1).png" },
  { id: 3, name: 'Identity & Security', endpoints: 24, desc: 'Zero-trust authentication and sovereign identity management across network edges.' ,icon:"/image/developer/Icon (2).png"},
  { id: 4, name: 'Network Orchestration', endpoints: 16, desc: 'SDN-integrated provisioning and traffic shaping for dynamic demand shifts.',icon:"/image/developer/Icon (3).png" },
  { id: 5, name: 'Customer Management', endpoints: 14, desc: 'Unified profile orchestration with deep loyalty integration and churn analytics.',icon:"/image/developer/Icon (4).png" },
  { id: 6, name: 'Revenue Evidence', endpoints: 21, desc: 'Immutable ledger tracking for cross-carrier reconciliation and settlement.',icon:"/image/developer/Icon (5).png" },
  { id: 7, name: 'Product Catalog', endpoints: 10, desc: 'Centralized offer management with flexible discounting and dynamic pricing.',icon:"/image/developer/Icon (6).png" },
  { id: 8, name: 'Order Management', endpoints: 15, desc: 'Orchestrating complex fulfillment workflows from capture to activation.' ,icon:"/image/developer/Icon (7).png"},
  { id: 9, name: 'Real-Time Charging', endpoints: 18, desc: 'Ultra-low latency rating for data, voice, and VAS event processing.',icon:"/image/developer/Icon (8).png" },
  { id: 10, name: 'Payments & Wallets', endpoints: 12, desc: 'Stored value management and multi-method gateway integrations.' ,icon:"/image/developer/Icon (9).png"},
  { id: 11, name: 'Taxation Engine', endpoints: 6, desc: 'Global tax compliance with real-time jurisdiction-based calculations.' ,icon:"/image/developer/Icon (10).png"},
  { id: 12, name: 'Revenue Assurance', endpoints: 11, desc: 'Continuous audit and leak detection across the entire billing chain.',icon:"/image/developer/Icon (11).png" },
  { id: 13, name: 'SIM/eSIM Lifecycle', endpoints: 14, desc: 'Remote provisioning and state management for digital credentials.',icon:"/image/developer/Icon (12).png" },
  { id: 14, name: 'Network Integration', endpoints: 20, desc: 'Direct mediation and signaling hooks for multi-vendor core networks.',icon:"/image/developer/Icon (13).png" },
  { id: 15, name: 'Usage/Event Processing', endpoints: 13, desc: 'High-throughput ingestion and normalization of network event streams.' ,icon:"/image/developer/Icon (14).png"},
  { id: 16, name: 'Compliance Controls', endpoints: 9, desc: 'Automated regulatory reporting and multi-region data sovereignty policy enforcement.',icon:"/image/developer/Icon (15).png" },
  { id: 17, name: 'CX Support', endpoints: 17, desc: 'Omnichannel support tools with deep integration into customer billing history.',icon:"/image/developer/Icon (16).png" },
  { id: 18, name: 'Analytics Intelligence', endpoints: 22, desc: 'AI-driven insights for network optimization and revenue forecasting.' ,icon:"/image/developer/Icon (17).png"},
  {id:19,name:'Partner/Wholesale Ops',endpoints:14,desc:'Settlement engines and portal access for carrier and reseller ecosystems.',icon:"/image/developer/Icon (18).png"},
  {id:20 ,name:'API/Integration Layer',endpoints:30,desc:'Unified gateway with advanced rate-limiting and security standards.',icon:"/image/developer/Icon (19).png"}

];

const guides = [
  { title: 'Authentication', readTime: '12 MIN READ', desc: 'OAuth2.0 flow with mutual TLS and sovereign credentialing.' },
  { title: 'Webhooks', readTime: '8 MIN READ', desc: 'Subscribing to real-time network events and transaction states.' },
  { title: 'Error Codes', readTime: '15 MIN READ', desc: 'Standardized global error mappings and retry protocols.' },
  { title: 'Rate Limiting', readTime: '5 MIN READ', desc: 'Managing throughput and cluster priority for sovereign apps.' },
];

const sdks = [
  { lang: 'Java', version: 'v4.2.0', color: 'bg-amber-500/10',icon:"/image/developer/Java.png" },
  { lang: 'Python', version: 'v3.9.1', color: 'bg-cyan-700/10' ,icon:"/image/developer/Python.png"},
  { lang: 'Go', version: 'v1.18.0', color: 'bg-cyan-500/10',icon:"/image/developer/Go.png" },
  { lang: 'Node.js', version: 'v16.4.2', color: 'bg-green-600/10',icon:"/image/developer/Node.js.png" },
];

export default function ZoikoNexPage() {
  // State to track if all domains are expanded or not
  const [showAllDomains, setShowAllDomains] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 font-sans antialiased text-zinc-900 selection:bg-cyan-500 selection:text-white">
      
      {/* 1. STICKY HEADER */}
      

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden bg-gray-950 py-24 lg:py-32 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded bg-lime-400/10 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-cyan-400">
              BSS CORE INFRASTRUCTURE
            </span>
            <h1 className="font-sans text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
              Built for the architecture of <span className="text-cyan-500">sovereign monetization.</span>
            </h1>
            <p className="max-w-xl text-lg text-gray-400 font-normal leading-relaxed">
              The definitive Tier-1 platform for telecom charging, billing, and global network orchestration. Deploy sovereign financial systems at hyper-scale.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 rounded bg-cyan-700 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-800 transition">
                Explore API Docs &rarr;
              </button>
              <button className="rounded border border-stone-600 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition">
                Request Sandbox Access
              </button>
            </div>
          </div>

          {/* Dynamic Code Preview Box */}
          <div className="relative w-full">
            <div className="absolute -inset-1 rounded-lg bg-lime-400/10 blur-xl"></div>
            <div className="relative rounded-lg border border-white/10 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl font-mono text-xs text-lime-400">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4 text-gray-500">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                <span className="pl-4 text-[11px]">GET /v2/network/monetization/provision</span>
              </div>
              <pre className="overflow-x-auto text-gray-300 leading-relaxed">
{`{
  "transaction_id": "`}<span className="text-cyan-400">SOV-9928-NET-X</span>{`",
  "status": "`}<span className="text-cyan-400">AUTHORIZED</span>{`",
  "domain": "GLOBAL_ROAMING_CORE",
  "parameters": {
    "throughput_cap": "`}<span className="text-sky-400">10Gbps</span>{`",
    "latency_target": "`}<span className="text-sky-400">&lt; 2ms</span>{`",
    "encryption": "AES-256-QUANTUM"
  },
  "compliance": ["GDPR", "ISO-27001", "SOC2"]
}`}
              </pre>
              <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4 text-gray-400">
                <span className="text-cyan-500">$</span>
                <span>cluster-deploy --region eu-central-1</span>
                <span className="h-4 w-2 bg-lime-400 animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. API DOMAINS GRID */}
      <section id="platform" className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">Sovereign API Domains</h2>
          <p className="max-w-2xl text-base text-zinc-600">
            18 high-availability clusters providing atomic control over the entire monetization lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
          {apiDomains.map((domain, index) => {
            // Check if the current element is past the first 6 items
            const isExtra = index >= 6;

            return (
              <div 
                key={domain.id} 
                className={`flex flex-col justify-between border border-stone-200 bg-white p-8 transition-all duration-300 transform
                  ${isExtra && !showAllDomains ? 'hidden opacity-0 -translate-y-4 scale-95' : 'flex opacity-100 translate-y-0 scale-100'}
                  hover:border-stone-400 hover:shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <img className="h-6 w-6  "
                        src={domain.icon}
                        alt="icon"  />
                    <span className="rounded bg-stone-100 px-2 py-1 font-mono text-[10px] font-medium tracking-tight text-zinc-700">
                      {domain.endpoints} ENDPOINTS
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-900 mb-2">{domain.name}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">{domain.desc}</p>
                </div>
                <a href={`#domain-${domain.id}`} className="group flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700">
                  Explore Domain &rarr;
                </a>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={() => setShowAllDomains(!showAllDomains)}
            className="rounded border border-zinc-400 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-stone-100 transition active:scale-98 cursor-pointer"
          >
            {showAllDomains ? 'Show Less' : 'View All 18 Domains'}
          </button>
        </div>
      </section>

      {/* 4. SANDBOX & SDKS ENVIRONMENT */}
      <section className="bg-gray-950 py-14 text-white">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Environment Info */}
          <div className="flex flex-col justify-center gap-6">
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-500">ENVIRONMENT PROVISIONING</span>
            <h2 className="text-4xl font-semibold tracking-tight">90-Day Technical Sandbox</h2>
            <p className="text-lg text-gray-400 font-normal leading-relaxed">
              Deploy an isolated, high-fidelity replica of the ZoikoNex sovereign environment. Test high-throughput scenarios and edge integration without production risk.
            </p>
            <ul className="space-y-4 pt-2">
              {['Full API parity with production clusters', 'Pre-populated synthetic billing data (1M+ Records)', 'Automated scaling testing tools'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-base text-gray-300">
                  <span className="h-5 w-5 bg-cyan-700 rounded-full flex items-center justify-center text-xs text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Sovereign SDKs */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs font-semibold tracking-wider text-gray-500">SOVEREIGN SDKS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sdks.map((sdk, idx) => (
                <div key={idx} className="border border-white/10 bg-white/5 p-6 rounded-xs hover:border-white/20 transition flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <img className='w-6 h-6'
                    src={sdk.icon}/>
                    <span className="font-mono text-[10px] text-gray-500">{sdk.version}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-2">{sdk.lang}</h4>
                    <a href="#github" className="inline-flex items-center gap-1.5 text-xs text-cyan-500 hover:underline">
                      View on GitHub <img className="h-2.5 w-2.5 "
                      src="/image/developer/Icon.svg"/>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR GUIDES */}
      <section id="resources" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="flex flex-col items-start gap-6 lg:col-span-1">
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">Popular Guides</h2>
            <p className="text-base text-zinc-600 leading-relaxed">
              Start building with our comprehensive technical blueprints and operational standards.
            </p>
            <a href="#docs" className="inline-flex items-center gap-2 text-base font-medium text-sky-600 hover:text-sky-700 group">
              Documentation Home
              <img className="h-4 w-4 "
              src="/image/developer/Icon (20).png"/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
            {guides.map((guide, idx) => (
              <div key={idx} className="border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 transition">
                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">{guide.title}</h3>
                  <p className="text-sm text-zinc-600 mb-4 leading-relaxed">{guide.desc}</p>
                </div>
                <span className="font-mono text-xs font-normal text-zinc-500">{guide.readTime}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GLOBAL LIVE SYSTEM STATUS */}
      <section className="border-t border-b border-stone-200 bg-stone-100 py-24">
        <div className="mx-auto max-w-6xl px-6 flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-zinc-900">
                <span className="h-3 w-3 rounded-full bg-lime-400 animate-pulse"></span>
                ALL SYSTEMS OPERATIONAL
              </div>
              <h2 className="text-4xl font-semibold text-zinc-900">99.99% Availability</h2>
            </div>
            <div className="flex gap-8 border-l border-stone-300 pl-8">
              <div>
                <div className="font-mono text-xs text-zinc-500">GLOBAL LATENCY</div>
                <div className="text-2xl font-semibold text-black">18ms AVG</div>
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-500">UPTIME (30D)</div>
                <div className="text-2xl font-semibold text-black">99.998%</div>
              </div>
            </div>
          </div>

          {/* Regional Clusters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['US-East (Virginia)', 'EU-Central (Frankfurt)', 'Asia-Pacific (Singapore)'].map((region, idx) => (
              <div key={idx} className="border border-stone-200 bg-white p-6 rounded-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-zinc-900">{region}</h4>
                  <span className="font-mono text-[10px] text-lime-800 bg-lime-100 px-2 py-0.5 rounded-sm">OPERATIONAL</span>
                </div>
                <div className="grid grid-cols-10 gap-1 h-8">
                  {Array.from({ length: 10 }).map((_, barIdx) => (
                    <div key={barIdx} className={`h-full ${barIdx === 5 && idx !== 1 ? 'bg-lime-400' : 'bg-lime-300'} rounded-xs`}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY CTA */}
      <section className="bg-gray-950 py-24 text-center text-white">
        <div className="mx-auto max-w-2xl px-6 flex flex-col items-center gap-6">
          <h2 className="text-4xl font-semibold tracking-tight">Master the Nexus</h2>
          <p className="text-lg text-gray-400 leading-relaxed font-normal">
            Connect with Tier-1 architects and community developers building the next generation of sovereign financial connectivity.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="rounded bg-white px-8 py-4 text-sm font-semibold text-black hover:bg-stone-100 transition flex items-center gap-2">
<img className="h-4 w-4 "
              src="/image/developer/Icon (21).png"/>              Technical Support
            </button>
            <button className="rounded border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/5 transition flex items-center gap-2">
<img className="h-4 w-4 "
              src="/image/developer/Icon (22).png"/>              Developer Briefing
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}