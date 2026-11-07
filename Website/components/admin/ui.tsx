"use client";

import React, { useState } from "react";

/* ───────────────────────── Button ───────────────────────── */

type ButtonVariant = "primary" | "default" | "ghost" | "danger";
export function Button({
  variant = "default", loading, children, style, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
    padding: "8px 14px", borderRadius: "var(--ax-radius-sm)", fontSize: 13, fontWeight: 500,
    cursor: props.disabled || loading ? "not-allowed" : "pointer", borderWidth: 1, borderStyle: "solid", borderColor: "transparent",
    transition: "background .12s, border-color .12s, opacity .12s", whiteSpace: "nowrap",
    opacity: props.disabled || loading ? 0.55 : 1, lineHeight: 1.2,
  };
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: "var(--ax-accent)", color: "var(--ax-accent-text)", fontWeight: 600 },
    default: { background: "var(--ax-bg-overlay)", color: "var(--ax-text)", borderColor: "var(--ax-border-strong)" },
    ghost: { background: "transparent", color: "var(--ax-text-dim)" },
    danger: { background: "var(--ax-red-dim)", color: "var(--ax-red)", borderColor: "color-mix(in srgb, var(--ax-red) 30%, transparent)" },
  };
  return (
    <button {...props} disabled={props.disabled || loading} style={{ ...base, ...variants[variant], ...style }}>
      {loading && <Spinner size={13} />}
      {children}
    </button>
  );
}

/* ───────────────────────── Card / Panel ───────────────────────── */

export function Card({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} style={{
      background: "var(--ax-bg-raised)", border: "1px solid var(--ax-border)",
      borderRadius: "var(--ax-radius)", ...style,
    }}>{children}</div>
  );
}

export function SectionHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
      <div>
        <h1 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--ax-text-dim)", fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

/* ───────────────────────── Table ───────────────────────── */

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--ax-radius)", border: "1px solid var(--ax-border)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>{children}</table>
    </div>
  );
}
export function Th({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th style={{
      textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
      letterSpacing: "0.06em", color: "var(--ax-text-faint)", background: "var(--ax-bg-overlay)",
      borderBottom: "1px solid var(--ax-border)", whiteSpace: "nowrap", ...style,
    }}>{children}</th>
  );
}
export function Td({ children, style, className }: { children?: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return <td className={className} style={{ padding: "11px 14px", borderBottom: "1px solid var(--ax-border)", verticalAlign: "middle", ...style }}>{children}</td>;
}
export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={onClick ? "ax-row-click" : undefined}
      style={{ cursor: onClick ? "pointer" : "default", transition: "background .1s" }}
      onMouseEnter={onClick ? (e) => (e.currentTarget.style.background = "var(--ax-bg-hover)") : undefined}
      onMouseLeave={onClick ? (e) => (e.currentTarget.style.background = "transparent") : undefined}
    >{children}</tr>
  );
}

/* ───────────────────────── Inputs ───────────────────────── */

const fieldStyle: React.CSSProperties = {
  width: "100%", padding: "8px 11px", background: "var(--ax-bg)", color: "var(--ax-text)",
  border: "1px solid var(--ax-border-strong)", borderRadius: "var(--ax-radius-sm)", fontSize: 13,
  fontFamily: "inherit",
};

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, color: "var(--ax-text-dim)", marginBottom: 6, fontWeight: 500 }}>{label}</span>
      {children}
      {hint && <span style={{ display: "block", fontSize: 11.5, color: "var(--ax-text-faint)", marginTop: 5 }}>{hint}</span>}
    </label>
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldStyle, ...props.style }} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...fieldStyle, ...props.style }} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...fieldStyle, resize: "vertical", minHeight: 72, ...props.style }} />;
}

/* ───────────────────────── Copyable ID ───────────────────────── */

export function CopyId({ value, truncate = true }: { value?: string | null; truncate?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!value) return <span style={{ color: "var(--ax-text-faint)" }}>—</span>;
  const display = truncate && value.length > 14 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
  return (
    <button
      className="mono"
      title={`${value} — click to copy`}
      onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1100); }}
      style={{
        background: "transparent", border: "none", color: copied ? "var(--ax-accent)" : "var(--ax-text-dim)",
        cursor: "pointer", fontSize: 12, padding: 0, display: "inline-flex", alignItems: "center", gap: 5,
      }}
    >
      {copied ? "copied" : display}
    </button>
  );
}

/* ───────────────────────── States ───────────────────────── */

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size, border: `2px solid color-mix(in srgb, currentColor 25%, transparent)`,
      borderTopColor: "currentColor", borderRadius: "50%", display: "inline-block",
      animation: "ax-spin .6s linear infinite",
    }} />
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 24px", color: "var(--ax-text-dim)" }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ax-text)" }}>{title}</div>
      {hint && <div style={{ fontSize: 13, marginTop: 6, maxWidth: 380, marginInline: "auto" }}>{hint}</div>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

export function LoadingRows({ cols = 4, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <Tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <Td key={c}>
              <div style={{
                height: 12, borderRadius: 4, width: `${50 + ((r + c) % 4) * 12}%`,
                background: "linear-gradient(90deg, var(--ax-bg-overlay), var(--ax-bg-hover), var(--ax-bg-overlay))",
                backgroundSize: "200% 100%", animation: "ax-shimmer 1.2s ease-in-out infinite",
              }} />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
}

export function ErrorBanner({ error }: { error: unknown }) {
  const e = error as { code?: string; message?: string; correlationId?: string; status?: number };
  return (
    <Card style={{ padding: "14px 16px", borderColor: "color-mix(in srgb, var(--ax-red) 35%, transparent)", background: "var(--ax-red-dim)" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ color: "var(--ax-red)", fontWeight: 700 }}>!</span>
        <div style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 600, color: "var(--ax-text)" }}>{e?.code || "Error"}</div>
          <div style={{ color: "var(--ax-text-dim)", marginTop: 3 }}>{e?.message || "Something went wrong."}</div>
          {e?.correlationId && <div className="mono" style={{ color: "var(--ax-text-faint)", marginTop: 6, fontSize: 11 }}>trace {e.correlationId}</div>}
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── Modal ───────────────────────── */

export function Modal({ open, onClose, title, children, footer, width = 480 }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; width?: number;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.66)", backdropFilter: "blur(2px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width, maxWidth: "100%", maxHeight: "88vh", overflow: "auto", background: "var(--ax-bg-raised)", border: "1px solid var(--ax-border-strong)", borderRadius: "var(--ax-radius)", animation: "ax-pop .14s ease-out" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--ax-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: "var(--ax-text-dim)", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
        {footer && <div style={{ padding: "14px 20px", borderTop: "1px solid var(--ax-border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>}
      </div>
    </div>
  );
}

/* ───────────────────────── Detail rows ───────────────────────── */

export function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px 28px" }}>{children}</div>;
}
export function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-faint)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13.5, color: "var(--ax-text)" }}>{children ?? "—"}</div>
    </div>
  );
}
