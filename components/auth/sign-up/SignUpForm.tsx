"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UploadCloud, CheckCircle2 } from "lucide-react";
import { RegisterMasyarakatSchema } from "@/servers/validators/masyarakat.validator";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = RegisterMasyarakatSchema;
type FormType = z.infer<typeof FormSchema>;

const inputCls =
  "border-border bg-secondary/50 focus:bg-background h-11 rounded-xl font-sans text-sm transition-colors";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-foreground text-sm font-semibold">{label}</Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

function PasswordInput({
  id,
  placeholder,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={`${inputCls} pr-11`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nik: "",
      password: "",
      confirmPassword: "",
      name: "",
      address: "",
      gender: "LAKI_LAKI",
      phone: "",
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: FormType) {
    if (!ktpFile) {
      toast.error("Upload foto KTP terlebih dahulu");
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("file", ktpFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error ?? "Upload KTP gagal");
        }
        const { url: ktpImageUrl } = await uploadRes.json();

        const { registerMasyarakat } = await import("@/app/action/auth.action");
        await registerMasyarakat({ ...values, ktpImageUrl });

        const result = await signIn?.create({
          identifier: values.nik,
          password: values.password,
        });
        if (result?.status === "complete") {
          await setActive?.({ session: result.createdSessionId });
        }

        toast.success("Pendaftaran berhasil! Menunggu verifikasi admin.");
        router.push("/waiting");
      } catch (err: any) {
        const msg = err?.errors?.[0]?.message ?? err?.message ?? "Terjadi kesalahan";
        toast.error(msg.toLowerCase().includes("username") ? "NIK sudah terdaftar" : msg);
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Row 1 — Nama + NIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field label="Nama Lengkap" error={fieldState.error?.message}>
              <Input {...field} placeholder="Nama sesuai KTP" className={inputCls} />
            </Field>
          )}
        />
        <Controller
          name="nik"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field label="NIK" error={fieldState.error?.message}>
              <Input
                {...field}
                placeholder="16 digit NIK"
                maxLength={16}
                inputMode="numeric"
                className={inputCls}
              />
            </Field>
          )}
        />
      </div>

      {/* Row 2 — Gender + Phone */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="gender"
          control={form.control}
          render={({ field }) => (
            <Field label="Jenis Kelamin">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={inputCls}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAKI_LAKI">Laki-laki</SelectItem>
                  <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field label="Nomor HP" error={fieldState.error?.message}>
              <Input
                {...field}
                placeholder="08xxxxxxxxxx"
                inputMode="tel"
                className={inputCls}
              />
            </Field>
          )}
        />
      </div>

      {/* Row 3 — Email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field label="Email" error={fieldState.error?.message}>
            <Input
              {...field}
              type="email"
              placeholder="email@contoh.com"
              className={inputCls}
            />
          </Field>
        )}
      />

      {/* Row 4 — Address */}
      <Controller
        name="address"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field label="Alamat" error={fieldState.error?.message}>
            <Input {...field} placeholder="Alamat lengkap" className={inputCls} />
          </Field>
        )}
      />

      {/* Row 5 — KTP Upload */}
      <div className="space-y-1.5">
        <Label className="text-foreground text-sm font-semibold">Foto KTP</Label>
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed py-5 transition-colors ${
            ktpFile
              ? "border-primary/50 bg-primary/5"
              : "border-border bg-secondary/50 hover:bg-secondary/80"
          }`}
        >
          {ktpFile ? (
            <>
              <CheckCircle2 className="text-primary size-5" />
              <span className="text-foreground max-w-60 truncate text-center text-sm font-medium">
                {ktpFile.name}
              </span>
              <span className="text-muted-foreground text-xs">Klik untuk ganti</span>
            </>
          ) : (
            <>
              <UploadCloud className="text-muted-foreground size-5" />
              <span className="text-muted-foreground text-sm">Klik untuk upload foto KTP</span>
              <span className="text-muted-foreground/70 text-xs">Maks 5MB · JPG / PNG / WebP</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {/* Row 6 — Password + Confirm */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field label="Password" error={fieldState.error?.message}>
              <PasswordInput {...field} placeholder="Min. 8 karakter" />
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field label="Konfirmasi Password" error={fieldState.error?.message}>
              <PasswordInput {...field} placeholder="Ulangi password" />
            </Field>
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !form.formState.isValid || !ktpFile}
        className="mt-1 h-11 w-full rounded-xl font-sans text-sm font-bold transition-all active:scale-95"
      >
        {isPending ? <Spinner /> : "Daftar Sekarang"}
      </Button>
    </form>
  );
}
