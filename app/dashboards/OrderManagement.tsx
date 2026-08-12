"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";

interface Order {
  id: string;
  customer_id: string;
  account_id: string;
  status: string;
  order_type: string;
  catalog_version_id: string;
  currency_code: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  amount_minor_units: number;
}

interface Customer {
  id: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface Product {
  id: string;
  product_name: string;
  amount_minor_units?: number;
  currency_code: string;
  status: string;
}

export default function OrderManagement() {
  const qc = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);

  // Form states
  const [orderForm, setProductSelection] = useState({
    customer_id: "",
    product_id: "",
    quantity: 1,
  });

  // Queries
  const ordersQ = useQuery({
    queryKey: ["orders", "list"],
    queryFn: () => api.get<{ items?: Order[] }>("order", "/v1/orders"),
  });
  const orders = ordersQ.data?.items ?? [];

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const orderItemsQ = useQuery({
    queryKey: ["orders", "items", selectedOrderId],
    queryFn: () =>
      selectedOrderId
        ? api.get<{ items?: OrderItem[] }>("order", `/v1/orders/${selectedOrderId}/items`)
        : Promise.reject("No order selected"),
    enabled: !!selectedOrderId,
  });
  const orderItems = orderItemsQ.data?.items ?? [];

  // Auxiliary data queries
  const customersQ = useQuery({
    queryKey: ["customers", "list-for-orders"],
    queryFn: async () => {
      const res = await api.get<{ items?: any[] }>("customer", "/v1/customers");
      const list = res.items ?? [];
      return Promise.all(
        list.map(async (c) => {
          try {
            const p = await api.get<any>("customer", `/v1/parties/${c.party_id}`);
            return { ...c, first_name: p.first_name, last_name: p.last_name };
          } catch {
            return c;
          }
        })
      );
    },
  });
  const customers = customersQ.data ?? [];
  const activeCustomers = customers.filter((c) => c.status === "ACTIVE");

  const productsQ = useQuery({
    queryKey: ["catalog", "products-for-orders"],
    queryFn: () => api.get<{ items?: Product[] }>("catalogue", "/v1/products"),
  });
  const activeProducts = (productsQ.data?.items ?? []).filter((p) => p.status === "ACTIVE");

  const selectedProduct = activeProducts.find((p) => p.id === orderForm.product_id);

