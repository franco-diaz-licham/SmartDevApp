import { cn } from '@/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from 'primereact/button';
import type { ButtonHTMLAttributes } from 'react';

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
  };

export const AppButton = ({ children, className, appearance, inline = false, type = 'button', ...buttonProps }: AppButtonProps) => {
  return (
    <Button
      {...buttonProps}
      type={type}
      className={cn(
        buttonVariants({ appearance }),
        inline &&
          'group relative mb-0 mt-0 min-h-0 justify-start rounded-md border-transparent bg-transparent p-1 text-left font-normal text-current shadow-none enabled:hover:bg-muted/45 enabled:hover:ring-1 enabled:hover:ring-primary/20 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-default disabled:opacity-100 disabled:hover:bg-transparent disabled:hover:ring-0',
        className
      )}
    >
      {children}
    </Button>
  );
};
