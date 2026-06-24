import { LayoutList, GitBranch, Users2, Zap, HelpCircle, ShieldCheck } from "lucide-react";

const cards = [
  {
    Icon: LayoutList,
    title: "Company",
    desc: "ZoikoNex Sovereign Systems. Private infrastructure provider for Tier-1 Telecommunications globally.",
  },
  {
    Icon: GitBranch,
    title: "Category",
    desc: "BSS (Business Support Systems), Network Slicing, and sovereign carrier-grade monetization platforms.",
  },
  {
    Icon: Users2,
    title: "Audience",
    desc: "National Carriers, Government Infrastructure Agencies, and Global Enterprise MSPs.",
  },
  {
    Icon: Zap,
    title: "Differentiator",
    desc: "Mathematical precision in high-stakes BSS, offering complete data sovereignty and institutional reliability.",
  },
  {
    Icon: HelpCircle,
    title: "Contact",
    desc: "press@zoikonex.systems | Response window: < 2 hours for accredited media.",
  },
  {
    Icon: ShieldCheck,
    title: "Guardrails",
    desc: "Strict adherence to SLA disclosure protocols and sovereign data privacy mandates.",
  },
];

export default function PressRoomSnapshot() {
  return (
    <section className="bg-white py-12 font-['Plus_Jakarta_Sans',sans-serif] lg:py-20">
      <div className="mx-auto max-w-275 px-4 sm:px-6 lg:px-8">

        {/* Title + underline */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-[26px] font-bold text-[#1A2B4A] lg:text-[32px]">
            Press Room Snapshot
          </h2>
          <div className="mt-3 h-[3px] w-[80px] rounded-full bg-[#1778C8]" />
        </div>

        {/* 3×2 grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.Icon;
            return (
              <div
                key={card.title}
                className="rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#C8DBF0]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon size={20} className="text-[#2B83C6]" strokeWidth={1.8} />
                  <h3 className="text-[18px] font-bold text-[#1A2B4A]">{card.title}</h3>
                </div>
                <p className="text-[14px] leading-[1.65] text-[#64748B]">{card.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
