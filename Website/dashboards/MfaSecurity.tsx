"use client";

/**
 * Two-factor authentication for a tenant: the user's own authenticator
 * enrolment, and — for an admin — the tenant-wide requirement.
 *
 * This replaces a hardcoded toggle that rendered as "on" and was wired to
 * nothing. Every control here reads and writes identity-tenancy:
 *
 *   GET    /v1/me/mfa                    own status
 *   POST   /v1/me/mfa/enrol              secret + otpauth URI for the QR code
 *   POST   /v1/me/mfa/activate           prove the code, receive recovery codes
 *   POST   /v1/me/mfa/recovery-codes     replace the unused set
 *   POST   /v1/me/mfa/disable            turn it off (password required)
 *   GET(PUT) /v1/tenant-security/mfa     tenant-wide requirement
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";

type MfaStatus = {
  enabled: boolean;
  enrolled_at?: string;
  pending_enrolment: boolean;
  recovery_codes_remaining: number;
  required_by_tenant: boolean;
};

type Enrolment = {
  secret: string;
  provisioning_uri: string;
  issuer: string;
  account: string;
};

type TenantPolicy = {
  require_mfa: boolean;
  users_total: number;
  users_enrolled: number;
};

/** Renders the otpauth:// URI as a scannable QR code on a canvas. */
function QrCanvas({ value }: { value: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    QRCode.toCanvas(ref.current, value, { width: 188, margin: 1 }).catch(() => setFailed(true));
  }, [value]);

  if (failed) {
    return (
      <p className="text-slate-500 text-xs leading-5">
        The QR code could not be drawn. Use the setup key below to add the account by hand.
      </p>
    );
  }
  return <canvas ref={ref} className="rounded-lg border border-slate-200" />;
}

/**
 * Recovery codes are shown once, at the moment they are generated — the server
 * keeps only hashes, so this panel is the single opportunity to save them.
 */
