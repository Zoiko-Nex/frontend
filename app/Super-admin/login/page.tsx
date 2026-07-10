"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformLogin } from "@/lib/admin/platform/auth";
import { ApiException } from "@/lib/admin/client";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active state to draw green borders on focus
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await platformLogin(email, password);
      // Wait a tiny bit and redirect to /Super-admin
      router.push("/Super-admin");
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#000000",
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center",
        padding: 24,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <span
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: "#a78bfa",
              boxShadow: "0 0 14px #a78bfa",
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: "#000000" }}>
              ZoikoNex
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              A super admin
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 20, color: "#000000" }}>
          Sign in
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "block" }}>
            <span
              style={{
                display: "block",
                fontSize: 12.5,
                color: "#374151",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)}
              onBlur={() => setFocusEmail(false)}
              autoComplete="username"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: focusEmail ? "1px solid #22c55e" : "1px solid #d1d5db",
                boxShadow: focusEmail ? "0 0 0 1px #22c55e" : "none",
                borderRadius: 6,
                fontSize: 13.5,
                outline: "none",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            />
          </label>

          <label style={{ display: "block" }}>
            <span
              style={{
                display: "block",
                fontSize: 12.5,
                color: "#374151",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusPassword(true)}
              onBlur={() => setFocusPassword(false)}
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: focusPassword ? "1px solid #22c55e" : "1px solid #d1d5db",
                boxShadow: focusPassword ? "0 0 0 1px #22c55e" : "none",
                borderRadius: 6,
                fontSize: 13.5,
                outline: "none",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            />
          </label>

          {error && (
            <div
              style={{
                fontSize: 12.5,
                color: "#ef4444",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 6,
                padding: "9px 12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 4,
              backgroundColor: "#22c55e",
              color: "#000000",
              fontWeight: 600,
              padding: "10px 14px",
              fontSize: 13.5,
              borderRadius: 6,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#16a34a";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#22c55e";
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: "1px solid #e5e7eb",
            fontSize: 11.5,
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          This console is separate from the tenant-scoped Operations Console at{" "}
          <span style={{ color: "#374151", fontFamily: "monospace" }}>/admin</span>.
        </div>
      </div>
    </div>
  );
}
