'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PasswordResetPage = () => {
    return (
        <div className="w-full bg-[#030712] text-white flex items-center justify-center py-20 relative overflow-hidden font-sans">
            {/* Lime radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_8%,rgba(132,204,22,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative w-[983px] h-[675px] flex rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10">
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

                    {/* Right Panel (Password Reset Form Card) */}
                    <div className="w-[500px] h-full bg-white text-slate-800 px-[30px] py-[37px] flex flex-col justify-between">
                        {/* Tab Headers */}
                        <div>
                            <div className="flex border-b border-stone-200/60 pb-3 gap-6">
                                <Link href="/login" className="text-slate-400 hover:text-slate-600 text-base font-medium transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Login
                                </Link>
                                <Link href="/register" className="text-slate-400 hover:text-slate-600 text-base font-medium transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Register
                                </Link>
                                <Link href="/password-reset" className="text-cyan-700 text-base font-semibold border-b-2 border-cyan-700 pb-3 -mb-[13px] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Password Reset
                                </Link>
                            </div>

                            {/* Card Header Content */}
                            <div className="mt-8 space-y-2">
                                <h3 className="text-slate-700 text-2xl font-extrabold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Forgot your password?
                                </h3>
                                <p className="text-slate-500 text-sm font-normal leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    Enter your work email and we'll send you a secure reset link.
                                </p>
                            </div>

                            {/* Password Reset Fields */}
                            <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-0.5 mb-2 text-slate-500 text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        Enter Email <span className="text-red-500 font-bold">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter Your Email"
                                        className="w-full h-12 bg-white rounded-xl border border-slate-300 px-4 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-cyan-700 transition-colors"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        required
                                    />
                                </div>

                                {/* Actions Block */}
                                <div className="space-y-4 pt-2">
                                    {/* Send reset link button */}
                                    <button
                                        type="submit"
                                        className="w-full h-12 bg-sky-700 hover:bg-sky-800 transition-colors text-white text-base font-bold rounded-xl cursor-pointer"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Send reset link
                                    </button>

                                    {/* Back to sign in button */}
                                    <Link
                                        href="/login"
                                        className="w-full h-12 border border-cyan-700 hover:bg-cyan-50/20 transition rounded-xl flex items-center justify-center text-cyan-700 text-base font-bold cursor-pointer"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </div>

                        {/* Seed footer detail for visual balance */}
                        <div className="text-center text-xs text-slate-400 mt-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Need technical support? <span className="text-cyan-700 hover:underline cursor-pointer">Contact Administration</span>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default PasswordResetPage;
