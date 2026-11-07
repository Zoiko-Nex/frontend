// app/problem-section/page.jsx

export default function ProblemSection() {
  const rows = [
    {
      legacy: "Fragmented systems",
      zoikonex: "Unified domain-driven platform",
    },
    {
      legacy: "Batch billing",
      zoikonex: "Real-time monetization",
    },
    {
      legacy: "Hardcoded local logic",
      zoikonex: "Runtime jurisdiction packs",
    },
    {
      legacy: "Single tax-provider dependency",
      zoikonex: "Multi-engine tax orchestration",
    },
    {
      legacy: "Mutable logs",
      zoikonex: "Immutable evidence ledger",
    },
    {
      legacy: "AI bolt-ons",
      zoikonex: "Policy-governed intelligence",
    },
  ];

  return (
    <section className="bg-[#003B6F] dark:bg-gray-900 py-10">
  <div className="max-w-5xl mx-auto px-8">

    {/* Label */}
    <p className="text-[#89D050] text-xs font-bold uppercase tracking-[0.2em] text-center mb-4">
      The Problem
    </p>

    {/* Heading */}
    <h2 className="text-white dark:text-white text-3xl lg:text-4xl font-extrabold text-center leading-10 max-w-5xl mx-auto">
      The Systems Running Global Telecom Were Designed Before the iPhone.
    </h2>

    {/* Description */}
    <p className="text-white/60 dark:text-gray-300 text-center text-base leading-7 max-w-6xl mx-auto mt-6">
      Legacy OSS/BSS environments were built for batch processes,
      limited geography, and slow product cycles. They are
      architecturally misaligned with real-time charging, eSIM-first
      ecosystems, embedded connectivity, and policy-driven multi-country
      compliance.
    </p>

    {/* Table */}
    <div className="mt-12 rounded-xl overflow-hidden border border-white/10 dark:border-white/10">
      
      {/* Header */}
      <div className="grid grid-cols-2 border-b border-white/10">
        <div className="px-6 py-4 text-[#89D050] text-xs font-bold uppercase tracking-wider">
          Legacy BSS
        </div>

        <div className="px-6 py-4 text-[#89D050] text-xs font-bold uppercase tracking-wider">
          ZoikoNex
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-2 border-b border-white/10 last:border-b-0"
        >
          <div className="px-6 py-4 text-sm text-white dark:text-white">
            {row.legacy}
          </div>

          <div className="px-6 py-4 text-sm text-white/90 dark:text-gray-200">
            {row.zoikonex}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
  );
}