'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setSession, decodeJwt } from '@/lib/admin/session';
import { resolveTenant, ResolvedTenant } from '@/lib/admin/tenant-resolver';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [workspaceInput, setWorkspaceInput] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [resolvedTenant, setResolvedTenant] = useState<ResolvedTenant | null>(null);
    const [resolvingDomain, setResolvingDomain] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // MFA Challenge state
    const [stepUpToken, setStepUpToken] = useState<string | null>(null);
    const [mfaCode, setMfaCode] = useState('');

    useEffect(() => {
        const initDomainResolution = async () => {
            setResolvingDomain(true);
            try {
                // 1. Try hostname or query param
                let tenant = await resolveTenant();

                // 2. If on apex, check localStorage for last remembered workspace
                if (!tenant && typeof window !== 'undefined') {
                    const savedWorkspace = localStorage.getItem('zx_tenant_workspace');
                    if (savedWorkspace) {
                        setWorkspaceInput(savedWorkspace);
                        tenant = await resolveTenant(savedWorkspace);
                    }
                }

                if (tenant) {
                    setResolvedTenant(tenant);
                    setTenantId(tenant.tenant_id);
                    setWorkspaceInput(tenant.domain_suffix);
                }
            } catch {
                // Ignore resolution error on initial load
            } finally {
                setResolvingDomain(false);
            }
        };
        initDomainResolution();
    }, []);

    // Auto-detect workspace from email if user enters something like admin@driverx1.zoikonex.com
    const handleEmailBlur = async () => {
        if (!email.includes('@') || resolvedTenant) return;
        const emailDomain = email.split('@')[1]?.toLowerCase().trim();
        if (emailDomain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'zoikonex.com'].includes(emailDomain)) {
            if (!workspaceInput) {
                setWorkspaceInput(emailDomain);
            }
            try {
                const tenant = await resolveTenant(emailDomain);
                if (tenant) {
                    setResolvedTenant(tenant);
                    setTenantId(tenant.tenant_id);
                }
            } catch {}
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        let currentTenantId = tenantId;

        // If tenantId not yet resolved, try resolving from workspaceInput or email domain
        if (!currentTenantId) {
            const domainToResolve = workspaceInput.trim() || (email.includes('@') ? email.split('@')[1].trim() : '');
            if (!domainToResolve) {
                setError('Please enter your Organization Workspace domain or ID to sign in.');
                setLoading(false);
                return;
            }

            try {
                const tenant = await resolveTenant(domainToResolve);
                if (tenant) {
                    setResolvedTenant(tenant);
                    setTenantId(tenant.tenant_id);
                    currentTenantId = tenant.tenant_id;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('zx_tenant_workspace', tenant.domain_suffix);
                    }
                } else {
                    setError(`No active organization workspace found for "${domainToResolve}". Please check your domain suffix.`);
                    setLoading(false);
                    return;
                }
            } catch (err: any) {
                setError(err.message || 'Failed to verify organization workspace.');
                setLoading(false);
                return;
            }
        }

        try {
            // Send session request via proxy to Identity service (port 8080)
            const res = await fetch('/api/proxy', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    port: 8080,
                    method: 'POST',
                    path: '/v1/sessions',
                    headers: {
                        'x-tenant-id': currentTenantId,
                    },
                    body: { email: email.trim(), password },
                }),
            });

            const payload = await res.json();
            const data = payload.data || {};

            // Handle MFA challenge requirement
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

            // Remember workspace on successful authentication
            if (resolvedTenant?.domain_suffix && typeof window !== 'undefined') {
                localStorage.setItem('zx_tenant_workspace', resolvedTenant.domain_suffix);
            }

            persistAndRedirect(data, currentTenantId);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred during sign in.');
        } finally {
            setLoading(false);
        }
    };

    const persistAndRedirect = (data: Record<string, any>, currentTenantId: string) => {
        const claims = decodeJwt(data.access_token) as Record<string, any>;

        setSession({
            accessToken: data.access_token,
            refreshToken: data.refresh_token || '',
            expiresAt: Date.now() + (data.expires_in || 900) * 1000,
            tenantId: claims?.tenant_id || currentTenantId,
            brandId: claims?.brand_id || '',
            email: claims?.email || email,
            userId: claims?.sub || '',
            roles: claims?.roles || [],
        });

        setSuccess('Authentication successful! Redirecting to Dashboard...');
        setTimeout(() => {
            router.push('/dashboards');
        }, 600);
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
                if (data.code === 'MFA_CHALLENGE_EXPIRED' || data.code === 'MFA_TOO_MANY_ATTEMPTS') {
                    setStepUpToken(null);
                    setMfaCode('');
                }
                throw new Error(data.message || 'That verification code was not accepted.');
            }

            persistAndRedirect(data, tenantId);
        } catch (err: any) {
            setError(err.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#030712] text-white flex items-center justify-center py-20 relative overflow-hidden font-sans min-h-screen">
            {/* Lime radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative w-[983px] min-h-[604px] flex rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10">
                {/* Left Panel */}
                <div className="w-[483px] relative min-h-full hidden md:block">
                    <Image
                        src="/image/login/login.jpg"
                        alt="ZoikoNex Professional Team"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/95 via-cyan-900/60 to-transparent rounded-tl-2xl rounded-bl-2xl" />
                    <div className="absolute left-[32px] bottom-[40px] max-w-[360px]">
                        <h2 className="text-blue-50 text-3xl font-bold leading-9 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Intelligent <br />Infrastructure <br />Starts Here
                        </h2>
                        <p className="text-blue-100/90 text-sm font-normal leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Sign in to manage networks, subscribers, billing, and telecom operations.
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-[500px] bg-white text-slate-800 px-[32px] py-[40px] flex flex-col justify-center rounded-r-2xl">
                    <div className="w-full max-w-[400px] mx-auto">
                        <div className="mb-6">
                            <h2 className="text-[26px] font-bold text-slate-800 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {resolvedTenant ? `Sign In • ${resolvedTenant.name}` : 'Sign In to ZoikoNex'}
                            </h2>
                            <p className="text-slate-500 text-xs mt-1">
                                Enterprise Telecom OSS/BSS Operations Console
                            </p>
                        </div>

                        {/* Resolved Workspace Banner */}
                        {resolvingDomain ? (
                            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs flex items-center gap-2">
                                <svg className="animate-spin text-sky-600" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                Resolving organization workspace...
                            </div>
                        ) : resolvedTenant ? (
                            <div className="mb-5 p-3 bg-sky-50/80 border border-sky-200 rounded-xl text-xs flex items-center justify-between">
                                <div className="min-w-0 pr-2">
                                    <span className="font-bold text-sky-700 uppercase tracking-wider text-[9px] block">Active Workspace</span>
                                    <span className="text-xs font-bold text-slate-900 truncate block">{resolvedTenant.name}</span>
                                    <span className="text-slate-500 block text-[10.5px] font-mono truncate">{resolvedTenant.domain_suffix}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResolvedTenant(null);
                                        setTenantId('');
                                        setWorkspaceInput('');
                                        if (typeof window !== 'undefined') {
                                            localStorage.removeItem('zx_tenant_workspace');
                                        }
                                    }}
                                    className="text-sky-600 hover:text-sky-800 text-[11px] underline font-semibold shrink-0 cursor-pointer"
                                >
                                    Change
                                </button>
                            </div>
                        ) : null}

                        {error && (
                            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold leading-5">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs font-semibold">
                                {success}
                            </div>
                        )}

                        {/* CASE 1: MFA Verification Step */}
                        {stepUpToken ? (
                            <form className="space-y-4" onSubmit={handleVerifyMfa}>
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        Authentication Code <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        value={mfaCode}
                                        onChange={(e) => setMfaCode(e.target.value)}
                                        placeholder="123456"
                                        className="w-full h-12 px-4 border border-slate-300 rounded-xl text-slate-800 text-base tracking-[0.3em] font-mono focus:outline-none focus:border-[#1664B1]"
                                        required
                                    />
                                    <p className="mt-2 text-slate-500 text-xs leading-4">
                                        Enter the 6-digit verification code from your authenticator app.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !mfaCode.trim()}
                                    className="w-full h-11 bg-[#1664B1] hover:bg-[#125394] transition-colors text-white text-sm font-bold rounded-xl mt-2 cursor-pointer disabled:bg-slate-400 flex items-center justify-center gap-2"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {loading ? 'Verifying Code...' : 'Verify and Sign In'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStepUpToken(null); setMfaCode(''); setError(''); }}
                                    className="w-full text-slate-500 hover:text-slate-700 text-xs font-semibold pt-1 cursor-pointer"
                                >
                                    ← Back to Sign In
                                </button>
                            </form>
                        ) : (
                            /* CASE 2: Unified Tenant Sign In */
                            <form className="space-y-3.5" onSubmit={handleLogin}>
                                {/* Workspace Field (Shown when domain is not pre-bound) */}
                                {!resolvedTenant && (
                                    <div>
                                        <label className="flex items-center justify-between mb-1 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                            <span>Organization Workspace <span className="text-red-500 font-bold">*</span></span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. nova-cellular, acme, or domain.zoikonex.com"
                                            value={workspaceInput}
                                            onChange={(e) => setWorkspaceInput(e.target.value)}
                                            className="w-full h-11 bg-white rounded-xl border border-slate-300 px-3.5 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-[#1664B1] transition-colors font-mono"
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Email Field */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-1 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        Work Email <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        placeholder="alex@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={handleEmailBlur}
                                        className="w-full h-11 bg-white rounded-xl border border-slate-300 px-3.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#1664B1] transition-colors"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-slate-600 text-xs font-bold uppercase tracking-wider">
                                            Password <span className="text-red-500 font-bold">*</span>
                                        </label>
                                        <Link href="/password-reset" className="text-sky-600 hover:text-sky-800 text-[11px] font-semibold transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="login-password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-11 bg-white rounded-xl border border-slate-300 px-3.5 pr-10 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-[#1664B1] transition-colors"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    id="login-submit-btn"
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-[#1664B1] hover:bg-[#125394] transition-colors text-white text-sm font-bold rounded-xl mt-3 cursor-pointer disabled:bg-slate-400 flex items-center justify-center gap-2 shadow-sm"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                            Authenticating...
                                        </>
                                    ) : 'Sign In to Workspace'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Need assistance or access?</span>
                            <Link href="/request-a-demo" className="text-sky-600 hover:text-sky-800 font-bold">
                                Request Access →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
