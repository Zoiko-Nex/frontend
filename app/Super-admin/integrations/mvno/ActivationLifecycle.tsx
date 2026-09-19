'use client';

/**
 * Maker–checker activation for a carrier connector (ED-2026-08 §10).
 *
 * The console could already flip a connector to ACTIVE with one click, by
 * calling POST /v1/connectors/{id}/activate — which performs no qualification
 * and collects no approvals. The governed six-stage path existed in the backend
 * and had no UI at all, so in practice the control was optional, which is the
 * same as absent.
 *
 * This screen is that path:
 *
 *   1. maker        POST /v1/connectors/{id}/activation-requests
 *   2. qualification POST /v1/activations/{id}/qualification   (automated suite)
 *   3–5. approvals   POST /v1/activations/{id}/approvals       (one per role)
 *   6. checker      POST /v1/activations/{id}/activate
 *
 * The backend refuses stage 6 if the caller is the maker or any approver, if
 * qualification has not passed, or if a mandatory approval is missing. Nothing
 * here re-implements those rules — the UI only shows where a request stands and
 * which move is available next, so an operator is never guessing what the gate
 * wants.
 */

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage } from '@/lib/admin/envelope';
import { XCircle, ShieldCheck, CheckCircle2, AlertTriangle, Clock, UserCheck } from 'lucide-react';

export interface Approval {
  approval_id: string;
  activation_id: string;
  role: string;
  decision: string;
  approver_identity?: string;
  note?: string;
  decided_at?: string;
}

export interface Activation {
  activation_id: string;
  connector_id: string;
  environment: string;
  maker_identity: string;
  maker_at: string;
  adapter_version?: string;
  qualification_status: string;
  qualification_suite?: string;
  qualification_digest?: string;
  qualification_at?: string;
  approvals_complete: boolean;
  checker_identity?: string;
  checked_at?: string;
  state: string;
  reject_reason?: string;
  approvals?: Approval[];
}

interface ActivationsResponse {
  activations?: Activation[];
  /** Roles this connector's §4.1 topology makes mandatory — computed server-side. */
  required_approvals?: string[];
}

/** Terminal states offer no further moves. */
const TERMINAL = new Set(['ACTIVATED', 'REJECTED', 'WITHDRAWN']);

function StateChip({ state }: { state: string }) {
  const tone =
    state === 'ACTIVATED'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : state === 'APPROVED'
      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
      : state === 'QUALIFIED'
      ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      : state === 'REJECTED' || state === 'WITHDRAWN'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${tone}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {state}
    </span>
  );
}

