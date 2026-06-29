"use client";

import Link from "next/link";
import { Shield, Users, Smartphone, BookOpen, Layers, CheckCircle } from "lucide-react";

export default function DashboardsHub() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top left, #0e121a, #07090d)",
      color: "#e2e8f0",
      fontFamily: "Outfit, Inter, sans-serif",
      padding: "60px 20px 80px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Glow Effect Backdrops */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "350px",
        height: "350px",
        borderRadius: "50%",
        background: "rgba(99, 102, 241, 0.08)",
        filter: "blur(80px)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "rgba(16, 185, 129, 0.05)",
        filter: "blur(90px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "60px", maxWidth: "800px", zIndex: 10 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "99px",
          padding: "6px 14px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#818cf8",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "18px"
        }}>
          <Layers size={14} /> ZoikoNex Tier-1 OSS/BSS Console Suite
        </div>
        <h1 style={{
          fontSize: "44px",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #ffffff 40%, #94a3b8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "16px",
          lineHeight: "1.15"
        }}>
          Select Operational Console
        </h1>
        <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: "1.6" }}>
          Launch one of the three governed environment views aligned with TM Forum, GSMA, and 3GPP standards.
        </p>
      </header>

      {/* Grid of 3 Consoles */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "30px",
        width: "100%",
        maxWidth: "1160px",
        zIndex: 10,
        marginBottom: "70px"
      }}>
        {/* Super Admin Console */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle("#0284c7", "rgba(14, 165, 233, 0.15)")}>
            <Shield size={22} color="#38bdf8" />
          </div>
          <h2 style={cardTitleStyle}>Super Admin Console</h2>
          <span style={badgeStyle("#0ea5e9", "rgba(14, 165, 233, 0.12)")}>Platform Operations</span>
          
          <p style={cardDescStyle}>
            Jurisdiction-agnostic command plane for governing tenants, platform-wide rules, catalogs, global billing, integration bridges, and platform health.
          </p>

          <div style={specsListStyle}>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#38bdf8" />
              <span>Scope: Multi-Tenant Platform Control</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#38bdf8" />
              <span>Standard: TM Forum-aligned API layers</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#38bdf8" />
              <span>Key Surface: Global Control Room</span>
            </div>
          </div>

          <Link href="/dashboards/super-admin" style={buttonStyle("linear-gradient(135deg, #0ea5e9, #0284c7)")}>
            Launch Console
          </Link>
        </div>

        {/* Tenant Admin Console */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle("#d97706", "rgba(245, 158, 11, 0.15)")}>
            <Users size={22} color="#fbbf24" />
          </div>
          <h2 style={cardTitleStyle}>Tenant Admin Console</h2>
          <span style={badgeStyle("#f59e0b", "rgba(245, 158, 11, 0.12)")}>Brand Operations</span>
          
          <p style={cardDescStyle}>
            The operator operating cockpit for telecom brands. Manage customers, products, billing run schedules, mediation rules, and compliance readiness parameters.
          </p>

          <div style={specsListStyle}>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#fbbf24" />
              <span>Scope: Brand, Market & Environment</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#fbbf24" />
              <span>Standard: Persistent Action Queue</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#fbbf24" />
              <span>Key Surface: Exception Command Panels</span>
            </div>
          </div>

          <Link href="/dashboards/tenant-admin" style={buttonStyle("linear-gradient(135deg, #f59e0b, #d97706)")}>
            Launch Console
          </Link>
        </div>

        {/* Customer Self-Service Portal */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle("#059669", "rgba(16, 185, 129, 0.15)")}>
            <Smartphone size={22} color="#34d399" />
          </div>
          <h2 style={cardTitleStyle}>Customer Portal</h2>
          <span style={badgeStyle("#10b981", "rgba(16, 185, 129, 0.12)")}>White-Label Portal</span>
          
          <p style={cardDescStyle}>
            Customer self-service interface supporting balance top-ups, usage reports, eSIM provisioning, bill dispute cases, and dynamic white-label brand switches.
          </p>

          <div style={specsListStyle}>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#34d399" />
              <span>Scope: Subscriber Accounts</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#34d399" />
              <span>Standard: White-label tokens</span>
            </div>
            <div style={specItemStyle}>
              <CheckCircle size={13} color="#34d399" />
              <span>Key Surface: Action Centre decision rail</span>
            </div>
          </div>

          <Link href="/dashboards/customer-portal" style={buttonStyle("linear-gradient(135deg, #10b981, #059669)")}>
            Launch Console
          </Link>
        </div>
      </div>

      {/* Comparison Specifications Matrix */}
      <div style={{
        width: "100%",
        maxWidth: "960px",
        background: "rgba(30, 41, 59, 0.3)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        borderRadius: "16px",
        padding: "30px 40px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <BookOpen size={18} color="#818cf8" />
          <h3 style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.01em" }}>Comparison Specification Matrix</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                <th style={thStyle}>Dimension</th>
                <th style={thStyle}>Super Admin</th>
                <th style={thStyle}>Tenant Admin</th>
                <th style={thStyle}>Customer Portal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={trStyle}>
                <td style={tdLabelStyle}>Primary User</td>
                <td style={tdStyle}>Platform Operations Admin</td>
                <td style={tdStyle}>Brand Admin, Finance Admin</td>
                <td style={tdStyle}>End Customer / Subscriber</td>
              </tr>
              <tr style={trStyle}>
                <td style={tdLabelStyle}>Operating Context</td>
                <td style={tdStyle}>Global Platform Domain</td>
                <td style={tdStyle}>Tenant → Brand → Market → Env</td>
                <td style={tdStyle}>Customer Account Scope</td>
              </tr>
              <tr style={trStyle}>
                <td style={tdLabelStyle}>Core Goal</td>
                <td style={tdStyle}>Govern the platform infrastructure</td>
                <td style={tdStyle}>Run operational exception workflows</td>
                <td style={tdStyle}>Manage service and usage limits</td>
              </tr>
              <tr style={trStyle}>
                <td style={tdLabelStyle}>UX Architecture</td>
                <td style={tdStyle}>12-domain Navigation Cockpit</td>
                <td style={tdStyle}>Action Queue + Right Context Drawer</td>
                <td style={tdStyle}>Decision-driven Action Centre</td>
              </tr>
              <tr style={trStyle}>
                <td style={tdLabelStyle}>Standards Focus</td>
                <td style={tdStyle}>WORM Audit, global compliance</td>
                <td style={tdStyle}>Mediation, Billing, and Sagas</td>
                <td style={tdStyle}>GSMA SGP.22 eSIM, Prepay/Postpay</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(15, 23, 42, 0.5)",
  border: "1px solid rgba(148, 163, 184, 0.1)",
  borderRadius: "20px",
  padding: "36px 30px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column" as const,
  position: "relative" as const,
  overflow: "hidden",
  transition: "transform 0.2s ease, border-color 0.2s ease"
};

const iconWrapperStyle = (color: string, bg: string) => ({
  width: "48px",
  height: "48px",
  borderRadius: "14px",
  background: bg,
  border: `1px solid rgba(148, 163, 184, 0.08)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "22px"
});

const cardTitleStyle = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: "8px",
  letterSpacing: "-0.015em"
};

const cardDescStyle = {
  fontSize: "14px",
  color: "#94a3b8",
  lineHeight: "1.6",
  marginBottom: "24px",
  flex: 1
};

const badgeStyle = (textColor: string, bgColor: string) => ({
  alignSelf: "flex-start",
  fontSize: "11px",
  fontWeight: 600,
  color: textColor,
  background: bgColor,
  padding: "3px 9px",
  borderRadius: "6px",
  marginBottom: "20px",
  letterSpacing: "0.02em"
});

const specsListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  marginBottom: "32px",
  borderTop: "1px solid rgba(148, 163, 184, 0.08)",
  paddingTop: "20px"
};

const specItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "13px",
  color: "#cbd5e1"
};

const buttonStyle = (bg: string) => ({
  background: bg,
  color: "#ffffff",
  textAlign: "center" as const,
  padding: "12px",
  borderRadius: "10px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  transition: "opacity 0.2s ease"
});

const thStyle = {
  padding: "12px 16px",
  fontWeight: 600,
  color: "#94a3b8",
  borderBottom: "1px solid rgba(148, 163, 184, 0.1)"
};

const tdLabelStyle = {
  padding: "14px 16px",
  fontWeight: 600,
  color: "#ffffff",
  width: "160px"
};

const tdStyle = {
  padding: "14px 16px",
  color: "#94a3b8"
};

const trStyle = {
  borderBottom: "1px solid rgba(148, 163, 184, 0.05)"
};
