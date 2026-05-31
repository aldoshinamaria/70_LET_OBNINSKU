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
/** Публичный домен (см. public/CNAME). */
export const PROJECT_DOMAIN = 'obninsk70.ru';
export const PROJECT_SHARE_TEXT =
  'Я отправил(а) послание в будущее в цифровую капсулу времени Обнинск-70. Оставь своё и стань частью истории города 💛';

/** Исторический текст на экране успеха (две строки). */
export const HISTORY_NOTE = [
  'Когда жители Обнинска отмечали 70-летие города,',
  'они оставили эти послания будущим поколениям.',
] as const;

/** Сообщение после успешной отправки формы. */
export const FORM_SUBMIT_SUCCESS_MESSAGE =
  'Ваше послание сохранено в цифровой капсуле времени';

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

/** Карточки по категориям (общий счётчик — отдельный блок выше). */
export const STAT_CARDS: readonly StatCard[] = [
  { key: 'pupils', label: 'Школьников' },
  { key: 'teachers', label: 'Педагогов' },
  { key: 'graduates', label: 'Выпускников' },
  { key: 'residents', label: 'Жителей' },
];

/** Компактные метки категорий для блока социального доказательства. */
export const STAT_CATEGORY_CHIPS = [
  { key: 'teachers' as const, emoji: '👨‍🏫', label: 'Педагоги' },
  { key: 'graduates' as const, emoji: '🎓', label: 'Выпускники' },
  { key: 'residents' as const, emoji: '🏙', label: 'Жители' },
  { key: 'pupils' as const, emoji: '🎒', label: 'Школьники' },
] as const;

/** Ключи разделов для плавной навигации. */
export const SECTION_IDS = {
  hero: 'hero',
  stats: 'stats',
  about: 'about',
  form: 'form',
  voice: 'voice',
} as const;

export type MessageJourneyIcon =
  | 'atom'
  | 'capsule'
  | 'clock'
  | 'hourglass'
  | 'scroll';

export interface MessageJourneyPoint {
  year: string;
  title: string;
  text: string;
  icon: MessageJourneyIcon;
  /** Карточка «Послание отправлено» — мягкое золотое свечение. */
  glow?: boolean;
  /** Финальная точка пути — кульминация блока. */
  climax?: boolean;
}

/** Лента пути послания: от истоков наукограда до открытия капсулы в 2096. */
export const MESSAGE_JOURNEY: readonly MessageJourneyPoint[] = [
  {
    year: '1954',
    title: 'Первая в мире АЭС',
    text: 'Мирный атом становится символом города.',
    icon: 'atom',
  },
  {
    year: '1956',
    title: 'Рождение Обнинска',
    text: 'Первый наукоград России начинает свою историю.',
    icon: 'scroll',
  },
  {
    year: '1960–1980',
    title: 'Город науки',
    text: 'В Обнинске развиваются научные институты и технологии будущего.',
    icon: 'clock',
  },
  {
    year: '2026',
    title: 'Обнинску 70 лет',
    text: 'Жители создают цифровую капсулу времени для потомков.',
    icon: 'capsule',
    glow: true,
  },
  {
    year: '2061',
    title: '35 лет спустя',
    text: 'Половина пути пройдена.',
    icon: 'hourglass',
  },
  {
    year: '2096',
    title: 'Капсула открывается',
    text: 'Жители будущего читают послания поколения 2026 года.',
    icon: 'scroll',
    climax: true,
  },
];
