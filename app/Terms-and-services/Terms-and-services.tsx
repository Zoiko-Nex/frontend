import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function TermsAndServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_92%_-8%,_var(--tw-gradient-stops))] from-lime-500/10 to-lime-500/0 pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Hero Section */}
        <section className="pt-16 pb-20 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
            <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">
              Legal and Platform Governance
            </span>
          </div>
          <h1 className="text-slate-800 text-4xl md:text-5xl font-extrabold leading-tight mb-8 max-w-[956px]">
            Terms built for serious telecom operations.
          </h1>
          <p className="text-slate-600 text-base md:text-base font-normal leading-7 max-w-[1028px]">
            ZoikoNex supports regulated, revenue-critical telecom operations. Our Terms of Service are structured to make platform access, customer responsibilities, billing, API use, data handling, acceptable use, and enterprise contract pathways clear before implementation begins.
          </p>
        </section>

        {/* What governs your use of ZoikoNex */}
        <section className="pt-24 pb-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-5 leading-10">What governs your use of ZoikoNex.</h2>
          <p className="text-slate-600 text-base font-normal mb-12 leading-6">
            These documents work together. Public documents are available here; enterprise documents are<br className="hidden md:block" />shared through an approved request flow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f4f7ed] border border-lime-500/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-lime-600" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-lime-600 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">Public</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Terms of Service</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">All users</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">The baseline terms that govern access to and use of the ZoikoNex platform.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">Read terms <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f1f5fa] border border-sky-700/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-sky-700" viewBox="0 0 10 10" fill="none"><rect x="2.5" y="4" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 4V2.5a1.5 1.5 0 013 0V4" stroke="currentColor" strokeWidth="1.2" /></svg>
                <span className="text-sky-700 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">Enterprise</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Order Form / MSA</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">Enterprise & procurement</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">The signed commercial agreement and order form that define your subscription and precedence.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">Request document <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f4f7ed] border border-lime-500/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-lime-600" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-lime-600 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">Public</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Acceptable Use Policy</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">All users & developers</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">Permitted and prohibited platform conduct, abuse boundaries, and integrity rules.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">View policy <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f4f7ed] border border-lime-500/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-lime-600" viewBox="0 0 10 10" fill="none"><path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-lime-600 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">Public</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Privacy Policy</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">All users</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">How personal and operational data is handled across the website and platform.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">Read privacy <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f1f5fa] border border-sky-700/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-sky-700" viewBox="0 0 10 10" fill="none"><rect x="2.5" y="4" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 4V2.5a1.5 1.5 0 013 0V4" stroke="currentColor" strokeWidth="1.2" /></svg>
                <span className="text-sky-700 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">On request</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Data Processing Addendum</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">Legal & privacy reviewers</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">Processing terms, roles, and subprocessor handling for regulated data.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">Request DPA <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-56 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="w-full h-6 flex items-center gap-1.5 px-2 bg-[#f1f5fa] border border-sky-700/30 rounded-[5px] shrink-0">
                <svg className="w-2.5 h-2.5 text-sky-700" viewBox="0 0 10 10" fill="none"><rect x="2.5" y="4" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 4V2.5a1.5 1.5 0 013 0V4" stroke="currentColor" strokeWidth="1.2" /></svg>
                <span className="text-sky-700 text-[9.5px] font-semibold font-mono uppercase tracking-wide mt-0.5">On request</span>
              </div>
              <h3 className="text-slate-800 text-base font-bold leading-6 mt-4">Security & Compliance</h3>
              <p className="text-[#8292a1] text-[9.5px] font-medium font-mono uppercase leading-4 tracking-[0.06em] mt-1.5">Security reviewers</p>
              <p className="text-[#475569] text-xs font-normal leading-[18px] mt-2.5 pr-2">Security controls, evidence, and compliance documentation shared under review.</p>
              <button className="text-sky-700 text-xs font-semibold flex items-center gap-[5px] mt-auto hover:text-sky-800 transition-colors">Request security pack <svg className="w-3 h-3 text-sky-700" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M9 6L6.5 3.5M9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
          </div>
        </section>

        {/* Plain-English summary */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[26px] leading-10">Plain-English summary.</h2>

          <div className="bg-[#f0efe9] border border-[#e2dcc8] rounded-2xl px-[17px] py-4 flex items-start gap-[13px] mb-[26px]">
            <div className="mt-[3px] shrink-0">
              <img src="/image/Terms/frame5.svg" alt="Warning icon" className="w-[15px] h-[15px]" />
            </div>
            <p className="text-slate-600 text-sm font-normal leading-5">
              This summary is provided for readability only. The full Terms of Service and any applicable signed order forms, master services agreements, and data<br className="hidden lg:block" />processing terms <span className="font-bold text-slate-800">govern your relationship with ZoikoNex</span> and take precedence over this summary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Account access</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">You are responsible for your account, admins, and credential security.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Authorized users</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Only authorized users may access the platform on your behalf.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Subscriptions & billing</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Fees, usage charges, taxes, renewals, and cancellation are defined clearly.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">APIs & integrations</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Credentials, rate limits, and deprecation notices govern API use.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Data & privacy</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Data handling follows the Privacy Policy and DPA where applicable.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Acceptable use</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Prohibited conduct and platform-integrity rules apply to all users.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Support</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Support scope and service levels follow your plan or order form.</p>
            </div>
            <div className="bg-white rounded-[10px] border border-slate-200 p-[17px] flex flex-col shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
              <h3 className="text-slate-800 text-sm font-bold leading-5 mb-1.5">Changes to terms</h3>
              <p className="text-slate-600 text-xs font-normal leading-5">Material changes are versioned and communicated; archives are kept.</p>
            </div>
          </div>
        </section>

        {/* The terms, by section */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">The terms, by section.</h2>
          <p className="text-slate-600 text-base font-normal mb-[26px] max-w-[735px] leading-6">
            Search or jump to any section. This page presents the structure and scope of each clause; the binding<br className="hidden md:block"/>language is the counsel-approved Terms and any signed agreement.
          </p>

          <div className="flex flex-col md:flex-row gap-9 relative items-start">
            {/* Sidebar Sticky Menu */}
            <div className="md:w-60 flex-shrink-0 md:sticky md:top-24 hidden md:flex md:flex-col gap-4">
              <div className="relative w-60 h-10 bg-white rounded-[10px] border border-slate-300 overflow-hidden shrink-0">
                <div className="absolute left-3 top-3 w-4 h-4 text-slate-500">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input type="text" placeholder="Search the terms" className="w-full h-full pl-[37px] pr-4 text-sm font-normal text-slate-500 focus:outline-none placeholder:text-slate-500" />
              </div>

              <div className="w-60 bg-white rounded-2xl border border-slate-200 py-[11px] max-h-[75vh] overflow-y-auto">
                <ul className="flex flex-col">
                  {[
                    "Agreement scope & acceptance", "Accounts & authorized users", "Platform access & permitted use",
                    "Subscriptions", "Fees & payment", "Taxes & regulatory fees", "Data & privacy", "APIs & integrations",
                    "Customer content", "Acceptable use", "Security", "Support & service levels", "Service changes",
                    "Suspension", "Termination", "Warranties & disclaimers", "Limitation of liability", "Indemnification",
                    "Dispute resolution & governing law", "Order of precedence & contact"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center h-[39px] px-[14px] gap-[13px] hover:bg-slate-50 cursor-pointer transition-colors group">
                      <span className="text-slate-500 text-xs font-normal font-mono leading-4 w-3.5 group-hover:text-sky-700 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                      <a href={`#section-${index + 1}`} className="text-slate-600 text-xs font-normal leading-5 group-hover:text-sky-700 truncate">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms Content List */}
            <div className="flex-1 w-full max-w-[734px]">
              {[
                { title: "Agreement scope & acceptance", desc: "Effective date, version, legal entity, scope, customer acceptance, and the relationship to any signed order form." },
                { title: "Accounts & authorized users", desc: "Authorized users, admin responsibility, credential security, account accuracy, and tenant responsibility." },
                { title: "Platform access & permitted use", desc: "Permitted use and restrictions in a telecom context, including sandbox boundaries and production-access rules." },
                { title: "Subscriptions", desc: "Subscription model and scope of service as defined by your plan or order form." },
                { title: "Fees & payment", desc: "Subscription and usage fees, invoices, payment terms, late payments, disputes, collections, and refunds where applicable." },
                { title: "Taxes & regulatory fees", desc: "How applicable taxes and regulatory fees are handled by jurisdiction." },
                { title: "Data & privacy", desc: "References to the Privacy Policy and DPA, customer and telecom data, support data, AI-assisted processing, and subprocessors where applicable." },
                { title: "APIs & integrations", desc: "API credentials, rate limits, webhooks, third-party systems, developer responsibilities, and deprecation notices." },
                { title: "Customer content", desc: "Ownership of your content and your responsibility to use the platform lawfully." },
                { title: "Acceptable use", desc: "Prohibited conduct, abuse, and platform-integrity rules, linked to the Acceptable Use Policy." },
                { title: "Security", desc: "Security obligations, vulnerability disclosure, and incident-reporting routes." },
                { title: "Support & service levels", desc: "Support access and scope, exclusions, and SLA or order-form precedence, including maintenance windows." },
                { title: "Service changes", desc: "How changes, deprecations, and material changes are communicated." },
                { title: "Suspension", desc: "Triggers, notice, and urgent suspension rights to protect the platform and users." },
                { title: "Termination", desc: "Triggers, notice, export and transition pathways, and post-termination obligations." },
                { title: "Warranties & disclaimers", desc: "Counsel-approved warranty and disclaimer language applies; this page describes scope only.", counselApproved: true },
                { title: "Limitation of liability", desc: "Counsel-approved limitation-of-liability language applies; this page describes scope only.", counselApproved: true },
                { title: "Indemnification", desc: "Counsel-approved indemnification language applies; this page describes scope only.", counselApproved: true },
                { title: "Dispute resolution & governing law", desc: "Jurisdiction-specific, counsel-approved dispute-resolution and governing-law language applies.", counselApproved: true },
                { title: "Order of precedence & contact", desc: "Precedence: signed agreement, order form, DPA/SLA, then these public terms. Includes the legal contact route." },
              ].map((item, index) => (
                <div key={index} id={`section-${index + 1}`} className={`pt-[26px] pb-8 ${index > 0 ? 'border-t border-slate-200' : ''}`}>
                  <div className="flex items-start gap-[8.61px] mb-[7px]">
                    <span className="text-sky-700 text-xs font-semibold font-mono leading-5 w-4 mt-[3px] shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-slate-800 text-base font-bold leading-7">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm font-normal leading-6">{item.desc}</p>
                  {item.counselApproved && (
                    <div className="mt-[14px] inline-flex items-center h-7 px-[10px] gap-[7px] bg-yellow-600/10 rounded-md border border-yellow-600/30">
                      <div className="w-3 h-3 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 border-[1px] border-yellow-600"></div>
                      </div>
                      <span className="text-yellow-600 text-xs font-normal font-mono leading-4 tracking-wide">Binding language is counsel-approved</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise contracting pathway */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">Enterprise contracting pathway.</h2>
          <p className="text-slate-600 text-base font-normal mb-12 max-w-3xl">
            A clear route for procurement, legal, security, and compliance reviewers — no hunting through footer pages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-[45px]">
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-40 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]">
              <div className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg text-sky-700 text-xs font-semibold font-mono mb-[15px] shrink-0">01</div>
              <h3 className="text-slate-800 text-sm font-bold leading-6">Submit a request</h3>
              <p className="text-slate-600 text-xs font-normal leading-5 mt-[6px]">Tell us your company type, market, review<br className="hidden lg:block"/>need, and timeline.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-40 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]">
              <div className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg text-sky-700 text-xs font-semibold font-mono mb-[15px] shrink-0">02</div>
              <h3 className="text-slate-800 text-sm font-bold leading-6">Receive the review pack</h3>
              <p className="text-slate-600 text-xs font-normal leading-5 mt-[6px]">We route you the appropriate legal, security, or<br className="hidden lg:block"/>DPA materials.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-[21px] flex flex-col h-40 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]">
              <div className="w-9 h-9 flex items-center justify-center border border-slate-300 rounded-lg text-sky-700 text-xs font-semibold font-mono mb-[15px] shrink-0">03</div>
              <h3 className="text-slate-800 text-sm font-bold leading-6">Align & sign</h3>
              <p className="text-slate-600 text-xs font-normal leading-5 mt-[6px]">Order form, SLA, DPA, security review, scope,<br className="hidden lg:block"/>and commercial terms.</p>
            </div>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28),_0px_1px_2px_0px_rgba(11,60,99,0.04)] border border-slate-200 p-[27px] max-w-[1012px]">
            <form className="flex flex-col gap-[15px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[13px] gap-y-[15px]">
                {/* Row 1 */}
                <div>
                  <label className="flex items-center gap-1 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Company</span>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </label>
                  <input type="text" placeholder="Operator, MVNE, enterprise, or partner" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-[14px] text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-700" />
                </div>
                <div>
                  <label className="flex items-center gap-1 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Your role</span>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </label>
                  <input type="text" placeholder="Procurement, Counsel, Security, CTO…" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-[14px] text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-700" />
                </div>

                {/* Row 2 */}
                <div>
                  <label className="flex items-center gap-1 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Work email</span>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </label>
                  <input type="email" placeholder="you@company.com" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-[14px] text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-700" />
                </div>
                <div>
                  <label className="flex items-center gap-1 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Company type</span>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select defaultValue="" className="w-full h-10 bg-white rounded-[10px] border border-slate-300 pl-[14px] pr-8 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-sky-700 cursor-pointer">
                      <option value="" disabled className="text-slate-500">Select…</option>
                      <option value="operator">Operator</option>
                      <option value="mvno">MVNO / MVNE</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div>
                  <label className="flex items-center gap-2 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Expected launch market</span>
                    <span className="px-[7px] py-0.5 rounded-[5px] border border-slate-200 text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Optional</span>
                  </label>
                  <input type="text" placeholder="e.g. United States, EMEA, multi-region" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-[14px] text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-700" />
                </div>
                <div>
                  <label className="flex items-center gap-1 mb-[7px]">
                    <span className="text-slate-800 text-xs font-semibold leading-5">Review need</span>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select defaultValue="" className="w-full h-10 bg-white rounded-[10px] border border-slate-300 pl-[14px] pr-8 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-sky-700 cursor-pointer">
                      <option value="" disabled className="text-slate-500">Select…</option>
                      <option value="full">Full Legal Review</option>
                      <option value="dpa">DPA Only</option>
                      <option value="security">Security Compliance</option>
                    </select>
                    <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4 (Full width) */}
              <div>
                <label className="flex items-center gap-2 mb-[7px]">
                  <span className="text-slate-800 text-xs font-semibold leading-5">Target timeline</span>
                  <span className="px-[7px] py-0.5 rounded-[5px] border border-slate-200 text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Optional</span>
                </label>
                <div className="relative w-full">
                  <select defaultValue="" className="w-full h-10 bg-white rounded-[10px] border border-slate-300 pl-[14px] pr-8 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-sky-700 cursor-pointer">
                    <option value="" disabled className="text-slate-500">Select…</option>
                    <option value="q1">This Quarter</option>
                    <option value="q2">Next Quarter</option>
                    <option value="h2">Later this year</option>
                  </select>
                  <div className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 5 (Message) */}
              <div>
                <label className="flex items-center gap-2 mb-[7px]">
                  <span className="text-slate-800 text-xs font-semibold leading-5">Message</span>
                  <span className="px-[7px] py-0.5 rounded-[5px] border border-slate-200 text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Optional</span>
                </label>
                <textarea placeholder="Documents needed, questions, or context for the review." className="w-full h-24 bg-white rounded-[10px] border border-slate-300 p-[14px] text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-700 resize-none"></textarea>
              </div>

              {/* Checkbox and Button */}
              <div className="mt-2">
                <label className="flex items-start gap-[15px] mb-[32px] cursor-pointer group">
                  <div className="relative flex items-center justify-center shrink-0 mt-[2px]">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 bg-white rounded-sm border border-neutral-500 checked:bg-sky-700 checked:border-sky-700 transition-colors" />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2.5 6 5 8.5 9.5 3.5"></polyline>
                    </svg>
                  </div>
                  <span className="text-slate-600 text-xs font-semibold leading-5 select-none">
                    I agree that ZoikoNex may contact me about this request and process my details per the <a href="#" className="text-sky-700 hover:underline">Privacy Notice</a>.
                  </span>
                </label>

                <button type="submit" className="w-full h-12 bg-sky-700 text-white rounded-xl flex justify-center items-center gap-3 hover:bg-sky-800 transition-colors font-bold text-base shadow-sm">
                  Request Legal Pack
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Billing, taxes & subscription starts. */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">Billing, taxes & subscription starts.</h2>
          <p className="text-slate-600 text-base font-normal mb-12 max-w-3xl">
            Our platforms are meant for professional operations where reliability is critical.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-slate-800 text-sm font-bold mb-2">Base subscriptions</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Platform access is billed automatically or through a designated order form. Service begins when access is granted.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-slate-800 text-sm font-bold mb-2">Usage overages</h3>
              <p className="text-slate-600 text-xs leading-relaxed">For metrics-based pricing, excess usage is calculated at the end of the billing period and automatically charged.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-slate-800 text-sm font-bold mb-2">Proration & upgrades</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Upgrades take effect immediately; downgrades or cancellations take effect at the end of your current commitment term.</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-slate-800 text-sm font-bold mb-2">Taxes and cross-border withholdings</h3>
              <p className="text-slate-600 text-xs leading-relaxed">Customers are strictly responsible for local taxes and may not deduct cross-border withholding from invoiced amounts.</p>
            </div>
          </div>
        </section>

        {/* API, developer & integration responsibilities. */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">API, developer & integration responsibilities.</h2>
          <p className="text-slate-600 text-base font-normal mb-[48px] max-w-3xl">
            How the terms connect to API governance and developer adoption.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 p-[25px] shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-[10px]">
              {[
                "API keys and credentials must be kept secure and used only by authorized users.",
                "Rate limits and sandbox limits apply; production access follows approval rules.",
                "Webhooks must be handled reliably, with event integrity respected.",
                "Third-party integrations remain your responsibility to operate lawfully.",
                "Prohibited scraping and abusive automation are not permitted.",
                "Change and deprecation notices are published ahead of breaking changes."
              ].map((text, i) => (
                <div key={i} className="flex gap-[9px]">
                  <div className="mt-[3px] flex-shrink-0 text-lime-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 text-sm leading-5 max-w-[440px]">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-[28px] pt-[19px] border-t border-slate-200 flex flex-wrap gap-[14px]">
              {[
                "API Reference", "Developer Portal", "Security", "Changelog", "Acceptable Use"
              ].map((label, i) => (
                <a key={i} href="#" className="flex items-center gap-[9px] h-9 px-[14px] bg-white rounded-full border border-slate-300 hover:bg-slate-50 transition-colors shrink-0">
                  <span className="text-slate-800 text-xs font-semibold leading-5">{label}</span>
                  <svg className="w-2 h-1.5 text-slate-800" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3H7M7 3L5 1M7 3L5 5" stroke="currentColor" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Trust, fairness & change notices. */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">Trust, fairness & change notices.</h2>
          <p className="text-slate-600 text-base font-normal mb-[48px] max-w-3xl">
            No hidden terms, no dark patterns, no silent changes.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 p-[27px] shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[24px] gap-x-[20px]">
              <div>
                <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2 mb-[6px]">
                  <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Version & effective date
                </h3>
                <p className="text-slate-600 text-xs leading-5 max-w-[440px]">Every version is dated and labeled (current: v3.2, June 20, 2026).</p>
              </div>
              <div>
                <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2 mb-[6px]">
                  <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  Archived terms
                </h3>
                <p className="text-slate-600 text-xs leading-5 max-w-[440px]">Prior versions are archived, timestamped, and linked.</p>
              </div>
              <div>
                <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2 mb-[6px]">
                  <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Material-change notice
                </h3>
                <p className="text-slate-600 text-xs leading-5 max-w-[440px]">Material changes are notified through customer channels before taking effect.</p>
              </div>
              <div>
                <h3 className="text-slate-800 text-sm font-bold flex items-center gap-2 mb-[6px]">
                  <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Order-form precedence
                </h3>
                <p className="text-slate-600 text-xs leading-5 max-w-[440px]">For enterprise customers, the signed agreement and order form take precedence.</p>
              </div>
            </div>

            <div className="mt-[24px] pt-[24px] border-t border-slate-100 flex items-start gap-[9px]">
              <div className="mt-[3px] flex-shrink-0 text-lime-600">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-600 text-xs font-medium leading-5">
                We never hide material terms behind accordions alone. Navigation aids may collapse, but full content stays indexable and accessible.
              </p>
            </div>
          </div>
        </section>

        {/* Below the right team. */}
        <section className="py-16">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-4">Below the right team.</h2>
          <p className="text-slate-600 text-base font-normal mb-12 max-w-3xl">
            When you reach out, ensuring you direct your query to the correct department helps resolve matters quickly.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
              <div>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide mb-2">Billing & Upgrades</p>
                <h3 className="text-slate-800 text-sm font-bold mb-4">Sales & Billing</h3>
              </div>
              <a href="#" className="text-sky-700 text-xs font-semibold flex items-center gap-1 hover:text-sky-800">Contact Sales <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
              <div>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide mb-2">General Governance</p>
                <h3 className="text-slate-800 text-sm font-bold mb-4">General Compliance</h3>
              </div>
              <a href="#" className="text-sky-700 text-xs font-semibold flex items-center gap-1 hover:text-sky-800">Contact Legal <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
              <div>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide mb-2">Contract Review</p>
                <h3 className="text-slate-800 text-sm font-bold mb-4">Platform Counsel</h3>
              </div>
              <a href="#" className="text-sky-700 text-xs font-semibold flex items-center gap-1 hover:text-sky-800">Contact Counsel <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
              <div>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide mb-2">Subprocessors & DPA</p>
                <h3 className="text-slate-800 text-sm font-bold mb-4">Security & Data Privacy</h3>
              </div>
              <a href="#" className="text-sky-700 text-xs font-semibold flex items-center gap-1 hover:text-sky-800">Contact Security <ArrowRight className="w-3 h-3" /></a>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px] hover:shadow-md transition-shadow">
              <div>
                <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wide mb-2">Enterprise MSA</p>
                <h3 className="text-slate-800 text-sm font-bold mb-4">Broadline Counsel</h3>
              </div>
              <a href="#" className="text-sky-700 text-xs font-semibold flex items-center gap-1 hover:text-sky-800">Ping Legal <ArrowRight className="w-3 h-3" /></a>
            </div>
          </div>
        </section>

        {/* Footer Card */}
        <section className="py-16 pb-32">
          <div className="bg-[#0b2940] rounded-[20px] py-[60px] px-10 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold mb-4 relative z-10 max-w-[791px] mx-auto leading-[48px]">
              Reviewing ZoikoNex for procurement, legal, security, or<br className="hidden md:block"/>compliance?
            </h2>
            <p className="text-slate-300 text-base font-normal mb-[35px] relative z-10 leading-6 max-w-[604px] mx-auto">
              Request the appropriate legal pack and we will route your request to the correct team.<br className="hidden md:block"/>Already a customer? Use your approved support or account-management channel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button className="bg-[#1974c0] text-white font-semibold py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-[9px] hover:bg-[#1560a0] transition-all shadow-[0_0_24px_rgba(25,116,192,0.6)]">
                Request Legal Pack
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="bg-transparent text-white font-semibold py-3 px-10 rounded-lg border border-slate-500 text-sm hover:bg-white/5 transition-colors">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
