import { writeFile, mkdir, unlink, rm } from "fs/promises";
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

/**
 * Erases one media file from disk.
 *
 * Deleting the database row alone leaves the photo in the uploads volume, which
 * is not what /legal/privacy §7 and /delete-account promise. Photographs are the
 * most sensitive thing this product stores, so erasure has to reach the bytes.
 *
 * Deliberately never throws: a file that is already gone, or was never written,
 * must not abort the row delete that follows it — otherwise a single missing
 * photo makes an account impossible to delete.
 */
export async function deleteMediaFile(relativePath: string): Promise<void> {
  try {
    await unlink(resolveMediaPath(relativePath));
  } catch {
    // Already absent. Nothing left to erase, which is the desired end state.
  }
}

/**
 * Erases every photo connected to a user: the ones they uploaded themselves,
 * and the ones recipients attached to responses on their page.
 *
 * The second group needs collecting explicitly. A recipient's photo is stored
 * with a null userId (it belongs to no account), so it has no cascade path from
 * the user — deleting the account would otherwise strand both the row and the
 * file with no owner and no way to reach them.
 *
 * Must run *before* the user row is deleted, while the media rows still exist.
 */
export async function deleteAllUserMedia(userId: string): Promise<void> {
  const [owned, fromResponses] = await Promise.all([
    prisma.media.findMany({ where: { userId }, select: { id: true, path: true } }),
    prisma.media.findMany({
      where: { responses: { some: { datePage: { userId } } } },
      select: { id: true, path: true },
    }),
  ]);

  const byId = new Map([...owned, ...fromResponses].map((m) => [m.id, m]));
  const all = [...byId.values()];

  await Promise.all(all.map((m) => deleteMediaFile(m.path)));
  await prisma.media.deleteMany({ where: { id: { in: all.map((m) => m.id) } } });

  try {
    await rm(path.join(UPLOAD_ROOT, userId), { recursive: true, force: true });
  } catch {
    // Removing the now-empty directory is tidiness; the files above were the point.
  }
}
