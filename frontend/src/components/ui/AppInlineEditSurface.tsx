import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface AppInlineEditIconProps {
  className?: string;
}

interface AppInlineEditSurfaceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick' | 'onKeyDown'> {
  className?: string;
  disabled?: boolean;
  inlineField?: 'textInput' | 'textArea';
  inlineSize?: 'default' | 'title' | 'summary';
  iconClassName?: string;
  label?: ReactNode;
  required?: boolean;
  onEdit?: () => void;
}

const inlineEditSurfaceFieldClassNames = {
  textInput: 'items-center',
  textArea: 'items-start'
} as const;

const inlineEditSurfaceSizeClassNames = {
  default: 'min-h-10',
  title: 'min-h-[3.75rem]',
  summary: 'min-h-32'
} as const;

export const AppInlineEditIcon = ({ className }: AppInlineEditIconProps) => (
  <UilPen aria-hidden="true" className={cn('pointer-events-none absolute right-2 top-2 size-3.5 opacity-0 transition group-hover:opacity-70 group-focus:opacity-70', className)} />
);

export const AppInlineEditSurface = ({ children, className, disabled = false, inlineField = 'textInput', inlineSize = 'default', iconClassName, label, required = false, onEdit, ...surfaceProps }: AppInlineEditSurfaceProps) => {
  const isEditable = !disabled && Boolean(onEdit);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit?.();
    }
  };

  const surface = (
    <div
      {...surfaceProps}
      aria-disabled={isEditable ? undefined : true}
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : undefined}
      className={cn(
        'relative flex w-full justify-start rounded-md p-1 text-left font-normal text-current',
        inlineEditSurfaceFieldClassNames[inlineField],
        inlineEditSurfaceSizeClassNames[inlineSize],
        isEditable && 'group cursor-text transition hover:bg-muted/45 hover:ring-1 hover:ring-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/25',
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      onKeyDown={handleKeyDown}
    >
      {isEditable ? <AppInlineEditIcon className={iconClassName} /> : null}
      {children}
    </div>
  );

  if (!label) return surface;

  return (
    <div className="block w-full">
      <p className="mb-2 block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1.5 align-middle text-xl font-bold leading-none text-destructive">
              *
            </span>
            <span className="sr-only"> required</span>
          </>
        ) : null}
      </p>
      {surface}
    </div>
  );
};
