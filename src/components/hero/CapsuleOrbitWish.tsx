import type { CapsuleVoice } from '@/data/sampleMessages';
import {
  ORBIT_FRONT_TEXT_OFFSET_Y_PX,
  ORBIT_TILT_X_DEG,
  ORBIT_WISH_TEXT_MAX,
} from '@/hooks/useOrbitWishes';
import { orbitWishProminence } from '@/hooks/useOrbitRotation';
import { truncate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface CapsuleOrbitWishProps {
  voice: CapsuleVoice;
  angleDeg: number;
  radiusPx: number;
  ringRotationDeg: number;
  reducedMotion: boolean;
}

export function CapsuleOrbitWish({
  voice,
  angleDeg,
  radiusPx,
  ringRotationDeg,
  reducedMotion,
}: CapsuleOrbitWishProps) {
  const prominence = orbitWishProminence(angleDeg, ringRotationDeg);
  const atBottom = prominence >= 0.72;

  /** Разворот к зрителю + компенсация наклона орбиты (без scale — не сплющивает буквы). */
  const faceCamera = ` rotateY(${-(angleDeg + ringRotationDeg)}deg) rotateX(${-ORBIT_TILT_X_DEG}deg)`;

  const opacity = 0.45 + prominence * 0.55;
  const glow =
    prominence > 0.55
      ? `0 0 ${8 + prominence * 28}px rgba(217, 179, 108, ${0.25 + prominence * 0.45})`
      : 'none';

  const positionTransform = atBottom
    ? `translate(-50%, ${ORBIT_FRONT_TEXT_OFFSET_Y_PX}px)`
    : 'translate(-50%, -50%)';

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        transform: `rotateY(${angleDeg}deg) translateZ(${radiusPx}px)${faceCamera}`,
        zIndex: Math.round(10 + prominence * 20),
      }}
    >
      <figure
        className="w-[min(188px,36vw)] max-w-none origin-center sm:w-[208px]"
        style={{
          transform: positionTransform,
          opacity,
          textShadow: glow,
          transition: reducedMotion ? undefined : 'opacity 0.2s ease-out',
        }}
      >
        <blockquote
          className={cn(
            'line-clamp-2 text-center font-display text-[13px] italic leading-snug tracking-normal sm:text-[14px]',
            atBottom
              ? 'text-primary'
              : prominence > 0.45
                ? 'text-primary/80'
                : 'text-primary/60',
          )}
        >
          «{truncate(voice.text, ORBIT_WISH_TEXT_MAX)}»
        </blockquote>
        <figcaption
          className={cn(
            'mt-1 truncate text-center font-display text-[11px] tracking-normal sm:text-[12px]',
            atBottom ? 'text-primary-soft' : 'text-primary/50',
          )}
        >
          — {voice.name}
        </figcaption>
      </figure>
    </div>
  );
}
