const differentiators = [
  {
    title: "Governed by Design",
    description:
      "Compliance isn't a layer; it's the foundation. Every data packet and billing record is traceable, immutable, and jurisdictionally aware.",
  },
  {
    title: "Built Beyond Billing",
    description:
      "We move beyond simple transaction processing to offer intelligent orchestration of connectivity, identity, and settlement.",
  },
  {
    title: "Sovereign Native",
    description:
      "Take back control of your technology stack. No vendor lock-in, no hidden logic—full transparency for institutional stakeholders.",
  },
];

export default function CoreInfrastructureDifferentiators() {
  return (
    <section className="bg-[#1A1A28] dark:bg-gray-900 py-16 md:py-[70px]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[102px]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {differentiators.map((item, index) => (
            <div
              key={item.title}
              className={`
                px-0 md:px-12
                py-8 md:py-0
                ${
                  index !== 2
                    ? "border-b md:border-b-0 md:border-r border-white/10"
                    : ""
                }
              `}
            >
              <h3 className="text-white dark:text-white text-base font-normal leading-6 mb-6 md:mb-8 font-['Hanken_Grotesk']">
                {item.title}
              </h3>

              <p className="text-white/60 dark:text-gray-400 text-base leading-6 font-['Inter'] max-w-[331px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}