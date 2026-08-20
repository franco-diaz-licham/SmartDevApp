import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { getErrorFeedbackDetail, getErrorFeedbackSummary } from '@/lib/api/apiError';
import { publishFeedback } from '@/lib/feedback/feedbackEvents';
import { AppToast } from './AppToast';
import { AppToastContext, type AppToastErrorOptions, type AppToastOptions } from './AppToastContext';

type AppToastProviderProps = {
  children: ReactNode;
};

const showToast = ({ duration = 5000, intent = 'info', message, title }: AppToastOptions) => {
  publishFeedback({
    detail: message,
    duration,
    severity: intent,
    summary: title
  });
};

const getErrorMessage = (error: unknown, message: ReactNode | undefined): ReactNode => {
  if (message) return message;
  if (!error) return 'Something went wrong.';
  return getErrorFeedbackDetail(error);
};

const showErrorToast = ({ duration = 5000, error, message, title }: AppToastErrorOptions) => {
  publishFeedback({
    detail: getErrorMessage(error, message),
    duration,
    severity: 'error',
    summary: title ?? (error ? getErrorFeedbackSummary(error) : 'Something went wrong')
  });
};

export const AppToastProvider = ({ children }: AppToastProviderProps) => {
  const show = useCallback((options: AppToastOptions) => {
    showToast(options);
  }, []);

  const value = useMemo(
    () => ({
      error: showErrorToast,
      info: (options: AppToastOptions) => show({ ...options, intent: 'info' }),
      show,
      success: (options: AppToastOptions) => show({ ...options, intent: 'success' }),
      warn: (options: AppToastOptions) => show({ ...options, intent: 'warn' })
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
