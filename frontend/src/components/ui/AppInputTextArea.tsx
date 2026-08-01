import type { TextareaProps } from '@primereact/types/primitive/textarea';
import { Textarea } from 'primereact/textarea';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';

interface AppInputTextAreaProps extends TextareaProps {
  error?: ReactNode;
  label?: ReactNode;
}

export const AppInputTextArea = ({ className, error, id, label, required, ...textareaProps }: AppInputTextAreaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  const textarea = (
    <Textarea
      {...textareaProps}
      aria-describedby={error ? errorId : textareaProps['aria-describedby']}
      aria-invalid={error ? true : textareaProps['aria-invalid']}
      id={textareaId}
      required={required}
      className={cn(
        'min-h-32 w-full rounded-md border border-border bg-background px-4 py-3 text-foreground transition placeholder:text-muted-foreground',
        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    />
  );

  if (!label && !error) return textarea;

  return (
    <div className="block">
      {label ? (
        <label className="mb-2 block font-semibold text-foreground" htmlFor={textareaId}>
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
      {textarea}
      {error ? (
        <span className="mt-1 block text-sm font-semibold text-destructive" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
};
