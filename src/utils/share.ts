import { PROJECT_SHARE_TEXT } from './constants';

/** Публичный адрес проекта для шеринга (домен текущего деплоя). */
export function getShareUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://obninsk-70.ru';
}

/** Текст, который уходит в соцсети вместе со ссылкой. */
export function getShareText(url: string = getShareUrl()): string {
  return `${PROJECT_SHARE_TEXT} ${url}`;
}

function openShareWindow(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer,width=720,height=640');
}

/** Страница «Поделиться» ВКонтакте. */
export function getShareToVKUrl(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): string {
  const params = new URLSearchParams({
    url,
    title: text,
    comment: text,
  });
  return `https://vk.com/share.php?${params.toString()}`;
}

/** Страница «Поделиться» Одноклассники. */
export function getShareToOKUrl(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): string {
  const params = new URLSearchParams({
    url,
    title: text,
  });
  return `https://connect.ok.ru/offer?${params.toString()}`;
}

/**
 * Экран «Отправить в MAX» (официальный диплинк :share).
 * @see https://dev.max.ru/help/deeplinks
 */
export function getShareToMaxUrl(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): string {
  const body = text === PROJECT_SHARE_TEXT ? getShareText(url) : `${text} ${url}`;
  const params = new URLSearchParams({ text: body });
  return `https://max.ru/:share?${params.toString()}`;
}

/** Открывает страницу шеринга ВКонтакте в новой вкладке. */
export function shareToVK(url?: string, text?: string): void {
  openShareWindow(getShareToVKUrl(url, text));
}

/** Открывает страницу шеринга Одноклассников в новой вкладке. */
export function shareToOK(url?: string, text?: string): void {
  openShareWindow(getShareToOKUrl(url, text));
}

/** Открывает экран «Отправить в MAX» на max.ru. */
export function shareToMax(url?: string, text?: string): void {
  openShareWindow(getShareToMaxUrl(url, text));
}

/** Копирует ссылку в буфер обмена. Возвращает true при успехе. */
export async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // переходим к запасному способу
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
