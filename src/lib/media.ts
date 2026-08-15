import { writeFile, mkdir, unlink, rm } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import type { MediaKind } from "@/generated/prisma/enums";
import { log } from "@/lib/log";

const UPLOAD_ROOT = process.env.UPLOAD_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "uploads");

// Long edge, in pixels. Photos here are shown in a card and a lightbox on a
// phone, so anything beyond this is bytes nobody sees — and the native camera
// hands over 4000px originals where the web cropper used to hand over a
// thumbnail.
const MAX_DIMENSION = 2000;

/**
 * Normalises an uploaded photo: corrects its orientation and caps its size.
 *
 * `rotate()` with no argument is the important half. Phone cameras record the
 * sensor's own orientation and leave an EXIF tag saying which way is up; strip
 * that tag by re-encoding — as any resize does — and every portrait photo
 * silently lands on its side. Browsers honour the tag when displaying a file
 * directly, which is why the web upload path never had to care and why this
 * would have looked like a bug in the app rather than in the server.
 *
 * Animated GIFs are re-checked but not re-encoded: sharp would flatten one to
 * its first frame, and a still of someone's reaction GIF is worse than a large
 * file. Their bytes are still parsed first, so "it is a GIF" is a fact and not
 * a claim.
 *
 * Throws InvalidImageError when the bytes are not a decodable image. The
 * allowlist upstream only inspects the Content-Type the *client* chose, which
 * anyone can set to image/jpeg on a text file — and for booker photos the
 * uploader has no account at all. If sharp cannot decode it, it is not a photo,
 * and storing it under a .jpeg extension to be served back later is not a
 * kindness to anyone.
 */
export class InvalidImageError extends Error {
  constructor() {
    super("That file isn't an image we can read.");
    this.name = "InvalidImageError";
  }
}

async function normaliseImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType === "image/gif") {
    // Decoded purely to prove it is really an image; the original bytes are
    // what gets stored, so animation survives.
    try {
      const meta = await sharp(buffer).metadata();
      if (!meta.width || !meta.height) throw new Error("no dimensions");
      log.debug("media.normalise.skipped", {
        reason: "animated gif", bytes: buffer.length, size: `${meta.width}x${meta.height}`,
      });
      return buffer;
    } catch {
      log.warn("media.rejected.undecodable", { type: mimeType, bytes: buffer.length });
      throw new InvalidImageError();
    }
  }

  try {
    const pipeline = sharp(buffer)
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true });

    // Re-encoded in the format it arrived as, so the extension chosen by the
    // caller keeps telling the truth.
    const before = await sharp(buffer).metadata();
    const out =
      mimeType === "image/png" ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
      : mimeType === "image/webp" ? await pipeline.webp({ quality: 82 }).toBuffer()
      : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const after = await sharp(out).metadata();
    log.info("media.normalised", {
      type: mimeType,
      from: `${before.width}x${before.height}`, to: `${after.width}x${after.height}`,
      orientation: before.orientation ?? null,
      bytesIn: buffer.length, bytesOut: out.length,
    });
    return out;
  } catch (error) {
    // Reached when sharp cannot decode the bytes at all — i.e. this is not an
    // image, whatever the Content-Type said.
    log.warn("media.rejected.undecodable", { type: mimeType, bytes: buffer.length, error });
    throw new InvalidImageError();
  }
}

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
  const original = Buffer.from(await opts.file.arrayBuffer());
  const buffer = await normaliseImage(original, opts.file.type);
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
