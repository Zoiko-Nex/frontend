export default function CapabilitiesGrid() {
  return (
    <section style={{ backgroundColor: "#ffffff" }} className="py-28">
      <div className="max-w-7xl mx-auto px-6">

        <p className="uppercase tracking-[6px] text-[#1E9FFF] text-xs mb-10">
          MODULAR PRECISION
        </p>

        <h2 className="text-black text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          18 Unified Domains. Zero
          <br />
          Fragmentation.
        </h2>

        <p className="text-[#8F99A8] text-lg max-w-3xl mb-20 leading-8">
          Built on TM Forum Open APIs and GSMA eSIM standards to ensure
          seamless interoperability with legacy and future network functions.
        </p>

        {/* Row 1 — 3 columns */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">

          <div style={{ backgroundColor: "#F2F2F2" }} className="p-8">
            <h3 className="text-black text-4xl font-bold mb-4">
              Charging & Rating
            </h3>
            <p className="text-[#5E6775] text-base leading-8 mb-6">
              High-performance engine for 5G slicing and dynamic pricing.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span style={{ border: "1px solid #9CA3AF" }} className="text-[#5E6775] text-[10px] px-3 py-1 uppercase tracking-widest">
                V-CHARGING
              </span>
              <span style={{ border: "1px solid #9CA3AF" }} className="text-[#5E6775] text-[10px] px-3 py-1 uppercase tracking-widest">
                RT-RATING
              </span>
            </div>
          </div>

          <div style={{ backgroundColor: "#16172F" }} className="p-8">
            <h3 className="text-white text-4xl font-bold mb-4">
              Identity & Trust
            </h3>
            <p className="text-[#7B7E90] text-base leading-8 mb-6">
              Secure eIDAS compliant sovereign identity orchestration.
            </p>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7B7E90" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div style={{ backgroundColor: "#F2F2F2" }} className="p-8">
            <h3 className="text-black text-4xl font-bold mb-6">
              Catalog
            </h3>
            <div className="space-y-3">
              <div style={{ backgroundColor: "#D1D5DB" }} className="h-2 rounded-sm w-full" />
              <div style={{ backgroundColor: "#D1D5DB" }} className="h-2 rounded-sm w-4/5" />
              <div style={{ backgroundColor: "#D1D5DB" }} className="h-2 rounded-sm w-3/5" />
            </div>
          </div>

        </div>

        {/* Row 2 */}
        <div className="grid lg:grid-cols-2 gap-5">

          <div style={{ backgroundColor: "#3182B7" }} className="p-8">
            <h3 className="text-white text-4xl font-bold mb-6">
              Unified Revenue Ledger
            </h3>
            <p className="text-white text-base leading-8">
              A single source of truth for all transactional data across the
              entire operator ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2">
            <div style={{ backgroundColor: "#F2F2F2", borderRight: "1px solid #D1D5DB" }} className="p-8">
              <h3 className="text-black text-3xl font-bold mb-4">Policy</h3>
              <p className="text-[#5E6775] text-base leading-7">
                Rule-based enforcement at the edge.
              </p>
            </div>
            <div style={{ backgroundColor: "#F2F2F2" }} className="p-8">
              <h3 className="text-black text-3xl font-bold mb-4">Inventory</h3>
              <p className="text-[#5E6775] text-base leading-7">
                Logical and physical asset tracking.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}