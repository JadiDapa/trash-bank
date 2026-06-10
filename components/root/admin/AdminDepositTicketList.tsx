"use client";

import Link from "next/link";
import { DepositTicket } from "@/generated/prisma";
import { Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const statusConfig = {
  PENDING: { icon: <Clock className="size-3.5" />, label: "Menunggu" },
  COMPLETED: { icon: <CheckCircle className="size-3.5" />, label: "Selesai" },
  REJECTED: { icon: <XCircle className="size-3.5" />, label: "Ditolak" },
  CANCELLED: { icon: <XCircle className="size-3.5" />, label: "Dibatalkan" },
};

const statusStyles = {
  PENDING: "bg-muted text-muted-foreground",
  COMPLETED: "bg-secondary text-secondary-foreground",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

type Props = {
  tickets: (DepositTicket & { masyarakat: any })[];
};

export default function AdminDepositTicketList({ tickets }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trash2 className="mb-3 size-8 text-zinc-300 dark:text-zinc-600" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Belum ada tiket setor sampah
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
            href={`/admin/tiket/deposit/${t.id}`}
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
              <p className="text-muted-foreground text-xs">Estimasi Berat</p>
              <p className="text-2xl font-bold">
                {t.estimatedGrammage.toLocaleString()}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  gram
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
