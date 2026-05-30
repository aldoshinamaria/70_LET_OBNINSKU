import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MessageCard } from '@/components/MessageCard';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import type { Message } from '@/types';

const CARD_WIDTH_PX = 300;
const CARD_GAP_PX = 16;
const SCROLL_STEP = CARD_WIDTH_PX + CARD_GAP_PX;
/** Скорость автопрокрутки: пикселей за кадр (~24px/с при 60fps). */
const AUTO_SCROLL_PX_PER_FRAME = 0.38;
const MANUAL_PAUSE_MS = 5000;

interface VoiceMessagesCarouselProps {
  messages: Message[];
}

export function VoiceMessagesCarousel({ messages }: VoiceMessagesCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const manualTimerRef = useRef<number | null>(null);

  const loopMessages = useMemo(
    () => (messages.length > 1 ? [...messages, ...messages] : messages),
    [messages],
  );

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarsePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pauseManual = useCallback(() => {
    setManualPaused(true);
    if (manualTimerRef.current) window.clearTimeout(manualTimerRef.current);
    manualTimerRef.current = window.setTimeout(() => {
      setManualPaused(false);
      manualTimerRef.current = null;
    }, MANUAL_PAUSE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (manualTimerRef.current) window.clearTimeout(manualTimerRef.current);
    };
  }, []);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      pauseManual();
      el.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
    },
    [pauseManual],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reduced || coarsePointer || messages.length < 2) return;
    if (hoverPaused || manualPaused) return;

    let raf = 0;
    const tick = () => {
      const node = scrollRef.current;
      if (!node) return;

      node.scrollLeft += AUTO_SCROLL_PX_PER_FRAME;
      const half = node.scrollWidth / 2;
      if (half > 0 && node.scrollLeft >= half) {
        node.scrollLeft -= half;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    reduced,
    coarsePointer,
    hoverPaused,
    manualPaused,
    messages.length,
  ]);

  const showControls = messages.length > 1;

  return (
    <>
      {/* Мобильные: вертикальный список — не обрезается overflow-x: clip */}
      <ul className="flex min-w-0 flex-col gap-4 sm:hidden">
        {messages.map((message) => (
          <li key={message.id} className="min-w-0">
            <MessageCard message={message} compact />
          </li>
        ))}
      </ul>

      {/* Планшет и desktop: горизонтальная лента */}
      <div className="relative hidden min-w-0 sm:block">
        {showControls && (
          <button
            type="button"
            aria-label="Предыдущие послания"
            onClick={() => scrollByStep(-1)}
            className={cn(
              'absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
              'border border-primary/35 bg-surface-elevated/95 text-primary shadow-card backdrop-blur-sm',
              'transition-all duration-300 hover:border-primary/60 hover:bg-primary/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
        )}

        {showControls && (
          <button
            type="button"
            aria-label="Следующие послания"
            onClick={() => scrollByStep(1)}
            className={cn(
              'absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full',
              'border border-primary/35 bg-surface-elevated/95 text-primary shadow-card backdrop-blur-sm',
              'transition-all duration-300 hover:border-primary/60 hover:bg-primary/10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        )}

        {showControls && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background via-background/80 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background via-background/80 to-transparent"
            />
          </>
        )}

        <div
          ref={scrollRef}
          className={cn(
            'no-scrollbar flex min-h-[228px] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2',
            '[touch-action:pan-x]',
            showControls ? 'scroll-px-12 px-12' : 'justify-center px-4',
          )}
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocus={() => setHoverPaused(true)}
          onBlur={() => setHoverPaused(false)}
          onTouchStart={() => pauseManual()}
        >
          {loopMessages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className="w-[300px] max-w-[calc(100%-6rem)] shrink-0 snap-center"
            >
              <MessageCard message={message} compact />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
