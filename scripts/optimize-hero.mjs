import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { statSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcPath = resolve(root, 'src/assets/hero-capsule.jpg');
// Загружаем исходник в буфер, чтобы безопасно перезаписывать тот же файл
const src = readFileSync(srcPath);

const targets = [
  resolve(root, 'src/assets'),
  resolve(root, 'public'),
];

function kb(path) {
  return (statSync(path).size / 1024).toFixed(0) + ' КБ';
}

const meta = await sharp(src).metadata();
// Ограничиваем максимальную ширину — для hero этого с запасом достаточно
const maxWidth = Math.min(meta.width ?? 1200, 1280);

for (const dir of targets) {
  const webp = resolve(dir, 'hero-capsule.webp');
  const jpg = resolve(dir, 'hero-capsule.jpg');

  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(webp);

  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(jpg);

  console.log(dir);
  console.log('  webp:', kb(webp));
  console.log('  jpg :', kb(jpg));
}

console.log('Готово.');
