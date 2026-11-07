import {
  Shield,
  Monitor,
  Layers3,
  SunMedium,
  Lock,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const trustCards = [
  {
    icon: Lock,
    title: "Security",
    items: [
      "Zero-trust service architecture",
      "mTLS and service identity",
      "Field-level encryption for sensitive data",
      "KMS / HSM-backed key hierarchy",
      "Secrets vault discipline",
    ],
  },
  {
    icon: BadgeCheck,
    title: "Compliance",
    items: [
      "Jurisdiction-pack compliance logic",
      "Signed regulatory export packages",
      "KYC and SIM-registration controls",
      "Data residency enforcement",
      "Retention and deletion lifecycle",
    ],
  },
  {
    icon: Shield,
    title: "Governance",
    items: [
      "RBAC / ABAC with policy versioning",
      "Approval workflows for overrides",
      "AI oversight tiers",
      "Just-in-time privilege elevation",
      "Tamper-evident admin action trail",
    ],
  },
];
const pillars = [
  {
    category: "JURISDICTION",
    title: "At Runtime",
    description:
      "Markets activate instantly. Tax routing, invoice compliance, reporting, and residency behavior execute from runtime jurisdiction packs — no deployments required.",
    icon: SunMedium,
    type: "blue",
  },
  {
    category: "EVIDENCE",
    title: "Not Logs",
    description:
      "Every financial and compliance event is immutable, provable, and audit-ready through a hash-chained evidence ledger. This is legally defensible infrastructure.",
    icon: Shield,
    type: "green",
  },
  {
    category: "AI",
    title: "With Control",
    description:
      "AI can recommend, score, and prioritize — but cannot act beyond policy or approval in materially consequential flows. Intelligence with governance by design.",
    icon: Layers3,
    type: "green",
  },
  {
    category: "INFRASTRUCTURE",
    title: "Not Software",
    description:
      "ZoikoNex is designed to run operators — not support them with another application layer. This is critical monetization infrastructure for serious operators.",
    icon: Monitor,
    type: "blue",
  },
];
const regions = [
  {
    name: "North America",
    countries: "US,CA",
    compliance: "FCC / USF",
    tax: "SureTax",
    rails: "Card, ACH",
  },
  {
    name: "Europe",
    countries: "UK, DE, EU",
    compliance: "GDPR / VAT",
    tax: "VAT/OSS",
    rails: "SEPA, Open Banking",
  },
  {
    name: "Middle East",
    countries: "UAE, SA",
    compliance: "CITC / TRA",
    tax: "VAT + Arabic",
    rails: "Local bank + wallet",
  },
  {
    name: "Africa",
    countries: "GH, NG, KE",
    compliance: "NCA / NCC",
    tax: "Local rules",
    rails: "M-Pesa, MoMo",
  },
  {
    name: "Asia-Pacific",
    countries: "IN, SG, ID",
    compliance: "TRAI / IMDA",
    tax: "GST + local",
    rails: "UPI, local wallets",
  },
  {
    name: "Caribbean",
    countries: "JM, TT, BB",
    compliance: "OUR / ECTEL",
    tax: "Local regulators",
    rails: "Local / regional",
  },
];
const governanceData = [
  {
    useCase: "Churn Prediction",
    description:
      "Scores subscriber churn propensity from usage, payment, and interaction signals.",
    tier: "Tier 0-1",
    color:
      "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  },
  {
    useCase: "Revenue Leakage Detection",
    description:
      "Flags missing billable events within hours, not month-end.",
    tier: "Tier 1-2",
    color:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  },
  {
    useCase: "Fraud Detection",
    description:
      "Identifies suspicious route, usage, or SIM abuse patterns.",
    tier: "Tier 1-2",
    color:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  },
  {
    useCase: "Tax Anomaly Detection",
    description:
      "Flags jurisdiction mismatches or outlier responses before invoice release.",
    tier: "Tier 2",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    useCase: "Support Triage",
    description:
      "Classifies and prioritizes support cases with response drafting.",
    tier: "Tier 0-1",
    color:
      "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
  },
];
const implementationSteps = [
  {
    no: "01",
    title: "Discovery",
    weeks: "Wks 1–2",
    description:
      "Current-state audit, connector scope, target jurisdictions",
  },
  {
    no: "02",
    title: "Configuration",
    weeks: "Wks 3–6",
    description:
      "Tenant, packs, products, approvals, and policies",
  },
  {
    no: "03",
    title: "Integration",
    weeks: "Wks 5–10",
    description:
      "Provider and carrier integrations validated",
  },
  {
    no: "04",
    title: "Validation",
    weeks: "Wks 9–12",
    description:
      "End-to-end flows, UAT, reconciliation tests",
  },
  {
    no: "05",
    title: "Go-Live",
    weeks: "Wk 12+",
    description:
      "Controlled cutover and 30-day hypercare",
  },
];

export default function WhyZoikoNexPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
      <section className="py-16 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#2B7EC1] mb-4">
              WHY ZOIKONEX
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-[#1C1C2E] dark:text-white mb-4">
              Four Pillars. Non-Negotiable.
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Everything on the platform reinforces four structural ideas that
              separate ZoikoNex from conventional BSS.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">

            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={index}
                  className={`
                    rounded-[28px]
                    border
                    p-8 md:p-7
                    min-h-[250px]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl

                    ${pillar.type === "blue"
                      ? `
                          bg-gradient-to-br
                          from-[#F0F8FF]
                          to-[#E8F4FC]
                          border-[#B7D9F5]
                          dark:from-sky-950/30
                          dark:to-sky-900/20
                          dark:border-sky-800
                        `
                      : `
                          bg-gradient-to-br
                          from-[#F0FAE8]
                          to-[#EEF9E4]
                          border-[#CDE7B5]
                          dark:from-green-950/30
                          dark:to-green-900/20
                          dark:border-green-800
                        `
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      w-11 h-11
                      rounded-xl
                      flex items-center justify-center
                      mb-6
                      ${pillar.type === "blue"
                        ? "bg-[#2B7EC1]"
                        : "bg-[#74C02F]"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Category */}
                  <p
                    className={`
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.2em]
                      mb-3
                      ${pillar.type === "blue"
                        ? "text-[#2B7EC1]"
                        : "text-[#74C02F]"
                      }
                    `}
                  >
                    {pillar.category}
                  </p>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#1C1C2E] dark:text-white mb-1">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-6 text-[#64748B] dark:text-gray-300">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F4FAF8] to-[#EEF6F3] dark:from-slate-900 dark:to-slate-950 py-16 md:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Label */}
          <div className="text-center">
            <p className="uppercase tracking-[0.22em] text-[11px] font-bold text-[#4A9018] mb-4">
              Multi-Jurisdiction Runtime
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C2E] dark:text-white">
              Policy Becomes Runtime Behavior
            </h2>

            <p className="max-w-5xl mx-auto mt-6 text-[#4A5568] dark:text-slate-300 text-base md:text-lg leading-relaxed">
              Markets are not projects. They are activated. A jurisdiction pack
              contains tax logic, invoice formatting, legal text, compliance
              rules, reporting obligations, data residency constraints, and
              payment preferences.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-14">
            {regions.map((region) => (
              <div
                key={region.name}
                className="
                bg-white
                dark:bg-slate-800
                border
                border-[#DDE8F0]
                dark:border-slate-700
                rounded-[24px]
                p-6
                shadow-sm
                hover:shadow-lg
                transition-all
                duration-300
              "
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1C1C2E] dark:text-white">
                    {region.name}
                  </h3>

                  <div
                    className="
                    bg-[#E8F4FC]
                    dark:bg-sky-900/40
                    text-[#2B7EC1]
                    dark:text-sky-300
                    text-xs
                    font-semibold
                    px-15
                    py-1.5
                    rounded-full
                  "
                  >
                    {region.countries}
                  </div>
                </div>

                {/* Rows */}
                <div className="space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B] dark:text-slate-400">
                      Compliance
                    </span>

                    <span className="font-mono text-sm text-[#1C1C2E] dark:text-white text-right">
                      {region.compliance}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B] dark:text-slate-400">
                      Tax
                    </span>

                    <span className="font-mono text-sm text-[#1C1C2E] dark:text-white text-right">
                      {region.tax}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-[#64748B] dark:text-slate-400">
                      Rails
                    </span>

                    <span className="font-mono text-sm text-[#1C1C2E] dark:text-white text-right">
                      {region.rails}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment Architecture Section */}
      <section className="bg-white dark:bg-gray-900 py-16 md:py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-14">
            <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-4">
              Deployment Architecture
            </p>
            <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              One Architecture. Four Deployment Models. Zero Compromise.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed">
              Commercially and technically distinct paths to production — all<br className="hidden md:block"/> running the same unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-7 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-full px-3 py-1 w-max mb-6">
                <span className="text-sky-700 dark:text-sky-400 text-[10px] font-bold uppercase tracking-wide">Shared SaaS</span>
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-2">Shared SaaS</h3>
              <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">Fastest time to live</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-5 flex-grow">
                Strong tenant-aware isolation in shared environment. Launch and iterate at speed without infrastructure overhead.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold mt-6">Best for: Launch and scale operators</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-7 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-violet-100 dark:bg-violet-900/30 rounded-full px-3 py-1 w-max mb-6">
                <span className="text-violet-900 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wide">Dedicated Cloud</span>
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-2">Dedicated Cloud</h3>
              <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">Enterprise isolation</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-5 flex-grow">
                Single-tenant application and data boundary for operators with compliance or brand separation requirements.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold mt-6">Best for: Multi-brand operators</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-7 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full px-3 py-1 w-max mb-6">
                <span className="text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wide">Hybrid</span>
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-2">Hybrid</h3>
              <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">Flexible architecture</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-5 flex-grow">
                Mix of controlled local edge and cloud core for complex operational environments with specific residency needs.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold mt-6">Best for: Complex environments</p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-[20px] p-7 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full px-3 py-1 w-max mb-6">
                <span className="text-gray-900 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wide">Sovereign</span>
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-2">Sovereign</h3>
              <p className="text-sky-600 dark:text-sky-400 text-xs font-semibold mb-4">Maximum control</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-5 flex-grow">
                Independent keys, isolated hosting, and fully regulated posture for government or heavily regulated operators.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold mt-6">Best for: Government / regulated</p>
            </div>

          </div>
        </div>
      </section>

      {/* Solution Paths Section */}
      <section className="bg-gray-50 dark:bg-slate-950 py-16 md:py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-sky-600 text-xs font-bold uppercase tracking-widest mb-4">
              Solution Paths
            </p>
            <h2 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              Built for Your Operator Model
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed">
              Each path is designed around a distinct operator archetype —<br className="hidden md:block"/> with outcomes, capabilities, and next steps matched to your context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/star.svg" alt="Star" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">MVNO Launch</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Go from zero to live with charging, billing, tax, payments, and lifecycle built in from day one. No stitching. No gaps.
              </p>
              <Link href="/mvnolaunch" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/users.svg" alt="Users" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">MVNE & Multi-Brand</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Operate multiple brands, wholesale overlays, and partner structures inside one governed environment.
              </p>
              <Link href="/mnomoderinization1" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/arrow-top-right.svg" alt="Modernization" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">MNO Modernization</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Replace brittle legacy monetization stacks through controlled migration and coexistence models designed for live environments.
              </p>
              <Link href="/mnomoderinization2" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/phone.svg" alt="Phone" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">eSIM & IoT</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Support fleet-scale embedded connectivity with GSMA-aligned lifecycle and billing controls at device-fleet scale.
              </p>
              <Link href="/esim-and-iot" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/telephone.svg" alt="Telephone" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">Enterprise & B2B Connectivity</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Support account hierarchies, pooled billing, SLA-linked charging, and enterprise commerce across complex organizational structures.
              </p>
              <Link href="/solutions" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 6 */}
            <div className="bg-white dark:bg-gray-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow flex flex-col">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <img src="/image/home/globe.svg" alt="Globe" className="w-5 h-5" />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold mb-4">Network API Monetization</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-6 flex-grow mb-8">
                Turn programmable network capabilities into monetized products with entitlements, metering, and developer-oriented controls.
              </p>
              <Link href="/networkapi" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-xs font-semibold">
                Explore Solution <img src="/image/home/arrow-right.svg" alt="Arrow" className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-10 bg-[#F8F9FB] dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center">
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-sky-600">
              AI Governance
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1C1C2E] dark:text-white">
              Intelligence Without Losing Control
            </h2>
          </div>

          {/* Policy Guardrail Card */}
          <div
            className="
            mt-7
            rounded-[32px]
            bg-gradient-to-r
            from-[#171B3A]
            to-[#163D68]
            p-8
            md:p-8
            text-center
          "
          >
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-lime-400">
              The Policy Guardrail
            </p>

            <h3 className="mt-3 text-l md:text-xl font-bold text-white">
              AI that operates within defined boundaries
            </h3>

            <p className="mt-2 max-w-4xl mx-auto text-sm md:text-lg text-white/70 leading-6">
              AI may score, forecast, recommend, summarize, and prioritize.
              AI may not post financial adjustments, alter tax treatment,
              release regulatory exports, or override compliance rules
              without policy authorization or human approval.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block mt-10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Use Case
                  </th>

                  <th className="py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    What It Does
                  </th>

                  <th className="py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                    Governance Tier
                  </th>
                </tr>
              </thead>

              <tbody>
                {governanceData.map((item) => (
                  <tr
                    key={item.useCase}
                    className="border-b border-slate-200 dark:border-slate-800"
                  >
                    <td className="py-5 font-semibold text-[#1C1C2E] dark:text-white">
                      {item.useCase}
                    </td>

                    <td className="py-5 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </td>

                    <td className="py-5">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${item.color}`}
                      >
                        {item.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden mt-8 space-y-4">
            {governanceData.map((item) => (
              <div
                key={item.useCase}
                className="
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-800
                bg-white
                dark:bg-slate-900
                p-5
              "
              >
                <h4 className="font-bold text-[#1C1C2E] dark:text-white">
                  {item.useCase}
                </h4>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>

                <span
                  className={`inline-flex mt-4 rounded-md px-3 py-1 text-xs font-semibold ${item.color}`}
                >
                  {item.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operator Outcomes Section */}
      <section className="bg-[#1C1C2E] dark:bg-gray-900 py-16 md:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-lime-400 text-xs font-bold uppercase tracking-widest mb-4">
              Operator Outcomes
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-4">
              Built to Perform at Operator Scale
            </h2>
            <p className="text-white/60 text-lg font-normal leading-relaxed">
              Executive-level outcomes, grounded in architecture — not aspiration.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white/5 rounded-[20px] p-8 border border-lime-500/50 hover:border-lime-500 transition-colors flex flex-col justify-start">
              <div className="text-lime-400 text-2xl font-medium font-mono mb-4">01</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                Launch a new market — no code.
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 rounded-[20px] p-8 border border-lime-500/50 hover:border-lime-500 transition-colors flex flex-col justify-start">
              <div className="text-lime-400 text-2xl font-medium font-mono mb-4">02</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                Detect billing leakage within hours — not<br className="hidden lg:block"/> at month end.
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 rounded-[20px] p-8 border border-lime-500/50 hover:border-lime-500 transition-colors flex flex-col justify-start">
              <div className="text-lime-400 text-2xl font-medium font-mono mb-4">03</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                Support real-time charging at sub-<br className="hidden lg:block"/>200ms class performance targets.
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white/5 rounded-[20px] p-8 border border-lime-500/50 hover:border-lime-500 transition-colors flex flex-col justify-start">
              <div className="text-lime-400 text-2xl font-medium font-mono mb-4">04</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                Operate many markets from one<br className="hidden lg:block"/> deployment architecture.
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white/5 rounded-[20px] p-8 border border-lime-500/50 hover:border-lime-500 transition-colors flex flex-col justify-start">
              <div className="text-lime-400 text-2xl font-medium font-mono mb-4">05</div>
              <div className="text-white text-base font-semibold leading-relaxed">
                Keep every material financial decision<br className="hidden lg:block"/> provable and reviewable.
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-lime-500/10 rounded-[20px] p-8 border border-lime-500 transition-colors flex flex-col justify-between min-h-[200px]">
              <div>
                <div className="text-lime-400 text-2xl font-normal font-mono mb-4">06</div>
                <div className="text-white/90 text-lg font-semibold leading-relaxed mb-6">
                  See what ZoikoNex can do for your<br className="hidden lg:block"/> operation.
                </div>
              </div>
              <Link href="/request-a-demo" className="w-full py-3.5 bg-lime-500 rounded-xl shadow-[0px_2px_12px_0px_rgba(109,192,47,0.30)] text-white text-sm font-semibold text-center hover:bg-lime-600 transition-colors block">
                Request a Demo
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#EEF5E8] dark:bg-[#101827] py-16 lg:py-10 overflow-hidden">
        <div className="container mx-auto px-4">

          {/* Heading */}
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-sky-600">
              Implementation
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl lg:text-4xl font-bold text-[#1C1C2E] dark:text-white">
              Controlled Launch. Structured Migration.
            </h2>

            <p className="mt-5 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Every implementation is controlled, structured, and designed
              for confidence — not bureaucracy.
            </p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block mt-13">
            <div className="relative max-w-5xl mx-auto">

              {/* Green Line */}
              <div className="absolute top-7 left-0 right-0 h-[2px] bg-[#6DC02F]" />

              <div className="relative flex justify-between">
                {implementationSteps.map((step) => (
                  <div
                    key={step.no}
                    className="w-[180px] text-center"
                  >
                    {/* Circle */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-sky-500 bg-white dark:bg-[#182232]">
                      <span className="font-mono text-xs font-semibold text-sky-600">
                        {step.no}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 text-[20px] font-bold text-[#1C1C2E] dark:text-white">
                      {step.title}
                    </h3>

                    {/* Week */}
                    <p className="mt-2 text-sm font-semibold text-sky-600">
                      {step.weeks}
                    </p>

                    {/* Description */}
                    <p className="mt-3 w-[205px] mx-auto text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden mt-12">
            <div className="relative">

              {/* Vertical Line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[#6DC02F]" />

              <div className="space-y-10">
                {implementationSteps.map((step) => (
                  <div key={step.no} className="relative flex gap-4">

                    {/* Circle */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-sky-500 bg-white dark:bg-[#182232]">
                      <span className="font-mono text-xs font-semibold text-sky-600">
                        {step.no}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="pt-1">
                      <h3 className="text-xl font-bold text-[#1C1C2E] dark:text-white">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-sky-600">
                        {step.weeks}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
      <section className="bg-[#F7F8FA] dark:bg-[#0F172A] py-16 lg:py-10">
        <div className="container mx-auto px-4">

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">
              Trust & Security
            </p>

            <h2 className="mt-4 text-3xl md:text-4xl lg:text-4xl font-bold text-[#1C1C2E] dark:text-white">
              Trust Is the Operating Model — Not a Feature
            </h2>
          </div>

          {/* Hero Card */}
          <div className="mt-10 max-w-5xl mx-auto overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1B1C38] via-[#17182F] to-[#1C2F58] px-6 py-10 md:px-12 md:py-9 text-center">

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#89D050]">
              Immutable Evidence by Design
            </p>

            <h3 className="mt-4 text-xl md:text-xl font-bold text-white">
              A legally defensible evidence record — not a log
            </h3>

            <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base leading-7 text-white/65">
              Every billing event, tax decision, payment capture, and compliance
              export is written to a hash-chained evidence ledger. This is not a
              log. It is a legally defensible evidence record.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {trustCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#182232] p-6 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-sky-600" />

                      <h3 className="text-sm font-bold text-[#1C1C2E] dark:text-white">
                        {card.title}
                      </h3>
                    </div>

                    <ul className="mt-5 space-y-3">
                      {card.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-5 text-[#4A5568] dark:text-slate-300"
                        >
                          <span className="mt-2 h-[5px] w-[5px] rounded-full bg-sky-600 shrink-0" />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
      <section className="relative overflow-hidden bg-gradient-to-r from-[#19345A] via-[#17395F] to-[#123D2C] dark:from-[#19345A] dark:via-[#17395F] dark:to-[#123D2C]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-16 md:py-10">
          <div className="mx-auto max-w-3xl text-center">

            {/* Badge */}
            <span className="inline-flex items-center rounded-full border border-[#6DC02F] px-4 py-1 text-xs font-medium text-[#6DC02F]">
              See ZoikoNex in Action
            </span>

            {/* Heading */}
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-white leading-tight">
              See ZoikoNex in Action
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm md:text-base leading-7 text-white/70 max-w-xl mx-auto">
              Every engagement is technical, structured, and aligned to your
              operator model. We route you to the right pre-sales team based on
              your context.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">

              <Link href="/request-a-demo" className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#6DC02F] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">
                Request a Demo
                <ChevronRight size={16} />
              </Link>

              <Link href="/technical-architecture" className="rounded-xl border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Start Technical Evaluation
              </Link>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}