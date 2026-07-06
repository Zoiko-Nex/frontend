"use client";

import { useState } from "react";
import { platformLogin } from "@/lib/admin/platform/auth";
import { ApiException } from "@/lib/admin/client";
import { Button, Input, Field } from "../../admin/_components/ui";

export default function PlatformLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await platformLogin(email, password);
      // session set → usePlatformAuth re-renders the shell automatically
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span style={{ width: 11, height: 11, borderRadius: 2, background: "var(--ax-violet, #a78bfa)", boxShadow: "0 0 14px var(--ax-violet, #a78bfa)" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>ZoikoNex</div>
            <div style={{ fontSize: 11, color: "var(--ax-text-faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Platform Super-Admin</div>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 6 }}>Sign in as platform operator</h1>
        <p style={{ color: "var(--ax-text-dim)", fontSize: 13.5, marginBottom: 26 }}>
          Cross-tenant control room. Requires the bootstrap super-admin account (env-seeded on identity-tenancy).
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required autoFocus />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          </Field>
          {error && (
            <div style={{ fontSize: 12.5, color: "var(--ax-red)", background: "var(--ax-red-dim)", border: "1px solid color-mix(in srgb, var(--ax-red) 30%, transparent)", borderRadius: 6, padding: "9px 12px" }}>
              {error}
            </div>
          )}
          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: 4 }}>
            Sign in
          </Button>
        </form>

        <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--ax-border)", fontSize: 11.5, color: "var(--ax-text-faint)", lineHeight: 1.6 }}>
          This console is separate from the tenant-scoped Operations Console at <span className="mono" style={{ color: "var(--ax-text-dim)" }}>/admin</span>.
        </div>
      </div>
    </div>
  );
}
