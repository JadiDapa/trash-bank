"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateEducationSchema } from "@/servers/validators/education.validator";
import { createEducation } from "@/app/action/education.action";
import { Textarea } from "@/components/ui/textarea";

type EducationFormType = z.infer<typeof CreateEducationSchema>;

export default function AddEducationDialog({ userId }: { userId: number }) {
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
  });

  async function onSubmit(values: EducationFormType) {
    startTransition(async () => {
      try {
        await createEducation({
          ...values,
        });
        toast.success("Ticket created!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hover:bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all active:scale-95">
          <Plus />
          Tambah Edukasi
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Education</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data education
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex flex-col gap-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Judul</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
                    </InputGroup>
                  </Field>
                )}
              />
              {/* Full Name */}
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <InputGroup>
                      <Textarea {...field} placeholder="Description" />
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Image Url</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Description" />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? <Spinner /> : "Tambahkan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
