import type { ComponentType } from 'react';
import { Atom, Clock, Hourglass, ScrollText } from 'lucide-react';
import type { MessageJourneyIcon } from '@/utils/constants';
import { cn } from '@/utils/cn';

interface JourneyIconProps {
  type: MessageJourneyIcon;
  className?: string;
}

function CapsuleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <ellipse cx="12" cy="12" rx="5" ry="8" />
      <path d="M7 8.5h10M7 15.5h10" />
      <path d="M9.5 6.5c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2" />
    </svg>
  );
}

const ICON_MAP: Record<
  MessageJourneyIcon,
  ComponentType<{ className?: string }>
> = {
  atom: Atom,
  capsule: CapsuleGlyph,
  clock: Clock,
  hourglass: Hourglass,
  scroll: ScrollText,
};

export function JourneyIcon({ type, className }: JourneyIconProps) {
  const Icon = ICON_MAP[type];
  return <Icon className={cn('h-5 w-5', className)} aria-hidden />;
}
