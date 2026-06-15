export default function RACoreModules() {
  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <h2
            className="font-extrabold text-[#0A0A0A] mb-2"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}
          >
            Core Integrity Modules
          </h2>
          <p className="text-[#6B7280] text-sm">
            Autonomous detection layered with institutional-grade workflow management.
          </p>
        </div>

        {/*
          Grid layout:
          ┌─────────────────────┬──────────────┬──────────────┐
          │ Bill-to-Payment     │ Fraud ML     │ Margin Anal. │
          │ (spans 2 rows)      ├──────────────┴──────────────┤
          │                     │ Automated Exception Wkflows  │
          └─────────────────────┴──────────────────────────────┘
        */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "auto auto",
          }}
        >

          {/* ── Card 1: Bill-to-Payment (row 1–2, col 1) ── */}
          <div
            className="bg-white rounded-xl border border-[#E5E7EB] p-8 flex flex-col"
            style={{ gridColumn: "1 / 2", gridRow: "1 / 3" }}
          >
            {/* Icon */}
            <div className="w-[46px] h-[46px] rounded-[10px] bg-[#EFF6FF] flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="3" stroke="#2D7DB3" strokeWidth="1.5" />
                <path d="M5 8h12M5 12h8M5 16h6" stroke="#2D7DB3" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>

            <h3 className="font-bold text-[1.05rem] text-[#0A0A0A] mb-3">
              Bill-to-Payment Reconciliation
            </h3>
            <p className="text-[#6B7280] text-[0.85rem] leading-7 mb-6">
              Automated end-to-end reconciliation between BSS journals and financial
              ledgers. Identifies unapplied credits and payment slippage in real-time.
            </p>

            {/* Bullets */}
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {["High-volume transaction matching", "Discrepancy aging alerts"].map((b) => (
                <li key={b} className="flex items-center gap-2 text-[0.8rem] text-[#5B6575]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#3A8A3A" strokeWidth="1.2" />
                    <path d="M5 8l2.5 2.5 3.5-3.5" stroke="#3A8A3A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 2: Fraud Detection ML (row 1, col 2) ── */}
          <div
            className="bg-white rounded-xl border border-[#E5E7EB] p-8"
            style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}
          >
            <div className="w-[46px] h-[46px] rounded-[10px] bg-[#FEF2F2] flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2l8 3.5v6c0 4.5-3.5 8.5-8 10-4.5-1.5-8-5.5-8-10v-6L11 2z"
                  stroke="#D73434" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 11l2.5 2.5 3.5-3.5" stroke="#D73434" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-[1.05rem] text-[#0A0A0A] mb-3">
              Fraud Detection ML
            </h3>
            <p className="text-[#6B7280] text-[0.85rem] leading-7">
              Neural network pattern recognition for roaming bypass, IRSF, and subscription fraud.
            </p>
          </div>

          {/* ── Card 3: Margin Analytics (row 1, col 3) ── */}
          <div
            className="bg-white rounded-xl border border-[#E5E7EB] p-8"
            style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}
          >
            <div className="w-[46px] h-[46px] rounded-[10px] bg-[#F0FDF4] flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="3" stroke="#3A8A3A" strokeWidth="1.5" />
                <path d="M5 16l4-6 4 4 4-8" stroke="#3A8A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-bold text-[1.05rem] text-[#0A0A0A] mb-3">
              Margin Analytics
            </h3>
            <p className="text-[#6B7280] text-[0.85rem] leading-7">
              Dynamic cost-per-minute vs. price-per-minute analysis to prevent negative margin traffic.
            </p>
          </div>

          {/* ── Card 4: Automated Exception Workflows (row 2, col 2–3) ── */}
          <div
            className="bg-[#0E0E18] rounded-xl p-8 px-9 flex justify-between items-center gap-8 flex-wrap"
            style={{ gridColumn: "2 / 4", gridRow: "2 / 3" }}
          >
            <div className="max-w-[58%]">
              <h3 className="text-white font-bold text-[1.05rem] mb-3">
                Automated Exception Workflows
              </h3>
              <p className="text-[#6B7280] text-[0.82rem] leading-7">
                Bridge the gap between detection and resolution with pre-defined SOX-compliant escalation
                paths. Automatically ticket anomalies to billing or engineering teams with forensic attachment logs.
              </p>
            </div>

            {/* Avatar stack + label */}
            <div className="flex items-center gap-3.5 flex-shrink-0">
              <div className="flex">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-[#2A2E42] border-2 border-[#0E0E18] flex items-center justify-center"
                    style={{ marginLeft: i > 0 ? "-10px" : 0 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="5" r="2.5" stroke="#8892A4" strokeWidth="1.1" />
                      <path d="M1.5 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#8892A4" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                  </div>
                ))}
              </div>
              <span className="text-[#6B7280] text-[0.78rem] whitespace-nowrap">
                Trusted by 45+ Tier-1 Operators
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
