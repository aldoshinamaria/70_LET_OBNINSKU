import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatsSocialProof } from '@/components/stats/StatsSocialProof';
import { SECTION_IDS } from '@/utils/constants';
import type { ProjectStats } from '@/types';

interface StatsProps {
  stats: ProjectStats;
  loading?: boolean;
  error?: string | null;
}

export function Stats({ stats, loading = false, error = null }: StatsProps) {
  return (
    <section id={SECTION_IDS.stats} className="section-spacing relative">
      <div className="mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="Капсула наполняется"
          title="Голоса Обнинска уже отправлены в будущее"
          description="Каждое новое послание становится частью цифровой капсулы времени, которая откроется в 2096 году."
        />

        <StatsSocialProof stats={stats} loading={loading} error={error} />
      </div>
    </section>
  );
}
