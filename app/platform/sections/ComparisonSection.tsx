export default function ComparisonSection() {
  return (
    <section style={{ backgroundColor: "#ffffff" }} className="py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top two-column block */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-black text-4xl lg:text-5xl font-bold leading-tight">
              The Systems Running
              <br />
              Global Telecom Were
              <br />
              Designed Before The
              <br />
              iPhone.
            </h2>
          </div>
          <div className="flex items-start pt-2">
            <p className="text-[#5E6775] text-base leading-8">
              Legacy OSS/BSS environments were built for batch processes, limited
              geography, and slow product cycles. They are architecturally misaligned
              with real-time charging, eSIM-first ecosystems, embedded connectivity,
              and policy-driven multi-country compliance.
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-black/10 mb-16" />

        {/* Two comparison panels */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT — Legacy Fragmentation */}
          <div style={{ backgroundColor: "#FAFAFA", border: "1px solid rgba(0,0,0,0.08)" }} className="p-10">
            <p className="uppercase text-[10px] tracking-[5px] text-[#D73434] mb-10">
              LEGACY FRAGMENTATION
            </p>
            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <svg className="shrink-0 mt-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#D73434" strokeWidth="1.4" />
                  <path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="#D73434" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <div>
                  <h4 className="text-black text-xl font-bold mb-2">Batch-Driven Latency</h4>
                  <p className="text-[#5E6775] text-base leading-7">
                    Revenue realization delayed by hours or days due to archaic
                    batch cycles and sync windows.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <svg className="shrink-0 mt-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#D73434" strokeWidth="1.4" />
                  <path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="#D73434" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <div>
                  <h4 className="text-black text-xl font-bold mb-2">Hard-Coded Logic</h4>
                  <p className="text-[#5E6775] text-base leading-7">
                    Months of development required for even simple price-plan
                    modifications or jurisdiction changes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — ZoikoNex Unification */}
          <div style={{ backgroundColor: "#FAFAFA", border: "1px solid rgba(0,0,0,0.08)" }} className="p-10">
            <p className="uppercase text-[10px] tracking-[5px] text-[#2D9F6E] mb-10">
              ZOIKONEX UNIFICATION
            </p>
            <div className="space-y-10">
              <div className="flex items-start gap-5">
                <svg className="shrink-0 mt-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#2D9F6E" strokeWidth="1.4" />
                  <path d="M6 10.5l3 3 5-5" stroke="#2D9F6E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h4 className="text-black text-xl font-bold mb-2">Real-Time Event Streams</h4>
                  <p className="text-[#5E6775] text-base leading-7">
                    Instantaneous monetization of every network packet,
                    edge-to-core, with sub-200ms performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <svg className="shrink-0 mt-1" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#2D9F6E" strokeWidth="1.4" />
                  <path d="M6 10.5l3 3 5-5" stroke="#2D9F6E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h4 className="text-black text-xl font-bold mb-2">Immutable Evidence Ledger</h4>
                  <p className="text-[#5E6775] text-base leading-7">
                    Cryptographically verifiable evidence of every transaction,
                    ensuring a legally defensible source of truth.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}