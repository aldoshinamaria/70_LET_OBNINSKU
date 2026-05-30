import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL ?? '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Корень проекта без хвоста /rest/v1 (иначе PostgREST отвечает 400). */
function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/i, '');
}

export function getSupabaseProjectUrl(): string {
  return supabaseUrl;
}

/** Supabase сконфигурирован, если заданы обе переменные окружения. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

/** Singleton-клиент Supabase (только при наличии env). */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }

  return client;
}
