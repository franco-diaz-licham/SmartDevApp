import { Toast } from 'primereact/toast';
import { Toaster, useToasterContext } from 'primereact/toaster';
import { cn } from '@/lib/cn';
import type { AppToastIntent } from './AppToastContext';

const toastClassNames: Record<AppToastIntent, string> = {
  info: 'border-border bg-background',
  success: 'border-primary bg-background',
  warn: 'border-accent bg-background',
  error: 'border-destructive bg-background'
};

const toastTitleClassNames: Record<AppToastIntent, string> = {
  info: 'text-foreground',
  success: 'text-primary',
  warn: 'text-accent',
  error: 'text-destructive'
};

const getToastIntent = (severity: string | undefined): AppToastIntent => {
  if (severity === 'success' || severity === 'warn' || severity === 'error') return severity;
  return 'info';
};

const AppToastContent = () => {
  const toaster = useToasterContext();

  return (
    <Toaster.Portal>
      <Toaster.Region className="fixed bottom-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toaster?.toasts.map((item) => {
          const intent = getToastIntent(item.severity);

          return (
            <Toast.Root key={item.id} toast={item} className={cn('rounded-md border px-4 py-3 shadow-lg', toastClassNames[intent])}>
              <Toast.Content className="flex items-start gap-3">
                <Toast.Message className="min-w-0 flex-1">
                  <Toast.Title className={cn('font-bold leading-tight', toastTitleClassNames[intent])} />
                  <Toast.Description className="mt-1 text-sm leading-5 text-foreground" />
                </Toast.Message>
                <Toast.Close className="inline-flex h-7 w-7 items-center justify-center rounded-md text-xl leading-none text-muted-foreground transition hover:cursor-pointer hover:bg-muted hover:text-foreground">
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Close notification</span>
                </Toast.Close>
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toaster.Region>
    </Toaster.Portal>
  );
};

export const AppToast = () => {
  return (
    <Toaster.Root limit={4} mode="expanded" timeout={5000}>
      <AppToastContent />
    </Toaster.Root>
  );
};
