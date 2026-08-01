import { toast } from 'primereact/toaster';
import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppToast } from './AppToast';
import { AppToastContext, type AppToastOptions } from './AppToastContext';

type AppToastProviderProps = {
  children: ReactNode;
};

const showToast = ({ duration = 5000, intent = 'info', message, title }: AppToastOptions) => {
  toast[intent]({
    description: message,
    dismissible: true,
    duration,
    title
  });
};

export const AppToastProvider = ({ children }: AppToastProviderProps) => {
  const show = useCallback((options: AppToastOptions) => {
    showToast(options);
  }, []);

  const value = useMemo(
    () => ({
      error: (options: Omit<AppToastOptions, 'intent'>) => show({ ...options, intent: 'error' }),
      info: (options: Omit<AppToastOptions, 'intent'>) => show({ ...options, intent: 'info' }),
      show,
      success: (options: Omit<AppToastOptions, 'intent'>) => show({ ...options, intent: 'success' }),
      warn: (options: Omit<AppToastOptions, 'intent'>) => show({ ...options, intent: 'warn' })
    }),
    [show]
  );

  return (
    <AppToastContext.Provider value={value}>
      {children}
      <AppToast />
    </AppToastContext.Provider>
  );
};
