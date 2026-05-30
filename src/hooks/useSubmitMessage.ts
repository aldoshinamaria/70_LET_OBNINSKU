import { useState } from 'react';
import { createMessage } from '@/services/messages';
import type { Message, MessageFormData } from '@/types';

interface UseSubmitMessageResult {
  submit: (form: MessageFormData) => Promise<Message | null>;
  submitting: boolean;
  error: string | null;
  clearError: () => void;
}

export function useSubmitMessage(): UseSubmitMessageResult {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (form: MessageFormData): Promise<Message | null> => {
    if (submitting) return null;

    // Дополнительная защита от потери соединения на стороне клиента.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError('Нет подключения к интернету. Проверьте сеть и попробуйте снова.');
      return null;
    }

    setSubmitting(true);
    setError(null);

    const result = await createMessage(form);

    setSubmitting(false);

    if (result.ok) {
      return result.data;
    }

    setError(result.error);
    return null;
  };

  return {
    submit,
    submitting,
    error,
    clearError: () => setError(null),
  };
}
