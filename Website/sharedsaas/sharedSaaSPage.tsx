import React from 'react';
import Link from 'next/link';

export default function SharedSaaSPage() {
    return (
        <div className="w-full flex flex-col items-center overflow-hidden bg-white">
            {/* Hero Section */}
            <div className="w-full max-w-[1440px] px-6 pt-5 pb-16 bg-white inline-flex flex-col justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] inline-flex justify-center items-center gap-16">
                    <div className="flex-1 max-w-[672px] pt-0.5 inline-flex flex-col justify-start items-start gap-6">
                        <div className="px-3 py-1 bg-cyan-700 rounded-xl inline-flex justify-start items-start">
                            <div className="justify-center text-white text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider">SHARED SAAS MODEL</div>
                        </div>
                        <div className="self-stretch pt-[1.20px] flex flex-col justify-start items-start">
                            <div className="self-stretch justify-center text-black text-6xl font-bold font-['Hanken_Grotesk'] leading-[66px]">Shared SaaS: Launch<br />at the Speed of<br />Demand.</div>
                        </div>
                        <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
                            <div className="self-stretch justify-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">Governed monetization infrastructure without the operational<br />burden of dedicated hardware. Scale your digital operator<br />ecosystem with mathematical precision.</div>
                        </div>
                        <div className="self-stretch pt-2.5 inline-flex justify-start items-start gap-4">
                            <Link href="/request-a-demo" className="px-8 py-4 relative bg-cyan-700 rounded-lg inline-flex flex-col justify-center items-center cursor-pointer hover:bg-cyan-800 transition-colors">
                                <div className="w-44 h-12 left-0 top-0 absolute bg-white/0 rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg"></div>
                                <div className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Request a Demo</div>
                            </Link>
                            <div className="px-8 py-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-center items-center cursor-pointer hover:bg-stone-50 transition-colors">
                                <div className="text-center justify-center text-black text-sm font-semibold font-['Inter'] leading-4">Talk to an Architect</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 bg-zinc-100 rounded-xl flex justify-center items-center">
                        <div className="w-full h-[400px] relative bg-blend-saturation bg-white rounded-xl shadow-2xl overflow-hidden">
                            <img src="/image/shared/hero.jpg" alt="Shared SaaS Model" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sovereign Logic Section */}
            <div className="w-full max-w-[1440px] px-6 pt-12 pb-20 bg-stone-100 inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-16">
                    <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Sovereign Logic, Shared Resource</div>
                        </div>
                        <div className="w-[768px] max-w-[768px] pb-[0.69px] flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">Our multi-tenant architecture ensures complete separation of data and logic while<br />leveraging global infrastructure clusters.</div>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-center items-start gap-8 flex-wrap">
                        <div className="w-96 px-8 pt-8 pb-16 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/80 backdrop-blur-[6px] inline-flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch inline-flex justify-start items-center gap-4">
                                <div className="px-3 pt-3 pb-5 bg-cyan-700/20 rounded-sm inline-flex flex-col justify-start items-start">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <img src="/image/shared/page4.svg" alt="Icon 1" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="inline-flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Logical Isolation</div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Encrypted tenant schemas with hard-<br />coded partitioning at the database level.<br />Zero cross-leakage risk for BSS data.</div>
                            </div>
                            <div className="self-stretch h-1 relative bg-stone-300/20 rounded-xl overflow-hidden mt-auto">
                                <div className="w-52 h-1 left-0 top-0 absolute bg-cyan-700"></div>
                            </div>
                        </div>
                        <div className="w-96 p-8 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/80 backdrop-blur-[6px] inline-flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch inline-flex justify-start items-center gap-4">
                                <div className="px-3 pt-3 pb-5 bg-cyan-700/20 rounded-sm inline-flex flex-col justify-start items-start">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <img src="/image/shared/page3.svg" alt="Icon 2" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="pr-28 inline-flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Region-Aware<br />Assignment</div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Dynamic tenant placement based on<br />regulatory residency and latency<br />requirements. Data stays within legal<br />jurisdictions.</div>
                            </div>
                            <div className="self-stretch h-1 relative bg-stone-300/20 rounded-xl overflow-hidden mt-auto">
                                <div className="w-40 h-1 left-0 top-0 absolute bg-cyan-700"></div>
                            </div>
                        </div>
                        <div className="w-96 p-8 bg-white/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/80 backdrop-blur-[6px] inline-flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch inline-flex justify-start items-center gap-4">
                                <div className="px-3 pt-3 pb-5 bg-cyan-700/20 rounded-sm inline-flex flex-col justify-start items-start">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <img src="/image/shared/page2.svg" alt="Icon 3" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="pr-16 inline-flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Managed Security<br />Patching</div>
                                </div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Automated CVE remediation across all<br />shared clusters. Your environment is<br />always hardened without manual<br />intervention.</div>
                            </div>
                            <div className="self-stretch h-1 relative bg-stone-300/20 rounded-xl overflow-hidden mt-auto">
                                <div className="w-60 h-1 left-0 top-0 absolute bg-cyan-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Uncompromising BSS Capabilities Section */}
            <div className="w-full max-w-[1440px] px-6 py-28 bg-white inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] inline-flex justify-center items-start gap-20">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <div className="self-stretch justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Uncompromising BSS<br />Capabilities</div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch p-6 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-start items-start gap-6 bg-white">
                                <div className="inline-flex flex-col justify-start items-start pt-1">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <img src="/image/shared/icon4.svg" alt="Icon 4" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Managed Platform Upgrades</div>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Automated CI/CD pipelines handle zero-downtime upgrades<br />for core BSS modules.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch p-6 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-start items-start gap-6 bg-white">
                                <div className="inline-flex flex-col justify-start items-start pt-1">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <img src="/image/shared/icon5.svg" alt="Icon 5" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Standard Carrier Integrations</div>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Pre-built connectors for major MNOs (GSMA standard) to<br />accelerate go-to-market.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch p-6 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex justify-start items-start gap-6 bg-white">
                                <div className="inline-flex flex-col justify-start items-start pt-1">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <img src="/image/shared/icon6.svg" alt="Icon 6" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Evidence-Grade Audit Continuity</div>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Real-time logging and immutable audit trails suitable for Tier-1<br />financial compliance.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative inline-flex flex-col justify-start items-start">
                        <img className="self-stretch w-full h-[600px] object-cover relative rounded-2xl shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.10)] shadow-xl" src="/image/shared/capabilities.png" alt="Capabilities" />
                        <div className="p-8 left-[-40px] top-[484px] absolute bg-gray-800 rounded-2xl flex flex-col justify-start items-start">
                            <div className="w-72 h-40 left-0 top-0 absolute bg-white/0 rounded-2xl shadow-2xl"></div>
                            <div className="self-stretch flex flex-col justify-start items-start relative z-10">
                                <div className="justify-center text-lime-400 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">AVERAGE TTM</div>
                            </div>
                            <div className="self-stretch pt-2 flex flex-col justify-start items-start relative z-10">
                                <div className="justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">14 DAYS</div>
                            </div>
                            <div className="self-stretch opacity-70 flex flex-col justify-start items-start relative z-10">
                                <div className="justify-center text-white text-base font-normal font-['Inter'] leading-6">From contract to live billing.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Launch in Days Section */}
            <div className="w-full max-w-[1440px] px-6 pt-14 pb-12 bg-stone-200 inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
                <div className="w-full max-w-[1280px] flex flex-col justify-start items-center gap-3.5">
                    <div className="self-stretch flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Launch in Days, Not Months</div>
                    </div>
                    <div className="w-[672px] max-w-[672px] pb-[0.69px] flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">A structured migration and onboarding path designed for operational speed<br />and commercial urgency.</div>
                    </div>
                </div>
                <div className="w-[896px] max-w-[896px] flex flex-col justify-start items-start">
                    <div className="self-stretch pb-12 relative inline-flex justify-start items-start gap-8">
                        <div className="w-0.5 h-[calc(100%+2rem)] left-[23.5px] top-[48px] absolute bg-slate-300"></div>
                        <div className="w-12 h-12 shrink-0 bg-cyan-700 rounded-xl flex justify-center items-center z-10">
                            <div className="text-center justify-center text-white text-base font-bold font-['Nimbus_Sans'] leading-6">1</div>
                        </div>
                        <div className="flex-1 self-stretch p-8 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Provisioning & Tenant Setup</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Instance instantiation in your chosen region. Automated DNS and SSL certificate generation.</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch pb-12 relative inline-flex justify-start items-start gap-8">
                        <div className="w-0.5 h-[calc(100%+2rem)] left-[23.5px] top-[48px] absolute bg-slate-300"></div>
                        <div className="w-12 h-12 shrink-0 bg-cyan-700 rounded-xl flex justify-center items-center z-10">
                            <div className="text-center justify-center text-white text-base font-bold font-['Nimbus_Sans'] leading-6">2</div>
                        </div>
                        <div className="flex-1 self-stretch p-8 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Carrier Interconnect</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Integration with MNO host via ZoikoNex Standard Gateway. Testing signal flow and packet gateway<br />connectivity.</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch pb-12 relative inline-flex justify-start items-start gap-8">
                        <div className="w-0.5 h-[calc(100%+2rem)] left-[23.5px] top-[48px] absolute bg-slate-300"></div>
                        <div className="w-12 h-12 shrink-0 bg-cyan-700 rounded-xl flex justify-center items-center z-10">
                            <div className="text-center justify-center text-white text-base font-bold font-['Nimbus_Sans'] leading-6">3</div>
                        </div>
                        <div className="flex-1 self-stretch p-8 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Product Catalog Launch</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Configuration of rate plans, data bundles, and promotional monetization logic.</div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-start gap-8 relative">
                        <div className="w-12 h-12 shrink-0 bg-cyan-700 rounded-xl flex justify-center items-center z-10">
                            <div className="text-center justify-center text-white text-base font-bold font-['Nimbus_Sans'] leading-6">4</div>
                        </div>
                        <div className="flex-1 self-stretch p-8 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Commercial Go-Live</div>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <div className="self-stretch justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Switching to production clusters. Active monitoring and 24/7 sovereign support activation.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Infrastructure-Grade Trust Section */}
            <div className="w-full max-w-[1440px] px-24 py-16 bg-white inline-flex flex-col justify-center items-center">
                <div className="self-stretch inline-flex justify-center items-center gap-16">
                    <div className="flex-1 pb-8 inline-flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <div className="self-stretch justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Infrastructure-Grade Trust</div>
                        </div>
                        <div className="self-stretch pb-[0.69px] flex flex-col justify-start items-start">
                            <div className="self-stretch justify-center text-slate-600 text-lg font-normal font-['Inter'] leading-7">Shared resources never mean shared vulnerabilities. Our security<br />architecture is mathematically isolated and independently audited.</div>
                        </div>
                        <div className="self-stretch pt-2.5 grid grid-cols-2 gap-4">
                            <div className="self-stretch p-6 bg-stone-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex flex-col justify-center items-center">
                                <div className="pb-3 flex flex-col justify-start items-start text-black w-6 h-7">
                                    <img src="/image/shared/page5.svg" alt="GDPR Compliant" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">GDPR COMPLIANT</div>
                                </div>
                            </div>
                            <div className="self-stretch p-6 bg-stone-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex flex-col justify-center items-center">
                                <div className="pb-3 flex flex-col justify-start items-start text-black w-6 h-7">
                                    <img src="/image/shared/page6.svg" alt="ISO 27001" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">ISO 27001</div>
                                </div>
                            </div>
                            <div className="self-stretch p-6 bg-stone-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex flex-col justify-center items-center">
                                <div className="pb-3 flex flex-col justify-start items-start text-black w-7 h-7">
                                    <img src="/image/shared/page8.svg" alt="SOC 2 Type II" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">SOC 2 TYPE II</div>
                                </div>
                            </div>
                            <div className="self-stretch p-6 bg-stone-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-200 inline-flex flex-col justify-center items-center">
                                <div className="pb-3 flex flex-col justify-start items-start text-black w-6 h-8">
                                    <img src="/image/shared/page9.svg" alt="PCI-DSS Level 1" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="justify-center text-zinc-900 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider">PCI-DSS LEVEL 1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 min-h-96 px-12 py-40 bg-[#297b9c] rounded-3xl flex justify-center items-center overflow-hidden">
                        <div className="inline-flex flex-col justify-start items-start gap-4">
                            <div className="self-stretch flex flex-col justify-start items-center">
                                <div className="text-center justify-center text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Logical Tenant Separation</div>
                            </div>
                            <div className="w-full max-w-96 flex flex-col justify-start items-center">
                                <div className="text-center justify-center text-white/70 text-base font-normal font-['Inter'] leading-6">Real-time visualization of data tunneling and zero-<br />trust verification between client nodes.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-full max-w-[1440px] px-48 py-24 bg-[#297b9c] inline-flex flex-col justify-center items-center">
                <div className="w-full max-w-[896px] flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Ready to Disrupt the Market?</div>
                    </div>
                    <div className="self-stretch pb-[0.69px] opacity-90 flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-white text-lg font-normal font-['Inter'] leading-7">Join 40+ global digital operators who launched their commercial footprint in under 30 days using our<br />SaaS infrastructure.</div>
                    </div>
                    <div className="self-stretch pt-4 inline-flex justify-center items-start gap-4">
                        <Link href="/request-a-demo" className="px-10 py-5 bg-white rounded-lg inline-flex flex-col justify-center items-center cursor-pointer hover:bg-stone-100 transition-colors">
                            <div className="text-center justify-center text-cyan-700 text-sm font-semibold font-['Inter'] leading-4">Request a Demo</div>
                        </Link>
                        <div className="px-10 py-5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white inline-flex flex-col justify-center items-center cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="w-32 text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Talk to an Architect</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
