import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-secondary"
        >
          {label}
          {required && <span className="ml-1 text-primary">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border bg-surface/60 px-4 py-3 text-text placeholder:text-secondary/50',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
            error ? 'border-danger/60' : 'border-border focus:border-primary/60',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {hint && !error && <p className="text-xs text-secondary/70">{hint}</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
