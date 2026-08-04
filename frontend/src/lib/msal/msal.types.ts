import type { AuthAccount } from '@/features/auth/types/auth.types';

export interface MsalTokenOptions {
  allowRedirect: boolean;
  beforeRedirect?: () => void;
}

export interface MsalAuthRequest {
  scopes: string[];
  prompt?: string;
}

export interface MsalAuthConnector {
  initialize: () => Promise<void>;
  handleRedirect: () => Promise<void>;
  getCurrentAccount: () => AuthAccount | null;
  login: (redirectStartPage?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: (options: MsalTokenOptions) => Promise<string | null>;
  isInteractionInProgressError: (err: unknown) => boolean;
}

