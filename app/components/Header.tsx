"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const solutionPages = [
  {
    name: "MVNO Launch",
    href: "/mvnolaunch",
  },
  {
    name: "Network API",
    href: "/networkapi",
  },
  {
    name: "MNO Modernization",
    href: "/mnomoderinization1",
  },
  {
    name: "MNO Modernization",
    href: "/mnomoderinization2",
  },
];

export default function Header() {
     const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
       
  <Link href="/" className="flex items-center shrink-0">
    <Image
      src="/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png"
      alt="ZoikoNex - Governed Telecom Monetization"
      width={180}
      height={50}
    />
  </Link>

                {/* Navigation */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <Link href="/platform" className="flex items-center gap-1">
                        Platform
                        <ChevronDown size={14} />
                    </Link>
                   

<div className="relative flex items-center gap-1">
      {/* Solutions Page */}
      <Link
        href="/solutions"
        className="text-sm font-medium text-slate-600 hover:text-sky-600"
      >
        Solutions
      </Link>

      {/* Arrow */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1"
      >
        <ChevronDown
          size={14}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute top-full left-0 mt-2
            w-56 bg-white
            border border-slate-200
            rounded-lg shadow-lg
            z-50
          "
        >
          {solutionPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="
                block px-4 py-3
                text-sm text-slate-700
                hover:bg-slate-50
              "
              onClick={() => setOpen(false)}
            >
              {page.name}
            </Link>
          ))}
        </div>
      )}
    </div>
                    <Link href="#">Operators</Link>
                    <Link href="#">Deployment</Link>
                    <Link href="#">Trust</Link>
                    <Link href="/resources" className="flex items-center gap-1">
                        Resources
                        <ChevronDown size={14} />
                    </Link>
                    <Link href="#">Company</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2 bg-white text-black rounded-xl text-sm font-semibold shadow-md">
                        View Platform Architecture
                    </button>

                    <button className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-md">
                        Request a Demo
                    </button>
                </div>
            </div>
        </header>
    );
}
