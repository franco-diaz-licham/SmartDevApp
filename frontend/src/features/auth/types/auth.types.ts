export interface AuthAccount {
  id: string;
  name?: string;
  username: string;
  tenantId: string;
}

export interface AuthTokenOptions {
  allowRedirect: boolean;
  beforeRedirect?: () => void;
}

export interface AuthProvider {
  initialize: () => Promise<void>;
  handleRedirect: () => Promise<void>;
  getCurrentAccount: () => AuthAccount | null;
  login: (redirectStartPage?: string) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: (options: AuthTokenOptions) => Promise<string | null>;
  isInteractionInProgressError: (err: unknown) => boolean;
}
