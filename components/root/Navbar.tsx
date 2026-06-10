import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";
import PWAInstaller from "@/components/PWAInstaller";
import { Search } from "lucide-react";

type Props = {
  name: string;
  username?: string;
};

export default function Navbar({ name, username }: Props) {
  return (
    <header className="border-border bg-card flex w-full items-center justify-between rounded-2xl border px-6 py-3 max-md:hidden">
      {/* Search */}
      <div className="bg-muted flex items-center gap-3 rounded-full px-4 py-2">
        <Search className="text-muted-foreground size-4" />
        <span className="text-muted-foreground text-sm">Cari...</span>
      </div>
      {/* Icons + User */}
      <div className="flex items-center gap-3">
        <ToggleTheme />

        {/* Profile */}
        <Link
          href={username ? `/users/${username}` : "#"}
          className="flex cursor-pointer items-center gap-2"
        >
          <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold">
            {name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-muted-foreground text-xs">Masyarakat</span>
          </div>
        </Link>
      </div>
      <PWAInstaller />
    </header>
  );
}