function RecoveryCodes({ codes, onDone }: { codes: string[]; onDone: () => void }) {
  const copy = () => {
    navigator.clipboard.writeText(codes.join("\n")).then(
      () => toast.success("Recovery codes copied"),
      () => toast.error("Could not copy to the clipboard"),
    );
  };

  const download = () => {
    const blob = new Blob([`ZoikoNex recovery codes\n\n${codes.join("\n")}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zoikonex-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <p className="text-amber-900 text-xs font-bold leading-5">Save your recovery codes now</p>
      <p className="text-amber-800 text-xs leading-5 mt-1">
        Each code signs you in once if you lose your phone. They are not stored in a form anyone can read
        back to you, so this is the only time they will be shown.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs text-slate-800">
        {codes.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={copy} className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900">
          Copy
        </button>
        <button onClick={download} className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-900">
          Download
        </button>
        <button onClick={onDone} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold">
          I have saved them
        </button>
      </div>
    </div>
  );
}

export default function MfaSecurity({ canManageTenantPolicy = false }: { canManageTenantPolicy?: boolean }) {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [policy, setPolicy] = useState<TenantPolicy | null>(null);
  const [loading, setLoading] = useState(true);

  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [disarmPassword, setDisarmPassword] = useState("");
  const [showDisable, setShowDisable] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await api.get<MfaStatus>("identity", "/v1/me/mfa");
      setStatus(s);
    } catch (e) {
      toast.error(errMessage(e, "Could not read your two-factor status"));
    }
    if (canManageTenantPolicy) {
      try {
        const p = await api.get<TenantPolicy>("identity", "/v1/tenant-security/mfa");
        setPolicy(p);
      } catch {
        // A user without the policy scope simply does not see the tenant card;
        // that is not an error worth interrupting them for.
        setPolicy(null);
      }
    }
    setLoading(false);
  }, [canManageTenantPolicy]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const begin = async () => {
    setBusy(true);
    try {
      const e = await api.post<Enrolment>("identity", "/v1/me/mfa/enrol");
      setEnrolment(e);
      setCode("");
    } catch (e) {
      toast.error(errMessage(e, "Could not start enrolment"));
    } finally {
      setBusy(false);
    }
  };

  const activate = async () => {
    setBusy(true);
    try {
      const res = await api.post<{ recovery_codes: string[] }>("identity", "/v1/me/mfa/activate", { code: code.trim() });
      setRecoveryCodes(res.recovery_codes);
      setEnrolment(null);
      setCode("");
      toast.success("Two-factor authentication is on");
      await refresh();
    } catch (e) {
      toast.error(errMessage(e, "That code was not accepted"));
    } finally {
      setBusy(false);
    }
  };

  const regenerate = async () => {
    setBusy(true);
    try {
      const res = await api.post<{ recovery_codes: string[] }>("identity", "/v1/me/mfa/recovery-codes", { code: code.trim() });
      setRecoveryCodes(res.recovery_codes);
      setCode("");
      await refresh();
    } catch (e) {
      toast.error(errMessage(e, "Could not replace your recovery codes"));
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      await api.post("identity", "/v1/me/mfa/disable", { password: disarmPassword });
      toast.success("Two-factor authentication is off");
      setShowDisable(false);
      setDisarmPassword("");
      await refresh();
    } catch (e) {
      toast.error(errMessage(e, "Could not turn off two-factor authentication"));
    } finally {
      setBusy(false);
    }
  };

  const setTenantPolicy = async (required: boolean) => {
    setBusy(true);
    try {
      await api.put("identity", "/v1/tenant-security/mfa", { require_mfa: required });
      toast.success(required ? "Two-factor authentication is now required for this tenant" : "Requirement lifted");
      await refresh();
    } catch (e) {
      toast.error(errMessage(e, "Could not save the policy"));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-slate-500 text-xs">Loading security settings…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Own second factor ─────────────────────────────────────────── */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="pb-2.5 flex items-center justify-between">
          <h3 className="text-slate-800 text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Two-factor authentication
          </h3>
          <span
            className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wide ${
              status?.enabled ? "bg-lime-100 text-lime-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {status?.enabled ? "On" : "Off"}
          </span>
        </div>

        {!status?.enabled && !enrolment && (
          <>
            <p className="text-slate-500 text-xs leading-5">
              Protect this account with a code from an authenticator app — Google Authenticator, 1Password, Authy or
              any other. After a password, sign-in will ask for the current 6-digit code.
            </p>
            {status?.required_by_tenant && (
              <p className="mt-2 text-amber-700 text-xs font-semibold leading-5">
                Your administrator requires two-factor authentication for this tenant.
              </p>
            )}
            <button
              onClick={begin}
              disabled={busy}
              className="mt-4 self-start px-4 py-2 bg-[#1664B1] text-white rounded-xl text-xs font-semibold disabled:bg-slate-400"
            >
              {busy ? "Working…" : "Set up authenticator"}
            </button>
          </>
        )}

        {enrolment && (
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 text-xs leading-5">
              Scan this with your authenticator app, then enter the 6-digit code it shows to finish.
            </p>
            <div className="flex flex-wrap gap-5 items-start">
              <QrCanvas value={enrolment.provisioning_uri} />
              <div className="flex-1 min-w-[200px]">
                <p className="text-slate-600 text-xs font-semibold">Can't scan it?</p>
                <p className="text-slate-500 text-xs leading-5 mt-1">
                  Add the account by hand with this setup key:
                </p>
                <code className="mt-2 block break-all bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-800">
                  {enrolment.secret}
                </code>
                <p className="text-slate-400 text-[11px] mt-1">
                  {enrolment.issuer} · {enrolment.account}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                className="h-10 px-3 w-36 border border-slate-200 rounded-xl font-mono tracking-[0.2em] text-sm focus:outline-none focus:border-[#1664B1]"
              />
              <button
                onClick={activate}
                disabled={busy || code.trim().length < 6}
                className="px-4 py-2 bg-[#1664B1] text-white rounded-xl text-xs font-semibold disabled:bg-slate-400"
              >
                {busy ? "Verifying…" : "Verify and turn on"}
              </button>
              <button
                onClick={() => { setEnrolment(null); setCode(""); }}
                className="px-3 py-2 text-slate-500 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {status?.enabled && !recoveryCodes && (
          <>
            <div className="py-3 border-b border-slate-200 flex justify-between items-center">
              <span className="text-slate-600 text-xs">Enrolled</span>
              <span className="text-slate-800 text-xs font-semibold">
                {status.enrolled_at ? new Date(status.enrolled_at).toLocaleDateString() : "—"}
              </span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="text-slate-600 text-xs">Recovery codes left</span>
              <span
                className={`text-xs font-semibold ${status.recovery_codes_remaining <= 2 ? "text-amber-700" : "text-slate-800"}`}
              >
                {status.recovery_codes_remaining}
              </span>
            </div>

            {status.recovery_codes_remaining <= 2 && (
              <p className="text-amber-700 text-xs leading-5 mb-2">
                You are nearly out of recovery codes. Generate a new set while you still have access.
              </p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                placeholder="Current code"
                className="h-9 px-3 w-36 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#1664B1]"
              />
              <button
                onClick={regenerate}
                disabled={busy || code.trim().length < 6}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold disabled:text-slate-400"
              >
                New recovery codes
              </button>
              {!status.required_by_tenant && (
                <button
                  onClick={() => setShowDisable((v) => !v)}
                  className="px-3 py-2 text-red-600 text-xs font-semibold"
                >
                  Turn off
                </button>
              )}
            </div>

            {status.required_by_tenant && (
              <p className="mt-2 text-slate-500 text-xs leading-5">
                Your administrator requires two-factor authentication, so it cannot be turned off here.
              </p>
            )}

            {showDisable && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-2">
                <p className="text-red-800 text-xs leading-5">
                  Confirm with your password. Turning this off also destroys your recovery codes.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={disarmPassword}
                    onChange={(e) => setDisarmPassword(e.target.value)}
                    placeholder="Your password"
                    className="h-9 px-3 flex-1 border border-red-200 rounded-xl text-xs focus:outline-none focus:border-red-400"
                  />
                  <button
                    onClick={disable}
                    disabled={busy || !disarmPassword}
                    className="px-3 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold disabled:bg-slate-400"
                  >
                    Turn off
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {recoveryCodes && <RecoveryCodes codes={recoveryCodes} onDone={() => setRecoveryCodes(null)} />}
      </div>

      {/* ─── Tenant-wide requirement ───────────────────────────────────── */}
      {canManageTenantPolicy && policy && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="pb-2.5">
            <h3 className="text-slate-800 text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              MFA enforcement
            </h3>
          </div>
          <div className="py-3 flex justify-between items-center">
            <div className="flex flex-col pr-4">
              <span className="text-slate-800 text-xs font-bold leading-5">Require it for everyone in this tenant</span>
              <span className="text-slate-500 text-xs leading-4">
                {policy.users_enrolled} of {policy.users_total} users have set up an authenticator
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={policy.require_mfa}
              disabled={busy}
              onClick={() => setTenantPolicy(!policy.require_mfa)}
              className={`w-10 h-6 rounded-full p-[3px] flex items-center transition-colors ${
                policy.require_mfa ? "bg-lime-600 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <span className="size-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          {!policy.require_mfa && policy.users_enrolled < policy.users_total && (
            <p className="text-slate-500 text-xs leading-5">
              Turning this on stops users who have not enrolled from signing in until they do. Check the count above
              first.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
