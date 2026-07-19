"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { RouteAccessManager } from "../../components/access-control/RouteAccessManager";
import { ToastProvider } from "../../components/access-control/ui";
import { useAccessControlClient } from "@/lib/access-control/useClient";

export function RouteAccessPage() {
  const client = useAccessControlClient();
  return (
    <ToastProvider>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <RouteAccessManager client={client} />
        </div>
      </main>
      <Footer />
    </ToastProvider>
  );
}

export default RouteAccessPage;
