import type { Message } from '@/types';

/**
 * Главные слова автора: приоритет у послания в 2096 год, затем пожелание
 * городу, затем образ будущего. Именно этот текст — герой экрана и открытки.
 */
export function primaryMessageText(message: Message): string {
  const candidates = [
    message.message_to_2096,
    message.wish_to_city,
    message.future_city,
  ];
  for (const text of candidates) {
    if (text && text.trim()) {
      return text.trim();
    }
  }
  return '';
}

/** Текст для открытки: в первую очередь пожелание городу. */
export function postcardMessageText(message: Message): string {
  const candidates = [
    message.wish_to_city,
    message.future_city,
    message.message_to_2096,
  ];
  for (const text of candidates) {
    if (text && text.trim()) return text.trim();
  }
  return '';
}

/** Подпись-источник для главного текста (что именно показываем). */
export function primaryMessageLabel(message: Message): string {
  if (message.message_to_2096 && message.message_to_2096.trim()) {
    return 'Послание жителям 2096 года';
  }
  if (message.wish_to_city && message.wish_to_city.trim()) {
    return 'Пожелание Обнинску';
  }
  return 'Каким я вижу Обнинск через 70 лет';
}
