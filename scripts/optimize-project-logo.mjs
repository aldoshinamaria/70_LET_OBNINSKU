import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'логотип проекта 70 лет обнинску.png');

/** Убирает тёмный фон PNG, близкий к фону сайта (#081A2F). */
async function removeDarkBackground(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    const dr = r - 8;
    const dg = g - 26;
    const db = b - 47;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const lum = (r + g + b) / 3;
    if (dist < 42 || lum < 28) {
      out[o + 3] = 0;
    } else if (dist < 58) {
      out[o + 3] = Math.round(((dist - 42) / 16) * 255);
    }
  }

  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

const input = readFileSync(src);
const transparent = await removeDarkBackground(input);

const assets = resolve(root, 'src/assets');
await sharp(transparent).resize(480, null, { fit: 'inside' }).png().toFile(resolve(assets, 'project-logo.png'));
await sharp(transparent).resize(480, null, { fit: 'inside' }).webp({ quality: 88 }).toFile(resolve(assets, 'project-logo.webp'));
await sharp(transparent).resize(120, null, { fit: 'inside' }).png().toFile(resolve(assets, 'project-logo-mark.png'));
await sharp(transparent).resize(120, null, { fit: 'inside' }).webp({ quality: 88 }).toFile(resolve(assets, 'project-logo-mark.webp'));

console.log('project-logo assets ready');
