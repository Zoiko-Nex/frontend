"use client";

export default function EngineeredForScale() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center max-w-[42rem] mx-auto mb-14">
          <h2
            className="text-[#0f1a2e] font-bold tracking-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
          >
            Engineered for Global Scale
          </h2>
          <p className="text-slate-500 text-[0.95rem] leading-7">
            The ZoikoNex BSS platform provides the granular control needed to manage massive
            device volumes without operational overhead.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* ── Card 1: Device-Level Usage Rating ── */}
          <div className="border border-slate-200 rounded-[14px] p-8 bg-white shadow-sm">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-6"
              style={{
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2 16 6 10 10 14 14 7 18 11" />
                <circle cx="19.5" cy="5.5" r="2.5" />
                <line x1="21.3" y1="7.3" x2="23" y2="9" />
              </svg>
            </div>
            <h3 className="text-[#0f1a2e] font-bold text-[1.05rem] mb-3">
              Device-Level Usage Rating
            </h3>
            <p className="text-slate-500 text-sm leading-7 mb-7">
              Process real-time event streams from millions of individual eSIMs with sub-millisecond
              latency. Define custom rating rules per device type, region, or data behavior.
            </p>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {["REAL-TIME", "ULTRA-LOW LATENCY"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[0.6rem] font-mono tracking-[0.08em] font-semibold text-slate-700 border border-slate-300 rounded bg-slate-50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Card 2: Pooled Allowances ── */}
          <div className="border border-slate-200 rounded-[14px] p-8 bg-white shadow-sm">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-6"
              style={{
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8 12 14 2 8 12 2" />
                <polyline points="2 14 12 20 22 14" />
              </svg>
            </div>
            <h3 className="text-[#0f1a2e] font-bold text-[1.05rem] mb-3">
              Pooled Allowances
            </h3>
            <p className="text-slate-500 text-sm leading-7">
              Aggregate data across entire fleets. Automatically rebalance quotas and optimize costs
              with intelligent predictive algorithms.
            </p>
          </div>

          {/* ── Card 3: Fleet-Level Invoicing ── */}
          <div className="border border-slate-200 rounded-[14px] p-8 bg-white shadow-sm">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-6"
              style={{
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
                <line x1="9" y1="15" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="text-[#0f1a2e] font-bold text-[1.05rem] mb-3">
              Fleet-Level Invoicing
            </h3>
            <p className="text-slate-500 text-sm leading-7">
              Consolidate millions of micro-transactions into singular, clean enterprise invoices with
              full audit trails and tax compliance.
            </p>
          </div>

          {/* ── Card 4: Global Connectivity Orchestration ── */}
          <div className="border border-slate-200 rounded-[14px] p-8 bg-white shadow-sm flex gap-6 items-start">
            <div className="flex-1">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-6"
                style={{
                  border: "1px solid rgba(43,126,193,0.35)",
                  backgroundColor: "rgba(43,126,193,0.09)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B7EC1" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="2" />
                  <line x1="12" y1="4"  x2="12" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="20" />
                  <line x1="4"  y1="12" x2="10" y2="12" />
                  <line x1="14" y1="12" x2="20" y2="12" />
                  <line x1="6.34"  y1="6.34"  x2="9.17"  y2="9.17"  />
                  <line x1="14.83" y1="14.83" x2="17.66" y2="17.66" />
                  <line x1="6.34"  y1="17.66" x2="9.17"  y2="14.83" />
                  <line x1="14.83" y1="9.17"  x2="17.66" y2="6.34"  />
                  <circle cx="12" cy="4"  r="1.5" fill="#2B7EC1" stroke="none" />
                  <circle cx="12" cy="20" r="1.5" fill="#2B7EC1" stroke="none" />
                  <circle cx="4"  cy="12" r="1.5" fill="#2B7EC1" stroke="none" />
                  <circle cx="20" cy="12" r="1.5" fill="#2B7EC1" stroke="none" />
                  <circle cx="6.34"  cy="6.34"  r="1.2" fill="#2B7EC1" stroke="none" />
                  <circle cx="17.66" cy="17.66" r="1.2" fill="#2B7EC1" stroke="none" />
                  <circle cx="6.34"  cy="17.66" r="1.2" fill="#2B7EC1" stroke="none" />
                  <circle cx="17.66" cy="6.34"  r="1.2" fill="#2B7EC1" stroke="none" />
                </svg>
              </div>
              <h3 className="text-[#0f1a2e] font-bold text-[1.05rem] mb-3">
                Global Connectivity Orchestration
              </h3>
              <p className="text-slate-500 text-sm leading-7">
                Switch carriers, update profiles, and manage connectivity profiles OTA
                (Over-The-Air) via a unified API gateway.
              </p>
            </div>

            {/* Dark visual panel */}
            <div
              className="flex-shrink-0 w-[115px] bg-[#0f1a2e] rounded-[10px] p-3.5 flex flex-col gap-2 self-center"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {["US-WEST", "EU-CENT", "AP-EAST"].map((region) => (
                <div key={region} className="flex items-center gap-1.5">
                  <span
                    className="animate-pulse w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                    style={{ backgroundColor: "#6DC02F" }}
                  />
                  <span className="text-[0.55rem] font-mono text-slate-400">{region}</span>
                </div>
              ))}
              <div
                className="mt-1 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-[0.55rem] font-mono text-[#6DC02F]">OTA SYNC</p>
                <p className="text-[0.7rem] font-bold text-white mt-0.5">140+ MNO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
