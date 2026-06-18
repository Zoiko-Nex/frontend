"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

const platformPages = [
  {
    name: "Architecture Overview",
    description: "GTMI monetization framework with decoupled planes",
    href: "/platform-architecture",
    icon: "/image/Header/Frame (7).png",
  },
  {
    name: "18 Domains",
    description: "TM Forum aligned functional decomposition blocks",
    href: "/18domains",
    icon: "/image/Header/Frame (8).png",
  },
  {
    name: "Jurisdiction Engine",
    description: "Multi-currency ledger with localized compliance residency",
    href: "/globaljurisdiction",
    icon: "/image/Header/Frame (9).png",
  },
  {
    name: "Evidence Ledger",
    description: "Immutable auditing tracking for cryptographic billing states",
    href: "/evidence",
    icon: "/image/Header/Frame (10).png",
  },
];

const operatorModelPages = [
  {
    name: "MVNO Launch",
    description: "Turnkey monetization stack for rapid market entry",
    href: "/mvnolaunch",
    icon: "/image/Header/Frame.png",
  },
  {
    name: "MVNE & Multi-Brand",
    description: "Multi-tenant governance across brands",
    href: "/mnomoderinization1",
    icon: "/image/Header/Frame (1).png",
  },
  {
    name: "MNO Modernization",
    description: "Zero-downtime migration from legacy BSS",
    href: "/mnomoderinization2",
    icon: "/image/Header/Frame (2).png",
  },
  {
    name: "eSIM & IoT",
    description: "Global connectivity orchestration",
    href: "/esim-and-iot",
    icon: "/image/Header/Frame (3).png",
  },
];

const capabilityPages = [
  {
    name: "Network API",
    description: "CAMARA-compliant API monetization",
    href: "/networkapi",
    icon: "/image/Header/Frame (4).png",
  },
  {
    name: "Revenue Assurance",
    description: "CDR reconciliation and fraud analytics",
    href: "/revenueassurance",
    icon: "/image/Header/Frame (5).png",
  },
  {
    name: "Global Jurisdiction Billing",
    description: "Multi-currency ledger with compliance",
    href: "/globaljurisdiction",
    icon: "/image/Header/Frame (6).png",
  },
];

