"use client";

export default function EngineeredForScale() {
  return (
    <section
      className="py-[120px]"
      style={{
        background: "#FCF8F9",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Heading */}
        <div className="max-w-[672px] mx-auto mb-16">
          <h2
            className="text-center"
            style={{
              fontSize: "40px",
              lineHeight: "48px",
              fontWeight: 600,
              color: "#000",
            }}
          >
            Engineered for Global Scale
          </h2>
          <p
            className="text-center mt-4"
            style={{
              color: "#47464C",
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
            The ZoikoNex BSS platform provides the granular control needed to manage
            massive device volumes without operational overhead.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Card 1: Device-Level Usage Rating ── */}
          <div className="lg:col-span-8 min-h-80 p-8 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 backdrop-blur-[6px] inline-flex flex-col justify-between items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              {/* Icon */}
              <div className="mb-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b82c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 16 6 10 10 14 14 7 18 11" />
                  <circle cx="19.5" cy="5.5" r="2.5" />
                  <line x1="21.3" y1="7.3" x2="23" y2="9" />
                </svg>
              </div>
              <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Device-Level Usage Rating</div>
              </div>
              <div className="w-[512px] max-w-[512px] flex flex-col justify-start items-start">
                <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Process real-time event streams from millions of individual eSIMs<br/>with sub-millisecond latency. Define custom rating rules per device<br/>type, region, or data behavior.</div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="self-stretch pt-8 flex flex-col justify-start items-start">
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                {["REAL-TIME", "ULTRA-LOW LATENCY"].map((tag) => (
                  <div key={tag} className="self-stretch px-2 py-1 bg-neutral-200 rounded-sm inline-flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">{tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Card 2: Pooled Allowances ── */}
          <div className="lg:col-span-4 px-8 pt-8 pb-24 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 backdrop-blur-[6px] inline-flex flex-col justify-start items-start">
            <div className="self-stretch pb-4 flex flex-col justify-start items-start">
              {/* Icon */}
              <div className="self-stretch flex flex-col justify-start items-start">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8 12 14 2 8 12 2" />
                  <polyline points="2 14 12 20 22 14" />
                </svg>
              </div>
            </div>
            <div className="self-stretch pb-2 flex flex-col justify-start items-start">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Pooled Allowances</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Aggregate data across entire fleets.<br/>Automatically rebalance quotas and<br/>optimize costs with intelligent predictive<br/>algorithms.</div>
            </div>
          </div>

          {/* ── Card 3: Fleet-Level Invoicing ── */}
          <div className="lg:col-span-4 p-8 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 backdrop-blur-[6px] inline-flex flex-col justify-start items-start">
            <div className="self-stretch pb-4 flex flex-col justify-start items-start">
              {/* Icon */}
              <div className="self-stretch flex flex-col justify-start items-start">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3f6212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                  <line x1="9" y1="15" x2="12" y2="15" />
                </svg>
              </div>
            </div>
            <div className="self-stretch pb-2 flex flex-col justify-start items-start">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Fleet-Level Invoicing</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Consolidate millions of micro-transactions<br/>into singular, clean enterprise invoices with<br/>full audit trails and tax compliance.</div>
            </div>
          </div>

          {/* ── Card 4: Global Connectivity Orchestration ── */}
          <div className="lg:col-span-8 px-8 pt-8 pb-14 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 backdrop-blur-[6px] inline-flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-start items-start gap-8">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                {/* Icon */}
                <div className="mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b82c9" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="2" />
                    <line x1="12" y1="4" x2="12" y2="10" />
                    <line x1="12" y1="14" x2="12" y2="20" />
                    <line x1="4" y1="12" x2="10" y2="12" />
                    <line x1="14" y1="12" x2="20" y2="12" />
                    <line x1="6.34" y1="6.34" x2="9.17" y2="9.17" />
                    <line x1="14.83" y1="14.83" x2="17.66" y2="17.66" />
                    <line x1="6.34" y1="17.66" x2="9.17" y2="14.83" />
                    <line x1="14.83" y1="9.17" x2="17.66" y2="6.34" />
                    <circle cx="12" cy="4" r="1.5" fill="#2b82c9" stroke="none" />
                    <circle cx="12" cy="20" r="1.5" fill="#2b82c9" stroke="none" />
                    <circle cx="4" cy="12" r="1.5" fill="#2b82c9" stroke="none" />
                    <circle cx="20" cy="12" r="1.5" fill="#2b82c9" stroke="none" />
                    <circle cx="6.34" cy="6.34" r="1.2" fill="#2b82c9" stroke="none" />
                    <circle cx="17.66" cy="17.66" r="1.2" fill="#2b82c9" stroke="none" />
                    <circle cx="6.34" cy="17.66" r="1.2" fill="#2b82c9" stroke="none" />
                    <circle cx="17.66" cy="6.34" r="1.2" fill="#2b82c9" stroke="none" />
                  </svg>
                </div>
                <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Global Connectivity Orchestration</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Switch carriers, update profiles, and manage connectivity<br/>profiles OTA (Over-The-Air) via a unified API gateway.</div>
                </div>
              </div>

              {/* Dark visual panel */}
              <div className="w-64 h-36 relative bg-gray-900 rounded-sm flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
