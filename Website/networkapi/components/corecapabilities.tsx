import { ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
const primaryCapabilities = [
  {
    icon: ShieldCheck,
    title: "CAMARA Compliance",
    description:
      'Fully integrated with GSMA Open Gateway standards. Ensure global interoperability for developers while maintaining sovereign control over your core infrastructure.',
    tags: ["JSON-RPC", "RESTful", "OpenAPI 3.0"],
  },
  {

    title: "API Metering",
    description:
      "High-precision transaction tracking with sub-millisecond latency for real-time rating and billing.",
    tags: [],
  },
];

export default function CoreAPICapabilities() {
  return (
    <section className="bg-[#02031D] dark:bg-gray-900 py-16 md:py-15">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[70px]">
        {/* Heading */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Core API Capabilities
          </h2>

          <p className="mt-4 max-w-[560px] text-base leading-6 text-white/60 ">
            Standardized, secure, and revenue-ready network exposure via
            CAMARA-aligned interfaces.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CAMARA Compliance - Large left card (spans 2 columns on desktop) */}
          <div
            key="CAMARA"
            className="lg:col-span-2 border border-[#1E3A4C] bg-[#0A1220] p-6"
          >
            <div className="mb-6 text-lime-400">
              <ShieldCheck size={28} strokeWidth={1.5} />
            </div>

            <h3 className="text-lg text-white mb-3">
              CAMARA Compliance
            </h3>

            <p className="text-sm leading-6 text-white/50  max-w-[460px]">
              Fully integrated with GSMA Open Gateway standards. Ensure global
              interoperability for developers while maintaining sovereign control over your
              core infrastructure.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["JSON-RPC", "RESTful", "OpenAPI 3.0"].map((tag) => (
                <span
                  key={tag}
                  className="border border-white/10 px-3 py-1 font-mono text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* API Metering - Small right card */}
          <div
            key="API"
            className="border border-[#1E3A4C] bg-[#0A1220] p-6"
          >
            <div className="mb-6 text-lime-400">
              <Image
                        src="/image/networkapi/Icon.png"
                        alt="api"
                        width={26}
                        height={26}
                        />
            </div>

            <h3 className="text-lg text-white mb-3">
              API Metering
            </h3>

            <p className="text-sm leading-6 text-white/50">
              High-precision transaction tracking with
              sub-millisecond latency for real-time rating
              and billing.
            </p>
          </div>

          {/* SIM-Swap Signals - Small left card */}
          <div
            key="SIM"
            className="border border-[#1E3A4C] bg-[#0A1220] p-6"
          >
            <div className="mb-6 text-lime-400">
              <Image
                        src="/image/networkapi/Icon (1).png"
                        alt="SIM Provisioning"
                        width={16}
                        height={20}
                        />
            </div>

            <h3 className="text-lg text-white mb-3">
              SIM-Swap Signals
            </h3>

            <p className="text-sm leading-6 text-white/50">
              Provide critical fraud prevention signals to
              financial institutions through automated SIM change notifications.
            </p>
          </div>

          {/* Location Verification - Large right card (spans 2 columns on desktop) */}
          <div
            key="Location"
            className="lg:col-span-2 border border-[#1E3A4C] bg-[#0A1220] p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <div className="mb-6 text-lime-400">
                <MapPin size={28} strokeWidth={1.5} />
              </div>

              <h3 className="text-lg text-white mb-3">
                Location Verification APIs
              </h3>

              <p className="text-sm leading-6 text-white/50 max-w-[360px]">
                On-demand geolocation verification for high-security
                transactions without compromising user privacy.
              </p>
            </div>

           {/* Decorative location marker - double layer box */}
<div className="shrink-0 self-center md:self-auto flex items-center justify-center">
  <div className="size-15 rounded-xl border-2 border-[#BFF365]/40 flex items-center justify-center bg-black/20">
    <div className="size-10 rounded-lg border border-[#BFF365]/60 bg-[#BFF365]/10 flex items-center justify-center">
      <div className="size-3.5 rounded-full bg-[#BFF365] " />
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </section>
  );
}