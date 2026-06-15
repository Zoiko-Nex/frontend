"use client";

const steps = [
  {
    title: "01. Assessment",
    description:
      "Audit of legacy BSS silos and identification of technical debt bottlenecks within current domain boundaries.",
    icon: "/image/technical-architecture/Icon (33).png",
    active: true,
  },
  {
    title: "02. Fit Mapping",
    description:
      "Mapping existing business processes against ZoikoNex Bounded-Domains for modular compatibility.",
    icon: "/image/technical-architecture/Icon (34).png",
  },
  {
    title: "03. Integration Review",
    description:
      "API-first validation of internal and 3rd party endpoints using our Sovereign Mesh protocols.",
    icon: "/image/technical-architecture/Icon (35).png",
  },
  {
    title: "04. Migration Plan",
    description:
      "Final delivery of a zero-downtime transition roadmap with clearly defined SLA benchmarks.",
    icon: "/image/technical-architecture/Icon (36).png",
  },
];

export default function EvaluationRoadmap() {
  return (
    <section className="bg-[#1B1D36] border-t border-stone-300/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-16">
          <h2 className="text-white text-3xl font-semibold leading-tight mb-4">
            Structured Evaluation Framework
          </h2>

          <p className="max-w-[576px] text-white/60 text-lg leading-7">
            A rigorous, four-stage protocol for architectural alignment and
            risk mitigation.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-300/20 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            {steps.map((step, index) => (
              <div key={index}>
                {/* Icon Box */}
                <div
                  className={`
                    w-20 h-20 rounded-xl flex items-center justify-center mb-6
                    ${
                      step.active
                        ? "border-2 border-slate-200"
                        : "border-2 border-stone-300/30"
                    }
                  `}
                >
                  {/* Replace with your icon */}
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-6 h-6 object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="text-white text-[22px] font-semibold leading-8 mb-5">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-base leading-8">
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