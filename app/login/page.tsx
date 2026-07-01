'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    port: 8080,
                    method: 'POST',
                    path: '/v1/sessions',
                    headers: {
                        'X-Tenant-ID': '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
                        'X-Brand-ID': 'b1a2b3c4-d5e6-47a8-89c0-d1e2f3a4b5c6'
                    },
                    body: {
                        email: email,
                        password: password,
                        device_fingerprint: 'browser-chrome-windows-12345'
                    }
                })
            });

            const result = await res.json();

            // --- POC Bypass ---
            // Allow any @acme.com test accounts to bypass the live backend rejection
            // This ensures you can still access the dashboard for demonstrations even if the backend is down (502)
            if (email.endsWith('@acme.com') && result.status !== 200) {
                console.warn(`Bypassing live authentication for POC test account: ${email} (Status: ${result.status})`);
                localStorage.setItem('access_token', 'mock_token_for_poc_demonstration');
                setSuccess('Test account accepted. Redirecting to dashboard...');
                setTimeout(() => {
                    router.push('/dashboards');
                }, 1200);
                return;
            }

            if (!res.ok || result.status !== 200) {
                const errMsg = result.data?.message || result.error || 'Authentication failed. Please check your credentials.';
                throw new Error(errMsg);
            }

            const token = result.data?.access_token;
            if (!token) {
                throw new Error('No access token returned from identity server.');
            }

            localStorage.setItem('access_token', token);
            setSuccess('Login successful! Redirecting to dashboard...');
            setTimeout(() => {
                router.push('/dashboards');
            }, 1200);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#030712] text-white flex items-center justify-center py-20 relative overflow-hidden font-sans">
            {/* Lime radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative w-[983px] h-[604px] flex rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10">
                {/* Left Panel (Image & Hero Text Overlay) */}
                    <div className="w-[483px] h-full relative">
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
                                Intelligent <br />
                                Infrastructure <br />
                                Starts Here
                            </h2>
                            <p className="text-blue-100/90 text-sm font-normal leading-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Sign in to manage networks, services, and business operations.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel (Login Form Card) */}
                    <div className="w-[500px] h-full bg-white text-slate-800 px-[30px] py-[37px] flex flex-col justify-center rounded-r-2xl">
                        <div className="w-full max-w-[400px] mx-auto">
                            <h2 className="text-[28px] font-bold text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome Back!</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Log in to manage your telecom operations seamlessly.</p>

                            {/* Status Messages */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-xs font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {success}
                                </div>
                            )}

                            {/* Credentials Fields */}
                            <form className="space-y-5" onSubmit={handleLogin}>
                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Email <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
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

                                {/* Password */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Password <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Link href="/password-reset" className="text-slate-400 hover:text-slate-600 text-sm font-semibold transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-[#1664B1] hover:bg-[#125394] transition-colors text-white text-base font-semibold rounded-xl mt-4 cursor-pointer disabled:bg-slate-400 flex items-center justify-center"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {loading ? "Authenticating..." : "Login"}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <span className="text-slate-400">Don't have an account? </span>
                                <Link href="/register" className="text-[#1664B1] hover:underline">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default LoginPage;
