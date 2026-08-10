import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthenticatedOnlyProps {
  children: ReactNode;
  when?: boolean;
}

export const AuthenticatedOnly = ({ children, when = true }: AuthenticatedOnlyProps) => {
  const { isAuthenticated, isAuthReady } = useAuth();
  if (!isAuthReady || !isAuthenticated || !when) return null;
  return children;
};
