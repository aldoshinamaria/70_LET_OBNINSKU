import { CapsuleGleam } from './capsule/CapsuleGleam';
import { CapsuleHeroImage } from './capsule/CapsuleHeroImage';
import { CapsuleInnerGlow } from './capsule/CapsuleInnerGlow';

interface CapsuleVolumeProps {
  animate: boolean;
}

/** Плоская капсула (PNG/WebP), без CSS/WebGL 3D. */
export function CapsuleVolume({ animate }: CapsuleVolumeProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        aria-hidden
        className="capsule-floor-shadow pointer-events-none absolute bottom-[4%] left-1/2 z-0 w-[46%] -translate-x-1/2"
      />

      <div className="relative flex h-[min(560px,84vh)] w-[min(420px,92vw)] items-center justify-center">
        <CapsuleInnerGlow />
        <CapsuleHeroImage />
        {animate && <CapsuleGleam />}
      </div>
    </div>
  );
}
