import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { MessageJourneyTimeline } from '@/components/about/MessageJourneyTimeline';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SECTION_IDS } from '@/utils/constants';
import { scrollToSection } from '@/utils/scroll';

export function About() {
  return (
    <section id={SECTION_IDS.about} className="section-spacing relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-glow opacity-60"
      />

      <div className="relative mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="Путь послания"
          title="Из Обнинска 2026 года — в Обнинск 2096 года"
          description="Сегодня жители города отправляют в будущее не данные и документы, а свои воспоминания, мечты и пожелания."
          descriptionClassName="max-w-full xl:max-w-none xl:whitespace-nowrap xl:text-lg"
        />

        <Reveal className="mx-auto mt-10 max-w-3xl lg:mt-7 lg:max-w-none" delay={0.08}>
          <div className="space-y-5 text-center text-base leading-relaxed text-secondary sm:text-lg">
            <p className="max-w-full xl:whitespace-nowrap xl:text-lg">
              Через 70 лет цифровая капсула времени откроется для нового поколения жителей Обнинска.
            </p>
            <p>
              Они увидят наш город таким, каким мы его знали. Узнают, о чём мы
              мечтали, что любили и каким хотели видеть будущее.
            </p>
            <p className="text-text/90">
              Каждое послание станет частью живой истории наукограда.
            </p>
          </div>
        </Reveal>

        <MessageJourneyTimeline />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 max-w-2xl text-center sm:mt-24 lg:mt-14 lg:max-w-none"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -top-8 h-32 rounded-full bg-primary/[0.06] blur-3xl"
          />
          <div className="relative space-y-5">
            <p className="font-display text-xl leading-snug text-text sm:text-2xl xl:whitespace-nowrap xl:text-2xl">
              Возможно, через 70 лет кто-то откроет капсулу и прочитает именно ваши слова.
            </p>
            <p className="text-base leading-relaxed text-secondary sm:text-lg">
              Именно ваше послание станет голосом прошлого для будущих
              поколений Обнинска.
            </p>
          </div>
          <Button
            size="lg"
            className="mt-10 min-w-[min(100%,18rem)]"
            onClick={() => scrollToSection(SECTION_IDS.form)}
          >
            Оставить послание будущему
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
