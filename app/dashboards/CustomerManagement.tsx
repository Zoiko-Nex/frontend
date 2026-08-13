"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";
import { ACCOUNT_TRANSITIONS, CUSTOMER_TRANSITIONS } from "@/lib/admin/transitions";
import { StatusPill, TransitionButtons } from "@/components/admin/primitives";

/**
 * Fields here match the API exactly. Three of them did not, and each silently
 * produced wrong output rather than an error:
 *
 *  - Customer has lifecycle_status and kyc_status, never `status`, so every status
 *    comparison was false and no filter or badge worked.
 *  - Party carries a pii_token, never first_name/last_name. PII is vaulted
 *    (ZN-ADR-013 / P0-7), so the console rendered "undefined undefined" for names
 *    that cannot exist on the wire.
 *  - KYCCase is keyed case_id, not id.
 */
interface Customer {
  id: string;
  party_id: string;
  customer_type: string;
  segment?: string;
  risk_level?: string;
  lifecycle_status: string;
  kyc_status?: string;
  created_at: string;
}

interface Party {
  party_id: string;
  party_type: string;
  pii_token: string;
  status: string;
}

interface Account {
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  currency_code: string;
  status: string;
  credit_limit_minor_units?: number;
  credit_limit_currency_code?: string;
}

interface KYCCase {
  case_id: string;
  customer_id: string;
  status: string;
  verification_level: string;
  risk_score?: number;
  risk_level?: string;
}

