import { useEffect, useState } from 'react';

/**
 * Фазы строго по сценарию появления послания:
 *  charging — капсула подсвечивается изнутри;
 *  pulse    — золотой импульс;
 *  beam     — световая линия от капсулы к карточке;
 *  show     — карточка реального послания видна (5–6 c);
 *  hide     — карточка исчезает;
 *  idle     — пауза перед следующим циклом.
 */
export type CapsulePhase =
  | 'charging'
  | 'pulse'
  | 'beam'
  | 'show'
  | 'hide'
  | 'idle';

interface SequenceStep {
  phase: CapsulePhase;
  duration: number;
}

const SEQUENCE: readonly SequenceStep[] = [
  { phase: 'charging', duration: 1000 },
  { phase: 'pulse', duration: 700 },
  { phase: 'beam', duration: 900 },
  { phase: 'show', duration: 5600 },
  { phase: 'hide', duration: 700 },
  { phase: 'idle', duration: 2600 },
];

export interface CapsuleCycle {
  phase: CapsulePhase;
  /** Индекс текущего показываемого послания. */
  index: number;
  /** Сколько посланий «доставлено» с момента запуска (для счётчика). */
  delivered: number;
}

/**
 * Оркестратор живого цикла капсулы. Без motion-эффектов (reduced motion)
 * просто мягко меняет послания, не запуская импульсы и лучи.
 */
export function useMessageCycle(
  count: number,
  reducedMotion: boolean,
): CapsuleCycle {
  const [state, setState] = useState<CapsuleCycle>({
    phase: 'idle',
    index: 0,
    delivered: 0,
  });

  useEffect(() => {
    if (count <= 0) return;

    if (reducedMotion) {
      setState({ phase: 'show', index: 0, delivered: 1 });
      const id = window.setInterval(() => {
        setState((prev) => ({
          phase: 'show',
          index: (prev.index + 1) % count,
          delivered: prev.delivered + 1,
        }));
      }, 6000);
      return () => window.clearInterval(id);
    }

    let step = 0;
    let timer = 0;

    const tick = () => {
      const current = SEQUENCE[step];
      setState((prev) => {
        // На входе в показ берём следующее послание и засчитываем доставку.
        if (current.phase === 'show') {
          return {
            phase: 'show',
            index: prev.index,
            delivered: prev.delivered + 1,
          };
        }
        return { ...prev, phase: current.phase };
      });

      timer = window.setTimeout(() => {
        const wasLast = step === SEQUENCE.length - 1;
        step = (step + 1) % SEQUENCE.length;
        if (wasLast) {
          setState((prev) => ({ ...prev, index: (prev.index + 1) % count }));
        }
        tick();
      }, current.duration);
    };

    tick();
    return () => window.clearTimeout(timer);
  }, [count, reducedMotion]);

  return state;
}
