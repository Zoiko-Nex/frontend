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
    <section
      ref={ref}
      style={{ backgroundColor: "#F8F7F7", padding: "6rem 0" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "3.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <h2 style={{
            color: "#111111",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            marginBottom: "0.85rem",
            letterSpacing: "-0.02em",
          }}>
            Shared Infrastructure, Isolated Governance
          </h2>
          <p style={{ color: "#5E6775", fontSize: "1rem", maxWidth: "42rem", margin: "0 auto", lineHeight: 1.75 }}>
            Experience the efficiency of shared network infrastructure while maintaining absolute
            sovereign control over business logic for every brand.
          </p>
        </div>

        {/* Architecture diagram */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "16px",
          padding: "2.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}>
          {/* Top diagram area */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "2rem",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}>
            {/* Left: The Core */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              {/* Network node visual */}
              <div style={{
                width: "52px", height: "52px",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: "32px", height: "32px",
                  backgroundColor: "#0F1C2E",
                  borderRadius: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="8" rx="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" />
                    <line x1="6" y1="6" x2="6" y2="6" strokeLinecap="round" strokeWidth="2" />
                    <line x1="6" y1="18" x2="6" y2="18" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#111111", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.4rem" }}>
                  The Core
                </p>
                <p style={{ color: "#5E6775", fontSize: "0.75rem", textAlign: "center", lineHeight: 1.6, maxWidth: "180px" }}>
                  Shared Network Engine, HLR/HSS, and OCS processing layer.
                </p>
              </div>
            </div>

            {/* Center: Orchestration Layer */}
            <div style={{
              backgroundColor: "#C8F252",
              borderRadius: "8px",
              padding: "1.25rem 2rem",
              textAlign: "center",
              minWidth: "160px",
            }}>
              {/* Signal icon */}
              <div style={{ marginBottom: "0.5rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C1628" strokeWidth="2" style={{ margin: "0 auto" }}>
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                  <line x1="2" y1="20" x2="2" y2="20" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ color: "#0C1628", fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                Orchestration Layer
              </p>
              <p style={{ color: "#2A4010", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                REAL-TIME TRAFFIC ROUTING
              </p>
            </div>

            {/* Right: Brand stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {brands.map((brand, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  backgroundColor: "#F4F4F4",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "8px",
                  padding: "0.7rem 1rem",
                }}>
                  <div style={{
                    width: "28px", height: "28px",
                    backgroundColor: brand.color,
                    borderRadius: "4px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}>
                    {brand.letter}
                  </div>
                  <div>
                    <p style={{ color: "#111111", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                      {brand.name}
                    </p>
                    <p style={{ color: "#8F99A8", fontSize: "0.65rem" }}>{brand.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", marginBottom: "2rem" }} />

          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                borderRight: i < stats.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none",
                padding: "0 1rem",
              }}>
                <p style={{
                  color: "#C8F252",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}>
                  {s.value}
                </p>
                <p style={{
                  color: "#8F99A8",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}>
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
