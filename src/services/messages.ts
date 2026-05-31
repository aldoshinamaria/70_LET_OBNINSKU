import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { MESSAGES_TABLE, getSupabase } from './supabase';
import {
  applyAdminOverrides,
  collectPublishedMessages,
  patchAdminOverride,
  pruneOrphanAdminOverrides,
  removeAdminOverride,
} from './adminOverrides';
import {
  localCreateMessage,
  localDeleteMessage,
  localGetAllMessages,
  localUpdateMessageFeatured,
  localUpdateMessageStatus,
} from './localStore';
import { CATEGORY_OPTIONS, LOCATION_OPTIONS, FORM_LIMITS } from '@/utils/constants';
import { fullMessageText } from '@/utils/message';
import { mapSupabaseError } from '@/utils/supabaseErrors';
import type {
  Message,
  MessageFormData,
  MessageInsert,
  MessageStatus,
  ProjectStats,
  ServiceResult,
} from '@/types';

const NETWORK_ERROR =
  'Не удалось связаться с сервером. Проверьте интернет-соединение и попробуйте снова.';

/** В демо-режиме (без Supabase) данные хранятся в localStorage. */
const useLocal = !isSupabaseConfigured;

function normalizeMessage(row: Message): Message {
  return {
    ...row,
    featured: Boolean(row.featured),
  };
}

function toInsertPayload(form: MessageFormData): MessageInsert {
  const message2096 = form.message_to_2096.trim();
  return {
    name: form.name.trim().slice(0, FORM_LIMITS.nameMax),
    category: form.category,
    location: form.location,
    wish_to_city: form.wish_to_city.trim().slice(0, FORM_LIMITS.wishMax),
    future_city: form.future_city.trim().slice(0, FORM_LIMITS.futureMax),
    message_to_2096: message2096 ? message2096.slice(0, FORM_LIMITS.messageMax) : null,
  };
}

/** Дополнительная серверная защита от мусорных данных. */
function isPayloadSafe(payload: MessageInsert): boolean {
  if (!payload.name) return false;
  if (!CATEGORY_OPTIONS.includes(payload.category)) return false;
  if (!LOCATION_OPTIONS.includes(payload.location)) return false;
  if (payload.wish_to_city.length < FORM_LIMITS.wishMin) return false;
  if (payload.future_city.length < FORM_LIMITS.futureMin) return false;
  return true;
}

/**
 * Создаёт новое послание. Номер послания присваивается на стороне БД
 * (триггер + последовательность), поэтому возвращается уже с номером.
 */
export async function createMessage(
  form: MessageFormData,
): Promise<ServiceResult<Message>> {
  const payload = toInsertPayload(form);

  if (!isPayloadSafe(payload)) {
    return { ok: false, error: 'Данные формы не прошли проверку.' };
  }

  if (!isSupabaseConfigured) {
    try {
      return { ok: true, data: localCreateMessage(payload) };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Не удалось сохранить послание в браузере.',
      };
    }
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, error: 'Не удалось подключиться к Supabase.' };
  }

  const insertBody = {
    name: payload.name,
    category: payload.category,
    location: payload.location,
    wish_to_city: payload.wish_to_city,
    future_city: payload.future_city,
    ...(payload.message_to_2096
      ? { message_to_2096: payload.message_to_2096 }
      : {}),
  };

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .insert(insertBody)
      .select('*');

    if (error) {
      console.warn('[form] Supabase insert:', error.message, error.code);
      return {
        ok: false,
        error: mapSupabaseError(error.message, error.code),
      };
    }

    let row = (Array.isArray(data) ? data[0] : data) as Message | undefined;

    if (!row) {
      const { data: fallback, error: fetchError } = await supabase
        .from(MESSAGES_TABLE)
        .select('*')
        .eq('name', payload.name)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.warn('[form] Supabase fetch after insert:', fetchError.message);
        return {
          ok: false,
          error: mapSupabaseError(fetchError.message, fetchError.code),
        };
      }

      row = fallback as Message | null | undefined;
    }

    if (!row?.id) {
      return {
        ok: false,
        error:
          'Не удалось получить подтверждение от сервера. Проверьте интернет и попробуйте снова.',
      };
    }

    return {
      ok: true,
      data: normalizeMessage({ ...row, status: 'pending' }),
    };
  } catch (cause) {
    console.warn('[form] Supabase network error:', cause);
    return { ok: false, error: NETWORK_ERROR };
  }
}

/** Возвращает лучшие послания, опубликованные на сайте («Голос Обнинска»). */
export async function getApprovedMessages(
  limit = 60,
): Promise<ServiceResult<Message[]>> {
  const all = await getAllMessages();
  if (!all.ok) {
    return all;
  }

  return { ok: true, data: collectPublishedMessages(all.data, limit) };
}

export const EMPTY_STATS: ProjectStats = {
  participants: 0,
  messages: 0,
  pupils: 0,
  teachers: 0,
  graduates: 0,
  residents: 0,
  lastMessageAt: null,
  lastMessageName: null,
  lastMessageQuote: null,
  lastMessageCategory: null,
  lastMessageNumber: null,
};

