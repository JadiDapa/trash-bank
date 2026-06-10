import { requireSuperAdmin } from "@/app/action/auth.action";
import SuperAdminSidebar from "@/components/root/super-admin/SuperAdminSidebar";
import SuperAdminNavbar from "@/components/root/super-admin/SuperAdminNavbar";
import SuperAdminMobileNav from "@/components/root/super-admin/SuperAdminMobileNav";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdmin();

  return (
    <div className="bg-muted relative flex min-h-screen w-full flex-col">
      <div className="ps-20 pe-2 pt-2 max-md:hidden">
        <SuperAdminNavbar />
      </div>

      <div className="flex flex-1 overflow-hidden ps-20 max-md:ps-0">
        <div className="fixed top-0 left-0">
          <SuperAdminSidebar />
        </div>
        <main className="flex w-full flex-col gap-2 overflow-hidden py-6 pe-6 max-md:p-4 max-md:pb-20">
          {children}
        </main>
      </div>

      <SuperAdminMobileNav />
    </div>
  );
}
