/** Форматирует номер послания в вид 000001. */
export function formatMessageNumber(value: number): string {
  return String(Math.max(0, Math.floor(value))).padStart(6, '0');
}

/** Форматирует дату в человекочитаемый русский формат. */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Короткая дата (дд.мм.гггг) для открытки. */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Разделяет большие числа неразрывными пробелами: 12 480. */
export function formatCount(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/**
 * Относительное время в человекочитаемом виде:
 * «только что», «5 минут назад», «сегодня в 18:43» или дата.
 */
export function formatRelativeTime(input: Date | string): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) {
    return `${diffMin} ${pluralRu(diffMin, 'минуту', 'минуты', 'минут')} назад`;
  }

  const isToday = date.toDateString() === new Date().toDateString();
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  if (isToday) return `сегодня в ${time}`;
  return `${formatShortDate(date.toISOString())} в ${time}`;
}

/** Русская плюрализация: pluralRu(2, 'год', 'года', 'лет') → 'года'. */
export function pluralRu(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

/** Обрезает текст до заданной длины с многоточием. */
export function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
