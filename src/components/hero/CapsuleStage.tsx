import { motion } from 'framer-motion';
import { CapsuleOrbitRing } from './CapsuleOrbitRing';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useMessageCycle } from '@/hooks/useMessageCycle';
import { useOrbitWishes, ORBIT_RING_BOX_PX } from '@/hooks/useOrbitWishes';
import { CapsuleVolume } from './CapsuleVolume';
import { sampleMessages, type CapsuleVoice } from '@/data/sampleMessages';

interface CapsuleStageProps {
  voices?: readonly CapsuleVoice[];
}

export function CapsuleStage({ voices = sampleMessages }: CapsuleStageProps) {
  const reduced = usePrefersReducedMotion();
  const { phase } = useMessageCycle(voices.length, reduced);
  const orbitOffset = useOrbitWishes(voices.length, reduced);

  const charged =
    phase === 'charging' ||
    phase === 'pulse' ||
    phase === 'beam' ||
    phase === 'show';

  return (
    <div className="relative flex w-full min-w-0 flex-col items-center overflow-hidden">
      <div className="relative mx-auto w-full min-w-0 max-w-full lg:max-w-none">
        <div className="relative aspect-[3/4] min-h-[340px] w-full overflow-hidden sm:min-h-[420px] lg:min-h-[560px] xl:min-h-[620px]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={reduced ? undefined : { opacity: charged ? 0.85 : 0.45 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* Центр: капсула (2D) и орбита посланий */}
          <div
            className="capsule-stage-hub absolute left-1/2 top-1/2 max-w-[calc(100vw-2.5rem)]"
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
