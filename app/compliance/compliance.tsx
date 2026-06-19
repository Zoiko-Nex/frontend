"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// --- TYPES & INTERFACES ---
interface ValueCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

interface ModelRowProps {
  iconSrc: string;
  title: string;
  description: string;
  outcome: string;
}

interface MatrixRowProps {
  domain: string;
  concept: string;
  benefit: string;
}

interface LedgerCardProps {
  timestamp: string;
  title: string;
  ledgerId: string;
  borderColorClass: string;
  textColorClass: string;
  iconSrc?: string;
}

interface JourneyStepProps {
  title: string;
  description: string;
}

export default function ComplianceGovernancePage() {
  return (
    <main className="bg-black text-white antialiased overflow-x-hidden min-h-screen">
      
      {/* SECTION 1: HERO & COMPLIANCE ENGINE DIAGRAM */}
      <section className="w-full bg-[#1E1E2F] relative py-18 px-6 lg:px-24 flex flex-col justify-center items-center overflow-hidden">
        <div className="absolute bg-[#1E1E2F] bottom-0 left-0 w-full h-16 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center z-10 mx-auto">
          <div className="flex flex-col items-start gap-6">
            <span className="text-[#bfff65] text-xs font-bold font-mono tracking-wider uppercase">
              Governance & Trust
            </span>
            <h1 className="text-white text-4xl lg:text-5xl font-bold font-hanken leading-tight lg:leading-[66px]">
              Compliance built into<br />telecom operations.
            </h1>
            <p className="text-stone-300 text-lg font-normal leading-7 max-w-xl">
              The world’s first sovereign-tier compliance engine. Automate governance across fragmented data landscapes, complex billing jurisdictions, and autonomous AI decision-making with mathematical certainty.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="px-8 py-4 bg-cyan-700 shadow-[0px_0px_20px_0px_rgba(191,243,101,0.15)] hover:bg-cyan-600 transition text-white text-base font-medium rounded-xs">
                Request Compliance Review
              </button>
              <Link  href="/request-a-demo"
              className="px-8 py-4 border border-white hover:bg-white/10 transition text-white text-base font-medium rounded-xs">
                Request a Demo
              </Link>
            </div>
          </div>
          
          {/* INTERACTIVE ENGINE DIAGRAM PLACEHOLDER */}
          <div className="w-full flex justify-center lg:justify-end items-center min-h-[450px]">
            <div className="w-full max-w-[350px] aspect-square relative rounded-xl border border-stone-800 flex justify-center items-center">
              <div className="absolute inset-0 opacity-20 rounded-xl border-2 border-[#bfff65] animate-pulse" />
              
              {/* Top Node */}
              <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-gray-900/90 border border-stone-800 p-3 backdrop-blur-md flex flex-col items-center min-w-[140px] rounded-xs">
                <Image className=" mb-1" 
                        src="/image/compliance/Icon (1).png"
                        alt="icon"
                        width={20}
                        height={20}

                />
                <span className="text-white text-[10px] font-mono tracking-tight">DATA PROTECTION</span>
              </div>
              
              {/* Bottom Node */}
              <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 bg-gray-900/90 border border-stone-800 p-3 backdrop-blur-md flex flex-col items-center min-w-[140px] rounded-xs">
              <Image className=" mb-1" 
                        src="/image/compliance/Icon (3).png"
                        alt="icon"
                        width={20}
                        height={20}

                />
                <span className="text-white text-[10px] font-mono tracking-tight">TAX / JURISDICTION</span>
              </div>
              
              {/* Left Node */}
              <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 bg-gray-900/90 border border-stone-800 p-3 backdrop-blur-md flex flex-col items-center min-w-[140px] rounded-xs">
              <Image className=" mb-1" 
                        src="/image/compliance/Icon (2).png"
                        alt="icon"
                        width={20}
                        height={20}

                />
                <span className="text-white text-[10px] font-mono tracking-tight">TELECOM CONTROLS</span>
              </div>
              
              {/* Right Node */}
              <div className="absolute right-[-30px] top-1/2 -translate-y-1/2 bg-gray-900/90 border border-stone-800 p-3 backdrop-blur-md flex flex-col items-center min-w-[140px] rounded-xs">
              <Image className=" mb-1" 
                        src="/image/compliance/Icon (4).png"
                        alt="icon"
                        width={20}
                        height={20}

                />
                <span className="text-white text-[10px] font-mono tracking-tight">AI GOVERNANCE</span>
              </div>
              
              {/* Core Center Block */}
              <div className="w-36 h-36 bg-[#bfff65]/20 border-2 border-[#bfff65] shadow-[0px_0px_40px_rgba(191,243,101,0.1)] backdrop-blur-md flex justify-center items-center rounded-xs">
                <span className="text-[#bfff65] text-sm font-bold font-mono tracking-wider">CORE ENGINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY COMPLIANCE MATTERS */}
      <section className="w-full bg-black py-15 px-6 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-16 mx-auto">
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-4xl font-semibold font-hanken leading-tight">Why Compliance Matters</h2>
            <p className="text-stone-400 text-lg font-normal max-w-2xl leading-6">
              Bridging the gap between technological speed and institutional accountability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard iconSrc="/image/compliance/Icon (5).png" title="Faster Evaluations" description="Reduce RFP and security review cycles by 70% with pre-mapped sovereign controls." />
            <ValueCard iconSrc="/image/compliance/Icon (6).png" title="Fewer Operational Gaps" description="Automated evidence collection ensures controls are active 24/7, not just at audit time." />
            <ValueCard iconSrc="/image/compliance/Icon (7).png" title="Safer Expansion" description="Instantly adapt to local tax laws and data residency requirements in new markets." />
            <ValueCard iconSrc="/image/compliance/Icon (8).png" title="Higher Retention" description="Build extreme trust with enterprise clients through absolute transparency and auditability." />
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPLIANCE OPERATING MODEL */}
      <section className="w-full bg-[#13131a] py-13 px-6 border-t border-b border-stone-800 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-16 mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[#bfff65] text-xs font-semibold font-mono tracking-wider uppercase">Framework Architecture</span>
            <h2 className="text-white text-4xl font-semibold font-hanken leading-tight">Compliance Operating Model</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-stone-800 divide-y md:divide-y-0 lg:divide-x divide-stone-800 bg-gray-900/40 rounded-xs overflow-hidden">
            <ModelRow iconSrc="/image/compliance/Icon (9).png" title="Data Protection" description="Granular control over PII processing, data localization, and zero-trust encryption paths." outcome="ZERO DATA LEAKAGE" />
            <ModelRow iconSrc="/image/compliance/Icon (10).png" title="Telecom Policy" description="Automated adherence to local licensing, lawful intercept, and emergency service routing." outcome="REGULATORY HARMONY" />
            <ModelRow iconSrc="/image/compliance/Icon (11).png" title="Tax & Jurisdiction" description="Real-time tax calculation and jurisdictional revenue reporting for global distribution." outcome="TAX AUDIT READINESS" />
            <ModelRow iconSrc="/image/compliance/Icon (12).png" title="Billing/Payments" description="Secure handling of PCI-DSS transactions and anti-fraud operational logic." outcome="FINANCIAL INTEGRITY" />
            <ModelRow iconSrc="/image/compliance/Icon (13).png" title="AI & Automation" description="Explainable AI decisions with immutable logs for automated customer service actions." outcome="ALGORITHMIC BIAS CONTROL" />
            <ModelRow iconSrc="/image/compliance/Icon (14).png" title="Partner & API" description="Third-party access governance and secure data handshake protocols." outcome="ECOSYSTEM TRUST" />
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTROL AREAS MATRIX */}
      <section className="w-full bg-gray-950 py-14 px-6 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-12 mx-auto">
          <div className="flex flex-col gap-4">
            <h2 className="text-white text-4xl font-semibold font-hanken leading-tight">Control Areas Matrix</h2>
            <p className="text-stone-400 text-base font-normal">Mapping operations to institutional protection standards.</p>
          </div>
          
          <div className="w-full overflow-x-auto border border-stone-800 rounded-xs bg-gray-900/20">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-900 text-left border-b border-stone-800">
                  <th className="p-6 text-white text-sm font-bold font-mono tracking-wider w-1/4">OPERATIONAL DOMAIN</th>
                  <th className="p-6 text-white text-sm font-bold font-mono tracking-wider w-5/12">PROTECTION CONCEPT</th>
                  <th className="p-6 text-white text-sm font-bold font-mono tracking-wider w-1/3">BUYER BENEFIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                <MatrixRow domain="Subscriber Data" concept="Differential privacy & field-level encryption" benefit="Compliance with GDPR and local data residency laws" />
                <MatrixRow domain="Billing Actions" concept="Immutable financial sequencing & tax separation" benefit="Immediate revenue auditability and financial clarity" />
                <MatrixRow domain="AI Decisions" concept="Human-in-the-loop overrides & logic traces" benefit="Protection against automated bias and liability gaps" />
                <MatrixRow domain="Network Routing" concept="Jurisdiction-aware traffic management" benefit="National sovereignty and Lawful Intercept compliance" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: EVIDENCE STREAMS */}
 <section className="w-full bg-black py-20 px-6 lg:px-24 flex flex-col justify-center items-center border-t border-stone-900">
  <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mx-auto">
    
    <div className="flex flex-col gap-4 lg:col-span-1">
      <h2 className="text-white text-3xl font-semibold font-hanken leading-tight tracking-tight">
        Every meaningful<br />control needs an<br />accountable record.
      </h2>
      <p className="text-stone-400 text-base font-normal leading-6 max-w-sm">
        We replace static documents with living evidence streams.
      </p>
    </div>
    
    {/* Stable internal grid block that prevents layout breakage on small tabs/monitors */}
    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      <LedgerCard 
        timestamp="2026-05-12 14:32:01 UTC" 
        title="Billing Adjustment Auth" 
        ledgerId="#9921-X" 
        borderColorClass="border-[#bfff65]" 
        textColorClass="text-[#bfff65]" 
      />
      <LedgerCard 
        timestamp="2026-05-12 14:35:10 UTC" 
        title="Policy Decision Hash" 
        ledgerId="#9922-A" 
        borderColorClass="border-[#0284c7]" 
        textColorClass="text-[#0284c7]" 
      />
      <LedgerCard 
        timestamp="2026-05-12 14:40:05 UTC" 
        title="Data Export Consent" 
        ledgerId="#9923-Z" 
        borderColorClass="border-[#bfff65]" 
        textColorClass="text-[#bfff65]" 
      />
    </div>

  </div>
