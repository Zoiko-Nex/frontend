import ApplicationForm from "./ApplicationForm";
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Apply — Telecom Solution Architect | ZoikoNex",
  description:
    "Apply to join ZoikoNex — the infrastructure layer for governed telecom monetization.",
};

export default async function CareersApplyPage(props: any) {
  const searchParams = await props.searchParams;
  const roleName = searchParams?.role || "Telecom Solution Architect";

  return (
    <main
      className="min-h-screen bg-[#F4F6F9] pt-8 pb-14 font-['Plus_Jakarta_Sans',sans-serif] sm:pt-12 sm:pb-18"
    >
      <div className="mx-auto max-w-275 px-4 sm:px-6 lg:px-8">

        {/* ── Role header ── */}
        <div className="mb-6 sm:mb-8">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-2.5">
            <span
              className="rounded font-mono font-bold uppercase tracking-[2px] text-[#16A34A]"
              style={{
                fontSize: "11px",
                border: "1px solid #16A34A",
                background: "#F0FDF4",
                padding: "4px 12px",
                letterSpacing: "2px",
              }}
            >
              Infrastructure Role
            </span>
            <span
              className="rounded font-mono font-bold uppercase text-[#475569]"
              style={{
                fontSize: "11px",
                border: "1px solid #94A3B8",
                background: "#FFFFFF",
                padding: "4px 12px",
                letterSpacing: "2px",
              }}
            >
              Ref: ZN-ARCH-001
            </span>
          </div>

          <p className="mb-1 text-[13px] text-[#64748B]">Apply for:</p>
          <h1 className="text-[22px] font-extrabold leading-[1.2] text-[#1C1D31] sm:text-[28px]">
            {roleName}
          </h1>
          <p className="mt-3 max-w-180 text-[14px] leading-[1.75] text-[#4E5E73] sm:text-[14.5px]">
            Lead the structural evolution of our Tier-1 BSS frameworks. We are looking
            for an architect to ensure absolute sovereign control and mathematical
            precision in our global network expansion.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <ApplicationForm />
          <Sidebar />
        </div>

      </div>
    </main>
  );
}
