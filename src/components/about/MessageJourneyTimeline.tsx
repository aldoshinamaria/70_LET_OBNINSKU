import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { JourneyIcon } from '@/components/about/JourneyIcon';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MESSAGE_JOURNEY } from '@/utils/constants';
import type { MessageJourneyPoint } from '@/utils/constants';
import { cn } from '@/utils/cn';

const PARTICLE_COUNT = 10;

interface JourneyStepProps {
  point: MessageJourneyPoint;
  index: number;
  onActivate: (index: number) => void;
}

function JourneyStep({ point, index, onActivate }: JourneyStepProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const isLeft = index % 2 === 0;
  const isClimax = Boolean(point.climax);
  const hasGlow = Boolean(point.glow);

  const inView = useInView(ref, {
    once: true,
    amount: 0.45,
    margin: '-8% 0px',
  });

  useEffect(() => {
    if (inView) onActivate(index);
  }, [inView, index, onActivate]);

  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 28 }
      }
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'relative flex items-start gap-6 pl-14 sm:pl-16',
        'lg:w-[calc(50%-2.5rem)] lg:pl-0',
        isLeft ? 'lg:mr-auto lg:pr-10 lg:text-right' : 'lg:ml-auto lg:pl-10',
        isClimax && 'lg:w-[calc(50%-1.5rem)]',
      )}
    >
      <span
        className={cn(
          'absolute left-6 top-6 z-20 flex -translate-x-1/2 items-center justify-center rounded-full border transition-all duration-700',
          'lg:left-1/2',
          inView
            ? 'border-primary/70 bg-primary/20 shadow-[0_0_20px_rgba(217,179,108,0.55)]'
            : 'border-primary/25 bg-surface-elevated/80',
          isClimax ? 'h-4 w-4' : 'h-3 w-3',
        )}
        aria-hidden
      >
        <span
          className={cn(
            'rounded-full bg-primary transition-transform duration-700',
            inView ? 'scale-100' : 'scale-75',
            isClimax ? 'h-2 w-2' : 'h-1.5 w-1.5',
          )}
        />
      </span>

      <motion.article
        initial={reduced || !isClimax ? false : { scale: 0.94, opacity: 0.85 }}
        animate={
          inView && isClimax && !reduced
            ? { scale: 1, opacity: 1 }
            : undefined
        }
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className={cn(
          'glass-card relative flex-1 overflow-hidden rounded-2xl border transition-all duration-700',
          inView ? 'border-primary/30' : 'border-border',
          hasGlow &&
            inView &&
            'shadow-[0_0_48px_rgba(217,179,108,0.22)] ring-1 ring-primary/25',
          isClimax &&
            'border-primary/45 shadow-[0_0_64px_rgba(217,179,108,0.28)] ring-1 ring-primary/35',
          isClimax
            ? 'origin-center scale-[1.08] p-7 sm:p-9 lg:scale-[1.25]'
            : 'p-6 sm:p-7',
        )}
      >
        {hasGlow && (
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute -inset-8 rounded-[2rem] bg-primary/10 blur-3xl transition-opacity duration-700',
              inView ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
        {isClimax && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent"
          />
        )}

        <div
          className={cn(
            'relative flex items-center gap-3',
            isLeft && 'lg:flex-row-reverse',
          )}
        >
          <span
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary',
              isClimax ? 'h-12 w-12' : 'h-10 w-10',
            )}
          >
            <JourneyIcon
              type={point.icon}
              className={isClimax ? 'h-6 w-6' : undefined}
            />
          </span>
          <span
            className={cn(
              'font-display font-semibold tabular-nums text-primary',
              isClimax ? 'text-3xl sm:text-4xl' : 'text-2xl',
            )}
          >
            {point.year}
          </span>
        </div>

        <h3
          className={cn(
            'relative mt-4 font-semibold text-text',
            isClimax ? 'text-xl sm:text-2xl' : 'text-lg',
          )}
        >
          {point.title}
        </h3>
        <p
          className={cn(
            'relative mt-2 leading-relaxed text-secondary',
            isClimax ? 'text-base sm:text-[17px]' : 'text-sm sm:text-[15px]',
          )}
        >
          {point.text}
        </p>
      </motion.article>
    </motion.div>
  );
}

export function MessageJourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [activeThrough, setActiveThrough] = useState(-1);

  const handleActivate = useCallback((index: number) => {
    setActiveThrough((prev) => Math.max(prev, index));
  }, []);

  const fillPercent =
    activeThrough < 0
      ? 0
      : ((activeThrough + 1) / MESSAGE_JOURNEY.length) * 100;

  return (
    <div ref={containerRef} className="relative mt-16 sm:mt-20 lg:mt-12">
      {/* Энергетический луч */}
      <div
        className="pointer-events-none absolute bottom-0 left-6 top-0 w-6 -translate-x-1/2 sm:left-8 lg:left-1/2"
        aria-hidden
      >
        <div className="journey-beam-halo absolute inset-y-0 left-1/2 w-16 -translate-x-1/2" />
        <div className="journey-beam-track absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full" />
        <motion.div
          className="journey-beam-fill absolute bottom-0 left-1/2 w-[3px] -translate-x-1/2 origin-bottom rounded-full"
          initial={false}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        {!reduced && (
          <>
            <div className="journey-beam-pulse absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2" />
            {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
              <span
                key={i}
                className="journey-beam-particle absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary/80"
                style={{
                  animationDelay: `${i * 0.55}s`,
                  top: `${8 + i * 8.5}%`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative flex flex-col gap-12 sm:gap-14 lg:gap-11">
        {MESSAGE_JOURNEY.map((point, index) => (
          <JourneyStep
            key={point.year}
            point={point}
            index={index}
            onActivate={handleActivate}
          />
        ))}
      </div>
    </div>
  );
}
