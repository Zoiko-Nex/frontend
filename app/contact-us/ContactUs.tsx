'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FORMS_API_URL =
    process.env.NEXT_PUBLIC_FORMS_API_URL ?? 'http://localhost:8099';

const routingItems = [
    {
        icon: '/image/contact/platform-sales.svg',
        title: 'Platform Sales',
        subtitle: 'MVNO · MNO · telecom groups',
        url: '/request-a-demo',
    },
    {
        icon: '/image/contact/customer-support.svg',
        title: 'Customer Support',
        subtitle: 'active customers & teams',
        url: '/documentation',
    },
    {
        icon: '/image/contact/partnerships.svg',
        title: 'Partnerships',
        subtitle: 'MVNA · payments · eSIM · SIs',
        url: '/partner',
    },
    {
        icon: '/image/contact/developers.svg',
        title: 'Developers & APIs',
        subtitle: 'sandbox · API · integration',
        url: '/developer-portal',
    },
    {
        icon: '/image/contact/security.svg',
        title: 'Security & Compliance',
        subtitle: 'diligence · risk · procurement',
        url: '/security',
    },
    {
        icon: '/image/contact/press.svg',
        title: 'Press & Media',
        subtitle: 'journalists & analysts',
        url: '/press-media',
    },
];

const otherRoutes = [
    { tag: 'Press & media', title: 'Media relations', link: 'Press & Media', url: '/press-media' },
    { tag: 'Ecosystem', title: 'Partnerships', link: 'Partners page', url: '/partner' },
    { tag: 'Talent', title: 'Careers', link: 'Open roles', url: '/careers' },
    { tag: 'Legal', title: 'Legal notices', link: 'Legal Intake', url: '/legal#request-legal-pack' },
];

const inquiryOptions = [
    { value: 'sales', label: 'Platform Sales' },
    { value: 'support', label: 'Customer Support' },
    { value: 'partnership', label: 'Partnerships' },
    { value: 'developers', label: 'Developers & APIs' },
    { value: 'security', label: 'Security & Compliance' },
    { value: 'press', label: 'Press & Media' },
];

const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'IN', label: 'India' },
    { value: 'SG', label: 'Singapore' },
];

interface FormState {
    inquiryType: string;
    fullName: string;
    workEmail: string;
    country: string;
    message: string;
    agreement: boolean;
}

interface FormErrors {
    inquiryType?: string;
    fullName?: string;
    workEmail?: string;
    country?: string;
    message?: string;
    agreement?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const initialState: FormState = {
    inquiryType: '',
    fullName: '',
    workEmail: '',
    country: '',
    message: '',
    agreement: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormState): FormErrors {
    const errors: FormErrors = {};
    if (!values.inquiryType) errors.inquiryType = 'Please select an inquiry type.';
    if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!values.workEmail.trim()) errors.workEmail = 'Work email is required.';
    else if (!EMAIL_RE.test(values.workEmail.trim()))
        errors.workEmail = 'Enter a valid email address.';
    if (!values.country) errors.country = 'Please select a country or region.';
    if (!values.message.trim()) errors.message = 'Message is required.';
    if (!values.agreement) errors.agreement = 'Please accept the terms to continue.';
    return errors;
}

const JAKARTA = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;
const MONO = { fontFamily: "'IBM Plex Mono', monospace" } as const;

const inputBase =
    'w-full h-11 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] px-4 text-slate-800 placeholder-slate-500 text-sm font-normal focus:outline-1 transition-colors';

const selectBase =
    'w-full h-10 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] px-4 text-slate-800 text-sm font-normal appearance-none pr-10 focus:outline-1 cursor-pointer transition-colors';

