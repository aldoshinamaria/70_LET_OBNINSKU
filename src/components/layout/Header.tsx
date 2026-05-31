import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ProjectLogo } from '@/components/brand/ProjectLogo';
import { SECTION_IDS } from '@/utils/constants';
import { scrollToSection } from '@/utils/scroll';
import { cn } from '@/utils/cn';

const NAV_LINKS: ReadonlyArray<{ id: string; label: string }> = [
  { id: SECTION_IDS.about, label: 'О проекте' },
  { id: SECTION_IDS.stats, label: 'Цифры' },
  { id: SECTION_IDS.voice, label: 'Голос Обнинска' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="pointer-events-auto mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => scrollToSection(SECTION_IDS.hero)}
          className="flex items-center gap-3 text-left"
        >
          <ProjectLogo variant="mark" />
          <span className="hidden text-sm font-semibold leading-tight sm:block">
            Капсула времени
            <span className="block text-xs font-normal text-secondary">
              Обнинск · наукоград
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="text-sm text-secondary transition-colors hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <Button size="sm" onClick={() => scrollToSection(SECTION_IDS.form)}>
          Оставить послание
        </Button>
      </div>
    </motion.header>
  );
}
