'use client';
import React, { useState } from 'react';
import CookieSetting from './cookie-setting';

const pageTabs = [
  { id: 1, label: 'Summary' },
  { id: 2, label: 'Categories' },
  { id: 3, label: 'Preferences' },
  { id: 4, label: 'Inventory' },
  { id: 5, label: 'Governance' }
];
const cookieCategories = [
  {
    id: 1,
    title: 'Essential',
    desc: 'Keep the site secure and working, including session integrity and storing your consent choice.',
    badgeText: 'Always active',
    isEssential: true
  },
  {
    id: 2,
    title: 'Analytics',
    desc: 'Help us understand traffic and content performance so we can improve the site and documentation.',
    badgeText: 'Off until consent',
    isEssential: false
  },
  {
    id: 3,
    title: 'Functionality',
    desc: 'Remember preferences such as language, region, and documentation state for a smoother return visit.',
    badgeText: 'Off until consent',
    isEssential: false
  },
  {
    id: 4,
    title: 'Marketing & Communication',
    desc: 'Support campaign attribution and relevant business communication where consent applies.',
    badgeText: 'Off until consent',
    isEssential: false
  }
];
const categoriesData = [
  {
    id: 'necessary',
    title: 'Strictly Necessary',
    badge: 'Always active',
    badgeType: 'active',
    controlText: 'Cannot be disabled',
    controlType: 'disabled',
    desc: 'Required to deliver the service you request and to keep the site and preference center operational and secure.',
    examples: 'Session integrity, load balancing, security, storing your consent choice.',
    retention: 'Session or short-lived; consent record retained per policy.',
  },
  {
    id: 'analytics',
    title: 'Analytics / Performance',
    badge: 'Off until consent',
    badgeType: 'consent',
    controlText: 'You can accept or reject',
    controlType: 'toggle',
    desc: 'Measure traffic, page performance, and content engagement to improve the website and documentation. No pre-ticked toggles.',
    examples: 'Traffic measurement, performance timing, content engagement.',
    retention: 'Defined per provider; verified against the live inventory.',
  },
  {
    id: 'functionality',
    title: 'Functionality',
    badge: 'Off until consent',
    badgeType: 'consent',
    controlText: 'You can accept or reject',
    controlType: 'toggle',
    desc: 'Remember chosen preferences for usable repeat visits. Essential features are never hidden behind optional consent.',
    examples: 'Language, region, and documentation-state preferences.',
    retention: 'Persistent within a bounded period; see inventory.',
  },
  {
    id: 'marketing',
    title: 'Marketing / Communication',
    badge: 'Off until consent',
    badgeType: 'consent',
    controlText: 'You can accept or reject',
    controlType: 'toggle',
    desc: 'Support campaign attribution and lead-source tracking where approved. No tracking before consent where consent is required.',
    examples: 'Campaign attribution, lead-source tracking, remarketing pixels where approved.',
    retention: 'Defined per provider; verified against the live inventory.',
  },
  {
    id: 'security',
    title: 'Security / Fraud Prevention',
    badge: 'Active if necessary',
    badgeType: 'warning',
    controlText: 'Limited — necessity explained',
    controlType: 'limited',
    desc: 'Protect the platform and users from abuse. These are classified carefully and are never used to label marketing tags as security.',
    examples: 'Bot protection, abuse detection, form-security controls.',
    retention: 'As required for protection; minimized where possible.',
  },
];

const inventoryData = [
  {
    name: 'zk_session',
    provider: 'ZoikoNex',
    category: 'Necessary',
    purpose: 'Maintains a secure session',
    duration: 'Session',
    party: 'First',
    consent: 'Not required',
    owner: 'Platform Eng',
    reviewed: 'Jun 2026'
  },
  {
    name: 'zk_consent',
    provider: 'ZoikoNex',
    category: 'Necessary',
    purpose: 'Stores your cookie choices',
    duration: '12 months',
    party: 'First',
    consent: 'Not required',
    owner: 'Privacy',
    reviewed: 'Jun 2026'
  },
  {
    name: 'zk_analytics',
    provider: 'Analytics provider',
    category: 'Analytics',
    purpose: 'Aggregate usage measurement',
    duration: 'Per provider',
    party: 'First/Third',
    consent: 'Required',
    owner: 'Growth',
    reviewed: 'Jun 2026'
  },
  {
    name: 'zk_pref',
    provider: 'ZoikoNex',
    category: 'Functionality',
    purpose: 'Remembers language & region',
    duration: '6 months',
    party: 'First',
    consent: 'Required',
    owner: 'Web',
    reviewed: 'Jun 2026'
  },
  {
    name: 'zk_attr',
    provider: 'Marketing provider',
    category: 'Marketing',
    purpose: 'Campaign / lead-source attribution',
    duration: 'Per provider',
    party: 'Third',
    consent: 'Required',
    owner: 'Marketing',
    reviewed: 'Jun 2026'
  },
  {
    name: 'zk_shield',
    provider: 'Security provider',
    category: 'Security',
    purpose: 'Bot & abuse protection',
    duration: 'As required',
    party: 'Third',
    consent: 'Necessity-based',
    owner: 'Security',
    reviewed: 'Jun 2026'
  }
];
export default function CookieConsent() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
<>
  <CookieSetting isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
