import { useEffect, useRef, useState } from 'react';

/**
 * Плавный «живой» счётчик. Мягко догоняет целевое значение (easing),
 * без дёрганий и без перезагрузки. При изменении target — доезжает к новому.
 */
export function useLiveCounter(target: number, animate = true): number {
  const [value, setValue] = useState(animate ? 0 : target);
  const currentRef = useRef(animate ? 0 : target);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!animate) {
      currentRef.current = target;
      setValue(target);
      return;
    }

    const loop = () => {
      const diff = target - currentRef.current;
      if (Math.abs(diff) < 0.5) {
        currentRef.current = target;
        setValue(target);
        rafRef.current = 0;
        return;
      }
      currentRef.current += diff * 0.12;
      setValue(Math.round(currentRef.current));
      rafRef.current = requestAnimationFrame(loop);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, animate]);

  return value;
}
