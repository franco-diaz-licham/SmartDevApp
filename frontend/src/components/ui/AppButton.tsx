import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonProps } from '@primereact/types/primitive/button';
import type { PropsWithChildren } from 'react';
import { Button } from 'primereact/button';

const buttonVariants = cva(
  [
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4',
    'text-sm font-semibold transition',
    'focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-brand-primary',
    'disabled:cursor-not-allowed disabled:opacity-60'
  ],
  {
    variants: {
      variant: {
        primary: ['bg-brand-primary text-white', 'enabled:hover:bg-brand-primary-hover'],
        secondary: ['border border-brand-border', 'bg-brand-surface text-brand-heading', 'enabled:hover:bg-brand-surface-muted']
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

interface AppButtonProps extends PropsWithChildren<Omit<ButtonProps, 'variant'>>, VariantProps<typeof buttonVariants> {}

export const AppButton = ({ children, className, variant, ...buttonProps }: AppButtonProps) => {
  return (
    <Button {...buttonProps} className={cn(buttonVariants({ variant }), className)} type="button">
      {children}
    </Button>
  );
};
