/** Когда RLS блокирует update/delete без явной ошибки (0 строк). */
export const ADMIN_RLS_DENIED_MESSAGE =
  'Кнопки не меняют базу: нет прав модерации. В Supabase → SQL Editor выполните supabase/fix-admin-policies.sql, затем обновите админку.';

/** Понятные сообщения об ошибках Supabase для формы и админки. */
export function mapSupabaseError(message: string, code?: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('row-level security') ||
    lower.includes('policy') ||
    code === '42501'
  ) {
    return (
      'Сервер отклонил сохранение (политики доступа Supabase). ' +
      'В SQL Editor выполните файл supabase/schema.sql целиком.'
    );
  }

  if (
    lower.includes('jwt') ||
    lower.includes('api key') ||
    lower.includes('invalid key') ||
    code === '401'
  ) {
    return (
      'Неверный ключ Supabase. В GitHub Secrets укажите publishable/anon ключ ' +
      'и пересоберите сайт (push в main).'
    );
  }

  if (
    code === 'PGRST204' ||
    code === '42703' ||
    (lower.includes('featured') &&
      (lower.includes('column') || lower.includes('schema cache')))
  ) {
    return (
      'В базе нет колонки featured. В Supabase → SQL Editor выполните ' +
      'supabase/migrate-add-featured.sql, затем снова нажмите «На сайт».'
    );
  }

  if (code === 'PGRST116' || lower.includes('0 rows')) {
    return (
      'Послание, вероятно, сохранено, но ответ сервера не получен. ' +
      'Обновите админку или попробуйте ещё раз.'
    );
  }

  if (lower.includes('check constraint') || lower.includes('violates check')) {
    return 'Текст послания не прошёл проверку на сервере. Проверьте длину полей.';
  }

  return message;
}
