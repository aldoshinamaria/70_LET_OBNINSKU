import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5174/';

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1280, height: 900 },
];

const browser = await chromium.launch();
const issues = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });

  const rootLen = await page.locator('#root').evaluate((el) => el.innerHTML.length);
  if (rootLen < 1000) issues.push(`${vp.name}: пустой #root (${rootLen})`);
  if (pageErrors.length) issues.push(`${vp.name}: JS errors: ${pageErrors.join('; ')}`);

  const checks = [
    ['#hero', 'Hero'],
    ['#stats', 'Stats'],
    ['#about', 'About'],
    ['#form', 'Form'],
    ['#voice', 'Voice'],
  ];

  for (const [sel, label] of checks) {
    const visible = await page.locator(sel).isVisible();
    if (!visible) issues.push(`${vp.name}: секция ${label} не видна`);
  }

  // Hero grid
  if (vp.name === 'desktop') {
    const heroGrid = await page.locator('#hero > div').first().evaluate((el) => {
      const s = getComputedStyle(el);
      return s.gridTemplateColumns;
    });
    if (!heroGrid.includes('fr')) {
      issues.push(`desktop: Hero не в двух колонках (${heroGrid})`);
    }
  }

  // Stats columns on desktop
  if (vp.name === 'desktop') {
    const statsFlex = await page.locator('#stats [class*="lg:flex-row"]').first().isVisible().catch(() => false);
    if (!statsFlex) issues.push('desktop: Stats не в двух колонках');
  }

  // Voice carousel
  const carousel = await page.locator('#voice .no-scrollbar').count();
  if (carousel === 0 && (await page.locator('#voice article').count()) === 0) {
    const empty = await page.getByText('Капсула ждёт первых голосов').isVisible().catch(() => false);
    if (!empty) issues.push(`${vp.name}: лента голосов не найдена`);
  }

  // Overflow horizontal
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientW = await page.evaluate(() => document.documentElement.clientWidth);
  if (scrollW > clientW + 2) {
    issues.push(`${vp.name}: горизонтальный overflow ${scrollW - clientW}px`);
  }

  await page.screenshot({
    path: `screenshots/check-${vp.name}.png`,
    fullPage: true,
  });

  await page.close();
}

await browser.close();

if (issues.length) {
  console.log('ISSUES:');
  issues.forEach((i) => console.log(' -', i));
  process.exit(1);
}
console.log('OK: все проверки пройдены, скриншоты в screenshots/');
