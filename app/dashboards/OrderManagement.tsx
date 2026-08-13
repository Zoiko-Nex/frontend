"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/admin/client";
import { formatMoney } from "@/lib/admin/money";
import { ENVELOPE, errMessage, isNotFound, listOf, shortId } from "@/lib/admin/envelope";
import {
  ORDER_TRANSITIONS,
  PROVISIONING_TRANSITIONS,
  SIM_TRANSITIONS,
} from "@/lib/admin/transitions";
import {
  DetailList,
  DetailToggle,
  RecordDetail,
  StatusPill,
  TableState,
  TransitionButtons,
} from "@/components/admin/primitives";

/**
 * Orders, Provisioning & SIM lifecycle.
 *
 * Three separate state machines are driven from here, and every one of them is
 * mirrored from the backend rather than guessed:
 *
 *   Order         PENDING → VALIDATING → CONFIRMED → PROVISIONING → ACTIVE → COMPLETED
 *   Provisioning  PENDING → IN_PROGRESS → ACTIVATED → (SUSPENDED) → DEACTIVATED
 *   SIM           INVENTORY → ASSIGNED → ACTIVATED → (SUSPENDED) → TERMINATED/REPLACED
 *
 * The tables below are the source of truth for which buttons appear. Offering an
 * illegal action would produce a 422 the operator cannot interpret, so a
 * transition that the backend forbids is never rendered.
 *
 * Note on subscriber names: the customer API exposes no name. Party data is
 * PII-tokenised (P0-7), so identity here is the customer id plus type/segment.
 * Rendering "undefined undefined" or inventing a name would both be worse.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  customer_id: string;
  account_id: string;
  subscriber_id?: string;
  status: string;
  order_type: string;
  currency_code: string;
  jurisdiction_code?: string;
  country_code?: string;
  failure_reason?: string;
  created_at: string;
  updated_at?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  offer_id?: string;
  quantity: number;
  amount_minor_units: number;
  currency_code: string;
}

interface Customer {
  id: string;
  party_id: string;
  customer_type: string;
  segment?: string;
  lifecycle_status: string;
  kyc_status?: string;
}

interface Account {
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  currency_code: string;
  status: string;
}

interface Product {
  id: string;
  product_name: string;
  product_type?: string;
  charging_model?: string;
  currency_code: string;
  status: string;
}

/** Price lives on price rules, never on the product itself. */
interface PriceRule {
  id: string;
  product_id: string;
  amount_minor_units: number;
  currency_code: string;
  charge_structure?: string;
  billing_period?: string;
  effective_from?: string;
}

interface Provisioning {
  id: string;
  order_id: string;
  customer_id?: string;
  status: string;
  network_identity?: string;
  service_type?: string;
  provider_ref?: string;
  jurisdiction_code?: string;
}

interface SIM {
  id: string;
  iccid: string;
  eid?: string;
  imsi?: string;
  msisdn?: string;
  sim_type: string;
  status: string;
  customer_id?: string;
  order_id?: string;
}

/** Order types the backend accepts — validOrderTypes in the order domain. */
const ORDER_TYPES = [
  "NEW_SERVICE",
  "ADD_ON",
  "UPGRADE",
  "DOWNGRADE",
  "CANCELLATION",
  "PORT_IN",
  "PORT_OUT",
  "SIM_REPLACEMENT",
  "ESIM_ACTIVATION",
  "RENEWAL",
];

/** validAccountTypes in the customer-account domain. */
const ACCOUNT_TYPES = ["RETAIL", "ENTERPRISE", "WHOLESALE", "PARTNER", "GOVERNMENT", "DEPARTMENT"];

