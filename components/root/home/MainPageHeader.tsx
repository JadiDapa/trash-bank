"use client";

import { User } from "@/generated/prisma";
import PWAInstaller from "@/components/PWAInstaller";
import { Search, ChevronDown, UserRound } from "lucide-react";
import { ToggleTheme } from "../ToggleTheme";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function MainPageHeader({ user }: { user: User }) {
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <header className="w-full">
      {/* Top Section */}
      <div className="flex items-center justify-between">
        {/* Left */}
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

        {/* Right */}
        <div className="flex items-center gap-3">
          <ToggleTheme />

          {/* Avatar + Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white">
                {firstLetter}
              </button>
            </DialogTrigger>

            <DialogContent className="max-w-sm overflow-hidden p-0">
              {/* Header / Hero */}
              <div className="from-primary/90 to-primary bg-gradient-to-r p-6 text-white">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold backdrop-blur">
                    {firstLetter}
                  </div>

                  {/* Name + Role */}
                  <div>
                    <h2 className="text-lg leading-none font-semibold">
                      {user.name}
                    </h2>
                    <p className="text-sm opacity-80">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4 p-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-muted-foreground">Points</p>
                    <p className="font-medium">{user.points}</p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phoneNumber || "-"}</p>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <p className="text-muted-foreground">Address</p>
                    <p className="font-medium">{user.address || "-"}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="bg-muted mt-4 flex items-center gap-2 rounded-full px-4 py-3">
        <Search className="h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
        />
      </div>

      {/* Extras */}
      <div className="mt-3 flex justify-between">
        <PWAInstaller />
      </div>
    </header>
  );
}
