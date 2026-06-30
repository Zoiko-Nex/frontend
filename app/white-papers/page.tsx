// import React from "react";
// import Link from "next/link";

// export default function WhitePapersPage() {
//   return (
//     <div className="w-full relative bg-stone-50 flex flex-col items-start">
//       {/* Main content area with sidebar */}
//       <div className="w-full flex">
//         {/* Sidebar */}
//         <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-slate-200 flex-col pt-8 px-6 flex-shrink-0">
//           <div className="mb-8">
//             <div className="text-zinc-900 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">ZoikoNex Portal</div>
//             <div className="text-slate-500 text-[10px] font-normal font-['JetBrains_Mono'] uppercase tracking-wider mt-1">INSTITUTIONAL ACCESS</div>
//           </div>
//           <nav className="flex flex-col gap-1">
//             <Link href="/resources" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium font-['Plus_Jakarta_Sans'] hover:bg-stone-100 transition-colors">
//               <img src="/image/white/chart.svg" alt="" className="w-4 h-4" />
//               All Research
//             </Link>
//             <Link href="/white-papers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sky-600/10 text-sky-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">
//               <img src="/image/white/document.svg" alt="" className="w-4 h-4" />
//               Whitepapers
//             </Link>
//             <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium font-['Plus_Jakarta_Sans'] hover:bg-stone-100 transition-colors">
//               <img src="/image/white/terminal.svg" alt="" className="w-4 h-4" />
//               Technical Briefs
//             </Link>
//             <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium font-['Plus_Jakarta_Sans'] hover:bg-stone-100 transition-colors">
//               <img src="/image/white/shield.svg" alt="" className="w-4 h-4" />
//               Buyer Proof Packs
//             </Link>
//             <Link href="/casestudies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-sm font-medium font-['Plus_Jakarta_Sans'] hover:bg-stone-100 transition-colors">
//               <img src="/image/white/briefing.svg" alt="" className="w-4 h-4" />
//               Case Studies
//             </Link>
//           </nav>
//         </aside>

//         {/* Main content */}
//         <div className="flex-1 min-w-0">
//           {/* Hero Section */}
//           <section className="w-full px-6 py-24 bg-black flex flex-col justify-center items-center overflow-hidden">
//             <div className="w-full max-w-[1024px] pt-0.5 flex flex-col justify-start items-start gap-6">
//               <div className="px-4 py-1 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/30 inline-flex justify-start items-start">
//                 <div className="text-white text-[10px] font-normal font-['JetBrains_Mono'] leading-4 tracking-wide">INTELLECTUAL CAPITAL</div>
//               </div>
//               <div className="self-stretch pt-[1.20px] flex flex-col justify-start items-start">
//                 <h1 className="self-stretch text-white text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-[66px]">Sovereign Intelligence.<br />Institutional Proof.</h1>
//               </div>
//               <div className="w-full max-w-[672px] pb-[0.60px] flex flex-col justify-start items-start">
//                 <p className="text-white/70 text-lg font-normal font-['Inter'] leading-7">Deep-dive technical insights into Tier-1 BSS transformations, sovereign cloud compliance, and mathematical network optimization for global telecom operators.</p>
//               </div>
//             </div>
//           </section>

