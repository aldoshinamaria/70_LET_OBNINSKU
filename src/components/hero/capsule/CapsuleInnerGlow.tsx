import capsulePng from '@/assets/capsule-vertical.png';
import { CAPSULE_HEIGHT_CLASS } from './capsuleConstants';

const maskStyle = {
  WebkitMaskImage: `url(${capsulePng})`,
  maskImage: `url(${capsulePng})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
} as const;

export function CapsuleInnerGlow() {
  return (
    <div
      aria-hidden
      className={`capsule-inner-glow pointer-events-none absolute inset-0 ${CAPSULE_HEIGHT_CLASS} w-full`}
      style={maskStyle}
    />
  );
}
