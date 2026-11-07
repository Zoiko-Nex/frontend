"use client";

/**
 * Evidence Ledger console — evidence-ledger service (port 8093).
 *
 * Domain 13: Cryptographic WORM hash chain audit ledger. Every critical event
 * (invoice issuance, payment authorization, KYC approval) appends an immutable
 * evidence record linked via SHA-256 and signed with RSA-PSS-SHA256 (ZN-ADR-012).
 *
 * Key Invariants (CLAUDE.md P0-6):
 *  - Write-once, read-many (WORM). No edits or deletions exist.
 *  - Tamper detection: verifying a record checks payload hash, sequence hash, and signature.
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

interface EvidenceRecord {
  evidence_id: string;
  chain_sequence: number;
  aggregate_type: string;
  aggregate_id: string;
  producer_service: string;
  payload_hash: string;
  previous_hash: string;
  jurisdiction_code?: string;
  data_residency_region?: string;
  recorded_at: string;
}

/**
 * What GET /v1/evidence/{id}/verify actually returns — dto.VerificationResponse
 * is exactly these four fields.
 *
 * This previously declared valid, hash_valid, chain_valid, signature_valid and
 * failure_reason, none of which the service sends. So `valid` was always
 * undefined, undefined is falsy, and every verification rendered as
 * "TAMPER DETECTED" with three sub-checks reading CORRUPTED / BROKEN CHAIN /
 * INVALID SIG — including when the chain verified perfectly.
 *
 * On an evidence ledger that is the most damaging direction for the bug to run:
 * a clean audit reads as evidence of tampering. The service does verify hash,
 * link and signature internally, but it reports one composite verdict, so the
 * UI shows one verdict rather than inventing three.
 */
interface VerificationResult {
  evidence_id: string;
  chain_sequence: number;
  verified: boolean;
  verified_at?: string;
}

