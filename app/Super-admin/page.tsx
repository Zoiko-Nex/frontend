"use client";

/**
 * ZoikoNex platform super-admin console.
 *
 * ── What changed and why ─────────────────────────────────────────────────────
 * This page used to be a single `dangerouslySetInnerHTML` blob driven by
 * imperative DOM code under `@ts-nocheck`, backed by ~15 hardcoded seed arrays
 * (TENANTS, QUEUE, BILLCYCLES, EVIDENCE, MEDIATION, JURIS, SAGA, INTEG …).
 * A handful of loaders tried to overwrite those arrays from the backend, but
 * several called endpoints that do not exist on any service — `/v1/queue`,
 * `/v1/billing-runs`, `/v1/jurisdictions/packs`, `/v1/fraud/alerts` — and every
 * one of them swallowed its error with `console.error`. The seed data then
 * stayed on screen looking exactly like live data. Invented subscriber counts,
 * invented revenue and an invented "98.7% platform health" were the most
 * dangerous thing in this console, because they are the numbers someone would
 * repeat in a status meeting.
 *
 * Everything rendered below now comes from a real API call, or says plainly
 * that it cannot.
 *
 * ── The cross-tenant constraint ──────────────────────────────────────────────
 * A super admin looks across tenants. Every backend derives `tenant_id` from
 * the caller's JWT, and a platform admin's JWT carries the synthetic platform
 * tenant — which owns no customer data. Exactly two services let a caller
 * holding `role_platform_admin` override that with an `X-Tenant-ID` header:
 *
 *     identity-tenancy    RequireTenantMatchOrPlatformAdmin (middleware.go:240)
 *     order-management    resolveTenantAndBrand             (middleware.go:77)
 *
 * The other sixteen ignore the header. Reading them from here returns the
 * platform tenant's empty result set, which renders as "this tenant has no
 * invoices" — indistinguishable from the truth. So those domains are not
 * wired to a table that would lie; they carry an explicit panel naming the
 * service and what it would take to support the view. `platformApi` enforces
 * the same rule at the transport layer (CROSS_TENANT_SERVICES).
 *
 * Reference content that is documentation rather than data — the TM Forum
 * mapping, the platform object model, the delivery waves — is kept as-is and
 * labelled as reference. It was never pretending to be live.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { platformApi, probeHealth, CROSS_TENANT_SERVICES } from "@/lib/admin/platform/client";
import { getPlatformSession, clearPlatformSession } from "@/lib/admin/platform/session";
import { SERVICES, type ServiceKey } from "@/lib/admin/services";
import { errMessage, shortId } from "@/lib/admin/envelope";
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
    case "SUSPENDED":
    case "BLOCKED":
    case "FAILED":
    case "CANCELLED":
      return "c-red";
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
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="scrim2 show" onClick={onClose}>
      <div className="modal" style={{ display: "block" }} onClick={(e) => e.stopPropagation()}>
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
  const [statusFor, setStatusFor] = useState<{ tenant: Tenant; next: string } | null>(null);
  const [credentials, setCredentials] = useState<string | null>(null);
  /** Chain-range verification inputs for the evidence module. */
  const [verifyRange, setVerifyRange] = useState({ from: "1", to: "100" });
  const [rangeResult, setRangeResult] = useState<{ verified: boolean; chain_sequence?: number } | null>(null);
  const [verifying, setVerifying] = useState(false);

  // ─── Auth gate ──────────────────────────────────────────────────────────────
  // A session alone is not enough: it must carry role_platform_admin, the same
  // claim platformLogin() requires. Guards against a hand-written localStorage
  // entry rendering this console.
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

  // Default the drill-down to the first tenant so the panels are not blank on
  // arrival, but never overwrite an explicit choice.
  useEffect(() => {
    if (!focusTenant && tenants.length > 0) setFocusTenant(tenants[0].tenant_id);
  }, [tenants, focusTenant]);

  /**
   * Liveness of all 18 services. Probed in parallel against each /health.
   * This replaces the old hardcoded "98.7% platform health" figure — the number
   * shown is now literally how many probes answered.
   */
  const healthQ = useQuery({
    queryKey: ["platform", "health"],
    enabled,
    refetchInterval: 60_000,
    queryFn: async () => {
      const entries = await Promise.all(
        SERVICE_KEYS.map(async (k) => [k, await probeHealth(k)] as const),
      );
      return Object.fromEntries(entries) as Record<ServiceKey, "live" | "degraded" | "down">;
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

  // order-management is the only non-identity service that honours the override.
  const ordersQ = useQuery({
    queryKey: ["platform", "orders", focusTenant],
    enabled: enabled && !!focusTenant,
    queryFn: async () => {
      const res = await platformApi.get<{ items?: Order[] }>("order", "/v1/orders", { asTenant: focusTenant });
      return res.items ?? [];
    },
  });

  /**
   * Connectors and evidence are read WITHOUT an override, so they show the
   * platform tenant's own records — which is correct for platform-owned
   * integrations, but is not a cross-tenant view. Labelled as such in the UI.
   */
  const connectorsQ = useQuery({
    queryKey: ["platform", "connectors"],
    enabled: enabled && module === "integrations",
    queryFn: async () => {
      const res = await platformApi.get<{ connectors?: Connector[] }>("integration", "/v1/connectors");
      return res.connectors ?? [];
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

  /**
   * Derives domain/brand/admin fields from the tenant name as it is typed, but
   * only while the operator has not overridden them.
   */
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
        // The tenant exists at this point. If the admin user fails we report it
        // rather than throwing, otherwise the operator sees "onboarding failed"
        // for a tenant that was in fact created.
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

  const changeStatus = useMutation({
    mutationFn: () =>
      platformApi.patch("identity", `/v1/tenants/${statusFor!.tenant.tenant_id}`, { status: statusFor!.next }),
    onSuccess: () => {
      toast.success(`${statusFor!.tenant.name} → ${statusFor!.next}`);
      setStatusFor(null);
      qc.invalidateQueries({ queryKey: ["platform", "tenants"] });
    },
    onError: (e) => toast.error(errMessage(e, "Could not change the tenant status")),
  });

  const logout = useCallback(() => {
    clearPlatformSession();
    router.replace("/Super-admin/login");
  }, [router]);

  /**
   * Chain verification is the whole point of an append-only ledger: without it
   * "append-only" is a claim rather than a property. Both endpoints were
   * registered and never called until now.
   */
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
      <Toaster position="bottom-right" richColors />

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
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() =>
                              setStatusFor({
                                tenant: t,
                                next: (t.status ?? "").toUpperCase() === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                              })
                            }
                          >
                            {(t.status ?? "").toUpperCase() === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
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

              {/* Chain integrity (P0-6). Tamper detection is only real if
                  someone can actually run it. */}
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
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-l)", color: "inherit", width: 120 }}
                      value={verifyRange.from}
                      onChange={(e) => setVerifyRange({ ...verifyRange, from: e.target.value })}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
                    <span>To sequence</span>
                    <input
                      className="mono"
                      style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-l)", color: "inherit", width: 120 }}
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

          {/* ─── Integrations ──────────────────────────────────────────────── */}
          {module === "integrations" && (
            <section className="module active">
              <div className="headrow">
                <div>
                  <div className="crumb">Platform / <b>Integrations</b></div>
                  <div className="ptitle">Connector Registry</div>
                  <div className="psub">
                    Live from <span className="mono">GET /v1/connectors</span>. Scoped to the platform tenant —
                    integration-ecosystem takes its tenant from the JWT.
                  </div>
                </div>
              </div>

              <div className="tablewrap">
                <table>
                  <thead><tr><th>Connector</th><th>Type</th><th>Provider</th><th>Auth</th><th>Status</th></tr></thead>
                  <tbody>
                    <TableState colSpan={5} loading={connectorsQ.isLoading} error={connectorsQ.error} empty={(connectorsQ.data ?? []).length === 0} emptyLabel="No connectors registered for the platform tenant." />
                    {(connectorsQ.data ?? []).map((c) => (
                      <tr key={c.connector_id}>
                        <td className="strong">
                          {c.connector_name}
                          <div className="mono" style={{ fontSize: 10, opacity: 0.5 }}>{shortId(c.connector_id)}</div>
                        </td>
                        <td>{c.connector_type}</td>
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
          title={`${statusFor.next === "SUSPENDED" ? "Suspend" : "Activate"} ${statusFor.tenant.name}`}
          subtitle={
            statusFor.next === "SUSPENDED"
              ? "Suspending blocks sign-in for every user in this tenant. Existing data is untouched."
              : "Restores sign-in for this tenant's users."
          }
          onClose={() => setStatusFor(null)}
          footer={
            <button
              className={`btn ${statusFor.next === "SUSPENDED" ? "btn-danger" : "btn-primary"}`}
              disabled={changeStatus.isPending}
              onClick={() => changeStatus.mutate()}
            >
              {changeStatus.isPending ? "Working…" : statusFor.next === "SUSPENDED" ? "Suspend tenant" : "Activate tenant"}
            </button>
          }
        >
          <div className="kv"><span className="k">Tenant ID</span><span className="v mono">{statusFor.tenant.tenant_id}</span></div>
          <div className="kv"><span className="k">Users affected</span><span className="v">{statusFor.tenant.user_count ?? 0}</span></div>
          <div className="kv"><span className="k">Domain</span><span className="v mono">{statusFor.tenant.domain_suffix || "—"}</span></div>
        </Modal>
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
        style={{
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg-l)",
          color: "inherit",
          font: "inherit",
        }}
      />
    </label>
  );
}
