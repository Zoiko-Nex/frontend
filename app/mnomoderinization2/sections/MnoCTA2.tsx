"use client";
import { useEffect, useRef, useState } from "react";

export default function MnoCTA2() {
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
        background: "linear-gradient(135deg, #2D6A9F 0%, #3182B7 50%, #2A7FAF 100%)",
        padding: "6rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial highlight */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Decorative rectangle top-right */}
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "2rem",
        width: "80px",
        height: "80px",
        border: "2px solid rgba(255,255,255,0.12)",
        borderRadius: "4px",
      }} />

      <div
        className="max-w-4xl mx-auto px-6"
        style={{ textAlign: "center" }}
      >
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          <h2 style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            Ready to Sovereignize Your Infrastructure?
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1rem",
            lineHeight: 1.8,
            maxWidth: "36rem",
            margin: "0 auto 3rem",
          }}>
            Join the world&apos;s leading Tier-1 operators in achieving cloud-native
            scalability with zero migration risk.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
              }}
              style={{
                backgroundColor: "#ffffff",
                color: "#1A4A7A",
                border: "none",
                padding: "1rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                borderRadius: "2px",
                letterSpacing: "0.01em",
                transition: "background-color 0.2s ease",
              }}
            >
              Schedule Technical Assessment
            </button>
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid rgba(255,255,255,0.6)",
                padding: "1rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                borderRadius: "2px",
                letterSpacing: "0.01em",
                transition: "background-color 0.2s ease",
              }}
            >
              Talk to an Architect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
