"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { NAV } from "./nav";
import { useAuth } from "./useAuth";
import { logout } from "@/lib/admin/auth";
import { fetchMe, canAccessDomain } from "@/lib/admin/permissions";
import LoginScreen from "./LoginScreen";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { session, authenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  const me = useQuery({
    queryKey: ["identity", "me"],
    queryFn: fetchMe,
    enabled: authenticated,
    staleTime: 60_000,
  });

  if (!authenticated) {
    return <LoginScreen />;
  }

  // Nav items the caller's role/policies don't grant are hidden entirely —
  // groups that end up empty are dropped too, so a narrowly-scoped sub-user
  // never sees an empty section header.
  const visibleNav = NAV
    .map((group) => ({ ...group, items: group.items.filter((item) => canAccessDomain(item.domain, me.data)) }))
    .filter((group) => group.items.length > 0);

  const currentItem = NAV.flatMap((g) => g.items).find(
    (item) => pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href)),
  );
  const denied = !me.isLoading && currentItem && !canAccessDomain(currentItem.domain, me.data);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 248, flexShrink: 0, borderRight: "1px solid var(--ax-border)",
          background: "var(--ax-bg-raised)", position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column",
        }}
        data-open={navOpen}
        className="ax-sidebar"
      >
        <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid var(--ax-border)" }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--ax-accent)", boxShadow: "0 0 10px var(--ax-accent)" }} />
            <span style={{ fontWeight: 700, fontSize: 14.5, color: "var(--ax-text)", letterSpacing: "-0.01em" }}>ZoikoNex</span>
            <span style={{ fontSize: 10.5, color: "var(--ax-text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Ops</span>
          </Link>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px 24px" }}>
          {visibleNav.map((group) => (
            <div key={group.group} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--ax-text-faint)", padding: "4px 10px 7px", fontWeight: 600 }}>
                {group.group}
              </div>
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.live ? item.href : "#"}
                    onClick={(e) => { if (!item.live) e.preventDefault(); else setNavOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "7px 10px", borderRadius: 6, fontSize: 13, textDecoration: "none", marginBottom: 1,
                      color: active ? "var(--ax-text)" : item.live ? "var(--ax-text-dim)" : "var(--ax-text-faint)",
                      background: active ? "var(--ax-bg-hover)" : "transparent",
                      cursor: item.live ? "pointer" : "not-allowed",
                      borderLeft: active ? "2px solid var(--ax-accent)" : "2px solid transparent",
                    }}
                  >
                    <span>{item.label}</span>
                    {!item.live && <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-faint)", border: "1px solid var(--ax-border)", borderRadius: 4, padding: "1px 5px" }}>soon</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header
          style={{
            height: 56, borderBottom: "1px solid var(--ax-border)", display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 24px", background: "var(--ax-bg)", position: "sticky", top: 0, zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="ax-nav-toggle" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation"
              style={{ display: "none", background: "transparent", border: "1px solid var(--ax-border-strong)", borderRadius: 6, color: "var(--ax-text)", padding: "5px 9px", cursor: "pointer" }}>≡</button>
            <span style={{ fontSize: 12.5, color: "var(--ax-text-dim)" }}>Tenant</span>
            <span className="mono" style={{ fontSize: 12.5, color: "var(--ax-text)" }}>{(session?.tenantId || "").slice(0, 8)}…</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12.5, color: "var(--ax-text)" }}>{session?.email || "operator"}</div>
              <div style={{ fontSize: 10.5, color: "var(--ax-text-faint)" }}>{(session?.roles || [])[0] || "—"}</div>
            </div>
            <button
              onClick={() => { logout(); router.replace("/admin"); }}
              style={{ background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border-strong)", borderRadius: 6, color: "var(--ax-text-dim)", padding: "6px 12px", fontSize: 12.5, cursor: "pointer" }}
            >
              Sign out
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px 32px", maxWidth: 1320, width: "100%", animation: "ax-fade .25s ease-out" }}>
          {denied ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--ax-text-dim)" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ax-text)" }}>Access denied</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>
                Your role doesn&apos;t grant access to {currentItem?.label}. Ask a tenant admin to assign the relevant permission.
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
