import React from 'react';
import Link from 'next/link';

export default function ResourcesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white w-full font-['Inter']">

            {/* 1. Hero */}
            <section className="w-full pt-32 pb-24 bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-6">
                    <div className="text-center text-lime-300 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">KNOWLEDGE INFRASTRUCTURE</div>
                    <div className="w-full max-w-[896px] text-center text-white text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight">Telecom OSS/BSS Resources for<br className="hidden md:block" />Operators Building Governed<br className="hidden md:block" />Monetization</div>
                    <div className="w-full max-w-[672px] mt-4 flex">
                        <div className="w-full px-8 py-5 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] inline-flex justify-start items-center overflow-hidden gap-3 cursor-text">
                            <img src="/image/resourcesimage/Icon22.svg" alt="Search" className="w-5 h-5 object-contain" />
                            <div className="flex-1 inline-flex flex-col justify-start items-start overflow-hidden">
                                <div className="self-stretch justify-center text-white/40 text-base font-normal font-['Inter']">Search technical papers, API docs, or case studies...</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link href="/request-a-demo" className="w-full sm:w-auto px-8 py-4 bg-cyan-700 hover:bg-cyan-600 transition-colors rounded-sm text-white text-sm font-semibold shadow-lg text-center">Request a Demo</Link>
                        <Link href="/technical-architecture" className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-sm border border-white/20 text-white text-sm font-semibold block text-center">Start Technical Evaluation</Link>
                    </div>
                </div>
            </section>

            {/* 2. Tailored for Your Role */}
            <section className="w-full py-28 bg-stone-50 flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-12">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 w-full">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-zinc-900 text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk']">Tailored for Your Role</h2>
                            <p className="text-slate-600 text-lg font-normal leading-relaxed max-w-[576px]">Infrastructure-grade intelligence specifically curated for diverse stakeholder requirements.</p>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                        {/* Executive */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon.svg" alt="Executive" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Executive</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">Strategic ROI and sovereign monetization roadmaps.</p>
                        </div>
                        {/* CTO/Architect */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon1.svg" alt="CTO/Architect" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">CTO/Architect</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">Technical stack validation and system modularity.</p>
                        </div>
                        {/* Commercial */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon2.svg" alt="Commercial" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Commercial</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">Revenue agility and product market entry guides.</p>
                        </div>
                        {/* Finance */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon3.svg" alt="Finance" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Finance</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">Billing accuracy and settlement infrastructure.</p>
                        </div>
                        {/* Security */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon4.svg" alt="Security" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Security</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">Compliance frameworks and sovereign data control.</p>
                        </div>
                        {/* Developer */}
                        <div className="p-6 bg-white rounded-lg border border-slate-200 flex flex-col gap-2 hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="w-6 h-6 mb-2">
                                <img src="/image/resourcesimage/Icon5.svg" alt="Developer" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="mt-2 text-zinc-900 text-lg font-bold font-['Hanken_Grotesk']">Developer</h3>
                            <p className="text-slate-600 text-sm font-normal leading-relaxed">API endpoints, SDKs, and integration logic.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. High-Impact Research */}
            <section className="w-full py-28 bg-stone-100 flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col gap-10">
                    <h2 className="text-zinc-900 text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk']">High-Impact Research</h2>
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
                        <div className="p-10 relative bg-gray-800 rounded-2xl flex flex-col justify-end items-start overflow-hidden group cursor-pointer shadow-xl border border-slate-800/50">
                            <img className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" src="/image/resourcesimage/world.png" alt="World at night" />
                            <div className="relative z-10 flex flex-col gap-4 w-full">
                                <span className="px-3 py-1 bg-lime-300 rounded-xl text-lime-950 text-[10px] font-bold font-['JetBrains_Mono'] self-start shadow-sm tracking-wider">WHITE PAPER</span>
                                <h3 className="text-white text-3xl font-normal font-['Hanken_Grotesk'] mt-2 leading-tight">Governed Telecom Monetization Infrastructure: A Sovereign Blueprint</h3>
                                <p className="text-white/70 text-base font-normal max-w-[672px] mt-1 leading-relaxed">Explore the mathematical precision required for Tier-1 settlement in a cloud-native ecosystem.</p>
                                <Link href="#" className="mt-4 text-lime-300 text-base font-medium flex items-center gap-2 hover:underline group-hover:translate-x-1 transition-transform">Download White Paper <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex-1 p-8 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between group hover:shadow-xl transition-all cursor-pointer">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sky-600 text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider">PLAYBOOK</span>
                                    <h3 className="text-black text-2xl font-normal font-['Hanken_Grotesk'] mt-2">MVNO Launch Readiness Guide</h3>
                                    <p className="text-slate-600 text-sm font-normal mt-1 leading-relaxed">Step-by-step technical and commercial checklist.</p>
                                </div>
                                <div className="mt-8 flex justify-between items-end">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <img src="/image/resourcesimage/Icon6.svg" alt="Playbook Icon" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="w-10 h-10 rounded-xl border border-slate-200 flex justify-center items-center group-hover:bg-slate-50 transition-colors group-hover:border-slate-300">
                                        <img src="/image/resourcesimage/Icon8.svg" alt="Arrow right" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-8 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between group hover:shadow-xl transition-all cursor-pointer">
                                <div className="flex flex-col gap-2">
                                    <span className="text-sky-600 text-[10px] font-bold font-['JetBrains_Mono'] uppercase tracking-wider">BRIEF</span>
                                    <h3 className="text-black text-2xl font-normal font-['Hanken_Grotesk'] mt-2">OSS/BSS Modernization Planning</h3>
                                    <p className="text-slate-600 text-sm font-normal mt-1 leading-relaxed">Navigating the transition from legacy to modular.</p>
                                </div>
                                <div className="mt-8 flex justify-between items-end">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <img src="/image/resourcesimage/Icon7.svg" alt="Brief Icon" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="w-10 h-10 rounded-xl border border-slate-200 flex justify-center items-center group-hover:bg-slate-50 transition-colors group-hover:border-slate-300">
                                        <img src="/image/resourcesimage/Icon8.svg" alt="Arrow right" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Explore By Asset Category */}
            <section className="w-full py-28 bg-white border-y border-slate-200 flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col gap-10">
                    <h3 className="text-center text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] tracking-widest uppercase">EXPLORE BY ASSET CATEGORY</h3>
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { name: 'GUIDES', Icon: 'Icon9.svg' },
                            { name: 'WHITE PAPERS', Icon: 'Icon10.svg' },
                            { name: 'DOCUMENTATION', Icon: 'Icon11.svg' },
                            { name: 'API REFERENCE', Icon: 'Icon12.svg' },
                            { name: 'WEBINARS', Icon: 'Icon13.svg' },
                            { name: 'CASE STUDIES', Icon: 'Icon14.svg' },
                            { name: 'COMPARISONS', Icon: 'Icon15.svg' },
                            { name: 'BLOG', Icon: 'Icon16.svg' },
                            { name: 'GLOSSARY', Icon: 'Icon18.svg' },
                            { name: 'RELEASE NOTES', Icon: 'Icon19.svg' }
                        ].map((cat, i) => (
                            <div key={i} className="self-stretch p-6 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 flex flex-col justify-start items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer hover:shadow-sm">
                                <div className="h-6 inline-flex justify-center items-start">
                                    <img src={`/image/resourcesimage/${cat.Icon}`} alt={cat.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-center">
                                    <span className="text-center justify-center text-zinc-900 text-xs font-normal font-['Inter'] uppercase leading-4 tracking-wide">{cat.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Developer & Architecture Control */}
            <section className="w-full py-28 bg-[#1a1c29] flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-white text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk'] leading-tight">Developer & Architecture<br className="hidden lg:block" />Control</h2>
                        <p className="text-gray-400 text-lg font-normal leading-relaxed">The ZoikoNex platform is designed with a "Documentation-First" philosophy, ensuring that your engineering teams have everything they need for seamless sovereign control.</p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="h-6 flex items-start mb-2">
                                    <img src="/image/resourcesimage/Icon19.svg" alt="Platform Docs" className="h-full object-contain" />
                                </div>
                                <h3 className="text-white text-base font-bold font-['Inter'] leading-6">Platform Docs</h3>
                                <p className="text-white/60 text-sm font-normal font-['Inter'] leading-5">Comprehensive guides on core<br />BSS architecture and data<br />schemas.</p>
                                <div className="mt-2 text-lime-300 text-sm font-bold flex items-center gap-1 font-['Inter']">Open Docs <img src="/image/resourcesimage/Icon20.svg" alt="Arrow Right" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" /></div>
                            </div>
                            <div className="flex-1 px-6 pt-6 pb-11 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/10 backdrop-blur-[6px] flex flex-col gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="h-6 flex items-start mb-2">
                                    <img src="/image/resourcesimage/Icon21.svg" alt="API Reference" className="h-full object-contain" />
                                </div>
                                <h3 className="text-white text-base font-bold font-['Inter'] leading-6">API Reference</h3>
                                <p className="text-white/60 text-sm font-normal font-['Inter'] leading-5">RESTful API documentation with<br />full request/response examples.</p>
                                <div className="mt-2 text-lime-300 text-sm font-bold flex items-center gap-1 font-['Inter']">Browse API <img src="/image/resourcesimage/Icon20.svg" alt="Arrow Right" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-[#13141f] rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/5 shadow-2xl flex flex-col gap-6 w-full lg:max-w-[540px] mx-auto lg:ml-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
                            <span className="ml-4 text-white/40 text-sm font-['Liberation_Mono'] tracking-widest uppercase">API Sandbox Request</span>
                        </div>
                        <div className="flex flex-col gap-1.5 font-['Liberation_Mono'] text-sm leading-relaxed overflow-x-auto pb-2">
                            <div><span className="text-sky-400">GET</span> <span className="text-white">/v1/subscribers/accounts</span></div>
                            <div className="text-white/40 mt-1">{`{`}</div>
                            <div className="pl-4"><span className="text-white/70">"account_id": </span><span className="text-lime-300">"zn-08422-9x"</span><span className="text-white/70">,</span></div>
                            <div className="pl-4"><span className="text-white/70">"status": </span><span className="text-lime-300">"active"</span><span className="text-white/70">,</span></div>
                            <div className="pl-4"><span className="text-white/70">"billing_cycle": </span><span className="text-lime-300">"monthly"</span><span className="text-white/70">,</span></div>
                            <div className="pl-4"><span className="text-white/70">"monetization_layer": {`{`}</span></div>
                            <div className="pl-8"><span className="text-white/70">"type": </span><span className="text-lime-300">"governed_credit"</span><span className="text-white/70">,</span></div>
                            <div className="pl-8"><span className="text-white/70">"sovereign_id": </span><span className="text-lime-300">"region-us-01"</span></div>
                            <div className="pl-4 text-white/70">{`}`}</div>
                            <div className="text-white/40">{`}`}</div>
                        </div>
                        <div className="py-4 bg-lime-300 hover:bg-lime-400 rounded-sm flex justify-center items-center cursor-pointer transition-colors shadow-lg mt-2">
                            <span className="text-lime-950 text-sm font-normal font-['Inter'] leading-5">Request Sandbox Access</span>
                        </div>
                    </div>
                </div>
            </section>


            {/* 7. Resource Library */}
            <section className="w-full py-32 bg-[#eae9e8] flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col gap-12">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-zinc-900 text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk']">Resource Library</h2>
                            <div className="flex flex-wrap gap-3">
                                <button className="px-5 py-2.5 bg-black text-white rounded-full text-[11px] tracking-wide uppercase font-['JetBrains_Mono'] font-medium shadow-md">All Assets</button>
                                <button className="px-5 py-2.5 bg-white text-slate-700 rounded-full text-[11px] tracking-wide uppercase font-['JetBrains_Mono'] hover:bg-slate-50 transition-colors shadow-sm">White Papers</button>
                                <button className="px-5 py-2.5 bg-white text-slate-700 rounded-full text-[11px] tracking-wide uppercase font-['JetBrains_Mono'] hover:bg-slate-50 transition-colors shadow-sm">Case Studies</button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:mb-1">
                            <span className="text-slate-500 text-xs tracking-wider uppercase font-['JetBrains_Mono'] font-semibold">Filter By Audience:</span>
                            <div className="relative">
                                <select className="appearance-none pl-4 pr-10 py-2.5 bg-white rounded shadow-sm border border-slate-200 text-zinc-900 text-sm outline-none cursor-pointer hover:border-slate-300 transition-colors">
                                    <option>All Roles</option>
                                    <option>Executives</option>
                                    <option>Architects</option>
                                    <option>Commercial</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/white-papers" className="block p-8 bg-white rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer">
                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-[#eae9e8] text-gray-800 text-[9px] tracking-widest uppercase rounded-full font-['JetBrains_Mono'] font-bold">WHITE PAPER</span>
                                    <span className="text-slate-500 text-xs font-medium">24 Pages</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">Scalable Credit Settlement for MVNOs</h3>
                                    <p className="text-slate-600 text-sm font-normal leading-relaxed mt-1">Technical architecture for real-time ledger updates across hybrid networks.</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center group">
                                <span className="text-sky-600 text-[9px] tracking-widest font-['JetBrains_Mono'] font-bold uppercase">AUDIENCE: ARCHITECTS</span>
                                <div className="w-8 h-8 flex justify-center items-center group-hover:bg-slate-50 rounded transition-colors"><svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></div>
                            </div>
                        </Link>

                        <Link href="/casestudies" className="block p-8 bg-white rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer">
                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-[#e0dceb] text-gray-800 text-[9px] tracking-widest uppercase rounded-full font-['JetBrains_Mono'] font-bold">CASE STUDY</span>
                                    <span className="text-slate-500 text-xs font-medium">12 Mins Read</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">Aether Mobile: Migrating 2M Subs</h3>
                                    <p className="text-slate-600 text-sm font-normal leading-relaxed mt-1">How Aether achieved zero-downtime migration to ZoikoNex sovereign core.</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center group">
                                <span className="text-sky-600 text-[9px] tracking-widest font-['JetBrains_Mono'] font-bold uppercase">AUDIENCE: EXECUTIVES</span>
                                <div className="w-8 h-8 flex justify-center items-center group-hover:bg-slate-50 rounded transition-colors"><svg className="w-5 h-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div>
                            </div>
                        </Link>

                        <Link href="/white-papers" className="block p-8 bg-white rounded-xl border border-slate-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer">
                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="px-3 py-1 bg-[#d5e0f7] text-gray-800 text-[9px] tracking-widest uppercase rounded-full font-['JetBrains_Mono'] font-bold">GUIDE</span>
                                    <span className="text-slate-500 text-xs font-medium">PDF Download</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-tight">5G Monetization Framework</h3>
                                    <p className="text-slate-600 text-sm font-normal leading-relaxed mt-1">Unlocking slice-based billing and edge monetization strategies.</p>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center group">
                                <span className="text-sky-600 text-[9px] tracking-widest font-['JetBrains_Mono'] font-bold uppercase">AUDIENCE: COMMERCIAL</span>
                                <div className="w-8 h-8 flex justify-center items-center group-hover:bg-slate-50 rounded transition-colors"><svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg></div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full flex justify-center mt-6">
                        <Link href="/resources" className="px-8 py-3.5 bg-transparent border border-zinc-900 rounded text-zinc-900 text-sm font-semibold hover:bg-zinc-900 hover:text-white transition-all shadow-sm">View All Resources</Link>
                    </div>
                </div>
            </section>

            {/* 8. Priority Glossary Terms */}
            <section className="w-full py-32 bg-white flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-10">
                    <div className="lg:col-span-4 flex flex-col gap-6 pr-4">
                        <h2 className="text-zinc-900 text-4xl lg:text-5xl font-semibold font-['Hanken_Grotesk'] leading-tight">Priority Glossary<br className="hidden lg:block" />Terms</h2>
                        <p className="text-slate-600 text-base font-normal leading-relaxed mt-2">Understanding the terminology of sovereign telecom infrastructure and governed monetization.</p>
                        <Link href="/resources" className="mt-4 text-sky-600 text-sm font-bold flex items-center gap-2 cursor-pointer hover:text-sky-700 transition-colors group">
                            Full Industry Glossary
                            <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </Link>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="self-stretch p-6 bg-[#FCF8F9] border-l-2 border-black flex flex-col justify-start items-start gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-[#000000] text-base font-bold font-['Inter'] leading-6">Governed Monetization</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-[#475569] text-sm font-normal font-['Inter'] leading-6">The application of policy-driven constraints on revenue cycles to ensure regulatory compliance and sovereign data residency.</p>
                            </div>
                        </div>
                        <div className="self-stretch p-6 bg-[#FCF8F9] border-l-2 border-sky-500 flex flex-col justify-start items-start gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-[#000000] text-base font-bold font-['Inter'] leading-6">Sovereign OSS/BSS</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-[#475569] text-sm font-normal font-['Inter'] leading-6">An infrastructure stack that maintains full operational independence from generic cloud hyperscalers for critical telecommunications logic.</p>
                            </div>
                        </div>
                        <div className="self-stretch p-6 bg-[#FCF8F9] border-l-2 border-lime-600 flex flex-col justify-start items-start gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-[#000000] text-base font-bold font-['Inter'] leading-6">Real-time Rating Engine</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-[#475569] text-sm font-normal font-['Inter'] leading-6">A high-frequency computational layer that calculates service costs at the moment of consumption for pre-paid and post-paid models.</p>
                            </div>
                        </div>
                        <div className="self-stretch p-6 bg-[#FCF8F9] border-l-2 border-[#d5e0f7] flex flex-col justify-start items-start gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-[#000000] text-base font-bold font-['Inter'] leading-6">Slice Billing</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-[#475569] text-sm font-normal font-['Inter'] leading-6">The capability to uniquely bill for specific virtual network segments in 5G environments based on latency or throughput SLAs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 9. CTA */}
            <section className="w-full py-28 bg-[#1a1c29] flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-6">
                    <div className="self-stretch flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Move From Research to a Structured ZoikoNex Evaluation</div>
                    </div>
                    <div className="w-full max-w-[672px] pb-[0.69px] flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-gray-500 text-lg font-normal font-['Inter'] leading-7">Stop managing legacy complexity. Start building sovereign infrastructure<br />today.</div>
                    </div>
                    <div className="w-full max-w-[896px] pt-6 flex flex-col md:flex-row justify-center items-center gap-4">
                        <Link href="/request-a-demo" className="px-20 py-5 bg-cyan-700 rounded-lg flex flex-col justify-center items-center hover:bg-cyan-600 transition-colors">
                            <div className="text-center justify-center text-white text-base font-normal font-['Inter'] leading-6">Request a Demo</div>
                        </Link>
                        <div className="px-16 py-5 bg-white/10 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/20 flex flex-col justify-center items-center hover:bg-white/20 transition-colors cursor-pointer">
                            <div className="text-center justify-center text-white text-base font-normal font-['Inter'] leading-6">Start Technical POC</div>
                        </div>
                        <div className="px-14 py-5 bg-white/10 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/20 flex flex-col justify-center items-center hover:bg-white/20 transition-colors cursor-pointer">
                            <div className="text-center justify-center text-white text-base font-normal font-['Inter'] leading-6">Contact Solutions Arch</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
