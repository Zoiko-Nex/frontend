import Image from "next/image";

export default function CoreCapabilitiesBento() {
  return (
    <section className="bg-black py-16 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-3xl font-bold text-white">
            Engineered for Sovereign Scale
          </h2>

          <p className="mt-5 text-base text-[#848293]">
            Total control over your monetization stack with
            high-density technical modules.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Catalog */}
          <div className="lg:col-span-2 min-h-[215px] rounded-2xl border border-white/5 bg-[#1E1E2F] p-5">
            <div className="w-12 h-12 rounded-md border border-[#6DC02F]/10 bg-[#232638] flex items-center justify-center">
              <Image
                    src="/image/mvno-launch/Icon (1).svg"
                    alt="Product Catalog"
                    width={20}
                    height={20}
                />
            </div>

            <h3 className="mt-8 text-2xl font-semibold text-white">
              Product Catalog
            </h3>

            <p className="mt-5 text-[#848293] leading-8 max-w-2xl">
              Define complex service bundles, dynamic pricing,
              and cross-product discounts in a unified GUI.
              Rapidly iterate on commercial offerings without
              engineering bottlenecks.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <span className="px-3 py-1 text-[10px] font-mono tracking-wide text-[#848293] border border-[#C8C5CC]/10 bg-black/40">
                JSON DEFINED
              </span>

              <span className="px-3 py-1 text-[10px] font-mono tracking-wide text-[#848293] border border-[#C8C5CC]/10 bg-black/40">
                VERSIONED API
              </span>
            </div>
          </div>

          {/* Real Time Charging */}
          <div className="min-h-[215px] rounded-2xl border border-white/5 bg-[#1E1E2F] p-5">
            <div className="w-12 h-12 rounded-md border border-[#6DC02F]/10 bg-[#232638] flex items-center justify-center">
            <Image
                    src="/image/mvno-launch/Icon.svg"
                    alt="Real Time Charging"
                    width={22}
                    height={16}
                    />
            </div>

            <h3 className="mt-8 text-2xl font-semibold text-white">
              Real-time Charging
            </h3>

            <p className="mt-5 text-[#848293] leading-8">
              Sub-millisecond rating and balance management.
              Zero-leakage session control for voice, data,
              and VAS.
            </p>
          </div>

          {/* Multi Jurisdiction */}
          <div className="min-h-[215px] rounded-2xl border border-white/5 bg-[#1E1E2F] p-5">
            <div className="w-12 h-12 rounded-md border border-[#6DC02F]/10 bg-[#232638] flex items-center justify-center">
              <Image
                    src="/image/mvno-launch/Icon (3).svg"
                    alt="Multi Jurisdiction"
                    width={20}
                    height={20}
                    />
            </div>

            <h3 className="mt-8 text-2xl font-semibold text-white">
              Multi-jurisdiction
            </h3>

            <p className="mt-5 text-[#848293] leading-8">
              Automated tax calculations, currency
              conversions, and compliant invoicing across
              140+ global regions.
            </p>
          </div>

          {/* SIM/eSIM */}
          <div className="lg:col-span-2 min-h-[215px] rounded-2xl border border-white/5 bg-[#1E1E2F] p-5">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-12 h-12 rounded-md border border-[#6DC02F]/10 bg-[#232638] flex items-center justify-center">
                  <Image
                        src="/image/mvno-launch/Icon2.svg"
                        alt="SIM Provisioning"
                        width={16}
                        height={20}
                        />
                </div>

                <h3 className="mt-8 text-2xl font-semibold text-white">
                  SIM/eSIM Provisioning
                </h3>

                <p className="mt-5 text-[#848293] leading-8">
                  Instant OTA activations and profile switching.
                  Support for remote subscription management
                  (RSM) and massive IoT deployments.
                </p>
              </div>

              {/* Visual Area */}
              <div className="h-[220px] rounded-xl bg-[#0F1020] border border-white/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}