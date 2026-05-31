-- =====================================================================
--  СБРОС: удалить все послания и обнулить счётчик номеров (000001 снова)
-- =====================================================================
--  Запустите ОДИН РАЗ в Supabase → SQL Editor → Run.
--  После этого на сайте счётчик = 0, в админке пусто, новые номера с 1.
-- =====================================================================

delete from public.messages;

alter sequence public.message_number_seq restart with 1;

-- Проверка (должно быть 0 строк):
-- select count(*) as total from public.messages;

-- В браузере (админка): F12 → Application → Local Storage → obninsk70.ru
-- удалите ключи obninsk70_admin_overrides и obninsk70_demo_messages (если есть).
