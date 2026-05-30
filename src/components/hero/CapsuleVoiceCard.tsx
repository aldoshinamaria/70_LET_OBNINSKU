import { Quote } from 'lucide-react';
import type { CapsuleVoice } from '@/data/sampleMessages';

interface CapsuleVoiceCardProps {
  voice: CapsuleVoice;
}

/**
 * Карточка живого послания — «экспонат будущего»: стекло, лёгкая прозрачность,
 * золотые акценты, дорогая типографика. Имя, категория, текст.
 */
export function CapsuleVoiceCard({ voice }: CapsuleVoiceCardProps) {
  return (
    <article className="glass-card relative w-full overflow-hidden rounded-3xl p-6 shadow-card sm:p-7">
      <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl" />

      <div className="flex items-center gap-2 text-primary/70">
        <Quote className="h-5 w-5" />
        <span className="text-[11px] uppercase tracking-[0.22em]">
          Голос из капсулы
        </span>
      </div>

      <p className="relative mt-4 font-display text-lg leading-relaxed text-text text-balance sm:text-xl">
        «{voice.text}»
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-display text-sm font-semibold text-primary">
          {voice.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{voice.name}</p>
          <p className="text-xs capitalize text-secondary">{voice.category}</p>
        </div>
      </div>
    </article>
  );
}
