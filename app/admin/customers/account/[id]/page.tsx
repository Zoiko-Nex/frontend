"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { Card, Button, Input, Field, Modal, CopyId, DetailGrid, Detail, Spinner, ErrorBanner } from "../../../_components/ui";
import StatusBadge from "../../../_components/StatusBadge";

interface Account {
  account_id?: string; id?: string; account_number?: string; account_type?: string; status?: string;
  customer_id?: string; parent_account_id?: string;
  credit_limit_minor_units?: number; credit_limit_currency_code?: string; currency_code?: string;
}

const ACCOUNT_ACTIONS = [
  { action: "ACTIVATE", label: "Activate", from: ["CREATED", "SUSPENDED"] },
  { action: "SUSPEND", label: "Suspend", from: ["ACTIVE"], danger: true },
  { action: "CLOSE", label: "Close", from: ["ACTIVE", "SUSPENDED", "CREATED"], danger: true },
];

export default function AccountDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const q = useQuery({ queryKey: ["account", id], queryFn: () => api.get<Account>("customer", `/v1/accounts/${id}`) });
  const act = useMutation({
    mutationFn: (action: string) => api.patch<Account>("customer", `/v1/accounts/${id}`, { action, reason: reason || undefined }),
    onSuccess: (_d, action) => { toast.success(`${action} applied`); setPending(null); setReason(""); qc.invalidateQueries({ queryKey: ["account", id] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Action failed"),
  });

  const a = q.data;
  const status = a?.status;

  return (
    <div>
      <Link href={a?.customer_id ? `/admin/customers/${a.customer_id}` : "/admin/customers"} style={{ fontSize: 12.5, color: "var(--ax-text-dim)", textDecoration: "none" }}>← Customer</Link>
      {q.isLoading ? <div style={{ marginTop: 24 }}><Spinner /></div> : q.isError ? <div style={{ marginTop: 16 }}><ErrorBanner error={q.error} /></div> : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, margin: "14px 0 22px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h1 style={{ fontSize: 19, fontWeight: 600 }}>Account {a?.account_number}</h1>
                <StatusBadge status={status} />
              </div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ax-text-dim)", marginTop: 6 }}>{id}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {ACCOUNT_ACTIONS.filter((x) => !status || x.from.includes(status)).map((x) => (
                <Button key={x.action} variant={x.danger ? "danger" : "default"} onClick={() => setPending(x.action)}>{x.label}</Button>
              ))}
            </div>
          </div>
          <Card style={{ padding: 20 }}>
            <DetailGrid>
              <Detail label="Number" >{a?.account_number || "—"}</Detail>
              <Detail label="Type">{a?.account_type || "—"}</Detail>
              <Detail label="Status"><StatusBadge status={status} /></Detail>
              <Detail label="Credit limit"><span className="mono">{formatMoney(a?.credit_limit_minor_units, a?.credit_limit_currency_code || a?.currency_code)}</span></Detail>
              <Detail label="Customer"><CopyId value={a?.customer_id} /></Detail>
              <Detail label="Parent account"><CopyId value={a?.parent_account_id} /></Detail>
            </DetailGrid>
          </Card>
        </>
      )}

      <Modal open={!!pending} onClose={() => { setPending(null); setReason(""); }} title={`Confirm: ${pending}`}
        footer={<><Button variant="ghost" onClick={() => { setPending(null); setReason(""); }}>Cancel</Button>
          <Button variant={ACCOUNT_ACTIONS.find((x) => x.action === pending)?.danger ? "danger" : "primary"} loading={act.isPending} onClick={() => act.mutate(pending!)}>Apply</Button></>}>
        <Field label="Reason (optional)"><Input value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
      </Modal>
    </div>
  );
}
