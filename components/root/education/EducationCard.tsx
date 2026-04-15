import { Card } from "@/components/ui/card";
import { Education } from "@/generated/prisma";
import Image from "next/image";

export default function EducationCard({ education }: { education: Education }) {
  return (
    <Card>
      <div className="relative h-40 w-full overflow-hidden rounded-lg">
        <Image
          src={education.imageUrl || ""}
          alt={education.title}
          fill
          className="object-cover object-center"
        />
      </div>
      <p>
        Judul: <span>{education.title}</span>
      </p>

      <p>
        Deskripsi: <span>{education.description}</span>
      </p>
    </Card>
  );
}
