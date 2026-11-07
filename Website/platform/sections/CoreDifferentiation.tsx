export default function CoreDifferentiation() {
  return (
    <section className="bg-[#0C3B67] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <p className="uppercase text-[10px] tracking-[6px] text-[#C8F252] text-center mb-5">
          THE ADVANTAGE
        </p>

        {/* Heading */}
        <h2 className="text-white text-3xl lg:text-5xl font-bold text-center mb-16">
          Governed Telecom Monetization Infrastructure
        </h2>

        {/* 4-column cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1 — Evidence Not Logs */}
          <div className="border border-white/15 bg-[#0C3B67] p-8">
            {/* Shield icon */}
            <svg className="mb-6 text-[#C8F252]" width="28" height="28" viewBox="0 0 24 24" fill="#C8F252">
              <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z" />
            </svg>
            <h3 className="text-white text-xl font-bold mb-4">Evidence Not Logs</h3>
            <p className="text-[#7B8FA6] text-sm leading-7">
              Every state transition is signed and stored as immutable evidence,
              providing legal-grade auditability beyond simple logs.
            </p>
          </div>

          {/* Card 2 — At Runtime */}
          <div className="border border-white/15 bg-[#0C3B67] p-8">
            {/* Lightning bolt */}
            <svg className="mb-6" width="28" height="28" viewBox="0 0 24 24" fill="#C8F252">
              <path d="M13 2L4.5 13.5H11L10 22l9.5-13H13.5L13 2z" />
            </svg>
            <h3 className="text-white text-xl font-bold mb-4">At Runtime</h3>
            <p className="text-[#7B8FA6] text-sm leading-7">
              No maintenance windows. Policy updates, rating shifts, and scaling
              happen in real-time while the system remains hot.
            </p>
          </div>

          {/* Card 3 — With Control */}
          <div className="border border-white/15 bg-[#0C3B67] p-8">
            {/* Server/grid icon */}
            <svg className="mb-6" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="2">
              <rect x="2" y="2" width="5" height="20" rx="1" />
              <rect x="9" y="2" width="5" height="20" rx="1" />
              <rect x="16" y="2" width="6" height="20" rx="1" />
            </svg>
            <h3 className="text-white text-xl font-bold mb-4">With Control</h3>
            <p className="text-[#7B8FA6] text-sm leading-7">
              Sovereign control planes ensure operators own their logic and data
              sovereignty, independent of cloud provider limits.
            </p>
          </div>

          {/* Card 4 — Infrastructure Not Software */}
          <div className="border border-white/15 bg-[#0C3B67] p-8">
            {/* Layers icon */}
            <svg className="mb-6" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8F252" strokeWidth="2">
              <polygon points="12 2 22 8.5 12 15 2 8.5 12 2" />
              <polyline points="2 15 12 21.5 22 15" />
            </svg>
            <h3 className="text-white text-xl font-bold mb-4">
              Infrastructure
              <br />
              Not Software
            </h3>
            <p className="text-[#7B8FA6] text-sm leading-7">
              Built as a foundational platform layer, not a rigid siloed
              application. Designed to be programmable and extensible.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}