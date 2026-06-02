-- Права для кнопок «Одобрить» / «На сайт» / «Удалить» в админке (anon-ключ).
-- Выполните в Supabase → SQL Editor, если кнопки ничего не меняют.

alter table public.messages enable row level security;

drop policy if exists "demo admin read all" on public.messages;
create policy "demo admin read all"
  on public.messages
  for select
  to anon, authenticated
  using (true);

drop policy if exists "demo admin update" on public.messages;
create policy "demo admin update"
  on public.messages
  for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "demo admin delete" on public.messages;
create policy "demo admin delete"
  on public.messages
  for delete
  to anon, authenticated
  using (true);
