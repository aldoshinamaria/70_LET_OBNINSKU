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

/** Дата для открытки: «30 мая 2026» без «г.» */
export function formatPostcardDate(isoDate: string): string {
  return formatDate(isoDate).replace(/\s*г\.?\s*$/u, '').trim();
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

/** Текст активности для блока статистики (обновляется по lastMessageAt). */
export function formatStatsActivity(isoDate: string | null): string {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) {
    return 'Капсула пополнилась новым голосом только что';
  }
  if (diffMin < 120) {
    return `Капсула пополнилась новым голосом ${diffMin} ${pluralRu(diffMin, 'минуту', 'минуты', 'минут')} назад`;
  }

  const isToday = date.toDateString() === new Date().toDateString();
  if (isToday) {
    return 'Последнее послание добавлено сегодня';
  }

  return `Последнее послание добавлено ${formatRelativeTime(isoDate)}`;
}

const NUMBER_WORDS_ONES = [
  '',
  'один',
  'два',
  'три',
  'четыре',
  'пять',
  'шесть',
  'семь',
  'восемь',
  'девять',
] as const;

const NUMBER_WORDS_TEENS = [
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
] as const;

const NUMBER_WORDS_TENS = [
  '',
  '',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
] as const;

const NUMBER_WORDS_HUNDREDS = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
] as const;

/** Число прописью (до 999) для эмоциональных подписей. */
export function numberToWordsRu(value: number): string {
  const n = Math.max(0, Math.floor(value));
  if (n === 0) return 'ноль';
  if (n >= 1000) return formatCount(n);

  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;

  if (hundreds > 0) {
    parts.push(NUMBER_WORDS_HUNDREDS[hundreds]);
  }

  if (rest >= 10 && rest < 20) {
    parts.push(NUMBER_WORDS_TEENS[rest - 10]);
  } else {
    const tens = Math.floor(rest / 10);
    const ones = rest % 10;
    if (tens > 0) parts.push(NUMBER_WORDS_TENS[tens]);
    if (ones > 0) parts.push(NUMBER_WORDS_ONES[ones]);
  }

  return parts.join(' ');
}

/** Склонение «житель уже оставил след». */
export function formatResidentsTrail(count: number): string {
  if (count === 0) {
    return 'Станьте первым, кто оставит свой след в истории Обнинска.';
  }

  const verb =
    count % 10 === 1 && count % 100 !== 11
      ? 'оставил'
      : 'оставили';
  const word = numberToWordsRu(count);
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
  return `${capitalized} ${pluralRu(count, 'житель', 'жителя', 'жителей')} уже ${verb} свой след в истории Обнинска.`;
}

/** Обрезает текст до заданной длины с многоточием. */
export function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}
