import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from 'primereact/button';
import type { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  [
    'mb-8 mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 font-semibold transition',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'enabled:hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'
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
  };

export const AppButton = ({ children, className, appearance, type = 'button', ...buttonProps }: AppButtonProps) => {
  return (
    <Button {...buttonProps} type={type} className={cn(buttonVariants({ appearance }), className)}>
      {children}
    </Button>
  );
};
