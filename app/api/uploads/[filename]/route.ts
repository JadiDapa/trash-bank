import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  // Sanitize — prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(process.cwd(), "uploads", "images", safeName);

  if (!existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const file = await readFile(filePath);
  const ext = path.extname(safeName).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  const contentType = contentTypeMap[ext] ?? "application/octet-stream";

  return new NextResponse(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=86400",
    },
  });
}
