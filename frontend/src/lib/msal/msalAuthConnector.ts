import { BrowserAuthError, InteractionRequiredAuthError, PublicClientApplication, type IPublicClientApplication } from '@azure/msal-browser';
import { appConfig } from '@/app/appConfig';
import type { AuthAccount } from '@/features/auth/types/auth.types';
import { toAuthAccount } from './msalAccount.mapper';
import { msalConfig } from './msalConfig';
import type { MsalAuthConnector, MsalAuthRequest, MsalTokenOptions } from './msal.types';

const loginRequest: MsalAuthRequest = {
  scopes: [appConfig.entraApiScope].filter(Boolean),
  prompt: 'select_account'
};

let msalInstance: IPublicClientApplication | null = null;

const getMsalInstance = (): IPublicClientApplication => {
  if (msalInstance === null) throw new Error('Authentication has not been initialised.');
  return msalInstance;
};

const selectCachedAccountWhenNeeded = (instance: IPublicClientApplication) => {
  if (instance.getActiveAccount()) return;
  const [firstAccount] = instance.getAllAccounts();
  if (firstAccount) instance.setActiveAccount(firstAccount);
};

export const msalAuthConnector: MsalAuthConnector = {
  async initialize(): Promise<void> {
    if (!appConfig.entraClientId || !appConfig.entraAuthority) return;

    msalInstance ??= new PublicClientApplication(msalConfig);
    const instance = getMsalInstance();
    await instance.initialize();
    selectCachedAccountWhenNeeded(instance);
  },

  async handleRedirect(): Promise<void> {
    const instance = getMsalInstance();
    const result = await instance.handleRedirectPromise();
    if (result?.account) instance.setActiveAccount(result.account);
    selectCachedAccountWhenNeeded(instance);
  },

  getCurrentAccount(): AuthAccount | null {
    if (!msalInstance) return null;

    const instance = getMsalInstance();
    selectCachedAccountWhenNeeded(instance);
    return toAuthAccount(instance.getActiveAccount());
  },

  async login(redirectStartPage): Promise<void> {
    const instance = getMsalInstance();
    instance.setActiveAccount(null);
    await instance.loginRedirect({ ...loginRequest, redirectStartPage: redirectStartPage ?? '/' });
  },

  async logout(): Promise<void> {
    const instance = getMsalInstance();
    await instance.logoutRedirect({ account: instance.getActiveAccount() ?? undefined, postLogoutRedirectUri: '/' });
  },

  async getAccessToken({ allowRedirect, beforeRedirect }: MsalTokenOptions): Promise<string | null> {
    const instance = getMsalInstance();
    const account = instance.getActiveAccount();
    if (!account) return null;

    try {
      const result = await instance.acquireTokenSilent({
        ...loginRequest,
        account
      });
      return result.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError && allowRedirect) {
        beforeRedirect?.();
        await instance.acquireTokenRedirect(loginRequest);
      }

      return null;
    }
  },

  isInteractionInProgressError(err: unknown): boolean {
    return err instanceof BrowserAuthError && err.errorCode === 'interaction_in_progress';
  }
};

