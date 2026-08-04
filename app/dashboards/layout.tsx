import Providers from "../admin/_components/Providers";

// Scopes a React Query context to /dashboards only (the root layout has
// none) so this route can reuse admin-panel components like PermissionPicker
// that depend on useQuery/useMutation, without touching the global layout.
export default function DashboardsLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
