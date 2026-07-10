import { NextRequest, NextResponse } from "next/server";

const PORT_TO_LIVE_URL: Record<number, string> = {
  8080: "https://identity.api.zoikonex.com",
  8081: "https://customer.api.zoikonex.com",
  8082: "https://catalogue.api.zoikonex.com",
  8083: "https://ordering.api.zoikonex.com",
  8084: "https://finance.api.zoikonex.com",
  8085: "https://rating.api.zoikonex.com",
  8086: "https://settlement.api.zoikonex.com",
  8087: "https://assurance.api.zoikonex.com",
  8089: "https://tax.api.zoikonex.com",
  8090: "https://fraud.api.zoikonex.com",
  8091: "https://kyc.api.zoikonex.com",
  8092: "https://billing.api.zoikonex.com",
  8093: "https://evidence.api.zoikonex.com",
  8094: "https://usage.api.zoikonex.com",
  8095: "https://dunning.api.zoikonex.com",
  8096: "https://payments.api.zoikonex.com",
  8097: "https://integration.api.zoikonex.com",
  8098: "https://reporting.api.zoikonex.com",
};

const PORT_TO_ENV_VAR: Record<number, string> = {
  8080: "IDENTITY_URL",
  8081: "TENANT_URL",
  8082: "USER_URL",
  8083: "AUTH_URL",
  8084: "NOTIFICATION_URL",
  8085: "PAYMENT_URL",
  8086: "BILLING_URL",
  8087: "REPORT_URL",
  8089: "ANALYTICS_URL",
  8090: "AUDIT_URL",
  8091: "SEARCH_URL",
  8092: "CONFIG_URL",
  8093: "FILES_URL",
  8094: "EMAIL_URL",
  8095: "SMS_URL",
  8096: "WEBHOOK_URL",
  8097: "KYC_URL",
  8098: "OCR_URL",
};

const BLOCKED_HEADERS = new Set(["connection", "content-length", "cookie", "host", "origin", "referer"]);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const port = Number(payload.port);
    const envVar = PORT_TO_ENV_VAR[port];
    const baseUrl = (envVar ? process.env[envVar] : null) || PORT_TO_LIVE_URL[port] || `http://localhost:${port}`;
    const method = String(payload.method || "GET").toUpperCase();
    const path = String(payload.path || "/");

    if (!baseUrl || !path.startsWith("/")) {
      return NextResponse.json({ status: 400, ok: false, data: { message: "Unknown service port or invalid path." } });
    }

    const headers = new Headers();
    Object.entries((payload.headers || {}) as Record<string, string>).forEach(([key, value]) => {
      if (value != null && !BLOCKED_HEADERS.has(key.toLowerCase())) headers.set(key, String(value));
    });

    const hasBody = payload.body !== undefined && method !== "GET" && method !== "HEAD";
    if (hasBody && !headers.has("content-type")) headers.set("content-type", "application/json");

    const upstream = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: hasBody ? JSON.stringify(payload.body) : undefined,
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return NextResponse.json({ status: upstream.status, ok: upstream.ok, data });
  } catch (error) {
    return NextResponse.json({
      status: 502,
      ok: false,
      data: { message: error instanceof Error ? error.message : "Proxy request failed." },
    });
  }
}
