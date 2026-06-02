import { useCallback, useEffect, useState } from 'react';
import { EMPTY_STATS, getStats } from '@/services/messages';
import type { ProjectStats } from '@/types';

const STATS_POLL_MS = 45_000;

interface UseStatsOptions {
  /** Показать индикатор загрузки (только при первом запросе или явном showLoading). */
  showLoading?: boolean;
}

interface UseStatsResult {
  stats: ProjectStats;
  loading: boolean;
  error: string | null;
  refetch: (options?: UseStatsOptions) => Promise<void>;
}

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<ProjectStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (options?: UseStatsOptions) => {
    if (options?.showLoading) {
      setLoading(true);
    }

    const result = await getStats();

    if (result.ok) {
      setStats(result.data);
      setError(null);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void refetch({ showLoading: true });
  }, [refetch]);

  useEffect(() => {
    const refresh = () => void refetch();
    window.addEventListener('focus', refresh);
    const pollId = window.setInterval(refresh, STATS_POLL_MS);

    return () => {
      window.removeEventListener('focus', refresh);
      window.clearInterval(pollId);
    };
  }, [refetch]);

  return { stats, loading, error, refetch };
}
