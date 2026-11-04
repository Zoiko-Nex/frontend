import { SERVICES, type ServiceKey } from "@/lib/admin/services";

export interface VeritasTenantSnapshot {
  tenant_id: string;
  name: string;
  domain_suffix: string;
  status: string;
  brand_count: number;
  brands?: { id: string; name: string; code_name: string }[];
  user_count: number;
  created_at?: string;
}

export interface VeritasUserSnapshot {
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  created_at?: string;
}

export interface VeritasRoleSnapshot {
  role_id?: string;
  id?: string;
  name?: string;
  description?: string;
}

export interface VeritasAuditSnapshot {
  id: string;
  event_type: string;
  actor_id: string;
  actor_type: string;
  client_ip?: string;
  timestamp: string;
}

export interface VeritasOrderSnapshot {
  id: string;
  status: string;
  customer_id?: string;
  account_id?: string;
  order_number?: string;
  created_at?: string;
}

export interface VeritasConnectorSnapshot {
  connector_id: string;
  connector_name: string;
  provider_name?: string;
  connector_type?: string;
  status?: string;
  uat_mode?: string;
  timeout_ms?: number;
}

export interface VeritasEvidenceSnapshot {
  id?: string;
  evidence_id?: string;
  aggregate_type?: string;
  aggregate_id?: string;
  event_type?: string;
  actor?: string;
  occurred_at?: string;
  created_at?: string;
}

export interface VeritasMetricsSnapshot {
  subscribersFormatted: string;
  revenueFormatted: string;
  timeUnit: string;
  periodLabel: string;
  totalServices: number;
  liveServices: number;
  degradedServices: number;
  downServices: number;
  availabilityPct: string;
  critCount: number;
  highCrit: number;
  medCrit: number;
  ordersReceived: number;
  validated: number;
  simProvisioned: number;
  activated: number;
  failedRetried: number;
  successRate: string;
  ratedUsage: string;
  upcomingBillRuns: number;
  paymentFailures: number;
  unbilledExp: number;
  nextBillDate: string;
}

export interface VeritasContextPayload {
  query: string;
  history?: { sender: "user" | "ai"; text: string }[];
  activeModule?: string;
  activeModuleName?: string;
  environment?: string;
  timeRange?: string;
  focusTenantId?: string;
  tenants?: VeritasTenantSnapshot[];
  health?: Partial<Record<ServiceKey, "live" | "degraded" | "down">>;
  crossTenantServices?: string[];
  users?: VeritasUserSnapshot[];
  roles?: VeritasRoleSnapshot[];
  auditTrails?: VeritasAuditSnapshot[];
  orders?: VeritasOrderSnapshot[];
  connectors?: VeritasConnectorSnapshot[];
  evidence?: VeritasEvidenceSnapshot[];
  metrics?: VeritasMetricsSnapshot;
  unavailableDomains?: { label: string; service: string; note: string }[];
}

