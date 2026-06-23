"use client";

import { useState } from "react";
import { login, completeMfa } from "@/lib/admin/auth";
import { ApiException } from "@/lib/admin/client";
import { Button, Input, Field } from "./ui";

const DEFAULT_TENANT = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d";
const DEFAULT_BRAND = process.env.NEXT_PUBLIC_DEFAULT_BRAND_ID || "";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin@acme.com");
  const [password, setPassword] = useState("SecurePassword123");
  const [tenantId, setTenantId] = useState(DEFAULT_TENANT);
  const [mfaCode, setMfaCode] = useState("");
  const [stepUpToken, setStepUpToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password, tenantId, DEFAULT_BRAND || undefined);
      if (res.status === "mfa") {
        setStepUpToken(res.stepUpToken || null);
      }
      // on "ok", session is set → useAuth re-renders the shell automatically
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function submitMfa(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await completeMfa(stepUpToken!, mfaCode, tenantId, DEFAULT_BRAND || undefined);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span style={{ width: 11, height: 11, borderRadius: 2, background: "var(--ax-accent)", boxShadow: "0 0 14px var(--ax-accent)" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>ZoikoNex</div>
            <div style={{ fontSize: 11, color: "var(--ax-text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Operations Console</div>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 6 }}>
          {stepUpToken ? "Verify it's you" : "Sign in to operate"}
        </h1>
        <p style={{ color: "var(--ax-text-dim)", fontSize: 13.5, marginBottom: 26 }}>
          {stepUpToken
            ? "Enter the verification code to continue."
            : "Authenticate against identity-tenancy to manage the platform."}
        </p>

        {!stepUpToken ? (
          <form onSubmit={submitCredentials} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </Field>
            <Field label="Tenant ID" hint="UUID of the tenant you operate. Pre-filled with the seeded Acme Telecom tenant.">
              <Input className="mono" value={tenantId} onChange={(e) => setTenantId(e.target.value)} required />
            </Field>
            {error && <ErrorLine text={error} />}
            <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: 4 }}>
              Sign in
            </Button>
          </form>
        ) : (
          <form onSubmit={submitMfa} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Verification code" hint="Dev stub accepts 123456 or 564890.">
              <Input className="mono" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} inputMode="numeric" placeholder="••••••" autoFocus required style={{ letterSpacing: "0.3em", fontSize: 16 }} />
            </Field>
            {error && <ErrorLine text={error} />}
            <Button type="submit" variant="primary" loading={loading} style={{ width: "100%" }}>Verify</Button>
            <Button type="button" variant="ghost" onClick={() => { setStepUpToken(null); setMfaCode(""); setError(null); }}>
              Back to sign in
            </Button>
          </form>
        )}

        <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--ax-border)", fontSize: 11.5, color: "var(--ax-text-faint)", lineHeight: 1.6 }}>
          Seeded operator: <span className="mono" style={{ color: "var(--ax-text-dim)" }}>admin@acme.com</span> / <span className="mono" style={{ color: "var(--ax-text-dim)" }}>SecurePassword123</span>
        </div>
      </div>
    </div>
  );
}

function ErrorLine({ text }: { text: string }) {
  return (
    <div style={{ fontSize: 12.5, color: "var(--ax-red)", background: "var(--ax-red-dim)", border: "1px solid color-mix(in srgb, var(--ax-red) 30%, transparent)", borderRadius: 6, padding: "9px 12px" }}>
      {text}
    </div>
  );
}
