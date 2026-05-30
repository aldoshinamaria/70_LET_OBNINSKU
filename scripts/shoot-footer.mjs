import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'screenshots');
mkdirSync(outDir, { recursive: true });
const BASE = process.env.BASE_URL || 'http://localhost:4182';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.locator('footer').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.locator('footer').screenshot({ path: resolve(outDir, 'footer.png') });
await browser.close();
console.log('saved footer');
