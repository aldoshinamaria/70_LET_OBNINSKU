import { MessageSquareQuote } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { VoiceMessagesCarousel } from '@/components/voice/VoiceMessagesCarousel';
import { SECTION_IDS } from '@/utils/constants';
import type { Message } from '@/types';

interface VoiceOfObninskProps {
  messages: Message[];
  loading: boolean;
}

export function VoiceOfObninsk({ messages, loading }: VoiceOfObninskProps) {
  return (
    <section id={SECTION_IDS.voice} className="section-spacing relative">
      <div className="mx-auto min-w-0 max-w-content section-padding">
        <SectionHeading
          eyebrow="Голос Обнинска"
          title="Что говорят жители"
          description={
            <span className="flex flex-col items-center gap-2">
              <span>Лучшие пожелания, отобранные командой проекта.</span>
              <span className="max-w-full xl:whitespace-nowrap xl:text-lg">
                Только они появляются на странице для всех жителей.
              </span>
            </span>
          }
          descriptionClassName="lg:max-w-none"
        />

        <div className="mt-10 min-w-0 sm:mt-12 lg:mt-8">
          {loading ? (
            <div className="flex gap-4 overflow-hidden px-12 sm:px-14">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[220px] w-[min(280px,calc(100vw-5rem))] shrink-0 animate-pulse rounded-lg bg-primary/5 sm:w-[300px]"
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
                Лучшие послания появятся здесь после публикации модератором. Станьте
                одним из первых, кто оставит свой след в истории города.
              </p>
            </div>
          ) : (
            <VoiceMessagesCarousel messages={messages} />
          )}
        </div>
      </div>
    </section>
  );
}
