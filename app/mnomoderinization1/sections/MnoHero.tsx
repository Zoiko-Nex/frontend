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
      style={{
        background: "linear-gradient(135deg, #0C1628 0%, #0F2040 60%, #0A1A30 100%)",
        padding: "7rem 0 5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(49,130,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(49,130,183,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div className="max-w-7xl mx-auto px-6">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
          className="lg:grid-cols-2 grid-cols-1"
        >
          {/* LEFT */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}>
            {/* Eyebrow */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "1px solid rgba(200,242,82,0.3)",
              borderRadius: "2px",
              padding: "0.3rem 0.9rem",
              marginBottom: "2rem",
            }}>
              <span style={{
                fontSize: "0.6rem",
                letterSpacing: "0.25em",
                color: "#C8F252",
                textTransform: "uppercase",
                fontWeight: 600,
              }}>
                MVNE ORCHESTRATION
              </span>
            </div>

            <h1 style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              lineHeight: 1.08,
              marginBottom: "0.25rem",
            }}>
              One Platform.
            </h1>
            <h1 style={{
              color: "#C8F252",
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              lineHeight: 1.08,
              marginBottom: "2rem",
            }}>
              Unlimited Brands.
            </h1>

            <p style={{
              color: "#8F99A8",
              fontSize: "1.05rem",
              lineHeight: 1.85,
              maxWidth: "34rem",
              marginBottom: "2.5rem",
            }}>
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
              style={{
                backgroundColor: "#2D9AE3",
                color: "#ffffff",
                border: "2px solid #2D9AE3",
                padding: "0.95rem 2.25rem",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                borderRadius: "2px",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
              }}
            >
              Scale Your MVNE
            </button>
          </div>

          {/* RIGHT — Dashboard card */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}>
            <div style={{
              background: "rgba(16,28,50,0.95)",
              border: "1px solid rgba(49,130,183,0.25)",
              borderRadius: "12px",
              padding: "1.75rem",
              backdropFilter: "blur(20px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}>
              {/* Card header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1rem" }}>
                  Tenant Overview
                </span>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  {["#2D9AE3", "#C8F252", "#D73434"].map((c) => (
                    <div key={c} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {/* Tenant rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {tenants.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      background: i === 0 ? "rgba(49,130,183,0.1)" : "rgba(255,255,255,0.03)",
                      border: i === 0 ? "1px solid rgba(49,130,183,0.25)" : "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "8px",
                      padding: "0.9rem 1rem",
                    }}
                  >
                    <div style={{
                      width: "36px", height: "36px",
                      backgroundColor: t.iconBg,
                      borderRadius: "6px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1rem",
                      color: i === 0 ? "#2D9AE3" : "#5E6775",
                      flexShrink: 0,
                    }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#4A5568", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                        {t.type}
                      </p>
                      <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.name}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {t.users && (
                        <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.9rem" }}>{t.users}</p>
                      )}
                      <p style={{
                        color: t.changeColor,
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        background: t.pending ? "rgba(143,153,168,0.1)" : "transparent",
                        padding: t.pending ? "0.2rem 0.5rem" : "0",
                        borderRadius: "2px",
                      }}>
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