</section>

      {/* SECTION 6: IMPLEMENTATION JOURNEY */}
      <section className="w-full bg-[#13131a] py-15 px-6 flex flex-col justify-center items-center">
        <div className="max-w-6xl w-full flex flex-col gap-16 mx-auto">
          <h2 className="text-center text-3xl lg:text-4xl font-semibold font-hanken text-white">The Compliance Implementation Journey</h2>
          
          <div className="relative w-full">
            <div className="absolute top-[12px] left-0 w-full h-px bg-stone-800 hidden lg:block z-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              <JourneyStep title="Public Review" description="Reviewing current operational blind spots and existing regulatory liabilities." />
              <JourneyStep title="Control Mapping" description="Mapping Sovereign controls to your specific jurisdictional requirements." />
              <JourneyStep title="Deployment" description="Activating automated evidence collectors across the platform fabric." />
              <JourneyStep title="Validation" description="Testing the evidence output against SOC2/GDPR auditing tools." />
              <JourneyStep title="Ongoing Governance" description="Continuous monitoring with real-time alerts for policy deviations." />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="w-full py-13 bg-[#0f172a] flex flex-col justify-center items-center px-6 border-t border-stone-800 text-center">
        <div className="max-w-3xl w-full flex flex-col items-center gap-8 mx-auto">
          <h2 className="text-white text-2xl lg:text-3xl font-bold font-hanken leading-tight">
            Bring compliance into the operating model before scale exposes the gaps.
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 w-full">
            <button className="px-8 py-4 bg-cyan-700 hover:bg-cyan-600 shadow-[0px_0px_20px_0px_rgba(191,243,101,0.15)] transition rounded-xs text-white text-base font-semibold tracking-wider">
              Request Compliance Review
            </button>
            <button className="px-8 py-4 border border-white hover:bg-white/5 transition rounded-xs text-white text-base font-semibold tracking-wider">
              Contact Technical Lead
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

