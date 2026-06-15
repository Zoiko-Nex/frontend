"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    num: "01",
    title: "Automated Lifecycle",
    description:
      "From manufacturing to decommissioning, every eSIM state transition is handled via programmable logic.",
  },
  {
    num: "02",
    title: "Sovereign Data Control",
    description:
      "Local data residency and strict regulatory compliance maintained across 140+ countries.",
  },
  {
    num: "03",
    title: "Universal Connectivity API",
    description:
      "Integrate existing ERP and CRM systems into your IoT lifecycle with a single, documented endpoint.",
  },
];

export default function ScaleWithoutComplexity() {
  const [visible, setVisible] = useState(false);
  const [throughput, setThroughput] = useState(1.2);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setVisible(true);
          const interval = setInterval(() => {
            setThroughput((prev) =>
              parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2))
            );
          }, 2000);
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#171724",
        padding: "5.5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 75% 50%, rgba(109,192,47,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* LEFT: Steps */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                lineHeight: 1.15,
                marginBottom: "2.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              Scale Without
              <br />
              Complexity
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem" }}>
                  {/* Number badge */}
                  <div style={{ flexShrink: 0, marginTop: "0.15rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "32px",
                        height: "32px",
                        border: "1px solid rgba(109,192,47,0.4)",
                        borderRadius: "6px",
                        backgroundColor: "rgba(109,192,47,0.08)",
                        color: "#6DC02F",
                        fontSize: "0.65rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        // display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        color: "#ffffff",
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: "0.4rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ color: "#848293", fontSize: "0.875rem", lineHeight: 1.75 }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Network Map Card */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              background: "#1e1e30",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#6DC02F",
                }}
              >
                Network Density Map
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    width: "6px",
                    height: "6px",
                  }}
                >
                  <span
                    className="animate-ping"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      backgroundColor: "#6DC02F",
                      opacity: 0.75,
                    }}
                  />
                  <span
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#6DC02F",
                    }}
                  />
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "monospace",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#64748b",
                  }}
                >
                  Live Updating...
                </span>
              </div>
            </div>

            {/* Green accent line */}
            <div style={{ height: "2px", background: "#6DC02F" }} />

            {/* Map Image */}
            <div style={{ background: "#0e1320", overflow: "hidden" }}>
              <Image
                src="/iot.png"
                alt="Network density world map"
                width={640}
                height={320}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                  opacity: 0.9,
                }}
              />
            </div>

            {/* Stats Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "monospace",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#64748b",
                    marginBottom: "0.4rem",
                  }}
                >
                  Data Throughput
                </p>
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {throughput.toFixed(1)} PB/s
                </p>
              </div>
              <div style={{ padding: "1.25rem 1.5rem" }}>
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "monospace",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#64748b",
                    marginBottom: "0.4rem",
                  }}
                >
                  System Uptime
                </p>
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#6DC02F",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  99.9999%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
