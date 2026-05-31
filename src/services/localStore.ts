import type { Message, MessageInsert, MessageStatus } from '@/types';

/**
 * Демо-хранилище на localStorage. Полностью повторяет поведение Supabase:
 * номера посланий по возрастанию, статусы модерации, публикация на сайте.
 */

const STORAGE_KEY = 'obninsk70_demo_messages';

function safeUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isStorageAvailable(): boolean {
  try {
    const testKey = '__obninsk70_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function normalizeMessage(raw: Message): Message {
  return {
    ...raw,
    featured: Boolean(raw.featured),
  };
}

function readAll(): Message[] {
  if (!isStorageAvailable()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return (parsed as Message[]).map(normalizeMessage);
  } catch {
    return [];
  }
}

function writeAll(messages: Message[]): boolean {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return true;
  } catch {
    return false;
  }
}

function nextNumber(messages: Message[]): number {
  return messages.reduce((max, m) => Math.max(max, m.message_number), 0) + 1;
}

function byNewest(a: Message, b: Message): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

export function localCreateMessage(payload: MessageInsert): Message {
  const messages = readAll();
  const message: Message = {
    ...payload,
    id: safeUuid(),
    message_number: nextNumber(messages),
    created_at: new Date().toISOString(),
    status: 'pending',
    featured: false,
  };
  if (!writeAll([...messages, message])) {
    throw new Error('Не удалось сохранить послание в браузере.');
  }
  return message;
}

/** Послания для публичного раздела «Голос Обнинска» — только лучшие на сайте. */
export function localGetApprovedMessages(limit: number): Message[] {
  return readAll()
    .filter((m) => m.status === 'approved' && m.featured)
    .sort(byNewest)
    .slice(0, limit);
}

export function localGetAllMessages(): Message[] {
  return readAll().sort(byNewest);
}


export function localUpdateMessageStatus(
  id: string,
  status: MessageStatus,
): boolean {
  const messages = readAll();
  const exists = messages.some((m) => m.id === id);
  if (!exists) return false;
  const next = messages.map((m) => {
    if (m.id !== id) return m;
    const updated: Message = { ...m, status };
    if (status === 'rejected') updated.featured = false;
    return updated;
  });
  return writeAll(next);
}

/** Публикация / снятие с сайта (лучшие пожелания). */
export function localUpdateMessageFeatured(
  id: string,
  featured: boolean,
): boolean {
  const messages = readAll();
  const exists = messages.some((m) => m.id === id);
  if (!exists) return false;
  const next = messages.map((m) => {
    if (m.id !== id) return m;
    if (featured) {
      return { ...m, status: 'approved' as MessageStatus, featured: true };
    }
    return { ...m, featured: false };
  });
  return writeAll(next);
}

export function localDeleteMessage(id: string): boolean {
  const messages = readAll();
  const next = messages.filter((m) => m.id !== id);
  if (next.length === messages.length) return false;
  return writeAll(next);
}
