"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const solutionPages = [
  {
    name: "MVNO Launch",
    description: "Launch operators in weeks.",
    href: "/mvnolaunch",
  },
  {
    name: "Network API",
    description: "Monetize network capabilities.",
    href: "/networkapi",
  },
  {
    name: "MNO Modernization",
    description: "Transform legacy infrastructure.",
    href: "/mnomoderinization1",
  },
  {
    name: "MNO Transformation",
    description: "Modernize telecom operations.",
    href: "/mnomoderinization2",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "text-sky-600" : "hover:text-sky-600";
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png"
            alt="ZoikoNex"
            width={180}
            height={50}
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="/platform"
            className={`flex items-center gap-1 ${isActive("/platform")}`}
          >
            Platform
            <ChevronDown size={14} />
          </Link>

          {/* Solutions Mega Menu */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className={`flex items-center gap-1 ${pathname.startsWith("/solutions") || pathname.startsWith("/mvno") || pathname.startsWith("/mno") || pathname.startsWith("/network") ? "text-sky-600" : "hover:text-sky-600"}`}>
              Solutions

              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                className="
                  absolute top-full left-[-180px]
                  mt-3
                  w-[700px]
                  bg-[#162540]
                  rounded-xl
                  border border-cyan-500/10
                  shadow-2xl
                  overflow-hidden
                  z-50
                "
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/10">
                  <span className="text-[#89D050] text-xs font-semibold tracking-[3px]">
                    SOLUTIONS
                  </span>

                  <Link
                    href="/solutions"
                    onClick={() => setOpen(false)}
                    className="text-[#89D050] text-sm font-medium"
                  >
                    View All Solutions →
                  </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-8 p-8">
                  {solutionPages.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex gap-4"
                    >
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <div className="grid grid-cols-2 gap-1">
                          <span className="w-2 h-2 bg-[#89D050] rounded-sm"></span>
                          <span className="w-2 h-2 bg-[#89D050] rounded-sm"></span>
                          <span className="w-2 h-2 bg-[#89D050] rounded-sm"></span>
                          <span className="w-2 h-2 bg-[#89D050] rounded-sm"></span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-white text-xm font-semibold group-hover:text-[#89D050] transition">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-slate-400 text-sm leading-6">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/operators" className={isActive("/operators")}>
            Operators
          </Link>

          <Link href="/deployment" className={isActive("/deployment")}>
            Deployment
          </Link>

          <Link href="/trust" className={isActive("/trust")}>
            Trust
          </Link>

          <Link
            href="/resources"
            className={`flex items-center gap-1 ${isActive("/resources")}`}
          >
            Resources
            <ChevronDown size={14} />
          </Link>

          <Link href="/company" className={isActive("/company")}>
            Company
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/platform-architecture"
            className="px-3 py-2 bg-white text-black rounded-xl text-sm font-semibold shadow-md border"
          >
            View Platform Architecture
          </Link>

          <Link
            href="/request-a-demo"
            className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-md"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}