"use client";

const pathways = [
  {
    number: "01",
    numColor: "text-lime-300",
    dotColor: "bg-lime-300",
    title: "Launch",
    description:
      "Greenfield deployment for new MVNOs and IoT brands within weeks.",
    features: ["Rapid Core Config", "Regulatory Mapping", "Launch Readiness Review"],
  },
  {
    number: "02",
    numColor: "text-sky-600",
    dotColor: "bg-sky-600",
    title: "Modernize",
    description:
      "Systematic replacement of legacy BSS modules with zero downtime.",
    features: [
      "Migration Workbench",
      "Parallel Billing Verification",
      "Phase-out Orchestration",
    ],
  },
  {
    number: "03",
    numColor: "text-lime-800",
    dotColor: "bg-lime-800",
    title: "Expand",
    description:
      "Multi-country scaling and multi-tenant sub-brand creation.",
    features: ["Global Tenancy Setup", "Cross-Border Clearing", "Ecosystem API Growth"],
  },
];

export default function PathwaysToSovereignty() {
  return (
    <section className="w-full bg-gray-800 py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col gap-16">
          {/* Section title */}
          <div className="text-center">
            <h2
              className="text-white text-xl font-normal leading-7"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Pathways to Sovereignty
            </h2>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {pathways.map((p) => (
              <div key={p.number} className="relative flex flex-col gap-6">
                {/* Big ghost number */}
                <div
                  className={`absolute -top-10 -left-4 text-6xl font-normal opacity-20 ${p.numColor} select-none`}
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {p.number}
                </div>

                {/* Title */}
                <h3
                  className="text-white text-base font-normal leading-6 pt-4"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {p.title}
                </h3>

                {/* Description */}
                <p
                  className="text-white/70 text-base leading-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {p.description}
                </p>

                {/* Feature list */}
                <div className="flex flex-col gap-4 pt-2">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${p.dotColor} flex-shrink-0`}
                      />
                      <span
                        className="text-white text-xs leading-4"
                        style={{ fontFamily: "'Liberation Mono', monospace" }}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
