"use client";

/**
 * Shared building blocks for the admin dashboards.
 *
 * These exist because the same four shapes were being re-typed per dashboard:
 * a status badge, a row of lifecycle buttons, a key/value detail block, and a modal
 * shell. Duplicating the lifecycle buttons is the dangerous one — each copy is
 * another place a transition table can drift out of step with the backend.
 */

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import { type Transition, type TransitionTable, transitionsFor } from "@/lib/admin/transitions";

// ─── Status badge ─────────────────────────────────────────────────────────────

/**
 * Colour is derived from the status word rather than passed in, so the same state
 * reads the same way on every screen. Statuses are shared across domains — ACTIVE,
 * SUSPENDED, FAILED all appear in several — and an operator scanning two panels
 * should not have to re-learn the palette.
 */
function tone(status: string | undefined): string {
  switch (status) {
    case "ACTIVE":
    case "ACTIVATED":
    case "COMPLETED":
    case "VERIFIED":
    case "APPROVED":
      return "bg-emerald-50 text-emerald-600 outline-emerald-500/30";
    case "FAILED":
    case "CANCELLED":
    case "TERMINATED":
    case "DEACTIVATED":
    case "CLOSED":
    case "REJECTED":
      return "bg-rose-50 text-rose-600 outline-rose-500/30";
    case "SUSPENDED":
    case "REPLACED":
    case "EXPIRED":
    case "RETIRED":
      return "bg-orange-50 text-orange-600 outline-orange-500/30";
    default:
      // Pending/in-flight states: anything the operator may still need to act on.
      return "bg-amber-50 text-amber-600 outline-amber-500/30";
  }
}

export function StatusPill({ status, size = "sm" }: { status: string | undefined; size?: "sm" | "xs" }) {
  return (
    <span
      className={`px-2 py-0.5 rounded font-bold font-mono outline outline-1 whitespace-nowrap ${
        size === "xs" ? "text-[9px]" : "text-[10px]"
      } ${tone(status)}`}
    >
      {status ?? "—"}
    </span>
  );
}

// ─── Lifecycle buttons ────────────────────────────────────────────────────────

/**
 * Renders exactly the transitions a status permits, and nothing else.
 *
 * Forward moves and destructive ones are grouped and styled apart so an operator
 * does not fire a cancellation while reaching for the next step. A terminal status
 * says so instead of rendering an empty row, because a dead end with no explanation
 * reads as a broken screen.
 */
