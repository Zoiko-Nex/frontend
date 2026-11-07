"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What operator types does ZoikoNex support?",
    answer:
      "ZoikoNex provides a modular architecture that supports MNOs, MVNOs (full, light, and branded), MVNEs, Digital-first operators, IoT/Embedded providers, and Private Enterprise networks.",
  },
  {
    question: "Is ZoikoNex suitable for MNO modernization?",
    answer:
      "Yes. ZoikoNex is purpose-built to support large-scale MNO transformations, enabling parallel BSS migration, real-time convergent charging, and 5G network slicing monetization without service disruption.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="w-full bg-white py-24 px-6">
      <div className="max-w-[768px] mx-auto flex flex-col gap-12">
        {/* Title */}
        <div className="text-center">
          <h2
            className="text-zinc-900 text-xl font-normal leading-7"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ items */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-stone-100 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <span
                    className="text-zinc-900 text-lg font-normal leading-7"
                    style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                  >
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 text-zinc-900">
                    {isOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-6 pb-6">
                    <p
                      className="text-zinc-700 text-base leading-6"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
