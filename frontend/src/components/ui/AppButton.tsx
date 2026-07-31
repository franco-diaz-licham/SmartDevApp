import { cn } from '@/lib/cn';
import type { ButtonProps } from '@primereact/types/primitive/button';
import type { PropsWithChildren } from 'react';
import { Button } from 'primereact/button';

type ButtonVariant = 'primary' | 'secondary';

interface AppButtonProps extends PropsWithChildren<Omit<ButtonProps, 'variant'>> {
  variant?: ButtonVariant;
}

export const AppButton = ({ children, className, disabled, variant = 'primary', ...buttonProps }: AppButtonProps) => {
  return (
    <Button
      {...buttonProps}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4',
        'text-sm font-semibold transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
        disabled && 'cursor-not-allowed opacity-60',
        variant === 'primary' && 'bg-brand-primary text-white',
        variant === 'primary' && !disabled && 'hover:bg-brand-primary-hover',
        variant === 'secondary' && 'border border-brand-border bg-brand-surface text-brand-heading',
        variant === 'secondary' && !disabled && 'hover:bg-brand-surface-muted',
        className
      )}
      type="button"
    >
      {children}
    </Button>
  );
};
