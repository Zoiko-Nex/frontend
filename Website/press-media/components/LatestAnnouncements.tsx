"use client";

import { useState } from "react";

type Release = {
  date: string;
  category: "Strategic" | "Technical";
  title: string;
  body: string;
};

const releases: Release[] = [
  {
    date: "October 24, 2024",
    category: "Technical",
    title: "ZoikoNex v0.9.4 Release: Enhancing Sovereign Slicing Precision",
    body: "The latest firmware deployment introduces 1024-bit encryption nodes for sovereign network slices, enabling carriers to provide high-stakes financial tunnels across legacy copper-to-fiber transitions.",
  },
  {
    date: "September 12, 2024",
    category: "Strategic",
    title: "Strategic Partnership with Global Carrier Consortium",
    body: "ZoikoNex enters a multi-year agreement to provide back-end monetization logic for the GCC's cross-border 5G standalone architecture, prioritizing regulatory transparency.",
  },
  {
    date: "August 5, 2024",
    category: "Technical",
    title: "Evidence Ledger v2.1: Immutable Audit Trail for Real-Time Charging",
    body: "New cryptographic ledger update enables provable billing events with microsecond-level timestamps, meeting Tier-1 operator audit requirements across six jurisdictions.",
  },
  {
    date: "July 18, 2024",
    category: "Strategic",
    title: "ZoikoNex Expands EMEA Presence with Sovereign Hosting Launch",
    body: "Following regulatory approval, ZoikoNex activates its first sovereign infrastructure node in the EU, enabling data residency compliance for operators across EMEA.",
  },
];

const tabs = ["All Releases", "Strategic", "Technical"] as const;

export default function LatestAnnouncements() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All Releases");

  const filtered =
    active === "All Releases"
      ? releases
      : releases.filter((r) => r.category === active);

  return (
    <section className="bg-[#F8F9FA] py-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-16 px-8">
        
        {/* Header & Tabs */}
        <div className="flex w-full flex-col lg:flex-row lg:items-end justify-between">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <h2 className="text-4xl font-semibold leading-[48px] text-zinc-900 justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                Latest Announcements
              </h2>
            </div>
            <div className="flex items-start gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-colors ${
                    active === tab
                      ? "bg-black text-white"
                      : "text-slate-600 hover:bg-black/5"
                  }`}
                >
                  <span className="text-center text-xs font-semibold leading-3 tracking-wider justify-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid w-full gap-6 md:grid-cols-2">
          {filtered.map((release) => (
            <div
              key={release.title}
              className="flex flex-col justify-between items-start bg-white p-8 outline outline-1 outline-offset-[-1px] outline-transparent hover:outline-slate-200 transition-all"
            >
              <div className="flex w-full flex-col items-start gap-4 pb-8">
                {/* Date & Badge */}
                <div className="flex w-full items-start justify-between">
                  <div className="text-xs font-semibold tracking-wider text-gray-500 leading-3 justify-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {release.date}
                  </div>
                  <div className="flex flex-col items-start justify-start rounded-xl bg-lime-300 px-3 py-1">
                    <div className="text-[10px] font-normal leading-4 text-lime-700 justify-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      APPROVED
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="flex flex-col items-start pt-2">
                  <h3 className="text-2xl font-semibold leading-8 text-zinc-900 justify-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                    {release.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="flex flex-col items-start overflow-hidden">
                  <p className="text-base font-normal leading-6 text-slate-600 justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {release.body}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex w-full items-center justify-start gap-4">
                <div className="flex flex-col items-start justify-start">
                  <a href="#" className="text-xs font-semibold tracking-wider leading-3 text-sky-600 transition hover:opacity-80 justify-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    READ FULL RELEASE
                  </a>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
                <div className="flex flex-col items-start justify-start">
                  <img src="/image/press/document.svg" alt="Document" className="h-5 w-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
