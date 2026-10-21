'use client';

/**
 * Retired route — redirects into the super-admin console's Integrations module.
 *
 * This page used to be a second, full implementation of the MVNO carrier hub:
 * its own connector table, its own onboarding wizard, and its own copies of the
 * certification-readiness, plan/SOC mapping and Vault credential modals — about
 * 1,800 lines duplicating what app/Super-admin/page.tsx already rendered.
 *
 * Two implementations of one screen is not a styling problem, it is a
 * correctness one. The fabricated connector list was removed from this file
 * while an identical copy survived in the console, so the console kept showing
 * carriers that did not exist. New capabilities were added here, where the
 * sidebar does not lead, so nobody could reach them. Both failures come from
 * the same root: the screen a user navigates to and the screen being maintained
 * were different files.
 *
 * The console is canonical because that is where the sidebar goes; its
 * Integrations module lives in ../IntegrationsModule.tsx. Of the modals this
 * page introduced only DocAnalyser remains here, opened from the Operations
 * step.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RetiredMvnoRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/Super-admin?module=integrations');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#4D5E72',
        fontSize: 13,
      }}
    >
      Opening MVNO carrier integrations in the console…
    </div>
  );
}
