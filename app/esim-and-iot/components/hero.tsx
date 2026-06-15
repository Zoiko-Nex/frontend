"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ESIMHero() {
  const [count, setCount] = useState(0);
  const targetCount = 12482901;
  const hasAnimated = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = targetCount / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
              setCount(targetCount);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "linear-gradient(135deg, #e8f0f7 0%, #f0f4f8 40%, #e4eef8 100%)",
        padding: "5rem 0 4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage:
            "linear-gradient(rgba(43,126,193,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,126,193,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.35rem 1rem",
                borderRadius: "999px",
                border: "1px solid rgba(43,126,193,0.45)",
                backgroundColor: "rgba(43,126,193,0.1)",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  fontFamily: "monospace",
                  fontWeight: 600,
                  color: "#2B7EC1",
                  textTransform: "uppercase",
                }}
              >
                Enterprise Connectivity
              </span>
            </div>

            {/* Heading */}
            <h1
              style={{
                color: "#0f1a2e",
                fontWeight: 800,
                fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              Monetize the
              <br />
              Connected Future.
            </h1>

            {/* Description */}
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                lineHeight: 1.75,
                maxWidth: "30rem",
                marginBottom: "2rem",
              }}
            >
              Precision billing and lifecycle management for millions of eSIM
              profiles and global IoT fleets. Secure, sovereign control for
              infrastructure-grade reliability.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#153d60";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a4e7a";
                }}
                style={{
                  padding: "0.75rem 1.75rem",
                  backgroundColor: "#1a4e7a",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  boxShadow: "0 2px 8px rgba(26,78,122,0.35)",
                }}
              >
                Request a Demo
              </button>
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
                }}
                style={{
                  padding: "0.75rem 1.75rem",
                  backgroundColor: "#ffffff",
                  color: "#1a4e7a",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: "1px solid #cbd5e1",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                View API Reference
              </button>
            </div>
          </div>

          {/* RIGHT — Image Card */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
                backgroundColor: "#ffffff",
              }}
            >
              <Image
                src="/esim.jpg"
                alt="Enterprise connectivity team"
                width={640}
                height={420}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
                priority
              />

              {/* Live counter overlay — top right */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  backgroundColor: "rgba(15,26,46,0.82)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  padding: "0.6rem 0.9rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#7ecbf0",
                    fontFamily: "monospace",
                    marginBottom: "0.2rem",
                  }}
                >
                  Active eSIM Profiles
                </p>
                <p
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {count.toLocaleString()}
                </p>
              </div>

              {/* Pulse indicator — top left */}
              <div
                style={{
                  position: "absolute",
                  top: "1.1rem",
                  left: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span style={{ position: "relative", display: "flex", width: "10px", height: "10px" }}>
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
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#6DC02F",
                    }}
                  />
                </span>
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Live
                </span>
              </div>
            </div>

            {/* Decorative dots */}
            <div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
                width: "96px",
                height: "96px",
                opacity: 0.3,
                backgroundImage: "radial-gradient(circle, #2B7EC1 1px, transparent 1px)",
                backgroundSize: "8px 8px",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
