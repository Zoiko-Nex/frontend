import { Activity, Circle, Layers, Shield } from "lucide-react";

const steps = [
  {
    title: "Usage & Operational Data",
    desc: "Real-time events feed a continuous intelligence layer across all domains",
    Icon: Activity,
    tone: "green",
  },
  {
    title: "AI-Assisted Insight",
    desc: "Sharpens pricing, controls, and decision quality within policy guardrails",
    Icon: Layers,
    tone: "blue",
  },
  {
    title: "Stronger Revenue Capture",
    desc: "Lower leakage, expanded visibility, more accurate billing across every market",
    Icon: Shield,
    tone: "green",
  },
  {
    title: "Better Data, Next Cycle",
    desc: "Improved operations generate richer signals, compounding advantage over time",
    Icon: Circle,
    tone: "blue",
  },
];

export default function CompoundingAdvantage() {
  return (
    <section className="bg-[#1B1B2E] py-[58px] font-['Plus_Jakarta_Sans',sans-serif] text-white md:py-[62px]">
      <div className="mx-auto max-w-[1152px] px-6">
        <div className="mb-[36px] text-center">
          <p className="mb-[9px] text-[10px] font-extrabold uppercase tracking-[2.7px] text-[#72C945]">
            The ZoikoNex Power Loop
          </p>
          <h2 className="text-[24px] font-extrabold leading-[1.2] md:text-[28px]">
            Compounding Advantage Over Time
          </h2>
          <p className="mx-auto mt-[9px] max-w-[510px] text-[12.5px] leading-[1.75] text-[#BEC7D3]">
            ZoikoNex builds operational momentum through a self-reinforcing
            <br className="hidden sm:block" />
            cycle of data, insight, and monetization improvement.
          </p>
        </div>

        <div className="grid gap-[42px] lg:grid-cols-[510px_312px] lg:justify-center lg:gap-[72px]">
          <div className="space-y-[21px] md:pt-[15px]">
            {steps.map((step, index) => {
              const Icon = step.Icon;
              const isGreen = step.tone === "green";

              return (
                <div key={step.title} className="relative flex gap-[20px]">
                  {index !== steps.length - 1 && (
                    <span className="absolute left-[11px] top-[26px] h-[32px] w-px bg-[#2D82C7]" />
                  )}
                  <div
                    className="z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border"
                    style={{
                      backgroundColor: isGreen ? "#263B2E" : "#223A55",
                      borderColor: isGreen ? "#3F8B2D" : "#2C72AC",
                      color: isGreen ? "#72C945" : "#2F8BD4",
                    }}
                  >
                    <Icon size={12} strokeWidth={2.2} />
                  </div>
                  <div className="pt-[1px]">
                    <h3 className="text-[12px] font-extrabold leading-[1.2] text-white">
                      {step.title}
                    </h3>
                    <p className="mt-[3px] max-w-[420px] text-[10.5px] leading-[1.55] text-[#B5BECA]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-[18px] border border-[#4F8F2F] bg-[#252538] px-[24px] py-[24px] shadow-[0_18px_45px_rgba(0,0,0,0.18)] md:w-[312px]">
            <p className="mb-[16px] text-[9px] font-extrabold uppercase tracking-[2.2px] text-[#72C945]">
              The Result
            </p>
            <h3 className="text-[20px] font-extrabold leading-[1.22] text-white">
              Not just better billing - a stronger monetization engine
            </h3>
            <p className="mt-[17px] text-[11.5px] leading-[1.75] text-[#C0C8D2]">
              The result is not only better billing. It is a stronger monetization
              engine, a more informed operating model, and a more intelligent
              telecom business. ZoikoNex compounds advantage over time through a
              reinforcing operational cycle.
            </p>
            <div className="mt-[20px] rounded-[8px] bg-[#334239] px-[13px] py-[13px]">
              <p className="text-[10.5px] font-extrabold leading-[1.5] text-[#72C945]">
                Revenue quality, control quality, and operating leverage - improved simultaneously.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
