"use client";

import Link from "next/link";
import { DepositTicket, VoucherTicket } from "@/generated/prisma";
import { Clock, CheckCircle, XCircle, Trash2, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const depositStatusConfig = {
  PENDING: {
    icon: <Clock className="size-3.5" />,
    label: "Menunggu",
  },
  COMPLETED: {
    icon: <CheckCircle className="size-3.5" />,
    label: "Selesai",
  },
  REJECTED: {
    icon: <XCircle className="size-3.5" />,
    label: "Ditolak",
  },
  CANCELLED: {
    icon: <XCircle className="size-3.5" />,
    label: "Dibatalkan",
  },
};

const statusStyles = {
  PENDING: "bg-muted text-muted-foreground",
  COMPLETED: "bg-secondary text-secondary-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const voucherStatusConfig = {
  PENDING: {
    icon: <Clock className="size-3.5" />,
    label: "Menunggu",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  COMPLETED: {
    icon: <CheckCircle className="size-3.5" />,
    label: "Selesai",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  CANCELLED: {
    icon: <XCircle className="size-3.5" />,
    label: "Dibatalkan",
    className: "bg-zinc-100 text-zinc-500 border-zinc-200",
    dot: "bg-zinc-300",
  },
};

type Props = {
  depositTickets: (DepositTicket & { masyarakat: any })[];
  voucherTickets: (VoucherTicket & { masyarakat: any })[];
};

export default function AdminTicketListClient({
  depositTickets,
  voucherTickets,
}: Props) {
  const pendingDeposit = depositTickets.filter(
    (t) => t.status === "PENDING",
  ).length;
  const pendingVoucher = voucherTickets.filter(
    (t) => t.status === "PENDING",
  ).length;

  return (
    <Tabs defaultValue="deposit" className="w-full flex-col">
      {/* Tab bar */}
      <TabsList className="bg-card mb-4 grid h-auto w-full grid-cols-2 rounded-xl p-1 dark:bg-zinc-800/60">
        <TabsTrigger
          value="deposit"
          className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
        >
          <Trash2 className="size-4 shrink-0" />
          Setor Sampah
          {pendingDeposit > 0 && (
            <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-[10px] font-semibold">
              {pendingDeposit}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger
          value="voucher"
          className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-zinc-100"
        >
          <Gift className="size-4 shrink-0" />
          Tukar Poin
          {pendingVoucher > 0 && (
            <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-[10px] font-semibold">
              {pendingVoucher}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Deposit tickets */}
      <TabsContent value="deposit">
        {depositTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Trash2 className="mb-3 size-8 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Belum ada tiket setor sampah
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {depositTickets.map((t) => {
              const cfg = depositStatusConfig[t.status];

              return (
                <Link
                  key={t.id}
                  href={`/admin/tiket/deposit/${t.id}`}
                  className="group bg-card hover:bg-accent/30 flex flex-col gap-4 rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {t.masyarakat?.name ?? "—"}
                      </p>

                      <p className="text-muted-foreground text-xs">
                        Tiket #{t.id}
                      </p>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                        statusStyles[t.status]
                      }`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Estimasi Berat
                    </p>

                    <p className="text-2xl font-bold">
                      {t.estimatedGrammage.toLocaleString()}
                      <span className="text-muted-foreground ml-1 text-sm font-normal">
                        gram
                      </span>
                    </p>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {format(t.createdAt, "dd MMM yyyy", {
                        locale: id,
                      })}
                    </span>

                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Detail →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </TabsContent>

      {/* Voucher tickets */}
      <TabsContent value="voucher">
        {voucherTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Gift className="mb-3 size-8 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Belum ada tiket tukar poin
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {voucherTickets.map((t) => {
              const cfg = voucherStatusConfig[t.status];

              return (
                <Link
                  key={t.id}
                  href={`/admin/tiket/voucher/${t.id}`}
                  className="group bg-card hover:bg-accent/30 flex flex-col gap-4 rounded-xl border p-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {t.masyarakat?.name ?? "—"}
                      </p>

                      <p className="text-muted-foreground text-xs">
                        Tiket #{t.id}
                      </p>
                    </div>

                    <span
                      className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs ${
                        statusStyles[t.status]
                      }`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Poin Ditukar
                    </p>

                    <p className="text-2xl font-bold">
                      {t.pointsUsed.toLocaleString()}
                      <span className="text-muted-foreground ml-1 text-sm font-normal">
                        poin
                      </span>
                    </p>
                  </div>

                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {format(t.createdAt, "dd MMM yyyy", {
                        locale: id,
                      })}
                    </span>

                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Detail →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
