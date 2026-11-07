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
      className="relative py-24"
      style={{ background: "linear-gradient(180deg, #0D1525 0%, #0A1020 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Eyebrow + heading */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="text-[#C8F252] text-[0.6rem] tracking-[0.3em] uppercase font-bold mb-5">
            THE STRATEGY
          </p>
          <h2
            className="text-white font-extrabold leading-[1.2]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", letterSpacing: "-0.02em" }}
          >
            The Modernization Roadmap
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-[900px] mx-auto">
          {/* Center vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px opacity-40"
            style={{ backgroundColor: "#C8F252", transform: "translateX(-50%)" }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative mb-12"
              style={{
                display: "flex",
                justifyContent: step.side === "left" ? "flex-start" : "flex-end",
                alignItems: "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${0.1 * i}s, transform 0.7s ease ${0.1 * i}s`,
              }}
            >
              {/* Card */}
              <div
                className="rounded-lg p-7"
                style={{
                  width: "calc(50% - 3rem)",
                  background: "#101C2E",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h3 className="text-[#C8F252] text-[1.05rem] font-bold mb-3 text-left">
                  {step.title}
                </h3>
                <p className="text-[#8F99A8] text-[0.88rem] leading-7 text-left">
                  {step.desc}
                </p>
              </div>

              {/* Center number bubble */}
              <div
                className="absolute left-1/2 w-9 h-9 bg-[#C8F252] rounded-md flex items-center justify-center font-extrabold text-[0.9rem] text-[#0C1628] z-10 flex-shrink-0"
                style={{ transform: "translateX(-50%)" }}
              >
                {step.num}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
