import "./admin.css";
import Providers from "./_components/Providers";
import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "ZoikoNex · Operations Console",
  description: "Platform operations and governance console for ZoikoNex.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <Providers>
        <AdminShell>{children}</AdminShell>
      </Providers>
    </div>
  );
}
