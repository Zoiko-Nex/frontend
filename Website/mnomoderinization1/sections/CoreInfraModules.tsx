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

        <div
          className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          {/* Multi-tenant card (Wider: col-span-2) */}
          <div className="lg:col-span-2 rounded-xl p-9 bg-[#F8F7F8] relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-8 right-8 opacity-[0.05]">
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                <rect x="45" y="5" width="30" height="20" rx="3" fill="#111" />
                <rect x="5" y="50" width="30" height="20" rx="3" fill="#111" />
                <rect x="45" y="50" width="30" height="20" rx="3" fill="#111" />
                <rect x="85" y="50" width="30" height="20" rx="3" fill="#111" />
                <line x1="60" y1="25" x2="20" y2="50" stroke="#111" strokeWidth="3" />
                <line x1="60" y1="25" x2="60" y2="50" stroke="#111" strokeWidth="3" />
                <line x1="60" y1="25" x2="100" y2="50" stroke="#111" strokeWidth="3" />
              </svg>
            </div>
            <div>
                <div className="mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65a30d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="6" height="6" rx="1" />
                        <rect x="15" y="3" width="6" height="6" rx="1" />
                        <rect x="15" y="15" width="6" height="6" rx="1" />
                        <path d="M6 9v3a3 3 0 0 0 3 3h6" />
                    </svg>
                </div>
                <h3 className="text-[#111111] text-[1.4rem] font-bold mb-3">{modules[0].title}</h3>
                <p className="text-[#5E6775] text-[0.95rem] leading-[1.8] mb-10 max-w-lg">{modules[0].desc}</p>
            </div>
            {/* L1/L2 Tags */}
            <div className="flex gap-4 flex-wrap mt-6">
              {modules[0].tags?.map((tag, i) => (
                <div key={i} className="flex items-center gap-3 bg-white px-3 py-2.5 rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-slate-100">
                  <span
                    className="text-[0.9rem] font-bold w-7 h-7 flex items-center justify-center rounded-[3px]"
                    style={{ backgroundColor: tag.color === "#C8F252" ? "#C8F252" : "#bae6fd", color: tag.color === "#C8F252" ? "#0C1628" : "#0284C7" }}
                  >
                    {tag.label}
                  </span>
                  <span className="text-[0.85rem] text-[#111111] font-semibold pr-1">
                    {tag.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Isolation card (Narrower: col-span-1) */}
          <div className="lg:col-span-1 rounded-xl p-9 bg-[#1c1d25] flex flex-col justify-between">
            <div>
                <div className="mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h3 className="text-white text-[1.4rem] font-bold mb-3">{modules[1].title}</h3>
                <p className="text-[#93A0B4] text-[0.95rem] leading-[1.8] mb-10">{modules[1].desc}</p>
            </div>
            <div className="flex flex-col gap-4 mt-auto">
              {modules[1].checks?.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#84CC16" strokeWidth="1.5" />
                    <path d="M4.5 8.5l2.5 2 4-4" stroke="#84CC16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[#d1d5db] text-[0.9rem]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wholesale Settlement (Narrower: col-span-1) */}
          <div className="lg:col-span-1 rounded-xl p-9 bg-[#F8F7F8]">
            <div className="mb-5">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5">
                 <rect x="2" y="7" width="20" height="14" rx="2" />
                 <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                 <line x1="12" y1="12" x2="12" y2="16" />
                 <line x1="10" y1="14" x2="14" y2="14" />
               </svg>
            </div>
            <h3 className="text-[#111111] text-[1.4rem] font-bold mb-3">{modules[2].title}</h3>
            <p className="text-[#5E6775] text-[0.95rem] leading-[1.8]">{modules[2].desc}</p>
          </div>

          {/* Partner Portals (Wider: col-span-2) */}
          <div className="lg:col-span-2 rounded-xl p-9 bg-white outline outline-1 outline-slate-200 shadow-sm flex flex-col lg:flex-row gap-10 justify-between">
            <div className="w-full lg:w-1/2">
                <div className="mb-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#65A30D" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                </div>
                <h3 className="text-[#111111] text-[1.4rem] font-bold mb-3">{modules[3].title}</h3>
                <p className="text-[#5E6775] text-[0.95rem] leading-[1.8] pr-4">{modules[3].desc}</p>
            </div>
            <div className="w-full lg:w-1/2 bg-[#f3f4f6] border-l border-t border-slate-200 rounded p-6 flex flex-col gap-4 shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]">
                {/* Mock UI graphic */}
                <div className="w-4/5 h-4 bg-zinc-200 rounded-sm"></div>
                <div className="w-full grid grid-cols-3 gap-3">
                    <div className="h-12 bg-zinc-200/80 rounded-sm"></div>
                    <div className="h-12 bg-zinc-200/80 rounded-sm"></div>
                    <div className="h-12 bg-[#E4F8B3] rounded-sm"></div>
                </div>
                <div className="w-full bg-zinc-200/80 rounded-sm mt-2 flex-grow h-24"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
