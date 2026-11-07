"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { errMessage } from "@/lib/admin/envelope";
import { integrationApi, integrationKeys, type Connector, type Operation } from "@/lib/admin/integration";
import { Modal, StatusChip, TableState } from "../console";
import DocAnalyserModal from "../mvno/DocAnalyser";

/** The one forward step each certification state allows (§11.1). */
function nextStep(op: Operation): "SANDBOX_PASSED" | "CERTIFIED" | null {
  switch (op.certification_status) {
    case "UNCERTIFIED":
      return "SANDBOX_PASSED";
    case "SANDBOX_PASSED":
      return "CERTIFIED";
    default:
      return null;
  }
}

/**
 * Step 5 — the operations this connector may call. The list is an allowlist:
 * nothing absent from it can be invoked. Reads are certified first.
 */
export function OperationsPanel({ tenant, connector }: { tenant: string; connector: Connector }) {
  const qc = useQueryClient();
  const key = integrationKeys.part(tenant, connector.connector_id, "operations");
  const ops = useQuery({ queryKey: key, queryFn: () => integrationApi.listOperations(tenant, connector.connector_id) });
  const [revoke, setRevoke] = useState<Operation | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: integrationKeys.part(tenant, connector.connector_id, "readiness") });
  };

  const seed = useMutation({
    mutationFn: () => integrationApi.seedOperations(tenant, connector.connector_id),
    onSuccess: (r) => {
      if (r.status === "PARTIAL") toast.warning(`Catalogue partly registered: ${r.error ?? "some operations failed"}`);
      else toast.success("Provider catalogue registered — every operation starts UNCERTIFIED");
      invalidate();
    },
    onError: (e) => toast.error(errMessage(e, "Could not register the catalogue")),
  });
  const certify = useMutation({
    mutationFn: ({ op, status }: { op: Operation; status: "SANDBOX_PASSED" | "CERTIFIED" | "REVOKED" }) =>
      integrationApi.certifyOperation(tenant, op.operation_id, status),
    onSuccess: (_r, v) => { toast.success(`${v.op.operation_name}: ${v.status}`); setRevoke(null); invalidate(); },
    onError: (e) => toast.error(errMessage(e, "Certification refused")),
  });

  const rows = ops.data ?? [];
  const certified = rows.filter((o) => o.certification_status === "CERTIFIED").length;

  return (
    <div className="panel">
      <h3>Operations <span className="chip c-grey">{certified}/{rows.length} certified</span></h3>
      <p className="psub" style={{ margin: "4px 0 10px" }}>
        An operation is callable only once registered; in production only once certified. Certify read-only operations first —
        they cannot change a subscriber.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button type="button" className="btn btn-primary btn-sm" disabled={seed.isPending} onClick={() => seed.mutate()}>
          {seed.isPending ? "Registering…" : "Register provider catalogue"}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDocsOpen(true)}>Propose from provider docs…</button>
      </div>
      <div className="tablewrap" style={{ maxHeight: 420, overflow: "auto" }}>
        <table>
          <thead><tr><th>Operation</th><th>Call</th><th>Kind</th><th>Certification</th><th /></tr></thead>
          <tbody>
            <TableState colSpan={5} loading={ops.isLoading} error={ops.error} empty={rows.length === 0}
              emptyLabel="No operations registered — nothing can be called." />
            {rows.map((op) => {
              const next = nextStep(op);
              return (
                <tr key={op.operation_id}>
                  <td className="strong mono" style={{ fontSize: 12 }}>{op.operation_name}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{op.http_method} {op.path_template}</td>
                  <td>{op.is_retryable ? <span className="chip c-green">read</span> : <span className="chip c-amber">write</span>}</td>
                  <td><StatusChip status={op.certification_status} />{op.certified_by && <div style={{ fontSize: 10, opacity: 0.6 }}>{op.certified_by}</div>}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    {next && (
                      <button type="button" className="btn btn-ghost btn-sm" disabled={certify.isPending} onClick={() => certify.mutate({ op, status: next })}>
                        {next === "SANDBOX_PASSED" ? "Mark UAT passed" : "Certify"}
                      </button>
                    )}
                    {op.certification_status !== "REVOKED" && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRevoke(op)}>Revoke</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {revoke && (
        <Modal title={`Revoke ${revoke.operation_name}`} subtitle="It stops being callable in every state, immediately." onClose={() => setRevoke(null)}
          footer={<button type="button" className="btn btn-danger" disabled={certify.isPending} onClick={() => certify.mutate({ op: revoke, status: "REVOKED" })}>Revoke</button>}>
          <p style={{ fontSize: 13 }}>Revocation is the emergency stop for one operation. Re-enabling it means registering and certifying it again.</p>
        </Modal>
      )}
      {docsOpen && (
        <DocAnalyserModal
          tenant={tenant}
          connectorId={connector.connector_id}
          connectorName={connector.connector_name}
          providerName={connector.provider_name}
          onClose={() => setDocsOpen(false)}
          onApplied={(msg) => { toast.success(msg); invalidate(); }}
        />
      )}
    </div>
  );
}
