"use client";
import { useEffect, useRef, useState } from "react";

const tenants = [
  {
    type: "ACTIVE MVNO",
    name: "Brand Alpha Mobile",
    users: "128.4k Users",
    change: "+12% MoM",
    changeColor: "#C8F252",
    icon: "▦",
    iconBg: "#1E2A3B",
  },
  {
    type: "SUB-RESELLER",
    name: "Eco-Talk Telecom",
    users: "45.2k Users",
    change: "+6.4% MoM",
    changeColor: "#2D9AE3",
    icon: "▦",
    iconBg: "#1A2535",
  },
  {
    type: "AWAITING PROVISION",
    name: "Global Connect Plus",
    users: "",
    change: "PENDING",
    changeColor: "#8F99A8",
    icon: "✦",
    iconBg: "#1A2535",
    pending: true,
  },
];

export default function MnoHero() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 pb-20"
      style={{ background: "linear-gradient(135deg, #0C1628 0%, #0F2040 60%, #0A1A30 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(49,130,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(49,130,183,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 mb-8"
              style={{ border: "1px solid rgba(200,242,82,0.3)" }}
            >
              <span className="text-[0.6rem] tracking-[0.25em] text-[#C8F252] uppercase font-semibold">
                MVNE ORCHESTRATION
              </span>
            </div>

            <h1
              className="text-white font-extrabold leading-[1.08] mb-1"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
            >
              One Platform.
            </h1>
            <h1
              className="text-[#C8F252] font-extrabold leading-[1.08] mb-8"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
            >
              Unlimited Brands.
            </h1>

            <p className="text-[#8F99A8] text-[1.05rem] leading-[1.85] max-w-[34rem] mb-10">
              Manage multiple MVNOs, resellers, and operator tenants from a
              single, governed orchestration layer. Scale your ecosystem without
              operational complexity.
            </p>

            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3182B7";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#3182B7";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2D9AE3";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2D9AE3";
              }}
              className="px-9 py-4 font-bold text-[0.95rem] cursor-pointer rounded-sm tracking-[0.02em] transition-all duration-200"
              style={{
                backgroundColor: "#2D9AE3",
                color: "#ffffff",
                border: "2px solid #2D9AE3",
              }}
            >
              Scale Your MVNE
            </button>
          </div>

          {/* RIGHT — Dashboard card */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            <div
              className="rounded-xl p-7"
              style={{
                background: "rgba(16,28,50,0.95)",
                border: "1px solid rgba(49,130,183,0.25)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Card header */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold text-base">
                  Tenant Overview
                </span>
                <div className="flex gap-1.5">
                  {["#2D9AE3", "#C8F252", "#D73434"].map((c) => (
                    <div key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Tenant rows */}
              <div className="flex flex-col gap-2.5">
                {tenants.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 rounded-lg px-4 py-3.5"
                    style={{
                      background: i === 0 ? "rgba(49,130,183,0.1)" : "rgba(255,255,255,0.03)",
                      border: i === 0 ? "1px solid rgba(49,130,183,0.25)" : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        backgroundColor: t.iconBg,
                        color: i === 0 ? "#2D9AE3" : "#5E6775",
                      }}
                    >
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#4A5568] text-[0.58rem] tracking-[0.15em] uppercase mb-0.5">
                        {t.type}
                      </p>
                      <p className="text-white font-semibold text-[0.9rem] truncate">
                        {t.name}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {t.users && (
                        <p className="text-white font-bold text-[0.9rem]">{t.users}</p>
                      )}
                      <p
                        className="text-[0.65rem] font-semibold tracking-[0.05em] rounded-sm"
                        style={{
                          color: t.changeColor,
                          background: t.pending ? "rgba(143,153,168,0.1)" : "transparent",
                          padding: t.pending ? "0.2rem 0.5rem" : "0",
                        }}
                      >
                        {t.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
