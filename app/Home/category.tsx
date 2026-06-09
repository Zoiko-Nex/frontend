export default function CategoryDefinitionSection() {
  return (
    <section className="bg-[#FAFBFC] dark:bg-gray-900 py-16 lg:py-10">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2B7EC1] mb-3">
              Category Leadership
            </p>

            <h2 className="text-[#1C1C2E] dark:text-white text-3xl lg:text-4xl font-bold leading-tight">
              The Global Standard for
              <br />
              Governed Telecom
              <br />
              Monetization Infrastructure
            </h2>

            <p className="mt-6 text-[#4A5568] dark:text-gray-300 text-base leading-8 max-w-xl">
              Legacy BSS platforms were built to process transactions.
              GTMI platforms are built to govern revenue — across
              jurisdictions, operators, regulations, payments,
              compliance, and AI-assisted operations simultaneously.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 px-5 py-3 border border-[#2B7EC1] rounded-lg text-[#2B7EC1] dark:text-sky-400 dark:border-sky-400 text-sm font-semibold transition hover:bg-[#2B7EC1] hover:text-white">
              Learn About GTMI

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Right Card */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-[#111827] via-[#102A4A] to-[#163B63] p-5 lg:p-12 shadow-2xl">
              <p className="text-[#89D050] text-[11px] uppercase tracking-[0.2em] font-bold mb-4">
                GTMI Definition
              </p>

              <h3 className="text-white text-3xl font-extrabold leading-[1.1]">
                Governed Telecom Monetization
                <br />
                Infrastructure
              </h3>

              <p className="mt-6 text-white/70 text-base leading-7">
                A platform category where charging, billing,
                tax, payments, lifecycle, evidence, and
                intelligence operate as one governed system —
                not a collection of integrated tools.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}