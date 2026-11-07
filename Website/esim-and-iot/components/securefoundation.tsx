"use client";
import Link from "next/link";
export default function SecureFoundationCTA() {
  return (
    <section className="bg-[#f0f3f7] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Heading */}
        <h2
          className="text-[#2B7EC1] font-bold leading-[1.25] mb-5"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
        >
          Secure the Foundation of Your Fleet.
        </h2>

        {/* Subtext */}
        <p className="text-slate-500 text-base leading-[1.8] max-w-[36rem] mb-10">
          Join the world&apos;s leading connectivity providers using ZoikoNex to orchestrate
          and monetize global IoT infrastructure.
        </p>

        {/* CTA Buttons */}

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/request-a-demo">
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#153d60";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a4e7a";
              }}
              className="px-8 py-3.5 text-white text-[0.9rem] font-semibold border-none rounded-md cursor-pointer transition-colors duration-200"
              style={{
                backgroundColor: "#1a4e7a",
                boxShadow: "0 2px 8px rgba(26,78,122,0.3)",
              }}
            >
              Request a Demo
            </button>
          </Link>

          <Link href="/contact-sales-engineering">
            <button
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#ffffff";
              }}
              className="px-8 py-3.5 bg-white text-[#1a4e7a] text-[0.9rem] font-semibold border border-slate-300 rounded-md cursor-pointer transition-colors duration-200"
            >
              Contact Sales Engineering
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
