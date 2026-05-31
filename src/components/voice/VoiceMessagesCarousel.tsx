import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { MessageCard } from '@/components/MessageCard';
import { filterVoiceMessages } from '@/components/voice/filterVoiceMessages';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import type { Message } from '@/types';

const CARD_WIDTH_PX = 300;
const CARD_GAP_PX = 16;
const AUTO_SCROLL_PX_PER_FRAME = 0.38;
const MANUAL_PAUSE_MS = 5000;

interface VoiceMessagesCarouselProps {
  messages: Message[];
}

function getCardWidthPx(viewportWidth: number): number {
  if (viewportWidth < 640) {
    return Math.min(280, Math.max(240, viewportWidth - 112));
  }
  return CARD_WIDTH_PX;
}

export function VoiceMessagesCarousel({ messages }: VoiceMessagesCarouselProps) {
  const reduced = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_PX);
  const manualTimerRef = useRef<number | null>(null);

  const filtered = useMemo(
    () => filterVoiceMessages(messages, searchQuery),
    [messages, searchQuery],
  );

  const loopMessages = useMemo(
    () => (filtered.length > 1 ? [...filtered, ...filtered] : filtered),
    [filtered],
  );

  const scrollStep = cardWidth + CARD_GAP_PX;

  useEffect(() => {
    const update = () => setCardWidth(getCardWidthPx(window.innerWidth));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [searchQuery, filtered.length]);

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

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    const index = Math.round(el.scrollLeft / scrollStep) % filtered.length;
    setActiveIndex(index);
  }, [filtered.length, scrollStep]);

  const scrollByStep = useCallback(
    (direction: -1 | 1) => {
      const el = scrollRef.current;
      if (!el) return;
      pauseManual();
      el.scrollBy({ left: direction * scrollStep, behavior: 'smooth' });
    },
    [pauseManual, scrollStep],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || reduced || searchQuery || filtered.length < 2) return;
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
      updateActiveIndex();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    reduced,
    hoverPaused,
    manualPaused,
    filtered.length,
    searchQuery,
    updateActiveIndex,
  ]);

  const showControls = filtered.length > 1;
  const positionLabel =
    filtered.length > 0
      ? `${Math.min(activeIndex + 1, filtered.length)} из ${filtered.length}`
      : null;

  return (
    <div className="min-w-0 space-y-4">
      <div className="mx-auto max-w-md sm:max-w-lg">
        <label className="sr-only" htmlFor="voice-search">
          Найти послание по имени или номеру
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/50"
            aria-hidden
          />
          <input
            id="voice-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Имя или № послания"
            autoComplete="off"
            className={cn(
              'w-full rounded-xl border border-primary/25 bg-surface-elevated/80 py-2.5 pl-10 pr-4',
              'text-sm text-text placeholder:text-secondary/70',
              'focus:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            )}
          />
        </div>
        <p className="mt-2 text-center text-xs leading-relaxed text-secondary sm:text-left">
          {searchQuery ? (
            filtered.length > 0 ? (
              <>
                Найдено: {filtered.length}. Листайте стрелками или свайпом влево‑вправо.
              </>
            ) : (
              'Ничего не найдено — проверьте имя или номер с открытки.'
            )
          ) : (
            <>
              Листайте послания свайпом или кнопками ← →. Чтобы найти своё — введите
              имя или номер послания.
            </>
          )}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-secondary">
          {messages.length === 0
            ? 'Пока нет опубликованных посланий.'
            : 'По вашему запросу посланий нет.'}
        </p>
      ) : (
        <div className="relative min-w-0">
          {showControls && (
            <>
              <button
                type="button"
                aria-label="Предыдущее послание"
                onClick={() => scrollByStep(-1)}
                className={cn(
                  'absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full sm:h-11 sm:w-11',
                  'border border-primary/35 bg-surface-elevated/95 text-primary shadow-card backdrop-blur-sm',
                  'transition-all duration-300 hover:border-primary/60 hover:bg-primary/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                )}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Следующее послание"
                onClick={() => scrollByStep(1)}
                className={cn(
                  'absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full sm:h-11 sm:w-11',
                  'border border-primary/35 bg-surface-elevated/95 text-primary shadow-card backdrop-blur-sm',
                  'transition-all duration-300 hover:border-primary/60 hover:bg-primary/10',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                )}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background via-background/85 to-transparent sm:w-16"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background via-background/85 to-transparent sm:w-16"
              />
            </>
          )}

          {positionLabel && showControls && (
            <p
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-full pt-2 text-center text-[11px] tabular-nums tracking-wide text-secondary"
              aria-live="polite"
            >
              {positionLabel}
            </p>
          )}

          <div
            ref={scrollRef}
            className={cn(
              'no-scrollbar flex min-h-[228px] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-2 pb-8',
              '[touch-action:pan-x]',
              showControls ? 'scroll-px-11 px-11 sm:scroll-px-12 sm:px-12' : 'justify-center px-4',
            )}
            onScroll={updateActiveIndex}
            onMouseEnter={() => setHoverPaused(true)}
            onMouseLeave={() => setHoverPaused(false)}
            onFocus={() => setHoverPaused(true)}
            onBlur={() => setHoverPaused(false)}
            onTouchStart={() => pauseManual()}
          >
            {loopMessages.map((message, index) => (
              <div
                key={`${message.id}-${index}`}
                className="shrink-0 snap-center"
                style={{
                  width: cardWidth,
                  maxWidth: 'calc(100vw - 5.5rem)',
                }}
              >
                <MessageCard message={message} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.length >= 60 && !searchQuery && (
        <p className="text-center text-xs text-secondary/80">
          На странице — последние опубликованные послания. Свежие появляются после
          модерации.
        </p>
      )}
    </div>
  );
}
