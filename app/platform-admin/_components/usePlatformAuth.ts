"use client";

import { useSyncExternalStore } from "react";
import { getPlatformSession, type PlatformSession } from "@/lib/admin/platform/session";

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("zx-platform-auth-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("zx-platform-auth-change", cb);
    window.removeEventListener("storage", cb);
  };
}

export function usePlatformAuth(): { session: PlatformSession | null; authenticated: boolean } {
  const session = useSyncExternalStore(subscribe, getPlatformSession, () => null);
  return { session, authenticated: session != null };
}
