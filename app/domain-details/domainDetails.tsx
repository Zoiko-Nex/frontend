"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const DOMAINS=[
 {num:'01',slug:'identity-tenancy-access',title:'Identity, Tenancy & Access',tag:'Govern who can do what, everywhere.',
  ov:'A multi-tenant hierarchy with fine-grained access control that keeps every operator, brand, and partner isolated while giving your platform team a single governance surface.',
  chips:['RBAC / ABAC','SSO · MFA','Evidence-logged'],
  caps:['Platform → tenant → brand → market hierarchy with inherited policy','RBAC and ABAC enforced server-side; deny overrides allow','Approval workflows and just-in-time privilege elevation','Break-glass access with full session recording','SSO/OIDC and MFA for privileged roles','Access reviews and audit trails on every grant']},
 {num:'02',slug:'customer-account',title:'Customer & Account',tag:'One source of truth for every party.',
  ov:'A unified model for party, subscriber, and billing account across consumer, SME, enterprise, and pooled structures — so identity, credit, and consent stay consistent everywhere.',
  chips:['Party model','Consent-aware'],
  caps:['Party, account, subscriber, and payer separation','Consumer, SME, enterprise, and pooled account models','Credit profile, limits, and risk signals per account','Consent and preference management with audit','Account and organizational hierarchies','360° view of usage, charges, invoices, and cases']},
 {num:'03',slug:'product-catalog-rules',title:'Product Catalog & Rules',tag:'Design and govern every offer.',
  ov:'A versioned catalog for plans, bundles, promotions, roaming packs, and partner overlays, with eligibility logic that keeps commercial rules governed and auditable.',
  chips:['Versioned','TM Forum-aligned'],
  caps:['Versioned plans, bundles, add-ons, and boosters','Promotions, discounts, roaming packs, and ILD offers','Eligibility rules by segment, market, and jurisdiction','Partner and wholesale overlays','Catalog approval workflow and effective-dating','Revenue-recognition mapping per product']},
 {num:'04',slug:'order-management-provisioning',title:'Order Management & Provisioning',tag:'Capture to activation, safely.',
  ov:'Order capture and decomposition with fulfillment orchestration across systems, SIM/eSIM assignment, and deterministic rollback when provisioning fails.',
  chips:['Saga rollback','TM Forum-aligned'],
  caps:['Order capture, decomposition, and orchestration','Fulfillment across network, billing, and partner systems','SIM / eSIM assignment and number allocation','Compensation saga with deterministic rollback','Provisioning failure queue with retry and escalation','End-to-end order status and SLA tracking']},
 {num:'05',slug:'customer-lifecycle-kyc',title:'Customer Lifecycle & KYC',tag:'Compliant onboarding to offboarding.',
  ov:'Regulated onboarding with pluggable verification, SIM-registration compliance, activation approval, and controlled lifecycle-state transitions.',
  chips:['KYC / KYB','Regulated'],
  caps:['KYC/KYB onboarding with verification adapters','SIM registration and regulatory compliance','Activation approval and controlled state machine','Suspension, reactivation, and churn workflows','Consent capture and document verification','Evidence capture for regulated actions']},
 {num:'06',slug:'usage-ingestion-mediation',title:'Usage Ingestion & Mediation',tag:'Carrier-grade usage, correctly.',
  ov:'High-volume ingestion, normalization, enrichment, and deduplication with replay-safe processing and explicit late-arrival policy — the pipeline behind accurate charging.',
  chips:['Replay-safe','Pipeline'],
  caps:['Carrier-grade CDR/UDR ingestion at scale','Normalization, enrichment, and correlation','Deduplication and replay-safe processing','Late-arrival and out-of-order policy enforcement','Suspense handling with clear ownership','Stage-by-stage evidence and reconciliation']},
 {num:'07',slug:'rating-charging-core',title:'Rating & Charging Core',tag:'Real-time and offline, one engine.',
  ov:'Convergent charging across prepaid, postpaid, and hybrid — spanning roaming, wholesale, and interconnect — with deterministic tariff snapshots for reproducible results.',
  chips:['Convergent','Deterministic'],
  caps:['Online (OCS) and offline (OFCS) charging','Prepaid, postpaid, and hybrid balance control','Roaming, wholesale, and interconnect rating','Deterministic, versioned tariff snapshots','Real-time authorization and quota management','Rerating workflows with simulation and evidence']},
 {num:'08',slug:'billing-invoicing-disputes',title:'Billing, Invoicing & Disputes',tag:'Accurate bills, resolved disputes.',
  ov:'Bill-run orchestration with multi-currency invoicing, credit/debit notes, dunning, payment plans, and structured dispute cases linked to their evidence.',
  chips:['Multi-currency','TM Forum-aligned'],
  caps:['Bill-run simulation, approval, and execution','Multi-currency invoices and credit/debit notes','Dunning and collections by jurisdiction','Payment-plan and instalment support','Structured dispute cases with financial impact','Exception review with immutable evidence']},
 {num:'09',slug:'payments-wallets-reconciliation',title:'Payments, Wallets & Reconciliation',tag:'Collect on any rail, reconcile all.',
  ov:'Multi-rail collections across card, bank, mobile money, wallet, and voucher, with allocations, settlement, and chargeback handling that reconciles end-to-end.',
  chips:['Multi-rail','Reconciled'],
  caps:['Card, bank, mobile money, wallet, and voucher rails','Payment allocation and reconciliation','Retries, refunds, and gateway health','Settlement and payout handling','Chargeback and dispute linkage','Wallet balances and top-ups']},
 {num:'10',slug:'tax-jurisdiction-engine',title:'Tax & Jurisdiction Engine',tag:'Right tax, every market.',
  ov:'Runtime jurisdiction routing with multi-engine tax orchestration, provider failover, exemption handling, and invoice-compliance templates per market.',
  chips:['Multi-engine','Jurisdiction-aware'],
  caps:['Runtime jurisdiction routing per transaction','Multi-engine tax orchestration with failover','Exemptions, holidays, and special rules','Regulatory fees and surcharges','Invoice-compliance templates by market','Versioned rule changes with evidence']},
 {num:'11',slug:'voice-ild-orchestration',title:'Voice / ILD Orchestration',tag:'Route, price, and protect voice.',
  ov:'Rate-deck management and route economics with quality scoring, settlement logic, and detection of IRSF and call-pumping fraud.',
  chips:['Least-cost routing','Fraud-aware'],
  caps:['Rate-deck and route management','Least-cost routing and route economics','Quality (ASR/ACD) scoring','Interconnect settlement logic','IRSF and call-pumping fraud detection','Partner and carrier reconciliation']},
 {num:'12',slug:'device-protection-vas',title:'Device Protection & VAS',tag:'Value-added services, monetized.',
  ov:'Enrollment and claims synchronization with revenue-share billing and white-label VAS orchestration tied to your commercial packages.',
  chips:['Revenue-share','White-label'],
  caps:['Device-protection enrollment and claims sync','Revenue-share billing with partners','White-label VAS orchestration','Bundling into commercial packages','Entitlement and activation management','Partner settlement and reporting']},
 {num:'13',slug:'esim-iot-lifecycle',title:'eSIM & IoT Lifecycle',tag:'Profiles and fleets at scale.',
  ov:'GSMA-aligned eSIM profile management with IoT fleet orchestration, remote action flows, and usage aggregation at device-fleet scale.',
  chips:['GSMA SGP.22','Fleet-scale'],
  caps:['GSMA SGP.22 consumer eSIM lifecycle','SM-DP+ integration and profile management','IoT fleet orchestration and grouping','Remote actions: enable, disable, swap','Device-fleet usage aggregation','Bulk provisioning and policy control']},
 {num:'14',slug:'network-api-monetization',title:'Network API Monetization',tag:'Turn network capability into revenue.',
  ov:'CAMARA / Open Gateway exposure with metering, entitlement management, QoS-on-demand billing, and developer-oriented monetization controls.',
  chips:['CAMARA','Open Gateway'],
  caps:['CAMARA / Open Gateway API exposure','Metering and usage-based billing','Entitlement and quota management','QoS-on-demand and slicing charges','Developer keys, plans, and rate limits','Partner and developer settlement']},
 {num:'15',slug:'revenue-assurance-fraud',title:'Revenue Assurance & Fraud',tag:'Protect every unit of revenue.',
  ov:'Continuous usage-to-bill and bill-to-payment reconciliation with leakage detection, fraud rules, SIM-abuse detection, and case escalation.',
  chips:['Reconciliation','Fraud rules'],
  caps:['Usage-to-bill and bill-to-payment reconciliation','Leakage detection and root-cause analysis','Fraud rules and anomaly detection','SIM-abuse and velocity detection','Case management and escalation','Evidence-linked findings']},
 {num:'16',slug:'ai-decision-intelligence',title:'AI & Decision Intelligence',tag:'Governed intelligence, not black boxes.',
  ov:'A model registry with online inference, explainability artifacts, drift monitoring, copilot assistance, and Policy Guardrail enforcement for every material decision.',
  chips:['Explainable','Human-in-the-loop'],
  caps:['Model registry and versioning','Online inference and scoring','Explainability artifacts per decision','Drift and performance monitoring','Copilot assistance for operators','Policy Guardrails with human-in-the-loop']},
 {num:'17',slug:'reporting-regulatory-exports',title:'Reporting & Regulatory Exports',tag:'From BI to regulator-ready.',
  ov:'BI metrics and profitability reporting with scheduled exports, regulator-ready packages, evidence bundles, and self-service report controls.',
  chips:['Regulator-ready','Evidence bundles'],
  caps:['Operational and financial BI metrics','Profitability and margin reporting','Scheduled and on-demand exports','Regulator-ready packages and filings','Evidence bundles with integrity','Self-service reports with access control']},
 {num:'18',slug:'integration-ecosystem',title:'Integration & Ecosystem',tag:'Connect to everything, safely.',
  ov:'A connector registry and capability matrix with SDKs, webhook orchestration, retries/DLQs, and an ecosystem sandbox for safe partner onboarding.',
  chips:['SDKs','Webhooks · DLQ'],
  caps:['Connector registry and capability matrix','SDKs and typed API clients','Webhook orchestration and event delivery','Retries, idempotency, and dead-letter queues','Ecosystem sandbox for partners','Integration evidence and observability']}
];

