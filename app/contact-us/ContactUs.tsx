'use client';

import React from 'react';
import Image from 'next/image';

const routingItems = [
    {
        icon: '/image/contact/platform-sales.svg',
        title: 'Platform Sales',
        subtitle: 'MVNO · MNO · telecom groups',
    },
    {
        icon: '/image/contact/customer-support.svg',
        title: 'Customer Support',
        subtitle: 'active customers & teams',
    },
    {
        icon: '/image/contact/partnerships.svg',
        title: 'Partnerships',
        subtitle: 'MVNA · payments · eSIM · SIs',
    },
    {
        icon: '/image/contact/developers.svg',
        title: 'Developers & APIs',
        subtitle: 'sandbox · API · integration',
    },
    {
        icon: '/image/contact/security.svg',
        title: 'Security & Compliance',
        subtitle: 'diligence · risk · procurement',
    },
    {
        icon: '/image/contact/press.svg',
        title: 'Press & Media',
        subtitle: 'journalists & analysts',
    },
];

const otherRoutes = [
    { tag: 'Press & media', title: 'Media relations', link: 'Press & Media', url: '/press-media' },
    { tag: 'Ecosystem', title: 'Partnerships', link: 'Partners page', url: '/partners' },
    { tag: 'Talent', title: 'Careers', link: 'Open roles', url: '/careers' },
    { tag: 'Legal', title: 'Legal notices', link: 'Legal Intake', url: '/legal' },
];

