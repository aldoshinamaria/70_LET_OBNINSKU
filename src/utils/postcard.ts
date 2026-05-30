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

/** PNG-открытка из DOM-узла (для шеринга и скачивания). */
export async function renderPostcardPng(node: HTMLElement): Promise<Blob> {
  await waitForImages(node);
  await waitForFonts();

  const dataUrl = await toPng(node, {
    width: POSTCARD_WIDTH,
    height: POSTCARD_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
  });

  const response = await fetch(dataUrl);
  return response.blob();
}

export async function renderPostcardFile(
  node: HTMLElement,
  fileName: string,
): Promise<File> {
  const blob = await renderPostcardPng(node);
  return new File([blob], fileName, { type: 'image/png' });
}

export async function downloadPostcard(
  node: HTMLElement,
  fileName: string,
): Promise<void> {
  const blob = await renderPostcardPng(node);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = objectUrl;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
