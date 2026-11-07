"use client";

import Link from "next/link";
import { ShieldCheck, Lock, Database } from "lucide-react";

const trustBadges = [
  { icon: <Lock size={16} className="text-white" />, label: "Evidence Ledger™" },
  { icon: <ShieldCheck size={16} className="text-white" />, label: "ACR Closure" },
  { icon: <Database size={16} className="text-white" />, label: "Data Residency Guaranteed" },
];

export default function TrustBanner() {
  return (
    <section className="w-full bg-cyan-700 px-6 py-10">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-8 sm:gap-12">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3">
              {badge.icon}
              <span
                className="text-white text-xs"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Link */}
        <Link
          href="#"
          className="flex items-center gap-2 text-white text-sm font-normal hover:text-white/80 transition-colors whitespace-nowrap"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Explore the Trust Center
          <span className="w-3.5 h-3.5 bg-white inline-block" />
        </Link>
      </div>
    </section>
  );
}
