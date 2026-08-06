"use client";

import { useState } from "react";

const architectureData = [
  {
    letter: "A",
    title: "Commercial & Customer Foundation",
    description: "Unify how operators, buyers, products, and access are defined and governed across boundaries.",
    domains: [
      {
        title: "Identity, Tenancy and Access",
        description: "Secure tenants, roles, and service identities with least privilege and auditability.",
        tags: ["IAM", "RBAC"],
      },
      {
        title: "Customer and Account Management",
        description: "Customer, account and subscriber lifecycles with every business touch.",
        tags: ["Hierarchy", "360° View"],
      },
      {
        title: "Product Catalog and Commercial Rules",
        description: "Plans, bundles, pricing and eligibility as versioned commercial rules.",
        tags: ["Catalog", "Pricing"],
        highlight: true,
      },
      {
        title: "Order Management and Provisioning",
        description: "Order capture to activation with orchestrated workflows and SLAs.",
        tags: ["Orchestration", "SLA"],
      },
      {
        title: "Customer Lifecycle, KYC and Compliance",
        description: "Regulated journeys with consent, risk, onboarding and KYC/KYB controls.",
        tags: ["KYC", "Compliance"],
      },
    ]
  },
  {
    letter: "B",
    title: "Monetization & Financial Control",
    description: "From network events to settled cash— every value step is measured, priced, taxed, and reconciled.",
    domains: [
      {
        title: "Usage Ingestion and Mediation",
        description: "Validate, deduplicate and normalize CDRs and TAPs / NRTDR into earning records.",
        tags: ["CDR", "Mediation"],
      },
      {
        title: "Rating and Charging Core",
        description: "Prepaid, postpaid and hybrid charging with rule-version traceability.",
        tags: ["Rating", "Charging"],
      },
      {
        title: "Billing, Invoicing and Disputes",
        description: "Governed bill runs, invoices, disputes, adjustments and collections.",
        tags: ["Billing", "Disputes"],
      },
      {
        title: "Payments, Wallets and Reconciliation",
        description: "Orchestrate payments, wallets and settlements matching (ISO 20022).",
        tags: ["Payments", "Recon"],
      },
      {
        title: "Tax and Jurisdiction Engine",
        description: "Market tax, telecom fees, currency, rounding and invoice rules.",
        tags: ["Tax", "Jurisdiction"],
      },
      {
        title: "Revenue Assurance and Fraud Signals",
        description: "Detect leakage, score risk and surface fraud signals across the value chain.",
        tags: ["Assurance", "Fraud"],
      },
    ]
  },
  {
    letter: "C",
    title: "Telecom Growth Domains",
    description: "The services that grow revenue beyond the core plan.",
    domains: [
      {
        title: "Voice, ILD and Carrier Orchestration",
        description: "International calling, routing, interconnects and partner cost control.",
        tags: ["ILD", "Routing"],
      },
      {
        title: "Device Protection and VAS",
        description: "Device protection and add-ons with claims and partner settlement.",
        tags: ["VAS", "Claims"],
      },
      {
        title: "eSIM and IoT Lifecycle",
        description: "SGP.22 eSIM lifecycle and IoT fleets and pooled allowances.",
        tags: ["eSIM", "IoT"],
      },
      {
        title: "Network API Monetization",
        description: "Meter, charge and settle programmable network capabilities.",
        tags: ["API", "Monetization"],
      },
    ]
  },
  {
    letter: "D",
    title: "Intelligence & Ecosystem",
    description: "See it, prove it, connect it.",
    domains: [
      {
        title: "AI and Decision Intelligence",
        description: "Anomaly detection, prioritization and decision support with human accountability.",
        tags: ["AI", "Decisions"],
      },
      {
        title: "Reporting, BI and Regulatory Exports",
        description: "Dashboards, finance exports, regulatory reports and audit extracts.",
        tags: ["Dashboards", "Exports"],
      },
      {
        title: "Integration and Ecosystem Layer",
        description: "TM Forum open APIs and integration with partners, vendors and core systems.",
        tags: ["Open APIs", "Ecosystem"],
      },
    ]
  }
];

const tabs = [
  { name: "All domains", count: "18", dot: null },
  { name: "Launch", count: "10", dot: "bg-slate-600" },
  { name: "Scale", count: "9", dot: "bg-slate-600" },
  { name: "Modernize", count: "7", dot: "bg-slate-600" },
  { name: "Govern", count: "7", dot: "bg-slate-600" },
];

