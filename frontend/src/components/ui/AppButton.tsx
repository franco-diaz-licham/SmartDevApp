import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from 'primereact/button';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent } from 'react';

const buttonVariants = cva(
  [
    'mb-8 mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4',
    'font-semibold transition',
    'enabled:hover:cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-ring',
    'disabled:cursor-not-allowed disabled:opacity-60'
  ],
  {
    variants: {
      appearance: {
        primary: 'bg-primary text-primary-foreground enabled:hover:bg-accent',
        secondary: 'border border-border bg-muted text-foreground enabled:hover:bg-background'
      }
    },
    defaultVariants: {
      appearance: 'primary'
    }
  }
);

type AppButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    inline?: boolean;
    inlineField?: 'textInput' | 'textArea';
    inlineSize?: 'default' | 'title' | 'summary';
  };

interface AppInlineEditIconProps {
  className?: string;
}

interface AppInlineEditSurfaceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick' | 'onKeyDown'> {
  className?: string;
  disabled?: boolean;
  iconClassName?: string;
  onEdit?: () => void;
}

export const AppInlineEditIcon = ({ className }: AppInlineEditIconProps) => (
  <UilPen aria-hidden="true" className={cn('pointer-events-none absolute right-2 top-2 size-3.5 opacity-0 transition group-hover:opacity-70 group-focus:opacity-70', className)} />
);

const inlineButtonFieldClassNames = {
  textInput: '!items-center',
  textArea: '!items-start'
} as const;

const inlineButtonSizeClassNames = {
  default: 'min-h-10',
  title: 'min-h-[3.75rem]',
  summary: 'min-h-32'
} as const;

export const AppButton = ({ children, className, appearance, inline = false, inlineField = 'textInput', inlineSize = 'default', type = 'button', ...buttonProps }: AppButtonProps) => {
  const isDisabled = Boolean(buttonProps.disabled);

  return (
    <Button
      {...buttonProps}
      type={type}
      className={cn(
        buttonVariants({ appearance }),
        inline &&
          cn(
            'group relative mb-0 mt-0 !inline-flex !justify-start rounded-md border-transparent bg-transparent p-1 text-left font-normal text-current shadow-none enabled:hover:bg-muted/45 enabled:hover:ring-1 enabled:hover:ring-primary/20 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-default disabled:opacity-100 disabled:hover:bg-transparent disabled:hover:ring-0',
            inlineButtonFieldClassNames[inlineField],
            inlineButtonSizeClassNames[inlineSize]
          ),
        className
      )}
    >
      {children}
      {inline && !isDisabled ? <AppInlineEditIcon /> : null}
    </Button>
  );
};

export const AppInlineEditSurface = ({ children, className, disabled = false, iconClassName, onEdit, ...surfaceProps }: AppInlineEditSurfaceProps) => {
  const isEditable = !disabled && Boolean(onEdit);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditable) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit?.();
    }
  };

  return (
    <div
      {...surfaceProps}
      aria-disabled={isEditable ? undefined : true}
      role={isEditable ? 'button' : undefined}
      tabIndex={isEditable ? 0 : undefined}
      className={cn(isEditable && 'group relative cursor-text rounded-md bg-transparent p-2 pr-8 transition hover:bg-muted/45 hover:ring-1 hover:ring-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/25', className)}
      onClick={isEditable ? onEdit : undefined}
      onKeyDown={handleKeyDown}
    >
      {isEditable ? <AppInlineEditIcon className={iconClassName} /> : null}
      {children}
    </div>
  );
};
