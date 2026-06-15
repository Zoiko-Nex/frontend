"use client";

export default function EngineeredForScale() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "5rem 0" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div style={{ textAlign: "center", maxWidth: "42rem", margin: "0 auto 3.5rem" }}>
          <h2
            style={{
              color: "#0f1a2e",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 3.5vw, 2.6rem)",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Engineered for Global Scale
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The ZoikoNex BSS platform provides the granular control needed to manage massive
            device volumes without operational overhead.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
        >
          {/* ── Card 1: Device-Level Usage Rating ── */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Icon: analytics squiggle + magnifier */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="2 16 6 10 10 14 14 7 18 11" />
                <circle cx="19.5" cy="5.5" r="2.5" />
                <line x1="21.3" y1="7.3" x2="23" y2="9" />
              </svg>
            </div>
            <h3 style={{ color: "#0f1a2e", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem" }}>
              Device-Level Usage Rating
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.75rem" }}>
              Process real-time event streams from millions of individual eSIMs with sub-millisecond
              latency. Define custom rating rules per device type, region, or data behavior.
            </p>
            {/* Tags */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["REAL-TIME", "ULTRA-LOW LATENCY"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "0.25rem 0.65rem",
                    fontSize: "0.6rem",
                    fontFamily: "monospace",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    borderRadius: "4px",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Card 2: Pooled Allowances ── */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Icon: stacked layers / diamonds */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8 12 14 2 8 12 2" />
                <polyline points="2 14 12 20 22 14" />
              </svg>
            </div>
            <h3 style={{ color: "#0f1a2e", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem" }}>
              Pooled Allowances
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75 }}>
              Aggregate data across entire fleets. Automatically rebalance quotas and optimize costs
              with intelligent predictive algorithms.
            </p>
          </div>

          {/* ── Card 3: Fleet-Level Invoicing ── */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* Icon: receipt / document list */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                border: "1px solid rgba(109,192,47,0.35)",
                backgroundColor: "rgba(109,192,47,0.09)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6DC02F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="9" y1="11" x2="15" y2="11" />
                <line x1="9" y1="15" x2="12" y2="15" />
              </svg>
            </div>
            <h3 style={{ color: "#0f1a2e", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem" }}>
              Fleet-Level Invoicing
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75 }}>
              Consolidate millions of micro-transactions into singular, clean enterprise invoices with
              full audit trails and tax compliance.
            </p>
          </div>

          {/* ── Card 4: Global Connectivity Orchestration ── */}
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "2rem",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              display: "flex",
              gap: "1.5rem",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 1 }}>
              {/* Icon: hub / asterisk */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  border: "1px solid rgba(43,126,193,0.35)",
                  backgroundColor: "rgba(43,126,193,0.09)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2B7EC1" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="2" />
                  {/* 6 spokes like a hub */}
                  <line x1="12" y1="4"  x2="12" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="20" />
                  <line x1="4"  y1="12" x2="10" y2="12" />
                  <line x1="14" y1="12" x2="20" y2="12" />
                  <line x1="6.34"  y1="6.34"  x2="9.17"  y2="9.17"  />
                  <line x1="14.83" y1="14.83" x2="17.66" y2="17.66" />
                  <line x1="6.34"  y1="17.66" x2="9.17"  y2="14.83" />
                  <line x1="14.83" y1="9.17"  x2="17.66" y2="6.34"  />
                  {/* Endpoint dots */}
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
              <h3 style={{ color: "#0f1a2e", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem" }}>
                Global Connectivity Orchestration
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.75 }}>
                Switch carriers, update profiles, and manage connectivity profiles OTA
                (Over-The-Air) via a unified API gateway.
              </p>
            </div>

            {/* Dark visual panel */}
            <div
              style={{
                flexShrink: 0,
                width: "115px",
                backgroundColor: "#0f1a2e",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignSelf: "center",
              }}
            >
              {["US-WEST", "EU-CENT", "AP-EAST"].map((region) => (
                <div key={region} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span
                    className="animate-pulse"
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#6DC02F",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.55rem", fontFamily: "monospace", color: "#94a3b8" }}>
                    {region}
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  marginTop: "0.25rem",
                  paddingTop: "0.5rem",
                }}
              >
                <p style={{ fontSize: "0.55rem", fontFamily: "monospace", color: "#6DC02F" }}>OTA SYNC</p>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ffffff", marginTop: "0.15rem" }}>
                  140+ MNO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
