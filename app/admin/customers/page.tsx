"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import {
  Card, SectionHeader, Table, Th, Td, Tr, Button, Input, Field, Select, Modal,
  CopyId, EmptyState, LoadingRows, ErrorBanner,
} from "../_components/ui";
import StatusBadge from "../_components/StatusBadge";

interface Customer {
  customer_id?: string; id?: string; party_id?: string; customer_type?: string;
  lifecycle_status?: string; status?: string; kyc_status?: string; segment?: string;
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ party_id: "", customer_type: "RETAIL", segment: "" });

  // The customer service has no list-all endpoint in the documented matrix;
  // we render the seeded customers as known entry points plus a lookup-by-id.
  const seeded = ["cc000001-0000-4000-8000-000000000001", "cc000002-0000-4000-8000-000000000002"];
  const q = useQuery({
    queryKey: ["customers", "seeded"],
    queryFn: async () => {
      const results = await Promise.allSettled(seeded.map((id) => api.get<Customer>("customer", `/v1/customers/${id}`)));
      return results.filter((r): r is PromiseFulfilledResult<Customer> => r.status === "fulfilled").map((r) => r.value);
    },
  });

  const [lookupId, setLookupId] = useState("");

  const create = useMutation({
    mutationFn: () => api.post<Customer>("customer", "/v1/customers", { party_id: form.party_id, customer_type: form.customer_type, segment: form.segment || undefined }),
    onSuccess: () => { toast.success("Customer created"); setOpen(false); qc.invalidateQueries({ queryKey: ["customers"] }); },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed"),
  });

  const customers = q.data ?? [];

  return (
    <div>
      <SectionHeader title="Customers & Accounts" subtitle="Customer master records, lifecycle state and billing accounts."
        actions={<Button variant="primary" onClick={() => setOpen(true)}>+ New customer</Button>} />

      <Card style={{ padding: 16, marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <Field label="Open customer by ID"><Input className="mono" value={lookupId} onChange={(e) => setLookupId(e.target.value.trim())} placeholder="cc000001-0000-4000-8000-000000000001" /></Field>
        </div>
        <Link href={lookupId ? `/admin/customers/${lookupId}` : "#"} onClick={(e) => { if (!lookupId) e.preventDefault(); }}>
          <Button variant="default" disabled={!lookupId}>Open</Button>
        </Link>
      </Card>

      {q.isError ? <ErrorBanner error={q.error} /> : (
        <Table>
          <thead><tr><Th>Customer ID</Th><Th>Type</Th><Th>Lifecycle</Th><Th>KYC</Th><Th>Party</Th></tr></thead>
          <tbody>
            {q.isLoading ? <LoadingRows cols={5} /> : customers.length === 0 ? (
              <Tr><Td><EmptyState title="No reachable customers" hint="The seeded records weren't reachable. Check the customer-account service." /></Td><Td /><Td /><Td /><Td /></Tr>
            ) : customers.map((c) => {
              const id = c.customer_id || c.id;
              return (
                <Tr key={id} onClick={() => { window.location.href = `/admin/customers/${id}`; }}>
                  <Td><CopyId value={id} /></Td>
                  <Td className="mono" style={{ fontSize: 12 }}>{c.customer_type || "—"}</Td>
                  <Td><StatusBadge status={c.lifecycle_status || c.status} /></Td>
                  <Td><StatusBadge status={c.kyc_status} /></Td>
                  <Td><CopyId value={c.party_id} /></Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New customer"
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="primary" loading={create.isPending} onClick={() => create.mutate()}>Create</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Party ID" hint="UUID of an existing party."><Input className="mono" value={form.party_id} onChange={(e) => setForm({ ...form, party_id: e.target.value })} /></Field>
          <Field label="Customer type">
            <Select value={form.customer_type} onChange={(e) => setForm({ ...form, customer_type: e.target.value })}>
              {["RETAIL", "ENTERPRISE", "WHOLESALE", "PARTNER", "GOVERNMENT"].map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Segment (optional)"><Input value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
