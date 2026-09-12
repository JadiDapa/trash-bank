"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormType) {
    startTransition(async () => {
      if (!isLoaded) return;
      try {
        const result = await signIn.create({
          identifier: values.username,
          password: values.password,
        });
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/");
          router.refresh();
        } else {
          toast.error("Login gagal. Coba lagi.");
        }
      } catch (err) {
        // Session already exists means the user is already signed in
        // (e.g. a previous attempt created the session but this browser
        // never activated it) — just send them onward instead of erroring.
        if (
          isClerkAPIResponseError(err) &&
          err.errors.some((e) => e.code === "session_exists")
        ) {
          router.push("/");
          router.refresh();
          return;
        }
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
            <div className="relative">
              <Input
                {...field}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password Anda"
                className="border-border bg-secondary/50 focus:bg-background h-11 rounded-xl pe-11 font-sans text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                className="text-muted-foreground hover:text-foreground absolute inset-y-0 inset-e-0 flex w-11 items-center justify-center transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
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
        disabled={isPending || !isLoaded}
        className="mt-1 h-11 w-full rounded-xl font-sans text-sm font-bold transition-all active:scale-95"
      >
        {isPending ? <Spinner /> : "Masuk"}
      </Button>
    </form>
  );
}
