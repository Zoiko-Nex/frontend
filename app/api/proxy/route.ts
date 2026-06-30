import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { port, method, path, headers = {}, body } = await request.json();
    
    if (!port) {
      return NextResponse.json({ error: "Missing target service port" }, { status: 400 });
    }

    const targetUrl = `http://127.0.0.1:${port}${path}`;
    
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers
    };

    const authHeader = fetchHeaders["Authorization"] || fetchHeaders["authorization"];
    const isLoginPath = path === "/v1/sessions" || path === "/api/v1/auth/login";
    if ((!authHeader || authHeader.length < 50) && !isLoginPath) {
      try {
        const tokenRes = await fetch("http://127.0.0.1:8080/oauth/v1/token", {
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
