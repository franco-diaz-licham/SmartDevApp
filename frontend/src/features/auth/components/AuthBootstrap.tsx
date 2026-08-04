import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const AuthBootstrap = () => {
  const initialiseAuth = useAuthStore((state) => state.initialiseAuth);

  useEffect(() => {
    void initialiseAuth();
  }, [initialiseAuth]);

  return null;
};

