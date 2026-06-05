const cards = [
  {
    number: "01",
    title: "Governance as Infrastructure",
    desc: "In ZoikoNex, control is not bolted on after design; it is embedded in the operating model itself. Approval workflows, RBAC/ABAC controls, and policy versioning are structural — not operational add-ons.",
  },
  {
    number: "02",
    title: "Compliance by Default",
    desc: "Transactions, invoices, access decisions, and exportable records are designed to be jurisdiction-aware, reviewable, and auditable. Compliance is built into the data model — not layered over it.",
  },
  {
    number: "03",
    title: "Global by Architecture",
    desc: "The platform is designed to support operators across North America, Europe, Africa, Asia, and the Caribbean without rebuilding the billing stack for every market. Jurisdiction packs activate at runtime.",
  },
  {
    number: "04",
    title: "Multi-Operator by Design",
    desc: "ZoikoNex supports multi-brand, reseller, and multi-tenant operating models within a governed platform boundary. Ecosystem readiness includes MVNOs, MVNAs, payment providers, tax engines, ILD providers, and protection ecosystems.",
  },
];

export default function EmbeddedControl() {
  return (
    <section className="bg-[#FBFCFE] py-[48px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-[1152px] px-6">
        <div className="mb-[36px] text-center">
          <p className="mb-[12px] text-[11px] font-bold uppercase tracking-[3px] text-[#2F8A13]">
            What Makes ZoikoNex Category-Defining
          </p>
          <h2 className="mx-auto max-w-[740px] text-[38px] font-extrabold leading-[1.1] text-[#1C1D31]">
            Control is not bolted on it is embedded in the operating model.
          </h2>
        </div>

        <div className="grid gap-[20px] md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.number}
              className="min-h-[198px] rounded-[24px] border border-[#DDE7F0] bg-white px-[32px] pb-[28px] pt-[31px]"
            >
              <p className="mb-[18px] text-[11px] font-bold tracking-[0.2px] text-[#94A7BA]">
                {card.number}
              </p>
              <h3 className="mb-[11px] text-[19px] font-extrabold leading-[1.3] text-[#1C1D31]">
                {card.title}
              </h3>
              <p className="text-[14.5px] leading-[1.55] text-[#60728C]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
