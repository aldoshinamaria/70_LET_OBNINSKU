import { cn } from '@/utils/cn';

interface CapsuleWishTextProps {
  text: string;
  name: string;
  className?: string;
  quoteClassName?: string;
  signatureClassName?: string;
  align?: 'left' | 'center';
}

/**
 * Текст послания в стиле орбиты капсулы: золотая цитата и рукописная подпись.
 */
export function CapsuleWishText({
  text,
  name,
  className,
  quoteClassName,
  signatureClassName,
  align = 'center',
}: CapsuleWishTextProps) {
  return (
    <figure
      className={cn(
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      <blockquote
        className={cn('capsule-wish-quote', quoteClassName)}
        title={text.length > 80 ? text : undefined}
      >
        «{text}»
      </blockquote>
      <figcaption className={cn('capsule-wish-signature', signatureClassName)}>
        — {name}
      </figcaption>
    </figure>
  );
}
