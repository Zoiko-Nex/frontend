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
        toastOptions={{
          style: {
            background: "var(--ax-bg-overlay)", color: "var(--ax-text)",
            border: "1px solid var(--ax-border-strong)", fontFamily: "var(--font-sans)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
