import { useEffect, useState } from 'react';

/** Сколько пожеланий одновременно на орбите (меньше — реже накладываются). */
export const MAX_ORBIT_ITEMS = 5;

/** Макс. символов в цитате на орбите. */
export const ORBIT_WISH_TEXT_MAX = 42;

/** Радиус орбиты (px) — послания дальше от капсулы, центр кольца = центр капсулы. */
export const ORBIT_RADIUS_PX = 218;

/** Размер бокса кольца (диаметр орбиты + запас под текст). */
export const ORBIT_RING_BOX_PX = ORBIT_RADIUS_PX * 2 + 150;

/**
 * Наклон плоскости орбиты (rotateX).
 * Отрицательный угол: подсвеченное послание (+Z) оказывается внизу капсулы.
 */
export const ORBIT_TILT_X_DEG = -50;

/** Смещение текста вниз от точки орбиты (подсвеченное послание — под капсулой). */
export const ORBIT_FRONT_TEXT_OFFSET_Y_PX = 8;

/**
 * Сдвигает набор посланий на орбите (какое пожелание в каком слоте).
 */
export function useOrbitWishes(count: number, reducedMotion: boolean): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (count <= 0) return;
    if (reducedMotion) return;

    const id = window.setInterval(() => {
      setOffset((prev) => (prev + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [count, reducedMotion]);

  return offset;
}
