"use client";

import Image from "next/image";
import Link from "next/link";

// ✅ REPLACE this with your actual image path (e.g. "/images/operators-hero.jpg")
const HERO_IMAGE_SRC = "/image/global.jpg";

export default function OperatorsHero() {
  return (
    <section className="relative w-full min-h-screen bg-[#0a0f1a] overflow-hidden flex items-center">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 0% 0%, rgba(2,132,199,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Content */}
        <div className="flex-1 flex flex-col gap-6 max-w-[600px]">
          {/* Eyebrow */}
          <p
            className="text-sky-600 text-xs font-bold tracking-[0.25em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ZOIKONEX OPERATOR PLATFORM
          </p>

          {/* Headline */}
          <h1
            className="text-sky-500 font-bold leading-tight"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            THE GLOBAL STANDARD
            <br />
            FOR TELECOM
            <br />
            MONETIZATION
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/75 text-lg leading-8 max-w-[520px]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Unified sovereign infrastructure supporting MNO modernization,
            MVNO/E rapid deployment, Digital-First brands, IoT ecosystems,
            Enterprise connectivity, and Public Sector infrastructure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2 max-w-[280px]">
            <Link
              href="/request-a-demo"
              className="px-8 py-4 bg-sky-600 text-white text-center text-base font-medium transition-all hover:bg-sky-500 active:scale-[0.98]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Request an Operator Demo
            </Link>
            <Link
              href="/technical-architecture"
              className="px-8 py-4 border border-white/25 text-white text-center text-base font-medium transition-all hover:border-white/50 hover:bg-white/5 active:scale-[0.98]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Start a Technical Evaluation
            </Link>
          </div>

          {/* Architecture link */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/platform-architecture"
              className="text-sky-500 text-sm font-normal hover:text-sky-400 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View Platform Architecture
            </Link>
            <span className="text-sky-500 text-sm">→</span>
          </div>
        </div>

        {/* Right — Image with overlaid diagram labels */}
        <div className="relative flex-shrink-0 w-full max-w-[520px]">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ minHeight: 420 }}
          >
            {/* ✅ Background image — replace HERO_IMAGE_SRC at the top of this file */}
            <Image
              src={HERO_IMAGE_SRC}
              alt="Telecom operators working at a call center"
              fill
              className="object-cover"
              priority
            />

            {/* Dark overlay to help labels pop */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Corner label — MNO (top-right) */}
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-sky-600 rounded-lg z-10">
              <span
                className="text-white text-[10px] font-bold tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                MNO
              </span>
            </div>

            {/* Corner label — MVNO (bottom-left) */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-sky-600 rounded-lg z-10">
              <span
                className="text-white text-[10px] font-bold tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                MVNO
              </span>
            </div>

            {/* IoT label (left side, upper) */}
            <div className="absolute top-[18%] left-4 px-3 py-1.5 bg-amber-50 rounded-lg z-10 shadow-md">
              <span
                className="text-black text-[10px] font-semibold"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                IoT
              </span>
            </div>

            {/* Central overlay — exact Figma structure */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Outer ring: size-96 rounded-xl outline outline-1 outline-sky-600/30 */}
              <div className="size-96 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-600/30 inline-flex justify-center items-center">
                {/* Inner white border box: size-48 rounded-xl border border-white */}
                <div className="size-48 rounded-xl border border-white flex flex-col justify-center items-center gap-3 p-3">
                  {/* ZOIKONEX CORE badge */}
                  <div className="px-3 py-1 bg-sky-600 rounded-md">
                    <span
                      className="text-white text-[9px] font-bold tracking-widest whitespace-nowrap"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      ZOIKONEX CORE
                    </span>
                  </div>

                  {/* Module cards: px-5 py-4 bg-white/5 rounded-xs outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[2px] */}
                  <div className="flex items-center justify-center gap-1">
                    {["Catalog", "Charging", "Billing"].map((module) => (
                      <div
                        key={module}
                        className="px-5 py-4 bg-white/5 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[2px] inline-flex flex-col justify-start items-center"
                      >
                        <span
                          className="text-center text-white text-xs font-normal leading-4"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {module}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
