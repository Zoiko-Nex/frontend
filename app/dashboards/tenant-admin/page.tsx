"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Layers, DollarSign, Activity, AlertTriangle, CheckCircle,
  FileText, Shield, Settings, ShoppingBag, Eye, RefreshCw, X, ArrowRight, Play, Trash2
} from "lucide-react";

// Mock Data Sets mapped to different contexts
const TENANT_DATA: Record<string, any> = {
  "Acme Telecom": {
    brands: ["Acme Mobile", "Acme Broadband"],
    markets: ["US-East", "US-West"],
    metrics: { customers: "45,200", subscribers: "47,800", accounts: "42,100", revenue: "$984,500", failedProv: 3, unratedUsage: 140, failedPay: 5, openDisputes: 2, readiness: "94%" },
    customers: [
      { id: "C-101", name: "Alice Vance", email: "alice@vance.com", phone: "+1 555-0199", status: "Active", risk: "Low", balance: "$42.50", serviceState: "eSIM Active" },
      { id: "C-102", name: "Bob Miller", email: "bob@miller.com", phone: "+1 555-0144", status: "Pending KYC", risk: "Medium", balance: "$0.00", serviceState: "Pending Activation" },
      { id: "C-103", name: "Charlie Green", email: "charlie@green.com", phone: "+1 555-0177", status: "Suspended", risk: "High", balance: "$150.00", serviceState: "Disabled" }
    ],
    actionQueue: [
      { id: "AQ-101", title: "eSIM Activation Block", object: "Subscriber sub-9011", type: "Provisioning", severity: "Critical", owner: "Order Operations Admin", sla: "12m left", details: "HLR profile response timed out on Ericsson-UDM gateway." },
      { id: "AQ-102", title: "KYC verification required", object: "Customer C-102", type: "KYC/KYB", severity: "Critical", owner: "Compliance Admin", sla: "28m left", details: "National register API returned mismatch on address line." },
      { id: "AQ-103", title: "Invoice generation error", object: "Account A-183", type: "Billing", severity: "Warning", owner: "Billing Admin", sla: "42m left", details: "Currency exchange mapping failure for UK billing cycle." }
    ]
  },
  "Orbit Wireless": {
    brands: ["Orbit Mobile", "Orbit IoT"],
    markets: ["UK-South", "EU-West"],
    metrics: { customers: "12,800", subscribers: "14,200", accounts: "11,900", revenue: "$240,200", failedProv: 0, unratedUsage: 25, failedPay: 1, openDisputes: 0, readiness: "100%" },
    customers: [
      { id: "C-201", name: "Dave Grohl", email: "dave@foofighters.com", phone: "+44 20 7946 0912", status: "Active", risk: "Low", balance: "$15.00", serviceState: "SIM Active" },
      { id: "C-202", name: "Taylor Hawkins", email: "taylor@foofighters.com", phone: "+44 20 7946 0955", status: "Active", risk: "Low", balance: "$22.50", serviceState: "eSIM Active" }
    ],
    actionQueue: [
      { id: "AQ-201", title: "Unmatched Payment Settlement", object: "Payment pay-8032", type: "Reconciliation", severity: "Warning", owner: "Finance Admin", sla: "1h 10m left", details: "Bank statement line mismatch of $2.50 for card transaction." }
    ]
  }
};

