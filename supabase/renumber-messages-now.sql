-- =====================================================================
--  СЕЙЧАС: перенумеровать 19, 20, 21 → 1, 2, 3 (или оставить одно = 1)
-- =====================================================================
--  Supabase → SQL Editor → вставить целиком → Run
-- =====================================================================

-- --- Вариант А: оставить все послания, номера с 1 по порядку даты ---
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

-- --- Вариант Б (раскомментируйте вместо А): только одно послание = № 1 ---
-- delete from public.messages
-- where id not in (
--   select id from public.messages order by created_at desc limit 1
-- );
-- update public.messages set message_number = 1;

-- Следующий новый номер = max + 1
select setval(
  'public.message_number_seq',
  coalesce((select max(message_number) from public.messages), 0),
  true
);

-- Проверка:
-- select message_number, name, created_at from public.messages order by 1;