//           {/* Featured Whitepaper Section */}
//           <section className="w-full px-6 py-12">
//             <div className="w-full max-w-[1136px] mx-auto">
//               <div className="relative rounded-lg overflow-hidden bg-white flex flex-col md:flex-row shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]">
//                 {/* Left: Image */}
//                 <div className="w-full md:w-1/2 min-h-[400px] relative">
//                   <img src="/image/white/featured-whitepaper.png" alt="Server infrastructure" className="absolute inset-0 w-full h-full object-cover" />
//                   <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
//                   <div className="relative z-10 p-8">
//                     <div className="px-3 py-1.5 bg-lime-500 rounded text-black text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider w-fit">NEW RELEASE</div>
//                   </div>
//                 </div>
//                 {/* Right: Content */}
//                 <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
//                   <div className="pb-2">
//                     <div className="text-sky-600 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider">FEATURED ARCHITECTURE GUIDE</div>
//                   </div>
//                   <div className="pb-4">
//                     <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">The Sovereign BSS<br />Architecture Guide -<br />2024 Edition</h2>
//                   </div>
//                   <div className="pb-8">
//                     <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">An exhaustive 80-page framework for transitioning legacy monolithic billing systems into sovereign, microservices-led ecosystems. Includes security…</p>
//                   </div>
//                   <div className="pb-8 flex items-center gap-0">
//                     <div className="flex items-center">
//                       <img src="/image/white/clock.svg" alt="" className="w-5 h-5" />
//                       <span className="pl-2 text-zinc-900 text-sm font-semibold font-['Inter'] leading-4">24 Min Read</span>
//                     </div>
//                     <div className="pl-6 flex items-center">
//                       <img src="/image/white/file-attachment.svg" alt="" className="w-3.5 h-5" />
//                       <span className="pl-2 text-zinc-900 text-sm font-semibold font-['Inter'] leading-4">PDF (14.2 MB)</span>
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-4">
//                     <button className="px-8 py-3 bg-cyan-700 hover:bg-cyan-800 transition-colors rounded-lg inline-flex items-center justify-center gap-2">
//                       <img src="/image/white/download-white.svg" alt="" className="w-3 h-3" />
//                       <span className="text-center text-white text-base font-normal font-['Inter'] leading-6">Download PDF</span>
//                     </button>
//                     <button className="px-8 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 hover:bg-stone-50 transition-colors flex justify-center items-center">
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Full Briefing</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Research Library Section */}
//           <section className="w-full px-6 py-12">
//             <div className="w-full max-w-[1136px] mx-auto flex flex-col gap-10">
//               {/* Header Row */}
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
//                 <div className="flex-1 max-w-[672px] flex flex-col gap-6">
//                   <h2 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Research Library</h2>
//                   <div className="relative w-full">
//                     <div className="w-full pl-12 pr-4 py-4 bg-stone-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-start overflow-hidden">
//                       <input type="text" placeholder="Search by topic, keyword, or document ID..." className="flex-1 bg-transparent text-gray-500 text-base font-normal font-['Inter'] outline-none" />
//                     </div>
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2">
//                       <img src="/image/white/search.svg" alt="" className="w-4 h-4" />
//                     </div>
//                   </div>
//                 </div>
//                 {/* Grid / List Toggle */}
//                 <div className="p-1.5 bg-stone-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center">
//                   <div className="px-4 py-2 bg-white rounded-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center">
//                     <span className="text-center text-black text-sm font-semibold font-['Inter'] leading-4">Grid</span>
//                   </div>
//                   <div className="pl-2">
//                     <div className="px-4 py-2 rounded-sm flex items-center cursor-pointer">
//                       <span className="text-center text-zinc-700 text-sm font-semibold font-['Inter'] leading-4">List</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Tabs */}
//               <div className="flex flex-wrap gap-3 pt-2">
//                 <button className="px-6 py-2 bg-black rounded-xl flex items-center">
//                   <span className="text-center text-white text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">ALL RESEARCH</span>
//                 </button>
//                 <button className="px-6 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
//                   <span className="text-center text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">WHITEPAPERS</span>
//                 </button>
//                 <button className="px-6 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
//                   <span className="text-center text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">TECHNICAL BRIEFS</span>
//                 </button>
//                 <button className="px-6 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
//                   <span className="text-center text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">CASE-LED RESEARCH</span>
//                 </button>
//                 <button className="px-6 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
//                   <span className="text-center text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">ECONOMIC ANALYSIS</span>
//                 </button>
//               </div>

