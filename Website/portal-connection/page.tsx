"use client";

import React, { useState, useEffect } from "react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  /**
   * Whether this endpoint is callable on the platform today.
   *
   * Set from the routes the 19 services actually register, not by hand. Of the
   * 81 listed here, 7 are live — the rest describe intended surface. Presenting
   * all 81 as though they were contract meant an integrator could build against
   * a path that has never existed and only find out at the first request.
   */
  status: "available" | "planned";
}

interface Domain {
  num: string;
  slug: string;
  name: string;
  ep: number;
  base: string;
  ver: string;
  auth: string;
  rate: string;
  ov: string;
  std: string[];
  eps: Endpoint[];
}

const DOMAINS: Domain[] = [
  {
    num: "01",
    slug: "billing-charging",
    name: "Billing & Charging",
    ep: 12,
    base: "/v1/billing",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Real-time rating engines and convergent billing architectures for global connectivity. OCS, OFCS and convergent charging are exposed as distinct paths.",
    std: ["TMF678", "TMF635", "3GPP TS 32.299"],
    eps: [
      { method: "GET", path: "/v1/billing/accounts/{id}/balance", description: "Real-time balance", status: "planned" },
      { method: "POST", path: "/v1/charging/sessions", description: "Open charging session (OCS)", status: "planned" },
      { method: "POST", path: "/v1/charging/sessions/{id}/reserve", description: "Reserve units / quota", status: "planned" },
      { method: "POST", path: "/v1/billing/bill-runs", description: "Simulate or execute a bill run", status: "planned" },
      { method: "GET", path: "/v1/billing/invoices/{id}", description: "Retrieve an invoice", status: "planned" },
      { method: "POST", path: "/v1/billing/rerate", description: "Submit a rerating job", status: "planned" }
    ]
  },
  {
    num: "02",
    slug: "inventory-ops",
    name: "Inventory Ops",
    ep: 8,
    base: "/v1/inventory",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Automated resource lifecycle management from allocation to decommissioning across product, service and resource inventories.",
    std: ["TMF637", "TMF638", "TMF639"],
    eps: [
      { method: "GET", path: "/v1/inventory/resources", description: "List resource instances", status: "planned" },
      { method: "POST", path: "/v1/inventory/resources", description: "Allocate a resource", status: "planned" },
      { method: "PATCH", path: "/v1/inventory/resources/{id}", description: "Update lifecycle state", status: "planned" },
      { method: "DELETE", path: "/v1/inventory/resources/{id}", description: "Decommission a resource", status: "planned" },
      { method: "GET", path: "/v1/inventory/services/{id}", description: "Service inventory lookup", status: "planned" }
    ]
  },
  {
    num: "03",
    slug: "identity-security",
    name: "Identity & Security",
    ep: 24,
    base: "/v1/identity",
    ver: "v1",
    auth: "OAuth2 · tenant:user:read",
    rate: "Not enforced",
    ov: "Zero-trust authentication and sovereign identity management across network edges, with RBAC/ABAC, MFA and break-glass controls.",
    std: ["OAuth2", "OIDC", "TMF672"],
    eps: [
      { method: "POST", path: "/v1/identity/token", description: "Issue an OAuth2 token", status: "planned" },
      { method: "POST", path: "/v1/identity/mfa/verify", description: "Verify an MFA challenge", status: "planned" },
      { method: "GET", path: "/v1/identity/roles", description: "List roles (RBAC)", status: "planned" },
      { method: "POST", path: "/v1/identity/roles/assign", description: "Assign a role (ABAC policy)", status: "planned" },
      { method: "GET", path: "/v1/identity/sessions", description: "List privileged sessions", status: "planned" },
      { method: "POST", path: "/v1/identity/break-glass", description: "Request break-glass access", status: "planned" }
    ]
  },
  {
    num: "04",
    slug: "network-orchestration",
    name: "Network Orchestration",
    ep: 16,
    base: "/v1/network",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "SDN-integrated provisioning and traffic shaping for dynamic demand shifts, with policy control and carrier integration.",
    std: ["3GPP TS 29.503", "TMF641"],
    eps: [
      { method: "POST", path: "/v1/network/provisioning/orders", description: "Submit a provisioning order", status: "planned" },
      { method: "GET", path: "/v1/network/provisioning/orders/{id}", description: "Saga / activation status", status: "planned" },
      { method: "POST", path: "/v1/network/policy", description: "Apply a policy (PCRF/PCF)", status: "planned" },
      { method: "POST", path: "/v1/network/traffic-shaping", description: "Configure traffic shaping", status: "planned" },
      { method: "GET", path: "/v1/network/hlr/{msisdn}", description: "HLR/HSS lookup", status: "planned" }
    ]
  },
  {
    num: "05",
    slug: "customer-management",
    name: "Customer Management",
    ep: 14,
    base: "/v1/customers",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Unified profile orchestration with deep loyalty integration and churn analytics. Customer, account (payer) and subscriber are separate entities.",
    std: ["TMF629", "TMF666", "TMF632", "TMF669"],
    eps: [
      { method: "GET", path: "/v1/customers/{id}", description: "Retrieve a customer", status: "available" },
      { method: "POST", path: "/v1/customers", description: "Create a customer", status: "available" },
      { method: "GET", path: "/v1/accounts/{id}", description: "Retrieve a billing account (payer)", status: "available" },
      { method: "GET", path: "/v1/subscribers/{id}", description: "Retrieve a subscriber", status: "planned" },
      { method: "POST", path: "/v1/customers/{id}/consent", description: "Record consent", status: "planned" },
      { method: "GET", path: "/v1/customers/{id}/churn-score", description: "Churn analytics", status: "planned" }
    ]
  },
  {
    num: "06",
    slug: "revenue-evidence",
    name: "Revenue Evidence",
    ep: 21,
    base: "/v1/evidence",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Immutable ledger tracking for cross-carrier reconciliation and settlement. WORM, append-only and hash-chain verified; writes are restricted to approved services.",
    std: ["WORM", "ISO 27001 A.12.4", "GDPR Art. 30"],
    eps: [
      { method: "GET", path: "/v1/evidence/{id}", description: "Retrieve an evidence record", status: "available" },
      { method: "POST", path: "/v1/evidence/verify", description: "Verify hash-chain integrity", status: "planned" },
      { method: "GET", path: "/v1/evidence/packs", description: "List evidence packs", status: "available" },
      { method: "POST", path: "/v1/evidence/packs/export", description: "Request an evidence export (approval)", status: "planned" },
      { method: "GET", path: "/v1/settlement/reconciliation", description: "Cross-carrier reconciliation", status: "planned" }
    ]
  },
  {
    num: "07",
    slug: "product-catalog",
    name: "Product Catalog",
    ep: 10,
    base: "/v1/catalog",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Versioned plans, bundles, promotions and eligibility with jurisdiction-aware price books and offering qualification.",
    std: ["TMF620", "TMF671"],
    eps: [
      { method: "GET", path: "/v1/catalog/offers", description: "List offers & plans", status: "planned" },
      { method: "GET", path: "/v1/catalog/offers/{id}", description: "Retrieve an offer", status: "planned" },
      { method: "POST", path: "/v1/catalog/qualification", description: "Product offering qualification", status: "planned" },
      { method: "GET", path: "/v1/catalog/promotions", description: "List promotions", status: "planned" }
    ]
  },
  {
    num: "08",
    slug: "order-management",
    name: "Order Management",
    ep: 13,
    base: "/v1/orders",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Order capture, decomposition and orchestration with saga-based service ordering and deterministic rollback.",
    std: ["TMF622", "TMF641"],
    eps: [
      { method: "POST", path: "/v1/orders", description: "Create a product order", status: "available" },
      { method: "GET", path: "/v1/orders/{id}", description: "Order status", status: "available" },
      { method: "POST", path: "/v1/orders/{id}/cancel", description: "Cancel an order", status: "planned" },
      { method: "GET", path: "/v1/service-orders/{id}", description: "Service order (saga) status", status: "planned" }
    ]
  },
  {
    num: "09",
    slug: "usage-mediation",
    name: "Usage & Mediation",
    ep: 11,
    base: "/v1/usage",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Carrier-grade ingestion and a stage-based, replayable mediation pipeline with rated-usage visibility and DLQ reprocessing.",
    std: ["TMF635", "3GPP TS 32.297", "GSMA TD.57"],
    eps: [
      { method: "POST", path: "/v1/usage/events", description: "Ingest a usage event", status: "planned" },
      { method: "GET", path: "/v1/usage/events/{id}", description: "Retrieve rated usage", status: "planned" },
      { method: "GET", path: "/v1/mediation/pipeline", description: "Pipeline stage metrics", status: "planned" },
      { method: "POST", path: "/v1/mediation/reprocess", description: "Reprocess from DLQ", status: "planned" }
    ]
  },
  {
    num: "10",
    slug: "payments-wallets",
    name: "Payments & Wallets",
    ep: 15,
    base: "/v1/payments",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Multi-rail collections and wallets with captures, retries, refunds and reconciliation. Amounts are ISO 4217 integer minor units.",
    std: ["TMF676", "ISO 20022"],
    eps: [
      { method: "POST", path: "/v1/payments", description: "Capture a payment", status: "planned" },
      { method: "POST", path: "/v1/payments/{id}/refund", description: "Refund a payment", status: "planned" },
      { method: "POST", path: "/v1/payments/{id}/retry", description: "Retry a payment", status: "planned" },
      { method: "GET", path: "/v1/wallets/{id}", description: "Wallet balance", status: "planned" },
      { method: "POST", path: "/v1/wallets/{id}/topup", description: "Top up a wallet", status: "planned" }
    ]
  },
  {
    num: "11",
    slug: "tax-jurisdiction",
    name: "Tax & Jurisdiction",
    ep: 9,
    base: "/v1/tax",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Runtime jurisdiction routing and multi-engine tax calculation driven by versioned, independently deployable jurisdiction packs.",
    std: ["ISO 4217"],
    eps: [
      { method: "POST", path: "/v1/tax/calculate", description: "Calculate tax for a transaction", status: "planned" },
      { method: "GET", path: "/v1/jurisdiction/packs", description: "List jurisdiction packs", status: "planned" },
      { method: "GET", path: "/v1/jurisdiction/packs/{id}", description: "Pack detail (versioned)", status: "planned" },
      { method: "POST", path: "/v1/tax/exemptions", description: "Register an exemption", status: "planned" }
    ]
  },
  {
    num: "12",
    slug: "esim-sim",
    name: "eSIM & SIM Provisioning",
    ep: 17,
    base: "/v1/esim",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "GSMA-aligned RSP eSIM lifecycle and SIM provisioning with SM-DP+ integration and operator-safe error mapping.",
    std: ["GSMA SGP.22", "ES2+", "ES9+"],
    eps: [
      { method: "POST", path: "/v1/esim/profiles", description: "Download an eSIM profile (ES2+)", status: "planned" },
      { method: "GET", path: "/v1/esim/profiles/{eid}", description: "Profile status", status: "planned" },
      { method: "POST", path: "/v1/esim/profiles/{eid}/enable", description: "Enable a profile", status: "planned" },
      { method: "POST", path: "/v1/sim/{iccid}/activate", description: "Activate a SIM", status: "planned" }
    ]
  },
  {
    num: "13",
    slug: "iot-connectivity",
    name: "IoT Connectivity",
    ep: 12,
    base: "/v1/iot",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Device fleet orchestration, remote action flows and usage aggregation at device-fleet scale.",
    std: ["GSMA IoT SAFE"],
    eps: [
      { method: "GET", path: "/v1/iot/devices", description: "List device fleet", status: "planned" },
      { method: "POST", path: "/v1/iot/devices/{id}/actions", description: "Trigger a remote action", status: "planned" },
      { method: "GET", path: "/v1/iot/devices/{id}/usage", description: "Device usage aggregation", status: "planned" },
      { method: "POST", path: "/v1/iot/fleets", description: "Create a fleet / group", status: "planned" }
    ]
  },
  {
    num: "14",
    slug: "numbering-porting",
    name: "Numbering & Porting",
    ep: 8,
    base: "/v1/numbering",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Number inventory, reservation and allocation with MNP port-in/out orchestration and donor/recipient state.",
    std: ["ITU-T E.164"],
    eps: [
      { method: "POST", path: "/v1/numbering/reserve", description: "Reserve an MSISDN", status: "planned" },
      { method: "POST", path: "/v1/numbering/allocate", description: "Allocate a number", status: "planned" },
      { method: "POST", path: "/v1/porting/port-in", description: "Initiate a port-in (MNP)", status: "planned" },
      { method: "GET", path: "/v1/porting/{id}", description: "Port status", status: "planned" }
    ]
  },
  {
    num: "15",
    slug: "notifications-messaging",
    name: "Notifications & Messaging",
    ep: 10,
    base: "/v1/messaging",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Transactional and campaign messaging across SMS, email and push, with delivery tracking and customer notifications.",
    std: ["3GPP SMS", "SMTP"],
    eps: [
      { method: "POST", path: "/v1/messaging/sms", description: "Send an SMS", status: "planned" },
      { method: "POST", path: "/v1/messaging/email", description: "Send an email", status: "planned" },
      { method: "POST", path: "/v1/messaging/push", description: "Send a push notification", status: "planned" },
      { method: "GET", path: "/v1/messaging/{id}/status", description: "Delivery status", status: "planned" }
    ]
  },
  {
    num: "16",
    slug: "analytics-reporting",
    name: "Analytics & Reporting",
    ep: 14,
    base: "/v1/analytics",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "A read-only consumption layer for BI metrics, profitability reporting and scheduled, regulator-ready exports. Never writes to operational systems.",
    std: ["OpenTelemetry"],
    eps: [
      { method: "GET", path: "/v1/analytics/metrics", description: "Query metrics", status: "planned" },
      { method: "GET", path: "/v1/reports", description: "List reports", status: "planned" },
      { method: "POST", path: "/v1/reports/schedule", description: "Schedule an export", status: "planned" },
      { method: "GET", path: "/v1/reports/{id}/download", description: "Download a report", status: "planned" }
    ]
  },
  {
    num: "17",
    slug: "partner-settlement",
    name: "Partner & Settlement",
    ep: 9,
    base: "/v1/partners",
    ver: "v1",
    auth: "Bearer token · tenant from claims",
    rate: "Not enforced",
    ov: "Partner, MVNA/MNO and interconnect settlement with statements, discrepancies and dispute handling.",
    std: ["GSMA TAP3", "NRTRDE"],
    eps: [
      { method: "GET", path: "/v1/partners", description: "List partners", status: "planned" },
      { method: "GET", path: "/v1/settlement/statements", description: "Settlement statements", status: "planned" },
      { method: "POST", path: "/v1/settlement/disputes", description: "Raise a settlement dispute", status: "planned" }
    ]
  },
  {
    num: "18",
    slug: "webhooks-events",
    name: "Webhooks & Events",
    ep: 7,
    base: "/v1/webhooks",
    ver: "v1",
    auth: "OAuth2 · integration:events:publish",
    rate: "Not enforced",
    ov: "Event subscriptions using the canonical event envelope, with idempotent delivery, retries and replay.",
    std: ["CloudEvents", "OpenAPI 3.0"],
    eps: [
      { method: "POST", path: "/v1/webhooks", description: "Register a webhook", status: "planned" },
      { method: "GET", path: "/v1/webhooks", description: "List subscriptions", status: "planned" },
      { method: "POST", path: "/v1/webhooks/{id}/replay", description: "Replay events (idempotent)", status: "planned" },
      { method: "GET", path: "/v1/events/schema", description: "Canonical event envelope schema", status: "planned" }
    ]
  }
];

