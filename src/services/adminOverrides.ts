import { isSupabaseConfigured } from '@/lib/supabase';
import type { Message, MessageStatus } from '@/types';

const STORAGE_KEY = 'obninsk70_admin_overrides';
export const ADMIN_OVERRIDES_EVENT = 'obninsk70-admin-overrides-changed';

function notifyOverridesChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADMIN_OVERRIDES_EVENT));
}

export interface AdminMessageOverride {
  status?: MessageStatus;
  featured?: boolean;
  deleted?: boolean;
  /** Полная копия послания при «На сайт» — для блока на главной в этом браузере. */
  snapshot?: Message;
}

function isStorageAvailable(): boolean {
  try {
    const testKey = '__obninsk70_admin_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function normalizeSnapshot(raw: Message): Message {
  return {
    ...raw,
    status: 'approved',
    featured: true,
  };
}

export function readAdminOverrides(): Record<string, AdminMessageOverride> {
  if (!isStorageAvailable()) return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, AdminMessageOverride>;
  } catch {
    return {};
  }
}

function writeAdminOverrides(
  overrides: Record<string, AdminMessageOverride>,
): boolean {
  if (!isStorageAvailable()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    notifyOverridesChanged();
    return true;
  } catch {
    return false;
  }
}

export function patchAdminOverride(
  id: string,
  patch: AdminMessageOverride,
): boolean {
  const overrides = readAdminOverrides();
  const current = overrides[id] ?? {};
  const next: AdminMessageOverride = { ...current, ...patch };

  if (patch.deleted) {
    next.deleted = true;
    delete next.snapshot;
  }

  if (patch.featured === false) {
    delete next.snapshot;
  }

  if (patch.status === 'rejected') {
    next.featured = false;
    delete next.snapshot;
  }

  return writeAdminOverrides({ ...overrides, [id]: next });
}

export function removeAdminOverride(id: string): boolean {
  const overrides = readAdminOverrides();
  if (!(id in overrides)) return true;
  const { [id]: _removed, ...rest } = overrides;
  return writeAdminOverrides(rest);
}

/** Полностью очищает локальный кэш решений модератора (localStorage). */
export function clearAllAdminOverrides(): boolean {
  return writeAdminOverrides({});
}

/**
 * Удаляет «призраки» — снимки посланий, которых уже нет в базе.
 * Иначе после сброса Supabase на сайте остаются 2–3 старых карточки.
 */
export function pruneOrphanAdminOverrides(validIds: Iterable<string>): void {
  const valid = new Set(validIds);
  const overrides = readAdminOverrides();
  let changed = false;

  for (const [id, patch] of Object.entries(overrides)) {
    if (valid.has(id)) continue;

    if (patch.snapshot || patch.featured) {
      delete overrides[id];
      changed = true;
    }
  }

  if (changed) {
    writeAdminOverrides(overrides);
  }
}

/** Накладывает решения модератора поверх списка из Supabase или демо-хранилища. */
export function applyAdminOverrides(messages: Message[]): Message[] {
  const overrides = readAdminOverrides();

  return messages
    .map((message) => {
      const patch = overrides[message.id];
      if (!patch) return message;

      return {
        ...message,
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.featured !== undefined ? { featured: patch.featured } : {}),
      };
    })
    .filter((message) => !overrides[message.id]?.deleted);
}

function sortByNewest(a: Message, b: Message): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

/**
 * Послания для «Голос Обнинска»: из базы + снимки опубликованных в админке.
 */
export function collectPublishedMessages(
  messages: Message[],
  limit: number,
): Message[] {
  const byId = new Map<string, Message>();

  for (const message of applyAdminOverrides(messages)) {
    if (message.status === 'approved' && message.featured) {
      byId.set(message.id, message);
    }
  }

  // Снимки из localStorage — только в DEMO без Supabase (иначе «призраки» после сброса БД)
  if (!isSupabaseConfigured) {
    for (const patch of Object.values(readAdminOverrides())) {
      if (
        patch.snapshot &&
        patch.featured &&
        patch.status !== 'rejected' &&
        !patch.deleted
      ) {
        const snap = normalizeSnapshot(patch.snapshot);
        byId.set(snap.id, snap);
      }
    }
  }

  return [...byId.values()].sort(sortByNewest).slice(0, limit);
}