//               {/* Research Cards Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
//                 {/* Card 1 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/document.svg" alt="" className="w-3.5 h-5" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">WP-2024-012</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Cloud Sovereignty in High-Stakes<br />Markets</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Examining the legal and technical boundaries of data residency for Tier-1 telcos operating across multiple jurisdictions.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">12 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/download.svg" alt="" className="w-3 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card 2 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/terminal-dark.svg" alt="" className="w-5 h-3.5" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">TB-2023-088</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Real-time BSS: Latency<br />Benchmarks</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Performance benchmarks for real-time rating and charging engines under a 100M+ subscriber load with sub-5ms response targets.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">18 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/briefing.svg" alt="" className="w-3.5 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Briefing</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card 3 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/document.svg" alt="" className="w-3.5 h-5" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">CL-2024-004</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Zero-Touch Provisioning Study</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Case study on reducing operational overhead by 40% through automated subscriber lifecycle management and AI-driven workflows.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">10 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/download.svg" alt="" className="w-3 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card 4 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/chart.svg" alt="" className="w-4 h-4" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">WP-2024-009</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Modernizing Legacy Debt in BSS</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">A risk mitigation strategy for decommissioning legacy mainframes while maintaining 99.999% availability during technical cutover.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">32 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/download.svg" alt="" className="w-3 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card 5 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/document.svg" alt="" className="w-3.5 h-5" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">TB-2024-022</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">API First: The New Standard</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Why API-first design is the prerequisite for participating in the global digital economy and enabling third-party ecosystem growth.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">15 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-lime-800 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/briefing.svg" alt="" className="w-3.5 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Briefing</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Card 6 */}
//                 <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start pb-6">
//                       <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
//                         <img src="/image/white/chart.svg" alt="" className="w-4 h-4" />
//                       </div>
//                       <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">CL-2023-112</span>
//                     </div>
//                     <div className="pb-3">
//                       <h3 className="text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">5G Monetization Strategies</h3>
//                     </div>
//                     <div className="pb-8">
//                       <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Analyzing successful 5G standalone slice monetization models across the APAC and European Tier-1 carrier markets.</p>
//                     </div>
//                   </div>
//                   <div className="pt-6 border-t border-slate-200 flex flex-col gap-6">
//                     <div className="flex justify-between items-center">
//                       <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">22 MIN READ</span>
//                       <div className="flex items-center gap-1">
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-sky-600 rounded-full"></div>
//                         <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
//                       </div>
//                     </div>
//                     <button className="w-full py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
//                       <img src="/image/white/download.svg" alt="" className="w-3 h-3" />
//                       <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Pagination */}
//               <div className="pt-6 flex justify-center items-center gap-0">
//                 <div className="w-10 h-10 opacity-30 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center">
//                   <img src="/image/white/chevron-left.svg" alt="Previous" className="w-1.5 h-2.5" />
//                 </div>
//                 <div className="pl-4">
//                   <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
//                     <span className="text-center text-white text-base font-normal font-['Inter'] leading-6">1</span>
//                   </div>
//                 </div>
//                 <div className="pl-4">
//                   <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
//                     <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">2</span>
//                   </div>
//                 </div>
//                 <div className="pl-4">
//                   <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
//                     <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">3</span>
//                   </div>
//                 </div>
//                 <div className="pl-4">
//                   <span className="text-zinc-500 text-base font-normal font-['Inter'] leading-6">...</span>
//                 </div>
//                 <div className="pl-4">
//                   <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
//                     <span className="text-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">12</span>
//                   </div>
//                 </div>
//                 <div className="pl-4">
//                   <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center hover:bg-stone-50 transition-colors cursor-pointer">
//                     <img src="/image/white/chevron-right.svg" alt="Next" className="w-1.5 h-2.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Newsletter / CTA Section */}
//           <section className="w-full px-6 md:px-16 py-28 bg-zinc-100 flex flex-col justify-center items-center gap-8">
//             <div className="w-full max-w-[896px] flex flex-col justify-start items-center gap-3.5">
//               <h2 className="text-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Never miss a Tier-1 breakthrough.</h2>
//               <p className="text-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">Subscribe to our Institutional Intel feed for monthly executive summaries of new research and sovereign BSS architecture updates.</p>
//               <div className="w-full max-w-[576px] pt-6 flex flex-col sm:flex-row justify-start items-stretch gap-4">
//                 <div className="flex-1 px-6 py-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-start overflow-hidden">
//                   <img src="/image/white/email.svg" alt="" className="w-4 h-3 mt-1 mr-3 flex-shrink-0" />
//                   <input type="email" placeholder="Institutional email address" className="w-full bg-transparent text-gray-500 text-base font-normal font-['Inter'] outline-none" />
//                 </div>
//                 <button className="px-8 py-4 bg-cyan-700 hover:bg-cyan-800 transition-colors rounded-lg flex items-center justify-center whitespace-nowrap">
//                   <span className="text-center text-white text-base font-normal font-['Inter'] leading-6">Join Intelligence Feed</span>
//                 </button>
//               </div>
//               <div className="pt-2.5">
//                 <span className="text-center text-zinc-700/60 text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">GDPR COMPLIANT. ZERO TRACKING. INSTITUTIONAL GRADE PRIVACY.</span>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import Link from "next/link";

