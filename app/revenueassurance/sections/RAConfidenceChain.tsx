const steps = [
  {
    title: "Data Ingestion",
    description: "Capture CDRs, xDRs, and logs from 300+ protocol adapters.",
    active: false,
    icon: (
      /* Import/login style — arrow pointing right into a panel */
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="3" y="4" width="14" height="18" rx="2" stroke="#C8F252" strokeWidth="1.5" />
        <path d="M17 13h6M19 10l4 3-4 3" stroke="#C8F252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Cross-Reference",
    description: "Multi-point validation against network, rating, and billing engines.",
    active: false,
    icon: (
      /* Cross-reference: two horizontal bars with a single diagonal slash (≠ not-equals style) */
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        {/* Top bar */}
        <path d="M6 9h14" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
        {/* Bottom bar */}
        <path d="M6 17h14" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
        {/* Single diagonal slash — left to right through both bars */}
        <path d="M16 6L10 20" stroke="#C8F252" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Anomaly Scoring",
    description: "ML-driven categorization of leaks by dollar impact and root cause.",
    active: false,
    icon: (
      /* Warning triangle with exclamation */
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 4L24 22H2L13 4z" stroke="#C8F252" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13 11v5" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="13" cy="19" r="0.8" fill="#C8F252" />
      </svg>
    ),
  },
  {
    title: "ACR Closure",
    description: "Automated Corrective Reporting and balance ledger finalization.",
    active: true,
    icon: (
      /* Circle with checkmark — on solid green bg */
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="#0E0E18" strokeWidth="1.5" />
        <path d="M9 13l3 3 5-5" stroke="#0E0E18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function RAConfidenceChain() {
  return (
    <section style={{ backgroundColor: "#10101D", padding: "6rem 0" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header — centered */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <h2 style={{
            color: "#ffffff",
            fontSize: "clamp(1.75rem, 3vw, 2.6rem)",
            fontWeight: 700,
            marginBottom: "1rem",
          }}>
            The Revenue Confidence Chain
          </h2>
          <p style={{
            color: "#6B7280",
            fontSize: "0.9rem",
            maxWidth: "38rem",
            margin: "0 auto",
            lineHeight: 1.75,
          }}>
            From raw network events to financial closure, we maintain a cryptographic
            audit trail for every dollar earned.
          </p>
        </div>

        {/* Steps row */}
        <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "0" }}>

          {steps.map(({ title, description, active, icon }, i) => (
            <div key={title} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative" }}>

              {/* Icon box + connector line */}
              <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "2rem" }}>

                {/* Icon box */}
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "12px",
                  flexShrink: 0,
                  backgroundColor: active ? "#6EC44A" : "#1A1D2E",
                  border: active ? "none" : "1.5px solid #C8F252",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {icon}
                </div>

                {/* Connector line (after each box except the last) */}
                {i < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "#2A2E42",
                    marginLeft: "0",
                  }} />
                )}
              </div>

              {/* Text */}
              <h3 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                {title}
              </h3>
              <p style={{ color: "#6B7280", fontSize: "0.82rem", lineHeight: 1.65, paddingRight: "1.5rem" }}>
                {description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
