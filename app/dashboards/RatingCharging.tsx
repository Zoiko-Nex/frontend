"use client";

/**
 * Rating & Charging console — rating-charging service (port 8085).
 *
 * Domain 09: Handles real-time OCS reservations for prepaid balances and
 * postpaid usage rating.
 *
 * Key Invariants (CLAUDE.md P0-2):
 *  - Prepaid: Real-time holds (ReservePrepaid) before usage, then DebitPrepaid.
 *  - Postpaid: CDR rating accumulates into open bill cycles (RatePostpaidUsage).
 *  - All money values in integer minor units (ZN-ADR-011).
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
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

interface BalanceAccount {
  account_id: string;
  subscriber_id: string;
  currency_code: string;
  balance_minor_units: number;
  reserved_minor_units: number;
  available_minor_units: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface RatedCharge {
  rated_charge_id: string;
  account_id: string;
  subscriber_id: string;
  usage_type: string;
  quantity: number;
  quantity_unit: string;
  amount_minor_units: number;
  currency_code: string;
  evidence_id: string;
  rated_at: string;
}

export default function RatingCharging() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<"accounts" | "prepaid" | "postpaid">("accounts");
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Forms
  const [accountForm, setAccountForm] = useState({
    subscriber_id: "",
    initial_balance_minor_units: 5000,
    currency_code: "USD",
  });

  const [reserveForm, setReserveForm] = useState({
    subscriber_id: "",
    amount_minor_units: 1000,
    currency_code: "USD",
    service_type: "VOICE",
  });

  const [rateForm, setRateForm] = useState({
    subscriber_id: "",
    account_id: "",
    usage_type: "DATA",
    quantity: 1048576,
    quantity_unit: "BYTES",
    amount_minor_units: 250,
    currency_code: "USD",
    evidence_id: "",
  });

  // Queries
  const accountsQ = useQuery({
    queryKey: ["rating", "balance-accounts"],
    queryFn: async () => {
      try {
        const res = await api.get<{ accounts?: BalanceAccount[]; items?: BalanceAccount[] }>("rating", "/v1/balance-accounts");
        return res.accounts ?? res.items ?? [];
      } catch {
        return [];
      }
    },
  });
  const accounts = accountsQ.data ?? [];

  // Mutations
  const fail = (fallback: string) => (e: unknown) => toast.error(errMessage(e, fallback));

  const createAccountMutation = useMutation({
    mutationFn: () =>
      api.post("rating", "/v1/balance-accounts", {
        subscriber_id: accountForm.subscriber_id,
        initial_balance_minor_units: Number(accountForm.initial_balance_minor_units),
        currency_code: accountForm.currency_code,
      }),
    onSuccess: () => {
      toast.success("Balance account created successfully");
      setAccountModalOpen(false);
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Failed to create balance account"),
  });

  const reserveMutation = useMutation({
    mutationFn: () =>
      api.post("rating", "/v1/prepaid/reserve", {
        idempotency_key: api.uuid(),
        subscriber_id: reserveForm.subscriber_id,
        currency_code: reserveForm.currency_code,
        amount: Number(reserveForm.amount_minor_units),
        service_type: reserveForm.service_type,
      }),
    onSuccess: () => {
      toast.success("Prepaid balance reservation & authorization held");
      setReserveModalOpen(false);
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Could not reserve balance (insufficient funds or invalid subscriber)"),
  });

  const rateMutation = useMutation({
    mutationFn: () =>
      api.post("rating", "/v1/postpaid/rate", {
        subscriber_id: rateForm.subscriber_id,
        account_id: rateForm.account_id,
        usage_type: rateForm.usage_type,
        quantity: Number(rateForm.quantity),
        quantity_unit: rateForm.quantity_unit,
        amount_minor_units: Number(rateForm.amount_minor_units),
        currency_code: rateForm.currency_code,
        evidence_id: rateForm.evidence_id || api.uuid(),
      }),
    onSuccess: () => {
      toast.success("Postpaid CDR rated and accumulated into open cycle");
      setRateModalOpen(false);
      qc.invalidateQueries({ queryKey: ["rating"] });
    },
    onError: fail("Could not rate postpaid usage"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Header */}
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Rating &amp; Real-Time Charging
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Real-time OCS reservations for prepaid subscribers and convergent postpaid CDR rating (Port 8085).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReserveModalOpen(true)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            ⚡ Reserve Prepaid Hold
          </button>
          <button
            onClick={() => setRateModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            📊 Rate Postpaid CDR
          </button>
          <button
            onClick={() => setAccountModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
          >
            + New Balance Account
          </button>
        </div>
      </div>

      {/* Summary KPI Tiles */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryTile
          label="ACTIVE OCS ACCOUNTS"
          value={accountsQ.isLoading ? "…" : String(accounts.length)}
          hint="Subscriber wallets"
        />
        <SummaryTile
          label="CHARGING ENGINE"
          value="ONLINE"
          hint="Port 8085 · Sub-10ms OCS"
        />
        <SummaryTile
          label="HOLD TIMEOUT"
          value="10m"
          hint="Auto-expiration sweep"
        />
        <SummaryTile
          label="MONEY STANDARD"
          value="ZN-ADR-011"
          hint="Integer Minor Units"
        />
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <SubTab active={subTab === "accounts"} onClick={() => setSubTab("accounts")} label={`Subscriber Accounts (${accounts.length})`} />
        <SubTab active={subTab === "prepaid"} onClick={() => setSubTab("prepaid")} label="Prepaid OCS Engine" />
        <SubTab active={subTab === "postpaid"} onClick={() => setSubTab("postpaid")} label="Postpaid CDR Rating" />
      </div>

      {/* Tab Content: Accounts */}
      {subTab === "accounts" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ACCOUNT ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TOTAL BALANCE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">RESERVED (HELD)</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">AVAILABLE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                <TableState
                  colSpan={6}
                  loading={accountsQ.isLoading}
                  error={accountsQ.error}
                  empty={accounts.length === 0}
                  loadingLabel="Loading OCS balance accounts…"
                  emptyLabel="No balance accounts found. Create one above to initialize prepaid/postpaid subscriber wallets."
                />
                {accounts.map((acc) => (
                  <tr key={acc.account_id} className="hover:bg-slate-50/40 transition">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">
                      {shortId(acc.account_id)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {shortId(acc.subscriber_id)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-900 font-bold">
                      {formatMoney(acc.balance_minor_units, acc.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-amber-600 font-bold">
                      {formatMoney(acc.reserved_minor_units || 0, acc.currency_code)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-600 font-bold">
                      {formatMoney(acc.available_minor_units || acc.balance_minor_units, acc.currency_code)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={acc.status || "ACTIVE"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Prepaid OCS */}
      {subTab === "prepaid" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-slate-800 font-bold text-base font-['Plus_Jakarta_Sans']">Real-Time OCS Session Control</h3>
              <p className="text-slate-500 text-xs mt-0.5">Prepaid usage requires atomic credit reservation prior to session establishment.</p>
            </div>
            <button
              onClick={() => setReserveModalOpen(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + Initiate Session Hold
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">1. Balance Verification</span>
              <p className="text-slate-500 leading-relaxed">Engine verifies (Balance − Active Holds) &ge; Requested Minor Units. Rejects immediately if insufficient.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">2. Auto-Authorisation</span>
              <p className="text-slate-500 leading-relaxed">Locks requested funds in <code className="text-amber-600">ReservedMinorUnits</code>. Reservation valid for 10 minutes.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">3. Debit Termination</span>
              <p className="text-slate-500 leading-relaxed">On call/session end, exact consumed quota is debited. Unused balance is immediately unlocked.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Postpaid */}
      {subTab === "postpaid" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-slate-800 font-bold text-base font-['Plus_Jakarta_Sans']">Convergent Postpaid CDR Rating</h3>
              <p className="text-slate-500 text-xs mt-0.5">Mediation feeds raw usage; engine rates charges against catalogue price rules and accumulates into the active bill cycle.</p>
            </div>
            <button
              onClick={() => setRateModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + Rate Usage CDR
            </button>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 flex flex-col gap-2">
            <span className="font-bold text-indigo-950">Class A Append-Only Guarantee</span>
            <p className="leading-relaxed">Every rated CDR produces an immutable <code className="font-mono font-semibold">RatedCharge</code> record linked to an Evidence Ledger hash (<code className="font-mono text-[11px]">evidence_id</code>). Rated charges cannot be edited or deleted once accumulated.</p>
          </div>
        </div>
      )}

      {/* Modal: New Balance Account */}
      {accountModalOpen && (
        <Modal
          title="Create OCS Balance Account"
          subtitle="Provision a subscriber wallet with initial credit in integer minor units."
          onClose={() => setAccountModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setAccountModalOpen(false)}
              onConfirm={() => createAccountMutation.mutate()}
              confirmLabel="Create Account"
              pendingLabel="Creating…"
              pending={createAccountMutation.isPending}
              disabled={!accountForm.subscriber_id}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <Field label="Subscriber ID" hint="UUID of the subscriber profile.">
              <input
                className={inputMonoClass}
                value={accountForm.subscriber_id}
                onChange={(e) => setAccountForm({ ...accountForm, subscriber_id: e.target.value })}
                placeholder="e.g. 10000000-0000-0000-0000-000000000001"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Initial Balance (Minor Units)" hint="5000 = $50.00">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={accountForm.initial_balance_minor_units}
                  onChange={(e) => setAccountForm({ ...accountForm, initial_balance_minor_units: Number(e.target.value) })}
                />
              </Field>
              <Field label="Currency Code">
                <input
                  className={inputMonoClass}
                  value={accountForm.currency_code}
                  onChange={(e) => setAccountForm({ ...accountForm, currency_code: e.target.value.toUpperCase() })}
                  maxLength={3}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Prepaid Reservation */}
      {reserveModalOpen && (
        <Modal
          title="Reserve Prepaid Balance Hold"
          subtitle="Hold funds on subscriber wallet before allowing real-time session."
          onClose={() => setReserveModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setReserveModalOpen(false)}
              onConfirm={() => reserveMutation.mutate()}
              confirmLabel="Hold Reservation"
              pendingLabel="Holding…"
              pending={reserveMutation.isPending}
              disabled={!reserveForm.subscriber_id || reserveForm.amount_minor_units <= 0}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <Field label="Subscriber ID">
              <input
                className={inputMonoClass}
                value={reserveForm.subscriber_id}
                onChange={(e) => setReserveForm({ ...reserveForm, subscriber_id: e.target.value })}
                placeholder="Subscriber UUID"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Amount (Minor Units)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={reserveForm.amount_minor_units}
                  onChange={(e) => setReserveForm({ ...reserveForm, amount_minor_units: Number(e.target.value) })}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputMonoClass}
                  value={reserveForm.currency_code}
                  onChange={(e) => setReserveForm({ ...reserveForm, currency_code: e.target.value.toUpperCase() })}
                  maxLength={3}
                />
              </Field>
              <Field label="Service Type">
                <select
                  className={inputClass}
                  value={reserveForm.service_type}
                  onChange={(e) => setReserveForm({ ...reserveForm, service_type: e.target.value })}
                >
                  <option value="VOICE">VOICE</option>
                  <option value="DATA">DATA</option>
                  <option value="SMS">SMS</option>
                  <option value="ROAMING">ROAMING</option>
                </select>
              </Field>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Rate Postpaid CDR */}
      {rateModalOpen && (
        <Modal
          title="Rate Postpaid Usage CDR"
          subtitle="Calculate charge and accumulate directly into the subscriber's active billing cycle."
          onClose={() => setRateModalOpen(false)}
          footer={
            <ModalActions
              onCancel={() => setRateModalOpen(false)}
              onConfirm={() => rateMutation.mutate()}
              confirmLabel="Rate CDR"
              pendingLabel="Rating…"
              pending={rateMutation.isPending}
              disabled={!rateForm.subscriber_id || !rateForm.account_id}
            />
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Subscriber ID">
                <input
                  className={inputMonoClass}
                  value={rateForm.subscriber_id}
                  onChange={(e) => setRateForm({ ...rateForm, subscriber_id: e.target.value })}
                  placeholder="Subscriber UUID"
                />
              </Field>
              <Field label="Account ID">
                <input
                  className={inputMonoClass}
                  value={rateForm.account_id}
                  onChange={(e) => setRateForm({ ...rateForm, account_id: e.target.value })}
                  placeholder="Billing Account UUID"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Usage Type">
                <select
                  className={inputClass}
                  value={rateForm.usage_type}
                  onChange={(e) => setRateForm({ ...rateForm, usage_type: e.target.value })}
                >
                  <option value="DATA">DATA</option>
                  <option value="VOICE">VOICE</option>
                  <option value="SMS">SMS</option>
                  <option value="ROAMING">ROAMING</option>
                  <option value="ILD">ILD</option>
                </select>
              </Field>
              <Field label="Quantity">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={rateForm.quantity}
                  onChange={(e) => setRateForm({ ...rateForm, quantity: Number(e.target.value) })}
                />
              </Field>
              <Field label="Quantity Unit">
                <input
                  className={inputClass}
                  value={rateForm.quantity_unit}
                  onChange={(e) => setRateForm({ ...rateForm, quantity_unit: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Charge (Minor Units)">
                <input
                  type="number"
                  className={inputMonoClass}
                  value={rateForm.amount_minor_units}
                  onChange={(e) => setRateForm({ ...rateForm, amount_minor_units: Number(e.target.value) })}
                />
              </Field>
              <Field label="Currency">
                <input
                  className={inputMonoClass}
                  value={rateForm.currency_code}
                  onChange={(e) => setRateForm({ ...rateForm, currency_code: e.target.value.toUpperCase() })}
                  maxLength={3}
                />
              </Field>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
