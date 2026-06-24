import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import type { MediaKind } from "@/generated/prisma/enums";

const UPLOAD_ROOT = process.env.UPLOAD_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "uploads");

export async function saveMedia(opts: {
  userId?: string;
  kind: MediaKind;
  file: File;
  order?: number;
}) {
  const ext = (opts.file.type.split("/")[1] || "bin").replace(/[^a-z0-9]/gi, "");
  const id = randomUUID();
  const dir = path.join(UPLOAD_ROOT, opts.userId ?? "anonymous");
  await mkdir(dir, { recursive: true });
  const filename = `${id}.${ext}`;
  const filePath = path.join(dir, filename);
  const buffer = Buffer.from(await opts.file.arrayBuffer());
  await writeFile(filePath, buffer);

  return prisma.media.create({
    data: {
      id,
      userId: opts.userId,
      kind: opts.kind,
      path: path.join(opts.userId ?? "anonymous", filename),
      order: opts.order ?? 0,
    },
  });
}

export function resolveMediaPath(relativePath: string) {
  return path.join(UPLOAD_ROOT, relativePath);
}
