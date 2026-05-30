import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Признак того, что Supabase сконфигурирован.
 * Если переменные не заданы — приложение работает в DEMO-режиме на localStorage,
 * а тяжёлый клиент Supabase вообще не загружается в браузер.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MESSAGES_TABLE = 'messages';

let clientPromise: Promise<SupabaseClient | null> | null = null;

/**
 * Ленивая инициализация клиента Supabase.
 * Сам пакет `@supabase/supabase-js` подгружается динамическим импортом
 * только когда он действительно нужен — это убирает ~54 КБ (gzip) из
 * критического пути загрузки главной страницы.
 */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) {
    return Promise.resolve(null);
  }
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      }),
    );
  }
  return clientPromise;
}