export default function EvidenceLedger() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"records" | "verifier" | "chain">("records");
  const [appendModalOpen, setAppendModalOpen] = useState(false);
  const [verifyId, setVerifyId] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  /**
   * Integrity comes from the service, not from a constant.
   *
   * The tile read "100% SEALED" as a hardcoded string while GET
   * /v1/evidence/verify-range sat uncalled. An append-only ledger asserting its
   * own integrity without checking is the one thing an evidence store must
   * never do: the tile said sealed whether the chain reconciled or not, so it
   * would have kept saying sealed through an actual tamper.
   *
   * from=1 walks the chain from its origin. A 4xx here is not "unknown" — a
   * range that cannot be verified is reported as unverified, because on this
   * screen the safe default is to withhold the assurance, not to assume it.
   */
  const integrityQ = useQuery({
    queryKey: ["evidence", "chain-integrity"],
    retry: false,
    staleTime: 60_000,
    queryFn: () =>
      api.get<VerificationResult>("evidence", "/v1/evidence/verify-range?from=1&to=1000000"),
  });

  // Form
  const [appendForm, setAppendForm] = useState({
    aggregate_type: "Invoice",
    aggregate_id: "",
    producer_service: "billing-invoice",
    jurisdiction_code: "US-CA",
    data_residency_region: "us-east-1",
    action: "INVOICE_ISSUED",
    amount_minor_units: 55000,
    currency_code: "USD",
  });

  // Query record by ID
  const [lookupId, setLookupId] = useState("");
  const recordQ = useQuery({
    queryKey: ["evidence", "record", lookupId],
    enabled: !!lookupId,
    queryFn: async () => {
      try {
        return await api.get<EvidenceRecord>("evidence", `/v1/evidence/${lookupId}`);
      } catch (e) {
        return null;
      }
    },
  });

  // Verify mutation
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.get<VerificationResult>("evidence", `/v1/evidence/${id}/verify`),
    onSuccess: (res) => {
      setVerificationResult(res);
      if (res.verified) {
        toast.success("Cryptographic integrity verified: Hash chain and RSA signature are 100% valid!");
      } else {
        toast.error("Integrity validation failed: Record has been tampered with!");
      }
    },
    onError: fail("Could not verify record"),
  });

  const appendMutation = useMutation({
    mutationFn: () =>
      api.post("evidence", "/v1/evidence", {
        aggregate_type: appendForm.aggregate_type,
        aggregate_id: appendForm.aggregate_id || api.uuid(),
        producer_service: appendForm.producer_service,
        jurisdiction_code: appendForm.jurisdiction_code,
        data_residency_region: appendForm.data_residency_region,
        policy_version_id: "v1.0",
        payload: {
          action: appendForm.action,
          amount: Number(appendForm.amount_minor_units),
          currency: appendForm.currency_code,
          timestamp: new Date().toISOString(),
        },
      }),
    onSuccess: (res: any) => {
      toast.success(`Evidence sealed on chain! Sequence #${res.chain_sequence}`);
      setAppendModalOpen(false);
      if (res.evidence_id) setLookupId(res.evidence_id);
    },
    onError: fail("Could not seal evidence record"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Cryptographic Evidence Ledger
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            WORM append-only tamper-evident hash chain for regulatory compliance and audit guarantees (Port 8093).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppendModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + Append Evidence Record
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="CHAIN INTEGRITY"
          value={
            integrityQ.isLoading
              ? "Checking…"
              : integrityQ.data?.verified
                ? "Verified"
                : integrityQ.error
                  ? "Unverified"
                  : "FAILED"
          }
          hint={
            integrityQ.isLoading
              ? "Walking the chain from sequence 1"
              : integrityQ.data?.verified
                ? `Reconciled to sequence ${integrityQ.data.chain_sequence}`
                : integrityQ.error
                  ? errMessage(integrityQ.error, "The range could not be checked")
                  : "The chain did not reconcile — investigate"
          }
        />
        <SummaryTile
          label="SIGNING ALGORITHM"
          value="RSA-PSS / SHA-256"
          hint="As implemented by evidence-ledger"
        />
        {/*
          WORM and court-admissibility were asserted as achieved. Neither is
          established by anything this console can see — WORM is a property of
          the storage the service is deployed onto, not of the service — so they
          are stated as the design target they are.
        */}
        <SummaryTile
          label="STORAGE TARGET"
          value="WORM"
          hint="Depends on deployment storage, not verified here"
        />
        <SummaryTile
          label="GOVERNING ADR"
          value="ZN-ADR-012"
          hint="Append-only evidence chain"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "records"} onClick={() => setSubTab("records")} label="Record Inspector" />
        <SubTab active={subTab === "verifier"} onClick={() => setSubTab("verifier")} label="Cryptographic Verifier" />
        <SubTab active={subTab === "chain"} onClick={() => setSubTab("chain")} label="Hash Chain Architecture" />
      </div>

      {/* Tab Content: Records */}
      {subTab === "records" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 pb-4">
            <div className="flex-1 min-w-[280px]">
              <Field label="Inspect Evidence ID" hint="Enter Evidence UUID returned by any billing, payment, or KYC outbox event.">
                <input
                  className={inputMonoClass}
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="e.g. 58802f94-2217-4081-8b74-7b99f1fd43c2"
                />
              </Field>
            </div>
            <button
              onClick={() => recordQ.refetch()}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            >
              Lookup Record
            </button>
          </div>

          {recordQ.isLoading ? (
            <div className="text-slate-400 text-xs py-8 text-center">Reading cryptographic chain…</div>
          ) : recordQ.data ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-slate-400">Evidence ID:</div>
                <div className="text-slate-900 font-bold break-all">{recordQ.data.evidence_id}</div>
                <div className="text-slate-400">Chain Sequence:</div>
                <div className="text-indigo-600 font-bold">#{recordQ.data.chain_sequence}</div>
                <div className="text-slate-400">Aggregate Context:</div>
                <div className="text-slate-700">{recordQ.data.aggregate_type} ({recordQ.data.aggregate_id})</div>
                <div className="text-slate-400">Producer Service:</div>
                <div className="text-slate-700">{recordQ.data.producer_service}</div>
                <div className="text-slate-400">Payload Hash (SHA-256):</div>
                <div className="text-slate-700 break-all text-[11px]">{recordQ.data.payload_hash}</div>
                <div className="text-slate-400">Previous Chain Hash:</div>
                <div className="text-slate-500 break-all text-[11px]">{recordQ.data.previous_hash}</div>
                <div className="text-slate-400">Recorded Timestamp:</div>
                <div className="text-slate-700">{new Date(recordQ.data.recorded_at).toUTCString()}</div>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    setVerifyId(recordQ.data!.evidence_id);
                    verifyMutation.mutate(recordQ.data!.evidence_id);
                    setSubTab("verifier");
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition cursor-pointer"
                >
                  Verify Cryptographic Proof
                </button>
              </div>
            </div>
          ) : lookupId ? (
            <div className="text-rose-500 text-xs py-4">Evidence record not found for ID: {lookupId}</div>
          ) : (
            <div className="text-slate-400 text-xs py-8 text-center italic">
              Enter an Evidence ID above or click "+ Append Evidence Record" to seal a transaction on the ledger.
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Cryptographic Verifier */}
      {subTab === "verifier" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 pb-4">
            <div className="flex-1 min-w-[280px]">
              <Field label="Evidence ID to Verify" hint="Executes a mathematical proof across payload hash, sequence hash, and RSA-PSS signature.">
                <input
                  className={inputMonoClass}
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  placeholder="Evidence UUID"
                />
              </Field>
            </div>
            <button
              onClick={() => verifyMutation.mutate(verifyId)}
              disabled={!verifyId || verifyMutation.isPending}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              {verifyMutation.isPending ? "Validating Cryptography…" : "Execute Verification"}
            </button>
          </div>

          {verificationResult && (
            <div className={`p-5 rounded-xl border ${verificationResult.verified ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50 border-rose-200"} flex flex-col gap-3 font-sans`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-extrabold text-base text-slate-800">
                  {verificationResult.verified ? "Chain verified" : "Verification FAILED — treat as a tamper event"}
                </span>
                <span className="font-mono text-xs text-slate-600">Sequence #{verificationResult.chain_sequence}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {verificationResult.verified
                  ? "The payload hash, the link to the preceding record and the signature all reconcile. The service checks all three and returns a single verdict."
                  : "One of the payload hash, the chain link or the signature did not reconcile. The service returns a single verdict and does not say which — investigate before relying on any record at or after this sequence."}
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-[11px] text-slate-500 pt-2 border-t border-slate-200/70">
                <span>record {shortId(verificationResult.evidence_id)}</span>
                {verificationResult.verified_at && (
                  <span>checked {new Date(verificationResult.verified_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Chain Architecture */}
      {subTab === "chain" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
          <h3 className="text-slate-800 font-bold text-base font-['Plus_Jakarta_Sans']">Merkle Hash Chain Structure (ZN-ADR-012)</h3>
          <p className="text-slate-500 text-xs">Every record hashes its canonical JSON payload and chains with the preceding entry's hash.</p>
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto">
            <code>
              {`payload_hash    = SHA-256(canonical_json(payload))\n`}
              {`signing_input   = payload_hash || previous_hash || chain_sequence\n`}
              {`chain_signature = RSA-PSS-SHA256(private_key, signing_input)`}
            </code>
          </div>
        </div>
      )}

      {/* Modal: Append Record */}
      {appendModalOpen && (
        <Modal
          title="Append Cryptographic Evidence"
          subtitle="Seal an immutable record into the WORM hash chain."
          onClose={() => setAppendModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setAppendModalOpen(false)}
              onConfirm={() => appendMutation.mutate()}
              confirmLabel="Seal on Chain"
              pendingLabel="Sealing…"
              pending={appendMutation.isPending}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Aggregate Type">
                <select
                  className={inputClass}
                  value={appendForm.aggregate_type}
                  onChange={(e) => setAppendForm({ ...appendForm, aggregate_type: e.target.value })}
                >
                  <option value="Invoice">Invoice</option>
                  <option value="PaymentIntent">PaymentIntent</option>
                  <option value="KYCCase">KYCCase</option>
                  <option value="Order">Order</option>
                  <option value="SettlementRun">SettlementRun</option>
                </select>
              </Field>
              <Field label="Producer Service">
                <select
                  className={inputClass}
                  value={appendForm.producer_service}
                  onChange={(e) => setAppendForm({ ...appendForm, producer_service: e.target.value })}
                >
                  <option value="billing-invoice">billing-invoice</option>
                  <option value="payments">payments</option>
                  <option value="custmr-lfc-kyc">custmr-lfc-kyc</option>
                  <option value="order-management">order-management</option>
                  <option value="partner-settlement">partner-settlement</option>
                </select>
              </Field>
            </div>
            <Field label="Aggregate ID (UUID)">
              <input
                className={inputMonoClass}
                value={appendForm.aggregate_id}
                onChange={(e) => setAppendForm({ ...appendForm, aggregate_id: e.target.value })}
                placeholder="Leave blank to generate random UUID"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Action">
                <input
                  className={inputClass}
                  value={appendForm.action}
                  onChange={(e) => setAppendForm({ ...appendForm, action: e.target.value })}
                />
              </Field>
              <Field label="Amount (Minor Units)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={appendForm.amount_minor_units}
                  onChange={(e) => setAppendForm({ ...appendForm, amount_minor_units: Number(e.target.value) })}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
