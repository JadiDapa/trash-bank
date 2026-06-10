import { ReactNode } from "react";
import { getCurrentUser } from "@/app/action/auth.action";
import { redirect } from "next/navigation";
import CitizenSidebar from "@/components/root/citizen/CitizenSidebar";
import CitizenMobileNav from "@/components/root/citizen/CitizenMobileNav";
import CitizenNavbar from "@/components/root/citizen/CitizenNavbar";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (user.role === "SUPER_ADMIN") redirect("/super-admin");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "MASYARAKAT" && user.masyarakat?.status !== "APPROVED") {
    redirect("/waiting");
  }

  const masyarakat = user.masyarakat!;
  const initials = masyarakat.name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-muted relative flex min-h-screen w-full flex-col">
      <div className="ps-20 pe-2 pt-2 max-md:hidden">
        <CitizenNavbar masyarakat={masyarakat} />
      </div>

      <div className="flex flex-1 overflow-hidden ps-20 max-md:ps-0">
        <div className="fixed top-0 left-0">
          <CitizenSidebar initials={initials} />
        </div>
        <main className="flex w-full flex-col gap-2 overflow-hidden py-6 pe-6 max-md:p-0 max-md:pb-16">
          {children}
        </main>
      </div>

      <CitizenMobileNav />
    </div>
  );
}
