"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

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

const documentationPages = [
  {
    name: "Documentation",
    description: "Core BSS architecture & data schemas",
    href: "/documentation",
    icon: "/image/Header/Vector.png",
  },
  {
    name: "API Reference",
    description: "RESTful docs with request/response examples",
    href: "/api-reference",
    icon: "/image/Header/SVG.png",
  },
  {
    name: "Developer Portal",
    description: "Step-by-step technical & commercial checklists",
    href: "/developer-portal",
    icon: "/image/Header/SVG (1).png",
  },
  {
    name: "Changelog",
    description: "Latest platform changes & changelog",
    href: "/changelog",
    icon: "/image/Header/SVG (2).png",
  },
];

const researchPages = [
  {
    name: "White Papers",
    description: "Deep technical & strategic blueprints",
    href: "/white-papers",
    icon: "/image/Header/SVG (3).png",
  },
  {
    name: "Case Studies",
    description: "Real operator migrations & outcomes",
    href: "/casestudies",
    icon: "/image/Header/SVG (4).png",
  },
  {
    name: "Blog",
    description: "Insights on governed monetization",
    href: "/blog-and-news",
    icon: "/image/Header/SVG (5).png",
  },
];

const companyPages = [
  { name: "About", description: "Our mission, vision, and core values", href: "/about", icon: "/image/Header/SVG.png" },
  { name: "Leadership", description: "Meet the executive team behind ZoikoNex", href: "/leadership", icon: "/image/Header/SVG (1).png" },
  { name: "Partners", description: "Global ecosystem and alliances", href: "/partners", icon: "/image/Header/SVG (2).png" },
  { name: "Careers", description: "Join us in building telecom infrastructure", href: "/careers", icon: "/image/Header/SVG (3).png" },
  { name: "Press & Media", description: "Latest news, press releases, and media kit", href: "/press-media", icon: "/image/Header/SVG (4).png" },
  { name: "Contact", description: "Get in touch with our global offices", href: "/contact", icon: "/image/Header/SVG (5).png" },
];

