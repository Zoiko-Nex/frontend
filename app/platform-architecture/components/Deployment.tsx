"use client";
import Image from "next/image";
export default function DeploymentFlexibility() {
  return (
    <section className="bg-[#F8F6F7] py-13">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
            Deployment Flexibility
          </h2>

          <p className="text-slate-600 text-base">
            Engineered for the reality of hybrid and sovereign cloud requirements.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Public SaaS */}
          <div className="bg-white border border-stone-300/20 p-8">
            {/* Icon Here */}
            <div className="mb-6">
              {/* <CloudIcon className="w-8 h-8 text-sky-600" /> */}
               <Image
                            src="/image/platform-architecture/Icon (26).png"
                            alt="icon"
                            width={28}
                            height={28}
                            className="object-contain"
                            />
            </div>

            <h3 className="text-zinc-900 text-base mb-3">
              Public SaaS
            </h3>

            <p className="text-slate-600 text-sm leading-6">
              Shared infrastructure for rapid scaling and global reach.
              Zero-touch maintenance.
            </p>
          </div>

          {/* Dedicated */}
          <div className="bg-white border border-stone-300/20 p-8">
            {/* Icon Here */}
            <Image
                            src="/image/platform-architecture/Icon (27).png"
                            alt="icon"
                            width={28}
                            height={28}
                            className="object-contain"
                            />
            <div className="mb-6">
              {/* <ServerIcon className="w-8 h-8 text-sky-600" /> */}
            </div>

            <h3 className="text-zinc-900 text-base mb-3">
              Dedicated
            </h3>

            <p className="text-slate-600 text-sm leading-6">
              Isolated compute and database instances for sensitive
              enterprise workloads.
            </p>
          </div>

          {/* Hybrid */}
          <div className="bg-white border border-stone-300/20 p-8">
            {/* Icon Here */}
            <Image
                            src="/image/platform-architecture/Icon (28).png"
                            alt="icon"
                            width={28}
                            height={28}
                            className="object-contain"
                            />
            <div className="mb-6">
              {/* <HybridIcon className="w-8 h-8 text-sky-600" /> */}
            </div>

            <h3 className="text-zinc-900 text-base mb-3">
              Hybrid
            </h3>

            <p className="text-slate-600 text-sm leading-6">
              On-premise core with cloud-bursting capabilities.
              Seamless orchestration.
            </p>
          </div>

          {/* Sovereign */}
          <div className="bg-white border border-stone-300/20 p-8">
            {/* Icon Here */}
            <div className="mb-6">
              {/* <ShieldIcon className="w-8 h-8 text-sky-600" /> */}
              <Image
                            src="/image/platform-architecture/Icon (29).png"
                            alt="icon"
                            width={28}
                            height={28}
                            className="object-contain"
                            />
            </div>

            <h3 className="text-zinc-900 text-base mb-3">
              Sovereign
            </h3>

            <p className="text-slate-600 text-sm leading-6">
              Air-gapped deployment for national security and total
              data residency control.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}