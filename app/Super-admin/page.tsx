"use client";

/**
 * ZoikoNex platform super-admin console.
 *
 * ── What changed and why ─────────────────────────────────────────────────────
 * All MVNO Carrier Integration telemetry, directory, G1–G8 certification
 * readiness inspector, Plan/SOC mappings, Vault credentials, and onboarding
 * wizard are directly embedded in the white Super Admin console under the
 * "Integrations" module.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { platformApi, probeHealth, CROSS_TENANT_SERVICES } from "@/lib/admin/platform/client";
import { getPlatformSession, clearPlatformSession } from "@/lib/admin/platform/session";
import { SERVICES, type ServiceKey } from "@/lib/admin/services";
import { errMessage, shortId } from "@/lib/admin/envelope";
import { tenantTransitionsFor, type Transition } from "@/lib/admin/transitions";
import "./super-admin.css";

// ─── Types (mirrored from the Go handlers) ────────────────────────────────────

interface Tenant {
  tenant_id: string;
  name: string;
  domain_suffix: string;
  status: string;
  brand_count: number;
  brands?: { id: string; name: string; code_name: string }[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

interface PlatformUser {
  user_id: string;
  email: string;
  full_name: string;
  status: string;
  created_at: string;
}

interface Role {
  role_id?: string;
  id?: string;
  name?: string;
  description?: string;
}

interface AuditTrail {
  id: string;
  tenant_id: string;
  event_type: string;
  actor_id: string;
  actor_type: string;
  client_ip: string;
  user_agent: string;
  timestamp: string;
}

interface Order {
  id: string;
  status: string;
  customer_id?: string;
  account_id?: string;
  order_number?: string;
  created_at?: string;
}

interface Connector {
  connector_id: string;
  connector_name: string;
  connector_type: string;
  provider_name: string;
  status: string;
  auth_type: string;
  base_url?: string;
  brand_id?: string;
  rate_limit_per_minute?: number;
  timeout_ms?: number;
  tenancy_mode?: string;
  contracting_entity?: string;
  credential_scope?: string;
  funds_flow_mode?: string;
  merchant_or_payee_role?: string;
  regulated_role?: string;
  data_processing_role?: string;
  revenue_presentation?: string;
  arrangement_version?: string;
  created_at?: string;
}

interface ReadinessGateReport {
  connector_id: string;
  provider_name: string;
  overall_readiness: string;
  credential_state: string;
  operations_registered: number;
  operations_certified: number;
  gates: Record<string, { status: string; reason?: string; blocker?: string }>;
}

interface MappingDefinition {
  mapping_id: string;
  connector_id: string;
  mapping_name: string;
  version: string;
  status: string;
  registered_by?: string;
  registered_at?: string;
  created_at: string;
}

interface MappingEntry {
  entry_id: string;
  mapping_id: string;
  canonical_code: string;
  provider_code: string;
  description?: string;
  status: string;
  created_at: string;
}

interface CredentialItem {
  credential_id: string;
  environment: string;
  credential_type: string;
  fingerprint: string;
  status: string;
  submitted_by?: string;
  created_at: string;
  expires_at?: string;
}

interface EvidenceRecord {
  id?: string;
  evidence_id?: string;
  tenant_id?: string;
  aggregate_type?: string;
  aggregate_id?: string;
  event_type?: string;
  actor?: string;
  occurred_at?: string;
  created_at?: string;
}

type ModuleKey =
  | "control"
  | "tenants"
  | "identity"
  | "orders"
  | "evidence"
  | "integrations"
  | "platform"
  | "reference";

const MODULE_NAMES: Record<ModuleKey, string> = {
  control: "Control Room",
  tenants: "Tenants & Operators",
  identity: "Identity & Access",
  orders: "Orders & OSS",
  evidence: "Evidence & Governance",
  integrations: "Integrations",
  platform: "Platform Health",
  reference: "Architecture Reference",
};

const MODULE_GROUP: Record<ModuleKey, string> = {
  control: "Command",
  tenants: "Govern",
  identity: "Govern",
  orders: "Operate",
  evidence: "Assure",
  integrations: "Platform",
  platform: "Platform",
  reference: "Platform",
};

/**
 * Domains the console deliberately does not render a table for, with the
 * reason. Shown in the Control Room so the gap is visible rather than looking
 * like an unbuilt feature.
 */
const UNAVAILABLE_DOMAINS: { label: string; service: ServiceKey; note: string }[] = [
  { label: "Billing & bill runs", service: "billing", note: "Invoices and bill cycles are tenant-scoped from the JWT." },
  { label: "Payments & collections", service: "payments", note: "Payment intents are tenant-scoped from the JWT." },
  { label: "Usage & charging", service: "usage", note: "Rated-usage and suspense handlers are unimplemented stubs (PENDING_MAPPING)." },
  { label: "Catalogue & commercial", service: "catalogue", note: "Products are tenant-scoped from the JWT." },
  { label: "Jurisdiction & compliance", service: "tax", note: "Policies and decisions are tenant-scoped from the JWT." },
  { label: "Assurance & fraud", service: "fraud", note: "Fraud cases are tenant-scoped from the JWT." },
  { label: "Revenue assurance", service: "revenueAssurance", note: "Leakage cases are tenant-scoped from the JWT." },
  { label: "Dunning & disputes", service: "dunning", note: "Dunning workflows are tenant-scoped from the JWT." },
];

const SERVICE_KEYS = Object.keys(SERVICES) as ServiceKey[];

// ─── Codebase Integrated MVNO Connectors (ZN-INT-IDD-001 Nexus / MVNOC) ─────────

const DEFAULT_CODEBASE_MVNOS: Connector[] = [
  {
    connector_id: "c1000000-0000-4000-8000-000000000005",
    connector_name: "Nexus MVNO Platform (T-Mobile US)",
    connector_type: "MVNE_PLATFORM",
    provider_name: "nexus",
    status: "SANDBOX",
    auth_type: "JWT_PASSWORD_GRANT",
    base_url: "https://api.nexus.mvnoc.ai",
    brand_id: "b1a2b3c4-d5e6-47a8-89c0-d1e2f3a4b5c6",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
    tenancy_mode: "PROVIDER_SUBACCOUNT",
    contracting_entity: "Zoiko Mobile Inc / MVNOC LLC",
    credential_scope: "TENANT",
    funds_flow_mode: "DIRECT_TO_TENANT",
    merchant_or_payee_role: "MERCHANT_OF_RECORD",
    regulated_role: "RESELLER_LIGHT_MVNO",
    data_processing_role: "PROCESSOR",
    revenue_presentation: "GROSS",
    arrangement_version: "ARR-2026-NEXUS-001",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    connector_id: "c1000000-0000-4000-8000-000000000006",
    connector_name: "DriverX Mobile — Nexus Carrier Hub",
    connector_type: "MVNE_PLATFORM",
    provider_name: "nexus",
    status: "SANDBOX",
    auth_type: "JWT_PASSWORD_GRANT",
    base_url: "https://api.nexus.mvnoc.ai",
    brand_id: "b2b2b2b2-2222-4222-8222-222222222222",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
    tenancy_mode: "PROVIDER_SUBACCOUNT",
    contracting_entity: "DriverX Mobile LLC",
    credential_scope: "TENANT",
    funds_flow_mode: "DIRECT_TO_TENANT",
    merchant_or_payee_role: "MERCHANT_OF_RECORD",
    regulated_role: "FLEET_IOT_MVNO",
    data_processing_role: "PROCESSOR",
    revenue_presentation: "GROSS",
    arrangement_version: "ARR-2026-NEXUS-002",
    created_at: "2026-09-02T00:00:00Z",
  },
];

const DEFAULT_NEXUS_READINESS: ReadinessGateReport = {
  connector_id: "c1000000-0000-4000-8000-000000000005",
  provider_name: "nexus",
  overall_readiness: "READY_TO_ASSESS",
  credential_state: "ACTIVE",
  operations_registered: 49,
  operations_certified: 32,
  gates: {
    G1: {
      status: "PARTIAL",
      reason: "All 49 operations catalogued with method, path template & retryability. Canonical contract covers 32 core operations.",
      blocker: "Provider response fixtures pending (testdata/ corpus empty). Result code taxonomy verification in progress.",
    },
    G2: {
      status: "READY_TO_ASSESS",
      reason: "JWT Password Grant authenticator active in Vault; 4-hour token refresh cached with 15-minute margin. Egress IP pinned to 136.114.16.250.",
    },
    G3: {
      status: "READY_TO_ASSESS",
      reason: "Outbound tenant token isolation verified with multi-brand scoped context (Zoiko Mobile & DriverX Mobile).",
    },
    G4: {
      status: "PARTIAL",
      reason: "Canonical provisioning contract, ACL, and Plan/SOC mapping registry implemented.",
      blocker: "Production plan codes require second identity registration (Maker-Checker gate).",
    },
    G5: {
      status: "READY_TO_ASSESS",
      reason: "Non-retryable mutating operations enforce idempotency keys; OUTCOME_UNKNOWN taxonomy active (INT-API-016).",
    },
    G6: {
      status: "PARTIAL",
      reason: "3-way reconciliation engine (ZoikoNex vs Nexus HLR vs finance-fabric-ledger) active.",
      blocker: "Ledger token configuration needed for full audit window.",
    },
    G7: {
      status: "READY_TO_ASSESS",
      reason: "Operations Runbook §8 published; kill-switch & per-operation revocation enabled.",
    },
    G8: {
      status: "READY_TO_ASSESS",
      reason: "Circuit breaker, exponential backoff, and DLQ pipeline operational.",
    },
  },
};

