"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { CreateEducationSchema } from "@/servers/validators/education.validator";
import { createEducation } from "@/app/action/education.action";

type EducationFormType = z.infer<typeof CreateEducationSchema>;

export default function AddEducation({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EducationFormType>({
    resolver: zodResolver(CreateEducationSchema),
    defaultValues: {
      userId: userId,
      title: "",
      description: "",
      imageUrl: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: EducationFormType) {
    startTransition(async () => {
      try {
        await createEducation(values);
        toast.success("Edukasi berhasil ditambahkan!");

        form.reset({
          userId,
          title: "",
          description: "",
          imageUrl: "",
        });

        setOpen(false);
      } catch {
        toast.error("Terjadi kesalahan");
      }
    });
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DrawerTrigger
        asChild
        className="fixed bottom-0 left-1/2 z-50 max-w-sm -translate-x-1/2 overflow-hidden"
      >
        <div className="bg-primary w-full cursor-pointer p-2">
          <button className="bg-muted flex h-12 w-full items-center justify-center gap-2 rounded-full px-4 py-3 transition hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="size-5" />
            <span className="text-sm font-medium">Tambah Edukasi</span>
          </button>
        </div>
      </DrawerTrigger>

      {/* DRAWER */}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle>Tambah Edukasi</DrawerTitle>
            <p className="text-muted-foreground text-sm">
              Masukkan data edukasi
            </p>
          </DrawerHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              {/* Title */}
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Judul</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Judul edukasi" />
                    </InputGroup>
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Tulis deskripsi..."
                      className="min-h-24"
                    />
                  </Field>
                )}
              />

              {/* Image URL */}
              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Image URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="https://..." />
                    </InputGroup>
                  </Field>
                )}
              />
            </FieldGroup>

            {/* SUBMIT BUTTON (BOTTOM STYLE) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="bg-primary text-primary-foreground flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <Plus className="size-4" />
                    Tambahkan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
