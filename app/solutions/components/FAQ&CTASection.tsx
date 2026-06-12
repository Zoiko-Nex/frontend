"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAndCTA() {
  const faqs = [
    {
      question: "How does ZoikoNex handle data residency?",
      answer:
      ".",
    },
    {
      question: "Can we integrate with our existing OSS?",
      answer:
        ".",
    },
    {
      question: "What is the typical deployment timeline?",
      answer:
        "..",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main>
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-xl font-medium mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border border-gray-300 bg-gray-50"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span>{faq.question}</span>

                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );


      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-[#327DA8] py-16 md:py-16">
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
          <h2 className="text-white font-bold text-3xl md:text-5xl leading-tight">
            Ready to Build Your
            <br />
            Sovereign Future?
          </h2>

          <p className="mt-6 text-white/90 max-w-xl mx-auto text-sm md:text-base">
            Join the tier-1 operators who have already secured their
            monetization infrastructure with ZoikoNex.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="
                w-full sm:w-auto
                px-8 py-4
                bg-white
                text-black
                border border-white
                hover:bg-gray-100
                transition
              "
            >
              Request a Private Demo
            </button>

            <button
              className="
                w-full sm:w-auto
                px-8 py-4
                border border-white
                text-white
                hover:bg-white/10
                transition
              "
            >
              View Platform Architecture
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}