import Providers from "../components/admin/Providers";

// Scopes a React Query context to /Super-admin (the root layout has none), the
// same way /dashboards does. Without it the console's useQuery calls throw
// "No QueryClient set" during prerender and fail the build.
export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
