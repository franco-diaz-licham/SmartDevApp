import { type PropsWithChildren, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const AuthBootstrap = ({ children }: PropsWithChildren) => {
  const hasInitialised = useAuthStore((state) => state.hasInitialised);
  const initialiseAuth = useAuthStore((state) => state.initialiseAuth);
  const hasStartedInitialising = useRef(false);

  useEffect(() => {
    if (hasStartedInitialising.current) return;
    hasStartedInitialising.current = true;
    void initialiseAuth();
  }, [initialiseAuth]);

  if (!hasInitialised) return null;
  return <>{children}</>;
};
