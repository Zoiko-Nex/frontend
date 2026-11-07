"use client";

import Link from "next/link";

export default function OperatorsCta() {
  return (
    <section
      className="w-full py-28 px-6 flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 70% 70% at 0% 0%, rgba(2,132,199,0.18) 0%, transparent 55%), #0a0f1a",
      }}
    >
      <div className="max-w-[896px] w-full mx-auto flex flex-col items-center gap-6 text-center">
        <h2
          className="text-white text-xl font-normal leading-6"
          style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
        >
          Built for the Operator You Are — and the Operator You Are Becoming
        </h2>
        <p
          className="text-white/70 text-base leading-6"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Join the global network of Tier-1 operators achieving sovereign
          infrastructure control.
        </p>
        <div className="pt-4">
          <Link
            href="/request-a-demo"
            className="inline-block px-10 py-5 bg-cyan-700 text-white text-lg font-normal hover:bg-cyan-600 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
