"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlatformAuth } from "./usePlatformAuth";
import { platformLogout } from "@/lib/admin/platform/auth";
import PlatformLoginScreen from "./PlatformLoginScreen";

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const { session, authenticated } = usePlatformAuth();
  const router = useRouter();

  if (!authenticated) {
    return <PlatformLoginScreen />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          height: 56, borderBottom: "1px solid var(--ax-border)", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 24px", background: "var(--ax-bg)", position: "sticky", top: 0, zIndex: 20,
        }}
      >
        <Link href="/platform-admin" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--ax-violet, #a78bfa)", boxShadow: "0 0 10px var(--ax-violet, #a78bfa)" }} />
          <span style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ax-text)", letterSpacing: "-0.01em" }}>ZoikoNex</span>
          <span style={{ fontSize: 10.5, color: "var(--ax-text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Platform Admin</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12.5, color: "var(--ax-text)" }}>{session?.email || "operator"}</div>
            <div style={{ fontSize: 10.5, color: "var(--ax-text-faint)" }}>{(session?.roles || [])[0] || "—"}</div>
          </div>
          <button
            onClick={() => { platformLogout(); router.replace("/platform-admin"); }}
            style={{ background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border-strong)", borderRadius: 6, color: "var(--ax-text-dim)", padding: "6px 12px", fontSize: 12.5, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1320, width: "100%", marginInline: "auto", animation: "ax-fade .25s ease-out" }}>
        {children}
      </main>
    </div>
  );
}
