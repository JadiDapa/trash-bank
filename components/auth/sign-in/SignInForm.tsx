"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  username: z.string().min(1, "NIK tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const { signIn } = useSignIn();
  const { setActive, loaded } = useClerk();
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormType) {
    startTransition(async () => {
      if (!loaded) return;
      try {
        const result = await signIn!.create({
          identifier: values.username,
          password: values.password,
        });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          toast.error("Login gagal. Coba lagi.");
        }
      } catch {
        toast.error("Kombinasi NIK/password salah");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* NIK */}
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <Label
              htmlFor="nik"
              className="text-foreground text-sm font-semibold"
            >
              NIK
            </Label>
            <Input
              {...field}
              id="nik"
              placeholder="Masukkan 16 digit NIK Anda"
              inputMode="numeric"
              maxLength={16}
              className="border-border bg-secondary/50 focus:bg-background h-11 rounded-xl font-sans text-sm transition-colors"
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Password */}
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-foreground text-sm font-semibold"
              >
                Password
              </Label>
              <a
                href="#"
                className="text-primary hover:text-primary/80 text-xs font-semibold transition-colors"
              >
                Lupa password?
              </a>
            </div>
            <Input
              {...field}
              id="password"
              type="password"
              placeholder="Password Anda"
              className="border-border bg-secondary/50 focus:bg-background h-11 rounded-xl font-sans text-sm transition-colors"
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || !loaded}
        className="mt-1 h-11 w-full rounded-xl font-sans text-sm font-bold transition-all active:scale-95"
      >
        {isPending ? <Spinner /> : "Masuk"}
      </Button>
    </form>
  );
}
