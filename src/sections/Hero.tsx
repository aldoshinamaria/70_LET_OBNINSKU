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
      className="relative flex min-h-screen items-center overflow-x-clip pt-28 pb-16 sm:pt-32 lg:min-h-0 lg:py-20 xl:py-24"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-content items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-8 xl:gap-10 lg:px-12">
        {/* Левая колонка */}
        <div className="flex min-w-0 flex-col gap-5 lg:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-primary sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>
              70 лет истории • тысячи судеб • одно будущее
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-[1.85rem] font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08] xl:text-[2.65rem]"
          >
            Письмо в{' '}
            <span className="gold-gradient-text">Обнинск 2096</span> года
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="text-base font-medium leading-snug text-primary sm:text-lg lg:text-[1.05rem] lg:leading-relaxed"
          >
            Ваши слова станут частью цифровой капсулы времени и будут сохранены
            для будущих поколений жителей наукограда.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-col gap-3 text-sm leading-relaxed text-secondary sm:text-[0.9375rem] sm:leading-[1.6] lg:text-sm"
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
              size="md"
              onClick={() => scrollToSection(SECTION_IDS.form)}
              className="group lg:text-sm"
            >
              Оставить послание
              <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </Button>
            <button
              type="button"
              onClick={() => scrollToSection(SECTION_IDS.about)}
              className="text-xs font-medium text-secondary underline-offset-4 transition-colors hover:text-text hover:underline sm:text-sm"
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
          className="relative w-full min-w-0 overflow-hidden"
        >
          <CapsuleStage voices={voices} />
        </motion.div>
      </div>
    </section>
  );
}
