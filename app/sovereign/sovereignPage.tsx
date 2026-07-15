"use client";

import React from "react";
import Link from "next/link";

export default function SovereignDeploymentPage() {
    return (
        <div className="bg-gray-950 min-h-screen w-full flex flex-col items-center font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-white">

            {/* 1. HERO */}
            <div className="w-full flex justify-center bg-[#1a1e28] relative border-b border-white/5 py-20 lg:py-32">
                <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-8">
                    <div className="flex-1 flex flex-col justify-center items-start">
                        <div className="w-full pb-6 flex flex-col justify-start items-start">
                            <div className="w-full flex justify-start items-center gap-4">
                                <div className="px-3 py-1.5 bg-[#253026] rounded outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start items-start">
                                    <div className="justify-center text-lime-300 text-xs font-bold font-mono leading-3 tracking-widest">SOVEREIGN PROTOCOL</div>
                                </div>
                                <div className="w-10 h-px bg-white/10"></div>
                            </div>
                        </div>
                        <div className="w-full pb-6 flex flex-col justify-start items-start">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start">
                                    <span className="text-white text-5xl md:text-[56px] font-semibold font-['Hanken_Grotesk'] leading-[1.1] md:leading-[64px] tracking-tight">Sovereign Deployment:<br /></span>
                                    <span className="text-[#3286b1] text-5xl md:text-[56px] font-semibold font-['Hanken_Grotesk'] leading-[1.1] md:leading-[64px] tracking-tight">National-Grade Control.</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-[672px] relative mb-10">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="justify-center text-white/90 text-[15px] font-normal font-['Inter'] leading-7">Strict data residency, customer-approved infrastructure, and regulated release governance for sovereign operators. Architected for the most demanding national security requirements.</div>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-start gap-4">
                            <Link href="/contact-us" className="px-6 py-3.5 bg-[#2a7a9d] hover:bg-[#236886] transition-colors rounded-lg flex justify-center items-center gap-2 shadow-lg">
                                <div className="text-center justify-center text-white text-[13px] font-semibold font-['Inter'] leading-5">Request Sovereign Briefing</div>
                                <div className="flex flex-col justify-start items-center">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M11 14l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L17 8l-6 6z" fill="#2a7a9d" /></svg>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="w-full lg:w-[420px] relative flex flex-col justify-center items-end mt-12 lg:mt-0">
                        <div className="w-64 h-64 absolute right-[-20px] top-[0px] bg-sky-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="w-full px-8 pt-12 pb-8 bg-transparent rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 flex flex-col justify-center items-center gap-6 relative z-10">
                            <div className="w-full flex justify-start items-center gap-3">
                                <div className="w-2 h-2 bg-lime-400 rounded-full shadow-[0_0_8px_rgba(163,230,53,0.8)]"></div>
                                <div className="flex flex-col justify-start items-start">
                                    <div className="justify-center text-gray-300 text-xs font-bold font-mono leading-3 tracking-widest">SYSTEM STATUS: ENCRYPTED</div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start gap-3.5 mt-2">
                                <div className="w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start items-start">
                                    <div className="justify-center text-gray-400 text-[10px] font-medium font-mono leading-3">ROOT_IDENTITY_KEY: VALIDATED_HSM</div>
                                </div>
                                <div className="w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start items-start">
                                    <div className="justify-center text-gray-400 text-[10px] font-medium font-mono leading-3">RESIDENCY_PIN: GEO_LOCKED_EU_WEST_1</div>
                                </div>
                                <div className="w-full px-4 py-3 rounded outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-start items-start">
                                    <div className="justify-center text-gray-400 text-[10px] font-medium font-mono leading-3">AUDIT_TRAIL: IMMUTABLE_LEDGER_SYNC</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PILLARS */}
            <div className="w-full flex justify-center py-28 bg-[#1a1e28]">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-20">
                    <div className="w-full flex flex-col justify-start items-center gap-4">
                        <div className="w-full flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">The Sovereignty Pillars</div>
                        </div>
                        <div className="w-full max-w-[576px] flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-white/60 text-base font-normal font-['Inter'] leading-6">Foundational engineering principles that ensure total technological<br className="hidden md:block" />independence.</div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="w-full p-8 bg-gray-800/40 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 hover:outline-white/20 transition-all flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-[#23311f] rounded flex justify-center items-center">
                                <img src="/image/sovereign/icon1.svg" alt="Logical Isolation" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Logical Isolation</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Hardened multi-tenancy with zero-shared compute resources at the application and database tiers.</div>
                            </div>
                        </div>
                        <div className="w-full p-8 bg-gray-800/40 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 hover:outline-white/20 transition-all flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-[#23311f] rounded flex justify-center items-center">
                                <img src="/image/sovereign/icon2.svg" alt="Independent Keys" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Independent Keys</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Customer-managed key hierarchies with mandatory Hardware Security Module (HSM) integration.</div>
                            </div>
                        </div>
                        <div className="w-full p-8 bg-gray-800/40 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 hover:outline-white/20 transition-all flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-[#23311f] rounded flex justify-center items-center">
                                <img src="/image/sovereign/icon3.svg" alt="Region-aware" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Region-aware</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Physically pinned data storage within sovereign boundaries including all telemetry and logs.</div>
                            </div>
                        </div>
                        <div className="w-full p-8 bg-gray-800/40 rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 hover:outline-white/20 transition-all flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-[#23311f] rounded flex justify-center items-center">
                                <img src="/image/sovereign/icon4.svg" alt="Regulated Access" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Regulated Access</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Strict "no-access" defaults for vendor staff with Just-In-Time (JIT) approval workflows.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. GEOSPATIAL PINNING */}
            <div className="w-full px-6 py-28 bg-[#1a1e28] flex flex-col justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-24">
                    <div className="flex-1 flex flex-col justify-start items-start gap-4">
                        <div className="w-full flex flex-col justify-start items-start">
                            <div className="w-full justify-start text-cyan-500 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">GEOSPATIAL PINNING</div>
                        </div>
                        <div className="w-full flex flex-col justify-start items-start">
                            <div className="w-full justify-start text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-tight lg:leading-[48px]">Data Residency Grid</div>
                        </div>
                        <div className="w-full pt-2 flex flex-col justify-start items-start">
                            <div className="w-full justify-start text-white/70 text-lg font-normal font-['Inter'] leading-7">Control exactly where your data lives. Our residency engine allows national infrastructure leads to pin tenant data, backups, and secondary replicas to specific geographic coordinates or regional jurisdictions.</div>
                        </div>
                        <div className="w-full pt-4 flex flex-col justify-start items-start gap-4">
                            <div className="w-full flex justify-start items-center gap-4">
                                <div className="flex flex-col justify-start items-start text-cyan-500">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div className="justify-center text-white/80 text-base font-normal font-['Inter'] leading-6">Cross-region synchronization disabled by default</div>
                            </div>
                            <div className="w-full flex justify-start items-center gap-4">
                                <div className="flex flex-col justify-start items-start text-cyan-500">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div className="justify-center text-white/80 text-base font-normal font-['Inter'] leading-6">Automated residency compliance reporting</div>
                            </div>
                            <div className="w-full flex justify-start items-center gap-4">
                                <div className="flex flex-col justify-start items-start text-cyan-500">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <div className="justify-center text-white/80 text-base font-normal font-['Inter'] leading-6">Physical node validation before data movement</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative bg-gray-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300/10 flex flex-col justify-center items-start overflow-hidden">
                        <img src="/image/sovereign/map.png" alt="Geospatial Map" className="w-full h-[400px] object-cover opacity-60 mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/30 to-gray-900/0"></div>
                        <div className="absolute left-[25px] bottom-[25px] flex flex-col justify-start items-start z-10">
                            <div className="px-3 py-1.5 bg-[#2a78a1] rounded-full flex justify-start items-center gap-2 shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <div className="justify-center text-white text-xs font-semibold font-['Inter'] leading-4">ACTIVE PIN: BERLIN_DE_01</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. AUDITABILITY */}
            <div className="w-full flex justify-center py-28 bg-[#1a1e28] border-y border-white/5">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-4">
                    <div className="w-full flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-sky-500 text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">VERIFIABLE TRUST</div>
                    </div>
                    <div className="w-full flex flex-col justify-start items-center">
                        <div className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Evidence-Grade Auditability</div>
                    </div>
                    <div className="w-full pt-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
                        <div className="w-full md:p-8 flex flex-col justify-start items-start gap-2">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-5xl font-bold font-['Inter'] leading-[48px]">100%</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start mt-2">
                                <div className="w-full justify-start text-lime-300 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Immutable Ledger</div>
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Every administrative action is hashed and committed to a write-once ledger, preventing retrospective modification.</div>
                            </div>
                        </div>
                        <div className="w-full md:p-8 flex flex-col justify-start items-start gap-2">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-5xl font-bold font-['Inter'] leading-[48px]">0ms</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start mt-2">
                                <div className="w-full justify-start text-lime-300 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Real-time Stream</div>
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Audit logs are streamed instantly to customer SIEM platforms via encrypted, authenticated webhooks.</div>
                            </div>
                        </div>
                        <div className="w-full md:p-8 flex flex-col justify-start items-start gap-2">
                            <div className="w-full flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white text-5xl font-bold font-['Inter'] leading-[48px]">Audit+</div>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start mt-2">
                                <div className="w-full justify-start text-lime-300 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Visual Playback</div>
                            </div>
                            <div className="w-full pt-2 flex flex-col justify-start items-start">
                                <div className="w-full justify-start text-white/60 text-base font-normal font-['Inter'] leading-6">Session recording for high-privileged activities ensures a complete visual context for forensic investigations.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. PROCUREMENT */}
            <div className="w-full flex justify-center pt-28 pb-20 bg-[#1a1e28] overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-16">
                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-center items-stretch gap-4">
                        <div className="flex-1 p-8 py-16 bg-[#232731] rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-center items-center text-center shadow-lg hover:bg-[#282c38] transition-colors">
                            <div className="pb-6 flex flex-col justify-start items-center">
                                <img src="/image/sovereign/icon5.svg" alt="GDPR+" className="w-7 h-7 object-contain" />
                            </div>
                            <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">GDPR+</div>
                            <div className="pt-2 text-white/50 text-sm font-normal font-['Inter'] leading-4">Enhanced Residency</div>
                        </div>
                        <div className="flex-1 sm:mt-12 p-8 py-16 bg-[#232731] rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/5 flex flex-col justify-center items-center text-center shadow-lg hover:bg-[#282c38] transition-colors">
                            <div className="pb-6 flex flex-col justify-start items-center">
                                <img src="/image/sovereign/icon6.svg" alt="Sovereign-Ready" className="w-7 h-7 object-contain" />
                            </div>
                            <div className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Sovereign-Ready</div>
                            <div className="pt-2 text-white/50 text-sm font-normal font-['Inter'] leading-4">Legal Compliance</div>
                        </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-start items-start gap-6">
                        <div className="w-full flex flex-col justify-start items-start">
                            <div className="w-full justify-start text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Procurement Confidence</div>
                        </div>
                        <div className="w-full flex flex-col justify-start items-start">
                            <div className="w-full justify-start text-white/70 text-lg font-normal font-['Inter'] leading-7">ZoikoNex provides the long-term retention controls and compliance-ready reporting required by national procurement entities. We ensure your BSS infrastructure isn't just modern, but legally resilient.</div>
                        </div>
                        <div className="w-full pt-4 flex flex-col justify-start items-start gap-6">
                            <div className="w-full p-5 bg-[#202531] rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 flex justify-start items-center gap-4 hover:bg-[#252a38] transition-colors">
                                <div className="w-12 h-12 shrink-0 bg-[#2a78a1]/20 rounded-xl flex justify-center items-center">
                                    <img src="/image/sovereign/icon7.svg" alt="10-Year Data Retention" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                                    <div className="justify-center text-white text-[15px] font-semibold font-['Inter'] leading-6">10-Year Data Retention</div>
                                    <div className="justify-center text-white/50 text-[13px] font-normal font-['Inter'] leading-5">Configure immutable archival for long-term historical compliance.</div>
                                </div>
                            </div>
                            <div className="w-full p-5 bg-[#202531] rounded-xl outline outline-1 outline-offset-[-1px] outline-white/5 flex justify-start items-center gap-4 hover:bg-[#252a38] transition-colors">
                                <div className="w-12 h-12 shrink-0 bg-[#2a78a1]/20 rounded-xl flex justify-center items-center">
                                    <img src="/image/sovereign/icon8.svg" alt="Regulated Release Governance" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start gap-0.5">
                                    <div className="justify-center text-white text-[15px] font-semibold font-['Inter'] leading-6">Regulated Release Governance</div>
                                    <div className="justify-center text-white/50 text-[13px] font-normal font-['Inter'] leading-5">Client-side sign-off for all binary updates and patches.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. CTA */}
            <div className="w-full px-6 flex justify-center pb-24 bg-[#1a1e28]">
                <div className="w-full max-w-[1232px] px-8 md:px-28 py-16 relative bg-[#2a78a1] rounded-3xl flex flex-col justify-center items-center overflow-hidden shadow-2xl">
                    <div className="absolute right-[-100px] top-[-50px] opacity-20 pointer-events-none">
                        <div className="w-[400px] h-[400px] bg-white rounded-full blur-[120px]"></div>
                    </div>
                    <div className="w-full max-w-[672px] relative z-10 flex flex-col justify-start items-center gap-6 text-center">
                        <div className="w-full flex flex-col justify-start items-center">
                            <div className="w-full text-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Secure Your Sovereign Future</div>
                        </div>
                        <div className="w-full pb-2 flex flex-col justify-start items-center">
                            <div className="w-full text-center text-white/90 text-lg font-normal font-['Inter'] leading-7">Join the world's most regulated operators who trust ZoikoNex for their<br className="hidden md:block" />national-grade BSS infrastructure.</div>
                        </div>
                        <div className="w-full pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link href="/contact-us" className="px-8 py-4 bg-white hover:bg-gray-50 transition-colors rounded-lg flex flex-col justify-center items-center shadow">
                                <div className="text-center justify-center text-[#2a78a1] text-base font-semibold font-['Inter'] leading-6">Request a Sovereign Briefing</div>
                            </Link>
                            <Link href="#whitepaper" className="px-8 py-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/40 hover:bg-white/10 transition-colors flex flex-col justify-center items-center">
                                <div className="text-center justify-center text-white text-base font-semibold font-['Inter'] leading-6">Download Whitepaper</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
