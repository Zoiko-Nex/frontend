const cards = [
  {
    label: "The Problem",
    title: "A structural mismatch that cannot be patched",
    desc: "Legacy OSS/BSS environments are often fragmented across vendors, slow to configure, expensive to maintain, difficult to reconcile, and weak in multi-jurisdiction execution. They were not built for embedded connectivity, eSIM-first operations, or the speed at which digital operators must now launch and evolve products.",
  },
  {
    label: "The Response",
    title: "This is a replacement cycle not an upgrade",
    desc: "This is no longer a matter of incremental improvement. The platform layer itself must change. Modern commercial models are being pushed through infrastructure designed for a different era. ZoikoNex is designed for that replacement cycle — built from the ground up for real-time, global, governed monetization.",
  },
];

export default function LegacySystem() {
  return (
    <section className="bg-[linear-gradient(155deg,#EEF8FF_0%,#FFFFFF_48%,#F3FDE8_100%)] py-[52px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-[1136px] px-6">
        <div className="mb-[36px] text-center">
          <p className="mb-[24px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            The Industry Shift
          </p>
          <h2 className="mx-auto max-w-[760px] text-[38px] font-extrabold leading-[1.1] text-[#1C1D31]">
            The systems running global
            <br />
            telecom were designed before the iPhone.
          </h2>
        </div>

        <div className="grid gap-[48px] md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.label}
              className="min-h-[267px] rounded-[24px] border border-[#E1E9F1] bg-white px-[36px] py-[35px]"
            >
              <p className="mb-[8px] text-[11px] font-bold uppercase tracking-[3px] text-[#65BD35]">
                {card.label}
              </p>
              <h3 className="mb-[4px] text-[23px] font-extrabold leading-[1.35] text-[#1C1D31]">
                {card.title}
              </h3>
              <p className="text-[15.5px] leading-[1.7] text-[#4E5E73]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
