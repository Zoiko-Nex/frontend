import React from 'react';
import Link from 'next/link';

export default function CaseStudiesPage() {
    return (
        <div className="flex flex-col min-h-screen font-['Inter'] w-full bg-stone-50">

            {/* 1. Hero Section */}
            <section className="w-full pt-32 pb-24 bg-white flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start gap-6">
                        <h1 className="text-zinc-900 text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight">
                            Real telecom operating<br />challenges. <span className="text-lime-600">Proven<br />ZoikoNex pathways.</span>
                        </h1>
                        <p className="text-slate-600 text-lg font-normal leading-relaxed max-w-[500px]">
                            Discover how global enterprises and service providers leverage our APIs to modernize BSS, maintain sovereign control, elevate scale, and redefine connectivity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <Link href="/methodology" className="inline-block px-8 py-4 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-sm text-white text-sm font-semibold shadow-lg text-center">
                                Explore Our Methodology
                            </Link>
                            <button className="px-8 py-4 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm text-zinc-900 text-sm font-semibold">
                                Download Portfolio PDF
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <img src="/image/case/ca.png" alt="Tech Graphic" className="w-full h-auto object-cover rounded-xl shadow-2xl mix-blend-multiply opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-transparent rounded-xl"></div>
                    </div>
                </div>
            </section>

            {/* 2. Filter Bar */}
            <section className="w-full py-6 bg-[#1f202b] flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex justify-start items-center gap-3">
                        <svg className="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M10 18h4"></path></svg>
                        <span className="text-white text-[11px] font-bold font-['JetBrains_Mono'] tracking-widest uppercase mt-[2px]">FILTER BY:</span>
                    </div>
                    <div className="flex-1 flex flex-wrap items-center gap-4">
                        <div className="w-48 px-4 py-2 bg-[#262734] border border-white/5 rounded-sm flex justify-between items-center cursor-pointer hover:border-white/20 transition-colors">
                            <span className="text-slate-300 text-sm font-normal font-['Inter']">Operator Type</span>
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="w-52 px-4 py-2 bg-[#262734] border border-white/5 rounded-sm flex justify-between items-center cursor-pointer hover:border-white/20 transition-colors">
                            <span className="text-slate-300 text-sm font-normal font-['Inter']">Business Challenge</span>
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="w-48 px-4 py-2 bg-[#262734] border border-white/5 rounded-sm flex justify-between items-center cursor-pointer hover:border-white/20 transition-colors">
                            <span className="text-slate-300 text-sm font-normal font-['Inter']">Region</span>
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-xs px-4 py-2 bg-[#262734] border border-white/5 rounded-sm flex justify-start items-center gap-3">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input type="text" placeholder="Search implementation..." className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-500 w-full font-['Inter']" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Featured Success Blueprints */}
            <section className="w-full pt-14 pb-16 bg-stone-50 flex flex-col justify-start items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
                    <div className="self-stretch flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="flex flex-col justify-start items-start">
                                <span className="justify-center text-lime-800 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">EVIDENCE-BASED RESULTS</span>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                                <h2 className="justify-center text-black text-4xl md:text-5xl font-semibold font-['Hanken_Grotesk'] leading-[48px] md:leading-[60px]">Featured Success Blueprints</h2>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className="max-w-80 pl-4 pr-[3.36px] border-l-2 border-lime-300 flex flex-col justify-start items-start">
                                <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Verified performance benchmarks from<br className="hidden md:block" />live production environments.</p>
                            </div>
                        </div>
                    </div>

                    <div className="self-stretch grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <Link href="/MVNO-launch" className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group block">
                            <div className="self-stretch h-48 relative flex flex-col justify-center items-start overflow-hidden">
                                <img className="self-stretch flex-1 relative object-cover" src="/image/case/image1.png" alt="MVNO Launch Readiness" />
                                <div className="px-3 py-1 left-[16px] top-[16px] absolute bg-black rounded-xs flex flex-col justify-start items-start">
                                    <span className="justify-center text-white text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">PUBLISHED STORY</span>
                                </div>
                            </div>
                            <div className="self-stretch p-8 flex flex-col justify-start items-start gap-3 h-full">
                                <div className="self-stretch flex justify-start items-start gap-2">
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">MVNO</span>
                                    </div>
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">EU REGION</span>
                                    </div>
                                </div>
                                <div className="self-stretch pt-1 flex flex-col justify-start items-start">
                                    <h3 className="justify-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">MVNO Launch<br />Readiness</h3>
                                </div>
                                <div className="self-stretch pb-3 flex flex-col justify-start items-start flex-1">
                                    <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Transitioned from concept to live<br className="hidden md:block" />production in 42 days using the<br className="hidden md:block" />ZoikoNex Core Framework.</p>
                                </div>
                                <div className="self-stretch pt-6 border-t border-stone-300 flex flex-col justify-start items-start gap-6 w-full">
                                    <div className="self-stretch flex justify-start items-start gap-4">
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">TIME TO MARKET</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">-65%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">OPEX SAVINGS</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">40%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch flex justify-start items-center gap-2">
                                        <span className="justify-center text-sky-600 text-sm font-bold font-['Inter'] leading-4 uppercase">READ BLUEPRINT</span>
                                        <svg className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card 2 */}
                        <Link href="/billing-and-charging" className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group block">
                            <div className="self-stretch h-48 relative flex flex-col justify-center items-start overflow-hidden">
                                <img className="self-stretch flex-1 relative object-cover" src="/image/case/image3.png" alt="Billing and Charging Modernization" />
                                <div className="px-3 py-1 left-[16px] top-[16px] absolute bg-black rounded-xs flex flex-col justify-start items-start">
                                    <span className="justify-center text-white text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">PRODUCTION CASE</span>
                                </div>
                            </div>
                            <div className="self-stretch p-8 flex flex-col justify-start items-start gap-3 h-full">
                                <div className="self-stretch flex justify-start items-start gap-2">
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">LEGACY BSS</span>
                                    </div>
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">GLOBAL</span>
                                    </div>
                                </div>
                                <div className="self-stretch pt-1 flex flex-col justify-start items-start">
                                    <h3 className="justify-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Billing and Charging<br />Modernization</h3>
                                </div>
                                <div className="self-stretch pb-3 flex flex-col justify-start items-start flex-1">
                                    <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Replaced monolithic legacy billing<br className="hidden md:block" />with modular, cloud-native<br className="hidden md:block" />charging for a Tier-1 provider.</p>
                                </div>
                                <div className="self-stretch pt-6 border-t border-stone-300 flex flex-col justify-start items-start gap-6 w-full">
                                    <div className="self-stretch flex justify-start items-start gap-4">
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">DATA ACCURACY</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">99.99%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">LEAKAGE REDUCTION</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">12%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch flex justify-start items-center gap-2">
                                        <span className="justify-center text-sky-600 text-sm font-bold font-['Inter'] leading-4 uppercase">READ BLUEPRINT</span>
                                        <svg className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card 3 */}
                        <Link href="/esim-and-lifecycle" className="w-full bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                            <div className="self-stretch h-48 relative flex flex-col justify-center items-start overflow-hidden">
                                <img className="self-stretch flex-1 relative object-cover" src="/image/case/image.png" alt="eSIM and Lifecycle Operations" />
                                <div className="px-3 py-1 left-[16px] top-[16px] absolute bg-black rounded-xs flex flex-col justify-start items-start">
                                    <span className="justify-center text-white text-[10px] font-normal font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">OPERATIONAL STUDY</span>
                                </div>
                            </div>
                            <div className="self-stretch p-8 flex flex-col justify-start items-start gap-3 h-full">
                                <div className="self-stretch flex justify-start items-start gap-2">
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">eSIM</span>
                                    </div>
                                    <div className="px-2 py-1 bg-zinc-100 rounded-xs flex flex-col justify-start items-start">
                                        <span className="justify-center text-zinc-700 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">NORTH AMERICA</span>
                                    </div>
                                </div>
                                <div className="self-stretch pt-1 flex flex-col justify-start items-start">
                                    <h3 className="justify-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">eSIM and Lifecycle<br />Operations</h3>
                                </div>
                                <div className="self-stretch pb-3 flex flex-col justify-start items-start flex-1">
                                    <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Automated end-to-end eSIM<br className="hidden md:block" />provisioning and subscription<br className="hidden md:block" />management for a digital-first<br className="hidden md:block" />brand.</p>
                                </div>
                                <div className="self-stretch pt-6 border-t border-stone-300 flex flex-col justify-start items-start gap-6 w-full">
                                    <div className="self-stretch flex justify-start items-start gap-4">
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">AUTOMATION RATE</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">95%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-start items-start">
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-zinc-700 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4">SUPPORT COST</span>
                                            </div>
                                            <div className="self-stretch flex flex-col justify-start items-start">
                                                <span className="justify-center text-lime-800 text-base font-normal font-['Hanken_Grotesk'] leading-6">-30%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch flex justify-start items-center gap-2">
                                        <span className="justify-center text-sky-600 text-sm font-bold font-['Inter'] leading-4 uppercase">READ BLUEPRINT</span>
                                        <svg className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>

            {/* 4. Implementation Library */}
            <section className="w-full py-20 bg-stone-100 flex flex-col justify-start items-center">
                <div className="w-full max-w-[1280px] px-6 lg:px-28 flex flex-col justify-start items-start gap-12">
                    <div className="self-stretch flex flex-col justify-start items-center gap-4">
                        <div className="flex flex-col justify-start items-center">
                            <h2 className="text-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Implementation Library</h2>
                        </div>
                        <div className="max-w-[672px] flex flex-col justify-start items-center">
                            <p className="text-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Explore targeted scenario cards covering niche operating models and specialized<br className="hidden md:block" />regulatory environments.</p>
                        </div>
                    </div>
                    <div className="self-stretch grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="w-full bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col hover:shadow-xl transition-shadow group h-full">
                            <Link href="/implementation/travel-esim-brand" className="p-8 pb-0 flex flex-col justify-start items-start gap-3 flex-1 cursor-pointer">
                                <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                                    <img src="/image/case/Icon8.svg" className="w-6 h-6 object-contain" alt="Travel eSIM Brand" />
                                </div>
                                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 group-hover:text-cyan-700 transition-colors">Travel eSIM Brand</h3>
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start flex-1">
                                    <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Deployment of a multi-IMSI global<br className="hidden xl:block" />roaming solution with real-time balance<br className="hidden xl:block" />enforcement across 180 countries.</p>
                                </div>
                            </Link>
                            <div className="px-8 pb-8 pt-6 flex justify-between items-center w-full mt-auto">
                                <div className="px-2 py-1 bg-stone-200 rounded-xs flex flex-col justify-start items-start">
                                    <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] leading-4">ANONYMIZED</span>
                                </div>
                                <a href="/pdfs/ZoikoNex-Travel-eSIM-Brand.pdf" download className="flex justify-center items-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/image/case/Icon9.svg" className="w-4 h-4 object-contain" alt="Download" />
                                </a>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="w-full bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col hover:shadow-xl transition-shadow group h-full">
                            <Link href="/implementation/regulated-telecom-billing" className="p-8 pb-0 flex flex-col justify-start items-start gap-3 flex-1 cursor-pointer">
                                <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                                    <img src="/image/case/Icon11.svg" className="w-6 h-6 object-contain" alt="Regulated Telecom Billing" />
                                </div>
                                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 group-hover:text-cyan-700 transition-colors">Regulated Telecom<br className="hidden md:block" />Billing</h3>
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start flex-1">
                                    <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Complex tax engine integration and<br className="hidden xl:block" />sovereign data compliance for high-<br className="hidden xl:block" />security government contractors.</p>
                                </div>
                            </Link>
                            <div className="px-8 pb-8 pt-6 flex justify-between items-center w-full mt-auto">
                                <div className="px-2 py-1 bg-stone-200 rounded-xs flex flex-col justify-start items-start">
                                    <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] leading-4">ANONYMIZED</span>
                                </div>
                                <a href="/pdfs/ZoikoNex-Regulated-Telecom-Billing.pdf" download className="flex justify-center items-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/image/case/Icon9.svg" className="w-4 h-4 object-contain" alt="Download" />
                                </a>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="w-full bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col hover:shadow-xl transition-shadow group h-full">
                            <Link href="/implementation/partner-reseller-program" className="p-8 pb-0 flex flex-col justify-start items-start gap-3 flex-1 cursor-pointer">
                                <div className="w-12 h-12 bg-zinc-100 rounded-sm flex justify-center items-center">
                                    <img src="/image/case/Icon10.svg" className="w-6 h-6 object-contain" alt="Partner Reseller Program" />
                                </div>
                                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                                    <h3 className="text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 group-hover:text-cyan-700 transition-colors">Partner Reseller<br className="hidden md:block" />Program</h3>
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start flex-1">
                                    <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">White-labeling the BSS portal for sub-<br className="hidden xl:block" />distributors with granular commission<br className="hidden xl:block" />management and hierarchy controls.</p>
                                </div>
                            </Link>
                            <div className="px-8 pb-8 pt-6 flex justify-between items-center w-full mt-auto">
                                <div className="px-2 py-1 bg-stone-200 rounded-xs flex flex-col justify-start items-start">
                                    <span className="text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] leading-4">ANONYMIZED</span>
                                </div>
                                <a href="/pdfs/ZoikoNex-Partner-Reseller-Program.pdf" download className="flex justify-center items-center cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/image/case/Icon9.svg" className="w-4 h-4 object-contain" alt="Download" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. How we measure impact */}
            <section className="w-full py-28 bg-gray-800 flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 lg:px-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <span className="text-lime-300 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">THE ZOIKONEX ADVANTAGE</span>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <h2 className="text-white text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk'] leading-[50px]">How we measure impact<br className="hidden md:block" />across the ecosystem.</h2>
                        </div>
                        <div className="self-stretch pt-4 flex flex-col justify-start items-start gap-8">
                            <div className="self-stretch flex justify-start items-start gap-6">
                                <div className="w-12 h-12 outline outline-1 outline-offset-[-1px] outline-stone-300/30 flex justify-center items-center shrink-0">
                                    <img src="/image/case/Icon12.svg" className="w-6 h-6 object-contain" alt="Revenue Velocity" />
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Revenue Velocity</h3>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <p className="text-zinc-400 text-sm font-normal font-['Inter'] leading-5">Speed to monetization and reduction in unbilled revenue leaks<br className="hidden xl:block" />through high-frequency charging cycles.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex justify-start items-start gap-6">
                                <div className="w-12 h-12 outline outline-1 outline-offset-[-1px] outline-stone-300/30 flex justify-center items-center shrink-0">
                                    <img src="/image/case/Icon14.svg" className="w-6 h-6 object-contain" alt="Operating Efficiency" />
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Operating Efficiency</h3>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <p className="text-zinc-400 text-sm font-normal font-['Inter'] leading-5">Total Cost of Ownership (TCO) reduction via cloud-native<br className="hidden xl:block" />elasticity and self-healing BSS modules.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch flex justify-start items-start gap-6">
                                <div className="w-12 h-12 outline outline-1 outline-offset-[-1px] outline-stone-300/30 flex justify-center items-center shrink-0">
                                    <img src="/image/case/Icon13.svg" className="w-6 h-6 object-contain" alt="Compliance Assurance" />
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <h3 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Compliance Assurance</h3>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <p className="text-zinc-400 text-sm font-normal font-['Inter'] leading-5">Adherence to local data sovereignty laws and international<br className="hidden xl:block" />GSMA standards for secure operations.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full p-8 bg-gray-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col justify-start items-start overflow-hidden">
                        <div className="self-stretch flex flex-col justify-start items-start gap-8">
                            <div className="self-stretch pb-4 border-b border-stone-300/10 flex justify-between items-end">
                                <div className="flex flex-col justify-start items-start">
                                    <span className="text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-4">REAL-TIME TELEMETRY</span>
                                </div>
                                <div className="flex flex-col justify-start items-start">
                                    <span className="text-zinc-500 text-[10px] font-normal font-['Inter'] leading-4">NODE_ALPHA_09</span>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start gap-4">
                                <div className="self-stretch h-2 relative bg-stone-300/10 rounded-xl overflow-hidden w-full">
                                    <div className="h-2 left-0 top-0 absolute bg-lime-300 rounded-xl" style={{ width: '92.4%' }}></div>
                                </div>
                                <div className="self-stretch flex justify-between items-start w-full">
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-zinc-500 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">SOVEREIGN PERFORMANCE</span>
                                    </div>
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-white text-xs font-normal font-['JetBrains_Mono'] leading-4">92.4%</span>
                                    </div>
                                </div>

                                <div className="self-stretch h-2 relative bg-stone-300/10 rounded-xl overflow-hidden w-full mt-2">
                                    <div className="h-2 left-0 top-0 absolute bg-sky-600 rounded-xl" style={{ width: '78.1%' }}></div>
                                </div>
                                <div className="self-stretch flex justify-between items-start w-full">
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-zinc-500 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">ELASTIC RESILIENCE</span>
                                    </div>
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-white text-xs font-normal font-['JetBrains_Mono'] leading-4">78.1%</span>
                                    </div>
                                </div>

                                <div className="self-stretch h-2 relative bg-stone-300/10 rounded-xl overflow-hidden w-full mt-2">
                                    <div className="h-2 left-0 top-0 absolute bg-black rounded-xl" style={{ width: '98.7%' }}></div>
                                </div>
                                <div className="self-stretch flex justify-between items-start w-full">
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-zinc-500 text-xs font-normal font-['JetBrains_Mono'] uppercase leading-4">SECURITY PERIMETER</span>
                                    </div>
                                    <div className="flex flex-col justify-start items-start">
                                        <span className="text-white text-xs font-normal font-['JetBrains_Mono'] leading-4">98.7%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section className="w-full py-24 relative bg-stone-50 border-t border-slate-200 flex flex-col justify-start items-center overflow-hidden">
                <div className="hidden lg:flex w-[480px] h-[502px] right-0 top-0 absolute opacity-5 flex-col justify-center items-start">
                    <img className="self-stretch flex-1 relative object-cover" src="/image/case/world.png" alt="World Map Background" />
                </div>
                <div className="w-full max-w-[1280px] px-6 lg:px-28 flex flex-col justify-start items-center gap-6 relative z-10">
                    <div className="self-stretch flex flex-col justify-start items-center">
                        <h2 className="text-center text-black text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight lg:leading-[66px]">See how ZoikoNex maps to<br className="hidden md:block"/>your operating model.</h2>
                    </div>
                    <div className="max-w-[672px] pb-[0.69px] flex flex-col justify-start items-center">
                        <p className="text-center text-slate-600 text-base lg:text-lg font-normal font-['Inter'] leading-7">Connect with our architecture team to analyze your current BSS bottlenecks<br className="hidden xl:block"/>and define a sovereign migration path.</p>
                    </div>
                    <div className="self-stretch pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/contact-us">
                            <button className="px-10 py-5 bg-black rounded-lg shadow-lg flex flex-col justify-center items-center hover:bg-zinc-800 transition-colors">
                                <span className="text-center text-white text-sm font-semibold font-['Inter'] leading-4">Request a Platform Briefing</span>
                            </button>
                        </Link>
                        <button className="px-10 py-5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-center items-center hover:bg-stone-50 transition-colors">
                            <span className="text-center text-black text-sm font-semibold font-['Inter'] leading-4">Speak with an Architect</span>
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
