import { PROJECT_DOMAIN, PROJECT_SHARE_TEXT } from './constants';
import { downloadPostcard, renderPostcardFile } from './postcard';

const DEFAULT_PUBLIC_URL = `https://${PROJECT_DOMAIN}`;

const envPublicUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
  );
}

/**
 * Публичный адрес для кнопок «Поделиться».
 * ВК и другие соцсети не принимают localhost — при разработке подставляем боевой домен.
 */
export function getShareUrl(): string {
  const configured = normalizeUrl(envPublicUrl || DEFAULT_PUBLIC_URL);

  if (typeof window === 'undefined') {
    return configured;
  }

  const { hostname, origin, protocol } = window.location;

  if (
    (protocol === 'http:' || protocol === 'https:') &&
    !isLocalDevHost(hostname)
  ) {
    return normalizeUrl(origin);
  }

  return configured;
}

/** Текст, который уходит в соцсети вместе со ссылкой. */
export function getShareText(url: string = getShareUrl()): string {
  return `${PROJECT_SHARE_TEXT} ${url}`;
}

const VK_SHARE_WINDOW_NAME = 'obninsk70_vk_share';

/** Одно окно ВК на клик (без перехода текущей вкладки с сайта). */
function openShareWindow(url: string): boolean {
  const popup = window.open(
    url,
    VK_SHARE_WINDOW_NAME,
    'noopener,noreferrer,width=720,height=640',
  );
  popup?.focus();
  return popup !== null;
}

/** Абсолютный URL картинки для превью ссылки в соцсетях. */
export function getShareOgImageUrl(siteUrl: string = getShareUrl()): string {
  try {
    return new URL('hero-capsule.jpg', `${siteUrl}${import.meta.env.BASE_URL}`)
      .href;
  } catch {
    return `${normalizeUrl(siteUrl)}/hero-capsule.jpg`;
  }
}

/** Страница «Поделиться» ВКонтакте. */
export function getShareToVKUrl(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
  imageUrl: string = getShareOgImageUrl(url),
): string {
  const params = new URLSearchParams({
    url,
    comment: text,
    image: imageUrl,
  });
  return `https://vk.com/share.php?${params.toString()}`;
}

export type VkShareResult = 'native' | 'widget' | 'download';

export interface ShareToVKOptions {
  url?: string;
  text?: string;
  postcardNode?: HTMLElement | null;
  postcardFileName?: string;
  /** ВК уже открыт синхронно из onClick (см. openVkShareWindow). */
  vkAlreadyOpened?: boolean;
}

/** Готовит открытку для ВК; окно ВК открывайте через openVkShareWindow в onClick. */
export async function shareToVK(
  options: ShareToVKOptions = {},
): Promise<VkShareResult> {
  const url = options.url ?? getShareUrl();
  const text = options.text ?? PROJECT_SHARE_TEXT;
  const vkUrl = getShareToVKUrl(url, text);
  const node = options.postcardNode ?? null;
  const fileName = options.postcardFileName ?? 'obninsk-70-postcard.png';
  const openVkIfNeeded = () => {
    if (!options.vkAlreadyOpened) {
      openShareWindow(vkUrl);
    }
  };

  if (!node) {
    openVkIfNeeded();
    return 'widget';
  }

  if (isMobileDevice()) {
    try {
      const file = await renderPostcardFile(node, fileName);
      const shareData: ShareData = {
        title: 'Капсула времени Обнинск-70',
        text: getShareText(url),
        files: [file],
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return 'native';
      }
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') {
        return 'native';
      }
    }

    openVkIfNeeded();
    try {
      await downloadPostcard(node, fileName);
      return 'download';
    } catch {
      return 'widget';
    }
  }

  // На компьютере ВК уже открыт из onClick — только скачиваем открытку
  try {
    await downloadPostcard(node, fileName);
    return 'download';
  } catch {
    return 'widget';
  }
}

export function getVkShareHint(result: VkShareResult): string | null {
  switch (result) {
    case 'download':
      return 'Открытка в «Загрузках»: в посте ВК нажмите «Фото» и выберите PNG — иначе на стене будет только ссылка';
    case 'native':
      return null;
    case 'widget':
      return null;
    default:
      return null;
  }
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

/** Текст для кнопки «Поделиться в MAX». */
export function getMaxShareBody(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): string {
  return text === PROJECT_SHARE_TEXT ? getShareText(url) : `${text} ${url}`;
}

/**
 * Экран «Отправить в MAX» (официальный диплинк :share).
 * @see https://dev.max.ru/docs/webapps/introduction
 */
export function getShareToMaxUrl(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): string {
  const body = getMaxShareBody(url, text);
  return `https://max.ru/:share?text=${encodeURIComponent(body)}`;
}

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

/** Сразу открыть страницу «Поделиться» ВК (вызывать синхронно из onClick). */
export function openVkShareWindow(
  url: string = getShareUrl(),
  text: string = PROJECT_SHARE_TEXT,
): boolean {
  return openShareWindow(getShareToVKUrl(url, text));
}

export type MaxShareResult = 'native' | 'deeplink' | 'copied';

/**
 * MAX: на телефоне — диплинк или системное «Поделиться»;
 * на компьютере диплинк :share пока часто без текста — копируем в буфер.
 */
export async function shareToMax(
  url?: string,
  text?: string,
): Promise<MaxShareResult> {
  const resolvedUrl = url ?? getShareUrl();
  const body = getMaxShareBody(resolvedUrl, text ?? PROJECT_SHARE_TEXT);
  const deeplink = getShareToMaxUrl(resolvedUrl, text);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text: body, url: resolvedUrl });
      return 'native';
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') {
        return 'native';
      }
    }
  }

  if (isMobileDevice()) {
    window.location.assign(deeplink);
    return 'deeplink';
  }

  await copyToClipboard(body);
  window.open(deeplink, '_blank', 'noopener,noreferrer');
  return 'copied';
}

export function getMaxShareHint(result: MaxShareResult): string | null {
  switch (result) {
    case 'copied':
      return 'Текст скопирован — в MAX выберите чат и вставьте сообщение (Ctrl+V)';
    case 'deeplink':
      return 'Выберите чат в MAX — текст уже в поле сообщения';
    case 'native':
      return null;
    default:
      return null;
  }
}

/** Открывает страницу шеринга Одноклассников в новой вкладке. */
export function shareToOK(url?: string, text?: string): void {
  openShareWindow(getShareToOKUrl(url, text));
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
