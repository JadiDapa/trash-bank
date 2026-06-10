"use client";

import Link from "next/link";
import {
  Masyarakat,
  DepositTicket,
  VoucherTicket,
  Education,
} from "@/generated/prisma";
import {
  Trash2,
  Ticket,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
} from "lucide-react";
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
} from "recharts";

type Props = {
  masyarakat: Masyarakat;
  depositTickets: DepositTicket[];
  voucherTickets: VoucherTicket[];
  educations: Education[];
  pointsToVoucherRate: number;
};

function buildPointsChartData(depositTickets: DepositTicket[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const poin = depositTickets
      .filter(
        (t) =>
          t.status === "COMPLETED" &&
          isSameMonth(new Date(t.createdAt), month),
      )
      .reduce((sum, t) => sum + (t.pointsEarned ?? 0), 0);
    return {
      bulan: format(month, "MMM", { locale: id }),
      poin: Math.round(poin),
    };
  });
}

const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <Clock className="text-amber-500 size-3.5" />,
  COMPLETED: <CheckCircle className="size-3.5 text-green-500" />,
  REJECTED: <XCircle className="text-destructive size-3.5" />,
  CANCELLED: <XCircle className="text-muted-foreground size-3.5" />,
};

const statusLabel: Record<string, string> = {
  PENDING: "Menunggu",
  COMPLETED: "Selesai",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
};

export default function CitizenDashboard({
  masyarakat,
  depositTickets,
  voucherTickets,
  educations,
  pointsToVoucherRate,
}: Props) {
  const completedDeposits = depositTickets.filter(
    (t) => t.status === "COMPLETED",
  ).length;
  const chartData = buildPointsChartData(depositTickets);
  const pointsProgress = masyarakat.points % pointsToVoucherRate;
  const progressPercent = Math.min(
    (pointsProgress / pointsToVoucherRate) * 100,
    100,
  );
  const vouchersEarnable = Math.floor(masyarakat.points / pointsToVoucherRate);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-card rounded-2xl">
      <div className="p-6 space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">Beranda</h1>
          <p className="text-muted-foreground text-sm">
            Selamat datang, {masyarakat.name}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Poin",
              value: masyarakat.points.toLocaleString("id-ID"),
              icon: <TrendingUp className="size-4 text-primary" />,
            },
            {
              label: "Total Gramasi",
              value: `${masyarakat.totalGrammage.toLocaleString("id-ID")} g`,
              icon: <Trash2 className="size-4 text-primary" />,
            },
            {
              label: "Setor Selesai",
              value: completedDeposits,
              icon: <CheckCircle className="size-4 text-primary" />,
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-muted rounded-xl p-4 flex flex-col gap-2">
              <div className="bg-primary/10 w-fit rounded-full p-2">{icon}</div>
              <div>
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="text-lg font-bold leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Voucher progress */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-xl p-4 md:col-span-2">
            <p className="font-semibold text-sm mb-4">Poin per Bulan</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="gradPoin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
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
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    background: "hsl(var(--card))",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="poin"
                  name="Poin"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#gradPoin)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Voucher progress card */}
          <div className="bg-primary rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1.5">
                <Award className="size-4 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground text-sm font-medium">
                Progress Voucher
              </span>
            </div>
            <div>
              <p className="text-primary-foreground/70 text-xs">
                Poin menuju voucher berikutnya
              </p>
              <p className="text-primary-foreground text-2xl font-bold mt-0.5">
                {pointsProgress.toLocaleString("id-ID")}
              </p>
              <p className="text-primary-foreground/60 text-xs">
                / {pointsToVoucherRate.toLocaleString("id-ID")} poin
              </p>
            </div>
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-primary-foreground/70 text-xs">
                {progressPercent.toFixed(0)}% tercapai
              </p>
            </div>
            {vouchersEarnable > 0 && (
              <div className="bg-white/20 rounded-lg px-3 py-2">
                <p className="text-primary-foreground text-xs font-medium">
                  {vouchersEarnable} voucher siap ditukar!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Menu */}
        <div>
          <p className="text-sm font-semibold mb-3">Menu Cepat</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: "/tiket-sampah", icon: Trash2, label: "Setor Sampah" },
              { href: "/tiket-poin", icon: Ticket, label: "Tukar Poin" },
              { href: "/edukasi-lingkungan", icon: BookOpen, label: "Edukasi" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="bg-muted flex flex-col items-center gap-2 rounded-xl p-4 transition hover:bg-primary/10 active:scale-95"
              >
                <div className="bg-primary/10 rounded-full p-2.5">
                  <Icon className="text-primary size-5" />
                </div>
                <p className="text-center text-xs font-medium">{label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Tiket Setor Terbaru</p>
              <Link href="/tiket-sampah" className="text-primary text-xs">
                Lihat semua
              </Link>
            </div>
            {depositTickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada tiket</p>
            ) : (
              depositTickets.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-muted flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {statusIcon[t.status]}
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
                      {statusLabel[t.status]}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Tiket Tukar Poin Terbaru</p>
              <Link href="/tiket-poin" className="text-primary text-xs">
                Lihat semua
              </Link>
            </div>
            {voucherTickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada tiket</p>
            ) : (
              voucherTickets.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-muted flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {statusIcon[t.status]}
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
                    {t.voucherSerial && (
                      <p className="text-muted-foreground text-[10px]">
                        {t.voucherSerial}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>

        {/* Education */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Edukasi Lingkungan</p>
            <Link href="/edukasi-lingkungan" className="text-primary text-xs">
              Lihat semua
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {educations.slice(0, 4).map((e) => (
              <Link
                key={e.id}
                href={`/edukasi-lingkungan/${e.id}`}
                className="bg-muted block rounded-xl px-4 py-3 transition hover:bg-primary/5 active:scale-[0.99]"
              >
                <p className="text-sm font-medium line-clamp-1">{e.title}</p>
                <p className="text-muted-foreground mt-0.5 text-xs line-clamp-2">
                  {e.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
