import { isSupabaseConfigured } from './supabase';

/**
 * DEMO_MODE включается автоматически, когда не заданы переменные Supabase.
 * В этом режиме все данные хранятся в localStorage браузера, а проект
 * полностью работоспособен без бэкенда.
 */
export const DEMO_MODE = !isSupabaseConfigured;

const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD?.trim();

/** Пароль входа на /admin (переопределяется через VITE_ADMIN_PASSWORD). */
export const ADMIN_PASSWORD = envAdminPassword || 'Kira13lublu';
