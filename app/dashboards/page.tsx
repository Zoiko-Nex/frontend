"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSession } from "@/lib/admin/session";

interface DomainService {
  id: string;
  name: string;
  version: string;
  description: string;
  badges: string[];
  active: boolean;
  iconPath: string;
}

export default function DashboardsPage() {
  const [sessionData, setSessionData] = useState<{ email?: string; tenantId?: string }>({});
  const [onlineCount, setOnlineCount] = useState(18);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Modal states for API client
  const [selectedService, setSelectedService] = useState<DomainService | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [requestPath, setRequestPath] = useState<string>("");
  const [requestMethod, setRequestMethod] = useState<string>("GET");
  const [requestHeaders, setRequestHeaders] = useState<string>("");
  const [requestBody, setRequestBody] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  // Active Console View state (Tenant Admin, Super Admin, Customer Self-Service)
  const [currentConsole, setCurrentConsole] = useState<"tenant-admin" | "super-admin" | "customer-portal">("tenant-admin");
  
  // State-bound list of the 18 BSS/OSS domains
  const [services, setServices] = useState<DomainService[]>([
    // Monetization & Revenue
    {
      id: "prod-catalog",
      name: "Product Catalog",
      version: "MONETIZATION · V4.6",
      description: "Plans, bundles, add-ons, eligibility, and versioned offer management.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/services.svg"
    },
    {
      id: "rt-charging",
      name: "Real-Time Charging",
      version: "MONETIZATION · V4.5",
      description: "Online charging, balances, policy, and real-time authorization.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/charging-lightning.svg"
    },
    {
      id: "rating-engine",
      name: "Rating & Pricing Engine",
      version: "MONETIZATION · V4.6",
      description: "Usage rating, tiering, discounts, and real-time price calculation.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/bar-chart.svg"
    },
    {
      id: "billing-invoice",
      name: "Billing & Invoicing",
      version: "MONETIZATION · V4.6",
      description: "Bill cycles, invoicing, dunning, and statements. Template v3 available.",
      badges: ["ACTIVE", "WATCH"],
      active: true,
      iconPath: "/image/dashboard/document.svg"
    },
    {
      id: "payments-collections",
      name: "Payments & Collections",
      version: "MONETIZATION · V4.5",
      description: "Payment methods, gateways, retries, refunds, and reconciliation.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/credit-card.svg"
    },
    {
      id: "partner-settlement",
      name: "Partner & Settlement",
      version: "MONETIZATION · V4.3",
      description: "Wholesale, interconnect, revenue share, and partner settlement.",
      badges: ["PROVISIONING"],
      active: false,
      iconPath: "/image/dashboard/user-profile.svg"
    },

    // Customer & Engagement
    {
      id: "cust-lifecycle",
      name: "Customer Lifecycle",
      version: "MONETIZATION · V4.6",
      description: "Accounts, subscriptions, lifecycle states, and self-care across brands.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/user-profile.svg"
    },
    {
      id: "notifications-campaigns",
      name: "Notifications & Campaigns",
      version: "ENGAGEMENT · V4.1",
      description: "Transactional and campaign messaging across SMS, email, and push.",
      badges: ["AVAILABLE"],
      active: false,
      iconPath: "/image/dashboard/notifications-bell.svg"
    },

    // Connectivity & Provisioning
    {
      id: "esim-sim-mgmt",
      name: "eSIM & SIM Management",
      version: "CONNECTIVITY · V4.3",
      description: "GSMA-aligned eSIM profiles, RSP sync, and SIM lifecycle.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/mobile-sim.svg"
    },
    {
      id: "iot-connectivity",
      name: "IoT Connectivity",
      version: "CONNECTIVITY · V4.2",
      description: "Device fleet orchestration, usage aggregation, and remote actions.",
      badges: ["AVAILABLE"],
      active: false,
      iconPath: "/image/dashboard/settings-compass.svg"
    },
    {
      id: "number-inventory",
      name: "Number & Inventory",
      version: "CONNECTIVITY · V4.4",
      description: "Number ranges, porting, reservation, and resource inventory.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/services.svg"
    },

    // Compliance & Trust
    {
      id: "taxation-regulatory",
      name: "Taxation & Regulatory",
      version: "COMPLIANCE · V4.4",
      description: "Jurisdiction tax logic, regulatory fees, and exemptions.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/shield.svg"
    },
    {
      id: "compliance-kyc",
      name: "Compliance & KYC",
      version: "COMPLIANCE · V4.4",
      description: "Identity verification, sanctions screening, and onboarding checks.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/shield-check.svg"
    },
    {
      id: "evidence-ledger",
      name: "Evidence Ledger",
      version: "COMPLIANCE · V4.5",
      description: "Immutable evidence of charging, billing, and governance events.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/document.svg"
    },

    // Intelligence
    {
      id: "ai-gov-controls",
      name: "AI Governance & Controls",
      version: "INTELLIGENCE · V4.2",
      description: "Tiered AI controls with human approval for material actions.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/code-tags.svg"
    },
    {
      id: "analytics-reporting",
      name: "Analytics & Reporting",
      version: "INTELLIGENCE · V4.6",
      description: "Operational dashboards, revenue assurance, and exports.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/bar-chart.svg"
    },

    // Platform & Integration
    {
      id: "mediation-usage",
      name: "Mediation & Usage",
      version: "PLATFORM · V4.5",
      description: "CDR ingestion, normalization, deduplication, and enrichment.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/activity-pulse.svg"
    },
    {
      id: "api-gateway",
      name: "API Gateway & Developer",
      version: "PLATFORM · V2.0",
      description: "Authenticated APIs, rate limits, webhooks, and developer keys.",
      badges: ["ACTIVE", "HEALTHY"],
      active: true,
      iconPath: "/image/dashboard/api-braces.svg"
    }
  ]);

  // Load session context and poll backend health checks and logs
  useEffect(() => {
    const session = getSession();
    if (session) {
      setSessionData({ email: session.email, tenantId: session.tenantId });
    }

    const serviceMapping: Record<string, string> = {
      "prod-catalog": "product-catalogue-commercial",
      "rt-charging": "rating-charging",
      "rating-engine": "rating-charging",
      "billing-invoice": "billing-invoice",
      "payments-collections": "payments",
      "partner-settlement": "partner-settlement",
      "cust-lifecycle": "customer-account",
      "notifications-campaigns": "integration-ecosystem",
      "esim-sim-mgmt": "order-management-provisioning",
      "iot-connectivity": "order-management-provisioning",
      "number-inventory": "order-management-provisioning",
      "taxation-regulatory": "tax-jurisdiction",
      "compliance-kyc": "custmr-lfc-kyc",
      "evidence-ledger": "evidence-ledger",
      "ai-gov-controls": "reporting-regulatory",
      "analytics-reporting": "reporting-regulatory",
      "mediation-usage": "usage-ingestion-mediation",
      "api-gateway": "integration-ecosystem"
    };

    const checkBackendServices = async () => {
      try {
        const healthRes = await fetch("/api/health");
        if (healthRes.ok) {
          const healthData = await healthRes.json() as Record<string, boolean>;
          
          const activePorts = Object.values(healthData).filter(Boolean).length;
          setOnlineCount(activePorts);

          setServices((prev) =>
            prev.map((s) => {
              const backendService = serviceMapping[s.id];
              const isOnline = healthData[backendService];

              if (isOnline) {
                let nextBadges = [...s.badges];
                if (!nextBadges.includes("INTEGRATED")) nextBadges.push("INTEGRATED");
                if (!nextBadges.includes("ACTIVE")) nextBadges.push("ACTIVE");
                if (!nextBadges.includes("HEALTHY")) nextBadges.push("HEALTHY");
                
                nextBadges = nextBadges.filter(b => b !== "AVAILABLE" && b !== "PROVISIONING");

                return {
                  ...s,
                  active: true,
                  badges: Array.from(new Set(nextBadges))
                };
              } else {
                let nextBadges = [...s.badges].filter(b => b !== "INTEGRATED" && b !== "ACTIVE" && b !== "HEALTHY");
                const defaultActive = s.id !== "partner-settlement" && s.id !== "notifications-campaigns" && s.id !== "iot-connectivity";

                if (s.id === "partner-settlement" && !nextBadges.includes("PROVISIONING")) {
                   nextBadges.push("PROVISIONING");
                } else if ((s.id === "notifications-campaigns" || s.id === "iot-connectivity") && !nextBadges.includes("AVAILABLE")) {
                   nextBadges.push("AVAILABLE");
                } else if (defaultActive) {
                   if (!nextBadges.includes("ACTIVE")) nextBadges.push("ACTIVE");
                   if (!nextBadges.includes("HEALTHY")) nextBadges.push("HEALTHY");
                }

                return {
                  ...s,
                  active: defaultActive,
                  badges: Array.from(new Set(nextBadges))
                };
              }
            })
          );
        }
      } catch (err) {
        console.warn("Backend endpoints sync bypassed:", err);
      }

      try {
        const logsRes = await fetch("/api/logs");
        if (logsRes.ok) {
          const logsData = await logsRes.json() as string[];
          setLogs(logsData);
        }
      } catch (err) {
        console.warn("Backend logs fetching bypassed:", err);
      }
    };

    checkBackendServices();
    const intervalId = setInterval(checkBackendServices, 4000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper to toggle domain active state
  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextActive = !s.active;
          let nextBadges = [...s.badges].filter(b => b !== "ACTIVE" && b !== "HEALTHY" && b !== "AVAILABLE" && b !== "PROVISIONING");
          
          if (s.id === "partner-settlement") {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["PROVISIONING", ...nextBadges];
          } else if (s.id === "notifications-campaigns" || s.id === "iot-connectivity") {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["AVAILABLE", ...nextBadges];
          } else {
            nextBadges = nextActive ? ["ACTIVE", "HEALTHY", ...nextBadges] : ["AVAILABLE", ...nextBadges];
          }

          return {
            ...s,
            active: nextActive,
            badges: nextBadges
          };
        }
        return s;
      })
    );
  };

  // Group definitions
  const groups = [
    {
      id: "monetization",
      title: "Monetization & Revenue",
      description: "Catalog, charging, rating, billing, payments, and settlement.",
      serviceIds: ["prod-catalog", "rt-charging", "rating-engine", "billing-invoice", "payments-collections", "partner-settlement"]
    },
    {
      id: "customer",
      title: "Customer & Engagement",
      description: "Lifecycle management and customer communications.",
      serviceIds: ["cust-lifecycle", "notifications-campaigns"]
    },
    {
      id: "connectivity",
      title: "Connectivity & Provisioning",
      description: "SIM/eSIM, IoT fleets, and number inventory.",
      serviceIds: ["esim-sim-mgmt", "iot-connectivity", "number-inventory"]
    },
    {
      id: "compliance",
      title: "Compliance & Trust",
      description: "Tax, KYC, and evidence-grade governance.",
      serviceIds: ["taxation-regulatory", "compliance-kyc", "evidence-ledger"]
    },
    {
      id: "intelligence",
      title: "Intelligence",
      description: "Governed AI and analytics.",
      serviceIds: ["ai-gov-controls", "analytics-reporting"]
    },
    {
      id: "platform",
      title: "Platform & Integration",
      description: "Mediation pipeline and the API gateway.",
      serviceIds: ["mediation-usage", "api-gateway"]
    }
  ];

  // Sidebar items config
  const sidebarItems = [
    { section: "WORKSPACE", items: [
      { label: "Dashboard", tabKey: "Dashboard", iconPath: "/image/dashboard/dashboard-grid.svg" },
      { label: "Services", tabKey: "Services", iconPath: "/image/dashboard/services.svg", badge: "18" },
      { label: "Deployment", tabKey: "Deployment", iconPath: "/image/dashboard/checkmark.svg" }
    ]},
    { section: "EVALUATE & TRUST", items: [
      { label: "Sandbox / POC", tabKey: "Sandbox", iconPath: "/image/dashboard/code-tags.svg" },
      { label: "Trust Vault", tabKey: "Trust", iconPath: "/image/dashboard/shield.svg" },
      { label: "Documentation", tabKey: "Documentation", iconPath: "/image/dashboard/document.svg" }
    ]},
    { section: "OPERATE", items: [
      { label: "Support & Success", tabKey: "Support", iconPath: "/image/dashboard/notifications-bell.svg" },
      { label: "Billing & Commercials", tabKey: "Billing", iconPath: "/image/dashboard/billing-document.svg" },
      { label: "Admin Settings", tabKey: "Settings", iconPath: "/image/dashboard/settings-compass.svg" }
    ]}
  ];

  return (
    <div className="w-full bg-[#f8fafc] min-h-[840px] flex justify-start items-start font-sans">
      
      {/* Left Sidebar Section */}
      <aside className="w-64 h-[840px] relative bg-white border-r-[0.80px] border-slate-200 overflow-hidden shrink-0 select-none">
        
        {/* Sections headers */}
        <div className="w-56 px-3 pt-3.5 pb-1.5 left-[12px] top-[16px] absolute inline-flex flex-col justify-start items-start">
          <div className="justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">WORKSPACE</div>
        </div>
        <div className="w-56 px-3 pt-3.5 pb-1.5 left-[12px] top-[171.25px] absolute inline-flex flex-col justify-start items-start">
          <div className="justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">EVALUATE & TRUST</div>
        </div>
        <div className="w-56 px-3 pt-3.5 pb-1.5 left-[12px] top-[326.50px] absolute inline-flex flex-col justify-start items-start">
          <div className="justify-center text-slate-500 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">OPERATE</div>
        </div>

        {/* Sidebar Footer */}
        <div className="w-56 px-3 pt-3.5 pb-1 left-[12px] top-[497.75px] absolute border-t-[0.80px] border-slate-200 inline-flex flex-col justify-start items-start gap-1.5">
          <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
            <a href="#" className="self-stretch justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Trust Center</a>
          </div>
          <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
            <a href="#" className="self-stretch justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Privacy</a>
          </div>
          <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
            <a href="#" className="self-stretch justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Status page</a>
          </div>
          <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
            <a href="#" className="self-stretch justify-center text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">Support SLA</a>
          </div>
          <div className="self-stretch pt-[1.60px] flex flex-col justify-start items-start">
            <div className="self-stretch justify-center text-slate-500 text-[10px] font-normal font-['IBM_Plex_Mono'] leading-4">Portal v4.2 · Helios tenant</div>
          </div>
        </div>

        {/* Sidebar buttons */}
        <button className="w-56 px-3 py-2.5 left-[12px] top-[51.25px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="size-1.5 left-[2.25px] top-[2.25px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
            <div className="w-1.5 h-1 left-[10.50px] top-[2.25px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
            <div className="size-1.5 left-[10.50px] top-[9px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
            <div className="w-1.5 h-1 left-[2.25px] top-[12px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Dashboard</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[91.25px] absolute bg-indigo-50 rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-indigo-100/50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3 h-2.5 left-[3px] top-[3.75px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-sky-700"></div>
            <div className="size-[2.40px] left-[4.80px] top-[2.55px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-sky-700"></div>
            <div className="size-[2.40px] left-[10.80px] top-[7.80px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-sky-700"></div>
            <div className="size-[2.40px] left-[6.30px] top-[13.05px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-sky-700"></div>
          </div>
            <div className="justify-center text-sky-700 text-sm font-semibold font-['Plus_Jakarta_Sans']">Services</div>
            <div className="flex-1 min-w-6 inline-flex flex-col justify-start items-end">
              <div className="size- px-1.5 py-px bg-sky-700 rounded-[20px] flex flex-col justify-start items-start">
                <div className="justify-center text-white text-[10px] font-semibold font-['IBM_Plex_Mono']">{onlineCount}/18</div>
              </div>
            </div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[131.25px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3.5 h-2.5 left-[2.25px] top-[5.25px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Deployment</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[206.50px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3 h-2 left-[3px] top-[4.50px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Sandbox / POC</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[246.50px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3 h-3.5 left-[3px] top-[2.25px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Trust Vault</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[286.50px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-2.5 h-3.5 left-[4.50px] top-[1.50px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Documentation</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[361.75px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="size-3.5 left-[2.25px] top-[1.50px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Support & Success</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[401.75px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3.5 h-2.5 left-[3.75px] top-[3.75px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
            <div className="w-3.5 h-0 left-[2.25px] top-[7.50px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Billing & Commercials</div>
        </button>

        <button className="w-56 px-3 py-2.5 left-[12px] top-[441.75px] absolute rounded-[10px] inline-flex justify-start items-center gap-2.5 hover:bg-slate-50 transition">
          <div className="size-4 relative overflow-hidden">
            <div className="w-3.5 h-2 left-[1.50px] top-[2.25px] absolute outline outline-[1.42px] outline-offset-[-0.71px] outline-slate-600"></div>
          </div>
          <div className="justify-center text-slate-600 text-sm font-semibold font-['Plus_Jakarta_Sans']">Admin Settings</div>
        </button>

      </aside>

      {/* Main Panel Content Frame */}
      <main className="flex-1 px-7 pt-6 pb-14 flex flex-col justify-start items-start bg-slate-50 min-w-0">
        
        <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full">
          
          {/* Main Title Header */}
          <div className="self-stretch inline-flex justify-start items-center">
            <div className="w-[1132px] h-28 relative">
              <div className="w-[704px] left-0 top-[20px] absolute inline-flex flex-col justify-start items-start">
                <div className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
                  {currentConsole === "super-admin"
                    ? "Super Admin Console"
                    : currentConsole === "customer-portal"
                      ? "GoLite Customer Portal"
                      : "Telecom services"
                  }
                </div>
              </div>
              <div className="w-[704px] max-w-[717.36px] pt-px left-0 top-[60px] absolute inline-flex flex-col justify-start items-start">
                <div className="w-[902px] justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                  {currentConsole === "super-admin"
                    ? "Global operational command plane for governing tenants, platform integrity, and global infrastructure health."
                    : currentConsole === "customer-portal"
                      ? "White-label customer operating portal for managing connectivity plans, data usage, billing, and credentials."
                      : "Your 18 OSS/BSS domains, organized into six working groups. Toggle activation, check health, and open any service to configure it."
                  }
                </div>
                {currentConsole === "tenant-admin" && (
                  <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50/50 border border-indigo-100/50 rounded-lg px-2.5 py-1 select-none">
                    <span className={`inline-block size-2 rounded-full ${onlineCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                    <span className="text-slate-600 text-[11px] font-semibold font-['IBM_Plex_Mono']">
                      {onlineCount === 18 
                        ? "All 18 TM Forum-aligned Microservices Connected" 
                        : `${onlineCount}/18 Microservices Connected`
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* View Switcher dropdown */}
              <div className="absolute right-0 top-[20px] inline-flex items-center gap-2.5 z-10">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Console View:</span>
                <select
                  value={currentConsole}
                  onChange={(e) => {
                    setCurrentConsole(e.target.value as any);
                    setApiResponse(null);
                    setSelectedService(null);
                  }}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-bold bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="tenant-admin">Tenant Admin Console</option>
                  <option value="super-admin">Super Admin Console</option>
                  <option value="customer-portal">Customer Self-Service</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tenant Admin view body */}
          {currentConsole === "tenant-admin" && (
            <div className="self-stretch flex flex-col justify-start items-start gap-10 w-full transition-all duration-300">
              {/* Working groups */}
              <div className="self-stretch flex flex-col justify-start items-start gap-10 w-full">
                {groups.map((group) => {
                  const groupServices = services.filter((s) => group.serviceIds.includes(s.id));
                  const activeCount = groupServices.filter((s) => s.active).length;
                  const totalCount = groupServices.length;

                  return (
                    <div key={group.id} className="self-stretch flex flex-col justify-start items-start gap-3.5 w-full">
                      
                      {/* Group Header */}
                      <div className="self-stretch inline-flex justify-start items-end gap-2.5 w-full">
                        <div className="justify-center text-slate-800 text-base font-extrabold font-['Plus_Jakarta_Sans'] leading-6">{group.title}</div>
                        <div className="px-2 py-[2.80px] bg-slate-100 rounded-md outline outline-1 outline-offset-[-1px] outline-slate-200/50 flex justify-start items-center gap-[5px]">
                          <div className="justify-center text-slate-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">
                            {activeCount}/{totalCount} active
                          </div>
                        </div>
                      </div>

                      {/* Cards Grid */}
                      <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[25px] w-full">
                        {groupServices.map((service) => {
                          const isProvisioning = service.id === "partner-settlement" && !service.active;

                          return (
                            <div
                              key={service.id}
                              className="bg-white rounded-2xl border border-slate-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col justify-between p-6 hover:shadow-md transition duration-300 min-h-[220px]"
                            >
                              <div className="self-stretch flex flex-col justify-start items-start w-full">
                                {/* Card Header */}
                                <div className="self-stretch inline-flex justify-start items-center gap-3.5 w-full">
                                  <div className="p-3 bg-indigo-50/50 border border-indigo-100/50 rounded-xl flex justify-center items-center shrink-0 text-sky-700">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={service.iconPath} />
                                    </svg>
                                  </div>
                                  <div className="flex-1 inline-flex flex-col justify-start items-start">
                                    <div className="justify-center text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">{service.name}</div>
                                    <div className="justify-center text-slate-400 text-[9.50px] font-normal font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide mt-0.5">
                                      MONETIZATION · {service.version}
                                    </div>
                                  </div>
                                </div>

                                {/* Badges */}
                                <div className="self-stretch pt-3.5 flex flex-wrap justify-start items-start gap-1.5 w-full">
                                  {service.badges.map((badge) => {
                                    let badgeStyle = "bg-slate-50 text-slate-500 outline-slate-200/50";
                                    let icon = null;

                                    if (badge === "ACTIVE") {
                                      badgeStyle = "bg-indigo-50 text-sky-700 outline-sky-700/30";
                                      icon = (
                                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      );
                                    } else if (badge === "HEALTHY") {
                                      badgeStyle = "bg-stone-200/50 text-lime-600 outline-lime-500/30";
                                      icon = (
                                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      );
                                    } else if (badge === "WATCH") {
                                      badgeStyle = "bg-orange-100/60 text-yellow-600 outline-yellow-600/40";
                                      icon = (
                                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 2V6M5 8H5.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      );
                                    } else if (badge === "PROVISIONING") {
                                      badgeStyle = "bg-indigo-500/10 text-indigo-500 outline-indigo-500/40";
                                      icon = (
                                        <svg className="w-2.5 h-2.5 shrink-0 animate-spin" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 2V4M5 6V8M2 5H4M6 5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      );
                                    } else if (badge === "AVAILABLE") {
                                      badgeStyle = "bg-stone-50 text-slate-500 outline-slate-200/50";
                                      icon = (
                                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M5 2V8M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      );
                                    }

                                    return (
                                      <div
                                        key={badge}
                                        className={`px-2 pt-[2.50px] pb-[3.10px] rounded-md outline outline-1 outline-offset-[-1px] flex justify-start items-center gap-[5px] text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide ${badgeStyle}`}
                                      >
                                        {icon}
                                        <div>{badge}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Description */}
                              <div className="self-stretch pt-2.5 flex flex-col justify-start items-start">
                                <div className="self-stretch flex flex-col justify-start items-start">
                                  <div className="self-stretch text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5 min-h-[40px]">
                                    {service.description}
                                  </div>
                                </div>
                              </div>

                              {/* Footer Actions */}
                              <div className="self-stretch pt-3.5 flex flex-col justify-start items-start">
                                <div className="self-stretch pt-3 border-t-[0.80px] border-slate-200 inline-flex justify-start items-center gap-2.5 w-full">
                                  {isProvisioning ? (
                                    <div className="px-2 py-[2.80px] bg-indigo-500/10 rounded-md outline outline-1 outline-offset-[-1px] outline-indigo-500/40 flex justify-start items-center gap-[5px] text-indigo-500">
                                      <svg className="w-2.5 h-2.5 shrink-0 animate-spin" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 2V4M5 6V8M2 5H4M6 5H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <div className="justify-center text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">PROVISIONING</div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => handleToggle(service.id)}
                                      className={`w-10 h-6 relative cursor-pointer rounded-[999px] transition-colors duration-300 flex flex-col justify-start items-start py-[3px] px-[3px] shrink-0 ${
                                        service.active ? "bg-lime-600 pl-5 pr-[3px]" : "bg-slate-200 pl-[3px] pr-5"
                                      }`}
                                    >
                                      <div className="size-4 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30)] transition-all duration-300"></div>
                                    </div>
                                  )}

                                  <div className="flex-1 min-w-20 inline-flex flex-col justify-start items-end">
                                    <button
                                      onClick={() => {
                                        setSelectedService(service);
                                        setRequestMethod("GET");
                                        setRequestPath("/health");
                                        setRequestHeaders(`{\n  "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460"\n}`);
                                        setRequestBody("");
                                        setApiResponse(null);
                                        setSelectedEndpoint("");
                                      }}
                                      className="px-3 py-1.5 bg-slate-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-center items-center hover:bg-slate-100 transition"
                                    >
                                      <div className="text-center justify-center text-slate-600 text-xs font-bold font-['Plus_Jakarta_Sans']">Manage</div>
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Super Admin view body */}
          {currentConsole === "super-admin" && (
            <div className="self-stretch flex flex-col gap-6 w-full transition-all duration-300">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tenants</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-1">12</span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1">▲ +2 this month</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-1">2,408,190</span>
                  <span className="text-xs text-emerald-600 font-semibold mt-1">▲ +12.4% YoY</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global MRR</span>
                  <span className="text-3xl font-extrabold text-slate-800 mt-1">$18,402,900</span>
                  <span className="text-xs text-slate-500 mt-1">Convergent Mediated Feed</span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-rose-100 bg-rose-50/10 shadow-sm flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Failed Provisioning</span>
                  <span className="text-3xl font-extrabold text-rose-600 mt-1">4</span>
                  <span className="text-xs text-rose-500 font-semibold mt-1">● 4 manual holds</span>
                </div>
              </div>

              {/* Tenants Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Active Tenant Registry (Multi-Tenant Estate)</span>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono font-semibold">100% Isolation Enforced</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3">Tenant Name</th>
                        <th className="px-6 py-3">Market</th>
                        <th className="px-6 py-3">Primary Domain</th>
                        <th className="px-6 py-3">Subscribers</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-700">Acme Corporation</td>
                        <td className="px-6 py-4">US-NY (Telecom-Tax)</td>
                        <td className="px-6 py-4 font-mono text-xs">acme.zoikonex.com</td>
                        <td className="px-6 py-4">1.2M</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-700">SilverX Mobile</td>
                        <td className="px-6 py-4">UK (VAT-Compliant)</td>
                        <td className="px-6 py-4 font-mono text-xs">silverx.zoikonex.com</td>
                        <td className="px-6 py-4">850K</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-700">GoLite Connectivity</td>
                        <td className="px-6 py-4">EU (GDPR-Regulated)</td>
                        <td className="px-6 py-4 font-mono text-xs">golite.zoikonex.com</td>
                        <td className="px-6 py-4">350K</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold font-mono">ONLINE</span></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-700">DriverX Telematics</td>
                        <td className="px-6 py-4">DE (IoT Fleet)</td>
                        <td className="px-6 py-4 font-mono text-xs">driverx.zoikonex.com</td>
                        <td className="px-6 py-4">8,190</td>
                        <td className="px-6 py-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-bold font-mono">DEGRADED</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Platform Activity Feed */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Platform Infrastructure Orchestration</h4>
                <div className="space-y-3 font-mono text-xs text-slate-500">
                  <div className="flex items-center gap-2"><span className="text-emerald-500">●</span> [16:01:22] [GLOBAL] Kubernetes cluster nodes healthy. Pod replication factor 3x.</div>
                  <div className="flex items-center gap-2"><span className="text-indigo-500">○</span> [15:58:10] [IDENTITY] Seeding check completed for tenant Acme Corporation.</div>
                  <div className="flex items-center gap-2"><span className="text-rose-500">■</span> [15:45:00] [PROVISIONING] eSIM provision timeout for subscriber ID sub-0987. Escalated to Saga Action Queue.</div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Portal view body */}
          {currentConsole === "customer-portal" && (
            <div className="self-stretch flex flex-col gap-6 w-full transition-all duration-300">
              {/* Conditional Action Centre Alert */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div className="flex-1 font-sans">
                  <h4 className="text-sm font-bold text-slate-800">Action Required: KYC Verification Pending</h4>
                  <p className="text-xs text-slate-600 mt-1">We need you to complete identity verification to activate your pending eSIM profile. Please upload a passport copy below.</p>
                  
                  {/* Simple Interactive Action form inside the alert */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => alert("Simulating Passport OCR Verification Saga...")}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow"
                    >
                      Upload Passport Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Plan Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Service Line</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">+1 (212) 555-0199</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-sans">Plan: GoLite Premium 5G Unlimited</p>
                  </div>
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Data Usage (25 GB Limit)</span>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>18.4 GB Used</span>
                      <span>6.6 GB Left</span>
                    </div>
                  </div>
                </div>

                {/* Balance Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prepaid Balance Wallet</span>
                    <h3 className="text-3xl font-extrabold text-slate-800 mt-1">$15.00</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-sans">Status: Active</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={async () => {
                        alert("Adding $10.00 to prepaid wallet via Payments API on port 8096...");
                      }}
                      className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition text-center"
                    >
                      Top Up $10.00
                    </button>
                  </div>
                </div>

                {/* Latest Invoice Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest Issued Invoice</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">$45.00</h3>
                    <p className="text-xs text-rose-500 font-semibold mt-0.5 font-sans">Due: July 15, 2026</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => alert("Showing immutable invoice breakdown (TMF678)")}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition text-center"
                    >
                      View Charges
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* Live Integration Logs Terminal */}
          <section className="self-stretch mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono text-slate-300 w-full shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Live Integration Logs</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-sans">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Streaming
              </div>
            </div>
            
            <div className="h-64 overflow-y-auto flex flex-col gap-1 text-[11px] leading-5">
              {logs.length > 0 ? (
                logs.map((log, idx) => {
                  let lineClass = "text-slate-300";
                  if (log.includes("ERROR") || log.includes("status\":4") || log.includes("status\":5") || log.includes("status\": 4") || log.includes("status\": 5")) {
                    lineClass = "text-rose-400";
                  } else if (log.includes("level\":\"WARN\"")) {
                    lineClass = "text-amber-400";
                  } else if (log.includes("level\":\"INFO\"") || log.includes("status\":2") || log.includes("status\": 2") || log.includes("gRPC server starting")) {
                    lineClass = "text-emerald-400/90";
                  }

                  return (
                    <div key={idx} className={`hover:bg-slate-800/40 px-2 py-0.5 rounded transition ${lineClass} break-all`}>
                      {log}
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-500 italic text-center pt-24">No live logs received from backend. Check docker compose status.</div>
              )}
            </div>
          </section>

        </div>

      </main>

      {/* Live Service Management Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${selectedService.active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                  Manage: {selectedService.name}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Microservice Port: {selectedServicePort[selectedService.id]} · Status: {selectedService.active ? "ONLINE" : "OFFLINE"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedService(null);
                  setApiResponse(null);
                  setSelectedEndpoint("");
                }}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              
              {/* Endpoint Template Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select API Endpoint Template</label>
                <select
                  value={selectedEndpoint}
                  onChange={(e) => {
                    const idx = e.target.value === "" ? -1 : parseInt(e.target.value);
                    setSelectedEndpoint(e.target.value);
                    if (idx >= 0) {
                      const template = endpointTemplates[selectedService.id]?.[idx];
                      if (template) {
                        setRequestMethod(template.method);
                        setRequestPath(template.path);
                        setRequestHeaders(JSON.stringify(template.headers, null, 2));
                        setRequestBody(template.body ? JSON.stringify(template.body, null, 2) : "");
                      }
                    } else {
                      setRequestMethod("GET");
                      setRequestPath("/health");
                      setRequestHeaders(`{\n  "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460"\n}`);
                      setRequestBody("");
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-sans"
                >
                  <option value="">-- Custom Endpoint / Health Check --</option>
                  {endpointTemplates[selectedService.id]?.map((tmpl, idx) => (
                    <option key={idx} value={idx}>{tmpl.label}</option>
                  ))}
                </select>
              </div>

              {/* Method & Path inputs */}
              <div className="flex gap-3">
                <div className="w-24">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Method</label>
                  <select
                    value={requestMethod}
                    onChange={(e) => setRequestMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none text-slate-700 font-bold font-mono"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Path</label>
                  <input
                    type="text"
                    value={requestPath}
                    onChange={(e) => setRequestPath(e.target.value)}
                    placeholder="/health"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Headers Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Headers (JSON)</label>
                <textarea
                  value={requestHeaders}
                  onChange={(e) => setRequestHeaders(e.target.value)}
                  rows={3}
                  placeholder='{ "X-Tenant-ID": "uuid" }'
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none font-mono text-slate-700"
                />
              </div>

              {/* Body Editor (only for writing methods) */}
              {(requestMethod === "POST" || requestMethod === "PUT") && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Request Body (JSON)</label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={5}
                    placeholder="{}"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none font-mono text-slate-700"
                  />
                </div>
              )}

              {/* API Response Console */}
              {apiResponse && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">API Response Console</label>
                  <div className={`p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-60 border ${
                    apiResponse.ok ? "bg-slate-900 border-slate-800 text-emerald-400" : "bg-rose-950/20 border-rose-900/30 text-rose-300"
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="font-bold">STATUS: {apiResponse.status} {apiResponse.ok ? "OK" : "ERROR"}</span>
                      <span className="text-[10px] text-slate-500">Universal API Proxy Active</span>
                    </div>
                    <pre>{JSON.stringify(apiResponse.data, null, 2)}</pre>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedService(null);
                  setApiResponse(null);
                  setSelectedEndpoint("");
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition font-bold"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  setApiLoading(true);
                  setApiResponse(null);
                  try {
                    let parsedHeaders = {};
                    if (requestHeaders.trim()) {
                      parsedHeaders = JSON.parse(requestHeaders);
                    }
                    let parsedBody = null;
                    if (requestBody.trim() && (requestMethod === "POST" || requestMethod === "PUT")) {
                      parsedBody = JSON.parse(requestBody);
                    }

                    const port = selectedServicePort[selectedService.id];

                    const res = await fetch("/api/proxy", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        port,
                        method: requestMethod,
                        path: requestPath,
                        headers: parsedHeaders,
                        body: parsedBody
                      })
                    });

                    if (res.ok) {
                      const data = await res.json();
                      setApiResponse(data);
                    } else {
                      setApiResponse({ status: res.status, ok: false, data: "Failed to communicate with proxy service." });
                    }
                  } catch (err) {
                    setApiResponse({ status: 400, ok: false, data: "JSON Parsing Error: " + String(err) });
                  } finally {
                    setApiLoading(false);
                  }
                }}
                disabled={apiLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition shadow flex items-center gap-2"
              >
                {apiLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Executing...
                  </>
                ) : (
                  "Execute API Call"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Config mappings for BSS cockpit API client
const selectedServicePort: Record<string, number> = {
  "prod-catalog": 8082,
  "rt-charging": 8085,
  "rating-engine": 8085,
  "billing-invoice": 8092,
  "payments-collections": 8096,
  "partner-settlement": 8086,
  "cust-lifecycle": 8081,
  "notifications-campaigns": 8097,
  "esim-sim-mgmt": 8083,
  "iot-connectivity": 8083,
  "number-inventory": 8083,
  "taxation-regulatory": 8089,
  "compliance-kyc": 8091,
  "evidence-ledger": 8093,
  "ai-gov-controls": 8098,
  "analytics-reporting": 8098,
  "mediation-usage": 8094,
  "api-gateway": 8097,
};

interface EndpointTemplate {
  label: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: any;
}

const endpointTemplates: Record<string, EndpointTemplate[]> = {
  "prod-catalog": [
    {
      label: "Step 3a: Create Product Specification (POST /v1/products)",
      method: "POST",
      path: "/v1/products",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        product_name: "Premium 5G Unlimited Plan",
        product_type: "DATA",
        charging_model: "RECURRING",
        charge_structure: "FLAT",
        currency_code: "USD",
        tax_category: "TELECOM",
        country_code: "US",
        jurisdiction_code: "US-NY"
      }
    },
    {
      label: "Step 3b: Create Commercial Offer (POST /v1/offers)",
      method: "POST",
      path: "/v1/offers",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        offer_name: "Promo Offer June 2026",
        product_id: "prod-1234",
        price_minor_units: 4500,
        currency_code: "USD"
      }
    }
  ],
  "rt-charging": [
    {
      label: "Prepaid: Initiate Balance Reservation (POST /v1/charging/reservations)",
      method: "POST",
      path: "/v1/charging/reservations",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        session_id: "charge-session-9988",
        subscriber_id: "sub-0987",
        requested_units: 500,
        service_identifier: "DATA_LTE"
      }
    }
  ],
  "rating-engine": [
    {
      label: "Prepaid: Process Usage CDR (POST /v1/rating/calculate)",
      method: "POST",
      path: "/v1/rating/calculate",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        subscriber_id: "sub-0987",
        volume: 1024,
        unit_type: "OCTETS",
        usage_type: "ROAMING"
      }
    }
  ],
  "billing-invoice": [
    {
      label: "Step 8: Create Draft Invoice (POST /v1/invoices)",
      method: "POST",
      path: "/v1/invoices",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        account_id: "acc-1234",
        billing_period: "2026-06",
        amount_minor_units: 4500,
        currency_code: "USD"
      }
    },
    {
      label: "Trigger Billing Cycle Run (POST /v1/billing/runs)",
      method: "POST",
      path: "/v1/billing/runs",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        bill_cycle_id: "cycle-2026-06",
        account_id: "acc-1234",
        force_run: true
      }
    }
  ],
  "payments-collections": [
    {
      label: "Step 9: Create Payment Intent (POST /v1/payment-intents)",
      method: "POST",
      path: "/v1/payment-intents",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        amount_minor_units: 4500,
        currency: "USD",
        payment_method_token: "tok_visa_4242",
        account_id: "acc-1234"
      }
    }
  ],
  "partner-settlement": [
    {
      label: "Calculate Interconnect Revenue Share (POST /v1/settlements)",
      method: "POST",
      path: "/v1/settlements",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        partner_id: "partner-helios-net",
        traffic_period: "2026-06",
        total_minutes: 45000,
        settlement_rate: 0.02
      }
    }
  ],
  "cust-lifecycle": [
    {
      label: "Step 1: Authenticate / User Login (POST /api/v1/auth/login)",
      method: "POST",
      path: "/api/v1/auth/login",
      headers: { 
        "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460",
        "X-Brand-ID": "7ac9843d-0453-4876-b605-e45ba05b0d0c"
      },
      body: {
        email: "engineer@acme.com",
        password: "SecurePassword123",
        device_fingerprint: "browser-chrome-windows-12345"
      }
    },
    {
      label: "Step 2a: Create Party Profile (POST /v1/parties)",
      method: "POST",
      path: "/v1/parties",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        party_type: "INDIVIDUAL",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@acme.com"
      }
    },
    {
      label: "Step 2b: Create Customer Profile (POST /v1/customers)",
      method: "POST",
      path: "/v1/customers",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        party_id: "party-5678",
        customer_type: "RESIDENTIAL",
        status: "ACTIVE"
      }
    },
    {
      label: "Step 2c: Create Billing Account (POST /v1/accounts)",
      method: "POST",
      path: "/v1/accounts",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        customer_id: "cust-1234",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@acme.com",
        brand_id: "7ac9843d-0453-4876-b605-e45ba05b0d0c"
      }
    }
  ],
  "notifications-campaigns": [
    {
      label: "Send Campaign Push Alert (POST /v1/campaigns/send)",
      method: "POST",
      path: "/v1/campaigns/send",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        campaign_name: "Summer Unlimited Upgrade",
        target_group: "high_data_users",
        message_template: "Upgrade to unlimited 5G data today for only $10 extra!"
      }
    }
  ],
  "esim-sim-mgmt": [
    {
      label: "Step 4: Place Product Order (POST /v1/orders)",
      method: "POST",
      path: "/v1/orders",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        customer_id: "cust-1234",
        offer_id: "offer-5678",
        order_type: "NEW_INSTALL",
        items: [
          {
            product_id: "prod-1234",
            quantity: 1
          }
        ]
      }
    },
    {
      label: "Step 5a: Provision eSIM Profile (POST /v1/provisioning)",
      method: "POST",
      path: "/v1/provisioning",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        order_id: "order-1234",
        service_type: "ESIM"
      }
    },
    {
      label: "Step 5b: Register SIM (POST /v1/sims)",
      method: "POST",
      path: "/v1/sims",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        iccid: "8904903200000888990",
        imsi: "310410123456789",
        status: "INVENTORY"
      }
    },
    {
      label: "Step 5c: Activate SIM Profile (PATCH /v1/sims/{id})",
      method: "PATCH",
      path: "/v1/sims/8904903200000888990",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        action: "ACTIVATE"
      }
    }
  ],
  "iot-connectivity": [
    {
      label: "Register IoT Device Fleet (POST /v1/iot/devices)",
      method: "POST",
      path: "/v1/iot/devices",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        device_imei: "354920009988221",
        model: "SensNode-v2",
        activation_profile: "IOT_LIGHT"
      }
    }
  ],
  "number-inventory": [
    {
      label: "Reserve MSISDN Phone Number (POST /v1/numbers/reserve)",
      method: "POST",
      path: "/v1/numbers/reserve",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        msisdn: "+12125550199",
        reservation_timeout_seconds: 600
      }
    }
  ],
  "taxation-regulatory": [
    {
      label: "Step 7a: Create Jurisdiction Policy (POST /v1/jurisdiction-policies)",
      method: "POST",
      path: "/v1/jurisdiction-policies",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        jurisdiction_code: "US-NY",
        tax_rate: 0.0875,
        status: "ACTIVE"
      }
    },
    {
      label: "Step 7b: Request Tax Decision (POST /v1/tax-decisions)",
      method: "POST",
      path: "/v1/tax-decisions",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        amount_minor_units: 5000,
        tax_category: "TELECOM",
        country_code: "US",
        jurisdiction_code: "US-NY"
      }
    }
  ],
  "compliance-kyc": [
    {
      label: "Step 6a: Start KYC Verification (POST /v1/kyc/cases)",
      method: "POST",
      path: "/v1/kyc/cases",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        customer_id: "cust-1234",
        document_type: "PASSPORT",
        document_number: "US1234567"
      }
    },
    {
      label: "Step 6b: Submit KYC Documentation (PATCH /v1/kyc/cases/{id}/submit)",
      method: "PATCH",
      path: "/v1/kyc/cases/kyc-case-9988/submit",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: {
        verification_status: "SUBMITTED"
      }
    }
  ],
  "evidence-ledger": [
    {
      label: "Step 10: Verify Audit/Evidence Chain (GET /v1/evidence/verify)",
      method: "GET",
      path: "/v1/evidence/verify",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: null
    },
    {
      label: "Append Auditing Log Evidence (POST /v1/evidence)",
      method: "POST",
      path: "/v1/evidence",
      headers: {},
      body: {
        subject_id: "e305ff64-cc3f-42e8-b7c1-8406f363c460",
        action: "BILL_CYCLE_COMPLETE",
        payload_hash: "8f7d9a1b6c0e3a5f4d2c8b7a69f0e1d2c3b4a5d6e7f8",
        signed_by: "billing-invoice-service"
      }
    }
  ],
  "ai-gov-controls": [
    {
      label: "Get AI Governance Status (GET /v1/ai/controls)",
      method: "GET",
      path: "/v1/ai/controls",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: null
    }
  ],
  "analytics-reporting": [
    {
      label: "Generate Revenue Report (GET /v1/reports/revenue)",
      method: "GET",
      path: "/v1/reports/revenue",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: null
    }
  ],
  "mediation-usage": [
    {
      label: "Mediate Ingested CDR record (POST /v1/usage/cdrs)",
      method: "POST",
      path: "/v1/usage/cdrs",
      headers: {},
      body: {
        calling_party: "+12125550199",
        called_party: "+12125550100",
        duration_seconds: 120,
        usage_type: "VOICE",
        timestamp: "2026-06-29T10:00:00Z"
      }
    }
  ],
  "api-gateway": [
    {
      label: "List Active Webhook Subscriptions (GET /v1/developer/keys)",
      method: "GET",
      path: "/v1/developer/keys",
      headers: { "X-Tenant-ID": "e305ff64-cc3f-42e8-b7c1-8406f363c460" },
      body: null
    }
  ]
};
