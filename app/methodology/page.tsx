import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Layers, Server, Globe, Check, ChevronDown, Lock, Activity } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-lime-200">
      <HeroSection />
      <PrinciplesSection />
      <MigrationPathwaySection />
      <GovernanceSection />
      <StatsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-start gap-16">
        <div className="flex-1 z-10 w-full lg:w-[587px] shrink-0">
          <div className="mb-4">
            <span className="text-lime-600 text-xs font-bold uppercase tracking-widest relative">
              Our Methodology
            </span>
          </div>
          <h1 className="text-gray-900 text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-8 whitespace-nowrap">
            A structured <br className="hidden lg:block" />
            pathway to <span className="text-lime-600">sovereign</span><br className="hidden lg:block" />
            <span className="text-lime-600">monetization.</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-10 whitespace-normal">
            A mathematical approach to infrastructure transition — engineered to move Tier-1 operators off legacy stacks with zero service disruption, full compliance, and provable governance at every step.
          </p>
          <div>
            <Link href="/request-a-demo" className="inline-flex items-center justify-center px-8 py-4 bg-cyan-600 text-white font-bold rounded-xl shadow-[0px_12px_26px_-12px_rgba(15,131,168,0.70)] hover:bg-cyan-700 transition-all duration-300 transform hover:-translate-y-1">
              Request a Demo
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
          <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-[24px] p-8 shadow-[0px_30px_70px_-30px_rgba(8,21,36,0.70)] relative overflow-hidden flex flex-col justify-between"
               style={{ background: 'radial-gradient(circle at 70% -10%, #0e7490 0%, #0f172a 55%, #0f172a 100%)' }}>
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-blue-300 text-xs font-mono tracking-wide">MIGRATION PATHWAY</span>
              <span className="text-lime-400 text-xs font-bold font-mono tracking-wide">STATUS: ACTIVE</span>
            </div>

            <div className="space-y-0 relative z-10">
              <PathwayItem step="01" title="Assessment" status="Complete" active={false} color="lime" />
              <PathwayItem step="02" title="Fit Mapping" status="Complete" active={false} color="lime" />
              <PathwayItem step="03" title="Review" status="In Progress" active={true} color="sky" />
              <PathwayItem step="04" title="Plan" status="Queued" active={false} color="slate" />
              <PathwayItem step="05" title="Readiness" status="Queued" active={false} color="slate" isLast />
            </div>
            
            {/* Ambient decorative lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathwayItem({ step, title, status, active, color, isLast = false }: { step: string, title: string, status: string, active: boolean, color: 'lime' | 'sky' | 'slate', isLast?: boolean }) {
  const isComplete = color === 'lime';
  const isProgress = color === 'sky';
  
  return (
    <div className={`relative py-4 ${!isLast ? 'border-t border-white/10' : 'border-t border-white/10'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 
            ${isComplete ? 'bg-lime-400/20' : isProgress ? 'bg-sky-400/20 shadow-[0px_0px_0px_4px_rgba(58,167,255,0.12)]' : 'bg-white/5'}`}>
            {isComplete ? (
               <Check className="w-3.5 h-3.5 text-lime-400" strokeWidth={3} />
            ) : (
               <span className={`text-xs font-bold font-mono ${isProgress ? 'text-sky-400' : 'text-slate-400'}`}>{step}</span>
            )}
          </div>
          <span className="text-white text-sm font-bold tracking-tight">{title}</span>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wide
          ${isComplete ? 'text-lime-400' : isProgress ? 'text-sky-400' : 'text-slate-500'}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function PrinciplesSection() {
  const principles = [
    {
      title: "Governed by Design",
      desc: "Compliance isn't a layer; it's the foundation. Every data packet and billing record is traceable, immutable, and jurisdictionally aware from day one.",
      icon: <ShieldCheck className="w-5 h-5 text-lime-600" />
    },
    {
      title: "Built Beyond Billing",
      desc: "We move past simple transaction processing to intelligent orchestration of connectivity, identity, and settlement across the entire monetization stack.",
      icon: <Server className="w-5 h-5 text-lime-600" />
    },
    {
      title: "Sovereign Native",
      desc: "Take back control of your technology stack. No vendor lock-in, no hidden logic — full transparency for institutional stakeholders and regulators alike.",
      icon: <Globe className="w-5 h-5 text-lime-600" />
    }
  ];

  return (
    <section className="w-full bg-white py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center lg:text-left">
          <span className="text-lime-600 text-xs font-bold uppercase tracking-widest">Principles</span>
          <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight max-w-3xl">
            Three commitments behind<br className="hidden md:block" /> every<br className="hidden md:block" /> migration
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-3xl">
            Our methodology isn't a checklist bolted onto a billing system. These principles shape every decision, from first audit to production go-live.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 outline outline-1 outline-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-11 h-11 rounded-xl bg-lime-400/10 flex items-center justify-center mb-6">
                {p.icon}
              </div>
              <h3 className="text-gray-900 text-lg font-bold mb-3">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MigrationPathwaySection() {
  const phases = [
    {
      num: "01",
      label: "Assessment",
      title: "Assessment",
      desc: "A full audit of legacy dependencies and data flows, mapping exactly what runs your business today and where the risk lives.",
      tags: ["Dependency map", "Data-flow inventory", "Risk register"]
    },
    {
      num: "02",
      label: "Fit Mapping",
      title: "Fit Mapping",
      desc: "Aligning the sovereign stack with your operational KPIs, so the target architecture is measured against the outcomes you actually run on.",
      tags: ["KPI alignment", "Gap analysis", "Target architecture"]
    },
    {
      num: "03",
      label: "Review",
      title: "Review",
      desc: "Regulatory and technical compliance validation across every jurisdiction you operate in, signed off before a single workload moves.",
      tags: ["Compliance validation", "Jurisdiction checks", "Stakeholder sign-off"]
    },
    {
      num: "04",
      label: "Plan",
      title: "Plan",
      desc: "The final blueprint for phased deployment — sequencing, dependencies, and rollback paths documented so every move is reversible.",
      tags: ["Phased blueprint", "Rollback plan", "Deployment timeline"]
    },
    {
      num: "05",
      label: "Readiness",
      title: "Readiness",
      desc: "Production go-live with 24/7 shadow support — real traffic runs against the new stack in parallel until you're proven ready to cut over.",
      tags: ["Shadow billing sync", "Go-live", "24/7 support"]
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-24 px-6 lg:px-12 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-lime-600 text-xs font-bold uppercase tracking-widest">Structured Migration Pathway</span>
          <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight max-w-3xl">
            Five phases, zero service<br className="hidden md:block" />disruption
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-4xl">
            A repeatable sequence that de-risks infrastructure transition for Tier-1 operations — each phase gated by clear, auditable deliverables before the next begins.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 lg:p-10 outline outline-1 outline-gray-200 flex flex-col md:flex-row gap-8 lg:gap-16 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="md:w-32 shrink-0">
                <div className="text-gray-900 text-4xl font-bold leading-10">{phase.num}</div>
                <div className="text-lime-600 text-[10px] font-bold uppercase tracking-wider mt-2">{phase.label}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 text-xl font-bold mb-3">{phase.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-3xl mb-6">
                  {phase.desc}
                </p>
                <div className="inline-flex flex-wrap items-center gap-6 px-4 py-2 bg-slate-100 rounded-full border border-gray-200">
                  {phase.tags.map((tag, j) => (
                    <span key={j} className="text-gray-900 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GovernanceSection() {
  const badges = ["SOC 2 TYPE II", "GDPR NATIVE", "ISO 27001", "PCI DSS L1", "ETSI COMPLIANT"];

  return (
    <section className="w-full bg-slate-900 py-24 px-6 lg:px-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 space-y-8">
          <div>
            <span className="text-lime-400 text-xs font-bold uppercase tracking-widest">Governed by Design</span>
            <h2 className="text-white text-4xl lg:text-5xl font-bold mt-4 leading-tight">
              Governance is not an<br className="hidden md:block"/>add-on. It is the<br className="hidden md:block"/>operating model.
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            {badges.map((badge, i) => (
              <div key={i} className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm">
                <span className="text-slate-300 text-xs font-bold tracking-wide">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl relative overflow-hidden group hover:outline-lime-500/30 transition-colors duration-500">
            {/* Terminal Window */}
            <div className="font-mono text-xs leading-6">
              <div className="text-gray-400">
                <span>[02:44:11] </span>
                <span className="text-sky-400">SHA-256</span> HASH VERIFIED ... 0x77F882…
              </div>
              <div className="text-gray-400">
                <span>[02:44:12] </span>
                AUDIT TRAIL LOGGED ... <span className="text-sky-400">JURISDICTION</span>: EU-CENTRAL-1
              </div>
              <div className="text-gray-400">
                <span>[02:44:13] </span>
                CONSENSUS LAYER STABLE ... 128 NODES ACTIVE
              </div>
              <div className="text-gray-400">
                <span>[02:44:14] </span>
                REVENUE LEAKAGE SCAN: <span className="text-sky-400">0.00%</span> DETECTED
              </div>
            </div>
            
            <div className="mt-10 flex justify-between items-center">
              <span className="text-slate-500 text-xs font-mono tracking-wide uppercase">REAL-TIME GOVERNANCE LEDGER</span>
              <span className="text-lime-400 text-xs font-bold font-mono tracking-wide uppercase">ENCRYPTED</span>
            </div>
          </div>
          
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-lime-500/10 blur-[100px] rounded-full pointer-events-none z-[-1]"></div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "99.999%", label: "Core uptime SLA" },
    { value: "<45 Days", label: "Mean time to launch" },
    { value: "0.00%", label: "Revenue leakage" },
    { value: "Zero", label: "Downtime at cutover" }
  ];

  return (
    <section className="w-full bg-white py-20 px-6 lg:px-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <div key={i} className="text-center px-4">
              <div className="text-lime-600 text-4xl lg:text-5xl font-bold mb-3">{stat.value}</div>
              <div className="text-gray-500 text-xs lg:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    "How long does a typical migration take?",
    "How do you guarantee zero service disruption?",
    "What happens to our compliance obligations during transition?",
    "Can the methodology work alongside our existing OSS?"
  ];

  return (
    <section className="w-full bg-gray-100 py-24 px-6 lg:px-12 border-y border-gray-200">
      <div className="max-w-[1020px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-lime-600 text-xs font-bold uppercase tracking-widest block mb-4">Questions</span>
          <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold whitespace-nowrap">
            How the methodology works in practice
          </h2>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, i) => (
            <div key={i} className={`border-b border-gray-200 py-6 flex items-center justify-between cursor-pointer hover:bg-gray-200/30 transition-colors ${i === 0 ? 'border-t' : ''}`}>
              <h3 className="text-gray-900 text-base font-bold pr-8">{faq}</h3>
              <div className="relative w-32 h-8 flex items-center justify-center shrink-0">
                <div className="absolute w-32 h-[2px] bg-cyan-600"></div>
                <div className="absolute w-[2px] h-3 bg-cyan-600"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="w-full bg-white py-24 px-6 lg:px-12 border-b border-gray-200 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] pointer-events-none hidden md:block">
        <div className="absolute inset-0 rounded-full border border-cyan-700/20"></div>
        <div className="absolute inset-[60px] rounded-full border-[6px] border-cyan-700/10"></div>
        <div className="absolute inset-[120px] rounded-full border-[6px] border-cyan-700/10"></div>
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-gray-900 text-5xl font-bold leading-tight mb-6">
          Ready to map your<br className="hidden md:block"/>migration path?
        </h2>
        <p className="text-gray-500 text-base mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with our architecture team to analyze your current BSS<br className="hidden md:block"/>bottlenecks and define a sovereign migration path.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact-us" className="w-full sm:w-auto px-10 py-3.5 bg-gray-900 text-white text-base font-bold rounded-[10px] hover:bg-gray-800 transition-colors">
            Request a Platform Briefing
          </Link>
          <Link href="/contact-us" className="w-full sm:w-auto px-10 py-3.5 bg-white text-gray-900 text-base font-bold rounded-[10px] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            Speak with an Architect
          </Link>
        </div>
      </div>
    </section>
  );
}
