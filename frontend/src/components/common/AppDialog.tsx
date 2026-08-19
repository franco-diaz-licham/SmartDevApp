import { Dialog } from 'primereact/dialog';
import type { DialogRootChangeEvent } from '@primereact/types/primitive/dialog';
import type { ReactNode } from 'react';
import { AppButton } from '@/components/ui/AppButton';
import { cn } from '@/lib/cn';

export type AppDialogIntent = 'info' | 'success' | 'error';

type AppDialogProps = {
  children: ReactNode;
  footer?: ReactNode;
  intent?: AppDialogIntent;
  open: boolean;
  title: ReactNode;
  onOpenChange: (open: boolean) => void;
};

const intentTitleClassNames: Record<AppDialogIntent, string> = {
  info: 'text-foreground',
  success: 'text-primary',
  error: 'text-destructive'
};

export const AppDialog = ({ children, footer, intent = 'info', open, title, onOpenChange }: AppDialogProps) => {
  return (
    <Dialog.Root blockScroll dismissable modal open={open} onOpenChange={(event: DialogRootChangeEvent) => onOpenChange(Boolean(event.value))}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/45" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup className="w-full max-w-md rounded-md border border-border bg-background shadow-xl">
            <Dialog.Header className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <Dialog.Title className={cn('text-2xl font-bold leading-tight', intentTitleClassNames[intent])}>{title}</Dialog.Title>
              <Dialog.Close className="grid size-8 place-items-center rounded-md text-2xl text-muted-foreground hover:bg-muted hover:text-foreground">
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close dialog</span>
              </Dialog.Close>
            </Dialog.Header>
            <Dialog.Content className="px-6 py-5 text-foreground">{children}</Dialog.Content>
            {footer ? <Dialog.Footer className="flex justify-end gap-3 border-t border-border px-6 py-4">{footer}</Dialog.Footer> : null}
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

type AppAlertDialogProps = {
  intent?: AppDialogIntent;
  message: ReactNode;
  open: boolean;
  primaryLabel?: string;
  title: ReactNode;
  onClose: () => void;
};

export const AppAlertDialog = ({ intent = 'info', message, open, primaryLabel = 'OK', title, onClose }: AppAlertDialogProps) => {
  return (
    <AppDialog
      footer={
        <AppButton className="mb-0 mt-0" onClick={onClose}>
          {primaryLabel}
        </AppButton>
      }
      intent={intent}
      open={open}
      title={title}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      {typeof message === 'string' ? <p>{message}</p> : message}
    </AppDialog>
  );
};
