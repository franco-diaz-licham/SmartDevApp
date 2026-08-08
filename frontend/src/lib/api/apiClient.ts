import type { ApiQueryParams, PageResult } from './api.types';
import http from './http';

export const apiClient = {
  async getList<T, TQuery extends object = ApiQueryParams>(url: string, params?: TQuery): Promise<T[]> {
    const { data } = await http.get<T[]>(url, { params });
    return data;
  },

  async getSingle<T, TQuery extends object = ApiQueryParams>(url: string, params?: TQuery): Promise<T> {
    const { data } = await http.get<T>(url, { params });
    return data;
  },

  async getPage<T, TQuery extends object = ApiQueryParams>(url: string, params?: TQuery): Promise<PageResult<T>> {
    const { data } = await http.get<PageResult<T>>(url, { params });
    return data;
  },

  async post<T>(url: string, body: unknown): Promise<T> {
    const { data } = await http.post<T>(url, body);
    return data;
  },

  async put<T>(url: string, body: unknown): Promise<T> {
    const { data } = await http.put<T>(url, body);
    return data;
  },

  async patch<T>(url: string, body: unknown): Promise<T> {
    const { data } = await http.patch<T>(url, body);
    return data;
  },

  async delete(url: string, body?: unknown): Promise<void> {
    if (body !== undefined) await http.delete(url, { data: body });
    else await http.delete(url);
  },

  async deleteResult<T>(url: string): Promise<T> {
    const { data } = await http.delete<T>(url);
    return data;
  },

  async postForm<T>(url: string, form: FormData, onUploadProgress?: (progress: number) => void): Promise<T> {
    const { data } = await http.post<T>(url, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      }
    });
    return data;
  },

  async getBlob<TQuery extends object = ApiQueryParams>(url: string, params?: TQuery): Promise<Blob> {
    const response = await http.get(url, { params, responseType: 'blob' });
    return response.data as Blob;
  },

  async postBlob(url: string, body: unknown): Promise<Blob> {
    const response = await http.post(url, body, { responseType: 'blob' });
    return response.data as Blob;
  }
};
