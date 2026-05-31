import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import {
  ORBIT_RING_BOX_PX,
  computeOrbitRadius,
} from './useOrbitWishes';

function initialOrbitBoxPx(): number {
  if (typeof window === 'undefined') return ORBIT_RING_BOX_PX;
  return Math.min(window.innerWidth - 40, ORBIT_RING_BOX_PX);
}

interface OrbitLayout {
  hubRef: RefObject<HTMLDivElement>;
  radiusPx: number;
  stageMinHeightPx: number;
}

/** Измеряет бокс орбиты и подбирает радиус под мобильную ширину. */
export function useOrbitLayout(): OrbitLayout {
  const hubRef = useRef<HTMLDivElement>(null);
  const [boxPx, setBoxPx] = useState(initialOrbitBoxPx);

  useEffect(() => {
    const el = hubRef.current;
    if (!el) return;

    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setBoxPx(width);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const radiusPx = useMemo(() => computeOrbitRadius(boxPx), [boxPx]);
  const stageMinHeightPx = boxPx + 56;

  return { hubRef, radiusPx, stageMinHeightPx };
}
