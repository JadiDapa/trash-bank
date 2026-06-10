"use client";

import { Home, Trash2, Ticket, BookOpen, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Beranda", url: "/", icon: Home },
  { title: "Setor", url: "/tiket-sampah", icon: Trash2 },
  { title: "Tukar", url: "/tiket-poin", icon: Ticket },
  { title: "Edukasi", url: "/edukasi-lingkungan", icon: BookOpen },
  { title: "Riwayat", url: "/riwayat-transaksi", icon: History },
];

export default function CitizenMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-card border-border fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 py-2 md:hidden">
      {menuItems.map((item) => {
        const active =
          item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
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
