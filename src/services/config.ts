import { isSupabaseConfigured } from './supabase';

/**
 * DEMO_MODE включается автоматически, когда не заданы переменные Supabase.
 * В этом режиме все данные хранятся в localStorage браузера, а проект
 * полностью работоспособен без бэкенда.
 */
export const DEMO_MODE = !isSupabaseConfigured;

/** Подсказка в админке, если на проде не зашиты ключи Supabase при сборке. */
export const SUPABASE_SETUP_STEPS = [
  'Создайте проект на supabase.com и выполните supabase/schema.sql в SQL Editor.',
  'В GitHub: Settings → Secrets and variables → Actions добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (ключ anon public из Project Settings → API).',
  'Сделайте push в main или перезапустите workflow Deploy — сайт пересоберётся с общей базой.',
] as const;

const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim();

/** Пароль входа на /admin (переопределяется через VITE_ADMIN_PASSWORD). */
export const ADMIN_PASSWORD = envAdminPassword || 'Kira13lublu';
