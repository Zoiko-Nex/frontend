import { NextResponse } from "next/server";

const portToUrl: Record<number, string> = {
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

export async function POST(request: Request) {
  try {
    const { port, method, path, headers = {}, body } = await request.json();
    
    if (!port) {
      return NextResponse.json({ error: "Missing target service port" }, { status: 400 });
    }

    const baseUrl = portToUrl[port] || `http://127.0.0.1:${port}`;
    const targetUrl = `${baseUrl}${path}`;
    
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers
    };

    const authHeader = fetchHeaders["Authorization"] || fetchHeaders["authorization"];
    const isLoginPath = path === "/v1/sessions" || path === "/api/v1/auth/login";
    const isMockToken = authHeader?.includes("mock_token_for_poc_demonstration");
    
    if ((!authHeader || (authHeader.length < 50 && !isMockToken)) && !isLoginPath) {
      try {
        const tokenUrl = portToUrl[8080] ? `${portToUrl[8080]}/oauth/v1/token` : "http://127.0.0.1:8080/oauth/v1/token";
        const tokenRes = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Correlation-ID": "c7a8b9c0-1e2f-3a4b-5c6d-7e8f9a0b1c2d"
          },
          body: "grant_type=authorization_code"
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            fetchHeaders["Authorization"] = `Bearer ${tokenData.access_token}`;
          }
        }
      } catch (e) {
        console.error("Auto-token generation failed:", e);
      }
    }

    const fetchOptions: RequestInit = {
      method: method || "GET",
      headers: fetchHeaders,
      cache: "no-store",
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const res = await fetch(targetUrl, fetchOptions);
    const contentType = res.headers.get("content-type") || "";

    let responseData;
    if (contentType.includes("application/json")) {
      responseData = await res.json();
    } else {
      responseData = await res.text();
    }

    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      data: responseData
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy connection failed: " + String(err) }, { status: 502 });
  }
}
