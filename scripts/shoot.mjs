import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'screenshots');
mkdirSync(outDir, { recursive: true });

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const LONG_TEXT =
  'Дорогой Обнинск, спасибо за science, друзей и тёплые вечера у Протвы. ' +
  'Мечтаю, чтобы ты оставался городом учёных и добрых людей, где каждый ребёнок верит в большое будущее.';

async function fillForm(page) {
  await page.fill('input[name="name"]', 'Мария Алдошина');
  await page.selectOption('select[name="category"]', 'педагог');
  await page.selectOption('select[name="location"]', 'Обнинск');
  await page.fill(
    'textarea[name="wish_to_city"]',
    'Желаю Обнинску оставаться городом науки, мечты и тёплых человеческих историй на долгие годы вперёд.',
  );
  await page.fill(
    'textarea[name="future_city"]',
    'Через 70 лет вижу зелёный умный наукоград, куда едут учиться и мечтать со всего мира.',
  );
  await page.fill('textarea[name="message_to_2096"]', LONG_TEXT);
  await page.check('input[name="consent"]', { force: true });
  await page.click('button[type="submit"]');
  await page.waitForSelector('[role="dialog"]', { timeout: 15000 });
  await page.waitForTimeout(1400);
}

async function shoot(viewport, name) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // чистим localStorage, чтобы номер был стабильным
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await fillForm(page);

  const dialog = page.locator('[role="dialog"]');
  // снимаем ограничение высоты/скролла, чтобы захватить весь экран целиком
  await dialog.evaluate((el) => {
    el.style.maxHeight = 'none';
    el.style.overflow = 'visible';
  });
  await page.waitForTimeout(300);
  await dialog.screenshot({ path: resolve(outDir, `${name}.png`) });

  if (name === 'desktop-modal') {
    // клонируем открытку в body и снимаем её в полном разрешении 1080×1350
    await page.evaluate(() => {
      const src = document.querySelector('[data-postcard]');
      if (!src) return;
      const clone = src.cloneNode(true);
      clone.id = 'pc-clone';
      clone.style.position = 'fixed';
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.transform = 'none';
      clone.style.zIndex = '99999';
      document.body.appendChild(clone);
    });
    await page.waitForTimeout(400);
    await page
      .locator('#pc-clone')
      .screenshot({ path: resolve(outDir, 'postcard.png') });
  }

  await browser.close();
}

await shoot({ width: 1440, height: 1000 }, 'desktop-modal');
await shoot({ width: 390, height: 844 }, 'mobile-modal');
console.log('Screenshots saved to', outDir);
