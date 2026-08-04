type AppEnvKey = 'VITE_API_BASE_URL' | 'VITE_API_VERSION' | 'VITE_APP_NAME' | 'VITE_ENTRA_CLIENT_ID' | 'VITE_ENTRA_API_SCOPE' | 'VITE_ENTRA_AUTHORITY' | 'VITE_PRIMEREACT_LICENSE_KEY';

const readEnvValue = (key: AppEnvKey, fallback = ''): string => import.meta.env[key]?.trim() || fallback;

const rootUrl = readEnvValue('VITE_API_BASE_URL', '').replace(/\/+$/, '');
const apiVersion = readEnvValue('VITE_API_VERSION', 'v1').replace(/^\/+|\/+$/g, '');

export const appConfig = {
  apiBaseUrl: `${rootUrl}/api/${apiVersion}`,
  appName: readEnvValue('VITE_APP_NAME', 'SmartDevApp'),
  entraClientId: readEnvValue('VITE_ENTRA_CLIENT_ID'),
  entraApiScope: readEnvValue('VITE_ENTRA_API_SCOPE'),
  entraAuthority: readEnvValue('VITE_ENTRA_AUTHORITY'),
  primeReactLicense: readEnvValue('VITE_PRIMEREACT_LICENSE_KEY')
} as const;
