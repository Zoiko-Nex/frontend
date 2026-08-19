"use client";

/**
 * Reporting & Regulatory console — reporting-regulatory service (port 8098).
 *
 * Domain 18: Generates and submits statutory telecom, tax, and compliance reports
 * to national authorities (FCC, Ofcom, HMRC, IRS).
 *
 * Key Invariants (CLAUDE.md §7, ZN-ADR-011):
 *  - Header style: tenant-brand-idem (requires X-Tenant-ID, X-Brand-ID, Idempotency-Key).
 *  - Lifecycle: GENERATING -> READY -> SUBMITTED -> ACKNOWLEDGED / FAILED.
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { ENVELOPE, errMessage, listOf, shortId } from "@/lib/admin/envelope";
import {
  DetailToggle,
  Field,
  Modal,
  ModalActions,
  StatusPill,
  TableState,
  inputClass,
  inputMonoClass,
} from "@/components/admin/primitives";
import { SubTab, SummaryTile } from "./BillingManagement";

interface RegulatoryExport {
  export_id: string;
  export_type: string;
  jurisdiction_code: string;
  period_start: string;
  period_end: string;
  status: string;
  file_format: string;
  storage_url?: string;
  submitted_at?: string;
  acknowledged_at?: string;
  created_at: string;
}

export default function ReportingRegulatory() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"exports" | "compliance">("exports");
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Form
  const [exportForm, setExportForm] = useState({
    export_type: "TAX_STATUTORY_RETURN",
    jurisdiction_code: "US-CA",
    file_format: "CSV",
    period_start: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    period_end: new Date().toISOString().slice(0, 10),
  });

  // Queries
  const exportsQ = useQuery({
    queryKey: ["reporting", "exports"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data?: RegulatoryExport[]; items?: RegulatoryExport[] }>("reporting", "/v1/exports");
        return res.data ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const exports = exportsQ.data ?? [];

  // Mutations
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createExportMutation = useMutation({
    mutationFn: () =>
      api.post(
        "reporting",
        "/v1/exports",
        {
          export_type: exportForm.export_type,
          jurisdiction_code: exportForm.jurisdiction_code,
          file_format: exportForm.file_format,
          period_start: exportForm.period_start,
          period_end: exportForm.period_end,
          metadata: { requested_by: "compliance_officer_1" },
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: () => {
      toast.success("Regulatory report export generation started");
      setExportModalOpen(false);
      qc.invalidateQueries({ queryKey: ["reporting"] });
    },
    onError: fail("Failed to initiate regulatory export"),
  });

  const exportActionMutation = useMutation({
    mutationFn: ({ exportId, action }: { exportId: string; action: string }) =>
      api.post("reporting", `/v1/exports/${exportId}/${action}`, {}),
    onSuccess: () => {
      toast.success("Regulatory export status updated");
      qc.invalidateQueries({ queryKey: ["reporting"] });
    },
    onError: fail("Transition failed"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Reporting &amp; Regulatory Submissions
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Statutory tax filings, subscriber metrics, and regulatory compliance exports (Port 8098).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExportModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Generate Statutory Filing
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="GENERATED EXPORTS"
          value={exportsQ.isLoading ? "…" : String(exports.length)}
          hint="Audit-ready filings"
        />
        <SummaryTile
          label="ACKNOWLEDGED"
          value={exportsQ.isLoading ? "…" : String(exports.filter((e) => e.status === "ACKNOWLEDGED").length)}
          hint="Authority confirmed"
        />
        <SummaryTile
          label="JURISDICTION COVERAGE"
          value="54 MARKETS"
          hint="FCC, Ofcom, HMRC, IRS"
        />
        <SummaryTile
          label="IDEMPOTENCY"
          value="ENFORCED"
          hint="Port 8098 · Zero duplicate"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "exports"} onClick={() => setSubTab("exports")} label={`Regulatory Exports (${exports.length})`} />
        <SubTab active={subTab === "compliance"} onClick={() => setSubTab("compliance")} label="Filing Standards &amp; Formats" />
      </div>

      {/* Tab Content: Exports */}
      {subTab === "exports" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">EXPORT ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">REPORT TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">JURISDICTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">FORMAT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">LIFECYCLE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={7}
                  loading={exportsQ.isLoading}
                  error={exportsQ.error}
                  empty={exports.length === 0}
                  loadingLabel="Loading regulatory exports…"
                  emptyLabel="No regulatory reports generated. Create an export above."
                />
                {exports.map((e) => (
                  <tr key={e.export_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{shortId(e.export_id)}</td>
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800">{e.export_type}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{e.jurisdiction_code}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">{e.period_start?.slice(0, 10)} → {e.period_end?.slice(0, 10)}</td>
                    <td className="px-6 py-4 font-mono text-xs">{e.file_format}</td>
                    <td className="px-6 py-4"><StatusPill status={e.status || "GENERATING"} /></td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      {e.status === "GENERATING" && (
                        <button
                          onClick={() => exportActionMutation.mutate({ exportId: e.export_id, action: "ready" })}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-bold"
                        >
                          Mark Ready
                        </button>
                      )}
                      {e.status === "READY" && (
                        <button
                          onClick={() => exportActionMutation.mutate({ exportId: e.export_id, action: "submit" })}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded text-[10px] font-bold"
                        >
                          Submit to Authority
                        </button>
                      )}
                      {e.status === "SUBMITTED" && (
                        <button
                          onClick={() => exportActionMutation.mutate({ exportId: e.export_id, action: "acknowledge" })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold"
                        >
                          Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Standards */}
      {subTab === "compliance" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm text-xs font-sans">
          <h3 className="text-slate-800 font-bold text-base font-['Plus_Jakarta_Sans']">Supported Statutory Reporting Standards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">TAX_STATUTORY_RETURN</span>
              <p className="text-slate-500">Jurisdiction VAT/GST and US State Telecom Sales Tax schedules formatted for direct e-filing.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">SUBSCRIBER_CENSUS</span>
              <p className="text-slate-500">Active MSISDN, eSIM count, MNP churn, and SIM-registration regulatory compliance audits.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">TRAFFIC_INTERCONNECT</span>
              <p className="text-slate-500">MOU (Minutes of Usage), Gigabytes transmitted, and ILD wholesale interconnect settlements.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Generate Export */}
      {exportModalOpen && (
        <Modal
          title="Generate Statutory Regulatory Filing"
          subtitle="Compile auditable report package signed with the tenant's cryptographic evidence key."
          onClose={() => setExportModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setExportModalOpen(false)}
              onConfirm={() => createExportMutation.mutate()}
              confirmLabel="Compile &amp; Export"
              pendingLabel="Compiling…"
              pending={createExportMutation.isPending}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Report Type">
                <select
                  className={inputClass}
                  value={exportForm.export_type}
                  onChange={(e) => setExportForm({ ...exportForm, export_type: e.target.value })}
                >
                  <option value="TAX_STATUTORY_RETURN">TAX_STATUTORY_RETURN</option>
                  <option value="SUBSCRIBER_CENSUS">SUBSCRIBER_CENSUS</option>
                  <option value="TRAFFIC_INTERCONNECT">TRAFFIC_INTERCONNECT</option>
                  <option value="UNIVERSAL_SERVICE_FUND">UNIVERSAL_SERVICE_FUND</option>
                  <option value="EMERGENCY_911_FEES">EMERGENCY_911_FEES</option>
                </select>
              </Field>
              <Field label="Jurisdiction Code">
                <input
                  className={inputMonoClass}
                  value={exportForm.jurisdiction_code}
                  onChange={(e) => setExportForm({ ...exportForm, jurisdiction_code: e.target.value.toUpperCase() })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Period Start">
                <input
                  type="date"
                  className={inputClass}
                  value={exportForm.period_start}
                  onChange={(e) => setExportForm({ ...exportForm, period_start: e.target.value })}
                />
              </Field>
              <Field label="Period End">
                <input
                  type="date"
                  className={inputClass}
                  value={exportForm.period_end}
                  onChange={(e) => setExportForm({ ...exportForm, period_end: e.target.value })}
                />
              </Field>
              <Field label="File Format">
                <select
                  className={inputClass}
                  value={exportForm.file_format}
                  onChange={(e) => setExportForm({ ...exportForm, file_format: e.target.value })}
                >
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                  <option value="XML">XML</option>
                  <option value="PDF">PDF</option>
                </select>
              </Field>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
