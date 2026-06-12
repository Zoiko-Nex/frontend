const steps = [
  {
    number: "1",
    title: "Assessment",
    description: "Full audit of legacy dependencies & data flows.",
  },
  {
    number: "2",
    title: "Fit Mapping",
    description: "Aligning sovereign stack with operational KPIs.",
  },
  {
    number: "3",
    title: "Review",
    description: "Regulatory & technical compliance validation.",
  },
  {
    number: "4",
    title: "Plan",
    description: "Final blueprint for phased phased deployment.",
  },
  {
    number: "5",
    title: "Readiness",
    description: "Production go-live with 24/7 shadow support.",
    active: true,
  },
];

export default function ImplementationPathway() {
  return (
    <section className="bg-[#02031D] dark:bg-gray-900 py-16 md:py-[90px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[70px]">

        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h3 className="text-white dark:text-white text-base font-normal leading-6 mb-4">
            Structured Migration Pathway
          </h3>

          <p className="max-w-[646px] mx-auto text-white/60 dark:text-gray-400 text-base leading-6">
            A mathematical approach to infrastructure transition,
            ensuring zero service disruption for Tier-1 operations.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-7 left-0 w-full h-px bg-white/10" />

          {/* Mobile: stack vertically */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                {/* Step Number */}
                <div
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center text-base mb-6 md:mb-8 transition-all
                    ${
                      step.active
                        ? "bg-[#2B7EC1] border-[#2B7EC1] text-white"
                        : "bg-[#1E1E2F] dark:bg-gray-800 border-white/20 text-white"
                    }`}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h4 className="text-white dark:text-white text-base leading-6 mb-2">
                  {step.title}
                </h4>

                {/* Description */}
                <p className="text-white/50 dark:text-gray-400 text-xs leading-4 max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}