const stats = [
  {
    value: "6+",
    description: "Global regions supported with runtime jurisdiction packs",
    bg: "#F1F8FE",
    valueColor: "#2B83C6",
  },
  {
    value: "18",
    description: "Unified domains across the full telecom monetization stack",
    bg: "#F1FAEA",
    valueColor: "#80C944",
  },
  {
    value: "GTMI",
    description: "New category: Governed Telecom Monetization Infrastructure",
    bg: "#F1F8FE",
    valueColor: "#2B83C6",
  },
  {
    value: "4",
    description: "Deployment models from shared SaaS to sovereign",
    bg: "#F1FAEA",
    valueColor: "#80C944",
  },
];

export default function TelecomFuture() {
  return (
    <section className="bg-white py-[96px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto grid max-w-[1152px] gap-12 px-6 lg:grid-cols-[540px_536px] lg:justify-between">
        <div>
          <p className="mb-[20px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            Who We Are
          </p>

          <h2 className="max-w-[520px] text-[38px] font-extrabold leading-[1.1] text-[#1C1D31]">
            Built for an era where telecom is programmable by default
          </h2>

          <p className="mt-[24px] max-w-[530px] text-[17px] leading-[1.76] text-[#4E5E73]">
            ZoikoNex, developed by Zoiko Tech, is the infrastructure layer powering the next
            generation of telecom operators. It is built for a market in which connectivity is
            no longer confined to traditional mobile plans and static billing cycles.
          </p>

          <p className="mt-[22px] max-w-[530px] text-[15.5px] leading-[1.66] text-[#4E5E73]">
            Telecom is becoming programmable, embedded, API-driven, and increasingly global by
            default. Operators therefore need infrastructure that can manage charging, billing,
            lifecycle control, compliance, payments, and evidence in one governed environment.
          </p>

          <p className="mt-[22px] max-w-[530px] text-[15.5px] leading-[1.66] text-[#4E5E73]">
            ZoikoNex is not an upgrade to legacy BSS. It is the system that replaces legacy
            constraints with real-time monetization, operational control, and global readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:mt-[42px]">
          {stats.map((card) => (
            <div
              key={card.value}
              className="flex h-[196px] flex-col items-center justify-center rounded-[20px] border border-[#DDE7F0] px-6 text-center"
              style={{ backgroundColor: card.bg }}
            >
              <div
                className="mb-[8px] text-[36px] font-extrabold leading-none"
                style={{
                  color: card.valueColor,
                  fontSize: card.value === "GTMI" ? "30px" : "36px",
                }}
              >
                {card.value}
              </div>
              <p className="max-w-[210px] text-[13.5px] font-medium leading-[1.38] text-[#60728C]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
