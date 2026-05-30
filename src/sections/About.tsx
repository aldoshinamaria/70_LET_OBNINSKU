import { motion } from 'framer-motion';
import { Atom, Clock, Heart, Send } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SECTION_IDS, TIMELINE } from '@/utils/constants';

const ICONS = [Atom, Send, Clock, Heart];

export function About() {
  return (
    <section id={SECTION_IDS.about} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-content section-padding">
        <SectionHeading
          eyebrow="О проекте"
          title="Письмо длиною в 70 лет"
          description="Обнинск родился как первый наукоград страны. Сегодня мы запечатываем голоса его жителей в цифровую капсулу, чтобы будущие поколения услышали нас в 2096 году."
        />

        <Reveal className="mx-auto mt-10 max-w-3xl text-center" delay={0.1}>
          <p className="text-base leading-relaxed text-secondary sm:text-lg">
            Это не просто форма обратной связи. Это связь времён: воспоминания
            старших, мечты молодых и пожелания тех, кто строит город сегодня. Всё
            это сохранится и станет частью живой истории Обнинска.
          </p>
        </Reveal>

        {/* Временная линия */}
        <div className="relative mt-16 sm:mt-20">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 lg:left-1/2 lg:-translate-x-1/2" />

          <div className="flex flex-col gap-10 lg:gap-4">
            {TIMELINE.map((point, index) => {
              const Icon = ICONS[index % ICONS.length];
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={point.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className={`relative flex items-start gap-6 pl-12 lg:w-1/2 lg:pl-0 ${
                    isLeft
                      ? 'lg:self-start lg:pr-12 lg:text-right'
                      : 'lg:self-end lg:pl-12'
                  }`}
                >
                  {/* Точка */}
                  <span
                    className={`absolute left-4 top-1.5 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full bg-primary shadow-[0_0_16px] shadow-primary/60 lg:left-auto ${
                      isLeft ? 'lg:right-0 lg:translate-x-1/2' : 'lg:left-0 lg:-translate-x-1/2'
                    }`}
                  />

                  <div
                    className={`glass-card flex-1 rounded-2xl p-6 ${
                      isLeft ? 'lg:items-end' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        isLeft ? 'lg:flex-row-reverse' : ''
                      }`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-display text-2xl font-semibold text-primary">
                        {point.year}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">
                      {point.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
