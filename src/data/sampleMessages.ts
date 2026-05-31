import { MAX_ORBIT_ITEMS } from '@/hooks/useOrbitWishes';
import type { Message } from '@/types';

/**
 * Унифицированная модель «голоса» для витрины капсулы.
 * Намеренно минимальна: имя, категория, текст. Именно её ожидает карточка,
 * поэтому источник данных (тестовый или Supabase) можно менять, не трогая UI.
 */
export interface CapsuleVoice {
  id: string;
  name: string;
  category: string;
  text: string;
}

/**
 * Тестовые послания для главного экрана. Звучат как реальные голоса жителей.
 * Позже заменяются данными из Supabase через `voicesFromMessages`.
 */
export const sampleMessages: readonly CapsuleVoice[] = [
  {
    id: 's1',
    name: 'Мария Алдошина',
    category: 'Педагог',
    text: 'Желаю Обнинску сохранить дух города, где рождаются открытия.',
  },
  {
    id: 's2',
    name: 'Дмитрий Соколов',
    category: 'Выпускник',
    text: 'Пусть наукоград остаётся местом, куда хочется возвращаться всю жизнь.',
  },
  {
    id: 's3',
    name: 'Анна Лебедева',
    category: 'Студент',
    text: 'Мечтаю, чтобы через 70 лет здесь учились мечтатели со всего мира.',
  },
  {
    id: 's4',
    name: 'Сергей Орлов',
    category: 'Житель города',
    text: 'Спасибо городу за детство у Протвы и за людей, которые верят в науку.',
  },
  {
    id: 's5',
    name: 'Екатерина Зимина',
    category: 'Школьник',
    text: 'Хочу, чтобы Обнинск всегда был светлым, зелёным и добрым городом.',
  },
  {
    id: 's6',
    name: 'Игорь Васнецов',
    category: 'Педагог',
    text: 'Пусть первый наукоград страны вдохновляет новые поколения исследователей.',
  },
];

/** Базовое тестовое число сохранённых посланий для живого счётчика. */
export const SAMPLE_TOTAL_MESSAGES = 12_486;

/**
 * Время последнего послания (социальное доказательство).
 * Сейчас тестовое; архитектура позволяет подставить реальную метку из БД.
 */
export const SAMPLE_LAST_MESSAGE_AT = new Date(Date.now() - 2 * 60_000);

/**
 * Адаптер Supabase → витрина. Когда подключится реальная база, достаточно
 * передать сюда массив одобренных `Message` — интерфейс карточки не изменится.
 */
export function voicesFromMessages(messages: readonly Message[]): CapsuleVoice[] {
  return messages.map((message) => ({
    id: message.id,
    name: message.name,
    category: message.category,
    text: message.wish_to_city || message.future_city,
  }));
}

/**
 * Голоса для орбиты в hero: сначала одобренные из БД, затем демо до {@link MAX_ORBIT_ITEMS}.
 * Без одобренных — `undefined`, и CapsuleStage подставит `sampleMessages` (5 слотов).
 */
export function buildHeroOrbitVoices(
  messages: readonly Message[],
): CapsuleVoice[] | undefined {
  const fromDb = voicesFromMessages(messages);
  if (fromDb.length === 0) return undefined;

  const merged: CapsuleVoice[] = [...fromDb];
  const seen = new Set(merged.map((v) => v.id));

  for (const sample of sampleMessages) {
    if (merged.length >= MAX_ORBIT_ITEMS) break;
    if (!seen.has(sample.id)) {
      merged.push(sample);
      seen.add(sample.id);
    }
  }

  return merged.slice(0, MAX_ORBIT_ITEMS);
}
