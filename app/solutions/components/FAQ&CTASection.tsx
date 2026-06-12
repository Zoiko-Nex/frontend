"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAndCTA() {
  const faqs = [
    {
      question: "How does ZoikoNex handle data residency?",
      answer:
        "ZoikoNex supports sovereign cloud deployments and regional data residency controls to ensure compliance with local regulations.",
    },
    {
      question: "Can we integrate with our existing OSS?",
      answer:
        "Yes. ZoikoNex provides API-first integrations and adapters for existing OSS/BSS platforms.",
    },
    {
      question: "What is the typical deployment timeline?",
      answer:
        "Most deployments can be completed within 8–12 weeks depending on integration complexity.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main>
      {/* FAQ SECTION */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16 px-4">
        <div className="max-w-[720px] mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#1C1B1C] dark:text-white mb-8 md:mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-4 md:p-5
                    text-left
                    text-[#1C1B1C]
                    dark:text-white
                  "
                >
                  <span className="pr-4 text-sm md:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-[#327DA8] py-14 md:py-20">
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 8px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl leading-tight">
            Ready to Build Your
            <br />
            Sovereign Future?
          </h2>

          <p className="mt-5 text-white/90 max-w-xl mx-auto text-sm md:text-base">
            Join the tier-1 operators who have already secured their
            monetization infrastructure with ZoikoNex.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black border border-white hover:bg-gray-100 transition">
              Request a Private Demo
            </button>

            <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white text-white hover:bg-white/10 transition">
              View Platform Architecture
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}