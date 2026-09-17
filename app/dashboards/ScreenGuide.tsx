"use client";

import React, { useEffect, useState } from "react";
import { NAV_BY_TAB, SECTION_BY_TAB } from "./navigation";

const STORAGE_KEY = "zn.dashboards.guideOpen";

/**
 * The orientation strip above every screen in the console.
 *
 * Two bands, deliberately: the breadcrumb and one-line summary are always
 * visible so you can never be on a screen without knowing what it is, while the
 * step-by-step "How to use this screen" collapses. The collapsed state is one
 * global preference rather than one per tab -- an operator who already knows the
 * console collapses it once and it stays collapsed everywhere, instead of having
 * to dismiss the same panel 25 times.
 *
 * Renders nothing for a tab with no registry entry, so an unregistered screen
 * degrades to the old layout rather than showing an empty box.
 */
export default function ScreenGuide({ tabKey }: { tabKey: string }) {
  const entry = NAV_BY_TAB[tabKey];
  const section = SECTION_BY_TAB[tabKey];

  // Starts closed and opens after mount if the stored preference says so:
  // reading localStorage during render would not match the server-rendered
  // markup and React would discard the whole subtree on hydration.
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private mode or blocked site data -- fall through to the default.
    }
    // Default open: someone new to the console should see the guidance without
    // having to discover the toggle first.
    setOpen(stored === null ? true : stored === "1");
    setReady(true);
  }, []);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // Preference simply will not persist; the toggle still works this session.
    }
  };

  if (!entry) return null;

  return (
    <section
      aria-label={`About ${entry.label}`}
      className="self-stretch w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 flex items-start gap-3.5">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-1">
          {section && (
            <div className="text-[9.5px] font-bold font-['IBM_Plex_Mono'] uppercase tracking-wider text-slate-400">
              {section} <span className="text-slate-300">/</span> {entry.label}
            </div>
          )}
          <p className="text-slate-600 text-[13px] font-normal font-['Plus_Jakarta_Sans'] leading-5">
            {entry.summary}
          </p>
        </div>

        <button
          onClick={toggle}
          aria-expanded={open}
          className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[11px] font-bold font-['Plus_Jakarta_Sans'] transition flex items-center gap-1.5 cursor-pointer"
        >
          {open ? "Hide steps" : "How to use"}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {ready && open && (
        <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/60">
          <div className="text-[9.5px] font-bold font-['IBM_Plex_Mono'] uppercase tracking-wider text-slate-400 pt-3 pb-2">
            How to use this screen
          </div>
          <ol className="flex flex-col gap-2">
            {entry.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-px w-[18px] h-[18px] shrink-0 rounded-full bg-slate-900 text-white text-[10px] font-bold font-['IBM_Plex_Mono'] flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-slate-600 text-[12.5px] font-normal font-['Plus_Jakarta_Sans'] leading-5">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