export const ContactUs = () => {
    const [values, setValues] = useState<FormState>(initialState);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<Status>('idle');
    const [serverError, setServerError] = useState('');

    const setField = (name: keyof FormState, value: string | boolean) => {
        const next = { ...values, [name]: value };
        setValues(next);
        if (touched[name]) setErrors(validate(next));
    };

    const handleBlur = (name: keyof FormState) => {
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors(validate(values));
    };

    const fieldOutline = (name: keyof FormErrors) =>
        touched[name] && errors[name]
            ? 'outline-red-400 focus:outline-red-500'
            : 'outline-slate-300 focus:outline-sky-700';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const found = validate(values);
        setErrors(found);
        setTouched({
            inquiryType: true,
            fullName: true,
            workEmail: true,
            country: true,
            message: true,
            agreement: true,
        });
        if (Object.keys(found).length > 0) return;

        setStatus('submitting');
        setServerError('');
        try {
            const res = await fetch(`${FORMS_API_URL}/v1/contact-us`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inquiry_type: values.inquiryType,
                    full_name: values.fullName.trim(),
                    work_email: values.workEmail.trim(),
                    country: values.country,
                    message: values.message.trim(),
                    consent: values.agreement,
                }),
            });

            let data: {
                contact_us_id?: string;
                mail_status?: string;
                mail_error?: string;
                message?: string;
            } | null = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            // The backend persists the submission first, then attempts the admin
            // email. It returns 201 whenever the record is saved — even if mail
            // could not be delivered (mail_status = NOT_SENT). So:
            //   • saved (mail SENT or NOT_SENT) → green
            //   • not saved → red (the only case where nothing landed)
            const saved = res.ok && !!data?.contact_us_id;

            if (saved) {
                // Data is safe. If the admin mail failed we still show green to
                // the visitor, but surface it for ops visibility.
                if (data?.mail_status === 'NOT_SENT') {
                    console.warn(
                        'Contact inquiry saved but admin email was not sent:',
                        data?.mail_error
                    );
                }
                setStatus('success');
                setValues(initialState);
                setTouched({});
            } else {
                // Neither saved nor mailed — a real failure.
                setStatus('error');
                setServerError(
                    data?.message || `Something went wrong (${res.status}). Please try again.`
                );
            }
        } catch (err) {
            // Network / unreachable server — nothing was saved.
            setStatus('error');
            setServerError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.'
            );
        }
    };

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
                            style={JAKARTA}
                        >
                            Reach the right <br className="hidden lg:block" />
                            team for your telecom <br className="hidden lg:block" />
                            platform inquiry.
                        </h1>

                        <p
                            className="text-slate-300 text-base font-normal leading-7 max-w-[478px]"
                            style={JAKARTA}
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
                                style={MONO}
                            >
                                Routing Console
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                                <span
                                    className="text-lime-500 text-[10px] font-bold uppercase tracking-wider"
                                    style={MONO}
                                >
                                    Online
                                </span>
                            </span>
                        </div>

                        {/* Routing items */}
                        <div className="flex flex-col flex-1 justify-between py-1">
                            {routingItems.map((item, idx) => (
                                <Link
                                    href={item.url}
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
                                                style={JAKARTA}
                                            >
                                                {item.title}
                                            </span>
                                            <span
                                                className="text-slate-400 text-[9.5px] tracking-wider leading-3 mt-0.5"
                                                style={MONO}
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
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FORM SECTION ─── */}
            <section className="relative w-full bg-[#f4f7f6] py-[100px] flex items-center justify-center">
                {/* Lime radial glow top-right */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)]" />

                <div className="relative z-10 mx-auto max-w-[1140px] w-full px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                    {/* Left text */}
                    <div className="flex flex-col max-w-[420px]">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 bg-lime-500 rounded-sm" />
                            <span
                                className="text-sky-700 text-xs font-semibold uppercase tracking-widest leading-4"
                                style={MONO}
                            >
                                Send an Inquiry
                            </span>
                        </div>

                        <h2
                            className="text-slate-800 text-4xl lg:text-5xl font-extrabold lg:leading-[64px] mb-6"
                            style={JAKARTA}
                        >
                            Tell us what <br className="hidden lg:block" />
                            you&rsquo;re building <br className="hidden lg:block" />
                            or evaluating.
                        </h2>

                        <p className="text-slate-600 text-base font-normal leading-6" style={JAKARTA}>
                            Pick an inquiry type and we&rsquo;ll show only the{' '}
                            <br className="hidden lg:block" />
                            fields that matter, then route your message to{' '}
                            <br className="hidden lg:block" />
                            the right team.
                        </p>
                    </div>

                    {/* Right – Form card */}
                    <div
                        className="relative w-full max-w-[628.80px] bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-200 shrink-0 p-7"
                        style={{
                            boxShadow:
                                '0px 18px 48px -22px rgba(11,60,99,0.28), 0px 1px 2px 0px rgba(11,60,99,0.04)',
                        }}
                    >
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center rounded-[14px] bg-green-50 px-6 py-16 outline outline-1 outline-green-200">
                                <p
                                    className="text-lg font-bold text-green-800"
                                    style={JAKARTA}
                                >
                                    Your inquiry has been received.
                                </p>
                                <p
                                    className="mt-2 text-sm text-green-700 text-center"
                                    style={JAKARTA}
                                >
                                    We&rsquo;ll route it to the right team and respond shortly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-xs font-bold uppercase tracking-wider text-sky-700 underline-offset-4 hover:underline"
                                    style={MONO}
                                >
                                    Send another inquiry
                                </button>
                            </div>
                        ) : (
                            <form
                                noValidate
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >
                                {/* Inquiry type */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="flex items-center gap-0.5 text-xs font-semibold text-slate-800"
                                        style={JAKARTA}
                                    >
                                        Inquiry type <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <select
                                            value={values.inquiryType}
                                            onChange={(e) => setField('inquiryType', e.target.value)}
                                            onBlur={() => handleBlur('inquiryType')}
                                            className={`${selectBase} ${fieldOutline('inquiryType')}`}
                                            style={JAKARTA}
                                        >
                                            <option value="" disabled hidden>
                                                Select an inquiry type…
                                            </option>
                                            {inquiryOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <img
                                            src="/image/contact/chevron-down-1.svg"
                                            alt="Chevron"
                                            width={10}
                                            height={6}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                        />
                                    </div>
                                    {touched.inquiryType && errors.inquiryType && (
                                        <p className="text-xs text-red-600">{errors.inquiryType}</p>
                                    )}
                                </div>

                                {/* Full name + Work email */}
                                <div className="flex flex-col sm:flex-row gap-5">
                                    <div className="flex flex-col gap-2 flex-1">
                                        <label
                                            className="flex items-center gap-0.5 text-xs font-semibold text-slate-800"
                                            style={JAKARTA}
                                        >
                                            Full name <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={values.fullName}
                                            onChange={(e) => setField('fullName', e.target.value)}
                                            onBlur={() => handleBlur('fullName')}
                                            placeholder="Your full name"
                                            className={`${inputBase} ${fieldOutline('fullName')}`}
                                            style={JAKARTA}
                                        />
                                        {touched.fullName && errors.fullName && (
                                            <p className="text-xs text-red-600">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 flex-1">
                                        <label
                                            className="flex items-center gap-0.5 text-xs font-semibold text-slate-800"
                                            style={JAKARTA}
                                        >
                                            Work email <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={values.workEmail}
                                            onChange={(e) => setField('workEmail', e.target.value)}
                                            onBlur={() => handleBlur('workEmail')}
                                            placeholder="you@company.com"
                                            className={`${inputBase} ${fieldOutline('workEmail')}`}
                                            style={JAKARTA}
                                        />
                                        {touched.workEmail && errors.workEmail && (
                                            <p className="text-xs text-red-600">{errors.workEmail}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Country / region */}
                                <div className="flex flex-col gap-2 sm:max-w-[288px]">
                                    <label
                                        className="flex items-center gap-0.5 text-xs font-semibold text-slate-800"
                                        style={JAKARTA}
                                    >
                                        Country / region <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <div className="relative w-full">
                                        <select
                                            value={values.country}
                                            onChange={(e) => setField('country', e.target.value)}
                                            onBlur={() => handleBlur('country')}
                                            className={`${selectBase} ${fieldOutline('country')}`}
                                            style={JAKARTA}
                                        >
                                            <option value="" disabled hidden>
                                                Select…
                                            </option>
                                            {countryOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <img
                                            src="/image/contact/chevron-down-1.svg"
                                            alt="Chevron"
                                            width={10}
                                            height={6}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                                        />
                                    </div>
                                    {touched.country && errors.country && (
                                        <p className="text-xs text-red-600">{errors.country}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        className="flex items-center gap-0.5 text-xs font-semibold text-slate-800"
                                        style={JAKARTA}
                                    >
                                        Message <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={values.message}
                                        onChange={(e) => setField('message', e.target.value)}
                                        onBlur={() => handleBlur('message')}
                                        placeholder="What are you building, modernizing, integrating, or evaluating?"
                                        className={`w-full bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] p-4 text-slate-800 placeholder-slate-500 text-sm font-normal focus:outline-1 resize-none leading-6 transition-colors ${fieldOutline(
                                            'message'
                                        )}`}
                                        style={JAKARTA}
                                    />
                                    {touched.message && errors.message && (
                                        <p className="text-xs text-red-600">{errors.message}</p>
                                    )}
                                </div>

                                {/* Agreement */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            checked={values.agreement}
                                            onChange={(e) => setField('agreement', e.target.checked)}
                                            onBlur={() => handleBlur('agreement')}
                                            className="mt-0.5 w-4 h-4 border border-neutral-500 rounded-sm cursor-pointer accent-sky-700 flex-shrink-0"
                                        />
                                        <label
                                            htmlFor="agreement"
                                            className="text-slate-600 text-xs font-semibold leading-5 select-none cursor-pointer"
                                            style={JAKARTA}
                                        >
                                            I agree that ZoikoNex may process my information to review,
                                            route, and respond to this inquiry per the{' '}
                                            <span className="text-sky-700 hover:underline">
                                                Privacy Policy
                                            </span>
                                            .
                                        </label>
                                    </div>
                                    {touched.agreement && errors.agreement && (
                                        <p className="text-xs text-red-600 pl-7">{errors.agreement}</p>
                                    )}
                                </div>

                                {/* Server error */}
                                {status === 'error' && serverError && (
                                    <p className="rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-600 outline outline-1 outline-offset-[-1px] outline-red-200">
                                        {serverError}
                                    </p>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full h-12 bg-sky-700 hover:bg-sky-800 transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer text-white text-base font-bold disabled:cursor-not-allowed disabled:opacity-60"
                                    style={JAKARTA}
                                >
                                    <span>
                                        {status === 'submitting' ? 'Sending…' : 'Send inquiry'}
                                    </span>
                                    {status !== 'submitting' && (
                                        <img
                                            src="/image/contact/white-arrow.svg"
                                            alt="Arrow"
                                            width={14}
                                            height={14}
                                        />
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* ─── OTHER ROUTES SECTION ─── */}
            <section className="mx-auto max-w-[1072px] px-[22px] pb-24">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 bg-lime-500 rounded-sm" />
                    <span
                        className="text-sky-700 text-xs font-semibold uppercase tracking-widest"
                        style={MONO}
                    >
                        Other Routes
                    </span>
                </div>
                <h2
                    className="text-slate-800 text-[30px] font-extrabold leading-[48px] mb-6"
                    style={JAKARTA}
                >
                    Corporate, media, partnership &amp; careers.
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {otherRoutes.map((route, idx) => (
                        <Link
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
                                style={MONO}
                            >
                                {route.tag}
                            </span>
                            <h3
                                className="text-slate-800 text-[15px] font-bold leading-6 mt-1.5 mb-6"
                                style={JAKARTA}
                            >
                                {route.title}
                            </h3>
                            <div className="mt-auto inline-flex items-center gap-1.5 text-sky-600 group-hover:text-sky-700 transition-colors">
                                <span
                                    className="text-xs font-bold tracking-tight"
                                    style={JAKARTA}
                                >
                                    {route.link}
                                </span>
                                <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 12 12"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.5 6h7m0 0l-3-3m3 3l-3 3"
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ContactUs;