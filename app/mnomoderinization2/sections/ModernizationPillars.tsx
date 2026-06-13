"use client";
import { useEffect, useRef, useState } from "react";

const pillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 8h10M7 12h5" strokeLinecap="round" />
        <path d="M15 15l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Legacy Mediation Integration",
    desc: "Seamlessly bridge existing network probes with cloud-native rating engines without hardware retooling.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.6">
        <path d="M4 9h16M4 15h16" strokeLinecap="round" />
        <path d="M8 5l-4 4 4 4M16 5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Parallel Rating",
    desc: "Run new and legacy engines in dual-state to verify billing accuracy before the final cutover.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Evidence-Grade Audit",
    desc: "Immutable transaction logging that meets stringent regulatory requirements for Tier-1 financial auditing.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="1.6">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Sovereign Cloud Portability",
    desc: "Deploy on-premise, public, or hybrid cloud with zero vendor lock-in and complete data sovereignty.",
  },
];

export default function ModernizationPillars() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
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
      style={{
        backgroundColor: "#0D1525",
        padding: "6rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div style={{
          marginBottom: "3.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <h2 style={{
            color: "#ffffff",
            fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
            fontWeight: 700,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            Modernization Pillars
          </h2>
          <p style={{
            color: "#7B8FA6",
            fontSize: "1rem",
            maxWidth: "38rem",
            lineHeight: 1.75,
          }}>
            Engineer out the complexity of legacy architecture with four critical technological safeguards.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}>
          {pillars.map((pillar, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                border: hovered === i
                  ? "1px solid rgba(200,242,82,0.25)"
                  : "1px solid rgba(0,0,0,0.08)",
                borderRadius: "10px",
                padding: "2rem",
                background: hovered === i
                  ? "#0F1C2E"
                  : "#101828",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
            >
              <div style={{ marginBottom: "1.25rem" }}>{pillar.icon}</div>
              <h3 style={{
                color: "#ffffff",
                fontSize: "1.05rem",
                fontWeight: 700,
                marginBottom: "0.85rem",
                lineHeight: 1.35,
              }}>
                {pillar.title}
              </h3>
              <p style={{
                color: "#7B8FA6",
                fontSize: "0.88rem",
                lineHeight: 1.8,
              }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
