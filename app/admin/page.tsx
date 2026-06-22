"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { Card, SectionHeader, Spinner } from "./_components/ui";
import StatusBadge from "./_components/StatusBadge";

/* ── Types (subset of backend responses we render) ── */
interface PaymentDashboard {
  CREATED?: number; AUTHORISED?: number; CAPTURED?: number; SETTLED?: number; REFUNDED?: number; VOIDED?: number; FAILED?: number;
  [k: string]: number | undefined;
}
interface Invoice { invoice_id: string; invoice_number?: string; status: string; total_amount_minor_units?: number; amount_minor_units?: number; currency_code?: string; account_id?: string; }
interface InvoiceList { items?: Invoice[]; invoices?: Invoice[]; }

export default function ControlRoom() {
  const payments = useQuery({
    queryKey: ["payments", "dashboard"],
    queryFn: () => api.get<PaymentDashboard>("payments", "/v1/payment-intents/dashboard"),
  });
  const invoices = useQuery({
    queryKey: ["billing", "invoices", "recent"],
    queryFn: () => api.get<InvoiceList>("billing", "/v1/invoices?limit=6"),
  });

  const invList = invoices.data?.items ?? invoices.data?.invoices ?? [];

  return (
    <div>
      <SectionHeader
        title="Control Room"
        subtitle="Live operational state of the ZoikoNex platform — commercial system of record."
      />

      {/* Payment intent funnel — the money pulse of the platform */}
      <Card style={{ padding: 20, marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)" }}>Payment intents</h2>
          <Link href="/admin/payments" style={{ fontSize: 12.5, color: "var(--ax-accent)", textDecoration: "none" }}>Open payments →</Link>
        </div>
        {payments.isLoading ? (
          <Spinner />
        ) : payments.isError ? (
          <UnreachableHint service="Payments" />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12 }}>
            {(["CREATED", "AUTHORISED", "CAPTURED", "SETTLED", "REFUNDED", "VOIDED", "FAILED"] as const).map((k) => (
              <Stat key={k} label={k} value={payments.data?.[k] ?? 0} status={k} />
            ))}
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
        {/* Recent invoices */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)" }}>Recent invoices</h2>
            <Link href="/admin/billing" style={{ fontSize: 12.5, color: "var(--ax-accent)", textDecoration: "none" }}>All →</Link>
          </div>
          {invoices.isLoading ? <Spinner /> : invoices.isError ? <UnreachableHint service="Billing" /> : invList.length === 0 ? (
            <p style={{ color: "var(--ax-text-faint)", fontSize: 13 }}>No invoices yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {invList.map((inv) => (
                <Link key={inv.invoice_id} href={`/admin/billing/${inv.invoice_id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", textDecoration: "none", borderBottom: "1px solid var(--ax-border)" }}>
                  <span className="mono" style={{ fontSize: 12.5, color: "var(--ax-text-dim)" }}>{inv.invoice_number || inv.invoice_id.slice(0, 12)}</span>
                  <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 12.5, color: "var(--ax-text)" }}>{formatMoney(inv.total_amount_minor_units ?? inv.amount_minor_units, inv.currency_code)}</span>
                    <StatusBadge status={inv.status} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Platform map */}
        <Card style={{ padding: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ax-text-dim)", marginBottom: 14 }}>Domains wired</h2>
          <p style={{ fontSize: 13, color: "var(--ax-text-dim)", lineHeight: 1.7 }}>
            This console operates an 18-domain Tier-1 BSS platform. Four domains are fully wired in this build —
            <strong style={{ color: "var(--ax-text)" }}> Identity, Customers, Billing, Payments</strong> — each following the same
            template the remaining domains adopt.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {[
              { l: "Identity & Tenancy", h: "/admin/identity" },
              { l: "Customers & Accounts", h: "/admin/customers" },
              { l: "Billing & Invoice", h: "/admin/billing" },
              { l: "Payments", h: "/admin/payments" },
            ].map((d) => (
              <Link key={d.h} href={d.h} style={{ fontSize: 12.5, color: "var(--ax-text)", textDecoration: "none", border: "1px solid var(--ax-border-strong)", borderRadius: 6, padding: "6px 11px", background: "var(--ax-bg-overlay)" }}>{d.l}</Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, status }: { label: string; value: number; status: string }) {
  return (
    <div style={{ background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: "13px 14px" }}>
      <div className="mono" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{value}</div>
      <div style={{ marginTop: 9 }}><StatusBadge status={status} /></div>
    </div>
  );
}

function UnreachableHint({ service }: { service: string }) {
  return (
    <p style={{ fontSize: 12.5, color: "var(--ax-text-faint)" }}>
      {service} service unreachable. Ensure the backend is running and its CORS config allows this origin.
    </p>
  );
}
