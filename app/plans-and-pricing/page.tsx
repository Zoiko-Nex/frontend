'use client';

import React, { useState } from 'react';

const pathways = [
    {
        tag: 'Launch',
        title: 'New operator go-live',
        pricing: 'From low-six figures / year',
        desc: 'For MVNOs, eSIM operators, and IoT providers launching in 1–3 markets with a defined subscriber base.',
        features: [
            'Single-jurisdiction tax & billing',
            'Up to 3 integrations',
            'Business-hours support',
            '12-month term',
        ],
        buttonText: 'Get indicative quote',
        isPopular: false,
    },
    {
        tag: 'Scale',
        title: 'Growth operator',
        pricing: 'Mid-six figures / year',
        desc: 'For operators expanding across markets, adding payment rails, or running multi-entity billing structures.',
        features: [
            'Multi-jurisdiction (up to 8)',
            'Up to 8 integrations',
            '24/7 support + dedicated CSM',
            '24-month term, true-up quarterly',
        ],
        buttonText: 'Get indicative quote',
        isPopular: true,
    },
    {
        tag: 'Modernize',
        title: 'Legacy migration',
        pricing: 'Mid-to-high six figures / year',
        desc: 'For MNOs or MVNEs replacing on-prem BSS with managed transition, parallel run, and data migration.',
        features: [
            'Full migration support',
            'Parallel-run period included',
            'Unlimited integrations',
            '36-month term',
        ],
        buttonText: 'Get indicative quote',
        isPopular: false,
    },
    {
        tag: 'Enterprise / Sovereign',
        title: 'Custom deployment',
        pricing: 'Custom — briefing required',
        desc: 'For public-sector, regulated, or air-gapped deployments requiring dedicated infra, DPA, and procurement-ready MSA.',
        features: [
            'Private or sovereign cloud',
            'Procurement-ready contracts',
            'Custom SLAs and audit access',
            'Framework pricing available',
        ],
        buttonText: 'Request a briefing',
        isPopular: false,
    },
];

const tcoComparison = [
    {
        factor: 'Time to first invoice',
        zoiko: 'Weeks',
        legacy: '12–18 months',
        inhouse: '18–36 months',
    },
    {
        factor: 'Upfront capex',
        zoiko: 'None',
        legacy: 'High',
        inhouse: 'Very high',
    },
    {
        factor: 'Multi-jurisdiction compliance',
        zoiko: 'Included',
        legacy: 'Bolt-on / custom',
        inhouse: 'You own it',
    },
    {
        factor: 'Regulatory updates',
        zoiko: 'Automatic',
        legacy: 'Patch cycles',
        inhouse: 'Manual',
    },
    {
        factor: 'Team required to operate',
        zoiko: 'Zero BSS engineers',
        legacy: 'Large ops team',
        inhouse: 'Large dev + ops',
    },
    {
        factor: 'Scales with growth',
        zoiko: 'Metered, no re-arch',
        legacy: 'Capacity upgrades',
        inhouse: 'Re-build required',
    },
    {
        factor: 'Exit / portability',
        zoiko: 'Data export, no lock-in',
        legacy: 'Vendor-locked',
        inhouse: 'You own it',
    },
];

const pricingFormula = [
    {
        component: 'Platform fee',
        covers: 'Core infrastructure — charging, billing, compliance engine, API access',
        scales: 'Flat annual commitment',
    },
    {
        component: 'Consumption',
        covers: 'CDRs processed, transactions settled, events triggered',
        scales: 'Volume bands, metered',
    },
    {
        component: 'Jurisdictions',
        covers: 'Tax, regulatory, and currency config per active region',
        scales: 'Number of active markets',
    },
    {
        component: 'Integrations',
        covers: 'ERP, CRM, payment gateway, third-party BSS connectors',
        scales: 'Number of live integrations',
    },
    {
        component: 'Support tier',
        covers: 'SLA level, dedicated CSM, implementation resourcing',
        scales: 'Response SLA + coverage hours',
    },
];

const faqs = [
    {
        q: 'Is there a free tier or trial?',
        a: 'We do not offer a public free tier, but sandbox access is available for proof-of-concept testing of your real charging flows and APIs. Contact our team to initiate a 30-day POC sandbox.',
    },
    {
        q: 'Can we start with one market and expand?',
        a: 'Absolutely. ZoikoNex is designed for market modularity. You can launch in a single country and activate additional jurisdictions via the admin console as your footprint grows.',
    },
    {
        q: 'Are there setup or implementation fees?',
        a: 'Yes, depending on the complexity of your custom integrations and legacy migration requirements. Indicative setup fees are included in your custom pricing pack proposal.',
    },
    {
        q: 'What happens if our volume grows faster than forecast?',
        a: 'All plans include metered consumption scaling. If you cross your pre-allocated volume bands, true-up adjustments are made quarterly at your contractually locked rates.',
    },
    {
        q: 'What does the contract look like?',
        a: 'We offer standard commercial MSAs and DPAs. Enterprise and sovereign options include procurement-ready frameworks, custom SLAs, and source-code escrow options.',
    },
    {
        q: 'Is my data used to train AI models?',
        a: 'No. ZoikoNex maintains absolute customer data isolation. Your operational CDRs, subscriber profiles, and billing logs are never utilized to train shared AI models.',
    },
];

