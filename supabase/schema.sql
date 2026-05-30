-- =====================================================================
--  КАПСУЛА ВРЕМЕНИ ОБНИНСК-70 — схема базы данных Supabase / PostgreSQL
-- =====================================================================
--  Выполните этот скрипт в Supabase SQL Editor (Dashboard → SQL Editor).
--  Скрипт идемпотентный: его можно запускать повторно.
-- =====================================================================

-- Расширение для генерации UUID
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Последовательность для человекочитаемых номеров посланий (000001, ...)
-- ---------------------------------------------------------------------
create sequence if not exists public.message_number_seq start with 1 increment by 1;

-- ---------------------------------------------------------------------
-- Таблица посланий
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  message_number   integer not null default nextval('public.message_number_seq'),
  name             text not null,
  category         text not null,
  location         text not null,
  wish_to_city     text not null,
  future_city      text not null,
  message_to_2096  text,
  created_at       timestamptz not null default now(),
  status           text not null default 'pending',
  featured         boolean not null default false,

  -- Серверная валидация данных
  constraint messages_name_len      check (char_length(name) between 1 and 40),
  constraint messages_wish_len      check (char_length(wish_to_city) between 20 and 400),
  constraint messages_future_len    check (char_length(future_city) between 20 and 400),
  constraint messages_2096_len      check (message_to_2096 is null or char_length(message_to_2096) <= 400),
  constraint messages_status_valid  check (status in ('pending', 'approved', 'rejected')),
  constraint messages_category_valid check (
    category in ('школьник', 'студент', 'педагог', 'выпускник', 'житель города', 'другое')
  ),
  constraint messages_location_valid check (
    location in ('Обнинск', 'Калужская область', 'другой регион России', 'другая страна')
  )
);

-- Уникальность и индексы
create unique index if not exists messages_number_unique on public.messages (message_number);
create index if not exists messages_status_idx     on public.messages (status);
create index if not exists messages_created_at_idx  on public.messages (created_at desc);
create index if not exists messages_featured_idx    on public.messages (featured) where featured = true;

-- ---------------------------------------------------------------------
-- Триггер: новые записи всегда получают статус 'pending'
-- (защита от попытки сразу опубликовать своё послание)
-- ---------------------------------------------------------------------
create or replace function public.force_pending_status()
returns trigger
language plpgsql
as $$
begin
  new.status := 'pending';
  -- номер присваивается последовательностью, перезаписать его нельзя
  new.message_number := nextval('public.message_number_seq');
  return new;
end;
$$;

drop trigger if exists trg_force_pending on public.messages;
create trigger trg_force_pending
  before insert on public.messages
  for each row execute function public.force_pending_status();

-- =====================================================================
--  ROW LEVEL SECURITY
-- =====================================================================
alter table public.messages enable row level security;

-- Любой посетитель может ОТПРАВИТЬ послание (создать запись).
drop policy if exists "public can insert messages" on public.messages;
create policy "public can insert messages"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

-- Посетитель видит только лучшие пожелания, отобранные модератором для сайта.
drop policy if exists "public can read approved" on public.messages;
drop policy if exists "public can read featured" on public.messages;
create policy "public can read featured"
  on public.messages
  for select
  to anon, authenticated
  using (status = 'approved' and featured = true);

-- Ответ insert().select() после отправки формы (статус pending задаёт триггер).
drop policy if exists "public read recent submit" on public.messages;
create policy "public read recent submit"
  on public.messages
  for select
  to anon, authenticated
  using (
    status = 'pending'
    and created_at >= (timezone('utc', now()) - interval '10 minutes')
  );

-- =====================================================================
--  АДМИН-ДОСТУП
-- =====================================================================
--  ВАЖНО про безопасность:
--  Эта демо-версия админ-панели работает на клиенте с anon-ключом и
--  паролем из переменной окружения. Чтобы кнопки «одобрить / отклонить /
--  удалить» и просмотр всех заявок работали «из коробки», ниже включены
--  ПЕРМИССИВНЫЕ политики для anon. Это удобно для запуска, НО небезопасно
--  для боевого размещения, т.к. anon-ключ публичен.
--
--  ДЛЯ ПРОДАКШЕНА рекомендуется:
--    1) Удалить три политики ниже (read all / update / delete для anon).
--    2) Завести администратора через Supabase Auth и выдавать доступ
--       по роли (например, проверять auth.jwt() ->> 'role' = 'admin'),
--       либо выполнять модерацию через Edge Function с service_role.
-- =====================================================================

-- [DEMO] Чтение всех посланий (для админ-панели)
drop policy if exists "demo admin read all" on public.messages;
create policy "demo admin read all"
  on public.messages
  for select
  to anon, authenticated
  using (true);

-- [DEMO] Изменение статуса (одобрить / отклонить)
drop policy if exists "demo admin update" on public.messages;
create policy "demo admin update"
  on public.messages
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- [DEMO] Удаление послания
drop policy if exists "demo admin delete" on public.messages;
create policy "demo admin delete"
  on public.messages
  for delete
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- Миграция для уже развёрнутой базы (если таблица создана ранее)
-- ---------------------------------------------------------------------
-- alter table public.messages add column if not exists featured boolean not null default false;
-- create index if not exists messages_featured_idx on public.messages (featured) where featured = true;

-- =====================================================================
--  Готово. Таблица public.messages создана и защищена RLS.
-- =====================================================================
