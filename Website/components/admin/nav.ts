/**
 * Navigation registry for the operations console. Grouped to mirror the
 * platform's bounded-context architecture (CLAUDE.md §2). `live: true` domains
 * are fully wired in this build; the rest are scaffolded routes that follow the
 * same template.
 */

export interface NavItem {
  label: string;
  href: string;
  live: boolean;
  /** Permission domain key (matches lib/admin/services.ts ServiceKey), or
   *  "overview" for items every authenticated user may see regardless of
   *  their resolved permissions. Used by AdminShell to hide sections a
   *  sub-user's role/policies don't grant. */
  domain: string;
}
export interface NavGroup {
  group: string;
  items: NavItem[];
}

/** Flat domain/label list for the role permission picker (lib/admin/permissions.ts). */
export function permissionDomains(): { domain: string; label: string }[] {
  return NAV.flatMap((g) => g.items)
    .filter((item) => item.domain !== "overview")
    .map((item) => ({ domain: item.domain, label: item.label }));
}

export const NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Control Room", href: "/admin", live: true, domain: "overview" }],
  },
  {
    group: "Identity & Customers",
    items: [
      { label: "Identity & Tenancy", href: "/admin/identity", live: true, domain: "identity" },
      { label: "Customers & Accounts", href: "/admin/customers", live: true, domain: "customer" },
      { label: "Lifecycle & KYC", href: "/admin/kyc", live: false, domain: "kyc" },
    ],
  },
  {
    group: "Commercial & Provisioning",
    items: [
      { label: "Product Catalogue", href: "/admin/catalogue", live: false, domain: "catalogue" },
      { label: "Orders & Provisioning", href: "/admin/orders", live: false, domain: "order" },
      { label: "Integration Ecosystem", href: "/admin/integration", live: false, domain: "integration" },
    ],
  },
  {
    group: "Usage & Rating",
    items: [
      { label: "Usage & Mediation", href: "/admin/usage", live: false, domain: "usage" },
      { label: "Rating & Charging", href: "/admin/rating", live: false, domain: "rating" },
      { label: "Tax & Jurisdiction", href: "/admin/tax", live: false, domain: "tax" },
    ],
  },
  {
    group: "Financial",
    items: [
      { label: "Billing & Invoice", href: "/admin/billing", live: true, domain: "billing" },
      { label: "Payments", href: "/admin/payments", live: true, domain: "payments" },
      { label: "Finance Ledger", href: "/admin/finance", live: false, domain: "finance" },
      { label: "Evidence Ledger", href: "/admin/evidence", live: false, domain: "evidence" },
    ],
  },
  {
    group: "Assurance & Risk",
    items: [
      { label: "Partner Settlement", href: "/admin/partner", live: false, domain: "partner" },
      { label: "Revenue Assurance", href: "/admin/revenue-assurance", live: false, domain: "revenueAssurance" },
      { label: "Dunning & Disputes", href: "/admin/dunning", live: false, domain: "dunning" },
      { label: "Fraud & Risk", href: "/admin/fraud", live: false, domain: "fraud" },
      { label: "Reporting & Regulatory", href: "/admin/reporting", live: false, domain: "reporting" },
    ],
  },
];
