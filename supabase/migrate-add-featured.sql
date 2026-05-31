-- Добавить колонку «на сайте», если таблица создавалась без неё
alter table public.messages
  add column if not exists featured boolean not null default false;

create index if not exists messages_featured_idx
  on public.messages (featured) where featured = true;
