import type { Configuration } from '@azure/msal-browser';
import { appConfig } from '@/app/appConfig';

export const msalConfig: Configuration = {
  auth: {
    clientId: appConfig.entraClientId,
    authority: appConfig.entraAuthority,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
};

