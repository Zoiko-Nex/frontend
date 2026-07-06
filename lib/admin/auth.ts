"use client";

/**
 * Client-side auth flows against identity-tenancy, per its integration guide:
 *   POST /v1/sessions            → tokens, or 401 MFA_REQUIRED + step_up_token
 *   POST /v1/sessions/mfa        → tokens (MFA step-up; dev codes 123456 / 564890)
 *   POST /v1/sessions/refresh    → rotated tokens
 */

import { getService, serviceBaseUrl } from "./services";
import { setSession, clearSession, decodeJwt, getSession, type AdminSession } from "./session";
import { ApiException } from "./client";

function identityBase() {
  return serviceBaseUrl(getService("identity")!);
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  session_id?: string;
  expires_in?: number;
}

function persist(tokens: TokenResponse, tenantId: string, brandId?: string): AdminSession {
  const claims = decodeJwt(tokens.access_token) || {};
  const session: AdminSession = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    sessionId: tokens.session_id,
    expiresAt: Date.now() + (tokens.expires_in ?? 900) * 1000,
    tenantId,
    brandId: brandId || (claims.brand_id as string) || undefined,
    email: (claims.email as string) || undefined,
    userId: (claims.sub as string) || undefined,
    roles: (claims.roles as string[]) || [],
  };
  setSession(session);
  return session;
}

export interface LoginResult {
  status: "ok" | "mfa";
  stepUpToken?: string;
}

export async function login(
  email: string,
  password: string,
  tenantId: string,
  brandId?: string,
  deviceFingerprint?: string,
): Promise<LoginResult> {
  let proxyPayload: any;
  try {
    const res = await fetch(`/api/proxy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        port: 8080,
        method: "POST",
        path: "/v1/sessions",
        headers: { "x-tenant-id": tenantId },
        body: { email, password, device_fingerprint: deviceFingerprint }
      }),
    });
    if (!res.ok) throw new Error("Proxy fetch failed");
    proxyPayload = await res.json();
  } catch {
    throw new ApiException(502, { code: "SERVICE_UNREACHABLE", message: `Identity service unreachable via proxy.`, retryable: true });
  }

  const body = proxyPayload.data || {};
  if (proxyPayload.status === 401 && body.error === "MFA_REQUIRED") {
    return { status: "mfa", stepUpToken: body.step_up_token };
  }
  if (!proxyPayload.ok || !body.access_token) {
    throw new ApiException(proxyPayload.status, { code: body.code || "UNAUTHORIZED", message: body.message || "Invalid email or password." });
  }
  
  persist(body, tenantId, brandId);
  return { status: "ok" };
}

export async function completeMfa(stepUpToken: string, mfaCode: string, tenantId: string, brandId?: string): Promise<void> {
  let proxyPayload: any;
  try {
    const res = await fetch(`/api/proxy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        port: 8080,
        method: "POST",
        path: "/v1/sessions/mfa",
        body: { step_up_token: stepUpToken, mfa_code: mfaCode }
      }),
    });
    if (!res.ok) throw new Error();
    proxyPayload = await res.json();
  } catch {
    throw new ApiException(502, { code: "SERVICE_UNREACHABLE", message: "Identity service unreachable.", retryable: true });
  }
  
  const body = proxyPayload.data || {};
  if (!proxyPayload.ok || !body.access_token) {
    throw new ApiException(proxyPayload.status, { code: body.code || "MFA_FAILED", message: body.message || "Incorrect verification code." });
  }
  
  persist(body, tenantId, brandId);
}

export function logout(): void {
  clearSession();
}

export function isAuthenticated(): boolean {
  return getSession() != null;
}
