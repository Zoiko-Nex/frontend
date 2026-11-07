import { CheckCircle2, ChevronsDown } from "lucide-react";

const points = [
  {
    title: "Tier-1 Scaling",
    description:
      "Support for millions of concurrent sessions with carrier-grade reliability.",
  },
  {
    title: "Sovereign Data Privacy",
    description:
      "Cloud-native deployment options for on-prem or hybrid local control.",
  },
  {
    title: "Automated Settlements",
    description:
      "Complexity-free partner payments through built-in revenue share logic.",
  },
];

export default function SovereignInfrastructure() {
  return (
    <section className="bg-[#02031D] dark:bg-gray-900 py-16 md:py-[90px] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[70px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Architecture Diagram with the Skewed Backdrop Box */}
          <div className="relative p-4">
            {/* The Figma Skewed Box Backdrop Layer */}
            <div className="absolute inset-0 w-full h-full bg-[#BFF365]/5 border border-[#BFF365]/10 rounded-2xl transform rotate-[-1.90deg] pointer-events-none" />
            
            {/* Foreground Content Card */}
            <div className="relative z-10 border border-white/10 bg-lime-300/5 backdrop-blur-sm p-6 md:p-8 rounded-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] tracking-[0.25em] text-white/40 font-mono">
                  SYSTEM_ARCHITECTURE_OVERVIEW
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
              </div>

              <div className="space-y-2 text-xs md:text-sm">
                {/* Developer Ecosystem */}
                <div className="border border-[#BFF365]/30 bg-[#BFF365]/5 text-[#BFF365] text-center py-3.5 px-4 tracking-[0.2em] font-medium rounded">
                  DEVELOPER ECOSYSTEM
                </div>

                {/* Double Down Arrow Connector */}
                <div className="flex justify-center py-2">
                  <ChevronsDown className="text-[#BFF365]/40 animate-pulse" size={18} strokeWidth={2} />
                </div>

                {/* Gateway */}
                <div className="border border-white/15 bg-[#151528] text-white text-center py-5 px-4 rounded">
                  <div className="tracking-[0.2em] font-medium text-white/90">
                    ZOIKONEX MONETIZATION GATEWAY
                  </div>
                  <div className="text-white/40 text-[10px] md:text-xs mt-1.5 font-mono">
                    (Rating / Metering / Entitlement)
                  </div>
                </div>

                {/* Double Down Arrow Connector */}
                <div className="flex justify-center py-2">
                  <ChevronsDown className="text-[#2A78A1]/50 animate-pulse" size={18} strokeWidth={2} />
                </div>

                {/* Network */}
                <div className="border border-[#2A78A1]/40 bg-[#2A78A1]/10 text-[#6FB6E8] text-center py-3.5 px-4 tracking-[0.2em] font-medium rounded">
                  5G CORE / IMS NETWORK
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Built for Sovereign
              <br />
              Infrastructure
            </h2>

            <p className="text-base leading-7 text-white/60 mb-10 max-w-[520px]">
              ZoikoNex provides the &ldquo;glue&rdquo; between your technical
              network capabilities and your financial systems. Our platform
              ensures that every API call is rated correctly, every developer
              is authorized, and every cent is accounted for.
            </p>

            <div className="space-y-6">
              {points.map((point) => (
                <div key={point.title} className="flex gap-4">
                  <div className="shrink-0 mt-0.5 text-[#BFF365]">
                    <CheckCircle2 size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-white text-base mb-1 font-medium">
                      {point.title}
                    </h4>
                    <p className="text-sm leading-6 text-white/50">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}