"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import TiptapEditor from "@/components/root/super-admin/TiptapEditor";

interface InitialData {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
}

interface Props {
  mode: "create" | "edit";
  initial?: InitialData;
}

export default function EducationFormClient({ mode, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.description ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload gambar gagal");
    const data = await res.json();
    return data.url as string;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    startTransition(async () => {
      try {
        let imageUrl: string | undefined = initial?.imageUrl ?? undefined;
        if (imageFile) {
          setUploading(true);
          imageUrl = await uploadImage(imageFile);
          setUploading(false);
        }

        if (mode === "create") {
          const { createEducation } = await import("@/app/action/education.action");
          await createEducation({
            title: title.trim(),
            description: content || "",
            imageUrl,
          });
          toast.success("Artikel berhasil dibuat!");
        } else {
          const { updateEducation } = await import("@/app/action/education.action");
          await updateEducation(initial!.id, {
            title: title.trim(),
            description: content || undefined,
            imageUrl,
          });
          toast.success("Artikel berhasil diperbarui!");
        }

        router.push("/super-admin/edukasi");
      } catch (err: any) {
        setUploading(false);
        toast.error(err?.message ?? "Terjadi kesalahan");
      }
    });
  }

  const isLoading = isPending || uploading;
  const isEdit = mode === "edit";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/super-admin/edukasi">
            <ChevronLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">
            {isEdit ? "Edit Artikel Edukasi" : "Tambah Artikel Edukasi"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isEdit ? "Perbarui konten artikel" : "Buat konten edukasi lingkungan baru"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Judul */}
        <div className="bg-card space-y-3 rounded-xl border p-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cara Memilah Sampah Organik dan Anorganik..."
              className="text-base"
            />
          </div>
        </div>

        {/* Gambar */}
        <div className="bg-card space-y-3 rounded-xl border p-5">
          <Label>Gambar Sampul (opsional)</Label>
          {imagePreview && !imageFile && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={imagePreview}
                alt={isEdit ? "Gambar saat ini" : "Preview"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />
          {imagePreview && imageFile && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image src={imagePreview} alt="Preview baru" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Konten Tiptap */}
        <div className="bg-card space-y-3 rounded-xl border p-5">
          <Label>Isi Artikel</Label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Tulis isi artikel edukasi di sini..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/super-admin/edukasi">Batal</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? <Spinner /> : isEdit ? "Simpan Perubahan" : "Terbitkan Artikel"}
          </Button>
        </div>
      </form>
    </div>
  );
}
