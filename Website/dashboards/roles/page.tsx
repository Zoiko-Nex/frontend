"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { RolesManager } from "../../components/access-control/RolesManager";
import { ToastProvider } from "../../components/access-control/ui";
import { useAccessControlClient } from "@/lib/access-control/useClient";

export function RolesPage() {
  const client = useAccessControlClient();
  return (
    <ToastProvider>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <RolesManager client={client} />
        </div>
      </main>
      <Footer />
    </ToastProvider>
  );
}

export default RolesPage;
