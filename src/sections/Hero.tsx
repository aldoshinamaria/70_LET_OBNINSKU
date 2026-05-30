import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CapsuleStage } from '@/components/hero/CapsuleStage';
import type { CapsuleVoice } from '@/data/sampleMessages';
import { SECTION_IDS } from '@/utils/constants';
import { scrollToSection } from '@/utils/scroll';

interface HeroProps {
  voices?: readonly CapsuleVoice[];
}

export function Hero({ voices }: HeroProps) {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-screen items-center pt-28 pb-16 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-content items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8 xl:gap-10 lg:px-12">
        {/* Левая колонка */}
        <div className="flex flex-col gap-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-medium tracking-wide text-primary sm:text-sm"
          >
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              70 лет истории • тысячи судеб • одно будущее
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-[2.35rem] font-bold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]"
          >
            Письмо в{' '}
            <span className="gold-gradient-text">Обнинск 2096</span> года
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="max-w-[34rem] text-lg font-medium leading-snug text-primary sm:text-xl lg:text-[1.35rem] lg:leading-relaxed"
          >
            Ваши слова станут частью цифровой капсулы времени и будут сохранены
            для будущих поколений жителей наукограда.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex max-w-[36rem] flex-col gap-4 text-base leading-relaxed text-secondary sm:text-[1.0625rem] sm:leading-[1.65]"
          >
            <p className="text-text/90">
              Сегодня мы можем заглянуть на 70 лет вперёд.
            </p>
            <p className="font-medium text-text">
              Что вы хотели бы передать тем, кто будет жить в Обнинске в 2096
              году?
            </p>
            <p>
              Поделитесь воспоминанием, мечтой, пожеланием или надеждой. Каждое
              послание станет частью живой истории города и сохранится в цифровой
              капсуле времени.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection(SECTION_IDS.form)}
              className="group"
            >
              Оставить послание
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </Button>
            <button
              type="button"
              onClick={() => scrollToSection(SECTION_IDS.about)}
              className="text-sm font-medium text-secondary underline-offset-4 transition-colors hover:text-text hover:underline"
            >
              Как это работает
            </button>
          </motion.div>
        </div>

        {/* Правая колонка — живая капсула с голосами */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="relative w-full"
        >
          <CapsuleStage voices={voices} />
        </motion.div>
      </div>
    </section>
  );
}
