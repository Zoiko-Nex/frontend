import Image from "next/image";

const cards = [
  {
    icon: "/image/press/company.svg",
    title: "Company",
    desc: "ZoikoNex Sovereign Systems. Private infrastructure provider for Tier-1 Telecommunications globally.",
  },
  {
    icon: "/image/press/category.svg",
    title: "Category",
    desc: "BSS (Business Support Systems), Network Slicing, and sovereign carrier-grade monetization platforms.",
  },
  {
    icon: "/image/press/audience.svg",
    title: "Audience",
    desc: "National Carriers, Government Infrastructure Agencies, and Global Enterprise MSPs.",
  },
  {
    icon: "/image/press/zap.svg",
    title: "Differentiator",
    desc: "Mathematical precision in high-stakes BSS, offering complete data sovereignty and institutional reliability.",
  },
  {
    icon: "/image/press/help.svg",
    title: "Contact",
    desc: "press@zoikonex.systems | Response window: < 2 hours for accredited media.",
  },
  {
    icon: "/image/press/shield.svg",
    title: "Guardrails",
    desc: "Strict adherence to SLA disclosure protocols and sovereign data privacy mandates.",
  },
];

export default function PressRoomSnapshot() {
  return (
    <section className="bg-[#F8F9FA] py-16 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-start justify-center px-6 lg:px-8">

        {/* Title + underline */}
        <div className="mb-12 flex w-full flex-col items-start gap-3">
          <h2 className="text-3xl font-bold text-slate-800 lg:text-4xl" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Press Room Snapshot
          </h2>
          <div className="h-[3px] w-14 bg-[#20759E]" />
        </div>

        {/* 3×2 grid */}
        <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            return (
              <div
                key={card.title}
                className="flex flex-col items-start justify-start gap-3 border border-gray-200 bg-transparent p-6"
              >
                <div className="flex items-center justify-start gap-2.5">
                  <div className="flex h-5 items-center justify-center">
                    <img src={card.icon} alt={card.title} className="h-[18px] w-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {card.title}
                  </h3>
                </div>
                <p className="text-[14px] font-normal leading-[22px] text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}