"use client";

import { useState } from "react";
import Link from "next/link";

type JurisdictionKey = "US" | "GH" | "AE" | "IN";

interface JurisdictionData {
  taxEngine: string;
  compliance: string;
  currency: string;
  paymentRails: string;
  invoiceFormat: string;
}

const jurisdictionPacks: Record<JurisdictionKey, JurisdictionData> = {
  US: {
    taxEngine: "SureTax / CereTax",
    compliance: "FCC / USF / E-911",
    currency: "USD",
    paymentRails: "Card, Bank, ACH",
    invoiceFormat: "US Standard",
  },
  GH: {
    taxEngine: "GRA VAT / CST Engine",
    compliance: "NCA / GRA / CST / Mobile Money Rules",
    currency: "GHS",
    paymentRails: "Mobile Money, Card, Bank Transfer",
    invoiceFormat: "Ghana VAT Invoice",
  },
  AE: {
    taxEngine: "FTA VAT Engine / UAE VAT Logic",
    compliance: "TDRA / FTA VAT / Corporate Tax Readiness",
    currency: "AED",
    paymentRails: "Card, Bank Transfer, Direct Debit",
    invoiceFormat: "UAE VAT Tax Invoice",
  },
  IN: {
    taxEngine: "GST Engine / GSTN E-Invoice Logic",
    compliance: "TRAI / DoT / GST / TDS / E-Invoicing",
    currency: "INR",
    paymentRails: "UPI, Card, NetBanking, NACH",
    invoiceFormat: "GST Tax Invoice / IRN E-Invoice",
  },
};

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<JurisdictionKey>("US");

  const currentPack = jurisdictionPacks[selectedTab];

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
                <span className="text-sky-600">Infrastructure Layer</span>
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

            {/* Right Side Showcase */}
            <div className="relative mt-10 lg:mt-0">

              {/* Active Packs Card */}
              <div className="absolute right-[-35px] top-[-60px] z-20 bg-[#1C1C2E] rounded-[20px] px-4 py-4 w-[210px] shadow-2xl hidden sm:block">
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
                    <span>Ghana — NCA + MoMo</span>
                  </div>
                </div>
              </div>

              {/* Main Pack Card */}
              <div className="relative w-full max-w-[544px] bg-white/90 backdrop-blur-md border border-white rounded-[28px] px-7 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
                
                {/* Heading Block */}
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Jurisdiction Pack Selector
                  </h4>
                  <div className="px-2.5 py-1 bg-lime-50 text-lime-700 rounded-full flex items-center gap-1.5 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Country Buttons Switchers */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: "US", label: "🇺🇸 United States" },
                    { id: "GH", label: "🇬🇭 Ghana" },
                    { id: "AE", label: "🇦🇪 UAE" },
                    { id: "IN", label: "🇮🇳 India" },
                  ].map((tab) => {
                    const isActive = selectedTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onMouseEnter={() => setSelectedTab(tab.id as JurisdictionKey)}
                        onClick={() => setSelectedTab(tab.id as JurisdictionKey)}
                        className={`h-8 px-3.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/10 border border-sky-600"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Rows Display Block */}
                <div className="space-y-3">
                  {[
                    { label: "Tax Engine", value: currentPack.taxEngine, isSky: true },
                    { label: "Compliance", value: currentPack.compliance, isSky: false },
                    { label: "Currency", value: currentPack.currency, isLime: true },
                    { label: "Payment Rails", value: currentPack.paymentRails, isSky: false },
                    { label: "Invoice Format", value: currentPack.invoiceFormat, isSky: true },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="h-11 rounded-xl bg-slate-50 border border-slate-100/50 px-4 flex items-center justify-between transition-all duration-300"
                    >
                      <span className="text-xs font-medium text-slate-500">
                        {row.label}
                      </span>
                      <span
                        className={`text-xs font-medium text-right font-mono max-w-[70%] truncate ${
                          row.isSky
                            ? "text-sky-600"
                            : row.isLime
                            ? "text-lime-700"
                            : "text-slate-900"
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Domains Card */}
              <div className="absolute -left-6 -bottom-6 bg-white border border-slate-100 rounded-[20px] shadow-xl px-5 py-3.5 hidden sm:block">
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

      {/* Trust Badges */}
      <section className="bg-white dark:bg-gray-900 border-y border-slate-200 dark:border-gray-700">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-start lg:justify-center gap-5 sm:gap-8 lg:gap-14 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white text-[9px] font-extrabold">
                TM
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                TM Forum Aligned
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-7 rounded opacity-60 bg-blue-900 dark:bg-blue-700 flex items-center justify-center text-white text-[9px] font-extrabold">
                GSMA
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                GSMA eSIM Ready
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-sky-600 dark:bg-sky-500 flex items-center justify-center text-white text-[9px] font-extrabold">
                OS
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-gray-300">
                Open Standards Architecture
              </span>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-gray-700 shrink-0" />

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded opacity-60 bg-lime-500 dark:bg-lime-600 flex items-center justify-center text-white text-[9px] font-extrabold">
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