export default function TenantAdminConsole() {
  const [selectedTenant, setSelectedTenant] = useState("Acme Telecom");
  const [selectedBrand, setSelectedBrand] = useState("Acme Mobile");
  const [selectedMarket, setSelectedMarket] = useState("US-East");
  const [environment, setEnvironment] = useState("Production");

  const [activeDomain, setActiveDomain] = useState("Home");
  const [actionQueue, setActionQueue] = useState<any[]>([]);
  const [isQueueCollapsed, setIsQueueCollapsed] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<any | null>(null);
  
  // Custom states for interactive features
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [billRunStep, setBillRunStep] = useState(1); // 1: Setup, 2: Simulation, 3: Approval, 4: Complete
  const [isSimulatingBillRun, setIsSimulatingBillRun] = useState(false);
  const [mediationErrors, setMediationErrors] = useState(18);

  // Sync data based on selected Tenant
  useEffect(() => {
    const data = TENANT_DATA[selectedTenant];
    if (data) {
      setSelectedBrand(data.brands[0]);
      setSelectedMarket(data.markets[0]);
      setActionQueue(data.actionQueue);
    }
  }, [selectedTenant]);

  const currentData = TENANT_DATA[selectedTenant] || TENANT_DATA["Acme Telecom"];
  const metrics = currentData.metrics;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0e12", // Warm deep-slate
      color: "#e2e8f0",
      fontFamily: "Outfit, Inter, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Scoped CSS styling for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .right-drawer {
          animation: slideInRight 0.25s ease-out forwards;
        }
      `}} />

      {/* Topbar: Persistent Context Selectors */}
      <header style={{
        height: "64px",
        borderBottom: "1px solid #23262d",
        background: "#12141a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}>
        {/* Logo and Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 10px #f59e0b" }} />
          <span style={{ fontWeight: 700, fontSize: "14px", color: "#ffffff", letterSpacing: "-0.01em" }}>ZoikoNex</span>
          <span style={{ fontSize: "10px", background: "#f59e0b", color: "#000", padding: "1px 6px", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase" }}>Tenant Ops</span>
        </div>

        {/* Dropdown selectors */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* Tenant */}
          <div style={selectorWrapperStyle}>
            <span style={selectorLabelStyle}>Tenant</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              style={selectStyle}
            >
              <option value="Acme Telecom">Acme Telecom</option>
              <option value="Orbit Wireless">Orbit Wireless</option>
            </select>
          </div>

          {/* Brand */}
          <div style={selectorWrapperStyle}>
            <span style={selectorLabelStyle}>Brand</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={selectStyle}
            >
              {currentData.brands.map((b: string) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Market */}
          <div style={selectorWrapperStyle}>
            <span style={selectorLabelStyle}>Market</span>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              style={selectStyle}
            >
              {currentData.markets.map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Environment */}
          <div style={selectorWrapperStyle}>
            <span style={selectorLabelStyle}>Env</span>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              style={{ ...selectStyle, color: environment === "Production" ? "#f87171" : "#34d399" }}
            >
              <option value="Production">Production</option>
              <option value="Preview">Preview</option>
              <option value="Staging">Staging</option>
              <option value="Sandbox">Sandbox</option>
            </select>
          </div>
        </div>

        {/* Actions Hub button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboards" style={{
            fontSize: "12px",
            color: "#fbbf24",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            padding: "4px 10px",
            borderRadius: "5px",
            textDecoration: "none",
            background: "rgba(245, 158, 11, 0.05)"
          }}>
            Hub Exit
          </Link>
        </div>
      </header>

      {/* Outer Shell */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* Left Navigation: 10 domains */}
        <aside style={{
          width: "220px",
          background: "#12141a",
          borderRight: "1px solid #23262d",
          padding: "16px 8px"
        }}>
          <div style={{ fontSize: "10px", color: "#4b5563", fontWeight: 700, paddingLeft: "12px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "14px" }}>
            Operational Console
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { name: "Home", icon: Activity },
              { name: "Customers", icon: Users },
              { name: "Products", icon: ShoppingBag },
              { name: "Orders", icon: Play },
              { name: "Usage", icon: RefreshCw },
              { name: "Billing", icon: DollarSign },
              { name: "Compliance", icon: Shield },
              { name: "Assurance", icon: AlertTriangle },
              { name: "Reports", icon: FileText },
              { name: "Settings", icon: Settings }
            ].map((domain) => {
              const isActive = activeDomain === domain.name;
              const IconComponent = domain.icon;
              return (
                <button
                  key={domain.name}
                  onClick={() => {
                    setActiveDomain(domain.name);
                    setSelectedCustomer(null); // Clear context drilldowns on tab switch
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    background: isActive ? "rgba(245, 158, 11, 0.08)" : "transparent",
                    color: isActive ? "#ffffff" : "#9ca3af",
                    border: "none",
                    borderLeft: isActive ? "2px solid #fbbf24" : "2px solid transparent",
                    borderRadius: "0 6px 6px 0",
                    fontSize: "13px",
                    textAlign: "left",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  <IconComponent size={14} color={isActive ? "#fbbf24" : "#6b7280"} />
                  <span>{domain.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Inner Surface */}
        <main style={{ flex: 1, padding: "24px 30px", overflowY: "auto" }}>
          {/* Home (Control Room Dashboard) View */}
          {activeDomain === "Home" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>Tenant Control Room</h1>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>Operations snapshot for {selectedTenant} ({selectedBrand})</p>
              </div>

              {/* KPI Strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
                {[
                  { label: "Active Customers", val: metrics.customers, desc: "TMF629 profiles" },
                  { label: "Active Subscribers", val: metrics.subscribers, desc: "SIM/eSIM inventory" },
                  { label: "Billable Accounts", val: metrics.accounts, desc: "Billing partitions" },
                  { label: "Current-Cycle Rev", val: metrics.revenue, desc: "Unbilled + Invoiced" },
                  { label: "Failed Provisioning", val: metrics.failedProv, desc: "Action Queue items", color: metrics.failedProv > 0 ? "#ef4444" : "#e2e8f0" },
                  { label: "Unrated Usage (CDR)", val: metrics.unratedUsage, desc: "Suspense files", color: metrics.unratedUsage > 50 ? "#f59e0b" : "#e2e8f0" },
                  { label: "Failed Payments", val: metrics.failedPay, desc: "Retry thresholds", color: metrics.failedPay > 0 ? "#ef4444" : "#e2e8f0" },
                  { label: "Open Disputes", val: metrics.openDisputes, desc: "Support queue" },
                  { label: "Compliance Score", val: metrics.readiness, desc: "Jurisdiction check" }
                ].map((kpi, idx) => (
                  <div key={idx} style={{
                    background: "#12141a",
                    border: "1px solid #23262d",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: "10.5px", color: "#6b7280" }}>{kpi.label}</span>
                    <div style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold", color: kpi.color || "#fff" }}>{kpi.val}</div>
                    <span style={{ fontSize: "9px", color: "#4b5563" }}>{kpi.desc}</span>
                  </div>
                ))}
              </div>

              {/* Main Drilldown panels */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Panel 1: Customer Triage */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>Customer Triage (Customer 360)</span>
                    <button onClick={() => setActiveDomain("Customers")} style={linkBtnStyle}>Manage All</button>
                  </div>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle2}>ID</th>
                        <th style={thStyle2}>Name</th>
                        <th style={thStyle2}>Risk</th>
                        <th style={thStyle2}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.customers.map((c: any) => (
                        <tr key={c.id}>
                          <td style={tdStyle2} className="mono">{c.id}</td>
                          <td style={tdStyle2}>{c.name}</td>
                          <td style={tdStyle2}>
                            <span style={{ color: c.risk === "High" ? "#ef4444" : c.risk === "Medium" ? "#f59e0b" : "#10b981", fontSize: "10.5px" }}>
                              {c.risk}
                            </span>
                          </td>
                          <td style={tdStyle2}>
                            <button
                              onClick={() => {
                                setSelectedCustomer(c);
                                setActiveDomain("Customers");
                              }}
                              style={actionBtnStyle}
                            >
                              <Eye size={12} /> View 360
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel 2: Compliance Readiness Matrix */}
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <span>Compliance Readiness Matrix</span>
                    <button onClick={() => setActiveDomain("Compliance")} style={linkBtnStyle}>Details</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={complianceRowStyle("#10b981")}>
                      <span>US-FCC Tax Filings:</span>
                      <span>Verified (Live)</span>
                    </div>
                    <div style={complianceRowStyle("#10b981")}>
                      <span>GDPR Data Residency:</span>
                      <span>Enforced (EU-West)</span>
                    </div>
                    <div style={complianceRowStyle(selectedTenant === "Acme Telecom" ? "#f59e0b" : "#10b981")}>
                      <span>KYC Identity Validation:</span>
                      <span>{selectedTenant === "Acme Telecom" ? "1 Gap Detected" : "Verified"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customers Tab (including Customer 360 View) */}
          {activeDomain === "Customers" && (
            <div>
              {selectedCustomer ? (
                <div>
                  {/* Customer 360 Screen */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <button onClick={() => setSelectedCustomer(null)} style={{ background: "transparent", border: "1px solid #334155", color: "#fff", padding: "4px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "12px" }}>
                      ← Back to List
                    </button>
                    <h2 style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>Customer 360: {selectedCustomer.name}</h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
                    {/* Main customer details */}
                    <div style={panelStyle}>
                      <div style={panelHeaderStyle}>Identity & Service Hierarchy</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px", fontSize: "13px" }}>
                        <div>Email: <strong style={{ color: "#fff" }}>{selectedCustomer.email}</strong></div>
                        <div>Phone: <strong style={{ color: "#fff" }}>{selectedCustomer.phone}</strong></div>
                        <div>Account Status: <strong style={{ color: "#10b981" }}>{selectedCustomer.status}</strong></div>
                        <div>Service State: <strong style={{ color: "#fbbf24" }}>{selectedCustomer.serviceState}</strong></div>
                        <div>Payer Balance: <strong style={{ color: "#fff" }}>{selectedCustomer.balance}</strong></div>
                        <div>Risk Rating: <strong style={{ color: "#ef4444" }}>{selectedCustomer.risk}</strong></div>
                      </div>

                      <div style={{ borderTop: "1px solid #23262d", paddingTop: "14px" }}>
                        <h4 style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>Evidence Records Summary</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", background: "#1e293b", padding: "6px 10px", borderRadius: "4px" }}>
                            <span>KYC_Check_Verified</span>
                            <span style={{ color: "#38bdf8" }}>rec-49821-WORM</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", background: "#1e293b", padding: "6px 10px", borderRadius: "4px" }}>
                            <span>SIM_Profile_Requested</span>
                            <span style={{ color: "#38bdf8" }}>rec-49818-WORM</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions for triage */}
                    <div style={panelStyle}>
                      <div style={panelHeaderStyle}>Support Actions</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button style={triageBtnStyle} onClick={() => alert("Simulating support call verification verification: Completed.")}>Verify Caller ID</button>
                        <button style={triageBtnStyle} onClick={() => alert("Billing rerating simulated. Credit of $5.00 generated.")}>Trigger Rerating</button>
                        <button style={{ ...triageBtnStyle, background: "#ef4444", color: "#fff" }} onClick={() => alert("Service suspension requested. Written to WORM Evidence Ledger.")}>Suspend Line</button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>Customers & Subscriber Hierarchy (TMF629)</h2>
                  <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Complete list of customer partitions and subscriber states.</p>
                  
                  <div style={{ background: "#12141a", border: "1px solid #23262d", borderRadius: "8px", padding: "16px" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr>
                          <th style={thStyle2}>Customer ID</th>
                          <th style={thStyle2}>Name</th>
                          <th style={thStyle2}>Email</th>
                          <th style={thStyle2}>Status</th>
                          <th style={thStyle2}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.customers.map((c: any) => (
                          <tr key={c.id}>
                            <td style={tdStyle2} className="mono">{c.id}</td>
                            <td style={{ ...tdStyle2, color: "#fff" }}>{c.name}</td>
                            <td style={tdStyle2}>{c.email}</td>
                            <td style={tdStyle2}>
                              <span style={{
                                color: c.status === "Active" ? "#10b981" : c.status === "Suspended" ? "#ef4444" : "#f59e0b",
                                fontSize: "11px"
                              }}>{c.status}</span>
                            </td>
                            <td style={tdStyle2}>
                              <button onClick={() => setSelectedCustomer(c)} style={actionBtnStyle}>
                                <Eye size={12} /> View Customer 360
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products Catalog View */}
          {activeDomain === "Products" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>Product & Catalog Management (TMF620)</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Define brand product bundles, price books, and contract rules.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>Product Catalog Offerings</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { name: "GoLite Core 10GB", type: "Mobile Voice/Data", price: "$15.00/mo" },
                      { name: "Unlimited High-Speed Fibre", type: "Broadband", price: "$55.00/mo" },
                      { name: "Family Share Plan", type: "Hybrid Bundle", price: "$40.00/mo" }
                    ].map((p, i) => (
                      <div key={i} style={{ border: "1px solid #23262d", background: "#1a1d24", borderRadius: "6px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ color: "#fff" }}>{p.name}</strong>
                          <div style={{ fontSize: "10.5px", color: "#6b7280" }}>{p.type}</div>
                        </div>
                        <span style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "13px" }}>{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={panelStyle}>
                  <div style={panelHeaderStyle}>Catalogue Approvals Queue</div>
                  <div style={{ border: "1px dashed #334155", borderRadius: "6px", padding: "20px", textAlign: "center" }}>
                    <Shield size={24} color="#6b7280" style={{ margin: "0 auto 10px" }} />
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>No pending catalog modifications waiting for review.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing View (Wizard for Bill Run Command) */}
          {activeDomain === "Billing" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>Billing Cycles & Bill Runs (TMF678)</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Govern cycle schedules, simulate rating parameters, and generate immutable invoices.</p>

              <div style={{ background: "#12141a", border: "1px solid #23262d", borderRadius: "10px", padding: "24px" }}>
                <h3 style={{ fontSize: "14px", color: "#fff", marginBottom: "16px" }}>Bill Run Command Wizard</h3>
                
                {/* Wizard Steps indicator */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "1px solid #23262d", paddingBottom: "12px" }}>
                  {[
                    { num: 1, title: "1. Setup" },
                    { num: 2, title: "2. Simulation" },
                    { num: 3, title: "3. Approval" },
                    { num: 4, title: "4. Executed" }
                  ].map((s) => (
                    <span key={s.num} style={{
                      fontWeight: "bold",
                      fontSize: "12.5px",
                      color: billRunStep >= s.num ? "#fbbf24" : "#4b5563"
                    }}>{s.title}</span>
                  ))}
                </div>

                {/* Step contents */}
                {billRunStep === 1 && (
                  <div>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "16px" }}>
                      Initiate bill run for billing cycle **Cycle-06 (June 2026)**. This will collect all usage records and unbilled events.
                    </p>
                    <button
                      onClick={() => {
                        setIsSimulatingBillRun(true);
                        setTimeout(() => {
                          setIsSimulatingBillRun(false);
                          setBillRunStep(2);
                        }, 1200);
                      }}
                      style={wizardBtnStyle}
                      disabled={isSimulatingBillRun}
                    >
                      {isSimulatingBillRun ? "Fetching Rating Files..." : "Run Rating Simulation →"}
                    </button>
                  </div>
                )}

                {billRunStep === 2 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", marginBottom: "12px", fontSize: "13px" }}>
                      <CheckCircle size={14} />
                      <span>Rating Simulation Completed (no suspense errors).</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", background: "#1a1d24", padding: "14px", borderRadius: "6px", fontSize: "12px", marginBottom: "16px" }}>
                      <div>Total Records Rated: <strong>142,500 CDRs</strong></div>
                      <div>Expected Invoice Value: <strong>$12,410.50</strong></div>
                      <div>Credits & Adjustments: <strong>-$150.00</strong></div>
                      <div>Tax Exposure: <strong>$1,120.45</strong></div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setBillRunStep(1)} style={{ ...wizardBtnStyle, background: "transparent", border: "1px solid #475569", color: "#fff" }}>Back</button>
                      <button onClick={() => setBillRunStep(3)} style={wizardBtnStyle}>Submit for Approval →</button>
                    </div>
                  </div>
                )}

                {billRunStep === 3 && (
                  <div>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "16px" }}>
                      <strong>Dual authorization required:</strong> Finance Admin approval is needed before generating the production bill run and emitting invoices to the Evidence Ledger.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => {
                        alert("Invoice output written to WORM Ledger.");
                        setBillRunStep(4);
                      }} style={wizardBtnStyle}>Approve & Execute Bill Run</button>
                      <button onClick={() => setBillRunStep(2)} style={{ ...wizardBtnStyle, background: "transparent", border: "1px solid #475569", color: "#fff" }}>Reject</button>
                    </div>
                  </div>
                )}

                {billRunStep === 4 && (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", marginBottom: "14px" }}>
                      <CheckCircle size={20} color="#10b981" />
                    </div>
                    <h4 style={{ color: "#fff", fontSize: "15px", fontWeight: "bold", marginBottom: "6px" }}>Bill Run Executed Successfully</h4>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>Invoices generated. Evidence event **billrun.completed** written to the ledger.</p>
                    <button onClick={() => setBillRunStep(1)} style={{ ...wizardBtnStyle, width: "auto", padding: "8px 16px" }}>Run New Cycle</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Usage Mediation View */}
          {activeDomain === "Usage" && (
            <div>
              <h2 style={{ fontSize: "18px", color: "#fff", marginBottom: "6px" }}>Usage Mediation Pipeline (TMF635)</h2>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "20px" }}>Mediation sequence visualizer with real-time suspense queues.</p>
              
              {/* Pipeline Flow diagram */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px", marginBottom: "24px" }}>
                {[
                  "Ingest", "Validate", "Normalise", "Enrich", "Deduplicate", "Correlate", "Rate Feed", "Rated"
                ].map((step, idx) => (
                  <div key={idx} style={{
                    background: idx === 6 && mediationErrors > 0 ? "rgba(239, 68, 68, 0.1)" : "#12141a",
                    border: idx === 6 && mediationErrors > 0 ? "1px solid #ef4444" : "1px solid #23262d",
                    borderRadius: "6px",
                    padding: "10px 4px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "11px", fontWeight: "bold", color: "#fff" }}>{step}</div>
                    <div style={{ fontSize: "9px", color: "#6b7280", marginTop: "4px" }}>Stage {idx + 1}</div>
                    {idx === 6 && mediationErrors > 0 && (
                      <div style={{ fontSize: "9px", color: "#ef4444", fontWeight: "bold", marginTop: "4px" }}>{mediationErrors} Suspended</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Reprocess Levers */}
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>
                  <span>Mediation Exceptions Controller</span>
                  <span>Exceptions: {mediationErrors} records</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                    Errors detected in Rating Feed stage due to missing brand routing tariffs. Injecting tariffs will clear the block.
                  </p>
                  <button
                    onClick={() => {
                      setMediationErrors(0);
                      alert("CDRs reprocessed. Ingestion complete.");
                    }}
                    disabled={mediationErrors === 0}
                    style={{
                      background: mediationErrors === 0 ? "#1e293b" : "#fbbf24",
                      color: mediationErrors === 0 ? "#4b5563" : "#000",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Reprocess Suspense Queue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other domains */}
          {["Compliance", "Assurance", "Reports", "Settings", "Orders"].includes(activeDomain) && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Layers size={48} color="#23262d" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: "15px", color: "#fff", marginBottom: "6px" }}>{activeDomain} Domain Scoped</h2>
              <p style={{ fontSize: "12.5px", color: "#9ca3af", maxWidth: "460px", margin: "0 auto", lineHeight: "1.6" }}>
                This operational module is running within standard entitlements. Access is governed by RBAC policy rules.
              </p>
            </div>
          )}
        </main>

        {/* Right Sidebar: Collapsible Persistent Action Queue */}
        <aside style={{
          width: isQueueCollapsed ? "44px" : "320px",
          background: "#12141a",
          borderLeft: "1px solid #23262d",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          position: "relative" as const
        }}>
          {/* Header */}
          <div style={{
            padding: "16px",
            borderBottom: "1px solid #23262d",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            overflow: "hidden"
          }}>
            {!isQueueCollapsed && <span style={{ fontWeight: "bold", fontSize: "12.5px", color: "#ffffff", letterSpacing: "0.02em" }}>ACTION QUEUE</span>}
            <button
              onClick={() => setIsQueueCollapsed(!isQueueCollapsed)}
              style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "13px" }}
            >
              {isQueueCollapsed ? "«" : "»"}
            </button>
          </div>

          {/* Queue Items */}
          {!isQueueCollapsed && (
            <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {actionQueue.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginTop: "20px" }}>No exception cases found.</p>
                ) : (
                  actionQueue.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedQueueItem(item)}
                      style={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "6px",
                        padding: "12px",
                        cursor: "pointer",
                        transition: "border-color 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: item.severity === "Critical" ? "#f87171" : "#fbbf24",
                          background: item.severity === "Critical" ? "rgba(248, 113, 113, 0.1)" : "rgba(251, 191, 36, 0.1)",
                          padding: "2px 6px",
                          borderRadius: "4px"
                        }}>
                          {item.severity}
                        </span>
                        <span style={{ fontSize: "10px", color: "#9ca3af" }}>{item.sla}</span>
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "12.5px", color: "#fff", marginBottom: "4px" }}>{item.title}</div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Target: {item.object}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Right Drawer (Sliding context drawer for details) */}
      {selectedQueueItem && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "420px",
          height: "100vh",
          background: "#12141a",
          borderLeft: "1px solid #23262d",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column"
        }} className="right-drawer">
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #23262d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>Action Item: {selectedQueueItem.id}</span>
            <button onClick={() => setSelectedQueueItem(null)} style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", color: "#fbbf24", background: "rgba(251, 191, 36, 0.1)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                {selectedQueueItem.type}
              </span>
              <h3 style={{ fontSize: "18px", color: "#fff", margin: "10px 0 4px" }}>{selectedQueueItem.title}</h3>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>SLA Timer: <strong style={{ color: "#fff" }}>{selectedQueueItem.sla}</strong></p>
            </div>

            <div style={{ background: "#1e293b", padding: "14px", borderRadius: "6px", marginBottom: "20px", fontSize: "12.5px" }}>
              <div style={{ marginBottom: "8px" }}>Target Object: <strong style={{ color: "#fff" }}>{selectedQueueItem.object}</strong></div>
              <div>Primary Role: <strong style={{ color: "#fff" }}>{selectedQueueItem.owner}</strong></div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "12px", color: "#9ca3af", textTransform: "uppercase", marginBottom: "8px" }}>Exception Summary</h4>
              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: "1.6" }}>{selectedQueueItem.details}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => {
                  setActionQueue(actionQueue.filter(item => item.id !== selectedQueueItem.id));
                  setSelectedQueueItem(null);
                  alert("Resolution code committed. Evidence recorded in WORM ledger.");
                }}
                style={{
                  background: "#10b981",
                  color: "#000",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "12.5px"
                }}
              >
                Resolve & Acknowledge (Log Evidence)
              </button>
              <button
                onClick={() => alert("Escalated to Global Super Admin.")}
                style={{
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "6px",
                  padding: "10px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "12.5px"
                }}
              >
                Escalate Exception
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub components styles
const selectorWrapperStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "3px"
};

const selectorLabelStyle = {
  fontSize: "9px",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  fontWeight: "bold"
};

const selectStyle = {
  background: "#1e293b",
  border: "1px solid #2d3139",
  color: "#fff",
  borderRadius: "4px",
  padding: "3px 8px",
  fontSize: "12px",
  outline: "none",
  cursor: "pointer"
};

const panelStyle = {
  background: "#12141a",
  border: "1px solid #23262d",
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
  borderBottom: "1px solid #23262d",
  paddingBottom: "10px",
  marginBottom: "14px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  textAlign: "left" as const,
  fontSize: "12px"
};

const thStyle2 = {
  padding: "8px 10px",
  color: "#6b7280",
  borderBottom: "1px solid #23262d",
  fontWeight: "normal"
};

const tdStyle2 = {
  padding: "10px 10px",
  borderBottom: "1px solid #1a1d24",
  color: "#9ca3af"
};

const actionBtnStyle = {
  background: "rgba(245, 158, 11, 0.1)",
  border: "1px solid rgba(245, 158, 11, 0.3)",
  color: "#fbbf24",
  borderRadius: "4px",
  padding: "2px 8px",
  fontSize: "11px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px"
};

const linkBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#fbbf24",
  fontSize: "11px",
  cursor: "pointer"
};

const complianceRowStyle = (color: string) => ({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12.5px",
  borderBottom: "1px solid #1a1d24",
  paddingBottom: "8px",
  color: color
});

const triageBtnStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: "6px",
  color: "#cbd5e1",
  padding: "8px 12px",
  fontSize: "12px",
  textAlign: "left" as const,
  cursor: "pointer"
};

const wizardBtnStyle = {
  background: "#fbbf24",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  padding: "10px 20px",
  fontSize: "12.5px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%"
};
