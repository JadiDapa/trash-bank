"use client";

import Link from "next/link";
import { Admin, DepositTicket, VoucherTicket } from "@/generated/prisma";
import {
  QrCode,
  Trash2,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Clock3,
} from "lucide-react";
import QRScanDialog from "@/components/root/admin/QRScanDialog";
import { Badge } from "@/components/ui/badge";
import { format, subMonths, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function buildTicketsChartData(
  depositTickets: DepositTicket[],
  voucherTickets: VoucherTicket[],
) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const deposit = depositTickets.filter((t) =>
      isSameMonth(new Date(t.createdAt), month),
    ).length;
    const voucher = voucherTickets.filter((t) =>
      isSameMonth(new Date(t.createdAt), month),
    ).length;
    return {
      bulan: format(month, "MMM", { locale: id }),
      deposit,
      voucher,
    };
  });
}

const depositStatusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock className="text-amber-500 size-3.5" />,
  COMPLETED: <CheckCircle className="size-3.5 text-green-500" />,
  REJECTED: <XCircle className="text-destructive size-3.5" />,
  CANCELLED: <XCircle className="text-muted-foreground size-3.5" />,
};

const voucherStatusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock className="text-amber-500 size-3.5" />,
  COMPLETED: <CheckCircle className="size-3.5 text-green-500" />,
  CANCELLED: <XCircle className="text-muted-foreground size-3.5" />,
};

const depositStatusLabel: Record<string, string> = {
  PENDING: "Menunggu",
  COMPLETED: "Selesai",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
};

const voucherStatusLabel: Record<string, string> = {
  PENDING: "Menunggu",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

type Props = {
  admin: Admin;
  depositTickets: DepositTicket[];
  voucherTickets: VoucherTicket[];
};

export default function AdminDashboard({
  admin,
  depositTickets,
  voucherTickets,
}: Props) {
  const chartData = buildTicketsChartData(depositTickets, voucherTickets);
  const recentPendingDeposit = depositTickets
    .filter((t) => t.status === "PENDING")
    .slice(0, 3);
  const recentPendingVoucher = voucherTickets
    .filter((t) => t.status === "PENDING")
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-card rounded-2xl p-5">
        <p className="font-semibold text-sm mb-4">Tiket per Bulan</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="gradDeposit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradVoucher" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="bulan"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={30}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                background: "hsl(var(--card))",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="deposit"
              name="Setor Sampah"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#gradDeposit)"
            />
            <Area
              type="monotone"
              dataKey="voucher"
              name="Tukar Poin"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#gradVoucher)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bank info + Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-card rounded-2xl p-5 space-y-3 md:col-span-2">
          <p className="font-semibold text-sm">Informasi Bank</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              <span>{admin.bankAddress}</span>
            </div>
            {admin.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-4 shrink-0" />
                <span>{admin.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Clock3 className="size-4 shrink-0" />
              <span>{admin.operatingHours}</span>
            </div>
          </div>
          {admin.description && (
            <p className="text-muted-foreground text-xs border-t pt-2">
              {admin.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <QRScanDialog
            trigger={
              <button className="bg-primary flex flex-1 w-full flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center text-primary-foreground transition hover:opacity-90 active:scale-95 cursor-pointer">
                <QrCode className="size-6" />
                <span className="text-sm font-medium">Scan QR</span>
              </button>
            }
          />
          <div className="flex flex-1 gap-3">
            <Link
              href="/admin/tiket/deposit"
              className="bg-card flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition hover:border-primary/30 active:scale-95"
            >
              <Trash2 className="text-primary size-5" />
              <span className="text-xs font-medium">Deposit</span>
            </Link>
            <Link
              href="/admin/tiket/voucher"
              className="bg-card flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition hover:border-primary/30 active:scale-95"
            >
              <Gift className="text-primary size-5" />
              <span className="text-xs font-medium">Voucher</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent pending tickets */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Tiket Setor Pending</p>
            <Link href="/admin/tiket/deposit" className="text-primary text-xs">
              Lihat semua
            </Link>
          </div>
          {recentPendingDeposit.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Tidak ada tiket pending
            </p>
          ) : (
            recentPendingDeposit.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tiket/deposit/${t.id}`}
                className="bg-card flex items-center justify-between rounded-xl border px-4 py-3 hover:border-primary/30 transition"
              >
                <div className="flex items-center gap-2">
                  {depositStatusIcon[t.status]}
                  <div>
                    <p className="text-sm font-medium">Tiket #{t.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(t.createdAt), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {t.estimatedGrammage} g
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    {depositStatusLabel[t.status]}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Tiket Tukar Poin Pending</p>
            <Link href="/admin/tiket/voucher" className="text-primary text-xs">
              Lihat semua
            </Link>
          </div>
          {recentPendingVoucher.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Tidak ada tiket pending
            </p>
          ) : (
            recentPendingVoucher.map((t) => (
              <Link
                key={t.id}
                href={`/admin/tiket/voucher/${t.id}`}
                className="bg-card flex items-center justify-between rounded-xl border px-4 py-3 hover:border-primary/30 transition"
              >
                <div className="flex items-center gap-2">
                  {voucherStatusIcon[t.status]}
                  <div>
                    <p className="text-sm font-medium">Tiket #{t.id}</p>
                    <p className="text-muted-foreground text-xs">
                      {format(new Date(t.createdAt), "dd MMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {t.pointsUsed.toLocaleString("id-ID")} poin
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    {voucherStatusLabel[t.status]}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
