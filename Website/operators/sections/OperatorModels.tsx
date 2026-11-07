"use client";

import Image from "next/image";
import Link from "next/link";

const operatorModels = [
  {
    color: "bg-sky-600",
    size: "w-3 h-4",
    src: "/image/mno.svg",
    title: "MNO",
    description: "Large-scale network modernization and 5G slicing monetization.",
  },
  {
    color: "bg-lime-800",
    size: "w-4 h-5",
    src: "/image/mvno.svg",
    title: "MVNO",
    description: "Lightweight, cloud-native launches for specific niche markets.",
  },
  {
    color: "bg-black",
    size: "w-6 h-6",
    src: "/image/mvne.svg",
    title: "MVNE",
    description: "Powering sub-brands and third-party MVNO ecosystems.",
  },
  {
    color: "bg-sky-600",
    size: "w-4 h-5",
    src: "/image/digital.svg",
    title: "Digital",
    description: "App-first, zero-touch engagement for Gen-Z and digital natives.",
  },
  {
    color: "bg-lime-800",
    size: "w-5 h-3.5",
    src: "/image/iot.svg",
    title: "IoT",
    description: "Global connectivity management for millions of embedded units.",
  },
  {
    color: "bg-black",
    size: "w-5 h-4",
    src: "/image/enterprice.svg",
    title: "Enterprise",
    description: "B2B hierarchy management and multi-tenant billing control.",
  },
  {
    color: "bg-sky-600",
    size: "w-5 h-5",
    src: "/image/public.svg",
    title: "Public Sector",
    description: "Sovereign cloud infrastructure for secure government comms.",
  },
  {
    color: "bg-lime-800",
    size: "w-5 h-5",
    src: "/image/wholesale.svg",
    title: "Wholesale",
    description: "Bulk capacity and interconnect management across borders.",
  },
];

export default function OperatorModels() {
  return (
    <section className="w-full bg-stone-50 py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-zinc-900 text-3xl font-normal mb-3"
            style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            Operator Models
          </h2>
          <p
            className="text-zinc-700 text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Select your operational profile to explore specialized architecture
            paths.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-300/30 border border-stone-300/30">
          {operatorModels.map((op) => (
            <div
              key={op.title}
              className="bg-white p-8 flex flex-col gap-2 group hover:bg-sky-50/60 transition-colors duration-200 cursor-pointer"
            >
              {op.src ? (
                // SVG icon — small, icon-sized, like the original color block
                <img
                  src={op.src}
                  alt={op.title}
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
              ) : (
                <div className={`${op.size} ${op.color} flex-shrink-0`} />
              )}
              <div className="pt-2">
                <p
                  className="text-zinc-900 text-base font-normal leading-6"
                  style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {op.title}
                </p>
              </div>
              <div className="pb-4">
                <p
                  className="text-zinc-700 text-sm leading-5"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {op.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Request demo link */}
        <div className="text-center mt-8">
          <Link
            href="/request-a-demo"
            className="text-sky-600 text-base font-medium hover:text-sky-700 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Request a Demo →
          </Link>
        </div>
      </div>
    </section>
  );
}
