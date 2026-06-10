"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Masyarakat, DepositTicket, Admin } from "@/generated/prisma";
import {
  ChevronLeft, Plus, Clock, CheckCircle, XCircle, QrCode,
  Scale, Coins, Building2, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import QRCodeDisplay from "@/components/shared/QRCodeDisplay";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusConfig = {
  PENDING: {
    label: "Menunggu",
    variant: "outline" as const,
    icon: Clock,
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  COMPLETED: {
    label: "Selesai",
    variant: "default" as const,
    icon: CheckCircle,
    bg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  REJECTED: {
    label: "Ditolak",
    variant: "destructive" as const,
    icon: XCircle,
    bg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  CANCELLED: {
    label: "Dibatalkan",
    variant: "secondary" as const,
    icon: XCircle,
    bg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

type Props = {
  masyarakat: Masyarakat;
  tickets: DepositTicket[];
  admins: (Admin & { user: any })[];
};

function DepositTicketCard({
  t,
  admins,
  onQR,
  onCancel,
  isPending,
}: {
  t: DepositTicket;
  admins: (Admin & { user: any })[];
  onQR: (t: DepositTicket) => void;
  onCancel: (id: number) => void;
  isPending: boolean;
}) {
  const cfg = statusConfig[t.status];
  const StatusIcon = cfg.icon;
  const bankName = admins.find((a) => a.id === t.adminId)?.bankName ?? "Bank Sampah";

  return (
    <div className="bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      {/* Header row */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              cfg.bg,
            )}
          >
            <StatusIcon className={cn("size-4", cfg.iconColor)} />
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            Setor Sampah
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <CalendarDays className="size-3" />
          <span>{format(new Date(t.createdAt), "d MMM yyyy", { locale: id })}</span>
        </div>
      </div>

      {/* Main title + chips */}
      <div className="px-4 pb-3">
        <p className="text-base font-bold">Tiket #{t.id}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium">
            <Building2 className="size-3" />
            {bankName}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium">
            <Scale className="size-3" />
            {t.estimatedGrammage} g est.
          </span>
        </div>
      </div>

      {/* Info section — only shown when there's actual data */}
      {(t.actualGrammage != null || t.pointsEarned != null) && (
        <>
          <div className="border-t" />
          <div className="space-y-1.5 px-4 py-3 text-xs text-muted-foreground">
            {t.actualGrammage != null && (
              <div className="flex items-center gap-1.5">
                <Scale className="size-3.5 shrink-0" />
                <span>
                  Aktual:{" "}
                  <span className="text-foreground font-semibold">
                    {t.actualGrammage} g
                  </span>
                </span>
              </div>
            )}
            {t.pointsEarned != null && (
              <div className="flex items-center gap-1.5">
                <Coins className="size-3.5 shrink-0 text-yellow-500" />
                <span>
                  Poin diperoleh:{" "}
                  <span className="text-foreground font-semibold">
                    +{t.pointsEarned.toLocaleString()}
                  </span>
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="border-t" />

      {/* Footer: status badge + actions */}
      <div className="flex items-center justify-between p-4">
        <Badge variant={cfg.variant} className="text-xs">
          {cfg.label}
        </Badge>
        {t.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => onQR(t)}
            >
              <QrCode className="size-3.5" /> QR
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(t.id)}
              disabled={isPending}
            >
              Batalkan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DepositTicketsClient({ masyarakat, tickets, admins }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [adminId, setAdminId] = useState("");
  const [grammage, setGrammage] = useState("");
  const [qrTicket, setQrTicket] = useState<DepositTicket | null>(null);
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId || !grammage) { toast.error("Lengkapi semua field"); return; }
    startTransition(async () => {
      try {
        const { createDepositTicket } = await import("@/app/action/deposit-ticket.action");
        await createDepositTicket({ adminId: Number(adminId), estimatedGrammage: Number(grammage) });
        toast.success("Tiket berhasil dibuat!");
        setOpen(false);
        setAdminId(""); setGrammage("");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  async function handleCancel(ticketId: number) {
    startTransition(async () => {
      try {
        const { cancelDepositTicket } = await import("@/app/action/deposit-ticket.action");
        await cancelDepositTicket(ticketId);
        toast.success("Tiket dibatalkan");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  const pendingCount = tickets.filter((t) => t.status === "PENDING").length;
  const completedCount = tickets.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="bg-background w-full md:rounded-2xl md:border">
      <div className="space-y-5 p-4 pb-10 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="-ml-2" asChild>
              <Link href="/">
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Tiket Setor Sampah</h1>
              <p className="text-muted-foreground text-xs">
                {tickets.length} tiket tercatat
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Buat Tiket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-muted-foreground text-xs">Total Gramasi</p>
            <p className="mt-0.5 font-bold text-sm">
              {masyarakat.totalGrammage.toLocaleString()} g
            </p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-muted-foreground text-xs">Menunggu</p>
            <p className="mt-0.5 font-bold text-sm">{pendingCount}</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-muted-foreground text-xs">Selesai</p>
            <p className="mt-0.5 font-bold text-sm">{completedCount}</p>
          </div>
        </div>

        {/* Ticket List */}
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="bg-muted flex size-14 items-center justify-center rounded-2xl">
              <Scale className="text-muted-foreground size-7" />
            </div>
            <p className="text-muted-foreground text-sm">Belum ada tiket setor sampah</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <DepositTicketCard
                key={t.id}
                t={t}
                admins={admins}
                onQR={setQrTicket}
                onCancel={handleCancel}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="bg-background w-full max-w-xs space-y-4 rounded-2xl p-6 text-center">
            <h2 className="font-bold">QR Code Tiket #{qrTicket.id}</h2>
            <p className="text-muted-foreground text-sm">
              Tunjukkan ke petugas bank sampah
            </p>
            <QRCodeDisplay value={`/admin/tiket/deposit/${qrTicket.id}`} />
            <p className="text-muted-foreground text-xs">
              Estimasi: {qrTicket.estimatedGrammage} g
            </p>
            <Button variant="outline" className="w-full" onClick={() => setQrTicket(null)}>
              Tutup
            </Button>
          </div>
        </div>
      )}

      {/* Create Ticket Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm p-4">
            <DrawerHeader>
              <DrawerTitle>Buat Tiket Setor Sampah</DrawerTitle>
            </DrawerHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Pilih Bank Sampah</Label>
                <Select value={adminId} onValueChange={setAdminId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bank sampah..." />
                  </SelectTrigger>
                  <SelectContent>
                    {admins.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.bankName} — {a.bankArea}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Perkiraan Gramasi (gram)</Label>
                <Input
                  type="number"
                  min={1}
                  value={grammage}
                  onChange={(e) => setGrammage(e.target.value)}
                  placeholder="cth: 500"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending || !adminId || !grammage}
                className="h-11 w-full"
              >
                {isPending ? <Spinner /> : "Buat Tiket"}
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
