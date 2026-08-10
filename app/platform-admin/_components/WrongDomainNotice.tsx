"use client";

import { SUPER_ADMIN_HOST, superAdminLoginUrl } from "@/lib/admin/platform/host";

/**
 * Shown instead of the super-admin sign-in form when the console is reached
 * from a host other than SUPER_ADMIN_HOST. In production middleware.ts
 * redirects before this can render; this is the fallback for a cached bundle,
 * a custom hosts entry, or a preview deployment.
 */
export default function WrongDomainNotice() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ax-text-faint)", marginBottom: 10 }}>
          Platform Super-Admin
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 10 }}>
          Wrong domain
        </h1>
        <p style={{ color: "var(--ax-text-dim)", fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
          Internal super-admin sign-in is only available at{" "}
          <strong style={{ color: "var(--ax-text)" }}>{SUPER_ADMIN_HOST}</strong>. Tenant
          administrators should sign in on their own tenant domain instead.
        </p>
        <a
          href={superAdminLoginUrl()}
          style={{
            display: "inline-block", padding: "9px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
            textDecoration: "none", color: "var(--ax-text)", background: "var(--ax-bg-overlay)",
            border: "1px solid var(--ax-border-strong)",
          }}
        >
          Go to {SUPER_ADMIN_HOST}
        </a>
      </div>
    </div>
  );
}
