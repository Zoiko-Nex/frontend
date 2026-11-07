"use client";

import Link from "next/link";

export default function MvnoDigitalBrands() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left — image */}
          <div className="p-6 bg-gray-800 rounded-sm overflow-hidden">
            <img
              src="/image/digital.jpg"
              alt="MVNO Digital Brands"
              className="w-full h-[420px] object-cover rounded-xs opacity-80"
            />
          </div>

          {/* Right — content */}
          <div className="pl-8 py-4 border-l-4 border-sky-600 flex flex-col gap-4">
            <p
              className="text-sky-600 text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              MVNO &amp; DIGITAL BRANDS
            </p>
            <h2
              className="text-zinc-900 text-xl font-normal leading-7"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Zero-Touch Infrastructure for Rapid Market Entry
            </h2>

            <div className="pt-2 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p
                  className="text-zinc-700 text-xs font-bold tracking-wider uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  THE OPERATOR PROBLEM
                </p>
                <p
                  className="text-zinc-700 text-sm leading-5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  High CAPEX and lengthy setup times for sub-brands prevent
                  agile market testing.
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
                  className="text-zinc-700 text-sm leading-5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  SaaS-based deployment with pre-integrated tax, payment, and
                  logistics connectors.
                </p>
              </div>
            </div>

            <div className="py-4 flex flex-col gap-4">
              {[
                "White-Label Digital App Framework",
                "Multi-Host Carrier Management",
              ].map((feat) => (
                <div key={feat} className="flex items-start gap-3">
                  <div className="w-3 h-2 bg-sky-600 flex-shrink-0 mt-1.5" />
                  <span
                    className="text-zinc-700 text-sm leading-5"
                    style={{ fontFamily: "'Liberation Mono', monospace" }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/mvnolaunch"
              className="inline-block px-6 py-3 bg-cyan-700 text-white text-sm font-normal hover:bg-cyan-600 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Build Your MVNO Launch Plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
