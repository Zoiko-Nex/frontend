"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/**
 * SiteChrome renders the public marketing Header/Footer for every route EXCEPT
 * the admin consoles (`/admin/**`, `/platform-admin/**`), which own their own
 * full-screen chrome.
 *
 * This keeps the marketing site untouched (zero route moves) while giving the
 * operations consoles a clean canvas.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isPlatformAdmin = pathname?.startsWith("/platform-admin");
  const isDashboard = pathname?.startsWith("/dashboards");
  const isSuperAdmin = pathname?.startsWith("/Super-admin");

  if (isAdmin || isPlatformAdmin || isDashboard || isSuperAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
