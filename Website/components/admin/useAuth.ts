"use client";

import { useSyncExternalStore } from "react";
import { getSession, type AdminSession } from "@/lib/admin/session";

/**
 * Reactive view of the client-side admin session. Re-renders on the custom
 * "zx-auth-change" event (fired by session.set/clear) and cross-tab storage
 * events, so login/logout in one place propagates everywhere.
 */

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("zx-auth-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("zx-auth-change", cb);
    window.removeEventListener("storage", cb);
  };
}

export function useAuth(): { session: AdminSession | null; authenticated: boolean } {
  const session = useSyncExternalStore(subscribe, getSession, () => null);
  return { session, authenticated: session != null };
}
