import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'капсула.png');

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
    const lum = (r + g + b) / 3;
    if (lum < 22) {
      out[o + 3] = 0;
    } else if (lum < 38) {
      out[o + 3] = Math.round(((lum - 22) / 16) * 255);
    }
  }

  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

const input = readFileSync(src);
const transparent = await removeDarkBackground(input);
const assets = resolve(root, 'src/assets');

await sharp(transparent)
  .resize(720, null, { fit: 'inside' })
  .png()
  .toFile(resolve(assets, 'capsule-vertical.png'));
await sharp(transparent)
  .resize(720, null, { fit: 'inside' })
  .webp({ quality: 90 })
  .toFile(resolve(assets, 'capsule-vertical.webp'));

console.log('capsule-vertical assets ready');
