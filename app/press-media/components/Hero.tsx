import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-stone-50">
      {/* ── Main Container ── */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row items-center justify-between">
        
        {/* ── Left: text ── */}
        <div className="flex w-full flex-col justify-center px-6 py-16 lg:w-[720px] lg:pl-[97px] lg:pr-10 lg:py-0">
          <div className="w-[538px] text-slate-600 text-6xl font-bold leading-[74px]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Newsroom for<br />
            the next generation<br />
            of telecom monetization.
          </div>

          <div className="mt-6 w-96 text-gray-500 text-lg font-normal leading-7" style={{ fontFamily: "'Inter', sans-serif" }}>
            Official source for announcements, institutional<br />
            guidelines, and sovereign infrastructure insights.<br />
            Empowering global carriers with Tier-1 BSS<br />
            capabilities.
          </div>

          <div className="mt-8 inline-flex">
            <a
              href="mailto:press@zoikonex.systems"
              className="inline-flex items-center gap-3 bg-[#20759E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1A5C7A]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Contact Media Relations
              <Image src="/image/press/mail.svg" alt="Mail" width={18} height={18} />
            </a>
          </div>
        </div>

        {/* ── Right: image / visualization ── */}
        <div className="relative flex w-full lg:w-[720px] justify-end">
          <div className="relative w-full h-[400px] sm:h-[500px] lg:w-[720px] lg:h-[600.39px]">
            {/* The background image */}
            <Image
              src="/image/press/hero.jpg"
              alt="Telecom Operating Intelligence"
              fill
              className="object-cover object-left"
              priority
            />

            {/* Status badge - bottom right */}
            <div className="absolute bottom-12 right-6 lg:right-auto lg:left-12 max-w-[320px] bg-gray-900/80 p-6 outline outline-1 outline-white/10 backdrop-blur-md">
              <div className="mb-2 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-lime-400" />
                <div className="text-xs font-semibold tracking-wider text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  SYSTEM STATUS: OPTIMAL
                </div>
              </div>
              <p className="text-[10px] leading-4 text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                SOVEREIGN CLOUD MONITORING ACTIVE. GLOBAL BANDWIDTH ALLOCATION: 99.999% SLA COMPLIANCE.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
