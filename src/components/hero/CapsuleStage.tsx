import { AnimatePresence, motion } from 'framer-motion';
import { CapsuleVoiceCard } from './CapsuleVoiceCard';
import { LiveCounter } from './LiveCounter';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMessageCycle } from '@/hooks/useMessageCycle';
import {
  SAMPLE_LAST_MESSAGE_AT,
  SAMPLE_TOTAL_MESSAGES,
  sampleMessages,
  type CapsuleVoice,
} from '@/data/sampleMessages';
import heroCapsuleWebp from '@/assets/hero-capsule.webp';
import heroCapsuleJpg from '@/assets/hero-capsule.jpg';

interface CapsuleStageProps {
  voices?: readonly CapsuleVoice[];
  totalMessages?: number;
  lastMessageAt?: Date;
}

/**
 * Маска-виньетка. Круг инвариантен к повороту — при вращении капсулы
 * не возникает видимых прямоугольных краёв, изображение чисто растворяется в фоне.
 */
const CAPSULE_MASK =
  'radial-gradient(circle farthest-side at 50% 50%, #000 56%, rgba(0,0,0,0.55) 80%, transparent 97%)';

/** Едва заметные фрагменты «архива памяти» внутри стекла. */
const ARCHIVE_FRAGMENTS: ReadonlyArray<{ text: string; top: string; delay: number }> = [
  { text: 'сохранить дух города', top: '14%', delay: 0 },
  { text: 'рождаются открытия', top: '30%', delay: 1.4 },
  { text: 'первый наукоград', top: '46%', delay: 0.7 },
  { text: 'через 70 лет', top: '60%', delay: 2.1 },
  { text: 'я верю в будущее', top: '74%', delay: 1.0 },
];

export function CapsuleStage({
  voices = sampleMessages,
  totalMessages = SAMPLE_TOTAL_MESSAGES,
  lastMessageAt = SAMPLE_LAST_MESSAGE_AT,
}: CapsuleStageProps) {
  const reduced = usePrefersReducedMotion();
  const { phase, index, delivered } = useMessageCycle(voices.length, reduced);

  const voice = voices[index];
  const charged =
    phase === 'charging' ||
    phase === 'pulse' ||
    phase === 'beam' ||
    phase === 'show';
  const beamActive = phase === 'beam' || phase === 'show';
  const showCard = phase === 'show';

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      {/* Счётчик + социальное доказательство */}
      <div className="w-full max-w-xs lg:self-start">
        <LiveCounter
          total={totalMessages + delivered}
          lastMessageAt={lastMessageAt}
          animate={!reduced}
        />
      </div>

      {/* Сцена: капсула + луч + карточка */}
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-center lg:justify-center lg:gap-3">
        {/* Капсула */}
        <div className="relative h-[280px] w-[280px] shrink-0 sm:h-[320px] sm:w-[320px] lg:h-[300px] lg:w-[300px]">
          {/* Фоновое свечение позади капсулы */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-3xl"
            animate={reduced ? undefined : { opacity: charged ? 0.9 : 0.5 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* Медленно вращающаяся капсула (изображение из assets) */}
          <div
            className="absolute inset-0 animate-spin-slow motion-reduce:animate-none"
            style={{
              maskImage: CAPSULE_MASK,
              WebkitMaskImage: CAPSULE_MASK,
            }}
          >
            <picture>
              <source srcSet={heroCapsuleWebp} type="image/webp" />
              <img
                src={heroCapsuleJpg}
                alt="Капсула времени Обнинск-70 с посланиями жителей"
                className="h-full w-full object-cover object-center"
                width={360}
                height={360}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>

          {/* Архив памяти: фрагменты строк внутри стекла */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ maskImage: CAPSULE_MASK, WebkitMaskImage: CAPSULE_MASK }}
          >
            {ARCHIVE_FRAGMENTS.map((fragment) => (
              <motion.span
                key={fragment.text}
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[11px] italic tracking-wide text-primary/70"
                style={{ top: fragment.top }}
                initial={{ opacity: 0 }}
                animate={
                  reduced
                    ? { opacity: 0.1 }
                    : { opacity: [0, 0.16, 0.16, 0] }
                }
                transition={
                  reduced
                    ? undefined
                    : {
                        duration: 7,
                        times: [0, 0.3, 0.7, 1],
                        repeat: Infinity,
                        delay: fragment.delay,
                        ease: 'easeInOut',
                      }
                }
              >
                {fragment.text}
              </motion.span>
            ))}
          </div>

          {/* Внутреннее золотое свечение (усиливается на старте цикла) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(217,179,108,0.5), transparent 55%)',
              maskImage: CAPSULE_MASK,
              WebkitMaskImage: CAPSULE_MASK,
            }}
            animate={reduced ? { opacity: 0.15 } : { opacity: charged ? 0.7 : 0.18 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Золотой импульс */}
          <AnimatePresence>
            {!reduced && phase === 'pulse' && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60"
                initial={{ scale: 0.5, opacity: 0.7 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Световая линия капсула → карточка */}
        <Beam active={beamActive} reduced={reduced} />

        {/* Карточка живого послания */}
        <div className="flex min-h-[210px] w-full max-w-sm items-center lg:w-[280px]">
          <AnimatePresence mode="wait">
            {showCard && voice && (
              <motion.div
                key={voice.id}
                className="w-full"
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, x: 24, scale: 0.96 }
                }
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <CapsuleVoiceCard voice={voice} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface BeamProps {
  active: boolean;
  reduced: boolean;
}

/** Тонкая световая линия: горизонтальная на desktop, вертикальная иначе. */
function Beam({ active, reduced }: BeamProps) {
  return (
    <>
      {/* Desktop — горизонтальная */}
      <div className="relative hidden h-px w-8 shrink-0 overflow-visible lg:block">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: active ? 1 : 0.18,
            background:
              'linear-gradient(90deg, rgba(217,179,108,0.1), rgba(217,179,108,0.65), rgba(217,179,108,0.1))',
          }}
        />
        {!reduced && active && (
          <motion.span
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px] shadow-primary"
            initial={{ left: '0%', opacity: 0 }}
            animate={{ left: '100%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Tablet / Mobile — вертикальная */}
      <div className="relative h-9 w-px overflow-visible lg:hidden">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: active ? 1 : 0.18,
            background:
              'linear-gradient(180deg, rgba(217,179,108,0.1), rgba(217,179,108,0.65), rgba(217,179,108,0.1))',
          }}
        />
        {!reduced && active && (
          <motion.span
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px] shadow-primary"
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 0] }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
          />
        )}
      </div>
    </>
  );
}
