'use client';

/**
 * AI-assisted connector onboarding: paste the carrier's API documentation, read
 * back what the platform believes it describes, confirm the parts that are
 * right.
 *
 * The screen is built around the review, not the analysis. Three things exist
 * purely to keep review honest, and none of them is decoration:
 *
 *   - Nothing is pre-selected. "Select all" exists but starts off, because a
 *     screen that arrives with fifty operations already ticked is a screen where
 *     confirming means nothing.
 *   - Every operation shows the documentation snippet it was read from. A
 *     reviewer checks the claim against the source instead of judging whether an
 *     endpoint looks plausible — which is not a check at all for a provider
 *     nobody on the team has used.
 *   - Effect class is shown, and retryability is shown as derived from it. The
 *     model never asserts that a mutating call is safe to repeat.
 *
 * What lands is UNCERTIFIED capability-matrix entries. Certification still means
 * the operation was exercised against the live provider, and reading a document
 * is not that.
 */

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/admin/platform/client';
import { errMessage } from '@/lib/admin/envelope';
import { XCircle, AlertTriangle, Sparkles, FileText, CheckCircle2, Info } from 'lucide-react';

interface ProposedOperation {
  item_id: string;
  operation_name: string;
  http_method: string;
  path_template: string;
  effect: string;
  is_retryable: boolean;
  description?: string;
  evidence?: string;
  confidence?: string;
  concern?: string;
}

interface Proposal {
  proposal_id: string;
  model: string;
  detected_auth?: string;
  detected_base_url?: string;
  summary?: string;
  operations?: ProposedOperation[];
}

interface ApplyResult {
  registered: string[];
  failed?: Record<string, string>;
}

/** Mirrors the closed vocabulary the analyser must classify into. */
const EFFECT_HELP: Record<string, string> = {
  READ: 'No side effect. This is the only class the platform will retry automatically.',
  MUTATE_REVERSIBLE: 'Changes service state; another call can undo it.',
  MUTATE_IRREVERSIBLE: 'Cannot be undone by a second call.',
  COMMERCIAL: 'Creates a charge, plan change or billing effect.',
  NOTIFY: 'Reaches the subscriber directly. A duplicate is visible to them.',
  CONFIG: 'Changes configuration rather than service state.',
  BATCH_SUBMIT: 'Enqueues work for many subscribers at once.',
};

function effectTone(effect: string): string {
  switch (effect) {
    case 'READ':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'COMMERCIAL':
    case 'MUTATE_IRREVERSIBLE':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'NOTIFY':
    case 'BATCH_SUBMIT':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  }
}

function confidenceTone(c?: string): string {
  if (c === 'HIGH') return 'text-emerald-400';
  if (c === 'LOW') return 'text-amber-400';
  return 'text-slate-500';
}

