import { type PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
  const hasInitialised = useAuthStore((state) => state.hasInitialised);
  const initialiseAuth = useAuthStore((state) => state.initialiseAuth);

  useEffect(() => {
    if (!hasInitialised) void initialiseAuth();
  }, [hasInitialised, initialiseAuth]);

  if (!hasInitialised) {
    return (
      <main className="min-h-screen bg-background px-4 py-16">
        <div className="mx-auto h-20 max-w-5xl animate-pulse rounded-md border border-border bg-muted" />
      </main>
    );
  }

  return <>{children}</>;
};
