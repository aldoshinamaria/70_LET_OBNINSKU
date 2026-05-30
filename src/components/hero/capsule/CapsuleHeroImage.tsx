import capsuleWebp from '@/assets/capsule-vertical.webp';
import capsulePng from '@/assets/capsule-vertical.png';
import {
  CAPSULE_HEIGHT_CLASS,
  CAPSULE_IMG_HEIGHT,
  CAPSULE_IMG_WIDTH,
} from './capsuleConstants';

const imgClass = `${CAPSULE_HEIGHT_CLASS} w-auto max-w-[min(360px,88vw)] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]`;

/** Одно изображение капсулы — без второй «задней» плоскости. */
export function CapsuleHeroImage() {
  return (
    <picture className="relative z-[2] block">
      <source srcSet={capsuleWebp} type="image/webp" />
      <img
        src={capsulePng}
        alt="Капсула времени Обнинск-70"
        className={imgClass}
        width={CAPSULE_IMG_WIDTH}
        height={CAPSULE_IMG_HEIGHT}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
