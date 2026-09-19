'use client';

/**
 * The connector's capability matrix — the allowlist of provider operations the
 * adapter is permitted to call (INT-ARC-012, gate G1).
 *
 * This is the registry an adapter is checked against at call time: naming an
 * operation in adapter code says only which operation it needs, while
 * registering it here is what authorises the call and maps it to a method and
 * path. An adapter therefore cannot reach an endpoint that is not in this list,
 * which is why it needs to be visible and manageable rather than seeded once by
 * a script and never looked at again.
 *
 *   POST   /v1/connectors/{id}/operations/seed   register the adapter's catalogue
 *   GET    /v1/connectors/{id}/operations        read the matrix
 *   POST   /v1/operations/{id}/certify           move one operation's gate state
 *   DELETE /v1/operations/{id}                   remove one
 *
 * Seeding registers everything UNCERTIFIED and certifies nothing, deliberately:
 * certification means a gate was exercised against the provider, and seeding
 * exercises nothing.
 */

import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage } from '@/lib/admin/envelope';
import { XCircle, AlertTriangle, Cpu, Trash2, Search } from 'lucide-react';

export interface ConnectorOperation {
  operation_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  is_retryable: boolean;
  certification_status: string;
  certified_by?: string;
  certified_at?: string;
  description?: string;
  timeout_ms?: number;
}

/**
 * v2.2 §11 requires a sandbox gate before production, and CERTIFIED is the only
 * state that satisfies it. The order here is the progression an operation makes.
 */
const CERT_STATES = ['UNCERTIFIED', 'SANDBOX_PASSED', 'CERTIFIED', 'REVOKED'] as const;

function certTone(status: string): string {
  switch (status) {
    case 'CERTIFIED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'SANDBOX_PASSED':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    case 'REVOKED':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-100 text-slate-500 border-slate-300';
  }
}

export default function OperationsCatalogueModal({
  connectorId,
  connectorName,
  providerName,
  onClose,
  onChanged,
}: {
  connectorId: string;
  connectorName: string;
  providerName: string;
  onClose: () => void;
  onChanged: (message: string) => void;
}) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const opsQ = useQuery({
    queryKey: ['superadmin', 'operations', connectorId],
    queryFn: async () => {
      const res = await platformApi.get<{ operations?: ConnectorOperation[] }>(
        'integration',
        `/v1/connectors/${connectorId}/operations`,
      );
      return res.operations ?? [];
    },
  });

  const operations = opsQ.data ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return operations;
    return operations.filter(
      (o) =>
        o.operation_name.toLowerCase().includes(q) ||
        o.path_template.toLowerCase().includes(q) ||
        o.http_method.toLowerCase().includes(q),
    );
  }, [operations, search]);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const o of operations) out[o.certification_status] = (out[o.certification_status] ?? 0) + 1;
    return out;
  }, [operations]);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await qc.invalidateQueries({ queryKey: ['superadmin', 'operations', connectorId] });
      onChanged(label);
    } catch (e) {
      setError(errMessage(e, `${label} failed`));
    } finally {
      setBusy(false);
    }
  };

  const seed = () =>
    run('Capability matrix seeded', () =>
      platformApi.post('integration', `/v1/connectors/${connectorId}/operations/seed`, {}),
    );

  const certify = (op: ConnectorOperation, status: string) =>
    run(`${op.operation_name} → ${status}`, () =>
      platformApi.post('integration', `/v1/operations/${op.operation_id}/certify`, { status }),
    );

  const remove = (op: ConnectorOperation) =>
    run(`${op.operation_name} removed`, () =>
      platformApi.del('integration', `/v1/operations/${op.operation_id}`),
    );

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              CAPABILITY MATRIX · INT-ARC-012 · GATE G1
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{connectorName}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center gap-3 bg-slate-50">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, method or path"
              className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            {CERT_STATES.filter((s) => counts[s]).map((s) => (
              <span key={s} className={`px-2 py-1 rounded-full border ${certTone(s)}`}>
                {counts[s]} {s}
              </span>
            ))}
          </div>

          <button
            onClick={seed}
            disabled={busy}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-700 border border-cyan-500/30 hover:bg-cyan-500/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            title="Register every operation the adapter can call, all UNCERTIFIED"
          >
            <Cpu className="w-3.5 h-3.5" />
            {busy ? 'Working…' : 'Seed from adapter'}
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-700">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {opsQ.isLoading && <p className="text-slate-500">Loading capability matrix…</p>}

          {!opsQ.isLoading && operations.length === 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-slate-700 font-semibold">No operations are registered.</p>
              <p className="text-slate-500 mt-1.5 leading-relaxed max-w-lg mx-auto">
                Until the matrix is populated, every call this adapter attempts is refused as an unregistered
                operation. Seed it from the <span className="font-mono text-cyan-700">{providerName}</span> adapter
                catalogue — that registers everything as UNCERTIFIED, which authorises nothing on its own.
              </p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-200">
                    <th className="py-2.5 pr-3">Operation</th>
                    <th className="py-2.5 pr-3">Method</th>
                    <th className="py-2.5 pr-3">Path template</th>
                    <th className="py-2.5 pr-3">Retryable</th>
                    <th className="py-2.5 pr-3">Gate</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((op) => (
                    <tr key={op.operation_id} className="border-b border-slate-200 hover:bg-white/40">
                      <td className="py-3 pr-3">
                        <div className="font-mono text-slate-800">{op.operation_name}</div>
                        {op.description && (
                          <div className="text-[11px] text-slate-500 max-w-xs truncate" title={op.description}>
                            {op.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-3 font-mono text-cyan-700">{op.http_method}</td>
                      <td className="py-3 pr-3 font-mono text-slate-500 max-w-[220px] truncate" title={op.path_template}>
                        {op.path_template}
                      </td>
                      <td className="py-3 pr-3">
                        {/* Retryability is derived from the operation's effect class,
                            not chosen per call site — it decides whether a timed-out
                            call may be repeated. */}
                        <span className={op.is_retryable ? 'text-emerald-400' : 'text-amber-400'}>
                          {op.is_retryable ? 'yes' : 'no'}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-[11px] font-mono font-bold border ${certTone(
                            op.certification_status,
                          )}`}
                        >
                          {op.certification_status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={op.certification_status}
                            disabled={busy}
                            onChange={(e) => certify(op, e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
                            title="Move this operation's certification state"
                          >
                            {CERT_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => remove(op)}
                            disabled={busy}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-800/40 transition disabled:opacity-50 cursor-pointer"
                            title="Remove from the allowlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!opsQ.isLoading && operations.length > 0 && filtered.length === 0 && (
            <p className="text-slate-500 text-center py-6">No operation matches that filter.</p>
          )}
        </div>
      </div>
    </div>
  );
}
