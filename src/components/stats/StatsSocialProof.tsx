import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useLiveCounter } from '@/hooks/useLiveCounter';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { STAT_CATEGORY_CHIPS, SECTION_IDS } from '@/utils/constants';
import { LastVoiceCapsuleCard } from '@/components/stats/LastVoiceCapsuleCard';
import {
  formatCount,
  formatResidentsTrail,
  formatStatsActivity,
} from '@/utils/format';
import { scrollToSection } from '@/utils/scroll';
import { cn } from '@/utils/cn';
import type { ProjectStats } from '@/types';

interface StatsSocialProofProps {
  stats: ProjectStats;
  loading?: boolean;
  error?: string | null;
}

const ACTIVITY_TICK_MS = 30_000;

/**
 * Блок социального доказательства: слева — счётчик и активность,
 * справа (на desktop) — последнее послание, категории и призыв.
 */
export function StatsSocialProof({
  stats,
  loading = false,
  error = null,
}: StatsSocialProofProps) {
  const reduced = usePrefersReducedMotion();
  const total = useLiveCounter(stats.messages, !reduced);
  const [flash, setFlash] = useState(false);
  const [, setActivityTick] = useState(0);
  const prevMessages = useRef(stats.messages);
  const prevLastKey = useRef<string | null>(null);
  const [lastVoiceFlash, setLastVoiceFlash] = useState(false);

  const activity = formatStatsActivity(stats.lastMessageAt);
  const hasLast =
    Boolean(stats.lastMessageAt) &&
    Boolean(stats.lastMessageName) &&
    Boolean(stats.lastMessageQuote);

  const visibleChips = STAT_CATEGORY_CHIPS.filter(
    (chip) => stats[chip.key] > 0,
  );

  const lastVoiceKey = hasLast
    ? `${stats.lastMessageAt}-${stats.lastMessageName}-${stats.lastMessageQuote}`
    : null;

  useEffect(() => {
    if (!lastVoiceKey || lastVoiceKey === prevLastKey.current) return;
    if (prevLastKey.current !== null) {
      setLastVoiceFlash(true);
      const timer = window.setTimeout(() => setLastVoiceFlash(false), 1200);
      prevLastKey.current = lastVoiceKey;
      return () => window.clearTimeout(timer);
    }
    prevLastKey.current = lastVoiceKey;
  }, [lastVoiceKey]);

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

      <div className="relative flex min-w-0 flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        {/* Счётчик: на мобильных — цифра и подпись; два длинных текста — только lg+ */}
        <div className="flex min-w-0 flex-1 flex-col items-center text-center lg:items-start lg:text-left lg:pt-2">
          <div className="relative flex flex-col items-center gap-2 lg:items-start">
            <span
              className={cn(
                'font-display text-[3.25rem] font-semibold leading-none tabular-nums tracking-tight text-primary min-[400px]:text-[4.5rem] sm:text-[6.5rem] lg:text-[7rem] xl:text-[7.5rem]',
                flash && !reduced && 'stats-count-flash',
              )}
              aria-live="polite"
            >
              {formatCount(total)}
            </span>
            <p className="text-base font-medium tracking-wide text-secondary sm:text-lg">
              посланий уже сохранено
            </p>
            <p className="mt-3 hidden max-w-md text-sm leading-relaxed text-secondary/90 lg:block sm:text-[15px]">
              {formatResidentsTrail(total)}
            </p>
          </div>

          {error && (
            <p className="mt-6 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          {activity && !loading && !error && (
            <p className="mt-8 hidden items-center justify-center gap-2.5 text-sm text-secondary lg:flex lg:justify-start">
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

        {/* Последний голос в капсуле */}
        <div className="flex w-full min-w-0 flex-col lg:max-w-[26rem] lg:flex-1 lg:pt-2 xl:max-w-[28rem]">
          <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-secondary lg:mb-5 lg:text-left">
            Последний голос в капсуле
          </p>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.p
                key="loading-last"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-secondary animate-pulse lg:text-left"
              >
                Загрузка последнего послания…
              </motion.p>
            ) : hasLast ? (
              <motion.div
                key={lastVoiceKey!}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  lastVoiceFlash && !reduced && 'last-voice-card-flash',
                )}
              >
                <LastVoiceCapsuleCard
                  voice={{
                    quote: stats.lastMessageQuote!,
                    name: stats.lastMessageName!,
                    category: stats.lastMessageCategory ?? '',
                    dateIso: stats.lastMessageAt!,
                    messageNumber: stats.lastMessageNumber,
                  }}
                />
              </motion.div>
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

          {visibleChips.length > 0 && !loading && (
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
            className="mt-6 max-lg:inline-flex lg:hidden"
            onClick={() => scrollToSection(SECTION_IDS.form)}
          >
            Отправить послание в 2096 год
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
