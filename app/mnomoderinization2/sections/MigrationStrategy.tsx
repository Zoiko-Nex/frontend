"use client";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: 1,
    title: "01. Phased Assessment",
    desc: "Deep architectural audit to map dependencies across legacy BSS stack and core network interfaces.",
    side: "left",
  },
  {
    num: 2,
    title: "02. Data Harmonization",
    desc: "ETL-driven data cleansing and structured migration into the ZoikoNex unified data plane.",
    side: "right",
  },
  {
    num: 3,
    title: "03. Domain Shadowing",
    desc: "Deploying parallel mediation and rating to validate against legacy outputs in real-time.",
    side: "left",
  },
  {
    num: 4,
    title: "04. Final Decommissioning",
    desc: "Successive cutover of core modules followed by controlled shutdown of legacy siloes.",
    side: "right",
  },
];

export default function MigrationStrategy() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "linear-gradient(180deg, #0D1525 0%, #0A1020 100%)",
        padding: "6rem 0",
        position: "relative",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow + heading */}
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <p style={{
            color: "#C8F252",
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "1.25rem",
          }}>
            THE STRATEGY
          </p>
          <h2 style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            The Modernization Roadmap
          </h2>
        </div>

        {/* Timeline container */}
        <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
          {/* Center vertical line */}
          <div style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "#C8F252",
            transform: "translateX(-50%)",
            opacity: 0.4,
          }} />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: step.side === "left" ? "flex-start" : "flex-end",
                alignItems: "center",
                marginBottom: "3rem",
                position: "relative",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${0.1 * i}s, transform 0.7s ease ${0.1 * i}s`,
              }}
            >
              {/* Card */}
              <div style={{
                width: "calc(50% - 3rem)",
                background: "#101C2E",
                borderRadius: "8px",
                padding: "1.75rem",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <h3 style={{
                  color: "#C8F252",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  marginBottom: "0.75rem",
                  textAlign: "left",
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: "#8F99A8",
                  fontSize: "0.88rem",
                  lineHeight: 1.75,
                  textAlign: "left",
                }}>
                  {step.desc}
                </p>
              </div>

              {/* Center number bubble */}
              <div style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: "36px",
                height: "36px",
                backgroundColor: "#C8F252",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "#0C1628",
                zIndex: 10,
                flexShrink: 0,
              }}>
                {step.num}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
