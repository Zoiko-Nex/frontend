'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const LoginPage = () => {
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
                    <div className="w-[500px] h-full bg-white text-slate-800 px-[30px] py-[37px] flex flex-col justify-between">
                        {/* Tab Headers */}
                        <div>
                            <div className="flex border-b border-stone-200/60 pb-3 gap-6">
                                <Link href="/login" className="text-cyan-700 text-base font-semibold border-b-2 border-cyan-700 pb-3 -mb-[13px] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Login
                                </Link>
                                <Link href="/register" className="text-slate-400 hover:text-slate-600 text-base font-medium transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Register
                                </Link>
                                <Link href="/password-reset" className="text-slate-400 hover:text-slate-600 text-base font-medium transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Password Reset
                                </Link>
                            </div>

                            {/* Credentials Fields */}
                            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Email <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter Your Email"
                                        className="w-full h-12 bg-white rounded-xl border border-slate-300 px-4 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-700 transition-colors"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Password <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="**********"
                                            className="w-full h-12 bg-white rounded-xl border border-slate-300 px-4 pr-12 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-700 transition-colors"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            Show
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 bg-sky-700 hover:bg-sky-800 transition-colors text-white text-base font-bold rounded-xl mt-2 cursor-pointer"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    Login
                                </button>
                            </form>
                        </div>

                        {/* Sign Up Link & OAuth Providers */}
                        <div className="space-y-5">
                            <div className="text-center text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                <span className="text-slate-400">Don't have an account? </span>
                                <Link href="/register" className="text-cyan-700 hover:underline">Sign Up</Link>
                            </div>

                            <div className="relative flex items-center justify-center my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-stone-200" />
                                </div>
                                <span className="relative px-3 bg-white text-slate-400 text-xs font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Or continue with
                                </span>
                            </div>

                            <div className="flex gap-4">
                                {/* Google */}
                                <button className="flex-1 h-11 border border-slate-300 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition cursor-pointer text-slate-600 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                    Google
                                </button>

                                {/* Microsoft */}
                                <button className="flex-1 h-11 border border-slate-300 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition cursor-pointer text-slate-600 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                                        <path fill="#f35325" d="M0 0h11v11H0z" />
                                        <path fill="#81bc06" d="M12 0h11v11H12z" />
                                        <path fill="#05a6f0" d="M0 12h11v11H0z" />
                                        <path fill="#ffba08" d="M12 12h11v11H12z" />
                                    </svg>
                                    Microsoft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default LoginPage;
