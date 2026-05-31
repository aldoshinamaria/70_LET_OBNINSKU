import { formatMessageNumber } from '@/utils/format';
import type { Message } from '@/types';

/** Поиск по имени автора или номеру послания (например «42» или «000042»). */
export function filterVoiceMessages(
  messages: Message[],
  query: string,
): Message[] {
  const trimmed = query.trim();
  if (!trimmed) return messages;

  const lower = trimmed.toLowerCase();
  const digits = trimmed.replace(/\D/g, '');

  return messages.filter((message) => {
    if (message.name.toLowerCase().includes(lower)) return true;
    if (!digits) return false;
    if (String(message.message_number).includes(digits)) return true;
    return formatMessageNumber(message.message_number).includes(digits);
  });
}
