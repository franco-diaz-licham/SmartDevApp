import type { ReactNode, SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

export interface AppSelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

interface AppSelectProps<TValue extends string = string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'className'> {
  className?: string;
  error?: ReactNode;
  label?: ReactNode;
  options: readonly AppSelectOption<TValue>[];
}

export const AppSelect = <TValue extends string = string>({ className, error, id, label, options, required, ...selectProps }: AppSelectProps<TValue>) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  const select = (
    <select
      {...selectProps}
      aria-describedby={error ? errorId : selectProps['aria-describedby']}
      aria-invalid={error ? true : selectProps['aria-invalid']}
      id={selectId}
      required={required}
      className={cn(
        'min-h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground transition',
        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (!label && !error) return select;

  return (
    <div className="block">
      {label ? (
        <label className="mb-2 block font-semibold text-foreground" htmlFor={selectId}>
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="ml-1.5 align-middle text-xl font-bold leading-none text-destructive">
                *
              </span>
              <span className="sr-only"> required</span>
            </>
          ) : null}
        </label>
      ) : null}
      {select}
      {error ? (
        <span className="mt-1 block text-sm font-semibold text-destructive" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
