import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    "product-catalogue-commercial": true,
    "rating-charging": true,
    "billing-invoice": true,
    "payments": true,
    "partner-settlement": true,
    "customer-account": true,
    "integration-ecosystem": true,
    "order-management-provisioning": true,
    "tax-jurisdiction": true,
    "custmr-lfc-kyc": true,
    "evidence-ledger": true,
    "reporting-regulatory": true,
    "usage-ingestion-mediation": true
  });
}
