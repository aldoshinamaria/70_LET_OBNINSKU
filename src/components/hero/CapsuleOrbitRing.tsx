import { CapsuleOrbitWish } from './CapsuleOrbitWish';
import {
  MAX_ORBIT_ITEMS,
  ORBIT_RADIUS_PX,
  ORBIT_TILT_X_DEG,
} from '@/hooks/useOrbitWishes';
import { useOrbitRotation } from '@/hooks/useOrbitRotation';
import type { CapsuleVoice } from '@/data/sampleMessages';

interface CapsuleOrbitRingProps {
  voices: readonly CapsuleVoice[];
  offset: number;
  reducedMotion: boolean;
}

export function CapsuleOrbitRing({
  voices,
  offset,
  reducedMotion,
}: CapsuleOrbitRingProps) {
  const count = Math.min(voices.length, MAX_ORBIT_ITEMS);
  const ringRotation = useOrbitRotation(!reducedMotion && count > 0);

  if (count === 0) return null;

  const step = 360 / count;

  return (
    <div
      className="capsule-orbit-layer pointer-events-none absolute inset-0 z-20"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${ORBIT_TILT_X_DEG}deg)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 rounded-[50%] border border-primary/15"
          style={{
            transform: 'rotateX(90deg) scale(1, 0.52)',
            boxShadow: 'inset 0 0 32px rgba(217,179,108,0.05)',
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${ringRotation}deg)`,
          }}
        >
          {Array.from({ length: count }, (_, slotIndex) => {
            const voice = voices[(offset + slotIndex) % voices.length];
            const angleDeg = step * slotIndex;

            return (
              <CapsuleOrbitWish
                key={`${slotIndex}-${voice.id}`}
                voice={voice}
                angleDeg={angleDeg}
                radiusPx={ORBIT_RADIUS_PX}
                ringRotationDeg={ringRotation}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
