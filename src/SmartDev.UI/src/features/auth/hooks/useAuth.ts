import { useAuthStore } from '../stores/auth.store';

/**
 * Selects the auth state and actions used by UI components.
 *
 * @returns The current account, derived auth flags, public preview controls,
 * login/logout commands, and access-token retrieval helper.
 */
export const useAuth = () => {
  const account = useAuthStore((state) => state.account);
  const hasInitialised = useAuthStore((state) => state.hasInitialised);
  const interactionInProgress = useAuthStore((state) => state.interactionInProgress);
  const isMasqueradingAsPublic = useAuthStore((state) => state.isMasqueradingAsPublic);
  const startPublicMasquerade = useAuthStore((state) => state.startPublicMasquerade);
  const stopPublicMasquerade = useAuthStore((state) => state.stopPublicMasquerade);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isSignedIn = Boolean(account);
  const isPublicView = isMasqueradingAsPublic || !isSignedIn;

  return {
    account,
    isSignedIn,
    isPublicView,
    isMasqueradingAsPublic,
    isAuthReady: hasInitialised,
    interactionInProgress,
    startPublicMasquerade,
    stopPublicMasquerade,
    login,
    logout,
    getAccessToken
  };
};
