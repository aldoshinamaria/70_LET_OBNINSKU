import type {
  MessageCategory,
  MessageLocation,
  StatCard,
} from '@/types';

export const PROJECT_NAME = 'Капсула времени Обнинск-70';
export const AUTHOR_SIGNATURE = 'MA.digital | Мария Алдошина';
export const AUTHOR_CREDIT = 'MA.digital';

export const CAPSULE_OPEN_YEAR = 2096;
export const PROJECT_YEAR = 2026;
export const CITY_ANNIVERSARY = 70;

/** Точная дата открытия капсулы: 30 июля 2096 года. */
export const CAPSULE_OPEN_DATE = new Date(2096, 6, 30, 0, 0, 0);
export const CAPSULE_OPEN_DATE_LABEL = '30 июля 2096 года';

/**
 * Публичный адрес проекта для открытки и кнопки «Поделиться».
 * Замените на реальный домен после деплоя.
 */
export const PROJECT_DOMAIN = 'obninsk-70.ru';
export const PROJECT_SHARE_TEXT =
  'Я отправил послание в будущее в цифровой капсуле времени Обнинск-70. Оставь своё и стань частью истории города 💛';

/** Исторический текст на экране успеха. */
export const HISTORY_NOTE =
  'Когда жители Обнинска отмечали 70-летие города, они оставили эти послания будущим поколениям.';

export const FORM_LIMITS = {
  nameMax: 40,
  wishMin: 20,
  wishMax: 400,
  futureMin: 20,
  futureMax: 400,
  messageMax: 400,
} as const;

export const CATEGORY_OPTIONS: readonly MessageCategory[] = [
  'школьник',
  'студент',
  'педагог',
  'выпускник',
  'житель города',
  'другое',
];

export const LOCATION_OPTIONS: readonly MessageLocation[] = [
  'Обнинск',
  'Калужская область',
  'другой регион России',
  'другая страна',
];

export const STAT_CARDS: readonly StatCard[] = [
  { key: 'participants', label: 'Участников' },
  { key: 'messages', label: 'Посланий' },
  { key: 'pupils', label: 'Школьников' },
  { key: 'teachers', label: 'Педагогов' },
  { key: 'graduates', label: 'Выпускников' },
  { key: 'residents', label: 'Жителей' },
];

/** Ключи разделов для плавной навигации. */
export const SECTION_IDS = {
  hero: 'hero',
  stats: 'stats',
  about: 'about',
  form: 'form',
  voice: 'voice',
} as const;

export interface TimelinePoint {
  year: string;
  title: string;
  text: string;
}

export const TIMELINE: readonly TimelinePoint[] = [
  {
    year: '1956',
    title: 'Рождение наукограда',
    text: 'Обнинск становится первым городом, где мирный атом начал служить людям.',
  },
  {
    year: '2026',
    title: '70 лет городу',
    text: 'Жители пишут послания и запечатывают их в цифровую капсулу времени.',
  },
  {
    year: '2061',
    title: 'Капсула в пути',
    text: 'Город растёт, а голоса его жителей продолжают звучать сквозь десятилетия.',
  },
  {
    year: '2096',
    title: 'Капсула открывается',
    text: 'Будущие поколения читают послания, написанные сегодня. Связь времён замкнётся.',
  },
];
