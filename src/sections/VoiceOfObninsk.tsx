import { motion } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MessageCard } from '@/components/MessageCard';
import { SECTION_IDS } from '@/utils/constants';
import type { Message } from '@/types';

interface VoiceOfObninskProps {
  messages: Message[];
  loading: boolean;
}

export function VoiceOfObninsk({ messages, loading }: VoiceOfObninskProps) {
  return (
    <section id={SECTION_IDS.voice} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="Голос Обнинска"
          title="Что говорят жители"
          description="Лучшие пожелания, отобранные командой проекта. Только они появляются на странице для всех жителей."
        />

        <div className="mt-12 sm:mt-16">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-2xl border border-border bg-surface/40"
                />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <MessageSquareQuote className="h-7 w-7" />
              </span>
              <h3 className="text-xl font-semibold">Капсула ждёт первых голосов</h3>
              <p className="text-secondary">
                Лучшие послания появятся здесь после публикации модератором. Станьте одним из первых,
                кто оставит свой след в истории города.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
                >
                  <MessageCard message={message} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
