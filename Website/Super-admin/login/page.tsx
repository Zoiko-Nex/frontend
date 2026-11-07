"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { platformLogin, completePlatformMfa } from "@/lib/admin/platform/auth";
import { ApiException } from "@/lib/admin/client";
import { SUPER_ADMIN_HOST, isSuperAdminHost, superAdminLoginUrl } from "@/lib/admin/platform/host";
import { Check, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldAlert, X } from "lucide-react";

function SuperAdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const [wrongDomain, setWrongDomain] = useState(false);
  useEffect(() => {
    setWrongDomain(!isSuperAdminHost());
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    reason === "session_expired" ? "Your session has expired. Please sign in again." : null
  );
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  // Second-factor challenge step
  const [challenge, setChallenge] = useState<{ token: string; tenantId: string } | null>(null);
  const [mfaCode, setMfaCode] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await platformLogin(email, password);
      if (res.status === "mfa") {
        setChallenge({ token: res.stepUpToken || "", tenantId: res.tenantId || "" });
        setPassword("");
        return;
      }
      router.push("/Super-admin");
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Sign-in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await completePlatformMfa(challenge!.token, mfaCode, challenge!.tenantId, email);
      router.push("/Super-admin");
    } catch (err) {
      if (
        err instanceof ApiException &&
        (err.code === "MFA_CHALLENGE_EXPIRED" || err.code === "MFA_TOO_MANY_ATTEMPTS")
      ) {
        setChallenge(null);
        setMfaCode("");
      }
      setError(err instanceof ApiException ? err.message : "Verification code failed.");
    } finally {
      setLoading(false);
    }
  }

  if (wrongDomain) {
    return (
      <div className="min-h-screen w-full bg-[#040814] text-white flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-md bg-[#071322] border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Wrong Domain</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Internal super-admin sign-in is only permitted on the dedicated host{" "}
            <strong className="text-cyan-400">{SUPER_ADMIN_HOST}</strong>. Tenant administrators must sign in through their assigned tenant domain.
          </p>
          <a
            href={superAdminLoginUrl()}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition"
          >
            Go to {SUPER_ADMIN_HOST}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#040814] relative flex items-center justify-center p-4 sm:p-6 md:p-8 font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Background ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_15%_15%,_rgba(45,212,196,0.08)_0%,_rgba(4,8,20,0)_60%),radial-gradient(ellipse_at_85%_85%,_rgba(14,165,233,0.05)_0%,_rgba(4,8,20,0)_50%)]" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[980px] bg-white rounded-2xl shadow-[0px_40px_100px_-30px_rgba(0,0,0,0.7)] outline outline-1 outline-white/10 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL - Dark Branding & Governance Status */}
        <div className="w-full md:w-[48%] lg:w-[460px] bg-[#071321] relative overflow-hidden flex flex-col justify-between p-8 sm:p-10 md:p-11 bg-[radial-gradient(ellipse_at_20%_0%,_rgba(45,212,196,0.14)_0%,_rgba(7,19,33,0)_70%)] border-b md:border-b-0 md:border-r border-slate-800">
          
          <div className="flex flex-col gap-8 md:gap-9">
            {/* ZoikoNex Brand Logo */}
            <div className="flex items-center">
              <Image
                src="/image/super/zoikonex-brand-logo-hd.png"
                alt="ZoikoNex - Next-Gen Borderless Billing"
                width={170}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </div>

            {/* Tagline & Headline */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[#2DD4BF] text-xs font-bold uppercase tracking-wider">
                ADMIN CONTROL PLANE
              </span>
              <h2 className="text-white text-2xl sm:text-[25px] font-bold leading-8">
                Sign in to govern the platform,<br className="hidden sm:inline" /> not just use it.
              </h2>
              <p className="text-[#94A3B8] text-sm font-normal leading-relaxed max-w-[300px] mt-1">
                Every session is scoped to a role, checked against policy, and written to the evidence ledger.
              </p>
            </div>

            {/* Governance Stepper Timeline */}
            <div className="flex flex-col pt-1">
              {/* Step 1 */}
              <div className="relative flex items-center gap-3 pb-4">
                <div className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-[#10B981] stroke-[3]" />
                </div>
                <div className="absolute left-[9px] top-[20px] w-px h-5 bg-[#1E293B]" />
                <span className="text-[#CBD5E1] text-xs font-semibold">
                  Identity verified
                </span>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center gap-3 pb-4">
                <div className="relative w-5 h-5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF] shadow-[0px_0px_0px_4px_rgba(45,212,196,0.14)] flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                </div>
                <div className="absolute left-[9px] top-[20px] w-px h-5 bg-[#1E293B]" />
                <span className="text-white text-xs font-semibold">
                  {challenge ? "MFA Verification active" : "Policy scope resolving"}
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0E1A29] border border-[#22354A] flex items-center justify-center shrink-0 text-[9px] font-['IBM_Plex_Mono',monospace] text-[#64748B]">
                  3
                </div>
                <span className="text-[#64748B] text-xs font-medium">
                  Session logged to evidence
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Governed Access Sign In Form */}
        <div className="flex-1 bg-white p-8 sm:p-10 md:py-12 md:px-11 flex flex-col justify-center">
          {/* Form Header */}
          <div className="pb-6">
            <span className="text-[#0284C7] text-xs font-bold uppercase tracking-wider block mb-1">
              {challenge ? "TWO-FACTOR AUTHENTICATION" : "GOVERNED ACCESS"}
            </span>
            <h1 className="text-slate-900 text-2xl sm:text-[26px] font-bold">
              {challenge ? "Enter Security Code" : "Sign in"}
            </h1>
            <p className="text-slate-500 text-sm font-normal mt-1">
              {challenge
                ? "Enter the code from your authenticator app or a backup recovery code."
                : "Use your operator-issued admin credentials."}
            </p>
          </div>

          {/* MFA Challenge Screen */}
          {challenge ? (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-xs font-bold">
                  Authentication Code
                </label>
                <input
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="123456"
                  required
                  className="w-full px-3.5 py-3 bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-base font-mono tracking-widest text-center placeholder:text-slate-300 transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !mfaCode.trim()}
                className="w-full py-3 px-5 bg-[#0B1728] hover:bg-[#11233B] active:bg-[#070F1A] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 shadow transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify and sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setChallenge(null);
                  setMfaCode("");
                  setError(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 text-center transition cursor-pointer mt-2"
              >
                Back to credentials sign-in
              </button>
            </form>
          ) : (
            /* Standard Sign-In Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Work Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-xs font-bold">
                  Work email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@operator.com"
                  autoComplete="username"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 sm:py-3 bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm placeholder:text-slate-400 transition"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-800 text-xs font-bold">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm placeholder:text-slate-400 pr-10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Keep me signed in & Forgot password row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#0B1728] border-slate-300 focus:ring-cyan-500 cursor-pointer accent-[#0B1728]"
                  />
                  <span className="text-xs text-slate-600 font-normal">
                    Keep me signed in
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setInfoModal({
                      title: "Password Reset Support",
                      message:
                        "Operator credentials are cryptographically provisioned. Please contact your platform security administrator or devops team to issue a credential reset or rotate your operator key.",
                    })
                  }
                  className="text-xs font-semibold text-[#0284C7] hover:text-[#0369A1] hover:underline focus:outline-none cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Sign In Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 bg-[#0B1728] hover:bg-[#11233B] active:bg-[#070F1A] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 shadow transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Need Access Footer */}
          <div className="pt-6 text-center">
            <p className="text-xs text-slate-500">
              Need access?{" "}
              <button
                type="button"
                onClick={() =>
                  setInfoModal({
                    title: "Platform Access Request",
                    message:
                      "Super-admin accounts are restricted to authorized platform personnel. Contact your Lead Systems Administrator to request platform-level privileges.",
                  })
                }
                className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer focus:outline-none"
              >
                Contact your platform admin
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Info / Support Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{infoModal.title}</h3>
              <button
                onClick={() => setInfoModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed py-4">
              {infoModal.message}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInfoModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#040814] flex items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
        </div>
      }
    >
      <SuperAdminLoginContent />
    </Suspense>
  );
}
