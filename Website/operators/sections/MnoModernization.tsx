"use client";

import Link from "next/link";

export default function MnoModernization() {
  return (
    <section className="w-full bg-gray-800 py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — content */}
          <div className="pl-8 py-4 border-l-4 border-sky-600 flex flex-col gap-4">
            {/* Category */}
            <p
              className="text-sky-600 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              MNO MODERNIZATION
            </p>

            {/* Heading */}
            <h2
              className="text-white text-xl font-normal leading-7"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Orchestrating Legacy &amp; 5G Convergence
            </h2>

            {/* Problem / Capability */}
            <div className="pt-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p
                  className="text-gray-500 text-xs font-bold tracking-wider uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  THE OPERATOR PROBLEM
                </p>
                <p
                  className="text-white/70 text-sm leading-5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Rigid legacy BSS blocks 5G monetization and increases churn
                  due to slow time-to-market.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p
                  className="text-sky-600 text-xs font-bold tracking-wider uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ZOIKONEX CAPABILITY
                </p>
                <p
                  className="text-white/70 text-sm leading-5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Unified Real-Time Charging (CCS) and Convergent Catalog for
                  rapid service creation.
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="py-4 flex flex-col gap-4">
              {[
                "NE-Core Integration via Open APIs",
                "Dynamic Slice Monetization Engines",
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-sky-600 flex-shrink-0 mt-1" />
                  <span
                    className="text-white/80 text-sm leading-5"
                    style={{ fontFamily: "'Liberation Mono', monospace" }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/mnomoderinization1"
              className="inline-block px-6 py-3 bg-sky-600 text-white text-sm font-normal hover:bg-sky-500 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Start an MNO Modernization Assessment
            </Link>
          </div>

          {/* Right — image */}
          <div className="p-4 bg-white/5 rounded-sm border border-white/10 overflow-hidden">
            <img
              src="/image/mno modernization.jpg"
              alt="MNO Modernization"
              className="w-full h-[420px] object-cover rounded-xs opacity-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
