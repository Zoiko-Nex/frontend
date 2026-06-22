"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import {
  Card, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, DetailGrid, Detail, Spinner, ErrorBanner, EmptyState,
} from "../../_components/ui";
import StatusBadge from "../../_components/StatusBadge";

interface LineItem { line_item_id?: string; id?: string; line_description?: string; description?: string; unit_amount_minor_units?: number; quantity?: number; tax_amount_minor_units?: number; }
interface Note { id?: string; credit_note_id?: string; debit_note_id?: string; reason_code?: string; amount_minor_units?: number; status?: string; }
interface Invoice {
  invoice_id?: string; id?: string; invoice_number?: string; status?: string; account_id?: string; customer_id?: string;
  currency_code?: string; total_amount_minor_units?: number; amount_minor_units?: number;
  line_items?: LineItem[]; invoice?: Invoice;
}

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["invoice", id] });

  const q = useQuery({ queryKey: ["invoice", id], queryFn: () => api.get<Invoice>("billing", `/v1/invoices/${id}`) });
  const credits = useQuery({ queryKey: ["invoice", id, "credit-notes"], queryFn: () => api.get<{ items?: Note[] }>("billing", `/v1/invoices/${id}/credit-notes`) });
  const debits = useQuery({ queryKey: ["invoice", id, "debit-notes"], queryFn: () => api.get<{ items?: Note[] }>("billing", `/v1/invoices/${id}/debit-notes`) });

  // The response may be {invoice, line_items} or a flat invoice.
  const inv = (q.data?.invoice ?? q.data) as Invoice | undefined;
  const lineItems = q.data?.line_items ?? inv?.line_items ?? [];
  const status = inv?.status;
  const currency = inv?.currency_code;
  const isDraft = status === "DRAFT";
  const isIssued = status === "ISSUED";

  const [modal, setModal] = useState<null | "line" | "credit" | "debit">(null);
  const [line, setLine] = useState({ line_description: "", unit_amount_minor_units: "", quantity: "1", tax_amount_minor_units: "" });
  const [note, setNote] = useState({ reason_code: "GOODWILL", amount_minor_units: "", reason_description: "" });

  const addLine = useMutation({
    mutationFn: () => api.post("billing", `/v1/invoices/${id}/line-items`, {
      line_description: line.line_description,
      unit_amount_minor_units: Number(line.unit_amount_minor_units),
      quantity: Number(line.quantity) || 1,
      tax_amount_minor_units: line.tax_amount_minor_units ? Number(line.tax_amount_minor_units) : undefined,
    }),
    onSuccess: () => { toast.success("Line item added"); setModal(null); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const issue = useMutation({
    mutationFn: () => api.post("billing", `/v1/invoices/${id}/issue`, {}),
    onSuccess: () => { toast.success("Invoice issued"); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const cancel = useMutation({
    mutationFn: () => api.post("billing", `/v1/invoices/${id}/cancel`, { reason: "Cancelled from console" }),
    onSuccess: () => { toast.success("Invoice cancelled"); invalidate(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const creditNote = useMutation({
    mutationFn: () => api.post("billing", `/v1/invoices/${id}/credit-notes`, { reason_code: note.reason_code, amount_minor_units: Number(note.amount_minor_units), reason_description: note.reason_description || undefined }),
    onSuccess: () => { toast.success("Credit note issued"); setModal(null); credits.refetch(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const debitNote = useMutation({
    mutationFn: () => api.post("billing", `/v1/invoices/${id}/debit-notes`, { reason_code: note.reason_code, amount_minor_units: Number(note.amount_minor_units) }),
    onSuccess: () => { toast.success("Debit note issued"); setModal(null); debits.refetch(); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  return (
    <div>
      <Link href="/admin/billing" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", textDecoration: "none" }}>← Billing</Link>
      {q.isLoading ? <div style={{ marginTop: 24 }}><Spinner /></div> : q.isError ? <div style={{ marginTop: 16 }}><ErrorBanner error={q.error} /></div> : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, margin: "14px 0 22px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ fontSize: 19, fontWeight: 600 }}>{inv?.invoice_number || "Invoice"}</h1>
                <StatusBadge status={status} />
              </div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", marginTop: 6 }}>{id}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {isDraft && <Button variant="default" onClick={() => setModal("line")}>+ Line item</Button>}
              {isDraft && <Button variant="primary" loading={issue.isPending} onClick={() => issue.mutate()}>Issue</Button>}
              {isIssued && <Button variant="default" onClick={() => setModal("credit")}>Credit note</Button>}
              {isIssued && <Button variant="default" onClick={() => setModal("debit")}>Debit note</Button>}
              {status !== "CANCELLED" && <Button variant="danger" loading={cancel.isPending} onClick={() => cancel.mutate()}>Cancel</Button>}
            </div>
          </div>

          <Card style={{ padding: 20, marginBottom: 22 }}>
            <DetailGrid>
              <Detail label="Status"><StatusBadge status={status} /></Detail>
              <Detail label="Total"><span className="mono">{formatMoney(inv?.total_amount_minor_units ?? inv?.amount_minor_units, currency)}</span></Detail>
              <Detail label="Currency">{currency || "—"}</Detail>
              <Detail label="Account"><CopyId value={inv?.account_id} /></Detail>
              <Detail label="Customer"><CopyId value={inv?.customer_id} /></Detail>
            </DetailGrid>
            {isIssued && <p style={{ fontSize: 12, color: "var(--ax-text-faint)", marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--ax-border)" }}>This invoice is issued and immutable. Monetary corrections must be made via credit or debit notes.</p>}
          </Card>

          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Line items</h2>
          <Table>
            <thead><tr><Th>Description</Th><Th>Qty</Th><Th>Unit</Th><Th>Tax</Th></tr></thead>
            <tbody>
              {lineItems.length === 0 ? <Tr><Td><EmptyState title="No line items" /></Td><Td /><Td /><Td /></Tr> : lineItems.map((li, i) => (
                <Tr key={li.line_item_id || li.id || i}>
                  <Td>{li.line_description || li.description || "—"}</Td>
                  <Td className="mono">{li.quantity ?? 1}</Td>
                  <Td className="mono">{formatMoney(li.unit_amount_minor_units, currency)}</Td>
                  <Td className="mono">{formatMoney(li.tax_amount_minor_units, currency)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          {/* Notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 24 }}>
            <NoteList title="Credit notes" notes={credits.data?.items ?? []} currency={currency} />
            <NoteList title="Debit notes" notes={debits.data?.items ?? []} currency={currency} />
          </div>
        </>
      )}

      {/* Line item modal */}
      <Modal open={modal === "line"} onClose={() => setModal(null)} title="Add line item"
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" loading={addLine.isPending} onClick={() => addLine.mutate()}>Add</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Description"><Input value={line.line_description} onChange={(e) => setLine({ ...line, line_description: e.target.value })} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Unit amount (minor units)" hint="e.g. 4400 = $44.00"><Input className="mono" inputMode="numeric" value={line.unit_amount_minor_units} onChange={(e) => setLine({ ...line, unit_amount_minor_units: e.target.value })} /></Field>
            <Field label="Quantity"><Input className="mono" inputMode="numeric" value={line.quantity} onChange={(e) => setLine({ ...line, quantity: e.target.value })} /></Field>
          </div>
          <Field label="Tax (minor units, optional)"><Input className="mono" inputMode="numeric" value={line.tax_amount_minor_units} onChange={(e) => setLine({ ...line, tax_amount_minor_units: e.target.value })} /></Field>
        </div>
      </Modal>

      {/* Note modals */}
      <Modal open={modal === "credit" || modal === "debit"} onClose={() => setModal(null)} title={modal === "credit" ? "Issue credit note" : "Issue debit note"}
        footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" loading={creditNote.isPending || debitNote.isPending} onClick={() => (modal === "credit" ? creditNote : debitNote).mutate()}>Issue</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Reason code"><Select value={note.reason_code} onChange={(e) => setNote({ ...note, reason_code: e.target.value })}>{["GOODWILL", "BILLING_ERROR", "SERVICE_CREDIT", "ADJUSTMENT", "DISPUTE"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
          <Field label="Amount (minor units)" hint="e.g. 5500 = $55.00"><Input className="mono" inputMode="numeric" value={note.amount_minor_units} onChange={(e) => setNote({ ...note, amount_minor_units: e.target.value })} /></Field>
          {modal === "credit" && <Field label="Description (optional)"><Input value={note.reason_description} onChange={(e) => setNote({ ...note, reason_description: e.target.value })} /></Field>}
        </div>
      </Modal>
    </div>
  );
}

function NoteList({ title, notes, currency }: { title: string; notes: Note[]; currency?: string }) {
  return (
    <div>
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--ax-text-dim)" }}>{title}</h3>
      <Table>
        <thead><tr><Th>ID</Th><Th>Reason</Th><Th>Amount</Th></tr></thead>
        <tbody>
          {notes.length === 0 ? <Tr><Td style={{ color: "var(--ax-text-faint)" }}>None</Td><Td /><Td /></Tr> : notes.map((n, i) => (
            <Tr key={n.id || n.credit_note_id || n.debit_note_id || i}>
              <Td><CopyId value={n.id || n.credit_note_id || n.debit_note_id} /></Td>
              <Td className="mono" style={{ fontSize: 12 }}>{n.reason_code || "—"}</Td>
              <Td className="mono">{formatMoney(n.amount_minor_units, currency)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
