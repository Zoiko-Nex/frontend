"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const steps = [
  {
    num: 1,
    title: "Architecture Mapping",
    desc: "We map your legacy tenant hierarchies to the ZoikoNex sovereign model with zero downtime for existing subscribers.",
  },
  {
    num: 2,
    title: "Data Silo Isolation",
    desc: "Automated migration of PII and financial records into hardened, tenant-specific encrypted storage clusters.",
  },
  {
    num: 3,
    title: "Brand Proxy Validation",
    desc: "Real-time shadowing of traffic through new tenant portals to ensure brand-level compliance and billing accuracy.",
  },
];

export default function PhasedDeployment() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-24"
      style={{ background: "linear-gradient(180deg, #0A1020 0%, #0D1830 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-20 items-center">
          {/* LEFT — image */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <div className="rounded-xl overflow-hidden relative">
              <Image
                src="/structured-migration.png"
                alt="Team collaborating on structured enterprise migration"
                width={600}
                height={440}
                className="w-full object-cover block"
                style={{ height: "440px", filter: "grayscale(10%)" }}
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, transparent 60%, rgba(10,16,32,0.6))" }}
              />
            </div>
          </div>

          {/* RIGHT — content */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
            }}
          >
            <h2
              className="text-white font-bold leading-[1.15] mb-12"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.01em" }}
            >
              Phased Deployment For<br />Enterprise Environments
            </h2>

            {/* Steps Timeline */}
            <div className="flex flex-col gap-10 relative">
              {/* Vertical line connecting the steps */}
              <div className="absolute left-7 top-7 bottom-7 w-[2px] bg-slate-700/50 -z-10"></div>

              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start relative z-10">
                  {/* Number box */}
                  <div
                    className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-lg font-semibold flex-shrink-0 border ${
                      i === 0
                        ? "bg-[#1e293b]/50 border-sky-500/30 text-sky-400"
                        : "bg-[#0f172a]/50 border-slate-700 text-slate-400"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-white font-bold text-[1.1rem] mb-2">{step.title}</h4>
                    <p className="text-[#94a3b8] text-[0.95rem] leading-[1.7]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
