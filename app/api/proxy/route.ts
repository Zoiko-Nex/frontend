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
