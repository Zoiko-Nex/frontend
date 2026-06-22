import React from 'react';
import { CheckCircle2, Globe, AlertTriangle, FileText, Server, Zap, Receipt, ChevronRight } from 'lucide-react';

export default function MVNOLaunch() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="w-full min-h-[716px] px-6 py-24 md:py-28 bg-gradient-to-b from-black to-gray-900 flex justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] flex flex-col lg:flex-row justify-center items-center gap-12">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
                        <div className="px-3 py-1 bg-white/10 rounded-sm inline-flex justify-start items-start">
                            <div className="justify-center text-cyan-500 text-xs font-semibold font-mono leading-3 tracking-wider uppercase">CASE STUDY: GLOBAL INFRASTRUCTURE</div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start mt-2">
                            <h1 className="self-stretch text-white text-5xl md:text-6xl font-bold leading-[1.1]">
                                MVNO Launch<br className="hidden lg:block" />Readiness: From<br className="hidden lg:block" />Concept to Live<br className="hidden lg:block" />Production in 42 Days.
                            </h1>
                        </div>
                        <div className="max-w-[576px] flex flex-col justify-start items-start mt-4">
                            <p className="text-gray-400 text-lg font-normal leading-relaxed">
                                How a European greenfield operator bypassed two years of legacy integration hurdles to deploy a sovereign-grade BSS architecture in record time.
                            </p>
                        </div>
                        <div className="self-stretch pt-4 inline-flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <div className="flex justify-start items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                                <div className="justify-center text-cyan-500 text-sm font-semibold font-mono leading-6 uppercase">65% FASTER TTM</div>
                            </div>
                            <div className="hidden sm:block w-px h-6 bg-stone-300/30"></div>
                            <div className="flex justify-start items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                                <div className="justify-center text-cyan-500 text-sm font-semibold font-mono leading-6 uppercase">100% REGULATORY COMPLIANT</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative inline-flex flex-col justify-start items-center lg:items-end mt-8 lg:mt-0 z-10">
                        <div className="w-full max-w-[616px] relative">
                            <div className="absolute -inset-4 bg-lime-300/10 rounded-xl blur-3xl z-0 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-white/0 rounded-lg shadow-[0px_0px_40px_-10px_rgba(191,243,101,0.15)] pointer-events-none"></div>
                            <div className="w-full p-6 sm:p-8 relative z-10 bg-gray-800/80 rounded-lg outline outline-1 outline-offset-[-1px] outline-stone-300/20 backdrop-blur-[6px] flex flex-col justify-start items-start">
                                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                                    <div className="self-stretch flex justify-between items-end">
                                        <div className="inline-flex flex-col justify-start items-start gap-1">
                                            <div className="flex flex-col justify-start items-start">
                                                <div className="justify-center text-gray-500 text-xs sm:text-sm font-semibold font-mono leading-6 uppercase tracking-wider">NETWORK UPTIME</div>
                                            </div>
                                            <div className="flex flex-col justify-start items-start">
                                                <div className="justify-center text-lime-300 text-3xl sm:text-4xl font-semibold leading-tight">99.999%</div>
                                            </div>
                                        </div>
                                        <div className="inline-flex flex-col justify-start items-end gap-1">
                                            <div className="flex flex-col justify-start items-end">
                                                <div className="text-right justify-center text-gray-500 text-xs sm:text-sm font-semibold font-mono leading-6 uppercase tracking-wider">LATENCY</div>
                                            </div>
                                            <div className="flex flex-col justify-start items-end">
                                                <div className="text-right justify-center text-white text-sm sm:text-base font-medium leading-6">&lt; 14ms</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-stretch h-32 p-2 bg-black/50 rounded outline outline-1 outline-offset-[-1px] outline-white/5 flex justify-between items-end gap-1">
                                        <div className="flex-1 h-[35%] bg-lime-300/60 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[40%]"></div>
                                        <div className="flex-1 h-[50%] bg-lime-300/60 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[55%]"></div>
                                        <div className="flex-1 h-[75%] bg-lime-300/80 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[80%]"></div>
                                        <div className="flex-1 h-full bg-lime-300 rounded-t-sm transition-all duration-500 hover:bg-lime-400"></div>
                                        <div className="flex-1 h-[75%] bg-lime-300/80 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[80%]"></div>
                                        <div className="flex-1 h-[25%] bg-lime-300/40 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[30%]"></div>
                                        <div className="flex-1 h-[65%] bg-lime-300/70 rounded-t-sm transition-all duration-500 hover:bg-lime-300 hover:h-[70%]"></div>
                                    </div>
                                    <div className="self-stretch flex flex-col justify-start items-start">
                                        <div className="self-stretch text-gray-400 text-sm leading-relaxed italic">
                                            "ZoikoNex provided the exact mathematical precision our regulatory board required for market entry."
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Context, Challenges & Banner Section */}
            <section className="w-full py-16 bg-white flex justify-center">
                <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Context */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                        <div>
                            <Globe className="w-8 h-8 text-sky-500 mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Context</h3>
                            <p className="text-slate-600 text-base leading-relaxed">
                                A major European greenfield MVNO required rapid entry into a saturated market. The mandate: full regulatory compliance across multi-national jurisdictions without sacrificing the speed of a startup.
                            </p>
                        </div>

                        <div className="mt-8">
                            <div className="w-full h-px bg-slate-100 mb-6"></div>
                            <div className="flex flex-col gap-2 text-sm font-bold tracking-wider text-black font-mono">
                                <div>LOCATION: EU REGION</div>
                                <div>MARKET: TIER-1 GREENFIELD</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Challenges and Banner */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Challenges Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                                <AlertTriangle className="w-6 h-6 text-red-500 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Challenge: Fragmentation</h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed">
                                    Legacy BSS fragmentation caused severe delays. Disconnected databases for SIM provisioning and customer records led to inconsistent billing logic and high error rates during testing.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
                                <FileText className="w-6 h-6 text-red-500 mb-6" />
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Challenge: Taxation</h3>
                                <p className="text-slate-600 text-[15px] leading-relaxed">
                                    Complex multi-region taxation requirements threatened to delay the launch by months. Manual reconciliation processes were prone to compliance risks and revenue leakage.
                                </p>
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="w-full h-48 rounded-xl overflow-hidden relative flex items-center p-8 bg-[#050b14]">
                            {/* Dashboard Background Image */}
                            <img
                                src="/image/launch/one.png"
                                className="absolute inset-0 w-full h-full object-cover opacity-50"
                                alt="Dashboard background"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                            <div className="relative z-10 max-w-[420px]">
                                <h2 className="text-2xl font-bold text-white leading-snug">
                                    Bridging the gap between legacy limitations and sovereign control.
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Framework Section */}
            <section className="w-full px-6 py-24 bg-black flex flex-col justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-16">
                    <div className="w-full max-w-[672px] flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <h2 className="self-stretch text-cyan-700 text-3xl md:text-4xl font-semibold leading-tight md:leading-[48px] tracking-widest uppercase">
                                THE SOLUTION: ZOIKONEX CORE<br className="hidden md:block" />FRAMEWORK
                            </h2>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <p className="self-stretch text-gray-500 text-base font-normal leading-relaxed">
                                We deployed the 'Sovereign Spine'—a unified architectural layer that connects disparate catalog, charging, and billing domains into a single, high-fidelity orchestration engine.
                            </p>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 justify-center items-start">
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded flex justify-center items-center shadow-sm">
                                <img src="/image/launch/icon8.svg" alt="Unified Catalog" className="w-6 h-6" />
                            </div>
                            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-white text-2xl font-semibold leading-8">Unified Catalog</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-gray-500 text-base font-normal leading-relaxed">
                                    Single source of truth for all product offers, reducing configuration time from weeks to hours.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded flex justify-center items-center shadow-sm">
                                <img src="/image/launch/icon9.svg" alt="Real-Time Charging" className="w-6 h-6" />
                            </div>
                            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-white text-2xl font-semibold leading-8">Real-Time Charging</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-gray-500 text-base font-normal leading-relaxed">
                                    High-density processing engine handling millions of events per second with sub-millisecond latency.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded flex justify-center items-center shadow-sm">
                                <img src="/image/launch/icon10.svg" alt="Automated Billing" className="w-6 h-6" />
                            </div>
                            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                                <h3 className="self-stretch text-white text-2xl font-semibold leading-8">Automated Billing</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="self-stretch text-gray-500 text-base font-normal leading-relaxed">
                                    Intelligent taxation modules that automatically adjust per jurisdiction, ensuring 100% audit-readiness.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quantifiable Impact Section */}
            <section className="w-full py-20 bg-white border-b border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="max-w-5xl w-full px-6 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16">Quantifiable Impact</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-b border-gray-100 py-10">
                        <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
                            <div className="text-5xl font-extrabold text-blue-500 mb-4">65%</div>
                            <p className="text-gray-600 font-medium">Faster Time-to-Market</p>
                        </div>
                        <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0">
                            <div className="text-5xl font-extrabold text-blue-500 mb-4">40%</div>
                            <p className="text-gray-600 font-medium">OpEx Savings Annually</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-extrabold text-blue-500 mb-4">100%</div>
                            <p className="text-gray-600 font-medium">Compliance Record</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Section */}
            <section className="w-full px-6 py-28 bg-zinc-100 flex flex-col justify-center items-center">
                <div className="w-full max-w-[1280px] p-8 md:p-12 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-start items-start gap-12">
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <h2 className="self-stretch text-black text-3xl md:text-4xl font-semibold leading-tight md:leading-[48px]">Architecture: The Sovereign Spine</h2>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <p className="self-stretch text-slate-600 text-base font-normal leading-6">Conceptual workflow of the high-density integration layer.</p>
                        </div>
                    </div>
                    <div className="self-stretch py-12 relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                        {/* Connecting Line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-stone-300 transform -translate-y-1/2 z-0"></div>

                        <div className="flex-1 flex flex-col justify-start items-center z-10 w-full md:w-auto">
                            <div className="w-full md:w-48 p-4 bg-black rounded-sm flex justify-center items-start shadow-md">
                                <span className="text-center text-white text-sm md:text-base font-normal font-mono">Core Network</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-center z-10 w-full md:w-auto my-4 md:my-0">
                            <div className="w-full md:w-64 p-6 relative bg-lime-300 rounded-lg outline outline-4 outline-offset-[-4px] outline-white flex justify-center items-start shadow-lg">
                                <span className="text-center text-black text-base font-semibold font-mono">ZoikoNex Spine</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-center z-10 w-full md:w-auto">
                            <div className="w-full md:w-48 p-4 bg-black rounded-sm flex justify-center items-start shadow-md">
                                <span className="text-center text-white text-sm md:text-base font-normal font-mono">Business Logic</span>
                            </div>
                        </div>
                    </div>

                    <div className="self-stretch pt-12 flex flex-wrap justify-center items-start gap-8">
                        <div className="flex-1 min-w-[120px] flex flex-col justify-start items-center gap-4">
                            <img src="/image/launch/icon11.svg" alt="HSS/HLR Integration" className="w-8 h-8" />
                            <span className="text-center text-zinc-900 text-xs font-semibold tracking-wider font-mono">HSS/HLR Integration</span>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col justify-start items-center gap-4">
                            <img src="/image/launch/icon12.svg" alt="Subscriber DB" className="w-8 h-8" />
                            <span className="text-center text-zinc-900 text-xs font-semibold tracking-wider font-mono">Subscriber DB</span>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col justify-start items-center gap-4">
                            <img src="/image/launch/icon13.svg" alt="Identity Vault" className="w-8 h-8" />
                            <span className="text-center text-zinc-900 text-xs font-semibold tracking-wider font-mono">Identity Vault</span>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col justify-start items-center gap-4">
                            <img src="/image/launch/icon14.svg" alt="API Gateway" className="w-8 h-8" />
                            <span className="text-center text-zinc-900 text-xs font-semibold tracking-wider font-mono">API Gateway</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-24 bg-[#f8f9fa] flex flex-col items-center justify-center text-center border-t border-gray-100">
                <div className="max-w-3xl w-full px-6 flex flex-col items-center gap-6">
                    <h2 className="text-3xl md:text-[32px] font-semibold text-gray-900 tracking-tight">Ready for a Sovereign Launch?</h2>
                    <p className="text-[#64748b] text-[15px] max-w-[540px] leading-relaxed">
                        Achieve infrastructure-grade reliability and regulatory precision with a migration path tailored for your region.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button className="bg-[#317a99] hover:bg-[#28637c] text-white text-[15px] font-medium py-3 px-8 rounded transition-colors shadow-sm">
                            Request a Similar Launch Briefing
                        </button>
                        <button className="bg-white text-[#334155] text-[15px] border border-[#cbd5e1] font-medium py-3 px-8 rounded hover:bg-gray-50 transition-colors shadow-sm">
                            Download Full Case Study
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