export default function PortalConnectionPage() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("q") || "";
    }
    return "";
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const idx = DOMAINS.findIndex((d) => d.slug === hash);
      if (idx !== -1) {
        setActiveIdx(idx);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectDomain = (idx: number) => {
    setActiveIdx(idx);
    const domain = DOMAINS[idx];
    window.location.hash = domain.slug;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getMethodClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40";
      case "POST":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40";
      case "PUT":
        return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40";
      case "PATCH":
        return "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900/40";
      case "DELETE":
        return "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40";
      default:
        return "text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900 border-slate-200";
    }
  };

  // `d.ep` is the intended size of each domain, not what is deployed. Summing it
  // and labelling the result "Endpoints" told a visitor 230 endpoints were
  // available. Counted from the listed routes and their real status instead.
  const listedEndpoints = DOMAINS.reduce((sum, d) => sum + d.eps.length, 0);
  const availableEndpoints = DOMAINS.reduce(
    (sum, d) => sum + d.eps.filter((e) => e.status === "available").length,
    0,
  );
  const activeDomain = DOMAINS[activeIdx];
  const prevDomain = DOMAINS[(activeIdx - 1 + DOMAINS.length) % DOMAINS.length];
  const nextDomain = DOMAINS[(activeIdx + 1) % DOMAINS.length];

  // Filtering domains based on search query
  const filteredDomains = DOMAINS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ov.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.eps.some(
        (e) =>
          e.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className={`${theme} min-h-screen transition-colors duration-150`}>
      <div className="bg-[#F5F8FC] dark:bg-[#05101D] text-[#13243A] dark:text-[#EAF2FA] min-h-screen flex flex-col font-sans antialiased selection:bg-sky-500/20">
        
        {/* Hero Section */}
        <div className="max-w-[1200px] mx-auto px-6 w-full pt-10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-[70ch]">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1668B8] dark:text-[#3E97E0] uppercase tracking-widest font-mono">
              <span className="size-2 rounded-full bg-[#7BC144]"></span>
              Developer Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-[#13243A] dark:text-white">
              Sovereign API Domains
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-[15px] leading-relaxed">
              18 domains covering the monetization lifecycle. Select a domain to explore its endpoints, authentication
              and standards.
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-[13px] leading-relaxed">
              Endpoints are marked <span className="font-semibold text-emerald-700 dark:text-emerald-400">Live</span>{" "}
              where they are callable today, and{" "}
              <span className="font-semibold text-slate-600 dark:text-slate-300">Planned</span> where they describe
              intended surface. Build against Live only — the API reference is the contract, this page is the map.
            </p>
          </div>

          {/* Quick stats grid */}
          <div className="flex gap-6 flex-wrap shrink-0 border-t border-slate-200 dark:border-slate-800 md:border-t-0 pt-6 md:pt-0">
            <div>
              <span className="text-xl font-extrabold text-[#13243A] dark:text-white">18</span>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1">Domains</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#13243A] dark:text-white">{availableEndpoints}</span>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1">
                Live endpoints
              </span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#13243A] dark:text-white">v1</span>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1">API version</span>
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#13243A] dark:text-white">99.99%</span>
              <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 font-semibold mt-1">Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* Domains tabs & details main section */}
        <div className="max-w-[1200px] mx-auto px-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 pt-2 items-start">
          
          {/* Left panel sidebar (tablist) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 lg:sticky lg:top-24 self-start max-h-[calc(100vh-140px)] lg:overflow-y-auto pr-1">
            {/* Search Input Box + Theme Toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search API endpoints..."
                  className="w-full bg-white dark:bg-[#0C2236] border border-[#DCE5EF] dark:border-[#1E3B56] rounded-xl px-4 py-3 pl-10 text-[13.5px] text-[#13243A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1668B8]/30 transition-all shadow-sm"
                />
                <svg className="absolute left-3.5 top-3.5 w-4 h-4 stroke-slate-400 dark:stroke-slate-500 fill-none" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7" strokeWidth="2.2" />
                  <path d="m21 21-4.3-4.3" strokeWidth="2.2" />
                </svg>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-11 h-11 flex items-center justify-center shrink-0 rounded-xl border border-[#DCE5EF] dark:border-[#1E3B56] bg-white dark:bg-[#0C2236] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 shadow-sm transition-all active:scale-95"
              >
                {theme === "light" ? (
                  <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                  </svg>
                ) : (
                  <svg className="w-[18px] h-[18px] fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0" role="tablist">
              {filteredDomains.map((d) => {
                const isSelected = activeDomain.slug === d.slug;
                const idx = DOMAINS.findIndex((item) => item.slug === d.slug);

                return (
                  <button
                    key={d.slug}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectDomain(idx)}
                    className={`flex items-center gap-3.5 text-left border rounded-xl px-4 py-3 shrink-0 lg:shrink-1 transition-all ${
                      isSelected
                        ? "bg-white dark:bg-[#0C2236] border-[#DCE5EF] dark:border-[#1E3B56] text-[#13243A] dark:text-white shadow-[0_10px_30px_-16px_rgba(11,60,99,0.15)] ring-1 ring-sky-500/10"
                        : "bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-dashed hover:border-slate-300/60 dark:hover:border-slate-800"
                    }`}
                  >
                    <span className={`font-mono text-xs font-semibold ${isSelected ? "text-[#1668B8] dark:text-[#3E97E0]" : "text-slate-400"}`}>
                      {d.num}
                    </span>
                    <span className="text-[13px] font-bold tracking-tight truncate max-w-[170px] lg:max-w-none">
                      {d.name}
                    </span>
                    <span
                      className={`font-mono text-[9.5px] font-bold border rounded-full px-2 py-0.5 ml-auto hidden sm:inline-block transition-colors ${
                        isSelected
                          ? "text-[#1668B8] bg-sky-50 dark:text-[#3E97E0] dark:bg-sky-950/50 border-sky-200 dark:border-sky-900/30"
                          : "text-slate-400 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {d.ep}
                    </span>
                  </button>
                );
              })}
              {filteredDomains.length === 0 && (
                <div className="text-slate-400 dark:text-slate-500 text-xs text-center py-8">
                  No domains match your search queries.
                </div>
              )}
            </div>
          </div>

          {/* Right active domain details panel */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0C2236] border border-[#DCE5EF] dark:border-[#1E3B56] rounded-2xl p-8 lg:p-10 shadow-[0_10px_30px_-16px_rgba(11,60,99,0.15)] dark:shadow-none min-h-[580px] flex flex-col transition-all">
            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 dark:border-slate-800/80 pb-6">
              <div>
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold block mb-1">
                  API Domain {activeDomain.num}
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#13243A] dark:text-white">
                  {activeDomain.name}
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold text-[#1668B8] dark:text-[#3E97E0] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/40 rounded-full px-3 py-1 uppercase tracking-wider">
                {activeDomain.ep} Endpoints
              </span>
            </div>

            <p className="text-[#4D5E72] dark:text-slate-300 mt-6 text-[15px] leading-relaxed max-w-[72ch]">
              {activeDomain.ov}
            </p>

            {/*
              A domain with nothing live has an aspirational base path too — the
              namespace is not served, so presenting it as somewhere to send a
              request is the same mistake the endpoint list made. Said once, at
              the top, rather than left for the reader to infer from every row
              being marked Planned.
            */}
            {activeDomain.eps.every((e) => e.status === "planned") && (
              <div className="mt-6 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
                <p className="text-[13px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold">Not yet available.</span> Nothing under{" "}
                  <code className="font-mono text-[12px]">{activeDomain.base}</code> is served today — this domain
                  describes intended surface. The endpoints below are listed for planning; none is callable.
                </p>
              </div>
            )}

            {/* Base Path Display */}
            <div className="mt-4 bg-[#082C49] dark:bg-[#061A2C] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-[13px] text-[#EAF2FB] overflow-x-auto shadow-inner">
              <span className="text-[#8AA0B6] text-[10.5px] uppercase tracking-wider font-semibold mr-4">Base</span>
              <code
                className={`font-bold tracking-wide flex-1 ${
                  activeDomain.eps.every((e) => e.status === "planned") ? "text-[#8AA0B6]" : "text-[#bff0a0]"
                }`}
              >
                {activeDomain.base}
              </code>
            </div>

            {/* Meta Grid info boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
              <div className="bg-slate-50 dark:bg-[#0E2840] border border-[#DCE5EF] dark:border-[#1E3B56] rounded-xl p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">Version</span>
                <span className="text-[13px] font-bold text-[#13243A] dark:text-white block mt-1">{activeDomain.ver}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0E2840] border border-[#DCE5EF] dark:border-[#1E3B56] rounded-xl p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">Authentication</span>
                <span className="text-[13px] font-bold text-[#13243A] dark:text-white block mt-1 truncate" title={activeDomain.auth}>{activeDomain.auth}</span>
              </div>
              <div className="bg-slate-50 dark:bg-[#0E2840] border border-[#DCE5EF] dark:border-[#1E3B56] rounded-xl p-3.5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">Rate Limit</span>
                <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 block mt-1">{activeDomain.rate}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 leading-snug">
                  No throttling is applied to inbound requests today. Do not design against a quota.
                </span>
              </div>
            </div>

            {/* Specification chips */}
            <div className="flex flex-wrap gap-2 mt-4.5">
              {activeDomain.std.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0e2840] border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 font-semibold"
                >
                  <span className="size-1.5 rounded-full bg-[#7BC144]"></span>
                  {s}
                </span>
              ))}
            </div>

            {/* Endpoints title section */}
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mt-8 mb-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
              Key Endpoints
              <span className="font-normal text-slate-400 lowercase italic ml-1">
                · {activeDomain.eps.filter((e) => e.status === "available").length} of{" "}
                {activeDomain.eps.length} listed are live today
              </span>
            </div>

            {/* Endpoint cards list */}
            <div className="flex flex-col border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              {activeDomain.eps.map((e, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-[#0e2840]/30 transition-colors"
                >
                  <span className={`font-mono text-[10px] font-bold tracking-wider border rounded px-2.5 py-0.5 text-center flex-none min-w-[62px] ${getMethodClass(e.method)}`}>
                    {e.method}
                  </span>
                  <code
                    className={`font-mono text-[13px] break-all ${
                      e.status === "available"
                        ? "text-[#13243A] dark:text-sky-300"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {e.path}
                  </code>
                  <span
                    className={`font-mono text-[9px] font-bold uppercase tracking-wider border rounded px-1.5 py-0.5 flex-none ${
                      e.status === "available"
                        ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/40"
                        : "border-slate-300 text-slate-500 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-900/40"
                    }`}
                    title={
                      e.status === "available"
                        ? "Callable on the platform today"
                        : "Described surface — not deployed yet"
                    }
                  >
                    {e.status === "available" ? "Live" : "Planned"}
                  </span>
                  <span className="text-[13px] text-slate-400 dark:text-slate-500 sm:ml-auto text-left sm:text-right truncate max-w-[280px]">
                    {e.description}
                  </span>
                </div>
              ))}
            </div>

            {/* Main Action buttons */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#"
                className="inline-flex items-center gap-2 font-bold bg-[#1668B8] hover:bg-[#2B7EC1] text-white rounded-xl px-5 h-11 text-sm shadow-sm transition-all active:scale-95"
              >
                View full API reference
                <svg className="w-4 h-4 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center font-bold bg-transparent hover:bg-slate-50 dark:hover:bg-[#0e2840]/30 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-xl px-5 h-11 text-sm transition-all active:scale-95"
              >
                Try in sandbox
              </a>
            </div>

            {/* Previous/Next Domain Panel Navigation buttons */}
            <div className="flex justify-between items-center gap-4 mt-auto pt-10 border-t border-slate-100 dark:border-slate-800/80 mt-12">
              <button
                onClick={() => {
                  const idx = DOMAINS.findIndex((d) => d.slug === prevDomain.slug);
                  selectDomain(idx);
                }}
                className="flex flex-col text-left group max-w-[48%] border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl p-2.5 transition-all"
              >
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block mb-1">
                  ← Previous
                </span>
                <span className="text-[13px] font-bold text-[#13243A] dark:text-slate-300 group-hover:text-[#1668B8] dark:group-hover:text-[#3E97E0] transition-colors truncate max-w-[180px]">
                  {prevDomain.num} · {prevDomain.name}
                </span>
              </button>

              <button
                onClick={() => {
                  const idx = DOMAINS.findIndex((d) => d.slug === nextDomain.slug);
                  selectDomain(idx);
                }}
                className="flex flex-col items-end text-right group max-w-[48%] border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl p-2.5 transition-all"
              >
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block mb-1">
                  Next →
                </span>
                <span className="text-[13px] font-bold text-[#13243A] dark:text-slate-300 group-hover:text-[#1668B8] dark:group-hover:text-[#3E97E0] transition-colors truncate max-w-[180px]">
                  {nextDomain.num} · {nextDomain.name}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
