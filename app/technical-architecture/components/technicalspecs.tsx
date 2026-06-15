
"use client";

import Image from "next/image";

export default function TechnicalSpecificationsSection() {
  return (
    <section className="bg-[#0F1017] py-16 lg:py-15">
      <div className="max-w-[1190px] mx-auto px-6">
        {/* Top Section */}
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mb-6">
          {/* Left Card */}
          <div className="bg-[#1B1B2C] border border-white/5 p-8 lg:p-10">
            {/* Label */}
            <div className="flex items-center gap-1 mb-8">
              {/* Import icon here */}
              <img
                    src="/image/technical-architecture/Icon.png"
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
              <div className="w-5 h-5" />

              <span className="text-white/40 text-xs tracking-[0.25em] uppercase font-medium">
                Core Architecture
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-white text-3xl lg:text-3xl font-semibold mb-8">
              Bounded-Domain Design Integrity
            </h2>

            {/* Description */}
            <p className="text-white/60 text-lg leading-8 max-w-[650px] mb-12">
              Unlike legacy monolithic stacks, ZoikoNex operates on strict
              domain boundaries. Every transaction is immutable,
              cryptographically signed, and verified via our
              "Evidence Not Logs" engine.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div>
                <h4 className="text-[#B7F35D] text-base font-semibold mb-3">
                  99.999% Availability
                </h4>

                <p className="text-white/40 text-base leading-6">
                  Mathematically guaranteed availability through distributed
                  sovereign clusters.
                </p>
              </div>

              <div>
                <h4 className="text-[#B7F35D] text-base font-semibold mb-3">
                  &lt;10ms Latency
                </h4>

                <p className="text-white/40 text-base leading-6">
                  Edge-computing optimized for real-time rating and charging
                  across 5G/6G cores.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src="/image/technical-architecture/technicalarchitecture.png"
                alt="Server Infrastructure"
                width={190}
                height={190}
                className="w-full h-[320px] "
              />
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-[#B7F35D] p-8 rounded-md h-fit">
            {/* Import icon here */}
             <img
                    src="/image/technical-architecture/Icon2.png"
                    alt="icon"
                    className="w-6 h-6 object-contain"
                  />
            <div className="w-5 h-4 mb-5" />

            <h3 className="text-[#1B1B2C] text-xl font-semibold mb-6">
              Technical Specifications Brief
            </h3>

            <p className="text-[#1B1B2C]/80 text-base leading-6 mb-6">
              Comprehensive 84-page whitepaper detailing schema definitions,
              security protocols, and integration hooks.
            </p>

            <button className="w-full bg-[#1B1B2C] text-[#B7F35D] py-4 px-4 font-semibold text-sm uppercase tracking-wide hover:opacity-90 transition">
              DOWNLOAD PDF (12.4 MB)
            </button>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-[#1B1B2C] p-8 border border-white/5">
            <h3 className="text-[#B7F35D] text-5xl font-bold mb-4">
              240+
            </h3>

            <h4 className="text-white/80 text-2xl font-semibold mb-5">
              APIs Exposed
            </h4>

            <p className="text-white/40 text-base leading-7">
              Full TM Forum compliance with additional proprietary sovereign
              extensions.
            </p>
          </div>

          <div className="bg-[#1B1B2C] p-8 border border-white/5">
            <h3 className="text-[#B7F35D] text-5xl font-bold mb-4">
              Zero
            </h3>

            <h4 className="text-white/80 text-2xl font-semibold mb-5">
              Side-Effects
            </h4>

            <p className="text-white/40 text-base leading-5">
              Functional programming architecture ensures no global state
              mutations during rating.
            </p>
          </div>

          <div className="bg-[#1B1B2C] p-8 border border-white/5">
            <h3 className="text-[#B7F35D] text-5xl font-bold mb-4">
              S3
            </h3>

            <h4 className="text-white/80 text-2xl font-semibold mb-5">
              Security Tier
            </h4>

            <p className="text-white/40 text-base leading-5">
              Hardware-level isolation for sensitive tenant metadata and
              billing logic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}