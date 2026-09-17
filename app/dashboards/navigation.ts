/**
 * Single source of truth for the tenant console's left navigation.
 *
 * Before this file the same screens were described in three places that had
 * drifted apart: `sidebarItems` (the menu), `searchableItems` (the top-bar
 * search, which listed only 10 of them) and the service cards on the Services
 * tab. Tax & Jurisdiction was rendered by the page but absent from the menu, so
 * the only way to reach it was a service card. Everything now derives from
 * NAV_SECTIONS, so a screen added here appears in the menu and in search at
 * once and cannot go missing from one of them again.
 *
 * `summary` and `steps` are the operator-facing help: `summary` answers "what
 * is this screen", `steps` answers "what do I do here". They are rendered by
 * ScreenGuide above each screen and as the sidebar tooltip. Keep `steps`
 * describing only actions the screen actually offers -- this is an operations
 * console, and guidance that promises a control that isn't there costs more
 * than no guidance at all.
 */

export interface NavEntry {
  /** Menu label. Matches the screen's own <h2> so the two never disagree. */
  label: string;
  /** Value of `currentTab` this entry selects. */
  tabKey: string;
  iconPath: string;
  /** One sentence: what this screen is for. */
  summary: string;
  /** Ordered, concrete actions available on this screen. */
  steps: string[];
  /** Extra search terms (old names, synonyms, backend service names). */
  keywords?: string[];
}

