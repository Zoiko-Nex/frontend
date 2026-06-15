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
      className="relative overflow-hidden py-20 pt-20"
      style={{ background: "linear-gradient(135deg, #e8f0f7 0%, #f0f4f8 40%, #e4eef8 100%)" }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(43,126,193,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,126,193,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border mb-6"
              style={{ border: "1px solid rgba(43,126,193,0.45)", backgroundColor: "rgba(43,126,193,0.1)" }}>
              <span className="text-[0.6rem] tracking-[0.22em] font-mono font-semibold uppercase text-[#2B7EC1]">
                Enterprise Connectivity
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[#0f1a2e] font-extrabold leading-[1.1] mb-5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)" }}>
              Monetize the
              <br />
              Connected Future.
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-base leading-7 max-w-[30rem] mb-8">
              Precision billing and lifecycle management for millions of eSIM
              profiles and global IoT fleets. Secure, sovereign control for
              infrastructure-grade reliability.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3.5 flex-wrap">
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#153d60";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a4e7a";
                }}
                className="px-7 py-3 text-white text-sm font-semibold border-none rounded cursor-pointer transition-colors duration-200"
                style={{
                  backgroundColor: "#1a4e7a",
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
                className="px-7 py-3 bg-white text-[#1a4e7a] text-sm font-semibold border border-slate-300 rounded cursor-pointer transition-colors duration-200"
              >
                View API Reference
              </button>
            </div>
          </div>

          {/* RIGHT — Image Card */}
          <div className="relative">
            <div
              className="rounded-[14px] overflow-hidden bg-white"
              style={{
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <Image
                src="/esim.jpg"
                alt="Enterprise connectivity team"
                width={640}
                height={420}
                className="w-full h-auto object-cover block"
                priority
              />

              {/* Live counter overlay — top right */}
              <div
                className="absolute top-4 right-4 rounded-lg px-3.5 py-2.5"
                style={{
                  backgroundColor: "rgba(15,26,46,0.82)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <p className="text-[0.55rem] tracking-[0.18em] uppercase text-[#7ecbf0] font-mono mb-0.5">
                  Active eSIM Profiles
                </p>
                <p className="text-[1.3rem] font-bold text-white tabular-nums leading-none">
                  {count.toLocaleString()}
                </p>
              </div>

              {/* Pulse indicator — top left */}
              <div className="absolute top-[1.1rem] left-4 flex items-center gap-1.5">
                <span className="relative flex w-2.5 h-2.5">
                  <span
                    className="animate-ping absolute inset-0 rounded-full opacity-75"
                    style={{ backgroundColor: "#6DC02F" }}
                  />
                  <span
                    className="relative inline-flex w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: "#6DC02F" }}
                  />
                </span>
                <span className="text-[0.55rem] font-mono text-white/80 uppercase tracking-[0.15em]">
                  Live
                </span>
              </div>
            </div>

            {/* Decorative dots */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 opacity-30 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, #2B7EC1 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
