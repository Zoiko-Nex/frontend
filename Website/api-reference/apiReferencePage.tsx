import React from 'react';
import Link from 'next/link';

export default function APIReferencePage() {
  return (
    <div className="flex flex-col min-h-screen font-['Inter'] w-full bg-stone-50">

      {/* 1. Hero Section */}
      <section className="w-full pt-12 pb-24 border-b border-stone-300/20 inline-flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-[896px] px-6 pt-px flex flex-col justify-center items-center gap-6">
          <div className="px-3 py-1 bg-lime-300/30 rounded-xl outline outline-1 outline-offset-[-1px] outline-cyan-700 inline-flex justify-start items-center">
            <span className="justify-center text-cyan-700 text-xs font-normal font-['JetBrains_Mono'] leading-4 tracking-wide uppercase">SOVEREIGN API LAYER</span>
          </div>
          <div className="w-full max-w-[672px] flex flex-col justify-center items-center">
            <h1 className="text-center justify-center text-black text-5xl md:text-6xl font-bold font-['Hanken_Grotesk'] leading-tight md:leading-[60px]">
              APIs for governed<br className="hidden md:block" />telecom monetization.
            </h1>
          </div>
          <div className="w-full max-w-[768px] flex flex-col justify-start items-center">
            <p className="text-center justify-center text-zinc-700 text-base md:text-lg font-normal font-['Inter'] leading-relaxed md:leading-7">
              Build, connect, automate, and govern telecom operations through structured ZoikoNex<br className="hidden lg:block" />APIs for customer lifecycle, catalog, orders, charging, billing, payments, taxation,<br className="hidden lg:block" />SIM/eSIM, compliance, evidence, AI governance, analytics, partners, and webhooks.
            </p>
          </div>
          <div className="w-full pt-2 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/developer-portal" className="px-8 py-4 bg-[#21779F] hover:bg-cyan-600 transition-colors rounded-sm flex justify-center items-center gap-2 w-full sm:w-auto shadow-sm group">
              <span className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Explore the API</span>
              <img src="/image/case/Icon42.svg" alt="Arrow" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#" className="px-8 py-4 bg-transparent hover:bg-zinc-50 transition-colors rounded-sm outline outline-1 outline-offset-[-1px] outline-zinc-500 inline-flex flex-col justify-center items-center w-full sm:w-auto">
              <span className="text-center justify-center text-[#4a4b55] text-sm font-semibold font-['Inter'] leading-4">Get Postman Collection</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Technical Excellence */}
      <section className="w-full pt-20 pb-14 bg-stone-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Technical Excellence for Commercial Scale</h2>
            <div className="max-w-[576px]">
              <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                Every API endpoint is engineered to bridge the gap between technical<br className="hidden md:block" />agility and regulatory sovereignty.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {[
              { title: 'Faster Launch', desc: 'Pre-integrated regulatory<br/>logic reduces TTM for new<br/>product launches by 40%.', tags: ['COMMERCIAL IMPACT: REVENUE', 'ACCEL'], icon: 'Icon28.svg' },
              { title: 'Safer Integration', desc: 'Built-in HMAC signatures and<br/>RBAC ensure zero-trust<br/>security at the edge.', tags: ['COMMERCIAL IMPACT: RISK', 'REDUC'], icon: 'Icon29.svg' },
              { title: 'Partner<br/>Scalability', desc: 'Onboard MVNOs and<br/>distributors through<br/>specialized multi-tenant<br/>namespaces.', tags: ['COMMERCIAL IMPACT: ECOSYSTEM', 'GROWTH'], icon: 'Icon30.svg' },
              { title: 'Lower Support<br/>Burden', desc: 'Self-healing idempotency<br/>and verbose error codes<br/>reduce L3 ticket volume.', tags: ['COMMERCIAL IMPACT: OPEX OPT'], icon: 'Icon31.svg' }
            ].map((item, i) => (
              <div key={i} className="px-8 pt-8 pb-12 h-full bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-2 hover:shadow-lg transition-shadow">
                <img src={`/image/refer/${item.icon}`} alt="Icon" className="w-6 h-6 object-contain" />
                <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                  <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8" dangerouslySetInnerHTML={{ __html: item.title }}></h3>
                </div>
                <div className="self-stretch pb-3.5 flex flex-col justify-start items-start flex-1">
                  <p className="text-zinc-700 text-sm font-normal font-['Inter'] leading-5" dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                </div>
                <div className="flex flex-col gap-0.5 mt-auto">
                  {item.tags.map((tag, j) => (
                    <div key={j} className="text-sky-600 text-[10px] font-bold font-['JetBrains_Mono'] uppercase leading-4 tracking-wide">{tag}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. API Domain Library */}
      <section className="w-full pt-20 pb-24 bg-stone-100 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 w-full">
            <div className="flex flex-col justify-start items-start">
              <h2 className="justify-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">API Domain Library</h2>
            </div>
            <div className="flex flex-col justify-start items-start">
              <p className="justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Modular clusters for telecom orchestration.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {[
              { title: 'Commercial', desc: 'Unified catalog, product bundles, eligibility<br/>engines, and pricing matrices.', endpoints: '24', icon: 'Icon32.svg', bgColor: 'bg-black/5' },
              { title: 'Monetization', desc: 'Convergent charging, recurring billing, real-<br/>time balances, and taxation logic.', endpoints: '42', icon: 'Icon34.svg', bgColor: 'bg-[#f4faec]' },
              { title: 'Network & SIM', desc: 'eSIM provisioning, HLR/HSS sync, data<br/>session control, and IMSI management.', endpoints: '15', icon: 'Icon35.svg', bgColor: 'bg-sky-600/10' },
              { title: 'Governance & Evidence', desc: 'Audit trails, compliance verification,<br/>evidence events, and immutable logging.', endpoints: '31', icon: 'Icon36.svg', bgColor: 'bg-zinc-100' },
              { title: 'Intelligence', desc: 'AI predictive usage analytics, churn models,<br/>and ML-driven offer optimization.', endpoints: '12', icon: 'Icon37.svg', bgColor: 'bg-[#f7f3ed]' },
              { title: 'Ecosystem', desc: 'B2B partner management, wholesale<br/>settlement, and MVNE orchestration.', endpoints: '28', icon: 'Icon38.svg', bgColor: 'bg-[#d2f397]' }
            ].map((domain, i) => (
              <div key={i} className="p-6 bg-white rounded-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className={`w-10 h-10 rounded flex justify-center items-center ${domain.bgColor}`}>
                    <img src={`/image/refer/${domain.icon}`} alt={domain.title} className="w-5 h-5 object-contain" />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="justify-center text-zinc-900 text-lg font-normal font-['Hanken_Grotesk'] leading-7">{domain.title}</h3>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start min-h-[48px]">
                  <p className="justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5" dangerouslySetInnerHTML={{ __html: domain.desc }}></p>
                </div>
                <div className="self-stretch pt-2 flex justify-between items-center w-full mt-auto">
                  <div className="px-2 py-1 bg-zinc-100 flex flex-col justify-start items-start rounded">
                    <span className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4 uppercase">{domain.endpoints} ENDPOINTS</span>
                  </div>
                  <div className="flex justify-start items-center gap-1 text-sky-600">
                    <span className="text-center justify-center text-sm font-normal font-['Inter'] leading-5 group-hover:underline">View Endpoints</span>
                    <span className="text-sm font-semibold font-['Inter'] group-hover:translate-x-0.5 transition-transform">&rsaquo;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Infrastructure Onboarding */}
      <section className="w-full pt-16 pb-8 bg-white flex flex-col justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 lg:px-28 flex flex-col justify-center items-center gap-16">
          <div className="self-stretch flex flex-col justify-start items-center">
            <h2 className="text-center justify-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Infrastructure Onboarding</h2>
            <p className="text-center justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6 mt-2">Go from integration request to first call in hours, not weeks.</p>
          </div>
          <div className="self-stretch relative flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block w-full h-0.5 absolute top-6 left-0 bg-stone-300 z-0"></div>

            {[
              { num: '1', title: 'Create Account', desc: 'Register via Nexus Console.', bg: 'bg-black', text: 'text-white' },
              { num: '2', title: 'Request Sandbox', desc: 'Gated validation process.', bg: 'bg-stone-300', text: 'text-zinc-700' },
              { num: '3', title: 'Configure OAuth', desc: 'Set RBAC scopes & keys.', bg: 'bg-stone-300', text: 'text-zinc-700' },
              { num: '4', title: 'Call Endpoint', desc: 'Verify handshake in Dev.', bg: 'bg-stone-300', text: 'text-zinc-700' },
              { num: '5', title: 'Webhooks', desc: 'Enable async event flow.', bg: 'bg-stone-300', text: 'text-zinc-700' }
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col justify-start items-center z-10 relative">
                <div className={`w-12 h-12 relative ${step.bg} rounded-xl flex justify-center items-center ring-8 ring-white`}>
                  <span className={`text-center ${step.text} text-lg font-bold font-['Inter'] leading-7`}>{step.num}</span>
                </div>
                <div className="pt-4 flex flex-col justify-start items-center">
                  <h3 className="text-center text-zinc-900 text-base font-bold font-['Inter'] leading-6">{step.title}</h3>
                </div>
                <div className="pt-2 flex flex-col justify-start items-center text-center">
                  <p className="text-zinc-700 text-xs font-normal font-['Inter'] leading-4">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Terminal Block */}
      <section className="w-full py-24 bg-gray-900 flex justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 flex flex-col lg:flex-row justify-center items-start gap-12">
          {/* Left Column */}
          <div className="flex-1 flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex justify-start items-center gap-3">
              <div className="px-3 py-1 bg-lime-300 rounded-sm flex flex-col justify-start items-start">
                <span className="justify-center text-lime-700 text-xs font-normal font-['JetBrains_Mono'] leading-4 uppercase">POST</span>
              </div>
              <div className="flex flex-col justify-start items-start">
                <span className="justify-center text-white text-base font-normal font-['Hanken_Grotesk'] leading-6">/v1/subscriptions</span>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <p className="justify-center text-gray-400 text-base font-normal font-['Inter'] leading-6">Creates a sovereign subscription entity with integrated compliance<br className="hidden lg:block" />verification and automated billing provisioning.</p>
            </div>

            <div className="self-stretch pt-2 flex flex-col justify-start items-start gap-8">
              {/* Required Scopes */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <span className="justify-center text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-4">REQUIRED SCOPES</span>
                <div className="self-stretch flex justify-start items-start gap-2 flex-wrap">
                  <div className="px-3 py-1 bg-white/5 rounded-sm border border-white/10 flex flex-col justify-start items-start">
                    <span className="justify-center text-gray-400 text-xs font-normal font-['Liberation_Mono'] leading-4">subscriptions.write</span>
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-sm border border-white/10 flex flex-col justify-start items-start">
                    <span className="justify-center text-gray-400 text-xs font-normal font-['Liberation_Mono'] leading-4">customers.read</span>
                  </div>
                </div>
              </div>

              {/* Schema Viewer */}
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <span className="justify-center text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-4">SCHEMA VIEWER</span>
                <div className="self-stretch rounded-sm border border-white/10 flex flex-col justify-start items-start overflow-hidden w-full">
                  <div className="self-stretch p-3 bg-white/5 border-b border-white/10 flex justify-between items-start">
                    <div className="flex-1 flex flex-col justify-start items-start">
                      <span className="justify-center text-gray-500 text-xs font-normal font-['JetBrains_Mono'] leading-4">FIELD</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-start items-start">
                      <span className="justify-center text-gray-500 text-xs font-normal font-['JetBrains_Mono'] leading-4">TYPE / CONSTRAINT</span>
                    </div>
                  </div>
                  <div className="self-stretch p-3 flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch flex justify-between items-center">
                      <div className="flex-1 flex flex-col justify-start items-start">
                        <span className="justify-center text-white text-xs font-normal font-['Liberation_Mono'] leading-4">customer_id</span>
                      </div>
                      <div className="flex-1 flex justify-start items-center gap-2">
                        <span className="justify-center text-gray-400 text-xs font-normal font-['Inter'] leading-4">String (UUID)</span>
                        <span className="justify-center text-red-500 text-xs font-normal font-['Inter'] leading-4">*Required</span>
                      </div>
                    </div>
                    <div className="self-stretch flex justify-between items-center">
                      <div className="flex-1 flex flex-col justify-start items-start">
                        <span className="justify-center text-white text-xs font-normal font-['Liberation_Mono'] leading-4">plan_code</span>
                      </div>
                      <div className="flex-1 flex justify-start items-center gap-2">
                        <span className="justify-center text-gray-400 text-xs font-normal font-['Inter'] leading-4">String (Enum)</span>
                        <span className="justify-center text-red-500 text-xs font-normal font-['Inter'] leading-4">*Required</span>
                      </div>
                    </div>
                    <div className="self-stretch flex justify-between items-center">
                      <div className="flex-1 flex flex-col justify-start items-start">
                        <span className="justify-center text-white text-xs font-normal font-['Liberation_Mono'] leading-4">start_date</span>
                      </div>
                      <div className="flex-1 flex flex-col justify-start items-start">
                        <span className="justify-center text-gray-400 text-xs font-normal font-['Inter'] leading-4">ISO-8601 Timestamp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Governance Notes */}
              <div className="self-stretch p-6 bg-lime-800/10 rounded-sm border border-lime-800/20 flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex justify-start items-center gap-2">
                  <div className="w-3 h-3 bg-lime-300"></div>
                  <span className="justify-center text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-4">GOVERNANCE NOTES</span>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <p className="justify-center text-gray-400 text-xs font-normal font-['Inter'] leading-5 mt-1">Requests must respect multi-jurisdictional eligibility, local product catalog<br className="hidden lg:block" />availability, and explicit customer consent rules defined in the Sovereign Policy<br className="hidden lg:block" />Engine.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col justify-start items-start gap-6 w-full mt-8 lg:mt-0">
            {/* cURL Request */}
            <div className="self-stretch bg-gray-800 rounded-lg border border-white/10 flex flex-col justify-start items-start overflow-hidden w-full">
              <div className="self-stretch px-4 py-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <span className="justify-center text-lime-300 text-xs font-normal font-['JetBrains_Mono'] leading-4">REQUEST SAMPLE (cURL)</span>
                <div className="flex justify-start items-center gap-2 cursor-pointer">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  <span className="text-center justify-center text-gray-400 text-xs font-normal font-['JetBrains_Mono'] leading-4">COPY</span>
                </div>
              </div>
              <div className="self-stretch p-6 flex flex-col justify-start items-start overflow-x-auto">
                <p className="justify-center text-gray-500 text-xs font-normal font-['Liberation_Mono'] leading-6 mb-2"># Initialize a new subscription</p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6">curl -X POST </span><span className="text-white text-xs font-normal font-['Liberation_Mono'] leading-6">"https://api.zoikonex.io/v1/subscriptions"</span><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6"> \</span></p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-4">-H </span><span className="text-lime-300 text-xs font-normal font-['Liberation_Mono'] leading-6">"Authorization: Bearer YOUR_TOKEN"</span><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6"> \</span></p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-4">-H </span><span className="text-lime-300 text-xs font-normal font-['Liberation_Mono'] leading-6">"X-Idempotency-Key: sub_unique_id_99"</span><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6"> \</span></p>
                <p className="whitespace-pre text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-4">-d '{`{`}</p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-8">"customer_id": </span><span className="text-white text-xs font-normal font-['Liberation_Mono'] leading-6">"c_4821"</span><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6">,</span></p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-8">"plan": </span><span className="text-white text-xs font-normal font-['Liberation_Mono'] leading-6">"ULTRA_MOBILE_5G"</span><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6">,</span></p>
                <p className="whitespace-pre"><span className="text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-8">"jurisdiction": </span><span className="text-white text-xs font-normal font-['Liberation_Mono'] leading-6">"GER"</span></p>
                <p className="whitespace-pre text-sky-400 text-xs font-normal font-['Liberation_Mono'] leading-6 pl-4">{`}'`}</p>
              </div>
            </div>

            {/* Events Emitted */}
            <div className="self-stretch p-6 bg-white/5 rounded-lg border border-white/10 flex flex-col justify-start items-start gap-4 w-full">
              <span className="justify-center text-gray-500 text-xs font-normal font-['JetBrains_Mono'] leading-4 uppercase">EVIDENCE EVENTS EMITTED</span>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="flex justify-start items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-lime-300 rounded-full shadow-[0px_0px_4px_1px_rgba(190,242,100,0.4)]"></div>
                  <span className="justify-center text-lime-300 text-xs font-normal font-['Liberation_Mono'] leading-4">subscription.created.requested</span>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <span className="justify-center text-gray-500 text-xs font-normal font-['Liberation_Mono'] leading-4">subscription.created.completed</span>
                </div>
                <div className="flex justify-start items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-gray-600/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Zero-Trust API Security */}
      <section className="w-full pt-20 pb-16 bg-stone-50 border-t border-stone-300/20 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 flex flex-col justify-start items-center gap-16">
          <div className="w-full max-w-[896px] flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-start items-center">
              <h2 className="text-center justify-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Zero-Trust API Security</h2>
            </div>
            <div className="self-stretch flex flex-col justify-start items-center">
              <p className="text-center justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Infrastructure-grade security controls built into the core fabric of every request.</p>
            </div>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'OAuth 2.0 & RBAC', desc: 'Granular scopes for applications and users.<br/>No global keys; strict least-privilege<br/>enforcement.', icon: 'Icon39.svg' },
              { title: 'HMAC Signatures', desc: 'Payload integrity verification for all sensitive<br/>monetization and network events.', icon: 'Icon40.svg' },
              { title: 'Idempotency', desc: 'Safely retry requests with 24-hour state<br/>preservation for critical financial operations.', icon: 'Icon41.svg' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 h-full">
                <div className="self-stretch flex justify-start items-center gap-3">
                  <div className="flex flex-col justify-center items-center w-6 h-6">
                    <img src={`/image/refer/${item.icon}`} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="justify-center text-zinc-900 text-base font-bold font-['Inter'] leading-6">{item.title}</h3>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <p className="justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5" dangerouslySetInnerHTML={{ __html: item.desc }}></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Integration Pathways */}
      <section className="w-full pt-16 pb-20 bg-stone-200 flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full max-w-[1152px] px-6 lg:px-28 flex flex-col justify-start items-start gap-12">
          <div className="self-stretch flex flex-col justify-start items-start">
            <h2 className="self-stretch text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Integration Pathways</h2>
          </div>
          <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { tag: 'OPEN ACCESS', tagColor: 'text-zinc-700 font-normal', title: 'Public Reference', desc: 'Read-only browsing of<br/>documentation, schemas, and public<br/>domain models.' },
              { tag: 'RECOMMENDED', tagColor: 'text-lime-800 font-bold', title: 'Gated Sandbox', desc: 'Simulate full-stack telecom logic in a<br/>risk-free environment with mock data.' },
              { tag: 'RESTRICTED', tagColor: 'text-zinc-700 font-normal', title: 'Partner Integration', desc: 'Live staging access for certified<br/>MVNO and Enterprise partners.' },
              { tag: 'SOVEREIGN', tagColor: 'text-zinc-700 font-normal', title: 'Enterprise Sync', desc: 'Full production deployment on private<br/>infrastructure or dedicated clusters.' }
            ].map((path, i) => (
              <div key={i} className="p-6 bg-white border-b-4 border-stone-300 flex flex-col justify-start items-start gap-2 h-full">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <span className={`justify-center ${path.tagColor} text-[10px] font-['JetBrains_Mono'] leading-4 uppercase`}>{path.tag}</span>
                </div>
                <div className="self-stretch pt-2 flex flex-col justify-start items-start">
                  <h3 className="justify-center text-zinc-900 text-lg font-bold font-['Inter'] leading-7">{path.title}</h3>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <p className="justify-center text-zinc-700 text-xs font-normal font-['Inter'] leading-5" dangerouslySetInnerHTML={{ __html: path.desc }}></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Case Studies */}
      <section className="w-full pt-20 pb-20 bg-stone-50 flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-center items-center gap-8 relative">
          <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-16 z-10">
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start">
                <h2 className="justify-center">
                  <span className="text-black text-4xl md:text-5xl font-bold font-['Hanken_Grotesk'] leading-tight md:leading-[60px]">Real telecom operating challenges. </span>
                  <span className="text-[#3b6b19] text-4xl md:text-5xl font-bold font-['Hanken_Grotesk'] leading-tight md:leading-[60px]">Proven ZoikoNex pathways.</span>
                </h2>
              </div>
              <div className="w-full max-w-[576px] flex flex-col justify-start items-start">
                <p className="justify-center text-slate-600 text-base md:text-lg font-normal font-['Inter'] leading-relaxed md:leading-7">
                  Discover how global operators and service providers<br className="hidden lg:block" />leverage our BSS infrastructure to achieve sovereign<br className="hidden lg:block" />control, elastic scale, and rapid market entry.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-start items-center gap-4 w-full sm:w-auto">
                <Link href="/contact-us" className="px-8 py-4 bg-[#21779F] hover:bg-cyan-700 transition-colors rounded-sm flex justify-center items-center gap-2 w-full sm:w-auto shadow-sm group">
                  <span className="text-center justify-center text-white text-sm font-semibold font-['Inter'] leading-4">Request a Platform Briefing</span>
                  <img src="/image/case/Icon42.svg" alt="Arrow" className="w-4 h-4 object-contain group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#" className="px-8 py-4 bg-transparent hover:bg-zinc-50 transition-colors rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 inline-flex flex-col justify-center items-center w-full sm:w-auto">
                  <span className="text-center justify-center text-black text-sm font-semibold font-['Inter'] leading-4">Download Portfolio PDF</span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative flex flex-col justify-start items-center lg:items-end w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-300/20 rounded-full blur-[64px] z-0"></div>
              <img className="w-full max-w-[576px] h-auto relative rounded-lg shadow-2xl border border-stone-300 object-cover z-10" src="/image/case/ca.png" alt="ZoikoNex Architecture" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <section className="w-full py-28 bg-black flex flex-col justify-center items-center">
        <div className="w-full max-w-[1152px] px-6 lg:px-48 flex flex-col justify-start items-center">
          <div className="w-full max-w-[768px] flex flex-col justify-start items-center gap-8">
            <div className="self-stretch flex flex-col justify-start items-center">
              <h2 className="text-center justify-center text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Give your technical team a controlled<br className="hidden md:block" />path to evaluate ZoikoNex.</h2>
            </div>
            <div className="self-stretch flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/contact-us" className="px-8 py-4 bg-[#2f88b8] hover:bg-[#2377a4] transition-colors rounded-sm flex flex-col justify-center items-center">
                <span className="text-center justify-center text-white text-base font-bold font-['Inter'] leading-6">Request Sandbox Access</span>
              </Link>
              <Link href="/contact-us" className="px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-white/20 hover:bg-white/5 transition-colors flex flex-col justify-center items-center">
                <span className="text-center justify-center text-white text-base font-normal font-['Inter'] leading-6">Book an Integration Briefing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