export default function ActivationLifecycleModal({
  connectorId,
  connectorName,
  onClose,
  onChanged,
}: {
  connectorId: string;
  connectorName: string;
  onClose: () => void;
  onChanged: (message: string) => void;
}) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [environment, setEnvironment] = useState<'SANDBOX' | 'PRODUCTION'>('SANDBOX');
  const [adapterVersion, setAdapterVersion] = useState('');
  const [approvalNote, setApprovalNote] = useState('');

  const activationsQ = useQuery({
    queryKey: ['superadmin', 'activations', connectorId],
    queryFn: () =>
      platformApi.get<ActivationsResponse>('integration', `/v1/connectors/${connectorId}/activation-requests`),
  });

  const activations = activationsQ.data?.activations ?? [];
  const requiredApprovals = activationsQ.data?.required_approvals ?? [];

  // The open request is the one an operator can still act on. Older terminal
  // requests stay visible as history rather than being hidden, because a
  // rejected attempt is part of the audit story.
  const open = activations.find((a) => !TERMINAL.has(a.state));
  const history = activations.filter((a) => a !== open);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await qc.invalidateQueries({ queryKey: ['superadmin', 'activations', connectorId] });
      await qc.invalidateQueries({ queryKey: ['superadmin', 'connectors'] });
      onChanged(label);
    } catch (e) {
      // Surfaced in the panel rather than as a toast: these are governance
      // refusals ("you are the maker", "qualification has not passed") that the
      // operator needs to read and act on, not a transient failure.
      setError(errMessage(e, label + ' failed'));
    } finally {
      setBusy(false);
    }
  };

  const requestActivation = () =>
    run('Activation requested', () =>
      platformApi.post('integration', `/v1/connectors/${connectorId}/activation-requests`, {
        environment,
        adapter_version: adapterVersion.trim() || undefined,
      }),
    );

  const approve = (role: string, decision: 'APPROVED' | 'REJECTED') =>
    run(`${role} ${decision === 'APPROVED' ? 'approved' : 'rejected'}`, () =>
      platformApi.post('integration', `/v1/activations/${open!.activation_id}/approvals`, {
        role,
        decision,
        note: approvalNote.trim() || undefined,
      }),
    );

  const activate = () =>
    run('Connector activated', () =>
      platformApi.post('integration', `/v1/activations/${open!.activation_id}/activate`, {}),
    );

  const decisionFor = (role: string): Approval | undefined =>
    open?.approvals?.find((a) => a.role === role);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              MAKER–CHECKER ACTIVATION · ED-2026-08 §10
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{connectorName}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-slate-700">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {activationsQ.isLoading && <p className="text-slate-500">Loading activation history…</p>}

          {/* ── No open request: stage 1, the maker ─────────────────────────── */}
          {!activationsQ.isLoading && !open && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Request activation</h4>
                <p className="text-slate-500 mt-1 leading-relaxed">
                  Stage 1 of 6. A production request is refused unless the connector&apos;s commercial topology is
                  complete, because the approver set is computed from those exact attributes — an incomplete topology
                  would silently shorten the approval list.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Environment</span>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as 'SANDBOX' | 'PRODUCTION')}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SANDBOX">SANDBOX</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Adapter version <span className="text-slate-400">(optional)</span>
                  </span>
                  <input
                    value={adapterVersion}
                    onChange={(e) => setAdapterVersion(e.target.value)}
                    placeholder="e.g. nexus-v1.4.0"
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </label>
              </div>

              {requiredApprovals.length > 0 && (
                <div className="text-[11px] text-slate-500">
                  Approvals this connector will need:{' '}
                  <span className="font-mono text-cyan-700">{requiredApprovals.join(' · ')}</span>
                </div>
              )}

              <button
                onClick={requestActivation}
                disabled={busy}
                className="self-start px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-700 border border-cyan-500/30 hover:bg-cyan-500/20 transition disabled:opacity-50 cursor-pointer"
              >
                {busy ? 'Working…' : 'Request activation'}
              </button>
            </div>
          )}

          {/* ── Open request: stages 2–6 ────────────────────────────────────── */}
          {open && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Open request</div>
                  <div className="font-mono text-slate-700 mt-0.5">{open.activation_id}</div>
                </div>
                <StateChip state={open.state} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['Environment', open.environment],
                  ['Maker', open.maker_identity],
                  ['Adapter', open.adapter_version || '—'],
                  ['Qualification', open.qualification_status],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{k}</div>
                    <div className="mt-1 font-mono text-slate-800 truncate" title={String(v)}>
                      {v}
                    </div>
                  </div>
                ))}
              </div>

              {/* Stage 2 — qualification is an automated gate, not a human claim. */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  {open.qualification_status === 'PASSED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : open.qualification_status === 'FAILED' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900">Stage 2 · Qualification</h4>
                </div>
                <p className="text-slate-500 mt-1.5 leading-relaxed">
                  Recorded by the qualification service, not by an operator — a person asserting &quot;the tests
                  passed&quot; is exactly what this stage exists to replace. It is driven by the contract suite against
                  the provider fixture corpus.
                </p>
                {open.qualification_suite && (
                  <div className="mt-2 font-mono text-[11px] text-slate-500">
                    {open.qualification_suite}
                    {open.qualification_digest ? ` · ${open.qualification_digest.slice(0, 16)}…` : ''}
                  </div>
                )}
              </div>

              {/* Stages 3–5 — one decision per required role. */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  Stages 3–5 · Approvals
                </h4>

                {requiredApprovals.length === 0 && (
                  <p className="text-slate-500">No approval roles are required for this connector.</p>
                )}

                <div className="flex flex-col gap-2">
                  {requiredApprovals.map((role) => {
                    const decision = decisionFor(role);
                    return (
                      <div
                        key={role}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-slate-800">{role}</div>
                          {decision ? (
                            <div className="text-[11px] text-slate-500 truncate">
                              {decision.decision} · {decision.approver_identity || 'unknown'}
                              {decision.note ? ` — ${decision.note}` : ''}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-400">Awaiting decision</div>
                          )}
                        </div>

                        {decision ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border ${
                              decision.decision === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {decision.decision}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => approve(role, 'APPROVED')}
                              disabled={busy}
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-950/40 text-emerald-700 border border-emerald-800/40 hover:bg-emerald-900/60 transition disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => approve(role, 'REJECTED')}
                              disabled={busy}
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-950/40 text-rose-600 border border-rose-800/40 hover:bg-rose-900/60 transition disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <input
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Note attached to your next decision (optional)"
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Stage 6 — the checker. */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Stage 6 · Activate
                </h4>
                <p className="text-slate-500 mt-1.5 leading-relaxed">
                  The only governed path that makes a connector live. The backend refuses this if you are the maker or
                  any approver, if qualification has not passed, or if a mandatory approval is missing — so a refusal
                  here is the control working, not a bug.
                </p>
                <button
                  onClick={activate}
                  disabled={busy}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {busy ? 'Working…' : 'Activate connector'}
                </button>
              </div>
            </div>
          )}

          {/* ── History ─────────────────────────────────────────────────────── */}
          {history.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Earlier requests</div>
              {history.map((a) => (
                <div
                  key={a.activation_id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-slate-700 truncate">{a.activation_id}</div>
                    <div className="text-[11px] text-slate-500">
                      {a.environment} · maker {a.maker_identity}
                      {a.reject_reason ? ` · ${a.reject_reason}` : ''}
                    </div>
                  </div>
                  <StateChip state={a.state} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
