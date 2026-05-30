import { useCallback, useEffect, useState } from 'react';
import {
  deleteMessage,
  getAllMessages,
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

  const setStatusLocally = (id: string, status: MessageStatus) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, status } : message,
      ),
    );
  };

  const changeStatus = async (id: string, status: MessageStatus) => {
    setActionError(null);
    const previous = messages.find((m) => m.id === id)?.status;
    setStatusLocally(id, status);
    const result = await updateMessageStatus(id, status);
    if (!result.ok) {
      if (previous) setStatusLocally(id, previous);
      setActionError(result.error);
    }
  };

  const approve = (id: string) => changeStatus(id, 'approved');
  const reject = (id: string) => changeStatus(id, 'rejected');

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
    remove,
  };
}
