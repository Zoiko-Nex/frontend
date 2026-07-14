import React from 'react';
import Link from 'next/link';

export default function LeadershipPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <section className="w-full relative overflow-hidden bg-white pt-12 lg:pt-16 pb-24 border-b border-slate-200">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                            <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Company Leadership</span>
                        </div>

                        <h1 className="text-slate-800 text-5xl lg:text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-8">
                            Leadership built for<br className="hidden lg:block" />telecom complexity.
                        </h1>

                        <p className="text-slate-600 text-lg font-['Plus_Jakarta_Sans'] leading-relaxed max-w-xl mb-12">
                            ZoikoNex is led with a clear operating mandate: build a governed, scalable,
                            AI-powered telecom OSS/BSS platform that helps MVNOs, MNOs, digital
                            connectivity brands, and telecom groups launch, monetize, manage, and
                            grow with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
                            <Link href="/contact-us">
                                <button className="px-8 py-4 bg-sky-900 hover:bg-sky-950 text-white text-base font-bold font-['Plus_Jakarta_Sans'] rounded-xl shadow-lg transition-all">
                                    Request a Leadership Briefing
                                </button>
                            </Link>
                            <button className="px-8 py-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] rounded-xl transition-all">
                                View Governance Model
                            </button>
                        </div>

                        <div className="border-l-[1.6px] border-lime-500 pl-4 max-w-lg">
                            <p className="text-slate-500 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                Built for buyers who need executive accountability across platform
                                architecture, monetization, compliance, security, delivery, and long-term
                                roadmap governance.
                            </p>
                        </div>
                    </div>

                    {/* Command Layer Diagram */}
                    <div className="relative w-full max-w-[500px] mx-auto lg:ml-auto">
                        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-gradient-to-br from-sky-900/40 to-slate-900/60 rounded-3xl -z-10 blur-sm"></div>
                        <div className="w-full bg-gradient-to-br from-sky-900 to-sky-950 rounded-3xl shadow-2xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-lime-500/20 to-transparent opacity-40"></div>

                            <div className="p-6 relative z-10">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Command Layer</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                                        <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Accountable</span>
                                    </div>
                                </div>

                                <div className="py-5 border-b border-white/10 flex items-start gap-4">
                                    <div className="w-2 h-2 bg-lime-500 rounded-sm mt-1.5 shadow-[0_0_0_4px_rgba(123,193,68,0.18)] flex-shrink-0"></div>
                                    <div>
                                        <h3 className="text-white text-sm font-bold font-['Plus_Jakarta_Sans'] mb-1">Executive Direction</h3>
                                        <p className="text-slate-400 text-xs font-mono">operating mandate · capital discipline</p>
                                    </div>
                                </div>

                                <div className="py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">Monetization</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Product & Platform</span>
                                </div>

                                <div className="py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">Network Lifecycle</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Technology & Arch</span>
                                </div>

                                <div className="py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">Governance</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Security & Gov</span>
                                </div>

                                <div className="py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">Evidence</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Security & Gov</span>
                                </div>

                                <div className="py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">APIs</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Platform Arch</span>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-sky-600 rounded-[3px]"></div>
                                        <span className="text-indigo-50 text-sm font-['Plus_Jakarta_Sans']">Customer Success</span>
                                    </div>
                                    <span className="text-slate-400 text-xs font-mono">Delivery & Success</span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Leadership Responsibility Model */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Leadership Responsibility Model</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-8">
                        Leadership mapped to operating<br className="hidden lg:block" />responsibility — not vanity titles.
                    </h2>

                    <p className="text-slate-600 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl mb-16">
                        In enterprise telecom, buyers don't just buy features. They buy confidence that someone is
                        accountable for every part of the platform. Here is who owns what, and the procurement question
                        each answers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Box 1 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">01</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-sky-600 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Executive Direction</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    Corporate strategy, platform doctrine, market
                                    positioning, capital discipline, and partnership
                                    posture.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Is there clear strategic accountability?</span>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">02</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-lime-500 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Product & Platform</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    Domain architecture, roadmap, product
                                    governance, release discipline, usability, and
                                    customer value.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Can the team build and evolve the platform?</span>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">03</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-sky-600 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Technology & Architecture</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    Cloud architecture, API-first design, event
                                    architecture, resilience, data model, and scalability.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Can the platform handle telecom complexity?</span>
                            </div>
                        </div>

                        {/* Box 4 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">04</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-lime-500 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Security & Governance</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    Security posture, access control, audit readiness, AI
                                    governance, risk controls, and evidence discipline.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Will this survive enterprise review?</span>
                            </div>
                        </div>

                        {/* Box 5 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">05</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-sky-600 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Commercial & Partnerships</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    MVNO/MNO partnerships, pricing strategy, channel
                                    development, procurement support, and deal
                                    quality.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Can the company support our business model?</span>
                            </div>
                        </div>

                        {/* Box 6 */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 relative overflow-hidden flex flex-col justify-between min-h-[224px]">
                            <div className="absolute top-6 right-6 opacity-5 text-sky-700 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] leading-none">06</div>
                            <div className="absolute left-[0.8px] top-6 w-[3px] h-[75%] bg-lime-500 rounded-full"></div>
                            <div>
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-4">Implementation & Customer Success</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    Onboarding, migration, support escalation,
                                    customer education, adoption, and retention.
                                </p>
                            </div>
                            <div className="mt-8 bg-slate-50 rounded-lg p-3 outline outline-1 outline-slate-200 flex items-center gap-3">
                                <div className="w-3 h-3 border-[1.5px] border-lime-600 rounded-sm flex-shrink-0"></div>
                                <span className="text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans']">Will we be supported after signing?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure, not software */}
            <section className="w-full relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-[url('/image/leader/one.jpg')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/60 via-55% to-sky-900/60"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">Infrastructure, not software</span>
                    </div>

                    <h2 className="text-white text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-8">
                        Run by operators<br />accountable for the<br />outcome.
                    </h2>

                    <p className="text-slate-300 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-2xl mb-16">
                        ZoikoNex is designed to run operators, not merely support them with another
                        application layer. Leadership is structured around the four ideas that separate
                        critical monetization infrastructure from conventional BSS.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/5 rounded-2xl outline outline-1 outline-white/20 backdrop-blur-sm p-6 flex flex-col justify-center h-36">
                            <span className="text-lime-500 text-xs font-mono uppercase tracking-wide mb-2">Jurisdiction</span>
                            <h3 className="text-white text-base font-bold font-['Plus_Jakarta_Sans'] mb-2">At runtime</h3>
                            <p className="text-slate-400 text-xs font-['Plus_Jakarta_Sans']">Markets are activated from runtime<br className="hidden lg:block" />packs, not deployed.</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl outline outline-1 outline-white/20 backdrop-blur-sm p-6 flex flex-col justify-center h-36">
                            <span className="text-lime-500 text-xs font-mono uppercase tracking-wide mb-2">Evidence</span>
                            <h3 className="text-white text-base font-bold font-['Plus_Jakarta_Sans'] mb-2">Not logs</h3>
                            <p className="text-slate-400 text-xs font-['Plus_Jakarta_Sans']">Financial and compliance events are<br className="hidden lg:block" />immutable and provable.</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl outline outline-1 outline-white/20 backdrop-blur-sm p-6 flex flex-col justify-center h-36">
                            <span className="text-lime-500 text-xs font-mono uppercase tracking-wide mb-2">AI</span>
                            <h3 className="text-white text-base font-bold font-['Plus_Jakarta_Sans'] mb-2">With control</h3>
                            <p className="text-slate-400 text-xs font-['Plus_Jakarta_Sans']">Intelligence bounded by policy,<br className="hidden lg:block" />evidence, and approval.</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl outline outline-1 outline-white/20 backdrop-blur-sm p-6 flex flex-col justify-center h-36">
                            <span className="text-lime-500 text-xs font-mono uppercase tracking-wide mb-2">Infrastructure</span>
                            <h3 className="text-white text-base font-bold font-['Plus_Jakarta_Sans'] mb-2">Not software</h3>
                            <p className="text-slate-400 text-xs font-['Plus_Jakarta_Sans']">Built to run serious operators at scale.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Executive Leadership */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Executive Leadership</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-8">
                        Senior leadership, with relevance over<br className="hidden lg:block" />biography.
                    </h2>

                    <p className="text-slate-600 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl mb-12">
                        Filter by responsibility area. Concise at the surface; deeper context one tap away. Each profile<br className="hidden lg:block" />connects to what it means for an MVNO, MNO, enterprise, or partner buyer.
                    </p>

                    {/* Filter Bar */}
                    <div className="flex overflow-x-auto gap-8 border-b border-slate-200 pb-3 mb-12 scrollbar-hide">
                        <button className="text-sky-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap relative">
                            All
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-sky-700 rounded-full"></div>
                        </button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Executive</button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Technology</button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Platform</button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Governance</button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Commercial</button>
                        <button className="text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold font-['Plus_Jakarta_Sans'] whitespace-nowrap">Delivery</button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                        {/* AO */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-950 to-sky-700 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Executive Direction</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">AO</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Adaeze Okonkwo</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Executive Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns corporate strategy, platform doctrine, and capital discipline, keeping direction accountable to operator outcomes.</p>
                            </div>
                        </div>

                        {/* MB */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-950 to-sky-700 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Executive Direction</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">MB</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Marcus Boateng</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Operating Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns operating cadence, delivery governance, and cross-functional execution across the platform organization.</p>
                            </div>
                        </div>

                        {/* MV */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-900 to-sky-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Technology & Arch</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">MV</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Mathias Vogel</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Technology Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns cloud architecture, event-driven design, resilience, and scalability across the eighteen platform domains.</p>
                            </div>
                        </div>

                        {/* LS */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-900 to-sky-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Technology & Arch</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">LS</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Lena Sorensen</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">VP, Platform Architecture</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns API-first design, the data model, and integration patterns connecting ZoikoNex to carrier and partner ecosystems.</p>
                            </div>
                        </div>

                        {/* PR */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-900 to-slate-500 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Product & Platform</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">PR</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Priya Raghunathan</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Product Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns domain architecture, roadmap, and release discipline so capabilities ship governed, usable, and commercially aligned.</p>
                            </div>
                        </div>

                        {/* DA */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-900 to-lime-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Security & Governance</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">DA</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Daniel Asare</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Information Security Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns security posture, access control, AI governance, and evidence discipline for enterprise review.</p>
                            </div>
                        </div>

                        {/* SM */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-950 to-sky-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Commercial</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">SM</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Sofia Marchetti</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Commercial Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns MVNO/MNO partnerships, pricing strategy, channel development, and procurement support.</p>
                            </div>
                        </div>

                        {/* YH */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden flex flex-col h-[510px]">
                            <div className="h-[320px] bg-gradient-to-br from-sky-900 to-lime-600 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm rounded-full outline outline-1 outline-white/30 px-3 py-1">
                                    <span className="text-white text-[9px] font-mono uppercase tracking-wide">Delivery & Success</span>
                                </div>
                                <div className="w-[120%] aspect-square rounded-full border border-white/10 absolute -top-1/4 -left-1/4 mix-blend-overlay"></div>
                                <div className="w-[80%] aspect-square rounded-full border border-white/10 absolute top-10 right-10 mix-blend-overlay"></div>
                                <span className="text-white/95 text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-wide z-10 relative">YH</span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-end">
                                <h3 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans'] mb-1">Yara Haddad</h3>
                                <p className="text-sky-700 text-xs font-semibold font-['Plus_Jakarta_Sans'] mb-3">Chief Customer Officer</p>
                                <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed">Owns onboarding, adoption, support escalation, and renewal so customers reach value and stay there.</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs font-['Plus_Jakarta_Sans'] leading-relaxed max-w-4xl">
                        Profiles shown are representative of the approved CMS structure, with portrait placeholders ready to receive approved photography. Only verified names, titles, and credentials are published — no degrees, awards, prior employers, or certifications appear unless legally approved.
                    </p>
                </div>
            </section>

            {/* Platform, Governance & Delivery */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Platform, Governance & Delivery</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-8">
                        The team functions behind the leaders.
                    </h2>

                    <p className="text-slate-600 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl mb-16">
                        For enterprise BSS buyers, implementation, governance, security, and customer success determine<br className="hidden lg:block" />long-term value. These functions have named ownership.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Box 1: Platform Architecture */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
                                    <img src="/image/leader/frame1.svg" alt="Platform Architecture" className="w-5 h-5" />
                                </div>
                                <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-4">Platform Architecture</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                                    Senior product architects, API leads, and data-<br className="hidden lg:block" />architecture owners responsible for domain design<br className="hidden lg:block" />and implementation depth.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Domain architecture</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">API-first</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Data model</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-[3px]"></div>
                                <span className="text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans']">Proves technical seriousness</span>
                            </div>
                        </div>

                        {/* Box 2: Security & Compliance */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
                                    <img src="/image/leader/frame2.svg" alt="Security & Compliance" className="w-5 h-5" />
                                </div>
                                <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-4">Security & Compliance</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                                    Security owner, compliance lead,<br className="hidden lg:block" />privacy/governance contact, and evidence lead<br className="hidden lg:block" />supporting enterprise due diligence.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Access control</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Privacy</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Evidence</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-[3px]"></div>
                                <span className="text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans']">Supports due diligence</span>
                            </div>
                        </div>

                        {/* Box 3: Implementation & Delivery */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
                                    <img src="/image/leader/frame3.svg" alt="Implementation & Delivery" className="w-5 h-5" />
                                </div>
                                <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-4">Implementation & Delivery</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                                    Program delivery, onboarding, partner integration,<br className="hidden lg:block" />migration, and QA/release ownership across live<br className="hidden lg:block" />environments.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Onboarding</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Migration</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Release QA</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-[3px]"></div>
                                <span className="text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans']">Reduces migration fear</span>
                            </div>
                        </div>

                        {/* Box 4: Customer Success */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
                                    <img src="/image/leader/frame4.svg" alt="Customer Success" className="w-5 h-5" />
                                </div>
                                <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-4">Customer Success</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                                    Support escalation, account success, adoption<br className="hidden lg:block" />education, and renewal support after go-live.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Escalation</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Adoption</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Renewal</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-[3px]"></div>
                                <span className="text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans']">Signals retention maturity</span>
                            </div>
                        </div>

                        {/* Box 5: Commercial & Partnerships */}
                        <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 p-8 flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl mb-6 flex items-center justify-center">
                                    <img src="/image/leader/frame5.svg" alt="Commercial & Partnerships" className="w-5 h-5" />
                                </div>
                                <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] mb-4">Commercial & Partnerships</h3>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-8">
                                    MVNA/MNO partner owners, ecosystem partners,<br className="hidden lg:block" />and channel leads who open market access and<br className="hidden lg:block" />deal maturity.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Partners</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Channel</span>
                                    <span className="px-2 py-1 rounded-md outline outline-1 outline-slate-200 text-slate-600 text-[10px] font-mono">Settlement</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-[3px]"></div>
                                <span className="text-lime-600 text-xs font-semibold font-['Plus_Jakarta_Sans']">Shows market access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* After the Contract / Lifecycle */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">After the Contract</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-6">
                        How leadership shows up across the customer<br />lifecycle.
                    </h2>

                    <p className="text-slate-600 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl mb-16">
                        Leadership involvement does not end at signing. Each moment below has a leadership-backed<br className="hidden lg:block" />support model and a retention impact.
                    </p>

                    <div className="bg-white rounded-2xl shadow-sm outline outline-1 outline-slate-200 overflow-hidden">
                        {[
                            {
                                step: '01',
                                title: 'Pre-sale evaluation',
                                desc: 'Executive briefing, platform overview, governance walkthrough, and implementation scoping.',
                                tag: 'Higher conversion'
                            },
                            {
                                step: '02',
                                title: 'Security & compliance review',
                                desc: 'Controlled access to security documentation, claim-approved control summaries, and NDA-gated review materials.',
                                tag: 'Faster procurement'
                            },
                            {
                                step: '03',
                                title: 'Implementation planning',
                                desc: 'Named implementation ownership, milestone governance, risk tracking, and a clear escalation model.',
                                tag: 'Lower onboarding friction'
                            },
                            {
                                step: '04',
                                title: 'Launch readiness',
                                desc: 'Go-live checklist, release validation, rollback posture, and customer support readiness.',
                                tag: 'Protected first launch'
                            },
                            {
                                step: '05',
                                title: 'Post-launch adoption',
                                desc: 'Roadmap reviews, performance reviews, customer education, and usage insights.',
                                tag: 'Retention & expansion'
                            },
                            {
                                step: '06',
                                title: 'Executive escalation',
                                desc: 'A defined escalation path for material commercial, technical, security, or delivery risk.',
                                tag: 'Long-term confidence'
                            }
                        ].map((item, i) => (
                            <div key={item.step} className={`grid grid-cols-1 lg:grid-cols-[64px_280px_1fr_auto] gap-4 lg:gap-8 items-start lg:items-center p-6 lg:px-8 lg:py-6 ${i !== 5 ? 'border-b border-slate-100' : ''}`}>
                                <div className="text-sky-700 font-mono font-semibold text-sm">{item.step}</div>
                                <div className="text-slate-800 font-bold font-['Plus_Jakarta_Sans'] text-sm">{item.title}</div>
                                <div className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed lg:pr-8">
                                    {item.desc}
                                </div>
                                <div className="flex lg:justify-end">
                                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-lime-500/30 bg-stone-100/50 text-lime-600 text-[11px] font-mono tracking-wide whitespace-nowrap">
                                        {item.tag}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Operating Principles Banner */}
            <section className="w-full relative bg-slate-900 py-32 flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Subtle background cubes placeholder */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-900/40 via-transparent to-slate-900/60 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">Operating Principles</span>
                    </div>

                    <h2 className="text-white text-3xl md:text-4xl lg:text-[40px] font-bold font-['Plus_Jakarta_Sans'] leading-snug mb-10">
                        “We move fast where speed creates customer<br className="hidden lg:block" />advantage — and we slow down where security,<br className="hidden lg:block" />compliance, billing accuracy, or customer trust<br className="hidden lg:block" />require control.”
                    </h2>

                    <div className="text-lime-500/80 text-[10px] md:text-xs font-mono uppercase tracking-widest">
                        Governed Speed - ZoikoNex Leadership Doctrine
                    </div>
                </div>
            </section>

            {/* The Doctrine */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">The Doctrine</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-16">
                        The leadership philosophy behind the<br />platform.
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Governed speed',
                                desc: 'We move fast where speed creates customer advantage, and we slow down where security, compliance, billing accuracy, or customer trust require control.'
                            },
                            {
                                title: 'Evidence over assertion',
                                desc: 'Important platform events, decisions, approvals, releases, and policy actions should be traceable through evidence-aware systems.'
                            },
                            {
                                title: 'Modularity over sprawl',
                                desc: 'Each ZoikoNex domain must have clear ownership, clean interfaces, and measurable operational responsibility.'
                            },
                            {
                                title: 'AI under control',
                                desc: 'AI should accelerate telecom operations, but material decisions must remain bounded by permissions, policy, evidence, and human oversight where required.'
                            },
                            {
                                title: 'Commercial discipline',
                                desc: 'The platform must support real telecom monetization: charging, billing, taxation, payments, reconciliation, partner settlement, and revenue protection.'
                            },
                            {
                                title: 'Customer continuity',
                                desc: 'The relationship must not end at implementation. Documentation, support, roadmap governance, and adoption design must protect long-term value.'
                            }
                        ].map((card, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 outline outline-1 outline-slate-200 shadow-sm flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 bg-lime-500 rounded-full flex-shrink-0"></div>
                                    <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans']">{card.title}</h3>
                                </div>
                                <p className="text-slate-600 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed">
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Proof & Boundaries */}
            <section className="w-full bg-slate-50 py-24 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Proof & Boundaries</span>
                    </div>

                    <h2 className="text-slate-800 text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] leading-tight mb-6">
                        Credibility protected by claim discipline.
                    </h2>

                    <p className="text-slate-600 text-base font-['Plus_Jakarta_Sans'] leading-relaxed max-w-3xl mb-16">
                        We publish what is verified, and we are explicit about what we will not claim without proof. That<br className="hidden lg:block" />restraint is itself a trust signal for procurement and security reviewers.
                    </p>

                    <div className="flex flex-col gap-4">
                        {[
                            {
                                title: 'Leadership credentials',
                                publish: 'Verified degrees, roles, licenses, board positions, and company associations.',
                                not: 'Unverified academic claims, inflated titles, or former-employer references.'
                            },
                            {
                                title: 'Team size',
                                publish: 'Current approved numbers — or no specific count at all.',
                                not: '“Largest”, “global team”, or “hundreds of engineers” without evidence.'
                            },
                            {
                                title: 'Security maturity',
                                publish: 'Security-by-design, access controls, review pathways, and Trust Pack availability.',
                                not: 'SOC 2, ISO 27001, PCI, GSMA, or TM Forum certification claims unless formally achieved.'
                            },
                            {
                                title: 'Customer proof',
                                publish: 'Approved customers, anonymized scenarios, or “representative use case” labels.',
                                not: 'Named customers, logos, revenue figures, or outcomes without written approval.'
                            },
                            {
                                title: 'AI leadership',
                                publish: 'Governance, control levels, human review, and auditability.',
                                not: 'Claims that AI is fully autonomous, error-free, compliant, or regulator-approved.'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl outline outline-1 outline-slate-200 p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 lg:gap-8 items-start">
                                <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] pt-1">{item.title}</h3>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-4 h-4">
                                            <svg className="w-3.5 h-3.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-lime-600 text-[10px] font-mono uppercase tracking-wide">We publish</span>
                                    </div>
                                    <p className="text-slate-600 text-xs font-['Plus_Jakarta_Sans'] leading-5 pr-8">{item.publish}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-4 h-4">
                                            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span className="text-red-500 text-[10px] font-mono uppercase tracking-wide">Not without verification</span>
                                    </div>
                                    <p className="text-slate-500 text-xs font-['Plus_Jakarta_Sans'] leading-5 pr-8">{item.not}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mt-16">
                        <span className="text-slate-500 text-xs font-['Plus_Jakarta_Sans'] font-semibold">Continue your evaluation:</span>
                        <div className="flex flex-wrap gap-4">
                            {['Governance Model', 'Security & Trust Pack', 'Compliance', 'Evidence Architecture', 'Partners'].map(link => (
                                <a key={link} href="#" className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-[999px] outline outline-1 outline-slate-300 hover:outline-slate-400 hover:bg-slate-50 transition-all group">
                                    <span className="text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans']">{link}</span>
                                    <svg className="w-3 h-3 text-slate-800 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
