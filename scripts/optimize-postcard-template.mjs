import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'Шаблон открытки.png');
const out = resolve(root, 'src/assets/postcard-template.png');

const buffer = readFileSync(src);
await sharp(buffer)
  .resize(1080, 1350, { fit: 'fill' })
  .png({ compressionLevel: 9, quality: 92 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log('postcard-template.png', meta.width, 'x', meta.height);
