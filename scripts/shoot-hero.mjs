import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'screenshots');
mkdirSync(outDir, { recursive: true });
const BASE = process.env.BASE_URL || 'http://localhost:4182';

async function shoot(viewport, name) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // Ждём фазу показа карточки (cycle), чтобы поймать капсулу + послание
  await page.waitForSelector('text=Голос из капсулы', { timeout: 20000 });
  await page.waitForTimeout(900);
  // Для репрезентативного кадра фиксируем капсулу вертикально
  // (живой сайт при этом продолжает медленно вращаться).
  await page.evaluate(() => {
    document.querySelectorAll('.capsule-sway-3d').forEach((el) => {
      el.style.animation = 'none';
      el.style.transform = 'rotateY(0deg)';
    });
  });
  await page.waitForTimeout(200);
  const hero = page.locator('#hero');
  await hero.screenshot({ path: resolve(outDir, `${name}.png`) });
  await browser.close();
  console.log('saved', name);
}

await shoot({ width: 1440, height: 1024 }, 'hero-desktop');
await shoot({ width: 390, height: 1100 }, 'hero-mobile');
console.log('done');
