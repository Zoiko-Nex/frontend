import { Anchor, BriefcaseBusiness, PhoneCall, Smartphone, UsersRound } from "lucide-react";

const targets = [
  {
    title: "MVNOs & MVNEs",
    desc: "Launch and scale virtual operations with full BSS capabilities built in from day one - no fragmented vendor ecosystem required.",
    Icon: UsersRound,
  },
  {
    title: "MNOs & Wholesale Carriers",
    desc: "Modernize legacy monetization stacks through controlled migration and coexistence, without disrupting live commercial operations.",
    Icon: PhoneCall,
  },
  {
    title: "eSIM-First Digital Providers",
    desc: "GSMA-aligned eSIM lifecycle management, IoT fleet orchestration, and usage aggregation at device-fleet scale within one governed platform.",
    Icon: Smartphone,
  },
  {
    title: "IoT & M2M Operators",
    desc: "Fleet-scale billing, connectivity lifecycle, and device management with the compliance controls enterprise and regulated environments require.",
    Icon: Anchor,
  },
  {
    title: "Enterprises & B2B Platforms",
    desc: "Account hierarchies, pooled billing, SLA-linked charging, and programmable network API monetization for enterprises embedding connectivity.",
    Icon: BriefcaseBusiness,
  },
];

function TargetCard({ item }: { item: (typeof targets)[number] }) {
  const Icon = item.Icon;

  return (
    <div className="min-h-[213px] rounded-[16px] border border-[#DDE7F0] bg-white px-[28px] pt-[28px] pb-[24px]">
      <div className="mb-[19px] flex h-[44px] w-[44px] items-center justify-center rounded-[11px] bg-[#EAF6FF] text-[#2B83C6]">
        <Icon size={22} strokeWidth={2.1} />
      </div>
      <h3 className="mb-[9px] text-[16px] font-extrabold leading-[1.25] text-[#1C1D31]">
        {item.title}
      </h3>
      <p className="text-[13.5px] leading-[1.62] text-[#60728C]">{item.desc}</p>
    </div>
  );
}

export default function Operation() {
  return (
    <section className="bg-[#FBFCFE] py-[60px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-[1152px] px-6">
        <div className="mb-[43px] text-center">
          <p className="mb-[12px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            Who We Serve
          </p>
          <h2 className="mx-auto max-w-[845px] text-[30px] font-extrabold leading-[1.1] text-[#1C1D31] sm:text-[38px]">
            Built for operators and platforms
            <br className="hidden sm:block" />
            that must move faster than legacy systems allow.
          </h2>
          <p className="mt-[7px] text-[14.5px] leading-[1.6] text-[#56667B] sm:text-[15px]">
            Especially suited to organizations that require global ambition with governed execution.
          </p>
        </div>

        <div className="grid gap-[16px] lg:grid-cols-3">
          {targets.slice(0, 3).map((item) => (
            <TargetCard key={item.title} item={item} />
          ))}
        </div>

        <div className="mx-auto mt-[16px] grid max-w-[764px] gap-[16px] md:grid-cols-2">
          {targets.slice(3).map((item) => (
            <TargetCard key={item.title} item={item} />
          ))}
        </div>

        <div className="mt-[18px] flex min-h-[103px] flex-col items-center justify-between gap-5 rounded-[16px] border border-[#D7E7D9] bg-[linear-gradient(110deg,#EEF8FF_0%,#F4FDE9_100%)] px-[24px] py-[24px] md:flex-row md:px-[36px]">
          <p className="max-w-[775px] text-center text-[16px] font-medium leading-[1.55] text-[#1C1D31] md:text-left md:text-[19px]">
            Especially suited to operators with <span className="text-[#1F7FD0]">global ambition</span> and the need for{" "}
            <span className="text-[#1F7FD0]">governed execution</span> across multiple markets and regulatory environments.
          </p>
          <button className="h-[42px] w-full rounded-[10px] bg-[#2F84C7] px-7 text-[14px] font-bold text-white shadow-[0_10px_18px_rgba(47,132,199,0.25)] md:w-[226px]">
            Explore Solutions
          </button>
        </div>
      </div>
    </section>
  );
}
