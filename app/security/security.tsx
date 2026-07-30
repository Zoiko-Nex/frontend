"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// --- TYPES FOR MODULAR DATA RENDERING ---
interface SecurityCardProps {
  iconSrc: string;
  title: string;
  description: string;
}

interface StackLayerProps {
  layer: string;
  title: string;
  borderColor: string;
  textColor: string;
  opacityClass: string;
}

interface MatrixRowProps {
  workflow: string;
  risk: string;
  concept: string;
  benefit: string;
}

interface PathwayStepProps {
  stepNumber: number;
  title: string;
  description: string;
}

export default function SecurityGovernancePage() {
  return (
    <main className="bg-[#f5f3f4] text-zinc-900 antialiased overflow-x-hidden min-h-screen">
      
      {/* HERO SECTION */}
      <section className="w-full min-h-screen bg-[#0e7490] relative flex flex-col justify-center items-center py-9 px-6 lg:px-28 overflow-hidden">
        {/* Subtle Bottom Backdrop Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-15 bg-gradient-to-r from-[#f5f3f4] to-[#f5f3f4]/0 pointer-events-none" />
        
        <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center gap-12 z-10 mx-auto">
          <div className="flex-1 flex flex-col items-start gap-6">
            <span className="text-[#bfff65] text-xs font-bold font-mono tracking-wider uppercase">
              Secure By Design
            </span>
            <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight lg:leading-[46px] max-w-[576px]">
              Secure telecom operations.Governed <span className="text-[#bfff65]"> from the core.</span>
            </h1>
            <p className="text-white text-lg font-normal leading-7 max-w-[512px]">
              ZoikoNex is designed to protect the critical systems behind telecom monetization — customer accounts, product catalog, charging, billing, taxation, payments, SIM/eSIM lifecycle, APIs, partner access, AI-assisted workflows, and operational evidence.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <Link href="/contact-us">
                <button className="px-8 py-4 bg-white hover:bg-stone-100 transition rounded-xs text-black text-sm font-semibold inline-flex items-center gap-2 shadow-sm">
                  Request Security Briefing
                  <Image className="w-4 h-4 "
                      src="/image/security/Icon.png"
                      alt="icon"
                      width={16}
                      height={16}
                  />
                </button>
              </Link>
              <Link href="/contact-us">
                <button className="px-8 py-4 border border-white hover:bg-white/10 transition rounded-xs text-white text-sm font-semibold">
                  Request Trust Pack
                </button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative flex justify-center items-center min-h-[400px] lg:min-h-[600px] w-full">
            <div className="absolute inset-0 bg-[#bfff65]/5 rounded-xl blur-3xl pointer-events-none" />
            <Image 
              className="w-full max-w-[588px] h-auto" 
              src="/image/security/securityhero.png" 
              alt="Security Telemetry Infrastructure" 
              width={588}
              height={328}
              priority
            />
          </div>
        </div>
      </section>

      {/* WHY SECURITY MATTERS SECTION */}
      <section className="w-full bg-[#f5f3f4] py-15 px-6 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-16 mx-auto">
          <div className="flex flex-col gap-6">
            <h2 className="text-zinc-900 text-3xl lg:text-4xl font-semibold leading-snug lg:leading-[48px] max-w-[768px]">
              Security is not a back-office issue. It protects revenue, trust, and operational continuity.
            </h2>
            <p className="text-slate-600 text-lg font-normal leading-7 max-w-[672px]">
              Telecom BSS platforms sit at the intersection of customer identity, service entitlement, charging, billing, payment, tax, partner settlement, provisioning, support, and regulatory workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SecurityCard 
              iconSrc="/image/security/Icon (1).png" 
              title="Customer trust and subscriber data" 
              description="Maintaining sovereign control over sensitive PII and subscriber credentials across global jurisdictions." 
            />
            <SecurityCard 
              iconSrc="/image/security/Icon (2).png" 
              title="Revenue integrity and payment protection" 
              description="Protecting the integrity of charging events and payment processing from sophisticated fraud." 
            />
            <SecurityCard 
              iconSrc="/image/security/Icon (3).png" 
              title="API and partner ecosystem risk" 
              description="Securing high-traffic API boundaries that connect carriers to the global digital economy." 
            />
            <SecurityCard 
              iconSrc="/image/security/Icon (4).png" 
              title="Operational continuity and audit readiness" 
              description="Ensuring verifiable operational evidence for compliance and rapid incident recovery." 
            />
          </div>
        </div>
      </section>

      {/* INTERACTIVE CONTROL MODEL (STACK) */}
      <section className="w-full bg-[#1e1e2f] py-15 px-6 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col items-center gap-16 mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-[#bfff65] text-xs font-semibold font-mono tracking-wider uppercase">Governance Stack</span>
            <h2 className="text-white text-2xl lg:text-3xl font-semibold leading-snug lg:leading-[38px] max-w-5xl">
              A layered control model for high-stakes telecom operations.
            </h2>
          </div>
          
          <div className="w-full max-w-[896px] flex flex-col gap-3">
            <StackLayer layer="LAYER 07" title="Governance" borderColor="border-[#bfff65]" textColor="text-[#bfff65]" opacityClass="opacity-100" />
            <StackLayer layer="LAYER 06" title="Incident Readiness" borderColor="border-[#0284c7]" textColor="text-[#0284c7]" opacityClass="opacity-90" />
            <StackLayer layer="LAYER 05" title="Monitoring & Evidence" borderColor="border-[#bfff65]" textColor="text-[#bfff65]" opacityClass="opacity-80" />
            <StackLayer layer="LAYER 04" title="Infrastructure Hardening" borderColor="border-[#0284c7]" textColor="text-[#0284c7]" opacityClass="opacity-70" />
            <StackLayer layer="LAYER 03" title="Application & API" borderColor="border-[#bfff65]" textColor="text-[#bfff65]" opacityClass="opacity-60" />
            <StackLayer layer="LAYER 02" title="Data Protection" borderColor="border-[#0284c7]" textColor="text-[#0284c7]" opacityClass="opacity-50" />
            <StackLayer layer="LAYER 01" title="Identity & Access" borderColor="border-[#bfff65]" textColor="text-[#bfff65]" opacityClass="opacity-40" />
          </div>
        </div>
      </section>

      {/* PROTECTION MATRIX TABLE */}
      <section className="w-full bg-[#f5f3f4] py-24 px-6 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-12 mx-auto">
          <h2 className="text-zinc-900 text-3xl lg:text-4xl font-semibold">What ZoikoNex Protects</h2>
          
          <div className="w-full overflow-x-auto border border-gray-300 rounded-xs bg-white">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-left bg-stone-50">
                  <th className="py-4 px-6 text-slate-600 text-xs font-semibold font-mono tracking-wider uppercase w-1/4">Workflow</th>
                  <th className="py-4 px-6 text-slate-600 text-xs font-semibold font-mono tracking-wider uppercase w-1/4">Primary Risk</th>
                  <th className="py-4 px-6 text-slate-600 text-xs font-semibold font-mono tracking-wider uppercase w-1/3">Protection Concept</th>
                  <th className="py-4 px-6 text-slate-600 text-xs font-semibold font-mono tracking-wider uppercase w-1/4">Buyer Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <MatrixRow workflow="Onboarding" risk="Identity spoofing & Fraud" concept="Multi-step KYC with biometrics" benefit="Reduced bad debt" />
                <MatrixRow workflow="Charging" risk="Real-time revenue leak" concept="Encrypted charging streams" benefit="Revenue assurance" />
                <MatrixRow workflow="SIM/eSIM" risk="Unauthorized profile swap" concept="GSMA-certified HSM vaulting" benefit="Network security" />
                <MatrixRow workflow="APIs" risk="Data exfiltration" concept="OAuth2 + mTLS mandatory" benefit="Ecosystem trust" />
                <MatrixRow workflow="AI Workflows" risk="Hallucination & Bias" concept="Human-in-the-loop guardrails" benefit="Regulatory compliance" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* REVIEW PATHWAY */}
      <section className="w-full bg-[#1e1e2f] py-28 px-6 flex flex-col justify-center items-center">
        <div className="max-w-6xl w-full flex flex-col gap-16 mx-auto">
          <h2 className="text-center text-3xl lg:text-4xl font-semibold text-white">Security Assurance Pathway</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
            <PathwayStep stepNumber={1} title="Public Overview" description="Initial architecture and security whitepaper review." />
            <PathwayStep stepNumber={2} title="Trust Pack" description="NDAs and access to detailed security certifications." />
            <PathwayStep stepNumber={3} title="Questionnaire" description="Deep-dive vendor risk assessment fulfillment." />
            <PathwayStep stepNumber={4} title="Briefing" description="Direct session with our CISO and Lead Architects." />
            <PathwayStep stepNumber={5} title="Planning" description="Defining security controls for deployment." />
            <PathwayStep stepNumber={6} title="Onboarding" description="Formal governance activation and monitoring." />
          </div>
        </div>
      </section>

      {/* STANDARDS ALIGNMENT */}
      <section className="w-full py-13 bg-[#f5f3f4] border-t border-slate-200 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full flex flex-col gap-10 px-6 mx-auto">
          <p className="text-center text-slate-600 text-xs font-semibold font-mono tracking-wider uppercase">
            Designed to Support Global Standards
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-30 opacity-50">
            {["NIST CSF 2.0", "CIS v8", "OWASP API", "GSMA eSIM"].map((standard) => (
              <div key={standard} className="text-zinc-900 text-xl font-bold bg-white px-6 py-3 border border-gray-300 rounded-xs shadow-xs">
                {standard}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="w-full py-15 relative bg-[#1e1e2f] flex flex-col justify-center items-center overflow-hidden px-6">
        <div className="absolute right-[-10%] top-0 w-[480px] h-[520px] bg-[#bfff65]/5 rounded-xl blur-3xl pointer-events-none" />
        <div className="absolute left-[-10%] top-0 w-[480px] h-[520px] bg-[#0284c7]/5 rounded-xl blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl w-full flex flex-col items-center gap-6 relative z-10 text-center mx-auto">
          <h2 className="text-white text-2xl lg:text-4xl font-bold leading-tight lg:leading-[66px] max-w-4xl">
            Ready for a serious security review?
          </h2>
          <p className="text-gray-400 text-lg font-normal leading-7 max-w-[672px]">
            Request a ZoikoNex security briefing or Trust Pack to understand how the platform is designed to support secure telecom monetization, governed operations, and enterprise implementation readiness.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-6">
            <Link href="/contact-us">
              <button className="px-10 py-5 bg-[#2d84b8] hover:bg-[#246e98] transition rounded-xs text-white text-xs font-semibold tracking-wider uppercase">
                Request Security Briefing
              </button>
            </Link>
            <Link href="/contact-us">
              <button className="px-10 py-5 border border-gray-500 text-gray-300 hover:bg-white/5 transition rounded-xs text-xs font-semibold tracking-wider uppercase">
                Request Trust Pack
              </button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

// --- CARD SUB-COMPONENT ---
const SecurityCard: React.FC<SecurityCardProps> = ({ iconSrc, title, description }) => (
  <div className="p-8 bg-white border border-gray-300 rounded-xs flex flex-col gap-4">
    {/* Removed blocky bg-gray-100 container to match design layout */}
    <div className="w-8 h-8 flex items-center justify-start shrink-0">
      <Image src={iconSrc} alt="Icon descriptor" width={32} height={32} className="object-contain" />
    </div>
    <h3 className="text-zinc-900 text-xl font-semibold leading-8">{title}</h3>
    <p className="text-slate-600 text-sm font-normal leading-6">{description}</p>
  </div>
);

// --- INTERACTIVE MODEL ROW SUB-COMPONENT ---
const StackLayer: React.FC<StackLayerProps> = ({ layer, title, borderColor, textColor, opacityClass }) => {
  // Dynamically map path using layout identifier numbers (e.g., LayerIcon_07.png)
  const layerNum = layer.replace("LAYER ", "");
  
  // The icons are currently numbered in reverse compared to the Figma design
  // We remap them here so Layer 07 gets LayerIcon_01.png (Gavel), etc.
  const iconMap: Record<string, string> = {
    "07": "01",
    "06": "02",
    "05": "03",
    "04": "04",
    "03": "05",
    "02": "06",
    "01": "07"
  };
  const mappedNum = iconMap[layerNum] || layerNum;
  const customIconSrc = `/image/security/LayerIcon_${mappedNum}.png`;
  
  return (
    <div className={`p-6 bg-[#1e1e2f]/70 ${opacityClass} rounded-xs border-l-4 ${borderColor} border-y border-r border-gray-700/50 backdrop-blur-sm flex justify-between items-center group hover:bg-[#1e1e2f] transition duration-200 cursor-pointer`}>
      <span className={`${textColor} text-xs font-semibold font-mono tracking-wider`}>{layer}</span>
      <span className="text-xl lg:text-2xl font-semibold text-white">{title}</span>
      <div className="w-6 h-6 flex items-center justify-center opacity-70 group-hover:opacity-100 transition duration-200">
        <Image 
          src={customIconSrc} 
          alt={`${title} structural icon`} 
          width={24} 
          height={24} 
          className="object-contain"
          onError={(e) => {
            // Safe rendering fallback strategy if image assets aren't exported yet
            const target = e.currentTarget as HTMLElement;
            target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

// --- MATRIX TABLE ROW SUB-COMPONENT ---
const MatrixRow: React.FC<MatrixRowProps> = ({ workflow, risk, concept, benefit }) => (
  <tr className="hover:bg-stone-50/60 transition">
    <td className="py-6 px-6 text-zinc-900 text-base font-medium">{workflow}</td>
    <td className="py-6 px-6 text-slate-600 text-base font-normal">{risk}</td>
    <td className="py-6 px-6 text-zinc-900 text-base font-normal">{concept}</td>
    <td className="py-6 px-6 text-[#0284c7] text-base font-semibold whitespace-nowrap">{benefit}</td>
  </tr>
);

// --- PATHWAY STEP CARD SUB-COMPONENT ---
const PathwayStep: React.FC<PathwayStepProps> = ({ stepNumber, title, description }) => (
  <div className="flex flex-col gap-4">
    <div className="w-12 h-12 bg-[#0e7490] rounded-xl flex justify-center items-center text-white font-bold text-base">
      {stepNumber}
    </div>
    <h3 className="text-xl font-semibold text-white mt-2">{title}</h3>
    <p className="text-gray-400 text-sm font-normal leading-5">{description}</p>
  </div>
);