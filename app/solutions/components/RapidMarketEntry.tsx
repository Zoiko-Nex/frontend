import Image from "next/image";

export default function RapidMarketEntrySection() {
  return (
    <section className="bg-[#F8F6F7] dark:bg-gray-900 py-12 md:py-16 lg:py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-[90px] items-center">
          {/* Left Content */}
          <div>
            <h2 className="font-mono font-bold text-2xl md:text-3xl leading-tight text-[#2B7EC1] mb-4 uppercase">
              01. RAPID MARKET ENTRY
            </h2>

            <p className="text-base text-[#1C1B1C] dark:text-white mb-8">
              Launch an MVNO With the Monetization Stack Already Built
            </p>

            <p className="text-base leading-7 text-[#47464C] dark:text-gray-300 max-w-[592px] mb-8">
              Stop building middleware. ZoikoNex provides a "Turnkey
              Sovereign" environment where product catalogs, SIM provisioning,
              and real-time charging are pre-integrated. Focus on your brand,
              we handle the infrastructure.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-20 mb-10">
              <div>
                <div className="text-[#2B7EC1] text-base">99.99%</div>
                <div className="text-xs text-[#9CA3AF] mt-1">
                  Core Uptime SLA
                </div>
              </div>

              <div>
                <div className="text-[#2B7EC1] text-base">&lt;45 Days</div>
                <div className="text-xs text-[#9CA3AF] mt-1">
                  Mean Time to Launch
                </div>
              </div>
            </div>

            <button className="bg-[#2B7EC1] hover:bg-[#256ba4] text-white px-8 py-3 text-base transition-colors w-full sm:w-auto">
              Get Launch Blueprint
            </button>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="overflow-hidden ">
              <Image
                src="/image/solutionpage/Background+Shadow.png"
                alt="Rapid Market Entry"
                width={592}
                height={444}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute left-2 sm:-left-6 bottom-[-20px] sm:bottom-[-24px] bg-white dark:bg-gray-800 shadow-xl p-4 sm:p-5 w-[200px] sm:w-[240px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#2B7EC1]" />
                <span className="text-[10px] tracking-wider font-semibold text-[#2B7EC1] uppercase">
                  Real-Time Rating Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full rounded" />
                <div className="h-1 bg-gray-200 dark:bg-gray-700 w-4/5 rounded" />
                <div className="h-1 bg-gray-200 dark:bg-gray-700 w-3/5 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}