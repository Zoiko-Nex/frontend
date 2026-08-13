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
  created_at: string;
}

/**
 * Price lives on price rules, never on the product. The catalogue's
 * ProductResponse carries no amount at all, so the product table used to render
 * "GBP 0.00" for everything and POST /v1/products silently dropped the
 * amount_minor_units it was sent — meaning no product created here could ever be
 * ordered, because ordering requires a price rule.
 */
const MINOR_UNIT_EXPONENT: Record<string, number> = {
  JPY: 0, KRW: 0, VND: 0, CLP: 0, ISK: 0,
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, OMR: 3, TND: 3,
};

/** Format integer minor units by ISO 4217 exponent — JPY has 0, KWD has 3. */
function formatMinorUnits(minorUnits: number | undefined, currency: string | undefined): string {
  if (minorUnits === undefined || minorUnits === null || !currency) return "—";
  const exp = MINOR_UNIT_EXPONENT[currency.toUpperCase()] ?? 2;
  return `${currency.toUpperCase()} ${(minorUnits / 10 ** exp).toFixed(exp)}`;
}

interface PriceRule {
  id: string;
  product_id: string;
  amount_minor_units: number;
  currency_code: string;
  charge_structure?: string;
  billing_period?: string;
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
    // No default: a made-up version string claims which catalog priced a product
    // without any basis, and it is what orders pin as provenance. The operator
    // must state it.
    catalog_version_id: "",
  });

  // Price-rule creation. Without a price rule a product cannot be ordered at all,
  // which is why this belongs here rather than being left to a DB insert.
  const [priceProduct, setPriceProduct] = useState<Product | null>(null);
  const [priceForm, setPriceForm] = useState({
    amount_minor_units: 0,
    currency_code: "GBP",
    charge_structure: "RECURRING",
    billing_period: "MONTHLY",
    rounding_policy_id: "rp_half_up_2",
    country_code: "GB",
    jurisdiction_code: "GB",
  });

  const [offerForm, setOfferForm] = useState(() => {
    const today = new Date();
    const inAYear = new Date(today);
    inAYear.setFullYear(inAYear.getFullYear() + 1);
    return {
      offer_name: "",
      description: "",
      product_ids: [] as string[],
      status: "ACTIVE",
      start_date: today.toISOString().split("T")[0],
      end_date: inAYear.toISOString().split("T")[0],
    };
  });

  // Queries
  // The catalogue returns {"products": [...]}, not {"items": [...]}. Reading the
  // wrong key yields an empty array, which reads as "no products" rather than a bug.
  const productsQ = useQuery({
    queryKey: ["catalog", "products"],
    queryFn: () => api.get<{ products?: Product[] }>("catalogue", "/v1/products"),
  });
  const products = productsQ.data?.products ?? [];

  // Price rules, gathered per product for the same reason as offers: there is no
  // top-level list endpoint. This is where the product table's price comes from.
  const priceRulesQ = useQuery({
    queryKey: ["catalog", "price-rules", products.map((p) => p.id).join(",")],
    enabled: products.length > 0,
    queryFn: async () => {
      const perProduct = await Promise.all(
        products.map(async (p) => {
          try {
            const res = await api.get<{ price_rules?: PriceRule[] }>(
              "catalogue",
              `/v1/products/${p.id}/price-rules`
            );
            return res.price_rules ?? [];
          } catch {
            return [] as PriceRule[];
          }
        })
      );
      return perProduct.flat();
    },
  });
  const priceRules = priceRulesQ.data ?? [];
  const rulesFor = (productID: string) => priceRules.filter((r) => r.product_id === productID);

  // There is no GET /v1/offers — offers are only reachable per product
  // (GET /v1/products/{id}/offers), so they are gathered across products here.
  const offersQ = useQuery({
    queryKey: ["catalog", "offers", products.map((p) => p.id).join(",")],
    enabled: products.length > 0,
    queryFn: async () => {
      const perProduct = await Promise.all(
        products.map(async (p) => {
          try {
            const res = await api.get<{ offers?: Offer[] }>(
              "catalogue",
              `/v1/products/${p.id}/offers`
            );
            return res.offers ?? [];
          } catch {
            // One product's offers failing must not blank the whole list.
            return [] as Offer[];
          }
        })
      );
      return perProduct.flat();
    },
  });
  const offers = offersQ.data ?? [];

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
        catalog_version_id: "",
      });
      qc.invalidateQueries({ queryKey: ["catalog", "products"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create product"),
  });

  // A price rule is what makes a product orderable: an order line locks onto the
  // amount from here.
  //
  // catalog_version_id is deliberately not sent. The order line pins its catalog
  // version from the product, via GET /v1/products/{id}/commercial-version, so
  // there is one source for that provenance rather than two that could disagree.
  const createPriceRule = useMutation({
    mutationFn: () =>
      api.post("catalogue", "/v1/price-rules", {
        product_id: priceProduct!.id,
        amount_minor_units: priceForm.amount_minor_units,
        currency_code: priceForm.currency_code,
        charge_structure: priceForm.charge_structure,
        billing_period: priceForm.billing_period,
        rounding_policy_id: priceForm.rounding_policy_id,
        country_code: priceForm.country_code,
        jurisdiction_code: priceForm.jurisdiction_code,
      }),
    onSuccess: () => {
      toast.success("Price rule created — the product can now be ordered");
      setPriceProduct(null);
      qc.invalidateQueries({ queryKey: ["catalog", "price-rules"] });
    },
    onError: (e) => toast.error(e instanceof ApiException ? e.message : "Failed to create price rule"),
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
                        {priceRulesQ.isLoading ? (
                          <span className="text-slate-400 font-normal">…</span>
                        ) : rulesFor(p.id).length === 0 ? (
                          <span
                            className="text-amber-600 font-semibold"
                            title="Without a price rule this product cannot be ordered"
                          >
                            no price
                          </span>
                        ) : (
                          rulesFor(p.id).map((r) => (
                            <div key={r.id}>
                              {formatMinorUnits(r.amount_minor_units, r.currency_code)}
                              {r.billing_period ? (
                                <span className="text-slate-400 font-normal"> /{r.billing_period}</span>
                              ) : null}
                            </div>
                          ))
                        )}
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
                        {["DRAFT", "REVIEW", "ACTIVE"].includes(p.status) && (
                          <button
                            onClick={() => {
                              setPriceForm((f) => ({ ...f, currency_code: p.currency_code || f.currency_code }));
                              setPriceProduct(p);
                            }}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            + Price
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

                <div className="flex flex-col gap-1.5 justify-end">
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Price is not set here. POST /v1/products accepts no amount — a price
                    belongs to a price rule. Create the product, then use
                    <span className="font-semibold"> + Price</span> on its row.
                  </p>
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
                          {p.product_name} ({p.currency_code})
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

      {/* Price rule — what makes a product orderable */}
      {priceProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-[460px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <div>
                <h2 className="text-slate-800 text-lg font-bold font-['Plus_Jakarta_Sans']">Add Price Rule</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">{priceProduct.product_name}</p>
              </div>
              <button
                onClick={() => setPriceProduct(null)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs text-slate-700">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Until a product has a price rule it cannot be ordered: an order line locks
                onto the amount from this rule.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Amount (minor units)</label>
                  <input
                    type="number"
                    min={0}
                    value={priceForm.amount_minor_units}
                    onChange={(e) =>
                      setPriceForm({ ...priceForm, amount_minor_units: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Currency</label>
                  <input
                    value={priceForm.currency_code}
                    maxLength={3}
                    onChange={(e) =>
                      setPriceForm({ ...priceForm, currency_code: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex justify-between items-center">
                <span className="text-slate-600 font-semibold text-[11px]">Reads as</span>
                <span className="font-mono font-bold text-slate-800">
                  {formatMinorUnits(priceForm.amount_minor_units, priceForm.currency_code)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Charge structure</label>
                  <select
                    value={priceForm.charge_structure}
                    onChange={(e) => setPriceForm({ ...priceForm, charge_structure: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="RECURRING">RECURRING</option>
                    <option value="ONCE">ONCE</option>
                    <option value="USAGE">USAGE</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Billing period</label>
                  <select
                    value={priceForm.billing_period}
                    onChange={(e) => setPriceForm({ ...priceForm, billing_period: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="ANNUAL">ANNUAL</option>
                    <option value="ONE_OFF">ONE_OFF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Country</label>
                  <input
                    value={priceForm.country_code}
                    maxLength={2}
                    onChange={(e) => setPriceForm({ ...priceForm, country_code: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-semibold">Jurisdiction</label>
                  <input
                    value={priceForm.jurisdiction_code}
                    maxLength={5}
                    onChange={(e) =>
                      setPriceForm({ ...priceForm, jurisdiction_code: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setPriceProduct(null)}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-semibold text-xs cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => createPriceRule.mutate()}
                disabled={
                  createPriceRule.isPending ||
                  priceForm.amount_minor_units <= 0 ||
                  priceForm.currency_code.length !== 3
                }
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
              >
                {createPriceRule.isPending ? "Creating…" : "Create Price Rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
