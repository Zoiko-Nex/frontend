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

interface Customer {
  customer_id?: string; id?: string; party_id?: string; customer_type?: string;
  lifecycle_status?: string; status?: string; kyc_status?: string; segment?: string;
  created_at?: string;
}
interface Account {
  account_id?: string; id?: string; account_number?: string; account_type?: string;
  status?: string; credit_limit_minor_units?: number; credit_limit_currency_code?: string; currency_code?: string;
}

const CUSTOMER_ACTIONS = [
  { action: "SUBMIT_KYC", label: "Submit KYC", from: ["DRAFT"] },
  { action: "ACTIVATE", label: "Activate", from: ["PENDING_KYC", "SUSPENDED"] },
  { action: "SUSPEND", label: "Suspend", from: ["ACTIVE"], danger: true },
  { action: "TERMINATE", label: "Terminate", from: ["ACTIVE", "SUSPENDED", "DRAFT", "PENDING_KYC"], danger: true },
];

export default function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();

  const cust = useQuery({
    queryKey: ["customer", id],
    queryFn: () => api.get<Customer>("customer", `/v1/customers/${id}`),
  });
  const accounts = useQuery({
    queryKey: ["customer", id, "accounts"],
    queryFn: () => api.get<{ accounts?: Account[] }>("customer", `/v1/customers/${id}/accounts`),
  });

  const [pending, setPending] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const act = useMutation({
    mutationFn: (action: string) => api.patch<Customer>("customer", `/v1/customers/${id}`, { action, reason: reason || undefined }),
    onSuccess: (_d, action) => { toast.success(`${action} applied`); setPending(null); setReason(""); qc.invalidateQueries({ queryKey: ["customer", id] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Action failed"),
  });

  const c = cust.data;
  const lifecycle = c?.lifecycle_status || c?.status;
  const accts = accounts.data?.accounts ?? [];

  return (
    <div>
      <Link href="/admin/customers" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", textDecoration: "none" }}>← Customers</Link>

      {cust.isLoading ? <div style={{ marginTop: 24 }}><Spinner /></div> : cust.isError ? <div style={{ marginTop: 16 }}><ErrorBanner error={cust.error} /></div> : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, margin: "14px 0 22px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ fontSize: 19, fontWeight: 600 }}>Customer</h1>
                <StatusBadge status={lifecycle} />
              </div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", marginTop: 6 }}>{id}</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CUSTOMER_ACTIONS.filter((a) => !lifecycle || a.from.includes(lifecycle)).map((a) => (
                <Button key={a.action} variant={a.danger ? "danger" : "default"} onClick={() => setPending(a.action)}>{a.label}</Button>
              ))}
            </div>
          </div>

          <Card style={{ padding: 20, marginBottom: 22 }}>
            <DetailGrid>
              <Detail label="Type">{c?.customer_type || "—"}</Detail>
              <Detail label="Lifecycle"><StatusBadge status={lifecycle} /></Detail>
              <Detail label="KYC"><StatusBadge status={c?.kyc_status} /></Detail>
              <Detail label="Segment">{c?.segment || "—"}</Detail>
              <Detail label="Party"><CopyId value={c?.party_id} /></Detail>
            </DetailGrid>
          </Card>

          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Accounts</h2>
          {accounts.isError ? <ErrorBanner error={accounts.error} /> : (
            <Table>
              <thead><tr><Th>Account ID</Th><Th>Number</Th><Th>Type</Th><Th>Credit limit</Th><Th>Status</Th></tr></thead>
              <tbody>
                {accounts.isLoading ? <Tr><Td>Loading…</Td><Td /><Td /><Td /><Td /></Tr> : accts.length === 0 ? (
                  <Tr><Td><EmptyState title="No accounts" /></Td><Td /><Td /><Td /><Td /></Tr>
                ) : accts.map((a) => {
                  const aid = a.account_id || a.id;
                  return (
                    <Tr key={aid} onClick={() => { window.location.href = `/admin/customers/account/${aid}`; }}>
                      <Td><CopyId value={aid} /></Td>
                      <Td className="mono" style={{ fontSize: 12 }}>{a.account_number || "—"}</Td>
                      <Td>{a.account_type || "—"}</Td>
                      <Td className="mono">{formatMoney(a.credit_limit_minor_units, a.credit_limit_currency_code || a.currency_code)}</Td>
                      <Td><StatusBadge status={a.status} /></Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Action confirm modal */}
      <Modal open={!!pending} onClose={() => { setPending(null); setReason(""); }} title={`Confirm: ${pending}`}
        footer={<>
          <Button variant="ghost" onClick={() => { setPending(null); setReason(""); }}>Cancel</Button>
          <Button variant={CUSTOMER_ACTIONS.find((a) => a.action === pending)?.danger ? "danger" : "primary"} loading={act.isPending} onClick={() => act.mutate(pending!)}>Apply {pending}</Button>
        </>}>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", marginBottom: 14, lineHeight: 1.6 }}>
          This transitions the customer lifecycle. The backend enforces the state machine and will reject illegal transitions.
        </p>
        <Field label="Reason (optional)"><Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Audit note" /></Field>
      </Modal>
    </div>
  );
}
