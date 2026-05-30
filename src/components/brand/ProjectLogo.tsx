import { cn } from '@/utils/cn';
import logoMarkWebp from '@/assets/project-logo-mark.webp';
import logoMarkPng from '@/assets/project-logo-mark.png';
import logoFullWebp from '@/assets/project-logo.webp';
import logoFullPng from '@/assets/project-logo.png';

type ProjectLogoVariant = 'mark' | 'full';

interface ProjectLogoProps {
  /** mark — компактный знак для шапки; full — полный логотип для подвала */
  variant?: ProjectLogoVariant;
  className?: string;
}

/**
 * Логотип юбилея «70 лет Обнинску» с прозрачным фоном —
 * без «чёрного квадрата», вписывается в тёмную палитру проекта.
 */
export function ProjectLogo({ variant = 'mark', className }: ProjectLogoProps) {
  const webp = variant === 'full' ? logoFullWebp : logoMarkWebp;
  const png = variant === 'full' ? logoFullPng : logoMarkPng;

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        variant === 'mark' ? 'h-11 w-11 sm:h-12 sm:w-12' : 'h-24 w-auto sm:h-28',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-md"
      />
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img
          src={png}
          alt="Обнинск — 70 лет. Первый наукоград России"
          className={cn(
            'relative h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(217,179,108,0.2)]',
            variant === 'full' && 'max-w-[220px] sm:max-w-[260px]',
          )}
          width={variant === 'full' ? 260 : 120}
          height={variant === 'full' ? 120 : 48}
          decoding="async"
        />
      </picture>
    </span>
  );
}
