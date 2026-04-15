import Image from "next/image";
import { User } from "@/generated/prisma";
import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";
import PWAInstaller from "@/components/PWAInstaller"; // ← add this
import { Search } from "lucide-react";

export default async function Navbar({ user }: { user: User }) {
  return (
    <header className="border-border bg-card hidden w-full items-center justify-between rounded-2xl border px-6 py-3 md:flex">
      {/* Search */}
      <div className="bg-card sitems-center flex gap-3 rounded-full border px-4 py-2">
        <Search />
      </div>
      {/* Icons + User */}
      <div className="flex items-center gap-3">
        <ToggleTheme />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
            width={38}
            height={38}
            alt="avatar"
            className="rounded-full border"
          />

          <Link
            href={`/users/${user.username}`}
            className="flex min-w-24 cursor-pointer flex-col leading-tight"
          >
            <span className="font-medium">{user?.name || "User"}</span>
            <span className="text-sm text-gray-500">{user?.role}</span>
          </Link>
        </div>
      </div>
      <PWAInstaller /> {/* ← add this */}
    </header>
  );
}
