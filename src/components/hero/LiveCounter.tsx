import { Archive } from 'lucide-react';
import { useLiveCounter } from '@/hooks/useLiveCounter';
import { formatCount, formatRelativeTime, pluralRu } from '@/utils/format';

interface LiveCounterProps {
  total: number;
  lastMessageAt: Date;
  animate: boolean;
}

/**
 * Живой счётчик сохранённых посланий + социальное доказательство.
 * Число плавно анимируется; время последнего послания — относительное.
 */
export function LiveCounter({ total, lastMessageAt, animate }: LiveCounterProps) {
  const value = useLiveCounter(total, animate);

  return (
    <div className="glass-card flex flex-col gap-1 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-secondary">
        <Archive className="h-3.5 w-3.5 text-primary" />
        Уже сохранено
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
          {formatCount(value)}
        </span>
        <span className="text-sm text-secondary">
          {pluralRu(value, 'послание', 'послания', 'посланий')}
        </span>
      </div>
      <p className="text-xs text-secondary/80">
        Последнее послание · {formatRelativeTime(lastMessageAt)}
      </p>
    </div>
  );
}
