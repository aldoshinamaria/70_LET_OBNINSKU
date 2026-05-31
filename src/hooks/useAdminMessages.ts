import { useCallback, useEffect, useState } from 'react';
import { applyAdminOverrides } from '@/services/adminOverrides';
import {
  deleteMessage,
  getAllMessages,
  updateMessageFeatured,
  updateMessageStatus,
} from '@/services/messages';
import type { Message } from '@/types';

interface UseAdminMessagesResult {
  messages: Message[];
  loading: boolean;
  actingId: string | null;
  error: string | null;
  actionError: string | null;
  refetch: () => Promise<void>;
  approve: (id: string) => Promise<void>;
  reject: (id: string) => Promise<void>;
  publish: (id: string) => Promise<void>;
  unpublish: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export function useAdminMessages(enabled: boolean): UseAdminMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refetch = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    const result = await getAllMessages();
    if (result.ok) {
      setMessages(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    if (!options?.silent) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void refetch();
    }
  }, [enabled, refetch]);

  const runAction = async (
    id: string,
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) => {
    setActionError(null);
    setActingId(id);
    try {
      const result = await action();
      if (!result.ok) {
        setActionError(result.error ?? 'Не удалось выполнить действие.');
        return;
      }
      setMessages((prev) => applyAdminOverrides(prev));
      await refetch({ silent: true });
    } finally {
      setActingId(null);
    }
  };

  const approve = (id: string) =>
    runAction(id, () => updateMessageStatus(id, 'approved'));

  const reject = (id: string) =>
    runAction(id, () => updateMessageStatus(id, 'rejected'));

  const publish = (id: string) => {
    const message = messages.find((item) => item.id === id);
    return runAction(id, () => updateMessageFeatured(id, true, message));
  };

  const unpublish = (id: string) =>
    runAction(id, () => updateMessageFeatured(id, false));

  const remove = async (id: string) => {
    setActionError(null);
    setActingId(id);
    try {
      const result = await deleteMessage(id);
      if (!result.ok) {
        setActionError(result.error);
        return;
      }
      setMessages((prev) => applyAdminOverrides(prev));
      await refetch({ silent: true });
    } finally {
      setActingId(null);
    }
  };

  return {
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
  };
}
