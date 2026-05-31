import { CAPSULE_SWAY_DURATION_S } from './capsule/capsuleConstants';
import { CapsuleGleam } from './capsule/CapsuleGleam';
import { CapsuleHeroImage } from './capsule/CapsuleHeroImage';
import { CapsuleInnerGlow } from './capsule/CapsuleInnerGlow';

interface CapsuleVolumeProps {
  animate: boolean;
}

export function CapsuleVolume({ animate }: CapsuleVolumeProps) {
  return (
    <div className="capsule-volume-scene relative flex items-center justify-center">
      <div
        aria-hidden
        className="capsule-floor-shadow pointer-events-none absolute bottom-[4%] left-1/2 z-0 w-[46%] -translate-x-1/2"
      />

      <div className="capsule-volume-tilt relative">
        <div
          className={`capsule-volume-sway ${animate ? 'capsule-sway-3d' : ''}`}
          style={
            animate
              ? {
                  transformStyle: 'preserve-3d',
                  animationDuration: `${CAPSULE_SWAY_DURATION_S}s`,
                }
              : undefined
          }
        >
          <div className="relative flex h-[min(560px,84vh)] w-[min(420px,92vw)] items-center justify-center">
            <CapsuleInnerGlow />
            <CapsuleHeroImage />
            {animate && <CapsuleGleam />}
          </div>
        </div>
      </div>
    </div>
  );
}
