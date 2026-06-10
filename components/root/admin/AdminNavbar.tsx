"use client";

import { Bell, Search, ChevronDown, LogOut, Recycle } from "lucide-react";
import { Admin } from "@/generated/prisma";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";

const NAV_LINKS = [
  { title: "Beranda", url: "/admin" },
  { title: "Semua Tiket", url: "/admin/tiket" },
  { title: "Scan QR", url: "/admin/scan" },
];

export default function AdminNavbar({ admin }: { admin: Admin }) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const initials = admin.bankName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="grid w-full grid-cols-4 items-center justify-between rounded-2xl px-2 py-3 max-md:hidden">
      {/* Logo */}
      <Link
        href="/admin"
        className="bg-card flex max-w-fit items-center gap-2 rounded-full p-1 pe-3"
      >
        <div className="bg-primary flex size-11 items-center justify-center rounded-full">
          <Recycle className="text-primary-foreground size-5" />
        </div>
        <span className="text-foreground text-xl font-black tracking-wide uppercase">
          Trash Bank
        </span>
      </Link>

      {/* Center Nav */}
      <div className="col-span-2 flex items-center justify-center">
        <nav className="bg-card flex max-w-fit items-center justify-center gap-1 rounded-full px-2 py-1.5">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.url === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.url);
            return (
              <Link
                key={link.url}
                href={link.url}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-end gap-1.5">
        <div className="bg-card flex items-center justify-end gap-2 rounded-full p-1.5">
          <button className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors">
            <Search className="size-4" />
          </button>
          <button className="text-muted-foreground hover:bg-muted hover:text-foreground relative rounded-full p-2 transition-colors">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-green-500" />
          </button>
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
          >
            <LogOut className="size-4" />
          </button>
        </div>

        <div className="bg-border mx-1 h-8 w-px" />

        {/* Profile */}
        <div className="bg-card flex items-center gap-2 rounded-full px-2 py-1">
          <div className="bg-primary text-primary-foreground flex size-[34px] items-center justify-center rounded-full text-xs font-semibold">
            {initials}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{admin.bankName}</span>
            <span className="text-muted-foreground text-xs">
              {admin.bankArea}
            </span>
          </div>
          <ChevronDown className="text-muted-foreground ml-1 size-4" />
        </div>
      </div>
    </header>
  );
}
