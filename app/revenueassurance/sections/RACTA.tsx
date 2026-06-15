export default function RACTA() {
  return (
    <section style={{ backgroundColor: "#10101D", padding: "7rem 0" }}>
      <div className="max-w-5xl mx-auto px-6" style={{ textAlign: "center" }}>

        <h2 style={{
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 3rem)",
          lineHeight: 1.15,
          marginBottom: "1.25rem",
        }}>
          Ready to seal your revenue leaks?
        </h2>

        <p style={{
          color: "#6B7280",
          fontSize: "0.95rem",
          lineHeight: 1.75,
          maxWidth: "36rem",
          margin: "0 auto 2.75rem",
        }}>
          Deploy our lightweight audit engine in your environment and get a comprehensive leakage
          report within 72 hours.
        </p>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}>
          <button style={{
            backgroundColor: "#2D7DB3",
            color: "#ffffff",
            padding: "0.9rem 2rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
            Assure Your Revenue
          </button>

          <button style={{
            backgroundColor: "transparent",
            border: "1.5px solid #3A4456",
            color: "#ffffff",
            padding: "0.9rem 2rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
            Talk to an Auditor
          </button>
        </div>

      </div>
    </section>
  );
}
