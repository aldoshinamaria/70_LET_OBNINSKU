import { ScrollText } from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

export interface LastVoiceCapsuleData {
  quote: string;
  name: string;
  category: string;
  dateIso: string;
}

interface LastVoiceCapsuleCardProps {
  voice: LastVoiceCapsuleData;
  className?: string;
}

function formatCategoryLabel(category: string): string {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/** Архивная карточка последнего одобренного послания в капсуле. */
export function LastVoiceCapsuleCard({ voice, className }: LastVoiceCapsuleCardProps) {
  const archiveDate = formatDate(voice.dateIso);
  const relative = formatRelativeTime(voice.dateIso);

  return (
    <figure
      className={cn(
        'last-voice-archival relative overflow-hidden rounded-sm text-left',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-sm border border-primary/20"
      />
      <div
        aria-hidden
        className="last-voice-archival-texture pointer-events-none absolute inset-0 opacity-90"
      />

      <div className="relative px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex items-start justify-between gap-3 border-b border-primary/25 pb-4">
          <div className="flex items-center gap-2 text-primary/80">
            <ScrollText className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-[10px] font-medium uppercase tracking-[0.28em]">
              Архив капсулы · 2026
            </span>
          </div>
          <span
            className="shrink-0 rounded-sm border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary/90"
            aria-hidden
          >
            №
          </span>
        </div>

        <blockquote className="last-voice-archival-quote mt-5 font-display text-base leading-relaxed text-text/95 sm:text-lg">
          «{voice.quote}»
        </blockquote>

        <figcaption className="last-voice-archival-meta mt-6 border-t border-primary/20 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <cite className="not-italic font-medium text-primary">
              {voice.name}
            </cite>
            {voice.category && (
              <span className="text-xs capitalize text-secondary/90">
                {formatCategoryLabel(voice.category)}
              </span>
            )}
          </div>
          <time
            dateTime={voice.dateIso}
            className="mt-2 block text-xs text-secondary"
            title={archiveDate}
          >
            {archiveDate}
            <span className="text-secondary/70"> · {relative}</span>
          </time>
        </figcaption>
      </div>
    </figure>
  );
}
