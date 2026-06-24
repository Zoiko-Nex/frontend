import { Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="flex w-full flex-col lg:min-h-170 lg:flex-row">

      {/* ── Left: text ── */}
      <div className="flex items-center bg-white px-6 py-12 sm:px-8 sm:py-16 lg:w-[44%] lg:px-25 lg:py-0">
        <div className="w-full max-w-130">
          <h1
            className="font-extrabold leading-[1.1] tracking-tight text-[#1A2B4A] sm:leading-[1.08]"
            style={{ fontSize: "clamp(28px, 6vw, 58px)" }}
          >
            Newsroom for the next generation of telecom monetization.
          </h1>

          <p className="mt-6 text-[16px] leading-[1.72] text-[#64748B]">
            Official source for announcements, institutional guidelines, and sovereign
            infrastructure insights. Empowering global carriers with Tier-1 BSS
            capabilities.
          </p>

          <a
            href="mailto:press@zoikonex.systems"
            className="mt-8 inline-flex items-center gap-3 rounded-[8px] bg-[#1A4E72] px-7 py-[14px] text-[14px] font-semibold text-white transition hover:bg-[#154060]"
          >
            Contact Media Relations
            <Mail size={16} strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* ── Right: dark image / visualization ── */}
      <div className="relative min-h-[360px] flex-1 overflow-hidden bg-[#080E1C] lg:min-h-0">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,179,237,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.6) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow orbs */}
        <div className="absolute left-1/4 top-1/3 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1B6FD8]/20 blur-[80px]" />
        <div className="absolute right-1/4 top-2/3 h-[240px] w-[240px] -translate-y-1/2 rounded-full bg-[#7C3AED]/15 blur-[60px]" />

        {/* Screen frame decoration */}
        <div className="absolute left-[8%] top-[12%] h-[65%] w-[82%] rounded-[4px] border border-[#2A4A8A]/60 bg-[#0D1829]/70 backdrop-blur-sm">
          <div className="border-b border-[#2A4A8A]/40 px-4 py-2">
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]/60" />
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]/40" />
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 text-[10px] font-mono text-[#4A90D9]/70">
            <div className="rounded border border-[#1E3A6A]/50 bg-[#0A1628]/60 p-2">
              <div className="mb-1 text-[9px] uppercase tracking-widest text-[#63B3ED]/50">
                Telecom Operating Intelligence
              </div>
              <div className="h-8 w-full rounded bg-[#1B4080]/30" />
            </div>
            <div className="rounded border border-[#1E3A6A]/50 bg-[#0A1628]/60 p-2">
              <div className="mb-1 text-[9px] uppercase tracking-widest text-[#63B3ED]/50">
                Global Data Flow
              </div>
              <div className="h-8 w-full rounded bg-[#1B4080]/30" />
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute bottom-6 right-6 max-w-[260px] rounded-[6px] bg-[#0D1829]/90 px-4 py-3 backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[8px] w-[8px] rounded-full bg-[#22C55E]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white">
              System Status: Optimal
            </span>
          </div>
          <p className="font-mono text-[10px] leading-[1.5] text-[#94A3B8]">
            Sovereign Cloud Monitoring Active. Global Bandwidth Allocation: 99.999% SLA
            Compliance.
          </p>
        </div>
      </div>

    </section>
  );
}
