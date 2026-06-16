
export default function RAHero() {
  return (
    <section
      className="py-24"
      style={{
        background:
          "radial-gradient(circle at 75% 40%, rgba(45,125,179,.06), transparent 35%), white",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT COLUMN */}
          <div>
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block border-[1.5px] border-[#2D7DB3] text-[#2D7DB3] text-[11px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded">
                Revenue Assurance V4.0
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-[#0A0A0A] font-extrabold leading-[1.1] mb-5"
              style={{ fontSize: "clamp(2.5rem,4.5vw,3.8rem)" }}
            >
              Zero Leakage.
              <br />
              Total Assurance.
            </h1>

            {/* Description */}
            <p className="text-[#5E6B7A] text-[16px] leading-8 max-w-[32rem] mb-10">
              Detect and recover revenue gaps across usage, rating, billing,
              and settlement with evidence-grade precision. Our BSS-native
              engine ensures no bit goes unbilled.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#1F6FA3] text-white px-7 py-3 rounded-lg font-semibold text-sm">
                Assure Your Revenue
              </button>

              <button className="border border-[#1A2533] text-[#1A2533] px-7 py-3 rounded-lg font-semibold text-sm">
                Request a Technical Audit
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative">
            {/* Glow */}
            <div
              className="absolute inset-0 -z-10"
              style={{
                transform: "scale(1.1)",
                filter: "blur(70px)",
                background:
                  "radial-gradient(circle, rgba(45,125,179,.12) 0%, rgba(45,125,179,.06) 30%, transparent 75%)",
              }}
            />

            {/* Main Card */}
            <div
              className="bg-[#F8FAFC] border border-[#DDE4EE] rounded-[14px] p-8"
              style={{
                boxShadow: "0 25px 50px rgba(15,23,42,.15)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-stone-300/20 mb-8">
                <h4 className="text-slate-600 text-xs font-semibold font-mono tracking-wider">
                  Live Leakage Monitoring
                </h4>

                <svg width="26" height="20" viewBox="0 0 18 14" fill="none">
                  <path
                    d="M1 5c2.2-2.7 5.4-4 8-4s5.8 1.3 8 4"
                    stroke="#94A3B8"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3.5 8C5 6.2 6.9 5 9 5s4 1.2 5.5 3"
                    stroke="#94A3B8"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 11c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5"
                    stroke="#94A3B8"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <circle cx="9" cy="13" r="1" fill="#94A3B8" />
                </svg>
              </div>

              {/* Validation Card */}
              <div
                className="bg-white border border-[#E8EDF4] rounded-[8px] px-6 py-5 mb-6"
                style={{
                  boxShadow: "0 4px 16px rgba(0,0,0,.04)",
                }}
              >
                <div className="flex items-center gap-5">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-lime-800/10 rounded-sm flex justify-center items-center">
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="1"
                        y="2"
                        width="14"
                        height="12"
                        rx="2"
                        stroke="#2D7DB3"
                        strokeWidth="1.3"
                      />
                      <path
                        d="M4 6h8M4 9h5"
                        stroke="#2D7DB3"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="text-zinc-900 text-xs font-bold font-mono">
                      CDR Validation: 99.999%
                    </div>

                    <div
                      className="h-2 bg-[#E5EAF0] rounded-full overflow-hidden"
                      style={{
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,.08)",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "99.999%",
                          background: "#2D7DB3",
                          boxShadow: "0 0 10px rgba(45,125,179,.35)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Cards */}
              <div className="grid grid-cols-2 gap-5">
                {/* Recovery */}
                <div
                  className="p-4 bg-stone-100 rounded-sm border border-stone-300/10"
                  style={{
                    boxShadow: "0 4px 16px rgba(0,0,0,.03)",
                  }}
                >
                  <p className="text-slate-600 text-xs font-bold font-mono leading-4 mb-1">
                    Recovery
                  </p>
                  <h3 className="text-black text-2xl font-bold leading-8">
                    $4.2M
                  </h3>
                </div>

                {/* Risk Score */}
                <div
                  className="p-4 bg-stone-100 rounded-sm border border-stone-300/10"
                  style={{
                    boxShadow: "0 4px 16px rgba(0,0,0,.03)",
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-[#94A3B8] mb-4">
                    Risk Score
                  </p>

                  <h3 className="text-[#8EB3C7] text-2xl font-bold leading-8">
                    L1
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}