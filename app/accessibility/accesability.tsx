'use client';
import React from 'react';

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
      <path d="M2 7.5L5.5 11L12 4" stroke="#65a30d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BoxIcon() {
  return (
    <div className="w-10 h-10 bg-indigo-50 rounded-[10px] flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="1" stroke="#0369a1" strokeWidth="1.6"/>
      </svg>
    </div>
  );
}

export default function AccesabilityPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">

      {/* HERO */}
      <section className="w-full bg-slate-50 pt-[72px] pb-0 flex flex-col items-center text-center px-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
          <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">Platform Safety &amp; Trust</span>
        </div>
        <h1 className="text-slate-800 font-extrabold leading-[1.15] mb-8 w-full text-center text-[clamp(22px,3.4vw,48px)]">
          Acceptable use that protects serious telecom operators.
        </h1>
        <p className="text-slate-600 text-base font-normal leading-7 max-w-[1244px] text-center mb-6">
          ZoikoNex is built for responsible telecom monetization, governed API access, secure integrations, and trusted customer operations. Our Acceptable Use rules define the conduct, content, automation, API activity, and telecom practices that are not permitted on the platform.
        </p>
        <div className="w-full max-w-[1308px] h-px bg-black/20"></div>
      </section>

      {/* BLOCK 1: Enterprise quality signal */}
      <section className="w-full flex justify-center px-6 pt-8 pb-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3 max-w-[563px]">Accessibility is an enterprise quality signal.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8 max-w-[745px]">
            Accessible design improves reach, usability, procurement readiness, customer satisfaction, adoption,<br/>
            and support efficiency. For a telecom BSS platform, it also helps operational teams act faster and more<br/>
            accurately inside complex workflows.
          </p>
          <div className="grid grid-cols-2 gap-[14px]">
            {/* Card 1 - Buyer confidence */}
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[21px] h-44 relative">
              <div className="w-10 h-10 bg-indigo-50 rounded-[10px] flex items-center justify-center mb-[13px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L12.5 7H17.5L13.5 10.5L15 15.5L10 12.5L5 15.5L6.5 10.5L2.5 7H7.5L10 2Z" stroke="#0369a1" strokeWidth="1.58" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-slate-800 text-base font-bold leading-6 mb-[10px]">Buyer confidence</div>
              <div className="text-slate-600 text-sm font-normal leading-5">Shows enterprise and public-sector buyers that accessibility is part of the product governance model.</div>
            </div>

            {/* Card 2 - User productivity */}
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[21px] h-44 relative">
              <div className="w-10 h-10 bg-indigo-50 rounded-[10px] flex items-center justify-center mb-[13px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="6" width="14" height="2" rx="1" stroke="#0369a1" strokeWidth="1.58"/>
                  <rect x="3" y="10" width="10" height="2" rx="1" stroke="#0369a1" strokeWidth="1.58"/>
                  <rect x="3" y="14" width="7" height="2" rx="1" stroke="#0369a1" strokeWidth="1.58"/>
                </svg>
              </div>
              <div className="text-slate-800 text-base font-bold leading-6 mb-[10px]">User productivity</div>
              <div className="text-slate-600 text-sm font-normal leading-5">Improves navigation, readability, forms, dashboards, documentation, and task completion for more users.</div>
            </div>

            {/* Card 3 - Retention & less support */}
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[21px] h-44 relative">
              <div className="w-10 h-10 bg-indigo-50 rounded-[10px] flex items-center justify-center mb-[13px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 10C16 13.314 13.314 16 10 16C6.686 16 4 13.314 4 10C4 6.686 6.686 4 10 4C11.657 4 13.157 4.672 14.243 5.757" stroke="#0369a1" strokeWidth="1.58" strokeLinecap="round"/>
                  <path d="M14 4L14.243 5.757L16 6" stroke="#0369a1" strokeWidth="1.58" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-slate-800 text-base font-bold leading-6 mb-[10px]">Retention &amp; less support</div>
              <div className="text-slate-600 text-sm font-normal leading-5">Reduces avoidable friction, training burden, abandoned workflows, and accessibility-related escalations.</div>
            </div>

            {/* Card 4 - Platform quality */}
            <div className="bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-[21px] h-44 relative">
              <div className="w-10 h-10 bg-indigo-50 rounded-[10px] flex items-center justify-center mb-[13px]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="14" height="14" rx="2" stroke="#0369a1" strokeWidth="1.58"/>
                  <path d="M7 10L9 12L13 8" stroke="#0369a1" strokeWidth="1.58" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-slate-800 text-base font-bold leading-6 mb-[10px]">Platform quality</div>
              <div className="text-slate-600 text-sm font-normal leading-5">Reinforces UX discipline: semantic structure, keyboard usability, predictable patterns, and clearer copy.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 2: Commits */}
      <section className="w-full flex justify-center px-6 py-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3">What ZoikoNex commits to building toward.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8">Specific, operational, and reviewable commitments — not claims of full conformance.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Perceivable information', desc: 'Text, labels, states, errors, charts, tables, documents, and controls presented so people and assistive technologies can understand them.' },
              { title: 'Operable interfaces', desc: 'Core journeys reachable by keyboard, with visible focus, logical tab order, sufficient target sizes, and reduced-motion options.' },
              { title: 'Understandable content', desc: 'Plain language, clear headings, predictable navigation, meaningful buttons, helpful errors, and readable documentation.' },
              { title: 'Robust implementation', desc: 'Semantic HTML, ARIA only where appropriate, resilient components, automated checks, manual testing, and assistive-technology review.' },
              { title: 'Continuous remediation', desc: 'Issues are triaged, owned, prioritized, tracked, tested, and closed through product governance — not left as one-off tickets.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border-l-[3px] border border-lime-500 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] px-6 py-5">
                <div className="text-slate-800 text-base font-bold leading-6 mb-2">{item.title}</div>
                <div className="text-slate-600 text-sm font-normal leading-5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3: WCAG Principles */}
      <section className="w-full flex justify-center px-6 py-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3">Designed around recognized accessibility principles.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8 max-w-[676px]">
            Our public website and digital experiences are designed with WCAG 2.2 principles in mind — perceivable, operable, understandable, and robust — and we describe our standing carefully.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { tag: 'WCAG 2.2', title: 'Design principles', desc: 'We design with the four WCAG 2.2 principles in mind and target Level AA alignment across key surfaces.' },
              { tag: 'EN 301 549', title: 'EU procurement', desc: 'Relevant for European and public-sector ICT procurement, including websites, documents, and digital services.' },
              { tag: 'ADA Title II', title: 'US public sector', desc: 'References WCAG 2.1 AA for state and local government. We avoid implying it governs every private scenario without legal review.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-5">
                <div className="text-sky-700 text-[10px] font-semibold font-mono uppercase tracking-wide mb-2">{item.tag}</div>
                <div className="text-slate-800 text-sm font-bold leading-6 mb-2">{item.title}</div>
                <div className="text-slate-600 text-xs font-normal leading-5">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-2">
            <div className="bg-stone-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckIcon />
                <span className="text-lime-600 text-xs font-semibold font-mono uppercase tracking-wide">How we phrase it</span>
              </div>
              <div className="text-slate-600 text-xs font-normal leading-5 space-y-1.5">
                <div>&ldquo;Designed with WCAG principles in mind&rdquo;</div>
                <div>&ldquo;Targeting WCAG 2.2 AA alignment&rdquo;</div>
                <div>&ldquo;We continue to improve, and we welcome feedback&rdquo;</div>
              </div>
            </div>
            <div className="bg-red-50 border-l border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full border-[1.5px] border-red-500 shrink-0"></div>
                <span className="text-red-500 text-xs font-semibold font-mono uppercase tracking-wide">What we don&apos;t claim</span>
              </div>
              <div className="text-slate-600 text-xs font-normal leading-5 space-y-1.5">
                <div>Fully accessible or guaranteed accessible</div>
                <div>WCAG certified</div>
                <div>ADA compliant / legally compliant (unless independently verified)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 4: Critical surfaces */}
      <section className="w-full flex justify-center px-6 py-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3">Accessibility across every critical surface.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8">A broad commitment turned into specifics buyers and users can check.</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Public website', items: ['Semantic headings & skip links', 'Readable contrast & reduced motion', 'Descriptive CTAs & accessible forms'] },
              { title: 'Platform interface', items: ['Keyboard controls & visible focus', 'Non-color-only status indicators', 'Accessible modals, tables & charts'] },
              { title: 'Documentation', items: ['Structured headings & search', 'Code samples with copy buttons', 'Descriptive links & reviewed downloads'] },
              { title: 'API & Developer Portal', items: ['Keyboard-operable API explorer', 'No color-only method labels', 'Semantic error guidance'] },
              { title: 'Forms & support', items: ['Clear labels & inline validation', 'Accessible error summaries', 'No inaccessible CAPTCHA dependency'] },
              { title: 'Careers', items: ['Accessible listings & role filters', 'Inclusive application path', 'Accommodation request routing'] },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-5">
                <div className="text-slate-800 text-base font-bold leading-6 mb-4">{card.title}</div>
                <div className="space-y-2">
                  {card.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-slate-600 text-xs font-normal leading-5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 5: Feedback path */}
      <section className="w-full flex justify-center px-6 py-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3">A clear path for accessibility feedback.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8">
            We don&apos;t pretend there will never be issues. Here&apos;s how a report is handled — from submission to follow-up.
          </p>
          <div className="grid grid-cols-5 gap-3 mb-8">
            {[
              { num: '01', title: 'Report', desc: 'Submit via the accessible form, email, or support route.' },
              { num: '02', title: 'Triage', desc: 'Classified by severity, surface, journey, and assistive tech.' },
              { num: '03', title: 'Ownership', desc: 'A product, design, engineering, or content owner is assigned.' },
              { num: '04', title: 'Remediation', desc: 'Fix planned, tested, and released through change control.' },
              { num: '05', title: 'Follow-up', desc: 'Where contact is given, you receive an update.' },
            ].map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-4">
                <div className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center mb-4">
                  <span className="text-sky-700 text-xs font-semibold font-mono">{step.num}</span>
                </div>
                <div className="text-slate-800 text-sm font-bold leading-6 mb-1">{step.title}</div>
                <div className="text-slate-600 text-xs font-normal leading-5">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-6 items-start">
            <div className="flex-1 bg-white rounded-[20px] border border-slate-200 shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28),0px_1px_2px_0px_rgba(11,60,99,0.04)] p-7">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Name</label>
                    <span className="rounded-[5px] border border-slate-200 px-2 py-0.5 text-slate-500 text-[10px] font-semibold font-mono uppercase tracking-wide">Optional</span>
                  </div>
                  <input type="text" placeholder="Your name (optional)" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-500 outline-none" />
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Email</label>
                    <span className="text-sky-700 text-xs font-bold">*</span>
                  </div>
                  <input type="email" placeholder="So we can respond" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-500 outline-none" />
                  <p className="text-slate-500 text-xs leading-5 mt-1">Required so we can follow up.</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-slate-800 text-xs font-semibold leading-5">Affected page or product</label>
                  <span className="text-sky-700 text-xs font-bold">*</span>
                </div>
                <input type="text" placeholder="URL or area, e.g. /docs, API explorer" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Device / browser</label>
                    <span className="rounded-[5px] border border-slate-200 px-2 py-0.5 text-slate-500 text-[10px] font-semibold font-mono uppercase tracking-wide">Optional</span>
                  </div>
                  <input type="text" placeholder="e.g. Windows 11, Chrome 126" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-500 outline-none" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Assistive technology</label>
                    <span className="rounded-[5px] border border-slate-200 px-2 py-0.5 text-slate-500 text-[10px] font-semibold font-mono uppercase tracking-wide">Optional</span>
                  </div>
                  <input type="text" placeholder="e.g. NVDA, VoiceOver, switch" className="w-full h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-500 outline-none" />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-slate-800 text-xs font-semibold leading-5">Describe the issue</label>
                  <span className="text-sky-700 text-xs font-bold">*</span>
                </div>
                <textarea rows={4} placeholder="What happened, what you expected, and how it affected your task." className="w-full bg-white rounded-[10px] border border-slate-300 px-3.5 py-3 text-sm text-slate-500 outline-none resize-none leading-6"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Urgency</label>
                    <span className="rounded-[5px] border border-slate-200 px-2 py-0.5 text-slate-500 text-[10px] font-semibold font-mono uppercase tracking-wide">Optional</span>
                  </div>
                  <select className="w-full h-10 bg-white rounded-[10px] border border-slate-300 px-3.5 text-sm text-slate-800 outline-none">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-slate-800 text-xs font-semibold leading-5">Attachment</label>
                    <span className="rounded-[5px] border border-slate-200 px-2 py-0.5 text-slate-500 text-[10px] font-semibold font-mono uppercase tracking-wide">Optional</span>
                  </div>
                  <div className="h-11 bg-white rounded-[10px] border border-slate-300 px-3.5 flex items-center gap-2">
                    <span className="bg-zinc-100 border-2 border-black text-black text-xs px-2 py-0.5">Choose File</span>
                    <span className="text-slate-800 text-xs">No file chosen</span>
                  </div>
                  <p className="text-slate-500 text-xs leading-5 mt-1">Screenshot or recording (optional).</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-6">
                <input type="checkbox" className="mt-0.5 w-4 h-4 border border-neutral-500 shrink-0" />
                <p className="text-slate-600 text-xs font-semibold leading-5">
                  I agree that ZoikoNex may contact me about this report and process my details per the{' '}
                  <a href="#" className="text-sky-700">Privacy Notice</a>.
                </p>
              </div>
              <button className="w-full h-12 bg-sky-700 hover:bg-sky-800 transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                <span className="text-white text-base font-bold">Submit accessibility report</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="w-96 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-6">
                <div className="text-slate-800 text-base font-bold leading-6 mb-2">What happens next</div>
                <p className="text-slate-600 text-xs font-normal leading-5 mb-5">
                  Reports become tracked tickets with severity, surface, and assistive-technology context — not one-off emails.
                </p>
                <div className="space-y-3">
                  {[
                    'Triaged by severity, surface, and affected journey.',
                    'Assigned an accountable owner in product or content.',
                    'Fixed through normal change control, then tested.',
                    'You receive an update where contact details are provided.',
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-sky-700 text-xs font-semibold font-mono leading-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-slate-600 text-xs font-normal leading-5">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCK 6: Enterprise review */}
      <section className="w-full flex justify-center px-6 py-16">
        <div className="w-full max-w-[1012px]">
          <h2 className="text-slate-800 text-3xl font-extrabold leading-10 mb-3">Support for enterprise &amp; public-sector review.</h2>
          <p className="text-slate-600 text-base font-normal leading-6 mb-8 max-w-[717px]">
            Buyers may need accessibility statements, ACR/VPAT-style documentation, policy summaries, and evidence of our design and remediation processes.
          </p>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] p-9 flex items-center justify-between gap-8">
            <div className="flex-1">
              <p className="text-slate-600 text-sm font-normal leading-6 mb-4">
                We route these requests through the Trust Center or enterprise sales, with gated-document logic where appropriate, to the right review owners across Sales Operations, Product Governance, Legal/Compliance, and Security/Trust.
              </p>
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-slate-500 text-xs font-normal leading-5">VPAT/ACR documents, audit results, and remediation details are shared under review — not published publicly.</p>
              </div>
            </div>
            <button className="shrink-0 w-80 h-12 bg-sky-700 hover:bg-sky-800 transition-colors rounded-xl shadow-[0px_12px_24px_-12px_rgba(22,104,184,0.70)] flex items-center justify-center gap-2 cursor-pointer">
              <span className="text-white text-sm font-bold leading-6">Request Accessibility Review Materials</span>
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* BLOCK 7: CTA */}
      <section className="w-full flex justify-center px-6 pb-24">
        <div className="w-full max-w-[1012px] bg-gradient-to-r from-sky-900 to-sky-950 rounded-[24px] px-20 py-[58px] text-center flex flex-col items-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,rgba(101,163,13,0.2),transparent_60%)] pointer-events-none"></div>
          <div className="flex items-center justify-center gap-2 mb-8 relative z-10">
            <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm"></div>
            <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">Accessibility</span>
          </div>
          <h2 className="text-white text-4xl font-extrabold leading-[48px] mb-6 max-w-[800px] relative z-10">
            Help us make ZoikoNex easier for everyone to use.
          </h2>
          <p className="text-sky-100 text-sm font-normal leading-6 mb-12 max-w-[700px] relative z-10">
            Whether you&apos;re evaluating ZoikoNex, using our documentation, applying for a role, integrating with our APIs, or reporting an access barrier, we want the experience to be clear, usable, and respectful.
          </p>
          <div className="flex items-center gap-6 relative z-10 mb-16">
            <button className="h-11 px-6 bg-[#1974c0] hover:bg-[#1560a0] text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-[0_0_24px_rgba(25,116,192,0.3)] cursor-pointer">
              Report an Accessibility Issue
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <button className="h-11 px-6 text-white hover:text-sky-200 text-sm font-semibold flex items-center gap-2 transition-colors border border-[#1974c0] cursor-pointer rounded-lg">
              Request Enterprise Accessibility Review
            </button>
          </div>
          <div className="flex items-center justify-center gap-5 text-sky-200/80 text-xs font-semibold relative z-10">
            {['Trust Center', 'Privacy Policy', 'Security', 'Compliance', 'Documentation', 'Contact'].map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
