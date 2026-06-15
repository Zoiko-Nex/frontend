export default function RAHero() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block border-[1.5px] border-[#2D7DB3] text-[#2D7DB3] text-[0.65rem] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded">
                Revenue Assurance V4.0
              </span>
            </div>

            {/* Heading */}
            <h1
              className="text-[#0A0A0A] font-extrabold leading-[1.1] mb-5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)" }}
            >
              Zero Leakage.<br />Total Assurance.
            </h1>

            {/* Body */}
            <p className="text-[#5E6B7A] text-[0.95rem] leading-[1.8] mb-9 max-w-[32rem]">
              Detect and recover revenue gaps across usage, rating, billing, and
              settlement with evidence-grade precision. Our BSS-native engine
              ensures no bit goes unbilled.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3.5">
              <button className="bg-[#1F6FA3] text-white px-6 py-3 font-semibold text-sm border-none rounded cursor-pointer">
                Assure Your Revenue
              </button>
              <button className="bg-transparent border-[1.5px] border-[#1A2533] text-[#1A2533] px-6 py-3 font-semibold text-sm rounded cursor-pointer">
                Request a Technical Audit
              </button>
            </div>
          </div>

          {/* ── Right column — monitoring card ── */}
          <div className="bg-[#F7F9FC] border border-[#DDE4EE] rounded-[14px] p-7" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>

            {/* Card header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[0.8rem] font-semibold text-[#3A4556] tracking-[0.02em]">
                Live Leakage Monitoring
              </span>
              {/* Signal/wifi icon */}
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M1 5c2.2-2.7 5.4-4 8-4s5.8 1.3 8 4" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M3.5 8C5 6.2 6.9 5 9 5s4 1.2 5.5 3" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M6 11c.8-1 1.8-1.5 3-1.5s2.2.5 3 1.5" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="9" cy="13" r="1" fill="#94A3B8" />
              </svg>
            </div>

            {/* CDR Validation row */}
            <div className="bg-white border border-[#E8EDF4] rounded-lg px-5 py-4 mb-5">
              <div className="flex items-center gap-3.5">
                {/* Icon */}
                <div className="w-[34px] h-[34px] rounded-[7px] bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2" width="14" height="12" rx="2" stroke="#2D7DB3" strokeWidth="1.3" />
                    <path d="M4 6h8M4 9h5" stroke="#2D7DB3" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-[0.45rem]">
                    <span className="text-[0.78rem] text-[#4B5563] font-medium">
                      CDR Validation: 99.999%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-[5px] bg-[#E5EAF0] rounded-full overflow-hidden">
                    <div className="h-full w-[99.999%] bg-[#2D7DB3] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[#E8EDF4] rounded-lg px-5 py-4">
                <p className="text-[0.68rem] text-[#94A3B8] uppercase tracking-[0.06em] mb-1.5">
                  Recovery
                </p>
                <p className="text-2xl font-extrabold text-[#0A0A0A]">$4.2M</p>
              </div>
              <div className="bg-white border border-[#E8EDF4] rounded-lg px-5 py-4">
                <p className="text-[0.68rem] text-[#94A3B8] uppercase tracking-[0.06em] mb-1.5">
                  Risk Score
                </p>
                <p className="text-2xl font-extrabold text-[#2D7DB3]">L1</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
