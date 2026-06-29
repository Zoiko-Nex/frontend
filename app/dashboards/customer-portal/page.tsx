"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone, CreditCard, Shield, HelpCircle, User, Briefcase, Info, Check, AlertTriangle, FileText, ChevronDown, Download
} from "lucide-react";

// Brand Themes CSS Variable definitions
const BRANDS = {
  "GoLite": {
    name: "GoLite Mobile",
    bg: "#fafafa",
    cardBg: "#ffffff",
    text: "#171717",
    textDim: "#737373",
    border: "#e5e5e5",
    primary: "#10b981", // Emerald
    accent: "#059669",
    accentDim: "#ecfdf5",
    logoGlow: "0 0 10px rgba(16, 185, 129, 0.3)",
    mode: "light"
  },
  "DriverX": {
    name: "DriverX Fleet",
    bg: "#0b0c10",
    cardBg: "#1f2833",
    text: "#c5c6c7",
    textDim: "#858688",
    border: "#45505c",
    primary: "#ff6b00", // Neon Orange
    accent: "#ff8533",
    accentDim: "rgba(255, 107, 0, 0.15)",
    logoGlow: "0 0 12px rgba(255, 107, 0, 0.4)",
    mode: "dark"
  },
  "ZoikoMobile": {
    name: "Zoiko Mobile",
    bg: "#090d16",
    cardBg: "#121824",
    text: "#cbd5e1",
    textDim: "#64748b",
    border: "#1e293b",
    primary: "#4f46e5", // Indigo
    accent: "#3b82f6",
    accentDim: "rgba(79, 70, 229, 0.15)",
    logoGlow: "0 0 10px rgba(59, 130, 246, 0.3)",
    mode: "dark"
  },
  "ZoikoBroadband": {
    name: "Zoiko Broadband",
    bg: "#0f172a",
    cardBg: "#1e293b",
    text: "#cbd5e1",
    textDim: "#94a3b8",
    border: "#334155",
    primary: "#06b6d4", // Cyan
    accent: "#f43f5e", // Rose
    accentDim: "rgba(6, 182, 212, 0.15)",
    logoGlow: "0 0 10px rgba(6, 182, 212, 0.3)",
    mode: "dark"
  }
};

const INITIAL_INVOICES = [
  { id: "INV-9101", period: "June 1 - June 26, 2026", amount: "$45.00", status: "Paid", tax: "$3.50", service: "GoLite Core 10GB", explanation: "Monthly flat base charge for your primary handset line allocation." },
  { id: "INV-9102", period: "May 1 - May 31, 2026", amount: "$62.50", status: "Overdue", tax: "$4.80", service: "GoLite Core + Roaming UAE", explanation: "Includes $45.00 base charge plus 5GB international roaming data pass in UAE." }
];