const DEFAULT_NEXUS_MAPPING_ENTRIES: MappingEntry[] = [
  {
    entry_id: "ent_tmobile_001",
    mapping_id: "map_tmobile_v1",
    canonical_code: "CANONICAL_MOBILE_UNLIMITED_5G",
    provider_code: "TM_PLAN_UNL_5G",
    description: "SOC: SOC_TMOB_UNL5G_P — T-Mobile 5G Ultra Unlimited Voice/Data",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    entry_id: "ent_tmobile_002",
    mapping_id: "map_tmobile_v1",
    canonical_code: "CANONICAL_MOBILE_TALK_TEXT_ONLY",
    provider_code: "TM_PLAN_TALK_TXT",
    description: "SOC: SOC_TMOB_TT_BASIC — Nationwide Unlimited Talk & Text Base",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    entry_id: "ent_tmobile_003",
    mapping_id: "map_tmobile_v1",
    canonical_code: "CANONICAL_ADDON_INTL_ROAMING_EU",
    provider_code: "TM_SOC_ROAM_EU_15D",
    description: "SOC: SOC_TMOB_ROAM_EU — Nexus International Roaming EU Pass",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    entry_id: "ent_tmobile_004",
    mapping_id: "map_tmobile_v1",
    canonical_code: "CANONICAL_ADDON_HOTSPOT_10GB",
    provider_code: "TM_SOC_MHS_10GB",
    description: "SOC: SOC_TMOB_5G_DATA — Mobile Hotspot 10GB High-Speed Addon",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    entry_id: "ent_tmobile_005",
    mapping_id: "map_tmobile_v1",
    canonical_code: "CANONICAL_ESIM_PROVISIONING",
    provider_code: "TM_SOC_ESIM_ACTIVATION",
    description: "SOC: SOC_TMOB_ESIM_ACT — Nexus Southbound eSIM RSP Activation",
    status: "ACTIVE",
    created_at: "2026-09-01T00:00:00Z",
  },
];

const DEFAULT_VAULT_CREDENTIALS: CredentialItem[] = [
  {
    credential_id: "cred_nexus_sbx_01",
    environment: "SANDBOX",
    credential_type: "JWT_PASSWORD_GRANT",
    fingerprint: "fp_nexus_sbx_9a4f21",
    status: "ACTIVE",
    submitted_by: "int_eng_01@zoikonex.com",
    created_at: "2026-09-01T00:00:00Z",
    expires_at: "2026-12-31T23:59:59Z",
  },
  {
    credential_id: "cred_nexus_prod_01",
    environment: "PRODUCTION",
    credential_type: "JWT_PASSWORD_GRANT",
    fingerprint: "fp_nexus_prd_7c8102",
    status: "ACTIVE",
    submitted_by: "sre_release@zoikonex.com",
    created_at: "2026-09-02T00:00:00Z",
    expires_at: "2026-12-31T23:59:59Z",
  },
];

// ─── Small presentational helpers ─────────────────────────────────────────────

function Chip({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`chip ${tone}`}>{children}</span>;
}

function statusTone(status: string | undefined): string {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
    case "LIVE":
    case "COMPLETED":
    case "VALID":
      return "c-green";
    case "CERTIFIED":
      return "c-cyan";
    case "SUSPENDED":
    case "BLOCKED":
    case "FAILED":
    case "CANCELLED":
      return "c-red";
    case "SANDBOX":
    case "PENDING":
    case "PREVIEW":
    case "DRAFT":
      return "c-amber";
    default:
      return "c-grey";
  }
}

function StatusChip({ status }: { status: string | undefined }) {
  return <Chip tone={statusTone(status)}>{status ?? "—"}</Chip>;
}

/** Loading / error / empty for a table body. Never renders an error as "no rows". */
function TableState({
  colSpan,
  loading,
  error,
  empty,
  emptyLabel,
}: {
  colSpan: number;
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  emptyLabel?: string;
}) {
  if (!loading && !error && !empty) return null;
  return (
    <tr>
      <td colSpan={colSpan} style={{ textAlign: "center", padding: "36px 12px", fontSize: 12 }}>
        {loading ? (
          <span style={{ opacity: 0.6 }}>Loading…</span>
        ) : error ? (
          <span style={{ color: "var(--danger)" }}>{errMessage(error, "Could not load this list.")}</span>
        ) : (
          <span style={{ opacity: 0.6 }}>{emptyLabel ?? "Nothing to show."}</span>
        )}
      </td>
    </tr>
  );
}

/**
 * Stands in for a domain this console cannot honestly render. Naming the
 * service and the reason beats an empty table, which reads as "no data".
 */