export default function CustomerManagement() {
  const qc = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false);
  const [newPiiToken, setNewPiiToken] = useState("");
  const [eraseOpen, setEraseOpen] = useState(false);
  const [erasureKeyID, setErasureKeyID] = useState("");

  // Form states
  const [customerForm, setCustomerForm] = useState({
    party_type: "INDIVIDUAL",
    pii_token: "",
    jurisdiction_code: "GB",
    customer_type: "RETAIL",
    segment: "PREPAID_MOBILE",
  });

  // Queries
  const customersQ = useQuery({
    queryKey: ["customers", "list"],
    queryFn: async () => {
      // customer-account returns {"customers": [...]}, not {"items": [...]}.
      // Reading the wrong key yields an empty array, which looks like "no
      // customers" rather than a bug.
      const res = await api.get<{ customers?: Customer[] }>("customer", "/v1/customers");
      return res.customers ?? [];
      
    },
  });
  const customers = customersQ.data ?? [];

  // Authoritative record for the selected subscriber. The list row can lag behind a
  // lifecycle change made elsewhere, and the lifecycle buttons must reflect the real
  // current state or they will offer an illegal transition.
  const customerDetailQ = useQuery({
    queryKey: ["customers", "detail", selectedCustomerId],
    queryFn: () => api.get<Customer>("customer", `/v1/customers/${selectedCustomerId}`),
    enabled: !!selectedCustomerId,
  });
  const selectedCustomer =
    customerDetailQ.data ?? customers.find((c) => c.id === selectedCustomerId);

  const partyQ = useQuery({
    queryKey: ["customers", "party", selectedCustomer?.party_id],
    queryFn: () => api.get<Party>("customer", `/v1/parties/${selectedCustomer!.party_id}`),
    enabled: !!selectedCustomer?.party_id,
  });
  const party = partyQ.data;

  const accountsQ = useQuery({
    queryKey: ["customers", "accounts", selectedCustomerId],
    queryFn: async () => {
      const res = await api.get<{ accounts?: Account[] }>(
        "customer",
        `/v1/customers/${selectedCustomerId}/accounts`
      );
      return res.accounts ?? [];
    },
    enabled: !!selectedCustomerId,
  });
  const accounts = accountsQ.data ?? [];

  // KYC Case query for selected customer
  const kycCaseQ = useQuery({
    queryKey: ["customers", "kyc-case", selectedCustomerId],
    queryFn: () =>
      selectedCustomerId
        ? api.get<KYCCase>("kyc", `/v1/kyc/customers/${selectedCustomerId}/case`)
        : Promise.reject("No customer selected"),
    enabled: !!selectedCustomerId,
    retry: false, // expected 404 if no case opened yet
  });
  const kycCase = kycCaseQ.data;

  // Onboard Mutation (Create Party -> Create Customer)
  const onboardCustomer = useMutation({
    mutationFn: async () => {
      // 1. Create Party
      // POST /v1/parties requires party_type and pii_token and accepts no names:
      // "pii_token is required — store PII in the vault first (ZN-ADR-013)". Sending
      // first_name/last_name here returned 400 every time, so onboarding never worked.
      const party = await api.post<Party>("customer", "/v1/parties", {
        party_type: customerForm.party_type,
        pii_token: customerForm.pii_token.trim(),
        jurisdiction_code: customerForm.jurisdiction_code,
      });

      // 2. Create Customer
      const customer = await api.post<Customer>("customer", "/v1/customers", {
        party_id: party.party_id,
        customer_type: customerForm.customer_type,
        segment: customerForm.segment,
      });

      return customer;
    },
    onSuccess: (newCust) => {
      toast.success("Subscriber onboarding completed");
      setCreateCustomerOpen(false);
      setCustomerForm({
        party_type: "INDIVIDUAL",
        pii_token: "",
        jurisdiction_code: "GB",
        customer_type: "RETAIL",
        segment: "PREPAID_MOBILE",
      });
      setSelectedCustomerId(newCust.id);
      qc.invalidateQueries({ queryKey: ["customers", "list"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Onboarding failed"),
  });

  // ── Lifecycle, party and erasure ────────────────────────────────────────────

  const refreshCustomer = () => {
    qc.invalidateQueries({ queryKey: ["customers", "list"] });
    qc.invalidateQueries({ queryKey: ["customers", "detail", selectedCustomerId] });
  };

  const transitionCustomer = useMutation({
    mutationFn: ({ action }: { action: string }) =>
      api.patch("customer", `/v1/customers/${selectedCustomerId}`, {
        action,
        reason:
          action === "SUSPEND" || action === "TERMINATE"
            ? "Operator action from the subscriber console"
            : undefined,
      }),
    onSuccess: (_r, v) => {
      toast.success(`Subscriber ${v.action} accepted`);
      refreshCustomer();
    },
    onError: (e) =>
      toast.error(e instanceof ApiException ? e.message : "Lifecycle transition failed"),
  });

  const transitionAccount = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.patch("customer", `/v1/accounts/${id}`, {
        action,
        reason:
          action === "SUSPEND" || action === "CLOSE"
            ? "Operator action from the subscriber console"
            : undefined,
      }),
    onSuccess: (_r, v) => {
      toast.success(`Account ${v.action} accepted`);
      qc.invalidateQueries({ queryKey: ["customers", "accounts", selectedCustomerId] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Account transition failed"),
  });

  // Re-pointing a party at a new vault token, e.g. after the subject's details are
  // re-vaulted. The token is the only mutable field on a party.
  const updateParty = useMutation({
    mutationFn: (piiToken: string) =>
      api.patch("customer", `/v1/parties/${selectedCustomer!.party_id}`, { pii_token: piiToken }),
    onSuccess: () => {
      toast.success("Party PII token updated");
      setNewPiiToken("");
      qc.invalidateQueries({ queryKey: ["customers", "party"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to update the party"),
  });

  // Right to erasure (P0-7). This crypto-shreds the subject's PII while leaving
  // invoices, ledger continuity and the evidence hash chain verifiable, so it is not
  // reversible and is gated behind an explicit confirmation.
  const eraseCustomer = useMutation({
    mutationFn: (erasureKeyID: string) =>
      api.post("customer", `/v1/customers/${selectedCustomerId}/erase`, {
        erasure_key_id: erasureKeyID,
      }),
    onSuccess: () => {
      toast.success("Erasure executed — PII is now unrecoverable");
      setEraseOpen(false);
      setErasureKeyID("");
      refreshCustomer();
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Erasure failed"),
  });

  // KYC Mutations
  const openKYC = useMutation({
    mutationFn: (customerId: string) =>
      api.post<KYCCase>("kyc", "/v1/kyc/cases", {
        customer_id: customerId,
        verification_level: "BASIC",
      }),
    onSuccess: () => {
      toast.success("KYC Case opened successfully");
      qc.invalidateQueries({ queryKey: ["customers", "kyc-case", selectedCustomerId] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to open KYC case"),
  });

  const uploadMockDoc = useMutation({
    mutationFn: (caseId: string) =>
      api.post("kyc", "/v1/kyc/documents", {
        case_id: caseId,
        customer_id: selectedCustomerId!,
        document_type: "PASSPORT",
        storage_ref: "s3://kyc-docs/tenant/passport-mock.jpg",
        mime_type: "image/jpeg",
        file_size_bytes: 250000,
      }),
    onSuccess: () => {
      toast.success("Mock Passport ID uploaded successfully");
      qc.invalidateQueries({ queryKey: ["customers", "kyc-case", selectedCustomerId] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Document upload failed"),
  });

  const approveKYC = useMutation({
    mutationFn: (caseId: string) =>
      api.patch("kyc", `/v1/kyc/cases/${caseId}`, {
        action: "APPROVE",
        provider_ref: "ext-jumio-verification-1",
        provider_name: "Jumio",
        reviewed_by: "system-operator",
        risk_score: 8,
        risk_level: "LOW",
      }),
    onSuccess: () => {
      toast.success("KYC case approved. Customer activation queued.");
      qc.invalidateQueries({ queryKey: ["customers", "kyc-case", selectedCustomerId] });
      // Invalidate customer list to show status change
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ["customers", "list"] });
      }, 1000);
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Approval transition failed"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Subscribers & KYC Lifecycle
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Onboard new customers, manage legal entity party associations, and process identity verification KYC sagas.
          </p>
        </div>

        <button
          onClick={() => setCreateCustomerOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          + Onboard Subscriber
        </button>
      </div>

      <div className="self-stretch grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full">
        {/* Left 2 Cols: Customer List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CUSTOMER TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SEGMENT</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {customersQ.isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400">
                      Loading subscribers list...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-400">
                      No subscribers onboarded. Click &quot;Onboard Subscriber&quot; to add.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={`hover:bg-slate-50/40 transition cursor-pointer ${
                        c.id === selectedCustomerId ? "bg-sky-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-xs">
                          {c.id.slice(0, 8)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.customer_type}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{c.segment}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                            c.lifecycle_status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 outline-emerald-500/30"
                              : c.lifecycle_status === "PENDING_KYC"
                              ? "bg-amber-50 text-amber-600 outline-amber-500/30"
                              : "bg-slate-50 text-slate-600 outline-slate-500/30"
                          }`}
                        >
                          {c.lifecycle_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: KYC & Lifecycle Audit */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] border-b border-slate-100 pb-2">
            KYC Case Workspace
          </h3>

          {!selectedCustomerId ? (
            <div className="text-slate-400 text-xs py-8 text-center">
              Select a subscriber from the list to view KYC details.
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 font-medium">Selected Customer:</span>
                <div className="text-slate-800 font-bold mt-0.5">
                  {selectedCustomer?.id.slice(0, 8)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedCustomer?.id}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <StatusPill status={selectedCustomer?.lifecycle_status} />
                  {selectedCustomer?.kyc_status && (
                    <span className="text-[10px] text-slate-500">KYC {selectedCustomer.kyc_status}</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
                <span className="font-bold text-slate-700 text-xs">Subscriber lifecycle</span>
                <TransitionButtons
                  table={CUSTOMER_TRANSITIONS}
                  status={selectedCustomer?.lifecycle_status}
                  pending={transitionCustomer.isPending}
                  onAction={(action) => transitionCustomer.mutate({ action })}
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
                <span className="font-bold text-slate-700 text-xs">Billing accounts</span>
                {accountsQ.isLoading ? (
                  <div className="text-slate-400 italic text-[10px]">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                  <p className="text-[10px] text-slate-500">
                    No billing account. An order cannot be raised until one exists.
                  </p>
                ) : (
                  accounts.map((a) => (
                    <div key={a.id} className="bg-white rounded-lg border border-slate-200 p-2.5 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-800">{a.account_number}</span>
                        <StatusPill status={a.status} size="xs" />
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        {a.account_type} - {a.currency_code}
                      </div>
                      <TransitionButtons
                        table={ACCOUNT_TRANSITIONS}
                        status={a.status}
                        pending={transitionAccount.isPending}
                        onAction={(action) => transitionAccount.mutate({ id: a.id, action })}
                      />
                    </div>
                  ))
                )}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2">
                <span className="font-bold text-slate-700 text-xs">Party (PII boundary)</span>
                {party ? (
                  <>
                    <div className="text-[10px] text-slate-500 font-mono break-all">
                      {party.party_type} - token {party.pii_token}
                    </div>
                    <input
                      value={newPiiToken}
                      onChange={(e) => setNewPiiToken(e.target.value)}
                      placeholder="New pii_token"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-sky-500 font-mono text-[10px]"
                    />
                    <button
                      onClick={() => updateParty.mutate(newPiiToken.trim())}
                      disabled={updateParty.isPending || !newPiiToken.trim()}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded font-bold text-[10px] cursor-pointer self-start"
                    >
                      Re-point PII token
                    </button>
                  </>
                ) : (
                  <p className="text-[10px] text-slate-500">No party record resolved.</p>
                )}
              </div>

              <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 flex flex-col gap-2">
                <span className="font-bold text-rose-800 text-xs">Right to erasure</span>
                <p className="text-[10px] text-rose-900 leading-relaxed">
                  Crypto-shreds this subject&apos;s PII. Invoices, ledger continuity and the evidence
                  chain stay verifiable, but the PII cannot be recovered. Not reversible.
                </p>
                {!eraseOpen ? (
                  <button
                    onClick={() => setEraseOpen(true)}
                    className="px-2.5 py-1.5 bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 rounded font-bold text-[10px] cursor-pointer self-start"
                  >
                    Erase subscriber PII...
                  </button>
                ) : (
                  <>
                    <input
                      value={erasureKeyID}
                      onChange={(e) => setErasureKeyID(e.target.value)}
                      placeholder="erasure_key_id (required)"
                      className="w-full bg-white border border-rose-300 rounded px-2 py-1.5 outline-none focus:border-rose-500 font-mono text-[10px]"
                    />
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setEraseOpen(false); setErasureKeyID(""); }}
                        className="px-2.5 py-1.5 bg-white text-slate-600 border border-slate-300 rounded font-bold text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => eraseCustomer.mutate(erasureKeyID.trim())}
                        disabled={eraseCustomer.isPending || !erasureKeyID.trim()}
                        className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded font-bold text-[10px] cursor-pointer"
                      >
                        Confirm erasure
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* KYC CASE STATUS */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 flex flex-col gap-3">
                <span className="font-bold text-slate-700 text-xs">KYC Case Details</span>

                {kycCaseQ.isLoading ? (
                  <div className="text-slate-400 italic">Checking verification status...</div>
                ) : !kycCase ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="text-slate-500 italic">No KYC verification case opened yet for this subscriber.</div>
                    <button
                      onClick={() => openKYC.mutate(selectedCustomerId)}
                      disabled={openKYC.isPending}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold transition text-[11px] shadow-sm cursor-pointer"
                    >
                      {openKYC.isPending ? "Opening Case..." : "Open KYC Case (BASIC)"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Case ID:</span>
                      <span className="font-mono text-[10px] text-slate-800">{kycCase.case_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Verification:</span>
                      <span className="font-bold text-slate-700">{kycCase.verification_level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Case Status:</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                          kycCase.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 outline-emerald-500/20"
                            : kycCase.status === "REJECTED"
                            ? "bg-rose-50 text-rose-600 outline-rose-500/20"
                            : "bg-amber-50 text-amber-600 outline-amber-500/20"
                        }`}
                      >
                        {kycCase.status}
                      </span>
                    </div>

                    {kycCase.status === "APPROVED" && (
                      <div className="border-t border-slate-200/60 pt-2 flex flex-col gap-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Risk Score:</span>
                          <span className="font-bold text-slate-800">{kycCase.risk_score} / 100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Risk Level:</span>
                          <span className="font-bold text-slate-800">{kycCase.risk_level}</span>
                        </div>
                      </div>
                    )}

                    {/* ACTIONS */}
                    {kycCase.status === "DRAFT" && (
                      <button
                        onClick={() => uploadMockDoc.mutate(kycCase.case_id)}
                        disabled={uploadMockDoc.isPending}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition text-[11px] shadow-sm cursor-pointer"
                      >
                        {uploadMockDoc.isPending ? "Uploading..." : "Upload Identity Passport ID"}
                      </button>
                    )}

                    {(kycCase.status === "DRAFT" || kycCase.status === "SUBMITTED" || kycCase.status === "IN_REVIEW") && (
                      <button
                        onClick={() => approveKYC.mutate(kycCase.case_id)}
                        disabled={approveKYC.isPending}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition text-[11px] shadow-sm cursor-pointer"
                      >
                        {approveKYC.isPending ? "Approving..." : "Approve Verification"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboard Subscriber Modal */}
      {createCustomerOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Onboard Subscriber</h2>
              <button
                onClick={() => setCreateCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-900 leading-relaxed">
                Names and other PII are not stored here. A party carries a
                <span className="font-mono font-semibold"> pii_token</span> issued by the PII
                vault, and the API rejects a party without one (ZN-ADR-013 / P0-7). Vault the
                subscriber&apos;s details first, then paste the token below.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Party Type</label>
                  <select
                    value={customerForm.party_type}
                    onChange={(e) => setCustomerForm({ ...customerForm, party_type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="INDIVIDUAL">INDIVIDUAL</option>
                    <option value="ORGANISATION">ORGANISATION</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">PII Token</label>
                  <input
                    value={customerForm.pii_token}
                    onChange={(e) => setCustomerForm({ ...customerForm, pii_token: e.target.value })}
                    placeholder="tok_..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Jurisdiction Code</label>
                  <input
                    value={customerForm.jurisdiction_code}
                    onChange={(e) => setCustomerForm({ ...customerForm, jurisdiction_code: e.target.value.toUpperCase() })}
                    placeholder="GB"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Customer Segment</label>
                  <select
                    value={customerForm.segment}
                    onChange={(e) => setCustomerForm({ ...customerForm, segment: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="PREPAID_MOBILE">Prepaid Mobile</option>
                    <option value="POSTPAID_MOBILE">Postpaid Mobile</option>
                    <option value="IOT_CONNECTIVITY">IoT Fleet</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Customer Type</label>
                  <select
                    value={customerForm.customer_type}
                    onChange={(e) => setCustomerForm({ ...customerForm, customer_type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="RETAIL">Retail Customer</option>
                    <option value="BUSINESS">Enterprise / Business</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setCreateCustomerOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onboardCustomer.mutate()}
                disabled={onboardCustomer.isPending || !customerForm.pii_token.trim()}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {onboardCustomer.isPending ? "Onboarding…" : "Complete Onboarding"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
