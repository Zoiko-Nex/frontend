import { Lock } from "lucide-react";

const certifications = [
  "SOC2 TYPE II",
  "GDPR NATIVE",
  "ISO 27001",
  "PCI-DSS L1",
  "ETSI COMPLIANT",
];

export default function TrustGovernanceBand() {
  return (
    <section className="bg-zinc-900 dark:bg-gray-900 py-16 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm md:text-base leading-6 text-gray-700 dark:text-white">
            Governance Is Not an Add-On.
            <br />
            It Is the Operating Model.
          </p>
        </div>

        {/* Certifications */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12">
          {certifications.map((item) => (
            <span
              key={item}
              className="
                font-mono
                text-xs
                md:text-xl
                tracking-wider
                text-gray-500
                dark:text-white/60
              "
            >
              {item}
            </span>
          ))}
        </div>

        {/* Ledger Card */}
        <div className="mt-10 md:mt-14 flex justify-center">
          <div
            className="
              relative
              w-full
              max-w-4xl
              border
              border-white/10
              bg-[#0f1020]
              p-5
              md:p-8
              overflow-hidden
            "
          >
            {/* Lock Icon */}
            <Lock
              size={18}
              className="absolute right-4 top-4 text-lime-400"
            />

            {/* Log Text */}
            <pre
              className="
                whitespace-pre-wrap
                font-mono
                text-[10px]
                md:text-xs
                leading-5
                text-lime-400/70
              "
            >
{`[02:44:11] SHA-256 HASH VERIFIED ... 0X77F882...
[02:44:12] AUDIT TRAIL LOGGED ... JURISDICTION: EU-CENTRAL-1
[02:44:13] CONSENSUS LAYER STABLE ... 128 NODES ACTIVE
[02:44:14] REVENUE LEAKAGE SCAN: 0.0% DETECTED`}
            </pre>

            <div className="my-4 border-t border-white/10" />

            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/40">
                REAL-TIME GOVERNANCE LEDGER
              </span>

              <span className="text-xs text-lime-400">
                ENCRYPTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}