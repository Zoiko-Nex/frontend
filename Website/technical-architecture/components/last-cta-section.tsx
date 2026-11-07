"use client";

export default function FinalCTASection() {
  return (
    <section className="bg-[#1B1B2C] border-t border-white/10 py-10">
      <div className="max-w-[672px] mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-white text-2xl md:text-3xl font-semibold leading-tight mb-6">
          Ready for Critical Infrastructure?
        </h2>

        {/* Description */}
        <p className="text-white/60 text-base leading-7 mb-12">
          Engage with our senior architects for a deep-dive into your specific
          migration constraints.
        </p>

        {/* CTA Button */}
        <button
          className="
            inline-flex
            items-center
            gap-3
            px-12
            py-5
            bg-[#B7F35D]
            text-[#1B1B2C]
            text-lg
            font-semibold
            rounded-sm
            hover:opacity-90
            transition
          "
        >
          {/* Calendar Icon Here */}
           <img
                    src="/image/technical-architecture/Icon (1).png"
                    alt="icon"
                    className="w-6 h-6 object-contain"
                  />
          <div className="w-3 h-3" />

          <span>Schedule an Architecture Deep-Dive</span>
        </button>

        {/* Footer Text */}
        <p className="mt-8 text-white/30 text-xs font-semibold uppercase ">
          Reserved for CTIO / Lead Architect Stakeholders
        </p>
      </div>
    </section>
  );
}