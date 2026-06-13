"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  {
    num: 1,
    title: "Architecture Mapping",
    desc: "We map your legacy tenant hierarchies to the ZoikoNex sovereign model with zero downtime for existing subscribers.",
  },
  {
    num: 2,
    title: "Data Silo Isolation",
    desc: "Automated migration of PII and financial records into hardened, tenant-specific encrypted storage clusters.",
  },
  {
    num: 3,
    title: "Brand Proxy Validation",
    desc: "Real-time shadowing of traffic through new tenant portals to ensure brand-level compliance and billing accuracy.",
  },
];

export default function PhasedDeployment() {
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
        background: "linear-gradient(180deg, #0A1020 0%, #0D1830 100%)",
        padding: "6rem 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}>
          {/* LEFT — image */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}>
              <Image
                src="/structured-migration.png"
                alt="Team collaborating on structured enterprise migration"
                width={600}
                height={440}
                style={{ width: "100%", height: "440px", objectFit: "cover", display: "block", filter: "grayscale(10%)" }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, transparent 60%, rgba(10,16,32,0.6))",
              }} />
            </div>
          </div>

          {/* RIGHT — content */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}>
            {/* Eyebrow */}
            <p style={{
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              color: "#2D9AE3",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}>
              STRUCTURED MIGRATION
            </p>

            <h2 style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              lineHeight: 1.15,
              marginBottom: "3rem",
              letterSpacing: "-0.02em",
            }}>
              Phased Deployment For<br />Enterprise Environments
            </h2>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                  {/* Number bubble */}
                  <div style={{
                    width: "32px", height: "32px",
                    border: "1px solid rgba(45,154,227,0.4)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "0.1rem",
                  }}>
                    {step.num}
                  </div>
                  <div>
                    <h4 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>
                      {step.title}
                    </h4>
                    <p style={{ color: "#7B8FA6", fontSize: "0.88rem", lineHeight: 1.75 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
