"use client";

/**
 * Client-side session for the platform-wide super-admin console
 * (`/platform-admin`), kept deliberately separate from the tenant-scoped
 * admin session (`lib/admin/session.ts`, key `zx_admin_session`). The two
 * consoles authenticate against different tenants (the synthetic platform
 * tenant vs. a real customer tenant) — sharing one storage key would let
 * signing into one silently clobber the other.
 */

const KEY = "zx_platform_session";

export interface PlatformSession {
  accessToken: string;
  refreshToken: string;
  sessionId?: string;
  expiresAt: number; // epoch ms
  loginTime?: number; // epoch ms when logged in
  lastLoginAt?: string; // formatted date-time string
  tenantId: string; // the synthetic platform tenant's id
  email?: string;
  userId?: string;
  roles?: string[];
}

let memory: PlatformSession | null = null;

export function getPlatformSession(): PlatformSession | null {
  if (memory) return memory;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    memory = raw ? (JSON.parse(raw) as PlatformSession) : null;
  } catch {
    memory = null;
  }
  return memory;
}

export function setPlatformSession(session: PlatformSession): void {
  memory = session;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(session));
    window.dispatchEvent(new Event("zx-platform-auth-change"));
  }
}

export function clearPlatformSession(): void {
  memory = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("zx-platform-auth-change"));
  }
}