export default function DomainDetails() {
    const [activeIndex, setActiveIndex] = useState(0);
    const tablistRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            const idx = DOMAINS.findIndex(d => d.slug === hash);
            if (idx !== -1) setActiveIndex(idx);
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const selectTab = (idx: number, scroll: boolean) => {
        setActiveIndex(idx);
        const slug = DOMAINS[idx].slug;
        if (window.location.hash.slice(1) !== slug) {
            window.history.replaceState(null, '', window.location.pathname + '#' + slug);
        }
        if (scroll) {
            if (window.matchMedia('(max-width:1024px)').matches) {
                document.getElementById('pd-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        let n: number | null = null;
        if (['ArrowDown', 'ArrowRight'].includes(e.key)) n = (activeIndex + 1) % DOMAINS.length;
        else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) n = (activeIndex - 1 + DOMAINS.length) % DOMAINS.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = DOMAINS.length - 1;
        if (n !== null) {
            e.preventDefault();
            selectTab(n, true);
        }
    };

    const d = DOMAINS[activeIndex];
    const prev = DOMAINS[(activeIndex - 1 + DOMAINS.length) % DOMAINS.length];
    const next = DOMAINS[(activeIndex + 1) % DOMAINS.length];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020817] pt-16 pb-24 font-['Plus_Jakarta_Sans']">
            {/* Fonts */}
            <link href="/contact-us" rel="stylesheet" />

            <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
                {/* Intro Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                        <span className="text-sky-700 dark:text-sky-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-widest">
                            Platform capabilities
                        </span>
                    </div>
                    <h1 className="text-slate-800 dark:text-white text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight sm:leading-[54.40px] mb-4 max-w-[1129px]">
                        Eighteen governed domains, one telecom platform.
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-6 max-w-[816px]">
                        Every ZoikoNex capability — from identity and catalog to charging, billing, tax, and assurance — is a governed, evidence-led domain. Select any domain to see what it does and how it fits together.
                    </p>
                </div>

                {/* Main Grid: Sidebar + Panel */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                    
                    {/* Left Sidebar (Tabs) */}
                    <div 
                        className="w-full lg:w-72 shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 sticky top-24 max-h-[calc(100vh-120px)] lg:overflow-y-auto hide-scrollbar"
                        role="tablist"
                        aria-orientation="vertical"
                        aria-label="Platform domains"
                        ref={tablistRef}
                        onKeyDown={handleKeyDown}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {DOMAINS.map((domain, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <button
                                    key={domain.slug}
                                    role="tab"
                                    id={`tab-${domain.slug}`}
                                    aria-controls="panel"
                                    aria-selected={isActive}
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => selectTab(i, true)}
                                    className={`
                                        flex items-center gap-3 w-full text-left rounded-xl px-4 py-3 transition-all duration-200 outline-none
                                        focus-visible:ring-2 focus-visible:ring-sky-500
                                        ${isActive 
                                            ? "bg-white dark:bg-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-700 shadow-[0px_10px_30px_-16px_rgba(11,60,99,0.20)] dark:shadow-[0px_10px_30px_-16px_rgba(0,0,0,0.5)]" 
                                            : "hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent"}
                                    `}
                                >
                                    <span className={`text-xs font-semibold font-['IBM_Plex_Mono'] shrink-0 w-5 ${isActive ? "text-sky-700 dark:text-sky-400" : "text-slate-500 dark:text-slate-400"}`}>
                                        {domain.num}
                                    </span>
                                    <span className={`text-sm font-semibold truncate flex-1 ${isActive ? "text-slate-800 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                                        {domain.title}
                                    </span>
                                    <span className={`shrink-0 transition-opacity duration-200 ${isActive ? "opacity-100 text-sky-700 dark:text-sky-400" : "opacity-0"}`}>
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[2.2px] stroke-linecap-round stroke-linejoin-round">
                                            <path d="M5 12h14M13 6l6 6-6 6"/>
                                        </svg>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Panel (Content) */}
                    <div 
                        className="flex-1 w-full bg-white dark:bg-slate-900 rounded-2xl outline outline-1 outline-slate-200 dark:outline-slate-800 shadow-[0px_10px_30px_-16px_rgba(11,60,99,0.20)] dark:shadow-none p-8 sm:p-10"
                        role="tabpanel"
                        id="pd-panel"
                        tabIndex={0}
                        aria-live="polite"
                        aria-labelledby={`tab-${d.slug}`}
                    >
                        <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold font-['IBM_Plex_Mono'] leading-5 tracking-[0.15em] uppercase mb-2">
                            DOMAIN {d.num}
                        </div>
                        <h2 className="text-slate-800 dark:text-white text-3xl sm:text-4xl font-bold leading-tight sm:leading-10 mb-3">
                            {d.title}
                        </h2>
                        <div className="text-sky-700 dark:text-sky-400 text-base font-semibold leading-6 mb-4">
                            {d.tag}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-6 max-w-[740px]">
                            {d.ov}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 mt-8">
                            {d.chips.map((c, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-full outline outline-1 outline-slate-300 dark:outline-slate-700 px-3.5 py-1.5 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                                    <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide">
                                        {c}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-8">
                            <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase leading-4 tracking-wide mb-6">
                                Key capabilities
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {d.caps.map((c, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-stone-200 dark:bg-slate-700 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-lime-600 dark:stroke-lime-500 fill-none stroke-[3px] stroke-linecap-round stroke-linejoin-round">
                                                <path d="M20 6 9 17l-5-5"/>
                                            </svg>
                                        </div>
                                        <span className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-6">
                                            {c}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-8 flex flex-wrap gap-4">
                            <Link href="/contact-us" className="bg-sky-700 hover:bg-sky-800 text-white rounded-xl px-6 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                                Request a briefing
                                <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[2.2px] stroke-linecap-round stroke-linejoin-round">
                                    <path d="M5 12h14M13 6l6 6-6 6"/>
                                </svg>
                            </link>
                            <Link href="/platform" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl outline outline-1 outline-slate-300 dark:outline-slate-700 hover:outline-sky-500 hover:text-sky-700 dark:hover:text-sky-400 px-6 py-3 flex items-center justify-center text-sm font-bold transition-colors">
                                See it in the platform
                            </Link>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 mt-8">
                            <button 
                                className="group flex flex-col justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl outline outline-1 outline-slate-200 dark:outline-slate-700 hover:outline-sky-500 p-4 sm:p-5 flex-1 max-w-full sm:max-w-[48%] text-left transition-all"
                                onClick={() => selectTab((activeIndex - 1 + DOMAINS.length) % DOMAINS.length, true)}
                            >
                                <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide mb-1 group-hover:text-sky-600 transition-colors">
                                    ← Previous
                                </span>
                                <span className="text-slate-800 dark:text-white text-sm font-bold truncate w-full group-hover:text-sky-600 transition-colors">
                                    {prev.num} · {prev.title}
                                </span>
                            </button>
                            
                            <button 
                                className="group flex flex-col justify-center items-end bg-slate-50 dark:bg-slate-800/50 rounded-xl outline outline-1 outline-slate-200 dark:outline-slate-700 hover:outline-sky-500 p-4 sm:p-5 flex-1 max-w-full sm:max-w-[48%] text-right transition-all sm:ml-auto"
                                onClick={() => selectTab((activeIndex + 1) % DOMAINS.length, true)}
                            >
                                <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide mb-1 group-hover:text-sky-600 transition-colors">
                                    Next →
                                </span>
                                <span className="text-slate-800 dark:text-white text-sm font-bold truncate w-full group-hover:text-sky-600 transition-colors">
                                    {next.num} · {next.title}
                                </span>
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}
