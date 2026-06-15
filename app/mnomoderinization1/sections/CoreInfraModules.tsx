"use client";
import { useEffect, useRef, useState } from "react";

const modules = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Multi-tenant Hierarchy",
    desc: "Define complex organizational structures with nested tenants. Manage parent-child relationships, sub-brands, and white-label resellers with granular permission sets.",
    tags: [
      { label: "L1", text: "Tier-1 Host", color: "#C8F252", textColor: "#0C1628" },
      { label: "L2", text: "Brand A", color: "#2D9AE3", textColor: "#fff" },
      { label: "L2", text: "Brand B", color: "#2D9AE3", textColor: "#fff" },
    ],
    dark: false,
    wide: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Brand Isolation",
    desc: "Hardened data silos ensure that no tenant ever has visibility or access to another's subscriber data, financial logs, or traffic patterns.",
    checks: ["Independent DB Clusters", "Isolated API Gateways"],
    dark: true,
    wide: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.8">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: "Wholesale Settlement",
    desc: "Automated real-time inter-tenant settlement. Manage inter-brand billing, commissions, and revenue sharing with mathematical precision.",
    dark: false,
    wide: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Partner Portals",
    desc: "White-label self-service environments for your MVNO partners. Give them total control over their own customers, catalogs, and analytics while you retain oversight.",
    dark: false,
    wide: false,
    hasVisual: true,
  },
];

export default function CoreInfraModules() {
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
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <h2
            className="text-[#111111] font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Core Infrastructure Modules
          </h2>
          <p className="text-[#5E6775] text-[1.05rem] max-w-[42rem] mx-auto">
            Modular, high-density components built for the scale and security of sovereign
            MVNE operators.
          </p>
        </div>

        {/* Grid — Row 1: 2 cols */}
        <div
          className="grid grid-cols-2 gap-4 mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          {/* Multi-tenant card */}
          <div
            className="border rounded-xl p-9 bg-[#FAFAFA] relative overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {/* Faint hierarchy visual bg */}
            <div className="absolute top-4 right-4 opacity-[0.06]">
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                <rect x="45" y="5" width="30" height="20" rx="3" fill="#111" />
                <rect x="5" y="50" width="30" height="20" rx="3" fill="#111" />
                <rect x="45" y="50" width="30" height="20" rx="3" fill="#111" />
                <rect x="85" y="50" width="30" height="20" rx="3" fill="#111" />
                <line x1="60" y1="25" x2="20" y2="50" stroke="#111" strokeWidth="2" />
                <line x1="60" y1="25" x2="60" y2="50" stroke="#111" strokeWidth="2" />
                <line x1="60" y1="25" x2="100" y2="50" stroke="#111" strokeWidth="2" />
              </svg>
            </div>

            <div className="mb-5">{modules[0].icon}</div>
            <h3 className="text-[#111111] text-[1.4rem] font-bold mb-3">
              {modules[0].title}
            </h3>
            <p className="text-[#5E6775] text-[0.9rem] leading-7 mb-6">
              {modules[0].desc}
            </p>
            <div className="flex gap-2 flex-wrap">
              {modules[0].tags?.map((tag, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: tag.color, color: tag.textColor }}
                  >
                    {tag.label}
                  </span>
                  <span
                    className="border rounded px-2.5 py-0.5 text-[0.75rem] text-[#374151]"
                    style={{ border: "1px solid rgba(0,0,0,0.12)" }}
                  >
                    {tag.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Isolation card */}
          <div
            className="rounded-xl p-9 bg-[#0F1C2E]"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="mb-5">{modules[1].icon}</div>
            <h3 className="text-white text-[1.4rem] font-bold mb-3">
              {modules[1].title}
            </h3>
            <p className="text-[#7B8FA6] text-[0.9rem] leading-7 mb-6">
              {modules[1].desc}
            </p>
            <div className="flex flex-col gap-2.5">
              {modules[1].checks?.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#2D9F6E" strokeWidth="1.2" />
                    <path d="M4.5 8.5l2.5 2 4-4" stroke="#2D9F6E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[#93A0B4] text-[0.85rem]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid — Row 2: 3 cols */}
        <div
          className="grid grid-cols-3 gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.35s, transform 0.8s ease 0.35s",
          }}
        >
          {/* Wholesale Settlement */}
          <div
            className="rounded-xl p-9 bg-[#FAFAFA]"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="mb-5">{modules[2].icon}</div>
            <h3 className="text-[#111111] text-[1.25rem] font-bold mb-3">
              {modules[2].title}
            </h3>
            <p className="text-[#5E6775] text-[0.88rem] leading-7">
              {modules[2].desc}
            </p>
          </div>

          {/* Partner Portals */}
          <div
            className="rounded-xl p-9 bg-[#FAFAFA]"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="mb-5">{modules[3].icon}</div>
            <h3 className="text-[#111111] text-[1.25rem] font-bold mb-3">
              {modules[3].title}
            </h3>
            <p className="text-[#5E6775] text-[0.88rem] leading-7">
              {modules[3].desc}
            </p>
          </div>

          {/* Visual placeholder card */}
          <div
            className="rounded-xl p-8 bg-[#F4F4F4] flex flex-col gap-2.5 justify-center"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            {/* Fake UI rows */}
            <div className="h-2.5 bg-[#D1D5DB] rounded w-4/5" />
            <div className="h-2.5 bg-[#D1D5DB] rounded w-3/5" />
            <div className="flex gap-2">
              <div className="h-7 bg-[#C8F252] rounded w-2/5" />
              <div className="h-7 bg-[#D1D5DB] rounded flex-1" />
            </div>
            <div className="h-2.5 bg-[#D1D5DB] rounded w-11/12" />
            <div className="h-2.5 bg-[#E5E7EB] rounded w-[70%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
