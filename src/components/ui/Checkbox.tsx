import { type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  error?: string;
}

export function Checkbox({ label, error, id, className, checked, ...props }: CheckboxProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-start gap-3 text-sm text-secondary"
      >
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200',
              checked
                ? 'border-primary bg-primary text-background'
                : 'border-border bg-surface/60',
              error && !checked && 'border-danger/60',
              className,
            )}
          >
            {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
        </span>
        <span className="leading-relaxed">{label}</span>
      </label>
      {error && <p className="ml-8 text-xs text-danger">{error}</p>}
    </div>
  );
}
