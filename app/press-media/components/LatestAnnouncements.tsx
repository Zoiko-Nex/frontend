"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

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
    <section className="bg-[#F8F9FB] py-12 font-['Plus_Jakarta_Sans',sans-serif] lg:py-20">
      <div className="mx-auto max-w-275 px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <h2 className="mb-4 text-[26px] font-bold text-[#1A2B4A] sm:mb-6 lg:text-[32px]">
          Latest Announcements
        </h2>

        {/* Filter tabs */}
        <div className="mb-7 flex flex-wrap items-center gap-2 lg:mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`rounded-full px-5 py-[9px] text-[13px] font-semibold transition ${
                active === tab
                  ? "bg-[#111827] text-white"
                  : "text-[#4B5563] hover:text-[#1A2B4A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((release) => (
            <div
              key={release.title}
              className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#C8DBF0] hover:shadow-sm sm:p-8"
            >
              {/* Date + badge row */}
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[13px] text-[#94A3B8]">
                  {release.date}
                </span>
                <span className="rounded-full bg-[#22C55E] px-3 py-[3px] text-[11px] font-bold uppercase tracking-wide text-white">
                  Approved
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-3 text-[17px] font-bold leading-[1.3] text-[#1A2B4A] sm:text-[20px]">
                {release.title}
              </h3>

              {/* Body */}
              <p className="flex-1 text-[14px] leading-[1.7] text-[#64748B]">
                {release.body}
              </p>

              {/* Read link */}
              <div className="mt-6 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                <a
                  href="#"
                  className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[1.5px] text-[#1778C8] transition hover:text-[#1461A8]"
                >
                  Read Full Release
                </a>
                <FileText size={16} className="text-[#94A3B8]" strokeWidth={1.8} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
