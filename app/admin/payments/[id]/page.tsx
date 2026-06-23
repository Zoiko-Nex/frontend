"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import {
  Card, Table, Th, Td, Tr, Button, Input, Field, Modal,
  CopyId, DetailGrid, Detail, Spinner, ErrorBanner, EmptyState,
} from "../../_components/ui";
import StatusBadge from "../../_components/StatusBadge";

interface Intent {
  payment_intent_id?: string; id?: string; status?: string; payment_rail?: string; provider_name?: string;
  amount_minor_units?: number; currency_code?: string; account_id?: string; customer_id?: string; invoice_id?: string;
}
interface Refund { refund_id?: string; id?: string; refund_amount_minor_units?: number; reason_code?: string; status?: string; }
interface Settlement { settlement_id?: string; id?: string; net_amount_minor_units?: number; fee_amount_minor_units?: number; status?: string; }
interface Event { id?: string; event_type?: string; created_at?: string; occurred_at?: string; }

export default function PaymentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["payment", id] });

  const q = useQuery({ queryKey: ["payment", id], queryFn: () => api.get<Intent>("payments", `/v1/payment-intents/${id}`) });
  const refunds = useQuery({ queryKey: ["payment", id, "refunds"], queryFn: () => api.get<{ items?: Refund[] }>("payments", `/v1/payment-intents/${id}/refunds`) });
  const settlements = useQuery({ queryKey: ["payment", id, "settlements"], queryFn: () => api.get<{ items?: Settlement[] }>("payments", `/v1/payment-intents/${id}/settlements`) });
  const events = useQuery({ queryKey: ["payment", id, "events"], queryFn: () => api.get<{ items?: Event[] }>("payments", `/v1/payment-intents/${id}/events`) });

  const intent = q.data;
  const status = intent?.status;
  const currency = intent?.currency_code;

  const [modal, setModal] = useState<null | "refund" | "settle">(null);
  const [refund, setRefund] = useState({ refund_amount_minor_units: "", reason_code: "REQUESTED_BY_CUSTOMER" });
  const [settle, setSettle] = useState({ net_amount_minor_units: "", fee_amount_minor_units: "" });

  const lifecycle = useMutation({
    mutationFn: (action: "authorise" | "capture" | "void") =>
      api.post("payments", `/v1/payment-intents/${id}/${action}`, action === "void" ? { reason: "Voided from console" } : {}, { idempotencyKey: api.uuid() }),
    onSuccess: (_d, action) => { toast.success(`Payment ${action}d`); invalidate(); events.refetch(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const doRefund = useMutation({
    mutationFn: () => api.post("payments", `/v1/payment-intents/${id}/refunds`, {
      refund_amount_minor_units: Number(refund.refund_amount_minor_units), currency_code: currency,
      reason_code: refund.reason_code, idempotency_key: api.uuid(),
    }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Refund issued"); setModal(null); refunds.refetch(); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const doSettle = useMutation({
    mutationFn: () => api.post("payments", `/v1/payment-intents/${id}/settlements`, {
      currency_code: currency, net_amount_minor_units: Number(settle.net_amount_minor_units), fee_amount_minor_units: Number(settle.fee_amount_minor_units || 0),
    }, { idempotencyKey: api.uuid() }),
    onSuccess: () => { toast.success("Settlement recorded"); setModal(null); settlements.refetch(); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  return (
    <div>
      <Link href="/admin/payments" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", textDecoration: "none" }}>← Payments</Link>
      {q.isLoading ? <div style={{ marginTop: 24 }}><Spinner /></div> : q.isError ? <div style={{ marginTop: 16 }}><ErrorBanner error={q.error} /></div> : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, margin: "14px 0 22px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ fontSize: 19, fontWeight: 600 }}>{formatMoney(intent?.amount_minor_units, currency)}</h1>
                <StatusBadge status={status} />
              </div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", marginTop: 6 }}>{id}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {status === "CREATED" && <Button variant="primary" loading={lifecycle.isPending} onClick={() => lifecycle.mutate("authorise")}>Authorise</Button>}
              {status === "AUTHORISED" && <Button variant="primary" loading={lifecycle.isPending} onClick={() => lifecycle.mutate("capture")}>Capture</Button>}
              {(status === "CREATED" || status === "AUTHORISED") && <Button variant="danger" loading={lifecycle.isPending} onClick={() => lifecycle.mutate("void")}>Void</Button>}
              {status === "CAPTURED" && <Button variant="default" onClick={() => setModal("settle")}>Settle</Button>}
              {status === "CAPTURED" && <Button variant="default" onClick={() => setModal("refund")}>Refund</Button>}
            </div>
          </div>

          <Card style={{ padding: 20, marginBottom: 22 }}>
            <DetailGrid>
              <Detail label="Status"><StatusBadge status={status} /></Detail>
              <Detail label="Rail">{intent?.payment_rail || "—"}</Detail>
              <Detail label="Provider">{intent?.provider_name || "—"}</Detail>
              <Detail label="Amount"><span className="mono">{formatMoney(intent?.amount_minor_units, currency)}</span></Detail>
              <Detail label="Invoice"><CopyId value={intent?.invoice_id} /></Detail>
              <Detail label="Account"><CopyId value={intent?.account_id} /></Detail>
            </DetailGrid>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--ax-text-dim)" }}>Refunds</h3>
              <Table>
                <thead><tr><Th>ID</Th><Th>Amount</Th><Th>Status</Th></tr></thead>
                <tbody>
                  {(refunds.data?.items ?? []).length === 0 ? <Tr><Td style={{ color: "var(--ax-text-faint)" }}>None</Td><Td /><Td /></Tr> : refunds.data!.items!.map((r, i) => (
                    <Tr key={r.refund_id || r.id || i}><Td><CopyId value={r.refund_id || r.id} /></Td><Td className="mono">{formatMoney(r.refund_amount_minor_units, currency)}</Td><Td><StatusBadge status={r.status} /></Td></Tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--ax-text-dim)" }}>Settlements</h3>
              <Table>
                <thead><tr><Th>ID</Th><Th>Net</Th><Th>Fee</Th></tr></thead>
                <tbody>
                  {(settlements.data?.items ?? []).length === 0 ? <Tr><Td style={{ color: "var(--ax-text-faint)" }}>None</Td><Td /><Td /></Tr> : settlements.data!.items!.map((s, i) => (
                    <Tr key={s.settlement_id || s.id || i}><Td><CopyId value={s.settlement_id || s.id} /></Td><Td className="mono">{formatMoney(s.net_amount_minor_units, currency)}</Td><Td className="mono">{formatMoney(s.fee_amount_minor_units, currency)}</Td></Tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--ax-text-dim)" }}>Event log</h3>
          <Table>
            <thead><tr><Th>Event</Th><Th>When</Th></tr></thead>
            <tbody>
              {(events.data?.items ?? []).length === 0 ? <Tr><Td><EmptyState title="No events" /></Td><Td /></Tr> : events.data!.items!.map((ev, i) => (
                <Tr key={ev.id || i}><Td className="mono" style={{ fontSize: 12 }}>{ev.event_type || "—"}</Td><Td style={{ color: "var(--ax-text-dim)", fontSize: 12 }}>{ev.occurred_at || ev.created_at || "—"}</Td></Tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal open={modal === "refund"} onClose={() => setModal(null)} title="Issue refund"
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" loading={doRefund.isPending} onClick={() => doRefund.mutate()}>Refund</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Amount (minor units)" hint={`Captured: ${formatMoney(intent?.amount_minor_units, currency)}`}><Input className="mono" inputMode="numeric" value={refund.refund_amount_minor_units} onChange={(e) => setRefund({ ...refund, refund_amount_minor_units: e.target.value })} /></Field>
          <Field label="Reason code"><Input value={refund.reason_code} onChange={(e) => setRefund({ ...refund, reason_code: e.target.value })} /></Field>
        </div>
      </Modal>

      <Modal open={modal === "settle"} onClose={() => setModal(null)} title="Record settlement"
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" loading={doSettle.isPending} onClick={() => doSettle.mutate()}>Record</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Net amount (minor units)" hint="Gross minus provider fee."><Input className="mono" inputMode="numeric" value={settle.net_amount_minor_units} onChange={(e) => setSettle({ ...settle, net_amount_minor_units: e.target.value })} /></Field>
          <Field label="Fee amount (minor units)"><Input className="mono" inputMode="numeric" value={settle.fee_amount_minor_units} onChange={(e) => setSettle({ ...settle, fee_amount_minor_units: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
