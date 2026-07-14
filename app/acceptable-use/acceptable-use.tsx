import React from 'react';

export default function AcceptableUsePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_92%_-8%,_var(--tw-gradient-stops))] from-lime-500/10 to-lime-500/0 pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Hero Section */}
        <section className="pt-[132px] pb-20 flex flex-col items-center text-center relative">
          <div className="flex items-center justify-center gap-2 mb-[35px]">
            <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
            <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">
              Platform Safety & Trust
            </span>
          </div>
          <h1 className="text-center justify-center text-slate-800 text-[clamp(28px,3.5vw,48px)] font-extrabold leading-[49.22px] mb-[62px] whitespace-nowrap font-['Plus_Jakarta_Sans']">
            Acceptable use that protects serious telecom operators.
          </h1>
          <p className="text-slate-600 text-base font-normal leading-7 max-w-[1244px]">
            ZoikoNex is built for responsible telecom monetization, governed API access, secure integrations, and trusted customer operations. Our Acceptable Use rules define the conduct, content, automation, API activity, and telecom practices that are not permitted on the platform.
          </p>
          <div className="w-[1308px] h-0 outline outline-1 outline-offset-[-0.50px] outline-black/30 mt-[60px]"></div>
        </section>

        {/* Why acceptable use matters in telecom. */}
        <section className="pt-[46px] pb-[20px] w-full max-w-[1012px] mx-auto">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[15px] leading-10">Why acceptable use matters in telecom.</h2>
          <p className="text-slate-600 text-base font-normal mb-[35px] leading-6 max-w-[750px]">
            These rules exist to protect legitimate customers, carrier relationships, and end users — and to make security and procurement review faster, not harder.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[14px] gap-y-[15px]">
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[20px] flex items-center gap-[15px]">
              <div className="w-9 h-9 bg-indigo-50 flex items-center justify-center rounded-[10px] shrink-0">
                  <img src="/image/access-use/telecom-abuse.svg" alt="Telecom abuse" className="w-5 h-5" />
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                <strong className="text-slate-800 font-bold">Telecom abuse</strong> can create customer harm, regulatory exposure, carrier-relationship risk, payment disputes, and brand damage.
              </p>
            </div>
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[20px] flex items-center gap-[15px]">
              <div className="w-9 h-9 bg-indigo-50 flex items-center justify-center rounded-[10px] shrink-0">
                  <img src="/image/access-use/api-misuse-icon.svg" alt="API misuse" className="w-5 h-5" />
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                <strong className="text-slate-800 font-bold">API misuse</strong> can cause data leakage, billing errors, unauthorized provisioning, excessive load, and integration instability.
              </p>
            </div>
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[20px] flex items-center gap-[15px]">
              <div className="w-9 h-9 bg-indigo-50 flex items-center justify-center rounded-[10px] shrink-0">
                  <img src="/image/access-use/clear-rules.svg" alt="Clear rules" className="w-5 h-5" />
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                <strong className="text-slate-800 font-bold">Clear rules protect legitimate customers</strong> by separating responsible operation from high-risk or unlawful behavior.
              </p>
            </div>
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[20px] flex items-center gap-[15px]">
              <div className="w-9 h-9 bg-indigo-50 flex items-center justify-center rounded-[10px] shrink-0">
                  <img src="/image/access-use/transparent-boundaries.svg" alt="Transparent boundaries" className="w-5 h-5" />
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                <strong className="text-slate-800 font-bold">Transparent boundaries</strong> help legal, compliance, security, and procurement teams complete due diligence faster.
              </p>
            </div>
          </div>
        </section>

        {/* What is not allowed. */}
        <section className="py-[46px]">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[58px] leading-10">What is not allowed.</h2>
          <p className="text-slate-600 text-base font-normal mb-[69px] leading-6 max-w-[734px]">
            A scannable map of prohibited activity. Each card states the rule and why it protects the ecosystem —<br/>examples are illustrative, not exhaustive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[13px] gap-x-[14px]">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i1-illegal.svg" alt="Illegal use icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Illegal or harmful use</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Facilitating unlawful conduct, exploitation, harassment, threats, scams,<br/>or otherwise harmful activity.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects customers, partners, end users, and ZoikoNex from<br/>unlawful or unsafe use.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i2-telecom.svg" alt="Telecom fraud icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Telecom fraud & network abuse</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Robocall abuse, unlawful spoofing, SIM/eSIM fraud, unauthorized<br/>porting, traffic pumping, or bypass fraud.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects carrier relationships, service integrity, and telecom<br/>compliance posture.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i3-spam.svg" alt="Spam messaging icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Spam & unauthorized messaging</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Bulk unsolicited messaging, deceptive outreach, phishing, credential<br/>harvesting, or unlawful promotional traffic.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects deliverability, recipients, brand integrity, and partner<br/>networks.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i4-security.svg" alt="Security abuse icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Security abuse</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Malware, credential stuffing, vulnerability exploitation, unauthorized<br/>scanning, data exfiltration, or bypassing controls.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects platform availability, confidentiality, and customer trust.</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-44 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i5-api.svg" alt="API misuse icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">API & automation misuse</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Excessive requests, scraping, token sharing, reverse engineering, rate-<br/>limit evasion, or unsafe bot behavior.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects service performance, fair access, and integration reliability.</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-44 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i6-billing.svg" alt="Billing abuse icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Billing & financial abuse</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Payment fraud, chargeback abuse, invoice manipulation, artificial<br/>usage, or manipulating rating or settlement logic.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects revenue integrity, customer trust, and financial operations.</p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i7-ai.svg" alt="AI misuse icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">AI misuse</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Using AI features for deceptive content, impersonation, fraud,<br/>discriminatory decisions, unlawful surveillance, or unauthorized<br/>automated actions.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects governance integrity and prevents unsafe automation.</p>
              </div>
            </div>

            {/* Card 8 */}
            <div className="bg-white rounded-2xl border-yellow-600 border-l-[3px] border-r border-t border-b p-[23px] flex flex-col h-48 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] transition-shadow hover:shadow-md">
              <div className="flex items-center gap-[12px] mb-[13px]">
                <div className="w-7 h-7 bg-orange-100 flex items-center justify-center rounded-lg">
                  <img src="/image/access-use/i8-policy.svg" alt="Policy circumvention icon" className="w-4 h-4" />
                </div>
                <h3 className="text-slate-800 text-base font-bold leading-6">Policy circumvention</h3>
              </div>
              <p className="text-slate-600 text-sm leading-5 mb-auto">
                Avoiding restrictions, misrepresenting identity, hiding beneficial<br/>ownership, bypassing jurisdiction controls, or reselling access without<br/>authorization.
              </p>
              <div className="pt-[13px] border-t border-slate-200 flex items-start gap-[8px]">
                <div className="mt-1 shrink-0 text-lime-600">
                  <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 10 6" stroke="currentColor" strokeWidth={1.28}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                </div>
                <p className="text-slate-500 text-xs leading-5"><span className="text-slate-600 font-semibold">Why:</span> protects enforcement, compliance, and commercial fairness.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsible platform use. */}
        <section className="py-[46px]">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[58px] leading-10">Responsible platform use.</h2>
          <p className="text-slate-600 text-base font-normal mb-[69px] leading-6 max-w-[684px]">
            The operating model for legitimate customers and partners. Follow these and your usage stays<br/>protected.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {[
              { title: "Accurate identity & authorization", desc: "Keep account, organization, developer, partner, and billing information\naccurate and authorized." },
              { title: "Respect telecom & messaging rules", desc: "Use voice, SMS, eSIM, numbers, roaming, and provisioning only for lawful\nand approved use cases." },
              { title: "Protect credentials & API keys", desc: "Use secure storage, rotation, least privilege, and report compromised\ncredentials immediately." },
              { title: "Respect rate limits & boundaries", desc: "Design integrations to follow documented API, webhook, event, and\nsandbox limits." },
              { title: "Maintain consent & legal basis", desc: "Handle consent, disclosure, opt-out, and recordkeeping obligations\nwhere relevant." },
              { title: "Report suspected abuse promptly", desc: "Use the abuse-reporting path for suspected fraud, security issues, misuse,\nor harmful conduct." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-lime-500 border-l-[3px] p-[21px] h-28 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)] hover:shadow-md transition-shadow">
                <div className="flex items-start gap-[14px]">
                  <div className="mt-1 shrink-0 text-lime-600">
                    <svg className="w-3 h-2" fill="none" viewBox="0 0 12 8" stroke="currentColor" strokeWidth={1.63}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                  </div>
                  <div>
                    <h3 className="text-slate-800 text-sm font-bold leading-6 mb-[7px]">{item.title}</h3>
                    <p className="text-slate-600 text-xs font-normal leading-5 whitespace-pre-line">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API, developer & sandbox use. */}
        <section className="py-[46px]">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[56px] leading-10">API, developer & sandbox use.</h2>
          <p className="text-slate-600 text-base font-normal mb-[46px] max-w-[499px]">
            Clear boundaries that keep evaluation easy and the platform reliable.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 p-[25px] shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[15px] gap-x-[14px] mb-[18px]">
              {[
                "Sandbox is for testing, evaluation, and integration development only,\nunless production access is approved.",
                "No production traffic, live personal data, or real customer credentials in\nsandbox environments.",
                "No unauthorized load testing or undocumented endpoint probing.",
                "API keys, tokens, and webhooks must not be shared or committed to\npublic repositories.",
                "Respect rate limits, idempotency rules, endpoint authorization, and\nevent-subscription boundaries.",
                "Follow documentation constraints; design for deprecation and change\nnotices."
              ].map((text, i) => (
                <div key={i} className="flex gap-[13px]">
                  <div className="mt-[3px] flex-shrink-0 text-lime-600">
                    <svg className="w-2.5 h-2" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={1.47}><path strokeLinecap="round" strokeLinejoin="round" d="M1 3L4 6L9 1" /></svg>
                  </div>
                  <p className="text-slate-600 text-sm leading-5 whitespace-pre-line w-96">{text}</p>
                </div>
              ))}
            </div>

            <div className="pt-[19px] border-t border-slate-200 flex flex-wrap gap-[14px]">
              {[
                { label: "View API Reference", w: "w-40" }, 
                { label: "Request Developer Access", w: "w-52" }, 
                { label: "Report API Abuse", w: "w-40" }
              ].map((btn, i) => (
                <a key={i} href="#" className={`${btn.w} h-9 px-[14px] bg-white rounded-full border border-slate-300 hover:bg-slate-50 transition-colors flex items-center shrink-0 cursor-pointer`}>
                  <span className="text-slate-800 text-xs font-semibold leading-5 mr-auto font-['Plus_Jakarta_Sans']">{btn.label}</span>
                  <svg className="w-2 h-1.5 text-slate-800" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 3H7M7 3L5 1M7 3L5 5" stroke="currentColor" strokeWidth="1.19" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Enforcement & remediation. */}
        <section className="py-[46px]">
          <h2 className="text-slate-800 text-3xl font-extrabold mb-[56px] leading-10">Enforcement & remediation.</h2>
          <p className="text-slate-600 text-base font-normal mb-[46px] max-w-[636px]">
            Fair, proportionate, and evidence-aware. Most issues start with guidance, not penalties.
          </p>

          <div className="w-[1012px] h-80 relative bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 overflow-hidden mx-auto">
            <div className="w-32 h-11 left-[1px] top-[1px] absolute bg-slate-50 border-b border-slate-200">
              <div className="w-14 h-3 left-[16px] top-[14px] absolute flex justify-center items-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Situation</div>
            </div>
            <div className="w-96 h-11 left-[126.61px] top-[1px] absolute bg-slate-50 border-b border-slate-200">
              <div className="w-28 h-3 left-[16px] top-[14px] absolute flex justify-center items-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Potential action</div>
            </div>
            <div className="w-44 h-11 left-[525.81px] top-[1px] absolute bg-slate-50 border-b border-slate-200">
              <div className="w-14 h-3 left-[16px] top-[14px] absolute flex justify-center items-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Your path</div>
            </div>
            <div className="w-72 h-11 left-[708.56px] top-[1px] absolute bg-slate-50 border-b border-slate-200">
              <div className="w-24 h-3 left-[16px] top-[14px] absolute flex justify-center items-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Evidence basis</div>
            </div>
            <div className="w-32 h-16 left-[1px] top-[43.50px] absolute border-b border-slate-200">
              <div className="left-[16px] top-[14.50px] absolute bg-[#f3faeb] rounded-md outline outline-1 outline-offset-[-1px] outline-lime-500/40 flex items-center h-6 px-2 gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-lime-600 shrink-0">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                </svg>
                <div className="text-lime-600 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide whitespace-nowrap pt-[1px]">Low-risk</div>
              </div>
            </div>
            <div className="w-96 h-16 left-[126.61px] top-[43.50px] absolute border-b border-slate-200">
              <div className="w-80 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Guidance notice or configuration recommendation</div>
            </div>
            <div className="w-44 h-16 left-[525.81px] top-[43.50px] absolute border-b border-slate-200">
              <div className="w-24 h-9 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5"><span>Fix the issue and<br/>continue</span></div>
            </div>
            <div className="w-72 h-16 left-[708.56px] top-[43.50px] absolute border-b border-slate-200">
              <div className="w-64 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Support note & customer communication</div>
            </div>
            <div className="w-32 h-14 left-[1px] top-[114.09px] absolute border-b border-slate-200">
              <div className="left-[16px] top-[14.50px] absolute bg-indigo-50 rounded-md outline outline-1 outline-offset-[-1px] outline-sky-700/40 flex items-center h-6 px-2 gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-sky-700 shrink-0">
                  <path d="M6 2L1.5 10H10.5L6 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M6 5.5V7.5M6 9H6.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <div className="text-sky-700 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide whitespace-nowrap pt-[1px]">Repeated</div>
              </div>
            </div>
            <div className="w-96 h-14 left-[126.61px] top-[114.09px] absolute border-b border-slate-200">
              <div className="w-72 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Warning, usage restriction, or temporary hold</div>
            </div>
            <div className="w-44 h-14 left-[525.81px] top-[114.09px] absolute border-b border-slate-200">
              <div className="w-28 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Remediation plan</div>
            </div>
            <div className="w-72 h-14 left-[708.56px] top-[114.09px] absolute border-b border-slate-200">
              <div className="w-60 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Account, API, policy, or support record</div>
            </div>
            <div className="w-32 h-16 left-[1px] top-[169.09px] absolute border-b border-slate-200">
              <div className="left-[16px] top-[14.50px] absolute bg-orange-50 rounded-md outline outline-1 outline-offset-[-1px] outline-yellow-600/40 flex items-center h-6 px-2 gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-yellow-600 shrink-0">
                  <path d="M6 2L1.5 10H10.5L6 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M6 5.5V7.5M6 9H6.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <div className="text-yellow-600 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide whitespace-nowrap pt-[1px]">High-risk</div>
              </div>
            </div>
            <div className="w-96 h-16 left-[126.61px] top-[169.09px] absolute border-b border-slate-200">
              <div className="w-96 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Suspension of the affected feature, token, workflow, or area</div>
            </div>
            <div className="w-44 h-16 left-[525.81px] top-[169.09px] absolute border-b border-slate-200">
              <div className="w-28 h-4 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5">Escalated review</div>
            </div>
            <div className="w-72 h-16 left-[708.56px] top-[169.09px] absolute border-b border-slate-200">
              <div className="w-64 h-9 left-[16px] top-[16.50px] absolute flex items-center text-slate-600 text-xs font-normal leading-5"><span>Evidence-ledger event, security signal, or<br/>abuse report</span></div>
            </div>
            <div className="left-[17px] top-[254.19px] absolute bg-red-50 rounded-md outline outline-1 outline-offset-[-1px] outline-red-500/40 flex items-center h-6 px-2 gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-red-500 shrink-0">
                <path d="M6 2L2 3.5V6.5C2 9.5 4.5 11 6 11.5C7.5 11 10 9.5 10 6.5V3.5L6 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M6 5V7M6 8.5H6.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <div className="text-red-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide whitespace-nowrap pt-[1px]">Severe</div>
            </div>
            <div className="w-72 h-9 left-[142.61px] top-[256.19px] absolute flex items-center text-slate-600 text-xs font-normal leading-5"><span>Account suspension, termination, legal referral, or<br/>carrier/partner notice where appropriate</span></div>
            <div className="w-28 h-9 left-[541.81px] top-[256.19px] absolute flex items-center text-slate-600 text-xs font-normal leading-5"><span>Appeal, subject to<br/>contract & law</span></div>
            <div className="w-60 h-9 left-[724.56px] top-[256.19px] absolute flex items-center text-slate-600 text-xs font-normal leading-5"><span>Preserved evidence, incident timeline,<br/>decision-authority record</span></div>
          </div>
          
          <div className="mt-[27px] flex items-start gap-[10px]">
            <div className="mt-1 shrink-0 text-yellow-600">
              <svg className="w-3 h-2.5" fill="none" viewBox="0 0 12 10" stroke="currentColor" strokeWidth={1.33}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <p className="text-slate-500 text-xs leading-5">
              Enforcement is proportionate but not a fixed sequence — severe or unlawful abuse may require immediate action. Actions are subject to your contract and applicable<br/>law.
            </p>
          </div>
        </section>

        {/* Report abuse or request a review. */}
        <section className="relative w-[1012px] h-[874.08px] mx-auto">
            <div className="w-[1012px] h-11 left-0 top-[46px] absolute text-slate-800 text-3xl font-extrabold leading-10">Report abuse or request a review.</div>
            <div className="w-[1012px] h-11 left-0 top-[104.80px] absolute text-slate-600 text-base font-normal leading-6"><span>Choose a route and we send it to the right team. For security reports, please don’t include passwords or<br/>sensitive credentials.</span></div>
            <div className="w-[601.39px] h-[697.69px] left-0 top-[176.39px] absolute bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-slate-200">
                <div className="w-[601.39px] h-[697.69px] left-0 top-0 absolute bg-white/0 rounded-[20px] shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28),_0px_1px_2px_0px_rgba(11,60,99,0.04)]"></div>
                <div className="w-[547.39px] h-20 left-[27px] top-[27px] absolute">
                    <button className="w-28 h-8 left-0 top-0 absolute bg-slate-50 hover:bg-slate-100 transition-colors rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300 cursor-pointer">
                        <div className="w-20 h-4 left-[14px] top-[9px] absolute text-center flex items-center justify-center text-slate-600 text-xs font-semibold whitespace-nowrap">Report abuse</div>
                    </button>
                    <button className="w-32 h-8 left-[116.89px] top-0 absolute bg-slate-50 hover:bg-slate-100 transition-colors rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300 cursor-pointer">
                        <div className="w-24 h-4 left-[14px] top-[9px] absolute text-center flex items-center justify-center text-slate-600 text-xs font-semibold whitespace-nowrap">Security concern</div>
                    </button>
                    <button className="w-40 h-8 left-[255.66px] top-0 absolute bg-slate-50 hover:bg-slate-100 transition-colors rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300 cursor-pointer">
                        <div className="w-32 h-4 left-[14px] top-[9px] absolute text-center flex items-center justify-center text-slate-600 text-xs font-semibold whitespace-nowrap">Legal & procurement</div>
                    </button>
                    <button className="w-32 h-8 left-0 top-[42px] absolute bg-slate-50 hover:bg-slate-100 transition-colors rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300 cursor-pointer">
                        <div className="w-28 h-4 left-[14px] top-[9px] absolute text-center flex items-center justify-center text-slate-600 text-xs font-semibold whitespace-nowrap">Appeal a decision</div>
                    </button>
                </div>
                <div className="w-16 h-5 left-[27px] top-[125px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold leading-5">Your email</div>
                <div className="w-2 h-5 left-[98.08px] top-[125px] absolute flex items-center justify-start text-sky-700 text-xs font-bold leading-5">*</div>
                <input type="email" placeholder="you@company.com" className="w-64 h-11 left-[27px] top-[152.80px] absolute px-[14px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-800 text-sm font-normal placeholder:text-slate-500 focus:outline-sky-700 focus:outline-2" />
                <div className="w-14 h-5 left-[307.19px] top-[125px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold leading-5">Urgency</div>
                <div className="w-16 h-5 left-[367.53px] top-[125.39px] absolute rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-200">
                    <div className="w-12 h-3 left-[7px] top-[3px] absolute flex items-center justify-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Optional</div>
                </div>
                <select className="w-64 h-10 left-[307.19px] top-[152.80px] absolute px-[14px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-800 text-sm font-normal focus:outline-sky-700 focus:outline-2 appearance-none cursor-pointer">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <div className="w-3.5 h-3.5 left-[546.39px] top-[166.30px] absolute pointer-events-none flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="w-12 h-5 left-[27px] top-[211.80px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold leading-5">Subject</div>
                <div className="w-2 h-5 left-[83.05px] top-[211.80px] absolute flex items-center justify-start text-sky-700 text-xs font-bold leading-5">*</div>
                <input type="text" placeholder="Short summary of the issue or request" className="w-[547.39px] h-11 left-[27px] top-[239.59px] absolute px-[14px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-800 text-sm font-normal placeholder:text-slate-500 focus:outline-sky-700 focus:outline-2" />
                <div className="w-52 h-5 left-[27px] top-[298.59px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold leading-5">Affected account, domain, or API</div>
                <div className="w-16 h-5 left-[241.94px] top-[298.98px] absolute rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-200">
                    <div className="w-12 h-3 left-[7px] top-[3px] absolute flex items-center justify-center text-slate-500 text-[10px] font-semibold font-mono uppercase leading-4 tracking-wide">Optional</div>
                </div>
                <input type="text" placeholder="e.g. acct-1042, example.com, /v1/charging" className="w-[547.39px] h-11 left-[27px] top-[326.39px] absolute px-[14px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-800 text-sm font-normal placeholder:text-slate-500 focus:outline-sky-700 focus:outline-2" />
                <div className="w-11 h-5 left-[27px] top-[385.39px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold leading-5">Details</div>
                <div className="w-2 h-5 left-[77.34px] top-[385.39px] absolute flex items-center justify-start text-sky-700 text-xs font-bold leading-5">*</div>
                <textarea placeholder="What happened, when, and any non-sensitive context that helps us route and respond." className="w-[547.39px] h-24 left-[27px] top-[413.19px] absolute p-[14px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 text-slate-800 text-sm font-normal leading-6 placeholder:text-slate-500 focus:outline-sky-700 focus:outline-2 resize-none"></textarea>
                <input type="checkbox" className="w-4 h-4 left-[31px] top-[525.19px] absolute bg-white rounded-sm border border-neutral-500 accent-sky-700 cursor-pointer" />
                <div className="w-[499.06px] h-9 left-[62px] top-[525.19px] absolute flex items-center justify-start"><p><span className="text-slate-600 text-xs font-semibold leading-5">I agree that ZoikoNex may contact me about this submission and process my details<br/>per the </span><span className="text-sky-700 text-xs font-semibold leading-5 hover:underline cursor-pointer">Privacy Notice</span><span className="text-slate-600 text-xs font-semibold leading-5">.</span></p></div>
                <button className="w-[547.39px] h-12 left-[27px] top-[576.69px] absolute bg-sky-700 hover:bg-sky-800 transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <span className="text-white text-base font-bold">Submit</span>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <div className="w-3.5 h-3.5 left-[27px] top-[653.69px] absolute overflow-hidden">
                    <div className="w-3 h-2.5 left-[1.89px] top-[1.91px] absolute outline outline-[1.25px] outline-offset-[-0.63px] outline-yellow-600"></div>
                </div>
                <div className="w-[476.48px] h-4 left-[50px] top-[652.69px] absolute flex items-center justify-start text-slate-500 text-xs font-normal leading-4">Select a route above. Appeals are authenticated against your account before review.</div>
            </div>
            <div className="w-96 h-[352px] left-[625.39px] top-[176.39px] absolute bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200">
                <div className="w-96 h-[352px] left-0 top-0 absolute bg-white/0 rounded-2xl shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),_0px_1px_2px_0px_rgba(11,60,99,0.06)]"></div>
                <div className="w-28 h-6 left-[23px] top-[23px] absolute flex items-center justify-start text-slate-800 text-base font-bold leading-6">Where this goes</div>
                <div className="w-80 h-9 left-[23px] top-[55px] absolute flex items-center justify-start text-slate-600 text-xs font-normal leading-5"><span>Routing is based on the route you pick, so the right team<br/>responds faster.</span></div>
                <div className="w-80 h-16 left-[23px] top-[106.50px] absolute bg-slate-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200">
                    <div className="w-16 h-3 left-[14px] top-[15px] absolute flex items-center justify-start text-slate-500 text-[9.50px] font-normal font-mono uppercase leading-4 tracking-wide whitespace-nowrap">Routes to</div>
                    <div className="w-24 h-4 left-[14px] top-[37.19px] absolute flex items-center justify-start text-sky-700 text-sm font-bold leading-6 whitespace-nowrap">Select a route</div>
                </div>
                <div className="w-3.5 h-3.5 left-[63px] top-[194.08px] absolute flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-44 h-5 left-[87px] top-[193.08px] absolute flex items-center justify-start text-slate-600 text-xs font-normal leading-5">Abuse & fraud → Trust & Safety.</div>
                <div className="w-3.5 h-3.5 left-[63px] top-[221.20px] absolute flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-60 h-9 left-[87px] top-[221.20px] absolute flex items-center justify-start text-slate-600 text-xs font-normal leading-5"><span>Security concerns → Security operations<br/>(priority).</span></div>
                <div className="w-3.5 h-3.5 left-[63px] top-[266.45px] absolute flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-52 h-9 left-[87px] top-[266.45px] absolute flex items-center justify-start text-slate-600 text-xs font-normal leading-5"><span>Legal & procurement → Sales & legal<br/>operations.</span></div>
                <div className="w-3.5 h-3.5 left-[63px] top-[311.70px] absolute flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-60 h-5 left-[87px] top-[310.70px] absolute flex items-center justify-start text-slate-600 text-xs font-normal leading-5">Appeals → authenticated account review.</div>
            </div>
        </section>

        {/* Related policies & trust routes. */}
        <section className="relative w-[1012px] h-60 mx-auto">
            <div className="w-[1012px] h-11 left-0 top-[46px] absolute text-slate-800 text-3xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10">Related policies & trust routes.</div>
            <div className="w-[1012px] h-6 left-0 top-[102.79px] absolute text-slate-600 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6">Everything that governs responsible use of ZoikoNex, in one place.</div>
            <div className="w-36 h-9 left-0 top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-24 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Terms of Service</div>
                <div className="w-3 h-3 left-[119.69px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-32 h-9 left-[156.69px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-20 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Privacy Policy</div>
                <div className="w-3 h-3 left-[104.20px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-32 h-9 left-[297.89px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-20 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Cookie Policy</div>
                <div className="w-3 h-3 left-[103.72px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-24 h-9 left-[438.61px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-12 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Security</div>
                <div className="w-3 h-3 left-[71.42px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-32 h-9 left-[547.03px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-20 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Compliance</div>
                <div className="w-3 h-3 left-[94.53px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-32 h-9 left-[678.56px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-20 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">API Reference</div>
                <div className="w-3 h-3 left-[105.97px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-36 h-9 left-[821.53px] top-[149.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-24 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Developer Portal</div>
                <div className="w-3 h-3 left-[122.13px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
            <div className="w-24 h-9 left-0 top-[197.59px] absolute bg-white rounded-[999px] outline outline-1 outline-offset-[-1px] outline-slate-300">
                <div className="w-12 h-4 left-[14px] top-[11px] absolute flex items-center justify-start text-slate-800 text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5 whitespace-nowrap">Contact</div>
                <div className="w-3 h-3 left-[70.95px] top-[12.50px] absolute overflow-hidden flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="relative w-[1012px] mx-auto mt-[120px] mb-[120px] bg-[#0b3c63] rounded-[24px] px-[80px] py-[80px] text-center flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-[35px]">
                <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
                <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">
                  Platform Safety & Trust
                </span>
            </div>
            <h2 className="text-white text-4xl font-extrabold leading-[48px] mb-[24px] max-w-[800px]">
                Build on a platform designed for responsible telecom operations.
            </h2>
            <p className="text-sky-100 text-sm font-normal leading-6 mb-[48px] max-w-[700px]">
                ZoikoNex gives serious telecom operators clear rules for safe, governed, and commercially<br/>credible platform use. Review the policy, request the enterprise legal pack, or report<br/>suspected abuse through the appropriate route.
            </p>
            <div className="flex items-center gap-[24px]">
                <button className="h-[44px] px-[24px] bg-[#1974c0] hover:bg-[#1560a0] text-white rounded-lg text-sm font-semibold flex items-center gap-[8px] transition-colors shadow-[0_0_24px_rgba(25,116,192,0.3)]">
                    Request Legal & Security Pack
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button className="h-[44px] px-[24px] text-white hover:text-sky-200 text-sm font-semibold flex items-center gap-[8px] transition-colors">
                    View Terms of Service
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
            </div>
        </section>

      </div>

      <div className="absolute bottom-0 left-0 w-[1012px] h-96 bg-[radial-gradient(ellipse_at_100%_-4950%,_var(--tw-gradient-stops))] from-lime-500/20 to-lime-500/0 opacity-60 z-0"></div>
    </main>
  );
}