export default function WhitePapersPage() {
  return (
    <div className="w-full relative bg-stone-50 flex flex-col items-start">
      {/* Main content area with sidebar */}
      <div className="w-full flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 min-h-screen bg-white border-r border-slate-200 flex-col pt-8 px-4 flex-shrink-0">
          <div className="mb-6 px-2">
            <div className="text-zinc-900 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">ZoikoNex Portal</div>
            <div className="text-slate-500 text-[10px] font-normal font-['JetBrains_Mono'] uppercase tracking-wider mt-1">INSTITUTIONAL ACCESS</div>
          </div>
          <nav className="flex flex-col gap-0.5">
            <Link href="/resources" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] tracking-wider hover:bg-stone-100 transition-colors">
              <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="5" height="5" rx="0.5" /><rect x="9" y="2" width="5" height="5" rx="0.5" /><rect x="2" y="9" width="5" height="5" rx="0.5" /><rect x="9" y="9" width="5" height="5" rx="0.5" />
              </svg>
              All Research
            </Link>
            <Link href="/white-papers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-stone-200 text-black text-xs font-semibold font-['JetBrains_Mono'] tracking-wider">
              <svg className="w-3.5 h-5 text-black flex-shrink-0" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 1h7l3 3v15H2V1z" /><path d="M9 1v3h3" />
              </svg>
              Whitepapers
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] tracking-wider hover:bg-stone-100 transition-colors">
              <svg className="w-5 h-3.5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 20 14" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="18" height="12" rx="1" /><path d="M4 5h4M4 9h8" />
              </svg>
              Technical Briefs
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] tracking-wider hover:bg-stone-100 transition-colors">
              <svg className="w-3.5 h-5 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 1L2 4v8l5 3 5-3V4L7 1z" />
              </svg>
              Buyer Proof Packs
            </Link>
            <Link href="/casestudies" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] tracking-wider hover:bg-stone-100 transition-colors">
              <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="12" height="12" rx="1" /><path d="M5 8h6M5 5h6M5 11h4" />
              </svg>
              Case Studies
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Hero Section */}
          <section className="w-full px-8 pt-20 pb-36 bg-black flex flex-col justify-center items-start overflow-hidden relative">
            <div className="w-full max-w-[1024px] flex flex-col justify-start items-start gap-6">
              <div className="px-4 py-1 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/30 inline-flex justify-start items-start">
                <div className="text-white text-[10px] font-normal font-['JetBrains_Mono'] leading-4 tracking-wide">INTELLECTUAL CAPITAL</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <h1 className="self-stretch text-white text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight">Sovereign Intelligence.<br />Institutional Proof.</h1>
              </div>
              <div className="w-full max-w-[600px] flex flex-col justify-start items-start">
                <p className="text-white/70 text-lg font-normal font-['Inter'] leading-7">Deep-dive technical insights into Tier-1 BSS transformations, sovereign cloud compliance, and mathematical network optimization for global telecom operators.</p>
              </div>
            </div>
          </section>

          {/* Featured Whitepaper Card — overlaps hero */}
          <section className="w-full px-8 -mt-24 mb-4 relative z-10">
            <div className="w-full max-w-[1100px] mx-auto">
              <div className="rounded-lg overflow-hidden bg-white flex flex-col md:flex-row shadow-[0px_8px_40px_0px_rgba(0,0,0,0.18)] outline outline-1 outline-offset-[-1px] outline-slate-200">
                {/* Left: Image */}
                <div className="w-full md:w-[49%] min-h-[360px] relative flex-shrink-0">
                  <img
                    src="/image/white/featured-whitepaper.png"
                    alt="Server infrastructure"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent"></div>
                  <div className="relative z-10 p-6">
                    <div className="px-3 py-1 bg-cyan-700 rounded-xl inline-flex">
                      <span className="text-white text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider">NEW RELEASE</span>
                    </div>
                  </div>
                </div>
                {/* Right: Content */}
                <div className="w-full md:w-[51%] p-8 flex flex-col justify-center">
                  <div className="pb-2">
                    <div className="text-sky-600 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">FEATURED ARCHITECTURE GUIDE</div>
                  </div>
                  <div className="pb-4">
                    <h2 className="text-black text-3xl md:text-4xl font-semibold font-['Hanken_Grotesk'] leading-tight">The Sovereign BSS<br />Architecture Guide -<br />2024 Edition</h2>
                  </div>
                  <div className="pb-6">
                    <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">An exhaustive 80-page framework for transitioning legacy monolithic billing systems into sovereign, microservices-led ecosystems. Includes security…</p>
                  </div>
                  <div className="pb-6 flex items-center gap-0">
                    <div className="flex items-center gap-2">
                      {/* Clock icon */}
                      <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="10" cy="10" r="8" /><path d="M10 6v4l3 2" />
                      </svg>
                      <span className="text-zinc-900 text-sm font-semibold font-['Inter'] leading-4">24 Min Read</span>
                    </div>
                    <div className="pl-6 flex items-center gap-2">
                      {/* File icon */}
                      <svg className="w-3.5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 1h7l3 3v15H2V1z" /><path d="M9 1v3h3" />
                      </svg>
                      <span className="text-zinc-900 text-sm font-semibold font-['Inter'] leading-4">PDF (14.2 MB)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="px-8 py-3 bg-cyan-700 hover:bg-cyan-800 transition-colors rounded-lg inline-flex items-center justify-center gap-2">
                      {/* Download icon */}
                      <svg className="w-3 h-3 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8zM0 10h12v2H0v-2z" />
                      </svg>
                      <span className="text-white text-base font-normal font-['Inter'] leading-6">Download PDF</span>
                    </button>
                    <button className="px-8 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 hover:bg-stone-50 transition-colors flex justify-center items-center">
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Full Briefing</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Research Library Section */}
          <section className="w-full px-8 py-12">
            <div className="w-full max-w-[1136px] mx-auto flex flex-col gap-8">
              {/* Header Row */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex-1 max-w-[672px] flex flex-col gap-5">
                  <h2 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Research Library</h2>
                  <div className="relative w-full">
                    <div className="w-full pl-10 pr-4 py-4 bg-stone-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search by topic, keyword, or document ID..."
                        className="flex-1 bg-transparent text-gray-500 text-base font-normal font-['Inter'] outline-none"
                      />
                    </div>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Grid / List Toggle */}
                <div className="p-1.5 bg-stone-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center flex-shrink-0">
                  <div className="px-4 py-2 bg-white rounded-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center cursor-pointer">
                    <span className="text-black text-sm font-semibold font-['Inter'] leading-4">Grid</span>
                  </div>
                  <div className="px-4 py-2 rounded-sm flex items-center cursor-pointer">
                    <span className="text-zinc-700 text-sm font-semibold font-['Inter'] leading-4">List</span>
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 pt-0">
                <button className="px-5 py-2 bg-black rounded-xl flex items-center">
                  <span className="text-white text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">ALL RESEARCH</span>
                </button>
                <button className="px-5 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
                  <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">WHITEPAPERS</span>
                </button>
                <button className="px-5 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
                  <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">TECHNICAL BRIEFS</span>
                </button>
                <button className="px-5 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
                  <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">CASE-LED RESEARCH</span>
                </button>
                <button className="px-5 py-2 bg-stone-200 hover:bg-stone-300 transition-colors rounded-xl flex items-center">
                  <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">ECONOMIC ANALYSIS</span>
                </button>
              </div>

              {/* Research Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">

                {/* Card 1 — Cloud Sovereignty */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-3.5 h-5 text-zinc-900" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 1h7l3 3v15H2V1z" /><path d="M9 1v3h3" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">WP-2024-012</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Cloud Sovereignty in High-Stakes<br />Markets</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">Examining the legal and technical boundaries of data residency for Tier-1 telcos operating across multiple jurisdictions.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">12 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3 h-3 text-zinc-900 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8zM0 10h12v2H0v-2z" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Card 2 — Real-time BSS */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-5 h-3.5 text-zinc-900" fill="none" viewBox="0 0 20 14" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="1" width="18" height="12" rx="1" /><path d="M4 5h4M4 9h8" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">TB-2023-088</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Real-time BSS: Latency<br />Benchmarks</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">Performance benchmarks for real-time rating and charging engines under a 100M+ subscriber load with sub-5ms response targets.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">18 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-lime-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-lime-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3.5 h-3 text-zinc-900 flex-shrink-0" fill="none" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="1" width="12" height="10" rx="1" /><path d="M4 6h6M7 3v6" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Briefing</span>
                    </button>
                  </div>
                </div>

                {/* Card 3 — Zero-Touch */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-3.5 h-5 text-zinc-900" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 1h7l3 3v15H2V1z" /><path d="M9 1v3h3" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">CL-2024-004</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Zero-Touch Provisioning Study</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">Case study on reducing operational overhead by 40% through automated subscriber lifecycle management and AI-driven workflows.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">10 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3 h-3 text-zinc-900 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8zM0 10h12v2H0v-2z" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Card 4 — Modernizing Legacy */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="12" height="12" rx="1" /><path d="M5 8h6M5 5h6M5 11h4" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">WP-2024-009</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">Modernizing Legacy Debt in BSS</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">A risk mitigation strategy for decommissioning legacy mainframes while maintaining 99.999% availability during technical cutover.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">32 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3 h-3 text-zinc-900 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8zM0 10h12v2H0v-2z" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Card 5 — API First */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-3.5 h-5 text-zinc-900" fill="none" viewBox="0 0 14 20" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 1h7l3 3v15H2V1z" /><path d="M9 1v3h3" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">TB-2024-022</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">API First: The New Standard</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">Why API-first design is the prerequisite for participating in the global digital economy and enabling third-party ecosystem growth.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">15 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-lime-800 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3.5 h-3 text-zinc-900 flex-shrink-0" fill="none" viewBox="0 0 14 12" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="1" width="12" height="10" rx="1" /><path d="M4 6h6M7 3v6" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Request Briefing</span>
                    </button>
                  </div>
                </div>

                {/* Card 6 — 5G Monetization */}
                <div className="p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-between items-start">
                  <div className="self-stretch pb-6 flex flex-col justify-start items-start">
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                        <svg className="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="12" height="12" rx="1" /><path d="M5 11V8l2-2 2 2 2-3" />
                        </svg>
                      </div>
                      <span className="text-zinc-700/50 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">CL-2023-112</span>
                    </div>
                  </div>
                  <div className="self-stretch pb-3 flex flex-col justify-start items-start">
                    <h3 className="self-stretch text-black text-base font-normal font-['Hanken_Grotesk'] leading-6">5G Monetization Strategies</h3>
                  </div>
                  <div className="self-stretch pb-8 flex flex-col justify-start items-start">
                    <p className="self-stretch text-slate-600 text-base font-normal font-['Inter'] leading-6">Analyzing successful 5G standalone slice monetization models across the APAC and European Tier-1 carrier markets.</p>
                  </div>
                  <div className="self-stretch pt-6 border-t border-slate-200 flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch inline-flex justify-between items-center">
                      <span className="text-zinc-700/70 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">22 MIN READ</span>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                    <button className="self-stretch py-3 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors">
                      <svg className="w-3 h-3 text-zinc-900 flex-shrink-0" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M6 8L2 4h3V0h2v4h3L6 8zM0 10h12v2H0v-2z" />
                      </svg>
                      <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">Download PDF</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Pagination */}
              <div className="pt-4 flex justify-center items-center gap-0">
                <div className="w-10 h-10 opacity-30 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center cursor-pointer">
                  <svg className="w-1.5 h-2.5 text-zinc-900" fill="currentColor" viewBox="0 0 6 10">
                    <path d="M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <div className="pl-4">
                  <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center cursor-pointer">
                    <span className="text-white text-base font-normal font-['Inter'] leading-6">1</span>
                  </div>
                </div>
                <div className="pl-4">
                  <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
                    <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">2</span>
                  </div>
                </div>
                <div className="pl-4">
                  <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
                    <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">3</span>
                  </div>
                </div>
                <div className="pl-4">
                  <span className="text-zinc-500 text-base font-normal font-['Inter'] leading-6">...</span>
                </div>
                <div className="pl-4">
                  <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer">
                    <span className="text-zinc-900 text-base font-normal font-['Inter'] leading-6">12</span>
                  </div>
                </div>
                <div className="pl-4">
                  <div className="w-10 h-10 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-center items-center hover:bg-stone-50 transition-colors cursor-pointer">
                    <svg className="w-1.5 h-2.5 text-zinc-900" fill="none" viewBox="0 0 6 10" stroke="currentColor" strokeWidth="1.5">
                      <path d="M1 1l4 4-4 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Newsletter / CTA Section — full width, outside sidebar flex row */}
      <section className="w-full px-6 md:px-16 py-28 bg-zinc-100 flex flex-col justify-center items-center gap-8">
        <div className="w-full max-w-[896px] flex flex-col justify-start items-center gap-3.5">
          <h2 className="text-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Never miss a Tier-1 breakthrough.</h2>
          <p className="text-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">
            Subscribe to our Institutional Intel feed for monthly executive summaries of new research and sovereign<br className="hidden md:block" /> BSS architecture updates.
          </p>
          <div className="w-full max-w-[576px] pt-6 flex flex-col sm:flex-row justify-start items-stretch gap-4">
            <div className="flex-1 px-6 py-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 flex items-start overflow-hidden">
              <input
                type="email"
                placeholder="Institutional email address"
                className="w-full bg-transparent text-gray-500 text-base font-normal font-['Inter'] outline-none"
              />
            </div>
            <button className="px-8 py-4 bg-cyan-700 hover:bg-cyan-800 transition-colors rounded-lg flex items-center justify-center whitespace-nowrap">
              <span className="text-white text-base font-normal font-['Inter'] leading-6">Join Intelligence Feed</span>
            </button>
          </div>
          <div className="pt-2.5">
            <span className="text-center text-zinc-700/60 text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">GDPR COMPLIANT. ZERO TRACKING. INSTITUTIONAL GRADE PRIVACY.</span>
          </div>
        </div>
      </section>
    </div>
  );
}