"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { VoucherTicket, Masyarakat } from "@/generated/prisma";
import { ChevronLeft, User, Gift, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import QRScanDialog from "@/components/root/admin/QRScanDialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusConfig = {
  PENDING: {
    label: "Menunggu",
    band: "bg-amber-50 dark:bg-amber-950/20",
    pill: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-400",
  },
  COMPLETED: {
    label: "Selesai",
    band: "bg-green-50 dark:bg-green-950/20",
    pill: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-400",
  },
  CANCELLED: {
    label: "Dibatalkan",
    band: "bg-zinc-50 dark:bg-zinc-900/20",
    pill: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/30 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

type Props = {
  ticket: VoucherTicket & { masyarakat: Masyarakat };
};

export default function VoucherTicketDetailClient({ ticket }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const cfg = statusConfig[ticket.status];

  async function handleApprove() {
    startTransition(async () => {
      try {
        const { validateVoucherTicket } = await import("@/app/action/voucher-ticket.action");
        await validateVoucherTicket({ ticketId: ticket.id, action: "APPROVE" });
        toast.success("Voucher berhasil diterbitkan!");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  async function handleReject() {
    startTransition(async () => {
      try {
        const { validateVoucherTicket } = await import("@/app/action/voucher-ticket.action");
        await validateVoucherTicket({ ticketId: ticket.id, action: "REJECT" });
        toast.success("Tiket dibatalkan");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <main className="min-h-screen w-full pb-10">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-sm">
        <Link href="/admin/tiket/voucher">
          <Button variant="ghost" size="sm" className="gap-1 px-2">
            <ChevronLeft className="size-4" />
            Kembali
          </Button>
        </Link>
        <QRScanDialog />
      </div>

      {/* Ticket card */}
      <div className="mx-auto max-w-lg px-4 pt-6">
        <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">

          {/* Hero / status band */}
          <div className={`px-6 py-6 ${cfg.band}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Tiket Tukar Poin
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h1 className="text-5xl font-black tracking-tight">
                #{String(ticket.id).padStart(4, "0")}
              </h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.pill}`}>
                <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {format(ticket.createdAt, "EEEE, dd MMMM yyyy · HH:mm", { locale: id })}
            </p>
          </div>

          {/* Perforation */}
          <div className="border-t border-dashed" />

          {/* Citizen info */}
          <div className="px-6 py-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Identitas Warga
            </p>
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{ticket.masyarakat.name}</p>
                <p className="text-sm text-muted-foreground">{ticket.masyarakat.phone}</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-muted px-4 py-2.5">
              <p className="text-[10px] text-muted-foreground">NIK</p>
              <p className="font-mono text-sm font-semibold tracking-wide">
                {ticket.masyarakat.nik}
              </p>
            </div>
          </div>

          {/* Perforation */}
          <div className="border-t border-dashed" />

          {/* Ticket details */}
          <div className="px-6 py-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Detail Penukaran
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Poin Ditukar</p>
                <p className="mt-0.5 text-2xl font-bold">
                  {ticket.pointsUsed.toLocaleString()}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">poin</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tanggal Pengajuan</p>
                <p className="mt-0.5 text-sm font-medium">
                  {format(ticket.createdAt, "dd MMM yyyy", { locale: id })}
                </p>
              </div>
            </div>
            {ticket.voucherSerial && (
              <div className="mt-4 rounded-xl border bg-muted/50 px-4 py-3">
                <div className="mb-1 flex items-center gap-2">
                  <Gift className="size-4 text-primary" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Nomor Voucher
                  </p>
                </div>
                <p className="font-mono text-base font-bold tracking-widest">
                  {ticket.voucherSerial}
                </p>
              </div>
            )}
          </div>

          {/* Action section — PENDING only */}
          {ticket.status === "PENDING" && (
            <>
              <div className="border-t" />
              <div className="bg-muted/30 px-6 py-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Tindakan
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Setujui untuk menerbitkan voucher dan memotong{" "}
                  <span className="font-semibold text-foreground">
                    {ticket.pointsUsed.toLocaleString()} poin
                  </span>{" "}
                  dari warga.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleApprove} disabled={isPending} className="h-12 flex-1 gap-2">
                    {isPending ? <Spinner /> : <><CheckCircle className="size-4" />Setujui &amp; Terbitkan</>}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isPending}
                    className="h-12 flex-1 gap-2"
                  >
                    {isPending ? <Spinner /> : <><XCircle className="size-4" />Batalkan</>}
                  </Button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
