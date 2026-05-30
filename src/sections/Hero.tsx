import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CapsuleStage } from '@/components/hero/CapsuleStage';
import { SECTION_IDS } from '@/utils/constants';
import { scrollToSection } from '@/utils/scroll';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.hero}
      className="relative flex min-h-screen items-center pt-28 pb-16 sm:pt-32"
    >
      <div className="mx-auto grid w-full max-w-content items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:gap-10 lg:px-12">
        {/* Левая колонка */}
        <div className="flex flex-col gap-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-medium tracking-wide text-primary sm:text-sm"
          >
            <Sparkles className="h-4 w-4" />
            70 лет истории • тысячи судеб • одно будущее
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl lg:text-6xl"
          >
            Капсула времени{' '}
            <span className="gold-gradient-text">Обнинск-70</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="text-lg font-medium text-primary-soft sm:text-xl"
          >
            Послание в будущее от жителей наукограда.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="flex flex-col gap-4 text-base leading-relaxed text-secondary sm:text-lg"
          >
            <p>
              В честь 70-летия Обнинска мы создаём цифровую капсулу времени, в
              которой каждый может оставить своё послание будущим поколениям.
            </p>
            <p>
              Поделитесь воспоминанием, мечтой или пожеланием городу и расскажите,
              каким вы видите Обнинск через 70 лет.
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
              Узнать о проекте
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
          <CapsuleStage />
        </motion.div>
      </div>
    </section>
  );
}
