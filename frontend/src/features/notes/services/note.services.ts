import { apiClient } from '@/lib/api/apiClient';
import type { BaseQuery } from '@/lib/api/api.types';
import type { PublicNoteDetailResponse, PublicNoteListItemResponse, PublicNoteListPageResponse, PublicSearchIndexResponse } from '../types/note.api.types';

const NOTES_URL = '/notes';

export const noteService = {
  getPublicNotes(request: BaseQuery = {}): Promise<PublicNoteListPageResponse> {
    return apiClient.getPage<PublicNoteListItemResponse, BaseQuery>(NOTES_URL, request);
  },

  getPublicNoteBySlug(slug: string): Promise<PublicNoteDetailResponse> {
    return apiClient.getSingle<PublicNoteDetailResponse>(`${NOTES_URL}/${encodeURIComponent(slug)}`);
  },

  getPublicNoteCategories(): Promise<string[]> {
    return apiClient.getList<string>(`${NOTES_URL}/categories`);
  },

  getPublicNoteTags(): Promise<string[]> {
    return apiClient.getList<string>(`${NOTES_URL}/tags`);
  },

  searchPublicNotes(request: BaseQuery = {}): Promise<PublicNoteListItemResponse[]> {
    return apiClient.getList<PublicNoteListItemResponse, BaseQuery>(`${NOTES_URL}/search`, request);
  },

  getPublicNoteSearchIndex(): Promise<PublicSearchIndexResponse> {
    return apiClient.getSingle<PublicSearchIndexResponse>(`${NOTES_URL}/search-index`);
  }
};
