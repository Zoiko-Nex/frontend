"use client";

/**
 * Super-admin console primitives, in the console's own visual language (the
 * .panel / .btn / .chip classes in super-admin.css). Moved out of page.tsx so
 * the integrations screens and the console share one copy instead of two that
 * drift.
 */

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type ConnectorVocabulary } from "@/lib/admin/integration";

export function Chip({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`chip ${tone}`}>{children}</span>;
}

export function statusTone(status: string | undefined): string {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
    case "LIVE":
    case "COMPLETED":
    case "VALID":
    case "SUCCESS":
    case "APPLIED":
    case "APPROVED":
    case "PASSED":
    case "ACTIVATED":
    case "READY_TO_ASSESS":
      return "c-green";
    case "CERTIFIED":
    case "SANDBOX_PASSED":
      return "c-cyan";
    case "SUSPENDED":
    case "BLOCKED":
    case "FAILED":
    case "CANCELLED":
    case "REJECTED":
    case "REVOKED":
    case "COMPROMISED":
    case "PROVIDER_REJECTED":
    case "OUTCOME_UNKNOWN":
    case "PROVIDER_ERROR":
    case "UNKNOWN_TYPE":
      return "c-red";
    case "SANDBOX":
    case "PENDING":
    case "PREVIEW":
    case "DRAFT":
    case "PARTIAL":
    case "QUALIFIED":
    case "UNMATCHED":
    case "RATE_LIMITED":
    case "UNCERTIFIED":
      return "c-amber";
    default:
      return "c-grey";
  }
}

export function StatusChip({ status }: { status: string | undefined }) {
  return <Chip tone={statusTone(status)}>{status ?? "—"}</Chip>;
}

/** Loading / error / empty for a table body. Never renders an error as "no rows". */
export function TableState({
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
          <span role="alert" style={{ color: "var(--danger)" }}>{errMessage(error, "Could not load this list.")}</span>
        ) : (
          <span style={{ opacity: 0.6 }}>{emptyLabel ?? "Nothing to show."}</span>
        )}
      </td>
    </tr>
  );
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth,
  dismissible = true,
  closeLabel = "Cancel",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number | string;
  /** False when closing loses something for good (a secret shown once): only the close button closes it. */
  dismissible?: boolean;
  closeLabel?: string;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dialog.current?.focus();
  }, []);
  useEffect(() => {
    if (!dismissible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, dismissible]);

  return (
    <div className="scrim2 show" onClick={dismissible ? onClose : undefined}>
      <div
        ref={dialog}
        tabIndex={-1}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
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
          <button type="button" className="btn btn-sec" onClick={onClose}>{closeLabel}</button>
          {footer}
        </div>
      </div>
    </div>
  );
}

export interface TenantOption {
  tenant_id: string;
  name: string;
  domain_suffix: string;
  brands?: { id: string; name: string; code_name: string }[];
}

export function TenantPicker({
  tenants,
  value,
  onChange,
  label = "Tenant",
}: {
  tenants: TenantOption[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="filters" style={{ margin: 0 }}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} style={{ minWidth: 240 }}>
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

/** A labelled form field in the console's style. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="field" style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</span>
      {children}
      {hint && <span style={{ display: "block", fontSize: 11, opacity: 0.65, marginTop: 4 }}>{hint}</span>}
    </label>
  );
}

/** Key/value line inside a panel. */
export function KV({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v">{children}</span>
    </div>
  );
}

/** Error text for a failed load inside a panel. */
export function PanelError({ error, fallback }: { error: unknown; fallback: string }) {
  return (
    <p role="alert" style={{ color: "var(--danger)", fontSize: 12, margin: "8px 0" }}>
      {errMessage(error, fallback)}
    </p>
  );
}

export const inputStyle: React.CSSProperties = { width: "100%" };

/** The values integration-ecosystem accepts for its enumerated fields. Fetched once per session. */
export function useVocabulary() {
  return useQuery({ queryKey: integrationKeys.vocabulary(), queryFn: integrationApi.vocabulary, staleTime: Infinity });
}

/**
 * A select whose options are one list from the backend vocabulary. It starts
 * unselected: the operator chooses, nothing is defaulted on their behalf.
 */
export function VocabSelect({ list, value, onChange, label, style }: {
  list: keyof ConnectorVocabulary;
  value: string;
  onChange: (v: string) => void;
  label?: string;
  style?: React.CSSProperties;
}) {
  const vocab = useVocabulary();
  return (
    <select aria-label={label} style={style} value={value} onChange={(e) => onChange(e.target.value)} disabled={!vocab.data}>
      <option value="">{vocab.error ? "— could not load —" : "— select —"}</option>
      {(vocab.data?.[list] ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
