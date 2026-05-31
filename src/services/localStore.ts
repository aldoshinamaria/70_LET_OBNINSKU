import type { Message, MessageInsert, MessageStatus } from '@/types';
import { truncate } from '@/utils/format';

/**
 * Демо-хранилище на localStorage. Полностью повторяет поведение Supabase:
 * номера посланий по возрастанию, статусы модерации, публикация на сайте.
 */

const STORAGE_KEY = 'obninsk70_demo_messages';
const SEED_FLAG_KEY = 'obninsk70_demo_seeded';

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

/** Несколько живых демо-посланий, чтобы проект «дышал» без бэкенда. */
function buildSeed(): Message[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const seed: Array<
    Omit<Message, 'id' | 'message_number' | 'created_at'>
  > = [
    {
      name: 'Анна',
      category: 'педагог',
      location: 'Обнинск',
      wish_to_city:
        'Пусть Обнинск всегда остаётся городом учёных и мечтателей, где каждый ребёнок верит в большое будущее.',
      future_city:
        'Через 70 лет вижу зелёный город-сад с лабораториями мирового уровня и счастливыми людьми на улицах.',
      message_to_2096:
        'Берегите наследие первого наукограда. Мы верили в вас задолго до вашего рождения.',
      status: 'approved',
      featured: true,
    },
    {
      name: 'Дмитрий',
      category: 'выпускник',
      location: 'Калужская область',
      wish_to_city:
        'Желаю родному городу новых открытий, сильной науки и тёплых вечеров на берегу Протвы.',
      future_city:
        'Обнинск будущего — это умный город, где технологии служат людям, а парки соединяют поколения.',
      message_to_2096: '',
      status: 'approved',
      featured: true,
    },
    {
      name: 'Мария',
      category: 'студент',
      location: 'Обнинск',
      wish_to_city:
        'Пусть в городе появляется больше пространств для молодёжи, идей и смелых стартапов.',
      future_city:
        'Я мечтаю, что Обнинск станет центром науки, куда едут учиться со всего мира.',
      message_to_2096:
        'Если читаете это — значит, мечты сбываются. Продолжайте мечтать смелее нас.',
      status: 'approved',
      featured: true,
    },
    {
      name: 'Игорь',
      category: 'житель города',
      location: 'Обнинск',
      wish_to_city:
        'Желаю городу спокойствия, развития науки и бережного отношения к истории наукограда.',
      future_city:
        'Вижу Обнинск, где молодёжь остаётся в городе, а каждая улица хранит память о великих открытиях.',
      message_to_2096: '',
      status: 'approved',
      featured: false,
    },
    {
      name: 'Сергей',
      category: 'житель города',
      location: 'Обнинск',
      wish_to_city:
        'Спасибо городу за детство и за людей. Желаю Обнинску оставаться добрым и человечным.',
      future_city:
        'Вижу город, где сохранили историю первой АЭС и при этом смело шагнули в будущее.',
      message_to_2096: '',
      status: 'pending',
      featured: false,
    },
  ];

  return seed.map((item, index) => ({
    ...item,
    id: safeUuid(),
    message_number: index + 1,
    created_at: new Date(now - (seed.length - index) * day).toISOString(),
  }));
}

function readAll(): Message[] {
  if (!isStorageAvailable()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
      if (localStorage.getItem(SEED_FLAG_KEY) === 'done') {
        return [];
      }
      const seed = buildSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      localStorage.setItem(SEED_FLAG_KEY, 'done');
      return seed;
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
