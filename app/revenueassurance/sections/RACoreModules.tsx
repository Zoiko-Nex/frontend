export default function RACoreModules() {
  return (
    <section style={{ backgroundColor: "#F5F5F5", padding: "5rem 0" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 800,
            color: "#0A0A0A",
            marginBottom: "0.5rem",
          }}>
            Core Integrity Modules
          </h2>
          <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
            Autonomous detection layered with institutional-grade workflow management.
          </p>
        </div>

        {/*
          Grid layout (matches reference image):
          ┌─────────────────────┬──────────────┬──────────────┐
          │ Bill-to-Payment     │ Fraud ML     │ Margin Anal. │
          │ (spans 2 rows)      ├──────────────┴──────────────┤
          │                     │ Automated Exception Wkflows  │
          └─────────────────────┴──────────────────────────────┘
        */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "1.25rem",
        }}>

          {/* ── Card 1: Bill-to-Payment (row 1–2, col 1) ── */}
          <div style={{
            gridColumn: "1 / 2",
            gridRow: "1 / 3",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Icon */}
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              backgroundColor: "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="3" stroke="#2D7DB3" strokeWidth="1.5" />
                <path d="M5 8h12M5 12h8M5 16h6" stroke="#2D7DB3" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0A0A0A", marginBottom: "0.8rem" }}>
              Bill-to-Payment Reconciliation
            </h3>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Automated end-to-end reconciliation between BSS journals and financial
              ledgers. Identifies unapplied credits and payment slippage in real-time.
            </p>

            {/* Bullets */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {["High-volume transaction matching", "Discrepancy aging alerts"].map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#5B6575" }}>
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
          <div style={{
            gridColumn: "2 / 3",
            gridRow: "1 / 2",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            padding: "2rem",
          }}>
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              backgroundColor: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2l8 3.5v6c0 4.5-3.5 8.5-8 10-4.5-1.5-8-5.5-8-10v-6L11 2z"
                  stroke="#D73434" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 11l2.5 2.5 3.5-3.5" stroke="#D73434" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0A0A0A", marginBottom: "0.8rem" }}>
              Fraud Detection ML
            </h3>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", lineHeight: 1.75 }}>
              Neural network pattern recognition for roaming bypass, IRSF, and subscription fraud.
            </p>
          </div>

          {/* ── Card 3: Margin Analytics (row 1, col 3) ── */}
          <div style={{
            gridColumn: "3 / 4",
            gridRow: "1 / 2",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            padding: "2rem",
          }}>
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "10px",
              backgroundColor: "#F0FDF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="18" height="18" rx="3" stroke="#3A8A3A" strokeWidth="1.5" />
                <path d="M5 16l4-6 4 4 4-8" stroke="#3A8A3A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0A0A0A", marginBottom: "0.8rem" }}>
              Margin Analytics
            </h3>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", lineHeight: 1.75 }}>
              Dynamic cost-per-minute vs. price-per-minute analysis to prevent negative margin traffic.
            </p>
          </div>

          {/* ── Card 4: Automated Exception Workflows (row 2, col 2–3) ── */}
          <div style={{
            gridColumn: "2 / 4",
            gridRow: "2 / 3",
            backgroundColor: "#0E0E18",
            borderRadius: "12px",
            padding: "2rem 2.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}>
            <div style={{ maxWidth: "58%" }}>
              <h3 style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem" }}>
                Automated Exception Workflows
              </h3>
              <p style={{ color: "#6B7280", fontSize: "0.82rem", lineHeight: 1.75 }}>
                Bridge the gap between detection and resolution with pre-defined SOX-compliant escalation
                paths. Automatically ticket anomalies to billing or engineering teams with forensic attachment logs.
              </p>
            </div>

            {/* Avatar stack + label */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexShrink: 0 }}>
              <div style={{ display: "flex" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#2A2E42",
                    border: "2px solid #0E0E18",
                    marginLeft: i > 0 ? "-10px" : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="5" r="2.5" stroke="#8892A4" strokeWidth="1.1" />
                      <path d="M1.5 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#8892A4" strokeWidth="1.1" strokeLinecap="round" />
                    </svg>
                  </div>
                ))}
              </div>
              <span style={{ color: "#6B7280", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                Trusted by 45+ Tier-1 Operators
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
