import { motion } from 'framer-motion';
import { CapsuleOrbitRing } from './CapsuleOrbitRing';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMessageCycle } from '@/hooks/useMessageCycle';
import { ORBIT_RING_BOX_PX, useOrbitWishes } from '@/hooks/useOrbitWishes';
import { useOrbitLayout } from '@/hooks/useOrbitLayout';
import { CapsuleVolume } from './CapsuleVolume';
import { sampleMessages, type CapsuleVoice } from '@/data/sampleMessages';

interface CapsuleStageProps {
  voices?: readonly CapsuleVoice[];
}

export function CapsuleStage({ voices = sampleMessages }: CapsuleStageProps) {
  const reduced = usePrefersReducedMotion();
  const { phase } = useMessageCycle(voices.length, reduced);
  const orbitOffset = useOrbitWishes(voices.length, reduced);
  const { hubRef, radiusPx, stageMinHeightPx } = useOrbitLayout();

  const charged =
    phase === 'charging' ||
    phase === 'pulse' ||
    phase === 'beam' ||
    phase === 'show';

  return (
    <div className="relative flex w-full min-w-0 flex-col items-center overflow-visible">
      <div className="relative mx-auto w-full min-w-0 max-w-full lg:max-w-none">
        <div
          className="relative w-full overflow-visible pb-4 sm:aspect-[3/4] sm:min-h-[420px] sm:overflow-hidden sm:pb-0 lg:min-h-[560px] xl:min-h-[620px]"
          style={{ minHeight: stageMinHeightPx }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={reduced ? undefined : { opacity: charged ? 0.85 : 0.45 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          <div
            ref={hubRef}
            className="capsule-stage-hub absolute left-1/2 top-[47%] max-w-[calc(100vw-2.5rem)] sm:top-1/2"
            style={{
              width: `min(calc(100vw - 2.5rem), ${ORBIT_RING_BOX_PX}px)`,
              height: `min(calc(100vw - 2.5rem), ${ORBIT_RING_BOX_PX}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CapsuleOrbitRing
              voices={voices}
              offset={orbitOffset}
              reducedMotion={reduced}
              radiusPx={radiusPx}
            />

            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <CapsuleVolume animate={!reduced} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
