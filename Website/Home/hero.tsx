"use client";

import { useState } from "react";
import Link from "next/link";
import { US, GB, SG, AE } from "country-flag-icons/react/3x2";

type JurisdictionKey = "US" | "UK" | "SG" | "AE";

interface JurisdictionData {
  taxEngine: string;
  compliance: string;
  currency: string;
  paymentRails: string;
  invoiceFormat: string;
}

const jurisdictionPacks: Record<JurisdictionKey, JurisdictionData> = {
  US: {
    taxEngine: "SureTax / CereTax / State & Local Telecom Tax",
    compliance: "FCC / USF / E-911 / State PUC Logic",
    currency: "USD",
    paymentRails: "Card, ACH, Bank Transfer, Wire",
    invoiceFormat: "US Telecom Tax Invoice",
  },
  UK: {
    taxEngine: "HMRC VAT Engine / Reverse-Charge Logic",
    compliance: "Ofcom / HMRC VAT / UK GDPR / Metering & Billing Rules",
    currency: "GBP",
    paymentRails: "Card, Bacs, Faster Payments, Direct Debit, CHAPS",
    invoiceFormat: "UK VAT Invoice / Telecom Service Invoice",
  },
  SG: {
    taxEngine: "IRAS GST Engine / GST InvoiceNow-ready",
    compliance: "IMDA / GST / PDPA / Telecom Competition Code",
    currency: "SGD",
    paymentRails: "Card, FAST, PayNow, GIRO, Bank Transfer",
    invoiceFormat: "Singapore GST Tax Invoice / InvoiceNow",
  },
  AE: {
    taxEngine: "FTA VAT Engine / UAE VAT Logic",
    compliance: "TDRA / FTA VAT / Corporate Tax Readiness",
    currency: "AED",
    paymentRails: "Card, Bank Transfer, Direct Debit",
    invoiceFormat: "UAE VAT Tax Invoice",
  },
};

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<JurisdictionKey>("US");

  const currentPack = jurisdictionPacks[selectedTab];

  const FlagComponents: Record<JurisdictionKey, React.ComponentType<{ className?: string; title?: string }>> = {
    US: US,
    UK: GB,
    SG: SG,
    AE: AE,
  };

  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-lime-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <section className="relative w-full overflow-hidden">

        {/* Background Glow */}
        <div className="absolute right-[-300px] top-[-250px] h-[700px] w-[700px] rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
                <span className="text-sky-600 text-xs font-bold uppercase tracking-widest ">
                  GTMI PLATFORM
                </span>
                <div className="hidden sm:block w-px h-4 bg-slate-300" />
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  Governed Telecom Monetization Infrastructure
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
                The{" "}
                <span className="text-sky-600">Infrastructure Layer</span>
                <br />
                for Telecom Monetization
              </h1>

              <p className="mt-4 md:mt-6 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-xl">
                Run telecom like infrastructure — not software. ZoikoNex
                unifies charging, billing, tax, payments, and compliance
                across every jurisdiction in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
                <Link
                  href="/request-a-demo"
                  className="inline-block text-center px-6 md:px-8 py-3.5 md:py-4 bg-sky-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition duration-200"
                >
                  Request a Demo →
                </Link>
                <Link href="/platform-architecture">
                  <button className="px-6 md:px-8 py-3.5 md:py-4 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-xl font-semibold text-gray-900 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition duration-200">
                    View Platform Architecture
                  </button>
                </Link>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-x-4 gap-y-2.5 mt-8">
                {[
                  "TM Forum Aligned",
                  "GSMA eSIM Ready",
                  "Evidence-Ledger Architecture",
                  "Multi-Jurisdiction by Design",
                  "Shared, Dedicated & Sovereign",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Showcase */}
            <div className="relative w-full flex justify-center lg:justify-end mt-10 lg:mt-0 px-2 sm:px-6 lg:px-0">

              {/* Active Packs Card - Safe on tablet viewports */}
              <div className="absolute right-[-10px] xl:right-[-35px] top-[-100px] z-20 bg-[#1C1C2E] rounded-[20px] px-4 py-4 w-[200px] shadow-2xl hidden md:block">
                <p className="text-[10px] uppercase tracking-[2px] text-white/50 mb-3">
                  ACTIVE PACKS
                </p>
                <div className="space-y-2.5 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <span>US — SureTax + FCC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>UAE — VAT + TRA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                    <span>UK — Ofcom + HMRC</span>
                  </div>
                </div>
              </div>

              {/* Main Pack Card */}
              <div className="relative w-full max-w-[544px] bg-white/70 backdrop-blur-md border border-white/95 rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]">

                {/* Heading Block */}
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs font-semibold text-slate-600 tracking-wider">
                    Jurisdiction Pack Selector
                  </h4>
                  <div className="px-2.5 py-1 bg-lime-50 text-lime-700 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
                    Live
                  </div>
                </div>

                {/* Country Buttons Switchers - Completely Fluid/Responsive One-Line Layout */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap snap-x sm:flex-wrap sm:overflow-visible">
                  {[
                    { id: "US", label: "United States" },
                    { id: "UK", label: "United Kingdom" },
                    { id: "SG", label: "Singapore" },
                    { id: "AE", label: "UAE" },
                  ].map((tab) => {
                    const isActive = selectedTab === tab.id;
                    const FlagComponent = FlagComponents[tab.id as JurisdictionKey];
                    return (
                      <button
                        key={tab.id}
                        onMouseEnter={() => setSelectedTab(tab.id as JurisdictionKey)}
                        onClick={() => setSelectedTab(tab.id as JurisdictionKey)}
                        className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-2 shrink-0 snap-start ${isActive
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/10 border border-sky-600"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                      >
                        {FlagComponent && (
                          <FlagComponent
                            title={tab.label}
                            className="w-4 h-auto shadow-sm rounded-xs shrink-0"
                          />
                        )}
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Rows Display Block - Responsive Fluid Height and Wrapping Strategy */}
                <div className="space-y-3 mt-4">
                  {[
                    { label: "Tax Engine", value: currentPack.taxEngine, isSky: true },
                    { label: "Compliance", value: currentPack.compliance, isSky: false },
                    { label: "Currency", value: currentPack.currency, isLime: true },
                    { label: "Payment Rails", value: currentPack.paymentRails, isSky: false },
                    { label: "Invoice Format", value: currentPack.invoiceFormat, isSky: true },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 rounded-lg bg-slate-100/80 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 transition-all duration-300 min-h-[40px]"
                    >
                      <span className="text-xs font-medium text-slate-500 shrink-0">
                        {row.label}
                      </span>
                      <span
                        className={`text-xs font-medium text-left sm:text-right font-['DM_Mono'] break-words tracking-tight max-w-full sm:max-w-[70%] ${row.isSky
                            ? "text-sky-600"
                            : row.isLime
                              ? "text-lime-700"
                              : "text-gray-900"
                          }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Domains Card */}
              <div className="absolute -left-4 xl:-left-6 -bottom-10 bg-white border border-slate-100 rounded-[20px] shadow-xl px-5 py-3.5 hidden md:block">
                <h3 className="text-2xl font-extrabold tracking-tight leading-none">
                  <span className="text-sky-600">18</span>{" "}
                  <span className="text-[#1C1C2E]">Domains</span>
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-1.5">
                  Unified on one platform
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges - Handles Endless Dimensions Seamlessly */}
      <section className="w-full bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start lg:justify-center gap-6 py-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white text-[9px] font-extrabold">
                TM
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-300">
                TM Forum Aligned
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-7 rounded opacity-60 bg-blue-900 dark:bg-blue-700 flex items-center justify-center text-white text-[9px] font-extrabold">
                GSMA
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-300">
                GSMA eSIM Ready
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white text-[9px] font-extrabold">
                OS
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-300">
                Open Standards Architecture
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-lime-50 dark:bg-lime-600 flex items-center justify-center text-white text-[9px] font-extrabold">
                MR
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-gray-300">
                Multi-Region Deployment
              </span>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}