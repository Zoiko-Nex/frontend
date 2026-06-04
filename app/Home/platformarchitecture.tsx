import { ChevronRight } from "lucide-react";

export default function PlatformArchitecturePage() {
  const topFlow = [
    { text: "Order", type: "blue" },
    { text: "Provisioning", type: "blue" },
    { text: "Usage Events", type: "blue" },
    { text: "Jurisdiction Resolution", type: "green" },
    { text: "Rating", type: "blue" },
    { text: "Tax Orchestration", type: "green" },
  ];

  const bottomFlow = [
    { text: "Billing", type: "blue" },
    { text: "Payment", type: "blue" },
    { text: "Reconciliation", type: "blue" },
    { text: "Evidence Ledger", type: "green" },
    { text: "AI Intelligence", type: "green" },
  ];

  return (
    <main className="bg-[#F8FAFC] dark:bg-gray-900">
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2B7EC1] dark:text-sky-400 mb-4">
            Platform Architecture
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C2E] dark:text-white mb-6">
            One Platform. Full Control.
          </h1>

          <p className="max-w-4xl mx-auto text-sm sm:text-base text-[#4A5568] dark:text-gray-300">
            ZoikoNex is architected as a bounded-domain, event-driven telecom
            monetization platform with integrated control planes for evidence,
            observability, trust, and policy enforcement.
          </p>

          <div className="mt-12 space-y-4">
            {/* Top Flow */}
            <div className="flex flex-wrap justify-center items-center gap-2">
              {topFlow.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold
                      ${
                        item.type === "blue"
                          ? "bg-[#E8F4FC] border-[#B7D9F5] text-[#1A5A9A] dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-300"
                          : "bg-[#EEF9E4] border-[#CDE7B5] text-[#4A9018] dark:bg-green-950/50 dark:border-green-800 dark:text-green-300"
                      }`}
                  >
                    {item.text}
                  </span>

                  {index !== topFlow.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Flow */}
            <div className="flex flex-wrap justify-center items-center gap-2">
              {bottomFlow.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold
                      ${
                        item.type === "blue"
                          ? "bg-[#E8F4FC] border-[#B7D9F5] text-[#1A5A9A] dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-300"
                          : "bg-[#EEF9E4] border-[#CDE7B5] text-[#4A9018] dark:bg-green-950/50 dark:border-green-800 dark:text-green-300"
                      }`}
                  >
                    {item.text}
                  </span>

                  {index !== bottomFlow.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}