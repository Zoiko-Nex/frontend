import Image from "next/image";
export default function NetworkAPIHero() {
  return (
    <section className="bg-[#02031D] dark:bg-gray-900">
      <div className="max-w-[1440px] mx-auto">
        <div
          className="
            relative overflow-hidden
            bg-[#0B0C24]
            px-20
            pt-[60px]
            pb-[76px]
          "
        >
          <div className="mx-auto max-w-[1280px]">
            {/* Eyebrow */}
            <span className="inline-block border border-lime-400/30 bg-lime-400/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.35em] text-[#2A78A1]">
              GSMA OPEN GATEWAY
            </span>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold leading-tight text-white ">
                  Turn Your Network
                  <br />
                  into a{" "}
                  <span className="text-lime-400">Billable</span>
                  <br />
                  Product.
                  <br />
                </h1>

                <p className="mt-8 max-w-[520px] text-base leading-7 text-white/60">
                  Monetize programmable network capabilities with automated
                  metering, entitlement, and developer revenue share. Unlock
                  the $100B API economy with Tier-1 BSS infrastructure.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    className="
                      inline-flex items-center justify-center
                      px-6 py-3
                      bg-[#2B7EC1]
                      text-base leading-6 text-white
                      transition-colors
                      hover:bg-[#236aa3]
                    "
                  >
                    Start Monetizing APIs
                  </button>

                  <button
                    className="
                      inline-flex items-center justify-center gap-2
                      px-6 py-3
                      border border-white/20
                      text-base leading-6 text-white
                      transition-colors
                      hover:bg-white/5
                    "
                  >
                    Developer Documentation
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Right Content - Live Revenue Stream Console */}
              <div className="relative">
                <div className="border border-white/10 bg-[#0F1020] p-6 md:p-2 ">
                  {/* Window dots + label */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2B7EC1]" />
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.25em] text-lime-400/80">
                      LIVE REVENUE_STREAM
                    </span>
                  </div>

                  {/* Data rows */}
                  <div className="space-y-5 font-mono text-xs md:text-sm">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-lime-400/80">API_ENDPOINT</span>
                      <span className="text-white">
                        /v1/network/location-verify
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-lime-400/80">METERING_TYPE</span>
                      <span className="text-white">PER_TRANSACTION</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-lime-400/80">ACTIVE_SESSIONS</span>
                      <span className="text-white">4,821</span>
                    </div>
                  </div>

                  {/* Revenue figure + sparkline */}
                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.25em] text-white/30 mb-2">
                        REAL-TIME_REVENUE
                      </div>
                      <div className="text-3xl md:text-2xl font-mono text-white">
                        $12,408.32
                      </div>
                    </div>

                    {/* Sparkline - replace with icon/chart if desired */}
                    
                  <Image
                                          src="/image/networkapi/graph.png"
                                          alt="SIM Provisioning"
                                          width={90}
                                          height={36}
                                          />
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