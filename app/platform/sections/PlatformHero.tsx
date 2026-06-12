import { ArrowRight } from "lucide-react";

export default function PlatformHero() {
  return (
    <section style={{ backgroundColor: "#0C3B67", padding: "6rem 0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <p style={{
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#C8F252",
              fontSize: "0.7rem",
              marginBottom: "2rem",
            }}>
              GTMI PLATFORM – SOVEREIGN TELECOM MONETIZATION INFRASTRUCTURE
            </p>

            <h1 style={{
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              marginBottom: "2rem",
            }}>
              The Infrastructure
              <br />
              Layer for Telecom
              <br />
              Monetization
            </h1>

            <p style={{
              color: "#93A0B4",
              fontSize: "1.1rem",
              lineHeight: 1.9,
              marginBottom: "3rem",
              maxWidth: "36rem",
            }}>
              Run telecom like infrastructure — not software. ZoikoNex is a
              bounded-domain, event-driven monetization platform with integrated
              control planes for evidence, observability, trust, and policy
              enforcement.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginBottom: "3.5rem" }}>
              <button style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "1rem 2rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                border: "none",
                cursor: "pointer",
              }}>
                Request a Demo <ArrowRight size={18} />
              </button>
              <button style={{
                backgroundColor: "transparent",
                border: "1px solid #ffffff",
                color: "#ffffff",
                padding: "1rem 2rem",
                fontWeight: 600,
                cursor: "pointer",
              }}>
                View Platform Architecture
              </button>
            </div>

            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {["TM Forum Aligned", "GSMA eSIM Ready", "Open Architecture", "Multi-Region Deployment"].map((label) => (
                <span key={label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.65rem",
                  color: "#A7B5C6",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="#A7B5C6" strokeWidth="1.1" />
                    <path d="M3.5 6.5l2 2 3.5-3.5" stroke="#A7B5C6" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div style={{ borderRadius: "0.375rem", overflow: "hidden" }}>
            <img
              src="/hero-image.jpg"
              alt="ZoikoNex platform"
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}