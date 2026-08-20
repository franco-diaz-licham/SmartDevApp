import { Toast } from 'primereact/toast';
import { toast, Toaster, useToasterContext } from 'primereact/toaster';
import { useEffect } from 'react';
import { subscribeToFeedback, type AppFeedbackSeverity } from '@/lib/feedback/feedbackEvents';
import { cn } from '@/lib/cn';
import type { AppToastIntent } from './AppToastContext';

const toastClassNames: Record<AppToastIntent, string> = {
  info: 'border-info-border bg-info',
  success: 'border-success-border bg-success',
  warn: 'border-warn-border bg-warn',
  error: 'border-error-border bg-error'
};

const toastTitleClassNames: Record<AppToastIntent, string> = {
  info: 'text-info-heading',
  success: 'text-success-heading',
  warn: 'text-warn-heading',
  error: 'text-error-heading'
};

const getToastIntent = (severity: string | undefined): AppToastIntent => {
  if (severity === 'success' || severity === 'warn' || severity === 'error') return severity;
  return 'info';
};

const toastDurationBySeverity: Record<AppFeedbackSeverity, number> = {
  error: 7000,
  info: 5000,
  success: 5000,
  warn: 5000
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
                  <Toast.Description className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap break-words text-sm leading-5 text-foreground" />
                </Toast.Message>
                <Toast.Close className="grid size-7 place-items-center rounded-md text-xl text-muted-foreground hover:bg-muted hover:text-foreground">
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
  useEffect(() => {
    return subscribeToFeedback((message) => {
      toast[message.severity]({
        description: message.detail,
        dismissible: true,
        duration: message.duration ?? toastDurationBySeverity[message.severity],
        title: message.summary
      });
    });
  }, []);

  return (
    <Toaster.Root limit={4} mode="expanded" timeout={5000}>
      <AppToastContent />
    </Toaster.Root>
  );
};
