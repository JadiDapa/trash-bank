import { getCurrentUser } from "@/app/action/auth.action";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/root/admin/AdminSidebar";
import AdminNavbar from "@/components/root/admin/AdminNavbar";
import AdminMobileNav from "@/components/root/admin/AdminMobileNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN" || !user.admin) redirect("/sign-in");

  const admin = user.admin;
  const initials = admin.bankName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-muted relative flex min-h-screen w-full flex-col">
      <div className="ps-20 pe-2 pt-2 max-md:hidden">
        <AdminNavbar admin={admin} />
      </div>

      <div className="flex flex-1 overflow-hidden ps-20 max-md:ps-0">
        <div className="fixed top-0 left-0">
          <AdminSidebar initials={initials} />
        </div>
        <main className="flex w-full flex-col gap-2 overflow-hidden py-6 pe-6 max-md:p-4 max-md:pb-20">
          {children}
        </main>
      </div>

      <AdminMobileNav />
    </div>
  );
}
