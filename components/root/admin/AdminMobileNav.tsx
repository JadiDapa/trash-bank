"use client";

import { LayoutDashboard, Trash2, Gift } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Beranda", url: "/admin", icon: LayoutDashboard },
  { title: "Deposit", url: "/admin/tiket/deposit", icon: Trash2 },
  { title: "Voucher", url: "/admin/tiket/voucher", icon: Gift },
];

export default function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-4 py-2 md:hidden">
      {menuItems.map((item) => {
        const active =
          item.url === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.url);
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 transition-colors",
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
