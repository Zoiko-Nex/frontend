"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "1.2ms", label: "TENANT LATENCY", color: "#C8F252" },
  { value: "99.999%", label: "UPTIME SLA", color: "#C8F252" },
  { value: "256-BIT", label: "DATA ISOLATION", color: "#C8F252" },
  { value: "UNLIMITED", label: "TENANT SCALING", color: "#C8F252" },
];

const brands = [
  { letter: "A", name: "BRAND ALPHA", sub: "Custom Pricing & CRM", color: "#2D9AE3" },
  { letter: "B", name: "BRAND BETA", sub: "White-label Reseller", color: "#2D9F6E" },
  { letter: "G", name: "BRAND GAMMA", sub: "Corporate IoT Tenant", color: "#5E6775" },
];

export default function SharedInfraGovernance() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#F8F7F7] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h2
            className="text-[#111111] font-bold mb-3.5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            Shared Infrastructure, Isolated Governance
          </h2>
          <p className="text-[#5E6775] text-base max-w-[42rem] mx-auto leading-7">
            Experience the efficiency of shared network infrastructure while maintaining absolute
            sovereign control over business logic for every brand.
          </p>
        </div>

        {/* Architecture diagram */}
        <div
          className="bg-white rounded-2xl p-10 pt-16"
          style={{
            border: "1px solid rgba(0,0,0,0.07)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          {/* Top diagram area */}
          <div className="grid gap-10 items-start mb-16 relative" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            
            {/* Background concentric rings (centered behind orchestration) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-0">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="199.5" stroke="#F1F5F9" />
                <circle cx="200" cy="200" r="149.5" stroke="#F1F5F9" />
                <circle cx="200" cy="200" r="99.5" stroke="#E2E8F0" />
              </svg>
            </div>

            {/* Left: The Core */}
            <div className="self-stretch inline-flex flex-col justify-start items-center gap-2 z-10 pt-6">
                <div className="w-20 h-20 relative bg-gray-800 rounded-xl inline-flex justify-center items-center">
                    <div className="w-20 h-20 left-0 top-[-107px] absolute bg-white/0 rounded-xl shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.10)] shadow-xl"></div>
                    <div className="inline-flex flex-col justify-start items-center">
                        <div className="w-7 h-7 flex items-center justify-center">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                             <rect x="2" y="2" width="20" height="8" rx="2" />
                             <rect x="2" y="14" width="20" height="8" rx="2" />
                             <line x1="6" y1="6" x2="6" y2="6" strokeLinecap="round" strokeWidth="2.5" />
                             <line x1="6" y1="18" x2="6" y2="18" strokeLinecap="round" strokeWidth="2.5" />
                             <line x1="10" y1="6" x2="18" y2="6" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                             <line x1="10" y1="18" x2="18" y2="18" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                           </svg>
                        </div>
                    </div>
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                    <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">The Core</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                    <div className="text-center justify-center text-slate-600 text-sm font-normal font-['Inter'] leading-5">Shared Network Engine, HLR/HSS, and OCS<br/>processing layer.</div>
                </div>
            </div>

            {/* Center: Orchestration Layer */}
            <div className="flex flex-col items-center justify-center h-full z-10 w-[300px]">
                <div className="w-full bg-[#bbed55] rounded-lg px-8 py-10 pb-8 text-center relative shadow-[0px_-8px_16px_-6px_rgba(0,0,0,0.05)] border-t border-[#bbed55]/20 mt-6">
                   <div className="w-[100%] h-1 bg-white/40 absolute top-0 left-0 rounded-t-lg"></div>
                  <div className="mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3f6212" strokeWidth="2" className="mx-auto">
                      <path d="M12 2v20" strokeLinecap="round" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-zinc-900 font-bold text-[1.1rem] mb-3">Orchestration Layer</p>
                  <p className="text-lime-800 text-[0.65rem] tracking-[0.15em] uppercase font-bold">
                    REAL-TIME TRAFFIC ROUTING
                  </p>
                </div>
            </div>

            {/* Right: Brand stack */}
            <div className="flex flex-col gap-3 z-10">
              {brands.map((brand, i) => (
                <div
                  key={i}
                  className="self-stretch p-4 bg-zinc-100 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-sm flex justify-center items-center"
                    style={{ backgroundColor: brand.color }}
                  >
                    <div className="text-center justify-center text-white text-base font-semibold font-['Inter'] leading-6">{brand.letter}</div>
                  </div>
                  <div className="inline-flex flex-col justify-start items-start">
                      <div className="self-stretch flex flex-col justify-start items-start">
                          <div className="justify-center text-zinc-900 text-xs font-bold font-['Inter'] leading-4">{brand.name}</div>
                      </div>
                      <div className="self-stretch flex flex-col justify-start items-start">
                          <div className="justify-center text-slate-600 text-[10px] font-normal font-['Inter'] leading-4">{brand.sub}</div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-10 w-full" />

          {/* Stats row */}
          <div className="grid grid-cols-4 text-center">
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-4 flex flex-col items-center justify-center gap-1"
                style={{ borderRight: "none" }} // borders removed based on screenshot
              >
                <div className="text-center justify-center text-lime-800 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">
                  {s.value}
                </div>
                <div className="text-center justify-center text-slate-500 text-[10px] font-normal font-['JetBrains_Mono'] leading-4 tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
