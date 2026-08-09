import type { InputTextProps } from '@primereact/types/primitive/inputtext';
import { InputText } from 'primereact/inputtext';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

interface AppInputTextProps extends InputTextProps {
  error?: ReactNode;
  inline?: boolean;
  label?: ReactNode;
}

export const AppInputText = ({ className, error, id, inline = false, label, required, type = 'text', ...inputProps }: AppInputTextProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const input = (
    <InputText
      {...inputProps}
      aria-describedby={error ? errorId : inputProps['aria-describedby']}
      aria-invalid={error ? true : inputProps['aria-invalid']}
      id={inputId}
      required={required}
      type={type}
      className={cn(
        'min-h-10 w-full rounded-md border border-border bg-background px-4 py-2 text-foreground transition placeholder:text-muted-foreground',
        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        inline && 'rounded-md border-transparent bg-muted/35 px-2 py-1 shadow-none hover:border-primary/35 focus:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    />
  );

  if (!label && !error) return input;

  return (
    <div className="block">
      {label ? (
        <label className="mb-2 block font-semibold text-foreground" htmlFor={inputId}>
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
      {input}
      {error ? (
        <span className="mt-1 block text-sm font-semibold text-destructive" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
