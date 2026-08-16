import { useIsFetching } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type GlobalLoadingIndicatorProps = {
  delayMs?: number;
  message?: string;
};

export const GlobalLoadingIndicator = ({ delayMs = 150, message = 'Loading data...' }: GlobalLoadingIndicatorProps) => {
  const activeFetches = useIsFetching();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsVisible(activeFetches > 0);
    }, activeFetches > 0 ? delayMs : 0);

    return () => window.clearTimeout(timerId);
  }, [activeFetches, delayMs]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm" role="status" aria-label={message} aria-live="polite">
      <span className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  );
};
