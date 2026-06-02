import type { Message } from '@/types';

/** null = ещё не знаем; false = колонки featured нет в Supabase. */
let featuredColumnInDb: boolean | null = null;

export const FEATURED_COLUMN_MIGRATION =
  'В Supabase SQL Editor выполните supabase/migrate-add-featured.sql, затем обновите страницу.';

/** Сброс при hot-reload в dev. */
export function resetDbSchemaDetection(): void {
  featuredColumnInDb = null;
}

export function markFeaturedColumnMissing(): void {
  featuredColumnInDb = false;
}

/** Есть ли в таблице колонка featured (по ответу PostgREST). */
export function hasFeaturedColumn(): boolean {
  return featuredColumnInDb !== false;
}

/** Нужно ли показывать предупреждение в админке. */
export function shouldWarnFeaturedMigration(): boolean {
  return featuredColumnInDb === false;
}

function rowHasFeaturedKey(row: Record<string, unknown>): boolean {
  return Object.prototype.hasOwnProperty.call(row, 'featured');
}

/** Вызывается при каждой загрузке списка из Supabase. */
export function noteMessagesSchemaFromRows(rows: readonly Record<string, unknown>[]): void {
  if (featuredColumnInDb === true || rows.length === 0) return;

  if (rows.some(rowHasFeaturedKey)) {
    featuredColumnInDb = true;
    return;
  }

  featuredColumnInDb = false;
}

/** Показ на главной: approved + featured, или только approved, если колонки ещё нет. */
export function isPublishedOnSite(message: Message): boolean {
  if (message.status !== 'approved') return false;
  return hasFeaturedColumn() ? Boolean(message.featured) : true;
}

export function isFeaturedMissingDbError(message: string, code?: string): boolean {
  const lower = message.toLowerCase();
  return (
    code === 'PGRST204' ||
    code === '42703' ||
    (lower.includes('featured') &&
      (lower.includes('column') ||
        lower.includes('schema cache') ||
        lower.includes('does not exist')))
  );
}