<div className="relative w-full min-h-screen bg-white bg-radial-[at_92%_-8%] from-lime-500/10 to-transparent to-60% overflow-x-hidden">
      
      <div className="relative z-10 w-full flex flex-col">
            <section className="w-full bg-white py-16 md:py-13 ">
      <div className="w-full max-w-[832px] mx-auto px-4 flex flex-col items-start gap-8 md:gap-10">
        
      
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm shrink-0" />
            <span className="text-sky-700 text-xs font-semibold font-['IBM_Plex_Mono'] tracking-widest uppercase">
              Privacy and Consent
            </span>
          </div>
          
          <h1 className="text-slate-800 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight md:leading-[54px]">
            Cookie choices should be clear, fair, and easy to manage.
          </h1>
          
          <p className="text-slate-600 text-base font-normal leading-relaxed max-w-3xl">
            ZoikoNex uses cookies and similar technologies to operate the website, secure sessions, 
            understand performance, improve content, and support controlled commercial journeys. This 
            page explains the categories we use, why they matter, and how visitors can manage their choices.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <button onClick={() => setSettingsOpen(true)} className="px-6 h-12 bg-sky-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0px_12px_24px_-12px_rgba(22,104,184,0.7)] hover:bg-sky-800 transition-colors duration-200">
            <span>Manage cookie preferences → </span>
          </button>

          <a href="/privacy-policy" className="px-6 h-12 bg-white text-slate-800 rounded-xl font-bold text-sm border border-slate-300 hover:bg-slate-50 transition-colors duration-200 flex items-center justify-center">
            Read Privacy Policy
          </a>
        </div>

        
        <div className="border-l-2 border-lime-500 pl-4 max-w-2xl">
          <p className="text-slate-500 text-sm font-normal leading-relaxed">
            No preference choice should be hidden behind unnecessary friction. Essential cookies are used 
            only where needed to provide requested services or protect the site.
          </p>
        </div>

 
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 text-[11px] sm:text-xs font-['IBM_Plex_Mono'] text-slate-600">
          <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm shrink-0" />
          <span>Last reviewed</span>
          <span className="font-semibold text-slate-800">June 20, 2026</span>
          <span className="text-slate-400 font-sans">·</span>
          <span>Owner:</span>
          <span className="font-semibold text-slate-800">Privacy & Legal</span>
        </div>

        <div className="w-full border-t border-b border-slate-200 py-4 flex flex-col md:flex-row md:items-center gap-4">
          <span className="text-slate-500 text-xs font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wider md:shrink-0 pt-1">
            On this page
          </span>
          
          <div className="flex flex-wrap items-center gap-3">
            {pageTabs.map((tab) => (
              <button 
                key={tab.id}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-full text-xs font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 whitespace-nowrap"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
    <section className="w-full bg-white py-16 md:py-13 ">
      <div className="w-full max-w-[832px] mx-auto px-4 space-y-10">
        
      
        <div className="space-y-4 max-w-3xl text-left">
          <h2 className="text-slate-800 text-2xl md:text-3xl font-extrabold tracking-tight">
            What cookies do here.
          </h2>
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            Cookies help the website remember necessary settings, measure performance, improve content, 
            and support relevant business communication. Some cookies are required for security and basic 
            operation. Others are used only where consent or another approved lawful basis applies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
          {cookieCategories.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              {/* Card body */}
              <div className="px-[21px] pt-[19px] pb-5 space-y-3">
                <div className="flex items-center gap-[10px]">
                  <div className={`w-2 h-2 rounded-sm shrink-0 ${item.isEssential ? 'bg-lime-500' : 'bg-sky-700'}`} />
                  <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                  {item.desc}
                </p>
              </div>

              {/* Badge — flush to card bottom */}
              {item.isEssential ? (
                <div className="mx-[21px] mb-[21px] inline-flex items-center gap-2 px-2.5 py-1.5 bg-stone-200 rounded-md border border-lime-500/30 self-start">
                  <svg className="w-3 h-3 text-lime-600 shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.8}>
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                  <span className="text-lime-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">
                    Always active
                  </span>
                </div>
              ) : (
                <div className="mx-[21px] mb-[21px] flex items-center gap-2 px-2.5 py-[9px] bg-indigo-50 rounded-md border border-sky-700/30">
                  <span className="text-sky-700 text-xs font-normal leading-none shrink-0">+</span>
                  <span className="flex-1" />
                  <span className="text-sky-700 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">
                    Off until consent
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
    <section className="w-full bg-white py-12 md:py-16">
      <div className="w-full max-w-[832px] mx-auto px-4 space-y-8">
        
        
        <div className="space-y-3">
          <h2 className="text-slate-800 text-2xl font-extrabold  leading-10 tracking-tight">
            Cookie categories and control rules.
          </h2>
          <p className="text-slate-600 text-base font-normal leading-6 max-w-[725px]">
            Each category explains its real purpose, examples, default state, retention, and whether you can turn
            it off — no vague “improve your experience” labels.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className="w-full bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] px-[23px] pt-6 pb-[22px] space-y-4"
            >
              {/* ── Header row: title+badge left | control right ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-7">
                    {category.title}
                  </h3>

                  {/* Badge */}
                  {category.badgeType === 'active' && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-stone-200 rounded-md border border-lime-500/30">
                      <svg className="w-3 h-3 text-lime-600 shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.8}>
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                      <span className="text-lime-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">Always active</span>
                    </div>
                  )}
                  {category.badgeType === 'consent' && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-[7px] bg-indigo-50 rounded-md border border-sky-700/30">
                      <span className="text-sky-700 text-xs font-normal leading-none">+</span>
                      <span className="text-sky-700 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">Off until consent</span>
                    </div>
                  )}
                  {category.badgeType === 'warning' && (
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-yellow-600/10 rounded-md border border-yellow-600/40">
                      <svg className="w-3 h-3 text-yellow-600 shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.8}>
                        <circle cx="6" cy="6" r="4.5" />
                        <line x1="6" y1="4" x2="6" y2="6.5" />
                      </svg>
                      <span className="text-yellow-600 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">Active if necessary</span>
                    </div>
                  )}
                </div>

                {/* Control label — right side */}
                <div className="flex items-center gap-1.5 text-slate-600 shrink-0">
                  {category.controlType === 'disabled' && (
                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {category.controlType === 'toggle' && (
                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {category.controlType === 'limited' && (
                    <span className="text-slate-400 text-sm leading-none">·</span>
                  )}
                  <span className="text-xs font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    {category.controlText}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-6">
                {category.desc}
              </p>

              {/* Examples & Retention table rows */}
              <div className="pt-3 space-y-2 border-t border-slate-100">
                <div className="flex items-start gap-4">
                  <span className="w-[72px] shrink-0 text-slate-500 text-[10px] font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide leading-5 pt-px">
                    Examples
                  </span>
                  <span className="text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                    {category.examples}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-[72px] shrink-0 text-slate-500 text-[10px] font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide leading-5 pt-px">
                    Retention
                  </span>
                  <span className="text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                    {category.retention}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
     <section className="w-full bg-white py-16 md:py-13">
      <div className="w-full max-w-[832px] mx-auto px-4 space-y-10">
        
      
        <div className="space-y-4 max-w-3xl text-left">
          <h2 className="text-slate-800 text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
            A preference center built for control, not confusion.
          </h2>
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            Accepting, rejecting, and managing cookies are given comparable visibility — refusing is as easy as 
            accepting. Your choice is saved, can be changed at any time, and a persistent{' '}
            <button className="text-sky-700 font-semibold inline hover:underline focus:outline-2 focus:outline-sky-700 focus:outline-offset-2 rounded-sm">
              Cookie Settings
            </button>{' '}
            link lives in the footer.
          </p>
        </div>

      
        <div className="w-full bg-gradient-to-br from-sky-900 to-sky-950 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28)] shadow-[0px_1px_2px_0px_rgba(11,60,99,0.04)] border border-sky-800/50">
          
          {/* Accent radial glow overlay in upper right quadrant */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-lime-500/10 to-transparent pointer-events-none rounded-bl-full" />

          {/* Inner Content Structure */}
          <div className="relative z-10 space-y-8">
            
            {/* Title & Copy Text block */}
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-white text-lg md:text-xl font-bold leading-snug">
                Manage your cookie preferences
              </h3>
              <p className="text-slate-300 text-sm font-normal leading-relaxed">
                Choose which optional categories to allow. Strictly necessary cookies cannot be switched off 
                because the site and the preference center rely on them. Your settings apply immediately and 
                can be revisited whenever you like.
              </p>
            </div>

            {/* Responsive Operations CTA Actions Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              
              {/* Primary Launch Action Element */}
              <button className="px-5 h-12 bg-sky-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0px_12px_24px_-12px_rgba(22,104,184,0.7)] hover:bg-sky-600 focus:outline focus:outline-2 focus:outline-white transition-all duration-200 shrink-0">
                <span>Open preference center →</span>
              </button>

              {/* Secondary Accept All Trigger Button */}
              <button className="px-5 h-12 bg-white text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-sky-400 transition-all duration-200">
                Accept all
              </button>

              {/* Secondary Rejection Trigger Button */}
              <button className="px-5 h-12 bg-white text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-100 focus:outline focus:outline-2 focus:outline-sky-400 transition-all duration-200">
                Reject non-essential
              </button>
              
            </div>

            {/* Accessibility Micro Copy Note */}
            <div className="pt-2 border-t border-sky-800/40 max-w-2xl">
              <p className="text-slate-400 text-xs font-normal tracking-tight leading-relaxed">
                Accept all · Reject non-essential · Manage choices · Save — all keyboard accessible, 
                no pre-ticked optional categories.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
    <section className="w-full bg-white py-12 md:py-16">
  <div className="w-full max-w-[832px] mx-auto px-4 space-y-8">
    
    {/* Header Block */}
    <div className="space-y-3">
      <h2 className="text-slate-800 text-2xl font-extrabold leading-10 tracking-tight">
        A controlled inventory, not a static promise.
      </h2>
      <p className="text-slate-600 text-base font-normal leading-6 max-w-[700px]">
        The structure below is how product, engineering, marketing, and legal maintain the live inventory. 
        Entries are published only after verification against the live tag manager and website implementation.
      </p>
    </div>

    {/* Responsive Table Wrapper */}
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[832px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Name', 'Provider', 'Category', 'Purpose', 'Duration', 'Party', 'Consent', 'Owner', 'Last Reviewed'].map((header) => (
                <th key={header} className="px-[14px] py-[14px] text-slate-500 text-[10px] font-semibold font-['IBM_Plex_Mono'] uppercase tracking-wide whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {inventoryData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors align-top">
                {/* Name — monospace medium */}
                <td className="px-[14px] py-[14px] text-slate-800 text-xs font-medium font-['IBM_Plex_Mono'] leading-5 whitespace-nowrap w-[110px]">
                  {row.name}
                </td>
                {/* Provider — wraps */}
                <td className="px-[14px] py-[14px] text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5 w-[96px]">
                  {row.provider}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9.5px] font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide border ${
                    row.category === 'Necessary' ? 'bg-stone-50 text-slate-600 border-slate-300' :
                    row.category === 'Analytics' ? 'bg-indigo-50/50 text-sky-700 border-sky-600/20' :
                    row.category === 'Functionality' ? 'bg-indigo-50/50 text-sky-700 border-sky-600/20' :
                    row.category === 'Marketing' ? 'bg-indigo-50/50 text-sky-700 border-sky-600/20' :
                    'bg-yellow-50 text-yellow-700 border-yellow-600/20'
                  }`}>
                    {row.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal min-w-[160px]">
                  {row.purpose}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal whitespace-nowrap">
                  {row.duration}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal whitespace-nowrap">
                  {row.party}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal whitespace-nowrap">
                  {row.consent}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal whitespace-nowrap">
                  {row.owner}
                </td>
                <td className="px-4 py-4 text-slate-600 text-xs font-normal whitespace-nowrap">
                  {row.reviewed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Disclaimer Footer Callout */}
    <div className="flex items-start gap-3 pt-2 max-w-[750px]">
      <svg className="w-4 h-4 text-yellow-600 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-slate-500 text-xs font-normal leading-relaxed">
        Representative structure for design and review. Cookie names, providers, durations, and consent flags are placeholders until verified against the live tag manager, CMP, analytics, and developer portal.
      </p>
    </div>

  </div>
</section>
<section className="w-full bg-white py-12 md:py-16">
  <div className="w-full max-w-[832px] mx-auto px-4 space-y-8">

    {/* Section Header */}
    <div className="space-y-3">
      <h2 className="text-slate-800 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-10 tracking-tight">
        Cookie governance is part of product governance.
      </h2>
      <p className="text-slate-600 text-base font-normal font-['Plus_Jakarta_Sans'] leading-6 max-w-[690px]">
        Consent, tags, analytics, and privacy changes are controlled like any other part of the platform.
      </p>
    </div>


    {/* Governance Two-Column Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">

      {/* Card 1: Review & Change Control */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] px-[23px] pt-[21px] pb-6">
        <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6 mb-5">
          Review &amp; change control
        </h3>
        <ul className="space-y-[17px]">
          {[
            'Tags are reviewed before deployment and classified by purpose.',
            'New tags use an allowlist: no deploy without category, owner, purpose, and privacy review.',
            'Each entry carries an owner, approval status, and last-review date.',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-[10px]">
              <div className="w-4 h-4 shrink-0 mt-px flex items-center justify-center overflow-hidden">
                <svg className="w-[10px] h-[8px] text-lime-600" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={1.47}>
                  <polyline points="1,4 3.5,6.5 9,1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">{text}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Card 2: Consent Evidence */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] px-[23px] pt-[21px] pb-6">
        <h3 className="text-slate-800 text-base font-bold font-['Plus_Jakarta_Sans'] leading-6 mb-5">
          Consent evidence
        </h3>
        <ul className="space-y-[17px]">
          {[
            'Non-essential tags do not fire before consent where consent is required.',
            'Preference changes, banner version, consent state, timestamp, region, and policy version are recorded where appropriate.',
            'Records are available to authorized administrators only, with retention and access controls.',
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-[10px]">
              <div className="w-4 h-4 shrink-0 mt-px flex items-center justify-center overflow-hidden">
                <svg className="w-[10px] h-[8px] text-lime-600" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={1.47}>
                  <polyline points="1,4 3.5,6.5 9,1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">{text}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* Navigation Pill Links */}
    <div className="flex flex-wrap items-center gap-3">
      {['Privacy Policy', 'Security', 'Compliance'].map((label) => (
        <button
          key={label}
          className="h-10 px-[15px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-full text-xs font-semibold font-['Plus_Jakarta_Sans'] flex items-center gap-2 transition-all duration-200"
        >
          <span>{label}</span>
          {/* Right-pointing arrow → */}
          <svg className="w-2.5 h-2.5 text-slate-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>

  </div>
</section>
<section className="w-full bg-slate-50 py-10">
  <div className="w-full max-w-[832px] mx-auto px-4">
    <div className="bg-white rounded-[20px] shadow-[0px_6px_16px_-10px_rgba(11,60,99,0.22),0px_1px_2px_0px_rgba(11,60,99,0.06)] px-8 py-14 flex flex-col items-center text-center gap-6">

      {/* Heading Block */}
      <div className="space-y-3 max-w-lg">
        <h2 className="text-slate-800 text-3xl font-extrabold tracking-tight leading-10">
          Manage your choices at any time.
        </h2>
        <p className="text-slate-600 text-base font-normal  leading-6">
          You should not need to search, email support, or clear your browser to change non-essential cookie preferences.
        </p>
      </div>

      {/* CTA Button with right arrow */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="px-6 h-12 bg-sky-700 text-white rounded-xl font-bold font-['Plus_Jakarta_Sans'] text-sm flex items-center justify-center gap-2.5 shadow-[0px_12px_24px_-12px_rgba(22,104,184,0.70)] hover:bg-sky-800 transition-colors duration-200"
      >
        <span>Open Cookie Settings →</span>
       
      </button>

      {/* Dot-separated text links */}
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm font-normal font-['Plus_Jakarta_Sans']">
        {[
          { name: 'Privacy Policy', href: '/privacy-policy' },
          { name: 'Security', href: '/security' },
          { name: 'Compliance', href: '/compliance' },
          { name: 'Contact', href: '/contact-us' }
        ].map((link, i, arr) => (
          <React.Fragment key={link.name}>
            <a href={link.href} className="text-sky-700 hover:underline transition-all">{link.name}</a>
            {i < arr.length - 1 && (
              <span className="text-slate-400 select-none px-1">·</span>
            )}
          </React.Fragment>
        ))}
      </div>

    </div>
  </div>
</section>
      </div>{/* end relative z-10 */}
    </div>{/* end page wrapper */}
</>
  );
}
