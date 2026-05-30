import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useCountUp } from '@/hooks/useCountUp';
import { STAT_CARDS, SECTION_IDS } from '@/utils/constants';
import { formatCount } from '@/utils/format';
import type { ProjectStats } from '@/types';

interface StatItemProps {
  label: string;
  value: number;
  index: number;
}

function StatItem({ label, value, index }: StatItemProps) {
  const { ref, value: animated } = useCountUp(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="glass-card group relative flex flex-col gap-2 rounded-2xl p-6 text-center transition-colors duration-300 hover:border-primary/40 sm:p-8"
    >
      <span className="font-display text-4xl font-semibold tabular-nums text-primary sm:text-5xl">
        {formatCount(animated)}
      </span>
      <span className="text-sm font-medium uppercase tracking-wide text-secondary">
        {label}
      </span>
    </motion.div>
  );
}

interface StatsProps {
  stats: ProjectStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <section id={SECTION_IDS.stats} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="Капсула наполняется"
          title="Город в цифрах"
          description="Каждое число — это реальный житель, оставивший свой след в истории Обнинска."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-3">
          {STAT_CARDS.map((card, index) => (
            <StatItem
              key={card.key}
              label={card.label}
              value={stats[card.key]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
