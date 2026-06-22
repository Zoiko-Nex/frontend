"use client";

/**
 * Client-side admin session. Since the panel calls the backends directly (no
 * frontend API layer), tokens live in the browser. We keep them in localStorage
 * so a refresh survives reloads, plus an in-memory mirror for fast reads.
 *
 * Note: ZoikoNex dev backends regenerate their RS256 signing key on restart,
 * so all tokens are invalidated whenever a service restarts. The client handles
 * the resulting 401s by attempting a refresh, then forcing re-login.
 */

const KEY = "zx_admin_session";

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  expiresAt: number; // epoch ms
  tenantId: string;
  brandId?: string;
  email?: string;
  userId?: string;
  roles?: string[];
}

let memory: AdminSession | null = null;

export function getSession(): AdminSession | null {
  if (memory) return memory;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    memory = null;
  }
  return memory;
}

export function setSession(session: AdminSession): void {
  memory = session;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("zx-auth-change"));
  }
}

export function patchSession(patch: Partial<AdminSession>): void {
  const cur = getSession();
  if (!cur) return;
  setSession({ ...cur, ...patch });
}

export function clearSession(): void {
  memory = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("zx-auth-change"));
  }
}

/** Decode a JWT payload without verifying — display only, never for authz. */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}
