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
    <div className="relative flex w-full flex-col items-center">
      <div className="relative mx-auto w-full max-w-full lg:max-w-none">
        <div className="relative aspect-[3/4] min-h-[360px] w-full overflow-visible sm:min-h-[420px] lg:min-h-[480px]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
            animate={reduced ? undefined : { opacity: charged ? 0.85 : 0.45 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />

          {/* Общий центр: капсула и орбита в одной 3D-сцене */}
          <div
            className="capsule-stage-hub absolute left-1/2 top-1/2 overflow-visible"
            style={{
              width: `min(${ORBIT_RING_BOX_PX}px, 98vw)`,
              height: `min(${ORBIT_RING_BOX_PX}px, 98vw)`,
              transform: 'translate(-50%, -50%)',
              perspective: '1400px',
              overflow: 'visible',
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
