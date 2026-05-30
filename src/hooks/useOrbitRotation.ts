import { useEffect, useState } from 'react';

/** Полный оборот орбиты посланий (~2 мин). */
export const ORBIT_DURATION_MS = 120_000;

/**
 * Яркость послания 0–1: максимум внизу капсулы (мировой угол ≈ 0°),
 * минимум сзади. Плавный переход без «пропадания».
 */
export function orbitWishProminence(
  slotAngleDeg: number,
  ringRotationDeg: number,
): number {
  const worldDeg =
    ((slotAngleDeg + ringRotationDeg) % 360 + 360) % 360;
  const worldRad = (worldDeg * Math.PI) / 180;
  const raw = (1 + Math.cos(worldRad)) / 2;
  return raw ** 0.72;
}

/** Для совместимости: «впереди» = близко к низу капсулы. */
export function isWishInFront(
  slotAngleDeg: number,
  ringRotationDeg: number,
): boolean {
  return orbitWishProminence(slotAngleDeg, ringRotationDeg) >= 0.72;
}

export function useOrbitRotation(active: boolean): number {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) % ORBIT_DURATION_MS;
      setRotation((elapsed / ORBIT_DURATION_MS) * 360);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return rotation;
}
