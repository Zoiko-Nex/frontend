import { FileText, Activity, Users, CheckCircle, Circle, HelpCircle } from "lucide-react";

const standards = [
  {
    Icon: FileText,
    title: "Documentation First",
    desc: "Every architectural decision must be logged with mathematical traceability.",
  },
  {
    Icon: Activity,
    title: "Inherent Precision",
    desc: "We value code that honors the integrity of Tier-1 latency requirements.",
  },
  {
    Icon: Users,
    title: "Professional Respect",
    desc: "Direct communication, rigorous peer review, and absolute data sovereignty.",
  },
];

const stages = [
  {
    number: "Stage 01",
    title: "Analysis",
    desc: "Technical review of your architecture portfolio and experience.",
    active: true,
  },
  {
    number: "Stage 02",
    title: "Simulation",
    desc: "Infrastructure challenge involving real-time node optimization.",
    active: false,
  },
  {
    number: "Stage 03",
    title: "Alignment",
    desc: "Strategic interview with the Sovereign Control leadership team.",
    active: false,
  },
  {
    number: "Stage 04",
    title: "Protocol Entry",
    desc: "Onboarding into the Node 01 Infrastructure environment.",
    active: false,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 space-y-4 lg:w-89">

      {/* ── ZoikoNex Standards ── */}
      <div className="rounded-2xl bg-[#0C1829] px-6 py-6 text-white">
        <p className="mb-5 text-[10px] font-bold uppercase tracking-[3px] text-[#7DD3FC]">
          ZoikoNex Standards
        </p>
        <div className="space-y-5">
          {standards.map((item) => {
            const Icon = item.Icon;
            return (
              <div key={item.title} className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#7DD3FC]">
                  <Icon size={15} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-bold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] leading-[1.55] text-white/55">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Hiring Pathway ── */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-6">
        <h3 className="mb-5 text-[14px] font-bold text-[#1C1D31]">Hiring Pathway</h3>
        <div className="space-y-4.5">
          {stages.map((stage) => (
            <div key={stage.number} className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {stage.active ? (
                  <CheckCircle size={17} strokeWidth={2.2} className="text-[#67BE32]" />
                ) : (
                  <Circle size={17} strokeWidth={2} className="text-[#CBD5E1]" />
                )}
              </div>
              <div>
                <p className="text-[13px] font-bold leading-snug text-[#1C1D31]">
                  <span className="text-[#64748B]">{stage.number}: </span>
                  {stage.title}
                </p>
                <p className="mt-1 text-[12px] leading-normal text-[#64748B]">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Need Assistance ── */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <HelpCircle size={15} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-[13.5px] font-bold text-[#1C1D31]">Need Assistance?</h3>
            <p className="mt-1.5 text-[12.5px] leading-[1.6] text-[#64748B]">
              Our recruitment node is active 24/7. Reach out at{" "}
              <a
                href="mailto:hr@zoikonex.net"
                className="font-semibold text-[#2B83C6] hover:underline"
              >
                hr@zoikonex.net
              </a>
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