function sortMessagesByNewest(a: Message, b: Message): number {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

/** Статистика и «последний голос» из актуального списка (с учётом админ-решений). */
export function buildProjectStats(messages: Message[]): ProjectStats {
  const sorted = [...messages].sort(sortMessagesByNewest);
  const approved = sorted.filter((m) => m.status === 'approved');

  const stats: ProjectStats = { ...EMPTY_STATS };
  stats.messages = sorted.length;
  stats.participants = sorted.length;

  if (approved.length > 0) {
    const latest = approved[0];
    stats.lastMessageAt = latest.created_at;
    stats.lastMessageName = latest.name;
    stats.lastMessageQuote = fullMessageText(latest) || null;
    stats.lastMessageCategory = latest.category;
    stats.lastMessageNumber = latest.message_number ?? null;
  }

  for (const row of sorted) {
    switch (row.category) {
      case 'школьник':
        stats.pupils += 1;
        break;
      case 'педагог':
        stats.teachers += 1;
        break;
      case 'выпускник':
        stats.graduates += 1;
        break;
      case 'житель города':
        stats.residents += 1;
        break;
      default:
        break;
    }
  }

  return stats;
}

/**
 * Статистика «Город в цифрах»; последний голос — новейшее одобренное послание.
 */
export async function getStats(): Promise<ServiceResult<ProjectStats>> {
  const all = await getAllMessages();
  if (!all.ok) {
    return { ok: false, error: all.error };
  }

  return { ok: true, data: buildProjectStats(all.data) };
}

/* --------------------------- Админ-функции --------------------------- */

/** Возвращает все послания (для админ-панели). */
export async function getAllMessages(): Promise<ServiceResult<Message[]>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    return { ok: true, data: applyAdminOverrides(localGetAllMessages()) };
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    const rows = ((data ?? []) as Message[]).map(normalizeMessage);
    pruneOrphanAdminOverrides(rows.map((row) => row.id));

    return {
      ok: true,
      data: applyAdminOverrides(rows),
    };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<ServiceResult<true>> {
  const overridePatch: {
    status: MessageStatus;
    featured?: boolean;
  } = { status };
  if (status === 'rejected') overridePatch.featured = false;

  if (!patchAdminOverride(id, overridePatch)) {
    return {
      ok: false,
      error:
        'Не удалось сохранить решение модератора. Разрешите localStorage для сайта.',
    };
  }

  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    const ok = localUpdateMessageStatus(id, status);
    if (!ok) {
      return {
        ok: false,
        error:
          'Послание не найдено или не удалось сохранить. Проверьте, что в браузере разрешён localStorage.',
      };
    }
    return { ok: true, data: true };
  }

  const patch: { status: MessageStatus; featured?: boolean } = { status };
  if (status === 'rejected') patch.featured = false;

  try {
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .update(patch)
      .eq('id', id);

    if (error) {
      console.warn('[admin] Supabase update status:', error.message);
    }

    return { ok: true, data: true };
  } catch {
    return { ok: true, data: true };
  }
}

/** Публикует послание на сайте (лучшие пожелания) или снимает с публикации. */
export async function updateMessageFeatured(
  id: string,
  featured: boolean,
  sourceMessage?: Message,
): Promise<ServiceResult<true>> {
  const overridePatch = featured
    ? {
        featured: true,
        status: 'approved' as MessageStatus,
        ...(sourceMessage ? { snapshot: sourceMessage } : {}),
      }
    : { featured: false };

  if (!patchAdminOverride(id, overridePatch)) {
    return {
      ok: false,
      error:
        'Не удалось сохранить решение модератора. Разрешите localStorage для сайта.',
    };
  }

  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    const ok = localUpdateMessageFeatured(id, featured);
    if (!ok) {
      return {
        ok: false,
        error:
          'Послание не найдено или не удалось сохранить. Проверьте, что в браузере разрешён localStorage.',
      };
    }
    return { ok: true, data: true };
  }

  const patch = featured
    ? { featured: true, status: 'approved' as MessageStatus }
    : { featured: false };

  try {
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .update(patch)
      .eq('id', id);

    if (error) {
      console.warn('[admin] Supabase update featured:', error.message);
    }

    return { ok: true, data: true };
  } catch {
    return { ok: true, data: true };
  }
}

export async function deleteMessage(id: string): Promise<ServiceResult<true>> {
  if (!patchAdminOverride(id, { deleted: true })) {
    return {
      ok: false,
      error:
        'Не удалось сохранить решение модератора. Разрешите localStorage для сайта.',
    };
  }

  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    const ok = localDeleteMessage(id);
    if (ok) removeAdminOverride(id);
    return ok
      ? { ok: true, data: true }
      : { ok: false, error: 'Послание не найдено.' };
  }

  try {
    const { error } = await supabase.from(MESSAGES_TABLE).delete().eq('id', id);

    if (error) {
      console.warn('[admin] Supabase delete:', error.message);
    }

    return { ok: true, data: true };
  } catch {
    return { ok: true, data: true };
  }
}
