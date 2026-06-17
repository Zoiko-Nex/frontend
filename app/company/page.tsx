import React from 'react';
import Link from 'next/link';

export default function CompanyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      {/* 1. Hero Section */}
      <section className="w-full bg-[#1a1b2b] py-24 flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="flex-1 flex flex-col justify-start items-start gap-6">
            <h1 className="text-white text-4xl lg:text-5xl font-bold font-['Hanken_Grotesk'] leading-[1.2]">
              Building Governed Telecom Monetization Infrastructure for the Next Generation of Operators
            </h1>
            <p className="text-gray-400 text-lg font-normal font-['Inter'] leading-relaxed max-w-[576px]">
              Developed by Zoiko Tech Inc., ZoikoNex provides sovereign, precision-engineered BSS layers for high-stakes institutional environments where reliability is non-negotiable.
            </p>
            <div className="pt-4 flex flex-wrap justify-start items-center gap-4">
              <Link href="/request-a-demo">
                <button className="px-8 py-4 bg-[#2b7c9f] hover:bg-[#23637f] transition-colors rounded flex justify-start items-center gap-2">
                  <span className="text-center text-white text-sm font-semibold font-['Inter']">Request a Demo</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </Link>
              <button className="px-8 py-4 rounded border border-zinc-500/30 hover:bg-white/5 transition-colors flex justify-center items-center">
                <span className="text-center text-white text-sm font-semibold font-['Inter']">Speak With ZoikoNex</span>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center w-full lg:w-auto">
            <div className="w-full lg:w-[516px] h-64 sm:h-96 bg-black/20 rounded-xl overflow-hidden relative">
              <img src="/image/company.jpg" alt="Operator" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Identity Section */}
      <section className="w-full py-28 bg-stone-50 border-b border-stone-200 flex justify-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
          <div className="flex flex-col justify-start items-start gap-4">
            <span className="text-[#2b7c9f] text-xs font-bold font-['JetBrains_Mono'] tracking-wider uppercase">IDENTITY</span>
            <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk']">What Is ZoikoNex?</h2>
            <p className="text-slate-600 text-lg font-normal font-['Inter'] leading-relaxed max-w-[768px]">
              ZoikoNex is more than a billing system. It is a comprehensive sovereign ecosystem encompassing charging, automated taxation, multi-party settlement, and AI-governed policy enforcement, designed for deployment flexibility across any jurisdiction.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-start items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8">
                <img src="/image/company/sover.svg" alt="Sovereign Control" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">Sovereign Control</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Absolute administrative autonomy over financial logic and data residency.</p>
              </div>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-start items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8">
                <img src="/image/company/automated.svg" alt="Automated Tax" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">Automated Tax</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Real-time multi-jurisdictional compliance embedded into every transaction.</p>
              </div>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-start items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8">
                <img src="/image/company/aigovernance.svg" alt="AI Governance" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">AI Governance</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Policy-controlled AI engines that manage complexity without sacrificing trust.</p>
              </div>
            </div>

            <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-start items-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-8 h-8">
                <img src="/image/company/hybrid.svg" alt="Hybrid Scale" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">Hybrid Scale</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Deployment patterns optimized for both edge cloud and institutional data centers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Institutional Mission Section */}
      <section className="w-full py-32 bg-[#1a1b2b] flex flex-col justify-center items-center px-6">
        <div className="w-full max-w-[896px] flex flex-col items-center gap-10">
          <span className="text-lime-400 text-xs font-semibold font-['JetBrains_Mono'] tracking-widest uppercase">INSTITUTIONAL MISSION</span>
          <div className="w-full max-w-[882px] text-center justify-center text-white text-4xl font-normal font-['Hanken_Grotesk'] leading-[66px]">
            "To deliver precision monetization infrastructure <br />that provides operators with evidence-grade <br />control and mathematically verifiable compliance <br />in a complex global market."
          </div>
          <div className="w-24 h-px bg-lime-400 mt-2"></div>
        </div>
      </section>

      {/* 4. System Capabilities Section */}
      <section className="w-full py-28 bg-white flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col gap-16">
          <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk']">System Capabilities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-4.svg" alt="Product Control" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-01</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">Product & Commercial<br />Control</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Dynamic product catalog orchestration with rapid time-to-market for complex tiered offerings.</p>
              </div>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-5.svg" alt="Charging & Billing" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-02</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">Charging & Billing</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">High-throughput real-time convergent charging supporting 5G and legacy infrastructures.</p>
              </div>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-6.svg" alt="Tax Payments Settlement" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-03</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">Tax / Payments / Settlement</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Automated ledger-grade reconciliation and global tax engine integration for cross-border ops.</p>
              </div>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-7.svg" alt="Assurance Evidence" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-04</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">Assurance & Evidence</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Immutable audit trails and forensic-grade transaction logging for regulatory auditing.</p>
              </div>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-8.svg" alt="AI Governance" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-05</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">AI & Governance</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Governance-first machine learning for churn prediction and autonomous revenue protection.</p>
              </div>
            </div>

            <div className="p-8 border border-slate-200 rounded-xl flex flex-col gap-6 hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8">
                  <img src="/image/company/icon-9.svg" alt="Deployment Scale" className="w-full h-full object-contain" />
                </div>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-zinc-500 text-[10px] font-['JetBrains_Mono'] rounded font-medium">ZNX-06</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk']">Deployment & Scale</h3>
                <p className="text-slate-600 text-base font-normal font-['Inter'] leading-relaxed">Containerized microservices architecture with elastic scaling and multi-cloud orchestration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise-Grade Resilience Section */}
      <section className="w-full py-28 bg-[#f9fafb] flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-[#2b7c9f] text-xs font-bold font-['JetBrains_Mono'] tracking-wider uppercase">THE BACKING</span>
              <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Enterprise-Grade Resilience</h2>
            </div>

            <div className="flex flex-col gap-8 mt-2">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-white border border-slate-200 flex justify-center items-center shrink-0">
                  <div className="w-5 h-4">
                    <img src="/image/company/icon-10.svg" alt="Part of Zoiko Group" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Part of Zoiko Group Inc.</h3>
                  <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">
                    Leveraging the institutional stability and global strategic reach of<br />the Zoiko Group, ensuring long-term roadmap viability and<br />sovereign support.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-white border border-slate-200 flex justify-center items-center shrink-0">
                  <div className="w-5 h-4">
                    <img src="/image/company/icon-11.svg" alt="Built by Zoiko Tech" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Built by Zoiko Tech Inc.</h3>
                  <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">
                    The specialized technology arm dedicated to building heavy-duty<br />BSS/OSS layers with a focus on mathematical precision and<br />technical excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-36 bg-[#1a1b2b] rounded-lg border border-white/10 flex flex-col justify-center overflow-hidden">
            <div className="flex flex-col gap-6">
              <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Engineering Discipline</h2>
              <p className="text-gray-400 text-lg font-normal font-['Inter'] leading-7">
                We apply rigorous domain-driven architecture to telecom<br />complexity. Every line of code in ZoikoNex is audited for<br />performance, security, and policy adherence.
              </p>

              <div className="flex flex-col gap-0 mt-2.5">
                <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-1">
                  <span className="text-[#2b7c9f] text-base font-normal font-['Hanken_Grotesk'] leading-6">99.999%</span>
                  <span className="text-gray-500 text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-widest">UPTIME DESIGN</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 flex flex-col gap-1 mt-[-1px]">
                  <span className="text-[#2b7c9f] text-base font-normal font-['Hanken_Grotesk'] leading-6">ISO 27001</span>
                  <span className="text-gray-500 text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-widest">ALIGNED LOGIC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Regional Readiness Section */}
      <section className="w-full py-24 bg-white flex justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col items-center gap-16">
          <div className="flex flex-col items-center text-center gap-4 mx-auto">
            <span className="text-cyan-700 text-xs font-bold font-['JetBrains_Mono'] tracking-widest uppercase">GLOBAL REACH</span>
            <h2 className="text-zinc-900 text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk']">Regional Readiness</h2>
            <div className="text-center justify-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">
              ZoikoNex is architected for global deployment with native compliance layers for the<br />world's most critical markets.
            </div>
          </div>

          <div className="w-full h-[600px] relative bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center">
            {/* World map background */}
            <div className="absolute inset-0 opacity-20">
              <img
                src="/image/company/highmap.png"
                alt="World map"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Regional cards */}
            <div className="relative w-full h-full p-6 sm:p-10 z-10">

              <div className="absolute top-[15%] left-[8%] p-4 bg-white/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 backdrop-blur-xs flex flex-col justify-start items-start transition-transform hover:-translate-y-1">
                <div className="flex flex-col justify-start items-start">
                  <div className="text-cyan-700 text-base font-bold font-['JetBrains_Mono'] leading-6">NORTH AMERICA</div>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <div className="text-slate-600 text-[10px] font-normal font-['Inter'] leading-4">FCC / CRTC Compliant</div>
                </div>
              </div>

              <div className="absolute top-[20%] right-[12%] p-4 bg-white/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 backdrop-blur-xs flex flex-col justify-start items-start transition-transform hover:-translate-y-1">
                <div className="flex flex-col justify-start items-start">
                  <div className="text-cyan-700 text-base font-bold font-['JetBrains_Mono'] leading-6">UK & EU</div>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <div className="text-slate-600 text-[10px] font-normal font-['Inter'] leading-4">GDPR / Ofcom Ready</div>
                </div>
              </div>

              <div className="absolute bottom-[25%] right-[20%] p-4 bg-white/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 backdrop-blur-xs flex flex-col justify-start items-start transition-transform hover:-translate-y-1">
                <div className="flex flex-col justify-start items-start">
                  <div className="text-cyan-700 text-base font-bold font-['JetBrains_Mono'] leading-6">ASIA-PACIFIC</div>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <div className="text-slate-600 text-[10px] font-normal font-['Inter'] leading-4">Multi-currency Support</div>
                </div>
              </div>

              <div className="absolute bottom-[20%] left-[35%] p-4 bg-white/80 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 backdrop-blur-xs flex flex-col justify-start items-start transition-transform hover:-translate-y-1">
                <div className="flex flex-col justify-start items-start">
                  <div className="text-cyan-700 text-base font-bold font-['JetBrains_Mono'] leading-6">MIDDLE EAST</div>
                </div>
                <div className="flex flex-col justify-start items-start">
                  <div className="text-slate-600 text-[10px] font-normal font-['Inter'] leading-4">VAT Localization</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
