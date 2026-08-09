#!/usr/bin/env node
// Renders the app icons in public/ from one SVG source.
//
// Re-run after changing the mark: `node scripts/generate-icons.mjs`.
//
// The mark is a plain heart rather than the 🌸 of the wordmark, because the
// icon has to survive being 48px on a home screen next to Instagram and
// WhatsApp: a single high-contrast silhouette reads there and a flower's petal
// detail does not.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

// `scale` shrinks the heart towards the centre. Android crops a maskable icon
// to whatever shape the launcher likes — up to a circle inscribed in the
// middle 80% — so the maskable variant keeps well clear of the edges.
const svg = (size, scale) => {
  const pad = (1 - scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="100%" stop-color="#e11d48"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)"/>
  <g transform="translate(${pad * 100} ${pad * 100}) scale(${scale})">
    <path fill="#ffffff" d="M50 84 C50 84 12 60 12 35.5 C12 21 23 11 34.5 11 C41.8 11 47.4 14.7 50 20.3 C52.6 14.7 58.2 11 65.5 11 C77 11 88 21 88 35.5 C88 60 50 84 50 84 Z"/>
  </g>
</svg>`;
};

// A full-bleed icon fills its square; a maskable one must not.
const targets = [
  { file: "icon-192.png", size: 192, scale: 0.78 },
  { file: "icon-512.png", size: 512, scale: 0.78 },
  { file: "icon-maskable-512.png", size: 512, scale: 0.56 },
  { file: "apple-touch-icon.png", size: 180, scale: 0.78 },
];

await mkdir(publicDir, { recursive: true });

for (const { file, size, scale } of targets) {
  const png = await sharp(Buffer.from(svg(size, scale))).png().toBuffer();
  await writeFile(join(publicDir, file), png);
  console.log(`wrote public/${file} (${size}x${size})`);
}
