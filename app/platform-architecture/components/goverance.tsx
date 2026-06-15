"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function GovernanceStandards() {
  return (
    <section className="bg-zinc-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <p className="text-xs font-bold leading-3 text-lime-800 uppercase mb-4">
              Compliance & Control
            </p>

            <h2 className="text-3xl font-semibold text-zinc-900 mb-6">
              Rigorous Governance
            </h2>

            <p className="text-lg text-slate-600 leading-8 mb-10 max-w-xl">
              Every layer of the ZoikoNex architecture is audited against Tier-1
              security standards and local jurisdiction requirements.
            </p>

            <div className="space-y-6">
              {/* Item 1 */}
              <div className="flex gap-3">
                <CheckCircle
                  size={22}
                  className="text-lime-700 flex-shrink-0 mt-1"
                />

                <div>
                  <h4 className="text-base font-bold text-zinc-900">
                    GDPR & Data Locality
                  </h4>

                  <p className="text-sm text-slate-600 mt-1">
                    Automated PII masking and cross-border data transfer
                    controls.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-3">
                <CheckCircle
                  size={22}
                  className="text-lime-700 flex-shrink-0 mt-1"
                />

                <div>
                  <h4 className="text-base font-bold text-zinc-900">
                    SOC2 Type II / ISO 27001
                  </h4>

                  <p className="text-sm text-slate-600 mt-1">
                    Real-time compliance monitoring and automated audit log
                    generation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg ">
              <Image
                src="/image/platform-architecture/goverance.png"
                alt="Governance Cube"
                width={700}
                height={700}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* SLA Card */}
            <div
              className="
                absolute
                bottom-[-24px]
                right-[-39px]
                bg-white
                shadow-xl
                border border-stone-200
                px-5
                py-3
                min-w-[100px]
              "
            >
              <p className="text-lime-800 text-lg tracking-wider uppercase mb-2">
                Uptime SLA
              </p>

              <h3 className="text-3xl font-semibold text-zinc-900">
                99.999%
              </h3>

              <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-2">
                Institutional Grade Reliability
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}