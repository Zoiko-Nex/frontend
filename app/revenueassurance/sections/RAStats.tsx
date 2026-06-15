const stats = [
  { value: "$12B+", label: "Revenue Assured Annually", green: false },
  { value: "2.4%", label: "Average Revenue Lift", green: true },
  { value: "0ms", label: "Real-time Latency", green: false },
  { value: "100%", label: "Audit Compliance", green: true },
];

export default function RAStats() {
  return (
    <section className="bg-white py-[4.5rem] border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label, green }) => (
            <div key={label} className="text-left">
              <p
                className="font-extrabold leading-none mb-2.5"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  color: green ? "#5A8A1A" : "#111111",
                }}
              >
                {value}
              </p>
              <p className="text-[0.78rem] text-[#6B7280] tracking-[0.04em]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
