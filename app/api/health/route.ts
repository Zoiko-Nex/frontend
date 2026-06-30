import { NextResponse } from "next/server";

export async function GET() {
  const services = [
    { id: "identity-tenancy", url: "https://identity.api.zoikonex.com/health" },
    { id: "customer-account", url: "https://customer.api.zoikonex.com/health" },
    { id: "product-catalogue-commercial", url: "https://catalogue.api.zoikonex.com/health" },
    { id: "order-management-provisioning", url: "https://ordering.api.zoikonex.com/health" },
    { id: "finance-fabric-ledger", url: "https://finance.api.zoikonex.com/health" },
    { id: "rating-charging", url: "https://rating.api.zoikonex.com/health" },
    { id: "partner-settlement", url: "https://settlement.api.zoikonex.com/health" },
    { id: "revenue-assurance", url: "https://assurance.api.zoikonex.com/health" },
    { id: "tax-jurisdiction", url: "https://tax.api.zoikonex.com/health" },
    { id: "fraud-risk", url: "https://fraud.api.zoikonex.com/health" },
    { id: "custmr-lfc-kyc", url: "https://kyc.api.zoikonex.com/health" },
    { id: "billing-invoice", url: "https://billing.api.zoikonex.com/health" },
    { id: "evidence-ledger", url: "https://evidence.api.zoikonex.com/health" },
    { id: "usage-ingestion-mediation", url: "https://usage.api.zoikonex.com/health" },
    { id: "dunning-collections-disputes", url: "https://dunning.api.zoikonex.com/health" },
    { id: "payments", url: "https://payments.api.zoikonex.com/health" },
    { id: "integration-ecosystem", url: "https://integration.api.zoikonex.com/health" },
    { id: "reporting-regulatory", url: "https://reporting.api.zoikonex.com/health" },
  ];

  const results: Record<string, boolean> = {};

  await Promise.all(
    services.map(async (service) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(service.url, {
          signal: controller.signal,
          headers: {
            "Accept": "application/json",
          },
        });
        clearTimeout(timeoutId);
        results[service.id] = res.ok;
      } catch (err) {
        results[service.id] = false;
      }
    })
  );

  return NextResponse.json(results);
}
