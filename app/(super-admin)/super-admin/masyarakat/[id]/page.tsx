import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  AlertCircle,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { requireSuperAdmin } from "@/app/action/auth.action";
import { MasyarakatService } from "@/servers/services/masyarakat.service";
import { Badge } from "@/components/ui/badge";
import DynamicBreadcrumb from "@/components/root/DynamicBreadcrumb";
import MasyarakatDetailClient from "@/components/root/super-admin/MasyarakatDetailClient";
import { cn } from "@/lib/utils";

const statusConfig = {
  WAITING: {
    label: "Menunggu",
    variant: "outline" as const,
    icon: Clock,
    avatarBg:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    heroBg: "from-yellow-500/10 to-transparent",
    iconColor: "text-yellow-500",
  },
  APPROVED: {
    label: "Disetujui",
    variant: "default" as const,
    icon: CheckCircle,
    avatarBg:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    heroBg: "from-green-500/10 to-transparent",
    iconColor: "text-green-500",
  },
  REJECTED: {
    label: "Ditolak",
    variant: "destructive" as const,
    icon: XCircle,
    avatarBg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    heroBg: "from-red-500/10 to-transparent",
    iconColor: "text-destructive",
  },
};

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
      <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
        <Icon className="text-muted-foreground size-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground mt-0.5 text-sm font-medium wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="bg-muted/50 flex-1 rounded-xl p-4 text-center">
      <p className="text-primary text-2xl font-bold tabular-nums">{value}</p>
      {unit && (
        <p className="text-muted-foreground text-xs font-medium">{unit}</p>
      )}
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

export default async function MasyarakatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperAdmin();
  const { id } = await params;
  const m = await MasyarakatService.getById(Number(id));
  if (!m) notFound();

  const cfg = statusConfig[m.status];
  const StatusIcon = cfg.icon;
  const initials = m.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen w-full space-y-6">
      {/* Nav */}
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <Link
          href="/super-admin/masyarakat"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke daftar masyarakat
        </Link>
      </div>

      {/* ── Profile Hero ─────────────────────────────────────────── */}
      <div
        className={cn(
          "bg-card relative overflow-hidden rounded-2xl border bg-linear-to-br p-6",
          cfg.heroBg,
        )}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div
            className={cn(
              "flex size-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold",
              cfg.avatarBg,
            )}
          >
            {initials}
          </div>

          {/* Identity */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">
                {m.name}
              </h1>
              <Badge
                variant={cfg.variant}
                className="flex items-center gap-1 px-2.5 py-1"
              >
                <StatusIcon className="size-3" />
                {cfg.label}
              </Badge>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <CreditCard className="size-3.5" />
                NIK: {m.nik}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Mendaftar{" "}
                {format(new Date(m.createdAt), "d MMMM yyyy", {
                  locale: idLocale,
                })}
              </span>
            </div>
          </div>

          {/* Stats — APPROVED only */}
          {m.status === "APPROVED" && (
            <div className="flex gap-3 sm:shrink-0">
              <StatCard
                label="Total Poin"
                value={m.points.toLocaleString("id-ID")}
                unit="poin"
              />
              <StatCard
                label="Total Setor"
                value={m.totalGrammage.toLocaleString("id-ID")}
                unit="gram"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Info Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Kontak */}
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="mb-4 font-semibold">Informasi Kontak</h2>
          <div className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={m.email} />
            <InfoRow icon={Phone} label="Nomor HP" value={m.phone} />
          </div>
        </div>

        {/* Data Pribadi */}
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="mb-4 font-semibold">Data Pribadi</h2>
          <div className="space-y-4">
            <InfoRow
              icon={User}
              label="Jenis Kelamin"
              value={m.gender === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
            />
            <InfoRow icon={MapPin} label="Alamat" value={m.address} />
          </div>
        </div>

        {/* Foto KTP */}
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="mb-4 font-semibold">Foto KTP</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
            <Image
              src={m.ktpImageUrl}
              alt={`KTP ${m.name}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Rejection Reason ─────────────────────────────────────── */}
      {m.rejectedReason && (
        <div className="border-destructive/30 bg-destructive/5 flex items-start gap-3 rounded-2xl border p-5">
          <AlertCircle className="text-destructive mt-0.5 size-5 shrink-0" />
          <div>
            <p className="text-destructive text-sm font-semibold">
              Alasan Penolakan
            </p>
            <p className="text-foreground mt-1 text-sm">{m.rejectedReason}</p>
          </div>
        </div>
      )}

      {/* ── Review Actions — WAITING only ────────────────────────── */}
      {m.status === "WAITING" && <MasyarakatDetailClient masyarakat={m} />}
    </main>
  );
}
