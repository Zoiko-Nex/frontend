"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MnoHero2() {
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
      className="relative overflow-hidden py-28 pb-20"
      style={{ background: "linear-gradient(135deg, #0B1120 0%, #0D1A30 60%, #0A1525 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(49,130,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(49,130,183,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 mb-8"
              style={{ border: "1px solid rgba(200,242,82,0.3)" }}
            >
              <span className="text-[0.6rem] tracking-[0.25em] text-[#C8F252] uppercase font-semibold">
                GLOBAL TIER-1 STANDARD
              </span>
            </div>

            <h1
              className="text-white font-extrabold leading-[1.1] mb-0.5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
            >
              Phased BSS
            </h1>
            <h1
              className="text-white font-extrabold leading-[1.1] mb-0.5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
            >
              Modernization for
            </h1>
            <h1
              className="text-[#C8F252] font-extrabold leading-[1.1] mb-10"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
            >
              Tier-1 Operators.
            </h1>

            <p className="text-[#8F99A8] text-base leading-[1.85] max-w-[34rem] mb-10">
              De-risk your legacy transformation with a domain-by-domain
              migration pathway that ensures zero service disruption and
              absolute sovereign control.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link 
                href="/request-a-demo"
                className="px-8 py-[0.95rem] text-white font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.02em] transition-all duration-200 inline-block bg-[#2D9AE3] hover:bg-[#3182B7] border-2 border-[#2D9AE3]"
              >
                Request a Demo
              </Link>
              <Link
                href="/white-papers"
                className="bg-transparent text-white hover:bg-white/10 px-8 py-[0.95rem] font-bold text-[0.9rem] cursor-pointer rounded-sm tracking-[0.02em] transition-all duration-200 inline-block border-2 border-white/40"
              >
                Download Modernization Whitepaper
              </Link>
            </div>
          </div>

          {/* RIGHT — Dashboard image */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
            }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(8,16,32,0.95)",
                border: "1px solid rgba(49,130,183,0.2)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              {/* Fake browser bar */}
              <div
                className="px-4 py-2.5 flex items-center gap-1.5"
                style={{
                  backgroundColor: "#0D1826",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {["#D73434", "#E8A020", "#2D9F6E"].map((c, i) => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                ))}
                <div
                  className="flex-1 ml-3 h-[18px] rounded-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              </div>

              {/* Dashboard image */}
              <div className="relative">
                <Image
                  src="/mno2.png"
                  alt="Real-time BSS Migration Monitoring Dashboard"
                  width={620}
                  height={380}
                  className="w-full block object-cover"
                  style={{ height: "340px" }}
                />
                {/* Caption overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-6 pt-8 pb-5"
                  style={{ background: "linear-gradient(to top, rgba(8,16,32,0.95) 0%, transparent 100%)" }}
                >
                  <p className="text-[#C8F252] text-[0.55rem] tracking-[0.25em] uppercase font-semibold mb-1.5">
                    CORE SYSTEM VISUALIZATION
                  </p>
                  <p className="text-white font-bold text-[1.1rem]">
                    Real-time Migration Monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
