import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export type AppToastIntent = 'info' | 'success' | 'warn' | 'error';

export type AppToastOptions = {
  duration?: number;
  intent?: AppToastIntent;
  message: ReactNode;
  title: ReactNode;
};

export type AppToastContextValue = {
  error: (options: Omit<AppToastOptions, 'intent'>) => void;
  info: (options: Omit<AppToastOptions, 'intent'>) => void;
  show: (options: AppToastOptions) => void;
  success: (options: Omit<AppToastOptions, 'intent'>) => void;
  warn: (options: Omit<AppToastOptions, 'intent'>) => void;
};

export const AppToastContext = createContext<AppToastContextValue | null>(null);

/**
 * Reads the app toast API from context.
 *
 * @returns Toast commands for showing intent-specific app notifications.
 * @throws When used outside of AppToastProvider.
 */
export const useAppToast = () => {
  const context = useContext(AppToastContext);
  if (!context) throw new Error('useAppToast must be used within AppToastProvider.');
  return context;
};
