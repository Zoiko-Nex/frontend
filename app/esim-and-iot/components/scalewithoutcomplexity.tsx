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
      className="relative overflow-hidden py-[120px]"
      style={{
        background:
          "linear-gradient(90deg,#111222 0%,#14152A 55%,#111222 100%)"
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 75% 50%, rgba(109,192,47,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_660px] gap-28 items-center">
          {/* LEFT: Steps */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h2
              className="text-white font-extrabold leading-[1.15] mb-10"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}
            >
              Scale Without
              <br />
              Complexity
            </h2>

            <div className="flex flex-col gap-14">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  {/* Number badge */}
                  <div className="flex-shrink-0 mt-0.5">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[#6DC02F] text-[0.65rem] font-mono font-bold tracking-[0.05em]"
                      style={{
                        border: "1px solid rgba(109,192,47,0.4)",
                        backgroundColor: "rgba(109,192,47,0.08)",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                  {/* Content */}
                  <div>
                    <h3 className="text-white text-[24px] font-semibold mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-[#848293] text-sm leading-7">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Network Map Card */}
          <div
            className="rounded-[24px] overflow-hidden bg-[#1A1A28]"
            style={{
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 40px 90px rgba(0,0,0,.45)"
            }}
          >
            {/* Card Header */}
            <div
              className="flex items-center justify-between px-8 py-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span
                style={{
                  color: "#476800",
                  fontSize: "16px",
                  fontFamily: "JetBrains Mono"
                }}
              >
                NETWORK DENSITY MAP
              </span>
              <div className="flex items-center gap-2">
                <span className="relative inline-flex w-1.5 h-1.5">
                  <span
                    className="animate-ping absolute inset-0 rounded-full opacity-75"
                    style={{ backgroundColor: "#6DC02F" }}
                  />
                  <span
                    className="relative inline-flex w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#6DC02F" }}
                  />
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,.4)",
                    fontSize: "16px",
                    fontFamily: "JetBrains Mono"
                  }}
                >
                  LIVE UPDATING...
                </span>
              </div>
            </div>

            {/* Green accent line */}
            <div
              style={{
                height: "3px",
                background: "#6DC02F"
              }}
            />

            {/* Map Image */}
            <div className="bg-[#0e1320] overflow-hidden">
              <Image
                src="/iot.png"
                alt="Network density world map"
                width={640}
                height={320}
                className="w-full h-auto object-cover block opacity-90"
              />
            </div>

            {/* Stats Row */}
            <div
              className="grid grid-cols-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="px-8 py-7"
                style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-[0.6rem] font-mono tracking-[0.18em] uppercase text-slate-500 mb-1.5">
                  Data Throughput
                </p>
                <p className="text-[1.6rem] font-bold text-white tabular-nums">
                  {throughput.toFixed(1)} PB/s
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-[0.6rem] font-mono tracking-[0.18em] uppercase text-slate-500 mb-1.5">
                  System Uptime
                </p>
                <p className="text-[1.6rem] font-bold text-[#6DC02F] tabular-nums">
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
