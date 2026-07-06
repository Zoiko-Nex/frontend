"use client";

import { useState } from "react";
import { Button } from "./ui";

/** Absolute URL of this tenant console's login screen, for share-invite text. */
export function loginUrl(): string {
  if (typeof window === "undefined") return "https://zoikonex.com/admin";
  return `${window.location.origin}/admin`;
}

export function buildInvite(opts: { label: string; tenantId?: string; email: string; password?: string }): string {
  const lines = [`ZoikoNex login — ${opts.label}`, `URL: ${loginUrl()}`];
  if (opts.tenantId) lines.push(`Tenant ID: ${opts.tenantId}`);
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
