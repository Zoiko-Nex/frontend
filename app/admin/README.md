# ZoikoNex Operations Console (`/admin`)

A production-grade super-admin / operations panel for the ZoikoNex Tier-1 BSS
platform, mounted inside the existing marketing site at **`/admin`**. The
marketing site is untouched (no routes moved); `SiteChrome` simply hides the
public header/footer under `/admin`, which renders its own full-screen console.

## How it talks to the backend

Per requirement, **there is no API layer in the frontend.** The browser calls
the 18 Go backend services **directly**. A thin client integration layer handles
the fact that the services use three different auth/header conventions:

| Convention | Services | What the client sends |
|---|---|---|
| `jwt` | most domains | `Authorization: Bearer <token>` (tenant from JWT claims) |
| `tenant-header` | identity-tenancy (login), rating-charging | Bearer + `X-Tenant-ID` |
| `tenant-brand-idem` | reporting-regulatory | Bearer + `X-Tenant-ID` + `X-Brand-ID` + `Idempotency-Key` |

The convention per service lives in [`lib/admin/services.ts`](../../lib/admin/services.ts).
[`lib/admin/client.ts`](../../lib/admin/client.ts) injects the right headers, parses
the platform error envelope, and on a `401` attempts one silent token refresh
(refresh tokens **rotate**) before forcing re-login.

### CORS — backend action required

Calling services directly from the browser means **each service must allow this
panel's origin** (`http://localhost:3000` in dev) in its CORS config.
`identity-tenancy` already defaults to `http://localhost:3000`. The other 17
services need their `ALLOWED_ORIGINS` updated **in the backend** — this panel does
not and cannot do that. If a domain shows "service unreachable," CORS is the most
likely cause (check the browser console for a CORS error vs. a network error).

### Tokens live in the browser

With no server layer, tokens are stored client-side (localStorage, in
[`lib/admin/session.ts`](../../lib/admin/session.ts)). Acceptable for an internal
dev tool; for hardened production, a server-held-token BFF would be the upgrade.

> Dev note: backends regenerate their RS256 signing key on restart, so all tokens
> die when a service restarts — just sign in again.

## Configuration

`.env.local` holds `NEXT_PUBLIC_SVC_*` base URLs (one per service) and the
seeded `NEXT_PUBLIC_DEFAULT_TENANT_ID` / `_BRAND_ID`. Change the URLs to point at
staging/prod.

## Running

```bash
npm run dev            # http://localhost:3000/admin
```

Seeded operator (Acme Telecom tenant):
`admin@acme.com` / `SecurePassword123`. The MFA branch (`engineer@acme.com`)
accepts dev codes `123456` / `564890`.

## What's wired

Four flagship domains are fully integrated end-to-end:

- **Identity & Tenancy** — users, sessions, roles, policies
- **Customers & Accounts** — customer + account detail with full lifecycle
  state-machine actions (Submit KYC / Activate / Suspend / Terminate; account
  Activate / Suspend / Close)
- **Billing & Invoice** — invoices, line items, issue/cancel, credit & debit
  notes, bill cycles (immutability respected — issued invoices correct via notes)
- **Payments** — intent funnel dashboard, authorise/capture/void, refunds,
  settlements, append-only event log (mutations carry `Idempotency-Key`)

The remaining 14 domains are scaffolded routes (nav marked "soon") that follow
the same template. To wire one: add a `page.tsx` using `lib/admin/client`'s `api`
and the `_components/ui` kit — copy the shape of `app/admin/payments/page.tsx`.

## Design system

Scoped under `.admin-root` in `admin.css` so it never touches the marketing
theme. NOC-instrumentation aesthetic: cool near-black ground, signal-green accent
("live/healthy"), monospace for money / IDs / states. Money is always rendered
from integer minor units via `lib/admin/money.ts` (per-currency exponents, never
floats). Lifecycle states are colored by `StatusBadge` from the platform's state
machines.

## Key files

```
app/admin/
  layout.tsx                 # admin theme + providers + shell
  admin.css                  # scoped design tokens
  page.tsx                   # Control Room dashboard
  _components/               # AdminShell, LoginScreen, ui kit, StatusBadge, nav
  identity/ customers/ billing/ payments/   # wired domains (+ [id] detail routes)
  <14 others>/page.tsx       # scaffolded
lib/admin/
  services.ts                # service registry: ports + header conventions
  client.ts                  # direct-call API client (headers, refresh, errors)
  session.ts auth.ts         # client-side token store + login/MFA/refresh
  money.ts                   # minor-units money formatting
```
