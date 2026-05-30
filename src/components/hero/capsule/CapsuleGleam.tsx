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

export function CapsuleGleam() {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${CAPSULE_HEIGHT_CLASS} w-full`}
      style={maskStyle}
    >
      <div className="capsule-gleam capsule-gleam-a absolute left-[18%] top-[12%] h-[38%] w-[22%] rounded-full" />
      <div className="capsule-gleam capsule-gleam-b absolute right-[20%] top-[28%] h-[24%] w-[16%] rounded-full" />
    </div>
  );
}
