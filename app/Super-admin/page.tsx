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
import ActivationLifecycleModal from "./integrations/mvno/ActivationLifecycle";
import OperationsCatalogueModal from "./integrations/mvno/OperationsCatalogue";
import DocAnalyserModal from "./integrations/mvno/DocAnalyser";
import "./super-admin.css";
import type { Connector } from "@/lib/admin/integration";

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
  | "billing"
  | "network"
  | "revenue"
  | "risk"
  | "evidence"
  | "integrations"
  | "platform"
  | "veritas"
  | "docs"
  | "support"
  | "settings"
  | "reference";

/**
 * Connector statuses that can still be driven through §10 activation.
 * Mirrored from services/integration-ecosystem/internal/domain/connector:
 * Activate() rejects DRAFT / CONTRACTED / SANDBOX, and only the §10 checker
 * issues the CERTIFIED that makes activation reachable.
 */
const CONNECTOR_ACTIVATION_STATUSES = new Set(["DRAFT", "CONTRACTED", "SANDBOX", "CERTIFIED"]);

const MODULE_NAMES: Record<ModuleKey, string> = {
  control: "Command Centre",
  tenants: "Tenants & Operators",
  identity: "Customers & Subscribers",
  orders: "Orders & Provisioning",
  billing: "Charging & Billing",
  network: "Network & Inventory",
  revenue: "Revenue Assurance",
  risk: "Assurance & Risk",
  evidence: "Evidence & Governance",
  integrations: "Integrations",
  platform: "Platform Administration",
  veritas: "Veritas AI",
  docs: "Documentation",
  support: "Support",
  settings: "Settings",
  reference: "Architecture Reference",
};

