"use client";

import { useState } from "react";
import { isApexDomain } from "@/lib/admin/tenant-resolver";
import { Button } from "./ui";

/**
 * Absolute URL of a tenant console's login screen, for share-invite text.
 *
 * Pass `domainSuffix` (tenants.domain_suffix, e.g. "driverz.zoikonex.com")
 * whenever the caller knows which tenant the invite is for — a super admin on
 * super-admin.zoikonex.com inviting a DriverZ operator must hand out DriverZ's
 * domain, not their own. Without it we fall back to the current origin, which is
 * correct when a tenant admin invites a colleague from their own subdomain.
 *
 * The path is /login (the real tenant sign-in, which redirects to /dashboards).
 * /admin is a separate demo console and was never the right link to send.
 */
export function loginUrl(domainSuffix?: string): string {
  if (domainSuffix) return `https://${domainSuffix}/login`;
  if (typeof window === "undefined") return "https://zoikonex.com/login";
  return `${window.location.origin}/login`;
}

/**
 * A tenant subdomain login page resolves the tenant from its own hostname (see
 * lib/admin/tenant-resolver.ts), so the invitee never needs the raw UUID. It's
 * only required when the link lands on an apex host that can't self-resolve.
 */
function urlSelfResolvesTenant(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !isApexDomain(host);
  } catch {
    return false;
  }
}

export function buildInvite(opts: {
  label: string;
  tenantId?: string;
  email: string;
  password?: string;
  /** tenants.domain_suffix of the tenant being invited into, when known. */
  domainSuffix?: string;
}): string {
  const url = loginUrl(opts.domainSuffix);
  const lines = [`ZoikoNex login — ${opts.label}`, `URL: ${url}`];
  if (opts.tenantId && !urlSelfResolvesTenant(url)) lines.push(`Tenant ID: ${opts.tenantId}`);
  lines.push(`Email: ${opts.email}`);
  if (opts.password) lines.push(`Temporary password: ${opts.password}`);
  return lines.join("\n");
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant={copied ? "primary" : "default"}
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); }}
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}

/** Cryptographically-random password meeting a "good enough" complexity bar,
 *  for the "Generate" convenience button on user-creation forms. */
export function generatePassword(length = 16): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 0xffffffff);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
