/**
 * The single host the platform super-admin console is allowed to be used from.
 *
 * Super-admin sign-in is deliberately pinned to ONE domain
 * (super-admin.zoikonex.com) rather than being reachable from the marketing
 * apex or from any tenant subdomain. Two layers enforce it:
 *
 *   1. middleware.ts — redirects /platform-admin and /Super-admin to the
 *      canonical host, so the console is never *served* anywhere else. This is
 *      the real enforcement point (edge, before any page renders).
 *   2. isSuperAdminHost() below — the browser-side guard used by
 *      platformLogin() and the console shells, so a stale bundle or a hosts-file
 *      trick still can't post credentials from the wrong origin, and the
 *      operator gets a clear message instead of a confusing 401.
 *
 * Note this is an operational boundary, not an authentication boundary: the
 * identity-tenancy backend cannot see which browser host a request came from,
 * so a determined caller can always talk to /v1/sessions directly. Authorization
 * still rests on the `role_platform_admin` check in platform/auth.ts and on the
 * backend's own scope enforcement.
 *
 * LEGACY_SUPER_ADMIN_HOST is the pre-existing un-hyphenated spelling. It is
 * redirected to the canonical host so old bookmarks survive, but it is NOT a
 * valid login origin.
 */

export const SUPER_ADMIN_HOST =
  process.env.NEXT_PUBLIC_SUPER_ADMIN_HOST || "super-admin.zoikonex.com";

export const LEGACY_SUPER_ADMIN_HOST = "superadmin.zoikonex.com";

/** Hosts allowed to run the console in local development. */
const DEV_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function isSuperAdminHost(hostname?: string | null): boolean {
  const host = (hostname ?? (typeof window !== "undefined" ? window.location.hostname : ""))
    .toLowerCase()
    .replace(/:\d+$/, "");
  if (!host) return false;
  if (host === SUPER_ADMIN_HOST.toLowerCase()) return true;
  // Dev/preview only — never a production zoikonex.com host.
  return DEV_HOSTS.has(host) || host.endsWith(".vercel.app");
}

/** Absolute URL of the super-admin sign-in screen, for invites and redirects. */
export function superAdminLoginUrl(): string {
  return `https://${SUPER_ADMIN_HOST}/platform-admin`;
}
