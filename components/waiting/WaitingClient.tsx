"use client";

import { useState, useTransition } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Masyarakat } from "@/generated/prisma";
import {
  Clock,
  XCircle,
  CheckCircle,
  Circle,
  LogOut,
  Recycle,
  User,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import ResubmitForm from "./ResubmitForm";

type Props = { masyarakat: Masyarakat };

/* ── Timeline step ──────────────────────────────────── */
type StepState = "completed" | "active" | "rejected" | "pending";

function TimelineStep({
  title,
  desc,
  state,
  isLast,
}: {
  title: string;
  desc: string;
  state: StepState;
  isLast?: boolean;
}) {
  const cfgMap: Record<StepState, { icon: React.ElementType; iconCls: string; bg: string }> = {
    completed: { icon: CheckCircle, iconCls: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" },
    active:    { icon: Clock,        iconCls: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
    rejected:  { icon: XCircle,      iconCls: "text-red-600 dark:text-red-400",    bg: "bg-red-100 dark:bg-red-900/30" },
    pending:   { icon: Circle,       iconCls: "text-muted-foreground",             bg: "bg-muted" },
  };
  const { icon: Icon, iconCls, bg } = cfgMap[state];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", bg)}>
          <Icon className={cn("size-4", iconCls)} />
        </div>
        {!isLast && (
          <div
            className={cn(
              "my-1 w-0.5 flex-1",
              state === "completed" ? "bg-green-200 dark:bg-green-800" : "bg-border",
            )}
          />
        )}
      </div>
      <div className={cn("min-w-0", isLast ? "pb-0" : "pb-5")}>
        <p
          className={cn(
            "text-sm font-semibold",
            state === "pending" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs leading-relaxed",
            state === "rejected" ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ── Info row ───────────────────────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
        <Icon className="text-muted-foreground size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export default function WaitingClient({ masyarakat }: Props) {
  const [showResubmit, setShowResubmit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signOut } = useClerk();
  const router = useRouter();

  const isRejected = masyarakat.status === "REJECTED";

  async function handleDelete() {
    startTransition(async () => {
      try {
        const { deleteMasyarakatAccount } = await import("@/app/action/masyarakat.action");
        await deleteMasyarakatAccount();
        await signOut();
        router.push("/sign-up");
      } catch {
        toast.error("Gagal menghapus akun");
      }
    });
  }

  return (
    <div className="bg-muted min-h-screen flex flex-col">
      {/* ── Header ── */}
      <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary flex size-7 items-center justify-center rounded-lg">
              <Recycle className="text-primary-foreground size-4" />
            </div>
            <span className="font-bold">Trash Bank</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => signOut(() => router.push("/sign-in"))}
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 px-4 py-8 md:px-6">
        <div className="mx-auto w-full max-w-5xl space-y-6">

          {/* ── Hero card: status + timeline ── */}
          <div className="bg-background overflow-hidden rounded-2xl border">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">

              {/* Left — status hero */}
              <div
                className={cn(
                  "flex flex-col justify-center gap-5 p-8",
                  isRejected
                    ? "bg-linear-to-br from-red-50 to-background dark:from-red-950/20"
                    : "bg-linear-to-br from-yellow-50 to-background dark:from-yellow-950/20",
                )}
              >
                <div
                  className={cn(
                    "flex size-16 items-center justify-center rounded-2xl",
                    isRejected
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-yellow-100 dark:bg-yellow-900/30",
                  )}
                >
                  {isRejected ? (
                    <XCircle className="size-8 text-red-600 dark:text-red-400" />
                  ) : (
                    <Clock className="size-8 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>

                <div>
                  <Badge
                    variant={isRejected ? "destructive" : "outline"}
                    className="mb-2 text-xs"
                  >
                    {isRejected ? "DITOLAK" : "MENUNGGU VERIFIKASI"}
                  </Badge>
                  <h1 className="text-2xl font-bold leading-tight">
                    {isRejected ? "Pendaftaran Ditolak" : "Menunggu Verifikasi"}
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {isRejected
                      ? "Pendaftaran kamu tidak disetujui oleh admin. Kamu dapat memperbarui data dan mengajukan ulang."
                      : "Data kamu sedang ditinjau oleh admin. Proses verifikasi biasanya memakan waktu 1–2 hari kerja."}
                  </p>
                </div>

                <p className="text-muted-foreground text-sm font-medium">
                  Halo, {masyarakat.name.split(" ")[0]} 👋
                </p>
              </div>

              {/* Right — progress timeline */}
              <div className="flex flex-col justify-center border-t p-8 lg:border-t-0 lg:border-l">
                <p className="text-muted-foreground mb-6 text-xs font-semibold uppercase tracking-wider">
                  Progres Pendaftaran
                </p>
                <TimelineStep
                  title="Pendaftaran"
                  desc="Data diri dan foto KTP berhasil dikirim"
                  state="completed"
                />
                <TimelineStep
                  title="Verifikasi Admin"
                  desc={
                    isRejected
                      ? (masyarakat.rejectedReason ?? "Tidak lolos verifikasi admin")
                      : "Admin sedang meninjau data dan KTP kamu"
                  }
                  state={isRejected ? "rejected" : "active"}
                />
                <TimelineStep
                  title="Akses Penuh"
                  desc="Mulai setor sampah dan kumpulkan poin"
                  state="pending"
                  isLast
                />
              </div>
            </div>
          </div>

          {/* ── Bottom grid: info + actions ── */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* Info card */}
            <div className="bg-background space-y-5 rounded-2xl border p-6">
              <h2 className="font-semibold">Informasi Pendaftar</h2>
              <div className="space-y-4">
                <InfoRow icon={User}       label="Nama Lengkap" value={masyarakat.name} />
                <InfoRow icon={CreditCard} label="NIK"          value={masyarakat.nik} />
                <InfoRow icon={Mail}       label="Email"        value={masyarakat.email} />
                <InfoRow icon={Phone}      label="Telepon"      value={masyarakat.phone} />
                <InfoRow icon={MapPin}     label="Alamat"       value={masyarakat.address} />
              </div>
            </div>

            {/* Actions card */}
            <div className="bg-background space-y-5 rounded-2xl border p-6">
              <h2 className="font-semibold">
                {isRejected ? "Tindakan Selanjutnya" : "Apa yang Bisa Kamu Lakukan?"}
              </h2>

              {/* WAITING tips */}
              {!isRejected && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
                    <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300">
                      Pantau email <span className="font-semibold">{masyarakat.email}</span> untuk
                      notifikasi persetujuan atau penolakan dari admin.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-muted p-3">
                    <Clock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Estimasi waktu verifikasi:{" "}
                      <span className="text-foreground font-semibold">1–2 hari kerja</span>
                    </p>
                  </div>
                </div>
              )}

              {/* REJECTED actions */}
              {isRejected && (
                <div className="space-y-3">
                  {!showDeleteConfirm ? (
                    <>
                      <Button
                        className="w-full gap-2"
                        onClick={() => setShowResubmit(true)}
                      >
                        <RefreshCw className="size-4" />
                        Perbarui Data & Ajukan Ulang
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full gap-2 text-destructive hover:text-destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        <Trash2 className="size-4" />
                        Hapus Akun & Daftar Ulang
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">
                            Hapus akun secara permanen?
                          </p>
                          <p className="text-muted-foreground mt-0.5 text-xs">
                            Semua data kamu akan dihapus. Tindakan ini tidak dapat dibatalkan.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={handleDelete}
                          disabled={isPending}
                        >
                          {isPending ? <Spinner /> : "Ya, Hapus Akun"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sign out — always visible */}
              <div className="pt-1">
                <Button
                  variant="ghost"
                  className="text-muted-foreground w-full gap-2"
                  onClick={() => signOut(() => router.push("/sign-in"))}
                >
                  <LogOut className="size-4" />
                  Keluar dari Akun
                </Button>
              </div>
            </div>
          </div>

          {/* ── Resubmit form (full width, shown below) ── */}
          {showResubmit && (
            <div className="bg-background rounded-2xl border p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-semibold">Perbarui Data Pendaftaran</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setShowResubmit(false)}
                >
                  Tutup
                </Button>
              </div>
              <ResubmitForm
                masyarakat={masyarakat}
                onCancel={() => setShowResubmit(false)}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
