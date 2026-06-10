"use client";

import {
  Home,
  Trash2,
  Ticket,
  BookOpen,
  History,
  Moon,
  Sun,
  HelpCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Beranda", url: "/", icon: Home },
  { title: "Setor Sampah", url: "/tiket-sampah", icon: Trash2 },
  { title: "Tukar Poin", url: "/tiket-poin", icon: Ticket },
  { title: "Edukasi", url: "/edukasi-lingkungan", icon: BookOpen },
  { title: "Riwayat", url: "/riwayat-transaksi", icon: History },
];

type Props = {
  initials: string;
};

export default function CitizenSidebar({ initials }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? resolvedTheme === "light" : false;
  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <TooltipProvider delayDuration={150}>
      <aside className="bg-muted flex h-screen w-20 shrink-0 flex-col items-center gap-6 py-4 max-md:hidden">
        {/* Theme Toggle */}
        <div className="bg-card flex flex-col items-center gap-1 rounded-full p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme("light")}
                className={`flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
                  isLight
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
                aria-label="Light mode"
              >
                <Sun className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Light mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme("dark")}
                className={`flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
                  isDark
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
                aria-label="Dark mode"
              >
                <Moon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Dark mode</TooltipContent>
          </Tooltip>
        </div>

        {/* Divider */}
        <div className="bg-card h-px w-8" />

        {/* Menu Items */}
        <nav className="bg-card flex max-h-fit flex-col items-center gap-2 rounded-full p-1">
          {menuItems.map((item) => {
            const active =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.url}
                    className={`flex size-10 items-center justify-center rounded-full transition-all duration-200 ${
                      active
                        ? "bg-foreground text-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="size-4.5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom: Help + Sign Out */}
        <div className="bg-card mt-auto flex flex-col items-center gap-2 rounded-full p-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground hover:bg-accent/50 flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200">
                <HelpCircle className="size-4.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Help</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut({ redirectUrl: "/sign-in" })}
                className="bg-primary text-primary-foreground flex size-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
                aria-label="Log out"
              >
                {initials}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log Out</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
