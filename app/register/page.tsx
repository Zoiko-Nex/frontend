'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ChevronDown, ArrowRight, ArrowLeft } from 'lucide-react';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [registrationDetails, setRegistrationDetails] = useState<{
        partyId: string;
        customerId: string;
        accountNumber: string;
    } | null>(null);

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

    const handleStep3Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Generate a secure client-side PII token (ZN-ADR-013 compliance)
            const piiToken = typeof window !== 'undefined' && window.crypto?.randomUUID 
                ? window.crypto.randomUUID() 
                : "f2220099-0000-4000-8000-00000000" + Math.floor(1000 + Math.random() * 9000);

            // 1. Create Party Profile
            const partyRes = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    port: 8081,
                    method: 'POST',
                    path: '/v1/parties',
                    headers: { 'X-Tenant-ID': '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' },
                    body: {
                        party_type: 'INDIVIDUAL',
                        pii_token: piiToken,
                        data_residency_region: 'us-east-1',
                        jurisdiction_code: formData.country === 'US' ? 'US-CA' : formData.country || 'US-CA'
                    }
                })
            });

            const partyResult = await partyRes.json();
            if (!partyRes.ok || partyResult.status !== 201) {
                throw new Error(partyResult.data?.message || partyResult.error || 'Failed to create Party profile.');
            }

            const partyId = partyResult.data?.party_id;
            if (!partyId) {
                throw new Error('Party creation response did not include a party_id.');
            }

            // 2. Create Customer Profile
            const customerRes = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    port: 8081,
                    method: 'POST',
                    path: '/v1/customers',
                    headers: { 'X-Tenant-ID': '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' },
                    body: {
                        party_id: partyId,
                        customer_type: 'RETAIL',
                        status: 'ACTIVE'
                    }
                })
            });

            const customerResult = await customerRes.json();
            if (!customerRes.ok || customerResult.status !== 201) {
                throw new Error(customerResult.data?.message || customerResult.error || 'Failed to create Customer profile.');
            }

            const customerId = customerResult.data?.id;
            if (!customerId) {
                throw new Error('Customer creation response did not include a customer ID.');
            }

            // 3. Create Billing Account
            const accountNumber = 'ACC-' + Math.floor(100000 + Math.random() * 900000);
            const accountRes = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    port: 8081,
                    method: 'POST',
                    path: '/v1/accounts',
                    headers: { 'X-Tenant-ID': '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' },
                    body: {
                        customer_id: customerId,
                        account_number: accountNumber,
                        account_type: 'RETAIL',
                        currency_code: 'USD',
                        credit_limit_minor_units: 100000,
                        credit_limit_currency_code: 'USD'
                    }
                })
            });

            const accountResult = await accountRes.json();
            if (!accountRes.ok || accountResult.status !== 201) {
                throw new Error(accountResult.data?.message || accountResult.error || 'Failed to create Billing Account.');
            }

            // Save details for UI rendering on Step 4
            setRegistrationDetails({
                partyId,
                customerId,
                accountNumber
            });

            setStep(4);
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration. Please try again.');
        } finally {
            setLoading(false);
        }
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
                <div className="w-[610px] h-full bg-white text-slate-800 px-[25px] py-[32px] flex flex-col justify-between relative shrink-0 rounded-r-[20px]">
                    
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
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold font-sans text-left">
                                        {error}
                                    </div>
                                )}

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
                                        value={formData.scale ? formData.timeline : ''} // simple check
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
                                        disabled={loading}
                                        className="text-slate-600 hover:text-slate-800 text-xs font-normal font-sans py-2 cursor-pointer transition-colors disabled:opacity-50"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-base font-bold flex items-center justify-center gap-1.5 px-[30px] h-11 transition-colors cursor-pointer disabled:bg-slate-400"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {loading ? "Provisioning..." : <>Submit Request <Check size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="flex-1 flex flex-col justify-between mt-[20px]">
                            <div className="flex flex-col items-center text-center">
                                {/* Success Checkmark */}
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-full border border-emerald-500 flex items-center justify-center mb-3">
                                    <Check size={24} className="text-emerald-500 stroke-[2.5]" />
                                </div>
                                <h4 className="text-slate-700 text-lg font-bold font-sans">Organization Provisioned!</h4>
                                <p className="text-slate-500 text-xs mt-1 max-w-[420px] leading-relaxed font-sans">
                                    Your corporate profile, customer account, and billing ledger have been successfully provisioned in the backend database.
                                </p>
                            </div>

                            {/* Provisioned IDs */}
                            {registrationDetails && (
                                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 my-2 w-[553px] space-y-2 text-left">
                                    <div className="text-[10px] font-bold text-slate-500 border-b border-slate-200 pb-1.5 mb-2 font-sans uppercase tracking-wider">
                                        BSS Provisioning Record Details
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-sans">
                                        <span className="text-slate-400">Party Profile ID:</span>
                                        <code className="text-sky-700 font-mono font-semibold bg-sky-50 px-2 py-0.5 rounded">{registrationDetails.partyId}</code>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-sans">
                                        <span className="text-slate-400">Customer Account ID:</span>
                                        <code className="text-emerald-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded">{registrationDetails.customerId}</code>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-sans">
                                        <span className="text-slate-400">Billing Account Number:</span>
                                        <code className="text-purple-700 font-mono font-semibold bg-purple-50 px-2 py-0.5 rounded">{registrationDetails.accountNumber}</code>
                                    </div>
                                </div>
                            )}

                            {/* Timeline steps block */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 my-2 w-[553px]">
                                <div className="flex gap-2.5">
                                    <div className="w-4 h-4 bg-sky-600/10 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 text-[9px] font-bold shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <p className="text-slate-600 text-[11px] leading-normal font-sans text-left">
                                        Use your registered email to log in and access the subscriber dashboard.
                                    </p>
                                </div>
                                <div className="flex gap-2.5">
                                    <div className="w-4 h-4 bg-sky-600/10 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 text-[9px] font-bold shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <p className="text-slate-600 text-[11px] leading-normal font-sans text-left">
                                        Create custom products, commercial offers, and price rules under the Product Catalog module.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div>
                                <div className="w-[561px] h-px bg-slate-500/20 mb-[14px]" />
                                <div className="flex items-center justify-between pt-1 pr-2.5 gap-3">
                                    <Link 
                                        href="/dashboards?tab=payments" 
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Setup Payments &amp; Checkout <ArrowRight size={14} />
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <Link 
                                            href="/dashboards?tab=catalog" 
                                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200"
                                        >
                                            View Product Catalog
                                        </Link>
                                        <Link 
                                            href="/login" 
                                            className="text-sky-600 hover:text-sky-700 text-xs font-bold flex items-center gap-1 transition-colors"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            Sign in <ArrowRight size={14} />
                                        </Link>
                                    </div>
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