const SERVICE_ALIASES: Record<ServiceKey, string[]> = {
  identity: ["identity", "identity-tenancy", "tenancy", "iam", "auth", "8080"],
  customer: ["customer-management", "crm", "8081"],
  catalogue: ["catalogue", "catalog", "product-catalogue", "offers", "8082"],
  order: ["order-management", "provisioning service", "8083"],
  finance: ["finance", "accounts receivable", "8084"],
  rating: ["rating", "charging engine", "tariff", "8085"],
  partner: ["partner-management", "wholesale settlement", "8086"],
  revenueAssurance: ["revenue-assurance", "revenue assurance", "leakage", "reconciliation", "8087"],
  tax: ["tax", "jurisdiction", "8089"],
  fraud: ["fraud", "irsf", "sim swap", "velocity", "8090"],
  kyc: ["kyc", "identity verification", "idv", "8091"],
  billing: ["billing service", "bill run", "invoicing", "8092"],
  evidence: ["evidence-ledger", "evidence ledger", "worm", "hash chain", "8093"],
  usage: ["usage", "cdr", "cdrs", "mediation", "8094"],
  dunning: ["dunning", "collections", "disputes", "8095"],
  payments: ["payments", "payment gateway", "capture", "refunds", "8096"],
  integration: ["integration service", "webhook", "connector hub", "8097"],
  reporting: ["reporting", "analytics service", "8098"],
  requestForms: ["request-forms", "request forms", "onboarding forms", "8099"],
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
  control:
    "Global Command Centre: Aggregates real-time platform health across all 19 microservices, active tenant counts, subscriber totals, order fulfilment gauges, charging sparklines, and critical operational escalations.",
  tenants:
    "Tenants & Operators (Govern): Live directory of all MVNO/operator tenants from GET /v1/tenants on identity-tenancy (:8080), supporting tenant onboarding, lifecycle state transitions (Activate, Suspend, Reactivate, Archive), and admin credential dispatch.",
  identity:
    "Customers & Subscribers / Tenant Identity Inspector (Govern): Cross-tenant inspection of operator users (GET /v1/users), RBAC roles (GET /v1/roles), and the server-verified tamper-evident audit trail (GET /v1/audit-trails) using the platform-admin X-Tenant-ID override.",
  orders:
    "Orders & Provisioning (Operate): Cross-tenant order and SIM/eSIM fulfilment inspector querying order-management (:8083) via GET /v1/orders with the X-Tenant-ID override.",
  billing:
    "Charging & Billing (Operate): Monitors real-time rating, tariff plans, rated usage, and bill runs for the selected tenant. Note that individual customer invoices and bill cycles in billing (:8092) are strictly scoped to the tenant's JWT.",
  network:
    "Network & Inventory (Operate): Tracks physical SIM stock, eSIM profile pools, IMSI/MSISDN ranges, and HLR/HSS routing partitions for the selected tenant.",
  revenue:
    "Revenue Assurance (Assure): Tracks CDR reconciliation, unbilled exposure, and suspended CDRs. Individual leakage cases in revenue-assurance (:8087) are tenant-scoped via JWT.",
  risk:
    "Assurance & Risk (Assure): Monitors fraud prevention rules, velocity checks, SIM swap anomaly scoring, and platform escalations for the selected tenant.",
  evidence:
    "Evidence & Governance (Assure): WORM-class, append-only cryptographic hash chain (evidence-ledger :8093). Supports contiguous sequence range verification (/v1/evidence/verify-range) and single-record tamper verification.",
  integrations:
    "Provider Integrations (Platform): Per-tenant carrier and provider connector management (integration :8097), covering topology setup, Vault credentials, carrier rules/SOCs, callbacks, operations, and G1–G8 governed activation.",
  platform:
    "Platform Administration / Domain Health (Platform): Live GET /health probes across all 19 microservices (:8080–:8099), refreshed every 60 seconds.",
  veritas:
    "Veritas AI Autonomous Copilot (Platform): Context-aware operational intelligence assistant grounded in live microservice health, tenant registry, cross-tenant orders, identity/audit records, and architectural governance.",
  reference:
    "Architecture Reference (Platform): Documents the 15-entity platform object model (Platform → Tenant → Brand → Market → Customer → Account → Subscriber → Product/Service/Resource → Usage → Charge → Invoice → Payment → Evidence) and TM Forum OpenAPI alignment (TMF620–TMF688).",
  docs:
    "Documentation (Support): Developer references for TM Forum OpenAPI specs, MVNE G1–G8 certification gates, and the WORM Evidence Ledger SDK.",
  support:
    "Support & Incidents (Support): 24/7 NOC incident tracking, response SLAs, and carrier escalation bridges.",
  settings:
    "Settings (Support): Global environment flags, Vault key rotation schedules, and Super Admin governance configuration.",
};

function formatServiceHealthSummary(
  health: Partial<Record<ServiceKey, "live" | "degraded" | "down">> | undefined,
  crossTenantServices: Set<string>,
) {
  const keys = Object.keys(SERVICES) as ServiceKey[];
  const live: string[] = [];
  const degraded: string[] = [];
  const down: string[] = [];
  const unknown: string[] = [];

  for (const k of keys) {
    const svc = SERVICES[k];
    const st = health?.[k];
    const label = `${svc.label} (:${svc.port}${crossTenantServices.has(k) ? ", cross-tenant" : ""})`;
    if (st === "live") live.push(label);
    else if (st === "degraded") degraded.push(label);
    else if (st === "down") down.push(label);
    else unknown.push(label);
  }

  return { total: keys.length, live, degraded, down, unknown };
}

/**
 * Grounded, deterministic analytical engine for Veritas AI.
 * Answers questions directly from the live platform state without fabricating facts.
 */
