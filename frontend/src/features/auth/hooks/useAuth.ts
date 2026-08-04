import { useAuthStore } from '../stores/auth.store';

export const useAuth = () => {
  const account = useAuthStore((state) => state.account);
  const hasInitialised = useAuthStore((state) => state.hasInitialised);
  const interactionInProgress = useAuthStore((state) => state.interactionInProgress);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);

  return {
    account,
    isAuthenticated: Boolean(account),
    isAuthReady: hasInitialised,
    interactionInProgress,
    login,
    logout,
    getAccessToken
  };
};

