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

/** Текст для витрины капсулы и блока «Лучшие пожелания» (как на орбите). */
export function wishDisplayText(message: Message): string {
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

/** Все части послания для карточки «последний голос» (без обрезки). */
export function fullMessageText(
  message: Pick<Message, 'wish_to_city' | 'future_city' | 'message_to_2096'>,
): string {
  const parts: string[] = [];
  if (message.wish_to_city?.trim()) parts.push(message.wish_to_city.trim());
  if (message.future_city?.trim()) parts.push(message.future_city.trim());
  if (message.message_to_2096?.trim()) parts.push(message.message_to_2096.trim());
  return parts.join('\n\n');
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
