import { cn } from '@/utils/cn';
import type { MessageStatus } from '@/types';

const STATUS_META: Record<MessageStatus, { label: string; className: string }> = {
  pending: {
    label: 'На модерации',
    className: 'border-primary/40 bg-primary/10 text-primary',
  },
  approved: {
    label: 'Одобрено',
    className: 'border-success/40 bg-success/10 text-success',
  },
  rejected: {
    label: 'Отклонено',
    className: 'border-danger/40 bg-danger/10 text-danger',
  },
};

export function StatusBadge({ status }: { status: MessageStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}

/** Маркер публикации на публичной странице сайта. */
export function FeaturedBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
      На сайте
    </span>
  );
}
