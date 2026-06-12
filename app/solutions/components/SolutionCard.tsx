"use client";

import {
  Network,
  ShieldCheck,
  Globe,
} from "lucide-react";

const topSolutions = [
  {
    title: "MVNO Launch",
    icon: "/image/solutionpage/MVNO Rocket.png",
    features: [
      "Real-time Rating Engine",
      "Digital Onboarding/KYC",
      "Multi-IMSI Management",
      "Modular Product Catalog",
      "Self-Service Portals",
    ],
  },
  {
    title: "MVNE & Multi-Brand",
    icon: "/image/solutionpage/Data Hub.png",
    features: [
      "Multi-Tenant Infrastructure",
      "Brand-Specific Currencies",
      "Whitelabel Self-Care",
      "Wholesale Settlements",
      "Hierarchical ACLs",
    ],
  },
  {
    title: "MNO Modernization",
    icon: "/image/solutionpage/Fiber Optics.png",
    features: [
      "API-First Wrappers",
      "Shadow Billing Sync",
      "Hybrid Cloud Support",
      "Zero-Downtime Migration",
      "Legacy Adapter Layer",
    ],
  },
  {
    title: "eSIM & IoT",
    icon: "/image/solutionpage/Hardware Circuit.png",
    features: [
      "Remote SIM Provisioning",
      "SM-DP+ Integration",
      "Massive IoT Billing",
      "Geofencing Triggers",
      "Global Carrier Roaming",
    ],
  },
];

const bottomSolutions = [
  {
    title: "Network API",
    icon: Network,
    features: [
      "CAMARA Compliance",
      "API Usage Monetization",
      "Third-Party Sandbox",
    ],
  },
  {
    title: "Revenue Assurance",
    icon: ShieldCheck,
    features: [
      "CDR Reconciliation",
      "Fraud Detection ML",
      "Margin Analytics",
    ],
  },
];

export default function EnterpriseGradeSolutions() {
  return (
    <section className="bg-[#FCF8F9] dark:bg-gray-900 py-10 px-15">
      <div className="mx-auto max-w-[1280px] px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-medium text-[#1C1B1C] dark:text-white">
            Enterprise-Grade Solutions
          </h2>

          <div className="mx-auto mt-4 h-[3px] w-12 bg-black dark:bg-white" />
        </div>

        {/* Top Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {topSolutions.map((item) => (
            <div
              key={item.title}
              className="border border-[#D8D8D8] dark:border-gray-700 bg-[#FCF8F9] dark:bg-gray-800 p-8"
            >
              <div className="mb-6">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-12 w-12 object-contain"
                />
              </div>

              <h3 className="text-base font-normal text-[#1C1B1C] dark:text-white">
                {item.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {item.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-[#47464C] dark:text-gray-300"
                  >
                    <span className="mt-[2px] text-[#476800]">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-8 inline-flex items-center gap-2 text-[15px] text-[#1C1B1C] dark:text-white">
                Explore Solution
                <span className="text-xl">→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {bottomSolutions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="border border-[#D8D8D8] dark:border-gray-700 bg-[#FCF8F9] dark:bg-gray-800 p-8 lg:col-span-3"
              >
                <div className="mb-6">
                  <Icon className="h-10 w-10 text-black dark:text-white" />
                </div>

                <h3 className="text-base text-[#1C1B1C] dark:text-white">
                  {item.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm text-[#47464C] dark:text-gray-300"
                    >
                      <span className="mt-[2px] text-[#476800]">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-8 inline-flex items-center gap-2 text-[15px] text-[#1C1B1C] dark:text-white">
                  Explore Solution
                  <span className="text-xl">→</span>
                </button>
              </div>
            );
          })}

          {/* Global Jurisdiction Billing */}
          <div className="border border-[#D8D8D8] dark:border-gray-700 bg-[#FCF8F9] dark:bg-gray-800 p-8 lg:col-span-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-6">
                  <Globe
                    size={30}
                    strokeWidth={2}
                    className="text-black dark:text-white"
                  />
                </div>

                <h3 className="text-[18px] font-medium text-[#1C1B1C] dark:text-white">
                  Global Jurisdiction Billing
                </h3>

                <p className="mt-4 max-w-[320px] text-base leading-7 text-[#47464C] dark:text-gray-300">
                  Solve complex tax and regulatory hurdles for global
                  cross-border connectivity.
                </p>
              </div>

              <div className="border-l border-[#D8D8D8] dark:border-gray-700 pl-8">
                <ul className="space-y-5">
                  <li className="flex gap-3 text-[#47464C] dark:text-gray-300">
                    <span className="text-[#476800]">•</span>
                    Multi-Currency Ledger
                  </li>

                  <li className="flex gap-3 text-[#47464C] dark:text-gray-300">
                    <span className="text-[#476800]">•</span>
                    Local Tax Automation
                  </li>

                  <li className="flex gap-3 text-[#47464C] dark:text-gray-300">
                    <span className="text-[#476800]">•</span>
                    Sovereign Data Residency
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}