export default function RAHero() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "5rem 0 5rem" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5rem",
          alignItems: "center",
        }}>

          {/* ── Left column ── */}
          <div>
            {/* Badge */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{
                display: "inline-block",
                border: "1.5px solid #2D7DB3",
                color: "#2D7DB3",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.3rem 0.75rem",
                borderRadius: "4px",
              }}>
                Revenue Assurance V4.0
              </span>
            </div>

            {/* Heading */}
            <h1 style={{
              color: "#0A0A0A",
              fontWeight: 800,
              fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}>
              Zero Leakage.<br />Total Assurance.
            </h1>

            {/* Body */}
            <p style={{
              color: "#5E6B7A",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              marginBottom: "2.25rem",
              maxWidth: "32rem",
            }}>
              Detect and recover revenue gaps across usage, rating, billing, and
              settlement with evidence-grade precision. Our BSS-native engine
              ensures no bit goes unbilled.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <button style={{
                backgroundColor: "#1F6FA3",
                color: "#ffffff",
                padding: "0.8rem 1.6rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}>
                Assure Your Revenue
              </button>
              <button style={{
                backgroundColor: "transparent",
                border: "1.5px solid #1A2533",
                color: "#1A2533",
                padding: "0.8rem 1.6rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}>
                Request a Technical Audit
              </button>
            </div>
          </div>

          {/* ── Right column — monitoring card ── */}
          <div style={{
            backgroundColor: "#F7F9FC",
            border: "1px solid #DDE4EE",
            borderRadius: "14px",
            padding: "1.75rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}>

            {/* Card header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <span style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#3A4556",
                letterSpacing: "0.02em",
              }}>
                Live Leakage Monitoring
              </span>
              {/* Signal/wifi icon */}
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M1 5c2.2-2.7 5.4-4 8-4s5.8 1.3 8 4" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M3.5 8C5 6.2 6.9 5 9 5s4 1.2 5.5 3" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M6 11c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="9" cy="13" r="1" fill="#94A3B8" />
              </svg>
            </div>

            {/* CDR Validation row */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid #E8EDF4",
              borderRadius: "8px",
              padding: "1rem 1.25rem",
              marginBottom: "1.25rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                {/* Icon */}
                <div style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "7px",
                  backgroundColor: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2" width="14" height="12" rx="2" stroke="#2D7DB3" strokeWidth="1.3" />
                    <path d="M4 6h8M4 9h5" stroke="#2D7DB3" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#4B5563", fontWeight: 500 }}>
                      CDR Validation: 99.999%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: "5px", backgroundColor: "#E5EAF0", borderRadius: "99px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: "99.999%",
                      backgroundColor: "#2D7DB3",
                      borderRadius: "99px",
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}>
              <div style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E8EDF4",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
              }}>
                <p style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  Recovery
                </p>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0A0A0A" }}>$4.2M</p>
              </div>
              <div style={{
                backgroundColor: "#ffffff",
                border: "1px solid #E8EDF4",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
              }}>
                <p style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                  Risk Score
                </p>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2D7DB3" }}>L1</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