export function TransitionButtons({
  table,
  status,
  onAction,
  pending = false,
  variant = "light",
  className = "",
}: {
  table: TransitionTable;
  status: string | undefined;
  onAction: (action: string, t: Transition) => void;
  pending?: boolean;
  /** "dark" for the saga console panels, "light" for table rows. */
  variant?: "light" | "dark";
  className?: string;
}) {
  const transitions = transitionsFor(table, status);
  const forward = transitions.filter((t) => !t.destructive);
  const destructive = transitions.filter((t) => t.destructive);

  if (transitions.length === 0) {
    return (
      <span className={`text-[10px] text-slate-400 font-medium ${className}`}>
        {status ?? "—"} is terminal
      </span>
    );
  }

  const forwardClass =
    variant === "dark"
      ? "bg-sky-600 hover:bg-sky-700 text-white"
      : "bg-sky-600 hover:bg-sky-700 text-white";
  const destructiveClass =
    variant === "dark"
      ? "bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800"
      : "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50";

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {forward.map((t) => (
        <button
          key={t.action}
          onClick={() => onAction(t.action, t)}
          disabled={pending}
          className={`px-2.5 py-1.5 rounded font-bold transition text-[10px] cursor-pointer disabled:opacity-50 ${forwardClass}`}
        >
          {t.label}
        </button>
      ))}
      {destructive.map((t) => (
        <button
          key={t.action}
          onClick={() => onAction(t.action, t)}
          disabled={pending}
          className={`px-2.5 py-1.5 rounded font-bold transition text-[10px] cursor-pointer disabled:opacity-50 ${destructiveClass}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Key/value detail ─────────────────────────────────────────────────────────

export type DetailRow = [label: string, value: React.ReactNode];

/** Two-column key/value block. Empty values render as an em dash, never blank. */
export function DetailList({ rows, className = "" }: { rows: DetailRow[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-y-1 text-[10px] ${className}`}>
      {rows.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt className="text-slate-400">{label}</dt>
          <dd className="font-mono text-slate-700 break-all">
            {value === null || value === undefined || value === "" ? "—" : value}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/**
 * Reads one record back by id and shows every populated field.
 *
 * List endpoints and PATCH responses both return partial records across these
 * services — a SIM PATCH returns only {id, status, msisdn} — so the authoritative
 * record is only available from its own GET.
 */
export function RecordDetail({
  service,
  path,
  queryKey,
}: {
  service: string;
  path: string;
  queryKey: unknown[];
}) {
  const q = useQuery({
    queryKey,
    queryFn: () => api.get<Record<string, unknown>>(service, path),
  });

  if (q.isLoading) return <div className="text-[10px] text-slate-400 italic">Loading…</div>;
  if (q.isError)
    return (
      <div className="text-[10px] text-rose-600">
        {errMessage(q.error, "Could not load the record.")}
      </div>
    );

  const rows: DetailRow[] = Object.entries(q.data ?? {})
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => [k, String(v)]);

  if (rows.length === 0) return <div className="text-[10px] text-slate-400">No fields returned.</div>;
  return <DetailList rows={rows} className="bg-white rounded border border-slate-200 p-2 mt-1.5" />;
}

/** Inline expand/collapse trigger, paired with RecordDetail. */
export function DetailToggle({
  open,
  onToggle,
  className = "",
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-[9px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer ${className}`}
    >
      {open ? "Hide detail" : "Detail"}
    </button>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

/**
 * The dialog chrome every admin modal was re-implementing: overlay, header with a
 * close control, scrollable body, and a footer for the confirm/cancel pair.
 */
export function Modal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = "w-[480px]",
}: {
  title: string;
  subtitle?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div
        className={`bg-white border border-slate-200 rounded-xl shadow-2xl ${width} flex flex-col overflow-hidden`}
      >
        <div className="flex justify-between items-start gap-3 p-5 border-b border-slate-200">
          <div>
            <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">{title}</h2>
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          {children}
        </div>

        {footer && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
}

/** The cancel/confirm pair used in every modal footer. */
export function ModalActions({
  onCancel,
  onConfirm,
  confirmLabel,
  pendingLabel,
  pending = false,
  disabled = false,
  destructive = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  pendingLabel?: string;
  pending?: boolean;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <>
      <button
        onClick={onCancel}
        className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={pending || disabled}
        className={`px-5 py-2 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60 ${
          destructive ? "bg-rose-600 hover:bg-rose-700" : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {pending ? (pendingLabel ?? "Working…") : confirmLabel}
      </button>
    </>
  );
}

// ─── Form field ───────────────────────────────────────────────────────────────

/** Labelled input. Same markup was repeated for every field on every form. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-700 font-semibold">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition";
export const inputMonoClass = `${inputClass} font-mono`;

// ─── Table states ─────────────────────────────────────────────────────────────

/**
 * Loading, error and empty states for a table body. Written once so an error is
 * never silently rendered as "no rows" — the failure mode that hid three broken
 * dashboards.
 */
export function TableState({
  colSpan,
  loading,
  error,
  empty,
  loadingLabel = "Loading…",
  emptyLabel = "Nothing to show yet.",
}: {
  colSpan: number;
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
}) {
  if (!loading && !error && !empty) return null;
  const content = loading ? (
    <span className="text-slate-400">{loadingLabel}</span>
  ) : error ? (
    <span className="text-rose-600">{errMessage(error, "Could not load this list.")}</span>
  ) : (
    <span className="text-slate-400">{emptyLabel}</span>
  );
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-xs">
        {content}
      </td>
    </tr>
  );
}
