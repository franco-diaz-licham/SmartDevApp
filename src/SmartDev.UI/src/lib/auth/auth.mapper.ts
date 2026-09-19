import type { AccountInfo } from '@azure/msal-browser';
import type { AuthAccount } from '@/features/auth/types/auth.types';

export const toAuthAccount = (account: AccountInfo | null): AuthAccount | null => {
  if (!account) return null;

  return {
    id: account.localAccountId,
    name: account.name,
    username: account.username,
    tenantId: account.tenantId
  };
};

