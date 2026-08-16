import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RequireAuthProps {
  fallback?: ReactNode;
}

export const RequireAuth = ({ fallback = null }: RequireAuthProps) => {
  const location = useLocation();
  const { isAuthReady, isSignedIn } = useAuth();

  if (!isAuthReady) return fallback;
  if (!isSignedIn) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <Outlet />;
};