const SIM_TYPES = ["PHYSICAL", "ESIM"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderManagement() {
  const qc = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [panel, setPanel] = useState<"saga" | "network">("saga");

  // ── Orders ────────────────────────────────────────────────────────────────
  const ordersQ = useQuery({
    queryKey: ["orders", "list"],
    queryFn: async () => listOf<Order>(await api.get("order", "/v1/orders"), ENVELOPE.items),
  });
  const orders = ordersQ.data ?? [];

  // Read detail from the dedicated endpoint rather than the list row: after a
  // transition the list may still be showing the previous status.
  const orderDetailQ = useQuery({
    queryKey: ["orders", "detail", selectedOrderId],
    queryFn: () => api.get<Order>("order", `/v1/orders/${selectedOrderId}`),
    enabled: !!selectedOrderId,
  });
  const selectedOrder = orderDetailQ.data ?? orders.find((o) => o.id === selectedOrderId);

  const orderItemsQ = useQuery({
    queryKey: ["orders", "items", selectedOrderId],
    queryFn: async () =>
      listOf<OrderItem>(await api.get("order", `/v1/orders/${selectedOrderId}/items`), ENVELOPE.items),
    enabled: !!selectedOrderId,
  });
  const orderItems = orderItemsQ.data ?? [];

  // ── Customers ─────────────────────────────────────────────────────────────
  const customersQ = useQuery({
    queryKey: ["customers", "for-orders"],
    queryFn: async () => listOf<Customer>(await api.get("customer", "/v1/customers"), ENVELOPE.customers),
  });
  const customers = customersQ.data ?? [];
  // The customer lifecycle field is lifecycle_status; there is no `status`.
  const activeCustomers = customers.filter((c) => c.lifecycle_status === "ACTIVE");

  const customerLabel = (id: string | undefined) => {
    if (!id) return "—";
    const c = customers.find((x) => x.id === id);
    if (!c) return shortId(id);
    const segment = c.segment ? ` · ${c.segment}` : "";
    return `${shortId(id)} (${c.customer_type}${segment})`;
  };

  // ── Order history for the selected order's customer ────────────────────────
  const customerOrdersQ = useQuery({
    queryKey: ["orders", "by-customer", selectedOrder?.customer_id],
    queryFn: async () =>
      listOf<Order>(
        await api.get("order", `/v1/customers/${selectedOrder!.customer_id}/orders`),
        ENVELOPE.items
      ),
    enabled: !!selectedOrder?.customer_id,
  });
  const customerOrders = customerOrdersQ.data ?? [];

  // Orders on the same billing ACCOUNT. Distinct from the per-customer list above:
  // a customer can hold several accounts, and anything billing-related is scoped to
  // the account rather than the person.
  const accountOrdersQ = useQuery({
    queryKey: ["orders", "by-account", selectedOrder?.account_id],
    queryFn: async () =>
      listOf<Order>(
        await api.get("order", `/v1/accounts/${selectedOrder!.account_id}/orders`),
        ENVELOPE.items
      ),
    enabled: !!selectedOrder?.account_id,
  });
  const accountOrders = accountOrdersQ.data ?? [];

  // ── Provisioning for the selected order ───────────────────────────────────
  // 404 means provisioning has not been started, which is a normal state.
  const provisioningQ = useQuery({
    queryKey: ["provisioning", "by-order", selectedOrderId],
    queryFn: async () => {
      try {
        return await api.get<Provisioning>("order", `/v1/orders/${selectedOrderId}/provisioning`);
      } catch (e) {
        if (isNotFound(e)) return null;
        throw e;
      }
    },
    enabled: !!selectedOrderId,
  });
  const provisioning = provisioningQ.data ?? null;

  // The PATCH response carries only {id, status, network_identity, provider_ref};
  // this reads the whole record back so the panel does not display a half-populated
  // one after a transition.
  const provisioningDetailQ = useQuery({
    queryKey: ["provisioning", "detail", provisioning?.id],
    queryFn: () => api.get<Provisioning>("order", `/v1/provisioning/${provisioning!.id}`),
    enabled: !!provisioning?.id,
  });
  const provisioningRecord = provisioningDetailQ.data ?? provisioning;

  // ── SIMs for the selected order's customer ────────────────────────────────
  const simsQ = useQuery({
    queryKey: ["sims", "by-customer", selectedOrder?.customer_id],
    queryFn: async () =>
      listOf<SIM>(await api.get("order", `/v1/customers/${selectedOrder!.customer_id}/sims`), ENVELOPE.items),
    enabled: !!selectedOrder?.customer_id,
  });
  const allCustomerSims = simsQ.data ?? [];
  const orderSims = allCustomerSims.filter((s) => s.order_id === selectedOrderId);
  const assignableSims = allCustomerSims.filter((s) => s.status === "INVENTORY");

  const refreshOrder = () => {
    qc.invalidateQueries({ queryKey: ["orders", "list"] });
    qc.invalidateQueries({ queryKey: ["orders", "detail", selectedOrderId] });
    qc.invalidateQueries({ queryKey: ["orders", "by-customer"] });
  };
  const refreshNetwork = () => {
    qc.invalidateQueries({ queryKey: ["provisioning", "by-order", selectedOrderId] });
    qc.invalidateQueries({ queryKey: ["sims", "by-customer"] });
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const advanceOrder = useMutation({
    mutationFn: ({ orderId, action }: { orderId: string; action: string }) =>
      api.patch(
        "order",
        `/v1/orders/${orderId}`,
        {
          action,
          reason:
            action === "FAIL" || action === "CANCEL"
              ? "Compensating action triggered by operator"
              : undefined,
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: (_r, v) => {
      toast.success(`Order ${v.action} accepted`);
      refreshOrder();
    },
    onError: (e) => toast.error(errMessage(e, "Order transition failed")),
  });

  const createProvisioning = useMutation({
    mutationFn: (input: { serviceType: string; networkIdentity: string }) =>
      api.post<Provisioning>(
        "order",
        "/v1/provisioning",
        {
          order_id: selectedOrder!.id,
          customer_id: selectedOrder!.customer_id,
          account_id: selectedOrder!.account_id,
          subscriber_id: selectedOrder!.subscriber_id || undefined,
          product_id: orderItems[0]?.product_id || undefined,
          network_identity: input.networkIdentity || undefined,
          service_type: input.serviceType,
          jurisdiction_code: selectedOrder!.jurisdiction_code || undefined,
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: () => {
      toast.success("Provisioning record created");
      refreshNetwork();
    },
    onError: (e) => toast.error(errMessage(e, "Failed to create provisioning record")),
  });

  const advanceProvisioning = useMutation({
    mutationFn: (input: { action: string; providerRef?: string; networkIdentity?: string }) =>
      api.patch(
        "order",
        `/v1/provisioning/${provisioning!.id}`,
        {
          action: input.action,
          provider_ref: input.providerRef || undefined,
          network_identity: input.networkIdentity || undefined,
          reason: ["FAIL", "SUSPEND", "DEACTIVATE"].includes(input.action)
            ? "Operator action from ops console"
            : undefined,
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: (_r, v) => {
      toast.success(`Provisioning ${v.action} accepted`);
      refreshNetwork();
    },
    onError: (e) => toast.error(errMessage(e, "Provisioning transition failed")),
  });

  const addSim = useMutation({
    mutationFn: (input: { iccid: string; simType: string; eid: string; imsi: string; msisdn: string }) =>
      api.post<SIM>(
        "order",
        "/v1/sims",
        {
          iccid: input.iccid,
          sim_type: input.simType,
          eid: input.eid || undefined,
          imsi: input.imsi || undefined,
          msisdn: input.msisdn || undefined,
          jurisdiction_code: selectedOrder?.jurisdiction_code || undefined,
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: () => {
      toast.success("SIM added to inventory");
      refreshNetwork();
    },
    onError: (e) => toast.error(errMessage(e, "Failed to add SIM")),
  });

  const advanceSim = useMutation({
    mutationFn: (input: { simId: string; action: string; msisdn?: string }) =>
      api.patch(
        "order",
        `/v1/sims/${input.simId}`,
        {
          action: input.action,
          // ASSIGN binds the SIM to this order and subscriber.
          customer_id: input.action === "ASSIGN" ? selectedOrder!.customer_id : undefined,
          account_id: input.action === "ASSIGN" ? selectedOrder!.account_id : undefined,
          subscriber_id: input.action === "ASSIGN" ? selectedOrder!.subscriber_id || undefined : undefined,
          order_id: input.action === "ASSIGN" ? selectedOrder!.id : undefined,
          msisdn: input.action === "ACTIVATE" ? input.msisdn || undefined : undefined,
          reason: ["SUSPEND", "TERMINATE", "REPLACE"].includes(input.action)
            ? "Operator action from ops console"
            : undefined,
        },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: (_r, v) => {
      toast.success(`SIM ${v.action} accepted`);
      refreshNetwork();
    },
    onError: (e) => toast.error(errMessage(e, "SIM transition failed")),
  });


  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      <div className="self-stretch inline-flex justify-between items-center flex-wrap gap-3">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Orders, Provisioning &amp; SIM Lifecycle
          </h2>
          <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Drive the commercial order saga, the network provisioning record and SIM/eSIM state. Only
            transitions the backend permits are offered.
          </p>
        </div>

        <button
          onClick={() => setCreateOrderOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
        >
          + Place Telecom Order
        </button>
      </div>

      <div className="self-stretch grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full">
        {/* Orders list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ORDER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBMITTED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {ordersQ.isLoading || ordersQ.isError || orders.length === 0 ? (
                  <TableState
                    colSpan={5}
                    loading={ordersQ.isLoading}
                    error={ordersQ.isError ? ordersQ.error : undefined}
                    empty={orders.length === 0}
                    loadingLabel="Loading orders…"
                    emptyLabel="No orders placed yet."
                  />
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`hover:bg-slate-50/40 transition cursor-pointer ${
                        o.id === selectedOrderId ? "bg-sky-50/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-800 font-bold">{shortId(o.id)}</span>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{o.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700 font-mono">
                        {customerLabel(o.customer_id)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{o.order_type}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={o.status} />
                        {o.failure_reason && (
                          <div className="text-[9px] text-rose-500 mt-1 max-w-[180px] whitespace-normal">
                            {o.failure_reason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right rail */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
          {!selectedOrder ? (
            <div className="text-slate-400 text-xs py-8 text-center">
              Select an order to drive its saga and network state.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-slate-800 font-bold">{shortId(selectedOrder.id)}</span>
                  <StatusPill status={selectedOrder.status} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {customerLabel(selectedOrder.customer_id)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Account {shortId(selectedOrder.account_id)} · {selectedOrder.order_type}
                </div>
              </div>

              <div className="flex gap-1.5">
                {(["saga", "network"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPanel(p)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      panel === p
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {p === "saga" ? "Order saga" : "Network state"}
                  </button>
                ))}
              </div>

              {panel === "saga" ? (
                <SagaPanel
                  order={selectedOrder}
                  orderItems={orderItems}
                  itemsLoading={orderItemsQ.isLoading}
                  pending={advanceOrder.isPending}
                  onAdvance={(action) => advanceOrder.mutate({ orderId: selectedOrder.id, action })}
                  customerOrders={customerOrders}
                  accountOrders={accountOrders}
                  onSelectOrder={setSelectedOrderId}
                />
              ) : (
                <NetworkPanel
                  provisioning={provisioningRecord}
                  provisioningLoading={provisioningQ.isLoading}
                  provisioningError={provisioningQ.isError ? provisioningQ.error : null}
                  onCreateProvisioning={(v) => createProvisioning.mutate(v)}
                  creatingProvisioning={createProvisioning.isPending}
                  onAdvanceProvisioning={(v) => advanceProvisioning.mutate(v)}
                  advancingProvisioning={advanceProvisioning.isPending}
                  orderSims={orderSims}
                  assignableSims={assignableSims}
                  simsLoading={simsQ.isLoading}
                  onAddSim={(v) => addSim.mutate(v)}
                  addingSim={addSim.isPending}
                  onAdvanceSim={(v) => advanceSim.mutate(v)}
                  advancingSim={advanceSim.isPending}
                />
              )}
            </>
          )}
        </div>
      </div>

      {createOrderOpen && (
        <PlaceOrderModal
          activeCustomers={activeCustomers}
          customersLoading={customersQ.isLoading}
          onClose={() => setCreateOrderOpen(false)}
          onPlaced={(orderId) => {
            setCreateOrderOpen(false);
            setSelectedOrderId(orderId);
            qc.invalidateQueries({ queryKey: ["orders", "list"] });
          }}
        />
      )}
    </div>
  );
}

// ─── Saga panel ───────────────────────────────────────────────────────────────

function SagaPanel({
  order,
  orderItems,
  itemsLoading,
  pending,
  onAdvance,
  customerOrders,
  accountOrders,
  onSelectOrder,
}: {
  order: Order;
  orderItems: OrderItem[];
  itemsLoading: boolean;
  pending: boolean;
  onAdvance: (action: string) => void;
  customerOrders: Order[];
  accountOrders: Order[];
  onSelectOrder: (id: string) => void;
}) {
  const itemsTotal = orderItems.reduce(
    (sum, i) => sum + (i.amount_minor_units || 0) * (i.quantity || 1),
    0
  );
  const itemsCurrency = orderItems[0]?.currency_code ?? order.currency_code;
  const mixedCurrency = new Set(orderItems.map((i) => i.currency_code).filter(Boolean)).size > 1;

  return (
    <div className="flex flex-col gap-4 text-xs text-slate-600">
      <div>
        <span className="font-semibold text-slate-700 block mb-2">Line items</span>
        {itemsLoading ? (
          <div className="text-slate-400 italic">Loading items...</div>
        ) : orderItems.length === 0 ? (
          <div className="text-slate-400 italic">No line items on this order.</div>
        ) : (
          <div className="space-y-2">
            {orderItems.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200">
                <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                  <span className="font-mono">{shortId(item.product_id)}</span>
                  <span className="font-mono">x{item.quantity}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Price locked at {formatMoney(item.amount_minor_units, item.currency_code)}
                </div>
              </div>
            ))}
            <div className="flex justify-between text-[11px] font-bold text-slate-800 pt-1">
              <span>Total</span>
              <span className="font-mono">
                {mixedCurrency ? "mixed currencies" : formatMoney(itemsTotal, itemsCurrency)}
              </span>
            </div>
            {mixedCurrency && (
              <div className="text-[10px] text-rose-600">
                Line items use more than one currency, so no single total is meaningful.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <span className="text-lime-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            Order saga
          </span>
          <span className="text-xs font-bold font-mono text-white bg-white/10 px-2 py-0.5 rounded">
            {order.status}
          </span>
        </div>

        <TransitionButtons
          table={ORDER_TRANSITIONS}
          status={order.status}
          onAction={onAdvance}
          pending={pending}
          variant="dark"
        />
      </div>

      <RelatedOrders
        title="Other orders for this subscriber"
        orders={customerOrders}
        currentOrderID={order.id}
        onSelectOrder={onSelectOrder}
      />
      {/* Account-scoped, because billing and disputes attach to the account rather
          than the person, and a customer may hold several. */}
      <RelatedOrders
        title="Other orders on this billing account"
        orders={accountOrders}
        currentOrderID={order.id}
        onSelectOrder={onSelectOrder}
      />
    </div>
  );
}


/** Related orders, deduped against the one already open. */
function RelatedOrders({
  title,
  orders,
  currentOrderID,
  onSelectOrder,
}: {
  title: string;
  orders: Order[];
  currentOrderID: string;
  onSelectOrder: (id: string) => void;
}) {
  const others = orders.filter((o) => o.id !== currentOrderID);
  if (others.length === 0) return null;
  return (
    <div className="border-t border-slate-100 pt-3">
      <span className="font-semibold text-slate-700 block mb-2">{title}</span>
      <div className="space-y-1.5">
        {others.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelectOrder(o.id)}
            className="w-full flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 rounded-lg px-2.5 py-2 transition cursor-pointer text-left"
          >
            <span className="font-mono text-[10px] text-slate-700">{shortId(o.id)}</span>
            <span className="text-[9px] text-slate-500">{o.order_type}</span>
            <StatusPill status={o.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Network panel ────────────────────────────────────────────────────────────

const SERVICE_TYPES = ["MOBILE_VOICE", "MOBILE_DATA", "MOBILE_SMS", "ESIM", "FIXED_LINE", "BROADBAND"];

function NetworkPanel({
  provisioning,
  provisioningLoading,
  provisioningError,
  onCreateProvisioning,
  creatingProvisioning,
  onAdvanceProvisioning,
  advancingProvisioning,
  orderSims,
  assignableSims,
  simsLoading,
  onAddSim,
  addingSim,
  onAdvanceSim,
  advancingSim,
}: {
  provisioning: Provisioning | null;
  provisioningLoading: boolean;
  provisioningError: unknown;
  onCreateProvisioning: (v: { serviceType: string; networkIdentity: string }) => void;
  creatingProvisioning: boolean;
  onAdvanceProvisioning: (v: { action: string; providerRef?: string; networkIdentity?: string }) => void;
  advancingProvisioning: boolean;
  orderSims: SIM[];
  assignableSims: SIM[];
  simsLoading: boolean;
  onAddSim: (v: { iccid: string; simType: string; eid: string; imsi: string; msisdn: string }) => void;
  addingSim: boolean;
  onAdvanceSim: (v: { simId: string; action: string; msisdn?: string }) => void;
  advancingSim: boolean;
}) {
  const [serviceType, setServiceType] = useState(SERVICE_TYPES[1]);
  const [networkIdentity, setNetworkIdentity] = useState("");
  const [providerRef, setProviderRef] = useState("");
  const [activationIdentity, setActivationIdentity] = useState("");
  const [simForm, setSimForm] = useState({ iccid: "", simType: "ESIM", eid: "", imsi: "", msisdn: "" });
  const [activateMsisdn, setActivateMsisdn] = useState<Record<string, string>>({});
  const [addSimOpen, setAddSimOpen] = useState(false);
  const [expandedSim, setExpandedSim] = useState<string | null>(null);


  return (
    <div className="flex flex-col gap-4 text-xs text-slate-600">
      {/* Provisioning record */}
      <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-[11px]">Provisioning record</span>
          {provisioning && <StatusPill status={provisioning.status} />}
        </div>

        {provisioningLoading ? (
          <div className="text-slate-400 italic">Loading...</div>
        ) : provisioningError ? (
          <div className="text-rose-600 text-[10px]">
            {errMessage(provisioningError, "Could not load the provisioning record.")}
          </div>
        ) : !provisioning ? (
          <>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              No provisioning record exists for this order yet. Nothing has been requested from the
              network.
            </p>
            <label className="text-[10px] font-semibold text-slate-600">Service type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-sky-500 text-[11px]"
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <label className="text-[10px] font-semibold text-slate-600">
              Network identity <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              value={networkIdentity}
              onChange={(e) => setNetworkIdentity(e.target.value)}
              placeholder="ICCID / IMSI"
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 outline-none focus:border-sky-500 font-mono text-[11px]"
            />
            <button
              onClick={() => onCreateProvisioning({ serviceType, networkIdentity })}
              disabled={creatingProvisioning}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
            >
              {creatingProvisioning ? "Creating..." : "Create provisioning record"}
            </button>
          </>
        ) : (
          <>
            <DetailList
              rows={[
                ["Record", shortId(provisioning.id)],
                ["Service", provisioning.service_type],
                ["Network identity", provisioning.network_identity || "not yet assigned"],
                ["Provider ref", provisioning.provider_ref],
              ]}
            />

            {provisioning.status === "IN_PROGRESS" && (
              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-2">
                <label className="text-[10px] font-semibold text-slate-600">
                  Provider reference &amp; network identity to record on activation
                </label>
                <input
                  value={providerRef}
                  onChange={(e) => setProviderRef(e.target.value)}
                  placeholder="Provider ref (e.g. RSP order id)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
                />
                <input
                  value={activationIdentity}
                  onChange={(e) => setActivationIdentity(e.target.value)}
                  placeholder="Network identity (ICCID / IMSI)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>
            )}

            <TransitionButtons
              table={PROVISIONING_TRANSITIONS}
              status={provisioning.status}
              pending={advancingProvisioning}
              className="pt-1"
              onAction={(action) =>
                onAdvanceProvisioning({
                  action,
                  // Only carried on activation: the other transitions take no
                  // network identity, and sending one would be misleading.
                  providerRef: action === "ACTIVATE" ? providerRef : undefined,
                  networkIdentity: action === "ACTIVATE" ? activationIdentity : undefined,
                })
              }
            />
          </>
        )}
      </div>

      {/* SIMs */}
      <div className="border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-[11px]">SIM / eSIM</span>
          <button
            onClick={() => setAddSimOpen((v) => !v)}
            className="text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
          >
            {addSimOpen ? "Cancel" : "+ Add to inventory"}
          </button>
        </div>

        {addSimOpen && (
          <div className="flex flex-col gap-1.5 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
            <input
              value={simForm.iccid}
              onChange={(e) => setSimForm({ ...simForm, iccid: e.target.value })}
              placeholder="ICCID (required)"
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
            />
            <select
              value={simForm.simType}
              onChange={(e) => setSimForm({ ...simForm, simType: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-sky-500 text-[11px]"
            >
              {SIM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {simForm.simType === "ESIM" && (
              <input
                value={simForm.eid}
                onChange={(e) => setSimForm({ ...simForm, eid: e.target.value })}
                placeholder="EID (eSIM only)"
                className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
              />
            )}
            <input
              value={simForm.imsi}
              onChange={(e) => setSimForm({ ...simForm, imsi: e.target.value })}
              placeholder="IMSI (optional)"
              className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
            />
            <button
              onClick={() => {
                onAddSim(simForm);
                setSimForm({ iccid: "", simType: "ESIM", eid: "", imsi: "", msisdn: "" });
                setAddSimOpen(false);
              }}
              disabled={addingSim || !simForm.iccid.trim()}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded transition text-[10px] cursor-pointer"
            >
              {addingSim ? "Adding..." : "Add SIM"}
            </button>
          </div>
        )}

        {simsLoading ? (
          <div className="text-slate-400 italic">Loading SIMs...</div>
        ) : (
          <>
            {orderSims.length === 0 && (
              <p className="text-[10px] text-slate-500">No SIM is assigned to this order.</p>
            )}

            {orderSims.map((s) => {
              return (
                <div key={s.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-800 font-bold break-all">{s.iccid}</span>
                    <StatusPill status={s.status} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[9px] text-slate-500 font-mono">
                      {s.sim_type}
                      {s.msisdn ? ` · ${s.msisdn}` : ""}
                    </div>
                    <DetailToggle
                      open={expandedSim === s.id}
                      onToggle={() => setExpandedSim(expandedSim === s.id ? null : s.id)}
                      className="whitespace-nowrap"
                    />
                  </div>
                  {expandedSim === s.id && <RecordDetail service="order" path={`/v1/sims/${s.id}`} queryKey={["sims", "detail", s.id]} />}

                  {s.status === "ASSIGNED" && (
                    <input
                      value={activateMsisdn[s.id] ?? ""}
                      onChange={(e) => setActivateMsisdn({ ...activateMsisdn, [s.id]: e.target.value })}
                      placeholder="MSISDN to activate with"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-sky-500 font-mono text-[10px]"
                    />
                  )}

                  <TransitionButtons
                    table={SIM_TRANSITIONS}
                    status={s.status}
                    pending={advancingSim}
                    onAction={(action) =>
                      onAdvanceSim({
                        simId: s.id,
                        action,
                        msisdn: action === "ACTIVATE" ? activateMsisdn[s.id] : undefined,
                      })
                    }
                  />
                </div>
              );
            })}

            {assignableSims.length > 0 && (
              <div className="border-t border-slate-100 pt-2 flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-slate-600">
                  Unassigned inventory for this subscriber
                </span>
                {assignableSims.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-600 break-all">{s.iccid}</span>
                    <button
                      onClick={() => onAdvanceSim({ simId: s.id, action: "ASSIGN" })}
                      disabled={advancingSim}
                      className="px-2 py-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded font-bold text-[9px] cursor-pointer whitespace-nowrap"
                    >
                      Assign to order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Place order modal ────────────────────────────────────────────────────────

function PlaceOrderModal({
  activeCustomers,
  customersLoading,
  onClose,
  onPlaced,
}: {
  activeCustomers: Customer[];
  customersLoading: boolean;
  onClose: () => void;
  onPlaced: (orderId: string) => void;
}) {
  const [customerId, setCustomerId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [productId, setProductId] = useState("");
  const [priceRuleId, setPriceRuleId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState(ORDER_TYPES[0]);
  const [jurisdiction, setJurisdiction] = useState("GB");
  const [country, setCountry] = useState("GB");
  const [newAccount, setNewAccount] = useState({ account_number: "", account_type: "RETAIL", currency_code: "GBP" });
  const [showNewAccount, setShowNewAccount] = useState(false);

  const accountsQ = useQuery({
    queryKey: ["accounts", "by-customer", customerId],
    queryFn: async () =>
      listOf<Account>(await api.get("customer", `/v1/customers/${customerId}/accounts`), ENVELOPE.accounts),
    enabled: !!customerId,
  });
  const accounts = accountsQ.data ?? [];

  const productsQ = useQuery({
    queryKey: ["catalog", "products-for-orders"],
    queryFn: async () => listOf<Product>(await api.get("catalogue", "/v1/products"), ENVELOPE.products),
  });
  const activeProducts = (productsQ.data ?? []).filter((p) => p.status === "ACTIVE");

  // Price is not on the product — it lives on price rules. Without one there is no
  // price to lock onto the order line, and inventing a fallback would charge the
  // customer an amount nobody chose.
  const priceRulesQ = useQuery({
    queryKey: ["catalog", "price-rules", productId],
    queryFn: async () =>
      listOf<PriceRule>(
        await api.get("catalogue", `/v1/products/${productId}/price-rules`),
        ENVELOPE.priceRules
      ),
    enabled: !!productId,
  });
  // Memoised so the identity is stable between renders: the `?? []` fallback would
  // otherwise produce a new array every time and defeat the memo below.
  const priceRules = useMemo(() => priceRulesQ.data ?? [], [priceRulesQ.data]);

  const selectedRule = useMemo(
    () => priceRules.find((r) => r.id === priceRuleId) ?? priceRules[0],
    [priceRules, priceRuleId]
  );

  // The catalog version that priced this product. ordering.orders and
  // ordering.order_items both require it: it is the record of which catalog
  // produced the agreed price, and without it the order cannot be re-rated or
  // defended later. It is read from the catalogue rather than assumed — the
  // previous hardcoded "v2026-06-01" claimed provenance that never existed.
  const commercialVersionQ = useQuery({
    queryKey: ["catalog", "commercial-version", productId],
    queryFn: () =>
      api.get<{ catalog_version_id: string; policy_version_id?: string }>(
        "catalogue",
        `/v1/products/${productId}/commercial-version`
      ),
    enabled: !!productId,
    retry: false, // a 422 here is a product configuration problem, not a transient fault
  });
  const commercialVersion = commercialVersionQ.data ?? null;

  const createOrder = useMutation({
    mutationFn: async () => {
      if (!selectedRule) {
        throw new Error("no price rule selected");
      }
      if (!commercialVersion?.catalog_version_id) {
        // The backend now rejects this too, but failing here gives a clearer
        // message than a 422 from two calls deep.
        throw new Error("no catalog version resolved for this product");
      }
      const order = await api.post<Order>(
        "order",
        "/v1/orders",
        {
          customer_id: customerId,
          account_id: accountId,
          order_type: orderType,
          // Currency comes from the price that will actually be charged, so the
          // order header and its lines cannot disagree.
          currency_code: selectedRule.currency_code,
          jurisdiction_code: jurisdiction,
          country_code: country,
          // Read from the catalogue, never invented: this is what proves which
          // catalog version produced the agreed price.
          catalog_version_id: commercialVersion.catalog_version_id,
          policy_version_id: commercialVersion.policy_version_id || undefined,
        },
        { idempotencyKey: api.uuid() }
      );

      await api.post(
        "order",
        `/v1/orders/${order.id}/items`,
        {
          product_id: productId,
          quantity,
          amount_minor_units: selectedRule.amount_minor_units,
          currency_code: selectedRule.currency_code,
          catalog_version_id: commercialVersion.catalog_version_id,
        },
        { idempotencyKey: api.uuid() }
      );

      return order;
    },
    onSuccess: (o) => {
      toast.success("Order created in PENDING state");
      onPlaced(o.id);
    },
    onError: (e) => toast.error(errMessage(e, "Failed to place order")),
  });

  const createAccount = useMutation({
    mutationFn: () =>
      api.post<Account>("customer", "/v1/accounts", {
        customer_id: customerId,
        account_number: newAccount.account_number,
        account_type: newAccount.account_type,
        currency_code: newAccount.currency_code,
      }),
    onSuccess: (a) => {
      toast.success("Billing account created");
      setAccountId(a.id);
      setShowNewAccount(false);
      accountsQ.refetch();
    },
    onError: (e) => toast.error(errMessage(e, "Failed to create billing account")),
  });

  const canSubmit =
    !!customerId &&
    !!accountId &&
    !!productId &&
    !!selectedRule &&
    // No catalog version means the order could not record which catalog priced it,
    // and the backend now refuses it. Blocking here explains why.
    !!commercialVersion?.catalog_version_id &&
    quantity >= 1 &&
    !createOrder.isPending;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[520px] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Place Telecom Order</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
          {/* Subscriber */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-semibold">Subscriber</label>
            {customersLoading ? (
              <div className="text-slate-400 italic">Loading subscribers...</div>
            ) : activeCustomers.length === 0 ? (
              <div className="text-slate-400 italic">
                No subscriber has lifecycle_status ACTIVE. Approve KYC for a customer first.
              </div>
            ) : (
              <select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setAccountId("");
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="">Select a subscriber...</option>
                {activeCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id.slice(0, 8)} · {c.customer_type}
                    {c.segment ? ` · ${c.segment}` : ""}
                  </option>
                ))}
              </select>
            )}
            <p className="text-[10px] text-slate-400">
              Customer names are not available: party data is PII-tokenised, so subscribers are
              identified by id.
            </p>
          </div>

          {/* Billing account */}
          {customerId && (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Billing account</label>
              {accountsQ.isLoading ? (
                <div className="text-slate-400 italic">Loading accounts...</div>
              ) : accounts.length > 0 ? (
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                >
                  <option value="">Select an account...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.account_number} · {a.account_type} · {a.currency_code} ({a.status})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-slate-500 italic">
                  This subscriber has no billing account. One must exist before an order can be
                  raised against it.
                </div>
              )}

              {!showNewAccount ? (
                <button
                  onClick={() => setShowNewAccount(true)}
                  className="self-start text-[10px] font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  + Create a billing account
                </button>
              ) : (
                <div className="flex flex-col gap-1.5 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <input
                    value={newAccount.account_number}
                    onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                    placeholder="Account number (required)"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
                  />
                  <select
                    value={newAccount.account_type}
                    onChange={(e) => setNewAccount({ ...newAccount, account_type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-sky-500 text-[11px]"
                  >
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input
                    value={newAccount.currency_code}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, currency_code: e.target.value.toUpperCase() })
                    }
                    placeholder="Currency (ISO 4217)"
                    maxLength={3}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 outline-none focus:border-sky-500 font-mono text-[11px]"
                  />
                  <button
                    onClick={() => createAccount.mutate()}
                    disabled={
                      createAccount.isPending ||
                      !newAccount.account_number.trim() ||
                      newAccount.currency_code.length !== 3
                    }
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded transition text-[10px] cursor-pointer"
                  >
                    {createAccount.isPending ? "Creating..." : "Create account"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Order type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-semibold">Order type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
            >
              {ORDER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-semibold">Catalog product</label>
            {productsQ.isLoading ? (
              <div className="text-slate-400 italic">Loading products...</div>
            ) : activeProducts.length === 0 ? (
              <div className="text-slate-400 italic">
                No ACTIVE product in the catalogue. Create and activate one first.
              </div>
            ) : (
              <select
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setPriceRuleId("");
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="">Select a product...</option>
                {activeProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name}
                    {p.charging_model ? ` · ${p.charging_model}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price rule */}
          {productId && (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Price</label>
              {priceRulesQ.isLoading ? (
                <div className="text-slate-400 italic">Loading price rules...</div>
              ) : priceRules.length === 0 ? (
                <div className="text-rose-600 text-[11px] leading-relaxed">
                  This product has no price rule, so there is no price to lock onto the order.
                  Add a price rule in Catalog Management before ordering it.
                </div>
              ) : (
                <>
                  <select
                    value={selectedRule?.id ?? ""}
                    onChange={(e) => setPriceRuleId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    {priceRules.map((r) => (
                      <option key={r.id} value={r.id}>
                        {formatMoney(r.amount_minor_units, r.currency_code)}
                        {r.billing_period ? ` / ${r.billing_period}` : ""}
                        {r.charge_structure ? ` · ${r.charge_structure}` : ""}
                      </option>
                    ))}
                  </select>
                  {priceRules.length > 1 && (
                    <p className="text-[10px] text-slate-400">
                      This product has {priceRules.length} price rules. The one selected is what gets
                      locked onto the order line.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Quantity + jurisdiction */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Jurisdiction</label>
              <input
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value.toUpperCase())}
                maxLength={5}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Catalog provenance. Surfaced rather than hidden, because it is what
              makes the price defensible later. */}
          {productId && (
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-semibold">Catalog version</label>
              {commercialVersionQ.isLoading ? (
                <div className="text-slate-400 italic">Resolving catalog version...</div>
              ) : commercialVersionQ.isError ? (
                <div className="text-rose-600 text-[11px] leading-relaxed">
                  {errMessage(
                    commercialVersionQ.error,
                    "Could not resolve the catalog version for this product."
                  )}
                  <div className="text-slate-500 mt-1">
                    An order cannot be placed without it: there would be no record of
                    which catalog priced it.
                  </div>
                </div>
              ) : (
                <div className="font-mono text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5">
                  {commercialVersion?.catalog_version_id}
                  {commercialVersion?.policy_version_id
                    ? ` · policy ${commercialVersion.policy_version_id}`
                    : ""}
                </div>
              )}
            </div>
          )}

          {selectedRule && quantity >= 1 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
              <span className="text-slate-600 font-semibold text-[11px]">Order line total</span>
              <span className="font-mono font-bold text-slate-800">
                {formatMoney(selectedRule.amount_minor_units * quantity, selectedRule.currency_code)}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => createOrder.mutate()}
            disabled={!canSubmit}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
          >
            {createOrder.isPending ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
