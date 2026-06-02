import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Globe,
  Globe2,
  Inbox,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FeaturedBadge, StatusBadge } from '@/components/StatusBadge';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import { clearAllAdminOverrides } from '@/services/adminOverrides';
import { DEMO_MODE, SUPABASE_SETUP_STEPS } from '@/services/config';
import {
  FEATURED_COLUMN_MIGRATION,
  shouldWarnFeaturedMigration,
} from '@/services/dbSchema';
import { formatDate, formatMessageNumber } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Message, MessageStatus } from '@/types';

interface AdminDashboardProps {
  onLogout: () => void;
}

type StatusFilter = 'all' | MessageStatus | 'featured';

const FILTERS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'На модерации' },
  { value: 'approved', label: 'Одобренные' },
  { value: 'featured', label: 'На сайте' },
  { value: 'rejected', label: 'Отклонённые' },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const {
    messages,
    loading,
    actingId,
    error,
    actionError,
    refetch,
    approve,
    reject,
    publish,
    unpublish,
    remove,
  } = useAdminMessages(true);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      all: messages.length,
      pending: messages.filter((m) => m.status === 'pending').length,
      approved: messages.filter((m) => m.status === 'approved').length,
      featured: messages.filter((m) => m.featured).length,
      rejected: messages.filter((m) => m.status === 'rejected').length,
    };
  }, [messages]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesStatus =
        filter === 'all' ||
        (filter === 'featured'
          ? message.featured
          : message.status === filter);
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        message.name.toLowerCase().includes(query) ||
        message.wish_to_city.toLowerCase().includes(query) ||
        message.future_city.toLowerCase().includes(query) ||
        (message.message_to_2096 ?? '').toLowerCase().includes(query) ||
        formatMessageNumber(message.message_number).includes(query)
      );
    });
  }, [messages, search, filter]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <h1 className="font-display text-xl font-semibold">Админ-панель</h1>
            <p className="text-xs text-secondary">Капсула времени Обнинск-70</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refetch()}
              loading={loading}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Обновить</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-content px-5 py-8 sm:px-8">
        {DEMO_MODE ? (
          <div className="mb-4 rounded-xl border border-danger/50 bg-danger/10 px-4 py-4 text-sm text-text">
            <p className="font-semibold text-danger">
              Общая база не подключена — послания гостей не попадают в эту админку
            </p>
            <p className="mt-2 text-secondary">
              Сейчас сайт obninsk70.ru собран без ключей Supabase.
              Каждый посетитель сохраняет послание только в своём браузере; счётчик и список
              здесь — только из вашего браузера (и демо-записей).
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-secondary">
              {SUPABASE_SETUP_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mb-4 flex flex-col gap-3">
            {shouldWarnFeaturedMigration() && (
              <div className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
                <p className="font-semibold">Нужно обновить базу Supabase</p>
                <p className="mt-1 text-text/90">{FEATURED_COLUMN_MIGRATION}</p>
                <p className="mt-2 text-xs text-secondary">
                  Пока колонки нет: «На сайт» ставит статус «одобрено», на главной видны все
                  одобренные. После миграции снова нажмите «На сайт» для каждого послания.
                </p>
              </div>
            )}
            <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-secondary">
            <p>
              Список один для всех устройств — из Supabase.{' '}
              <strong className="text-text">«На сайт»</strong> — послание видят все на
              obninsk70.ru (орбита и «Голос Обнинска»). Только «Одобрить» на главной не появится.
            </p>
            <p className="mt-2 text-xs text-secondary/90">
              Если статусы на разных компьютерах расходятся — нажмите «Очистить локальный кэш
              модерации» на каждом браузере, где открывали админку, затем снова «На сайт».
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => {
                clearAllAdminOverrides();
                void refetch();
              }}
            >
              Очистить локальный кэш модерации
            </Button>
            </div>
          </div>
        )}

        {/* Сводка */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'glass-card flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition-all',
                filter === item.value
                  ? 'border-primary/60 ring-1 ring-primary/40'
                  : 'hover:border-primary/30',
              )}
            >
              <span className="font-display text-2xl font-semibold tabular-nums text-primary">
                {counts[item.value]}
              </span>
              <span className="text-xs text-secondary">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Поиск */}
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по имени, тексту или номеру…"
            className="w-full rounded-xl border border-border bg-surface/60 py-3 pl-11 pr-4 text-text placeholder:text-secondary/50 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {(error || actionError) && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{actionError ?? error}</span>
          </div>
        )}

        {/* Список */}
        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl border border-border bg-surface/40"
              />
            ))
          ) : messages.length === 0 ? (
            <div className="glass-card flex flex-col items-center gap-4 rounded-3xl p-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <Inbox className="h-7 w-7" />
              </span>
              <h3 className="text-xl font-semibold">
                Пока нет посланий для модерации
              </h3>
              <p className="max-w-md text-sm text-secondary">
                Как только жители начнут оставлять послания, они появятся здесь —
                и вы сможете одобрить или отклонить каждое из них.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center text-secondary">
              Ничего не найдено.
            </div>
          ) : (
            filtered.map((message) => (
              <AdminMessageRow
                key={message.id}
                message={message}
                busy={actingId === message.id}
                confirming={confirmId === message.id}
                onApprove={() => void approve(message.id)}
                onReject={() => void reject(message.id)}
                onPublish={() => void publish(message.id)}
                onUnpublish={() => void unpublish(message.id)}
                onAskDelete={() => setConfirmId(message.id)}
                onCancelDelete={() => setConfirmId(null)}
                onConfirmDelete={() => {
                  setConfirmId(null);
                  void remove(message.id);
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface AdminMessageRowProps {
  message: Message;
  busy: boolean;
  confirming: boolean;
  onApprove: () => void;
  onReject: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

function AdminMessageRow({
  message,
  busy,
  confirming,
  onApprove,
  onReject,
  onPublish,
  onUnpublish,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: AdminMessageRowProps) {
  return (
    <article className="glass-card flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-primary/20 px-3 py-1 text-xs font-medium tabular-nums text-primary">
            № {formatMessageNumber(message.message_number)}
          </span>
          <StatusBadge status={message.status} />
          {message.featured && <FeaturedBadge />}
        </div>
        <span className="text-xs text-secondary/70">
          {formatDate(message.created_at)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-semibold">{message.name}</span>
        <span className="text-secondary">· {message.category}</span>
        <span className="text-secondary">· {message.location}</span>
      </div>

      <div className="flex flex-col gap-3 text-sm leading-relaxed">
        <Field label="Пожелание городу" value={message.wish_to_city} />
        <Field label="Обнинск через 70 лет" value={message.future_city} />
        {message.message_to_2096 && (
          <Field label="Послание в 2096" value={message.message_to_2096} />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {confirming ? (
          <>
            <span className="mr-auto text-sm text-danger">Удалить навсегда?</span>
            <Button variant="danger" size="sm" onClick={onConfirmDelete}>
              <Trash2 className="h-4 w-4" />
              Удалить
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelDelete}>
              Отмена
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={onApprove}
              loading={busy}
              disabled={busy || message.status === 'approved'}
              className="text-success enabled:border-success/40 enabled:hover:bg-success/10"
            >
              <Check className="h-4 w-4" />
              Одобрить
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onReject}
              loading={busy}
              disabled={busy || message.status === 'rejected'}
            >
              <X className="h-4 w-4" />
              Отклонить
            </Button>
            {message.featured ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={onUnpublish}
                loading={busy}
                disabled={busy}
                className="border-primary/40 text-primary hover:bg-primary/10"
              >
                <Globe2 className="h-4 w-4" />
                Снять с сайта
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onPublish}
                loading={busy}
                disabled={busy || message.status === 'rejected'}
                className="enabled:border-primary/50 enabled:text-primary enabled:hover:bg-primary/10"
              >
                <Globe className="h-4 w-4" />
                На сайт
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAskDelete}
              disabled={busy}
              className="ml-auto text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Удалить</span>
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-secondary/60">{label}</p>
      <p className="mt-0.5 text-text/90">{value}</p>
    </div>
  );
}
