import { useCallback, useEffect, useState } from 'react';
import { getStats } from '@/services/messages';
import type { ProjectStats } from '@/types';

const INITIAL_STATS: ProjectStats = {
  participants: 0,
  messages: 0,
  pupils: 0,
  teachers: 0,
  graduates: 0,
  residents: 0,
};

interface UseStatsResult {
  stats: ProjectStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStats(): UseStatsResult {
  const [stats, setStats] = useState<ProjectStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
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
    void refetch();
  }, [refetch]);

  return { stats, loading, error, refetch };
}