export default function UnifiedDomainsSection() {
  const [activeTab, setActiveTab] = useState("All domains");

  return (
    <div className="flex flex-col w-full">
      {/* Platform Architecture Hero Section - Solid White Background */}
      <section className="w-full bg-white flex flex-col items-center">
        <div className="w-full max-w-[1280px] px-6 py-24 pb-12">
          <div className="max-w-[768px] flex flex-col gap-4">
            <p className="text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider">
              THE SOVEREIGN BSS FOUNDATION
            </p>
            <h1 className="text-black text-[56px] md:text-[64px] font-bold font-['Hanken_Grotesk'] leading-[1.1] tracking-tight">
              Platform Architecture
            </h1>
            <p className="text-slate-600 text-lg md:text-xl font-normal leading-relaxed pt-2">
              ZoikoNex provides a modular, ultra-high-density BSS ecosystem designed for Tier-1 global infrastructure. 18 unified domains engineered for mathematical precision and institutional sovereignty.
            </p>
          </div>
        </div>
      </section>

      {/* Domain Model Section - Stone 100 Background */}
      <section className="w-full pb-28 pt-12 bg-stone-100 flex flex-col items-center overflow-hidden font-['Inter']">
        <div className="w-full max-w-[1280px] px-6 flex flex-col gap-12">
          
          <div className="max-w-[768px] flex flex-col gap-4">
            <p className="text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider">
              PLATFORM DOMAIN MODEL
            </p>
            <h2 className="text-black text-[48px] md:text-[56px] font-semibold font-['Hanken_Grotesk'] leading-[1.1]">
              Eighteen domains.<br/>One governed architecture.
            </h2>
            <p className="text-slate-600 text-lg font-normal leading-7 pt-2">
              ZoikoNex is the full telecom monetization chain—catalog to cash—built on a governed<br className="hidden md:block"/>domain model. Every domain is evidenced, interoperable, and designed for scale.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-stone-300/20">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-6 py-2.5 transition-all duration-200 outline outline-1 outline-offset-[-1px] ${
                    isActive 
                      ? "bg-sky-600 text-white outline-transparent shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" 
                      : "bg-white text-slate-600 outline-stone-300/30 hover:bg-stone-50"
                  }`}
                >
                  {tab.dot && !isActive && <div className={`w-3.5 h-3.5 ${tab.dot}`} />}
                  <span className="text-sm font-normal">{tab.name}</span>
                  <div className={`px-2 py-0.5 rounded-xl flex items-center justify-center ${
                    isActive ? "bg-white/20 text-white" : "text-slate-500"
                  }`}>
                    <span className={isActive ? "text-[10px]" : "text-sm"}>{tab.count}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Domain Sections */}
          <div className="flex flex-col gap-24 lg:gap-32 pb-12">
            {architectureData.map((section, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
                
                {/* Left Column (Sticky Letter & Title) */}
                <div className="lg:w-[320px] lg:shrink-0 lg:sticky lg:top-32 flex flex-col gap-3.5 pt-2">
                  <div className="text-cyan-700 text-[40px] font-normal font-['Hanken_Grotesk'] leading-10">
                    {section.letter}
                  </div>
                  <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 text-sm font-normal leading-6 pr-4">
                    {section.description}
                  </p>
                </div>

                {/* Right Column (Grid of Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow w-full">
                  {section.domains.map((domain, dIdx) => (
                    <div
                      key={dIdx}
                      className={`min-h-[192px] p-6 bg-white flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                        domain.highlight
                          ? "shadow-sm outline outline-2 outline-offset-[-2px] outline-cyan-700 relative"
                          : "outline outline-1 outline-offset-[-1px] outline-stone-300/30"
                      }`}
                    >
                      {domain.highlight && (
                        <div className="absolute top-[18px] right-[18px] text-cyan-700">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 shrink-0 ${domain.highlight ? 'w-5 h-5 bg-cyan-700' : 'w-4 h-5 bg-slate-600/30'}`} />
                          <h4 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6 pr-6">
                            {domain.title}
                          </h4>
                        </div>
                        <p className="text-slate-600 text-xs font-normal leading-5">
                          {domain.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-6">
                        {domain.tags.map(tag => (
                          <div 
                            key={tag} 
                            className={`px-2 py-1 rounded-xs flex items-center justify-center ${
                              domain.highlight ? "bg-lime-300/20 text-cyan-700" : "bg-stone-100 text-zinc-900"
                            }`}
                          >
                            <span className="text-[10px] font-normal font-['JetBrains_Mono'] leading-3 tracking-wide">
                              {tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
          
          {/* Governance Spine Section */}
          <div className="w-full mt-8 bg-[#1B212D] rounded-sm overflow-hidden flex flex-col text-white font-['Inter']">
            {/* Top Bar */}
            <div className="w-full px-8 py-4 bg-[#232B38] flex items-center justify-between border-b border-white/5">
              <span className="text-emerald-500 text-xs font-semibold font-['JetBrains_Mono'] tracking-[0.2em] uppercase">
                GOVERNANCE SPINE — THE FOUNDATION OF TRUST
              </span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
              </div>
            </div>
            
            {/* 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              <div className="p-8 flex flex-col gap-4">
                <div className="w-6 h-6 bg-sky-500"></div>
                <h4 className="text-white text-base font-semibold font-['Hanken_Grotesk'] mt-2">
                  Evidence Ledger (WORM)
                </h4>
                <p className="text-slate-400 text-xs leading-5">
                  A write-once, read-many ledger. Append-only record of every material action across all eighteen domains.
                </p>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <div className="w-6 h-5 bg-sky-500"></div>
                <h4 className="text-white text-base font-semibold font-['Hanken_Grotesk'] mt-2">
                  Canonical Event Envelope
                </h4>
                <p className="text-slate-400 text-xs leading-5">
                  One locked event schema (v1.0) for every domain event on the platform—designed for interoperability.
                </p>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <div className="w-6 h-6 rounded-full bg-sky-500"></div>
                <h4 className="text-white text-base font-semibold font-['Hanken_Grotesk'] mt-2">
                  Jurisdiction Packs
                </h4>
                <p className="text-slate-400 text-xs leading-5">
                  Versioned market policy—tax, fees, currency, rounding—applied consistently across every domain.
                </p>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <div className="w-5 h-6 bg-sky-500"></div>
                <h4 className="text-white text-base font-semibold font-['Hanken_Grotesk'] mt-2">
                  ADR-Governed Change
                </h4>
                <p className="text-slate-400 text-xs leading-5">
                  No schema or decision changes outside a recorded, accepted decision record—including its costs.
                </p>
              </div>

            </div>
            
            {/* Footer Bar */}
            <div className="w-full px-8 py-4 bg-[#141822] flex items-center gap-3 border-t border-white/5">
              <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-slate-400 text-[11px] font-medium tracking-wide">
                Erasure without evidence loss: privacy requests must be resolved entity-by-entity without destroying the immutable evidence chain.
              </p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}