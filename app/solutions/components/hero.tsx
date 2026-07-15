import Link from "next/link";

export default function SovereignMonetizationHero() {

  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full">
        <div
          className="
            relative overflow-hidden
            bg-[radial-gradient(circle_at_center,_#2B7EC1_0%,_#17395F_45%,_#0B1020_100%)]
            px-6
            pt-[60px]
            pb-[76px]
          "
        >
          <div className="mx-auto flex max-w-[1280px] flex-col items-center text-center">
            {/* Eyebrow */}
            <p className="text-[13px] font-bold uppercase tracking-[0.35em] text-white">
              SOVEREIGN MONETIZATION ENGINE
            </p>

            {/* Heading */}
            <h1 className="mt-8 text-base font-normal leading-5 text-white">
              Solutions for Operators Building the{" "}
              <span className="text-lime-400">Next Era</span> of Telecom
              Monetization
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-[626px] text-base font-normal leading-6 text-white/60">
              Unified infrastructure for high-growth MVNOs, multi-brand MNOs,
              and global eSIM ventures. Engineered for reliability,
              compliance, and sovereign control.
            </p>

            {/* CTA */}
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/request-a-demo"
                className="
                  inline-flex items-center justify-center
                  px-8 py-4
                  bg-[#2B7EC1]
                  text-lg leading-7 text-white
                  transition-colors
                  hover:bg-[#236aa3]
                "
              >
                Request a Demo
              </Link>

              <Link href="/technical-architecture"
                className="
                  inline-flex items-center justify-center
                  px-8 py-4
                  border border-white/20
                  text-lg leading-7 text-white
                  transition-colors
                  hover:bg-white/5
                "
              >
                Start Your Technical Evaluation
              </Link>
            </div>
          </div>
        </div>
    </section>
  );
}