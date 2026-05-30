import { Link2 } from 'lucide-react';
import {
  copyToClipboard,
  getShareUrl,
  shareToMax,
  shareToOK,
  shareToVK,
} from '@/utils/share';

interface ShareButtonsProps {
  /** Уведомление для тоста (успех/ошибка). */
  onNotify: (text: string) => void;
}

interface ShareTarget {
  id: string;
  label: string;
  glyph: string;
  background: string;
  color?: string;
  onClick: (url: string) => void | Promise<void>;
}

export function ShareButtons({ onNotify }: ShareButtonsProps) {
  const url = getShareUrl();

  const targets: ShareTarget[] = [
    {
      id: 'vk',
      label: 'ВКонтакте',
      glyph: 'VK',
      background: '#0077FF',
      onClick: (link) => shareToVK(link),
    },
    {
      id: 'max',
      label: 'MAX',
      glyph: 'MAX',
      background: 'linear-gradient(135deg, #6C4BF5, #2A7FFF)',
      onClick: async (link) => {
        const result = await shareToMax(link);
        if (result === 'copied') onNotify('Ссылка скопирована — вставьте её в MAX');
        else if (result === 'failed') onNotify('Не удалось поделиться');
      },
    },
    {
      id: 'ok',
      label: 'Одноклассники',
      glyph: 'OK',
      background: '#EE8208',
      onClick: (link) => shareToOK(link),
    },
  ];

  const handleCopy = async () => {
    const ok = await copyToClipboard(url);
    onNotify(ok ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку');
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {targets.map((target) => (
        <button
          key={target.id}
          type="button"
          onClick={() => void target.onClick(url)}
          className="group flex flex-col items-center gap-2"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-active:scale-95"
            style={{ background: target.background, color: target.color }}
          >
            {target.glyph}
          </span>
          <span className="text-[11px] leading-tight text-secondary">
            {target.label}
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => void handleCopy()}
        className="group flex flex-col items-center gap-2"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary transition-transform duration-200 group-hover:-translate-y-1 group-active:scale-95">
          <Link2 className="h-5 w-5" />
        </span>
        <span className="text-[11px] leading-tight text-secondary">
          Скопировать
        </span>
      </button>
    </div>
  );
}
