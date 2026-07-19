/**
 * canonical.ts — client-side URL canonicalizer.
 *
 * This is a faithful port of the Go canonicalizer in
 * internal/domain/authorization/routebinding.go. Keep the two in sync: the
 * frontend uses this to warn "this route is already assigned" *as the admin
 * types*, and the backend uses the Go version as the source of truth on submit.
 * If they disagree, the backend wins (the UI just shows a stale hint).
 *
 * All four of these fold to the same key `mysite.com|products|edit`:
 *   mysite.com/products/{id}?edit=yes
 *   mysite.com/products_edit/id
 *   mysite.com/products/{id}/edit
 *   mysite.com/products/edit/{id}
 */

export type MatchLevel = "none" | "related" | "equivalent" | "exact";

export interface Fingerprint {
  host: string;
  resource: string[];
  action: string;
  key: string; // host|resource/path|action — the dedup key
  normalizedUrl: string;
}

// The two tuning knobs. Keep aligned with the Go package vars.
const ACTION_SYNONYMS: Record<string, string> = {
  edit: "edit", update: "edit", modify: "edit", patch: "edit",
  create: "create", new: "create", add: "create", register: "create",
  delete: "delete", remove: "delete", destroy: "delete", archive: "delete",
  view: "view", show: "view", detail: "view", details: "view",
  get: "view", read: "view", preview: "view",
  list: "list", index: "list", all: "list", search: "list", browse: "list",
  export: "export", download: "export", print: "export",
};

const ID_PARAM_NAMES = new Set([
  "id", "ids", "uuid", "guid", "slug", "pk", "key", "ref",
]);

const NOISE_TOKENS = new Set([
  "api", "www", "app", "public",
  "yes", "no", "true", "false", "1", "0",
]);

const RE_PLACEHOLDER = /^[{:<].*[}>]?$|^\{.*\}$|^:.+$/;
const RE_NUMERIC = /^\d+$/;
const RE_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const RE_HEX_ID = /^[0-9a-f]{16,}$/;
const RE_API_VERSION = /^v\d+$/;
const RE_WORD_SPLIT = /[_\-.]+/;
const RE_CAMEL = /([a-z0-9])([A-Z])/g;

const ACTION_PRECEDENCE = ["delete", "create", "edit", "export", "view", "list"];

function isIdToken(tok: string): boolean {
  if (ID_PARAM_NAMES.has(tok)) return true;
  return (
    RE_PLACEHOLDER.test(tok) ||
    RE_NUMERIC.test(tok) ||
    RE_UUID.test(tok) ||
    RE_HEX_ID.test(tok)
  );
}

function splitSegment(seg: string): string[] {
  return seg
    .replace(RE_CAMEL, "$1 $2")
    .replace(RE_WORD_SPLIT, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function pickAction(set: Set<string>): string {
  for (const a of ACTION_PRECEDENCE) if (set.has(a)) return a;
  return [...set].sort()[0];
}

export function canonicalize(raw: string): Fingerprint {
  raw = (raw ?? "").trim();

  // URL needs a scheme to parse host reliably.
  let host = "";
  let path = raw;
  let params: URLSearchParams | null = null;
  try {
    const target = /:\/\//.test(raw) || raw.startsWith("//")
      ? raw.replace(/^\/\//, "https://")
      : "https://" + raw;
    const u = new URL(target);
    host = u.hostname.toLowerCase().replace(/^www\./, "");
    path = u.pathname;
    params = u.searchParams;
  } catch {
    // fall through with raw as path
  }

  const resource: string[] = [];
  const actions = new Set<string>();

  const classify = (tokRaw: string) => {
    const tok = tokRaw.toLowerCase().trim();
    if (!tok || NOISE_TOKENS.has(tok) || RE_API_VERSION.test(tok)) return;
    if (isIdToken(tok)) return;
    const canon = ACTION_SYNONYMS[tok];
    if (canon) {
      actions.add(canon);
      return;
    }
    resource.push(tok);
  };

  for (const rawSeg of path.split("/")) {
    if (!rawSeg) continue;
    // The URL API percent-encodes {id} -> %7Bid%7D; decode so placeholders and
    // id tokens are recognized the same way the Go side (net/url, raw) sees them.
    let seg = rawSeg;
    try {
      seg = decodeURIComponent(rawSeg);
    } catch {
      /* leave as-is on malformed escape */
    }
    if (isIdToken(seg)) continue; // catch {id} before splitting shreds it
    for (const sub of splitSegment(seg)) classify(sub);
  }

  if (params) {
    for (const k of [...params.keys()].sort()) {
      if (ID_PARAM_NAMES.has(k.toLowerCase())) continue;
      classify(k);
      for (const v of params.getAll(k)) classify(v);
    }
  }

  // de-dupe resource, keep first-seen order
  const seen = new Set<string>();
  const dedupedResource = resource.filter((r) =>
    seen.has(r) ? false : (seen.add(r), true)
  );

  const action = actions.size ? pickAction(actions) : "view";
  const key = `${host}|${dedupedResource.join("/")}|${action}`;
  const normalizedUrl =
    host + dedupedResource.map((r) => "/" + r).join("") + "#" + action;

  return { host, resource: dedupedResource, action, key, normalizedUrl };
}

export function compare(a: Fingerprint, b: Fingerprint): MatchLevel {
  if (a.normalizedUrl === b.normalizedUrl) return "exact";
  const sameHost = a.host === b.host;
  const sameResource = a.resource.join("/") === b.resource.join("/");
  if (sameHost && sameResource && a.action === b.action) return "equivalent";
  if (sameHost && sameResource) return "related";
  return "none";
}

export default canonicalize;