// --- SUB-COMPONENTS ---

const ValueCard: React.FC<ValueCardProps> = ({ iconSrc, title, description }) => (
  <div className="p-8 bg-gray-900 border border-stone-800 rounded-xs flex flex-col gap-4 hover:border-stone-700 transition">
    <div className="w-8 h-8 flex items-center justify-start shrink-0">
      <Image src={iconSrc} alt={`${title} Icon`} width={32} height={32} className="object-contain" />
    </div>
    <h3 className="text-white text-2xl font-semibold font-hanken mt-2">{title}</h3>
    <p className="text-stone-400 text-sm font-normal leading-6">{description}</p>
  </div>
);

const ModelRow: React.FC<ModelRowProps> = ({ iconSrc, title, description, outcome }) => (
  <div className="p-8 bg-transparent flex flex-col gap-4 hover:bg-white/[0.02] transition">
    <div className="w-12 h-12 flex items-center justify-start shrink-0">
      <Image 
        src={iconSrc} 
        alt="" 
        width={32} 
        height={32} 
        className="object-contain" 
      />
    </div>
    <h3 className="text-white text-2xl font-semibold font-hanken">{title}</h3>
    <p className="text-stone-400 text-base font-normal leading-6 max-w-sm">{description}</p>
    <div className="pt-6 mt-auto border-t border-stone-800/60">
      <span className="text-[#bfff65] text-[10px] font-bold font-mono tracking-wider">OUTCOME: {outcome}</span>
    </div>
  </div>
);

