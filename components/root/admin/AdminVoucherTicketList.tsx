"use client";

import Link from "next/link";
import { VoucherTicket } from "@/generated/prisma";
import { Clock, CheckCircle, XCircle, Gift } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusConfig = {
  PENDING: { icon: <Clock className="size-3.5" />, label: "Menunggu" },
  COMPLETED: { icon: <CheckCircle className="size-3.5" />, label: "Selesai" },
  CANCELLED: { icon: <XCircle className="size-3.5" />, label: "Dibatalkan" },
};

const statusStyles = {
  PENDING: "bg-muted text-muted-foreground",
  COMPLETED: "bg-secondary text-secondary-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
};

type Props = {
  tickets: (VoucherTicket & { masyarakat: any })[];
};

export default function AdminVoucherTicketList({ tickets }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Gift className="mb-3 size-8 text-zinc-300 dark:text-zinc-600" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Belum ada tiket tukar poin
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tickets.map((t) => {
        const cfg = statusConfig[t.status];

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
                <p className="text-muted-foreground text-xs">Tiket #{t.id}</p>
              </div>

              <span
                className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs ${statusStyles[t.status]}`}
              >
                {cfg.icon}
                {cfg.label}
              </span>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Poin Ditukar</p>
              <p className="text-2xl font-bold">
                {t.pointsUsed.toLocaleString()}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  poin
                </span>
              </p>
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{format(t.createdAt, "dd MMM yyyy", { locale: id })}</span>
              <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Detail →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