const PlansAndPricing = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (idx: number) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    return (
        <div className="w-full bg-[#030712] text-white min-h-screen font-sans">
            {/* ─── HERO SECTION ─── */}
            <section className="relative max-w-[1440px] mx-auto pt-24 pb-20 px-6 text-center flex flex-col items-center">
                <span className="text-sky-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    Plans & Pricing
                </span>
                <h1 className="text-blue-50 text-4xl sm:text-5xl font-extrabold leading-[1.2] max-w-[800px] mb-6">
                    Infrastructure priced for how you actually operate
                </h1>
                <p className="text-slate-400 text-base sm:text-lg max-w-[700px] leading-relaxed mb-10">
                    No fixed tiers. Your cost is built from five components — platform,
                    consumption, jurisdictions, integrations, and support. Pay for what you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 h-12 bg-sky-600 hover:bg-sky-500 transition-colors text-white text-sm font-semibold rounded-md shadow-lg shadow-sky-600/10 cursor-pointer">
                        Request Pricing Pack
                    </button>
                    <button className="px-8 h-12 rounded-md outline outline-1 outline-slate-800 hover:bg-white/5 transition-colors text-slate-300 text-sm font-semibold cursor-pointer">
                        See Plans
                    </button>
                </div>
            </section>

            {/* ─── PATHWAYS SECTION ─── */}
            <section className="relative max-w-[1040px] mx-auto py-16 px-6 border-t border-slate-800/80">
                <div className="text-center mb-12">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] block mb-3">
                        Pathways
                    </span>
                    <h2 className="text-blue-50 text-3xl font-bold mb-4">
                        Four entry points
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-[650px] mx-auto">
                        Choose the pathway that matches your situation. All include the full platform — scope is what differs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {pathways.map((path, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-xl p-6 flex flex-col justify-between transition-all border ${path.isPopular
                                    ? 'bg-slate-900 border-sky-600/50 shadow-xl shadow-sky-950/20'
                                    : 'bg-[#090d16] border-slate-800/60 hover:border-slate-700/80'
                                }`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 text-2xs font-extrabold uppercase tracking-widest">
                                        {path.tag}
                                    </span>
                                    {path.isPopular && (
                                        <span className="bg-sky-600/15 border border-sky-500/25 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-sky-400">
                                            Most common
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-blue-50 text-base font-bold mb-2">
                                    {path.title}
                                </h3>
                                <p className="text-cyan-500 text-2xs font-semibold uppercase tracking-wide mb-4">
                                    {path.pricing}
                                </p>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                    {path.desc}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {path.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2 text-2xs text-slate-300">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm mt-1 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className={`w-full h-10 rounded-md text-xs font-semibold transition-colors cursor-pointer ${path.isPopular
                                        ? 'bg-sky-600 hover:bg-sky-500 text-white'
                                        : 'outline outline-1 outline-slate-800 text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                {path.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── TCO TCO TCO SECTION ─── */}
            {/* ─── TCO SECTION ─── */}
            <section className="max-w-[992px] mx-auto py-20 border-t border-slate-800">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-600 mb-5">
                        Total cost of ownership
                    </p>

                    <h2 className="text-[36px] leading-[44px] font-semibold text-blue-50">
                        How ZoikoNex compares
                    </h2>

                    <p className="mt-3 text-base text-slate-400">
                        Compared against legacy on-prem BSS and building in-house.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="w-[30%] py-3 pl-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    Factor
                                </th>

                                <th className="w-[24%] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    ZoikoNex
                                </th>

                                <th className="w-[26%] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    Legacy on-prem BSS
                                </th>

                                <th className="w-[20%] py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    In-house build
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {tcoComparison.map((row, index) => (
                                <tr
                                    key={row.factor}
                                    className={
                                        index !== tcoComparison.length - 1
                                            ? "border-b border-slate-800"
                                            : ""
                                    }
                                >
                                    <td className="py-[18px] pl-4 text-xs font-medium text-blue-50">
                                        {row.factor}
                                    </td>

                                    <td className="py-[18px] text-center text-xs font-semibold text-slate-400">
                                        {row.zoiko}
                                    </td>

                                    <td className="py-[18px] text-center text-xs font-normal text-slate-400">
                                        {row.legacy}
                                    </td>

                                    <td className="py-[18px] text-center text-xs font-normal text-slate-400">
                                        {row.inhouse}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ─── PRICING FORMULA SECTION ─── */}
            <section className="relative max-w-[1040px] mx-auto py-16 px-6 border-t border-slate-800/80">
                <div className="text-center mb-12">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] block mb-3">
                        How pricing works
                    </span>
                    <h2 className="text-blue-50 text-3xl font-bold mb-4">
                        The five-component formula
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-[650px] mx-auto">
                        Your quote is assembled from five transparent inputs. No bundled features, no black-box tiers.
                    </p>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="py-4 pr-4 text-slate-500 text-2xs font-extrabold uppercase tracking-wider w-1/4">Component</th>
                                <th className="py-4 px-4 text-slate-500 text-2xs font-extrabold uppercase tracking-wider w-1/2">What it covers</th>
                                <th className="py-4 pl-4 text-slate-500 text-2xs font-extrabold uppercase tracking-wider w-1/4">Scales with</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricingFormula.map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-900/10 transition-colors">
                                    <td className="py-4 pr-4 text-blue-50 text-xs font-semibold">{row.component}</td>
                                    <td className="py-4 px-4 text-slate-400 text-xs leading-relaxed">{row.covers}</td>
                                    <td className="py-4 pl-4 text-slate-500 text-xs">{row.scales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ─── NEXT STEPS SECTION ─── */}
            <section className="relative max-w-[1040px] mx-auto py-16 px-6 border-t border-slate-800/80">
                <div className="text-center mb-12">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] block mb-3">
                        Next steps
                    </span>
                    <h2 className="text-blue-50 text-3xl font-bold mb-4">
                        Three ways to get your number
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-[700px] mx-auto">
                        We don't publish fixed prices. Every quote is built from the formula. Pick then path that fits where you are.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pricing Pack */}
                    <div className="bg-[#0a0f1d] border border-slate-800/60 hover:border-slate-700/80 rounded-xl p-6 flex flex-col justify-between cursor-pointer group transition-all">
                        <div>
                            <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-cyan-700 text-lg font-normal leading-7" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    📄
                                </span>
                            </div>
                            <h3 className="text-blue-50 text-base font-bold mb-2">
                                Pricing Pack
                            </h3>
                            <p className="text-[#94a3b8] text-xs leading-relaxed mb-6">
                                Receive a detailed breakdown of the formula applied to your operator profile — includes indicative ranges, TCO model, and a sample contract structure. Delivered within 48 hours.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-500 text-xs font-semibold group-hover:text-sky-400 transition-colors">
                            <span>Request Pricing Pack</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Sandbox / POC */}
                    <div className="bg-[#0a0f1d] border border-slate-800/60 hover:border-slate-700/80 rounded-xl p-6 flex flex-col justify-between cursor-pointer group transition-all">
                        <div>
                            <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-cyan-700 text-lg font-normal leading-7" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    🧪
                                </span>
                            </div>
                            <h3 className="text-blue-50 text-base font-bold mb-2">
                                Sandbox / POC
                            </h3>
                            <p className="text-[#94a3b8] text-xs leading-relaxed mb-6">
                                Run a scoped proof of concept against your real use case — charging flows, tax logic, or integration testing. Time-boxed at 30 days. No commitment required.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-500 text-xs font-semibold group-hover:text-sky-400 transition-colors">
                            <span>Start Sandbox</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                    </div>

                    {/* Briefing Call */}
                    <div className="bg-[#0a0f1d] border border-slate-800/60 hover:border-slate-700/80 rounded-xl p-6 flex flex-col justify-between cursor-pointer group transition-all">
                        <div>
                            <div className="w-9 h-9 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-cyan-700 text-lg font-normal leading-7" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    📞
                                </span>
                            </div>
                            <h3 className="text-blue-50 text-base font-bold mb-2">
                                Briefing Call
                            </h3>
                            <p className="text-[#94a3b8] text-xs leading-relaxed mb-6">
                                For enterprise, sovereign, or complex multi-market deployments. A 45-minute technical and commercial briefing with a ZoikoNex principal. NDA-ready.
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-500 text-xs font-semibold group-hover:text-sky-400 transition-colors">
                            <span>Book a Briefing</span>
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FAQ SECTION ─── */}
            <section className="relative max-w-[1040px] mx-auto py-16 px-6 border-t border-slate-800/80 mb-16">
                <div className="text-center md:text-left mb-12">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] block mb-3">
                        Questions
                    </span>
                    <h2 className="text-blue-50 text-3xl font-bold mb-4">
                        Common questions about pricing
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-800/80 pb-4">
                            <button
                                className="w-full flex items-center justify-between py-3 text-left hover:text-sky-400 transition-colors cursor-pointer"
                                onClick={() => toggleFaq(idx)}
                            >
                                <span className="text-blue-50 text-sm font-semibold">
                                    {faq.q}
                                </span>
                                <span className="text-slate-500 text-lg font-medium">
                                    {openFaq === idx ? '−' : '+'}
                                </span>
                            </button>
                            {openFaq === idx && (
                                <div className="pl-0 pr-8 pb-3 text-slate-400 text-xs leading-relaxed animate-fadeIn">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PlansAndPricing;
