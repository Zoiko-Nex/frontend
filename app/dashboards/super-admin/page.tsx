"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Network, Users, DollarSign, Activity, AlertTriangle, CheckCircle,
  FileText, Server, Sliders, Play, RefreshCw, Key, LogOut, ChevronRight, Lock
} from "lucide-react";

// Mock Data Definitions
const INITIAL_TENANTS = [
  { id: "ten-acme", name: "Acme Telecom", status: "Live", environment: "Production", subscribers: "45,200", region: "US-East", limit: "100k API/hr" },
  { id: "ten-orbit", name: "Orbit Wireless", status: "Live", environment: "Production", subscribers: "12,800", region: "EU-West", limit: "50k API/hr" },
  { id: "ten-horizon", name: "Horizon Net", status: "Live", environment: "Staging", subscribers: "2,400", region: "UK-South", limit: "20k API/hr" },
  { id: "ten-lite", name: "GoLite Mobile", status: "Configurable", environment: "Sandbox", subscribers: "0", region: "US-West", limit: "10k API/hr" },
  { id: "ten-driverx", name: "DriverX Fleet", status: "Suspended", environment: "Production", subscribers: "9,100", region: "EU-Central", limit: "50k API/hr" },
];

const INITIAL_EVIDENCE = [
  { eventId: "ev-9831", tenantId: "ten-acme", timestamp: "2026-06-26 11:20:14", actor: "system.provisioner", action: "eSIM_profile_allocated", prevHash: "00000000000000000000", currentHash: "f6e2a1b94d8c823ea4e1" },
  { eventId: "ev-9832", tenantId: "ten-acme", timestamp: "2026-06-26 11:21:05", actor: "billing.engine", action: "billrun_completed", prevHash: "f6e2a1b94d8c823ea4e1", currentHash: "8b7a12e34d5678fa9b2c" },
  { eventId: "ev-9833", tenantId: "ten-orbit", timestamp: "2026-06-26 11:22:45", actor: "compliance.admin", action: "jurisdiction_override", prevHash: "8b7a12e34d5678fa9b2c", currentHash: "3f1a6b7e8d9c2e0b5a4d" },
  { eventId: "ev-9834", tenantId: "ten-driverx", timestamp: "2026-06-26 11:24:12", actor: "system.assurance", action: "fraud_alert_escalated", prevHash: "3f1a6b7e8d9c2e0b5a4d", currentHash: "1e8d9c2e0b5a4d3f1a6b" }
];

