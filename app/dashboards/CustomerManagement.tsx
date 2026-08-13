"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";

interface Customer {
  id: string;
  party_id: string;
  customer_type: string;
  segment: string;
  status: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

interface Party {
  id: string;
  first_name: string;
  last_name: string;
  party_type: string;
  country_code: string;
  jurisdiction_code: string;
}

interface KYCCase {
  id: string;
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

  // Form states
  const [customerForm, setCustomerForm] = useState({
    first_name: "",
    last_name: "",
    country_code: "GB",
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
      const list = res.customers ?? [];
      
      // Resolve party details for each customer to show names
      const withParties = await Promise.all(
        list.map(async (c) => {
          try {
            const p = await api.get<Party>("customer", `/v1/parties/${c.party_id}`);
            return { ...c, first_name: p.first_name, last_name: p.last_name };
          } catch {
            return c;
          }
        })
      );
      return withParties;
    },
  });
  const customers = customersQ.data ?? [];

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

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
      const party = await api.post<Party>("customer", "/v1/parties", {
        party_type: "INDIVIDUAL",
        first_name: customerForm.first_name,
        last_name: customerForm.last_name,
        country_code: customerForm.country_code,
        jurisdiction_code: customerForm.jurisdiction_code,
      });

      // 2. Create Customer
      const customer = await api.post<Customer>("customer", "/v1/customers", {
        party_id: party.id,
        customer_type: customerForm.customer_type,
        segment: customerForm.segment,
      });

      return customer;
    },
    onSuccess: (newCust) => {
      toast.success("Subscriber onboarding completed");
      setCreateCustomerOpen(false);
      setCustomerForm({
        first_name: "",
        last_name: "",
        country_code: "GB",
        jurisdiction_code: "GB",
        customer_type: "RETAIL",
        segment: "PREPAID_MOBILE",
      });
      setSelectedCustomerId(newCust.id);
      qc.invalidateQueries({ queryKey: ["customers", "list"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Onboarding failed"),
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
                          {c.first_name} {c.last_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{c.customer_type}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{c.segment}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                            c.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 outline-emerald-500/30"
                              : c.status === "PENDING_KYC"
                              ? "bg-amber-50 text-amber-600 outline-amber-500/30"
                              : "bg-slate-50 text-slate-600 outline-slate-500/30"
                          }`}
                        >
                          {c.status}
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
                  {selectedCustomer?.first_name} {selectedCustomer?.last_name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedCustomer?.id}</div>
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
                      <span className="font-mono text-[10px] text-slate-800">{kycCase.id}</span>
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
                        onClick={() => uploadMockDoc.mutate(kycCase.id)}
                        disabled={uploadMockDoc.isPending}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition text-[11px] shadow-sm cursor-pointer"
                      >
                        {uploadMockDoc.isPending ? "Uploading..." : "Upload Identity Passport ID"}
                      </button>
                    )}

                    {(kycCase.status === "DRAFT" || kycCase.status === "SUBMITTED" || kycCase.status === "IN_REVIEW") && (
                      <button
                        onClick={() => approveKYC.mutate(kycCase.id)}
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
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">First Name</label>
                  <input
                    value={customerForm.first_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                    placeholder="Jane"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Last Name</label>
                  <input
                    value={customerForm.last_name}
                    onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                    placeholder="Doe"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Country Code</label>
                  <input
                    value={customerForm.country_code}
                    onChange={(e) => setCustomerForm({ ...customerForm, country_code: e.target.value.toUpperCase() })}
                    placeholder="GB"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
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
                disabled={onboardCustomer.isPending || !customerForm.first_name.trim() || !customerForm.last_name.trim()}
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
