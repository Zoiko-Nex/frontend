import { CheckSquare, Lock, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";

const impacts = [
  {
    title: "Reduce Revenue Leakage",
    desc: "Detect missing billable events within hours, not at month-end",
    Icon: TrendingUp,
    color: "#67BE32",
    bg: "#EAF9DD",
  },
  {
    title: "Improve Billing Integrity",
    desc: "Immutable evidence ledger ensures every financial event is provable",
    Icon: CheckSquare,
    color: "#2B83C6",
    bg: "#EAF6FF",
  },
  {
    title: "Accelerate Time-to-Market",
    desc: "Launch new tariffs and products without deployment cycles or code changes",
    Icon: Zap,
    color: "#67BE32",
    bg: "#EAF9DD",
  },
  {
    title: "Lower Operating Cost",
    desc: "Consolidate fragmented OSS/BSS into one coherent operating environment",
    Icon: Lock,
    color: "#2B83C6",
    bg: "#EAF6FF",
  },
];

export default function ValueSection() {
  return (
    <section className="bg-white py-[96px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto grid max-w-[1152px] gap-[22px] px-6 lg:grid-cols-[536px_594px] lg:items-start">
        <div>
          <p className="mb-[14px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            Economic Impact
          </p>

          <h2 className="max-w-[500px] text-[38px] font-extrabold leading-[1.08] text-[#1C1D31]">
            The value of ZoikoNex is not abstract. It is economic.
          </h2>

          <p className="mt-[14px] max-w-[560px] text-[16px] leading-[1.58] text-[#4E5E73]">
            For operators, ZoikoNex directly improves revenue quality, control quality,
            and operating leverage across the commercial model.
          </p>

          <div className="mt-[34px] space-y-[16px]">
            {impacts.map((item) => {
              const Icon = item.Icon;

              return (
                <div
                  key={item.title}
                  className="flex min-h-[84px] items-center gap-[17px] rounded-[12px] bg-[#F3F6FA] px-[25px]"
                >
                  <div
                    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px]"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon size={21} strokeWidth={2.15} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-extrabold leading-[1.35] text-[#1C1D31]">
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] leading-[1.55] text-[#60728C]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative h-[630px] overflow-hidden rounded-[20px]">
          <Image
            src="/image/economic-impact.png"
            alt="Stacks of coins and banknotes"
            fill
            sizes="(min-width: 1024px) 594px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
