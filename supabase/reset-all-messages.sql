-- =====================================================================
--  СБРОС: удалить все послания и обнулить счётчик номеров (000001 снова)
-- =====================================================================
--  Запустите ОДИН РАЗ в Supabase → SQL Editor → Run.
--  После этого на сайте счётчик = 0, в админке пусто, новые номера с 1.
-- =====================================================================

-- Колонка «на сайте» (если таблица создавалась без неё)
alter table public.messages
  add column if not exists featured boolean not null default false;

create index if not exists messages_featured_idx
  on public.messages (featured) where featured = true;

delete from public.messages;

-- Важно: без этого новые послания получат 18, 19… после удаления строк
alter table public.messages
  alter column message_number drop default;

alter sequence public.message_number_seq restart with 1;

create or replace function public.force_pending_status()
returns trigger
language plpgsql
as $$
begin
  new.status := 'pending';
  new.featured := false;
  new.message_number := nextval('public.message_number_seq');
  return new;
end;
$$;

-- Проверка (должно быть 0 строк):
-- select count(*) as total from public.messages;

-- В браузере (админка): F12 → Application → Local Storage → obninsk70.ru
-- удалите ключи obninsk70_admin_overrides и obninsk70_demo_messages (если есть).
