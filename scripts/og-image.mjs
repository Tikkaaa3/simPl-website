// Builds public/og.png, the 1200 × 630 image shown when the site is shared.
// Run `node scripts/og-image.mjs` after replacing the reading screenshot.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const path = (relative) => fileURLToPath(new URL(relative, root));

const width = 1200;
const height = 630;
const shotWidth = 1000;
const shotLeft = (width - shotWidth) / 2;
const shotTop = 300;

const shot = await sharp(path('src/assets/screens/reading-default-dark.webp'))
  .resize({ width: shotWidth })
  .extract({ left: 0, top: 0, width: shotWidth, height: height - shotTop })
  .toBuffer();

// Rounded top corners and a hairline border, like the frame on the page.
const frame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${shotWidth}" height="${height - shotTop}">
    <rect x="0.5" y="0.5" width="${shotWidth - 1}" height="${height - shotTop + 20}" rx="14" fill="none" stroke="#2f2f2f"/>
  </svg>`,
);
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${shotWidth}" height="${height - shotTop}">
    <rect width="${shotWidth}" height="${height - shotTop + 20}" rx="14"/>
  </svg>`,
);
const framed = await sharp(shot)
  .composite([{ input: mask, blend: 'dest-in' }, { input: frame }])
  .png()
  .toBuffer();

const text = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="0%" r="70%">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.09"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#0c0c0c"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <text x="600" y="150" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="132" letter-spacing="-6" fill="#ededed">simPl</text>
    <text x="600" y="222" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="34" letter-spacing="-0.8" fill="#b5b5b5">A lightweight reader. A quiet place for your books.</text>
  </svg>`,
);

await sharp(text)
  .composite([{ input: framed, left: shotLeft, top: shotTop }])
  .png({ compressionLevel: 9 })
  .toFile(path('public/og.png'));

console.log('Wrote public/og.png');
