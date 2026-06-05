export default function CTA() {
  return (
    <section className="bg-[#173656] py-[36px] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto max-w-[980px] px-6 text-center">
        <p className="mb-[24px] text-[11px] font-bold uppercase tracking-[2.8px] text-[#78D245]">
          Final Statement
        </p>

        <h2 className="mx-auto max-w-[760px] text-[32px] font-extrabold leading-[1.48] text-white sm:text-[38px]">
          ZoikoNex is not a billing platform.
          <br />
          It is not a conventional OSS/BSS system.
        </h2>

        <div className="mt-[20px] flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-[22px]">
          <button className="h-[50px] w-full rounded-[10px] bg-[#69C62A] px-8 text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(105,198,42,0.28)] transition hover:bg-[#5dbb22] sm:w-[240px]">
            Request a Demo <span aria-hidden="true">-&gt;</span>
          </button>

          <button className="h-[50px] w-full rounded-[10px] border border-white/90 px-8 text-[15px] font-semibold text-white transition hover:bg-white/10 sm:w-[240px]">
            View Platform Architecture
          </button>
        </div>
      </div>
    </section>
  );
}
