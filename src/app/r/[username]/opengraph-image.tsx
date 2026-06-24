import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { getLiveDatePageByUsername } from "@/lib/date-page";
import { resolveMediaPath } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { withDefaults, DEFAULT_INVITE_CONFIG, getTheme } from "@/lib/date-page-defaults";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CONTENT_TYPES: Record<string, string> = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

async function loadPhotoDataUrl(photoMediaId: string | null) {
  if (!photoMediaId) return null;
  try {
    const media = await prisma.media.findUnique({ where: { id: photoMediaId } });
    if (!media) return null;
    const buffer = await readFile(resolveMediaPath(media.path));
    const ext = media.path.split(".").pop() ?? "";
    const mime = CONTENT_TYPES[ext] ?? "image/png";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const result = await getLiveDatePageByUsername(username);

  if (result.state !== "live") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fdf2f8", fontSize: 64 }}>
          🌸 whobela
        </div>
      ),
      size
    );
  }

  const invite = withDefaults(result.datePage.inviteConfig, DEFAULT_INVITE_CONFIG);
  const theme = getTheme(result.datePage.theme);
  const photoDataUrl = await loadPhotoDataUrl(result.photoMediaIds[0] ?? null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: `linear-gradient(to bottom, ${theme.from}, ${theme.to})`,
        }}
      >
        {photoDataUrl ? (
          <img src={photoDataUrl} width={180} height={180} style={{ borderRadius: "50%", objectFit: "cover" }} alt="" />
        ) : (
          <div style={{ fontSize: 100 }}>{invite.emoji}</div>
        )}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: theme.heading,
            textAlign: "center",
            maxWidth: 900,
            padding: "0 40px",
          }}
        >
          {invite.question}
        </div>
      </div>
    ),
    size
  );
}
