import Image from "next/image";
export default function LaunchBlueprint() {
  return (
    <section className="relative overflow-hidden bg-[#1B1B36] py-15">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16">
          <p className="text-[#BFF365] text-xs font-semibold tracking-[0.2em] uppercase font-mono">
            Migration & Deployment
          </p>

          <h2 className="mt-4 text-white text-4xl font-semibold leading-[48px]">
            The 45-Day Launch Blueprint
          </h2>
        </div>

        <div className="grid lg:grid-cols-[80px_1fr_520px] gap-6">
          {/* Timeline */}
          <div className="relative flex flex-col items-center">
            <div className="absolute top-5 bottom-5 w-px bg-[#BFF365]/40" />

            {/* Step 1 */}
            <div className="relative z-10 w-14 h-14 rounded-xl border border-[#BFF365] bg-black flex items-center justify-center text-[#BFF365]">
              1
            </div>

            <div className="h-56" />

            {/* Step 2 */}
            <div className="relative z-10 w-14 h-14 rounded-xl border border-white/40 bg-black flex items-center justify-center text-white">
              2
            </div>

            <div className="h-36" />

            {/* Step 3 */}
            <div className="relative z-10 w-14 h-14 rounded-xl border border-white/40 bg-black flex items-center justify-center text-white">
              3
            </div>
          </div>

          {/* Content */}
          <div className="space-y-20">
            {/* Step 1 */}
            <div>
              <h3 className="text-white text-xl font-semibold">
                Core Integration (Days 1-15)
              </h3>

              <p className="mt-4 text-[#848293] text-xm leading-6 max-w-xl">
                Establish high-speed interconnects between your network
                core and the ZoikoNex monetization stack. Secure VPN/Direct
                Connect establishment and HLR/HSS mapping.
              </p>

              <div className="mt-8 space-y-4">
                <div className="space-y-4">
  <div className="flex items-center gap-3">
    <div className="w-[15px] h-[15px] rounded-full border border-[#BFF365] flex items-center justify-center shrink-0">
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none"
      >
        <path
          d="M1 3L3 5L7 1"
          stroke="#BFF365"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <span className="text-white/80 text-base">
      Diameter/RADIUS Interconnect
    </span>
  </div>

  <div className="flex items-center gap-3">
    <div className="w-[15px] h-[15px] rounded-full border border-[#BFF365] flex items-center justify-center shrink-0">
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        fill="none"
      >
        <path
          d="M1 3L3 5L7 1"
          stroke="#BFF365"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>

    <span className="text-white/80 text-base">
      GTP Proxy Configuration
    </span>
  </div>
</div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-white text-xl font-semibold">
                Commercial Configuration (Days 16-30)
              </h3>

              <p className="mt-4 text-[#848293] text-xm leading-6 max-w-xl">
                Catalog design, tariff plan mapping, and billing cycle
                definition. We automate the mapping of customer journeys
                into functional charging triggers.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-white text-xl font-semibold">
                Activation & Scaling (Days 31-45)
              </h3>

              <p className="mt-4 text-[#848293] text-xm leading-6 max-w-xl">
                Beta user on-boarding, load testing, and go-live.
                Transition to our 24/7 sovereign support desk with full
                observability dashboards enabled.
              </p>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="space-y-15">
            {/* Image Card */}
            <div className="bg-[#0D1020] p-5">
              <p className="text-[#848293] text-[10px] font-mono tracking-wider uppercase mb-5">
                Network Topology
              </p>

              {/* Replace with your image */}
              <div className="relative h-40 bg-black/40 overflow-hidden">
                <Image
                    src="/image/mvno-launch/network.png"
                    alt="Network"
                    fill
                    className="object-cover"
                />
                </div>
            </div>

            {/* Icon Card */}
            <div className="bg-[#0D1020] h-[120px] flex items-center justify-center">
              {/* Import your settings/config icon */}
              <div className="text-white text-4xl">
                 <Image
                    src="/image/mvno-launch/icon.png"
                    alt="Network"
                    width={20}
                   height={60}
                    className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}