const MatrixRow: React.FC<MatrixRowProps> = ({ domain, concept, benefit }) => (
  <tr className="hover:bg-white/[0.02] transition">
    <td className="p-6 text-[#bfff65] text-base font-semibold">{domain}</td>
    <td className="p-6 text-white text-base font-normal">{concept}</td>
    <td className="p-6 text-stone-300 text-base font-normal">{benefit}</td>
  </tr>
);

const LedgerCard: React.FC<LedgerCardProps> = ({ 
  timestamp, 
  title, 
  ledgerId, 
  borderColorClass, 
  textColorClass,
  iconSrc = "/image/security/Icon.png" // Default fallback icon
}) => (
  <div className={`p-5 bg-gray-900/40 border-l-4 ${borderColorClass} border-y border-r border-stone-800/80 rounded-xs flex flex-col gap-2 w-full transition hover:bg-gray-900/60`}>
    <span className="text-[10px] font-mono text-stone-500 tracking-wider">{timestamp}</span>
    <h4 className="text-white text-sm font-semibold tracking-wide">{title}</h4>
    <div className="flex justify-between items-center pt-3 mt-auto border-t border-stone-800/40">
      <div className="flex items-center gap-2">
        <span className={`${textColorClass} text-xs font-mono font-medium tracking-tight`}>
          LEDGER ID: {ledgerId}
        </span>
        {/* Exact placement of the Figma badge icon right next to the text string */}
        <div className="w-3.5 h-3.5 relative flex items-center justify-center shrink-0">
          <Image 
            src={iconSrc} 
            alt="Verified Ledger Status" 
            width={14} 
            height={14} 
            className="object-contain"
          />
        </div>
      </div>
    </div>
  </div>
);

const JourneyStep: React.FC<JourneyStepProps> = ({ title, description }) => (
  <div className="flex flex-col items-start gap-4">
    <div className="w-6 h-6 bg-[#bfff65] rounded-full ring-4 ring-[#bfff65]/10 shrink-0 z-10" />
    <h3 className="text-white text-2xl font-semibold font-hanken pt-2">{title}</h3>
    <p className="text-stone-400 text-sm font-normal leading-5">{description}</p>
  </div>
);