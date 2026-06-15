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
    /* Outer bg — light pink/mauve exactly as in the design */
    <section style={{ backgroundColor: "#EDE9EE", padding: "5rem 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}>

          {/* Card header */}
          <div style={{ padding: "1.75rem 2.5rem", borderBottom: "1px solid #F0F0F0" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111" }}>
              Sovereign Control vs. Legacy Systems
            </h2>
          </div>

          {/* Column header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}>
            {/* Left header — light pink/gray tint */}
            <div style={{
              padding: "0.75rem 2.5rem",
              backgroundColor: "#F5F3F4",
              borderBottom: "1px solid #EBEBEB",
              borderRight: "1px solid #EBEBEB",
            }}>
              <span style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "#9CA3AF",
                textTransform: "uppercase",
              }}>
                Legacy Revenue Assurance
              </span>
            </div>

            {/* Right header — light green tint */}
            <div style={{
              padding: "0.75rem 2.5rem",
              backgroundColor: "#F2FAE8",
              borderBottom: "1px solid #EBEBEB",
            }}>
              <span style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "#6A9A1A",
                textTransform: "uppercase",
              }}>
                Zoikonex BSS-Native
              </span>
            </div>
          </div>

          {/* Data rows */}
          {legacyItems.map((legacy, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: i < legacyItems.length - 1 ? "1px solid #F0F0F0" : "none",
            }}>
              {/* Left cell — white */}
              <div style={{
                padding: "1.3rem 2.5rem",
                borderRight: "1px solid #F0F0F0",
                backgroundColor: "#ffffff",
              }}>
                <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>{legacy}</span>
              </div>

              {/* Right cell — very light green tint */}
              <div style={{
                padding: "1.3rem 2.5rem",
                backgroundColor: "#F9FDF0",
              }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111111" }}>
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
