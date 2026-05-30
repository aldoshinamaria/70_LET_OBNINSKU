import { useEffect, useState } from 'react';

export interface Countdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  isOpen: boolean;
}

/** Календарное разложение разницы во времени на годы/месяцы/дни/часы. */
function decompose(now: Date, target: Date): Countdown {
  if (target.getTime() <= now.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, isOpen: true };
  }

  let years = target.getFullYear() - now.getFullYear();
  let months = target.getMonth() - now.getMonth();
  let days = target.getDate() - now.getDate();
  let hours = target.getHours() - now.getHours();

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Кол-во дней в месяце, предшествующем месяцу цели
    const daysInPrevMonth = new Date(
      target.getFullYear(),
      target.getMonth(),
      0,
    ).getDate();
    days += daysInPrevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, isOpen: false };
}

/**
 * Живой обратный отсчёт до заданной даты.
 * Обновляется раз в минуту — этого достаточно для точности «до часа»
 * и не нагружает рендер.
 */
export function useCountdown(target: Date): Countdown {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return decompose(now, target);
}
