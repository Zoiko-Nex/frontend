"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, #2D6A9F 0%, #3182B7 50%, #2A7FAF 100%)" }}
    >
      {/* Radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Decorative rectangle top-right */}
      <div
        className="absolute top-4 right-8 w-20 h-20 rounded"
        style={{ border: "2px solid rgba(255,255,255,0.12)" }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center">
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
            Ready to Sovereignize Your Infrastructure?
          </h2>
          <p className="text-white/80 text-base leading-[1.8] max-w-[36rem] mx-auto mb-12">
            Join the world&apos;s leading Tier-1 operators in achieving cloud-native
            scalability with zero migration risk.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/request-a-demo"
              className="bg-white hover:bg-[#f0f0f0] text-[#1A4A7A] border-none px-8 py-4 font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.01em] transition-colors duration-200 inline-block"
            >
              Schedule Technical Assessment
            </Link>
            <Link
              href="/platform-architecture"
              className="bg-transparent hover:bg-white/15 text-white px-8 py-4 font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.01em] transition-colors duration-200 inline-block border-2 border-white/60"
            >
              Talk to an Architect
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
