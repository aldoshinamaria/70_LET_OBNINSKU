import { CapsuleWishText } from '@/components/CapsuleWishText';
import {
  formatDate,
  formatMessageNumber,
  formatRelativeTime,
} from '@/utils/format';
import { cn } from '@/utils/cn';

export interface LastVoiceCapsuleData {
  quote: string;
  name: string;
  category: string;
  dateIso: string;
  messageNumber?: number | null;
}

interface LastVoiceCapsuleCardProps {
  voice: LastVoiceCapsuleData;
  className?: string;
}

/** Последнее одобренное послание — в общем стиле капсулы (стекло, золото, Caveat). */
export function LastVoiceCapsuleCard({ voice, className }: LastVoiceCapsuleCardProps) {
  const archiveDate = formatDate(voice.dateIso);
  const relative = formatRelativeTime(voice.dateIso);

  return (
    <figure
      className={cn(
        'glass-card relative w-full overflow-hidden rounded-2xl border-primary/20 px-5 py-6 text-left sm:rounded-3xl sm:px-7 sm:py-8',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl"
      />

      <CapsuleWishText
        text={voice.quote}
        name={voice.name}
        align="left"
        quoteClassName="whitespace-pre-wrap text-base leading-relaxed text-text [text-shadow:0_0_20px_rgba(217,179,108,0.15)] sm:text-lg"
        signatureClassName="mt-3 text-lg sm:text-xl"
      />

      <div className="relative mt-5 flex flex-col gap-2 border-t border-primary/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          {voice.category ? (
            <p className="text-[11px] capitalize tracking-wide text-primary/50">
              {voice.category}
            </p>
          ) : (
            <span />
          )}
          {voice.messageNumber != null && voice.messageNumber > 0 && (
            <span className="text-[10px] font-medium tabular-nums tracking-wider text-primary/35">
              № {formatMessageNumber(voice.messageNumber)}
            </span>
          )}
        </div>
        <time
          dateTime={voice.dateIso}
          className="text-xs text-secondary"
          title={archiveDate}
        >
          {archiveDate}
          <span className="text-secondary/70"> · {relative}</span>
        </time>
      </div>
    </figure>
  );
}
