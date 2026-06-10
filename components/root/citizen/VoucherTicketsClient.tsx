"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Masyarakat, VoucherTicket, Admin } from "@/generated/prisma";
import {
  ChevronLeft, Plus, Clock, CheckCircle, XCircle, QrCode,
  Ticket, Building2, Coins, CalendarDays, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  tickets: VoucherTicket[];
  admins: (Admin & { user: any })[];
  pointsToVoucherRate: number;
};

function VoucherTicketCard({
  t,
  admins,
  onQR,
  onCancel,
  isPending,
}: {
  t: VoucherTicket;
  admins: (Admin & { user: any })[];
  onQR: (t: VoucherTicket) => void;
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
            Tukar Poin
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
            <Coins className="size-3" />
            {t.pointsUsed.toLocaleString()} poin
          </span>
        </div>
      </div>

      {/* Voucher serial section */}
      {t.voucherSerial && (
        <>
          <div className="border-t" />
          <div className="px-4 py-3">
            <div className="bg-muted flex items-center gap-2.5 rounded-lg px-3 py-2.5">
              <Ticket className="text-primary size-4 shrink-0" />
              <div>
                <p className="text-muted-foreground text-[10px]">Nomor Voucher</p>
                <p className="font-mono text-sm font-semibold">{t.voucherSerial}</p>
              </div>
            </div>
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

export default function VoucherTicketsClient({
  masyarakat,
  tickets,
  admins,
  pointsToVoucherRate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [adminId, setAdminId] = useState("");
  const [qrTicket, setQrTicket] = useState<VoucherTicket | null>(null);
  const router = useRouter();

  const canCreate = masyarakat.points >= pointsToVoucherRate;
  const pendingCount = tickets.filter((t) => t.status === "PENDING").length;
  const completedCount = tickets.filter((t) => t.status === "COMPLETED").length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!adminId) { toast.error("Pilih bank sampah terlebih dahulu"); return; }
    if (!canCreate) {
      toast.error(`Poin tidak cukup. Butuh minimal ${pointsToVoucherRate.toLocaleString()} poin`);
      return;
    }
    startTransition(async () => {
      try {
        const { createVoucherTicket } = await import("@/app/action/voucher-ticket.action");
        await createVoucherTicket({ adminId: Number(adminId) });
        toast.success("Tiket tukar poin berhasil dibuat!");
        setOpen(false);
        setAdminId("");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  async function handleCancel(ticketId: number) {
    startTransition(async () => {
      try {
        const { cancelVoucherTicket } = await import("@/app/action/voucher-ticket.action");
        await cancelVoucherTicket(ticketId);
        toast.success("Tiket dibatalkan");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

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
              <h1 className="text-lg font-bold">Tiket Tukar Poin</h1>
              <p className="text-muted-foreground text-xs">
                {tickets.length} tiket tercatat
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setOpen(true)} disabled={!canCreate}>
            <Plus className="size-4" /> Tukar Poin
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted rounded-xl p-3">
            <p className="text-muted-foreground text-xs">Poin Saya</p>
            <p className="mt-0.5 font-bold text-sm">
              {masyarakat.points.toLocaleString()}
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

        {/* Insufficient points warning */}
        {!canCreate && (
          <div className="flex items-start gap-2.5 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm dark:border-yellow-900/50 dark:bg-yellow-900/20">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div className="text-yellow-800 dark:text-yellow-300">
              <p className="font-medium">Poin belum mencukupi</p>
              <p className="text-xs opacity-80">
                Butuh {pointsToVoucherRate.toLocaleString()} poin untuk 1 voucher. Kamu punya{" "}
                {masyarakat.points.toLocaleString()} poin.
              </p>
            </div>
          </div>
        )}

        {/* Ticket List */}
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <div className="bg-muted flex size-14 items-center justify-center rounded-2xl">
              <Ticket className="text-muted-foreground size-7" />
            </div>
            <p className="text-muted-foreground text-sm">Belum ada tiket tukar poin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <VoucherTicketCard
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
              Tunjukkan ke petugas bank sampah untuk menukar poin
            </p>
            <QRCodeDisplay value={`/admin/tiket/voucher/${qrTicket.id}`} />
            <p className="text-muted-foreground text-xs">
              {qrTicket.pointsUsed.toLocaleString()} poin
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
              <DrawerTitle>Tukar Poin dengan Voucher</DrawerTitle>
            </DrawerHeader>

            {/* Points summary */}
            <div className="mb-4 space-y-1 rounded-lg bg-muted px-4 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Poin kamu</span>
                <span className="font-bold">{masyarakat.points.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya tukar</span>
                <span className="font-bold">{pointsToVoucherRate.toLocaleString()} poin</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sisa setelah tukar</span>
                <span className="font-bold">
                  {(masyarakat.points - pointsToVoucherRate).toLocaleString()}
                </span>
              </div>
            </div>

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
              <Button
                type="submit"
                disabled={isPending || !adminId || !canCreate}
                className="h-11 w-full"
              >
                {isPending ? <Spinner /> : "Buat Tiket Tukar Poin"}
              </Button>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
