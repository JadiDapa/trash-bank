"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { UserType } from "@/servers/validators/user.validator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function getInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export default function UserList({ users }: { users: UserType[] }) {
  return (
    <main className="mt-2 space-y-3 py-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Pengguna</p>
        <Link
          href={"/users"}
          className="text-muted-foreground flex items-center gap-1 text-xs"
        >
          <p>Lihat</p>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* Swiper */}
      <Swiper spaceBetween={10} slidesPerView={2} className="-mx-4 px-4">
        {users.map((user) => (
          <SwiperSlide key={user.id} className="cursor-pointer">
            <UserCard user={user} />
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}

function UserCard({ user }: { user: UserType }) {
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="rounded-xl border p-2 shadow-sm">
          {/* Top */}
          <div className="flex items-center gap-1">
            {/* Avatar */}
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-xs font-semibold">
              {getInitial(user.name)}
            </div>

            {/* Name */}
            <div className="min-w-0">
              <p className="truncate text-xs leading-tight font-medium">
                {user.name}
              </p>
              <p className="text-muted-foreground truncate text-[10px]">
                @{user.username}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="">
            <p className="text-sm leading-none font-semibold">
              {user.points}
              <span className="text-muted-foreground ml-1 text-[10px] font-normal">
                poin
              </span>
            </p>
            <p className="text-muted-foreground text-[10px]">
              {user.grammage} g
            </p>
          </div>
        </Card>
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
