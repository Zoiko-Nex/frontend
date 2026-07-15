import React from 'react';
import Link from 'next/link';

export default function DocumentationPage() {
    return (
        <div className="flex flex-col min-h-screen font-['Inter'] w-full">

            {/* 1. Hero Section */}
            <section className="w-full pt-32 pb-28 bg-[#10101a] flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start gap-6">
                        <div className="px-2 py-1 bg-[#1a88bb] self-start">
                            <span className="text-[#0a0a0f] text-[10px] font-bold font-['JetBrains_Mono'] tracking-[0.15em] uppercase">RESOURCES & GOVERNANCE</span>
                        </div>
                        <h1 className="text-white text-5xl lg:text-[56px] font-bold font-['Hanken_Grotesk'] leading-[1.15] tracking-tight">
                            Build, launch,<br />integrate, and govern<br />telecom operations<br />
                            <span className="text-[#1a88bb]">with confidence.</span>
                        </h1>
                        <p className="text-[#8e8f98] text-[15px] font-normal max-w-[500px] leading-[1.6]">
                            Structured documentation and technical resources for evaluation, implementation, and sovereign governance. Navigate the architecture of modern connectivity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                            <Link href="/api-reference" className="px-6 py-3.5 bg-[#1a88bb] hover:bg-[#15719e] transition-colors text-white text-[13px] font-semibold flex items-center justify-center gap-2">
                                Explore Documentation
                                <img src="/image/documen/Icon8.svg" alt="Arrow" className="w-3.5 h-3.5 object-contain" />
                            </Link>
                            <Link href="/contact-us" className="px-6 py-3.5 bg-transparent border border-[#3f404a] hover:bg-white/5 transition-colors text-white text-[13px] font-semibold flex items-center justify-center">
                                Request Documentation Access
                            </Link>
                        </div>
                    </div>

                    <div className="p-5 bg-[#14151c] border border-[#23242e] flex flex-col gap-4 lg:ml-8 rounded-sm">
                        <div className="px-4 py-3.5 bg-[#171821] border border-[#23242e] flex items-center gap-3 rounded-sm">
                            <img src="/image/documen/Icon9.svg" alt="Search" className="w-4 h-4 object-contain" />
                            <input type="text" placeholder="Search architecture, API keys, compliance packs..." className="bg-transparent border-none outline-none text-[#6e6f78] text-[13px] w-full placeholder-[#4a4b55]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { title: 'API Reference', desc: 'Integrate core services', icon: 'Icon10.svg', href: '/api-reference' },
                                { title: 'Compliance', desc: 'Sovereign audit trails', icon: 'Icon11.svg', href: '/evidence' },
                                { title: 'Architectures', desc: 'Deployment blueprints', icon: 'Icon12.svg', href: '/platform-architecture' },
                                { title: 'Integrations', desc: 'Connect legacy systems', icon: 'Icon13.svg', href: '/hybrid' }
                            ].map((item, i) => (
                                <Link href={item.href} key={i} className="p-5 bg-[#171821] border border-[#23242e] flex flex-col gap-3 hover:border-[#383a48] transition-colors cursor-pointer rounded-sm">
                                    <div className="w-5 h-5 flex items-center justify-start">
                                        <img src={`/image/documen/${item.icon}`} alt={item.title} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <h3 className="text-[#f1f1f4] text-[14px] font-semibold font-['Inter']">{item.title}</h3>
                                        <p className="text-[#6e6f78] text-[12px] font-normal">{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Documentation by Outcome */}
            <section className="w-full pt-14 pb-11 bg-stone-50 inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-sky-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">OPERATIONAL PHASES</div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Documentation by Outcome</div>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-center items-stretch gap-6 flex-wrap lg:flex-nowrap">
                        {[
                            { role: 'FOUNDERS', title: 'Evaluate', desc: 'Understand the business logic and market fit of ZoikoNex.', link: 'View Guides', href: '/white-papers' },
                            { role: 'ARCHITECTS', title: 'Plan', desc: 'Map your existing legacy stacks to our modern infrastructure.', link: 'View Blueprints', href: '/technical-architecture' },
                            { role: 'DEVELOPERS', title: 'Integrate', desc: 'REST APIs, SDKs, and sandbox environments for testing.', link: 'API Docs', href: '/api-reference' },
                            { role: 'COMPLIANCE', title: 'Review', desc: 'Governance logs and regulatory evidence generation.', link: 'Trust Center', href: '/trust' },
                            { role: 'OPERATORS', title: 'Operate', desc: 'Daily administration, lifecycle management, and scaling.', link: 'Operations', href: '/operators' }
                        ].map((item, i) => (
                            <Link href={item.href} key={i} className="w-56 self-stretch p-8 bg-white outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-start items-start hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group">
                                <div className="pb-4 flex flex-col justify-start items-start">
                                    <div className="px-2 py-1 bg-zinc-100 flex flex-col justify-start items-start">
                                        <div className="justify-center text-slate-600 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">{item.role}</div>
                                    </div>
                                </div>
                                <div className="self-stretch pb-4 flex flex-col justify-start items-start">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">{item.title}</div>
                                    </div>
                                </div>
                                <div className="self-stretch pb-6 flex flex-col justify-start items-start flex-1">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">{item.desc}</div>
                                    </div>
                                </div>
                                <div className="self-stretch inline-flex justify-start items-center gap-1 mt-auto">
                                    <div className="justify-center text-sky-600 text-sm font-semibold font-['Inter'] leading-4">{item.link}</div>
                                    <div className="inline-flex flex-col justify-start items-start">
                                        <svg className="w-3 h-3 text-sky-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Role-Based Pathways */}
            <section className="w-full py-28 bg-gray-800 flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col items-center gap-16">
                    <div className="w-full flex flex-col justify-start items-start gap-4">
                        <div className="flex flex-col justify-start items-start w-full">
                            <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Role-Based Pathways</h2>
                        </div>
                        <div className="flex flex-col justify-start items-start w-full">
                            <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">Tailored journeys for every stakeholder in the ecosystem.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 w-full">
                        {[
                            { role: 'Founder', icon: 'Icon14.svg', links: ['Platform Overview', 'Market Expansion Logic', 'Revenue Models'] },
                            { role: 'CTO', icon: 'Icon15.svg', links: ['Infrastructure Blueprint', 'Security Whitepaper', 'Multi-Cloud Deployment'] },
                            { role: 'Developer', icon: 'Icon16.svg', links: ['API Reference', 'SDK Quickstarts', 'Webhook Integration'] },
                            { role: 'Compliance', icon: 'Icon17.svg', links: ['Audit Log Export', 'Governance Framework', 'Sovereign Residency'] },
                            { role: 'Partner', icon: 'Icon18.svg', links: ['Reseller Guide', 'White-Label Options', 'Settlement Logic'] },
                            { role: 'Existing Customer', icon: 'Icon19.svg', links: ['Support Portal', 'Feature Roadmap', 'Version History'] }
                        ].map((role, i) => (
                            <div key={i} className="inline-flex justify-start items-start gap-6">
                                <div className="px-3 pt-3.5 pb-3 bg-sky-600/20 rounded-sm inline-flex flex-col justify-start items-start">
                                    <img src={`/image/documen/${role.icon}`} alt={role.role} className="w-4 h-4 object-contain" />
                                </div>
                                <div className="inline-flex flex-col justify-start items-start gap-2">
                                    <div className="flex flex-col justify-start items-start w-full">
                                        <h3 className="text-white text-xl font-normal font-['Hanken_Grotesk'] leading-8">{role.role}</h3>
                                    </div>
                                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                                        {role.links.map((link, j) => (
                                            <div key={j} className="inline-flex justify-start items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
                                                <div className="w-1 h-1 bg-sky-600 rounded-xl group-hover:scale-125 transition-transform"></div>
                                                <span className="text-gray-500 text-sm font-normal font-['Inter'] leading-5">{link}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Documentation Library */}
            <section className="w-full pt-10 pb-11 bg-stone-50 inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-12">
                    <div className="self-stretch flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="inline-flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h2 className="justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Documentation Library</h2>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Filter resources by platform domain and access level.</p>
                            </div>
                        </div>
                        <div className="flex justify-start items-start gap-2">
                            <button className="px-4 py-2 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-sky-600 inline-flex flex-col justify-center items-center hover:bg-slate-50 transition-colors">
                                <span className="text-center justify-center text-sky-600 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">ALL RESOURCES</span>
                            </button>
                            <button className="px-4 py-2 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-center items-center hover:bg-slate-50 transition-colors">
                                <span className="text-center justify-center text-slate-600 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">API ONLY</span>
                            </button>
                            <button className="px-4 py-2 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex flex-col justify-center items-center hover:bg-slate-50 transition-colors">
                                <span className="text-center justify-center text-slate-600 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">GOVERNANCE PACKS</span>
                            </button>
                        </div>
                    </div>
                    <div className="self-stretch bg-slate-200 rounded-sm outline outline-1 outline-offset-[-1px] outline-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] overflow-hidden">
                        {[
                            { title: 'Platform Basics', tag: 'PUBLIC', tagColor: 'bg-green-100', tagText: 'text-green-700', desc: 'Foundational concepts of the infrastructure layer.', count: '12 Docs' },
                            { title: 'Implementation Guide', tag: 'GATED', tagColor: 'bg-blue-100', tagText: 'text-blue-700', desc: 'Step-by-step setup for regional jurisdictional packs.', count: '24 Docs' },
                            { title: 'API & Integration', tag: 'PUBLIC', tagColor: 'bg-green-100', tagText: 'text-green-700', desc: 'Full technical schema for OSS/BSS modernization.', count: '100+ Endpoints' },
                            { title: 'Compliance Packs', tag: 'NDA REQUIRED', tagColor: 'bg-orange-100', tagText: 'text-orange-700', desc: 'Detailed regulatory controls and data sovereignty audits.', count: '8 Modules' },
                            { title: 'Operations Manual', tag: 'CUSTOMER-ONLY', tagColor: 'bg-purple-100', tagText: 'text-purple-700', desc: 'Day-to-day management of Tier-1 telecom services.', count: '45 Docs' },
                            { title: 'Security & Crypto', tag: 'NDA REQUIRED', tagColor: 'bg-orange-100', tagText: 'text-orange-700', desc: 'Evidence-ledger architecture and key management docs.', count: '16 Docs' }
                        ].map((doc, i) => (
                            <div key={i} className="self-stretch p-6 bg-white inline-flex flex-col justify-start items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="self-stretch inline-flex justify-between items-start">
                                    <h3 className="justify-center text-zinc-900 text-lg font-normal font-['Hanken_Grotesk'] leading-7">{doc.title}</h3>
                                    <div className={`px-2 py-0.5 rounded-xl inline-flex flex-col justify-start items-start ${doc.tagColor}`}>
                                        <span className={`justify-center text-[9px] font-normal font-['JetBrains_Mono'] leading-3 ${doc.tagText}`}>{doc.tag}</span>
                                    </div>
                                </div>
                                <div className="self-stretch flex flex-col justify-start items-start flex-1">
                                    <p className="self-stretch justify-center text-slate-600 text-sm font-normal font-['Inter'] leading-5">{doc.desc}</p>
                                </div>
                                <div className="self-stretch inline-flex justify-start items-center gap-2 mt-auto">
                                    <div className="self-stretch inline-flex flex-col justify-start items-start">
                                        <span className="justify-center text-sky-600 text-xs font-semibold font-['Inter'] leading-4">{doc.count}</span>
                                    </div>
                                    <div className="inline-flex flex-col justify-center items-center mt-[1px]">
                                        <svg className="w-3 h-3 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Structured Implementation Journey */}
            <section className="w-full pt-11 pb-16 relative bg-gray-800 flex flex-col justify-start items-center overflow-hidden">
                <div className="w-[480px] h-80 absolute right-0 top-0 opacity-10 flex flex-col justify-center items-start pointer-events-none">
                    <img className="self-stretch flex-1 relative object-cover" src="/image/resourcesimage/world.png" alt="Background Texture" />
                </div>
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16 z-10 relative">
                    <div className="self-stretch flex flex-col justify-start items-center">
                        <h2 className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Structured Implementation Journey</h2>
                    </div>
                    <div className="self-stretch relative flex justify-between items-start w-full max-md:flex-col max-md:gap-8 max-md:items-center overflow-x-auto pb-4">
                        <div className="absolute left-0 right-0 top-[24px] h-px bg-stone-300/20 hidden md:block"></div>
                        
                        {[
                            { num: '1', title: 'Evaluate', desc: 'Market Analysis', active: true },
                            { num: '2', title: 'Scope', desc: 'Tech Audit', active: false },
                            { num: '3', title: 'Connect', desc: 'API Bridge', active: false },
                            { num: '4', title: 'Configure', desc: 'Rule Logic', active: false },
                            { num: '5', title: 'Validate', desc: 'Sovereign Audit', active: false },
                            { num: '6', title: 'Operate', desc: 'Full Control', active: false }
                        ].map((step, i) => (
                            <div key={i} className="inline-flex flex-col justify-start items-center group cursor-pointer w-32 shrink-0 md:w-auto">
                                <div className="w-12 h-16 pb-4 flex flex-col justify-start items-start relative z-10 bg-gray-800">
                                    <div className={`size-12 rounded-xl outline outline-2 outline-offset-[-2px] inline-flex justify-center items-center transition-all ${step.active ? 'outline-sky-600' : 'outline-zinc-500/30 group-hover:outline-sky-500/50'}`}>
                                        <span className={`text-center justify-center text-base font-bold font-['Inter'] leading-6 transition-colors ${step.active ? 'text-sky-600' : 'text-gray-500 group-hover:text-gray-300'}`}>{step.num}</span>
                                    </div>
                                </div>
                                <div className="pb-1 flex flex-col justify-start items-start text-center w-full">
                                    <h3 className="w-full justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">{step.title}</h3>
                                </div>
                                <div className="w-full text-center justify-center text-gray-500 text-xs font-normal font-['Inter'] leading-4">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Build with Infrastructure-Grade Precision */}
            <section className="w-full py-9 bg-stone-50 flex flex-col justify-center items-center">
                <div className="w-full max-w-[1440px] px-6 lg:px-28 flex flex-col lg:flex-row justify-start items-center gap-12">
                    <div className="flex-1 flex flex-col justify-start items-start w-full">
                        <img className="w-full max-w-[584px] aspect-square object-cover relative rounded-lg shadow-2xl border border-slate-200" src="/image/documen/doc.jpg" alt="Developer Ecosystem" />
                    </div>
                    <div className="flex-1 flex flex-col justify-start items-start gap-4 w-full">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <span className="justify-center text-sky-600 text-xs font-bold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">DEVELOPER PORTAL</span>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <h2 className="justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Build with Infrastructure-Grade<br className="hidden lg:block"/>Precision</h2>
                        </div>
                        <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                            <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Our developer ecosystem is designed for speed without compromising<br className="hidden lg:block"/>sovereign control. Access tools that bridge the gap between code and<br className="hidden lg:block"/>compliance.</p>
                        </div>
                        <div className="self-stretch pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 w-full">
                            {[
                                { title: 'API Reference', icon: 'Icon20.svg' },
                                { title: 'Webhooks', icon: 'Icon21.svg' },
                                { title: 'Sandbox Environment', icon: 'Icon22.svg' },
                                { title: 'Sample Flows', icon: 'Icon23.svg' }
                            ].map((item, i) => (
                                <div key={i} className="inline-flex justify-start items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                                    <div className="p-2.5 bg-sky-600/10 rounded-sm inline-flex justify-center items-center shrink-0">
                                        <img src={`/image/documen/${item.icon}`} alt={item.title} className="w-4 h-4 object-contain" />
                                    </div>
                                    <div className="inline-flex flex-col justify-start items-start">
                                        <span className="justify-center text-black text-[15px] font-semibold font-['Inter'] leading-6 group-hover:text-sky-600 transition-colors">{item.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Governance & Access Controls */}
            <section className="w-full py-24 bg-white flex justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col gap-12">
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk']">Governance & Access Controls</h2>
                        <p className="text-slate-600 text-base">Transparency into document security and jurisdictional sensitivity.</p>
                    </div>
                    <div className="w-full overflow-x-auto border border-slate-200 rounded-sm shadow-sm">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-zinc-100 border-b border-slate-200">
                                <tr>
                                    <th className="p-6 text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider w-1/5">TIER</th>
                                    <th className="p-6 text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider w-1/5">REQUIREMENT</th>
                                    <th className="p-6 text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider w-2/5">SCOPE</th>
                                    <th className="p-6 text-slate-600 text-xs font-semibold font-['JetBrains_Mono'] uppercase tracking-wider w-1/5">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-6 text-sky-600 font-bold">Public</td>
                                    <td className="p-6 text-slate-600">None</td>
                                    <td className="p-6 text-slate-600">High-level platform architecture & capabilities</td>
                                    <td className="p-6 font-bold text-zinc-900 cursor-pointer hover:text-sky-600 transition-colors">Download Pack</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-6 text-sky-600 font-bold">Qualified</td>
                                    <td className="p-6 text-slate-600">Email Verification</td>
                                    <td className="p-6 text-slate-600">Implementation blueprints & regional packs</td>
                                    <td className="p-6 font-bold text-zinc-900 cursor-pointer hover:text-sky-600 transition-colors">Verify Identity</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-6 text-sky-600 font-bold">NDA Required</td>
                                    <td className="p-6 text-slate-600">Legal Sign-off</td>
                                    <td className="p-6 text-slate-600">Security schemas & audit evidence logs</td>
                                    <td className="p-6">
                                        <button className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-sm hover:bg-zinc-800 transition-colors shadow-md">Request Trust Pack</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-6 text-sky-600 font-bold">Customer-Gated</td>
                                    <td className="p-6 text-slate-600">Active Agreement</td>
                                    <td className="p-6 text-slate-600">Private endpoints & live ops manual</td>
                                    <td className="p-6 text-slate-400 cursor-not-allowed">Log In to Access</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 8. Bottom Quick Links */}
            <section className="w-full pt-12 pb-8 bg-stone-50 inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: 'Training Academy', desc: 'Certification paths for operators and administrators.', icon: 'Icon24.svg' },
                        { title: 'Release Notes', desc: 'Continuous improvements and regulatory updates.', icon: 'Icon25.svg' },
                        { title: 'Admin Guides', desc: 'Best practices for high-scale environment management.', icon: 'Icon26.svg' },
                        { title: 'Troubleshooting', desc: 'Diagnostic tools for integration & performance.', icon: 'Icon27.svg' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col justify-start items-start gap-4 group cursor-pointer">
                            <img src={`/image/documen/${item.icon}`} alt={item.title} className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="justify-center text-zinc-900 text-xl font-normal font-['Hanken_Grotesk'] leading-8 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-slate-600 text-sm font-normal font-['Inter'] leading-5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 9. Bottom CTA */}
            <section className="w-full py-28 bg-[#1a1c29] flex justify-center items-center text-center">
                <div className="w-full max-w-4xl px-6 flex flex-col items-center gap-10">
                    <h2 className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">
                        Need the documentation path for<br/>your telecom launch or<br/>modernization?
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto mt-4">
                        <Link href="/contact-us">
                            <button className="px-8 py-3.5 bg-[#1a88bb] hover:bg-[#15719e] transition-colors rounded-sm text-white text-sm font-semibold shadow-lg">
                                Request Platform Briefing
                            </button>
                        </Link>
                        <button className="px-8 py-3.5 bg-transparent border border-gray-500 hover:bg-white/10 transition-colors rounded-sm text-white text-sm font-semibold">
                            Request Documentation Access
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
