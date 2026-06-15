const stats = [
  { value: "$12B+", label: "Revenue Assured Annually", green: false },
  { value: "2.4%", label: "Average Revenue Lift", green: true },
  { value: "0ms", label: "Real-time Latency", green: false },
  { value: "100%", label: "Audit Compliance", green: true },
];

export default function RAStats() {
  return (
    <section style={{ backgroundColor: "#ffffff", padding: "4.5rem 0", borderBottom: "1px solid #EBEBEB" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
        }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {stats.map(({ value, label, green }) => (
            <div key={label} style={{ textAlign: "left" }}>
              <p style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: green ? "#5A8A1A" : "#111111",
                lineHeight: 1,
                marginBottom: "0.6rem",
              }}>
                {value}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#6B7280", letterSpacing: "0.04em" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
