import "../admin/admin.css";
import Providers from "../admin/_components/Providers";
import PlatformShell from "./_components/PlatformShell";

export const metadata = {
  title: "ZoikoNex · Platform Super-Admin",
  description: "Cross-tenant platform control room for ZoikoNex.",
};

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <Providers>
        <PlatformShell>{children}</PlatformShell>
      </Providers>
    </div>
  );
}
