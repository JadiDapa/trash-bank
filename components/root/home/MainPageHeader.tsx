import Image from "next/image";
import { User } from "@/generated/prisma";
import PWAInstaller from "@/components/PWAInstaller";
import { Search, ChevronDown, UserRound } from "lucide-react";
import { ToggleTheme } from "../ToggleTheme";

export default async function MainPageHeader({ user }: { user: User }) {
  return (
    <header className="w-full">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        {/* Left: Greeting + Location */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">
            Hello, {user?.name || "User"}
          </span>

          <div className="flex items-center gap-1 font-medium">
            <UserRound className="h-4 w-4 text-gray-500" />
            <span>{user?.role || "User"}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-3">
          <ToggleTheme />

          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s"
            width={38}
            height={38}
            alt="avatar"
            className="rounded-full"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-muted mt-4 flex items-center gap-2 rounded-full px-4 py-3">
        <Search className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Optional extras */}
      <div className="mt-3 flex justify-between">
        <PWAInstaller />
      </div>
    </header>
  );
}
