"use client";

import { UserType } from "@/servers/validators/user.validator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function UserCard({ user }: { user: UserType }) {
  const initial = user.name?.charAt(0).toUpperCase() || "?";
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full cursor-pointer">
        <div className="bg-card hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3 transition active:scale-[0.99]">
          {/* AVATAR */}
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-sm font-semibold">
            {initial}
          </div>

          {/* CONTENT */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Name */}
            <p className="truncate text-sm font-semibold">{user.name}</p>

            {/* Username */}
            <p className="text-muted-foreground truncate text-xs">
              @{user.username} - {user.role}
            </p>

            {/* Stats */}
            <p className="text-muted-foreground mt-1 text-[11px] font-semibold">
              {user.points} poin • {user.grammage} g
            </p>
          </div>
        </div>
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

            <div className="space-y-1">
              <p className="text-muted-foreground">Grammage</p>
              <p className="font-medium">{user.grammage} g</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