  // Mutations
  const createOrderSaga = useMutation({
    mutationFn: async () => {
      const idempotencyKey = api.uuid();

      // Get an account ID associated with this customer
      let accountId = "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d";
      try {
        const accs = await api.get<{ items?: any[] }>("customer", `/v1/customers/${orderForm.customer_id}/accounts`);
        if (accs.items && accs.items.length > 0) {
          accountId = accs.items[0].id;
        } else {
          // Create a default billing account
          const newAcc = await api.post<any>("customer", "/v1/accounts", {
            customer_id: orderForm.customer_id,
            account_name: "Primary Telecom Account",
            currency_code: "GBP",
          });
          accountId = newAcc.id;
        }
      } catch {
        // Fallback to static account UUID
      }

      // 1. Create Order
      const newOrder = await api.post<Order>(
        "order",
        "/v1/orders",
        {
          customer_id: orderForm.customer_id,
          account_id: accountId,
          order_type: "NEW_SERVICE",
          catalog_version_id: "v2026-06-01",
          currency_code: "GBP",
          jurisdiction_code: "GB",
          country_code: "GB",
        },
        { idempotencyKey }
      );

      // 2. Add Line Item
      await api.post(
        "order",
        `/v1/orders/${newOrder.id}/items`,
        {
          product_id: orderForm.product_id,
          catalog_version_id: "v2026-06-01",
          quantity: orderForm.quantity,
          amount_minor_units: selectedProduct?.amount_minor_units ?? 999,
          currency_code: selectedProduct?.currency_code ?? "GBP",
        },
        { idempotencyKey: api.uuid() }
      );

      return newOrder;
    },
    onSuccess: (o) => {
      toast.success("Telecom order created in PENDING state");
      setCreateOrderOpen(false);
      setProductSelection({
        customer_id: "",
        product_id: "",
        quantity: 1,
      });
      setSelectedOrderId(o.id);
      qc.invalidateQueries({ queryKey: ["orders", "list"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to place order"),
  });

  const advanceOrder = useMutation({
    mutationFn: ({ orderId, action }: { orderId: string; action: string }) =>
      api.patch(
        "order",
        `/v1/orders/${orderId}`,
        { action, reason: action === "FAIL" || action === "CANCEL" ? "Compensating action triggered by operator" : undefined },
        { idempotencyKey: api.uuid() }
      ),
    onSuccess: (_, variables) => {
      toast.success(`Saga Advanced: ${variables.action}`);
      qc.invalidateQueries({ queryKey: ["orders", "list"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Fulfillment transition failed"),
  });

  const customerNameFor = (custId: string) => {
    const c = customers.find((x) => x.id === custId);
    return c ? `${c.first_name} ${c.last_name}` : custId.substring(0, 8);
  };

  const productNameFor = (prodId: string) => {
    const p = activeProducts.find((x) => x.id === prodId);
    return p ? p.product_name : prodId.substring(0, 8);
  };

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Orders & Provisioning Sagas
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Manage telecommunication orders and drive distributed saga workflows to activate eSIM connectivity profiles.
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
        {/* Left 2 Cols: Orders list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ORDER ID</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBSCRIBER</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">ORDER TYPE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">SUBMITTED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {ordersQ.isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-xs text-slate-400">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                      No commercial orders placed yet. Click "Place Telecom Order".
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`hover:bg-slate-50/40 transition cursor-pointer ${
                        o.id === selectedOrderId ? "bg-sky-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-800 font-bold">{o.id.substring(0, 8)}...</span>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{o.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {customerNameFor(o.customer_id)}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{o.order_type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                            o.status === "ACTIVE" || o.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-600 outline-emerald-500/30"
                              : o.status === "FAILED" || o.status === "CANCELLED"
                              ? "bg-rose-50 text-rose-600 outline-rose-500/30"
                              : "bg-amber-50 text-amber-600 outline-amber-500/30"
                          }`}
                        >
                          {o.status}
                        </span>
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

        {/* Right 1 Col: Saga control panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] border-b border-slate-100 pb-2">
            Saga Fulfillment Controller
          </h3>

          {!selectedOrderId ? (
            <div className="text-slate-400 text-xs py-8 text-center">
              Select an order to monitor and advance the provisioning saga.
            </div>
          ) : (
            <div className="flex flex-col gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 font-medium">Order ID:</span>
                <div className="font-mono text-slate-800 font-bold text-xs mt-0.5">{selectedOrder?.id}</div>
                <div className="text-slate-500 mt-1">
                  Subscriber: <span className="font-bold">{customerNameFor(selectedOrder?.customer_id ?? "")}</span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-700 block mb-2">Order Line Items</span>
                {orderItemsQ.isLoading ? (
                  <div className="text-slate-400 italic">Fetching items...</div>
                ) : (
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-150">
                        <div className="flex justify-between font-semibold text-slate-800 text-[11px]">
                          <span>{productNameFor(item.product_id)}</span>
                          <span className="font-mono">x{item.quantity}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Price locked: GBP {((item.amount_minor_units || 0) / 100).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SAGA STATE ENGINE CONTROLS */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col gap-3.5 shadow-md">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-lime-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    Saga Orchestrator
                  </span>
                  <span className="text-xs font-bold font-mono text-white bg-white/10 px-2 py-0.5 rounded">
                    {selectedOrder?.status}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedOrder?.status === "PENDING" && (
                    <button
                      onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "VALIDATE" })}
                      disabled={advanceOrder.isPending}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Step 1: Validate Order Structure
                    </button>
                  )}

                  {selectedOrder?.status === "VALIDATING" && (
                    <button
                      onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "CONFIRM" })}
                      disabled={advanceOrder.isPending}
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Step 2: Confirm Order Commercials
                    </button>
                  )}

                  {selectedOrder?.status === "CONFIRMED" && (
                    <button
                      onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "START_PROVISIONING" })}
                      disabled={advanceOrder.isPending}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Step 3: Start Network Provisioning
                    </button>
                  )}

                  {selectedOrder?.status === "PROVISIONING" && (
                    <button
                      onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "COMPLETE" })}
                      disabled={advanceOrder.isPending}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Step 4: Complete Network Provisioning
                    </button>
                  )}

                  {selectedOrder?.status === "COMPLETED" && (
                    <button
                      onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "ACTIVATE" })}
                      disabled={advanceOrder.isPending}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Step 5: Activate Telecom Subscription
                    </button>
                  )}

                  {selectedOrder?.status === "ACTIVE" && (
                    <div className="text-lime-400 text-xs py-2 text-center font-bold">
                      ✓ Order successfully fulfilled end-to-end.
                    </div>
                  )}

                  {/* COMPENSATING FAILS */}
                  {!["ACTIVE", "FAILED", "CANCELLED"].includes(selectedOrder?.status ?? "") && (
                    <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
                      <button
                        onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "CANCEL" })}
                        disabled={advanceOrder.isPending}
                        className="flex-1 py-1.5 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded font-bold transition text-[10px] cursor-pointer"
                      >
                        Cancel Saga
                      </button>
                      <button
                        onClick={() => advanceOrder.mutate({ orderId: selectedOrder!.id, action: "FAIL" })}
                        disabled={advanceOrder.isPending}
                        className="flex-1 py-1.5 bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 rounded font-bold transition text-[10px] cursor-pointer"
                      >
                        Fail Saga
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SIM & eSIM Network State Simulation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                <span className="font-semibold text-slate-800 text-[11px]">Network State Audit</span>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">eSIM Profile:</span>
                  <span className="font-bold text-slate-700">
                    {["PROVISIONING", "COMPLETED", "ACTIVE"].includes(selectedOrder?.status ?? "")
                      ? "GSMA RSP Profile Assigned"
                      : "Pending Commercial Approval"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Network HLR Status:</span>
                  <span
                    className={`font-bold ${
                      selectedOrder?.status === "ACTIVE" ? "text-emerald-600 animate-pulse" : "text-slate-600"
                    }`}
                  >
                    {selectedOrder?.status === "ACTIVE" ? "HLR_PROVISIONED_ACTIVE" : "STANDBY"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Place Telecom Order Modal */}
      {createOrderOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[480px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Place Telecom Order</h2>
              <button
                onClick={() => setCreateOrderOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              {/* Select Customer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Active Subscriber</label>
                {activeCustomers.length === 0 ? (
                  <div className="text-slate-400 italic">
                    No active subscribers found. Please verify & approve KYC for a customer first.
                  </div>
                ) : (
                  <select
                    value={orderForm.customer_id}
                    onChange={(e) => setProductSelection({ ...orderForm, customer_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="">Select a subscriber...</option>
                    {activeCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} ({c.id.substring(0, 8)}...)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Select Product */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Catalog Product Offer</label>
                {activeProducts.length === 0 ? (
                  <div className="text-slate-400 italic">
                    No active products in catalogue. Create & activate a product first.
                  </div>
                ) : (
                  <select
                    value={orderForm.product_id}
                    onChange={(e) => setProductSelection({ ...orderForm, product_id: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="">Select a product...</option>
                    {activeProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name} ({p.currency_code} {((p.amount_minor_units || 0) / 100).toFixed(2)})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={orderForm.quantity}
                  onChange={(e) => setProductSelection({ ...orderForm, quantity: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition font-mono"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setCreateOrderOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => createOrderSaga.mutate()}
                disabled={
                  createOrderSaga.isPending ||
                  !orderForm.customer_id ||
                  !orderForm.product_id ||
                  orderForm.quantity < 1
                }
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {createOrderSaga.isPending ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
