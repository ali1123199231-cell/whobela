import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMedia, InvalidImageError } from "@/lib/media";
import { log, clientOf } from "@/lib/log";

const MAX_PROFILE_PHOTOS = 6;
// Raised from 8MB for the native camera, which produces 10-12MB originals where
// the web cropper produced a fraction of that. saveMedia downscales whatever
// arrives, so a large upload costs bandwidth once rather than disk forever —
// and rejecting the photo someone just took is the worse failure.
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = (formData.get("kind") as string) === "BOOKER_PHOTO" ? "BOOKER_PHOTO" : "PROFILE_PHOTO";

  // Profile photos belong to the logged-in creator. Booker photos are
  // uploaded by an anonymous recipient filling out the public flow, so no
  // session is required for that kind.
  let userId: string | undefined;
  if (kind === "PROFILE_PHOTO") {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    userId = session.userId;
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    log.warn("media.rejected.type", { client: clientOf(request), type: file.type, kind });
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    log.warn("media.rejected.tooLarge", {
      client: clientOf(request), bytes: file.size, limit: MAX_FILE_SIZE, kind,
    });
    return NextResponse.json({ error: "File too large (max 16MB)" }, { status: 400 });
  }

  if (kind === "PROFILE_PHOTO" && userId) {
    const count = await prisma.media.count({ where: { userId, kind: "PROFILE_PHOTO" } });
    if (count >= MAX_PROFILE_PHOTOS) {
      log.warn("media.rejected.tooMany", { userId, count, limit: MAX_PROFILE_PHOTOS });
      return NextResponse.json({ error: `You can upload up to ${MAX_PROFILE_PHOTOS} photos` }, { status: 400 });
    }
  }

  let media;
  try {
    media = await saveMedia({ userId, kind, file });
  } catch (error) {
    // The Content-Type said image; the bytes disagreed. Refusing is the point —
    // anyone can set that header, and booker photos come from people with no
    // account behind them.
    if (error instanceof InvalidImageError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
  log.info("media.uploaded", {
    mediaId: media.id, userId: userId ?? null, kind,
    client: clientOf(request), type: file.type, bytesIn: file.size,
  });
  return NextResponse.json({ id: media.id, path: media.path });
}
