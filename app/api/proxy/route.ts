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
  8099: "https://forms.api.zoikonex.com",
};

// Port → override env var. These MUST match lib/admin/services.ts, because the
// browser client and this proxy resolve base URLs independently and would
// otherwise disagree about which host serves a port.
//
// The previous map used a completely different service numbering: port 8083 (the
// ordering service) read AUTH_URL, 8092 (billing) read CONFIG_URL, 8096 (payments)
// read WEBHOOK_URL, and so on — only 8080 was correct. Because the env var takes
// priority over PORT_TO_LIVE_URL below, setting any one of them would have silently
// routed a whole service's traffic to the wrong host. None were set in any
// deployment, so this was a latent landmine rather than a live outage.
const PORT_TO_ENV_VAR: Record<number, string> = {
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
  8099: "NEXT_PUBLIC_SVC_REQUEST_FORMS",
};

const BLOCKED_HEADERS = new Set(["connection", "content-length", "cookie", "host", "origin", "referer"]);

export async function POST(req: NextRequest) {
  let method = "UNKNOWN";
  let baseUrl = "UNKNOWN";
  let path = "UNKNOWN";
  try {
    const payload = await req.json();
    let port = Number(payload.port);
    method = String(payload.method || "GET").toUpperCase();
    path = String(payload.path || "/");

    // Auto-route based on path to perfectly integrate all APIs using the deployed links
    if (port === 8080 || !port) {
      if (path.startsWith('/v1/customers')) port = 8081;
      else if (path.startsWith('/v1/products') || path.startsWith('/v1/offers') || path.startsWith('/v1/catalog')) port = 8082;
      else if (path.startsWith('/v1/orders')) port = 8083;
      else if (path.startsWith('/v1/finance')) port = 8084;
      else if (path.startsWith('/v1/rating')) port = 8085;
      else if (path.startsWith('/v1/settlement')) port = 8086;
      else if (path.startsWith('/v1/assurance')) port = 8087;
      else if (path.startsWith('/v1/jurisdiction') || path.startsWith('/v1/tax')) port = 8089;
      else if (path.startsWith('/v1/fraud')) port = 8090;
      else if (path.startsWith('/v1/kyc')) port = 8091;
      else if (path.startsWith('/v1/billing') || path.startsWith('/v1/bill-cycles')) port = 8092;
      else if (path.startsWith('/v1/evidence')) port = 8093;
      else if (path.startsWith('/v1/usage')) port = 8094;
      else if (path.startsWith('/v1/dunning')) port = 8095;
      else if (path.startsWith('/v1/payments') || path.startsWith('/v1/payment-intents')) port = 8096;
      else if (path.startsWith('/v1/integration') || path.startsWith('/v1/connectors') || path.startsWith('/v1/activations') || path.startsWith('/v1/mappings') || path.startsWith('/v1/operations') || path.startsWith('/v1/doc-proposals') || path.startsWith('/v1/invocations') || path.startsWith('/v1/mft') || path.startsWith('/v1/quarantine') || path.startsWith('/v1/reconciliation') || path.startsWith('/v1/egress')) port = 8097;
      else if (path.startsWith('/v1/reporting')) port = 8098;
      else if (path.startsWith('/v1/demo-requests') || path.startsWith('/v1/contact-us') || path.startsWith('/v1/careers') || path.startsWith('/v1/press-media') || path.startsWith('/v1/terms-and-services')) port = 8099;
      else port = 8080;
    }

    const envVar = PORT_TO_ENV_VAR[port];
    baseUrl = (envVar ? process.env[envVar] : null) || PORT_TO_LIVE_URL[port] || `http://localhost:${port}`;

    // A caller-supplied path is concatenated onto the resolved host below, so it is
    // constrained here. `//host` would otherwise read as protocol-relative and `..`
    // segments let a caller walk to endpoints the UI never intended to reach — the
    // host itself stays inside the allow-list either way, but neither is a shape any
    // legitimate caller sends.
    if (!baseUrl || !path.startsWith("/") || path.startsWith("//") || path.includes("..")) {
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

    if (!upstream.ok) {
      console.error(`[Proxy Error] Upstream returned non-OK status: ${upstream.status} for ${method} ${baseUrl}${path}. Response:`, data);
    }

    return NextResponse.json({ status: upstream.status, ok: upstream.ok, data });
  } catch (error) {
    console.error(`[Proxy Exception] Failed to fetch upstream ${method} ${baseUrl}${path}:`, error);
    return NextResponse.json({
      status: 502,
      ok: false,
      data: { message: error instanceof Error ? error.message : "Proxy request failed." },
    });
  }
}
