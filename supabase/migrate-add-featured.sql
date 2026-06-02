-- Колонка «На сайт» + политика чтения для гостей (выполнить один раз в SQL Editor)

alter table public.messages
  add column if not exists featured boolean not null default false;

create index if not exists messages_featured_idx
  on public.messages (featured) where featured = true;

-- Гости видят только одобренные и отмеченные «на сайт»
drop policy if exists "public can read approved" on public.messages;
drop policy if exists "public can read featured" on public.messages;
create policy "public can read featured"
  on public.messages
  for select
  to anon, authenticated
  using (status = 'approved' and featured = true);
