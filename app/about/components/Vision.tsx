const points = [
  { text: "Launches faster than legacy systems allow", color: "#2B83C6" },
  { text: "Governs with confidence across jurisdictions", color: "#62BE33" },
  { text: "Monetizes with real-time precision at scale", color: "#2B83C6" },
  { text: "Adapts across markets without losing control", color: "#62BE33" },
  { text: "Keeps every financial decision provable and reviewable", color: "#2B83C6" },
];

export default function Vision() {
  return (
    <section className="bg-[linear-gradient(155deg,#eef8ff_0%,#ffffff_46%,#f3fde8_100%)] py-[44px] font-['Plus_Jakarta_Sans',sans-serif] sm:py-[46px]">
      <div className="mx-auto grid max-w-[1152px] gap-10 px-6 lg:grid-cols-[520px_536px] lg:justify-between">
        <div>
          <p className="mb-[14px] text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
            Our Vision
          </p>

          <h2 className="max-w-[520px] text-[30px] font-extrabold leading-[1.15] text-[#1C1D31] sm:text-[36px]">
            Built for a programmable, embedded, global, real-time telecom future
          </h2>

          <p className="mt-[20px] max-w-[535px] text-[15px] leading-[1.85] text-[#4E5E73] sm:text-[16px]">
            The operators who win in this market will not simply be those with the largest
            networks. They will be those with the strongest monetization infrastructure -
            systems that can launch faster, govern better, monetize more precisely, and
            adapt across markets without losing control.
          </p>

          <p className="mt-[20px] text-[14.5px] leading-[1.8] text-[#4E5E73] sm:text-[15px]">
            ZoikoNex is built for that future - and for the operators who intend to lead it.
          </p>
        </div>

        <div className="lg:pt-[1px]">
          <p className="mb-[27px] text-[11px] font-bold uppercase tracking-[3px] text-[#2F8A13]">
            The Winning Operator
          </p>

          <div className="space-y-[15px]">
            {points.map((point) => (
              <div
                key={point.text}
                className="flex min-h-[53px] items-center gap-[15px] rounded-[14px] border border-[#D7E1EB] bg-white/75 px-[20px] py-3 text-[14px] font-semibold text-[#1C1D31] sm:text-[15px]"
              >
                <span
                  className="h-[8px] w-[8px] shrink-0 rounded-full"
                  style={{ backgroundColor: point.color }}
                />
                {point.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
