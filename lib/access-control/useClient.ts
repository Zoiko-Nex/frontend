"use client";

/**
 * useAccessControlClient — builds a memoized API client wired to your real
 * session (lib/admin/session.ts), the same source dashboards/page.tsx uses.
 */

import { useMemo } from "react";
import { AccessControlClient } from "./api";
import { getSession } from "@/lib/admin/session";

const BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_URL ?? "http://localhost:8080";

export function useAccessControlClient(): AccessControlClient {
  return useMemo(
    () =>
      new AccessControlClient({
        baseUrl: BASE_URL,
        getAuth: async () => {
          const session = getSession();
          return {
            accessToken: session?.accessToken ?? "",
            tenantId: session?.tenantId ?? "",
          };
        },
      }),
    []
  );
}

export default useAccessControlClient;