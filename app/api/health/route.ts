import { NextResponse } from "next/server";

const HEALTH_ENDPOINTS: Record<string, string> = {
  "identity-tenancy":                  "https://identity.api.zoikonex.com/health",
  "customer-account":                  "https://customer.api.zoikonex.com/health",
  "product-catalogue-commercial":      "https://catalogue.api.zoikonex.com/health",
  "order-management-provisioning":     "https://ordering.api.zoikonex.com/health",
  "finance-fabric-ledger":             "https://finance.api.zoikonex.com/health",
  "rating-charging":                   "https://rating.api.zoikonex.com/health",
  "partner-settlement":                "https://settlement.api.zoikonex.com/health",
  "revenue-assurance":                 "https://assurance.api.zoikonex.com/health",
  "tax-jurisdiction":                  "https://tax.api.zoikonex.com/health",
  "fraud-risk":                        "https://fraud.api.zoikonex.com/health",
  "custmr-lfc-kyc":                    "https://kyc.api.zoikonex.com/health",
  "billing-invoice":                   "https://billing.api.zoikonex.com/health",
  "evidence-ledger":                   "https://evidence.api.zoikonex.com/health",
  "usage-ingestion-mediation":         "https://usage.api.zoikonex.com/health",
  "dunning-collections-disputes":      "https://dunning.api.zoikonex.com/health",
  "payments":                          "https://payments.api.zoikonex.com/health",
  "integration-ecosystem":             "https://integration.api.zoikonex.com/health",
  "reporting-regulatory":              "https://reporting.api.zoikonex.com/health",
};

export async function GET() {
  const results = await Promise.allSettled(
    Object.entries(HEALTH_ENDPOINTS).map(async ([name, url]) => {
      try {
        const res = await fetch(url, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(4000) });
        return { name, ok: res.ok };
      } catch {
        return { name, ok: false };
      }
    })
  );

  const status: Record<string, boolean> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      status[result.value.name] = result.value.ok;
    }
  }

  return NextResponse.json(status);
}
