import React from 'react';
import Link from 'next/link';

export default function TrustPage() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50 w-full">
      {/* 1. Hero Section */}
      <section className="w-full bg-[#161822] py-24 flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-lime-300/5 via-[#161822] to-[#161822]"></div>
        <div className="w-full max-w-[1280px] px-6 flex flex-col xl:flex-row justify-between items-center gap-16 relative z-10">
          <div className="flex-1 flex flex-col justify-start items-start gap-8">
            <div className="px-3 py-1 bg-lime-300/10 rounded-xl border border-cyan-700/30 inline-flex justify-start items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white text-xs font-bold font-['JetBrains_Mono'] uppercase tracking-wider">SOVEREIGN GRADE TRUST</span>
            </div>
            <h1 className="text-white text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[1.1]">
              Trust Built <br />Into Telecom Monetization
            </h1>
            <p className="text-gray-400 text-lg font-normal font-['Inter'] leading-relaxed max-w-[576px]">
              ZoikoNex is designed to help operators secure subscriber data, govern financial workflows, control AI-assisted decisions, preserve evidence, support data residency, and maintain audit-ready telecom monetization across jurisdictions.
            </p>
            <div className="flex flex-wrap justify-start items-center gap-4">
              <Link href="/contact-us">
                <button className="px-8 py-4 bg-[#2b7c9f] hover:bg-[#23637f] transition-colors rounded flex justify-start items-center gap-2">
                  <span className="text-center text-white text-sm font-semibold font-['Inter']">Request a Trust Briefing</span>
                  <img src="/image/trust/Icon5.svg" alt="Arrow Right" className="w-4 h-4" />
                </button>
              </Link>
              <button className="px-8 py-4 rounded border border-stone-300/30 hover:bg-white/5 transition-colors flex justify-center items-center">
                <span className="text-center text-white text-sm font-semibold font-['Inter']">Start a Security Review</span>
              </button>
            </div>
          </div>

          <div className="w-full xl:w-auto h-[650px] flex items-center justify-center relative scale-75 sm:scale-100 origin-center xl:origin-right mr-0 xl:mr-8 shrink-0">
            <div className="w-[559px] h-[559px] relative mt-12 mb-12">
              {/* Concentric Squares */}
              <div className="w-[559px] h-[559px] left-0 top-0 absolute rounded-xl border border-lime-300/10"></div>
              <div className="w-96 h-96 left-[87.5px] top-[87.5px] absolute rounded-xl border border-lime-300/20"></div>
              <div className="w-72 h-72 left-[135.5px] top-[135.5px] absolute rounded-xl border border-lime-300/30"></div>

              {/* Center Trust Core */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-gray-900/80 rounded-xl shadow-[0px_0px_60px_0px_rgba(191,243,101,0.1)] border border-lime-300/10 backdrop-blur-md flex flex-col justify-center items-center z-10 w-[140px] h-[140px]">
                <img src="/image/trust/Icon.svg" alt="Trust Core" className="w-8 h-10 mb-2" />
                <span className="text-lime-300 text-[10px] font-semibold font-['JetBrains_Mono'] tracking-wider text-center">TRUST<br />CORE</span>
              </div>

              {/* SECURITY Node */}
              <div className="absolute left-[256.54px] top-[-24px] flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-900 border border-lime-300 rounded flex items-center justify-center shadow-lg relative z-10">
                  <img src="/image/trust/Icon2.svg" alt="Security" className="w-4 h-5" />
                </div>
                <span className="text-white text-[10px] mt-2 font-['JetBrains_Mono'] tracking-widest uppercase">Security</span>
              </div>

              {/* RESIDENCY Node */}
              <div className="absolute left-[535px] top-[140px] flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-900 border border-lime-300 rounded flex items-center justify-center shadow-lg relative z-10">
                  <img src="/image/trust/Icon3.svg" alt="Residency" className="w-[21px] h-[21px]" />
                </div>
                <span className="text-white text-[10px] mt-2 font-['JetBrains_Mono'] tracking-widest uppercase">Residency</span>
              </div>

              {/* AI GOV Node */}
              <div className="absolute left-[535px] top-[351px] flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-900 border border-lime-300 rounded flex items-center justify-center shadow-lg relative z-10">
                  <img src="/image/trust/Icon4.svg" alt="AI Gov" className="w-4 h-5" />
                </div>
                <span className="text-white text-[10px] mt-2 font-['JetBrains_Mono'] tracking-widest uppercase">AI Gov</span>
              </div>

              {/* FINANCE Node */}
              <div className="absolute left-[256.54px] top-[535px] flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-900 border border-lime-300 rounded flex items-center justify-center shadow-lg relative z-10">
                  <img src="/image/trust/Icon1.svg" alt="Finance" className="w-5 h-5" />
                </div>
                <span className="text-white text-[10px] mt-2 font-['JetBrains_Mono'] tracking-widest uppercase">Finance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stakeholder Trust Pathways */}
      <section className="w-full py-24 bg-white flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Stakeholder Trust Pathways</h2>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6 max-w-[672px]">
              Access specialized documentation and assurance controls tailored to your professional mandate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="px-8 pt-8 pb-14 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2">
              <img src="/image/trust/Icon6.svg" alt="CISO Path Icon" className="w-4 h-5" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">CISO Path</h3>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Deep dive into tenant isolation, encryption at rest/transit, and SOC2/ISO artifacts.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                Review Security <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="p-8 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2">
              <img src="/image/trust/Icon8.svg" alt="Compliance & Legal Icon" className="w-4 h-5" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">Compliance & Legal</h3>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Examine data residency controls, sovereignty pathways, and GDPR/CCPA alignment.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                View Compliance <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="px-8 pt-8 pb-14 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2">
              <img src="/image/trust/Icon10.svg" alt="Finance / RA Icon" className="w-5 h-4" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">Finance / RA</h3>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Revenue assurance workflows, audit trails, and financial reconciliation integrity.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                Audit Control <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="px-8 pt-8 pb-14 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2">
              <img src="/image/trust/Icon11.svg" alt="CTO / Architecture Icon" className="w-2.5 h-4" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">CTO / Architecture</h3>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Detailed API specifications, microservices isolation, and infrastructure-as-code.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                Architecture Docs <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="p-8 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2 relative">
              <img src="/image/trust/Icon12.svg" alt="Procurement Pack Icon" className="w-5 h-5" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">Procurement Pack</h3>
              <span className="px-2 py-0.5 bg-lime-800/10 text-lime-800 text-[10px] font-['JetBrains_Mono'] w-max rounded">MOST REQUESTED</span>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Standardized trust questionnaires (CAIQ, VSA) and risk assessment summaries.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                Download Pack <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="px-8 pt-8 pb-14 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow flex flex-col gap-2">
              <img src="/image/trust/Icon9.svg" alt="Public Sector Icon" className="w-5 h-5" />
              <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] pt-2">Public Sector</h3>
              <p className="text-zinc-700 text-base font-normal font-['Inter'] flex-1">Sovereign cloud integration, jurisdictional isolation, and national security compliance.</p>
              <Link href="#" className="text-sky-600 text-base font-medium font-['Inter'] flex items-center gap-2 hover:underline pt-4">
                Sovereign Pathway <img src="/image/trust/Icon12.svg" alt="Arrow Right" className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Architectural Rigor */}
      <section className="w-full py-24 bg-zinc-100 flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk']">Architectural Rigor</h2>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">
              Trust is not a perimeter; it is the foundation of our<br/>entire stack. We map every control back to the<br/>specific monetization event.
            </p>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded bg-gray-900 border border-[#BFF365] flex items-center justify-center shrink-0 mt-1">
                  <img src="/image/trust/Icon13.svg" alt="Check" className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-black text-base font-bold font-['Inter']">Identity-First Access</h4>
                  <p className="text-zinc-500 text-sm font-normal font-['Inter'] leading-tight mt-1">Hardened SSO and MFA for all administrative and billing functions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded bg-gray-900 border border-[#BFF365] flex items-center justify-center shrink-0 mt-1">
                  <img src="/image/trust/Icon13.svg" alt="Check" className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-black text-base font-bold font-['Inter']">Zero Trust Connectivity</h4>
                  <p className="text-zinc-500 text-sm font-normal font-['Inter'] leading-tight mt-1">Micro-segmentation between rating engines and billing cores.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full p-6 bg-stone-100 border-b border-slate-200 flex flex-col justify-start items-start">
              <div className="w-full flex flex-col justify-start items-start">
                <div className="w-full justify-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Trust Architecture Overview</div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex bg-white border-b border-slate-200">
                <div className="w-[30%] p-6 text-zinc-800 text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest">Domain</div>
                <div className="w-[45%] p-6 text-zinc-800 text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest">Control Mechanisms</div>
                <div className="w-[25%] p-6 text-zinc-800 text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest">Verification</div>
              </div>
              <div className="flex border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-[30%] px-6 py-5 text-black text-sm font-bold font-['Inter'] flex items-center">Data & Sovereignty</div>
                <div className="w-[45%] px-6 py-5 text-zinc-600 text-sm font-normal font-['Inter']">Shard-level encryption, multi-region residency tagging</div>
                <div className="w-[25%] px-6 py-5 text-zinc-800 text-sm font-normal font-['Inter'] flex items-center">Residency Reports</div>
              </div>
              <div className="flex border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-[30%] px-6 py-5 text-black text-sm font-bold font-['Inter'] flex items-center">Monetization Engine</div>
                <div className="w-[45%] px-6 py-5 text-zinc-600 text-sm font-normal font-['Inter']">Immutability ledger, cryptographically hashed usage logs</div>
                <div className="w-[25%] px-6 py-5 text-zinc-800 text-sm font-normal font-['Inter'] flex items-center">Audit Trail Exports</div>
              </div>
              <div className="flex border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="w-[30%] px-6 py-5 text-black text-sm font-bold font-['Inter'] flex items-center">AI & Automation</div>
                <div className="w-[45%] px-6 py-5 text-zinc-600 text-sm font-normal font-['Inter']">Human-in-the-loop triggers, restricted financial autonomy</div>
                <div className="w-[25%] px-6 py-5 text-zinc-800 text-sm font-normal font-['Inter'] flex items-center">Decision Traceability</div>
              </div>
              <div className="flex hover:bg-slate-50 transition-colors">
                <div className="w-[30%] px-6 py-5 text-black text-sm font-bold font-['Inter'] flex items-center">Operations</div>
                <div className="w-[45%] px-6 py-5 text-zinc-600 text-sm font-normal font-['Inter']">SOC2 Type II, ISO 27001, Environment isolation (Prod/Dev)</div>
                <div className="w-[25%] px-6 py-5 text-zinc-800 text-sm font-normal font-['Inter'] flex items-center">Third-party Audits</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Region-Aware Sovereignty */}
      <section className="w-full py-24 bg-gray-900 flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Region-Aware Sovereignty</h2>
            <p className="text-gray-400 text-base font-normal font-['Inter'] leading-relaxed max-w-[672px]">
              Maintain strict adherence to local laws with our globally distributed, locally isolated architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                <div className="w-full p-6 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-base font-bold font-['Inter'] leading-6">North America</div>
                  <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-4">HIPAA, CCPA, US Sovereign Cloud<br/>options available.</div>
                </div>
                <div className="w-full p-6 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-base font-bold font-['Inter'] leading-6">UK & EU</div>
                  <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-4">GDPR compliance, local sharding in<br/>UK/EU regions.</div>
                </div>
                <div className="w-full px-6 pt-6 pb-10 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-base font-bold font-['Inter'] leading-6">Middle East & Africa</div>
                  <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-4">KSA PDPL & local data residency support.</div>
                </div>
                <div className="w-full p-6 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-base font-bold font-['Inter'] leading-6">Asia-Pacific</div>
                  <div className="text-gray-500 text-xs font-normal font-['Inter'] leading-4">Regional clusters across Singapore,<br/>Australia, India.</div>
                </div>
              </div>
              <div className="w-full p-6 bg-lime-300/10 rounded-tr-sm rounded-br-sm border-l-4 border-white flex flex-col justify-start items-start">
                <div className="text-white text-base font-normal font-['Inter'] leading-6">"Our region-aware architecture ensures metadata and subscriber<br/>content never leave their jurisdictional home unless explicitly permitted<br/>by policy."</div>
              </div>
            </div>

            <div className="relative w-full flex flex-col justify-start items-start">
              <div className="absolute inset-[-16px] opacity-0 bg-lime-300/10 blur-[32px] pointer-events-none"></div>
              <div className="w-full p-8 bg-black/40 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-start items-start gap-6 relative z-10">
                <div className="w-full relative bg-gray-900 rounded-sm flex justify-center items-center overflow-hidden h-[300px]">
                  <img className="w-full h-full object-cover opacity-60" src="/image/trust/map.png" alt="Map" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <img src="/image/trust/Icon14.svg" alt="Node" className="w-14 h-14" />
                    <div className="pt-2 text-white text-[10px] font-normal font-['JetBrains_Mono'] leading-4 tracking-wider text-center">
                      REAL-TIME GLOBAL MAPPING
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center gap-2">
                  <div className="text-gray-500 text-[11px] sm:text-xs font-normal font-['Liberation_Mono'] uppercase leading-4 tracking-wider">NODES: 42 ACTIVE</div>
                  <div className="text-gray-500 text-[11px] sm:text-xs font-normal font-['Liberation_Mono'] uppercase leading-4 tracking-wider">LATENCY: {'<'}15MS</div>
                  <div className="text-gray-500 text-[11px] sm:text-xs font-normal font-['Liberation_Mono'] uppercase leading-4 tracking-wider">SOVEREIGNTY: LOCKED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Evidence Ledger & AI Gov */}
      <section className="w-full py-24 bg-white flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-6 w-full">
            <div className="w-16 h-16 bg-zinc-100 rounded-lg flex justify-center items-center">
              <img src="/image/trust/Icon15.svg" alt="Evidence Ledger" className="w-6 h-6 object-contain" />
            </div>
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Evidence Ledger</h2>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">
              Beyond standard logs, we maintain a production-grade evidence ledger for<br/>every financial transaction. This includes source record lineage, usage rating<br/>logs, and an immutable history ready for forensic audit.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
                <span className="text-zinc-900 text-sm font-semibold font-['Inter'] leading-5">Cryptographic Integrity Verification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
                <span className="text-zinc-900 text-sm font-semibold font-['Inter'] leading-5">Granular Event Lineage Mapping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
                <span className="text-zinc-900 text-sm font-semibold font-['Inter'] leading-5">Multi-Signature Administrative Review</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="w-16 h-16 bg-zinc-100 rounded-lg flex justify-center items-center">
              <img src="/image/trust/Icon16.svg" alt="AI Governance" className="w-6 h-6 object-contain" />
            </div>
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">AI Governance</h2>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">
              AI in monetization requires strict constraints. We implement restricted<br/>autonomy for high-risk financial actions and maintain full traceability for<br/>every machine-assisted recommendation.
            </p>
            <div className="p-6 bg-stone-100 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="text-zinc-900 text-xs font-bold font-['JetBrains_Mono'] leading-4">POLICY: AUTO-BILLING</div>
                <div className="px-2 py-0.5 bg-lime-300 rounded-sm flex items-center justify-center">
                  <span className="text-lime-700 text-[10px] font-normal font-['Inter'] leading-4">ENFORCED</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-start w-full">
                    <div className="text-zinc-700 text-xs font-normal font-['Inter'] leading-4">Recommendation Clarity</div>
                    <div className="text-black text-xs font-bold font-['Inter'] leading-4">100% Traceable</div>
                  </div>
                  <div className="w-full h-1 bg-neutral-200 rounded-sm overflow-hidden">
                    <div className="w-full h-full bg-lime-400"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <div className="flex justify-between items-start w-full">
                    <div className="text-zinc-700 text-xs font-normal font-['Inter'] leading-4">Human-in-the-Loop Threshold</div>
                    <div className="text-black text-xs font-bold font-['Inter'] leading-4">{'>'}$500 Transaction</div>
                  </div>
                  <div className="w-full h-1 bg-neutral-200 rounded-sm relative">
                    <div className="absolute left-0 top-0 h-full w-[85%] bg-sky-600 rounded-l-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Assurance Horizontal Cards */}
      <section className="w-full py-16 bg-stone-100 border-y border-slate-200 flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-center">
            <div className="pb-4 flex flex-col justify-start items-center">
              <img src="/image/trust/Icon17.svg" alt="Revenue Assurance" className="w-7 h-7 object-contain" />
            </div>
            <div className="pb-2 flex flex-col justify-start items-center">
              <h3 className="text-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Revenue Assurance</h3>
            </div>
            <div className="px-5 flex flex-col justify-start items-center">
              <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">End-to-end reconciliation checks from raw<br/>usage capture to final settlement matching.</p>
            </div>
          </div>
          <div className="p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-center">
            <div className="pb-4 flex flex-col justify-start items-center">
              <img src="/image/trust/Icon18.svg" alt="Retention & Shred" className="w-7 h-7 object-contain" />
            </div>
            <div className="pb-2 flex flex-col justify-start items-center">
              <h3 className="text-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Retention & Shred</h3>
            </div>
            <div className="px-4 flex flex-col justify-start items-center">
              <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Policy-driven legal holds and cryptographic<br/>shredding of expired subscriber data.</p>
            </div>
          </div>
          <div className="p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-center">
            <div className="pb-4 flex flex-col justify-start items-center">
              <img src="/image/trust/Icon19.svg" alt="Operational Guardrails" className="w-8 h-8 object-contain" />
            </div>
            <div className="pb-2 flex flex-col justify-start items-center">
              <h3 className="text-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Operational Guardrails</h3>
            </div>
            <div className="flex flex-col justify-start items-center">
              <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Environment separation and release governance<br/>ensuring prod integrity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 6-Step Trust Onboarding */}
      <section className="w-full py-24 bg-white flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col items-center gap-16">
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk']">6-Step Trust Onboarding</h2>
            <p className="text-zinc-700 text-base font-normal font-['Inter']">The rigorous pathway from initial briefing to sovereign deployment.</p>
          </div>

          <div className="w-full relative py-8 hidden md:block">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div className="grid grid-cols-6 gap-4 relative z-10">
              {['Trust Briefing', 'Security Review', 'Data Residency Lock', 'Legal Review', 'Audit Dry-Run', 'Sovereign Approval'].map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center bg-white ${index === 0 ? 'border-cyan-700 text-black font-bold' : 'border-slate-200 text-zinc-700 font-semibold'}`}>
                    0{index + 1}
                  </div>
                  <span className="text-center text-zinc-900 text-sm font-bold font-['Inter']">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view for steps */}
          <div className="w-full flex flex-col gap-6 md:hidden">
            {['Trust Briefing', 'Security Review', 'Data Residency Lock', 'Legal Review', 'Audit Dry-Run', 'Sovereign Approval'].map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border-2 flex shrink-0 items-center justify-center bg-white ${index === 0 ? 'border-cyan-700 text-black font-bold' : 'border-slate-200 text-zinc-700 font-semibold'}`}>
                  0{index + 1}
                </div>
                <span className="text-zinc-900 text-base font-bold font-['Inter']">{step}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-[#161822] rounded-xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 mt-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-2xl font-semibold font-['Inter']">Ready for a Technical Deep Dive?</h3>
              <p className="text-gray-400 text-sm font-normal">Download the full Nexus Sovereign Security Architecture whitepaper and CAIQ assessment.</p>
            </div>
            <button className="px-6 py-3 bg-[#2b7c9f] hover:bg-[#23637f] transition-colors rounded text-white text-sm font-medium whitespace-nowrap">
              Request Procurement Pack
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
