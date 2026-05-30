import { Link2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  copyToClipboard,
  getShareText,
  getShareToMaxUrl,
  getShareToOKUrl,
  getShareToVKUrl,
  getShareUrl,
} from '@/utils/share';

interface ShareButtonsProps {
  /** Уведомление для тоста (успех/ошибка). */
  onNotify: (text: string) => void;
}

interface ShareLinkProps {
  href: string;
  label: string;
  glyph: string;
  background: string;
  color?: string;
}

const linkBaseClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:-translate-y-px hover:shadow-card active:scale-[0.98] sm:py-3.5';

function ShareLink({ href, label, glyph, background, color }: ShareLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(linkBaseClass, 'border-transparent text-white')}
      style={{ background, color }}
      aria-label={`Поделиться в ${label}`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/15 text-xs font-bold">
        {glyph}
      </span>
      <span className="text-center leading-tight">Поделиться в {label}</span>
    </a>
  );
}

/**
 * Кнопки шеринга в соцсети — ведут на официальные страницы публикации
 * (ВКонтакте, MAX, Одноклассники).
 */
export function ShareButtons({ onNotify }: ShareButtonsProps) {
  const url = getShareUrl();
  const vkUrl = getShareToVKUrl(url);
  const maxUrl = getShareToMaxUrl(url);
  const okUrl = getShareToOKUrl(url);

  const handleCopy = async () => {
    const ok = await copyToClipboard(getShareText(url));
    onNotify(ok ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку');
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <ShareLink
          href={vkUrl}
          label="ВКонтакте"
          glyph="VK"
          background="#0077FF"
        />
        <ShareLink
          href={maxUrl}
          label="MAX"
          glyph="MAX"
          background="linear-gradient(135deg, #6C4BF5, #2A7FFF)"
        />
        <ShareLink
          href={okUrl}
          label="Одноклассниках"
          glyph="OK"
          background="#EE8208"
        />
      </div>

      <button
        type="button"
        onClick={() => void handleCopy()}
        className={cn(
          linkBaseClass,
          'border-primary/40 bg-primary/5 text-primary hover:bg-primary/10',
        )}
      >
        <Link2 className="h-5 w-5 shrink-0" />
        Скопировать ссылку на проект
      </button>
    </div>
  );
}
