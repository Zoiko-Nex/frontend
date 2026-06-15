"use client";
import { useEffect, useRef, useState } from "react";

export default function MnoCTA() {
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
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, #2D6A9F 0%, #3182B7 50%, #2A7FAF 100%)" }}
    >
      {/* Subtle noise pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      <div
        ref={ref}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2
            className="text-white font-extrabold mb-5 leading-[1.2]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Ready to Orchestrate Your Ecosystem?
          </h2>
          <p className="text-white/[0.78] text-[1.05rem] leading-[1.8] max-w-[36rem] mx-auto mb-12">
            Join the world&apos;s leading operators who leverage ZoikoNex for sovereign
            control and infinite scalability.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
              }}
              className="bg-white text-[#1A4A7A] border-none px-8 py-4 font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.01em] transition-colors duration-200"
            >
              Schedule a Technical Walkthrough
            </button>
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
              className="bg-transparent text-white px-8 py-4 font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.01em] transition-colors duration-200"
              style={{ border: "2px solid rgba(255,255,255,0.6)" }}
            >
              View Platform Architecture
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
