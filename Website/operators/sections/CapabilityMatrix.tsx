"use client";

type Badge = "CORE" | "ENHANCED" | "OPTIONAL" | "N/A";

interface CapabilityRow {
  capability: string;
  mno: Badge;
  mvno: Badge;
  iot: Badge;
  enterprise: Badge;
}

const capabilities: CapabilityRow[] = [
  {
    capability: "Convergent Catalog",
    mno: "CORE",
    mvno: "CORE",
    iot: "CORE",
    enterprise: "CORE",
  },
  {
    capability: "Real-time OCS/CCS",
    mno: "CORE",
    mvno: "CORE",
    iot: "ENHANCED",
    enterprise: "OPTIONAL",
  },
  {
    capability: "Multi-Tenancy Hierarchy",
    mno: "OPTIONAL",
    mvno: "CORE",
    iot: "CORE",
    enterprise: "CORE",
  },
  {
    capability: "5G Network Slicing",
    mno: "CORE",
    mvno: "OPTIONAL",
    iot: "ENHANCED",
    enterprise: "N/A",
  },
];

const badgeStyles: Record<Badge, { bg: string; text: string; border?: string }> = {
  CORE: { bg: "bg-lime-300/20", text: "text-lime-800" },
  ENHANCED: { bg: "bg-sky-600/10", text: "text-sky-600" },
  OPTIONAL: {
    bg: "bg-transparent",
    text: "text-zinc-900",
    border: "outline outline-1 outline-offset-[-1px] outline-zinc-500",
  },
  "N/A": {
    bg: "bg-transparent",
    text: "text-zinc-900",
    border: "outline outline-1 outline-offset-[-1px] outline-zinc-500",
  },
};

function Badge({ value }: { value: Badge }) {
  const s = badgeStyles[value];
  return (
    <span
      className={`px-2 py-0.5 rounded-xs text-[10px] inline-flex items-center ${s.bg} ${s.text} ${s.border ?? ""}`}
      style={{ fontFamily: "'Liberation Mono', monospace" }}
    >
      {value}
    </span>
  );
}

export default function CapabilityMatrix() {
  const cols = ["MNO", "MVNO/E", "IOT", "ENTERPRISE"];
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-zinc-900 text-xl font-normal leading-7"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Capability Matrix
            </h2>
            <p
              className="text-zinc-700 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A technical breakdown of ZoikoNex functionality across operator
              archetypes.
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left px-0 py-4 w-80">
                    <span
                      className="text-zinc-700 text-[10px] font-bold tracking-widest uppercase"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      CAPABILITY
                    </span>
                  </th>
                  {cols.map((col) => (
                    <th key={col} className="text-left px-4 py-4 w-48">
                      <span
                        className="text-zinc-700 text-[10px] font-bold tracking-widest uppercase"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {col}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {capabilities.map((row, i) => (
                  <tr
                    key={row.capability}
                    className={`border-b border-stone-300/30 ${i % 2 === 0 ? "bg-transparent" : "bg-stone-50/40"}`}
                  >
                    <td className="px-0 py-5">
                      <span
                        className="text-zinc-900 text-sm font-bold leading-5"
                        style={{ fontFamily: "'Liberation Mono', monospace" }}
                      >
                        {row.capability}
                      </span>
                    </td>
                    {(["mno", "mvno", "iot", "enterprise"] as const).map(
                      (key) => (
                        <td key={key} className="px-4 py-5">
                          <Badge value={row[key]} />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
