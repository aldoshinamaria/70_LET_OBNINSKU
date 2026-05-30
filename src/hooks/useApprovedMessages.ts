import { useCallback, useEffect, useState } from 'react';
import { ADMIN_OVERRIDES_EVENT } from '@/services/adminOverrides';
import { getApprovedMessages } from '@/services/messages';
import type { Message } from '@/types';

interface UseApprovedMessagesResult {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApprovedMessages(): UseApprovedMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    const result = await getApprovedMessages();
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
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const onOverridesChanged = () => void refetch({ silent: true });
    const onFocus = () => void refetch({ silent: true });

    window.addEventListener(ADMIN_OVERRIDES_EVENT, onOverridesChanged);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener(ADMIN_OVERRIDES_EVENT, onOverridesChanged);
      window.removeEventListener('focus', onFocus);
    };
  }, [refetch]);

  return { messages, loading, error, refetch };
}
