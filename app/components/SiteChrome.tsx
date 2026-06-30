"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/**
 * SiteChrome renders the public marketing Header/Footer for every route EXCEPT
 * the admin console (`/admin/**`), which owns its own full-screen chrome.
 *
 * This keeps the marketing site untouched (zero route moves) while giving the
 * operations console a clean canvas.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDashboard = pathname?.startsWith("/dashboards");

  if (isAdmin || isDashboard) {
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
