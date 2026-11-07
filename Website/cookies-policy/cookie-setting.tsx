'use client';
import React, { useState } from 'react';

interface CookieSettingProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    id: 'analytics',
    title: 'Analytics / performance',
    desc: 'Aggregate measurement of traffic and content performance to improve the site.',
    alwaysOn: false,
  },
  {
    id: 'functionality',
    title: 'Functionality',
    desc: 'Remembers preferences such as language, region, and documentation state.',
    alwaysOn: false,
  },
  {
    id: 'marketing',
    title: 'Marketing / communication',
    desc: 'Campaign attribution and lead-source tracking where consent applies.',
    alwaysOn: false,
  },
  {
    id: 'security',
    title: 'Security / fraud prevention',
    desc: 'Bot protection and abuse detection. Some controls may remain active where strictly necessary for protection.',
    alwaysOn: false,
  },
];

export default function CookieSetting({ isOpen, onClose }: CookieSettingProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    analytics: true,
    functionality: true,
    marketing: true,
    security: true,
  });

  if (!isOpen) return null;

  const toggle = (id: string) =>
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));

  const rejectAll = () =>
    setToggles({ analytics: false, functionality: false, marketing: false, security: false });

  const acceptAll = () =>
    setToggles({ analytics: true, functionality: true, marketing: true, security: true });

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px]"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div className="w-full max-w-[560px] mx-4 bg-white rounded-[20px] shadow-[0px_18px_48px_-22px_rgba(11,60,99,0.28),0px_1px_2px_0px_rgba(11,60,99,0.04)] border border-slate-200 overflow-hidden flex flex-col">

        {/* ── Header ── */}
        <div className="px-[22px] pt-5 pb-[14px] border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-slate-800 text-lg font-extrabold font-['Plus_Jakarta_Sans'] leading-7">
              Cookie preferences
            </h2>
            <p className="text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
              Choose which optional cookies to allow. Necessary cookies are always on.
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Strictly necessary (always on) ── */}
        <div className="px-[22px] py-4 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <span className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-6">
              Strictly necessary
            </span>
            {/* Always on badge */}
            <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
              {/* Lock icon */}
              <svg className="w-3 h-3 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-lime-600 text-[10px] font-normal font-['IBM_Plex_Mono'] uppercase tracking-wide leading-4">
                Always on
              </span>
            </div>
          </div>
          <p className="mt-[10px] text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Required for security, session integrity, and to store your consent choice. These cannot be switched off.
          </p>
        </div>

        {/* ── Optional categories ── */}
        <div className="divide-y divide-slate-200 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="px-[22px] py-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-6">
                  {cat.title}
                </span>
                {/* Toggle switch */}
                <button
                  role="switch"
                  aria-checked={toggles[cat.id]}
                  onClick={() => toggle(cat.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2 ${
                    toggles[cat.id] ? 'bg-sky-700' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.25)] transition-transform duration-200 mt-[2px] ${
                      toggles[cat.id] ? 'translate-x-[23px]' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>
              <p className="mt-[10px] text-slate-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Footer actions ── */}
        <div className="px-[22px] py-[17px] border-t border-slate-200 flex items-center gap-4">
          {/* Reject */}
          <button
            onClick={rejectAll}
            className="flex-1 h-16 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] text-center transition-colors duration-200"
          >
            Reject non-<br />essential
          </button>
          {/* Accept all */}
          <button
            onClick={acceptAll}
            className="flex-1 h-16 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold font-['Plus_Jakarta_Sans'] text-center transition-colors duration-200"
          >
            Accept all
          </button>
          {/* Save */}
          <button
            onClick={onClose}
            className="flex-1 h-16 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-sm font-bold font-['Plus_Jakarta_Sans'] text-center shadow-[0px_12px_24px_-12px_rgba(22,104,184,0.70)] transition-colors duration-200"
          >
            Save<br />preferences
          </button>
        </div>
      </div>
    </div>
  );
}
