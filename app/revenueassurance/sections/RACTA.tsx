export default function RACTA() {
  return (
    <section className="bg-[#10101D] py-28">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2
          className="text-white font-extrabold leading-[1.15] mb-5"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Ready to seal your revenue leaks?
        </h2>

        <p className="text-[#6B7280] text-[0.95rem] leading-7 max-w-[36rem] mx-auto mb-11">
          Deploy our lightweight audit engine in your environment and get a comprehensive leakage
          report within 72 hours.
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          <button className="bg-[#2D7DB3] text-white px-8 py-3.5 font-semibold text-[0.9rem] border-none rounded cursor-pointer">
            Assure Your Revenue
          </button>

          <button
            className="bg-transparent text-white px-8 py-3.5 font-semibold text-[0.9rem] rounded cursor-pointer"
            style={{ border: "1.5px solid #3A4456" }}
          >
            Talk to an Auditor
          </button>
        </div>

      </div>
    </section>
  );
}
