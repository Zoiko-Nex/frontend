const legacyItems = [
  "Batch processing (T+24 hours)",
  "Manual spreadsheet reconciliation",
  "Sampling-based audits",
  "Siloed data lakes",
];

const zoikonexItems = [
  "Streaming validation (T+0 seconds)",
  "Self-healing ACR workflows",
  "100% transaction fingerprinting",
  "BSS-embedded unified ledger",
];

export default function RASovereignControl() {
  return (
    <section className="bg-[#EDE9EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

          {/* Card header */}
          <div className="px-10 py-7 border-b border-[#F0F0F0]">
            <h2 className="text-[1.2rem] font-bold text-[#111111]">
              Sovereign Control vs. Legacy Systems
            </h2>
          </div>

          {/* Column header row */}
          <div className="grid grid-cols-2">
            {/* Left header */}
            <div className="px-10 py-3 bg-[#F5F3F4] border-b border-[#EBEBEB] border-r border-r-[#EBEBEB]">
              <span className="text-[0.6rem] font-bold tracking-[0.16em] text-[#9CA3AF] uppercase">
                Legacy Revenue Assurance
              </span>
            </div>

            {/* Right header */}
            <div className="px-10 py-3 bg-[#F2FAE8] border-b border-[#EBEBEB]">
              <span className="text-[0.6rem] font-bold tracking-[0.16em] text-[#6A9A1A] uppercase">
                Zoikonex BSS-Native
              </span>
            </div>
          </div>

          {/* Data rows */}
          {legacyItems.map((legacy, i) => (
            <div
              key={i}
              className="grid grid-cols-2"
              style={{ borderBottom: i < legacyItems.length - 1 ? "1px solid #F0F0F0" : "none" }}
            >
              {/* Left cell */}
              <div className="px-10 py-5 border-r border-[#F0F0F0] bg-white">
                <span className="text-sm text-[#6B7280]">{legacy}</span>
              </div>

              {/* Right cell */}
              <div className="px-10 py-5 bg-[#F9FDF0]">
                <span className="text-sm font-semibold text-[#111111]">
                  {zoikonexItems[i]}
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
