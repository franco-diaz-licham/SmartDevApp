import { Button } from 'primereact/button';
import { cn } from '@/lib/cn';

export interface AppButtonSelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

interface AppButtonSelectProps<TValue extends string = string> {
  'aria-label'?: string;
  className?: string;
  options: readonly AppButtonSelectOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}

export const AppButtonSelect = <TValue extends string = string>({ 'aria-label': ariaLabel, className, options, value, onChange }: AppButtonSelectProps<TValue>) => (
  <div className={cn('space-y-1', className)} role="listbox" aria-label={ariaLabel}>
    {options.map((option) => {
      const isSelected = value === option.value;

      return (
        <Button
          key={option.value}
          aria-selected={isSelected}
          className={cn(
            'block w-full rounded-md px-3 py-2 text-left text-sm font-bold transition cursor-pointer',
            'hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/30',
            isSelected ? 'border border-primary/40 bg-background text-primary shadow-sm' : 'border border-transparent text-muted-foreground'
          )}
          role="option"
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      );
    })}
  </div>
);
