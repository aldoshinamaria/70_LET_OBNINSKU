# Капсула времени Обнинск-70

Цифровой городской спецпроект к 70-летию города Обнинска. Жители оставляют послания будущим поколениям, которые сохраняются в цифровой капсуле времени и будут «открыты» в 2096 году.

> «Я оставил след в истории Обнинска».

## ✨ Возможности

- **Hero-секция** с анимациями и образом капсулы времени.
- **Живая статистика** из базы данных (участники, послания, школьники, педагоги, выпускники, жители).
- **Блок о проекте** с временной линией `1956 → 2026 → 2096`.
- **Форма послания** с полной валидацией и защитой от пустых/слишком длинных данных.
- **Модальное окно успеха** с присвоением номера послания в формате `000001`.
- **Открытка PNG 1080×1350** для публикации в соцсетях (генерируется через `html-to-image`).
- **Раздел «Голос Обнинска»** — только одобренные послания.
- **Админ-панель** `/admin`: поиск, фильтры, модерация (одобрить / отклонить / удалить).
- **Адаптивность** под 320 / 375 / 768 / 1024 / 1440 px.
- **SEO и Open Graph** теги.

## 🧱 Технологии

| Слой        | Технологии                                       |
| ----------- | ------------------------------------------------ |
| Frontend    | React 18, TypeScript, Vite                       |
| Стили       | Tailwind CSS                                      |
| Анимации    | Framer Motion                                     |
| Иконки      | Lucide React                                      |
| Открытка    | html-to-image                                     |
| Backend     | Supabase (PostgreSQL + RLS)                       |
| Деплой      | Vercel                                            |

## 📁 Структура проекта

```
src/
  assets/        # Локальные изображения (hero-capsule.jpg)
  components/    # Переиспользуемые компоненты
    admin/       # Компоненты админ-панели
    layout/      # Header, Footer, фон
    ui/          # Кнопки, поля, модальные окна
  hooks/         # Кастомные хуки (статистика, послания, отправка)
  pages/         # Страницы (главная, админка, 404)
  sections/      # Секции лендинга (Hero, Stats, About, Form, Voice)
  services/      # Работа с Supabase
  types/         # Типы TypeScript
  utils/         # Константы, валидация, форматирование
supabase/
  schema.sql     # SQL-схема базы данных
```

## 🚀 Пошаговый запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. Откройте **SQL Editor** и выполните содержимое файла [`supabase/schema.sql`](./supabase/schema.sql).
3. В разделе **Project Settings → API** скопируйте `Project URL` и `anon public` ключ.

### 3. Переменные окружения

Создайте файл `.env` в корне проекта (можно скопировать из `.env.example`):

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Заполните значения:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ADMIN_PASSWORD=ваш-надёжный-пароль
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

### 5. Проверка типов и сборка

```bash
npm run typecheck   # проверка ошибок TypeScript
npm run build       # production-сборка (assets с корня /)
npm run preview     # локальный просмотр production-сборки
```

## 🔐 Переменные окружения

| Переменная               | Назначение                                            | Обязательная |
| ------------------------ | ----------------------------------------------------- | ------------ |
| `VITE_SUPABASE_URL`      | URL проекта Supabase                                  | да           |
| `VITE_SUPABASE_ANON_KEY` | Публичный `anon`-ключ Supabase                        | да           |
| `VITE_ADMIN_PASSWORD`    | Пароль для входа в админ-панель `/admin`              | да           |

> Если переменные Supabase не заданы, сайт продолжит работать: статистика покажет нули, а раздел «Голос Обнинска» будет пустым. Отправка формы в этом случае вернёт понятную ошибку.

## 🛠 Админ-панель

- Ссылок на сайте нет; открывается только по прямому адресу `/admin`.
- Вход по паролю из `VITE_ADMIN_PASSWORD` (сессия хранится в `sessionStorage`).
- Функции: список всех посланий, поиск, фильтр по статусу, одобрить, отклонить, удалить.

### Сброс всех посланий и счётчика

Перед публичным запуском выполните в **Supabase → SQL Editor** файл [`supabase/reset-all-messages.sql`](./supabase/reset-all-messages.sql). Это удалит все записи и сбросит нумерацию с **000001**. Затем задеплойте последнюю версию сайта (без демо-голосов на орбите).

### ⚠️ Безопасность админ-панели

Демо-версия модерации работает на клиенте с публичным `anon`-ключом, поэтому в `schema.sql` включены пермиссивные RLS-политики (помечены `[DEMO]`). Этого достаточно для запуска и демонстрации, **но для боевого размещения** удалите DEMO-политики и используйте полноценную авторизацию через Supabase Auth или Edge Functions с `service_role`-ключом. Подробности — в комментариях внутри `supabase/schema.sql`.

## ☁️ Деплой

Сайт публикуется на [obninsk70.ru](https://obninsk70.ru) с корня домена (`base: /` в Vite).

### GitHub Pages (основной)

1. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions** (не «Deploy from a branch»).
2. При push в `main` запускается workflow `.github/workflows/deploy.yml`: `npm ci` → `npm run build` → публикация папки `dist`.
3. Домен: в **Pages → Custom domain** укажите `obninsk70.ru` (файл `public/CNAME` попадает в сборку).
4. В **Settings → Secrets and variables → Actions** добавьте:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
5. DNS: A-записи на IP GitHub Pages или CNAME на `<user>.github.io` (см. подсказки в настройках Pages).

### Vercel (альтернатива)

1. Импортируйте репозиторий в [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Домен: привяжите **obninsk70.ru** в Project Settings → Domains.
5. Добавьте переменные окружения в **Project Settings → Environment Variables**.
6. Для маршрута `/admin` при прямом заходе — rewrite в `vercel.json`.

## 🗄 База данных

Таблица `public.messages`:

| Поле              | Тип           | Описание                                  |
| ----------------- | ------------- | ----------------------------------------- |
| `id`              | uuid          | Первичный ключ                            |
| `message_number`  | integer       | Порядковый номер послания (000001, …)     |
| `name`            | text          | Имя автора (до 40 символов)               |
| `category`        | text          | Категория участника                       |
| `location`        | text          | Место проживания                          |
| `wish_to_city`    | text          | Пожелание Обнинску (20–400)               |
| `future_city`     | text          | Каким видит город через 70 лет (20–400)   |
| `message_to_2096` | text \| null  | Послание жителям 2096 года (до 400)       |
| `created_at`      | timestamptz   | Дата создания                             |
| `status`          | text          | `pending` / `approved` / `rejected`       |

## 👤 Автор

**MA.digital | Мария Алдошина**
