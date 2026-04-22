"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  Eye,
  EyeClosed,
  Lock,
  User,
  IdCard,
  Phone,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/app/action/user.actions";
import { CreateUserSchema } from "@/servers/validators/user.validator";

const SignUpSchema = CreateUserSchema.extend({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
});
type SignUpFormType = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { signUp } = useSignUp();
  const { loaded } = useClerk();
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      address: "",
      role: "USER",
    },
  });

  async function onSubmit(values: SignUpFormType) {
    startTransition(async () => {
      if (!loaded || !signUp) return;

      try {
        const { error } = await signUp.create({
          username: values.username,
          password: values.password,
        });

        if (error) {
          toast.error(error?.message || "Kombinasi salah");
          console.error(error);
          return;
        }

        if (signUp.status === "complete") {
          await createUser({
            username: values.username,
            name: values.name,
            role: "USER",
            phoneNumber: values.phoneNumber || null,
            address: values.address || null,
          });
          toast.success("Akun berhasil dibuat 🎉");
          router.push("/");
        }
      } catch (err: any) {
        console.error(err);

        const message =
          err?.errors?.[0]?.message || "Terjadi kesalahan saat daftar";

        if (message.toLowerCase().includes("username")) {
          toast.error("Username sudah digunakan");
        } else {
          toast.error(message);
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 w-full">
      <FieldGroup>
        <div className="space-y-3">
          {/* NAME */}
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    placeholder="Nama Lengkap"
                    className="ml-2"
                  />
                  <InputGroupAddon>
                    <IdCard size={18} />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* USERNAME */}
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value.toLowerCase())
                    }
                    placeholder="Username"
                    className="ml-2 lowercase"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <InputGroupAddon>
                    <User size={18} />
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <Lock size={18} />
                  </InputGroupAddon>

                  <InputGroupInput
                    {...field}
                    type={isVisible ? "text" : "password"}
                    placeholder="Password"
                    className="ml-2"
                  />

                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* CONFIRM PASSWORD */}
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <Lock size={18} />
                  </InputGroupAddon>

                  <InputGroupInput
                    {...field}
                    type={isVisible ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    className="ml-2"
                  />

                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* PHONE */}
          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    placeholder="Nomor HP"
                    className="ml-2"
                  />
                  <InputGroupAddon>
                    <Phone size={18} />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />

          {/* ADDRESS */}
          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    placeholder="Alamat"
                    className="ml-2"
                  />
                  <InputGroupAddon>
                    <MapPin size={18} />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </Field>
            )}
          />
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isPending || !loaded || !form.formState.isValid}
          className="h-12 w-full cursor-pointer text-base font-semibold tracking-wide"
        >
          {isPending ? <Spinner /> : "Daftar"}
        </Button>
        {/* CAPTCHA (optional Clerk) */}
        <div id="clerk-captcha" />
      </FieldGroup>
    </form>
  );
}
