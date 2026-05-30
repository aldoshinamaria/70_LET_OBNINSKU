import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: readonly string[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, id, className, required, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full appearance-none rounded-xl border bg-surface/60 px-4 py-3 pr-11 text-text',
              'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
              error ? 'border-danger/60' : 'border-border focus:border-primary/60',
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-surface text-text">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary"
            aria-hidden
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
