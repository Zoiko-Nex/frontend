"use client";

export default function TechnicalArchitectureHero() {
  return (
    <section className="bg-[#0F1126] py-15">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/* Badge */}
        <div className="px-3 py-1 bg-lime-500/25 border border-cyan-700/25 mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Technical Architecture Review V4.2
          </span>
        </div>

        {/* Heading */}
        <div className="max-w-[896px] text-center">
          <h1 className="text-4xl lg:text-3xl font-bold leading-[1.1]">
            <span className="text-white">
              Tier-1 Sovereign BSS:
              <br />
            </span>

            <span className="text-sky-600">
              Evidence, Not Logs.
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="max-w-[672px] text-center mt-6">
          <p className="text-lg leading-7 text-white/60">
            Validate your migration path with our Bounded-Domain
            architectural framework. Engineered for CTOs requiring
            mathematical certainty in global infrastructure deployment.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            className="
              px-8 py-4
              bg-sky-600
              text-white
              text-sm
              font-semibold
              rounded-sm
              hover:bg-sky-700
              transition
            "
          >
            Schedule an Architecture Deep-Dive
          </button>

          <button
            className="
              px-8 py-4
              border border-stone-300/30
              text-white
              text-sm
              font-semibold
              rounded-sm
              hover:bg-white/5
              transition
            "
          >
            View Technical Docs
          </button>
        </div>
      </div>
    </section>
  );
}