import { toPng } from 'html-to-image';
import { POSTCARD_HEIGHT, POSTCARD_WIDTH } from '@/components/Postcard';

/** Дожидается загрузки фонового шаблона перед экспортом. */
function waitForImages(node: HTMLElement): Promise<void> {
  const images = Array.from(node.querySelectorAll('img'));
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

/** Генерирует PNG-открытку из DOM-узла и инициирует скачивание. */
async function waitForFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }
}

export async function downloadPostcard(
  node: HTMLElement,
  fileName: string,
): Promise<void> {
  await waitForImages(node);
  await waitForFonts();

  const dataUrl = await toPng(node, {
    width: POSTCARD_WIDTH,
    height: POSTCARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
