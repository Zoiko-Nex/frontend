import Link from "next/link";
import { Download, Calendar } from "lucide-react";

export default function PlatformCTA() {
  return (
    <section style={{ backgroundColor: "#ffffff", margin: 0, padding: "7rem 0" }}>
      <div className="max-w-6xl mx-auto px-6">

        <p className="uppercase text-[10px] tracking-[6px] text-[#2D9AE3] text-center mb-6">
          STRUCTURED MIGRATION
        </p>

        <h2 className="text-black text-center text-4xl lg:text-5xl font-semibold mb-4">
          Accelerate Your Monetization Strategy.
        </h2>

        <p style={{ color: "#697586" }} className="text-center text-lg mb-20">
          Choose the path that fits your current operational needs.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT */}
          <div style={{ backgroundColor: "#F3F1F2", padding: "3rem" }}>
            <p className="uppercase text-[10px] tracking-[5px] text-[#2D9AE3] mb-8">
              FOR ARCHITECTS &amp; CTOs
            </p>
            <h3 style={{ color: "#000000" }} className="text-4xl lg:text-5xl font-bold mb-8">
              Technical Evaluation
            </h3>
            <p style={{ color: "#697586" }} className="text-base leading-8 mb-12">
              Download our Architecture Brief, API specifications,
              and domain-core documentation to see how ZoikoNex
              fits into your existing network stack.
            </p>
            <Link href="/contact-us" style={{ width: "100%", display: "block" }}>
              <button style={{
                width: "100%",
                border: "2px solid #000000",
                backgroundColor: "transparent",
                color: "#000000",
                padding: "1.25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}>
                Download Architecture Brief
                <Download size={18} />
              </button>
            </Link>
          </div>

          {/* RIGHT */}
          <div style={{ backgroundColor: "#070A27", padding: "3rem" }}>
            <p className="uppercase text-[10px] tracking-[5px] mb-8" style={{ color: "#8F99A8" }}>
              FOR BUSINESS LEADERS
            </p>
            <h3 className="text-white text-4xl lg:text-5xl font-bold mb-8">
              Commercial Briefing
            </h3>
            <p style={{ color: "#6D7387" }} className="text-base leading-8 mb-12">
              Discuss TCO reduction, real-time revenue assurance,
              and new edge-monetization streams with our
              industry-leading monetization specialists.
            </p>
            <Link href="/contact-us" style={{ width: "100%", display: "block" }}>
              <button style={{
                width: "100%",
                backgroundColor: "#3182B7",
                color: "#ffffff",
                padding: "1.25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
                border: "none",
              }}>
                Book Executive Session
                <Calendar size={18} />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}