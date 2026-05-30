import { Quote } from 'lucide-react';
import { formatDate, formatMessageNumber } from '@/utils/format';
import type { Message } from '@/types';

interface MessageCardProps {
  message: Message;
}

export function MessageCard({ message }: MessageCardProps) {
  const text = message.wish_to_city || message.future_city;
  return (
    <article className="glass-card flex h-full flex-col gap-5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <Quote className="h-7 w-7 shrink-0 text-primary/50" />
        <span className="rounded-full border border-primary/20 px-3 py-1 text-xs font-medium tabular-nums text-primary">
          № {formatMessageNumber(message.message_number)}
        </span>
      </div>

      <p className="flex-1 text-base leading-relaxed text-text/90">{text}</p>

      <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="truncate font-semibold">{message.name}</p>
          <p className="text-xs capitalize text-secondary">{message.category}</p>
        </div>
        <span className="shrink-0 text-xs text-secondary/70">
          {formatDate(message.created_at)}
        </span>
      </div>
    </article>
  );
}
