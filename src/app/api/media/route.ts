import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMedia } from "@/lib/media";

const MAX_PROFILE_PHOTOS = 6;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
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
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  if (kind === "PROFILE_PHOTO" && userId) {
    const count = await prisma.media.count({ where: { userId, kind: "PROFILE_PHOTO" } });
    if (count >= MAX_PROFILE_PHOTOS) {
      return NextResponse.json({ error: `You can upload up to ${MAX_PROFILE_PHOTOS} photos` }, { status: 400 });
    }
  }

  const media = await saveMedia({ userId, kind, file });
  return NextResponse.json({ id: media.id, path: media.path });
}
