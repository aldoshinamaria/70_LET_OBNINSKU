export type MessageStatus = 'pending' | 'approved' | 'rejected';

export type MessageCategory =
  | 'школьник'
  | 'студент'
  | 'педагог'
  | 'выпускник'
  | 'житель города'
  | 'другое';

export type MessageLocation =
  | 'Обнинск'
  | 'Калужская область'
  | 'другой регион России'
  | 'другая страна';

/** Запись послания в том виде, в котором она хранится в Supabase. */
export interface Message {
  id: string;
  message_number: number;
  name: string;
  category: MessageCategory;
  location: MessageLocation;
  wish_to_city: string;
  future_city: string;
  message_to_2096: string | null;
  created_at: string;
  status: MessageStatus;
}

/** Поля послания, которые сохраняются при создании (без серверных). */
export type MessageInsert = Omit<
  Message,
  'id' | 'message_number' | 'created_at' | 'status'
>;

/** Данные, которые отправляет форма (без серверных полей). */
export interface MessageFormData {
  name: string;
  category: MessageCategory;
  location: MessageLocation;
  wish_to_city: string;
  future_city: string;
  message_to_2096: string;
  consent: boolean;
}

/** Агрегированная статистика для блока со счётчиками. */
export interface ProjectStats {
  participants: number;
  messages: number;
  pupils: number;
  teachers: number;
  graduates: number;
  residents: number;
}

export interface StatCard {
  key: keyof ProjectStats;
  label: string;
}

/** Унифицированный результат операций с сервисами. */
export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