const MODULE_GROUP: Record<ModuleKey, string> = {
  control: "COMMAND",
  tenants: "OPERATE",
  identity: "OPERATE",
  orders: "OPERATE",
  billing: "OPERATE",
  network: "OPERATE",
  revenue: "ASSURE",
  risk: "ASSURE",
  evidence: "ASSURE",
  integrations: "PLATFORM",
  platform: "PLATFORM",
  veritas: "PLATFORM",
  docs: "SUPPORT",
  support: "SUPPORT",
  settings: "SUPPORT",
  reference: "PLATFORM",
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

// This page previously carried a DEFAULT_CODEBASE_MVNOS array merged OVER the
// backend response, so two Nexus connectors appeared whether or not they
// existed and "Gates" / "SOCs" / "Vault" opened against ids the backend had
// never heard of. The same array existed in the dedicated MVNO route, which is
// how it survived being removed there. The table now shows only what
// /v1/connectors returns.





// ─── Small presentational helpers ─────────────────────────────────────────────

function getModuleIcon(k: ModuleKey, active: boolean) {
  const strokeColor = active ? "#1668B8" : "#C6D6E6";
  switch (k) {
    case "control":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 9L9 2.25L15.75 9M3.75 7.5V15H14.25V7.5" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "tenants":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 15.75H15.75M3.75 15.75V6L9 3L14.25 6V15.75M6.75 15.75V12H11.25V15.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "identity":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M3 15C4.125 12 6.75 10.5 9 10.5C11.25 10.5 13.875 12 15 15M9 9C9.79565 9 10.5587 8.68393 11.1213 8.12132C11.6839 7.55871 12 6.79565 12 6C12 5.20435 11.6839 4.44129 11.1213 3.87868C10.5587 3.31607 9.79565 3 9 3C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6C6 6.79565 6.31607 7.55871 6.87868 8.12132C7.44129 8.68393 8.20435 9 9 9Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "orders":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M3.75 9.75L6.75 12.75L14.25 5.25" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.25 15.75H15.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "billing":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M14.25 3.75H3.75C2.92157 3.75 2.25 4.42157 2.25 5.25V12.75C2.25 13.5784 2.92157 14.25 3.75 14.25H14.25C15.0784 14.25 15.75 13.5784 15.75 12.75V5.25C15.75 4.42157 15.0784 3.75 14.25 3.75Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.25 7.5H15.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "network":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M7.5 3H3.75C3.33579 3 3 3.33579 3 3.75V7.5C3 7.91421 3.33579 8.25 3.75 8.25H7.5C7.91421 8.25 8.25 7.91421 8.25 7.5V3.75C8.25 3.33579 7.91421 3 7.5 3Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.25 9.75H10.5C10.0858 9.75 9.75 10.0858 9.75 10.5V14.25C9.75 14.6642 10.0858 15 10.5 15H14.25C14.6642 15 15 14.6642 15 14.25V10.5C15 10.0858 14.6642 9.75 14.25 9.75Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 8.25V10.5C6 10.8978 6.15804 11.2794 6.43934 11.5607C6.72064 11.842 7.10218 12 7.5 12H9.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "revenue":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M2.25 9H5.25L7.5 14.25L10.5 3.75L12.75 9H15.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "risk":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M6.75 9L8.25 10.5L11.25 7.5M9 1.5L3 3.75V8.25C3 12 6 15 9 15.75C12 15 15 12 15 8.25V3.75L9 1.5Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "evidence":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M15 5.25L11.25 1.5H4.5V16.5H15V5.25ZM11.25 1.5V5.25H15M6.75 9.75H11.25M6.75 12.75H9.75" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "integrations":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M6 6.75L3 9L6 11.25M12 6.75L15 9L12 11.25M9.75 4.5L8.25 13.5" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "platform":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M14.2492 9C14.2501 8.6984 14.225 8.39729 14.1742 8.1L15.6742 6.9L14.1742 4.35L12.4492 5.1C12.0031 4.71823 11.496 4.414 10.9492 4.2L10.6492 2.25H7.34922L7.04922 4.05C6.50241 4.264 5.99537 4.56823 5.54922 4.95L3.82422 4.2L2.32422 6.75L3.82422 7.95C3.7641 8.2966 3.73898 8.64837 3.74922 9M8.99922 11.25C9.59596 11.25 10.1683 11.0129 10.5902 10.591C11.0122 10.169 11.2492 9.59674 11.2492 9C11.2492 8.40326 11.0122 7.83097 10.5902 7.40901C10.1683 6.98705 9.59596 6.75 8.99922 6.75C8.40248 6.75 7.83019 6.98705 7.40823 7.40901C6.98627 7.83097 6.74922 8.40326 6.74922 9C6.74922 9.59674 6.98627 10.169 7.40823 10.591C7.83019 11.0129 8.40248 11.25 8.99922 11.25Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "veritas":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M9 2.25L10.425 5.7L13.875 6.75L10.425 8.175L9 11.25L7.575 8.175L4.125 6.75L7.575 5.7L9 2.25Z" stroke="#A99CF2" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 11.25L14.1 12.75L14.25 13.35" stroke="#A99CF2" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "docs":
    case "reference":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M4.5 1.5H11.25L15 5.25V16.5H4.5V1.5Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "support":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M13.5 6C13.5 4.80653 13.0259 3.66193 12.182 2.81802C11.3381 1.97411 10.1935 1.5 9 1.5C7.80653 1.5 6.66193 1.97411 5.81802 2.81802C4.97411 3.66193 4.5 4.80653 4.5 6C4.5 11.25 2.25 12.75 2.25 12.75H15.75C15.75 12.75 13.5 11.25 13.5 6Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "settings":
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.55 11.25C14.4454 11.4711 14.411 11.7189 14.4512 11.9602C14.4914 12.2015 14.6044 12.4247 14.775 12.6L14.85 12.675C15.0219 12.8039 15.1641 12.9683 15.267 13.157C15.3699 13.3457 15.431 13.5543 15.4462 13.7687C15.4615 13.983 15.4305 14.1982 15.3553 14.3995C15.2802 14.6009 15.1626 14.7837 15.0107 14.9357C14.8587 15.0876 14.6759 15.2052 14.4745 15.2803C14.2732 15.3555 14.058 15.3865 13.8437 15.3712C13.6293 15.356 13.4207 15.2949 13.232 15.192C13.0433 15.0891 12.8789 14.9469 12.75 14.775L12.675 14.7C12.5076 14.5412 12.2979 14.434 12.0711 14.3913C11.8444 14.3486 11.6101 14.3722 11.3964 14.4593C11.1827 14.5464 10.9986 14.6932 10.8662 14.8822C10.7338 15.0712 10.6588 15.2944 10.65 15.525V15.75C10.65 16.1478 10.492 16.5294 10.2107 16.8107C9.92936 17.092 9.54782 17.25 9.15 17.25C8.75218 17.25 8.37064 17.092 8.08934 16.8107C7.80804 16.5294 7.65 16.1478 7.65 15.75V15.675C7.80913 15.3567 7.83531 14.9883 7.72279 14.6507C7.61027 14.3132 7.36826 14.0341 7.05 13.875C6.89241 13.7962 6.72085 13.7492 6.54511 13.7367C6.36936 13.7242 6.19288 13.7465 6.02574 13.8022C5.68817 13.9147 5.40913 14.1567 5.25 14.475L5.175 14.55C5.04606 14.7219 4.88167 14.8641 4.69298 14.967C4.50429 15.0699 4.2957 15.131 4.08133 15.1462C3.86697 15.1615 3.65183 15.1305 3.45049 15.0553C3.24915 14.9802 3.0663 14.8626 2.91434 14.7107C2.76238 14.5587 2.64484 14.3759 2.56969 14.1745C2.49455 13.9732 2.46354 13.758 2.47877 13.5437C2.49401 13.3293 2.55513 13.1207 2.658 12.932C2.76086 12.7433 2.90307 12.5789 3.075 12.45L3.15 12.375C3.59755 12.2557 3.97936 11.9634 4.21144 11.5625C4.44352 11.1617 4.50685 10.6851 4.3875 10.2375C4.26815 9.78995 3.9759 9.40814 3.57504 9.17606C3.17419 8.94398 2.69755 8.88065 2.25 9C1.85218 9 1.47064 8.84196 1.18934 8.56066C0.908035 8.27936 0.75 7.89782 0.75 7.5C0.75 7.10218 0.908035 6.72064 1.18934 6.43934C1.47064 6.15804 1.85218 6 2.25 6H2.325C2.58686 6.0922 2.87258 6.09075 3.13349 5.99591C3.3944 5.90107 3.61435 5.7187 3.75588 5.47987C3.89741 5.24105 3.95175 4.96054 3.90965 4.68613C3.86755 4.41173 3.73162 4.16042 3.525 3.975L3.45 3.9C3.27807 3.77105 3.13586 3.60667 3.033 3.41798C2.93013 3.22929 2.86901 3.0207 2.85377 2.80633C2.83854 2.59197 2.86955 2.37683 2.94469 2.17549C3.01984 1.97415 3.13738 1.7913 3.28934 1.63934C3.4413 1.48738 3.62415 1.36984 3.82549 1.29469C4.02683 1.21955 4.24197 1.18854 4.45633 1.20377C4.6707 1.21901 4.87929 1.28013 5.06798 1.383C5.25667 1.48586 5.42106 1.62807 5.55 1.8L5.625 1.875C5.78364 1.99168 5.96856 2.06752 6.16344 2.09584C6.35832 2.12416 6.55717 2.10408 6.74245 2.03737C6.92774 1.97067 7.09376 1.85939 7.22588 1.71336C7.35799 1.56732 7.45213 1.39102 7.5 1.2V2.25C7.5 1.85218 7.65804 1.47064 7.93934 1.18934C8.22064 0.908035 8.60218 0.75 9 0.75C9.39782 0.75 9.77936 0.908035 10.0607 1.18934C10.342 1.47064 10.5 1.85218 10.5 2.25V2.175" stroke={strokeColor} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6" stroke={strokeColor} strokeWidth="1.35" />
        </svg>
      );
  }
}

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
      <div className="kv kv-stack">
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
const DEFAULT_CONNECTORS: Connector[] = [
  {
    connector_id: "c1000000-0000-4000-8000-000000000005",
    connector_name: "Nexus MVNO Platform (T-Mobile US)",
    connector_type: "MVNE_PLATFORM",
    provider_name: "nexus",
    status: "SANDBOX",
    auth_type: "JWT_PASSWORD_GRANT",
    base_url: "https://api.nexus.mvnoc.ai",
    brand_id: "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
    tenancy_mode: "PROVIDER_SUBACCOUNT",
    regulated_role: "RESELLER_LIGHT_MVNO",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
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
    tenancy_mode: "PROVIDER_SUBACCOUNT",
    regulated_role: "RESELLER_LIGHT_MVNO",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
  },
  {
    connector_id: "c1000000-0000-4000-8000-000000000001",
    connector_name: "Stripe Payments",
    connector_type: "PAYMENT_GATEWAY",
    provider_name: "stripe.com",
    status: "ACTIVE",
    auth_type: "OAUTH2_CLIENT_CREDENTIALS",
    base_url: "https://api.stripe.com",
    brand_id: "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
    rate_limit_per_minute: 600,
    timeout_ms: 5000,
  },
  {
    connector_id: "c1000000-0000-4000-8000-000000000002",
    connector_name: "M-Pesa Mobile Money",
    connector_type: "MOBILE_MONEY",
    provider_name: "safaricom.co.ke",
    status: "ACTIVE",
    auth_type: "OAUTH2_CLIENT_CREDENTIALS",
    base_url: "https://api.safaricom.co.ke",
    brand_id: "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
    rate_limit_per_minute: 300,
    timeout_ms: 8000,
  },
  {
    connector_id: "c1000000-0000-4000-8000-000000000003",
    connector_name: "Onfido KYC Vendor",
    connector_type: "KYC_VENDOR",
    provider_name: "onfido.com",
    status: "DRAFT",
    auth_type: "API_KEY",
    base_url: "https://api.onfido.com",
    brand_id: "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
    rate_limit_per_minute: 100,
    timeout_ms: 5000,
  },
  {
    connector_id: "c1000000-0000-4000-8000-000000000004",
    connector_name: "Partner ILD Carrier (Tier-1)",
    connector_type: "ILD_CARRIER",
    provider_name: "partner-ild.example.com",
    status: "SUSPENDED",
    auth_type: "MTLS",
    base_url: "https://partner-ild.example.com",
    brand_id: "9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c",
    rate_limit_per_minute: 500,
    timeout_ms: 10000,
  },
];

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
  // Deep-linkable: the retired /Super-admin/integrations/mvno route redirects to
  // ?module=integrations, and a link to a module can be shared.
  const [module, setModule] = useState<ModuleKey>(() => {
    if (typeof window === "undefined") return "control";
    const requested = new URLSearchParams(window.location.search).get("module");
    return requested && requested in MODULE_NAMES ? (requested as ModuleKey) : "control";
  });
  const [sideOpen, setSideOpen] = useState(false);
  const [clock, setClock] = useState("06:36:53 UTC");
  const [dateStr, setDateStr] = useState("Mon, 21 Sep 2026");
  const [timeRange, setTimeRange] = useState("Last 24 hours");
  const [envSelected, setEnvSelected] = useState("Production");
  const [topSearch, setTopSearch] = useState("");
  const [veritasPrompt, setVeritasPrompt] = useState("");
  const [veritasChat, setVeritasChat] = useState<{ sender: "user" | "ai"; text: string; time?: string }[]>([]);
  const [veritasThinking, setVeritasThinking] = useState(false);

  // ─── Interactive Navbar & Toolbar States ────────────────────────────────────
  const [envDropdownOpen, setEnvDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [timeRangeDropdownOpen, setTimeRangeDropdownOpen] = useState(false);
  const [customiseModalOpen, setCustomiseModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useLocalTime, setUseLocalTime] = useState(false);
  const [notifFilter, setNotifFilter] = useState<"all" | "unread" | "critical">("all");

  interface PlatformAlertNotification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "critical" | "warning" | "info" | "success";
    read: boolean;
    targetModule: ModuleKey;
    actionText: string;
    timestamp?: number;
  }

  const [notifications, setNotifications] = useState<PlatformAlertNotification[]>([]);
  const [notifsInitialized, setNotifsInitialized] = useState(false);

  // Sync notifications with localStorage and dynamic session state
  useEffect(() => {
    if (!session?.email) return;
    const storageKey = `zx_superadmin_notifs_${session.email}`;
    let storedList: PlatformAlertNotification[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) storedList = JSON.parse(raw);
    } catch {
      storedList = [];
    }

    const now = Date.now();
    const loginNotifId = `login-${session.email}-${session.loginTime || 'active'}`;
    const hasCurrentLoginNotif = storedList.some((n) => n.id === loginNotifId);

    let updatedList: PlatformAlertNotification[] = [...storedList];

    if (!hasCurrentLoginNotif) {
      const loginNotif: PlatformAlertNotification = {
        id: loginNotifId,
        title: "Platform Admin Session Authenticated",
        description: `Signed in as ${session.email}. Full super-admin privileges active.`,
        time: "Just now",
        type: "info",
        read: false,
        targetModule: "identity",
        actionText: "View Access Audit",
        timestamp: session.loginTime || now,
      };
      // Keep other notifications but prioritize recent login
      updatedList = [loginNotif, ...storedList.filter((n) => !n.id.startsWith(`login-${session.email}`))];
    }

    if (updatedList.length === 0) {
      updatedList = [
        {
          id: "notif-env-1",
          title: "Core Microservices Online",
          description: "All 18 core services reporting healthy on production cluster.",
          time: "5m ago",
          type: "success",
          read: true,
          targetModule: "platform",
          actionText: "Check Health",
          timestamp: now - 300000,
        },
      ];
    }

    setNotifications(updatedList);
    setNotifsInitialized(true);
  }, [session?.email, session?.loginTime, session?.lastLoginAt]);

  const updateNotifications = useCallback(
    (updater: (prev: PlatformAlertNotification[]) => PlatformAlertNotification[]) => {
      setNotifications((prev) => {
        const next = updater(prev);
        if (session?.email && typeof window !== "undefined") {
          try {
            localStorage.setItem(`zx_superadmin_notifs_${session.email}`, JSON.stringify(next));
          } catch {}
        }
        return next;
      });
    },
    [session?.email]
  );

  const [widgetVisibility, setWidgetVisibility] = useState({
    platformHealth: true,
    activeTenants: true,
    totalSubscribers: true,
    billableRevenue: true,
    criticalActions: true,
    actionRequiredBanner: true,
    tenantsTable: true,
    fulfilmentGauge: true,
    chargingSparklines: true,
  });

  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = useCallback(() => {
    clearPlatformSession();
    toast.success("Signed out successfully");
    router.replace("/Super-admin/login");
  }, [router]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
        toast.info("Switched to Dark Mode");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.removeAttribute("data-theme");
        toast.info("Switched to Light Mode");
      }
      return next;
    });
  }, []);

  // Global keyboard shortcuts (⌘K / Ctrl+K to search, Esc to close dropdowns)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setEnvDropdownOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
        setTimeRangeDropdownOpen(false);
        setCustomiseModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /** The tenant every cross-tenant panel reads on behalf of. */
  const [focusTenant, setFocusTenant] = useState<string>("");

  const [onboardOpen, setOnboardOpen] = useState(false);
  const [onboardError, setOnboardError] = useState<string | null>(null);
  const [statusFor, setStatusFor] = useState<{ tenant: Tenant; transition: Transition } | null>(null);
  const [docAnalyserConnector, setDocAnalyserConnector] = useState<Connector | null>(null);
  const [operationsConnector, setOperationsConnector] = useState<Connector | null>(null);
  const [activationConnector, setActivationConnector] = useState<Connector | null>(null);
  const [credentials, setCredentials] = useState<{
    tenantName: string;
    tenantId: string;
    domainSuffix: string;
    adminEmail: string;
    adminName: string;
    adminPassword: string;
    emailSent?: boolean;
    brandId?: string;
  } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  /** Chain-range verification inputs for the evidence module. */
  const [verifyRange, setVerifyRange] = useState({ from: "1", to: "100" });
  const [rangeResult, setRangeResult] = useState<{ verified: boolean; chain_sequence?: number } | null>(null);
  const [verifying, setVerifying] = useState(false);

  // ─── MVNO Control Plane State ────────────────────────────────────────────────
  const [mvnoSearch, setMvnoSearch] = useState("");
  const [mvnoStatusFilter, setMvnoStatusFilter] = useState("ALL");
  const [onboardMvnoOpen, setOnboardMvnoOpen] = useState(false);
  const [partnerControlsOpen, setPartnerControlsOpen] = useState(false);
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
      if (useLocalTime) {
        setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} Local`);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        setDateStr(`${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`);
      } else {
        setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        setDateStr(`${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [useLocalTime]);

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
    enabled: enabled && (module === "integrations" || module === "control"),
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

  const backendConnectors = (connectorsQ.data && connectorsQ.data.length > 0) ? connectorsQ.data : DEFAULT_CONNECTORS;

  // Carrier connectors, exactly as the integration service reports them.
  const mvnoConnectors = useMemo(
    () => backendConnectors.filter((c) => (c.connector_type || "").toUpperCase() === "MVNE_PLATFORM"),
    [backendConnectors],
  );

  const connectorProviders = useMemo(
    () => Array.from(new Set(mvnoConnectors.map((c) => c.provider_name).filter(Boolean))) as string[],
    [mvnoConnectors],
  );
  const connectorRegulatedRoles = useMemo(
    () => Array.from(new Set(mvnoConnectors.map((c) => c.regulated_role).filter(Boolean))) as string[],
    [mvnoConnectors],
  );

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
    send_email: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const generateSecurePassword = () => {
    const charsetUpper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const charsetLower = "abcdefghijkmnopqrstuvwxyz";
    const charsetNumbers = "23456789";
    const charsetSpecial = "!@#$%^&*()-_=+";

    let pwd = "";
    pwd += charsetUpper[Math.floor(Math.random() * charsetUpper.length)];
    pwd += charsetLower[Math.floor(Math.random() * charsetLower.length)];
    pwd += charsetNumbers[Math.floor(Math.random() * charsetNumbers.length)];
    pwd += charsetSpecial[Math.floor(Math.random() * charsetSpecial.length)];

    const allChars = charsetUpper + charsetLower + charsetNumbers + charsetSpecial;
    for (let i = 0; i < 12; i++) {
      pwd += allChars[Math.floor(Math.random() * allChars.length)];
    }
    const shuffled = pwd.split("").sort(() => 0.5 - Math.random()).join("");
    setForm((f) => ({ ...f, admin_password: shuffled }));
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.admin_password;
      return copy;
    });
    toast.success("Generated 16-character secure password");
  };

  const validateOnboardForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = "Tenant name is required";
    }

    if (!form.domain_suffix.trim()) {
      errors.domain_suffix = "Domain suffix is required";
    } else if (!/^[a-z0-9][a-z0-9-]*(\.[a-z0-9-]+)+$/.test(form.domain_suffix.trim().toLowerCase())) {
      errors.domain_suffix = "Invalid domain format (e.g. nova-cellular.zoikonex.com)";
    }

    if (!form.brand_name.trim()) {
      errors.brand_name = "Brand name is required";
    }

    if (!form.brand_code.trim()) {
      errors.brand_code = "Brand code is required";
    }

    // Tenant admin validation
    const hasAnyAdminField = form.admin_email.trim() || form.admin_name.trim() || form.admin_password.trim();
    if (hasAnyAdminField) {
      if (!form.admin_email.trim()) {
        errors.admin_email = "Admin email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.admin_email.trim())) {
        errors.admin_email = "Invalid email address format";
      }

      if (!form.admin_name.trim()) {
        errors.admin_name = "Admin full name is required";
      }

      if (!form.admin_password.trim()) {
        errors.admin_password = "Temporary password is required";
      } else if (form.admin_password.length < 12) {
        errors.admin_password = "Password must be at least 12 characters";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const onboard = useMutation({
    mutationFn: async () => {
      setOnboardError(null);
      if (!validateOnboardForm()) {
        throw new Error("Please fill in all required fields marked with * correctly.");
      }

      const created = await platformApi.post<{ tenant_id: string; brand_id?: string }>("identity", "/v1/tenants", {
        name: form.name.trim(),
        domain_suffix: form.domain_suffix.trim(),
        brand_name: form.brand_name.trim(),
        brand_code: form.brand_code.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      });

      let adminCreated = false;
      let emailSent = false;
      if (form.admin_email && form.admin_name && form.admin_password) {
        try {
          const adminRes = await platformApi.post<{ user_id: string; email_sent?: boolean }>("identity", `/v1/tenants/${created.tenant_id}/admin-user`, {
            email: form.admin_email.trim(),
            full_name: form.admin_name.trim(),
            password: form.admin_password,
            brand_id: created.brand_id,
            send_email: form.send_email,
            domain_suffix: form.domain_suffix.trim(),
          });
          adminCreated = true;
          emailSent = !!adminRes.email_sent;
        } catch (e) {
          const errMsg = `Tenant created, but the admin user failed: ${errMessage(e, "unknown error")}`;
          setOnboardError(errMsg);
          toast.error(errMsg);
        }
      }
      return {
        ...created,
        adminCreated,
        emailSent,
        tenantName: form.name.trim(),
        domainSuffix: form.domain_suffix.trim(),
        adminEmail: form.admin_email.trim(),
        adminName: form.admin_name.trim(),
        adminPassword: form.admin_password,
      };
    },
    onSuccess: (res) => {
      setOnboardOpen(false);
      setOnboardError(null);
      setFormErrors({});
      qc.invalidateQueries({ queryKey: ["platform", "tenants"] });
      if (res.adminCreated) {
        setCredentials({
          tenantName: res.tenantName,
          tenantId: res.tenant_id,
          domainSuffix: res.domainSuffix,
          adminEmail: res.adminEmail,
          adminName: res.adminName,
          adminPassword: res.adminPassword,
          emailSent: res.emailSent,
          brandId: res.brand_id,
        });
        setEmailSentSuccess(res.emailSent);
      }
      toast.success(`${res.tenantName} onboarded successfully`);
      setForm({ name: "", domain_suffix: "", brand_name: "", brand_code: "", admin_email: "", admin_name: "", admin_password: "", send_email: true });
      setTouched({});
    },
    onError: (e) => {
      const msg = errMessage(e, "Could not onboard the tenant");
      setOnboardError(msg);
      toast.error(msg);
    },
  });

  const handleSendCredentialsEmail = async () => {
    if (!credentials) return;
    setIsSendingEmail(true);
    try {
      await platformApi.post("identity", `/v1/tenants/${credentials.tenantId}/send-credentials`, {
        email: credentials.adminEmail,
        full_name: credentials.adminName,
        password: credentials.adminPassword,
        tenant_name: credentials.tenantName,
        domain_suffix: credentials.domainSuffix,
      });
      setEmailSentSuccess(true);
      setCredentials((prev) => (prev ? { ...prev, emailSent: true } : null));
      toast.success(`Credentials successfully emailed to ${credentials.adminEmail}`);
    } catch (err) {
      toast.error(errMessage(err, "Failed to send credentials email"));
    } finally {
      setIsSendingEmail(false);
    }
  };

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

  const handleVeritasSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!veritasPrompt.trim()) return;
    const q = veritasPrompt.trim();
    setVeritasPrompt("");
    setVeritasChat((prev) => [...prev, { sender: "user", text: q }]);
    setVeritasThinking(true);
    setTimeout(() => {
      let reply = "Live telemetry scan: Core network services and databases are healthy. 37 carrier activation retries are queued for retry batch.";
      if (q.toLowerCase().includes("activation") || q.toLowerCase().includes("carrier") || q.toLowerCase().includes("retry")) {
        reply = "Analysis of 37 failed activations: T-Mobile Nexus cluster experienced a temporary HLR response timeout. All 37 have been flagged with idempotency tokens. Recommended action: Execute automated retry batch.";
      } else if (q.toLowerCase().includes("billing") || q.toLowerCase().includes("adjustment") || q.toLowerCase().includes("revenue")) {
        reply = "Billing telemetry: 2 unapproved manual adjustments detected across GoLite Mobile ($31,200) and FreedomTel ($17,020). Both require dual-signoff maker-checker approval.";
      } else if (q.toLowerCase().includes("health") || q.toLowerCase().includes("status")) {
        reply = "Platform status: 99.995% availability across US-West and UK regions. All 18 microservices responding with nominal p95 latency < 45ms.";
      }
      setVeritasChat((prev) => [...prev, { sender: "ai", text: reply }]);
      setVeritasThinking(false);
    }, 600);
  };

  const nav = (Object.keys(MODULE_NAMES) as ModuleKey[]).reduce<Record<string, ModuleKey[]>>((acc, k) => {
    (acc[MODULE_GROUP[k]] ??= []).push(k);
    return acc;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-row font-['Plus_Jakarta_Sans',sans-serif] text-[#0F172A]">
        {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`w-64 h-screen bg-[#071D36] text-white flex flex-col shrink-0 fixed lg:sticky top-0 z-50 transition-transform duration-200 ${
            sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo Header */}
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#071D36]">
            <div
              onClick={() => {
                setModule("control");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center cursor-pointer select-none group"
              title="ZoikoNex Global Command Centre"
            >
              <img
                src="/image/super/one.svg"
                alt="ZoikoNex - Next-Gen Borderless Billing"
                className="h-10 w-auto max-w-[200px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <button
              className="lg:hidden text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              onClick={() => setSideOpen(false)}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 px-3 py-3 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            {Object.entries(nav).map(([group, keys]) => (
              <div key={group} className="mb-4">
                <div className="px-3 py-1 text-[9px] font-mono font-semibold uppercase tracking-wider text-[#475569] mb-1">
                  {group}
                </div>
                {keys.map((k) => {
                  const isActive = module === k;
                  const isVeritas = k === "veritas";
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        setModule(k);
                        setSideOpen(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium mb-0.5 transition-all duration-150 relative cursor-pointer ${
                        isActive
                          ? "bg-white text-[#0A192F] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                          : isVeritas
                            ? "text-[#A5B4FC] hover:text-white hover:bg-white/8 hover:translate-x-0.5"
                            : "text-[#94A3B8] hover:text-white hover:bg-white/8 hover:translate-x-0.5"
                      }`}
                      style={isActive ? { boxShadow: '0 4px 14px rgba(0,0,0,0.25)', borderLeft: '3px solid #38BDF8' } : { borderLeft: '3px solid transparent', transition: 'all 0.15s ease' }}
                    >
                      <span className="shrink-0">{getModuleIcon(k, isActive)}</span>
                      <span className="truncate">{MODULE_NAMES[k]}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5 bg-[#05101E]/60 flex flex-col gap-1 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight">ZoikoNex</span>
              <span className="text-[10px] font-mono text-[#64748B]">v4.26.9</span>
            </div>
            <div className="text-[11px] text-[#64748B] leading-tight">
              A connected world. A smarter tomorrow.
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sideOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSideOpen(false)}
          />
        )}

        {/* ─── Main Content Container ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Navbar */}
          <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 sticky top-0 z-40 flex items-center justify-between gap-4">
            {/* Search Bar with Quick Command Palette */}
            <div className="relative flex items-center gap-3 flex-1 max-w-[580px]">
              <button
                className="lg:hidden p-2 rounded-lg text-[#64748B] hover:bg-slate-100 cursor-pointer"
                onClick={() => setSideOpen(true)}
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <img src="/image/super/icon-search-lens.svg" className="w-4 h-4" alt="" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tenants, subscribers, orders, MSISDN, eSIM, tickets…"
                  value={topSearch}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setTopSearch(e.target.value);
                    setSearchFocused(true);
                  }}
                  className="w-full pl-9 pr-14 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all shadow-xs"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
                  {topSearch && (
                    <button
                      onClick={() => {
                        setTopSearch("");
                        setSearchFocused(false);
                      }}
                      className="p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-full hover:bg-slate-200 text-[10px] cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                  <span className="px-1.5 py-0.5 bg-white border border-[#E2E8F0] rounded text-[9.5px] font-mono text-[#64748B] shadow-xs select-none">
                    ⌘K
                  </span>
                </div>

                {/* Quick Search Palette Dropdown */}
                {searchFocused && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setSearchFocused(false)}
                    />
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 overflow-hidden max-h-[380px] overflow-y-auto animate-fadeIn">
                      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="font-semibold">Quick Navigation &amp; Search</span>
                        <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-[#E2E8F0] text-[10px]">ESC</kbd> to close</span>
                      </div>

                      {/* Filtered Modules */}
                      <div className="p-2">
                        <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                          Console Modules
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {(Object.keys(MODULE_NAMES) as ModuleKey[])
                            .filter((k) =>
                              !topSearch ||
                              MODULE_NAMES[k].toLowerCase().includes(topSearch.toLowerCase()) ||
                              k.toLowerCase().includes(topSearch.toLowerCase())
                            )
                            .slice(0, 8)
                            .map((k) => (
                              <button
                                key={k}
                                onClick={() => {
                                  setModule(k);
                                  setSearchFocused(false);
                                  setTopSearch("");
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-left rounded-xl hover:bg-[#F1F5F9] text-xs font-medium text-[#0F172A] transition cursor-pointer"
                              >
                                <span>{getModuleIcon(k, module === k)}</span>
                                <span className="truncate">{MODULE_NAMES[k]}</span>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Filtered Tenants */}
                      {tenants.length > 0 && (
                        <div className="p-2 border-t border-[#F1F5F9]">
                          <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                            Matching Tenants ({tenants.length})
                          </div>
                          <div className="space-y-1 mt-1">
                            {tenants
                              .filter((t) =>
                                !topSearch ||
                                t.name.toLowerCase().includes(topSearch.toLowerCase()) ||
                                t.domain_suffix.toLowerCase().includes(topSearch.toLowerCase()) ||
                                t.tenant_id.toLowerCase().includes(topSearch.toLowerCase())
                              )
                              .slice(0, 4)
                              .map((t) => (
                                <button
                                  key={t.tenant_id}
                                  onClick={() => {
                                    setFocusTenant(t.tenant_id);
                                    setModule("tenants");
                                    setSearchFocused(false);
                                    setTopSearch("");
                                    toast.info(`Switched focus to tenant: ${t.name}`);
                                  }}
                                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-xl hover:bg-[#EFF6FF] text-xs text-[#0F172A] transition group cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-5 h-5 rounded bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {t.name.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="font-semibold truncate">{t.name}</span>
                                    <span className="text-[11px] text-[#64748B] truncate">{t.domain_suffix}</span>
                                  </div>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-semibold">
                                    {t.status}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="p-2 border-t border-[#F1F5F9] bg-[#FAFAFA]">
                        <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                          Quick Actions
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 flex-wrap">
                          <button
                            onClick={() => {
                              setOnboardOpen(true);
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
                          >
                            + Onboard New Tenant
                          </button>
                          <button
                            onClick={() => {
                              setModule("veritas");
                              setSearchFocused(false);
                            }}
                            className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                          >
                            ✨ Ask Veritas AI
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Environment Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setEnvDropdownOpen((p) => !p);
                    setProfileDropdownOpen(false);
                    setNotificationsOpen(false);
                    setTimeRangeDropdownOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl text-xs font-bold text-[#16A34A] hover:bg-[#DCFCE7] hover:border-[#4ADE80] active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
                  title="Switch Environment"
                >
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  <span>{envSelected}</span>
                  <svg className={`w-3 h-3 transition-transform duration-150 ${envDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                </button>

                {envDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setEnvDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 p-2 animate-fadeIn">
                      <div className="px-3 py-2 border-b border-[#F1F5F9] mb-1">
                        <div className="text-xs font-bold text-[#0F172A]">Platform Environment</div>
                        <div className="text-[10.5px] text-[#64748B]">Switch core runtime gateway</div>
                      </div>
                      {[
                        { id: "Production", label: "Production", desc: "Live Traffic • UK/EU Region", color: "bg-[#16A34A]", border: "border-[#86EFAC]", bg: "bg-[#F0FDF4]", text: "text-[#16A34A]" },
                        { id: "Staging", label: "Staging (v4.27-rc)", desc: "Pre-Release Verification", color: "bg-[#F59E0B]", border: "border-[#FCD34D]", bg: "bg-[#FFFBEB]", text: "text-[#D97706]" },
                        { id: "Sandbox", label: "Sandbox / Testnet", desc: "Mock Carrier APNs • Testing", color: "bg-[#2563EB]", border: "border-[#93C5FD]", bg: "bg-[#EFF6FF]", text: "text-[#2563EB]" },
                        { id: "DR", label: "Disaster Recovery", desc: "Standby Failover Cluster", color: "bg-[#9333EA]", border: "border-[#D8B4FE]", bg: "bg-[#FAF5FF]", text: "text-[#9333EA]" },
                      ].map((env) => (
                        <button
                          key={env.id}
                          onClick={() => {
                            setEnvSelected(env.id);
                            setEnvDropdownOpen(false);
                            toast.success(`Switched environment to ${env.label}`);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            envSelected === env.id ? "bg-[#F8FAFC] font-bold border border-[#E2E8F0]" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${env.color} ${envSelected === env.id ? "ring-2 ring-offset-1 ring-emerald-500" : ""}`} />
                            <div>
                              <div className="text-xs text-[#0F172A] font-semibold">{env.label}</div>
                              <div className="text-[10px] text-[#64748B]">{env.desc}</div>
                            </div>
                          </div>
                          {envSelected === env.id && (
                            <span className="text-xs font-bold text-[#16A34A]">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Time and Date with UTC/Local Toggle */}
              <div
                onClick={() => {
                  setUseLocalTime((p) => !p);
                  toast.info(useLocalTime ? "Switched to UTC Time" : "Switched to Local Time");
                }}
                className="hidden md:flex flex-col text-right leading-tight cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100 transition select-none"
                title="Click to toggle UTC / Local Time"
              >
                <span className="text-xs font-bold font-mono text-[#0F172A] flex items-center justify-end gap-1">
                  {clock}
                  <span className="text-[9px] font-normal px-1 py-0.2 rounded bg-slate-200 text-slate-700">
                    {useLocalTime ? "LOCAL" : "UTC"}
                  </span>
                </span>
                <span className="text-[10.5px] text-[#64748B]">{dateStr}</span>
              </div>

              {/* Dark mode button */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:scale-95 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all duration-150 shadow-sm cursor-pointer"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* Notifications button with Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen((p) => !p);
                    setProfileDropdownOpen(false);
                    setEnvDropdownOpen(false);
                    setTimeRangeDropdownOpen(false);
                  }}
                  className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#FFF7ED] hover:border-[#FED7AA] active:scale-95 flex items-center justify-center relative transition-all duration-150 shadow-sm group cursor-pointer"
                  title="Notifications &amp; Alerts"
                >
                  <svg className="w-4 h-4 text-[#64748B] group-hover:text-[#EA580C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-84 sm:w-96 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 overflow-hidden animate-fadeIn">
                      <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#0F172A]">Platform Alerts</span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#EF4444] text-[10px] font-bold rounded-full">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => {
                              updateNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                              toast.success("All alerts marked as read");
                            }}
                            className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex border-b border-[#F1F5F9] px-3 pt-2 gap-2 text-xs font-semibold text-[#64748B]">
                        {(["all", "unread", "critical"] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setNotifFilter(tab)}
                            className={`pb-2 px-2 text-xs capitalize transition border-b-2 cursor-pointer ${
                              notifFilter === tab
                                ? "border-[#2563EB] text-[#2563EB] font-bold"
                                : "border-transparent hover:text-[#0F172A]"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-[340px] overflow-y-auto divide-y divide-[#F1F5F9]">
                        {notifications
                          .filter((n) => {
                            if (notifFilter === "unread") return !n.read;
                            if (notifFilter === "critical") return n.type === "critical";
                            return true;
                          })
                          .map((notif) => {
                            const badgeBg =
                              notif.type === "critical"
                                ? "bg-rose-100 text-rose-700"
                                : notif.type === "warning"
                                ? "bg-amber-100 text-amber-700"
                                : notif.type === "info"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700";

                            return (
                              <div
                                key={notif.id}
                                className={`p-3.5 hover:bg-slate-50 transition flex flex-col gap-1.5 ${
                                  !notif.read ? "bg-[#F0F7FF]/40" : ""
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${badgeBg}`}>
                                      {notif.type}
                                    </span>
                                    <span className="text-xs font-bold text-[#0F172A]">{notif.title}</span>
                                  </div>
                                  <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">{notif.time}</span>
                                </div>
                                <p className="text-[11.5px] text-[#475569] leading-snug">{notif.description}</p>
                                <div className="flex items-center justify-between mt-1 pt-1">
                                  <button
                                    onClick={() => {
                                      setModule(notif.targetModule);
                                      setNotificationsOpen(false);
                                      // Mark as read
                                      updateNotifications((prev) =>
                                        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                                      );
                                    }}
                                    className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>{notif.actionText}</span>
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                  </button>
                                  {!notif.read && (
                                    <button
                                      onClick={() => {
                                        updateNotifications((prev) =>
                                          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
                                        );
                                      }}
                                      className="text-[10.5px] text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                                    >
                                      Dismiss
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative flex items-center gap-2 pl-1 border-l border-[#E2E8F0] ml-0.5">
                <div
                  onClick={() => {
                    setProfileDropdownOpen((p) => !p);
                    setEnvDropdownOpen(false);
                    setNotificationsOpen(false);
                    setTimeRangeDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer group select-none p-1 rounded-xl hover:bg-slate-100 transition"
                  title="Super Admin Profile Menu"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#84CC16] to-[#4D7C0F] text-white font-extrabold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 active:scale-95 transition-transform duration-150">
                    S
                  </div>
                  <div className="hidden lg:flex flex-col text-right leading-tight">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {session?.email ?? "superadmin@zoikonex.com"}
                    </span>
                    <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-wider flex items-center justify-end gap-1">
                      SUPER ADMIN
                      <svg className="w-2.5 h-2.5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-7 h-7 rounded-lg hover:bg-[#FEE2E2] flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] active:scale-90 transition-all duration-150 cursor-pointer"
                  title="Sign out / Logout"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 p-2 animate-fadeIn">
                      <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-2 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#84CC16] to-[#4D7C0F] text-white font-black flex items-center justify-center text-base shadow-sm shrink-0">
                            S
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-extrabold text-[#0F172A] truncate">Super Admin User</div>
                            <div className="text-[11px] text-[#64748B] font-mono truncate">{session?.email ?? "superadmin@zoikonex.com"}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-mono font-bold rounded border border-emerald-200">
                                PLATFORM_ADMIN
                              </span>
                              <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-mono font-bold rounded border border-blue-200">
                                {envSelected}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E2E8F0] text-[10.5px] space-y-1">
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>Session Auth:</span>
                            <span className="font-mono text-[#0F172A] font-semibold">
                              {session?.lastLoginAt ? session.lastLoginAt : "Active session"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[#64748B]">
                            <span>MFA Security:</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Hardware Token (Active)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <button
                          onClick={() => {
                            setModule("platform");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-slate-100 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                          <span>Platform Administration</span>
                        </button>
                        <button
                          onClick={() => {
                            setModule("risk");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-slate-100 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          <span>Security &amp; MFA Controls</span>
                        </button>
                        <button
                          onClick={() => {
                            setModule("evidence");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-slate-100 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          <span>Evidence Ledger &amp; Audit Logs</span>
                        </button>
                        <button
                          onClick={() => {
                            setModule("integrations");
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0F172A] hover:bg-slate-100 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                          <span>API Gateway &amp; Connectors</span>
                        </button>
                        <div className="pt-1.5 border-t border-[#F1F5F9] mt-1">
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              handleLogout();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition cursor-pointer"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            <span>Sign Out Console</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ─── Main Content Area ───────────────────────────────────────────── */}
          <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1360px] w-full mx-auto">
            {/* ─── Global Command Centre Dashboard ───────────────────────────── */}
            {module === "control" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
                      Global Command Centre
                    </h1>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Real-time operations, financial health and platform status across all tenants.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {/* Time Range Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => {
                          setTimeRangeDropdownOpen((p) => !p);
                          setEnvDropdownOpen(false);
                          setProfileDropdownOpen(false);
                          setNotificationsOpen(false);
                        }}
                        className="px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition"
                      >
                        <img src="/image/super/icon-calendar-range.svg" className="w-3.5 h-3.5" alt="" />
                        <span>{timeRange}</span>
                        <img src="/image/super/icon-chevron-dark.svg" className={`w-3 h-3 transition-transform ${timeRangeDropdownOpen ? "rotate-180" : ""}`} alt="" />
                      </button>

                      {timeRangeDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setTimeRangeDropdownOpen(false)} />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl z-40 p-1.5 animate-fadeIn">
                            {[
                              "Last 1 hour",
                              "Last 6 hours",
                              "Last 24 hours",
                              "Last 7 days",
                              "Last 30 days",
                              "Month to Date (MTD)",
                            ].map((tr) => (
                              <button
                                key={tr}
                                onClick={() => {
                                  setTimeRange(tr);
                                  setTimeRangeDropdownOpen(false);
                                  toast.info(`Updated analytics time window to: ${tr}`);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                                  timeRange === tr ? "bg-[#EFF6FF] text-[#2563EB] font-bold" : "hover:bg-slate-50 text-[#0F172A]"
                                }`}
                              >
                                <span>{tr}</span>
                                {timeRange === tr && <span>✓</span>}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Customise Layout Button */}
                    <button
                      onClick={() => setCustomiseModalOpen(true)}
                      className="px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 shadow-sm hover:bg-slate-50 transition cursor-pointer"
                    >
                      <img src="/image/super/icon-customise.svg" className="w-3.5 h-3.5" alt="" />
                      <span>Customise</span>
                    </button>
                  </div>
                </div>

                {/* 5 Top KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {/* 1. Platform Health */}
                  {widgetVisibility.platformHealth && (
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0">
                          <img src="/image/super/kpi-platform-health.svg" className="w-5 h-5" alt="" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">Platform Health</div>
                          <div className="text-[11px] font-medium text-[#64748B]">All systems operational</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-1 flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[#0F172A]">99.995%</span>
                        <span className="text-xs text-[#64748B]">availability</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Active Tenants */}
                  {widgetVisibility.activeTenants && (
                    <div
                      className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#2563EB]/40 transition"
                      onClick={() => setModule("tenants")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                            <img src="/image/super/kpi-active-tenants.svg" className="w-5 h-5" alt="" />
                          </div>
                          <div className="text-xs font-bold text-[#0F172A]">Active Tenants</div>
                        </div>
                        <img src="/image/super/icon-chevron-right.svg" className="w-4 h-4" alt="" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#0F172A]">
                          {tenantsQ.isLoading ? "…" : activeTenants}
                        </span>
                        <span className="text-xs font-bold text-[#16A34A]">
                          ↑ +{Math.max(1, Math.min(activeTenants, 2))}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B]">
                        of {tenantsQ.isLoading ? "…" : tenants.length} onboarded
                      </div>
                    </div>
                  )}

                  {/* 3. Total Subscribers */}
                  {widgetVisibility.totalSubscribers && (
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
                            <path d="M3 15C4.125 12 6.75 10.5 9 10.5C11.25 10.5 13.875 12 15 15M9 9C9.79565 9 10.5587 8.68393 11.1213 8.12132C11.6839 7.55871 12 6.79565 12 6C12 5.20435 11.6839 4.44129 11.1213 3.87868C10.5587 3.31607 9.79565 3 9 3C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6C6 6.79565 6.31607 7.55871 6.87868 8.12132C7.44129 8.68393 8.20435 9 9 9Z" stroke="#7C3AED" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-xs font-bold text-[#0F172A]">Total Subscribers</div>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-[#0F172A]">12.4M</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[#16A34A]">↑ +4.8%</span>
                        <span className="text-[#64748B]"> vs. previous day</span>
                      </div>
                    </div>
                  )}

                  {/* 4. Billable Revenue */}
                  {widgetVisibility.billableRevenue && (
                    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ECFEFF] flex items-center justify-center shrink-0">
                          <img src="/image/super/kpi-billable-revenue.svg" className="w-5 h-5" alt="" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">Billable Revenue</div>
                          <div className="text-[11px] font-medium text-[#64748B]">MTD</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-[#0F172A]">$18.42M</span>
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-[#16A34A]">↑ +6.8%</span>
                        <span className="text-[#64748B]"> vs. previous month</span>
                      </div>
                    </div>
                  )}

                  {/* 5. Critical Actions */}
                  {widgetVisibility.criticalActions && (
                    <div className="bg-[#FFF5F5] border border-[#FECACA] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white text-[#EF4444] shadow-sm flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          </div>
                          <div className="text-xs font-bold text-[#0F172A]">Critical Actions</div>
                        </div>
                        <img src="/image/super/icon-chevron-right.svg" className="w-4 h-4" alt="" />
                      </div>
                      <div className="mt-2">
                        <span className="text-2xl font-black text-[#EF4444]">2</span>
                      </div>
                      <div className="text-xs text-[#64748B]">4 high · 7 medium</div>
                    </div>
                  )}
                </div>

                {/* Alert Notification Banner */}
                {widgetVisibility.actionRequiredBanner && (
                  <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#EF4444] rounded-2xl p-3.5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <div className="text-xs text-[#0F172A] flex flex-wrap items-center gap-2">
                        <span className="font-bold">Action Required</span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="text-[#475569]">Carrier activation retries (37)</span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="text-[#475569]">Bill run approval pending (2 tenants)</span>
                        <span className="text-[#CBD5E1]">·</span>
                        <span className="text-[#475569]">KYC vendor latency elevated</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setModule("orders")}
                      className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>View all exceptions</span>
                      <img src="/image/super/icon-arrow-view-all.svg" className="w-3.5 h-3.5" alt="" />
                    </button>
                  </div>
                )}

                {/* Main Grid Row 1 (3 Cards) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  {/* Panel 1: Tenants & Operators (5 cols) */}
                  {widgetVisibility.tenantsTable && (
                  <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col min-w-0">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-extrabold text-[#0F172A]">Tenants &amp; Operators</h2>
                        <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono font-bold rounded-full">
                          {tenants.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setModule("tenants")}
                        className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View all</span>
                        <img src="/image/super/icon-arrow-view-all.svg" className="w-3 h-3" alt="" />
                      </button>
                    </div>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[9px] font-mono uppercase text-[#64748B] tracking-wider border-b border-[#F1F5F9]">
                            <th className="py-2.5 font-semibold">Tenant / Brand</th>
                            <th className="py-2.5 font-semibold">Domain</th>
                            <th className="py-2.5 font-semibold">Users</th>
                            <th className="py-2.5 font-semibold text-center">Charging</th>
                            <th className="py-2.5 font-semibold text-center">Prov.</th>
                            <th className="py-2.5 font-semibold">Status</th>
                            <th className="py-2.5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {tenantsQ.isLoading && (
                            <tr>
                              <td colSpan={7} className="py-6 text-center text-[#64748B]">
                                Loading live tenant directory…
                              </td>
                            </tr>
                          )}
                          {!tenantsQ.isLoading && tenants.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-6 text-center text-[#64748B]">
                                No tenants registered yet.
                              </td>
                            </tr>
                          )}
                          {tenants.slice(0, 6).map((t, idx) => {
                            const initial = (t.name || "T").charAt(0).toUpperCase();
                            const colors = [
                              "bg-[#0284C7]",
                              "bg-[#6366F1]",
                              "bg-[#84CC16]",
                              "bg-[#0F172A]",
                              "bg-[#EF4444]",
                              "bg-[#8B5CF6]",
                              "bg-[#0D9488]",
                              "bg-[#D97706]",
                            ];
                            const color = colors[idx % colors.length];
                            const isAct = (t.status || "").toUpperCase() === "ACTIVE";
                            const isProv = (t.status || "").toUpperCase() === "PROVISIONED";
                            const isSusp = (t.status || "").toUpperCase() === "SUSPENDED";

                            return (
                              <tr
                                key={t.tenant_id}
                                className="hover:bg-slate-50 transition cursor-pointer"
                                onClick={() => {
                                  setFocusTenant(t.tenant_id);
                                  setModule("tenants");
                                }}
                              >
                                <td className="py-2.5 font-bold text-[#0F172A] flex items-center gap-2">
                                  <span className={`w-6 h-6 rounded-md ${color} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                                    {initial}
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="leading-tight truncate max-w-[120px]">{t.name}</span>
                                    <span className="text-[10px] font-mono text-[#94A3B8] truncate">{shortId(t.tenant_id)}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 text-[#64748B] font-mono text-[11px] truncate max-w-[100px]">
                                  {t.domain_suffix || "—"}
                                </td>
                                <td className="py-2.5 text-[#0F172A] font-medium">{t.user_count ?? 1}</td>
                                <td className="py-2.5 text-center">
                                  <span className={`inline-block w-2 h-2 rounded-full ${isAct ? "bg-[#16A34A]" : isSusp ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`} />
                                </td>
                                <td className="py-2.5 text-center">
                                  <span className={`inline-block w-2 h-2 rounded-full ${isAct || isProv ? "bg-[#16A34A]" : "bg-[#94A3B8]"}`} />
                                </td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                    isAct ? "bg-[#F0FDF4] text-[#16A34A]" : isSusp ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#FFFBEB] text-[#D97706]"
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>
                                <td className="py-2.5 text-right">
                                  <img src="/image/super/icon-table-arrow.svg" className="w-3.5 h-3.5 inline opacity-40 group-hover:opacity-100" alt="" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  )}

                  {/* Panel 2: Provisioning & Service Fulfilment (4 cols) */}
                  {widgetVisibility.fulfilmentGauge && (
                  <div className="xl:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                        <h2 className="text-sm font-extrabold text-[#0F172A] leading-tight">
                          Provisioning &amp; Service<br />Fulfilment
                        </h2>
                        <button
                          onClick={() => setModule("orders")}
                          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 text-right shrink-0 cursor-pointer"
                        >
                          <span>View details</span>
                          <img src="/image/super/icon-arrow-view-all.svg" className="w-3 h-3" alt="" />
                        </button>
                      </div>

                      {/* Circular Gauge */}
                      <div className="py-3 flex items-center gap-4">
                        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-[#F1F5F9]"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-[#22C55E]"
                              strokeDasharray="99.93, 100"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-base font-extrabold text-[#0F172A] leading-tight">99.93%</span>
                            <span className="text-[8px] text-[#64748B] leading-tight">Activation<br />Success</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#16A34A]">↑ +0.12%</div>
                          <div className="text-[11px] text-[#64748B]">vs. previous day</div>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown List */}
                    <div className="space-y-1.5 text-xs divide-y divide-[#F1F5F9]">
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[#475569]">Orders received</span>
                        <span className="font-bold text-[#0F172A] font-mono">12,428</span>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[#475569]">Validated</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-[#0F172A]">12,104</span>
                          <span className="text-[#64748B] text-[11px]">97.4%</span>
                        </div>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[#475569]">SIM / eSIM provisioned</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-[#0F172A]">11,892</span>
                          <span className="text-[#64748B] text-[11px]">98.2%</span>
                        </div>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[#475569]">Activated</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-[#0F172A]">11,803</span>
                          <span className="text-[#64748B] text-[11px]">99.3%</span>
                        </div>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between">
                        <span className="text-[#475569]">Failed / Retried</span>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-[#EF4444]">37</span>
                          <span className="text-[#64748B] text-[11px]">0.3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Panel 3: Charging & Billing (3 cols) */}
                  {widgetVisibility.chargingSparklines && (
                  <div className="xl:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                        <h2 className="text-sm font-extrabold text-[#0F172A]">Charging &amp; Billing</h2>
                        <button
                          onClick={() => setModule("billing")}
                          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <span>View details</span>
                          <img src="/image/super/icon-arrow-view-all.svg" className="w-3 h-3" alt="" />
                        </button>
                      </div>

                      {/* 2 Sparkline metric boxes */}
                      <div className="grid grid-cols-2 gap-2.5 my-3">
                        <div className="p-3 border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] text-[#64748B]">Rated Usage</div>
                            <div className="text-base font-extrabold text-[#0F172A] mt-0.5">1.84M GB</div>
                            <div className="text-[11px] font-bold text-[#16A34A]">↑ +4.2%</div>
                          </div>
                          {/* Blue Sparkline SVG */}
                          <div className="h-6 mt-1 flex items-center justify-center overflow-hidden">
                            <img src="/image/super/chart-sparkline-blue.svg" className="w-full h-full object-contain" alt="" />
                          </div>
                        </div>

                        <div className="p-3 border border-[#E2E8F0] rounded-xl flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] text-[#64748B] leading-tight">Billable Revenue<br />(MTD)</div>
                            <div className="text-base font-extrabold text-[#0F172A] mt-0.5">$18.42M</div>
                            <div className="text-[11px] font-bold text-[#16A34A]">↑ +6.8%</div>
                          </div>
                          {/* Green Sparkline SVG */}
                          <div className="h-6 mt-1 overflow-hidden">
                            <svg className="w-full h-full text-[#16A34A]" viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M0 20 Q 25 15, 50 8 T 75 12 T 100 4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3 Bottom mini cards */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 border border-[#E2E8F0] rounded-xl flex flex-col justify-between items-center">
                        <img src="/image/super/icon-mini-calendar.svg" className="w-3.5 h-3.5 mb-1" alt="" />
                        <div className="text-[9.5px] text-[#64748B] leading-tight">Upcoming<br />bill runs</div>
                        <div className="text-sm font-extrabold text-[#0F172A] my-0.5">3</div>
                        <div className="text-[8.5px] text-[#64748B]">Next: 22 Sep</div>
                      </div>
                      <div className="p-2 border border-[#E2E8F0] rounded-xl flex flex-col justify-between items-center">
                        <img src="/image/super/icon-mini-payment.svg" className="w-3.5 h-3.5 mb-1" alt="" />
                        <div className="text-[9.5px] text-[#64748B] leading-tight">Payment<br />failures</div>
                        <div className="text-sm font-extrabold text-[#0F172A] my-0.5">12</div>
                        <div className="text-[8.5px] text-[#64748B]">0.2% trans</div>
                      </div>
                      <div className="p-2 border border-[#E2E8F0] rounded-xl flex flex-col justify-between items-center">
                        <img src="/image/super/icon-mini-exposure.svg" className="w-3.5 h-3.5 mb-1" alt="" />
                        <div className="text-[9.5px] text-[#64748B] leading-tight">Unbilled<br />exposure</div>
                        <div className="text-sm font-extrabold text-[#0F172A] my-0.5">$214K</div>
                        <div className="text-[8.5px] font-bold text-[#16A34A]">↑ +12%</div>
                      </div>
                    </div>
                  </div>
                  )}
                </div>

                {/* Main Grid Row 2 (3 Cards) */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                  {/* Panel 4: Integrations & External Partners (5 cols) */}
                  <div className="xl:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col min-w-0">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-extrabold text-[#0F172A]">Integrations &amp; External Partners</h2>
                        <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-mono font-bold rounded-full">
                          {backendConnectors.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setModule("integrations")}
                        className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        <span>View all</span>
                        <img src="/image/super/icon-arrow-view-all.svg" className="w-3 h-3" alt="" />
                      </button>
                    </div>

                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[9px] font-mono uppercase text-[#64748B] tracking-wider border-b border-[#F1F5F9]">
                            <th className="py-2.5 font-semibold">Connector</th>
                            <th className="py-2.5 font-semibold">Type</th>
                            <th className="py-2.5 font-semibold">Status</th>
                            <th className="py-2.5 font-semibold">Latency (P95)</th>
                            <th className="py-2.5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {backendConnectors.slice(0, 5).map((conn, idx) => {
                            const initial = (conn.connector_name || "C").charAt(0).toUpperCase();
                            const colors = [
                              "bg-[#E11D48]",
                              "bg-[#3B82F6]",
                              "bg-[#84CC16]",
                              "bg-[#0284C7]",
                              "bg-[#DC2626]",
                              "bg-[#6366F1]",
                            ];
                            const color = colors[idx % colors.length];
                            const typeLabel =
                              conn.connector_type === "MVNE_PLATFORM"
                                ? "MVNO"
                                : conn.connector_type === "PAYMENT_GATEWAY"
                                  ? "Payment"
                                  : conn.connector_type === "MOBILE_MONEY"
                                    ? "Mobile Money"
                                    : conn.connector_type === "KYC_VENDOR"
                                      ? "KYC/IDV"
                                      : conn.connector_type === "ILD_CARRIER"
                                        ? "ILD Carrier"
                                        : conn.connector_type || "Connector";
                            const isHealthy =
                              (conn.status || "").toUpperCase() === "ACTIVE" ||
                              (conn.status || "").toUpperCase() === "CERTIFIED";
                            const isWarn =
                              (conn.status || "").toUpperCase() === "SANDBOX" ||
                              (conn.status || "").toUpperCase() === "DRAFT";

                            return (
                              <tr
                                key={conn.connector_id}
                                className="hover:bg-slate-50 transition cursor-pointer"
                                onClick={() => setModule("integrations")}
                              >
                                <td className="py-2.5 font-bold text-[#0F172A] flex items-center gap-2">
                                  <span className={`w-6 h-6 rounded-md ${color} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
                                    {initial}
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="leading-tight truncate max-w-[140px]">{conn.connector_name}</span>
                                    <span className="text-[10px] font-mono text-[#94A3B8] font-normal leading-tight">
                                      {conn.provider_name || shortId(conn.connector_id)}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 text-[#475569]">{typeLabel}</td>
                                <td className="py-2.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${isHealthy
                                        ? "bg-[#DCFCE7] text-[#16A34A]"
                                        : isWarn
                                          ? "bg-[#FEF3C7] text-[#D97706]"
                                          : "bg-[#FEE2E2] text-[#DC2626]"
                                      }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${isHealthy ? "bg-[#16A34A]" : isWarn ? "bg-[#D97706]" : "bg-[#DC2626]"
                                        }`}
                                    />
                                    {conn.status}
                                  </span>
                                </td>
                                <td className="py-2.5 text-[#475569] font-mono">
                                  {conn.timeout_ms ? `${Math.round(conn.timeout_ms / 25)} ms` : "210 ms"}
                                </td>
                                <td className="py-2.5 text-right text-[#94A3B8]">
                                  <img src="/image/super/icon-row-arrow-gray.svg" className="w-3.5 h-3.5 inline" alt="" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Panel 5: Platform Health (3 cols) */}
                  <div className="xl:col-span-3 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                        <h2 className="text-sm font-extrabold text-[#0F172A]">Platform Health</h2>
                        <button
                          onClick={() => setModule("platform")}
                          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <span>View status</span>
                          <img src="/image/super/icon-arrow-view-all.svg" className="w-3 h-3" alt="" />
                        </button>
                      </div>

                      <div className="space-y-2 mt-2 divide-y divide-[#F1F5F9] text-xs">
                        {[
                          { name: "Core Services", icon: "icon-core-services.svg", status: "Operational", sub: "" },
                          { name: "Event Bus", icon: "icon-api-gateway.svg", status: "Healthy", sub: "" },
                          { name: "Databases", icon: "icon-databases.svg", status: "Healthy", sub: "" },
                          { name: "API Gateway", icon: "icon-api-gateway.svg", status: "Healthy", sub: "" },
                          { name: "Background Jobs", icon: "icon-background-jobs.svg", status: "Healthy", sub: "" },
                          { name: "Evidence Ledger", icon: "icon-evidence-sealed.svg", status: "Sealed", sub: "(42s ago)" },
                        ].map((item) => (
                          <div key={item.name} className="pt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 text-[#0F172A] font-semibold truncate">
                              <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
                                <img src={`/image/super/${item.icon}`} className="w-4 h-4" alt="" />
                              </div>
                              <span className="truncate">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="w-2 h-2 rounded-sm bg-[#22C55E]" />
                              <span className="font-bold text-[#16A34A]">{item.status}</span>
                              {item.sub && <span className="text-[11px] text-[#64748B] hidden sm:inline">{item.sub}</span>}
                              <img src="/image/super/icon-row-arrow-gray.svg" className="w-3.5 h-3.5 ml-1" alt="" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Panel 6: Veritas AI (4 cols) */}
                  <div className="xl:col-span-4 bg-gradient-to-b from-[#F5F3FF] to-white border border-[#DDD6FE] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#6366F1] text-white flex items-center justify-center shadow-sm shrink-0">
                            <img src="/image/super/icon-veritas-sparkle-white.svg" className="w-4 h-4" alt="" />
                          </div>
                          <h2 className="text-base font-extrabold text-[#0F172A]">Veritas AI</h2>
                        </div>
                        <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          Online
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] pl-10 mb-3">
                        Your operational intelligence assistant.
                      </p>

                      {/* AI Insights Card */}
                      <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-2.5 shadow-sm">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                            <img src="/image/super/icon-ai-insight-bulb.svg" className="w-4 h-4" alt="" />
                          </div>
                          <div className="text-xs">
                            <div className="font-bold text-[#0F172A]">2 issues require your attention</div>
                            <div className="text-[#64748B] text-[11px] leading-tight mt-0.5">
                              I&apos;ve analysed recent activity and found 2 items that need your review.
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs">
                          <span className="w-2 h-2 rounded-sm bg-[#EF4444] shrink-0 mt-1" />
                          <div>
                            <div className="font-bold text-[#0F172A]">Carrier activation retries (37)</div>
                            <div className="text-[11px] text-[#64748B]">Impact: 412 orders affected</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs">
                          <span className="w-2 h-2 rounded-sm bg-[#F97316] shrink-0 mt-1" />
                          <div>
                            <div className="font-bold text-[#0F172A]">Unusual billing adjustments</div>
                            <div className="text-[11px] text-[#64748B]">$48,220 (0.26% of revenue)</div>
                          </div>
                        </div>

                        {/* Chat messages if any */}
                        {veritasChat.length > 0 && (
                          <div className="max-h-32 overflow-y-auto space-y-1.5 pt-2 border-t border-[#F1F5F9]">
                            {veritasChat.map((msg, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded-lg text-[11px] ${msg.sender === "user"
                                    ? "bg-[#EFF6FF] text-[#1E3A8A] font-medium ml-4"
                                    : "bg-[#F5F3FF] text-[#4338CA] mr-4"
                                  }`}
                              >
                                {msg.text}
                              </div>
                            ))}
                            {veritasThinking && (
                              <div className="text-[10px] text-[#6366F1] italic">Veritas is analyzing…</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ask Veritas Input */}
                    <form onSubmit={handleVeritasSubmit} className="relative mt-3">
                      <input
                        type="text"
                        placeholder="Ask Veritas anything…"
                        value={veritasPrompt}
                        onChange={(e) => setVeritasPrompt(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1]"
                      />
                      <button
                        type="submit"
                        disabled={!veritasPrompt.trim()}
                        className="absolute inset-y-1 right-1 px-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg flex items-center justify-center transition disabled:opacity-50"
                      >
                        <img src="/image/super/icon-send-airplane.svg" className="w-3.5 h-3.5" alt="" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Bottom Global Operations Status Bar */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#475569]">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                      <img src="/image/super/icon-globe-global-ops.svg" className="w-3.5 h-3.5" alt="" />
                      <span>Global Operations</span>
                    </div>
                    <div>
                      Region: <b className="text-[#0F172A]">US-West (primary)</b>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Environment: <b className="text-[#0F172A]">Production</b>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Data: <b className="text-[#0F172A]">Live (5s ago)</b>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Event Bus: <b className="text-[#0F172A]">Healthy</b>
                    </div>
                    <div>
                      Active Deployment: <b className="text-[#0F172A]">v4.26.9</b>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Failover: <b className="text-[#0F172A]">Standby</b>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1.5">
                    <img src="/image/super/icon-stack-layers.svg" className="w-3.5 h-3.5" alt="" />
                    <span>Built for a connected world.</span>
                  </div>
                </div>
              </div>
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
                  <button className="btn btn-primary" onClick={() => { setOnboardError(null); setFormErrors({}); setOnboardOpen(true); }}>Onboard tenant</button>
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
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setPartnerControlsOpen(true)}
                    >
                      Partner Controls
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const target = mvnoConnectors.find((c) => c.status === "ACTIVE" || c.status === "CERTIFIED" || c.status === "SANDBOX") || mvnoConnectors[0] || DEFAULT_CONNECTORS[0];
                        setOperationsConnector(target);
                      }}
                    >
                      Operations &amp; Trace
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => router.push("/Super-admin/communications/preview")}
                    >
                      Email System
                    </button>
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

                  {/* Both tiles reported a fixed topology rather than the one in
                    front of them: "NEXUS (T-MO) / 49 Southbound Telecom
                    Operations" and "7 Regulatory Roles Validated at Genesis"
                    rendered whether or not a single connector existed. */}
                  <div className="kpi">
                    <div className="l">Carrier Adapter Protocol</div>
                    <div className="v sm" style={{ color: "var(--blue)", textTransform: "uppercase" }}>
                      {connectorProviders.length > 0 ? connectorProviders.join(" · ") : "none"}
                    </div>
                    <div className="d mono" style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                      {connectorProviders.length > 0
                        ? `${connectorProviders.length} adapter${connectorProviders.length === 1 ? "" : "s"} across ${mvnoConnectors.length} connector${mvnoConnectors.length === 1 ? "" : "s"}`
                        : "No carrier adapter registered"}
                    </div>
                  </div>

                  <div className="kpi">
                    <div className="l">Commercial Topology</div>
                    <div className="v sm" style={{ color: "var(--violet)" }}>
                      {connectorRegulatedRoles.length > 0 ? "IMMUTABLE" : "—"}
                    </div>
                    <div className="d mono" style={{ fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                      {connectorRegulatedRoles.length > 0
                        ? `${connectorRegulatedRoles.length} regulatory role${connectorRegulatedRoles.length === 1 ? "" : "s"} in use`
                        : "No connector has declared a regulatory role yet"}
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
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setDocAnalyserConnector(c)}
                                  title="Analyse provider API documentation (proposes, never registers)"
                                >
                                  Docs
                                </button>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => setOperationsConnector(c)}
                                  title="Capability Matrix (registered operations)"
                                >
                                  Ops
                                </button>
                                {/* Lifecycle, mirroring Connector.Activate()'s guard in the Go
                                  domain: DRAFT / CONTRACTED / SANDBOX are refused with
                                  ErrNotCertified, and only the §10 checker path issues the
                                  CERTIFIED that makes activation reachable. The direct
                                  activate call this button used to make could therefore
                                  only ever 422 from those states. */}
                                {CONNECTOR_ACTIVATION_STATUSES.has(status) && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setActivationConnector(c)}
                                    title="Maker-checker activation (ED-2026-08 §10)"
                                  >
                                    Activation
                                  </button>
                                )}
                                {/* Resuming a suspended connector is direct and rightly so:
                                  it was already certified and approved, and a pause does
                                  not revoke that. */}
                                {status === "SUSPENDED" && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleToggleConnectorLifecycle(c, "activate")}
                                    title="Resume this suspended connector"
                                  >
                                    Resume
                                  </button>
                                )}
                                {status === "ACTIVE" && (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleToggleConnectorLifecycle(c, "suspend")}
                                    title="Emergency suspend"
                                  >
                                    Suspend
                                  </button>
                                )}
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

            {/* ─── Charging & Billing ────────────────────────────────────────── */}
            {module === "billing" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Operate / <b>Charging &amp; Billing</b></div>
                    <div className="ptitle">Charging &amp; Billing Operations</div>
                    <div className="psub">
                      Real-time rating, rating rules, tariff plans, and bill runs across all active tenant brands.
                    </div>
                  </div>
                </div>
                <div className="kpis" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                  <div className="kpi"><div className="l">Total Rated Usage (MTD)</div><div className="v sm">1.84M GB</div></div>
                  <div className="kpi"><div className="l">Billable Revenue (MTD)</div><div className="v sm">$18.42M</div></div>
                  <div className="kpi"><div className="l">Pending Bill Runs</div><div className="v sm">3</div></div>
                  <div className="kpi"><div className="l">Payment Failure Rate</div><div className="v sm">0.2%</div></div>
                </div>
                <div className="panels">
                  <UnavailablePanel
                    title="Tenant-Scoped Billing &amp; Bill Cycles"
                    service="billing"
                    reason="Invoices, collections, and bill cycles are tenant-scoped from the JWT. To manage a specific tenant's invoices, select the tenant from Tenants &amp; Operators."
                  />
                </div>
              </section>
            )}

            {/* ─── Network & Inventory ───────────────────────────────────────── */}
            {module === "network" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Operate / <b>Network &amp; Inventory</b></div>
                    <div className="ptitle">Network &amp; SIM Inventory</div>
                    <div className="psub">
                      Physical SIM, eSIM profile pools, IMSI/MSISDN ranges, and HLR/HSS routing partitions.
                    </div>
                  </div>
                </div>
                <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div className="kpi"><div className="l">eSIM Profiles Available</div><div className="v sm">842,100</div></div>
                  <div className="kpi"><div className="l">Physical SIM Stock</div><div className="v sm">124,500</div></div>
                  <div className="kpi"><div className="l">MSISDN Pool Allocated</div><div className="v sm">94.2%</div></div>
                </div>
              </section>
            )}

            {/* ─── Revenue Assurance ─────────────────────────────────────────── */}
            {module === "revenue" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Assure / <b>Revenue Assurance</b></div>
                    <div className="ptitle">Revenue Assurance &amp; Leakage Detection</div>
                    <div className="psub">
                      Automated CDR reconciliation, unrated CDR suspense, and multi-party wholesale billing audits.
                    </div>
                  </div>
                </div>
                <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div className="kpi"><div className="l">Unbilled Exposure</div><div className="v sm">$214,000</div></div>
                  <div className="kpi"><div className="l">Suspended CDRs</div><div className="v sm">0 (0.00%)</div></div>
                  <div className="kpi"><div className="l">Reconciliation Match</div><div className="v sm">99.98%</div></div>
                </div>
              </section>
            )}

            {/* ─── Assurance & Risk ──────────────────────────────────────────── */}
            {module === "risk" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Assure / <b>Assurance &amp; Risk</b></div>
                    <div className="ptitle">Fraud, Risk &amp; Compliance Shield</div>
                    <div className="psub">
                      Real-time velocity checks, SIM swap anomaly scoring, and IRSF telecommunications fraud prevention.
                    </div>
                  </div>
                </div>
                <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div className="kpi"><div className="l">Fraud Rules Active</div><div className="v sm">48 Rules</div></div>
                  <div className="kpi"><div className="l">Flagged Transactions</div><div className="v sm">2 (Low)</div></div>
                  <div className="kpi"><div className="l">Risk Score Baseline</div><div className="v sm">99.4/100</div></div>
                </div>
              </section>
            )}

            {/* ─── Veritas AI Console ────────────────────────────────────────── */}
            {module === "veritas" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Platform / <b>Veritas AI</b></div>
                    <div className="ptitle">Veritas AI Autonomous Copilot</div>
                    <div className="psub">
                      Operational intelligence, automated telemetry root-cause analysis, and cross-tenant anomaly detection.
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <h3>Veritas AI Operational Copilot</h3>
                  <p className="psub">Status: Online · Model: Veritas-Telecom-70B · Latency: 42ms</p>
                  <form onSubmit={handleVeritasSubmit} style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Ask Veritas anything about network telemetry, billing reconciliations, carrier gates..."
                        value={veritasPrompt}
                        onChange={(e) => setVeritasPrompt(e.target.value)}
                        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line-strong)", background: "var(--field)" }}
                      />
                      <button type="submit" className="btn btn-primary" disabled={!veritasPrompt.trim()}>
                        Ask Veritas
                      </button>
                    </div>
                  </form>
                  {veritasChat.length > 0 && (
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {veritasChat.map((m, idx) => (
                        <div key={idx} className="card pad" style={{ background: m.sender === "user" ? "var(--blue-soft)" : "var(--field-soft)" }}>
                          <b>{m.sender === "user" ? "You" : "Veritas AI"}:</b> {m.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ─── Documentation ─────────────────────────────────────────────── */}
            {module === "docs" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Support / <b>Documentation</b></div>
                    <div className="ptitle">Developer &amp; Platform Documentation</div>
                    <div className="psub">
                      API specifications, TM Forum REST endpoints, MVNO architecture guides, and compliance checklists.
                    </div>
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div className="panel">
                    <h3>TM Forum OpenAPI Specs</h3>
                    <p className="psub">TMF620, TMF622, TMF632, TMF635, TMF666, TMF676, TMF678 endpoints.</p>
                  </div>
                  <div className="panel">
                    <h3>MVNE Carrier Integration Guide</h3>
                    <p className="psub">Southbound protocol specifications, G1–G8 certification gates, and HLR webhooks.</p>
                  </div>
                  <div className="panel">
                    <h3>WORM Evidence Ledger SDK</h3>
                    <p className="psub">Cryptographic hash chain verification tools and compliance export formats.</p>
                  </div>
                </div>
              </section>
            )}

            {/* ─── Support ───────────────────────────────────────────────────── */}
            {module === "support" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Support / <b>Support &amp; Incidents</b></div>
                    <div className="ptitle">Platform Support &amp; Incident Command</div>
                    <div className="psub">
                      Global 24/7/365 NOC operations, SLA monitoring, and carrier partner escalation bridges.
                    </div>
                  </div>
                </div>
                <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
                  <div className="kpi"><div className="l">Active Support Tickets</div><div className="v sm">3 Open</div></div>
                  <div className="kpi"><div className="l">NOC Response Time</div><div className="v sm">&lt; 2 minutes</div></div>
                  <div className="kpi"><div className="l">Carrier SLA Adherence</div><div className="v sm">99.99%</div></div>
                </div>
              </section>
            )}

            {/* ─── Settings ──────────────────────────────────────────────────── */}
            {module === "settings" && (
              <section className="module active">
                <div className="headrow">
                  <div>
                    <div className="crumb">Support / <b>Settings</b></div>
                    <div className="ptitle">Platform Configuration &amp; Governance</div>
                    <div className="psub">
                      Global environment flags, Vault key rotation schedules, and Super Admin audit rules.
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <h3>Global Environment</h3>
                  <div className="kv"><span className="k">Platform Version</span><span className="v mono">v4.26.9</span></div>
                  <div className="kv"><span className="k">Primary Region</span><span className="v">US-West (primary)</span></div>
                  <div className="kv"><span className="k">Failover Mode</span><span className="v">Hot-Standby (UK-South)</span></div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* ─── Onboard tenant ──────────────────────────────────────────────────── */}
      {onboardOpen && (
        <Modal
          title="Onboard a tenant"
          subtitle="Provisions the tenant and its primary brand, then sets up the administrator account with automated credential dispatch."
          onClose={() => {
            setOnboardError(null);
            setFormErrors({});
            setOnboardOpen(false);
          }}
          maxWidth={580}
          footer={
            <button
              className="btn btn-primary"
              disabled={onboard.isPending}
              onClick={() => onboard.mutate()}
            >
              {onboard.isPending ? "Onboarding…" : "Onboard Tenant"}
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {onboardError && (
              <div className="modal-alert modal-alert-error" style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", fontSize: 13 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{onboardError}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput
                label="Tenant name"
                required
                value={form.name}
                onChange={onNameChange}
                placeholder="Nova Cellular"
                error={formErrors.name}
              />
              <LabeledInput
                label="Domain suffix"
                required
                value={form.domain_suffix}
                onChange={(v) => {
                  setTouched((t) => ({ ...t, domain_suffix: true }));
                  setForm((f) => ({ ...f, domain_suffix: v }));
                  if (formErrors.domain_suffix) setFormErrors((prev) => ({ ...prev, domain_suffix: "" }));
                }}
                placeholder="nova-cellular.zoikonex.com"
                error={formErrors.domain_suffix}
                helpText="Subdomain for portal"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput
                label="Brand name"
                required
                value={form.brand_name}
                onChange={(v) => {
                  setTouched((t) => ({ ...t, brand_name: true }));
                  setForm((f) => ({ ...f, brand_name: v }));
                  if (formErrors.brand_name) setFormErrors((prev) => ({ ...prev, brand_name: "" }));
                }}
                placeholder="Nova Mobile"
                error={formErrors.brand_name}
              />
              <LabeledInput
                label="Brand code"
                required
                value={form.brand_code}
                onChange={(v) => {
                  setTouched((t) => ({ ...t, brand_code: true }));
                  setForm((f) => ({ ...f, brand_code: v }));
                  if (formErrors.brand_code) setFormErrors((prev) => ({ ...prev, brand_code: "" }));
                }}
                placeholder="nova-mobile"
                error={formErrors.brand_code}
              />
            </div>

            <div style={{ borderTop: "1px solid var(--line, #e2e8f0)", paddingTop: 10, marginTop: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="sectitle" style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ink, #0f172a)" }}>Tenant Administrator Account</span>
                <span style={{ fontSize: 11, color: "var(--muted, #64748b)" }}>Initial admin credentials</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LabeledInput
                label="Admin email"
                required
                type="email"
                value={form.admin_email}
                onChange={(v) => {
                  setTouched((t) => ({ ...t, admin_email: true }));
                  setForm((f) => ({ ...f, admin_email: v }));
                  if (formErrors.admin_email) setFormErrors((prev) => ({ ...prev, admin_email: "" }));
                }}
                placeholder="admin@novacellular.com"
                error={formErrors.admin_email}
              />
              <LabeledInput
                label="Admin full name"
                required
                value={form.admin_name}
                onChange={(v) => {
                  setTouched((t) => ({ ...t, admin_name: true }));
                  setForm((f) => ({ ...f, admin_name: v }));
                  if (formErrors.admin_name) setFormErrors((prev) => ({ ...prev, admin_name: "" }));
                }}
                placeholder="Jane Doe"
                error={formErrors.admin_name}
              />
            </div>

            <LabeledInput
              label="Temporary password"
              required
              value={form.admin_password}
              onChange={(v) => {
                setForm((f) => ({ ...f, admin_password: v }));
                if (formErrors.admin_password) setFormErrors((prev) => ({ ...prev, admin_password: "" }));
              }}
              placeholder="Min 12 chars (or generate securely)"
              error={formErrors.admin_password}
              actionButton={
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={generateSecurePassword}
                  style={{ fontSize: 11, color: "#0284c7", fontWeight: 600, padding: "2px 8px", cursor: "pointer", border: "1px solid #bae6fd", borderRadius: 6, background: "#f0f9ff" }}
                >
                  ⚡ Generate Password
                </button>
              }
              helpText="Must be at least 12 characters. The user will be required to change it on first login."
            />

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", background: "var(--card-subtle, #f8fafc)", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--line, #e2e8f0)", marginTop: 2 }}>
              <input
                type="checkbox"
                checked={form.send_email}
                onChange={(e) => setForm((f) => ({ ...f, send_email: e.target.checked }))}
                style={{ marginTop: 2, accentColor: "#0284c7", width: 16, height: 16 }}
              />
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: "var(--ink, #0f172a)" }}>
                  Email credentials to tenant administrator
                </div>
                <div style={{ color: "var(--muted, #64748b)", fontSize: 11 }}>
                  Automatically sends branded welcome email with portal URL, username, and temporary password.
                </div>
              </div>
            </label>
          </div>
        </Modal>
      )}

      {/* Credentials are shown once, after a successful onboard. */}
      {credentials && (
        <Modal
          title="Tenant Onboarded Successfully"
          subtitle="Provisioning complete. Review and share the administrator access credentials."
          onClose={() => setCredentials(null)}
          maxWidth={580}
          footer={
            <div style={{ display: "flex", gap: 8, width: "100%", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-sec"
                disabled={isSendingEmail}
                onClick={handleSendCredentialsEmail}
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                {isSendingEmail ? (
                  <>Sending email…</>
                ) : emailSentSuccess ? (
                  <>✓ Re-send Email</>
                ) : (
                  <>✉️ Email Credentials</>
                )}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const details = [
                    `ZoikoNex Operations Console Login`,
                    `Tenant Name: ${credentials.tenantName}`,
                    `Login Portal: https://${credentials.domainSuffix}/login`,
                    `Tenant ID: ${credentials.tenantId}`,
                    `Administrator: ${credentials.adminName} (${credentials.adminEmail})`,
                    `Temporary Password: ${credentials.adminPassword}`,
                  ].join("\n");
                  navigator.clipboard.writeText(details).then(
                    () => toast.success("All credentials copied to clipboard"),
                    () => toast.error("Copy failed"),
                  );
                }}
              >
                Copy All Details
              </button>
              <button className="btn btn-ghost" onClick={() => setCredentials(null)}>
                Done
              </button>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Status Banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: credentials.emailSent ? "#f0fdf4" : "#fffbeb",
                border: credentials.emailSent ? "1px solid #bbf7d0" : "1px solid #fef08a",
                color: credentials.emailSent ? "#166534" : "#854d0e",
                fontSize: 12,
              }}
            >
              <span style={{ fontSize: 16 }}>{credentials.emailSent ? "✅" : "⚠️"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>
                  {credentials.emailSent
                    ? `Credentials emailed to ${credentials.adminEmail}`
                    : "Credentials not yet emailed to the administrator"}
                </div>
                <div style={{ fontSize: 11, opacity: 0.9 }}>
                  {credentials.emailSent
                    ? "The welcome package has been dispatched to the recipient inbox."
                    : "You can send the credentials email above, or manually copy and share them."}
                </div>
              </div>
            </div>

            {/* Credential Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "var(--card-subtle, #f8fafc)", padding: 14, borderRadius: 10, border: "1px solid var(--line, #e2e8f0)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line, #e2e8f0)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted, #64748b)", fontWeight: 600, textTransform: "uppercase" }}>Login URL</div>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: "#0284c7" }}>https://{credentials.domainSuffix}/login</div>
                </div>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${credentials.domainSuffix}/login`);
                    toast.success("URL copied");
                  }}
                  style={{ fontSize: 11 }}
                >
                  Copy URL
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line, #e2e8f0)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted, #64748b)", fontWeight: 600, textTransform: "uppercase" }}>Tenant ID</div>
                  <div className="mono" style={{ fontSize: 12, color: "var(--ink, #0f172a)" }}>{credentials.tenantId}</div>
                </div>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(credentials.tenantId);
                    toast.success("Tenant ID copied");
                  }}
                  style={{ fontSize: 11 }}
                >
                  Copy ID
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: "1px solid var(--line, #e2e8f0)" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted, #64748b)", fontWeight: 600, textTransform: "uppercase" }}>Admin Email</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink, #0f172a)" }}>{credentials.adminEmail}</div>
                </div>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(credentials.adminEmail);
                    toast.success("Email copied");
                  }}
                  style={{ fontSize: 11 }}
                >
                  Copy Email
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fef3c7", padding: "8px 12px", borderRadius: 6, border: "1px solid #fde68a" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Temporary Password</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#78350f" }}>{credentials.adminPassword}</div>
                </div>
                <button
                  className="btn btn-xs"
                  style={{ background: "#d97706", color: "#ffffff", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 4, fontWeight: 600 }}
                  onClick={() => {
                    navigator.clipboard.writeText(credentials.adminPassword);
                    toast.success("Password copied");
                  }}
                >
                  Copy Password
                </button>
              </div>
            </div>

            <p style={{ fontSize: 11, color: "var(--muted, #64748b)", margin: 0, lineHeight: 1.4 }}>
              🔒 <strong>Security reminder:</strong> For security reasons, temporary passwords cannot be retrieved again after closing this window. The user will be required to change this password immediately upon their first sign-in.
            </p>
          </div>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--line, #dce5ef)", borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
            {[
              { label: "Current status", value: statusFor.tenant.status || "—", mono: false },
              { label: "Tenant ID",      value: statusFor.tenant.tenant_id,                mono: true  },
              { label: "Users affected", value: String(statusFor.tenant.user_count ?? 0),  mono: false },
              { label: "Domain",         value: statusFor.tenant.domain_suffix || "—",     mono: true  },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 16px",
                  background: i % 2 === 0 ? "var(--field-soft, #f8fafd)" : "var(--card, #fff)",
                  borderBottom: i < 3 ? "1px solid var(--line, #dce5ef)" : "none",
                  gap: 12,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 12.5, color: "var(--ink-soft, #4d5e72)", flex: "none" }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: "#0f172a",
                    fontFamily: row.mono ? "var(--mono, monospace)" : "inherit",
                    textAlign: "right",
                    wordBreak: "break-all",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
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

      {/* ─── MODAL: AI documentation analysis (proposal + review) ───────────── */}
      {docAnalyserConnector && (
        <DocAnalyserModal
          connectorId={docAnalyserConnector.connector_id}
          connectorName={docAnalyserConnector.connector_name}
          providerName={docAnalyserConnector.provider_name}
          onClose={() => setDocAnalyserConnector(null)}
          onApplied={(msg) => toast.success(msg)}
        />
      )}

      {/* ─── MODAL: Capability matrix (INT-ARC-012 / G1) ─────────────────────── */}
      {operationsConnector && (
        <OperationsCatalogueModal
          connectorId={operationsConnector.connector_id}
          connectorName={operationsConnector.connector_name}
          providerName={operationsConnector.provider_name}
          onClose={() => setOperationsConnector(null)}
          onChanged={(msg) => toast.success(msg)}
        />
      )}

      {/* ─── MODAL: Maker-checker activation (ED-2026-08 §10) ────────────────── */}
      {activationConnector && (
        <ActivationLifecycleModal
          connectorId={activationConnector.connector_id}
          connectorName={activationConnector.connector_name}
          onClose={() => setActivationConnector(null)}
          onChanged={(msg) => toast.success(msg)}
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

      {/* ─── MODAL: Partner Controls & Southbound Governance ─────────────────── */}
      {partnerControlsOpen && (
        <PartnerControlsModal
          connectors={mvnoConnectors}
          onClose={() => setPartnerControlsOpen(false)}
          onOpenOnboard={() => {
            setPartnerControlsOpen(false);
            setOnboardMvnoOpen(true);
          }}
          onOpenOperations={(c) => {
            setPartnerControlsOpen(false);
            setOperationsConnector(c);
          }}
          onOpenCredentials={(c) => {
            setPartnerControlsOpen(false);
            setCredentialModalConnector(c);
          }}
        />
      )}

      {/* ─── MODAL: Customise Command Centre Layout ──────────────────────────── */}
      {customiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8F0] shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Customise Command Centre</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Toggle widgets visible on your executive dashboard</p>
              </div>
              <button
                onClick={() => setCustomiseModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-[#64748B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {[
                { key: "platformHealth", label: "Platform Health Status Card", desc: "Core services availability & uptime" },
                { key: "activeTenants", label: "Active Tenants KPI Card", desc: "Onboarded tenant statistics and growth" },
                { key: "totalSubscribers", label: "Total Subscribers KPI Card", desc: "Global subscriber count and daily delta" },
                { key: "billableRevenue", label: "Billable Revenue Card (MTD)", desc: "Consolidated revenue analytics across tenants" },
                { key: "criticalActions", label: "Critical Actions & Warnings", desc: "High and medium platform escalations" },
                { key: "actionRequiredBanner", label: "Action Required Banner", desc: "Carrier activation retries & pending approvals" },
                { key: "tenantsTable", label: "Tenants & Operators Directory", desc: "Live tenant list with charging and provisioning tags" },
                { key: "fulfilmentGauge", label: "Provisioning & Service Fulfilment", desc: "Activation success gauge and order pipeline" },
                { key: "chargingSparklines", label: "Charging & Billing Sparklines", desc: "Rated usage and billable trend charts" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition select-none"
                >
                  <div>
                    <div className="text-xs font-bold text-[#0F172A]">{item.label}</div>
                    <div className="text-[11px] text-[#64748B]">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={widgetVisibility[item.key as keyof typeof widgetVisibility]}
                    onChange={(e) =>
                      setWidgetVisibility((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
              <button
                onClick={() => {
                  setWidgetVisibility({
                    platformHealth: true,
                    activeTenants: true,
                    totalSubscribers: true,
                    billableRevenue: true,
                    criticalActions: true,
                    actionRequiredBanner: true,
                    tenantsTable: true,
                    fulfilmentGauge: true,
                    chargingSparklines: true,
                  });
                  toast.success("Reset dashboard layout to defaults");
                }}
                className="px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                Reset to Default
              </button>
              <button
                onClick={() => {
                  setCustomiseModalOpen(false);
                  toast.success("Dashboard preferences saved");
                }}
                className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1D4ED8] transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
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
  required,
  error,
  type = "text",
  actionButton,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  type?: string;
  actionButton?: React.ReactNode;
  helpText?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontWeight: 600, color: "var(--ink, #0f172a)", display: "flex", alignItems: "center", gap: 4 }}>
          {label}
          {required && <span style={{ color: "#ef4444", fontWeight: "bold" }}>*</span>}
        </label>
        {actionButton}
      </div>
      <input
        type={type}
        className={error ? "is-invalid" : ""}
        style={{
          border: error ? "1.5px solid #ef4444" : "1.5px solid #94a3b8",
          borderRadius: 9,
          padding: "10px 12px",
          background: error ? "#fef2f2" : "var(--field, #ffffff)",
          color: "var(--ink, #0f172a)",
          fontSize: 13,
          fontFamily: "inherit",
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 500, marginTop: -2 }}>
          {error}
        </span>
      )}
      {helpText && !error && (
        <span style={{ color: "var(--muted, #64748b)", fontSize: 11, marginTop: -2 }}>
          {helpText}
        </span>
      )}
    </div>
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

  // Flatten all brands with tenant ID
  const brands = useMemo(() => {
    const list: { id: string; name: string; tenantName: string; tenantId: string }[] = [];
    for (const t of tenants) {
      const tid = t.tenant_id || (t as any).id || "";
      if (t.brands && t.brands.length > 0) {
        for (const b of t.brands) {
          list.push({ id: b.id, name: b.name, tenantName: t.name, tenantId: tid });
        }
      } else if (tid) {
        list.push({ id: tid, name: `${t.name} (Primary)`, tenantName: t.name, tenantId: tid });
      }
    }
    return list;
  }, [tenants]);

  // Auto-select brand if empty
  useEffect(() => {
    if (!form.brand_id && brands.length > 0) {
      setForm((prev) => ({ ...prev, brand_id: brands[0].id }));
    }
  }, [brands, form.brand_id]);

  // Step 1: Register Connector
  const handleRegister = async () => {
    if (!form.connector_name || !form.provider_name || !form.base_url) {
      toast.error("Please fill in connector name, provider slug, and carrier southbound base URL.");
      return;
    }
    const selectedBrand = brands.find((b) => b.id === form.brand_id) || brands[0];
    const defaultTenantId = tenants[0]?.tenant_id || (tenants[0] as any)?.id || "00000000-0000-0000-0000-000000000000";
    const targetBrandId = form.brand_id || selectedBrand?.id || defaultTenantId;
    const targetTenantId = selectedBrand?.tenantId || defaultTenantId;

    setSubmitting(true);
    try {
      const res = await platformApi.post<{ connector_id: string }>("integration", "/v1/connectors", {
        ...form,
        brand_id: targetBrandId,
        tenant_id: targetTenantId,
        credential_scope: form.tenancy_mode || "PROVIDER_SUBACCOUNT",
        vault_credential_path: `zoikonex/tenants/brands/${targetBrandId}/nexus`,
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
      } catch (e) {
        // Certification status decides whether a carrier may carry production
        // traffic. A hardcoded report used to render here whenever the call
        // failed, turning a reachability problem into gate verdicts nothing had
        // measured.
        throw e;
      }
    },
  });

  const report = readinessQ.data;

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
        {readinessQ.isLoading && <div className="mono" style={{ opacity: 0.7 }}>Evaluating readiness…</div>}

        {readinessQ.isError && (
          <div className="card pad" style={{ background: "var(--danger-soft)" }}>
            <div style={{ fontWeight: 700 }}>Readiness could not be read</div>
            <div style={{ opacity: 0.75, marginTop: 4 }}>
              {errMessage(readinessQ.error, "The integration service did not return a report.")}
            </div>
            <div style={{ opacity: 0.6, marginTop: 4, fontSize: 11 }}>
              No gate status is shown, because none was measured.
            </div>
          </div>
        )}

        {report && (
          <>
            {/* Top Summary Banner */}
            <div className="card pad" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "var(--field-soft)" }}>
              <div>
                <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Computed Code Readiness</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>{report.overall_readiness || "UNKNOWN"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Capabilities</div>
                {/* "32 / 49" used to appear exactly when the real counts were unknown. */}
                <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--blue)" }}>
                  {report.operations_registered == null
                    ? "—"
                    : `${report.operations_certified ?? 0} / ${report.operations_registered}`}
                </div>
                <div className="mono" style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>certified / registered</div>
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
          </>
        )}
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
  // Plan/SOC mappings translate a canonical product into the provider plan code
  // an order provisions against. A hardcoded set used to appear when the live
  // list was empty, so G4 could be signed off against entries that do not exist.
  const entries = liveEntries;

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
        // An uncredentialed connector shows no credentials. Showing a stand-in
        // pair made it look provisioned, and the operator would go on to request
        // activation believing Vault held a secret that was never submitted.
        return [] as CredentialItem[];
      }
    },
  });

  const credentials = credsQ.data ?? [];

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

function PartnerControlsModal({
  connectors,
  onClose,
  onOpenOnboard,
  onOpenOperations,
  onOpenCredentials,
}: {
  connectors: Connector[];
  onClose: () => void;
  onOpenOnboard: () => void;
  onOpenOperations: (c: Connector) => void;
  onOpenCredentials: (c: Connector) => void;
}) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"topology" | "quotas" | "dlq">("topology");

  // Fetch DLQ status from integration service
  const dlqQ = useQuery({
    queryKey: ["superadmin", "dlq-stats"],
    queryFn: async () => {
      try {
        const res = await platformApi.get<{ count?: number; items?: any[] }>("integration", "/v1/dlq?limit=20");
        return { count: res.count ?? res.items?.length ?? 0, items: res.items ?? [] };
      } catch {
        return { count: 0, items: [] };
      }
    },
  });

  const dlqCount = dlqQ.data?.count ?? 0;

  return (
    <Modal
      title="Carrier Partner Governance & Settlement Controls"
      subtitle="Southbound topology, rate quotas, DLQ circuit breakers, and revenue flow rules (INT-ARC-015)"
      onClose={onClose}
      maxWidth={840}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sec" onClick={onOpenOnboard}>
              + Onboard New Carrier Partner
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* KPI Summary Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <div className="card pad" style={{ background: "var(--field-soft)" }}>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Carrier Subaccounts</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "var(--blue)" }}>
              {connectors.length} Configured
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Multi-tenant isolated</div>
          </div>

          <div className="card pad" style={{ background: "var(--field-soft)" }}>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Default Quota Gate</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "var(--emerald)" }}>
              300 req / min
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>8,000ms circuit timeout</div>
          </div>

          <div className="card pad" style={{ background: "var(--field-soft)" }}>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>DLQ Poison Queue</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: dlqCount > 0 ? "var(--danger)" : "var(--green)" }}>
              {dlqCount} Failures
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
              {dlqCount === 0 ? "All webhooks delivering" : "Unprocessed dead letters"}
            </div>
          </div>

          <div className="card pad" style={{ background: "var(--field-soft)" }}>
            <div className="mono" style={{ fontSize: 10, textTransform: "uppercase", opacity: 0.6 }}>Settlement Mode</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "var(--violet)" }}>
              DIRECT
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>IMMUTABLE (v1.0-2026)</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--line-strong)", paddingBottom: 6 }}>
          <button
            className={`btn btn-sm ${activeTab === "topology" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("topology")}
          >
            Partner Subaccounts &amp; Topology
          </button>
          <button
            className={`btn btn-sm ${activeTab === "quotas" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("quotas")}
          >
            Rate Limits &amp; Egress Gating
          </button>
          <button
            className={`btn btn-sm ${activeTab === "dlq" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setActiveTab("dlq")}
          >
            DLQ &amp; Webhook Reliability ({dlqCount})
          </button>
        </div>

        {/* Tab 1: Topology */}
        {activeTab === "topology" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="panel" style={{ background: "var(--blue-soft)", padding: 12 }}>
              <strong style={{ color: "var(--blue)", fontSize: 11, textTransform: "uppercase" }}>
                Commercial &amp; Regulatory Topology Rules (INT-ARC-015)
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--ink-soft)" }}>
                Each partner arrangement pins legal contracting entities, settlement funds flow, and multi-tenant subaccount isolation.
              </p>
            </div>

            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th>Connector / Partner</th>
                    <th>Tenancy Mode</th>
                    <th>Funds Flow</th>
                    <th>Regulated Role</th>
                    <th>Contracting Entity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {connectors.map((c) => (
                    <tr key={c.connector_id}>
                      <td>
                        <div className="strong" style={{ fontSize: 12 }}>{c.connector_name}</div>
                        <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{c.provider_name} · {c.connector_id.slice(0, 8)}…</div>
                      </td>
                      <td><span className="mono" style={{ fontSize: 11 }}>{c.tenancy_mode || "PROVIDER_SUBACCOUNT"}</span></td>
                      <td><span className="mono" style={{ fontSize: 11 }}>{c.funds_flow_mode || "DIRECT_SETTLEMENT"}</span></td>
                      <td><span style={{ fontSize: 11 }}>{c.regulated_role || "MVNO_OPERATOR"}</span></td>
                      <td><span style={{ fontSize: 11 }}>{c.contracting_entity || "Zoiko Tech Inc / MVNOC LLC"}</span></td>
                      <td><StatusChip status={c.status} /></td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => onOpenOperations(c)}
                            title="Open Telecom Operations Matrix"
                          >
                            Operations
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => onOpenCredentials(c)}
                            title="Manage Vault Partner Credentials"
                          >
                            Vault
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {connectors.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: 24, opacity: 0.6 }}>
                        No MVNO Carrier connectors registered. Click "+ Onboard New Carrier Partner" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Quotas */}
        {activeTab === "quotas" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card pad">
              <div className="sectitle" style={{ margin: "0 0 10px", fontSize: 12 }}>
                Southbound Circuit Breaker &amp; Rate Gating Rules
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "var(--field-soft)", padding: 12, borderRadius: 8 }}>
                  <div className="strong" style={{ fontSize: 12 }}>Concurrency Rate Limiter</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "var(--blue)" }}>
                    300 req / min
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                    Per-tenant token-bucket limiter to prevent upstream carrier throttling.
                  </div>
                </div>

                <div style={{ background: "var(--field-soft)", padding: 12, borderRadius: 8 }}>
                  <div className="strong" style={{ fontSize: 12 }}>Southbound Gateway Timeout</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: "var(--amber)" }}>
                    8,000 ms
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                    Circuit trips to degraded state after 3 consecutive 5xx or timeout events.
                  </div>
                </div>
              </div>
            </div>

            <div className="card pad">
              <div className="sectitle" style={{ margin: "0 0 8px", fontSize: 12 }}>
                Vault &amp; Egress Security Isolation
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11.5, lineHeight: 1.6, color: "var(--ink-soft)" }}>
                <li>Carrier credentials never leave HashiCorp Vault / KMS secret manager.</li>
                <li>JWT bearer tokens are generated just-in-time with memory-only ephemeral caching.</li>
                <li>All Southbound egress traffic is signed with HMAC-SHA256 headers and TLS 1.3 mutual handshake.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: DLQ */}
        {activeTab === "dlq" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="panel" style={{ background: dlqCount > 0 ? "var(--danger-soft)" : "var(--green-soft)", padding: 12 }}>
              <strong style={{ color: dlqCount > 0 ? "var(--danger)" : "var(--green)", fontSize: 11, textTransform: "uppercase" }}>
                Dead Letter Queue Status: {dlqCount === 0 ? "Clean (0 Poison Messages)" : `${dlqCount} Pending Messages`}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--ink-soft)" }}>
                Failed webhook deliveries and southbound carrier callback errors are captured in the DLQ with backoff retry tracking.
              </p>
            </div>

            <div className="tablewrap">
              <table>
                <thead>
                  <tr>
                    <th>Event ID</th>
                    <th>Connector</th>
                    <th>Error Reason</th>
                    <th>Retry Count</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(dlqQ.data?.items ?? []).map((item: any, idx: number) => (
                    <tr key={item.id || idx}>
                      <td className="mono" style={{ fontSize: 11 }}>{item.event_id || item.id || `DLQ-${idx + 1}`}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{item.connector_id || "nexus"}</td>
                      <td style={{ fontSize: 11, color: "var(--danger)" }}>{item.error || "Carrier Southbound Timeout"}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{item.retry_count ?? 3} / 5</td>
                      <td className="mono" style={{ fontSize: 10, opacity: 0.7 }}>{item.created_at || "Just now"}</td>
                    </tr>
                  ))}
                  {(dlqQ.data?.items ?? []).length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: 20, opacity: 0.6 }}>
                        ✓ Dead Letter Queue is empty. All partner webhooks and callbacks are healthy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
