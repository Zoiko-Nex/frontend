import Link from "next/link";
export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-lime-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

        {/* Background Glow */}
        <div className="absolute right-[-300px] top-[-250px] h-[700px] w-[700px] rounded-full bg-sky-500/5 blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sky-600 text-xs font-bold uppercase tracking-widest">
                  GTMI PLATFORM
                </span>

                <div className="hidden sm:block w-px h-4 bg-slate-300" />

                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Governed Telecom Monetization Infrastructure
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-4xl font-extrabold leading-tight text-gray-900 dark:text-white">
                The{" "}
                <span className="text-sky-600">
                  Infrastructure Layer
                </span>
                <br />
                for Telecom Monetization
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-xl">
                Run telecom like infrastructure — not software. ZoikoNex
                unifies charging, billing, tax, payments, and compliance
                across every jurisdiction in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="/request-a-demo"
                  className="inline-block px-8 py-4 bg-sky-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition"
                >
                  Request a Demo →
                </Link>

                <button className="px-8 py-4 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition">
                  View Platform Architecture
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-x-4 gap-y-3 mt-7">
                {[
                  "TM Forum Aligned",
                  "GSMA eSIM Ready",
                  "Evidence-Ledger Architecture",
                  "Multi-Jurisdiction by Design",
                  "Shared, Dedicated & Sovereign",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side */}
            <div className="relative mt-10 lg:mt-0">

              {/* Active Packs */}
              <div className="absolute right-[-55px] top-[-80px] z-20 bg-[#1C1C2E] rounded-[20px] px-4 py-4 w-[200px] shadow-2xl">
                <p className="text-[10px] uppercase tracking-[2px] text-white/50 mb-3">
                  ACTIVE PACKS
                </p>

                <div className="space-y-2.5 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500" />
                    <span>US — SureTax + FCC</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>UAE — VAT + TRA</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500" />
                    <span>Ghana — NCA + MoMo</span>
                  </div>
                </div>
              </div>

              {/* Main Card */}
              <div className="relative w-full max-w-[544px] bg-white/90 backdrop-blur-sm border border-white rounded-[28px] px-7 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

                {/* Heading */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-slate-600">
                    Jurisdiction Pack Selector
                  </h4>
                </div>

                {/* Country Selector */}
                <div className="flex flex-wrap gap-2 mb-5">

                  <button className="h-8 px-4 bg-sky-600 text-white rounded-xl text-xs font-semibold">
                    🇺🇸 United States
                  </button>

                  <button className="h-8 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                    🇬🇭 Ghana
                  </button>

                  <button className="h-8 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                    🇦🇪 UAE
                  </button>

                  <button className="h-8 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
                    🇮🇳 India
                  </button>

                </div>

                {/* Information Rows */}
                <div className="space-y-3">

                  <div className="h-12 rounded-xl bg-[#F4F7FA] px-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Tax Engine
                    </span>

                    <span className="text-xs font-medium text-sky-600">
                      SureTax / CereTax
                    </span>
                  </div>

                  <div className="h-12 rounded-xl bg-[#F4F7FA] px-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Compliance
                    </span>

                    <span className="text-xs font-medium text-slate-900">
                      FCC / USF / E-911
                    </span>
                  </div>

                  <div className="h-12 rounded-xl bg-[#F4F7FA] px-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Currency
                    </span>

                    <span className="text-xs font-medium text-lime-600">
                      USD
                    </span>
                  </div>

                  <div className="h-12 rounded-xl bg-[#F4F7FA] px-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Payment Rails
                    </span>

                    <span className="text-xs font-medium text-slate-900">
                      Card, Bank, ACH
                    </span>
                  </div>

                  <div className="h-12 rounded-xl bg-[#F4F7FA] px-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Invoice Format
                    </span>

                    <span className="text-xs font-medium text-sky-600">
                      US Standard
                    </span>
                  </div>

                </div>
              </div>

              {/* Bottom Floating Card */}
              <div className="absolute -left-10 -bottom-8 bg-white border border-slate-200 rounded-[24px] shadow-xl px-4 py-3">
                <h3 className="text-2xl leading-none font-extrabold">
                  <span className="text-sky-600">18</span>{" "}
                  <span className="text-[#1C1C2E]">Domains</span>
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Unified on one platform
                </p>
              </div>

            </div>

          </div>
        </div>


      </section>
      <section className="bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-start lg:justify-center gap-5 sm:gap-8 lg:gap-14 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">

            {/* TM Forum */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded opacity-60 bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-extrabold">
                TM
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                TM Forum Aligned
              </span>
            </div>

            <div className="w-px h-5 sm:h-6 bg-slate-200 dark:bg-gray-700 shrink-0" />

            {/* GSMA */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-7 sm:w-9 sm:h-8 rounded opacity-60 bg-blue-900 dark:bg-blue-700 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-extrabold">
                GSMA
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                GSMA eSIM Ready
              </span>
            </div>

            <div className="w-px h-5 sm:h-6 bg-slate-200 dark:bg-gray-700 shrink-0" />

            {/* Open Standards */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded opacity-60 bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-extrabold">
                OS
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                Open Standards Architecture
              </span>
            </div>

            <div className="w-px h-5 sm:h-6 bg-slate-200 dark:bg-gray-700 shrink-0" />

            {/* Multi Region */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded opacity-60 bg-lime-500 dark:bg-lime-600 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-extrabold">
                MR
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                Multi-Region Deployment
              </span>
            </div>

          </div>
        </div>
      </section>
    </main>

  );
}
