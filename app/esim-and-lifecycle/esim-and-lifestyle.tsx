import React from 'react';
import Link from 'next/link';

export default function ESIMAndLifecyclePage() {
    return (
        <div className="w-full bg-stone-50 flex flex-col font-sans">

            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-r from-gray-800 to-cyan-700 pt-24 pb-40 overflow-hidden flex justify-center">
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none"></div>

                <div className="max-w-[1280px] w-full px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
                    {/* Hero Content */}
                    <div className="flex-1 flex flex-col items-start gap-6">
                        <div className="px-3 py-1 bg-lime-300/10 rounded-sm inline-flex justify-start items-start">
                            <span className="justify-center text-white text-xs font-semibold font-mono leading-3 tracking-wider uppercase">CASE STUDY: TELCO INFRASTRUCTURE</span>
                        </div>
                        <div className="flex flex-col justify-start items-start w-full max-w-[581px]">
                            <h1 className="self-stretch justify-center text-white text-5xl font-bold font-['Hanken_Grotesk'] leading-[60px]">
                                eSIM and Lifecycle<br />Operations: Scaling Digital-<br />First Connectivity Brands.
                            </h1>
                        </div>
                        <div className="w-full max-w-[576px] pt-1.5 pb-1 flex flex-col justify-start items-start">
                            <p className="justify-center text-gray-400 text-lg font-normal font-['Inter'] leading-7">
                                How ZoikoNex revolutionized the delivery and management of global data roaming for a tier-1 digital carrier across 180+ jurisdictions.
                            </p>
                        </div>
                        <div className="pt-4 inline-flex flex-col sm:flex-row justify-start items-start gap-4">
                            <button className="px-8 py-4 bg-cyan-700 text-white text-sm font-semibold font-['Inter'] leading-4 rounded-sm hover:bg-cyan-600 transition-colors">
                                Download Technical Whitepaper
                            </button>
                            <button className="px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300/30 text-white text-sm font-semibold font-['Inter'] leading-4 hover:bg-white/10 transition-colors">
                                View API Docs
                            </button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 w-full flex justify-center lg:justify-end">
                        <img
                            src="image/life/one.jpg"
                            alt="Connectivity App"
                            className="w-full max-w-lg rounded-3xl shadow-2xl object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section (overlapping hero) */}
            <section className="relative w-full max-w-[1280px] mx-auto px-6 -mt-20 z-20 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 95% Automation Rate */}
                    <div className="p-8 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col justify-start items-start">
                        <h3 className="text-lime-800 text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight mb-2">95%</h3>
                        <div className="text-cyan-700 text-xl md:text-2xl font-semibold font-['Hanken_Grotesk'] mb-2">Automation Rate</div>
                        <p className="text-slate-600 text-sm md:text-base font-normal font-['Inter'] leading-relaxed">
                            Zero-touch provisioning from payment to device activation.
                        </p>
                    </div>
                    {/* 30% Cost Reduction */}
                    <div className="p-8 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col justify-start items-start">
                        <h3 className="text-sky-600 text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight mb-2">30%</h3>
                        <div className="text-cyan-700 text-xl md:text-2xl font-semibold font-['Hanken_Grotesk'] mb-2">Cost Reduction</div>
                        <p className="text-slate-600 text-sm md:text-base font-normal font-['Inter'] leading-relaxed">
                            Operational support overhead eliminated via self-service QR delivery.
                        </p>
                    </div>
                    {/* <10ms Latency */}
                    <div className="p-8 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col justify-start items-start">
                        <h3 className="text-cyan-700 text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight mb-2">&lt;10ms</h3>
                        <div className="text-cyan-700 text-xl md:text-2xl font-semibold font-['Hanken_Grotesk'] mb-2">Latency</div>
                        <p className="text-slate-600 text-sm md:text-base font-normal font-['Inter'] leading-relaxed">
                            Real-time activation sequence for global roaming profiles.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Global Connectivity Paradox */}
            <section className="w-full py-20 bg-stone-50 flex justify-center">
                <div className="max-w-[1280px] w-full px-6 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 flex flex-col gap-6">
                        <h2 className="text-cyan-700 text-3xl md:text-4xl font-semibold font-['Hanken_Grotesk'] leading-tight">
                            The Global Connectivity Paradox
                        </h2>
                        <p className="text-slate-600 text-lg font-normal font-['Inter'] leading-relaxed">
                            Our client, a leading global travel eSIM provider, faced a logistical nightmare: managing 180+ different carrier agreements with fragmented inventory and high-frequency charging cycles that manual operations could no longer sustain.
                        </p>
                        <div className="flex flex-col gap-6 mt-4">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 flex-shrink-0 flex flex-col justify-start items-start">
                                    <img src="image/life/icon8.svg" alt="Provisioning Delays" className="w-5 h-5 object-contain" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Provisioning Delays</h4>
                                    <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Customer wait times for QR codes exceeded 15 minutes during peak travel hours.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 flex-shrink-0 flex flex-col justify-start items-start">
                                    <img src="image/life/icon9.svg" alt="Inventory Fragmentation" className="w-5 h-5 object-contain" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Inventory Fragmentation</h4>
                                    <p className="text-slate-600 text-base font-normal font-['Inter'] leading-6">Inability to track real-time SIM/eSIM stock across multiple regional vendors.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative max-w-lg mx-auto">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-lime-300/20 rounded-3xl blur-2xl z-0"></div>
                        {/* Image */}
                        <div className="relative z-10 bg-white/0 rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                            <img
                                src="image/life/two.png"
                                alt="Server Infrastructure"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture of Instant Activation */}
            <section className="w-full py-28 bg-[#1B1D26] flex justify-center overflow-hidden">
                <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
                    <div className="self-stretch flex flex-col justify-start items-center gap-4">
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <h2 className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Architecture of Instant Activation</h2>
                        </div>
                        <div className="w-full max-w-[672px] flex flex-col justify-start items-center">
                            <p className="text-center justify-center text-gray-500 text-base font-normal font-['Inter'] leading-6">The ZoikoNex SIM/eSIM Lifecycle domain replaces legacy manual triggers with an<br className="hidden md:block" />event-driven activation sequence.</p>
                        </div>
                    </div>
                    
                    <div className="self-stretch flex flex-col md:flex-row justify-center items-center gap-8 w-full">
                        <div className="flex-1 w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[5px] flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <span className="justify-center text-lime-300 text-[10px] font-bold font-mono uppercase tracking-wider leading-4">STEP 01</span>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="justify-center text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Request</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">API Gateway receives purchase<br />event.</p>
                            </div>
                        </div>
                        
                        {/* Connecting Line */}
                        <div className="hidden md:block flex-1 h-px relative bg-lime-300/50">
                            <div className="w-2 h-2 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-lime-300 rounded-full"></div>
                        </div>
                        
                        <div className="flex-1 w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[5px] flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <span className="justify-center text-lime-300 text-[10px] font-bold font-mono uppercase tracking-wider leading-4">STEP 02</span>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="justify-center text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Inventory</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Real-time SM-DP+ routing for eSIM<br />profile.</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full p-6 bg-white/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-lime-300 backdrop-blur-[5px] flex flex-col justify-start items-start gap-2">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <span className="justify-center text-lime-300 text-[10px] font-bold font-mono uppercase tracking-wider leading-4">STEP 03</span>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="justify-center text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Dispatch</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-gray-500 text-sm font-normal font-['Inter'] leading-5">Encrypted QR code delivery via<br />Push/Email.</p>
                            </div>
                        </div>
                    </div>

                    {/* Code Block */}
                    <div className="w-full self-stretch px-6 pt-10 pb-6 bg-white/5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/10 backdrop-blur-[5px] flex flex-col justify-start items-start gap-6 overflow-hidden">
                        <div className="self-stretch pb-4 border-b border-white/10 flex justify-start items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="pl-4 flex flex-col justify-start items-start">
                                <span className="opacity-50 justify-center text-white text-xs font-normal font-mono leading-4">zoikonex-activation-v1.json</span>
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start overflow-x-auto">
                            <pre className="justify-center text-lime-300 text-sm font-bold font-mono leading-5 whitespace-pre">
{`{
  "event": "eSIM_PROVISION_START",
  "subscriber_id": "ZNX-9921-X",
  "region": "EU_ROAMING_ZONE_1",
  "lifecycle_stage": "PENDING_DOWNLOAD",
  "latency_target": "< 50ms",
  "security_layer": "AES-256-GCM"
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legacy vs ZoikoNex Operations */}
            <section className="w-full py-24 bg-stone-50 flex justify-center">
                <div className="w-full max-w-[1280px] px-6 flex flex-col lg:flex-row justify-center items-start gap-16">
                    <div className="flex-1 pb-[3.38px] flex flex-col justify-start items-start gap-8 w-full">
                        <div className="self-stretch flex flex-col justify-start items-start">
                            <h2 className="justify-center text-cyan-700 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Legacy vs. ZoikoNex Operations</h2>
                        </div>
                        <div className="self-stretch border-t border-slate-200 flex flex-col justify-start items-start">
                            <div className="self-stretch py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-slate-600 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Profile Management</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Dynamic SM-DP+ Orchestration</span>
                                </div>
                            </div>
                            <div className="self-stretch py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-slate-600 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Billing Enforcement</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Real-time Credit Hard-Stop</span>
                                </div>
                            </div>
                            <div className="self-stretch py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-slate-600 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Support Entry</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Automated Notification Flows</span>
                                </div>
                            </div>
                            <div className="self-stretch py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-slate-600 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Inventory Logic</span>
                                </div>
                                <div className="flex-1 flex flex-col justify-start items-start">
                                    <span className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-5">Predictive Stock Rebalancing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex justify-center items-center w-full">
                        <div className="w-full p-8 bg-zinc-100 rounded-2xl outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex flex-col justify-start items-start gap-4">
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <h3 className="justify-center text-cyan-700 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Core Innovation: Real-time Balance<br className="hidden lg:block"/>Enforcement</h3>
                            </div>
                            <div className="self-stretch flex flex-col justify-start items-start">
                                <p className="justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Unlike traditional systems that batch process data usage every 15-30 minutes, ZoikoNex SIM domain enforces data caps in sub-second intervals, preventing "bill shock" and protecting carrier margins across all 180+ countries.</p>
                            </div>
                            <div className="self-stretch pt-2 flex flex-col justify-start items-start gap-3">
                                <div className="self-stretch flex justify-start items-center gap-3">
                                    <div className="flex flex-col justify-start items-start">
                                        <img src="image/life/icon10.svg" alt="Check" className="w-5 h-5 object-contain" />
                                    </div>
                                    <span className="justify-center text-cyan-700 text-base font-normal font-['Inter'] leading-6">Multi-IMS management</span>
                                </div>
                                <div className="self-stretch flex justify-start items-center gap-3">
                                    <div className="flex flex-col justify-start items-start">
                                        <img src="image/life/icon10.svg" alt="Check" className="w-5 h-5 object-contain" />
                                    </div>
                                    <span className="justify-center text-cyan-700 text-base font-normal font-['Inter'] leading-6">Automated LPA triggers</span>
                                </div>
                                <div className="self-stretch flex justify-start items-center gap-3">
                                    <div className="flex flex-col justify-start items-start">
                                        <img src="image/life/icon10.svg" alt="Check" className="w-5 h-5 object-contain" />
                                    </div>
                                    <span className="justify-center text-cyan-700 text-base font-normal font-['Inter'] leading-6">Regional regulatory compliance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-24 bg-stone-50 flex justify-center px-6">
                <div className="max-w-[1280px] w-full px-6 md:px-24 py-16 md:py-24 bg-gradient-to-r from-gray-800 to-black rounded-3xl flex flex-col justify-start items-center overflow-hidden">
                    <div className="self-stretch flex flex-col justify-start items-center gap-8">
                        <div className="self-stretch flex flex-col justify-start items-center">
                            <h2 className="text-center justify-center text-white text-5xl font-bold font-['Hanken_Grotesk'] leading-[66px]">Ready to automate your <br className="hidden md:block" />connectivity lifecycle?</h2>
                        </div>
                        <div className="w-full max-w-[672px] flex flex-col justify-start items-center">
                            <p className="text-center justify-center text-gray-500 text-lg font-normal font-['Inter'] leading-7">Join the world's fastest-growing MVNOs and digital brands built on ZoikoNex<br className="hidden md:block" />Sovereign Infrastructure.</p>
                        </div>
                        <div className="self-stretch pt-2.5 flex justify-center items-start gap-4">
                            <Link href="/request-a-demo">
                                <button className="w-full sm:w-56 px-10 py-5 bg-cyan-700 rounded-sm flex flex-col justify-center items-center hover:bg-cyan-600 transition-colors">
                                    <span className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Request a Demo</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
