import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  current: number;
  max: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, current, max, id, className, required, ...props }, ref) => {
    const inputId = id ?? props.name;
    const nearLimit = current > max * 0.9;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-3">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-secondary"
          >
            {label}
            {required && <span className="ml-1 text-primary">*</span>}
          </label>
          <span
            className={cn(
              'text-xs tabular-nums',
              nearLimit ? 'text-primary' : 'text-secondary/60',
            )}
          >
            {current}/{max}
          </span>
        </div>
        <textarea
          ref={ref}
          id={inputId}
          maxLength={max}
          rows={4}
          className={cn(
            'w-full resize-none rounded-xl border bg-surface/60 px-4 py-3 text-text placeholder:text-secondary/50',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
            error ? 'border-danger/60' : 'border-border focus:border-primary/60',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
