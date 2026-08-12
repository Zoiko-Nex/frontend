"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiException } from "@/lib/admin/client";

interface Product {
  id: string;
  product_name: string;
  product_type: string;
  charging_model: string;
  charge_structure: string;
  currency_code: string;
  tax_category: string;
  status: string;
  catalog_version_id: string;
  created_at: string;
  amount_minor_units?: number;
}

interface Offer {
  id: string;
  offer_name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
}

export default function CatalogManagement() {
  const qc = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<"products" | "offers">("products");
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [createOfferOpen, setCreateOfferOpen] = useState(false);

  // Forms
  const [productForm, setProductForm] = useState({
    product_name: "",
    product_type: "PREPAID",
    charging_model: "ONLINE",
    charge_structure: "RECURRING",
    currency_code: "GBP",
    tax_category: "STANDARD",
    country_code: "GB",
    jurisdiction_code: "GB",
    catalog_version_id: "v2026-06-01",
    amount_minor_units: 999, // default £9.99
  });

  const [offerForm, setOfferForm] = useState({
    offer_name: "",
    description: "",
    product_ids: [] as string[],
    status: "ACTIVE",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // Queries
  const productsQ = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: () => api.get<{ items?: Product[] }>("catalogue", "/v1/products"),
  });
  const products = productsQ.data?.items ?? [];

  const offersQ = useQuery({
    queryKey: ["catalog", "offers"],
    queryFn: () => api.get<{ items?: Offer[] }>("catalogue", "/v1/offers"),
  });
  const offers = offersQ.data?.items ?? [];

  // Mutations
  const createProduct = useMutation({
    mutationFn: () => api.post("catalogue", "/v1/products", productForm),
    onSuccess: () => {
      toast.success("Product created in DRAFT state");
      setCreateProductOpen(false);
      setProductForm({
        product_name: "",
        product_type: "PREPAID",
        charging_model: "ONLINE",
        charge_structure: "RECURRING",
        currency_code: "GBP",
        tax_category: "STANDARD",
        country_code: "GB",
        jurisdiction_code: "GB",
        catalog_version_id: "v2026-06-01",
        amount_minor_units: 999,
      });
      qc.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create product"),
  });

  const transitionProduct = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.patch("catalogue", `/v1/products/${id}`, { action }),
    onSuccess: (_, variables) => {
      toast.success(`Product transitioned: ${variables.action}`);
      qc.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "State transition failed"),
  });

  const createOffer = useMutation({
    mutationFn: () => api.post("catalogue", "/v1/offers", offerForm),
    onSuccess: () => {
      toast.success("Offer bundle created");
      setCreateOfferOpen(false);
      setOfferForm({
        offer_name: "",
        description: "",
        product_ids: [],
        status: "ACTIVE",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      qc.invalidateQueries({ queryKey: ["catalog", "offers"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create offer"),
  });

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-5 w-full font-sans transition-all duration-300">
      {/* Title */}
      <div className="self-stretch inline-flex justify-between items-center">
        <div className="inline-flex flex-col justify-start items-start gap-1">
          <h2 className="justify-center text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
            Commercial Catalog
          </h2>
          <p className="justify-center text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            TM Forum-aligned Product & Offer definitions. Immutability version control ensures billing continuity.
          </p>
        </div>

        <div className="flex gap-2">
          {activeSubTab === "products" ? (
            <button
              onClick={() => setCreateProductOpen(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + Create Product
            </button>
          ) : (
            <button
              onClick={() => setCreateOfferOpen(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              + Create Offer Bundle
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Toggle */}
      <div className="flex gap-1 bg-slate-200/60 p-1 rounded-xl self-stretch md:w-fit">
        <button
          onClick={() => setActiveSubTab("products")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "products" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab("offers")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "offers" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Offer Bundles ({offers.length})
        </button>
      </div>

      {/* Products Content */}
      {activeSubTab === "products" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PRODUCT NAME</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">CHARGING MODEL</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">TYPE & STRUCTURE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">PRICE (MINOR)</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono'] text-right">LIFECYCLE ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {productsQ.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-400">
                      Loading products catalogue...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                      No products registered. Create one to define telecom pricing rules.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-xs">{p.product_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {p.charging_model} ({p.product_type})
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{p.charge_structure}</td>
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">
                        {p.currency_code} {((p.amount_minor_units || 0) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                            p.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 outline-emerald-500/30"
                              : p.status === "REVIEW"
                              ? "bg-amber-50 text-amber-600 outline-amber-500/30"
                              : p.status === "RETIRED"
                              ? "bg-rose-50 text-rose-600 outline-rose-500/30"
                              : "bg-slate-50 text-slate-600 outline-slate-500/30"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex gap-1.5 justify-end">
                        {p.status === "DRAFT" && (
                          <button
                            onClick={() => transitionProduct.mutate({ id: p.id, action: "SUBMIT_FOR_REVIEW" })}
                            disabled={transitionProduct.isPending}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Submit
                          </button>
                        )}
                        {p.status === "REVIEW" && (
                          <button
                            onClick={() => transitionProduct.mutate({ id: p.id, action: "ACTIVATE" })}
                            disabled={transitionProduct.isPending}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                        {p.status === "ACTIVE" && (
                          <button
                            onClick={() => transitionProduct.mutate({ id: p.id, action: "RETIRE" })}
                            disabled={transitionProduct.isPending}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            Retire
                          </button>
                        )}
                        {!["DRAFT", "REVIEW", "ACTIVE"].includes(p.status) && (
                          <span className="text-[10px] text-slate-400 font-medium">Terminal State</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Offers Content */}
      {activeSubTab === "offers" && (
        <div className="self-stretch bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">OFFER BUNDLE</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">DESCRIPTION</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">VALIDITY PERIOD</th>
                  <th className="px-6 py-3 font-semibold font-['IBM_Plex_Mono']">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {offersQ.isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400">
                      Loading offers list...
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-400">
                      No commercial offers active. Create a bundle to group multiple products.
                    </td>
                  </tr>
                ) : (
                  offers.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-xs">{o.offer_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{o.id}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-sm truncate">{o.description}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(o.start_date).toLocaleDateString()} — {new Date(o.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono outline outline-1 ${
                            o.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600 outline-emerald-500/30"
                              : "bg-slate-50 text-slate-600 outline-slate-500/30"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {createProductOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[520px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Create Catalog Product</h2>
              <button
                onClick={() => setCreateProductOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Product Name</label>
                <input
                  value={productForm.product_name}
                  onChange={(e) => setProductForm({ ...productForm, product_name: e.target.value })}
                  placeholder="e.g. Unlimited Voice & Data 30"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Product Type</label>
                  <select
                    value={productForm.product_type}
                    onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="PREPAID">Prepaid</option>
                    <option value="POSTPAID">Postpaid</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Charging Model</label>
                  <select
                    value={productForm.charging_model}
                    onChange={(e) => setProductForm({ ...productForm, charging_model: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="ONLINE">Online (Real-time OCS)</option>
                    <option value="OFFLINE">Offline (Post-event Rating)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Charge Structure</label>
                  <select
                    value={productForm.charge_structure}
                    onChange={(e) => setProductForm({ ...productForm, charge_structure: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  >
                    <option value="RECURRING">Recurring Subscription</option>
                    <option value="ONCE">One-time Fee</option>
                    <option value="USAGE">Usage Dependent (CDR)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Price (Minor Units)</label>
                  <input
                    type="number"
                    value={productForm.amount_minor_units}
                    onChange={(e) => setProductForm({ ...productForm, amount_minor_units: Number(e.target.value) })}
                    placeholder="999 (for £9.99)"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Currency Code</label>
                  <input
                    value={productForm.currency_code}
                    onChange={(e) => setProductForm({ ...productForm, currency_code: e.target.value.toUpperCase() })}
                    placeholder="GBP"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Catalog Version ID</label>
                  <input
                    value={productForm.catalog_version_id}
                    onChange={(e) => setProductForm({ ...productForm, catalog_version_id: e.target.value })}
                    placeholder="v2026-06-01"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 transition font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setCreateProductOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => createProduct.mutate()}
                disabled={createProduct.isPending || !productForm.product_name.trim()}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {createProduct.isPending ? "Creating…" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Offer Modal */}
      {createOfferOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[520px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Create Offer Bundle</h2>
              <button
                onClick={() => setCreateOfferOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Offer Name</label>
                <input
                  value={offerForm.offer_name}
                  onChange={(e) => setOfferForm({ ...offerForm, offer_name: e.target.value })}
                  placeholder="e.g. Summer Promo Unlimited Bundle"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Description</label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Describe details of the bundle..."
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 font-semibold">Select Products in Bundle</label>
                {products.length === 0 ? (
                  <div className="text-slate-400 italic">No products available in catalogue. Create a product first.</div>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                    {products.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={offerForm.product_ids.includes(p.id)}
                          onChange={() => {
                            const exists = offerForm.product_ids.includes(p.id);
                            setOfferForm({
                              ...offerForm,
                              product_ids: exists
                                ? offerForm.product_ids.filter((x) => x !== p.id)
                                : [...offerForm.product_ids, p.id],
                            });
                          }}
                        />
                        <span className="text-slate-700 font-medium">
                          {p.product_name} ({p.currency_code} {((p.amount_minor_units || 0) / 100).toFixed(2)})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Start Date</label>
                  <input
                    type="date"
                    value={offerForm.start_date}
                    onChange={(e) => setOfferForm({ ...offerForm, start_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">End Date</label>
                  <input
                    type="date"
                    value={offerForm.end_date}
                    onChange={(e) => setOfferForm({ ...offerForm, end_date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setCreateOfferOpen(false)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => createOffer.mutate()}
                disabled={createOffer.isPending || !offerForm.offer_name.trim() || offerForm.product_ids.length === 0}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {createOffer.isPending ? "Creating…" : "Create Offer Bundle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
