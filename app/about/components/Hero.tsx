import { Database, Monitor, Plus, Shield } from "lucide-react";
import Link from "next/link";

const rows = [
  {
    text: "Real-time monetization across every product type",
    Icon: Plus,
    bg: "#8CC63F",
    color: "#0B1633",
  },
  {
    text: "Multi-jurisdiction control with evidence-grade governance",
    Icon: Shield,
    bg: "#4A9FD4",
    color: "#FFFFFF",
  },
  {
    text: "Flexible deployment from shared SaaS to sovereign hosting",
    Icon: Monitor,
    bg: "#4A9FD4",
    color: "#FFFFFF",
  },
  {
    text: "Single institutional platform replacing fragmented OSS/BSS",
    Icon: Database,
    bg: "#4A9FD4",
    color: "#FFFFFF",
  },
];

export default function Hero() {
  return (
    <section className="bg-[#0D3B6E] text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12 md:py-[60px] lg:px-[80px]">
        <div className="grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#9BE15D]">
              About ZoikoNex
            </p>

            <div className="mb-6 inline-flex items-center rounded-full border border-white/25 px-4 py-1.5">
              <span className="text-[10px] font-medium tracking-wide text-white/80 sm:text-[11px]">
                A Zoiko Tech platform - part of Zoiko Group Inc.
              </span>
            </div>

            <h1 className="text-[36px] font-bold leading-[1.08] tracking-tight sm:text-[52px] sm:leading-[60px]">
              Telecom Monetization
              <span className="block text-[#8CC63F]">Rebuilt as Infrastructure.</span>
            </h1>

            <p className="mb-8 mt-5 max-w-[480px] text-[14.5px] leading-[26px] text-slate-300">
              ZoikoNex is the infrastructure layer powering the next generation of telecom
              operators - where charging, billing, compliance, and governance converge in
              one unified system.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button className="rounded-lg bg-[#8CC63F] px-6 py-3 text-[13px] font-semibold text-[#0B1633]">
                View the Platform <span aria-hidden="true">-&gt;</span>
              </button>
              <Link
                href="/request-a-demo"
                className="rounded-lg border border-white/30 px-6 py-3 text-[13px] font-semibold text-white inline-block"
              >
                Request a Demo
              </Link>
            </div>
          </div>

          <div className="flex lg:justify-end">
            <div className="w-full rounded-[18px] border border-[#2E6090]/60 bg-[#1A4A72] p-6 sm:p-8 lg:w-[460px]">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#9BE15D]">
                Category Definition
              </p>

              <h2 className="mb-1 text-[38px] font-bold leading-none tracking-tight sm:text-[42px]">
                GTMI
              </h2>
              <p className="mb-7 text-[13px] text-slate-300">
                Governed Telecom Monetization Infrastructure
              </p>

              <div className="space-y-3">
                {rows.map((row) => {
                  const Icon = row.Icon;

                  return (
                    <div key={row.text} className="flex items-center gap-3 rounded-xl bg-[#1D527C] px-4 py-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: row.bg, color: row.color }}
                      >
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-[13px] text-white/90">{row.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
