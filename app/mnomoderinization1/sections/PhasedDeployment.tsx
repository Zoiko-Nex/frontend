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
            {/* Eyebrow */}
            <p className="text-[0.6rem] tracking-[0.3em] text-[#2D9AE3] uppercase font-semibold mb-5">
              STRUCTURED MIGRATION
            </p>

            <h2
              className="text-white font-extrabold leading-[1.15] mb-12"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Phased Deployment For<br />Enterprise Environments
            </h2>

            {/* Steps */}
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  {/* Number bubble */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[0.75rem] font-bold flex-shrink-0 mt-0.5"
                    style={{ border: "1px solid rgba(45,154,227,0.4)" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base mb-1.5">{step.title}</h4>
                    <p className="text-[#7B8FA6] text-[0.88rem] leading-7">{step.desc}</p>
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
