const operatorSolutions = [
  {
    title: "I'm launching an MVNO",
    description: "Rapid market entry with a pre-integrated stack.",
  },
  {
    title: "I run multiple brands",
    description:
      "Unified governance for MVNE & multi-jurisdiction.",
  },
  {
    title: "I'm modernizing BSS",
    description:
      "Seamless migration from legacy infrastructure.",
  },
  {
    title: "I'm scaling eSIM/IoT",
    description:
      "Global connectivity orchestration & monetization.",
  },
];

export default function OperatorModelSection() {
  return (
    <section className="bg-[#1A1A28] py-16 lg:py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex justify-center">
          <h3
            className="
              text-base
              uppercase
              leading-6
              text-white/40
              font-mono
              text-center
            "
          >
            FIND THE SOLUTION BUILT FOR YOUR OPERATOR MODEL
          </h3>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {operatorSolutions.map((item) => (
            <div
              key={item.title}
              className="
                bg-[#151528]
                border border-white/5
                p-6
                min-h-[120px]
              "
            >
              <h4 className="text-base leading-6 text-sky-600 font-normal">
                {item.title}
              </h4>

              <p className="mt-3 text-sm leading-5 text-white/50">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}