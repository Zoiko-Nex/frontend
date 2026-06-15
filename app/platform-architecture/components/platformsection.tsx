"use client";

import Link from "next/link";
import Image from "next/image";
// Import your icons here

const domains = [
  { title: "Product Catalog", id: "014" ,icon :"/image/platform-architecture/Icon (5).png" },
  { title: "Customer Mgmt", id: "071" ,icon :"/image/platform-architecture/Icon (6).png" },
  { title: "Order Handling", id: "013"  ,icon :"/image/platform-architecture/Icon (7).png"},
  { title: "Real-time Rating", id: "027"  ,icon :"/image/platform-architecture/Icon (8).png"},
  { title: "Billing Engine", id: "092",icon :"/image/platform-architecture/Icon (9).png" },
  { title: "Payments Gateway", id: "071" ,icon :"/image/platform-architecture/Icon (10).png" },

  { title: "Policy Control", id: "006" ,icon :"/image/platform-architecture/Icon (11).png" },
  { title: "Revenue Assurance", id: "055" ,icon :"/image/platform-architecture/Icon (12).png"},
  { title: "Mediation Layer", id: "043" ,icon :"/image/platform-architecture/Icon (13).png" },
  { title: "Settlement", id: "030" ,icon :"/image/platform-architecture/Icon (14).png" },
  { title: "Self-Service", id: "045" ,icon :"/image/platform-architecture/Icon (15).png"},
  { title: "Inventory", id: "054" ,icon :"/image/platform-architecture/Icon (16).png"},

  { title: "Reporting/BI", id: "037" ,icon :"/image/platform-architecture/Icon (17).png"},
  { title: "Omnichannel", id: "063" ,icon :"/image/platform-architecture/Icon (18).png"},
  { title: "Partner Ecosystem", id: "054" ,icon :"/image/platform-architecture/Icon (19).png"},
  { title: "Dunning Mgmt", id: "024" ,icon :"/image/platform-architecture/Icon (20).png"},
  { title: "API Gateway", id: "085" ,icon :"/image/platform-architecture/Icon (21).png"},
  { title: "Security Core", id: "048" ,icon :"/image/platform-architecture/Icon (22).png"},
];

export default function UnifiedDomainsSection() {
  return (
    <section className="py-15 bg-[#F8F6F7]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Content */}
        <div className="max-w-3xl mb-16">
          <p className="text-sky-600 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            THE SOVEREIGN BSS FOUNDATION
          </p>

          <h2 className="text-[56px] leading-[66px] font-bold text-black  mb-6">
            Platform Architecture
          </h2>

          <p className="text-lg text-slate-600 leading-7 max-w-2xl">
            ZoikoNex provides a modular, ultra-high-density BSS ecosystem
            designed for Tier-1 global infrastructure. 18 unified domains
            engineered for mathematical precision and institutional sovereignty.
          </p>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-3xl font-semibold text-zinc-900 ">
            18 Unified Domains
          </h3>

          <Link
            href="#"
            className="flex items-center gap-2 text-sky-600 text-base hover:text-sky-700"
          >
            Explore API Specs
            <span>→</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {domains.map((domain, index) => (
            <div
              key={index}
              className="
                bg-white/80
                backdrop-blur-sm
                border border-stone-300/20
                p-6
                min-h-[155px]
                transition-all
                duration-300
                hover:shadow-lg
                hover:-translate-y-1
              "
            >
              {/* Icon */}
              <div className="mb-2">
                        {domain.icon && (
                            <Image
                            src={domain.icon}
                            alt={domain.title}
                            width={28}
                            height={28}
                            className="object-contain"
                            />
                        )}
                        </div>

              {/* Title */}
              <h4 className="text-xm text-zinc-900 leading-6 font-normal  mb-2">
                {domain.title}
              </h4>

              {/* Domain ID */}
              <p className="text-xs text-slate-600 uppercase tracking-wide">
                DOMAIN-ID: {domain.id}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}  