export default function CustomerPortal() {
  const [selectedBrandKey, setSelectedBrandKey] = useState<keyof typeof BRANDS>("ZoikoMobile");
  const [roleMode, setRoleMode] = useState("End User"); // Business Owner, Finance Admin, Service Admin, End User
  const [activeTab, setActiveTab] = useState("Home"); // Home, Services, Billing, Support

  // Condition State engine for Action Centre
  const [failedPaymentExists, setFailedPaymentExists] = useState(true);
  const [kycRequiredExists, setKycRequiredExists] = useState(false);
  const [esimPendingExists, setEsimPendingExists] = useState(false);

  // eSIM Simulator states
  const [esimStep, setEsimStep] = useState(1); // 1: QR scanner, 2: Install, 3: Completed, 4: Failure
  const [esimErrorType, setEsimErrorType] = useState("");

  // Dispute / Evidence States
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [evidenceList, setEvidenceList] = useState([
    { id: "ev-1", title: "eSIM activated successfully", ts: "2026-06-26 10:15", selected: false },
    { id: "ev-2", title: "Monthly bill run generated INV-9102", ts: "2026-06-01 00:00", selected: false },
    { id: "ev-3", title: "Payment failure on card ending 4129", ts: "2026-06-02 12:45", selected: false }
  ]);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeNotes, setDisputeNotes] = useState("");

  const brand = BRANDS[selectedBrandKey];

  const handleToggleEvidence = (id: string) => {
    setEvidenceList(evidenceList.map(ev => ev.id === id ? { ...ev, selected: !ev.selected } : ev));
  };

  const handleRaiseDispute = () => {
    const selectedEv = evidenceList.filter(ev => ev.selected).map(ev => ev.title);
    alert(`Dispute raised on Invoice INV-9102.\nTimeline Evidence Attached: ${selectedEv.join(", ") || "None"}\nNotes: ${disputeNotes}`);
    setDisputeModalOpen(false);
    setDisputeNotes("");
    setEvidenceList(evidenceList.map(ev => ({ ...ev, selected: false })));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: brand.bg,
      color: brand.text,
      fontFamily: "Outfit, Inter, sans-serif",
      paddingBottom: "80px", // space for mobile bottom navigation
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Top Banner Control Panel for Sandbox evaluation */}
      <div style={{
        background: "#0c0d12",
        borderBottom: "1px solid #1f2937",
        padding: "12px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 50,
        fontSize: "12px",
        color: "#9ca3af"
      }}>
        {/* Brand Theme Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Theme Skin:</span>
          <select
            value={selectedBrandKey}
            onChange={(e) => setSelectedBrandKey(e.target.value as any)}
            style={sandboxSelectStyle}
          >
            <option value="ZoikoMobile">Zoiko Mobile</option>
            <option value="GoLite">GoLite (Light Theme)</option>
            <option value="DriverX">DriverX (High Contrast)</option>
            <option value="ZoikoBroadband">Zoiko Broadband</option>
          </select>
        </div>

        {/* Business Mode Role switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Business Role Mode:</span>
          <select
            value={roleMode}
            onChange={(e) => setRoleMode(e.target.value)}
            style={sandboxSelectStyle}
          >
            <option value="End User">End User (Single Subscriber)</option>
            <option value="Business Owner">Business Owner (Full Access)</option>
            <option value="Finance Admin">Finance Admin (Invoices & Exports)</option>
            <option value="Service Admin">Service Admin (Lines & eSIMs)</option>
          </select>
        </div>

        {/* Action Centre Trigger Controls */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              setFailedPaymentExists(true);
              setKycRequiredExists(false);
              setEsimPendingExists(false);
            }}
            style={sandboxBtnStyle(failedPaymentExists)}
          >
            Failed Payment
          </button>
          <button
            onClick={() => {
              setFailedPaymentExists(false);
              setKycRequiredExists(true);
              setEsimPendingExists(false);
            }}
            style={sandboxBtnStyle(kycRequiredExists)}
          >
            KYC Hold
          </button>
          <button
            onClick={() => {
              setFailedPaymentExists(false);
              setKycRequiredExists(false);
              setEsimPendingExists(true);
            }}
            style={sandboxBtnStyle(esimPendingExists)}
          >
            eSIM Pending
          </button>
          <button
            onClick={() => {
              setFailedPaymentExists(false);
              setKycRequiredExists(false);
              setEsimPendingExists(false);
            }}
            style={sandboxBtnStyle(!failedPaymentExists && !kycRequiredExists && !esimPendingExists)}
          >
            Clear (Calm Overview)
          </button>
        </div>

        <Link href="/dashboards" style={{
          fontSize: "12px",
          color: brand.primary,
          textDecoration: "none",
          border: `1px solid ${brand.border}`,
          padding: "3px 8px",
          borderRadius: "4px"
        }}>
          Exit to Hub
        </Link>
      </div>

      {/* Main Header */}
      <header style={{
        padding: "20px 24px",
        background: brand.cardBg,
        borderBottom: `1px solid ${brand.border}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: brand.primary, boxShadow: brand.logoGlow }} />
          <span style={{ fontWeight: 800, fontSize: "16px", color: brand.mode === "light" ? "#000" : "#fff" }}>
            {brand.name}
          </span>
          <span style={{ fontSize: "10px", color: brand.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>Self Service</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
          <User size={14} />
          <span>Active Session: <strong style={{ color: brand.primary }}>{roleMode}</strong></span>
        </div>
      </header>

      {/* Content Container */}
      <div style={{ flex: 1, padding: "24px", maxWidth: "880px", width: "100%", margin: "0 auto" }}>
        
        {/* Conditional Action Centre decision rendering */}
        {activeTab === "Home" && (
          <div>
            {failedPaymentExists && (
              <div style={actionCentreCardStyle(brand.border, brand.cardBg)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f87171", marginBottom: "14px" }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase" }}>Critical Action Required: Payment Failed</span>
                </div>
                <p style={{ fontSize: "13.5px", color: brand.text, lineHeight: "1.5", marginBottom: "16px" }}>
                  We could not collect your latest payment of **$62.50** on June 2, 2026. Please settle the balance immediately to prevent service suspension.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => alert("Saga trigger: payment.process initiated")} style={primaryBtnStyle(brand.primary)}>Pay $62.50 Now</button>
                  <button onClick={() => alert("Redirecting to payment profile update page...")} style={secondaryBtnStyle(brand.border, brand.text)}>Update Payment Method</button>
                </div>
              </div>
            )}

            {kycRequiredExists && (
              <div style={actionCentreCardStyle(brand.border, brand.cardBg)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#f59e0b", marginBottom: "14px" }}>
                  <Shield size={18} />
                  <span style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase" }}>KYC Identification Required</span>
                </div>
                <p style={{ fontSize: "13.5px", color: brand.text, lineHeight: "1.5", marginBottom: "16px" }}>
                  To comply with national regulations, we need you to upload your government identity document to activate your primary subscription line.
                </p>
                <button onClick={() => alert("Saga trigger: kyc.document_upload initiated")} style={primaryBtnStyle(brand.primary)}>Complete Identification</button>
              </div>
            )}

            {esimPendingExists && (
              <div style={actionCentreCardStyle(brand.border, brand.cardBg)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: brand.primary, marginBottom: "14px" }}>
                  <Smartphone size={18} />
                  <span style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase" }}>eSIM Installation Pending</span>
                </div>
                <p style={{ fontSize: "13.5px", color: brand.text, lineHeight: "1.5", marginBottom: "16px" }}>
                  Your eSIM profile is generated and ready to install on your mobile device. Scan the QR code or follow the manual walkthrough.
                </p>
                <button onClick={() => setActiveTab("Services")} style={primaryBtnStyle(brand.primary)}>Install eSIM Profile</button>
              </div>
            )}

            {/* Calm Account Overview if no critical actions exist */}
            {!failedPaymentExists && !kycRequiredExists && !esimPendingExists && (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff" }}>Account Overview</h2>
                  <p style={{ fontSize: "12.5px", color: brand.textDim }}>Welcome back. All subscriptions are verified and live.</p>
                </div>

                {/* UsageBalanceCard */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                  {/* Prepaid wallet card */}
                  <div style={cardStyle(brand.border, brand.cardBg)}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontSize: "12px", color: brand.textDim }}>PREPAID BALANCE</span>
                      <span style={{ fontSize: "10px", background: brand.accentDim, color: brand.primary, padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>TMF654</span>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: 850, color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "6px" }}>$24.50</div>
                    <p style={{ fontSize: "11.5px", color: brand.textDim, marginBottom: "20px" }}>Valid until Aug 15, 2026. Low balance threshold set at $5.00.</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => alert("Prepaid top-up simulated.")} style={primaryBtnStyle(brand.primary)}>Top-Up Balance</button>
                      <button onClick={() => alert("Auto top-up toggled.")} style={secondaryBtnStyle(brand.border, brand.text)}>Enable Auto-Topup</button>
                    </div>
                  </div>

                  {/* Postpaid Allowance card */}
                  <div style={cardStyle(brand.border, brand.cardBg)}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span style={{ fontSize: "12px", color: brand.textDim }}>MONTHLY ALLOWANCE</span>
                      <span style={{ fontSize: "10px", background: brand.accentDim, color: brand.primary, padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>TMF677</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                      <span style={{ fontSize: "24px", fontWeight: 800, color: brand.mode === "light" ? "#000" : "#fff" }}>7.2 GB</span>
                      <span style={{ fontSize: "12px", color: brand.textDim }}>of 10 GB used</span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: "6px", width: "100%", background: brand.border, borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
                      <div style={{ width: "72%", height: "100%", background: brand.primary }} />
                    </div>
                    <p style={{ fontSize: "11.5px", color: brand.textDim }}>Cycle resets in 4 days. Unbilled out-of-bundle spend: <strong>$0.00</strong></p>
                  </div>
                </div>

                {/* Subscriptions state */}
                <div style={cardStyle(brand.border, brand.cardBg)}>
                  <div style={panelHeaderStyle(brand.border)}>Handset Handset Line Hierarchy</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <div>
                      <strong style={{ color: brand.mode === "light" ? "#000" : "#fff" }}>+1 (555) 0199</strong>
                      <div style={{ fontSize: "11.5px", color: brand.textDim }}>Primary Line · GoLite Core 10GB</div>
                    </div>
                    <span style={{ fontSize: "11px", background: "#ecfdf5", color: "#10b981", padding: "3px 8px", borderRadius: "4px", fontWeight: "bold" }}>SIM Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services Tab: eSIM Journeys */}
        {activeTab === "Services" && (
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "6px" }}>Handsets & eSIM Profiles</h2>
            <p style={{ fontSize: "12.5px", color: brand.textDim, marginBottom: "20px" }}>Install, transfer, or replace eSIM profiles securely using GSMA SGP.22 standard.</p>

            <div style={cardStyle(brand.border, brand.cardBg)}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "14px" }}>eSIM Profile Installer</h3>
              
              {esimStep === 1 && (
                <div>
                  <p style={{ fontSize: "13px", lineHeight: "1.6", marginBottom: "18px" }}>
                    Scan the QR activation code on your target device to initiate profile download. Ensure your device is connected to Wi-Fi.
                  </p>
                  {/* QR Box placeholder */}
                  <div style={{ width: "160px", height: "160px", border: `2px solid ${brand.border}`, background: "#fff", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "120px", height: "120px", background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"8\" height=\"8\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"8\" height=\"8\" x=\"13\" y=\"3\" rx=\"1\"/><rect width=\"8\" height=\"8\" x=\"3\" y=\"13\" rx=\"1\"/><path d=\"M13 13h1v1h-1z\"/><path d=\"M17 13h1v1h-1z\"/><path d=\"M13 17h1v1h-1z\"/><path d=\"M17 17h2v2h-2z\"/></svg>') center/contain no-repeat" }} />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => {
                        setEsimStep(2);
                        setTimeout(() => {
                          setEsimStep(3);
                        }, 2000);
                      }}
                      style={primaryBtnStyle(brand.primary)}
                    >
                      Simulate Successful Install
                    </button>
                    <button
                      onClick={() => {
                        setEsimStep(4);
                        setEsimErrorType("Device not compatible");
                      }}
                      style={{ ...secondaryBtnStyle(brand.border, brand.text), color: "#f87171" }}
                    >
                      Simulate Compatibility Failure
                    </button>
                  </div>
                </div>
              )}

              {esimStep === 2 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: "30px", height: "30px", border: `3px solid ${brand.primary}`, borderTopColor: "transparent", borderRadius: "50%", animation: "ax-spin 1s linear infinite", margin: "0 auto 16px" }} />
                  <p style={{ fontSize: "13px", color: brand.text }}>Downloading profile from SM-DP+ server...</p>
                </div>
              )}

              {esimStep === 3 && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981", marginBottom: "14px" }}>
                    <Check size={20} color="#10b981" />
                  </div>
                  <h4 style={{ fontSize: "15px", color: brand.mode === "light" ? "#000" : "#fff", fontWeight: "bold", marginBottom: "6px" }}>eSIM Activated Successfully</h4>
                  <p style={{ fontSize: "12px", color: brand.textDim, marginBottom: "18px" }}>Your handset line is now carrying network traffic. Evidence logged.</p>
                  <button onClick={() => setEsimStep(1)} style={primaryBtnStyle(brand.primary)}>Reset Simulator</button>
                </div>
              )}

              {esimStep === 4 && (
                <div style={{ border: "1px solid #ef4444", background: "rgba(239, 68, 68, 0.05)", borderRadius: "6px", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", marginBottom: "10px" }}>
                    <AlertTriangle size={16} />
                    <strong style={{ fontSize: "13.5px" }}>Installation Error: {esimErrorType}</strong>
                  </div>
                  <p style={{ fontSize: "12.5px", color: brand.text, lineHeight: "1.5", marginBottom: "14px" }}>
                    This device does not support eSIM standards. Please verify hardware compatibility or order a physical SIM.
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => alert("Saga: physical_sim.order initiated.")} style={primaryBtnStyle(brand.primary)}>Order Physical SIM</button>
                    <button onClick={() => setEsimStep(1)} style={secondaryBtnStyle(brand.border, brand.text)}>Back to Start</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Billing Tab: Charge Explainer & Disputes */}
        {activeTab === "Billing" && (
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "6px" }}>Billing & Invoices</h2>
            <p style={{ fontSize: "12.5px", color: brand.textDim, marginBottom: "20px" }}>Review, download, or dispute line-level invoice items.</p>

            <div style={cardStyle(brand.border, brand.cardBg)}>
              <div style={panelHeaderStyle(brand.border)}>Recent Invoices</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {invoices.map((inv) => {
                  const isExpanded = expandedInvoiceId === inv.id;
                  return (
                    <div key={inv.id} style={{ border: `1px solid ${brand.border}`, borderRadius: "8px", overflow: "hidden" }}>
                      <div
                        onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", cursor: "pointer", background: brand.mode === "light" ? "#f9f9f9" : "rgba(30, 41, 59, 0.2)" }}
                      >
                        <div>
                          <strong style={{ color: brand.mode === "light" ? "#000" : "#fff" }}>{inv.id}</strong>
                          <div style={{ fontSize: "11px", color: brand.textDim }}>{inv.period}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff" }}>{inv.amount}</span>
                          <span style={{
                            fontSize: "10px",
                            background: inv.status === "Paid" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: inv.status === "Paid" ? "#10b981" : "#f87171",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold"
                          }}>{inv.status}</span>
                          <ChevronDown size={14} />
                        </div>
                      </div>

                      {/* Charge Explainer panel */}
                      {isExpanded && (
                        <div style={{ padding: "16px 18px", borderTop: `1px solid ${brand.border}`, background: brand.mode === "light" ? "#fff" : "transparent" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: brand.primary, marginBottom: "10px", fontSize: "12px", fontWeight: "bold" }}>
                            <Info size={13} />
                            <span>CHARGE EXPLAINER (TMF678)</span>
                          </div>
                          <p style={{ fontSize: "12.5px", color: brand.textDim, lineHeight: "1.5", marginBottom: "12px" }}>
                            {inv.explanation}
                          </p>
                          <div style={{ fontSize: "11.5px", color: brand.textDim, marginBottom: "14px" }}>
                            <div>Charge Class: <strong>Recurring base tariff</strong></div>
                            <div>VAT/Sales Tax applied: <strong>{inv.tax}</strong></div>
                          </div>
                          <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center" }}>
                            <button style={{ background: "transparent", border: "none", display: "flex", alignItems: "center", gap: "6px", color: brand.textDim, fontSize: "12px", cursor: "pointer" }}>
                              <Download size={14} /> Download PDF
                            </button>
                            {inv.status === "Overdue" && (
                              <button
                                onClick={() => setDisputeModalOpen(true)}
                                style={{
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.3)",
                                  color: "#f87171",
                                  borderRadius: "4px",
                                  padding: "4px 10px",
                                  fontSize: "11.5px",
                                  fontWeight: "bold",
                                  cursor: "pointer"
                                }}
                              >
                                Dispute Charge
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Support Tab: Evidence Timeline & Dispute Raising */}
        {activeTab === "Support" && (
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "6px" }}>Customer Timeline & Disputes</h2>
            <p style={{ fontSize: "12.5px", color: brand.textDim, marginBottom: "20px" }}>Use timeline evidence events to substantiate billing, usage, or support dispute cases.</p>

            <div style={cardStyle(brand.border, brand.cardBg)}>
              <div style={panelHeaderStyle(brand.border)}>Evidence Ledger Timeline</div>
              <p style={{ fontSize: "12px", color: brand.textDim, marginBottom: "14px" }}>Select one or more events to attach as proof to a billing dispute ticket.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => handleToggleEvidence(ev.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: `1px solid ${ev.selected ? brand.primary : brand.border}`,
                      background: ev.selected ? brand.accentDim : "transparent",
                      borderRadius: "6px",
                      padding: "12px",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={ev.selected}
                      readOnly
                      style={{ cursor: "pointer", accentColor: brand.primary }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: brand.mode === "light" && !ev.selected ? "#000" : "#fff" }}>{ev.title}</div>
                      <div style={{ fontSize: "10.5px", color: brand.textDim }}>Timestamp: {ev.ts}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setDisputeModalOpen(true)}
                style={{
                  ...primaryBtnStyle(brand.primary),
                  width: "auto",
                  padding: "8px 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                Create Dispute Case with Selected Evidence
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Bottom Navigation for Mobile / Tablet Viewports */}
      <nav style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: brand.cardBg,
        borderTop: `1px solid ${brand.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 40,
        boxShadow: "0 -4px 10px rgba(0,0,0,0.1)"
      }}>
        {[
          { key: "Home", label: "Home", icon: Smartphone },
          { key: "Services", label: "Services", icon: Smartphone },
          { key: "Billing", label: "Billing", icon: CreditCard },
          { key: "Support", label: "Disputes", icon: HelpCircle }
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: isActive ? brand.primary : brand.textDim,
                fontSize: "11px",
                cursor: "pointer",
                gap: "4px"
              }}
            >
              <IconComp size={18} color={isActive ? brand.primary : brand.textDim} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Dispute Modal Overlay */}
      {disputeModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60
        }}>
          <div style={{
            background: brand.cardBg,
            border: `1px solid ${brand.border}`,
            borderRadius: "12px",
            padding: "24px",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: "bold", color: brand.mode === "light" ? "#000" : "#fff", marginBottom: "12px" }}>Raise Billing Dispute</h3>
            <p style={{ fontSize: "12.5px", color: brand.textDim, marginBottom: "14px" }}>
              Please describe the reason for your dispute. Your selected timeline evidence will be attached to the case.
            </p>
            
            <textarea
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              placeholder="Enter details of your dispute..."
              rows={4}
              style={{
                width: "100%",
                background: brand.bg,
                border: `1px solid ${brand.border}`,
                color: brand.text,
                borderRadius: "6px",
                padding: "10px",
                fontSize: "13px",
                outline: "none",
                marginBottom: "16px",
                resize: "none"
              }}
            />

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDisputeModalOpen(false)}
                style={{
                  background: "transparent",
                  border: `1px solid ${brand.border}`,
                  color: brand.text,
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRaiseDispute}
                style={{
                  background: brand.primary,
                  color: brand.mode === "light" ? "#fff" : "#000",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub components styles
const sandboxSelectStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  color: "#f3f4f6",
  borderRadius: "4px",
  padding: "3px 8px",
  fontSize: "11.5px",
  outline: "none",
  cursor: "pointer"
};

const sandboxBtnStyle = (active: boolean) => ({
  background: active ? "#374151" : "transparent",
  border: "1px solid #334155",
  color: active ? "#fff" : "#9ca3af",
  borderRadius: "4px",
  padding: "3px 8px",
  fontSize: "11px",
  cursor: "pointer"
});

const actionCentreCardStyle = (borderColor: string, bg: string) => ({
  border: `1px solid ${borderColor}`,
  background: bg,
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "24px"
});

const cardStyle = (borderColor: string, bg: string) => ({
  background: bg,
  border: `1px solid ${borderColor}`,
  borderRadius: "10px",
  padding: "20px"
});

const panelHeaderStyle = (borderColor: string) => ({
  fontWeight: "bold",
  fontSize: "13px",
  borderBottom: `1px solid ${borderColor}`,
  paddingBottom: "10px",
  marginBottom: "14px"
});

const primaryBtnStyle = (bg: string) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "10px 16px",
  fontSize: "12.5px",
  fontWeight: "bold",
  cursor: "pointer"
});

const secondaryBtnStyle = (borderColor: string, color: string) => ({
  background: "transparent",
  border: `1px solid ${borderColor}`,
  color: color,
  borderRadius: "6px",
  padding: "10px 16px",
  fontSize: "12.5px",
  fontWeight: "bold",
  cursor: "pointer"
});
