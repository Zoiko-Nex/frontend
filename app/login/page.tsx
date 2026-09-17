'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setSession, decodeJwt } from '@/lib/admin/session';
import { resolveTenant, ResolvedTenant } from '@/lib/admin/tenant-resolver';

const DEFAULT_TENANT_ID = '';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [tenantId, setTenantId] = useState(DEFAULT_TENANT_ID);
    const [resolvedTenant, setResolvedTenant] = useState<ResolvedTenant | null>(null);
    const [resolvingDomain, setResolvingDomain] = useState(true);
    const [customDomainInput, setCustomDomainInput] = useState('');
    const [showManualTenantInput, setShowManualTenantInput] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Second-factor step. A non-null token means the password was accepted and
    // the sign-in is waiting on a code; the credential form is replaced rather
    // than shown alongside, so there is only ever one thing to fill in.
    const [stepUpToken, setStepUpToken] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState('');

    useEffect(() => {
        const initDomainResolution = async () => {
            setResolvingDomain(true);
            const tenant = await resolveTenant();
            if (tenant) {
                setResolvedTenant(tenant);
                setTenantId(tenant.tenant_id);
            }
            setResolvingDomain(false);
        };
        initDomainResolution();
    }, []);

    const handleResolveCustomDomain = async () => {
        if (!customDomainInput.trim()) return;
        setLoading(true);
        setError('');
        const tenant = await resolveTenant(customDomainInput);
        if (tenant) {
            setResolvedTenant(tenant);
            setTenantId(tenant.tenant_id);
            setSuccess(`Resolved domain to Tenant: ${tenant.name}`);
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(`No active tenant found for domain: "${customDomainInput}"`);
        }
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!tenantId) {
            setError('Tenant ID is required. Please resolve a valid domain or enter a Tenant ID.');
            setLoading(false);
            return;
        }

        try {
            // Use POST /v1/sessions via proxy or identity API
            const res = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    port: 8080,
                    method: 'POST',
                    path: '/v1/sessions',
                    headers: {
                        'x-tenant-id': tenantId,
                    },
                    body: { email, password },
                }),
            });

            const payload = await res.json();
            const data = payload.data || {};

            // The password was right and a second factor is owed. This is a
            // 401 by design — nothing is authenticated yet — so it has to be
            // handled before the generic failure branch below, which would
            // otherwise show the challenge prompt as a login error and leave
            // the user with no way forward.
            if (payload.status === 401 && (data.code === 'MFA_REQUIRED' || data.error === 'MFA_REQUIRED')) {
                setStepUpToken(data.step_up_token || null);
                setPassword('');
                setLoading(false);
                return;
            }

            if (!res.ok || !payload.ok || !data.access_token) {
                throw new Error(
                    data.message || data.error_description || data.code || 'Authentication failed. Please check your credentials.'
                );
            }

            persistAndRedirect(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    // Both the password-only path and the second-factor path end here, so a
    // session minted after MFA is identical to one minted without it.
    const persistAndRedirect = (data: Record<string, any>) => {
        // Decode the JWT payload to extract user details (display only, not for authz)
        const claims = decodeJwt(data.access_token) as Record<string, any>;

        // Save session using the shared utility
        setSession({
            accessToken: data.access_token,
            refreshToken: data.refresh_token || '',
            expiresAt: Date.now() + (data.expires_in || 900) * 1000,
            tenantId: claims?.tenant_id || tenantId,
            brandId: claims?.brand_id || '',
            email: claims?.email || email,
            userId: claims?.sub || '',
            roles: claims?.roles || [],
        });

        setSuccess('Login successful! Redirecting to Dashboard...');
        setTimeout(() => {
            router.push('/dashboards');
        }, 800);
    };

    const handleVerifyMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    port: 8080,
                    method: 'POST',
                    path: '/v1/sessions/mfa',
                    headers: { 'x-tenant-id': tenantId },
                    body: { step_up_token: stepUpToken, mfa_code: mfaCode.trim() },
                }),
            });

            const payload = await res.json();
            const data = payload.data || {};

            if (!payload.ok || !data.access_token) {
                // An expired or exhausted challenge cannot be retried with
                // another code, so the form goes back to the password step
                // rather than leaving the user typing into a dead prompt.
                if (data.code === 'MFA_CHALLENGE_EXPIRED' || data.code === 'MFA_TOO_MANY_ATTEMPTS') {
                    setStepUpToken(null);
                    setMfaCode('');
                }
                throw new Error(data.message || 'That code was not accepted.');
            }

            if (data.used_recovery_code) {
                setSuccess('Signed in with a recovery code — that code is now used up.');
            }
            persistAndRedirect(data);
        } catch (err: any) {
            setError(err.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#030712] text-white flex items-center justify-center py-20 relative overflow-hidden font-sans">
            {/* Lime radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative w-[983px] min-h-[604px] flex rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10">
                {/* Left Panel */}
                <div className="w-[483px] relative min-h-full">
                    <Image
                        src="/image/login/login.jpg"
                        alt="ZoikoNex Professional Team"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/95 via-cyan-900/50 to-transparent rounded-tl-2xl rounded-bl-2xl" />
                    <div className="absolute left-[32px] bottom-[40px] max-w-[360px]">
                        <h2 className="text-blue-50 text-3xl font-bold leading-9 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Intelligent <br />Infrastructure <br />Starts Here
                        </h2>
                        <p className="text-blue-100/90 text-sm font-normal leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Sign in to manage networks, services, and business operations.
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-[500px] bg-white text-slate-800 px-[30px] py-[37px] flex flex-col justify-center rounded-r-2xl">
                    <div className="w-full max-w-[400px] mx-auto">
                        <h2 className="text-[28px] font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Welcome Back!
                        </h2>

                        {/* Tenant Identification Banner */}
                        {resolvingDomain ? (
                            <div className="mb-6 p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center gap-2">
                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                Resolving tenant domain identity...
                            </div>
                        ) : resolvedTenant ? (
                            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center justify-between">
                                <div>
                                    <span className="font-semibold text-blue-600 uppercase tracking-wide text-[10px] block">Logging in to</span>
                                    <span className="text-sm font-bold text-slate-900">{resolvedTenant.name}</span>
                                    <span className="text-slate-500 block text-[11px] font-mono">{resolvedTenant.domain_suffix}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResolvedTenant(null);
                                        setTenantId('');
                                        setShowManualTenantInput(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-[11px] underline font-medium"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm font-medium mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                Log in to manage your telecom operations seamlessly.
                            </p>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs font-semibold">
                                {success}
                            </div>
                        )}

                        {stepUpToken ? (
                            /* Second factor. The credential form is replaced, not
                               hidden alongside, so the only thing on screen is
                               the one field that can move the sign-in forward. */
                            <form className="space-y-4" onSubmit={handleVerifyMfa}>
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Authentication code <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        value={mfaCode}
                                        onChange={(e) => setMfaCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full h-12 px-4 border border-slate-200 rounded-xl text-slate-800 text-base tracking-[0.3em] font-mono focus:outline-none focus:border-[#1664B1]"
                                        required
                                    />
                                    <p className="mt-2 text-slate-500 text-xs leading-5">
                                        Open your authenticator app and enter the current 6-digit code for this account.
                                        You can also use one of your recovery codes.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !mfaCode.trim()}
                                    className="w-full h-12 bg-[#1664B1] hover:bg-[#125394] transition-colors text-white text-base font-semibold rounded-xl mt-4 cursor-pointer disabled:bg-slate-400 flex items-center justify-center gap-2"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {loading ? 'Verifying...' : 'Verify and sign in'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStepUpToken(null); setMfaCode(''); setError(''); }}
                                    className="w-full text-slate-500 hover:text-slate-700 text-xs font-semibold"
                                >
                                    Use a different account
                                </button>
                            </form>
                        ) : (
                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div>
                                <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Email <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="Enter Your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white rounded-xl border border-slate-300 px-4 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#1664B1] transition-colors"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Password <span className="text-red-500 font-bold">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="**********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 bg-white rounded-xl border border-slate-300 px-4 pr-12 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#1664B1] transition-colors"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                        )}
                                    </button>
                                </div>
                                <div className="flex justify-end mt-1">
                                    <Link href="/password-reset" className="text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Domain Slug Resolver or Manual TenantID Input */}
                            {!resolvedTenant && (
                                <div className="border-t border-slate-200 pt-3">
                                    {!showManualTenantInput ? (
                                        <div>
                                            <label className="flex items-center gap-0.5 mb-1.5 text-slate-500 text-xs font-semibold">
                                                Tenant Domain (e.g. golite.zoikonex.com)
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="golite.zoikonex.com"
                                                    value={customDomainInput}
                                                    onChange={(e) => setCustomDomainInput(e.target.value)}
                                                    className="flex-1 h-10 bg-white rounded-xl border border-slate-300 px-3 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1664B1]"
                                                    disabled={loading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleResolveCustomDomain}
                                                    disabled={loading || !customDomainInput.trim()}
                                                    className="px-3 h-10 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    Resolve
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowManualTenantInput(true)}
                                                    className="text-slate-400 hover:text-slate-600 text-[11px] underline"
                                                >
                                                    Use Manual Tenant UUID
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="flex items-center gap-0.5 mb-1.5 text-slate-500 text-xs font-semibold">
                                                Tenant ID (UUID) <span className="text-red-500 font-bold">*</span>
                                            </label>
                                            <input
                                                id="login-tenant-id"
                                                type="text"
                                                placeholder="Enter Tenant UUID"
                                                value={tenantId}
                                                onChange={(e) => setTenantId(e.target.value)}
                                                className="w-full h-10 bg-white rounded-xl border border-slate-300 px-3 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1664B1]"
                                                required
                                                disabled={loading}
                                            />
                                            <div className="flex justify-between items-center mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowManualTenantInput(false)}
                                                    className="text-slate-400 hover:text-slate-600 text-[11px] underline"
                                                >
                                                    Resolve by Domain Suffix
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                id="login-submit-btn"
                                type="submit"
                                disabled={loading || !tenantId}
                                className="w-full h-12 bg-[#1664B1] hover:bg-[#125394] transition-colors text-white text-base font-semibold rounded-xl mt-4 cursor-pointer disabled:bg-slate-400 flex items-center justify-center gap-2"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                        Authenticating...
                                    </>
                                ) : 'Login'}
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

