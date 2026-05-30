import { useCallback, useEffect, useState } from 'react';
import {
  deleteMessage,
  getAllMessages,
  updateMessageFeatured,
  updateMessageStatus,
} from '@/services/messages';
import type { Message, MessageStatus } from '@/types';

interface UseAdminMessagesResult {
  messages: Message[];
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const result = await getAllMessages();
    if (result.ok) {
      setMessages(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      void refetch();
    }
  }, [enabled, refetch]);

  const patchLocally = (id: string, patch: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, ...patch } : message,
      ),
    );
  };

  const changeStatus = async (id: string, status: MessageStatus) => {
    setActionError(null);
    const previous = messages.find((m) => m.id === id);
    const patch: Partial<Message> = { status };
    if (status === 'rejected') patch.featured = false;
    patchLocally(id, patch);

    const result = await updateMessageStatus(id, status);
    if (!result.ok && previous) {
      patchLocally(id, {
        status: previous.status,
        featured: previous.featured,
      });
      setActionError(result.error);
    }
  };

  const changeFeatured = async (id: string, featured: boolean) => {
    setActionError(null);
    const previous = messages.find((m) => m.id === id);
    const patch: Partial<Message> = featured
      ? { featured: true, status: 'approved' }
      : { featured: false };
    patchLocally(id, patch);

    const result = await updateMessageFeatured(id, featured);
    if (!result.ok && previous) {
      patchLocally(id, {
        status: previous.status,
        featured: previous.featured,
      });
      setActionError(result.error);
    }
  };

  const approve = (id: string) => changeStatus(id, 'approved');
  const reject = (id: string) => changeStatus(id, 'rejected');
  const publish = (id: string) => changeFeatured(id, true);
  const unpublish = (id: string) => changeFeatured(id, false);

  const remove = async (id: string) => {
    setActionError(null);
    const snapshot = messages;
    setMessages((prev) => prev.filter((message) => message.id !== id));
    const result = await deleteMessage(id);
    if (!result.ok) {
      setMessages(snapshot);
      setActionError(result.error);
    }
  };

  return {
    messages,
    loading,
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
