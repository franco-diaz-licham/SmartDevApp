import axios, { type AxiosInstance } from 'axios';
import { appConfig } from '@/app/appConfig';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import type { QueryFilter } from './api.types';

const serializeParams = (params: object): string => {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (key === 'filters' && Array.isArray(value)) {
      for (const filter of value as QueryFilter[]) search.append(key, `${filter.field}:${filter.operator}:${String(filter.value)}`);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
      continue;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      search.append(key, String(value));
    }
  }

  return search.toString();
};

const http: AxiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { serialize: serializeParams }
});

http.interceptors.request.use(async (config) => {
  const token = await useAuthStore.getState().getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
