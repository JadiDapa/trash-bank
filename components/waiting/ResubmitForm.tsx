"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Masyarakat } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { masyarakat: Masyarakat; onCancel: () => void };

export default function ResubmitForm({ masyarakat, onCancel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [fields, setFields] = useState({
    name: masyarakat.name,
    address: masyarakat.address,
    gender: masyarakat.gender,
    phone: masyarakat.phone,
    email: masyarakat.email,
  });

  function handleChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        let ktpImageUrl: string | undefined;
        if (ktpFile) {
          const fd = new FormData();
          fd.append("file", ktpFile);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          if (!res.ok) throw new Error("Upload KTP gagal");
          const json = await res.json();
          ktpImageUrl = json.url;
        }

        const { resubmitMasyarakat } = await import("@/app/action/masyarakat.action");
        await resubmitMasyarakat({ ...fields, ktpImageUrl });
        toast.success("Data berhasil diperbarui. Menunggu verifikasi ulang.");
        onCancel();
      } catch (err: any) {
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label>Nama Lengkap</Label>
        <Input value={fields.name} onChange={(e) => handleChange("name", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Jenis Kelamin</Label>
        <Select value={fields.gender} onValueChange={(v) => handleChange("gender", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
            <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Alamat</Label>
        <Input value={fields.address} onChange={(e) => handleChange("address", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Nomor HP</Label>
        <Input value={fields.phone} onChange={(e) => handleChange("phone", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Email</Label>
        <Input type="email" value={fields.email} onChange={(e) => handleChange("email", e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label>Foto KTP (opsional, upload ulang jika perlu)</Label>
        <Input type="file" accept="image/*" onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? <Spinner /> : "Ajukan Ulang"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
