import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import {
  getMaxShareHint,
  getShareToMaxUrl,
  getShareToOKUrl,
  getShareUrl,
  getVkShareHint,
  isMobileDevice,
  openVkShareWindow,
  shareToMax,
  shareToVK,
} from '@/utils/share';

interface ShareButtonsProps {
  className?: string;
  /** Подсказка после шеринга (например, toast в модалке успеха). */
  onNotify?: (message: string) => void;
  /** Узел открытки для шеринга персонального PNG. */
  getPostcardNode?: () => HTMLElement | null;
  postcardFileName?: string;
}

interface ShareWidgetProps {
  href: string;
  label: string;
  background: string;
  children: ReactNode;
}

function ShareWidget({ href, label, background, children }: ShareWidgetProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10',
        'text-white shadow-sm transition-transform duration-200',
        'hover:-translate-y-0.5 hover:shadow-card active:scale-95',
      )}
      style={{ background }}
      aria-label={`Поделиться в ${label}`}
      title={label}
    >
      {children}
    </a>
  );
}

function VkShareWidget({
  label,
  background,
  children,
  onNotify,
  getPostcardNode,
  postcardFileName,
}: Omit<ShareWidgetProps, 'href'> &
  Pick<ShareButtonsProps, 'onNotify' | 'getPostcardNode' | 'postcardFileName'>) {
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    if (busy) return;
    setBusy(true);

    const mobile = isMobileDevice();
    let vkOpened = false;

    if (!mobile) {
      vkOpened = openVkShareWindow();
      if (!vkOpened) {
        onNotify?.('Разрешите всплывающие окна для сайта — иначе ВК не откроется');
        setBusy(false);
        return;
      }
    }

    void (async () => {
      try {
        const result = await shareToVK({
          postcardNode: getPostcardNode?.() ?? null,
          postcardFileName,
          vkAlreadyOpened: vkOpened,
        });
        const hint = getVkShareHint(result);
        if (hint) onNotify?.(hint);
      } catch {
        if (!vkOpened && openVkShareWindow()) {
          onNotify?.('Откройте окно ВК и прикрепите открытку из «Загрузок»');
        } else if (!vkOpened) {
          onNotify?.('Разрешите всплывающие окна для сайта');
        }
      } finally {
        setBusy(false);
      }
    })();
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void handleClick()}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10',
        'text-white shadow-sm transition-transform duration-200',
        'hover:-translate-y-0.5 hover:shadow-card active:scale-95',
        'disabled:pointer-events-none disabled:opacity-60',
      )}
      style={{ background }}
      aria-label={`Поделиться в ${label}`}
      title={label}
    >
      {children}
    </button>
  );
}

function MaxShareWidget({
  href,
  label,
  background,
  children,
  onNotify,
}: ShareWidgetProps & { onNotify?: (message: string) => void }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await shareToMax();
      const hint = getMaxShareHint(result);
      if (hint) onNotify?.(hint);
    } catch {
      window.open(href, '_blank', 'noopener,noreferrer');
      onNotify?.(
        'Не удалось подготовить сообщение — откройте MAX и вставьте текст вручную',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void handleClick()}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10',
        'text-white shadow-sm transition-transform duration-200',
        'hover:-translate-y-0.5 hover:shadow-card active:scale-95',
        'disabled:pointer-events-none disabled:opacity-60',
      )}
      style={{ background }}
      aria-label={`Поделиться в ${label}`}
      title={label}
    >
      {children}
    </button>
  );
}

function VkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.306.58-1.5c.592-.19 1.35 1.27 2.154 1.83.61.42 1.074.328 1.074.328l2.137-.03s1.117-.07.587-.95c-.043-.073-.31-.66-1.593-1.87-1.346-1.27-1.166-1.064.454-3.26.983-1.33 1.376-2.14 1.253-2.49-.116-.33-.83-.243-.83-.243l-2.405.015s-.178-.025-.31.056c-.13.078-.212.26-.212.26s-.382 1.02-.89 1.89c-1.07 1.83-1.5 1.93-1.676 1.82-.408-.26-.306-1.04-.306-1.6 0-1.74.26-2.47-.51-2.66-.26-.063-.45-.104-1.116-.11-.853-.008-1.574.003-1.98.21-.27.14-.48.45-.353.47.157.024.51.094.698.345.24.33.23 1.07.23 1.07s.14 2.05-.32 2.3c-.314.17-.744-.18-1.67-1.79-.47-.81-.83-1.71-.83-1.71s-.07-.17-.196-.26c-.15-.11-.36-.145-.36-.145l-2.29.015s-.344.01-.47.16c-.113.135-.009.414-.009.414s1.79 4.19 3.82 6.3c1.86 1.94 3.98 1.81 3.98 1.81h.96z"
      />
    </svg>
  );
}

function OkIcon() {
  return (
    <span className="text-xs font-extrabold tracking-tight" aria-hidden>
      OK
    </span>
  );
}

function MaxIcon() {
  return (
    <span className="text-[10px] font-bold leading-none" aria-hidden>
      MAX
    </span>
  );
}

/** Компактные виджеты шеринга: ВКонтакте, Одноклассники, MAX. */
export function ShareButtons({
  className,
  onNotify,
  getPostcardNode,
  postcardFileName,
}: ShareButtonsProps) {
  const url = getShareUrl();
  const maxUrl = getShareToMaxUrl(url);
  const okUrl = getShareToOKUrl(url);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <VkShareWidget
        label="ВКонтакте"
        background="#0077FF"
        onNotify={onNotify}
        getPostcardNode={getPostcardNode}
        postcardFileName={postcardFileName}
      >
        <VkIcon />
      </VkShareWidget>
      <ShareWidget href={okUrl} label="Одноклассниках" background="#EE8208">
        <OkIcon />
      </ShareWidget>
      <MaxShareWidget
        href={maxUrl}
        label="MAX"
        background="linear-gradient(135deg, #6C4BF5, #2A7FFF)"
        onNotify={onNotify}
      >
        <MaxIcon />
      </MaxShareWidget>
    </div>
  );
}
