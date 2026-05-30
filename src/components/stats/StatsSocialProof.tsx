import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useLiveCounter } from '@/hooks/useLiveCounter';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { STAT_CATEGORY_CHIPS, SECTION_IDS } from '@/utils/constants';
import {
  formatCount,
  formatRelativeTime,
  formatResidentsTrail,
  formatStatsActivity,
} from '@/utils/format';
import { scrollToSection } from '@/utils/scroll';
import { cn } from '@/utils/cn';
import type { ProjectStats } from '@/types';

interface StatsSocialProofProps {
  stats: ProjectStats;
}

const ACTIVITY_TICK_MS = 30_000;

/**
 * Блок социального доказательства: слева — счётчик и активность,
 * справа (на desktop) — последнее послание, категории и призыв.
 */
export function StatsSocialProof({ stats }: StatsSocialProofProps) {
  const reduced = usePrefersReducedMotion();
  const total = useLiveCounter(stats.messages, !reduced);
  const [flash, setFlash] = useState(false);
  const [, setActivityTick] = useState(0);
  const prevMessages = useRef(stats.messages);

  const activity = formatStatsActivity(stats.lastMessageAt);
  const hasLast =
    Boolean(stats.lastMessageAt) &&
    Boolean(stats.lastMessageName) &&
    Boolean(stats.lastMessageQuote);

  const visibleChips = STAT_CATEGORY_CHIPS.filter(
    (chip) => stats[chip.key] > 0,
  );

  useEffect(() => {
    if (stats.messages > prevMessages.current) {
      setFlash(true);
      const timer = window.setTimeout(() => setFlash(false), 950);
      prevMessages.current = stats.messages;
      return () => window.clearTimeout(timer);
    }
    prevMessages.current = stats.messages;
  }, [stats.messages]);

  useEffect(() => {
    if (!stats.lastMessageAt) return;
    const id = window.setInterval(
      () => setActivityTick((t) => t + 1),
      ACTIVITY_TICK_MS,
    );
    return () => window.clearInterval(id);
  }, [stats.lastMessageAt]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14 sm:mt-20 lg:mt-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/[0.07] blur-3xl lg:left-1/4"
      />

      <div className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        {/* Левая колонка: счётчик, активность, кнопка */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left lg:pt-2">
          <div className="relative flex flex-col items-center gap-2 lg:items-start">
            <span
              className={cn(
                'font-display text-[4.5rem] font-semibold leading-none tabular-nums tracking-tight text-primary sm:text-[6.5rem] lg:text-[7rem] xl:text-[7.5rem]',
                flash && !reduced && 'stats-count-flash',
              )}
              aria-live="polite"
            >
              {formatCount(total)}
            </span>
            <p className="text-base font-medium tracking-wide text-secondary sm:text-lg">
              посланий уже сохранено
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary/90 sm:text-[15px]">
              {formatResidentsTrail(total)}
            </p>
          </div>

          {activity && (
            <p className="mt-8 flex items-center justify-center gap-2.5 text-sm text-secondary lg:justify-start">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary/70" />
              </span>
              {activity}
            </p>
          )}

          <Button
            size="lg"
            className="mt-10 hidden min-w-[18rem] lg:inline-flex"
            onClick={() => scrollToSection(SECTION_IDS.form)}
          >
            Отправить послание в 2096 год
          </Button>
        </div>

        {/* Правая колонка: последний голос, категории, призыв */}
        <div className="flex w-full flex-col lg:max-w-[26rem] lg:flex-1 lg:pt-2 xl:max-w-[28rem]">
          <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-secondary lg:text-left">
            Последний голос в капсуле
          </p>

          <AnimatePresence mode="wait">
            {hasLast ? (
              <motion.figure
                key={`${stats.lastMessageAt}-${stats.lastMessageQuote}`}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-2xl border-primary/20 px-6 py-7 text-left sm:px-8 sm:py-8"
              >
                <blockquote className="font-display text-lg leading-snug text-text sm:text-xl">
                  «{stats.lastMessageQuote}»
                </blockquote>
                <figcaption className="mt-5 flex flex-col gap-1">
                  <cite className="not-italic text-sm font-medium text-primary">
                    — {stats.lastMessageName}
                  </cite>
                  <time
                    dateTime={stats.lastMessageAt!}
                    className="text-sm text-secondary"
                  >
                    {formatRelativeTime(stats.lastMessageAt!)}
                  </time>
                </figcaption>
              </motion.figure>
            ) : (
              <motion.p
                key="empty-last"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm leading-relaxed text-secondary lg:text-left"
              >
                Здесь появится цитата из последнего послания — станьте первым
                автором в капсуле.
              </motion.p>
            )}
          </AnimatePresence>

          {visibleChips.length > 0 && (
            <ul className="mt-8 flex flex-col items-center gap-2 text-sm text-secondary lg:items-start">
              {visibleChips.map((chip) => (
                <li key={chip.key} className="tabular-nums">
                  <span className="mr-1.5" aria-hidden>
                    {chip.emoji}
                  </span>
                  {chip.label} — {formatCount(stats[chip.key])}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 text-center text-base leading-relaxed text-secondary lg:text-left">
            Следующее послание может стать вашим.
          </p>

          <Button
            size="lg"
            fullWidth
            className="mt-6 lg:hidden"
            onClick={() => scrollToSection(SECTION_IDS.form)}
          >
            Отправить послание в 2096 год
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
