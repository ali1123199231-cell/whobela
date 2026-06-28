import { ImageResponse } from "next/og";

// Site-wide default Open Graph image (1200x630), used by buildMetadata().
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Whobela — the beautiful way to ask someone out";

export default function OpengraphImage() {
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
          gap: 28,
          background: "linear-gradient(to bottom, #fff1f2, #fce7f3)",
        }}
      >
        <div style={{ fontSize: 48, color: "#e11d48", fontWeight: 600 }}>🌸 whobela</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#881337",
            textAlign: "center",
            maxWidth: 900,
            padding: "0 40px",
            lineHeight: 1.15,
          }}
        >
          The beautiful way to ask someone out
        </div>
        <div style={{ fontSize: 30, color: "#be185d", textAlign: "center" }}>
          Create a personalized date invitation
        </div>
      </div>
    ),
    size,
  );
}
