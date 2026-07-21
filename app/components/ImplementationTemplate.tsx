import React from 'react';

interface Outcome {
    value: string;
    label: string;
}

interface ImplementationTemplateProps {
    tags: string[];
    title: string;
    description: string;
    challenge: string;
    approach: string[];
    outcomes: Outcome[];
}

export default function ImplementationTemplate({
    tags,
    title,
    description,
    challenge,
    approach,
    outcomes
}: ImplementationTemplateProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white font-['Inter'] w-full">
            {/* Top color bar */}
            <div className="h-12 w-full bg-gradient-to-r from-lime-500 to-blue-600"></div>

            <main className="flex-1 max-w-[900px] mx-auto w-full px-8 py-12 flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-start mb-16">
                    <img src="/image/logo.svg" alt="ZoikoNex Logo" className="h-12 object-contain" />
                    <div className="flex flex-col items-end gap-2 mt-2">
                        <span className="text-lime-600 text-[11px] font-bold tracking-[0.2em]">IMPLEMENTATION SCENARIO</span>
                        <div className="px-4 py-1.5 bg-[#0a192f] rounded-full">
                            <span className="text-white text-xs font-semibold tracking-wider">ANONYMIZED</span>
                        </div>
                    </div>
                </header>

                {/* Tags */}
                <div className="flex gap-3 mb-6">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 rounded text-slate-600 text-[11px] font-bold tracking-wider">{tag}</span>
                    ))}
                </div>

                {/* Title & Description */}
                <h1 className="text-[#1a1c23] text-5xl font-bold font-['Hanken_Grotesk'] mb-8">{title}</h1>
                <div className="pl-4 border-l-4 border-lime-400 mb-12">
                    <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
                </div>

                <hr className="border-slate-200 mb-10" />

                {/* Challenge */}
                <div className="mb-12">
                    <h2 className="text-[#008ba3] text-sm font-bold tracking-[0.15em] mb-4">THE CHALLENGE</h2>
                    <p className="text-slate-700 text-base leading-relaxed">{challenge}</p>
                </div>

                {/* Approach */}
                <div className="mb-16">
                    <h2 className="text-[#008ba3] text-sm font-bold tracking-[0.15em] mb-6">THE ZOIKONEX APPROACH</h2>
                    <ul className="flex flex-col gap-5">
                        {approach.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                                <div className="mt-1.5 w-3 h-3 bg-lime-400 rounded-sm shrink-0"></div>
                                <span className="text-slate-700 text-base">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Outcomes */}
                <div className="mb-8">
                    <h2 className="text-[#008ba3] text-sm font-bold tracking-[0.15em] mb-6">MEASURED OUTCOMES</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {outcomes.map((outcome, idx) => (
                            <div key={idx} className="p-5 rounded-lg border border-slate-200 bg-[#fbfcfd] flex flex-col gap-2">
                                <span className="text-lime-600 text-3xl font-bold font-['Hanken_Grotesk']">{outcome.value}</span>
                                <span className="text-slate-500 text-[10px] font-bold tracking-wider">{outcome.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#1f2638] w-full py-8 px-8 mt-auto">
                <div className="max-w-[900px] mx-auto">
                    <div className="text-white text-sm font-bold mb-3">
                        <span className="text-white">ZOIKO</span><span className="text-lime-500">NEX</span>
                        <span className="mx-2 text-slate-500">|</span>
                        <span className="text-slate-300 font-normal">Governed Telecom Monetization</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                        This document is an anonymized implementation scenario for illustrative purposes. Metrics are representative of production deployments. © 2026 ZoikoNex — developed and operated by Zoiko Tech Inc., the technology arm of Zoiko Group Inc.
                    </p>
                </div>
            </footer>
        </div>
    );
}
