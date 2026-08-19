import type { TextareaProps } from '@primereact/types/primitive/textarea';
import { Textarea } from 'primereact/textarea';
import type { ReactNode } from 'react';
import { useId } from 'react';
import { AppInlineEditSurface } from './AppInlineEditSurface';
import { cn } from '@/lib/cn';

interface AppInputTextAreaProps extends TextareaProps {
  error?: ReactNode;
  inline?: boolean;
  inlineStatus?: 'edit' | 'read';
  inlineSize?: 'default' | 'summary';
  label?: ReactNode;
  readValue?: ReactNode;
  onInlineEdit?: () => void;
}

const inlineTextAreaSizeClassNames = {
  default: 'min-h-32',
  summary: 'min-h-32'
} as const;

export const AppInputTextArea = ({ className, error, id, inline = false, inlineSize = 'default', inlineStatus = 'edit', label, readValue, required, onInlineEdit, ...textareaProps }: AppInputTextAreaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const isInlineReadMode = inline && inlineStatus === 'read';

  const textarea = isInlineReadMode ? (
    <AppInlineEditSurface inlineField="textArea" inlineSize={inlineSize} className={cn('text-muted-foreground', className)} disabled={!onInlineEdit} onEdit={onInlineEdit}>
      {readValue ?? textareaProps.value}
    </AppInlineEditSurface>
  ) : (
    <Textarea
      {...textareaProps}
      aria-describedby={error ? errorId : textareaProps['aria-describedby']}
      aria-invalid={error ? true : textareaProps['aria-invalid']}
      id={textareaId}
      required={required}
      className={cn(
        'block w-full rounded-md border border-border bg-background px-4 py-3 text-foreground transition placeholder:text-muted-foreground',
        inline ? inlineTextAreaSizeClassNames[inlineSize] : 'min-h-32',
        'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        inline && 'border-transparent bg-muted/35 px-2 py-1 shadow-none hover:border-primary/35',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
    />
  );

  if (!label && !error) return textarea;

  return (
    <div className="block w-full">
      {label ? (
        <label className="mb-2 block text-sm font-semibold text-foreground" htmlFor={textareaId}>
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