export default function DocAnalyserModal({
  connectorId,
  connectorName,
  providerName,
  onClose,
  onApplied,
}: {
  connectorId: string;
  connectorName: string;
  providerName: string;
  onClose: () => void;
  onApplied: (message: string) => void;
}) {
  const qc = useQueryClient();

  const [document, setDocument] = useState('');
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplyResult | null>(null);

  const operations = useMemo(() => proposal?.operations ?? [], [proposal]);
  const allSelected = operations.length > 0 && selected.size === operations.length;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const analyse = async () => {
    setBusy(true);
    setError(null);
    try {
      const p = await platformApi.post<Proposal>('integration', `/v1/connectors/${connectorId}/doc-proposals`, {
        document,
      });
      setProposal(p);
      // Deliberately empty: the reviewer opts in per operation.
      setSelected(new Set());
    } catch (e) {
      setError(errMessage(e, 'The documentation could not be analysed.'));
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    if (!proposal || selected.size === 0) return;
    setBusy(true);
    setError(null);
    try {
      const res = await platformApi.post<ApplyResult>('integration', `/v1/doc-proposals/${proposal.proposal_id}/apply`, {
        operation_ids: Array.from(selected),
      });
      setResult(res);
      await qc.invalidateQueries({ queryKey: ['superadmin', 'operations', connectorId] });
      onApplied(`${res.registered.length} operation${res.registered.length === 1 ? '' : 's'} registered, uncertified`);
    } catch (e) {
      setError(errMessage(e, 'The selected operations could not be registered.'));
    } finally {
      setBusy(false);
    }
  };

  const discard = async () => {
    if (!proposal) return;
    setBusy(true);
    try {
      await platformApi.post('integration', `/v1/doc-proposals/${proposal.proposal_id}/discard`, {});
      setProposal(null);
      setSelected(new Set());
      setDocument('');
    } catch (e) {
      setError(errMessage(e, 'The proposal could not be discarded.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-xs animate-in fade-in zoom-in-95">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI-ASSISTED ONBOARDING · PROPOSAL ONLY
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{connectorName}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg transition cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-slate-700">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* ── Result ──────────────────────────────────────────────────────── */}
          {result && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {result.registered.length} operation{result.registered.length === 1 ? '' : 's'} registered
              </div>
              <p className="text-slate-500 leading-relaxed">
                They are in the capability matrix as <span className="font-mono text-slate-800">UNCERTIFIED</span>. Each
                one must still be certified against the live provider before it carries production traffic — reading a
                document is not the same as exercising a gate.
              </p>
              {result.failed && Object.keys(result.failed).length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-amber-800 font-semibold">Not registered:</p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {Object.entries(result.failed).map(([name, reason]) => (
                      <li key={name} className="text-amber-700">
                        <span className="font-mono">{name}</span> — {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={onClose}
                className="self-start px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* ── Paste ───────────────────────────────────────────────────────── */}
          {!proposal && !result && (
            <>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-slate-700 font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400" />
                  Paste the carrier&apos;s API documentation
                </p>
                <p className="text-slate-500 mt-1.5 leading-relaxed">
                  The endpoint reference is what matters — paths, methods, and what each call does. Nothing is
                  registered by analysing: you get a list to review, and you choose what to keep.
                </p>
                <p className="text-slate-500 mt-2 leading-relaxed">
                  This proposes configuration only. The provider adapter — how its error codes are interpreted, what
                  happens when a call times out mid-provisioning, how its state is reconciled against ours — is written
                  and tested by engineers against the live carrier, and is not something a document can settle.
                </p>
              </div>

              <textarea
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                rows={14}
                placeholder={`e.g.\n\nPOST /subscriber/{msisdn}/suspend\nSuspends an active subscriber. Reversible with /restore.\n\nGET /subscriber/{msisdn}/information\nReturns the subscriber's current plan and status.`}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 font-mono text-[11px] leading-relaxed text-slate-800 focus:outline-none focus:border-violet-500 resize-y"
              />

              <div className="flex items-center justify-between">
                <span className="text-slate-500">
                  {document.length.toLocaleString()} characters
                  {document.length > 400_000 && <span className="text-rose-400"> — too large, paste a section</span>}
                </span>
                <button
                  onClick={analyse}
                  disabled={busy || !document.trim() || document.length > 400_000}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-500/10 text-violet-700 border border-violet-500/30 hover:bg-violet-500/20 transition disabled:opacity-40 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {busy ? 'Reading the documentation…' : 'Analyse'}
                </button>
              </div>
            </>
          )}

          {/* ── Review ──────────────────────────────────────────────────────── */}
          {proposal && !result && (
            <>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Read by {proposal.model}
                  </span>
                  <span className="text-slate-500">{operations.length} operations proposed</span>
                </div>
                {proposal.summary && <p className="text-slate-700 leading-relaxed">{proposal.summary}</p>}
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                  {proposal.detected_auth && (
                    <span>
                      Auth described: <span className="font-mono text-slate-800">{proposal.detected_auth}</span>
                    </span>
                  )}
                  {proposal.detected_base_url && (
                    <span>
                      Base URL: <span className="font-mono text-slate-800">{proposal.detected_base_url}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                <span className="leading-relaxed">
                  Check each operation against the quoted documentation before selecting it. Registering an operation
                  adds it to the allowlist this connector may call against {providerName} — an endpoint that reads
                  plausibly but does not exist will fail on first use, and one that exists but was misread can do the
                  wrong thing to a real subscriber.
                </span>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() =>
                      setSelected(allSelected ? new Set() : new Set(operations.map((o) => o.item_id)))
                    }
                    className="accent-violet-500"
                  />
                  <span className="text-slate-500">Select all</span>
                </label>
                <span className="text-slate-500">
                  {selected.size} of {operations.length} selected
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {operations.map((op) => {
                  const isSelected = selected.has(op.item_id);
                  return (
                    <div
                      key={op.item_id}
                      className={`p-4 rounded-2xl border transition ${
                        isSelected ? 'bg-violet-50 border-violet-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggle(op.item_id)}
                          className="mt-1 accent-violet-500 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-slate-900 font-semibold">{op.operation_name}</span>
                            <span className="font-mono text-cyan-700">{op.http_method}</span>
                            <span className="font-mono text-slate-500">{op.path_template}</span>
                          </div>

                          {op.description && <p className="text-slate-500 mt-1.5 leading-relaxed">{op.description}</p>}

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${effectTone(op.effect)}`}
                              title={EFFECT_HELP[op.effect]}
                            >
                              {op.effect}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              retry {op.is_retryable ? 'allowed' : 'not allowed'} — derived from the effect class
                            </span>
                            <span className={`text-[11px] font-mono ${confidenceTone(op.confidence)}`}>
                              {op.confidence} confidence
                            </span>
                          </div>

                          {op.evidence && (
                            <div className="mt-2.5">
                              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                                Quoted from your documentation
                              </div>
                              <pre className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                                {op.evidence}
                              </pre>
                            </div>
                          )}

                          {op.concern && (
                            <div className="mt-2 flex items-start gap-2 text-amber-700">
                              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span className="leading-relaxed">{op.concern}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {operations.length === 0 && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                    No operations could be read from this document with evidence to support them. Paste the endpoint
                    reference section rather than an overview page.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {proposal && !result && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
            <button
              onClick={discard}
              disabled={busy}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 transition disabled:opacity-50 cursor-pointer"
            >
              Discard this proposal
            </button>
            <button
              onClick={apply}
              disabled={busy || selected.size === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/20 transition disabled:opacity-40 cursor-pointer"
            >
              {busy
                ? 'Registering…'
                : `Register ${selected.size} selected operation${selected.size === 1 ? '' : 's'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
