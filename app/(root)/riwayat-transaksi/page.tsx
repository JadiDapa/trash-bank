import { getCurrentUser } from "@/app/action/auth.action";
import { DepositTicketService } from "@/servers/services/deposit-ticket.service";
import { VoucherTicketService } from "@/servers/services/voucher-ticket.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Recycle, Ticket, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const depositStatusLabel: Record<string, { label: string; variant: "outline" | "default" | "destructive" | "secondary" }> = {
  PENDING: { label: "Menunggu", variant: "outline" },
  COMPLETED: { label: "Selesai", variant: "default" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" },
};

const voucherStatusLabel: Record<string, { label: string; variant: "outline" | "default" | "secondary" }> = {
  PENDING: { label: "Menunggu", variant: "outline" },
  COMPLETED: { label: "Selesai", variant: "default" },
  CANCELLED: { label: "Dibatalkan", variant: "secondary" },
};

export default async function TransactionHistoryPage() {
  const user = await getCurrentUser();
  const masyarakat = user.masyarakat!;

  const [depositTickets, voucherTickets] = await Promise.all([
    DepositTicketService.getByMasyarakatId(masyarakat.id),
    VoucherTicketService.getByMasyarakatId(masyarakat.id),
  ]);

  const transactions = [
    ...depositTickets.map((t) => ({ type: "deposit" as const, date: t.createdAt, data: t })),
    ...voucherTickets.map((t) => ({ type: "voucher" as const, date: t.createdAt, data: t })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ScrollArea className="bg-background h-screen w-full space-y-4 md:rounded-2xl md:border">
      <div className="w-full space-y-2">
        <div className="bg-primary flex items-center gap-4 px-3 py-6">
          <Link href="/">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="text-center font-medium">Riwayat Transaksi</h1>
        </div>

        <div className="space-y-3 p-3">
          {transactions.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Belum ada transaksi.
            </p>
          )}

          {transactions.map((tx) =>
            tx.type === "deposit" ? (
              <div
                key={`deposit-${tx.data.id}`}
                className="bg-card flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Recycle className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Setor Sampah #{tx.data.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(tx.date), "d MMM yyyy, HH:mm", { locale: id })}
                    </p>
                    {tx.data.pointsEarned != null && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        +{tx.data.pointsEarned.toLocaleString()} poin
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={depositStatusLabel[tx.data.status].variant}>
                  {depositStatusLabel[tx.data.status].label}
                </Badge>
              </div>
            ) : (
              <div
                key={`voucher-${tx.data.id}`}
                className="bg-card flex items-center justify-between rounded-xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Ticket className="size-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Tukar Poin #{tx.data.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(tx.date), "d MMM yyyy, HH:mm", { locale: id })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      -{tx.data.pointsUsed.toLocaleString()} poin
                    </p>
                  </div>
                </div>
                <Badge variant={voucherStatusLabel[tx.data.status].variant}>
                  {voucherStatusLabel[tx.data.status].label}
                </Badge>
              </div>
            ),
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
