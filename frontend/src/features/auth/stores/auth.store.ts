import { create } from 'zustand';
import { authProvider } from '@/lib/auth';
import type { AuthAccount } from '../types/auth.types';

interface AuthState {
  account: AuthAccount | null;
  hasInitialised: boolean;
  interactionInProgress: boolean;
  isMasqueradingAsPublic: boolean;
  initialiseAuth: () => Promise<void>;
  syncAccount: () => void;
  startPublicMasquerade: () => void;
  stopPublicMasquerade: () => void;
  login: (redirectStartPage?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

let initialiseAuthPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  account: null,
  hasInitialised: false,
  interactionInProgress: false,
  isMasqueradingAsPublic: false,

  syncAccount: () => {
    set({ account: authProvider.getCurrentAccount() });
  },

  startPublicMasquerade: () => {
    if (!get().account) return;
    set({ isMasqueradingAsPublic: true });
  },

  stopPublicMasquerade: () => {
    set({ isMasqueradingAsPublic: false });
  },

  initialiseAuth: async () => {
    if (get().hasInitialised) return;
    if (initialiseAuthPromise) return initialiseAuthPromise;

    initialiseAuthPromise = (async () => {
      set({ interactionInProgress: true });

      try {
        await authProvider.initialize();
        await authProvider.handleRedirect();
      } finally {
        set({
          account: authProvider.getCurrentAccount(),
          hasInitialised: true,
          interactionInProgress: false
        });
        initialiseAuthPromise = null;
      }
    })();

    return initialiseAuthPromise;
  },

  login: async (redirectStartPage) => {
    if (get().interactionInProgress) return;

    try {
      set({ interactionInProgress: true });
      await authProvider.login(redirectStartPage);
    } catch (err) {
      if (!authProvider.isInteractionInProgressError(err)) throw err;
    } finally {
      set({ interactionInProgress: false });
    }
  },

  logout: async () => {
    if (get().interactionInProgress) return;

    try {
      set({ interactionInProgress: true });
      await authProvider.logout();
    } catch (err) {
      if (!authProvider.isInteractionInProgressError(err)) throw err;
    } finally {
      set({ interactionInProgress: false, isMasqueradingAsPublic: false });
    }
  },

  getAccessToken: async () => {
    if (!get().account) return null;

    return authProvider.getAccessToken({
      allowRedirect: !get().interactionInProgress,
      beforeRedirect: () => {
        set({ interactionInProgress: true });
      }
    });
  }
}));
