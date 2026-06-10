"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const FIELDS = [
  { label: "Username Login Admin", key: "clerkUsername" as const, placeholder: "username unik" },
  { label: "Password", key: "clerkPassword" as const, placeholder: "min 8 karakter", type: "password" },
  { label: "Nama Bank Sampah", key: "bankName" as const, placeholder: "Bank Sampah Sejahtera" },
  { label: "Area / Kecamatan", key: "bankArea" as const, placeholder: "Kecamatan Sukajadi" },
  { label: "Jam Operasional", key: "operatingHours" as const, placeholder: "Senin-Jumat 08.00-16.00" },
  { label: "Nomor Telepon (opsional)", key: "phone" as const, placeholder: "08xxx" },
] as const;

const EMPTY = {
  clerkUsername: "",
  clerkPassword: "",
  bankName: "",
  bankAddress: "",
  bankArea: "",
  operatingHours: "",
  phone: "",
  description: "",
};

export default function CreateAdminPage() {
  const [form, setForm] = useState(EMPTY);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setField(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.clerkUsername ||
      !form.clerkPassword ||
      !form.bankName ||
      !form.bankAddress ||
      !form.bankArea ||
      !form.operatingHours
    ) {
      toast.error("Lengkapi semua field wajib");
      return;
    }
    startTransition(async () => {
      try {
        const { createAdmin } = await import("@/app/action/admin.action");
        await createAdmin({
          clerkUsername: form.clerkUsername,
          clerkPassword: form.clerkPassword,
          bankName: form.bankName,
          bankAddress: form.bankAddress,
          bankArea: form.bankArea,
          operatingHours: form.operatingHours,
          phone: form.phone || undefined,
          description: form.description || undefined,
        });
        toast.success("Admin bank sampah berhasil dibuat!");
        router.push("/super-admin/admin");
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/super-admin/admin">
            <ChevronLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Tambah Bank Sampah</h1>
          <p className="text-muted-foreground text-sm">
            Daftarkan bank sampah baru dan buat akun adminnya
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Akun Login */}
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <h2 className="font-semibold">Akun Login</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Username Login Admin</Label>
              <Input
                value={form.clerkUsername}
                onChange={setField("clerkUsername")}
                placeholder="username unik"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                type="password"
                value={form.clerkPassword}
                onChange={setField("clerkPassword")}
                placeholder="min 8 karakter"
              />
            </div>
          </div>
        </div>

        {/* Info Bank Sampah */}
        <div className="bg-card space-y-4 rounded-xl border p-5">
          <h2 className="font-semibold">Informasi Bank Sampah</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Nama Bank Sampah</Label>
              <Input
                value={form.bankName}
                onChange={setField("bankName")}
                placeholder="Bank Sampah Sejahtera"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Alamat</Label>
              <Input
                value={form.bankAddress}
                onChange={setField("bankAddress")}
                placeholder="Jl. ..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Area / Kecamatan</Label>
              <Input
                value={form.bankArea}
                onChange={setField("bankArea")}
                placeholder="Kecamatan Sukajadi"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Jam Operasional</Label>
              <Input
                value={form.operatingHours}
                onChange={setField("operatingHours")}
                placeholder="Senin-Jumat 08.00-16.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Nomor Telepon (opsional)</Label>
              <Input
                value={form.phone}
                onChange={setField("phone")}
                placeholder="08xxx"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Deskripsi (opsional)</Label>
              <Input
                value={form.description}
                onChange={setField("description")}
                placeholder="..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/super-admin/admin">Batal</Link>
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? <Spinner /> : "Buat Akun Admin"}
          </Button>
        </div>
      </form>
    </div>
  );
}
