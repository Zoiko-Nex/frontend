import React from 'react';
import { CheckCircle2, Clock, Wrench, EyeOff, Zap, Scale, Calculator, ArrowRight } from 'lucide-react';

export default function BillingAndCharging() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="w-full min-h-[740px] px-6 py-24 md:py-28 relative bg-gradient-to-br from-white via-white to-stone-100 overflow-hidden flex justify-center items-center">
                <div className="w-full max-w-[1280px] flex flex-col lg:flex-row justify-center items-center gap-12 relative z-10">
                    <div className="flex-1 flex flex-col justify-start items-start gap-6">
                        <div className="px-3 py-1 bg-sky-600/10 rounded-sm inline-flex justify-start items-start">
                            <span className="justify-center text-sky-600 text-xs font-semibold font-mono leading-3 tracking-wider uppercase">INFRASTRUCTURE MODERNIZATION</span>
                        </div>
                        <h1 className="self-stretch text-black text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[1.1] md:leading-[66px]">
                            Billing and Charging<br />Modernization:<br />
                            <span className="text-sky-600">Eliminating Revenue<br />Leakage</span> for Tier-1<br />Carriers.
                        </h1>
                        <p className="text-slate-600 text-lg font-normal leading-7 max-w-[576px]">
                            Transitioning from legacy batch-based systems to sovereign real-time architecture, ensuring every bit of data is monetized with mathematical precision.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <div className="px-4 py-3 bg-white rounded-sm shadow-sm border border-slate-200 flex justify-start items-center gap-3">
                                <img src="/image/bill/icon15.svg" alt="Accuracy" className="w-5 h-5 object-contain" />
                                <span className="text-zinc-900 text-xs font-semibold font-mono tracking-wider">99.99% ACCURACY</span>
                            </div>
                            <div className="px-4 py-3 bg-white rounded-sm shadow-sm border border-slate-200 flex justify-start items-center gap-3">
                                <img src="/image/bill/icon16.svg" alt="Leakage Recovered" className="w-5 h-5 object-contain" />
                                <span className="text-zinc-900 text-xs font-bold font-mono tracking-wider uppercase">12% Leakage Recovered</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full flex justify-center lg:justify-end">
                        <div className="absolute -left-4 -top-4 w-[120%] h-[120%] max-w-[648px] max-h-[648px] bg-lime-300/30 blur-[40px] rounded-full z-0 pointer-events-none"></div>
                        <div className="w-full p-6 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden relative z-10 flex items-center justify-center">
                            <img className="w-full h-auto object-cover rounded-sm" src="/image/bill/one.png" alt="Billing Monitor Dashboard" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Context Section */}
            <section className="w-full py-20 bg-gray-50 flex justify-center">
                <div className="max-w-[1280px] w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 p-8 bg-[#1f2029] rounded-lg shadow-lg relative flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 flex justify-end">
                            <img src="/image/bill/icon12.svg" alt="Network Graphic" className="w-16 h-16 object-contain" />
                        </div>
                        <div className="flex flex-col justify-start items-start gap-4 relative z-10">
                            <div className="text-[#a3e635] text-xs font-bold font-mono leading-3 tracking-wider uppercase">THE CONTEXT</div>
                            <h2 className="text-white text-3xl xl:text-[32px] font-semibold font-['Hanken_Grotesk'] leading-tight">The Cost of Latency</h2>
                            <div className="pt-2">
                                <span className="text-gray-400 text-[15px] font-normal leading-relaxed">
                                    A major regional MNO was processing over 400 million CDRs (Call Detail Records) daily through a legacy stack. Mediation delays meant usage wasn't rated for up to 18 hours, resulting in a staggering
                                </span>
                                <span className="text-[#a3e635] text-[15px] font-normal leading-relaxed">
                                    {' '}12% annual revenue leakage{' '}
                                </span>
                                <span className="text-gray-400 text-[15px] font-normal leading-relaxed">
                                    through unbillable roaming and prepaid overages.
                                </span>
                            </div>
                        </div>
                        <div className="pt-8 mt-8 border-t border-white/10 flex justify-start items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-[#a3e635]/20 rounded-xl flex justify-center items-center shrink-0">
                                <img src="/image/bill/icon11.svg" alt="Globe" className="w-5 h-5 object-contain" />
                            </div>
                            <div className="flex flex-col justify-start items-start gap-1">
                                <div className="text-white text-[15px] font-bold leading-tight">Regional MNO</div>
                                <div className="text-gray-400 text-[13px] font-normal leading-tight">Tier-1 Telco, South East Asia</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-start items-start gap-4">
                            <img src="/image/bill/icon8.svg" alt="Clock" className="w-6 h-6 object-contain" />
                            <div className="flex flex-col justify-start items-start gap-2">
                                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-7">Batch Rating</h3>
                                <p className="text-slate-600 text-[15px] font-normal leading-relaxed">
                                    Heavy nightly batch processing caused rating delays, leading to inaccurate credit limits and massive fraud windows.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col justify-start items-start gap-4">
                            <img src="/image/bill/icon9.svg" alt="Manual" className="w-6 h-6 object-contain" />
                            <div className="flex flex-col justify-start items-start gap-2">
                                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-7">Manual Adjustments</h3>
                                <p className="text-slate-600 text-[15px] font-normal leading-relaxed">
                                    Over 45 staff members were dedicated solely to manual billing reconciliations and handling customer disputes.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row justify-start items-start md:items-center gap-6 md:col-span-2">
                            <img src="/image/bill/icon10.svg" alt="Eye Off" className="w-8 h-8 object-contain shrink-0" />
                            <div className="flex flex-col justify-start items-start gap-2">
                                <h3 className="text-zinc-900 text-xl font-semibold font-['Hanken_Grotesk'] leading-7">Zero Visibility</h3>
                                <p className="text-slate-600 text-[15px] font-normal leading-relaxed max-w-[800px]">
                                    Lack of real-time usage visibility prevented the carrier from launching modern on-demand data packs or personalized top-ups, stalling ARPU growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="w-full px-6 py-28 bg-gray-800 flex flex-col justify-center items-center overflow-hidden">
                <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-16">
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <div className="text-center justify-center text-lime-300 text-xs font-semibold font-mono leading-3 tracking-wider uppercase">THE ZOIKONEX SOLUTION</div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <h2 className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Real-Time Charging & Jurisdiction Engine</h2>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8">
                        <div className="flex-1 w-full max-w-sm p-8 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 relative bg-[#0284c7] rounded-sm flex justify-center items-center shadow-[0_10px_15px_-3px_rgba(2,132,199,0.2)]">
                                <img src="/image/bill/icon13.svg" className="w-5 h-5 object-contain" alt="Event-Driven Mediation" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Event-Driven Mediation</h3>
                            </div>
                            <div>
                                <p className="text-gray-400 text-base font-normal font-['Inter'] leading-6">Stream CDRs via Kafka-integrated<br />mediation directly into the rating engine<br />within milliseconds of termination.</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-sm p-8 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 relative bg-[#bef264] rounded-sm flex justify-center items-center shadow-[0_10px_15px_-3px_rgba(191,243,101,0.2)]">
                                <img src="/image/bill/icon14.svg" className="w-5 h-5 object-contain" alt="Sovereign Jurisdiction" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Sovereign Jurisdiction</h3>
                            </div>
                            <div>
                                <p className="text-gray-400 text-base font-normal font-['Inter'] leading-6">Automated tax and surcharge logic based<br />on geographic triangulation, eliminating<br />manual regulatory adjustments.</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-sm p-8 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[6px] flex flex-col justify-start items-start gap-4">
                            <div className="w-12 h-12 relative bg-gray-500 rounded-sm flex justify-center items-center">
                                <img src="/image/bill/icon17.svg" className="w-5 h-5 object-contain" alt="Unified Account State" />
                            </div>
                            <div className="pt-2">
                                <h3 className="text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">Unified Account State</h3>
                            </div>
                            <div>
                                <p className="text-gray-400 text-base font-normal font-['Inter'] leading-6">A single source of truth for both prepaid<br />and postpaid balances, enabling<br />converged billing capabilities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Section */}
            <section className="w-full px-6 py-28 bg-white flex flex-col justify-center items-center gap-16">
                <div className="w-full max-w-[1280px] flex flex-col justify-center items-center gap-16">
                    <div className="flex flex-col justify-start items-center">
                        <h2 className="text-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Infrastructure Architecture Comparison</h2>
                    </div>
                    <div className="w-full relative flex flex-col md:flex-row justify-center items-start gap-16">
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2"></div>

                        <div className="flex-1 flex flex-col justify-start items-start gap-8 w-full">
                            <div className="flex justify-start items-center gap-3">
                                <div className="px-2 py-1 bg-zinc-700/10 rounded-sm">
                                    <span className="text-zinc-700 text-[10px] font-normal font-mono leading-4 uppercase tracking-wider">PHASE OUT</span>
                                </div>
                                <h3 className="text-slate-600 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Legacy Batch Flow</h3>
                            </div>

                            <div className="w-full pl-12 pb-8 relative border-l-2 border-slate-200 flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-slate-600 rounded-full"></div>
                                <h4 className="text-slate-600 text-base font-bold font-['Inter'] leading-6">Data Capture</h4>
                                <p className="text-slate-600/70 text-sm font-normal font-['Inter'] leading-5">Switch CDRs stored in local buffers.</p>
                            </div>

                            <div className="w-full pl-12 pb-8 relative border-l-2 border-slate-200 flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-slate-600 rounded-full"></div>
                                <h4 className="text-slate-600 text-base font-bold font-['Inter'] leading-6">Nightly Transfer (FTP)</h4>
                                <p className="text-slate-600/70 text-sm font-normal font-['Inter'] leading-5">Gigabytes of text files moved once every 24 hours.</p>
                            </div>

                            <div className="w-full pl-12 relative border-l-2 border-transparent flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-red-700 rounded-full"></div>
                                <h4 className="text-red-700 text-base font-bold font-['Inter'] leading-6">Delayed Mediation & Error</h4>
                                <p className="text-slate-600/70 text-sm font-normal font-['Inter'] leading-5">Rating errors found days later. Revenue lost.</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-start gap-8 w-full">
                            <div className="flex justify-start items-center gap-3">
                                <div className="px-2 py-1 bg-[#bef264]/20 rounded-sm">
                                    <span className="text-lime-800 text-[10px] font-normal font-mono leading-4 uppercase tracking-wider">DEPLOYED</span>
                                </div>
                                <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">ZoikoNex Real-Time Flow</h3>
                            </div>

                            <div className="w-full pl-12 pb-8 relative border-l-2 border-[#0284c7] flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#0284c7] rounded-full shadow-[0_0_0_4px_rgba(2,132,199,0.2)]"></div>
                                <h4 className="text-black text-base font-bold font-['Inter'] leading-6">Edge Stream Injection</h4>
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Direct SIP/Diameter signal capturing at the edge.</p>
                            </div>

                            <div className="w-full pl-12 pb-8 relative border-l-2 border-[#0284c7] flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#0284c7] rounded-full shadow-[0_0_0_4px_rgba(2,132,199,0.2)]"></div>
                                <h4 className="text-black text-base font-bold font-['Inter'] leading-6">Microservices Rating</h4>
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Instant calculation across 100+ tax jurisdictions.</p>
                            </div>

                            <div className="w-full pl-12 relative border-l-2 border-transparent flex flex-col justify-start items-start">
                                <div className="absolute left-[-9px] top-0 w-4 h-4 bg-[#bef264] rounded-full shadow-[0_0_0_4px_rgba(191,243,101,0.2)]"></div>
                                <h4 className="text-black text-base font-bold font-['Inter'] leading-6">Instant Monetization</h4>
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Ledger updated in &lt;100ms. 99.99% accuracy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="w-full px-6 py-28 bg-stone-100 flex flex-col justify-center items-center">
                <div className="max-w-[1280px] w-full flex flex-col lg:flex-row justify-center items-start gap-8">
                    <div className="pb-16 flex flex-col justify-start items-start gap-4">
                        <div className="w-72 flex flex-col justify-start items-start">
                            <h2 className="text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">The Impact</h2>
                        </div>
                        <div className="w-72 flex flex-col justify-start items-start">
                            <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Post-deployment verification after 12 months of live operations.</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="p-8 bg-white rounded-lg shadow-sm border-t-4 border-lime-300 flex flex-col justify-start items-start gap-2">
                            <div className="text-zinc-900 text-4xl font-bold font-['Inter'] leading-10">99.99%</div>
                            <div className="text-slate-600 text-xs font-bold font-mono leading-3 tracking-wider uppercase">DATA ACCURACY</div>
                            <div className="pt-2">
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Zero mediation gaps recorded in<br />fiscal Q3.</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-sm border-t-4 border-sky-600 flex flex-col justify-start items-start gap-2">
                            <div className="text-zinc-900 text-4xl font-bold font-['Inter'] leading-10">85%</div>
                            <div className="text-slate-600 text-xs font-bold font-mono leading-3 tracking-wider uppercase">REDUCED DISPUTES</div>
                            <div className="pt-2">
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Automated rating eliminated<br />manual errors.</p>
                            </div>
                        </div>
                        <div className="p-8 bg-white rounded-lg shadow-sm border-t-4 border-black flex flex-col justify-start items-start gap-2">
                            <div className="text-zinc-900 text-4xl font-bold font-['Inter'] leading-10">+12%</div>
                            <div className="text-slate-600 text-xs font-bold font-mono leading-3 tracking-wider uppercase">CASH FLOW</div>
                            <div className="pt-2">
                                <p className="text-slate-600 text-sm font-normal font-['Inter'] leading-5">Immediate recovery of leaked<br />roaming revenue.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-20 bg-white flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl w-full px-6 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to secure your sovereign infrastructure?</h2>
                    <p className="text-gray-600 text-lg mb-10 max-w-2xl">
                        Stop the leakage. Join the world's most advanced carriers using ZoikoNex for real-time monetization.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-black text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors">
                            Review Your Monetization Model
                        </button>
                        <button className="bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-8 rounded-md hover:bg-gray-50 transition-colors">
                            Download Case PDF
                        </button>
                    </div>
                </div>
            </section>

        </div>
    );
}
