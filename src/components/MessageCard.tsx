import { CapsuleWishText } from '@/components/CapsuleWishText';
import { formatMessageNumber } from '@/utils/format';
import { wishDisplayText } from '@/utils/message';
import type { Message } from '@/types';

interface MessageCardProps {
  message: Message;
  /** Компактная карточка для горизонтальной ленты. */
  compact?: boolean;
}

export function MessageCard({ message, compact = false }: MessageCardProps) {
  const text = wishDisplayText(message);

  return (
    <article
      className={
        compact
          ? 'glass-card flex min-h-[220px] w-full flex-col items-center justify-center gap-4 rounded-2xl border-primary/20 px-4 py-5 text-center'
          : 'glass-card flex h-full flex-col items-center justify-between gap-6 rounded-2xl border-primary/20 px-6 py-8 text-center transition-all duration-300 hover:border-primary/35 hover:shadow-[0_0_36px_rgba(217,179,108,0.14)] sm:px-7 sm:py-9'
      }
    >
      <CapsuleWishText
        text={text}
        name={message.name}
        quoteClassName={
          compact
            ? 'line-clamp-3 text-sm leading-snug [text-shadow:0_0_20px_rgba(217,179,108,0.18)]'
            : 'text-base leading-relaxed sm:text-lg [text-shadow:0_0_24px_rgba(217,179,108,0.2)]'
        }
        signatureClassName={compact ? 'mt-2 text-lg sm:text-xl' : 'mt-3'}
      />

      <div
        className={
          compact
            ? 'flex w-full flex-col items-center gap-0.5 pt-1'
            : 'flex w-full flex-col items-center gap-1 border-t border-primary/10 pt-4'
        }
      >
        <p className="text-[11px] capitalize tracking-wide text-primary/45">
          {message.category}
        </p>
        <span className="text-[10px] font-medium tabular-nums tracking-wider text-primary/35">
          № {formatMessageNumber(message.message_number)}
        </span>
      </div>
    </article>
  );
}
