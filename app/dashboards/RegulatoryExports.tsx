"use client";

/**
 * Reporting & Regulatory console — reporting-regulatory service (8098).
 *
 * Regulatory exports: the signed, reproducible artefacts handed to a regulator,
 * and the record of when they were submitted and acknowledged.
 *
 * Two things make this service different from every other console here:
 *
 *   1. **Header convention.** reporting-regulatory is the platform's only
 *      `tenant-brand-idem` service — it needs `X-Tenant-ID`, `X-Brand-ID` AND
 *      an `Idempotency-Key` on mutations. The client injects the first two from
 *      the session (lib/admin/services.ts `headerStyle`); the third is passed
 *      per call below. A missing brand on the session is the likely cause of a
 *      400 here, so the screen says so rather than showing a bare error.
 *
 *   2. **Marking READY is a claim about a signature.** The transition carries a
 *      storage ref, a signing key id and the signature itself — the export is
 *      only reproducible and verifiable if those are real. The form treats them
 *      as required, because an export marked ready without them is an audit
 *      finding waiting to happen (P2-6).
 *
 * Exports are Class A. Nothing here edits one; a bad export is failed and a new
 * one generated.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import { EXPORT_TRANSITIONS } from "@/lib/admin/transitions";
import { getSession } from "@/lib/admin/session";
import {
  DetailToggle,
  Field,
  Modal,
  ModalActions,
  RecordDetail,
  StatusPill,
  TableState,
  TransitionButtons,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";
import { JurisdictionSelect } from "./CodeFields";

interface RegulatoryExport {
  export_id: string;
  jurisdiction_code: string;
  export_type: string;
  report_period: string;
  status: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

const EXPORT_TYPES = [
  "REVENUE_REPORT",
  "TAX_FILING",
  "LAWFUL_INTERCEPT",
  "NUMBER_INVENTORY",
  "SUBSCRIBER_CENSUS",
  "INTERCONNECT_TRAFFIC",
  "QOS_REPORT",
];

function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7);
}

export default function RegulatoryExports() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"all" | "open">("open");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [action, setAction] = useState<{ item: RegulatoryExport; action: string } | null>(null);

  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));
  const refresh = () => qc.invalidateQueries({ queryKey: ["reporting"] });

  // The brand is part of this service's required header set, so a session
  // without one will 400 on every call. Surfaced up front rather than as a
  // per-request error the operator has to decode.
  const brandId = typeof window === "undefined" ? undefined : getSession()?.brandId;

  const exportsQ = useQuery({
    queryKey: ["reporting", "exports"],
    queryFn: async () => listOf<RegulatoryExport>(await api.get("reporting", "/v1/exports?limit=100"), ENVELOPE.exports),
  });
  const allExports = exportsQ.data ?? [];

  const OPEN_STATES = new Set(["GENERATING", "READY", "SUBMITTED"]);
  const rows = tab === "open" ? allExports.filter((e) => OPEN_STATES.has(e.status)) : allExports;

  // ─── Forms ──────────────────────────────────────────────────────────────────

  const [form, setForm] = useState({
    jurisdiction_code: "GB",
    export_type: EXPORT_TYPES[0],
    report_period: currentPeriod(),
    data_residency_region: "eu-west-2",
    source_ids: "[]",
  });
  const [sourceError, setSourceError] = useState<string | null>(null);

  const [readyForm, setReadyForm] = useState({
    storage_ref: "",
    signing_key_id: "",
    signature: "",
    evidence_id: "",
    policy_version_id: "",
  });

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const createExport = useMutation({
    mutationFn: () => {
      let sourceIds: unknown;
      try {
        sourceIds = JSON.parse(form.source_ids);
      } catch (err) {
        throw new Error(`source_ids is not valid JSON: ${(err as Error).message}`);
      }
      return api.post(
        "reporting",
        "/v1/exports",
        {
          jurisdiction_code: form.jurisdiction_code,
          export_type: form.export_type,
          report_period: form.report_period,
          data_residency_region: form.data_residency_region,
          source_ids: sourceIds,
        },
        // Mandatory on this service — it is tenant-brand-idem.
        { idempotencyKey: api.uuid() },
      );
    },
    onSuccess: () => { toast.success("Export requested — it enters GENERATING"); setCreateOpen(false); refresh(); },
    onError: fail("Could not request the export"),
  });

  const transition = useMutation({
    mutationFn: ({ item, action: act }: { item: RegulatoryExport; action: string }) => {
      const base = `/v1/exports/${item.export_id}`;
      const idem = { idempotencyKey: api.uuid() };
      switch (act) {
        case "READY":
          return api.post("reporting", `${base}/ready`, readyForm, idem);
        case "SUBMIT":
          return api.post("reporting", `${base}/submit`, {}, idem);
        case "ACKNOWLEDGE":
          return api.post("reporting", `${base}/acknowledge`, {}, idem);
        case "FAIL":
          return api.post("reporting", `${base}/fail`, {}, idem);
        default:
          return Promise.reject(new Error(`Unmapped action ${act}`));
      }
    },
    onSuccess: (_r, v) => {
      toast.success(`Export ${v.action.toLowerCase()}`);
      setAction(null);
      setReadyForm({ storage_ref: "", signing_key_id: "", signature: "", evidence_id: "", policy_version_id: "" });
      refresh();
    },
    onError: fail("The export transition was rejected"),
  });

  // ─── Derived ────────────────────────────────────────────────────────────────

  const byStatus = allExports.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});
  const jurisdictions = new Set(allExports.map((e) => e.jurisdiction_code)).size;

  /** Only READY carries a body the operator must supply. */
  const NEEDS_INPUT = new Set(["READY"]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Reporting &amp; Regulatory
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Signed, reproducible regulatory exports. An export is never edited — a bad one is failed and regenerated.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          + Request Export
        </button>
      </div>

      {/* This service is the only tenant-brand-idem one; without a brand on the
          session every call 400s, which is worth saying before it happens. */}
      {!brandId && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-xs text-amber-800">
          <strong>No brand on this session.</strong> Reporting &amp; Regulatory requires{" "}
          <span className="font-mono">X-Tenant-ID</span> and <span className="font-mono">X-Brand-ID</span> on every
          request — it is the only service that does. Calls below will be rejected until a brand is selected.
        </div>
      )}

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile label="GENERATING" value={exportsQ.isLoading ? "…" : String(byStatus.GENERATING ?? 0)} hint="Artefact being built" />
        <SummaryTile label="READY TO SUBMIT" value={exportsQ.isLoading ? "…" : String(byStatus.READY ?? 0)} hint="Signed, awaiting filing" />
        <SummaryTile
          label="AWAITING ACK"
          value={exportsQ.isLoading ? "…" : String(byStatus.SUBMITTED ?? 0)}
          hint={(byStatus.SUBMITTED ?? 0) > 0 ? "Filed, no receipt yet" : "None outstanding"}
        />
        <SummaryTile
          label="FAILED"
          value={exportsQ.isLoading ? "…" : String(byStatus.FAILED ?? 0)}
          hint={`${jurisdictions} jurisdiction(s)`}
        />
      </div>

      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={tab === "open"} onClick={() => setTab("open")} label={`In Flight (${allExports.filter((e) => OPEN_STATES.has(e.status)).length})`} />
        <SubTab active={tab === "all"} onClick={() => setTab("all")} label={`All Exports (${allExports.length})`} />
      </div>

      <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">EXPORT</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBMITTED</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <TableState
                colSpan={7}
                loading={exportsQ.isLoading}
                error={exportsQ.error}
                empty={rows.length === 0}
                loadingLabel="Loading regulatory exports…"
                emptyLabel={tab === "open" ? "Nothing in flight — every export is acknowledged or failed." : "No regulatory exports requested."}
              />
              {rows.map((e) => (
                <tr key={e.export_id} className="hover:bg-slate-50/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-mono text-[11px] text-slate-700">{shortId(e.export_id)}</div>
                    <DetailToggle open={expanded === e.export_id} onToggle={() => setExpanded(expanded === e.export_id ? null : e.export_id)} />
                    {expanded === e.export_id && (
                      <RecordDetail service="reporting" path={`/v1/exports/${e.export_id}`} queryKey={["reporting", "export", e.export_id]} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">{e.export_type}</td>
                  <td className="px-6 py-4 font-mono text-xs">{e.jurisdiction_code}</td>
                  <td className="px-6 py-4 font-mono text-xs">{e.report_period}</td>
                  <td className="px-6 py-4 text-[11px] text-slate-500">
                    {e.submitted_at ? new Date(e.submitted_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-6 py-4"><StatusPill status={e.status} /></td>
                  <td className="px-6 py-4">
                    <TransitionButtons
                      table={EXPORT_TRANSITIONS}
                      status={e.status}
                      pending={transition.isPending}
                      onAction={(act) =>
                        NEEDS_INPUT.has(act) ? setAction({ item: e, action: act }) : transition.mutate({ item: e, action: act })
                      }
                      className="justify-end"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Request export ───────────────────────────────────────────────── */}
      {createOpen && (
        <Modal
          title="Request a regulatory export"
          subtitle="Enters GENERATING. The artefact is signed before it can be marked ready."
          width="w-[560px]"
          onClose={() => setCreateOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setCreateOpen(false)}
              onConfirm={() => createExport.mutate()}
              confirmLabel="Request export"
              pendingLabel="Requesting…"
              pending={createExport.isPending}
              disabled={!form.jurisdiction_code || !form.report_period || !!sourceError}
            />
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Export type">
              <select className={inputClass} value={form.export_type} onChange={(e) => setForm({ ...form, export_type: e.target.value })}>
                {EXPORT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Jurisdiction code">
              <JurisdictionSelect
                value={form.jurisdiction_code}
                onChange={(v) => setForm({ ...form, jurisdiction_code: v })}
                className={inputMonoClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Report period">
              <input type="month" className={inputClass} value={form.report_period} onChange={(e) => setForm({ ...form, report_period: e.target.value })} />
            </Field>
            <Field label="Data residency region" hint="Must match where the source data lives (P0-1).">
              <input className={inputMonoClass} value={form.data_residency_region} onChange={(e) => setForm({ ...form, data_residency_region: e.target.value })} />
            </Field>
          </div>
          <Field
            label="Source IDs (JSON)"
            hint="The records this export is built from. Kept as raw JSON because the shape differs per export type."
          >
            <textarea
              className={`${inputMonoClass} h-28 resize-y`}
              value={form.source_ids}
              onChange={(e) => {
                setForm({ ...form, source_ids: e.target.value });
                try { JSON.parse(e.target.value); setSourceError(null); } catch (err) { setSourceError((err as Error).message); }
              }}
            />
          </Field>
          {sourceError && <p className="text-[11px] text-rose-600 -mt-2">Invalid JSON: {sourceError}</p>}
        </Modal>
      )}

      {/* ─── Mark ready ───────────────────────────────────────────────────── */}
      {action && (
        <Modal
          title="Mark export ready"
          subtitle={`${action.item.export_type} · ${action.item.jurisdiction_code} · ${action.item.report_period}`}
          width="w-[560px]"
          onClose={() => setAction(null)}
          footer={
            <ModalActions
              onCancel={() => setAction(null)}
              onConfirm={() => transition.mutate({ item: action.item, action: action.action })}
              confirmLabel="Mark ready"
              pendingLabel="Working…"
              pending={transition.isPending}
              disabled={!readyForm.storage_ref.trim() || !readyForm.signing_key_id.trim() || !readyForm.signature.trim()}
            />
          }
        >
          <p className="text-[11px] text-slate-500 -mt-1">
            Marking an export ready asserts the artefact exists, is stored, and is signed. Without a real storage
            reference and signature it cannot be reproduced or verified later — which is the whole point of a
            regulatory export.
          </p>
          <Field label="Storage reference" hint="Where the signed artefact lives.">
            <input className={inputMonoClass} value={readyForm.storage_ref} onChange={(e) => setReadyForm({ ...readyForm, storage_ref: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Signing key ID" hint="KMS/HSM key that signed it.">
              <input className={inputMonoClass} value={readyForm.signing_key_id} onChange={(e) => setReadyForm({ ...readyForm, signing_key_id: e.target.value })} />
            </Field>
            <Field label="Signature">
              <input className={inputMonoClass} value={readyForm.signature} onChange={(e) => setReadyForm({ ...readyForm, signature: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Evidence ID" hint="Optional — the evidence-ledger anchor.">
              <input className={inputMonoClass} value={readyForm.evidence_id} onChange={(e) => setReadyForm({ ...readyForm, evidence_id: e.target.value })} />
            </Field>
            <Field label="Policy version ID" hint="Optional — the policy the export was built under.">
              <input className={inputMonoClass} value={readyForm.policy_version_id} onChange={(e) => setReadyForm({ ...readyForm, policy_version_id: e.target.value })} />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
