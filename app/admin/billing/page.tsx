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

type Tab = "invoices" | "cycles";
interface Invoice { invoice_id?: string; id?: string; invoice_number?: string; status?: string; account_id?: string; total_amount_minor_units?: number; amount_minor_units?: number; currency_code?: string; }
interface BillCycle { bill_cycle_id?: string; id?: string; cycle_type?: string; status?: string; account_id?: string; cycle_start_at?: string; cycle_end_at?: string; }

export default function BillingPage() {
  const [tab, setTab] = useState<Tab>("invoices");
  return (
    <div>
      <SectionHeader title="Billing & Invoice" subtitle="Invoices, credit/debit notes and bill cycles. Issued invoices are immutable — corrections create their own records." />
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--ax-border)" }}>
        <button onClick={() => setTab("invoices")} style={tabStyle(tab === "invoices")}>Invoices</button>
        <button onClick={() => setTab("cycles")} style={tabStyle(tab === "cycles")}>Bill cycles</button>
      </div>
      {tab === "invoices" ? <InvoicesTab /> : <CyclesTab />}
    </div>
  );
}
function tabStyle(active: boolean): React.CSSProperties {
  return { padding: "9px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: active ? "var(--ax-text)" : "var(--ax-text-dim)", fontWeight: active ? 600 : 400, borderBottom: active ? "2px solid var(--ax-accent)" : "2px solid transparent", marginBottom: -1 };
}

function InvoicesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ account_id: "", customer_id: "", currency_code: "USD" });
  const q = useQuery({ queryKey: ["billing", "invoices"], queryFn: () => api.get<{ items?: Invoice[]; invoices?: Invoice[] }>("billing", "/v1/invoices?limit=50") });
  const invoices = q.data?.items ?? q.data?.invoices ?? [];

  const create = useMutation({
    mutationFn: () => api.post<Invoice>("billing", "/v1/invoices", form),
    onSuccess: () => { toast.success("Draft invoice created"); setOpen(false); qc.invalidateQueries({ queryKey: ["billing", "invoices"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}><Button variant="primary" onClick={() => setOpen(true)}>+ New invoice</Button></div>
      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Invoice</Th><Th>Account</Th><Th>Amount</Th><Th>Status</Th></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={4} /> : invoices.length === 0 ? (
              <Tr><Td><EmptyState title="No invoices" hint="Create a draft invoice to begin." /></Td><Td /><Td /><Td /></Tr>
            ) : invoices.map((inv) => {
              const iid = inv.invoice_id || inv.id;
              return (
                <Tr key={iid} onClick={() => { window.location.href = `/admin/billing/${iid}`; }}>
                  <Td><span className="mono" style={{ fontSize: 12.5 }}>{inv.invoice_number || iid?.slice(0, 12)}</span></Td>
                  <Td><CopyId value={inv.account_id} /></Td>
                  <Td className="mono">{formatMoney(inv.total_amount_minor_units ?? inv.amount_minor_units, inv.currency_code)}</Td>
                  <Td><StatusBadge status={inv.status} /></Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="New invoice"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create draft</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Account ID"><Input className="mono" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })} /></Field>
          <Field label="Customer ID"><Input className="mono" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} /></Field>
          <Field label="Currency"><Input value={form.currency_code} onChange={(e) => setForm({ ...form, currency_code: e.target.value.toUpperCase() })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

function CyclesTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [acct, setAcct] = useState("");
  const [form, setForm] = useState({ account_id: "", customer_id: "", cycle_type: "MONTHLY" });
  const q = useQuery({
    queryKey: ["billing", "cycles", acct],
    queryFn: () => api.get<{ items?: BillCycle[] }>("billing", `/v1/bill-cycles${acct ? `?account_id=${acct}` : ""}`),
  });
  const cycles = q.data?.items ?? [];
  const close = useMutation({
    mutationFn: (id: string) => api.post("billing", `/v1/bill-cycles/${id}/close`),
    onSuccess: () => { toast.success("Cycle closed"); qc.invalidateQueries({ queryKey: ["billing", "cycles"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });
  const create = useMutation({
    mutationFn: () => api.post("billing", "/v1/bill-cycles", form),
    onSuccess: () => { toast.success("Bill cycle created"); setOpen(false); qc.invalidateQueries({ queryKey: ["billing", "cycles"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  return (
    <div>
      <Card style={{ padding: 14, marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 420 }}><Field label="Filter by account ID"><Input className="mono" value={acct} onChange={(e) => setAcct(e.target.value.trim())} placeholder="ac000001-…" /></Field></div>
        <Button variant="primary" onClick={() => setOpen(true)}>+ New cycle</Button>
      </Card>
      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Cycle ID</Th><Th>Type</Th><Th>Account</Th><Th>Status</Th><Th></Th></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={5} /> : cycles.length === 0 ? (
              <Tr><Td><EmptyState title="No bill cycles" hint="Filter by an account ID, or create one." /></Td><Td /><Td /><Td /><Td /></Tr>
            ) : cycles.map((cy) => {
              const cid = cy.bill_cycle_id || cy.id;
              return (
                <Tr key={cid}>
                  <Td><CopyId value={cid} /></Td>
                  <Td className="mono" style={{ fontSize: 12 }}>{cy.cycle_type || "—"}</Td>
                  <Td><CopyId value={cy.account_id} /></Td>
                  <Td><StatusBadge status={cy.status} /></Td>
                  <Td style={{ textAlign: "right" }}>{cy.status === "OPEN" && <Button variant="default" loading={close.isPending} onClick={() => close.mutate(cid!)}>Close</Button>}</Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="New bill cycle"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Account ID"><Input className="mono" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })} /></Field>
          <Field label="Customer ID"><Input className="mono" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} /></Field>
          <Field label="Cycle type"><Select value={form.cycle_type} onChange={(e) => setForm({ ...form, cycle_type: e.target.value })}>{["MONTHLY", "QUARTERLY", "ANNUAL"].map((t) => <option key={t}>{t}</option>)}</Select></Field>
        </div>
      </Modal>
    </div>
  );
}
