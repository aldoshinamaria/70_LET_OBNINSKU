import { MESSAGES_TABLE, getSupabase, isSupabaseConfigured } from './supabase';
import {
  localCreateMessage,
  localDeleteMessage,
  localGetAllMessages,
  localGetApprovedMessages,
  localGetStats,
  localUpdateMessageStatus,
} from './localStore';
import { CATEGORY_OPTIONS, LOCATION_OPTIONS, FORM_LIMITS } from '@/utils/constants';
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

  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    return { ok: true, data: localCreateMessage(payload) };
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .insert(payload)
      .select()
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data as Message };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

/** Возвращает только одобренные послания для раздела «Голос Обнинска». */
export async function getApprovedMessages(
  limit = 60,
): Promise<ServiceResult<Message[]>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    return { ok: true, data: localGetApprovedMessages(limit) };
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: (data ?? []) as Message[] };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

const EMPTY_STATS: ProjectStats = {
  participants: 0,
  messages: 0,
  pupils: 0,
  teachers: 0,
  graduates: 0,
  residents: 0,
};

/**
 * Считает агрегированную статистику. Если БД не настроена или произошла
 * ошибка — возвращает нули, как требует ТЗ.
 */
export async function getStats(): Promise<ServiceResult<ProjectStats>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    return { ok: true, data: localGetStats() };
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('category');

    if (error) {
      return { ok: false, error: error.message };
    }

    const rows = (data ?? []) as Array<Pick<Message, 'category'>>;
    const stats: ProjectStats = { ...EMPTY_STATS };
    stats.participants = rows.length;
    stats.messages = rows.length;

    for (const row of rows) {
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

    return { ok: true, data: stats };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

/* --------------------------- Админ-функции --------------------------- */

/** Возвращает все послания (для админ-панели). */
export async function getAllMessages(): Promise<ServiceResult<Message[]>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    return { ok: true, data: localGetAllMessages() };
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: (data ?? []) as Message[] };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
): Promise<ServiceResult<true>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    const ok = localUpdateMessageStatus(id, status);
    return ok
      ? { ok: true, data: true }
      : { ok: false, error: 'Послание не найдено.' };
  }

  try {
    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .update({ status })
      .eq('id', id);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: true };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}

export async function deleteMessage(id: string): Promise<ServiceResult<true>> {
  const supabase = useLocal ? null : await getSupabase();
  if (!supabase) {
    const ok = localDeleteMessage(id);
    return ok
      ? { ok: true, data: true }
      : { ok: false, error: 'Послание не найдено.' };
  }

  try {
    const { error } = await supabase.from(MESSAGES_TABLE).delete().eq('id', id);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: true };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}
