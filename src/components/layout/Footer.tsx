import { MaLogo } from '@/components/brand/MaLogo';
import { ProjectLogo } from '@/components/brand/ProjectLogo';
import { AUTHOR_SIGNATURE, PROJECT_NAME } from '@/utils/constants';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-background/60">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8 lg:px-12 lg:py-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-row items-center gap-3 text-left">
            <ProjectLogo
              variant="full"
              className="h-10 w-auto shrink-0 sm:h-16 [&_img]:max-h-10 [&_img]:max-w-[92px] sm:[&_img]:max-h-16 sm:[&_img]:max-w-[152px]"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold">{PROJECT_NAME}</p>
              <p className="text-xs text-secondary">
                Цифровой спецпроект к юбилею города
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-3 sm:flex-row-reverse sm:justify-end">
            <MaLogo className="h-10 w-10 shrink-0 drop-shadow-[0_0_10px_rgba(217,179,108,0.22)] sm:h-11 sm:w-11" />
            <div className="flex flex-col items-end gap-0.5 text-right">
              <p className="text-sm text-secondary">{AUTHOR_SIGNATURE}</p>
              <p className="text-xs text-secondary/60">© {year} · Обнинск</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