export default function Header() {
  const [openResources, setOpenResources] = useState(false);
  const [openSolutions, setOpenSolutions] = useState(false);
  const [openPlatform, setOpenPlatform] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const resourcesRef = useRef<HTMLDivElement | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const platformRef = useRef<HTMLDivElement | null>(null);
  const companyRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-sky-600" : "hover:text-sky-600";

  // Close all states on navigate or click outside
  const closeAllMenus = () => {
    setOpenPlatform(false);
    setOpenSolutions(false);
    setOpenResources(false);
    setOpenCompany(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (solutionsRef.current && !solutionsRef.current.contains(target)) {
        setOpenSolutions(false);
      }
      if (platformRef.current && !platformRef.current.contains(target)) {
        setOpenPlatform(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(target)) {
        setOpenResources(false);
      }
      if (companyRef.current && !companyRef.current.contains(target)) {
        setOpenCompany(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when mobile navigation window is visible
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" onClick={closeAllMenus} className="flex items-center shrink-0">
          <Image
            src="/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png"
            alt="ZoikoNex"
            width={160}
            height={44}
            className="w-auto h-8 md:h-10 object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation (Hidden on Mobile/Tablet screens below lg) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          
          {/* Platform Mega Menu */}
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
              <ChevronDown size={14} className={`transition-transform duration-300 ${openPlatform ? "rotate-180" : ""}`} />
            </Link>

            {openPlatform && (
              <div className="absolute top-[calc(100%-4px)] left-[-40px] w-[530px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex">
                  <div className="w-[300px] p-6 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">
                      MONETIZATION INFRASTRUCTURE
                    </h5>
                    <div className="space-y-4">
                      {platformPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-[230px] bg-gradient-to-b from-[#0B1E43] to-[#06122C] p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[#00B4D8] text-[10px] uppercase tracking-wider font-bold mb-2">Architecture</div>
                      <h4 className="text-white text-base font-extrabold leading-tight mb-4">18 domains, governed by design</h4>
                      <p className="text-slate-300 text-xs leading-normal mb-6">Explore our complete event-driven architectural blueprints built for real-time telecom engines.</p>
                    </div>
                    <Link href="/platform-architecture" onClick={closeAllMenus} className="text-xs font-semibold text-[#89D050] hover:underline flex items-center gap-1 group">
                      View Platform Architecture 
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
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
                openSolutions || pathname.startsWith("/solutions") ? "text-sky-600" : "hover:text-sky-600"
              }`}
            >
              Solutions
              <ChevronDown size={14} className={`transition-transform duration-300 ${openSolutions ? "rotate-180" : ""}`} />
            </Link>

            {openSolutions && (
              <div className="absolute top-[calc(100%-4px)] left-[-160px] w-[760px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex">
                  <div className="w-[265px] p-6 pr-4 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">BY OPERATOR MODEL</h5>
                    <div className="space-y-4">
                      {operatorModelPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-[265px] p-6 pl-5 pr-4 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">BY CAPABILITY</h5>
                    <div className="space-y-4">
                      {capabilityPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 p-1 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-[230px] bg-gradient-to-b from-[#0B1E43] to-[#06122C] p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-[#00B4D8] text-[10px] uppercase tracking-wider font-bold mb-2">Find Your Fit</div>
                      <h4 className="text-white text-base font-extrabold leading-tight mb-4">Built for your operator model</h4>
                      <div className="space-y-3 pt-1">
                        <div className="text-slate-300 text-xs font-medium hover:text-[#89D050] transition flex items-center justify-between group">
                          <Link href="/mvnolaunch" onClick={closeAllMenus} className="w-full flex items-center justify-between">
                            <span>I'm launching an MVNO</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89D050]">→</span>
                          </Link>
                        </div>
                        <div className="border-t border-white/10 pt-3 text-slate-300 text-xs font-medium hover:text-[#89D050] transition flex items-center justify-between group">
                          <Link href="/mnomoderinization1" onClick={closeAllMenus} className="w-full flex items-center justify-between">
                            <span>I run multiple brands</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#89D050]">→</span>
                          </Link>                        
                        </div>
                        <div className="border-t border-white/10 pt-3 text-slate-300 text-xs font-medium hover:text-[#89D050] transition flex items-center justify-between group">
                          <Link href="/esim-and-iot" onClick={closeAllMenus} className="w-full flex items-center justify-between">
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

          <Link href="/operators" className={isActive("/operators")}>Operators</Link>
          <Link href="/deployment" className={isActive("/deployment")}>Deployment</Link>
          <Link href="/trust" className={isActive("/trust")}>Trust</Link>

          {/* Resources Mega Menu Container */}
          <div
            className="relative py-5"
            ref={resourcesRef}
            onMouseEnter={() => setOpenResources(true)}
            onMouseLeave={() => setOpenResources(false)}
          >
            <Link
              href="/resources"
              onClick={() => setOpenResources(false)}
              className={`flex items-center gap-1 transition-colors duration-200 outline-none select-none ${
                openResources || pathname.startsWith("/resources") ? "text-sky-600" : "hover:text-sky-600"
              }`}
            >
              Resources
              <ChevronDown size={14} className={`transition-transform duration-300 ${openResources ? "rotate-180" : ""}`} />
            </Link>

            {openResources && (
              <div className="absolute top-[calc(100%-4px)] left-[-320px] w-[768px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex">
                  <div className="w-[250px] p-5 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">DOCUMENTATION & REFERENCE</h5>
                    <div className="space-y-2">
                      {documentationPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-[250px] p-5 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">RESEARCH & LEARNING</h5>
                    <div className="space-y-2">
                      {researchPages.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="w-[268px] bg-gradient-to-br from-[#071C4D] to-[#04102E] p-5 flex flex-col justify-between">
                    <div>
                      <div className="text-[#7DD3FC] text-[10px] uppercase tracking-wider font-bold mb-3">FEATURED WHITE PAPER</div>
                      <h4 className="text-white text-[18px] font-extrabold leading-[1.2] mb-3">Governed<br />Monetization:<br />A Sovereign<br />Blueprint</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">Tier-1 settlement precision in a cloud-native ecosystem.</p>
                    </div>
                    <div className="pt-4">
                      <Link href="/white-papers" onClick={closeAllMenus} className="text-white text-xs font-semibold hover:text-[#89D050] transition flex items-center gap-1 group">
                        Download White Paper 
                        <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Company Mega Menu Container */}
          <div
            className="relative py-5"
            ref={companyRef}
            onMouseEnter={() => setOpenCompany(true)}
            onMouseLeave={() => setOpenCompany(false)}
          >
            <Link
              href="/company"
              onClick={() => setOpenCompany(false)}
              className={`flex items-center gap-1 transition-colors duration-200 outline-none select-none ${
                openCompany || pathname.startsWith("/company") ? "text-sky-600" : "hover:text-sky-600"
              }`}
            >
              Company
              <ChevronDown size={14} className={`transition-transform duration-300 ${openCompany ? "rotate-180" : ""}`} />
            </Link>

            {openCompany && (
              <div className="absolute top-[calc(100%-4px)] right-0 w-[500px] bg-white rounded-2xl border border-slate-200 shadow-[0px_18px_50px_-12px_rgba(13,27,46,0.18)] overflow-hidden z-50">
                <div className="flex">
                  <div className="w-[250px] p-5 border-r border-slate-100">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1">COMPANY</h5>
                    <div className="space-y-2">
                      {companyPages.slice(0, 3).map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="w-[250px] p-5">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#667085] mb-4 pl-1 invisible">MORE</h5>
                    <div className="space-y-2">
                      {companyPages.slice(3).map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeAllMenus}
                          className="group flex gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition duration-150"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200 transition-colors">
                            <Image src={item.icon} alt={item.name} width={18} height={18} className="object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[#162540] text-sm font-semibold transition group-hover:text-sky-600">{item.name}</h3>
                            <p className="mt-0.5 text-[#667085] text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls Side Block */}
        <div className="flex items-center gap-3">
          <Link
            href="/platform-architecture"
            className="hidden sm:inline-block px-4 py-2 bg-white text-black rounded-xl text-xs font-semibold shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            View Platform Architecture
          </Link>
          <Link
            href="/request-a-demo"
            className="hidden md:inline-block px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-sky-700 transition"
          >
            Request a Demo
          </Link>

          {/* Hamburger Mobile Menu Toggle Button Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden focus:outline-none transition-colors"
            aria-label="Toggle navigation view menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Panel Navigation Overlay Drawer Component */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-20 bg-white z-40 border-t border-slate-100 flex flex-col lg:hidden overflow-y-auto">
          <div className="p-4 space-y-3 flex-1 pb-12">
            
            {/* Mobile Accordion - Platform */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setOpenPlatform(!openPlatform)}
                className="w-full flex items-center justify-between py-2 text-base font-bold text-[#162540]"
              >
                <span>Platform</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${openPlatform ? "rotate-180" : ""}`} />
              </button>
              {openPlatform && (
                <div className="mt-2 pl-2 space-y-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {platformPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center shrink-0">
                        <Image src={item.icon} alt={item.name} width={14} height={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion - Solutions */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setOpenSolutions(!openSolutions)}
                className="w-full flex items-center justify-between py-2 text-base font-bold text-[#162540]"
              >
                <span>Solutions</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${openSolutions ? "rotate-180" : ""}`} />
              </button>
              {openSolutions && (
                <div className="mt-2 pl-2 space-y-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider">OPERATOR MODELS</div>
                  {operatorModelPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center shrink-0">
                        <Image src={item.icon} alt={item.name} width={14} height={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{item.name}</h4>
                      </div>
                    </Link>
                  ))}
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider pt-2">CAPABILITIES</div>
                  {capabilityPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center shrink-0">
                        <Image src={item.icon} alt={item.name} width={14} height={14} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{item.name}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Static Direct Links */}
            <Link href="/operators" onClick={closeAllMenus} className="block py-2 text-base font-bold text-[#162540] border-b border-slate-100">Operators</Link>
            <Link href="/deployment" onClick={closeAllMenus} className="block py-2 text-base font-bold text-[#162540] border-b border-slate-100">Deployment</Link>
            <Link href="/trust" onClick={closeAllMenus} className="block py-2 text-base font-bold text-[#162540] border-b border-slate-100">Trust</Link>

            {/* Mobile Accordion - Resources */}
            <div className="border-b border-slate-100 pb-2">
              <button 
                onClick={() => setOpenResources(!openResources)}
                className="w-full flex items-center justify-between py-2 text-base font-bold text-[#162540]"
              >
                <span>Resources</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${openResources ? "rotate-180" : ""}`} />
              </button>
              {openResources && (
                <div className="mt-2 pl-2 space-y-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider">DOCS</div>
                  {documentationPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div><h4 className="text-xs font-semibold text-slate-900">{item.name}</h4></div>
                    </Link>
                  ))}
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider pt-2">RESEARCH</div>
                  {researchPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div><h4 className="text-xs font-semibold text-slate-900">{item.name}</h4></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Accordion - Company */}
            <div className="border-b border-slate-100 pb-2">
              <button
                onClick={() => setOpenCompany(!openCompany)}
                className="w-full flex items-center justify-between py-2 text-base font-bold text-[#162540]"
              >
                <span>Company</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${openCompany ? "rotate-180" : ""}`} />
              </button>
              {openCompany && (
                <div className="mt-2 pl-2 space-y-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 tracking-wider">COMPANY INFO</div>
                  {companyPages.map((item) => (
                    <Link key={item.name} href={item.href} onClick={closeAllMenus} className="flex gap-3">
                      <div><h4 className="text-xs font-semibold text-slate-900">{item.name}</h4></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Direct Mobile CTAs placed at base of layout menu container panel */}
            <div className="pt-4 space-y-3">
              <Link
                href="/request-a-demo"
                onClick={closeAllMenus}
                className="block md:hidden w-full text-center py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-sky-700 transition"
              >
                Request a Demo
              </Link>
              <Link
                href="/platform-architecture"
                onClick={closeAllMenus}
                className="block sm:hidden w-full text-center py-3 bg-white text-black border border-slate-200 rounded-xl text-sm font-semibold shadow-sm hover:bg-slate-50 transition"
              >
                View Platform Architecture
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}