"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, EmptyState, LoadingRows, ErrorBanner,
} from "../_components/ui";
import StatusBadge from "../_components/StatusBadge";

interface Intent { payment_intent_id?: string; id?: string; status?: string; payment_rail?: string; provider_name?: string; amount_minor_units?: number; currency_code?: string; account_id?: string; }
interface Dashboard { [k: string]: number | undefined; }

export default function PaymentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ invoice_id: "", account_id: "", customer_id: "", payment_rail: "CARD", provider_name: "STRIPE", amount_minor_units: "", currency_code: "USD", payment_method_token: "pm_test_tok" });

  const dash = useQuery({ queryKey: ["payments", "dashboard"], queryFn: () => api.get<Dashboard>("payments", "/v1/payment-intents/dashboard") });
  const list = useQuery({ queryKey: ["payments", "intents"], queryFn: () => api.get<{ items?: Intent[] }>("payments", "/v1/payment-intents?page_size=50") });
  const intents = list.data?.items ?? [];

  const create = useMutation({
    mutationFn: () => api.post<Intent>("payments", "/v1/payment-intents", {
      invoice_id: form.invoice_id || undefined, account_id: form.account_id, customer_id: form.customer_id,
      payment_rail: form.payment_rail, provider_name: form.provider_name,
      amount_minor_units: Number(form.amount_minor_units), currency_code: form.currency_code,
      payment_method_token: form.payment_method_token,
    }, { idempotencyKey: api.uuid() }), // payments requires Idempotency-Key on mutations
    onSuccess: () => { toast.success("Payment intent created"); setOpen(false); qc.invalidateQueries({ queryKey: ["payments"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  const STAGES = ["CREATED", "AUTHORISED", "CAPTURED", "SETTLED", "REFUNDED", "VOIDED", "FAILED"];

  return (
    <div>
      <SectionHeader title="Payments" subtitle="Payment intents across rails — authorisation, capture, settlement and refunds. Mutations are idempotent."
        actions={<Button variant="primary" onClick={() => setOpen(true)}>+ New intent</Button>} />

      <Card style={{ padding: 18, marginBottom: 22 }}>
        {dash.isLoading ? <span style={{ fontSize: 13, color: "var(--ax-text-dim)" }}>Loading funnel…</span> : dash.isError ? <span style={{ fontSize: 12.5, color: "var(--ax-text-faint)" }}>Dashboard unreachable.</span> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))", gap: 10 }}>
            {STAGES.map((s) => (
              <div key={s} style={{ background: "var(--ax-bg-overlay)", border: "1px solid var(--ax-border)", borderRadius: 8, padding: "11px 12px" }}>
                <div className="mono" style={{ fontSize: 21, fontWeight: 600 }}>{dash.data?.[s] ?? 0}</div>
                <div style={{ marginTop: 8 }}><StatusBadge status={s} /></div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {list.isError ? <ErrorBanner error={list.error} /> : (
        <Table>
          <thead><tr><Th>Intent ID</Th><Th>Rail</Th><Th>Provider</Th><Th>Amount</Th><Th>Status</Th></tr></thead>
          <tbody>
            {list.isLoading ? <LoadingRows cols={5} /> : intents.length === 0 ? (
              <Tr><Td><EmptyState title="No payment intents" hint="Create an intent to begin a payment flow." /></Td><Td /><Td /><Td /><Td /></Tr>
            ) : intents.map((p) => {
              const pid = p.payment_intent_id || p.id;
              return (
                <Tr key={pid} onClick={() => { window.location.href = `/admin/payments/${pid}`; }}>
                  <Td><CopyId value={pid} /></Td>
                  <Td className="mono" style={{ fontSize: 12 }}>{p.payment_rail || "—"}</Td>
                  <Td className="mono" style={{ fontSize: 12 }}>{p.provider_name || "—"}</Td>
                  <Td className="mono">{formatMoney(p.amount_minor_units, p.currency_code)}</Td>
                  <Td><StatusBadge status={p.status} /></Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New payment intent" width={520}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Invoice ID (optional)"><Input className="mono" value={form.invoice_id} onChange={(e) => setForm({ ...form, invoice_id: e.target.value })} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Account ID"><Input className="mono" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })} /></Field>
            <Field label="Customer ID"><Input className="mono" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Rail"><Select value={form.payment_rail} onChange={(e) => setForm({ ...form, payment_rail: e.target.value })}>{["CARD", "MOBILE_MONEY", "BANK_TRANSFER"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
            <Field label="Provider"><Input value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <Field label="Amount (minor units)" hint="e.g. 10000 = $100.00"><Input className="mono" inputMode="numeric" value={form.amount_minor_units} onChange={(e) => setForm({ ...form, amount_minor_units: e.target.value })} /></Field>
            <Field label="Currency"><Input value={form.currency_code} onChange={(e) => setForm({ ...form, currency_code: e.target.value.toUpperCase() })} /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
