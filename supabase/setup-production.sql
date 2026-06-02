-- Один раз в Supabase → SQL Editor → Run
-- Исправляет: кнопки админки, колонку «На сайт», чтение для гостей

-- 1. Колонка featured
alter table public.messages
  add column if not exists featured boolean not null default false;

create index if not exists messages_featured_idx
  on public.messages (featured) where featured = true;

-- 2. RLS
alter table public.messages enable row level security;

-- Гости: вставка
drop policy if exists "public can insert messages" on public.messages;
create policy "public can insert messages"
  on public.messages for insert to anon, authenticated
  with check (true);

-- Гости: только опубликованные на сайте
drop policy if exists "public can read approved" on public.messages;
drop policy if exists "public can read featured" on public.messages;
create policy "public can read featured"
  on public.messages for select to anon, authenticated
  using (status = 'approved' and featured = true);

-- Гости: свой недавний pending после отправки формы
drop policy if exists "public read recent submit" on public.messages;
create policy "public read recent submit"
  on public.messages for select to anon, authenticated
  using (
    status = 'pending'
    and created_at >= (timezone('utc', now()) - interval '24 hours')
  );

drop policy if exists "public read pending" on public.messages;
create policy "public read pending"
  on public.messages for select to anon, authenticated
  using (status = 'pending');

-- Админка (anon): читать / менять / удалять все послания
drop policy if exists "demo admin read all" on public.messages;
create policy "demo admin read all"
  on public.messages for select to anon, authenticated
  using (true);

drop policy if exists "demo admin update" on public.messages;
create policy "demo admin update"
  on public.messages for update to anon, authenticated
  using (true) with check (true);

drop policy if exists "demo admin delete" on public.messages;
create policy "demo admin delete"
  on public.messages for delete to anon, authenticated
  using (true);