export interface NavSection {
  /** Uppercase heading shown in the sidebar. */
  section: string;
  /** One line explaining what the whole group covers; shown on hover. */
  blurb: string;
  items: NavEntry[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    section: "OVERVIEW",
    blurb: "Where the platform stands right now.",
    items: [
      {
        label: "Dashboard",
        tabKey: "Dashboard",
        iconPath: "/image/dashboard/dashboard-grid.svg",
        summary: "Your starting point: platform status, recent activity and the shortcuts you use most.",
        steps: [
          "Check the status strip at the top -- it reports what the services actually answered, not a fixed number.",
          "Use the quick links to jump to the screen you need.",
          "Anything unusual shows up here first; open the named screen to act on it.",
        ],
        keywords: ["home", "control room", "start"],
      },
      {
        label: "Services",
        tabKey: "Services",
        iconPath: "/image/dashboard/services.svg",
        summary: "Live health of every backend service behind this console, one card per service.",
        steps: [
          "The badge counts services that answered their health check just now.",
          "A card showing offline means that domain's screens will fail -- that is the cause, not your permissions.",
          "Open a card to reach the screen that service powers.",
        ],
        keywords: ["health", "status", "uptime", "online", "services"],
      },
      {
        label: "Revenue Snapshot",
        tabKey: "Billing",
        iconPath: "/image/dashboard/bar-chart.svg",
        summary: "One cross-domain count of customers, rated usage and issued invoices for this tenant.",
        steps: [
          "Read it as a sanity check across domains, not as a report -- every figure is a live count from a service.",
          "Issued value is grouped by currency deliberately; a single mixed total would be meaningless.",
          "For anything you need to act on, open Billing & Invoice.",
        ],
        keywords: ["commercials", "billing and commercials", "summary", "totals", "revenue"],
      },
      {
        label: "Deployment",
        tabKey: "Deployment",
        iconPath: "/image/dashboard/checkbox-list.svg",
        summary: "How this tenant is deployed and what is enabled for it.",
        steps: [
          "Confirm the region and deployment model before raising an infrastructure ticket.",
          "Use this to answer where your data lives without leaving the console.",
        ],
        keywords: ["region", "environment", "infrastructure", "hosting"],
      },
    ],
  },
  {
    section: "CUSTOMERS & ORDERS",
    blurb: "Define what you sell, onboard who buys it, then fulfil the order.",
    items: [
      {
        label: "Commercial Catalog",
        tabKey: "CatalogManagement",
        iconPath: "/image/dashboard/services.svg",
        summary: "The products and offer bundles you sell. Everything downstream prices against these.",
        steps: [
          "Create a Product first -- it is the thing being sold.",
          "Then build an Offer Bundle to package products with a price.",
          "Published versions are immutable so existing bills stay reproducible; publish a new version instead of editing a live one.",
        ],
        keywords: ["product", "offer", "bundle", "pricing", "plans", "tm forum", "catalogue"],
      },
      {
        label: "Subscribers & Accounts",
        tabKey: "CustomerManagement",
        iconPath: "/image/dashboard/user-profile.svg",
        summary: "The customer and account records everything else is attached to.",
        steps: [
          "Create the customer account before placing an order -- orders, invoices and payments all hang off it.",
          "Open a row to see that customer's accounts and current state.",
          "If a customer is missing here, no other screen will find them.",
        ],
        keywords: ["customer", "accounts", "subscriber", "crm"],
      },
      {
        label: "Lifecycle & KYC",
        tabKey: "CustomerLifecycleKyc",
        iconPath: "/image/dashboard/shield-check.svg",
        summary: "Identity verification and lifecycle state for customers that need a compliance check.",
        steps: [
          "Start a KYC case for a customer that requires verification.",
          "Track the case to a decision; provisioning stays blocked while it is pending.",
          "Outcomes are written to the Evidence Ledger, so decisions here are auditable later.",
        ],
        keywords: ["kyc", "compliance", "verification", "identity", "onboarding", "sanctions"],
      },
      {
        label: "Orders & Provisioning",
        tabKey: "OrderManagement",
        iconPath: "/image/dashboard/checkbox-list.svg",
        summary: "Place orders and drive them through provisioning, including SIM and eSIM state.",
        steps: [
          "Place a telecom order against an existing customer and offer.",
          "Open the order to advance it -- only transitions the backend permits are offered, so a missing button means that step is not legal yet.",
          "The provisioning record and SIM/eSIM state update as the saga progresses.",
        ],
        keywords: ["order", "saga", "provisioning", "sim", "esim", "activation", "msisdn", "number"],
      },
    ],
  },
  {
    section: "CHARGE & BILL",
    blurb: "Turn usage into a taxed, issued invoice and take the money.",
    items: [
      {
        label: "Usage & Charging",
        tabKey: "UsageCharging",
        iconPath: "/image/dashboard/charging-lightning.svg",
        summary: "Usage records arriving from the network and the rated charges produced from them.",
        steps: [
          "Check raw usage has arrived before you look for a charge -- nothing rates that was never ingested.",
          "Rated records show the price the charging engine applied.",
          "A gap between ingested and rated counts is the first thing to investigate in a billing dispute.",
        ],
        keywords: ["usage", "cdr", "mediation", "rating", "charging", "ingestion", "records"],
      },
      {
        label: "Tax & Jurisdiction",
        tabKey: "TaxJurisdiction",
        iconPath: "/image/dashboard/shield.svg",
        summary: "The tax rules, jurisdictions and exemptions applied to charges before invoicing.",
        steps: [
          "Confirm the jurisdiction is configured before the first bill run in a new market.",
          "Exemptions are applied at rating time, so add them before the cycle runs, not after.",
          "If an invoice total looks wrong, check the rule that applied here first.",
        ],
        keywords: ["tax", "vat", "jurisdiction", "regulatory fees", "exemption", "taxation"],
      },
      {
        label: "Billing & Invoice",
        tabKey: "BillingManagement",
        iconPath: "/image/dashboard/billing-document.svg",
        summary: "Bill cycles and the invoices they produce for your customers.",
        steps: [
          "Run the bill cycle to turn rated usage into draft invoices.",
          "Review a draft, then issue it -- issuing is what makes it payable and visible to the customer.",
          "An empty cycle almost always means usage never rated; check Usage & Charging.",
        ],
        keywords: ["invoice", "bill run", "billing cycle", "draft", "issue", "charges"],
      },
      {
        label: "Payments & Collections",
        tabKey: "PaymentsManagement",
        iconPath: "/image/dashboard/credit-card.svg",
        summary: "Payments received against issued invoices, plus refunds.",
        steps: [
          "Record or review a payment against the invoice it settles.",
          "An invoice only clears once the payment is applied to it -- a payment with no allocation leaves the invoice open.",
          "Unpaid invoices past their terms flow into Dunning & Disputes.",
        ],
        keywords: ["payment", "collections", "refund", "settlement", "receipts", "paid"],
      },
    ],
  },
  {
    section: "COLLECT & SETTLE",
    blurb: "Chase what is unpaid and settle what you owe others.",
    items: [
      {
        label: "Dunning & Disputes",
        tabKey: "DunningDisputes",
        iconPath: "/image/dashboard/sidebar-notification.svg",
        summary: "Overdue invoice chasing and customer-raised billing disputes.",
        steps: [
          "Dunning cases open as invoices age past their terms.",
          "Raise a dispute against the specific invoice being challenged so the audit trail stays attached to it.",
          "Resolving a dispute does not pay the invoice -- apply the payment or credit separately.",
        ],
        keywords: ["dunning", "overdue", "arrears", "dispute", "chase", "collections"],
      },
      {
        label: "Partner & Settlement",
        tabKey: "PartnerSettlement",
        iconPath: "/image/dashboard/user-profile.svg",
        summary: "What you owe partners and resellers, and what they owe you.",
        steps: [
          "Check the partner's agreement terms before you run a settlement period.",
          "Run the period to calculate the balance from the usage it covers.",
          "Reconcile against the partner's own statement before paying out.",
        ],
        keywords: ["partner", "reseller", "settlement", "revenue share", "payout", "wholesale"],
      },
      {
        label: "Finance Ledger",
        tabKey: "FinanceLedger",
        iconPath: "/image/dashboard/bar-chart.svg",
        summary: "The double-entry journal behind every billing and payment event.",
        steps: [
          "Use it to answer which entries produced a balance -- entries are posted by the services, not typed here.",
          "Every invoice and payment should have a matching journal entry; a missing one is a real defect worth raising.",
          "Export from Reporting & Regulatory when finance needs it outside the console.",
        ],
        keywords: ["ledger", "journal", "double entry", "gl", "accounting", "finance fabric", "balance"],
      },
    ],
  },
  {
    section: "ASSURANCE & RISK",
    blurb: "Catch revenue that leaked and activity that looks wrong.",
    items: [
      {
        label: "Revenue Assurance",
        tabKey: "RevenueAssurance",
        iconPath: "/image/dashboard/shield.svg",
        summary: "Reconciliation that finds usage which was carried but never billed.",
        steps: [
          "Run a reconciliation across a period to compare what was ingested, rated and invoiced.",
          "Each discrepancy names the stage it broke at -- start there, not at the invoice.",
          "Recurring leakage at the same stage is a configuration problem, not a one-off.",
        ],
        keywords: ["assurance", "leakage", "reconciliation", "revenue", "discrepancy", "variance"],
      },
      {
        label: "Fraud & Risk",
        tabKey: "FraudRisk",
        iconPath: "/image/dashboard/shield.svg",
        summary: "Fraud alerts raised against usage patterns, and the rules that raise them.",
        steps: [
          "Work the open alerts first -- each names the rule and the account that triggered it.",
          "Tune a rule when it fires repeatedly on legitimate traffic; a noisy rule gets ignored, which is worse than no rule.",
          "Confirmed fraud usually needs action on the customer in Subscribers & Accounts too.",
        ],
        keywords: ["fraud", "risk", "alert", "rules", "suspicious", "abuse", "threshold"],
      },
    ],
  },
  {
    section: "COMPLIANCE & EVIDENCE",
    blurb: "Prove to a regulator or auditor what happened and when.",
    items: [
      {
        label: "Evidence Ledger",
        tabKey: "EvidenceLedger",
        iconPath: "/image/dashboard/document.svg",
        summary: "A tamper-evident hash chain of significant platform events.",
        steps: [
          "Look up an evidence record by its id to see the event it captured.",
          "Verify the record to confirm its hash still matches the chain -- that is the proof it was not altered.",
          "A verification failure is a serious finding; escalate it rather than retrying.",
        ],
        keywords: ["evidence", "audit", "hash", "merkle", "chain", "tamper", "proof", "immutable"],
      },
      {
        label: "Reporting & Regulatory",
        tabKey: "RegulatoryExports",
        iconPath: "/image/dashboard/document.svg",
        summary: "Scheduled and on-demand exports for regulators and internal finance.",
        steps: [
          "Pick the report and the period it must cover.",
          "Generate it, then download the produced file -- generation is asynchronous, so it may not be ready instantly.",
          "Exports are evidence; keep the generated file rather than regenerating it later from changed data.",
        ],
        keywords: ["report", "export", "regulator", "regulatory", "filing", "download", "csv"],
      },
      {
        label: "Trust Vault",
        tabKey: "Trust",
        iconPath: "/image/dashboard/shield.svg",
        summary: "Compliance certifications and security documents for this platform.",
        steps: [
          "Use it to answer a customer's security questionnaire without leaving the console.",
          "Restricted documents need a request; approved ones can be read directly.",
        ],
        keywords: ["trust", "soc 2", "iso", "certification", "security", "compliance documents", "vault"],
      },
    ],
  },
  {
    section: "BUILD & INTEGRATE",
    blurb: "Connect your own systems to the platform.",
    items: [
      {
        label: "Integrations",
        tabKey: "Integration",
        iconPath: "/image/dashboard/api-braces.svg",
        summary: "API credentials, webhooks and connections to your external systems.",
        steps: [
          "Create credentials scoped to the one integration that needs them, never a shared key.",
          "Register a webhook to receive events instead of polling.",
          "Test the connection here before you point production traffic at it.",
        ],
        keywords: ["api", "webhook", "integration", "credentials", "keys", "connector", "gateway"],
      },
      {
        label: "Sandbox / POC",
        tabKey: "Sandbox",
        iconPath: "/image/dashboard/code-tags.svg",
        summary: "Send real API calls from the browser to try a flow before you build against it.",
        steps: [
          "Pick a service and an endpoint, then send the request.",
          "The response is the real backend's -- this is a live call, not a mock.",
          "Use it to confirm a payload shape before writing the integration.",
        ],
        keywords: ["sandbox", "poc", "api client", "try", "test", "playground", "request"],
      },
      {
        label: "Documentation",
        tabKey: "Documentation",
        iconPath: "/image/dashboard/document.svg",
        summary: "Guides and API reference for the platform.",
        steps: [
          "Start with Getting started if this console is new to you.",
          "The API reference covers auth, endpoints and rate limits for the integration work.",
        ],
        keywords: ["docs", "documentation", "guide", "reference", "help", "manual", "getting started"],
      },
    ],
  },
  {
    section: "ADMINISTRATION",
    blurb: "Who can do what in this console, and how to get help.",
    items: [
      {
        label: "Access Groups",
        tabKey: "AccessGroups",
        iconPath: "/image/dashboard/user-profile.svg",
        summary: "Roles and the permissions each one grants across the screens in this menu.",
        steps: [
          "Build the role and its permissions before inviting the person who needs it.",
          "A permission here maps to a group of screens; removing it hides those screens for that role.",
          "Greyed-out menu items with a padlock are screens your own role does not grant.",
        ],
        keywords: ["roles", "permissions", "access", "rbac", "groups", "policy", "grants"],
      },
      {
        label: "Admin Settings",
        tabKey: "Settings",
        iconPath: "/image/dashboard/settings-gear.svg",
        summary: "Tenant settings, brands and the users who can sign in.",
        steps: [
          "Invite a user with the role you prepared in Access Groups.",
          "Brands set the context the rest of the console operates in; switch the active brand in the top bar.",
        ],
        keywords: ["settings", "users", "invite", "tenant", "brand", "profile", "admin"],
      },
      {
        label: "Support & Success",
        tabKey: "Support",
        iconPath: "/image/dashboard/sidebar-notification.svg",
        summary: "Raise a ticket and see your support entitlements.",
        steps: [
          "Include the screen name and what you expected -- that is what makes a ticket actionable.",
          "Check your SLA tier before escalating.",
        ],
        keywords: ["support", "ticket", "help", "sla", "contact", "success"],
      },
    ],
  },
];

/** Flattened lookup: tabKey -> entry. Used by ScreenGuide and the top-bar search. */
export const NAV_ENTRIES: NavEntry[] = NAV_SECTIONS.flatMap((s) => s.items);

export const NAV_BY_TAB: Record<string, NavEntry> = Object.fromEntries(
  NAV_ENTRIES.map((e) => [e.tabKey, e])
);

/** The section heading a tab sits under, for the breadcrumb above each screen. */
export const SECTION_BY_TAB: Record<string, string> = Object.fromEntries(
  NAV_SECTIONS.flatMap((s) => s.items.map((e) => [e.tabKey, s.section]))
);
