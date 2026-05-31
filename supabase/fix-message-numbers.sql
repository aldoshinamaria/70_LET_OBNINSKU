-- =====================================================================
--  Исправить номера посланий (000001, 000002, …) после тестов
-- =====================================================================
--  Запустите в Supabase → SQL Editor, если после сброса таблицы
--  новое послание получило номер 18, 19 и т.д. вместо 1.
-- =====================================================================

-- Убрать лишний default у колонки (номер только из триггера)
alter table public.messages
  alter column message_number drop default;

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

-- Перенумеровать все послания по дате: 1, 2, 3…
with ordered as (
  select
    id,
    row_number() over (order by created_at asc, id asc) as rn
  from public.messages
)
update public.messages as m
set message_number = o.rn
from ordered as o
where m.id = o.id;

-- Следующая вставка = max + 1 (если одно послание — следующий будет 2)
select setval(
  'public.message_number_seq',
  coalesce((select max(message_number) from public.messages), 0),
  true
);

-- Проверка:
-- select message_number, name, created_at from public.messages order by message_number;
