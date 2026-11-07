"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState } from "react";
import { ApiException } from "@/lib/admin/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            refetchOnWindowFocus: false,
            retry: (count, error) => {
              // Only retry transient/retryable failures, never auth or validation.
              if (error instanceof ApiException) return error.retryable && count < 2;
              return count < 1;
            },
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        richColors
        closeButton
        style={{ zIndex: 99999 }}
        toastOptions={{
          style: {
            background: "var(--navy, #0B3C63)",
            color: "var(--ink, #FFFFFF)",
            border: "1px solid var(--line-strong, #2A4D6C)",
            fontFamily: "var(--sans, inherit)",
            fontSize: "13px",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
