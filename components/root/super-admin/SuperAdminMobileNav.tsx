"use client";

import { LayoutDashboard, Users, Building2, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Beranda", url: "/super-admin", icon: LayoutDashboard },
  { title: "Masyarakat", url: "/super-admin/masyarakat", icon: Users },
  { title: "Bank Sampah", url: "/super-admin/admin", icon: Building2 },
  { title: "Edukasi", url: "/super-admin/edukasi", icon: BookOpen },
  { title: "Pengaturan", url: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 py-2 md:hidden">
      {menuItems.map((item) => {
        const active =
          item.url === "/super-admin"
            ? pathname === "/super-admin"
            : pathname.startsWith(item.url);
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 transition-colors",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" />
            <span className="text-[10px] font-medium">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
