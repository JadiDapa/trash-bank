"use client";

import Link from "next/link";
import { Masyarakat } from "@/generated/prisma";
import { Eye, MapPin, Phone, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const statusLabel = {
  WAITING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};
const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  WAITING: "outline",
  APPROVED: "default",
  REJECTED: "destructive",
};
const avatarBg: Record<string, string> = {
  WAITING:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  APPROVED:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

type Props = { masyarakat: Masyarakat[] };

function MasyarakatCard({ m }: { m: Masyarakat }) {
  const initials = m.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      <div className="flex items-start gap-2.5 p-3 pb-2">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            avatarBg[m.status],
          )}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <p className="line-clamp-1 text-sm font-bold leading-snug">
              {m.name}
            </p>
            <Badge
              variant={statusVariant[m.status]}
              className="shrink-0 px-1.5 text-[9px]"
            >
              {statusLabel[m.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-0.5 text-[11px]">
            NIK: {m.nik}
          </p>
        </div>
      </div>

      <div className="border-t" />

      <div className="flex-1 space-y-1.5 p-3 text-[11px] text-muted-foreground">
        <div className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 size-3 shrink-0" />
          <span className="line-clamp-2">{m.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="size-3 shrink-0" />
          <span className="line-clamp-1">{m.phone}</span>
        </div>
        {m.rejectedReason && (
          <div className="mt-0.5 flex items-start gap-1.5 text-destructive">
            <AlertCircle className="mt-0.5 size-3 shrink-0" />
            <span className="line-clamp-2">{m.rejectedReason}</span>
          </div>
        )}
      </div>

      <div className="border-t" />

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <User className="size-3 shrink-0" />
          <span>{m.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 px-2 text-[11px]"
          asChild
        >
          <Link href={`/super-admin/masyarakat/${m.id}`}>
            Tinjau <Eye className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="text-muted-foreground py-12 text-center text-sm">{label}</p>
  );
}

export default function SuperAdminMasyarakatClient({ masyarakat }: Props) {
  const waiting = masyarakat.filter((m) => m.status === "WAITING");
  const approved = masyarakat.filter((m) => m.status === "APPROVED");
  const rejected = masyarakat.filter((m) => m.status === "REJECTED");

  return (
    <Tabs defaultValue="waiting" className="w-full flex-col">
      <TabsList className="bg-card mb-4 grid h-auto w-full grid-cols-3 rounded-xl p-1 dark:bg-zinc-800/60">
        <TabsTrigger value="waiting" className="flex-1">
          Menunggu
          {waiting.length > 0 && (
            <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-yellow-500 text-[9px] text-white">
              {waiting.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="approved" className="flex-1">
          Disetujui
        </TabsTrigger>
        <TabsTrigger value="rejected" className="flex-1">
          Ditolak
        </TabsTrigger>
      </TabsList>

      <TabsContent value="waiting" className="mt-4">
        {waiting.length === 0 ? (
          <EmptyState label="Tidak ada pendaftar menunggu" />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {waiting.map((m) => (
              <MasyarakatCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved" className="mt-4">
        {approved.length === 0 ? (
          <EmptyState label="Belum ada yang disetujui" />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {approved.map((m) => (
              <MasyarakatCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="mt-4">
        {rejected.length === 0 ? (
          <EmptyState label="Tidak ada yang ditolak" />
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {rejected.map((m) => (
              <MasyarakatCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
