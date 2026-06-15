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
          className="bg-white rounded-2xl p-10"
          style={{
            border: "1px solid rgba(0,0,0,0.07)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          {/* Top diagram area */}
          <div className="grid gap-8 items-center mb-10" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
            {/* Left: The Core */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-[52px] h-[52px] bg-[#f0f0f0] rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-[#0F1C2E] rounded flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6" y2="6" strokeLinecap="round" strokeWidth="2" />
                    <line x1="6" y1="18" x2="6" y2="18" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[#111111] font-bold text-[1.05rem] mb-1.5">The Core</p>
                <p className="text-[#5E6775] text-[0.75rem] text-center leading-[1.6] max-w-[180px]">
                  Shared Network Engine, HLR/HSS, and OCS processing layer.
                </p>
              </div>
            </div>

            {/* Center: Orchestration Layer */}
            <div className="bg-[#C8F252] rounded-lg px-8 py-5 text-center min-w-[160px]">
              <div className="mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C1628" strokeWidth="2" className="mx-auto">
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                  <line x1="2" y1="20" x2="2" y2="20" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[#0C1628] font-extrabold text-[0.9rem] mb-1">Orchestration Layer</p>
              <p className="text-[#2A4010] text-[0.6rem] tracking-[0.15em] uppercase font-semibold">
                REAL-TIME TRAFFIC ROUTING
              </p>
            </div>

            {/* Right: Brand stack */}
            <div className="flex flex-col gap-2.5">
              {brands.map((brand, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#F4F4F4] rounded-lg px-4 py-3"
                  style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center text-white font-extrabold text-[0.75rem] flex-shrink-0"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.letter}
                  </div>
                  <div>
                    <p className="text-[#111111] text-[0.7rem] font-bold tracking-[0.05em]">{brand.name}</p>
                    <p className="text-[#8F99A8] text-[0.65rem]">{brand.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-black/[0.07] mb-8" />

          {/* Stats row */}
          <div className="grid grid-cols-4 text-center">
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-4"
                style={{ borderRight: i < stats.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}
              >
                <p
                  className="font-extrabold leading-none mb-1.5"
                  style={{
                    color: "#C8F252",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </p>
                <p className="text-[#8F99A8] text-[0.6rem] tracking-[0.2em] uppercase font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