const ContactUs = () => {
    return (
        <div className="w-full bg-slate-50">
            {/* ─── HERO SECTION ─── */}
            <section className="relative w-full py-20 lg:py-0 lg:h-[615px] overflow-hidden border-b border-slate-200 bg-slate-950 flex items-center justify-center">
                {/* Background image & gradient overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="/image/contact/hero-media.png"
                        alt="City skyline"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/75 to-sky-900/60" />
                    {/* Lime radial glow top-right */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_6%,rgba(132,204,22,0.20),transparent_60%)]" />
                </div>

                {/* Centered content wrapper */}
                <div className="relative z-10 mx-auto max-w-[1140px] w-full px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left – text container */}
                    <div className="flex flex-col max-w-[580px]">
                        <h1
                            className="text-white text-4xl lg:text-[56px] font-extrabold lg:leading-[61px] tracking-tight mb-6"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Reach the right <br className="hidden lg:block" />
                            team for your telecom <br className="hidden lg:block" />
                            platform inquiry.
                        </h1>

                        <p
                            className="text-slate-300 text-base font-normal leading-7 max-w-[478px]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Whether you&apos;re launching an MVNO, modernizing a telecom BSS
                            stack, evaluating APIs, exploring partnership, or seeking customer
                            support, ZoikoNex routes your inquiry to the team best equipped to
                            respond.
                        </p>
                    </div>

                    {/* Right – Routing Console card */}
                    <div
                        className="w-full max-w-[486.39px] h-[384px] rounded-[20px] border border-white/10 backdrop-blur-[3px] flex flex-col shrink-0"
                        style={{
                            background:
                                'linear-gradient(77deg, rgba(15,23,42,0.90), rgba(15,23,42,0.90))',
                            boxShadow: '0px 30px 70px -30px rgba(0,0,0,0.70)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-[23px] h-[46px] border-b border-white/10 flex-shrink-0">
                            <span
                                className="text-slate-400 text-xs font-semibold uppercase tracking-[0.15em]"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                Routing Console
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                                <span
                                    className="text-lime-500 text-[10px] font-bold uppercase tracking-wider"
                                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                >
                                    Online
                                </span>
                            </span>
                        </div>

                        {/* Routing items */}
                        <div className="flex flex-col flex-1 justify-between py-1">
                            {routingItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between px-[23px] h-[54px] hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                                        idx < routingItems.length - 1
                                            ? 'border-b border-white/[0.06]'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={item.icon}
                                                alt={item.title}
                                                width={16}
                                                height={16}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span
                                                className="text-white text-[13.5px] font-semibold tracking-wide"
                                                style={{
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                }}
                                            >
                                                {item.title}
                                            </span>
                                            <span
                                                className="text-slate-400 text-[9.5px] tracking-wider leading-3 mt-0.5"
                                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                            >
                                                {item.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                    <img
                                        src="/image/contact/right-arrow.svg"
                                        alt="Arrow"
                                        width={14}
                                        height={14}
                                        className="flex-shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FORM SECTION ─── */}
            <section className="relative w-full bg-[#f4f7f6] py-[100px] flex items-center justify-center">
                {/* Lime radial glow top-right */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)]" />

                <div className="relative z-10 mx-auto max-w-[1140px] w-full px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left text */}
                    <div className="flex flex-col max-w-[420px]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 bg-lime-500 rounded-sm" />
                            <span
                                className="text-sky-700 text-xs font-semibold uppercase tracking-widest leading-4"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                Send an Inquiry
                            </span>
                        </div>

                        <h2
                            className="text-slate-800 text-4xl lg:text-5xl font-extrabold lg:leading-[64px] mb-6"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Tell us what <br className="hidden lg:block" />
                            you’re building <br className="hidden lg:block" />
                            or evaluating.
                        </h2>

                        <p
                            className="text-slate-600 text-base font-normal leading-6"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            Pick an inquiry type and we’ll show only the <br className="hidden lg:block" />
                            fields that matter, then route your message to <br className="hidden lg:block" />
                            the right team.
                        </p>
                    </div>

                    {/* Right – Form card */}
                    <div
                        className="relative w-full max-w-[628.80px] h-[574.69px] bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-200 shrink-0 transform scale-90 sm:scale-100 origin-top lg:origin-center"
                        style={{
                            boxShadow:
                                '0px 18px 48px -22px rgba(11,60,99,0.28), 0px 1px 2px 0px rgba(11,60,99,0.04)',
                        }}
                    >
                        {/* Inquiry type */}
                        <div className="w-20 h-5 left-[29px] top-[29px] absolute text-slate-800 text-xs font-semibold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Inquiry type
                        </div>
                        <div className="w-2 h-5 left-[110.39px] top-[29px] absolute text-red-500 text-xs font-bold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            *
                        </div>
                        
                        <div className="relative">
                            <select
                                defaultValue=""
                                className="w-[570.80px] h-10 left-[29px] top-[56.80px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 px-4 text-slate-800 text-sm font-normal appearance-none focus:outline-none focus:outline-sky-700 focus:outline-1 cursor-pointer"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                <option value="" disabled hidden>Select an inquiry type…</option>
                                <option value="sales">Platform Sales</option>
                                <option value="support">Customer Support</option>
                                <option value="partnership">Partnerships</option>
                                <option value="developers">Developers & APIs</option>
                                <option value="security">Security & Compliance</option>
                                <option value="press">Press & Media</option>
                            </select>
                            <img
                                src="/image/contact/chevron-down-1.svg"
                                alt="Chevron"
                                width={10}
                                height={6}
                                className="absolute left-[571.80px] top-[73.80px] pointer-events-none"
                            />
                        </div>

                        {/* Full name */}
                        <div className="w-14 h-5 left-[29px] top-[112.80px] absolute text-slate-800 text-xs font-semibold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Full name
                        </div>
                        <div className="w-2 h-5 left-[94.78px] top-[112.80px] absolute text-red-500 text-xs font-bold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            *
                        </div>
                        <input
                            type="text"
                            placeholder="Your full name"
                            className="w-[288px] h-11 left-[29px] top-[140.59px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 px-4 text-slate-800 placeholder-slate-500 text-sm font-normal focus:outline-none focus:outline-sky-700 focus:outline-1"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        />

                        {/* Work email */}
                        <div className="w-16 h-5 left-[320.89px] top-[112.80px] absolute text-slate-800 text-xs font-semibold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Work email
                        </div>
                        <div className="w-2 h-5 left-[397.19px] top-[112.80px] absolute text-red-500 text-xs font-bold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            *
                        </div>
                        <input
                            type="email"
                            placeholder="you@company.com"
                            className="w-[288px] h-11 left-[320.89px] top-[140.59px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 px-4 text-slate-800 placeholder-slate-500 text-sm font-normal focus:outline-none focus:outline-sky-700 focus:outline-1"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        />

                        {/* Country / region */}
                        <div className="w-24 h-5 left-[29px] top-[214.59px] absolute text-slate-800 text-xs font-semibold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Country / region
                        </div>
                        <div className="w-2 h-5 left-[138.36px] top-[214.59px] absolute text-red-500 text-xs font-bold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            *
                        </div>
                        <div className="relative">
                            <select
                                defaultValue=""
                                className="w-[288px] h-10 left-[29px] top-[242.39px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 px-4 text-slate-800 text-sm font-normal appearance-none focus:outline-none focus:outline-sky-700 focus:outline-1 cursor-pointer"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                <option value="" disabled hidden>Select…</option>
                                <option value="US">United States</option>
                                <option value="GB">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="IN">India</option>
                                <option value="SG">Singapore</option>
                            </select>
                            <img
                                src="/image/contact/chevron-down-1.svg"
                                alt="Chevron"
                                width={10}
                                height={6}
                                className="absolute left-[279.89px] top-[259.39px] pointer-events-none"
                            />
                        </div>

                        {/* Message */}
                        <div className="w-14 h-5 left-[29px] top-[298.39px] absolute text-slate-800 text-xs font-semibold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Message
                        </div>
                        <div className="w-2 h-5 left-[92.66px] top-[298.39px] absolute text-red-500 text-xs font-bold leading-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            *
                        </div>
                        <textarea
                            placeholder="What are you building, modernizing, integrating, or evaluating?"
                            className="w-[570.80px] h-24 left-[29px] top-[326.19px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 p-4 text-slate-800 placeholder-slate-500 text-sm font-normal focus:outline-none focus:outline-sky-700 focus:outline-1 resize-none leading-6"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        />

                        {/* Checkbox */}
                        <input
                            type="checkbox"
                            id="agreement"
                            className="w-4 h-4 left-[33px] top-[446.19px] absolute border border-neutral-500 rounded-sm cursor-pointer accent-sky-700"
                        />
                        <label
                            htmlFor="agreement"
                            className="w-[516.97px] h-9 left-[64px] top-[446.19px] absolute text-slate-600 text-xs font-semibold leading-5 select-none cursor-pointer"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            I agree that ZoikoNex may process my information to review, route, and respond to this
                            inquiry per the{' '}
                            <span className="text-sky-700 hover:underline">Privacy Policy</span>.
                        </label>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-[570.80px] h-12 left-[29px] top-[497.69px] absolute bg-sky-700 hover:bg-sky-800 transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer text-white text-base font-bold"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            <span>Send inquiry</span>
                            <img
                                src="/image/contact/white-arrow.svg"
                                alt="Arrow"
                                width={14}
                                height={14}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── OTHER ROUTES SECTION ─── */}
            <section className="mx-auto max-w-[1072px] px-[22px] pb-24">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 bg-lime-500 rounded-sm" />
                    <span
                        className="text-sky-700 text-xs font-semibold uppercase tracking-widest"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        Other Routes
                    </span>
                </div>
                <h2
                    className="text-slate-800 text-[30px] font-extrabold leading-[48px] mb-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Corporate, media, partnership &amp; careers.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {otherRoutes.map((route, idx) => (
                        <a
                            href={route.url}
                            key={idx}
                            className="bg-white rounded-2xl border border-slate-200 p-[22px] hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start group"
                            style={{
                                boxShadow:
                                    '0px 6px 16px -10px rgba(11,60,99,0.22), 0px 1px 2px 0px rgba(11,60,99,0.06)',
                            }}
                        >
                            <span
                                className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.1em]"
                                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                            >
                                {route.tag}
                            </span>
                            <h3
                                className="text-slate-800 text-[15px] font-bold leading-6 mt-1.5 mb-6"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {route.title}
                            </h3>
                            <div className="mt-auto inline-flex items-center gap-1.5 text-sky-600 group-hover:text-sky-700 transition-colors">
                                <span
                                    className="text-xs font-bold tracking-tight"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {route.link}
                                </span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6h7m0 0l-3-3m3 3l-3 3" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ContactUs;
