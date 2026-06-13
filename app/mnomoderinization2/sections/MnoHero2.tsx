"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MnoHero2() {
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
      style={{
        background: "linear-gradient(135deg, #0B1120 0%, #0D1A30 60%, #0A1525 100%)",
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
        }}>
          {/* LEFT */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}>
            {/* Eyebrow badge */}
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
                GLOBAL TIER-1 STANDARD
              </span>
            </div>

            <h1 style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
              lineHeight: 1.1,
              marginBottom: "0.1rem",
            }}>
              Phased BSS
            </h1>
            <h1 style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
              lineHeight: 1.1,
              marginBottom: "0.1rem",
            }}>
              Modernization for
            </h1>
            <h1 style={{
              color: "#C8F252",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
              lineHeight: 1.1,
              marginBottom: "2.5rem",
            }}>
              Tier-1 Operators.
            </h1>

            <p style={{
              color: "#8F99A8",
              fontSize: "1rem",
              lineHeight: 1.85,
              maxWidth: "34rem",
              marginBottom: "2.5rem",
            }}>
              De-risk your legacy transformation with a domain-by-domain
              migration pathway that ensures zero service disruption and
              absolute sovereign control.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3182B7";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2D9AE3";
                }}
                style={{
                  backgroundColor: "#2D9AE3",
                  color: "#ffffff",
                  border: "2px solid #2D9AE3",
                  padding: "0.95rem 2rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  borderRadius: "2px",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
              >
                Request a Demo
              </button>
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "2px solid rgba(255,255,255,0.4)",
                  padding: "0.95rem 2rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  borderRadius: "2px",
                  letterSpacing: "0.02em",
                  transition: "all 0.2s ease",
                }}
              >
                Download Modernization Whitepaper
              </button>
            </div>
          </div>

          {/* RIGHT — Dashboard image */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
          }}>
            <div style={{
              background: "rgba(8,16,32,0.95)",
              border: "1px solid rgba(49,130,183,0.2)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}>
              {/* Fake browser bar */}
              <div style={{
                backgroundColor: "#0D1826",
                padding: "0.6rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {["#D73434", "#E8A020", "#2D9F6E"].map((c, i) => (
                  <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: c }} />
                ))}
                <div style={{
                  flex: 1,
                  marginLeft: "0.75rem",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "3px",
                  height: "18px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }} />
              </div>

              {/* Dashboard image */}
              <div style={{ position: "relative" }}>
                <Image
                  src="/mno2.png"
                  alt="Real-time BSS Migration Monitoring Dashboard"
                  width={620}
                  height={380}
                  style={{ width: "100%", height: "340px", objectFit: "cover", display: "block" }}
                />
                {/* Caption overlay */}
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(8,16,32,0.95) 0%, transparent 100%)",
                  padding: "2rem 1.5rem 1.25rem",
                }}>
                  <p style={{
                    color: "#C8F252",
                    fontSize: "0.55rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                  }}>
                    CORE SYSTEM VISUALIZATION
                  </p>
                  <p style={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}>
                    Real-time Migration Monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