export default function Header() {
  const [openSolutions, setOpenSolutions] = useState(false);
  const [openPlatform, setOpenPlatform] = useState(false);
  
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const platformRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-sky-600" : "hover:text-sky-600";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (solutionsRef.current && !solutionsRef.current.contains(target)) {
        setOpenSolutions(false);
      }
      if (platformRef.current && !platformRef.current.contains(target)) {
        setOpenPlatform(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          
          {/* Platform Mega Menu Container */}
          <div 
            className="relative py-5" 
            ref={platformRef}
            onMouseEnter={() => setOpenPlatform(true)}
            onMouseLeave={() => setOpenPlatform(false)}
          >
            <Link 
              href="/platform" 
              onClick={() => setOpenPlatform(false)}
              className={`flex items-center gap-1 transition-colors duration-200 outline-none select-none ${
                openPlatform || pathname.startsWith("/platform") ? "text-sky-600" : "hover:text-sky-600"
              }`}
            >
              Platform
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${openPlatform ? "rotate-180" : ""}`}
              />
            </Link>

            {openPlatform && (
              <div className="absolute top-[calc(100%-4px)] left-[-40px] w-[530px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex min-h-[360px]">
                  
                  {/* Left Group (Single Column Layout) */}
                  <div className="w-[300px] p-6 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">
                      MONETIZATION INFRASTRUCTURE
                    </h5>
                    <div className="space-y-4">
                      {platformPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpenPlatform(false)}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Blue Accent Feature Card Block */}
                  <div className="w-[230px] bg-gradient-to-b from-[#0B1E43] to-[#06122C] p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[#00B4D8] text-[10px] uppercase tracking-wider font-bold mb-2">
                        Architecture
                      </div>
                      <h4 className="text-white text-base font-extrabold leading-tight mb-6">
                        18 domains, governed by design
                      </h4>
                      <p className="text-slate-300 text-xs leading-normal mb-6">
                        Explore our complete event-driven architectural blueprints built for real-time telecom engines.
                      </p>
                      <Link 
                        href="/platform-architecture" 
                        onClick={() => setOpenPlatform(false)}
                        className="text-xs font-semibold text-[#89D050] hover:underline flex items-center gap-1 group"
                      >
                        View Platform Architecture 
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Solutions Mega Menu Container */}
          <div 
            className="relative py-5" 
            ref={solutionsRef}
            onMouseEnter={() => setOpenSolutions(true)}
            onMouseLeave={() => setOpenSolutions(false)}
          >
            <Link
              href="/solutions"
              onClick={() => setOpenSolutions(false)}
              className={`flex items-center gap-1 transition-colors duration-200 outline-none select-none ${
                openSolutions ||
                pathname === "/solutions" ||
                pathname.startsWith("/mvnolaunch") ||
                pathname.startsWith("/network") ||
                pathname.startsWith("/mno") ||
                pathname.startsWith("/mvne") ||
                pathname.startsWith("/esimiot") ||
                pathname.startsWith("/revenueassurance") ||
                pathname.startsWith("/globaljurisdiction")
                  ? "text-sky-600"
                  : "hover:text-sky-600"
              }`}
            >
              Solutions
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${openSolutions ? "rotate-180" : ""}`}
              />
            </Link>

            {openSolutions && (
              <div className="absolute top-[calc(100%-4px)] left-[-160px] w-[760px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex min-h-[360px]">
                  
                  {/* Left Column Group: By Operator Model */}
                  <div className="w-[265px] p-6 pr-4 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">
                      BY OPERATOR MODEL
                    </h5>
                    <div className="space-y-4">
                      {operatorModelPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpenSolutions(false)}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Middle Column Group: By Capability */}
                  <div className="w-[265px] p-6 pl-5 pr-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">
                      BY CAPABILITY
                    </h5>
                    <div className="space-y-4">
                      {capabilityPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setOpenSolutions(false)}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">
                              {item.name}
                            </h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Blue Action Feature Card Block */}
                  <div className="w-[230px] bg-gradient-to-b from-[#0B1E43] to-[#06122C] p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[#00B4D8] text-[10px] uppercase tracking-wider font-bold mb-2">
                        Find Your Fit
                      </div>
                      <h4 className="text-white text-base font-extrabold leading-tight mb-6">
                        Built for your operator model
                      </h4>

                      <div className="space-y-3 pt-1">
                        <div className="text-slate-300 text-xs font-medium hover:text-[#89D050] cursor-pointer transition flex items-center justify-between group">
                          <Link href="/mvnolaunch" onClick={() => setOpenSolutions(false)} className="w-full flex items-center justify-between">
                            <span>I'm launching an MVNO</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89D050]">→</span>
                          </Link>
                        </div>
                        <div className="border-t border-white/10 pt-3 text-slate-300 text-xs font-medium hover:text-[#89D050] cursor-pointer transition flex items-center justify-between group">
                          <Link href="/mnomoderinization1" onClick={() => setOpenSolutions(false)} className="w-full flex items-center justify-between">
                            <span>I run multiple brands</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89D050]">→</span>
                          </Link>                        
                        </div>
                        <div className="border-t border-white/10 pt-3 text-slate-300 text-xs font-medium hover:text-[#89D050] cursor-pointer transition flex items-center justify-between group">
                          <Link href="/esim-and-iot" onClick={() => setOpenSolutions(false)} className="w-full flex items-center justify-between">
                            <span>I'm scaling eSIM / IoT</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89D050]">→</span>
                          </Link>                        
                        </div>
                      </div>
                    </div>
                  </div>

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
          <Link href="/resources" className={`flex items-center gap-1 ${isActive("/resources")}`}>
            Resources
            <ChevronDown size={14} />
          </Link>
          <Link href="/company" className={isActive("/company")}>
            Company
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/platform-architecture"
            className="px-4 py-2 bg-white text-black rounded-xl text-xs font-semibold shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            View Platform Architecture
          </Link>
          <Link
            href="/request-a-demo"
            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-sky-700 transition"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </header>
  );
}