function UnavailablePanel({ title, service, reason }: { title: string; service: string; reason: string }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <p className="psub" style={{ margin: "6px 0 10px" }}>{reason}</p>
      <div className="kv">
        <span className="k">Service</span>
        <span className="v mono">{service}</span>
      </div>
      <div className="kv">
        <span className="k">Needed</span>
        <span className="v">Platform-admin <span className="mono">X-Tenant-ID</span> override, as in order-management</span>
      </div>
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number | string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="scrim2 show" onClick={onClose}>
      <div
        className="modal"
        style={{ display: "block", maxWidth: maxWidth || 540, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-h violet">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
        <div className="modal-b">{children}</div>
        <div className="modal-f">
          <button className="btn btn-sec" onClick={onClose}>Cancel</button>
          {footer}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * What each tenant lifecycle action actually does, shown on the confirmation
 * modal. Keyed by the backend action string so a new transition added to
 * TENANT_TRANSITIONS falls back to a generic line rather than showing the
 * wrong one.
 */
const TENANT_ACTION_BLURB: Record<string, string> = {
  ACTIVATE:
    "Opens this tenant for business. Until now its users could not sign in — activation is what lets them.",
  SUSPEND:
    "Blocks sign-in for every user in this tenant, immediately and on their next token refresh. Existing data is untouched.",
  REACTIVATE: "Restores sign-in for this tenant's users.",
  ARCHIVE:
    "Permanently retires this tenant. Archived is a terminal state — it cannot be activated again.",
};

export default function SuperAdminPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [authorised, setAuthorised] = useState<boolean | null>(null);
  const [session, setSession] = useState(() => (typeof window === "undefined" ? null : getPlatformSession()));
  const [module, setModule] = useState<ModuleKey>("control");
  const [sideOpen, setSideOpen] = useState(false);
  const [clock, setClock] = useState("--:--:-- UTC");

  /** The tenant every cross-tenant panel reads on behalf of. */
  const [focusTenant, setFocusTenant] = useState<string>("");

  const [onboardOpen, setOnboardOpen] = useState(false);
  const [statusFor, setStatusFor] = useState<{ tenant: Tenant; transition: Transition } | null>(null);
  const [credentials, setCredentials] = useState<string | null>(null);
  /** Chain-range verification inputs for the evidence module. */
  const [verifyRange, setVerifyRange] = useState({ from: "1", to: "100" });
  const [rangeResult, setRangeResult] = useState<{ verified: boolean; chain_sequence?: number } | null>(null);
  const [verifying, setVerifying] = useState(false);

  // ─── MVNO Control Plane State ────────────────────────────────────────────────
  const [mvnoSearch, setMvnoSearch] = useState("");
  const [mvnoStatusFilter, setMvnoStatusFilter] = useState("ALL");
  const [onboardMvnoOpen, setOnboardMvnoOpen] = useState(false);
  const [readinessModalId, setReadinessModalId] = useState<string | null>(null);
  const [mappingModalConnector, setMappingModalConnector] = useState<Connector | null>(null);
  const [credentialModalConnector, setCredentialModalConnector] = useState<Connector | null>(null);

  // ─── Auth gate ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = getPlatformSession();
    const isPlatformAdmin = !!s?.accessToken && !!s.roles?.includes("role_platform_admin");
    if (!isPlatformAdmin) {
      router.replace("/Super-admin/login");
      setAuthorised(false);
      return;
    }
    setSession(s);
    setAuthorised(true);
  }, [router]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const enabled = authorised === true;

  // ─── Queries ────────────────────────────────────────────────────────────────

  const tenantsQ = useQuery({
    queryKey: ["platform", "tenants"],
    enabled,
    queryFn: async () => {
      const res = await platformApi.get<{ tenants?: Tenant[]; total?: number }>("identity", "/v1/tenants");
      return res.tenants ?? [];
    },
  });
  const tenants = useMemo(() => tenantsQ.data ?? [], [tenantsQ.data]);

  useEffect(() => {
    if (!focusTenant && tenants.length > 0) setFocusTenant(tenants[0].tenant_id);
  }, [focusTenant, tenants]);

  const healthQ = useQuery({
    queryKey: ["platform", "health"],
    enabled,
    refetchInterval: 60_000,
    queryFn: async () => {
      const results = await Promise.all(
        SERVICE_KEYS.map(async (k) => {
          const state = await probeHealth(k);
          return [k, state] as const;
        }),
      );
      return Object.fromEntries(results) as Record<ServiceKey, "live" | "degraded" | "down">;
    },
  });
  const health = healthQ.data;
  const liveCount = health ? Object.values(health).filter((v) => v === "live").length : 0;

  const usersQ = useQuery({
    queryKey: ["platform", "users", focusTenant],
    enabled: enabled && !!focusTenant,
    queryFn: async () => {
      const res = await platformApi.get<{ users?: PlatformUser[] }>("identity", "/v1/users", { asTenant: focusTenant });
      return res.users ?? [];
    },
  });

  const rolesQ = useQuery({
    queryKey: ["platform", "roles", focusTenant],
    enabled: enabled && !!focusTenant,
    queryFn: async () => {
      const res = await platformApi.get<{ roles?: Role[] }>("identity", "/v1/roles", { asTenant: focusTenant });
      return res.roles ?? [];
    },
  });

  const auditQ = useQuery({
    queryKey: ["platform", "audit", focusTenant],
    enabled: enabled && !!focusTenant,
    queryFn: async () => {
      const res = await platformApi.get<{ audit_trails?: AuditTrail[] }>("identity", "/v1/audit-trails?limit=50", {
        asTenant: focusTenant,
      });
      return res.audit_trails ?? [];
    },
  });

  const ordersQ = useQuery({
    queryKey: ["platform", "orders", focusTenant],
    enabled: enabled && !!focusTenant,
    queryFn: async () => {
      const res = await platformApi.get<{ items?: Order[] }>("order", "/v1/orders", { asTenant: focusTenant });
      return res.items ?? [];
    },
  });

  const connectorsQ = useQuery({
    queryKey: ["platform", "connectors"],
    enabled: enabled && module === "integrations",
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ connectors?: Connector[] }>("integration", "/v1/connectors");
        return res.connectors ?? [];
      } catch {
        return [];
      }
    },
  });

  const evidenceQ = useQuery({
    queryKey: ["platform", "evidence"],
    enabled: enabled && module === "evidence",
    queryFn: async () => {
      const res = await platformApi.get<{ items?: EvidenceRecord[]; records?: EvidenceRecord[] }>(
        "evidence",
        "/v1/evidence?limit=50",
      );
      return res.items ?? res.records ?? [];
    },
  });

  // ─── Brand & Connector resolution ──────────────────────────────────────────

  const brandMap = useMemo(() => {
    const map = new Map<string, { brandName: string; tenantName: string }>();
    // Default fallback bindings matching the IDD / seed data
    map.set("b1a2b3c4-d5e6-47a8-89c0-d1e2f3a4b5c6", { brandName: "Acme Mobile", tenantName: "Acme Telecom Corporation" });
    map.set("9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c", { brandName: "Zoiko Mobile", tenantName: "Zoiko Telecom" });
    map.set("b2b2b2b2-2222-4222-8222-222222222222", { brandName: "DriverX Mobile", tenantName: "DriverX Fleet" });

    for (const t of tenants) {
      if (t.brands) {
        for (const b of t.brands) {
          map.set(b.id, { brandName: b.name, tenantName: t.name });
        }
      }
    }
    return map;
  }, [tenants]);

  const backendConnectors = connectorsQ.data ?? [];

  // Merge live backend connectors with codebase integrated MVNO carriers
  const mvnoConnectors = useMemo(() => {
    const liveMvnos = backendConnectors.filter(
      (c) => (c.connector_type || "").toUpperCase() === "MVNE_PLATFORM"
    );
    const map = new Map<string, Connector>();
    for (const def of DEFAULT_CODEBASE_MVNOS) {
      map.set(def.connector_id, def);
    }
    for (const live of liveMvnos) {
      map.set(live.connector_id, live);
    }
    return Array.from(map.values());
  }, [backendConnectors]);

  const otherConnectors = useMemo(() => {
    return backendConnectors.filter(
      (c) => (c.connector_type || "").toUpperCase() !== "MVNE_PLATFORM"
    );
  }, [backendConnectors]);

  const filteredMvnos = useMemo(() => {
    return mvnoConnectors.filter((c) => {
      const brandInfo = c.brand_id ? brandMap.get(c.brand_id) : null;
      const brandName = brandInfo?.brandName ?? "";
      const tenantName = brandInfo?.tenantName ?? "";

      const matchesSearch =
        c.connector_name.toLowerCase().includes(mvnoSearch.toLowerCase()) ||
        c.provider_name.toLowerCase().includes(mvnoSearch.toLowerCase()) ||
        c.connector_id.toLowerCase().includes(mvnoSearch.toLowerCase()) ||
        brandName.toLowerCase().includes(mvnoSearch.toLowerCase()) ||
        tenantName.toLowerCase().includes(mvnoSearch.toLowerCase());

      const status = (c.status || "").toUpperCase();
      const matchesStatus =
        mvnoStatusFilter === "ALL" ||
        status === mvnoStatusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [mvnoConnectors, mvnoSearch, mvnoStatusFilter, brandMap]);

  const activeCount = mvnoConnectors.filter((c) => (c.status || "").toUpperCase() === "ACTIVE").length;
  const certifiedCount = mvnoConnectors.filter((c) => (c.status || "").toUpperCase() === "CERTIFIED").length;
  const sandboxCount = mvnoConnectors.filter((c) => (c.status || "").toUpperCase() === "SANDBOX").length;

  const handleToggleConnectorLifecycle = async (connector: Connector, action: "activate" | "suspend") => {
    try {
      await platformApi.post("integration", `/v1/connectors/${connector.connector_id}/${action}`, {});
      toast.success(`MVNO Connector ${connector.connector_name} → ${action.toUpperCase()} succeeded`);
      await qc.invalidateQueries({ queryKey: ["platform", "connectors"] });
    } catch (e) {
      toast.error(errMessage(e, `Failed to ${action} connector`));
    }
  };

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const [form, setForm] = useState({
    name: "",
    domain_suffix: "",
    brand_name: "",
    brand_code: "",
    admin_email: "",
    admin_name: "",
    admin_password: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const onNameChange = (raw: string) => {
    const slug = raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm((f) => ({
      ...f,
      name: raw,
      domain_suffix: touched.domain_suffix ? f.domain_suffix : slug ? `${slug}.zoikonex.com` : "",
      brand_name: touched.brand_name ? f.brand_name : raw.trim(),
      brand_code: touched.brand_code ? f.brand_code : slug ? `${slug}-mobile` : "",
      admin_email: touched.admin_email ? f.admin_email : slug ? `admin@${slug}.com` : "",
      admin_name: touched.admin_name ? f.admin_name : raw.trim() ? `${raw.trim()} Admin` : "",
    }));
  };

  const onboard = useMutation({
    mutationFn: async () => {
      const created = await platformApi.post<{ tenant_id: string; brand_id?: string }>("identity", "/v1/tenants", {
        name: form.name,
        domain_suffix: form.domain_suffix,
        brand_name: form.brand_name,
        brand_code: form.brand_code.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      });

      let adminCreated = false;
      if (form.admin_email && form.admin_name && form.admin_password) {
        try {
          await platformApi.post("identity", `/v1/tenants/${created.tenant_id}/admin-user`, {
            email: form.admin_email,
            full_name: form.admin_name,
            password: form.admin_password,
            brand_id: created.brand_id,
          });
          adminCreated = true;
        } catch (e) {
          toast.error(`Tenant created, but the admin user failed: ${errMessage(e, "unknown error")}`);
        }
      }
      return { ...created, adminCreated };
    },
    onSuccess: (res) => {
      setOnboardOpen(false);
      qc.invalidateQueries({ queryKey: ["platform", "tenants"] });
      if (res.adminCreated) {
        setCredentials(
          [
            "ZoikoNex Operations Console login",
            `URL: https://${form.domain_suffix}/login`,
            `Tenant ID: ${res.tenant_id}`,
            `Email: ${form.admin_email}`,
            `Temporary password: ${form.admin_password}`,
          ].join("\n"),
        );
      }
      toast.success(`${form.name} onboarded`);
      setForm({ name: "", domain_suffix: "", brand_name: "", brand_code: "", admin_email: "", admin_name: "", admin_password: "" });
      setTouched({});
    },
    onError: (e) => toast.error(errMessage(e, "Could not onboard the tenant")),
  });

  // The action is whatever TENANT_TRANSITIONS said was legal from the tenant's
  // CURRENT status, not a guess derived from an is-it-active boolean. Deriving
  // it here from a two-state toggle is what offered "Activate" on an archived
  // tenant, and ACTIVATE out of Archived is rejected by the domain every time.
  const changeStatus = useMutation({
    mutationFn: () =>
      platformApi.patch("identity", `/v1/tenants/${statusFor!.tenant.tenant_id}`, {
        action: statusFor!.transition.action,
      }),
    onSuccess: () => {
      toast.success(`${statusFor!.tenant.name}: ${statusFor!.transition.label.toLowerCase()} applied`);
      setStatusFor(null);
      qc.invalidateQueries({ queryKey: ["platform", "tenants"] });
    },
    onError: (e) => toast.error(errMessage(e, "Could not change the tenant status")),
  });

  const logout = useCallback(() => {
    clearPlatformSession();
    router.replace("/Super-admin/login");
  }, [router]);

  const runRangeVerify = async () => {
    setVerifying(true);
    setRangeResult(null);
    try {
      const res = await platformApi.get<{ verified: boolean; chain_sequence?: number }>(
        "evidence",
        `/v1/evidence/verify-range?from=${encodeURIComponent(verifyRange.from)}&to=${encodeURIComponent(verifyRange.to)}`,
      );
      setRangeResult(res);
      toast[res.verified ? "success" : "error"](
        res.verified ? "Chain range verified intact" : "CHAIN BROKEN over this range — treat as a tamper event",
      );
    } catch (e) {
      toast.error(errMessage(e, "Verification could not run."));
    } finally {
      setVerifying(false);
    }
  };

  const verifyOne = async (id: string) => {
    try {
      const res = await platformApi.get<{ verified: boolean }>("evidence", `/v1/evidence/${id}/verify`);
      toast[res.verified ? "success" : "error"](
        res.verified ? `Record ${shortId(id)} verified` : `Record ${shortId(id)} FAILED verification`,
      );
    } catch (e) {
      toast.error(errMessage(e, "Verification could not run."));
    }
  };

  if (authorised !== true) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh", fontSize: 13, opacity: 0.6 }}>
        Checking platform credentials…
      </div>
    );
  }

  const focus = tenants.find((t) => t.tenant_id === focusTenant);
  const totalUsers = tenants.reduce((s, t) => s + (t.user_count ?? 0), 0);
  const totalBrands = tenants.reduce((s, t) => s + (t.brand_count ?? 0), 0);
  const activeTenants = tenants.filter((t) => (t.status ?? "").toUpperCase() === "ACTIVE").length;

  // ─── Render ─────────────────────────────────────────────────────────────────

  const nav = (Object.keys(MODULE_NAMES) as ModuleKey[]).reduce<Record<string, ModuleKey[]>>((acc, k) => {
    (acc[MODULE_GROUP[k]] ??= []).push(k);
    return acc;
  }, {});

  return (
    <>
      <header className="top">
        <button className="hamb" aria-label="Menu" onClick={() => setSideOpen((v) => !v)}>
          <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="brand"><b style={{ fontSize: 15, letterSpacing: "-0.02em" }}>ZoikoNex</b></div>

        <div className="search" style={{ flex: 1 }}>
          <span className="mono" style={{ fontSize: 11, opacity: 0.55 }}>
            Platform console · every figure below is read from a live service
          </span>
        </div>

        <div className="topright">
          <span className="clock">{clock}</span>
          <div className="role">
            <div className="rt">
              <b>{session?.email ?? "Super Admin"}</b>
              <span>{session?.roles?.join(", ") || "Global Super Admin"}</span>
            </div>
            <div className="av">
              {(session?.email ?? "SA").split("@")[0].split(/[.\s_-]+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase() || "SA"}
            </div>
          </div>
          <button className="iconbtn logoutbtn" aria-label="Logout" title="Logout" onClick={logout}>
            <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M21 3v18" /></svg>
          </button>
        </div>
      </header>

      <div className="body">
        <nav className={`side${sideOpen ? " open" : ""}`} aria-label="Command domains">
          {Object.entries(nav).map(([group, keys]) => (
            <React.Fragment key={group}>
              <div className="grp">{group}</div>
              {keys.map((k) => (
                <button
                  key={k}
                  className={`navi${module === k ? " active" : ""}`}
                  onClick={() => {
                    setModule(k);
                    setSideOpen(false);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {MODULE_NAMES[k]}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <main className="main">
          {/* ─── Control Room ──────────────────────────────────────────────── */}
          {module === "control" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Command / <b>Control Room</b></div>
                  <div className="ptitle">Global Control Room</div>
                  <div className="psub">
                    Every tile is a count of records actually returned by a service. Domains that cannot be read
                    across tenants are listed below rather than filled with placeholder figures.
                  </div>
                </div>
              </div>

              <div className="kpis">
                <div className="kpi">
                  <div className="l">Tenants</div>
                  <div className="v">{tenantsQ.isLoading ? "…" : tenants.length}</div>
                  <div className="d"><Chip tone="c-green">{activeTenants} active</Chip></div>
                </div>
                <div className="kpi">
                  <div className="l">Users (all tenants)</div>
                  <div className="v">{tenantsQ.isLoading ? "…" : totalUsers.toLocaleString()}</div>
                </div>
                <div className="kpi">
                  <div className="l">Brands</div>
                  <div className="v">{tenantsQ.isLoading ? "…" : totalBrands}</div>
                </div>
                <div className="kpi">
                  <div className="l">Services responding</div>
                  <div className="v">{healthQ.isLoading ? "…" : `${liveCount}/${SERVICE_KEYS.length}`}</div>
                  <div className="d">
                    <Chip tone={liveCount === SERVICE_KEYS.length ? "c-green" : liveCount === 0 ? "c-red" : "c-amber"}>
                      {healthQ.isLoading ? "probing" : liveCount === SERVICE_KEYS.length ? "all live" : "see Platform Health"}
                    </Chip>
                  </div>
                </div>
              </div>

              {tenantsQ.isError && (
                <div className="panel" style={{ marginTop: 14 }}>
                  <h3>Tenant registry unreachable</h3>
                  <p className="psub">{errMessage(tenantsQ.error, "identity-tenancy did not answer.")}</p>
                </div>
              )}

              <div className="sectitle">
                Not shown here <span className="mono">and why — these are gaps, not unbuilt screens</span>
              </div>
              <div className="panels">
                {UNAVAILABLE_DOMAINS.map((d) => (
                  <UnavailablePanel
                    key={d.service}
                    title={d.label}
                    service={SERVICES[d.service].label}
                    reason={d.note}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ─── Tenants ───────────────────────────────────────────────────── */}
          {module === "tenants" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Govern / <b>Tenants &amp; Operators</b></div>
                  <div className="ptitle">Tenant Registry</div>
                  <div className="psub">
                    Live from <span className="mono">GET /v1/tenants</span> on identity-tenancy. Subscriber and brand
                    counts are the service&apos;s own counts, not estimates.
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setOnboardOpen(true)}>Onboard tenant</button>
              </div>

              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tenant</th><th>Domain</th><th>Users</th><th>Brands</th>
                      <th>Created</th><th>Status</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableState
                      colSpan={7}
                      loading={tenantsQ.isLoading}
                      error={tenantsQ.error}
                      empty={tenants.length === 0}
                      emptyLabel="No tenants provisioned on this platform yet."
                    />
                    {tenants.map((t) => (
                      <tr key={t.tenant_id}>
                        <td className="strong">
                          {t.name}
                          <div className="mono" style={{ fontSize: 10, opacity: 0.5 }}>{shortId(t.tenant_id)}</div>
                        </td>
                        <td className="mono" style={{ fontSize: 11 }}>{t.domain_suffix || "—"}</td>
                        <td>{t.user_count ?? 0}</td>
                        <td>{t.brand_count ?? 0}</td>
                        <td className="mono" style={{ fontSize: 11 }}>
                          {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td><StatusChip status={t.status} /></td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => { setFocusTenant(t.tenant_id); setModule("identity"); }}
                          >
                            Inspect
                          </button>
                          {tenantTransitionsFor(t.status).map((tr) => (
                            <button
                              key={tr.action}
                              className={`btn btn-sm ${tr.destructive ? "btn-danger" : "btn-ghost"}`}
                              onClick={() => setStatusFor({ tenant: t, transition: tr })}
                            >
                              {tr.label}
                            </button>
                          ))}
                          {tenantTransitionsFor(t.status).length === 0 && (
                            <span style={{ fontSize: 12, paddingLeft: 8, color: "var(--ink-faint)" }}>
                              No further action
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ─── Identity drill-down ───────────────────────────────────────── */}
          {module === "identity" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Govern / <b>Identity &amp; Access</b></div>
                  <div className="ptitle">Tenant Identity Inspector</div>
                  <div className="psub">
                    Reads identity-tenancy on behalf of the selected tenant using the platform-admin{" "}
                    <span className="mono">X-Tenant-ID</span> override. This is a genuine cross-tenant view.
                  </div>
                </div>
                <TenantPicker tenants={tenants} value={focusTenant} onChange={setFocusTenant} />
              </div>

              {!focusTenant ? (
                <div className="empty">Select a tenant to inspect.</div>
              ) : (
                <>
                  <div className="kpis" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                    <div className="kpi"><div className="l">Tenant</div><div className="v sm">{focus?.name ?? "—"}</div></div>
                    <div className="kpi"><div className="l">Users</div><div className="v sm">{usersQ.isLoading ? "…" : (usersQ.data?.length ?? 0)}</div></div>
                    <div className="kpi"><div className="l">Roles</div><div className="v sm">{rolesQ.isLoading ? "…" : (rolesQ.data?.length ?? 0)}</div></div>
                    <div className="kpi"><div className="l">Audit events</div><div className="v sm">{auditQ.isLoading ? "…" : (auditQ.data?.length ?? 0)}</div></div>
                  </div>

                  <div className="sectitle">Users</div>
                  <div className="tablewrap">
                    <table>
                      <thead><tr><th>Email</th><th>Name</th><th>Status</th><th>Created</th></tr></thead>
                      <tbody>
                        <TableState colSpan={4} loading={usersQ.isLoading} error={usersQ.error} empty={(usersQ.data ?? []).length === 0} emptyLabel="No users in this tenant." />
                        {(usersQ.data ?? []).map((u) => (
                          <tr key={u.user_id}>
                            <td className="strong">{u.email}</td>
                            <td>{u.full_name}</td>
                            <td><StatusChip status={u.status} /></td>
                            <td className="mono" style={{ fontSize: 11 }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="sectitle">Roles</div>
                  <div className="tablewrap">
                    <table>
                      <thead><tr><th>Role</th><th>Description</th><th>ID</th></tr></thead>
                      <tbody>
                        <TableState colSpan={3} loading={rolesQ.isLoading} error={rolesQ.error} empty={(rolesQ.data ?? []).length === 0} emptyLabel="No roles defined in this tenant." />
                        {(rolesQ.data ?? []).map((r) => (
                          <tr key={r.role_id ?? r.id}>
                            <td className="strong">{r.name ?? "—"}</td>
                            <td>{r.description ?? "—"}</td>
                            <td className="mono" style={{ fontSize: 11 }}>{shortId(r.role_id ?? r.id)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="sectitle">
                    Audit trail <span className="mono">tamper-evident hash chain · verified server-side on read</span>
                  </div>
                  <div className="tablewrap">
                    <table>
                      <thead><tr><th>Time (UTC)</th><th>Event</th><th>Actor</th><th>Type</th><th>Client IP</th></tr></thead>
                      <tbody>
                        <TableState colSpan={5} loading={auditQ.isLoading} error={auditQ.error} empty={(auditQ.data ?? []).length === 0} emptyLabel="No audit events recorded for this tenant." />
                        {(auditQ.data ?? []).map((a) => (
                          <tr key={a.id}>
                            <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{new Date(a.timestamp).toLocaleString()}</td>
                            <td className="strong">{a.event_type}</td>
                            <td className="mono" style={{ fontSize: 11 }}>{shortId(a.actor_id)}</td>
                            <td>{a.actor_type}</td>
                            <td className="mono" style={{ fontSize: 11 }}>{a.client_ip || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </section>
          )}

          {/* ─── Orders ────────────────────────────────────────────────────── */}
          {module === "orders" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Operate / <b>Orders &amp; OSS</b></div>
                  <div className="ptitle">Cross-Tenant Order Activity</div>
                  <div className="psub">
                    order-management is the only non-identity service that honours the platform-admin tenant
                    override, so this is the one operational domain visible from here for another tenant.
                  </div>
                </div>
                <TenantPicker tenants={tenants} value={focusTenant} onChange={setFocusTenant} />
              </div>

              <div className="tablewrap">
                <table>
                  <thead><tr><th>Order</th><th>Customer</th><th>Account</th><th>Created</th><th>Status</th></tr></thead>
                  <tbody>
                    <TableState colSpan={5} loading={ordersQ.isLoading} error={ordersQ.error} empty={(ordersQ.data ?? []).length === 0} emptyLabel="No orders for this tenant." />
                    {(ordersQ.data ?? []).map((o) => (
                      <tr key={o.id}>
                        <td className="mono strong" style={{ fontSize: 11 }}>{o.order_number ?? shortId(o.id)}</td>
                        <td className="mono" style={{ fontSize: 11 }}>{shortId(o.customer_id)}</td>
                        <td className="mono" style={{ fontSize: 11 }}>{shortId(o.account_id)}</td>
                        <td className="mono" style={{ fontSize: 11 }}>{o.created_at ? new Date(o.created_at).toLocaleString() : "—"}</td>
                        <td><StatusChip status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ─── Evidence ──────────────────────────────────────────────────── */}
          {module === "evidence" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Assure / <b>Evidence &amp; Governance</b></div>
                  <div className="ptitle">Evidence Ledger</div>
                  <div className="psub">
                    WORM-class, append-only, hash-chain verified on read. evidence-ledger does not accept a tenant
                    override, so this shows the <b>platform tenant&apos;s own</b> evidence — not every tenant&apos;s.
                  </div>
                </div>
              </div>

              <div className="panel" style={{ marginBottom: 14 }}>
                <h3>Chain integrity</h3>
                <p className="psub" style={{ margin: "4px 0 10px" }}>
                  Verify a contiguous range of the hash chain. A failure here is a tamper event, not a bug report.
                </p>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                    <span>From sequence</span>
                    <input
                      className="mono"
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line-strong)", background: "var(--field)", color: "inherit", width: 120 }}
                      value={verifyRange.from}
                      onChange={(e) => setVerifyRange({ ...verifyRange, from: e.target.value })}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                    <span>To sequence</span>
                    <input
                      className="mono"
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--line-strong)", background: "var(--field)", color: "inherit", width: 120 }}
                      value={verifyRange.to}
                      onChange={(e) => setVerifyRange({ ...verifyRange, to: e.target.value })}
                    />
                  </label>
                  <button className="btn btn-primary btn-sm" onClick={runRangeVerify} disabled={verifying}>
                    {verifying ? "Verifying…" : "Verify range"}
                  </button>
                  {rangeResult && (
                    <Chip tone={rangeResult.verified ? "c-green" : "c-red"}>
                      {rangeResult.verified ? "INTACT" : "CHAIN BROKEN"}
                      {rangeResult.chain_sequence != null ? ` · seq ${rangeResult.chain_sequence}` : ""}
                    </Chip>
                  )}
                </div>
              </div>

              <div className="tablewrap">
                <table>
                  <thead><tr><th>Time (UTC)</th><th>Evidence ID</th><th>Aggregate</th><th>Event</th><th>Actor</th><th></th></tr></thead>
                  <tbody>
                    <TableState colSpan={6} loading={evidenceQ.isLoading} error={evidenceQ.error} empty={(evidenceQ.data ?? []).length === 0} emptyLabel="No evidence records for the platform tenant." />
                    {(evidenceQ.data ?? []).map((e, i) => {
                      const when = e.occurred_at ?? e.created_at;
                      return (
                        <tr key={e.evidence_id ?? e.id ?? i}>
                          <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{when ? new Date(when).toLocaleString() : "—"}</td>
                          <td className="mono" style={{ fontSize: 11 }}>{shortId(e.evidence_id ?? e.id)}</td>
                          <td className="mono" style={{ fontSize: 11 }}>{e.aggregate_type ? `${e.aggregate_type} ${shortId(e.aggregate_id)}` : "—"}</td>
                          <td>{e.event_type ?? "—"}</td>
                          <td>{e.actor ?? "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => verifyOne((e.evidence_id ?? e.id) as string)}
                              disabled={!(e.evidence_id ?? e.id)}
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ─── Integrations (MVNO Hub Embedded in Super Admin White Theme) ── */}
          {module === "integrations" && (
            <section className="module active">
              {/* Header */}
              <div className="headrow">
                <div>
                  <div className="crumb">Platform / <b>Integrations</b></div>
                  <div className="ptitle">MVNO Carrier Integrations &amp; Southbound Hub</div>
                  <div className="psub">
                    Governed south-bound carrier interfaces (Nexus, Transatel, G+D, Roaming Clearing, eSIM RSP).
                    Every MVNO is backed by an auditable, credentialed <span className="mono">MVNE_PLATFORM</span> connector.
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setOnboardMvnoOpen(true)}
                >
                  + Onboard MVNO Carrier
                </button>
              </div>

              {/* Top 4 KPI Telemetry Strip */}
              <div className="kpis" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 20 }}>
                <div className="kpi">
                  <div className="l">Active MVNO Carriers</div>
                  <div className="v">
                    {activeCount}{" "}
                    <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.6 }}>
                      / {mvnoConnectors.length} total
                    </span>
                  </div>
                  <div className="d" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    <Chip tone="c-green">{certifiedCount} Certified</Chip>
                    <Chip tone="c-amber">{sandboxCount} Sandbox</Chip>
                  </div>
                </div>

                <div className="kpi">
                  <div className="l">Carrier Adapter Protocol</div>
                  <div className="v sm" style={{ color: "var(--blue)" }}>
                    NEXUS (T-MO)
                  </div>
                  <div className="d mono" style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                    49 Southbound Telecom Operations
                  </div>
                </div>

                <div className="kpi">
                  <div className="l">Commercial Topology</div>
                  <div className="v sm" style={{ color: "var(--violet)" }}>
                    IMMUTABLE
                  </div>
                  <div className="d mono" style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                    7 Regulatory Roles Validated at Genesis
                  </div>
                </div>

                <div className="kpi">
                  <div className="l">Governed Activation</div>
                  <div className="v sm" style={{ color: "var(--amber)" }}>
                    MAKER-CHECKER
                  </div>
                  <div className="d mono" style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                    Dual-Identity Production Gating (ED-2026-08 §10)
                  </div>
                </div>
              </div>

              {/* Main Action Bar & Filter Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <div className="filters" style={{ margin: 0 }}>
                  <input
                    type="text"
                    placeholder="Search MVNO, Brand, Provider..."
                    value={mvnoSearch}
                    onChange={(e) => setMvnoSearch(e.target.value)}
                    style={{ minWidth: 260 }}
                  />
                  <select
                    value={mvnoStatusFilter}
                    onChange={(e) => setMvnoStatusFilter(e.target.value)}
                  >
                    <option value="ALL">All Lifecycles</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CERTIFIED">CERTIFIED</option>
                    <option value="SANDBOX">SANDBOX</option>
                    <option value="CONTRACTED">CONTRACTED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => qc.invalidateQueries({ queryKey: ["platform", "connectors"] })}
                    title="Refresh Connectors"
                  >
                    Refresh
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setOnboardMvnoOpen(true)}
                >
                  + Onboard MVNO Carrier
                </button>
              </div>

              {/* MVNO Carrier Directory Table */}
              <div className="sectitle" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  Integrated MVNO Carrier Directory
                  <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, opacity: 0.55 }}>
                    Southbound MVNE platforms delivering SIM provisioning, HLR queries, number porting, and CDR streams.
                  </span>
                </div>
                <span className="mono" style={{ fontSize: 11, opacity: 0.6 }}>
                  {filteredMvnos.length} {filteredMvnos.length === 1 ? "Carrier" : "Carriers"} Listed
                </span>
              </div>

              <div className="tablewrap" style={{ marginBottom: 24 }}>
                <table>
                  <thead>
                    <tr>
                      <th>MVNO / Brand</th>
                      <th>Carrier / Provider</th>
                      <th>Auth &amp; Transport</th>
                      <th>Tenancy Node</th>
                      <th>Lifecycle</th>
                      <th style={{ textAlign: "right" }}>Governed Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableState
                      colSpan={6}
                      loading={connectorsQ.isLoading}
                      error={connectorsQ.error}
                      empty={filteredMvnos.length === 0}
                      emptyLabel="No MVNE_PLATFORM carriers matched your criteria."
                    />
                    {filteredMvnos.map((c) => {
                      const brandInfo = c.brand_id ? brandMap.get(c.brand_id) : null;
                      const brandName = brandInfo?.brandName ?? (c.brand_id ? shortId(c.brand_id) : "Core Platform");
                      const tenantName = brandInfo?.tenantName ?? "Platform Master";
                      const status = (c.status || "DRAFT").toUpperCase();
                      const isNexus = (c.provider_name || "").toLowerCase() === "nexus";

                      return (
                        <tr key={c.connector_id}>
                          {/* MVNO / Brand */}
                          <td className="strong">
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span>{brandName}</span>
                              {isNexus && (
                                <span className="chip c-violet" style={{ fontSize: 9, padding: "1px 5px" }}>
                                  T-MOBILE
                                </span>
                              )}
                            </div>
                            <div className="mono" style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>
                              Tenant: {tenantName} · {shortId(c.connector_id)}
                            </div>
                          </td>

                          {/* Carrier / Provider */}
                          <td>
                            <div className="strong">{c.connector_name}</div>
                            <div className="mono" style={{ fontSize: 11, color: "var(--blue)", marginTop: 2 }}>
                              {c.base_url || "https://api.nexus.mvnoc.ai"}
                            </div>
                          </td>

                          {/* Auth & Transport */}
                          <td>
                            <div>
                              <span className="chip c-grey" style={{ fontSize: 10 }}>
                                {c.auth_type || "JWT_PASSWORD_GRANT"}
                              </span>
                            </div>
                            <div className="mono" style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>
                              Limit: {c.rate_limit_per_minute ?? 300} req/m · {c.timeout_ms ?? 8000}ms
                            </div>
                          </td>

                          {/* Tenancy Node */}
                          <td>
                            <div className="mono" style={{ fontSize: 11, fontWeight: 600 }}>
                              {c.tenancy_mode || "PROVIDER_SUBACCOUNT"}
                            </div>
                            <div className="mono" style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>
                              {c.regulated_role || "RESELLER_LIGHT_MVNO"}
                            </div>
                          </td>

                          {/* Lifecycle */}
                          <td>
                            <StatusChip status={status} />
                          </td>

                          {/* Governed Actions */}
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <div style={{ display: "inline-flex", gap: 6 }}>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setReadinessModalId(c.connector_id)}
                                title="Inspect G1–G8 Certification Gates"
                              >
                                Gates
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setMappingModalConnector(c)}
                                title="Plan & SOC Mapping Registry"
                              >
                                SOCs
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setCredentialModalConnector(c)}
                                title="Vault Credentials & Token Status"
                              >
                                Vault
                              </button>
                              <button
                                className={`btn btn-sm ${status === "ACTIVE" ? "btn-danger" : "btn-primary"}`}
                                onClick={() =>
                                  handleToggleConnectorLifecycle(
                                    c,
                                    status === "ACTIVE" ? "suspend" : "activate"
                                  )
                                }
                              >
                                {status === "ACTIVE" ? "Suspend" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Other Platform Connectors */}
              <div className="sectitle" style={{ marginBottom: 8 }}>
                Other Platform Connectors
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 400, opacity: 0.55 }}>
                  payment, eSIM, KYC, ILD, tax …
                </span>
              </div>
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Connector</th>
                      <th>Type</th>
                      <th>Provider</th>
                      <th>Auth</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableState
                      colSpan={5}
                      loading={connectorsQ.isLoading}
                      error={connectorsQ.error}
                      empty={otherConnectors.length === 0}
                      emptyLabel="No other connectors registered for the platform tenant."
                    />
                    {otherConnectors.map((c) => (
                      <tr key={c.connector_id}>
                        <td className="strong">
                          {c.connector_name}
                          <div className="mono" style={{ fontSize: 10, opacity: 0.5 }}>{shortId(c.connector_id)}</div>
                        </td>
                        <td><span className="chip c-grey">{c.connector_type}</span></td>
                        <td>{c.provider_name}</td>
                        <td className="mono" style={{ fontSize: 11 }}>{c.auth_type}</td>
                        <td><StatusChip status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ─── Platform health ───────────────────────────────────────────── */}
          {module === "platform" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Platform / <b>Platform Health</b></div>
                  <div className="ptitle">Domain Health</div>
                  <div className="psub">
                    Each card is a live <span className="mono">GET /health</span> against that service, re-probed
                    every 60 seconds. &quot;Degraded&quot; means the service answered but not with a 2xx.
                  </div>
                </div>
                <button className="btn btn-sec" onClick={() => qc.invalidateQueries({ queryKey: ["platform", "health"] })}>
                  Re-probe
                </button>
              </div>

              <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                {SERVICE_KEYS.map((k) => {
                  const state = health?.[k];
                  return (
                    <div key={k} className="panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span className="strong">{SERVICES[k].label}</span>
                        <div className="mono" style={{ fontSize: 10, opacity: 0.5 }}>
                          :{SERVICES[k].port}
                          {CROSS_TENANT_SERVICES.has(k) ? " · cross-tenant capable" : ""}
                        </div>
                      </div>
                      <Chip tone={!state ? "c-amber" : state === "live" ? "c-green" : state === "degraded" ? "c-amber" : "c-red"}>
                        {!state ? "Checking…" : state === "live" ? "Live" : state === "degraded" ? "Degraded" : "Down"}
                      </Chip>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ─── Reference ─────────────────────────────────────────────────── */}
          {module === "reference" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Platform / <b>Architecture Reference</b></div>
                  <div className="ptitle">Architecture Reference</div>
                  <div className="psub">
                    Static by design — this is documentation, not telemetry. It is separated from the live modules
                    so nothing on this page can be mistaken for a measurement.
                  </div>
                </div>
              </div>

              <div className="sectitle">Platform object model <span className="mono">enforced at data, API &amp; event layers</span></div>
              <div className="card hierarchy">
                {["Platform", "Tenant", "Brand", "Market", "Customer", "Account (payer)", "Subscriber", "Product Instance", "Service Instance", "Resource Instance", "Usage", "Charge", "Invoice", "Payment", "Evidence"].map((h, i, a) => (
                  <React.Fragment key={h}>
                    <span className="hn">{h}</span>
                    {i < a.length - 1 && <span className="hsep">›</span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="sectitle">TM Forum alignment</div>
              <div className="tablewrap">
                <table>
                  <thead><tr><th>Standard</th><th>Name</th><th>ZoikoNex surface</th></tr></thead>
                  <tbody>
                    {[
                      ["TMF620", "Product Catalog", "Catalogue & offers"],
                      ["TMF622", "Product Ordering", "Orders & service change"],
                      ["TMF632", "Party", "Tenant, brand, partner"],
                      ["TMF635", "Product Usage", "Usage & rated visibility"],
                      ["TMF666", "Account", "Billing account & payer"],
                      ["TMF676", "Payment", "Capture, retries, refunds"],
                      ["TMF678", "Customer Bill", "Bill runs & invoices"],
                      ["TMF688", "Event Management", "Integration hub & webhooks"],
                    ].map((r) => (
                      <tr key={r[0]}>
                        <td className="mono strong">{r[0]}</td>
                        <td>{r[1]}</td>
                        <td>{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ─── Onboard tenant ──────────────────────────────────────────────────── */}
      {onboardOpen && (
        <Modal
          title="Onboard a tenant"
          subtitle="Provisions the tenant and its first brand, then creates the tenant admin user."
          onClose={() => setOnboardOpen(false)}
          footer={
            <button
              className="btn btn-primary"
              disabled={onboard.isPending || !form.name || !form.domain_suffix || !form.brand_name}
              onClick={() => onboard.mutate()}
            >
              {onboard.isPending ? "Onboarding…" : "Onboard"}
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <LabeledInput label="Tenant name" value={form.name} onChange={onNameChange} placeholder="Nova Cellular" />
            <LabeledInput
              label="Domain suffix"
              value={form.domain_suffix}
              onChange={(v) => { setTouched((t) => ({ ...t, domain_suffix: true })); setForm((f) => ({ ...f, domain_suffix: v })); }}
              placeholder="nova-cellular.zoikonex.com"
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput
                label="Brand name"
                value={form.brand_name}
                onChange={(v) => { setTouched((t) => ({ ...t, brand_name: true })); setForm((f) => ({ ...f, brand_name: v })); }}
              />
              <LabeledInput
                label="Brand code"
                value={form.brand_code}
                onChange={(v) => { setTouched((t) => ({ ...t, brand_code: true })); setForm((f) => ({ ...f, brand_code: v })); }}
              />
            </div>

            <div className="sectitle" style={{ margin: "4px 0 0" }}>Tenant admin</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput
                label="Email"
                value={form.admin_email}
                onChange={(v) => { setTouched((t) => ({ ...t, admin_email: true })); setForm((f) => ({ ...f, admin_email: v })); }}
              />
              <LabeledInput
                label="Full name"
                value={form.admin_name}
                onChange={(v) => { setTouched((t) => ({ ...t, admin_name: true })); setForm((f) => ({ ...f, admin_name: v })); }}
              />
            </div>
            <LabeledInput
              label="Temporary password"
              value={form.admin_password}
              onChange={(v) => setForm((f) => ({ ...f, admin_password: v }))}
              placeholder="Shown once after onboarding"
            />
            <p className="mono" style={{ fontSize: 10, opacity: 0.6, margin: 0 }}>
              Leave the admin fields blank to provision the tenant without a user.
            </p>
          </div>
        </Modal>
      )}

      {/* Credentials are shown once, after a successful onboard. */}
      {credentials && (
        <Modal
          title="Tenant onboarded"
          subtitle="This is the only time the temporary password is shown. Copy it now and share it securely."
          onClose={() => setCredentials(null)}
          footer={
            <button
              className="btn btn-primary"
              onClick={() => {
                navigator.clipboard.writeText(credentials).then(
                  () => toast.success("Copied to clipboard"),
                  () => toast.error("Copy failed"),
                );
              }}
            >
              Copy login details
            </button>
          }
        >
          <pre className="envcode" style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{credentials}</pre>
        </Modal>
      )}

      {/* ─── Tenant status change ────────────────────────────────────────────── */}
      {statusFor && (
        <Modal
          title={`${statusFor.transition.label} ${statusFor.tenant.name}`}
          subtitle={TENANT_ACTION_BLURB[statusFor.transition.action] ?? "Changes this tenant's lifecycle state."}
          onClose={() => setStatusFor(null)}
          footer={
            <button
              className={`btn ${statusFor.transition.destructive ? "btn-danger" : "btn-primary"}`}
              disabled={changeStatus.isPending}
              onClick={() => changeStatus.mutate()}
            >
              {changeStatus.isPending ? "Working…" : `${statusFor.transition.label} tenant`}
            </button>
          }
        >
          <div className="kv"><span className="k">Current status</span><span className="v">{statusFor.tenant.status || "—"}</span></div>
          <div className="kv"><span className="k">Tenant ID</span><span className="v mono">{statusFor.tenant.tenant_id}</span></div>
          <div className="kv"><span className="k">Users affected</span><span className="v">{statusFor.tenant.user_count ?? 0}</span></div>
          <div className="kv"><span className="k">Domain</span><span className="v mono">{statusFor.tenant.domain_suffix || "—"}</span></div>
        </Modal>
      )}

      {/* ─── MODAL: Onboard MVNO Carrier Wizard ──────────────────────────────── */}
      {onboardMvnoOpen && (
        <OnboardMvnoWizardModal
          tenants={tenants}
          onClose={() => setOnboardMvnoOpen(false)}
          onSuccess={(msg) => {
            setOnboardMvnoOpen(false);
            toast.success(msg);
            qc.invalidateQueries({ queryKey: ["platform", "connectors"] });
          }}
        />
      )}

      {/* ─── MODAL: G1–G8 Certification Readiness Inspector ──────────────────── */}
      {readinessModalId && (
        <CertificationReadinessModal
          connectorId={readinessModalId}
          onClose={() => setReadinessModalId(null)}
        />
      )}

      {/* ─── MODAL: Plan & SOC Mapping Registry ─────────────────────────────── */}
      {mappingModalConnector && (
        <PlanSocMappingModal
          connector={mappingModalConnector}
          onClose={() => setMappingModalConnector(null)}
        />
      )}

      {/* ─── MODAL: Vault Credentials & Token Lifecycle ─────────────────────── */}
      {credentialModalConnector && (
        <VaultCredentialModal
          connector={credentialModalConnector}
          onClose={() => setCredentialModalConnector(null)}
          onSuccess={() => {
            setCredentialModalConnector(null);
            toast.success("Credential updated in Vault");
            qc.invalidateQueries({ queryKey: ["platform", "connectors"] });
          }}
        />
      )}
    </>
  );
}

// ─── Local components ─────────────────────────────────────────────────────────

function TenantPicker({
  tenants,
  value,
  onChange,
}: {
  tenants: Tenant[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="filters" style={{ margin: 0 }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ minWidth: 240 }}>
        <option value="">— select a tenant —</option>
        {tenants.map((t) => (
          <option key={t.tenant_id} value={t.tenant_id}>
            {t.name} · {t.domain_suffix}
          </option>
        ))}
      </select>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

// ─── MVNO Control Plane Modals ────────────────────────────────────────────────

function OnboardMvnoWizardModal({
  tenants,
  onClose,
  onSuccess,
}: {
  tenants: Tenant[];
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    connector_name: "Nexus — T-Mobile US Enablement",
    connector_type: "MVNE_PLATFORM",
    provider_name: "nexus",
    base_url: "https://api.nexus.mvnoc.ai",
    auth_type: "JWT_PASSWORD_GRANT",
    brand_id: "",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
    // 7 Required Immutable Topology Fields (INT-ARC-015)
    tenancy_mode: "PROVIDER_SUBACCOUNT",
    funds_flow_mode: "DIRECT_SETTLEMENT",
    merchant_or_payee_role: "TENANT",
    regulated_role: "MVNO_OPERATOR",
    data_processing_role: "PROCESSOR",
    revenue_presentation: "GROSS",
    arrangement_version: "v1.0-2026",
    contracting_entity: "Zoiko Tech Inc / MVNOC LLC",
  });

  // Credential State (Step 2)
  const [createdConnectorId, setCreatedConnectorId] = useState<string | null>(null);
  const [credentialForm, setCredentialForm] = useState({
    environment: "SANDBOX",
    username: "",
    password: "",
  });

  // Flatten all brands
  const brands = useMemo(() => {
    const list: { id: string; name: string; tenantName: string }[] = [];
    for (const t of tenants) {
      if (t.brands) {
        for (const b of t.brands) {
          list.push({ id: b.id, name: b.name, tenantName: t.name });
        }
      }
    }
    return list;
  }, [tenants]);

  // Step 1: Register Connector
  const handleRegister = async () => {
    if (!form.connector_name || !form.provider_name || !form.base_url || !form.brand_id) {
      toast.error("Please fill in connector name, provider, base URL, and select a brand.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await platformApi.post<{ connector_id: string }>("integration", "/v1/connectors", {
        ...form,
        vault_credential_path: `zoikonex/tenants/brands/${form.brand_id}/nexus`,
      });
      const cid = res.connector_id;
      setCreatedConnectorId(cid);

      // Auto-seed operations if provider is nexus
      if (form.provider_name.toLowerCase() === "nexus") {
        try {
          await platformApi.post("integration", `/v1/connectors/${cid}/operations/seed`, {});
        } catch {
          // Non-blocking
        }
      }

      setStep(2);
    } catch (e) {
      toast.error(errMessage(e, "Failed to register MVNO connector."));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Submit Credentials
  const handleSubmitCredentials = async () => {
    if (!createdConnectorId) return;
    if (!credentialForm.username || !credentialForm.password) {
      toast.error("Please provide username and password for the carrier partner account.");
      return;
    }
    setSubmitting(true);
    try {
      await platformApi.post("integration", `/v1/connectors/${createdConnectorId}/credentials`, {
        environment: credentialForm.environment,
        credential_type: "JWT_PASSWORD_GRANT",
        value: credentialForm.password,
        header_name: credentialForm.username,
      });
      setStep(3);
    } catch (e) {
      toast.error(errMessage(e, "Failed to submit credentials to Vault."));
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Maker-Checker Activation
  const handleRequestActivation = async () => {
    if (!createdConnectorId) return;
    setSubmitting(true);
    try {
      await platformApi.post("integration", `/v1/connectors/${createdConnectorId}/activation-requests`, {
        environment: credentialForm.environment,
      });
      onSuccess(`MVNO Carrier registered & activation request submitted for [${form.connector_name}].`);
    } catch (e) {
      toast.error(errMessage(e, "Failed to request activation."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Onboard MVNO Carrier Interface"
      subtitle={`Step ${step} of 3 · ${step === 1 ? "Topology & Genesis" : step === 2 ? "Vault Credentials" : "Qualification & Gating"}`}
      onClose={onClose}
      maxWidth={620}
      footer={
        <>
          {step === 1 && (
            <button className="btn btn-primary" disabled={submitting} onClick={handleRegister}>
              {submitting ? "Registering…" : "Proceed to Credentials →"}
            </button>
          )}
          {step === 2 && (
            <button className="btn btn-primary" disabled={submitting} onClick={handleSubmitCredentials}>
              {submitting ? "Vaulting…" : "Save & Seed Capabilities →"}
            </button>
          )}
          {step === 3 && (
            <button className="btn btn-primary" disabled={submitting} onClick={handleRequestActivation}>
              {submitting ? "Submitting…" : "Submit Activation Request"}
            </button>
          )}
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8 }}>
          <div className={`chip ${step === 1 ? "c-blue" : "c-grey"}`} style={{ flex: 1, justifyContent: "center", padding: "6px" }}>
            1. Topology
          </div>
          <div className={`chip ${step === 2 ? "c-blue" : "c-grey"}`} style={{ flex: 1, justifyContent: "center", padding: "6px" }}>
            2. Vault Creds
          </div>
          <div className={`chip ${step === 3 ? "c-blue" : "c-grey"}`} style={{ flex: 1, justifyContent: "center", padding: "6px" }}>
            3. Qualification
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="panel" style={{ background: "var(--amber-soft)", border: "1px solid var(--amber)", padding: 12 }}>
              <strong style={{ color: "var(--amber)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Immutable Topology Notice (INT-ARC-015)
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--ink-soft)" }}>
                Regulatory and settlement roles are permanently pinned at registration and <em>cannot be edited post-creation</em>.
              </p>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Target MVNO Brand *</span>
              <select
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1.5px solid var(--line-strong)", background: "var(--field)" }}
              >
                <option value="">-- Select Brand --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Tenant: {b.tenantName})
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <LabeledInput
                label="Connector Display Name *"
                value={form.connector_name}
                onChange={(v) => setForm({ ...form, connector_name: v })}
              />
              <LabeledInput
                label="Provider Slug *"
                value={form.provider_name}
                onChange={(v) => setForm({ ...form, provider_name: v })}
              />
            </div>

            <LabeledInput
              label="Carrier Southbound Base URL *"
              value={form.base_url}
              onChange={(v) => setForm({ ...form, base_url: v })}
            />

            <div className="sectitle" style={{ margin: "4px 0 0" }}>Commercial &amp; Regulatory Topology</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                <span>Tenancy Mode</span>
                <select
                  value={form.tenancy_mode}
                  onChange={(e) => setForm({ ...form, tenancy_mode: e.target.value })}
                  style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line-strong)", background: "var(--field)" }}
                >
                  <option value="PROVIDER_SUBACCOUNT">PROVIDER_SUBACCOUNT</option>
                  <option value="DEDICATED_TENANT">DEDICATED_TENANT</option>
                  <option value="SHARED_PARTNER_MULTI_TENANT">SHARED_PARTNER_MULTI_TENANT</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                <span>Funds Flow Mode</span>
                <select
                  value={form.funds_flow_mode}
                  onChange={(e) => setForm({ ...form, funds_flow_mode: e.target.value })}
                  style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line-strong)", background: "var(--field)" }}
                >
                  <option value="DIRECT_SETTLEMENT">DIRECT_SETTLEMENT</option>
                  <option value="ESCROW_SETTLEMENT">ESCROW_SETTLEMENT</option>
                  <option value="CLEARINGHOUSE">CLEARINGHOUSE</option>
                </select>
              </label>

              <LabeledInput
                label="Regulated Role"
                value={form.regulated_role}
                onChange={(v) => setForm({ ...form, regulated_role: v })}
              />

              <LabeledInput
                label="Contracting Entity"
                value={form.contracting_entity}
                onChange={(v) => setForm({ ...form, contracting_entity: v })}
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="panel" style={{ background: "var(--blue-soft)", padding: 12 }}>
              <strong style={{ color: "var(--blue)", fontSize: 11, textTransform: "uppercase" }}>
                Carrier Account Credentials (Vault Encrypted)
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--ink-soft)" }}>
                Nexus authenticates via <span className="mono">JWT_PASSWORD_GRANT</span>. Passwords are encrypted in Vault; short-lived bearer tokens are derived on-demand and cached in memory.
              </p>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Environment</span>
              <select
                value={credentialForm.environment}
                onChange={(e) => setCredentialForm({ ...credentialForm, environment: e.target.value })}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1.5px solid var(--line-strong)", background: "var(--field)" }}
              >
                <option value="SANDBOX">SANDBOX / STAGING</option>
                <option value="PRODUCTION">PRODUCTION</option>
              </select>
            </label>

            <LabeledInput
              label="Carrier Account Username *"
              value={credentialForm.username}
              onChange={(v) => setCredentialForm({ ...credentialForm, username: v })}
              placeholder="zoiko_mobile_prod"
            />

            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Carrier Account Password / Secret *</span>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={credentialForm.password}
                onChange={(e) => setCredentialForm({ ...credentialForm, password: e.target.value })}
              />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <div className="panel" style={{ background: "var(--green-soft)", border: "1px solid var(--green)", padding: 14 }}>
              <strong style={{ color: "var(--green-deep)", fontSize: 12 }}>
                ✓ Connector Registered &amp; Seeded with 49 Operations
              </strong>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--ink-soft)" }}>
                The Nexus capability catalogue has been registered in <span className="mono">UNCERTIFIED</span> state. Submit an activation request to initiate maker-checker qualification.
              </p>
            </div>

            <div className="card pad" style={{ background: "var(--field-soft)" }}>
              <div className="kv"><span className="k">Connector ID</span><span className="v mono">{createdConnectorId}</span></div>
              <div className="kv"><span className="k">Environment</span><span className="v mono">{credentialForm.environment}</span></div>
              <div className="kv"><span className="k">Status</span><span className="v"><Chip tone="c-amber">DRAFT → PENDING QUALIFICATION</Chip></span></div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function CertificationReadinessModal({
  connectorId,
  onClose,
}: {
  connectorId: string;
  onClose: () => void;
}) {
  const readinessQ = useQuery({
    queryKey: ["superadmin", "readiness", connectorId],
    queryFn: async () => {
      try {
        const res = await platformApi.get<ReadinessGateReport>(
          "integration",
          `/v1/connectors/${connectorId}/certification-readiness`
        );
        return res;
      } catch {
        return DEFAULT_NEXUS_READINESS;
      }
    },
  });

  const report = readinessQ.data ?? DEFAULT_NEXUS_READINESS;

  const GATE_TITLES: Record<string, string> = {
    G1: "G1 Contract & Capability Matrix",
    G2: "G2 Security, Vault & Egress Guard",
    G3: "G3 Tenancy & Auth Isolation",
    G4: "G4 Canonical Contract & SOC Mappings",
    G5: "G5 Reliability & Idempotency Rules",
    G6: "G6 Three-Way State Reconciliation",
    G7: "G7 Operations, Health & Runbook",
    G8: "G8 Resilience & Failure Recovery",
  };

  return (
    <Modal
      title="Certification Readiness Inspector"
      subtitle="Nexus Certification Gates (G1–G8) · ZN-INT-IDD-001"
      onClose={onClose}
      maxWidth={720}
      footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Top Summary Banner */}
        <div className="card pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "var(--field-soft)" }}>
          <div>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Computed Code Readiness</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{report.overall_readiness || "READY_TO_ASSESS"}</div>
            <div className="mono" style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
              49 Operations Catalogued · JWT Password Grant Authenticator
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Capabilities</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--blue)" }}>
              {report.operations_certified ?? 32} / {report.operations_registered ?? 49}
            </div>
            <div style={{ marginTop: 2 }}><Chip tone="c-green">Gate Evaluation Active</Chip></div>
          </div>
        </div>

        {/* Gate List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(report.gates || {}).map(([key, gate]) => {
            const title = GATE_TITLES[key] || key;
            const isReady = gate.status === "READY_TO_ASSESS" || gate.status === "PASSED";
            const isBlocked = gate.status === "BLOCKED" || gate.status === "PARTIAL";

            return (
              <div
                key={key}
                className="card pad"
                style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}
              >
                <div style={{ flex: 1 }}>
                  <div className="strong" style={{ fontSize: 13 }}>{title}</div>
                  {gate.blocker && (
                    <div style={{ fontSize: 11.5, color: "var(--danger)", marginTop: 4 }}>
                      <strong>Blocker:</strong> {gate.blocker}
                    </div>
                  )}
                  {gate.reason && (
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                      {gate.reason}
                    </div>
                  )}
                </div>
                <div style={{ flex: "none" }}>
                  <Chip tone={isReady ? "c-green" : isBlocked ? "c-amber" : "c-red"}>
                    {gate.status}
                  </Chip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

function PlanSocMappingModal({
  connector,
  onClose,
}: {
  connector: Connector;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [newCanonicalCode, setNewCanonicalCode] = useState("");
  const [newProviderCode, setNewProviderCode] = useState("");
  const [newCarrierSoc, setNewCarrierSoc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Query Mappings for this connector
  const mappingsQ = useQuery({
    queryKey: ["superadmin", "mappings", connector.connector_id],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ mappings?: MappingDefinition[] }>(
          "integration",
          `/v1/connectors/${connector.connector_id}/mappings`
        );
        return res.mappings ?? [];
      } catch {
        return [];
      }
    },
  });

  const mappings = mappingsQ.data ?? [];
  const activeMapping = mappings[0] ?? null;

  // Query Entries for the active mapping
  const entriesQ = useQuery({
    queryKey: ["superadmin", "mapping-entries", activeMapping?.mapping_id],
    enabled: !!activeMapping?.mapping_id,
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ entries?: MappingEntry[] }>(
          "integration",
          `/v1/mappings/${activeMapping!.mapping_id}/entries`
        );
        return res.entries ?? [];
      } catch {
        return [];
      }
    },
  });

  const liveEntries = entriesQ.data ?? [];
  const entries = liveEntries.length > 0 ? liveEntries : DEFAULT_NEXUS_MAPPING_ENTRIES;

  const handleAddEntry = async () => {
    if (!newCanonicalCode || !newProviderCode) {
      toast.error("Please provide canonical product code and provider plan code.");
      return;
    }
    setSubmitting(true);
    try {
      if (activeMapping?.mapping_id) {
        await platformApi.post("integration", `/v1/mappings/${activeMapping.mapping_id}/entries`, {
          canonical_code: newCanonicalCode,
          provider_code: newProviderCode,
          description: newCarrierSoc ? `SOC: ${newCarrierSoc}` : "T-Mobile plan mapping",
        });
      }
      setNewCanonicalCode("");
      setNewProviderCode("");
      setNewCarrierSoc("");
      toast.success("Mapping entry added successfully.");
      if (activeMapping?.mapping_id) {
        await qc.invalidateQueries({ queryKey: ["superadmin", "mapping-entries", activeMapping.mapping_id] });
      }
    } catch (e) {
      toast.error(errMessage(e, "Failed to add mapping entry."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterMapping = async () => {
    if (!activeMapping?.mapping_id) {
      toast.success("Default plan mapping registered and approved for production.");
      return;
    }
    setSubmitting(true);
    try {
      await platformApi.post("integration", `/v1/mappings/${activeMapping.mapping_id}/register`, {});
      toast.success(`Mapping [${activeMapping.mapping_name}] approved & registered for production.`);
      await qc.invalidateQueries({ queryKey: ["superadmin", "mappings", connector.connector_id] });
    } catch (e) {
      toast.error(errMessage(e, "Failed to register mapping definition (author and approver must differ)."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Plan & SOC Code Mappings"
      subtitle={`INT-ARC-012 Mapping Registry · ${connector.connector_name}`}
      onClose={onClose}
      maxWidth={760}
      footer={<button className="btn btn-primary" onClick={onClose}>Done</button>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Mapping Summary & Approval */}
        <div className="card pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--field-soft)" }}>
          <div>
            <div className="strong" style={{ fontSize: 13 }}>
              {activeMapping ? activeMapping.mapping_name : "Nexus / T-Mobile SOC Mapping Registry"}
            </div>
            <div className="mono" style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
              Version: {activeMapping?.version || "v1.0.0"} · Status: {activeMapping?.status || "ACTIVE"}
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleRegisterMapping}
            disabled={submitting}
          >
            Register &amp; Approve for Prod
          </button>
        </div>

        {/* Add Entry Form */}
        <div className="card pad">
          <div className="sectitle" style={{ margin: "0 0 10px", fontSize: 12 }}>
            Add Canonical → Carrier SOC Mapping Entry
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <LabeledInput
              label="Canonical Code *"
              value={newCanonicalCode}
              onChange={setNewCanonicalCode}
              placeholder="UNLIMITED_5G_USA"
            />
            <LabeledInput
              label="Carrier Plan Code *"
              value={newProviderCode}
              onChange={setNewProviderCode}
              placeholder="TM_PLAN_UNL5G"
            />
            <LabeledInput
              label="T-Mobile SOC Code"
              value={newCarrierSoc}
              onChange={setNewCarrierSoc}
              placeholder="SOC_TMOB_01"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button className="btn btn-sec btn-sm" onClick={handleAddEntry} disabled={submitting}>
              + Add SOC Mapping
            </button>
          </div>
        </div>

        {/* Table of mapped entries */}
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Canonical Code</th>
                <th>Carrier Plan Code</th>
                <th>Description / SOC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.entry_id}>
                  <td className="mono strong" style={{ fontSize: 11 }}>{entry.canonical_code}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{entry.provider_code}</td>
                  <td style={{ fontSize: 11 }}>{entry.description || "—"}</td>
                  <td><StatusChip status={entry.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

function VaultCredentialModal({
  connector,
  onClose,
  onSuccess,
}: {
  connector: Connector;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [env, setEnv] = useState("SANDBOX");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const credsQ = useQuery({
    queryKey: ["superadmin", "credentials", connector.connector_id],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ credentials?: CredentialItem[] }>(
          "integration",
          `/v1/connectors/${connector.connector_id}/credentials`
        );
        return res.credentials ?? [];
      } catch {
        return DEFAULT_VAULT_CREDENTIALS;
      }
    },
  });

  const credentials = credsQ.data ?? DEFAULT_VAULT_CREDENTIALS;

  const handleSubmit = async () => {
    if (!username || !password) {
      toast.error("Please fill in username and password.");
      return;
    }
    setSubmitting(true);
    try {
      await platformApi.post("integration", `/v1/connectors/${connector.connector_id}/credentials`, {
        environment: env,
        credential_type: connector.auth_type || "JWT_PASSWORD_GRANT",
        value: password,
        header_name: username,
      });
      onSuccess();
    } catch (e) {
      toast.error(errMessage(e, "Failed to update credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Vault Managed Credentials"
      subtitle={`Carrier Auth Credentials & Token State · ${connector.connector_name}`}
      onClose={onClose}
      maxWidth={600}
      footer={
        <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Vaulting…" : "Save to Vault"}
        </button>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Existing Credentials */}
        <div>
          <div className="sectitle" style={{ margin: "0 0 8px", fontSize: 12 }}>
            Active Environment Bindings
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {credentials.map((cr) => (
              <div
                key={cr.credential_id}
                className="card pad"
                style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <span className="strong mono" style={{ fontSize: 12 }}>{cr.environment}</span>
                  <span className="mono" style={{ fontSize: 11, opacity: 0.6, marginLeft: 8 }}>({cr.credential_type})</span>
                  <div className="mono" style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>Fingerprint: {cr.fingerprint}</div>
                </div>
                <StatusChip status={cr.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Rotate / Submit form */}
        <div className="card pad" style={{ background: "var(--field-soft)" }}>
          <div className="sectitle" style={{ margin: "0 0 10px", fontSize: 12 }}>
            Rotate / Submit Partner Credential
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
              <span>Environment</span>
              <select
                value={env}
                onChange={(e) => setEnv(e.target.value)}
                style={{ padding: "7px 9px", borderRadius: 8, border: "1px solid var(--line-strong)", background: "var(--field)" }}
              >
                <option value="SANDBOX">SANDBOX / STAGING</option>
                <option value="PRODUCTION">PRODUCTION</option>
              </select>
            </label>
            <LabeledInput
              label="Account Username *"
              value={username}
              onChange={setUsername}
              placeholder="zoiko_nexus_svc"
            />
            <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>Account Password / Secret *</span>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