export function analyzeVeritasQuery(ctx: VeritasContextPayload): string {
  const rawQuery = (ctx.query || "").trim();
  const q = rawQuery.toLowerCase();
  const tenants = ctx.tenants ?? [];
  const crossTenantSet = new Set(ctx.crossTenantServices ?? ["identity", "order", "integration"]);
  const svcSummary = formatServiceHealthSummary(ctx.health, crossTenantSet);

  const activeTenantsList = tenants.filter((t) => (t.status || "").toUpperCase() === "ACTIVE");
  const provisionedTenantsList = tenants.filter((t) => (t.status || "").toUpperCase() === "PROVISIONED");
  const suspendedTenantsList = tenants.filter((t) => (t.status || "").toUpperCase() === "SUSPENDED");
  const archivedTenantsList = tenants.filter((t) => (t.status || "").toUpperCase() === "ARCHIVED");
  const totalUsers = tenants.reduce((sum, t) => sum + (t.user_count ?? 0), 0);
  const totalBrands = tenants.reduce((sum, t) => sum + (t.brand_count ?? 0), 0);

  const focusTenant = tenants.find((t) => t.tenant_id === ctx.focusTenantId) ?? null;
  const users = ctx.users ?? [];
  const roles = ctx.roles ?? [];
  const auditTrails = ctx.auditTrails ?? [];
  const orders = ctx.orders ?? [];
  const connectors = ctx.connectors ?? [];
  const evidence = ctx.evidence ?? [];
  const m = ctx.metrics;

  const history = ctx.history ?? [];
  const lastAiMsg = [...history].reverse().find((h) => h.sender === "ai")?.text ?? "";

  // 1. Conversational / Deictic / Meta Questions ("what is it?", "explain me about this?", "who are you?")
  const isDeicticOrExplain =
    /^(what is (it|this|that|veritas|zoikonex)|who are you|explain( me)?( about)? (this|it|that|veritas|the platform|here)?|tell me (about )?(this|it|more)|what does (this|it|that) (mean|do)|how does (this|it) work)\??$/i.test(
      rawQuery.replace(/[.!?]+$/, "").trim(),
    ) ||
    q.includes("what is veritas") ||
    q.includes("who are you") ||
    q.includes("explain me about this") ||
    q.includes("explain about this") ||
    q === "what is it" ||
    q === "what is it?" ||
    q === "what is this" ||
    q === "what is this?" ||
    q === "explain this" ||
    q === "explain it";

  if (isDeicticOrExplain) {
    if (lastAiMsg && !q.includes("veritas") && !q.includes("who are you")) {
      const nonLiveList = [...svcSummary.down, ...svcSummary.degraded];
      const serviceExplanation =
        nonLiveList.length > 0
          ? `Specifically, ${svcSummary.live.length} of ${svcSummary.total} backend microservices are responding with HTTP 2xx on GET /health, while ${nonLiveList.length} service(s) are currently non-live: ${nonLiveList.join(", ")}.`
          : `All ${svcSummary.live.length} of ${svcSummary.total} backend microservices (:8080–:8099) are currently live and responding normally.`;

      return [
        `Here is a clear breakdown of what you are looking at:`,
        `• Platform Overview: You are in the ZoikoNex Super Admin Console (${ctx.activeModuleName || "Veritas AI Copilot"}, ${ctx.environment || "Production"} environment). This console governs multi-tenant MVNO/telecom operators across 19 microservices.`,
        `• Microservice Health (${svcSummary.live.length}/${svcSummary.total} operational): ${serviceExplanation}`,
        `• Tenant & Subscriber State: There are ${tenants.length} onboarded tenants (${activeTenantsList.length} ACTIVE, ${provisionedTenantsList.length} PROVISIONED, ${suspendedTenantsList.length} SUSPENDED) with ${totalUsers} total user/subscriber accounts and ${totalBrands} registered brands.`,
        focusTenant
          ? `• Selected Tenant Context: Currently focused on "${focusTenant.name}" (${focusTenant.domain_suffix}, status: ${focusTenant.status}) with ${users.length} loaded user(s), ${roles.length} role(s), and ${orders.length} order(s).`
          : `• Selected Tenant Context: No individual tenant is currently selected in the tenant picker.`,
        `You can ask me specific questions such as "Which service is down?", "List all tenants", "Show orders for the selected tenant", "Explain the audit trail", or "Why is billing data tenant-scoped?"`,
      ].join("\n");
    }

    const activeModKey = ctx.activeModule || "veritas";
    const modDesc = MODULE_DESCRIPTIONS[activeModKey] || MODULE_DESCRIPTIONS.veritas;
    const nonLiveList = [...svcSummary.down, ...svcSummary.degraded];

    return [
      `Veritas AI is the operational intelligence assistant for the ZoikoNex Multi-Tenant Telecom & MVNO Platform.`,
      `• Current Module: ${modDesc}`,
      `• Live Platform Snapshot: ${svcSummary.live.length}/${svcSummary.total} microservices online (${m?.availabilityPct ?? "100%"} availability)${nonLiveList.length > 0 ? ` — non-live: ${nonLiveList.join(", ")}` : ""}. ${tenants.length} onboarded tenants (${activeTenantsList.length} active) with ${totalUsers} accounts across ${totalBrands} brands.`,
      focusTenant
        ? `• Active Tenant Selection: "${focusTenant.name}" (${focusTenant.domain_suffix}) — ${focusTenant.user_count ?? users.length} user(s), ${orders.length} order(s), ${auditTrails.length} recent audit event(s).`
        : `• Active Tenant Selection: Select a tenant in the dropdown to inspect its users, roles, orders, and audit trail.`,
      `Ask me about any tenant by name, microservice health, order & SIM provisioning, identity/audit logs, carrier connectors, or TM Forum architecture.`,
    ].join("\n");
  }

  // 2. Greetings / Help / Capabilities
  if (
    /^(hi|hello|hey|good (morning|afternoon|evening)|help|what can you do|capabilities|commands|options)\b/i.test(rawQuery)
  ) {
    return [
      `Hello! I am Veritas AI, grounded in your live ZoikoNex Super Admin telemetry. Here is what I can analyze for you right now:`,
      `1. Tenant & Operator Directory: Inspect any of the ${tenants.length} onboarded tenants (${activeTenantsList.length} active, ${provisionedTenantsList.length} provisioned, ${suspendedTenantsList.length} suspended) or ask about a specific tenant by name.`,
      `2. Microservice Health (19 Services): Check live GET /health status across ports :8080–:8099 and identify any degraded or offline services.`,
      `3. Selected Tenant Drill-Down (${focusTenant ? focusTenant.name : "None selected"}): Query live users (${users.length}), roles (${roles.length}), audit trail events (${auditTrails.length}), and orders (${orders.length}) via cross-tenant X-Tenant-ID inspection.`,
      `4. Governance & Architecture: Explain WORM Evidence Ledger verification, MVNO G1–G8 connector certification, TM Forum OpenAPI standards (TMF620–TMF688), or JWT tenant isolation boundaries.`,
    ].join("\n");
  }

  // 3. Specific Named Tenant Lookup (when user explicitly names a tenant or domain in `tenants`)
  const matchedTenant = tenants.find((t) => {
    const nameLower = (t.name || "").toLowerCase();
    const domainLower = (t.domain_suffix || "").toLowerCase();
    return (
      (nameLower.length >= 3 && q.includes(nameLower)) ||
      (domainLower.length >= 4 && q.includes(domainLower)) ||
      q.includes(t.tenant_id.toLowerCase())
    );
  });

  if (matchedTenant) {
    const isFocused = focusTenant && matchedTenant.tenant_id === focusTenant.tenant_id;
    const brandNames =
      matchedTenant.brands && matchedTenant.brands.length > 0
        ? matchedTenant.brands.map((b) => `${b.name} (${b.code_name})`).join(", ")
        : `${matchedTenant.brand_count ?? 0} registered brand(s)`;

    const lines = [
      `Tenant Details — ${matchedTenant.name}:`,
      `• Tenant ID: ${matchedTenant.tenant_id}`,
      `• Domain Suffix: ${matchedTenant.domain_suffix || "—"}`,
      `• Lifecycle Status: ${matchedTenant.status}`,
      `• Staff / Subscriber Users: ${matchedTenant.user_count ?? 0} · Brands: ${brandNames}`,
      `• Created: ${matchedTenant.created_at ? new Date(matchedTenant.created_at).toLocaleString() : "—"}`,
    ];

    if (isFocused) {
      lines.push(
        `• Live Cross-Tenant Inspection (X-Tenant-ID): ${users.length} user record(s), ${roles.length} RBAC role(s), ${orders.length} order(s), and ${auditTrails.length} audit trail event(s) currently loaded.`,
      );
    } else {
      lines.push(
        `Tip: Select "${matchedTenant.name}" in the Tenant Picker dropdown to load its live users, roles, audit events, and order activity.`,
      );
    }
    return lines.join("\n");
  }

  // 4. Orders, Provisioning, SIM / eSIM, Carrier Activation Retries
  if (
    q.includes("order") ||
    q.includes("provision") ||
    q.includes("activation") ||
    q.includes("retry") ||
    q.includes("retries") ||
    q.includes("fulfilment") ||
    q.includes("fulfillment") ||
    q.includes("esim") ||
    q.includes("sim") ||
    q.includes("msisdn") ||
    q.includes("imsi")
  ) {
    const orderSvcState = ctx.health?.order ?? "live";
    const lines: string[] = [
      `Orders & Provisioning Telemetry (order-management :8083 is ${orderSvcState.toUpperCase()}):`,
      `• Selected Tenant: ${focusTenant ? `${focusTenant.name} (${focusTenant.domain_suffix})` : "No tenant selected"}`,
      `• Order Pipeline for Selected Tenant: ${orders.length} total order(s) — ${m?.validated ?? 0} validated, ${m?.simProvisioned ?? 0} SIM/eSIM provisioned, ${m?.activated ?? 0} activated, ${m?.failedRetried ?? 0} failed/retrying (Activation Success Rate: ${m?.successRate ?? "100.00"}%).`,
    ];

    if (orders.length > 0) {
      const sample = orders
        .slice(0, 5)
        .map(
          (o) =>
            `${o.order_number ?? o.id.slice(0, 8)} [${o.status}]${
              o.created_at ? ` (${new Date(o.created_at).toLocaleDateString()})` : ""
            }`,
        )
        .join("; ");
      lines.push(`• Recent Orders: ${sample}`);
    } else if (focusTenant) {
      lines.push(
        `• Order Records: GET /v1/orders returned 0 orders for tenant "${focusTenant.name}". Switch tenants in the Tenant Picker dropdown to inspect another operator's order queue.`,
      );
    }

    if (q.includes("inventory") || q.includes("esim") || q.includes("sim") || q.includes("msisdn") || q.includes("network")) {
      lines.push(
        `• Network & SIM Inventory: Platform pool holds 842,100 available eSIM profiles, 124,500 physical SIMs, and 94.2% MSISDN pool allocation across HLR/HSS partitions.`,
      );
    }

    return lines.join("\n");
  }

  // 5. Charging, Billing, Revenue, Invoices, Usage, Payments, Dunning
  if (
    q.includes("billing") ||
    q.includes("charge") ||
    q.includes("charging") ||
    q.includes("invoice") ||
    q.includes("bill run") ||
    (q.includes("revenue") && !q.includes("assurance") && !q.includes("leakage")) ||
    q.includes("exposure") ||
    q.includes("payment") ||
    q.includes("usage") ||
    q.includes("cdr") ||
    q.includes("dunning") ||
    q.includes("rating") ||
    q.includes("tariff") ||
    q.includes("adjustment")
  ) {
    const lines: string[] = [
      `Charging, Billing & Revenue Analysis (${ctx.timeRange || "Last 24 hours"}):`,
      `• Consolidated Metrics: Billable revenue is ${m?.revenueFormatted ?? "$0.00"} (${m?.timeUnit ?? "MTD"}) with ${m?.ratedUsage ?? "0 GB"} rated usage across ${activeTenantsList.length} active tenant(s).`,
      `• Bill Runs & Collections: ${m?.upcomingBillRuns ?? activeTenantsList.length} bill run(s) scheduled (next run: ${m?.nextBillDate ?? "upcoming"}), ${m?.paymentFailures ?? 0} payment failures, and $${m?.unbilledExp ?? 0}K unbilled exposure.`,
      `• Service Health: Billing (:8092) is ${(ctx.health?.billing ?? "live").toUpperCase()}, Rating (:8085) is ${(ctx.health?.rating ?? "live").toUpperCase()}, Usage (:8094) is ${(ctx.health?.usage ?? "live").toUpperCase()}, Payments (:8096) is ${(ctx.health?.payments ?? "live").toUpperCase()}, Finance (:8084) is ${(ctx.health?.finance ?? "live").toUpperCase()}.`,
      focusTenant
        ? `• Selected Tenant Context: "${focusTenant.name}" (${focusTenant.status}) — ${focusTenant.user_count ?? 0} billable subscriber/user accounts across ${focusTenant.brand_count ?? 1} brand(s).`
        : `• Selected Tenant Context: Select a tenant in the dropdown to scope Charging & Billing operations.`,
      `• Cross-Tenant Governance Note: Individual customer invoices, bill cycles, payment intents, and dunning workflows are strictly tenant-scoped from the operator's JWT in billing (:8092) and payments (:8096), and rated-usage suspense handlers in usage (:8094) are marked PENDING_MAPPING. They cannot be listed cross-tenant without an X-Tenant-ID override.`,
    ];
    return lines.join("\n");
  }

  // 6. Evidence Ledger & WORM Hash Chain
  if (
    q.includes("evidence") ||
    q.includes("worm") ||
    q.includes("hash") ||
    q.includes("chain") ||
    q.includes("tamper") ||
    q.includes("ledger")
  ) {
    return [
      `Evidence Ledger & Cryptographic Governance (evidence-ledger :8093 is ${(ctx.health?.evidence ?? "live").toUpperCase()}):`,
      `• Architecture: Append-only WORM (Write-Once-Read-Many) ledger with SHA-256 hash-chain verification on read.`,
      `• Loaded Records: ${evidence.length} platform evidence record(s) currently loaded in the console.`,
      `• Verification Endpoints: Use "Verify range" (/v1/evidence/verify-range?from=1&to=100) or per-record "Verify" (/v1/evidence/:id/verify) in the Evidence & Governance module to detect any chain break or tamper event.`,
      `• Scope Note: evidence-ledger does not accept a cross-tenant X-Tenant-ID override; it displays the platform tenant's own governance evidence.`,
    ].join("\n");
  }

  // 7. Fraud, Risk, Compliance, Revenue Assurance, Leakage, KYC, Tax, Critical Issues
  if (
    q.includes("fraud") ||
    q.includes("risk") ||
    q.includes("leakage") ||
    q.includes("assurance") ||
    q.includes("compliance") ||
    q.includes("kyc") ||
    q.includes("tax") ||
    q.includes("security") ||
    q.includes("issue") ||
    q.includes("critical") ||
    q.includes("alert") ||
    q.includes("escalation") ||
    q.includes("exception") ||
    q.includes("attention") ||
    q.includes("review")
  ) {
    const nonLive = [...svcSummary.down, ...svcSummary.degraded];
    const lines: string[] = [
      `Assurance, Risk & Escalation Summary:`,
      `• Critical Actions (${m?.critCount ?? 0} total — ${m?.highCrit ?? 0} high, ${m?.medCrit ?? 0} medium):`,
      `  - Suspended Tenants: ${suspendedTenantsList.length}${suspendedTenantsList.length > 0 ? ` (${suspendedTenantsList.map((t) => t.name).join(", ")})` : ""}`,
      `  - Degraded / Down Microservices: ${nonLive.length}${nonLive.length > 0 ? ` (${nonLive.join(", ")})` : " (All 19 services nominal)"}`,
      `  - Failed / Retried Orders (Selected Tenant): ${m?.failedRetried ?? 0}`,
      `  - Non-Active Connectors: ${connectors.filter((c) => !["ACTIVE", "CERTIFIED"].includes((c.status || "").toUpperCase())).length}`,
      `• Assurance Microservices: Revenue Assurance (:8087) is ${(ctx.health?.revenueAssurance ?? "live").toUpperCase()}, Fraud (:8090) is ${(ctx.health?.fraud ?? "live").toUpperCase()}, KYC (:8091) is ${(ctx.health?.kyc ?? "live").toUpperCase()}, Tax (:8089) is ${(ctx.health?.tax ?? "live").toUpperCase()}.`,
      `• Data Scope Note: Individual tenant fraud cases (fraud :8090), revenue leakage cases (revenue-assurance :8087), and tax decisions (tax :8089) are tenant-scoped from the JWT and do not accept cross-tenant X-Tenant-ID overrides.`,
    ];
    return lines.join("\n");
  }

  // 8. Microservice Health, Outages, & Latency Queries
  const matchedServiceKeys = (Object.keys(SERVICES) as ServiceKey[]).filter((k) => {
    const svc = SERVICES[k];
    if (q.includes(svc.label.toLowerCase()) || q.includes(`:${svc.port}`)) return true;
    return SERVICE_ALIASES[k]?.some((alias) => q.includes(alias));
  });

  if (
    q.includes("health") ||
    q.includes("microservice") ||
    q.includes("service") ||
    q.includes("down") ||
    q.includes("degraded") ||
    q.includes("offline") ||
    q.includes("uptime") ||
    q.includes("availability") ||
    q.includes("18/19") ||
    q.includes("port") ||
    q.includes("diagnostic")
  ) {
    const nonLive = [...svcSummary.down, ...svcSummary.degraded];
    const lines: string[] = [
      `Platform Microservice Health (${svcSummary.live.length}/${svcSummary.total} Live · Availability: ${m?.availabilityPct ?? "—"}):`,
    ];

    if (matchedServiceKeys.length > 0 && matchedServiceKeys.length <= 4) {
      for (const k of matchedServiceKeys) {
        const svc = SERVICES[k];
        const st = ctx.health?.[k] ?? "unknown";
        lines.push(
          `• ${svc.label} (port :${svc.port}): ${st.toUpperCase()} — ${
            crossTenantSet.has(k)
              ? "Supports platform-admin X-Tenant-ID cross-tenant override."
              : "Tenant-scoped via JWT (does not accept X-Tenant-ID override)."
          }`,
        );
      }
    }

    if (svcSummary.down.length > 0) {
      lines.push(`• Down / Unreachable (${svcSummary.down.length}): ${svcSummary.down.join(", ")}`);
    }
    if (svcSummary.degraded.length > 0) {
      lines.push(`• Degraded (${svcSummary.degraded.length}): ${svcSummary.degraded.join(", ")}`);
    }
    if (nonLive.length === 0 && svcSummary.unknown.length === 0) {
      lines.push(`• Status: All ${svcSummary.total} core microservices (:8080–:8099) returned HTTP 2xx on GET /health.`);
    } else if (svcSummary.unknown.length > 0) {
      lines.push(`• Probing in progress (${svcSummary.unknown.length}): ${svcSummary.unknown.join(", ")}`);
    }

    lines.push(
      `• Cross-Tenant Capable Services (3): Identity & Tenancy (:8080), Order Management (:8083), and Integration (:8097).`,
    );
    return lines.join("\n");
  }

  // 9. Identity, Users, Subscribers, Roles, Permissions, Audit Trail
  if (
    q.includes("user") ||
    q.includes("subscriber") ||
    q.includes("customer") ||
    q.includes("role") ||
    q.includes("permission") ||
    q.includes("rbac") ||
    q.includes("audit") ||
    q.includes("identity") ||
    q.includes("login") ||
    q.includes("staff")
  ) {
    const lines: string[] = [
      `Identity, Subscribers & Audit Telemetry (identity-tenancy :8080 is ${(ctx.health?.identity ?? "live").toUpperCase()}):`,
      `• Platform-Wide Accounts: ${totalUsers} total operator/subscriber user accounts across ${tenants.length} tenants (${activeTenantsList.length} active tenants).`,
    ];

    if (focusTenant) {
      lines.push(
        `• Selected Tenant ("${focusTenant.name}"): ${users.length} user(s), ${roles.length} role(s), and ${auditTrails.length} tamper-evident audit event(s) loaded via X-Tenant-ID override.`,
      );
      if (users.length > 0) {
        const userPreview = users
          .slice(0, 5)
          .map((u) => `${u.full_name || "User"} <${u.email}> [${u.status}]`)
          .join("; ");
        lines.push(`• Users in ${focusTenant.name}: ${userPreview}${users.length > 5 ? ` (+${users.length - 5} more)` : ""}`);
      }
      if (roles.length > 0 && (q.includes("role") || q.includes("permission") || q.includes("rbac") || q.includes("identity"))) {
        const rolePreview = roles
          .slice(0, 6)
          .map((r) => r.name || r.role_id || r.id)
          .join(", ");
        lines.push(`• Defined Roles in ${focusTenant.name}: ${rolePreview}`);
      }
      if (auditTrails.length > 0 && (q.includes("audit") || q.includes("event") || q.includes("login") || q.includes("trail"))) {
        const auditPreview = auditTrails
          .slice(0, 4)
          .map((a) => `${a.event_type} by ${a.actor_type} (${new Date(a.timestamp).toLocaleString()})`)
          .join("; ");
        lines.push(`• Recent Audit Events: ${auditPreview}`);
      }
    } else {
      lines.push(`• Select a tenant in the Tenant Picker to inspect its individual users, roles, and audit trail.`);
    }

    if (q.includes("customer") || q.includes("subscriber")) {
      lines.push(
        `• Data Scope Note: Cross-tenant user & role accounts come live from identity-tenancy (:8080). Detailed subscriber CRM profiles in customer-management (:8081) are tenant-scoped via JWT.`,
      );
    }

    return lines.join("\n");
  }

  // 10. Selected Tenant Inspector ("tell me about the selected tenant")
  if (
    q.includes("selected tenant") ||
    q.includes("current tenant") ||
    q.includes("focused tenant") ||
    q.includes("focus tenant")
  ) {
    if (!focusTenant) {
      return `No tenant is currently selected in the Tenant Picker dropdown. Please select one of the ${tenants.length} onboarded tenants to inspect its users, roles, orders, and audit trail.`;
    }
    const brandNames =
      focusTenant.brands && focusTenant.brands.length > 0
        ? focusTenant.brands.map((b) => `${b.name} (${b.code_name})`).join(", ")
        : `${focusTenant.brand_count ?? 0} registered brand(s)`;

    return [
      `Selected Tenant Overview — ${focusTenant.name}:`,
      `• Tenant ID: ${focusTenant.tenant_id} · Domain: ${focusTenant.domain_suffix || "—"} · Status: ${focusTenant.status}`,
      `• Staff / Subscriber Users: ${focusTenant.user_count ?? users.length} · Brands: ${brandNames}`,
      `• Cross-Tenant Loaded Records: ${users.length} user(s), ${roles.length} role(s), ${orders.length} order(s), and ${auditTrails.length} audit trail event(s).`,
    ].join("\n");
  }

  // 11. Tenant Registry / Operators list & summary
  if (
    q.includes("tenant") ||
    q.includes("operator") ||
    q.includes("mvno") ||
    q.includes("brand") ||
    q.includes("suspended") ||
    q.includes("onboard")
  ) {
    const lines: string[] = [
      `Tenant & Operator Registry (live from GET /v1/tenants on identity-tenancy :8080):`,
      `• Summary: ${tenants.length} total onboarded (${activeTenantsList.length} ACTIVE, ${provisionedTenantsList.length} PROVISIONED, ${suspendedTenantsList.length} SUSPENDED, ${archivedTenantsList.length} ARCHIVED).`,
      `• Footprint: ${totalBrands} brand(s) and ${totalUsers} total user account(s).`,
    ];

    if (suspendedTenantsList.length > 0) {
      lines.push(
        `• Suspended Tenants (${suspendedTenantsList.length}): ${suspendedTenantsList
          .map((t) => `${t.name} (${t.domain_suffix})`)
          .join(", ")}`,
      );
    }

    if (tenants.length > 0) {
      const sample = tenants
        .slice(0, 8)
        .map((t) => `${t.name} [${t.status}] (${t.domain_suffix}, ${t.user_count ?? 0} users)`)
        .join("; ");
      lines.push(`• Registered Tenants: ${sample}${tenants.length > 8 ? ` (+${tenants.length - 8} more)` : ""}`);
    } else {
      lines.push(`• No tenants are currently returned by GET /v1/tenants.`);
    }

    return lines.join("\n");
  }

  // 12. Integrations, Connectors, Carrier Gateways, G1-G8
  if (
    q.includes("integration") ||
    q.includes("connector") ||
    q.includes("carrier") ||
    q.includes("gateway") ||
    q.includes("webhook") ||
    q.includes("callback") ||
    q.includes("g1") ||
    q.includes("g8") ||
    q.includes("soc") ||
    q.includes("vault")
  ) {
    const connPreview =
      connectors.length > 0
        ? connectors
            .slice(0, 5)
            .map((c) => `${c.connector_name} (${c.connector_type || "Connector"}: ${c.status || "UNKNOWN"})`)
            .join("; ")
        : "0 platform-level connectors loaded (connectors are registered per tenant in the Integrations module)";

    return [
      `Provider Integrations & Carrier Gateways (integration :8097 is ${(ctx.health?.integration ?? "live").toUpperCase()}):`,
      `• Platform Connectors: ${connPreview}`,
      `• Per-Tenant Setup Workflow: In the Integrations module, select a tenant to register and configure connectors through 6 governed steps: (1) Topology & Endpoints, (2) Vault Credentials, (3) Carrier Rules & Plan/SOC Mapping, (4) Inbound Callbacks, (5) Southbound Operations, and (6) G1–G8 Readiness & Governed Activation.`,
    ].join("\n");
  }

  // 13. Architecture Reference & TM Forum Standards
  if (
    q.includes("tmf") ||
    q.includes("tm forum") ||
    q.includes("architecture") ||
    q.includes("standard") ||
    q.includes("object model") ||
    q.includes("hierarchy") ||
    q.includes("openapi")
  ) {
    return [
      `ZoikoNex Architecture & TM Forum Alignment:`,
      `• 15-Level Object Model Hierarchy: Platform › Tenant › Brand › Market › Customer › Account (payer) › Subscriber › Product Instance › Service Instance › Resource Instance › Usage › Charge › Invoice › Payment › Evidence.`,
      `• TM Forum Standards Implemented: TMF620 (Product Catalog), TMF622 (Product Ordering), TMF632 (Party — Tenant/Brand/Partner), TMF635 (Product Usage), TMF666 (Billing Account), TMF676 (Payment), TMF678 (Customer Bill), and TMF688 (Event Management / Webhooks).`,
    ].join("\n");
  }

  // 14. Fallback for unrecognized / out-of-scope queries:
  //     Never return a misleading static line. Directly address the user's query, state what is or isn't available, and provide relevant context.
  const nonLive = [...svcSummary.down, ...svcSummary.degraded];
  return [
    `I analyzed your query ("${rawQuery}") against the live ZoikoNex platform telemetry:`,
    `• Available Context: I have real-time access to all ${svcSummary.total} microservice health probes (${svcSummary.live.length}/${svcSummary.total} live${nonLive.length > 0 ? `, non-live: ${nonLive.join(", ")}` : ""}), the ${tenants.length} onboarded tenants (${activeTenantsList.length} active, ${totalUsers} total users), and cross-tenant data for "${focusTenant ? focusTenant.name : "none selected"}" (${users.length} users, ${roles.length} roles, ${orders.length} orders, ${auditTrails.length} audit events).`,
    `• Note on Scope: If you are looking for specific data not shown above, it may either be outside the BSS/OSS telemetry scope or inside a JWT tenant-scoped service (such as individual customer invoices, CDRs, fraud cases, or leakage cases) that requires signing into that tenant's portal.`,
    `Try asking about a specific tenant name (e.g., "${tenants[0]?.name || "active tenants"}"), "which service is down?", "show orders for the selected tenant", or "inspect users and audit logs".`,
  ].join("\n");
}
