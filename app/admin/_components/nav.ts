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
}
export interface NavGroup {
  group: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    group: "Overview",
    items: [{ label: "Control Room", href: "/admin", live: true }],
  },
  {
    group: "Identity & Customers",
    items: [
      { label: "Identity & Tenancy", href: "/admin/identity", live: true },
      { label: "Customers & Accounts", href: "/admin/customers", live: true },
      { label: "Lifecycle & KYC", href: "/admin/kyc", live: false },
    ],
  },
  {
    group: "Commercial & Provisioning",
    items: [
      { label: "Product Catalogue", href: "/admin/catalogue", live: false },
      { label: "Orders & Provisioning", href: "/admin/orders", live: false },
      { label: "Integration Ecosystem", href: "/admin/integration", live: false },
    ],
  },
  {
    group: "Usage & Rating",
    items: [
      { label: "Usage & Mediation", href: "/admin/usage", live: false },
      { label: "Rating & Charging", href: "/admin/rating", live: false },
      { label: "Tax & Jurisdiction", href: "/admin/tax", live: false },
    ],
  },
  {
    group: "Financial",
    items: [
      { label: "Billing & Invoice", href: "/admin/billing", live: true },
      { label: "Payments", href: "/admin/payments", live: true },
      { label: "Finance Ledger", href: "/admin/finance", live: false },
      { label: "Evidence Ledger", href: "/admin/evidence", live: false },
    ],
  },
  {
    group: "Assurance & Risk",
    items: [
      { label: "Partner Settlement", href: "/admin/partner", live: false },
      { label: "Revenue Assurance", href: "/admin/revenue-assurance", live: false },
      { label: "Dunning & Disputes", href: "/admin/dunning", live: false },
      { label: "Fraud & Risk", href: "/admin/fraud", live: false },
      { label: "Reporting & Regulatory", href: "/admin/reporting", live: false },
    ],
  },
];
