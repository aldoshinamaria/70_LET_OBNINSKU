import { PROJECT_SHARE_TEXT } from './constants';

/** Публичный адрес проекта для шеринга (домен текущего деплоя). */
export function getShareUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://obninsk-70.ru';
}

function openShareWindow(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer,width=720,height=540');
}

/** Поделиться во ВКонтакте. */
export function shareToVK(url: string, text: string = PROJECT_SHARE_TEXT): void {
  const target = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  openShareWindow(target);
}

/** Поделиться в Одноклассниках. */
export function shareToOK(url: string, text: string = PROJECT_SHARE_TEXT): void {
  const target = `https://connect.ok.ru/offer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
  openShareWindow(target);
}

/**
 * Поделиться в MAX. У мессенджера нет публичного web-intent, поэтому
 * используем системный диалог «Поделиться» (отлично работает на мобильных),
 * а при его отсутствии — копируем ссылку с текстом.
 * Возвращает 'shared' | 'copied' | 'failed'.
 */
export async function shareToMax(
  url: string,
  text: string = PROJECT_SHARE_TEXT,
): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({ title: 'Капсула времени Обнинск-70', text, url });
      return 'shared';
    } catch {
      // Пользователь закрыл диалог — пробуем копирование как запасной вариант.
    }
  }
  const copied = await copyToClipboard(`${text} ${url}`);
  return copied ? 'copied' : 'failed';
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
