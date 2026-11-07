import { Activity, Box, CreditCard, Globe2, Layers, UserRound } from "lucide-react";

const features = [
  {
    text: "Customer & account management — single source of truth across all subscriber models",
    Icon: UserRound,
  },
  {
    text: "Billing, invoicing & payment handling — multi-currency, multi-rail, globally reconciled",
    Icon: CreditCard,
  },
  {
    text: "Product & tariff management — versioned plans, bundles, and governed eligibility",
    Icon: Box,
  },
  {
    text: "Jurisdiction-aware tax logic — runtime packs, multi-engine orchestration, provider failover",
    Icon: Globe2,
  },
  {
    text: "Usage ingestion, rating & charging — real-time and offline, carrier-grade processing",
    Icon: Activity,
  },
  {
    text: "AI-assisted intelligence — policy-governed, explainable, operating within defined guardrails",
    Icon: Layers,
  },
];

export default function GovernanceScale() {
  return (
    <section className="bg-white py-[42px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-[1136px] px-6">
        <div className="mb-[34px] text-center">
          <p className="mb-[17px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            Our Approach
          </p>
          <h2 className="text-[38px] font-extrabold leading-[1.18] text-[#1C1D31]">
            Governed Monetization at Global Scale
          </h2>
          <p className="mx-auto mt-[10px] max-w-[720px] text-[15.5px] leading-[1.55] text-[#4E5E73]">
            This does not merely reduce system sprawl. It creates a
            <br className="hidden sm:block" />
            stronger control fabric, a cleaner operational model, and a more commercially agile operator foundation.
          </p>
        </div>

        <div className="grid gap-x-[38px] gap-y-[10px] md:grid-cols-2">
          {features.map((item) => {
            const Icon = item.Icon;

            return (
              <div
                key={item.text}
                className="flex min-h-[76px] items-center gap-[15px] rounded-[12px] bg-[#F3F6FA] px-[22px]"
              >
                <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#EAF6FF] text-[#2B83C6]">
                  <Icon size={17} strokeWidth={2.1} />
                </div>
                <p className="text-[14.5px] font-medium leading-[1.45] text-[#1C1D31]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
