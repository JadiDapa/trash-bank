import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateAdminButton() {
  return (
    <Button asChild>
      <Link href="/super-admin/admin/buat">
        <Plus className="size-4" />
        Tambah Bank Sampah
      </Link>
    </Button>
  );
}
