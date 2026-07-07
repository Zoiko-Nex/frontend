import Link from "next/link";

export default function DomainArchitecturePage() {
  const domains = [
    {
      id: "01",
      slug: "identity-tenancy-access",
      title: "Identity, Tenancy & Access",
      description:
        "Multi-tenant hierarchy with RBAC/ABAC policy enforcement, approval workflows, just-in-time privilege elevation, and break-glass controls.",
    },
    {
      id: "02",
      slug: "customer-account",
      title: "Customer & Account",
      description:
        "Single source of truth for party, subscriber, billing account, credit profile, and consent across consumer, SME, enterprise, and pooled models.",
    },
    {
      id: "03",
      slug: "product-catalog-rules",
      title: "Product Catalog & Rules",
      description:
        "Versioned plans, bundles, promotions, roaming packs, ILD offers, and partner overlays with governed eligibility logic.",
    },
    {
      id: "04",
      slug: "order-management-provisioning",
      title: "Order Management & Provisioning",
      description:
        "Order capture, decomposition, fulfillment orchestration, SIM/eSIM assignment, and deterministic rollback on provisioning failure.",
    },
    {
      id: "05",
      slug: "customer-lifecycle-kyc",
      title: "Customer Lifecycle & KYC",
      description:
        "Regulated onboarding, verification adapters, SIM registration compliance, activation approval, and controlled lifecycle state transitions.",
    },
    {
      id: "06",
      slug: "usage-ingestion-mediation",
      title: "Usage Ingestion & Mediation",
      description:
        "Carrier-grade ingestion, normalization, enrichment, deduplication, replay-safe processing, and late-arrival policy enforcement.",
    },
    {
      id: "07",
      slug: "rating-charging-core",
      title: "Rating & Charging Core",
      description:
        "Real-time and offline charging across prepaid, postpaid, hybrid, roaming, wholesale, and interconnect.",
    },
    {
      id: "08",
      slug: "billing-invoicing-disputes",
      title: "Billing, Invoicing & Disputes",
      description:
        "Bill-run orchestration, multi-currency invoices, credit/debit notes, dunning, payment-plan support, and structured dispute handling.",
    },
    {
      id: "09",
      slug: "payments-wallets-reconciliation",
      title: "Payments, Wallets & Reconciliation",
      description:
        "Multi-rail collections including card, bank, mobile money, wallet, and voucher with allocations and settlement handling.",
    },
    {
      id: "10",
      slug: "tax-jurisdiction-engine",
      title: "Tax & Jurisdiction Engine",
      description:
        "Runtime jurisdiction routing, multi-engine tax orchestration, provider failover, exemption handling, and invoice compliance templates.",
    },
    {
      id: "11",
      slug: "voice-ild-orchestration",
      title: "Voice / ILD Orchestration",
      description:
        "Rate deck management, route economics, quality scoring, settlement logic, and fraud detection.",
    },
    {
      id: "12",
      slug: "device-protection-vas",
      title: "Device Protection & VAS",
      description:
        "Enrollment, claims synchronization, revenue-share billing, and white-label VAS orchestration tied to commercial packages.",
    },
    {
      id: "13",
      slug: "esim-iot-lifecycle",
      title: "eSIM & IoT Lifecycle",
      description:
        "GSMA-aligned eSIM profile management, IoT fleet orchestration, remote action flows, and usage aggregation.",
    },
    {
      id: "14",
      slug: "network-api-monetization",
      title: "Network API Monetization",
      description:
        "CAMARA / Open Gateway exposure, metering, entitlement management, QoS-on-demand billing, and developer controls.",
    },
    {
      id: "15",
      slug: "revenue-assurance-fraud",
      title: "Revenue Assurance & Fraud",
      description:
        "Continuous usage-to-bill and bill-to-payment reconciliation, leakage detection, fraud rules, and case escalation.",
    },
    {
      id: "16",
      slug: "ai-decision-intelligence",
      title: "AI & Decision Intelligence",
      description:
        "Model registry, online inference, explainability artifacts, drift monitoring, copilot assistance, and policy guardrails.",
    },
    {
      id: "17",
      slug: "reporting-regulatory-exports",
      title: "Reporting & Regulatory Exports",
      description:
        "BI metrics, profitability reporting, scheduled exports, regulator-ready packages, evidence bundles, and self-service controls.",
    },
    {
      id: "18",
      slug: "integration-ecosystem",
      title: "Integration & Ecosystem",
      description:
        "Connector registry, capability matrix, SDKs, webhook orchestration, retries/DLQs, and ecosystem sandbox support.",
    },
  ];

  return (
    <section className="py-16 lg:py-10 bg-[#F8FAFC] dark:bg-[#020817] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-sky-600 dark:text-sky-400 mb-4">
            Domain Architecture
          </p>

          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-[#1C1C2E] dark:text-white">
            18 Unified Domains. Zero Fragmentation.
          </h2>

          <div className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-sky-100 dark:bg-sky-900/40">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">
              All 18 domains
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="group rounded-3xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-xs font-medium text-slate-400 mb-4">
                {domain.id}
              </p>

              <h3 className="text-lg font-bold text-[#1C1C2E] dark:text-white mb-4">
                {domain.title}
              </h3>

              <p className="text-xs leading-7 text-[#64748B] dark:text-slate-400 mb-4">
                {domain.description}
              </p>

              <Link href={`/18domains#${domain.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400">
                Learn More
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}