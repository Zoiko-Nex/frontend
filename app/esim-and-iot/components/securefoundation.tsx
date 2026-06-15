"use client";

export default function SecureFoundationCTA() {
  return (
    <section
      style={{
        backgroundColor: "#f0f3f7",
        padding: "6rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Heading */}
        <h2
          style={{
            color: "#2B7EC1",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
            lineHeight: 1.25,
            marginBottom: "1.25rem",
          }}
        >
          Secure the Foundation of Your Fleet.
        </h2>

        {/* Subtext */}
        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            lineHeight: 1.8,
            maxWidth: "36rem",
            marginBottom: "2.5rem",
          }}
        >
          Join the world&apos;s leading connectivity providers using ZoikoNex to orchestrate
          and monetize global IoT infrastructure.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#153d60";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a4e7a";
            }}
            style={{
              padding: "0.85rem 2rem",
              backgroundColor: "#1a4e7a",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              boxShadow: "0 2px 8px rgba(26,78,122,0.3)",
            }}
          >
            Request a Demo
          </button>
          <button
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
            }}
            style={{
              padding: "0.85rem 2rem",
              backgroundColor: "#ffffff",
              color: "#1a4e7a",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            Contact Sales Engineering
          </button>
        </div>
      </div>
    </section>
  );
}
