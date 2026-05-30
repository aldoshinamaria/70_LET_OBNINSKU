import { isSupabaseConfigured } from './supabase';

/**
 * DEMO_MODE включается автоматически, когда не заданы переменные Supabase.
 * В этом режиме все данные хранятся в localStorage браузера, а проект
 * полностью работоспособен без бэкенда.
 */
export const DEMO_MODE = !isSupabaseConfigured;

/** Демо-пароль администратора, если VITE_ADMIN_PASSWORD не задан. */
export const DEMO_ADMIN_PASSWORD = 'admin2026';

const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
const hasEnvPassword = Boolean(envAdminPassword && envAdminPassword.trim());

/** Действующий пароль администратора (из ENV или демо). */
export const ADMIN_PASSWORD = hasEnvPassword
  ? envAdminPassword
  : DEMO_ADMIN_PASSWORD;

/** Признак того, что используется демо-пароль (для подсказки на форме входа). */
export const IS_DEMO_PASSWORD = !hasEnvPassword;
