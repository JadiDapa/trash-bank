"use client";

import Link from "next/link";
import { Masyarakat } from "@/generated/prisma";
import { Users, Building2, BookOpen, Settings } from "lucide-react";
import { format, subMonths, isSameMonth } from "date-fns";
import { id } from "date-fns/locale";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  allMasyarakat: Masyarakat[];
  adminCount: number;
  educationCount: number;
};

function buildStatusPieData(allMasyarakat: Masyarakat[]) {
  const waiting = allMasyarakat.filter((m) => m.status === "WAITING").length;
  const approved = allMasyarakat.filter((m) => m.status === "APPROVED").length;
  const rejected = allMasyarakat.filter((m) => m.status === "REJECTED").length;
  return [
    { name: "Menunggu", value: waiting, color: "#f59e0b" },
    { name: "Disetujui", value: approved, color: "#16a34a" },
    { name: "Ditolak", value: rejected, color: "#dc2626" },
  ].filter((d) => d.value > 0);
}

function buildRegistrationChartData(allMasyarakat: Masyarakat[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    const count = allMasyarakat.filter((m) =>
      isSameMonth(new Date(m.createdAt), month),
    ).length;
    return {
      bulan: format(month, "MMM", { locale: id }),
      pendaftar: count,
    };
  });
}

export default function SuperAdminDashboard({
  allMasyarakat,
  adminCount,
  educationCount,
}: Props) {
  const waitingCount = allMasyarakat.filter(
    (m) => m.status === "WAITING",
  ).length;
  const pieData = buildStatusPieData(allMasyarakat);
  const barData = buildRegistrationChartData(allMasyarakat);

  const menus = [
    {
      href: "/super-admin/masyarakat",
      icon: Users,
      label: "Masyarakat",
      desc: "Approve & kelola warga",
      badge: waitingCount > 0 ? waitingCount : null,
    },
    {
      href: "/super-admin/admin",
      icon: Building2,
      label: "Bank Sampah",
      desc: `${adminCount} bank terdaftar`,
      badge: null,
    },
    {
      href: "/super-admin/edukasi",
      icon: BookOpen,
      label: "Edukasi",
      desc: `${educationCount} artikel`,
      badge: null,
    },
    {
      href: "/super-admin/settings",
      icon: Settings,
      label: "Pengaturan",
      desc: "Konfigurasi sistem",
      badge: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pending alert */}
      {waitingCount > 0 && (
        <div className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 rounded-xl border p-4">
          <p className="text-amber-700 dark:text-amber-400 font-semibold">
            {waitingCount} Pendaftar Menunggu Persetujuan
          </p>
          <p className="text-amber-600 dark:text-amber-500 text-sm mt-0.5">
            Segera review pendaftaran masyarakat baru
          </p>
          <Link
            href="/super-admin/masyarakat"
            className="text-amber-700 dark:text-amber-400 text-sm font-medium underline mt-2 inline-block"
          >
            Review Sekarang →
          </Link>
        </div>
      )}

      {/* Charts row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Pie chart */}
        <div className="bg-card rounded-2xl p-5">
          <p className="font-semibold text-sm mb-1">Status Masyarakat</p>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      background: "hsl(var(--card))",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="size-2 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground">
                      {d.name}:{" "}
                      <strong className="text-foreground">{d.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">
              Belum ada data masyarakat
            </p>
          )}
        </div>

        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-5 md:col-span-2">
          <p className="font-semibold text-sm mb-4">Pendaftaran per Bulan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={barData}
              margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            >
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
              <Bar
                dataKey="pendaftar"
                name="Pendaftar"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Navigasi Cepat</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {menus.map(({ href, icon: Icon, label, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className="bg-card relative flex flex-col gap-3 rounded-xl border p-4 transition hover:border-primary/30 active:scale-95"
            >
              {badge !== null && badge > 0 && (
                <span className="absolute top-3 right-3 bg-amber-500 inline-flex size-5 items-center justify-center rounded-full text-[10px] text-white font-bold">
                  {badge}
                </span>
              )}
              <div className="bg-primary/10 w-fit rounded-full p-2.5">
                <Icon className="text-primary size-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
