'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        workEmail: '',
        company: '',
        role: '',
        country: '',
        orgType: '',
        interest: '',
        deployment: '',
        scale: '',
        timeline: '',
        jurisdiction: '',
        goal: ''
    });

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleStep1Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleStep2Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handleStep3Submit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(4);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="w-full bg-[#030712] text-white flex items-center justify-center py-20 relative overflow-hidden font-sans">
            {/* Lime radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)] pointer-events-none" />

            {/* Main Outer Container (overflow-hidden removed to allow dropdowns to pop out downwards) */}
            <div className="relative w-[1073px] h-[641px] flex rounded-[20px] border border-slate-200 bg-white shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28)] shadow-[0px_1px_2px_0px_rgba(11,60,99,0.04)] z-10">
                
                {/* Left Panel */}
                <div className="w-[463px] h-full relative hidden md:block select-none shrink-0 rounded-l-[20px] overflow-hidden">
                    <Image
                        src="/image/login/login.jpg"
                        alt="ZoikoNex Professional Control Room"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient from design */}
                    <div className="absolute inset-0 bg-gradient-to-l from-cyan-700/80 to-transparent" />
                    
                    <div className="absolute left-[32px] bottom-[40px] max-w-[360px] z-10">
                        <h2 className="text-blue-50 text-3xl font-bold leading-9 mb-4 font-sans">
                            Intelligent <br />
                            Infrastructure <br />
                            Starts Here
                        </h2>
                        <p className="text-blue-100/90 text-sm font-normal leading-6 font-sans">
                            Sign up & manage networks, services, and business operations.
                        </p>
                    </div>
                </div>

                {/* Right Panel (Form Card) */}
                <div className="w-[610px] h-full bg-white text-slate-800 px-[25px] py-[32px] flex flex-col justify-between relative shrink-0">
                    
                    {/* Header Block */}
                    <div>
                        <div className="flex items-start justify-between pb-[14px]">
                            <div className="w-[320px]">
                                <h3 className="text-slate-600 text-base font-semibold font-sans">Get Started with ZoikoNex</h3>
                                <p className="text-slate-500 text-xs font-light font-sans mt-0.5 leading-4">
                                    Register your organization to get started. <br />
                                    Account already approved? <Link href="/login" className="text-sky-600 hover:underline">Sign in to continue.</Link>
                                </p>
                            </div>
                            {step <= 3 && (
                                <div className="flex items-center mt-5">
                                    <StepIndicator stepNum={1} label="You" state={step > 1 ? 'completed' : step === 1 ? 'active' : 'pending'} />
                                    <div className="w-9 px-1 flex justify-center">
                                        <div className="w-7 h-px bg-slate-800/40" />
                                    </div>
                                    <StepIndicator stepNum={2} label="Need" state={step > 2 ? 'completed' : step === 2 ? 'active' : 'pending'} />
                                    <div className="w-9 px-1 flex justify-center">
                                        <div className="w-7 h-px bg-slate-800/40" />
                                    </div>
                                    <StepIndicator stepNum={3} label="Scope" state={step > 3 ? 'completed' : step === 3 ? 'active' : 'pending'} />
                                </div>
                            )}
                        </div>

                        {/* Top Line Divider */}
                        <div className="w-[555px] h-px bg-slate-500/40" />
                    </div>

                    {/* Step Forms */}
                    {step === 1 && (
                        <form onSubmit={handleStep1Submit} className="flex-1 flex flex-col justify-between mt-[32px]">
                            <div className="space-y-[22px]">
                                {/* First & Last Name */}
                                <div className="flex gap-[38px]">
                                    <FormInput
                                        label="First Name"
                                        required
                                        placeholder="Enter Your First Name"
                                        value={formData.firstName}
                                        onChange={(val) => handleFieldChange('firstName', val)}
                                        widthClass="w-[256px]"
                                    />
                                    <FormInput
                                        label="Last Name"
                                        required
                                        placeholder="Enter Your Last Name"
                                        value={formData.lastName}
                                        onChange={(val) => handleFieldChange('lastName', val)}
                                        widthClass="w-[256px]"
                                    />
                                </div>

                                {/* Work Email */}
                                <div>
                                    <FormInput
                                        label="Work Email"
                                        type="email"
                                        required
                                        placeholder="alex@companymail.com"
                                        value={formData.workEmail}
                                        onChange={(val) => handleFieldChange('workEmail', val)}
                                        widthClass="w-[553px]"
                                    />
                                    <p className="mt-[5px] text-slate-400 text-xs font-medium font-sans">
                                        Use your work email — personal addresses may delay routing.
                                    </p>
                                </div>

                                {/* Company */}
                                <FormInput
                                    label="Company"
                                    required
                                    placeholder="Enter company name"
                                    value={formData.company}
                                    onChange={(val) => handleFieldChange('company', val)}
                                    widthClass="w-[553px]"
                                />

                                {/* Role & Country */}
                                <div className="flex gap-[38px]">
                                    <FormSelect
                                        label="Your Role"
                                        required
                                        value={formData.role}
                                        onChange={(val) => handleFieldChange('role', val)}
                                        placeholder="Select role"
                                        options={[
                                            { value: 'operator-exec', label: 'Operator CEO / Executive' },
                                            { value: 'network-architect', label: 'Network Architect / Engineer' },
                                            { value: 'product-manager', label: 'Product Manager' },
                                            { value: 'procurement', label: 'Procurement / Finance' },
                                            { value: 'integrator', label: 'System Integrator' },
                                            { value: 'other', label: 'Other Role' }
                                        ]}
                                        widthClass="w-[256px]"
                                    />
                                    <FormSelect
                                        label="Country Region"
                                        required
                                        value={formData.country}
                                        onChange={(val) => handleFieldChange('country', val)}
                                        placeholder="Select Region"
                                        options={[
                                            { value: 'US', label: 'United States' },
                                            { value: 'GB', label: 'United Kingdom' },
                                            { value: 'EU', label: 'European Union' },
                                            { value: 'IN', label: 'India' },
                                            { value: 'SG', label: 'Singapore' },
                                            { value: 'AU', label: 'Australia' },
                                            { value: 'JP', label: 'Japan' },
                                            { value: 'BR', label: 'Brazil' },
                                            { value: 'other', label: 'Other' }
                                        ]}
                                        widthClass="w-[256px]"
                                    />
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div>
                                <div className="w-[561px] h-px bg-slate-500/20 mb-[19px]" />
                                <div className="flex justify-end pr-2.5">
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-base font-bold flex items-center justify-center gap-1.5 px-[30px] h-11 transition-colors cursor-pointer"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleStep2Submit} className="flex-1 flex flex-col justify-between mt-[32px]">
                            <div className="space-y-[22px]">
                                <FormSelect
                                    label="Organization Type"
                                    required
                                    value={formData.orgType}
                                    onChange={(val) => handleFieldChange('orgType', val)}
                                    placeholder="Select type"
                                    options={[
                                        { value: 'mno', label: 'Mobile Network Operator (MNO)' },
                                        { value: 'mvno-mvne', label: 'MVNO / MVNE' },
                                        { value: 'system-integrator', label: 'System Integrator' },
                                        { value: 'telecom-vendor', label: 'Telecom Vendor' },
                                        { value: 'enterprise', label: 'Enterprise' },
                                        { value: 'other', label: 'Other' }
                                    ]}
                                    widthClass="w-[553px]"
                                />

                                <FormSelect
                                    label="Primary Interest"
                                    required
                                    value={formData.interest}
                                    onChange={(val) => handleFieldChange('interest', val)}
                                    placeholder="Select Interest"
                                    options={[
                                        { value: 'launch-mvno', label: 'Launching an MVNO' },
                                        { value: 'core-migration', label: 'Core Network Modernization' },
                                        { value: 'esim-iot', label: 'eSIM & IoT Orchestration' },
                                        { value: 'private-network', label: 'Enterprise Private Network' },
                                        { value: 'api-monetization', label: 'Network API Monetization' },
                                        { value: 'research', label: 'Exploratory / Research' }
                                    ]}
                                    widthClass="w-[553px]"
                                />

                                <FormSelect
                                    label="Deployment Preference"
                                    required
                                    value={formData.deployment}
                                    onChange={(val) => handleFieldChange('deployment', val)}
                                    placeholder="Select Preference"
                                    options={[
                                        { value: 'saas', label: 'Cloud SaaS (Managed)' },
                                        { value: 'private-cloud', label: 'Private Cloud (Hosted)' },
                                        { value: 'on-premise', label: 'On-Premise (Sovereign)' },
                                        { value: 'hybrid', label: 'Hybrid / Distributed' }
                                    ]}
                                    widthClass="w-[553px]"
                                />
                            </div>

                            {/* Bottom Actions */}
                            <div>
                                <div className="w-[561px] h-px bg-slate-500/20 mb-[19px]" />
                                <div className="flex items-center justify-between pr-2.5">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-slate-600 hover:text-slate-800 text-xs font-normal font-sans py-2 cursor-pointer transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-base font-bold flex items-center justify-center gap-1.5 px-[30px] h-11 transition-colors cursor-pointer"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Continue <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleStep3Submit} className="flex-1 flex flex-col justify-between mt-[32px]">
                            <div className="space-y-[22px]">
                                <div className="flex gap-[38px]">
                                    <FormSelect
                                        label="Subscriber/Device Scale"
                                        required
                                        value={formData.scale}
                                        onChange={(val) => handleFieldChange('scale', val)}
                                        placeholder="Select range"
                                        options={[
                                            { value: 'scale-10k', label: '< 10k subscribers' },
                                            { value: 'scale-100k', label: '10k - 100k subscribers' },
                                            { value: 'scale-1m', label: '100k - 1M subscribers' },
                                            { value: 'scale-10m', label: '1M - 10M subscribers' },
                                            { value: 'scale-large', label: '10M+ subscribers' }
                                        ]}
                                        widthClass="w-[256px]"
                                    />
                                    <FormSelect
                                        label="Timeline"
                                        required
                                        value={formData.timeline}
                                        onChange={(val) => handleFieldChange('timeline', val)}
                                        placeholder="Select timeline"
                                        options={[
                                            { value: 'immediate', label: 'Immediate (< 3 months)' },
                                            { value: 'medium-term', label: 'Medium Term (3-6 months)' },
                                            { value: 'long-term', label: 'Long Term (6-12 months)' },
                                            { value: 'exploratory', label: 'Exploratory / Planning' }
                                        ]}
                                        widthClass="w-[256px]"
                                    />
                                </div>

                                <FormSelect
                                    label="Target Jurisdictions"
                                    required
                                    value={formData.jurisdiction}
                                    onChange={(val) => handleFieldChange('jurisdiction', val)}
                                    placeholder="Select range"
                                    options={[
                                        { value: 'us-fcc', label: 'US (FCC Compliant)' },
                                        { value: 'uk-ofcom', label: 'UK (Ofcom Compliant)' },
                                        { value: 'eu-gdpr', label: 'EU (GDPR Compliant)' },
                                        { value: 'in-trai', label: 'India (TRAI Compliant)' },
                                        { value: 'global', label: 'Global / Multi-Region' }
                                    ]}
                                    widthClass="w-[553px]"
                                />

                                <div className="w-[553px]">
                                    <label className="flex items-center gap-0.5 mb-1.5 text-slate-500 text-sm font-normal font-sans">
                                        Evolution Goal <span className="text-slate-400 font-normal ml-1">(Optional - 500 Chars)</span>
                                    </label>
                                    <textarea
                                        placeholder="Briefly describe what you are trying to validate or achieve..."
                                        value={formData.goal}
                                        onChange={(e) => handleFieldChange('goal', e.target.value.slice(0, 500))}
                                        className="w-full h-20 bg-white rounded-lg border border-slate-300 p-3 text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700/20 transition-all resize-none font-sans"
                                    />
                                    <p className="text-[10px] text-right text-slate-400 font-medium font-sans">
                                        {formData.goal.length} / 500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div>
                                <div className="w-[561px] h-px bg-slate-500/20 mb-[19px]" />
                                <div className="flex items-center justify-between pr-2.5">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="text-slate-600 hover:text-slate-800 text-xs font-normal font-sans py-2 cursor-pointer transition-colors"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-base font-bold flex items-center justify-center gap-1.5 px-[30px] h-11 transition-colors cursor-pointer"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Submit Request <Check size={16} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="flex-1 flex flex-col justify-between mt-[32px]">
                            <div className="flex flex-col items-center text-center">
                                {/* Success Checkmark */}
                                <div className="w-14 h-14 bg-emerald-500/10 rounded-full border border-emerald-500 flex items-center justify-center mb-4">
                                    <Check size={26} className="text-emerald-500 stroke-[2.5]" />
                                </div>
                                <h4 className="text-slate-700 text-base font-bold font-sans">Request received</h4>
                                <p className="text-slate-500 text-xs mt-2 max-w-[340px] leading-relaxed font-sans">
                                    Your access request has been submitted. Here is what happens next based on the path you selected:
                                </p>
                            </div>

                            {/* Timeline steps block */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-4 my-5 w-[553px]">
                                <div className="flex gap-3">
                                    <div className="w-5 h-5 bg-sky-600/10 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 text-[10px] font-bold shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <p className="text-slate-600 text-xs leading-normal font-sans text-left">
                                        ZoikoNex reviews your profile and prepares a formula-based quote.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-5 h-5 bg-sky-600/10 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 text-[10px] font-bold shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <p className="text-slate-600 text-xs leading-normal font-sans text-left">
                                        A Pricing Pack is emailed within 48 hours — includes TCO model, indicative ranges, and sample contract structure.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-5 h-5 bg-sky-600/10 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 text-[10px] font-bold shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <p className="text-slate-600 text-xs leading-normal font-sans text-left">
                                        A follow-up is sent 5 business days later to answer questions or schedule a briefing.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div>
                                <div className="w-[561px] h-px bg-slate-500/20 mb-[19px]" />
                                <div className="flex items-center justify-center pt-4 pr-2.5">
                                    <Link 
                                        href="/login" 
                                        className="text-sky-600 hover:text-sky-700 text-xs font-bold flex items-center gap-1 transition-colors"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Already approved? Sign in <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Sub-components for step indicators
const StepIndicator = ({ stepNum, label, state }: { stepNum: number; label: string; state: 'completed' | 'active' | 'pending' }) => {
    if (state === 'completed') {
        return (
            <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-5 h-5 bg-emerald-500/20 rounded-full border border-emerald-500 flex items-center justify-center">
                    <Check size={10} className="text-emerald-500 stroke-[3]" />
                </div>
                <span className="text-emerald-500 text-xs font-semibold font-sans">{label}</span>
            </div>
        );
    }
    if (state === 'active') {
        return (
            <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-5 h-5 bg-blue-600/10 rounded-full border border-cyan-700 flex items-center justify-center">
                    <span className="text-cyan-700 text-xs font-semibold font-sans">{stepNum}</span>
                </div>
                <span className="text-cyan-700 text-xs font-semibold font-sans">{label}</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-5 h-5 bg-transparent rounded-full border border-slate-600 flex items-center justify-center">
                <span className="text-slate-600 text-xs font-semibold font-sans">{stepNum}</span>
            </div>
            <span className="text-slate-600 text-xs font-semibold font-sans">{label}</span>
        </div>
    );
};

// Reusable Custom Form Input Component
const FormInput = ({
    label,
    required = false,
    type = "text",
    placeholder,
    value,
    onChange,
    helperText,
    widthClass = "w-full"
}: {
    label: string;
    required?: boolean;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    helperText?: string;
    widthClass?: string;
}) => {
    return (
        <div className={widthClass}>
            <label className="flex items-center gap-1 mb-1.5 text-slate-500 text-sm font-normal font-sans">
                {label} {required && <span className="text-red-500 text-xs font-bold font-sans">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-11 bg-white rounded-lg border border-slate-300 px-4 text-slate-600 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-700 transition-colors font-sans"
                required={required}
            />
            {helperText && (
                <p className="mt-1.5 text-xs text-slate-400 font-medium font-sans">
                    {helperText}
                </p>
            )}
        </div>
    );
};

// Reusable Custom Form Select Component (Custom Dropdown Menu forced downward)
const FormSelect = ({
    label,
    required = false,
    value,
    onChange,
    placeholder,
    options,
    widthClass = "w-full"
}: {
    label: string;
    required?: boolean;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    options: { value: string; label: string }[];
    widthClass?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`${widthClass} relative`} ref={containerRef}>
            <label className="flex items-center gap-1 mb-1.5 text-slate-500 text-sm font-normal font-sans">
                {label} {required && <span className="text-red-500 text-xs font-bold font-sans">*</span>}
            </label>
            <div className="relative">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full h-11 bg-white rounded-lg border border-slate-300 pl-4 pr-12 text-slate-600 placeholder-slate-400 text-sm text-left focus:outline-none focus:border-cyan-700 transition-colors font-sans flex items-center justify-between cursor-pointer"
                >
                    <span className={selectedOption ? "text-slate-700" : "text-slate-400"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </button>
                {/* Custom dropdown indicator mimicking the bg-zinc-300 box in Figma design */}
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute right-2 top-2.5 h-6 w-6 bg-zinc-200 border border-slate-300 rounded flex items-center justify-center cursor-pointer pointer-events-auto text-slate-700"
                >
                    <ChevronDown size={14} className={`stroke-[2.5] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Options List - forced to display downward */}
                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-slate-300 rounded-lg shadow-lg mt-1 z-[100] max-h-48 overflow-y-auto">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-600 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Hidden select for browser-native HTML5 form validation */}
            <select
                value={value}
                onChange={() => {}}
                className="sr-only"
                required={required}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
};

export default RegisterPage;
