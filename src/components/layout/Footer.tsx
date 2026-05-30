import { Link } from 'react-router-dom';
import { MaLogo } from '@/components/brand/MaLogo';
import { ProjectLogo } from '@/components/brand/ProjectLogo';
import { AUTHOR_SIGNATURE, PROJECT_NAME } from '@/utils/constants';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-background/60">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8 lg:px-12 lg:py-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
            <ProjectLogo variant="full" />
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold">{PROJECT_NAME}</p>
              <p className="text-xs text-secondary">
                Цифровой спецпроект к юбилею города
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:flex-row-reverse">
            <MaLogo className="h-11 w-11 shrink-0 drop-shadow-[0_0_10px_rgba(217,179,108,0.22)]" />
            <div className="flex flex-col items-center gap-0.5 sm:items-end">
              <p className="text-sm text-secondary">{AUTHOR_SIGNATURE}</p>
              <p className="text-xs text-secondary/60">© {year} · Обнинск</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-border pt-6 text-xs text-secondary/60">
          <Link to="/admin" className="transition-colors hover:text-secondary">
            Администрирование
          </Link>
        </div>
      </div>
    </footer>
  );
}
