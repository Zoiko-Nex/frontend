"use client";

import Image from "next/image";

export default function MonetizationCore() {
  return (
    <section className="bg-[#1B1C3A] py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top Content */}
        <div className="text-center mb-20">
          <p className="text-lime-300 text-xs font-semibold tracking-[0.3em] uppercase mb-6">
            CORE TRANSACTIONAL ENGINE
          </p>

          <h2 className="text-white text-4xl font-semibold mb-6">
            Order to Evidence Lifecycle
          </h2>

          <p className="text-white/60 text-base leading-6 max-w-xl mx-auto">
            Visualizing the high-speed data path from initial order capture to
            immutable blockchain-verified transaction evidence.
          </p>
        </div>

        {/* Flow Steps */}
        <div className="flex items-center justify-center mb-15">

          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl border border-lime-500 flex items-center justify-center">
              {/* Import Order Icon */}
               <Image
                      src="/image/platform-architecture/Icon (23).png"
                       alt="icon"
                      width={25}
                        height={25}
                        className="object-contain"
           />

            </div>

            <p className="text-white text-xs font-semibold tracking-[0.2em] mt-4">
              1. Order
            </p>
          </div>

          {/* Line */}
          <div className="w-44 h-px bg-lime-500 mx-10" />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl border border-lime-500 flex items-center justify-center">
              {/* Import Rating Icon */}
              <Image
                      src="/image/platform-architecture/Icon (24).png"
                       alt="icon"
                      width={25}
                        height={25}
                        className="object-contain"
           />
            </div>

            <p className="text-white text-xs font-semibold tracking-[0.2em] mt-4">
              2. Rating
            </p>
          </div>

          {/* Line */}
          <div className="w-44 h-px bg-white/30 mx-10" />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl border border-lime-500 flex items-center justify-center">
              {/* Import Evidence Icon */}
              <Image
                      src="/image/platform-architecture/Icon (25).png"
                       alt="icon"
                      width={25}
                        height={25}
                        className="object-contain"
           />
            </div>

            <p className="text-white text-xs font-semibold tracking-[0.2em] mt-2">
              3. Evidence
            </p>
          </div>
        </div>

        {/* Bottom Card */}
        <div className="border border-white/15 bg-white/[0.02] backdrop-blur-sm p-8 md:p-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left Content */}
            <div>
              <h3 className="text-lime-300 text-2xl mb-6">
                Unified Mediation
              </h3>

              <p className="text-white/70 text-lg leading-8">
                Asynchronous processing of xDR records with sub-millisecond
                latency. Mathematically verified data integrity at every hop.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <Image
                src="/image/platform-architecture/lifecyclegraph.png"
                alt="Live Telemetry"
                width={600}
                height={260}
                className="w-full border border-white/10"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-[10px] tracking-[0.2em]">
                  LIVE TELEMETRY: ACTIVE
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}