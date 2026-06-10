"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { DepositTicket, Masyarakat } from "@/generated/prisma";
import { ChevronLeft, User, CheckCircle, XCircle, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  REJECTED: {
    label: "Ditolak",
    band: "bg-red-50 dark:bg-red-950/20",
    pill: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-400",
  },
  CANCELLED: {
    label: "Dibatalkan",
    band: "bg-zinc-50 dark:bg-zinc-900/20",
    pill: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800/30 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

type Props = {
  ticket: DepositTicket & { masyarakat: Masyarakat };
  grammageToPointRate: number;
};

export default function DepositTicketDetailClient({
  ticket,
  grammageToPointRate,
}: Props) {
  const [actualGrammage, setActualGrammage] = useState<string>(
    String(ticket.estimatedGrammage),
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const cfg = statusConfig[ticket.status];

  const previewPoints =
    actualGrammage && Number(actualGrammage) > 0
      ? Math.floor(Number(actualGrammage) / grammageToPointRate)
      : 0;

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!actualGrammage || Number(actualGrammage) <= 0) {
      toast.error("Masukkan gramasi aktual yang valid");
      return;
    }
    startTransition(async () => {
      try {
        const { validateDepositTicket } =
          await import("@/app/action/deposit-ticket.action");
        await validateDepositTicket({
          ticketId: ticket.id,
          action: "APPROVE",
          actualGrammage: Number(actualGrammage),
        });
        toast.success("Tiket berhasil disetujui!");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  async function handleReject() {
    startTransition(async () => {
      try {
        const { validateDepositTicket } =
          await import("@/app/action/deposit-ticket.action");
        await validateDepositTicket({ ticketId: ticket.id, action: "REJECT" });
        toast.success("Tiket ditolak");
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <main className="min-h-screen w-full pb-10">
      {/* Sticky top bar */}
      <div className="bg-background/80 sticky top-0 z-10 flex items-center justify-between rounded-md border-b px-4 py-3 backdrop-blur-sm">
        <Link href="/admin/tiket/deposit">
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
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.2em] uppercase">
              Tiket Setor Sampah
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h1 className="text-5xl font-black tracking-tight">
                #{String(ticket.id).padStart(4, "0")}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.pill}`}
              >
                <span className={`size-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              {format(ticket.createdAt, "EEEE, dd MMMM yyyy · HH:mm", {
                locale: id,
              })}
            </p>
          </div>

          {/* Perforation */}
          <div className="border-t border-dashed" />

          {/* Citizen info */}
          <div className="px-6 py-5">
            <p className="text-muted-foreground mb-3 text-[10px] font-bold tracking-[0.2em] uppercase">
              Identitas Warga
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full">
                <User className="text-primary size-6" />
              </div>
              <div>
                <p className="font-semibold">{ticket.masyarakat.name}</p>
                <p className="text-muted-foreground text-sm">
                  {ticket.masyarakat.phone}
                </p>
              </div>
            </div>
            <div className="bg-muted mt-3 rounded-xl px-4 py-2.5">
              <p className="text-muted-foreground text-[10px]">NIK</p>
              <p className="font-mono text-sm font-semibold tracking-wide">
                {ticket.masyarakat.nik}
              </p>
            </div>
          </div>

          {/* Perforation */}
          <div className="border-t border-dashed" />

          {/* Ticket details */}
          <div className="px-6 py-5">
            <p className="text-muted-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
              Detail Sampah
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Estimasi Berat</p>
                <p className="mt-0.5 text-2xl font-bold">
                  {ticket.estimatedGrammage.toLocaleString()}
                  <span className="text-muted-foreground ml-1 text-sm font-normal">
                    gram
                  </span>
                </p>
              </div>
              {ticket.actualGrammage != null && (
                <div>
                  <p className="text-muted-foreground text-xs">Berat Aktual</p>
                  <p className="mt-0.5 text-2xl font-bold text-green-600">
                    {ticket.actualGrammage.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-sm font-normal">
                      gram
                    </span>
                  </p>
                </div>
              )}
              {ticket.pointsEarned != null && (
                <div>
                  <p className="text-muted-foreground text-xs">
                    Poin Diperoleh
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-yellow-600">
                    {ticket.pointsEarned.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-sm font-normal">
                      poin
                    </span>
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs">Konversi</p>
                <p className="mt-0.5 text-sm font-medium">
                  {grammageToPointRate}g = 1 poin
                </p>
              </div>
            </div>
          </div>

          {/* Validation section — PENDING only */}
          {ticket.status === "PENDING" && (
            <>
              <div className="border-t" />
              <div className="bg-muted/30 px-6 py-5">
                <p className="text-muted-foreground mb-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                  Validasi Tiket
                </p>
                <form onSubmit={handleApprove} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Gramasi Aktual (gram)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={actualGrammage}
                      onChange={(e) => setActualGrammage(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  {actualGrammage && Number(actualGrammage) > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 dark:bg-green-950/20">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Coins className="size-4 text-yellow-500" />
                        Poin yang diberikan
                      </div>
                      <span className="text-xl font-black text-green-600">
                        {previewPoints}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="h-12 flex-1 gap-2"
                    >
                      {isPending ? (
                        <Spinner />
                      ) : (
                        <>
                          <CheckCircle className="size-4" />
                          Setujui
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isPending}
                      className="h-12 flex-1 gap-2"
                      onClick={handleReject}
                    >
                      {isPending ? (
                        <Spinner />
                      ) : (
                        <>
                          <XCircle className="size-4" />
                          Tolak
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
