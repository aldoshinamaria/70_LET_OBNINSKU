import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

export { isSupabaseConfigured };

export const MESSAGES_TABLE = 'messages';

/** Клиент Supabase для сервисов данных (совместимость с существующим API). */
export function getSupabase(): Promise<SupabaseClient | null> {
  return Promise.resolve(getSupabaseClient());
}
