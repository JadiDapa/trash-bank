import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateEducationButton() {
  return (
    <Button asChild>
      <Link href="/super-admin/edukasi/buat">
        <Plus className="size-4" />
        Tambah Artikel
      </Link>
    </Button>
  );
}
