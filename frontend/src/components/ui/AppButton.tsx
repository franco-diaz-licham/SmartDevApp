import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const AppButton = ({ children, className, disabled, variant = 'primary', ...buttonProps }: AppButtonProps) => {
  const buttonClassName = cn(
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4',
    'text-sm font-semibold transition',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    disabled && 'cursor-not-allowed opacity-60',
    variant === 'primary' && 'bg-primary text-primary-foreground',
    variant === 'primary' && !disabled && 'hover:bg-accent',
    variant === 'secondary' && 'border border-border bg-muted text-foreground',
    variant === 'secondary' && !disabled && 'hover:bg-card',
    variant === 'outline' && 'border border-primary bg-background text-primary',
    variant === 'outline' && !disabled && 'hover:bg-primary hover:text-primary-foreground',
    className
  );

  return (
    <button {...buttonProps} disabled={disabled} className={buttonClassName} type="button">
      {children}
    </button>
  );
};

export { AppButton as Button };
