import Image from "next/image";
import { UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus, // Component Type
    title: "Onboarding",
    description: "Self-service developer portal with KYC and credential management.",
  },
  {
    icon: "/image/networkapi/Icon (2).png", // String Path Type
    title: "Provisioning",
    description: "Automated creation of API keys, scopes, and quota entitlements.",
  },
  {
    icon: "/image/networkapi/Icon (3).png", // String Path Type
    title: "Capture",
    description: "Real-time usage collection and rating via high-performance mediation.",
  },
  {
    icon: "/image/networkapi/Icon (4).png", // String Path Type
    title: "Settlement",
    description: "Automatic revenue sharing and invoicing for ecosystem partners.",
  },
];

export default function ProgrammableMonetizationLayer() {
  return (
    <section className="bg-[#070821] dark:bg-gray-900 py-16 md:py-15">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[70px]">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white ">
            The Programmable Monetization Layer
          </h2>

          <p className="mt-4 max-w-[700px] mx-auto text-base leading-6 text-white/60">
            From developer onboarding to automated revenue capture—a unified
            workflow for telco API management.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop horizontal line - positioned exactly below the icons */}
          <div className="hidden lg:block absolute top-[83.50px] left-0 w-full h-px bg-stone-300/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step) => {
              const IconContent = step.icon;
              const isStringPath = typeof IconContent === "string";

              return (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon Frame Container */}
                  <div className="w-14 h-14 rounded-xl border border-white/20 bg-[#1E1E2F] flex items-center justify-center mb-6 md:mb-8 text-lime-400 relative">
                    {isStringPath ? (
                      <Image
                        src={IconContent}
                        alt={`${step.title} icon`}
                        width={22}
                        height={22}
                        className="object-contain"
                      />
                    ) : (
                      <IconContent size={22} strokeWidth={1.5} />
                    )}
                  </div>

                  <h3 className="text-white text-base leading-6 mb-2 ">
                    {step.title}
                  </h3>

                  <p className="text-white/50 text-xs leading-5 max-w-[200px] ">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}