export default function SuperAdminConsole() {
  const [activeTab, setActiveTab] = useState("Command Centre");
  const [environment, setEnvironment] = useState("Production");
  const [anomalyTriggered, setAnomalyTriggered] = useState(false);
  const [evidenceList, setEvidenceList] = useState(INITIAL_EVIDENCE);
  const [verifyingLedger, setVerifyingLedger] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [tenants, setTenants] = useState(INITIAL_TENANTS);

  // Stats changes based on anomaly state
  const stats = {
    activeTenants: anomalyTriggered ? 4 : 5,
    activeSubscribers: anomalyTriggered ? "69,400" : "69,500",
    billableAccounts: "54,220",
    cycleRevenue: anomalyTriggered ? "$1,418,200" : "$1,424,500",
    failedProvisioning: anomalyTriggered ? 24 : 0,
    failedRating: anomalyTriggered ? 18 : 2,
    paymentFailureRate: anomalyTriggered ? "4.8%" : "1.2%",
    complianceExposure: anomalyTriggered ? 3 : 1,
    openFraudAlerts: anomalyTriggered ? 5 : 0,
    platformHealth: anomalyTriggered ? "78.4%" : "99.8%"
  };

  const handleVerifyLedger = () => {
    setVerifyingLedger(true);
    setVerificationResult(null);
    setTimeout(() => {
      setVerifyingLedger(false);
      setVerificationResult("Hash chain integrity verified. 4/4 block signatures secure (WORM certified).");
    }, 1800);
  };

  const addAnomalyEvidence = () => {
    if (!anomalyTriggered) {
      const lastHash = evidenceList[evidenceList.length - 1].currentHash;
      const newEv = {
        eventId: `ev-983${evidenceList.length + 1}`,
        tenantId: "ten-acme",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: "system.telemetry",
        action: "platform_anomaly_triggered",
        prevHash: lastHash,
        currentHash: Math.random().toString(36).substring(2, 22)
      };
      setEvidenceList([...evidenceList, newEv]);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#08090b",
      color: "#d1d5db",
      fontFamily: "var(--font-mono), monospace",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Banner for Anomaly */}
      {anomalyTriggered && (
        <div style={{
          background: "rgba(239, 68, 68, 0.15)",
          borderBottom: "1px solid #ef4444",
          color: "#fca5a5",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
            <span><strong>CRITICAL PLATFORM ANOMALY DETECTED:</strong> Provisioning pipelines showing HLR activation locks and rating engine exceptions.</span>
          </div>
          <button 
            onClick={() => { setAnomalyTriggered(false); }}
            style={{ background: "#ef4444", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
          >
            Acknowledge & Clear
          </button>
        </div>
      )}

      {/* Header bar */}
      <header style={{
        height: "64px",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#0c0d12"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "12px", height: "12px", background: "#0ea5e9", borderRadius: "3px", boxShadow: "0 0 10px #0ea5e9" }} />
          <span style={{ fontWeight: 800, fontSize: "15px", color: "#fff", letterSpacing: "-0.01em" }}>ZOIKONEX SUPER ADMIN</span>
          <span style={{ fontSize: "10px", background: "#1e293b", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", border: "1px solid #334155" }}>PLATFORM CONTROL</span>
        </div>

        {/* Global Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <span style={{ color: "#9ca3af" }}>Environment:</span>
            <select 
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              style={{ background: "#111827", border: "1px solid #374151", color: "#fff", padding: "4px 8px", borderRadius: "4px", outline: "none", cursor: "pointer" }}
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="UAT">UAT Sandbox</option>
            </select>
          </div>

          <div style={{ height: "20px", width: "1px", background: "#1e293b" }} />

          {/* User profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#f3f4f6", fontWeight: "bold" }}>root@zoikonex.internal</div>
              <div style={{ fontSize: "9px", color: "#9ca3af", textTransform: "uppercase" }}>Global Administrator</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1f2937", border: "1px solid #0ea5e9", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="#0ea5e9" />
            </div>
          </div>

          <Link href="/dashboards" style={{ color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", textDecoration: "none", border: "1px solid #374151", padding: "4px 10px", borderRadius: "4px", background: "#111827" }}>
            <LogOut size={13} /> Hub
          </Link>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Sidebar - 12 domains */}
        <aside style={{
          width: "260px",
          background: "#0a0b0e",
          borderRight: "1px solid #1e293b",
          padding: "16px 8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", paddingLeft: "12px", marginBottom: "12px", fontWeight: "bold" }}>
              OSS/BSS System Scope
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {[
                { name: "Command Centre", icon: Activity, count: "HEALTHY", color: stats.platformHealth === "99.8%" ? "#10b981" : "#ef4444" },
                { name: "Tenants & Operators", icon: Network, count: "5 LIVE", color: "#9ca3af" },
                { name: "Identity & Accounts", icon: Users, count: "100%", color: "#9ca3af" },
                { name: "Catalogue & Price", icon: FileText, count: "12 OFFERS", color: "#9ca3af" },
                { name: "Orders & Provisioning", icon: Play, count: anomalyTriggered ? "24 ERR" : "0 ERR", color: anomalyTriggered ? "#ef4444" : "#10b981" },
                { name: "Usage & Charging", icon: Server, count: "OCS ACTIVE", color: "#9ca3af" },
                { name: "Billing & Invoices", icon: DollarSign, count: "BILL RUN 6", color: "#9ca3af" },
                { name: "Compliance Matrix", icon: Shield, count: anomalyTriggered ? "3 BLOCK" : "OK", color: anomalyTriggered ? "#f59e0b" : "#10b981" },
                { name: "Assurance & Fraud", icon: AlertTriangle, count: anomalyTriggered ? "5 ALERTS" : "0 ALERTS", color: anomalyTriggered ? "#ef4444" : "#9ca3af" },
                { name: "Ecosystem Integrations", icon: Sliders, count: "API LIVE", color: "#9ca3af" },
                { name: "WORM Evidence Ledger", icon: Lock, count: "SECURE", color: "#0ea5e9" },
                { name: "Platform Admin", icon: Sliders, count: "CFG", color: "#9ca3af" },
              ].map((tab) => {
                const isActive = activeTab === tab.name;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      background: isActive ? "#111827" : "transparent",
                      border: "none",
                      borderLeft: isActive ? "3px solid #0ea5e9" : "3px solid transparent",
                      borderRadius: "0 6px 6px 0",
                      color: isActive ? "#fff" : "#9ca3af",
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <IconComponent size={14} color={isActive ? "#0ea5e9" : "#6b7280"} />
                      <span>{tab.name}</span>
                    </div>
                    <span style={{ fontSize: "9px", background: "rgba(30, 41, 59, 0.5)", color: tab.color, padding: "2px 6px", borderRadius: "4px", border: "1px solid #1e293b", fontWeight: "bold" }}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Anomaly Simulation Controller */}
          <div style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "14px 12px",
            marginTop: "16px"
          }}>
            <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>Simulation Deck</div>
            <p style={{ fontSize: "9.5px", color: "#64748b", lineHeight: "1.4", marginBottom: "12px" }}>
              Inject state faults to test real-time monitoring and failover indicators.
            </p>
            {anomalyTriggered ? (
              <button
                onClick={() => { setAnomalyTriggered(false); }}
                style={{
                  width: "100%",
                  background: "#10b981",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "8px 10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <RefreshCw size={12} /> Clear Anomaly
              </button>
            ) : (
              <button
                onClick={() => { setAnomalyTriggered(true); addAnomalyEvidence(); }}
                style={{
                  width: "100%",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  padding: "8px 10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <AlertTriangle size={12} /> Inject Platform Anomaly
              </button>
            )}
          </div>
        </aside>

        {/* Dynamic Detail Panel */}
        <main style={{ flex: 1, padding: "24px 30px", overflowY: "auto" }}>
          {/* Command Centre Tab */}
          {activeTab === "Command Centre" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff" }}>Global Control Room</h1>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>Execution telemetry across multi-tenant telecom partitions</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ fontSize: "11px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    {anomalyTriggered ? "DEGRADED MODE ACTIVE" : "ALL SYSTEMS NOMINAL"}
                  </div>
                  <div style={{ fontSize: "11px", background: "#111827", border: "1px solid #1e293b", padding: "4px 8px", borderRadius: "4px", color: "#6b7280" }}>
                    Refreshed 2s ago
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "Active Tenants", val: stats.activeTenants, limit: "/ 5 max", color: "#fff" },
                  { label: "Active Subs", val: stats.activeSubscribers, limit: "GSMA Live", color: "#fff" },
                  { label: "Billable Accounts", val: stats.billableAccounts, limit: "TMF666", color: "#fff" },
                  { label: "Cycle Revenue Est", val: stats.cycleRevenue, limit: "ISO 4217", color: "#fff" },
                  { label: "Failed Provisioning", val: stats.failedProvisioning, limit: "Sagas Stack", color: stats.failedProvisioning > 0 ? "#ef4444" : "#10b981" },
                  { label: "Failed Rating", val: stats.failedRating, limit: "OCS Queue", color: stats.failedRating > 2 ? "#ef4444" : "#10b981" },
                  { label: "Payment Fail Rate", val: stats.paymentFailureRate, limit: "TMF676", color: stats.paymentFailureRate !== "1.2%" ? "#f59e0b" : "#10b981" },
                  { label: "Compliance Exposure", val: stats.complianceExposure, limit: "Jurisdictions", color: stats.complianceExposure > 1 ? "#ef4444" : "#10b981" },
                  { label: "Open Fraud Alerts", val: stats.openFraudAlerts, limit: "Assurance", color: stats.openFraudAlerts > 0 ? "#ef4444" : "#10b981" },
                  { label: "Platform Health", val: stats.platformHealth, limit: "SLO Burn", color: stats.platformHealth === "99.8%" ? "#10b981" : "#ef4444" }
                ].map((kpi, idx) => (
                  <div key={idx} style={{
                    background: "#0c0d12",
                    border: "1px solid #1e293b",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>{kpi.label}</span>
                    <div style={{ margin: "6px 0", fontSize: "20px", fontWeight: "bold", color: kpi.color }}>{kpi.val}</div>
                    <span style={{ fontSize: "9px", color: "#4b5563" }}>{kpi.limit}</span>
                  </div>
                ))}
              </div>

              {/* Cockpit Grid Panels */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Panel 1: Tenant Operations */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>Tenant Partition State</span>
                    <span style={{ fontSize: "10px", color: "#0ea5e9" }}>TMF632 Hierarchy</span>
                  </div>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle2}>Tenant</th>
                        <th style={thStyle2}>Subscribers</th>
                        <th style={thStyle2}>Region</th>
                        <th style={thStyle2}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((ten) => (
                        <tr key={ten.id}>
                          <td style={tdStyle2}>{ten.name}</td>
                          <td style={tdStyle2}>{ten.subscribers}</td>
                          <td style={tdStyle2}>{ten.region}</td>
                          <td style={tdStyle2}>
                            <span style={{
                              color: ten.status === "Live" ? "#10b981" : ten.status === "Suspended" ? "#ef4444" : "#f59e0b",
                              fontSize: "10px",
                              fontWeight: "bold"
                            }}>
                              {ten.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel 2: Revenue Operations */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>Revenue & Settlement Operations</span>
                    <span style={{ fontSize: "10px", color: "#0ea5e9" }}>TMF678 Billing</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={statLineStyle}>
                      <span>Cycle Bill Run State:</span>
                      <span style={{ color: "#10b981", fontWeight: "bold" }}>Completed (June Cycle)</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Total Invoice Value:</span>
                      <span>$1,424,500.00 USD</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Unbilled Accumulation:</span>
                      <span>$84,310.22 USD</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Reconciled Payments (Gateways):</span>
                      <span style={{ color: "#38bdf8" }}>98.8% settled</span>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Mediation & Charging */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>Mediation Pipelines (3GPP TS 32.240)</span>
                    <span style={{ fontSize: "10px", color: "#ef4444" }}>{stats.failedRating} exceptions</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={statLineStyle}>
                      <span>Mediation Ingest Status:</span>
                      <span style={{ color: anomalyTriggered ? "#f59e0b" : "#10b981" }}>
                        {anomalyTriggered ? "Congested" : "Processing"}
                      </span>
                    </div>
                    <div style={statLineStyle}>
                      <span>CDR CDR Ingest Velocity:</span>
                      <span>4,250 records/sec</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>OCS Authorized Quota Grnt:</span>
                      <span>99.98% availability</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Rating Suspense Queue Depth:</span>
                      <span style={{ color: anomalyTriggered ? "#ef4444" : "#fff", fontWeight: "bold" }}>
                        {stats.failedRating} records
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel 4: Platform Health */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>API Gateway Health</span>
                    <span style={{ fontSize: "10px", color: "#0ea5e9" }}>SLO Monitor</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={statLineStyle}>
                      <span>Internal Service Gateway:</span>
                      <span style={{ color: anomalyTriggered ? "#ef4444" : "#10b981" }}>
                        {anomalyTriggered ? "78.4% uptime" : "99.99% uptime"}
                      </span>
                    </div>
                    <div style={statLineStyle}>
                      <span>p95 Latency:</span>
                      <span style={{ color: anomalyTriggered ? "#f59e0b" : "#fff" }}>
                        {anomalyTriggered ? "420ms" : "28ms"}
                      </span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Webhook Delivery Rate:</span>
                      <span>100.0% delivered</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>Database Pool Connections:</span>
                      <span>45 / 200 pool</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tenants Tab */}
          {activeTab === "Tenants & Operators" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Tenant & Operator Administration</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Configure database isolation scopes, environment instances, and API quotas.</p>
              
              <div style={{ background: "#0c0d12", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      <th style={thStyle2}>Tenant ID</th>
                      <th style={thStyle2}>Brand Operator</th>
                      <th style={thStyle2}>Environment</th>
                      <th style={thStyle2}>Scope Limits</th>
                      <th style={thStyle2}>Status</th>
                      <th style={thStyle2}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((ten) => (
                      <tr key={ten.id}>
                        <td style={tdStyle2} className="mono">{ten.id}</td>
                        <td style={{ ...tdStyle2, color: "#fff" }}>{ten.name}</td>
                        <td style={tdStyle2}>{ten.environment}</td>
                        <td style={tdStyle2}>{ten.limit}</td>
                        <td style={tdStyle2}>
                          <span style={{ color: ten.status === "Live" ? "#10b981" : ten.status === "Suspended" ? "#ef4444" : "#f59e0b", fontSize: "11px" }}>
                            {ten.status}
                          </span>
                        </td>
                        <td style={tdStyle2}>
                          <button
                            onClick={() => {
                              setTenants(tenants.map(t => t.id === ten.id ? { ...t, status: t.status === "Live" ? "Suspended" : "Live" } : t));
                            }}
                            style={{
                              background: "rgba(14, 165, 233, 0.1)",
                              border: "1px solid #0ea5e9",
                              color: "#38bdf8",
                              borderRadius: "4px",
                              padding: "2px 8px",
                              fontSize: "11px",
                              cursor: "pointer"
                            }}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders & Provisioning Tab */}
          {activeTab === "Orders & Provisioning" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>OSS Activation & Provisioning Sagas</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Step-by-step distributed transaction tracker for eSIM profile mapping and SIM allocation.</p>

              <div style={{ background: "#0c0d12", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "14px", color: "#fff", marginBottom: "14px" }}>Provisioning Failure Queue</h3>
                {anomalyTriggered ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { id: "ord-8831", customer: "Customer C-491", product: "Unlimited Data Pack", step: "HLR_Profile_Activation", system: "Ericsson-UDM-1", error: "ERR_TIMEOUT_504", retries: 3 },
                      { id: "ord-8832", customer: "Customer C-128", product: "Roaming Addon 10GB", step: "Billing_Ledger_Sync", system: "Zoiko-Billing-Agent", error: "ERR_LEDGER_MUTATION_LOCKED", retries: 2 }
                    ].map((order) => (
                      <div key={order.id} style={{ border: "1px solid #ef4444", borderRadius: "6px", background: "rgba(239, 68, 68, 0.05)", padding: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontWeight: "bold", color: "#fca5a5" }}>Order {order.id}</span>
                          <span style={{ fontSize: "10px", background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: "4px" }}>Saga Failed</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: "10px", fontSize: "11px", color: "#9ca3af" }}>
                          <div>Customer: <strong style={{ color: "#fff" }}>{order.customer}</strong></div>
                          <div>Failed Step: <strong style={{ color: "#fca5a5" }}>{order.step}</strong> ({order.system})</div>
                          <div>Retries: <strong>{order.retries} / 5</strong></div>
                        </div>
                        <div style={{ marginTop: "10px", fontSize: "11px", display: "flex", justifyItems: "center", justifyContent: "space-between" }}>
                          <div>Error Reason: <code style={{ color: "#fca5a5", background: "#3b0712", padding: "2px 4px", borderRadius: "3px" }}>{order.error}</code></div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button style={btnActionStyle}>Rollback Saga</button>
                            <button style={{ ...btnActionStyle, background: "#ef4444", color: "#fff", border: "none" }} onClick={() => alert("Manual overrides require role permission and evidence authorization.")}>Override Step</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", padding: "20px 0" }}>No activation exceptions in queue.</p>
                )}
              </div>
            </div>
          )}

          {/* Compliance Matrix Tab */}
          {activeTab === "Compliance Matrix" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Compliance & Jurisdiction Packs</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Verify local regulatory notices, invoice formatting, tax calculations, and KYC rules.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>Jurisdiction Status</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={statLineStyle}>
                      <span>US-FCC Compliance Pack:</span>
                      <span style={{ color: "#10b981" }}>Live & Verified</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>UK-Ofcom Billing Disclosures:</span>
                      <span style={{ color: "#10b981" }}>Live & Verified</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>EU-GDPR Privacy Vaults:</span>
                      <span style={{ color: "#10b981" }}>Live & Verified</span>
                    </div>
                    <div style={statLineStyle}>
                      <span>India-TRAI Telecom Regulations:</span>
                      <span style={{ color: anomalyTriggered ? "#f59e0b" : "#10b981" }}>
                        {anomalyTriggered ? "Missing Packs" : "Live & Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>Active Go-Live Blockers</div>
                  {anomalyTriggered ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", color: "#fca5a5" }}>
                      <div>⚠️ Block 1: Missing TRAI jurisdiction mapping rules (Horizon Net tenant)</div>
                      <div>⚠️ Block 2: Tax rule engine validation timeout (Acme Telecom tenant)</div>
                      <div>⚠️ Block 3: KYC identity checks fail to connect with national registrar APIs</div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "11px", color: "#6b7280" }}>No compliance blocks registered for this environment.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Evidence Ledger Tab */}
          {activeTab === "WORM Evidence Ledger" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff" }}>Evidence & AI Audit Ledger (WORM-class)</h1>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>Append-only transaction blockchain verifying actors, states, and rule hashes.</p>
                </div>
                <button
                  onClick={handleVerifyLedger}
                  disabled={verifyingLedger}
                  style={{
                    background: "#0ea5e9",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Lock size={14} /> {verifyingLedger ? "Verifying..." : "Verify Hash Chain"}
                </button>
              </div>

              {verificationResult && (
                <div style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid #10b981",
                  color: "#a7f3d0",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  marginBottom: "20px"
                }}>
                  ✅ {verificationResult}
                </div>
              )}

              <div style={{ background: "#0c0d12", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      <th style={thStyle2}>Event ID</th>
                      <th style={thStyle2}>Tenant ID</th>
                      <th style={thStyle2}>Timestamp</th>
                      <th style={thStyle2}>Actor / System</th>
                      <th style={thStyle2}>Contract Action</th>
                      <th style={thStyle2}>Previous Hash</th>
                      <th style={thStyle2}>Current SHA-256</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceList.map((ev, idx) => (
                      <tr key={ev.eventId} style={{
                        background: verifyingLedger ? "rgba(14, 165, 233, 0.03)" : "transparent",
                        transition: "background 0.3s ease"
                      }}>
                        <td className="mono" style={{ ...tdStyle2, color: "#38bdf8" }}>{ev.eventId}</td>
                        <td style={tdStyle2} className="mono">{ev.tenantId}</td>
                        <td style={tdStyle2}>{ev.timestamp}</td>
                        <td style={tdStyle2}>{ev.actor}</td>
                        <td style={{ ...tdStyle2, color: "#fff" }}>{ev.action}</td>
                        <td className="mono" style={{ ...tdStyle2, fontSize: "10px", color: "#6b7280" }}>{ev.prevHash.slice(0, 10)}...</td>
                        <td className="mono" style={{ ...tdStyle2, fontSize: "10px", color: "#10b981" }}>{ev.currentHash.slice(0, 12)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fallback for other domains */}
          {["Identity & Accounts", "Catalogue & Price", "Usage & Charging", "Billing & Invoices", "Assurance & Fraud", "Ecosystem Integrations", "Platform Admin"].includes(activeTab) && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Shield size={48} color="#1e293b" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "16px", color: "#fff", marginBottom: "8px" }}>{activeTab} Scope Enforced</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", maxWidth: "480px", margin: "0 auto 20px", lineHeight: "1.6" }}>
                This platform domain is bound under strict environment controls. You have read-only access to configuration and audit summaries.
              </p>
              <div style={{ display: "inline-flex", gap: "10px" }}>
                <span style={{ fontSize: "11px", background: "#111827", color: "#9ca3af", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "4px" }}>
                  Role Access: Super Admin
                </span>
                <span style={{ fontSize: "11px", background: "#111827", color: "#10b981", border: "1px solid #1e293b", padding: "4px 10px", borderRadius: "4px" }}>
                  TMF Compliance verified
                </span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Styling Constants
const panelStyle = {
  background: "#0c0d12",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  padding: "18px",
  marginBottom: "16px"
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "13px",
  color: "#fff",
  borderBottom: "1px solid #1e293b",
  paddingBottom: "10px",
  marginBottom: "14px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  textAlign: "left" as const,
  fontSize: "11.5px"
};

const thStyle2 = {
  padding: "8px 10px",
  color: "#6b7280",
  borderBottom: "1px solid #1e293b",
  fontWeight: "normal"
};

const tdStyle2 = {
  padding: "10px 10px",
  borderBottom: "1px solid #0f172a",
  color: "#9ca3af"
};

const statLineStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  color: "#9ca3af"
};

const btnActionStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "4px",
  color: "#cbd5e1",
  padding: "4px 10px",
  fontSize: "11px",
  cursor: "pointer"
};
