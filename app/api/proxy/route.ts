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

const PORT_TO_ENV_VAR = {
  8080: "NEXT_PUBLIC_SVC_IDENTITY",
  8081: "NEXT_PUBLIC_SVC_CUSTOMER",
  8082: "NEXT_PUBLIC_SVC_CATALOGUE",
  8083: "NEXT_PUBLIC_SVC_ORDER",
  8084: "NEXT_PUBLIC_SVC_FINANCE",
  8085: "NEXT_PUBLIC_SVC_RATING",
  8086: "NEXT_PUBLIC_SVC_PARTNER",
  8087: "NEXT_PUBLIC_SVC_REVENUE_ASSURANCE",
  8089: "NEXT_PUBLIC_SVC_TAX",
  8090: "NEXT_PUBLIC_SVC_FRAUD",
  8091: "NEXT_PUBLIC_SVC_KYC",
  8092: "NEXT_PUBLIC_SVC_BILLING",
  8093: "NEXT_PUBLIC_SVC_EVIDENCE",
  8094: "NEXT_PUBLIC_SVC_USAGE",
  8095: "NEXT_PUBLIC_SVC_DUNNING",
  8096: "NEXT_PUBLIC_SVC_PAYMENTS",
  8097: "NEXT_PUBLIC_SVC_INTEGRATION",
  8098: "NEXT_PUBLIC_SVC_REPORTING",
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
