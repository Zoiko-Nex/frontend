import { NextResponse } from "next/server";

export async function GET() {
  const services = [
    { id: "identity-tenancy", port: 8080 },
    { id: "customer-account", port: 8081 },
    { id: "product-catalogue-commercial", port: 8082 },
    { id: "order-management-provisioning", port: 8083 },
    { id: "finance-fabric-ledger", port: 8084 },
    { id: "rating-charging", port: 8085 },
    { id: "partner-settlement", port: 8086 },
    { id: "revenue-assurance", port: 8087 },
    { id: "tax-jurisdiction", port: 8089 },
    { id: "fraud-risk", port: 8090 },
    { id: "custmr-lfc-kyc", port: 8091 },
    { id: "billing-invoice", port: 8092 },
    { id: "evidence-ledger", port: 8093 },
    { id: "usage-ingestion-mediation", port: 8094 },
    { id: "dunning-collections-disputes", port: 8095 },
    { id: "payments", port: 8096 },
    { id: "integration-ecosystem", port: 8097 },
    { id: "reporting-regulatory", port: 8098 },
  ];

  const results: Record<string, boolean> = {};

  await Promise.all(
    services.map(async (service) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800);
        
        const res = await fetch(`http://127.0.0.1:${service.port}/health`, {
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
