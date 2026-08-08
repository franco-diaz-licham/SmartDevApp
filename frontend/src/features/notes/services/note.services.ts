import { apiClient } from '@/lib/api/apiClient';
import type { PublicNoteDetailResponse, PublicNoteListItemResponse, PublicNoteListPageResponse, PublicSearchIndexResponse } from '../types/note.api.types';

const NOTES_URL = '/notes';

interface GetPublicNotesRequest {
  pageSize?: number;
  continuationToken?: string | null;
}

export const noteService = {
  getPublicNotes(request: GetPublicNotesRequest = {}): Promise<PublicNoteListPageResponse> {
    return apiClient.getCursorPage<PublicNoteListItemResponse>(NOTES_URL, {
      pageSize: request.pageSize,
      continuationToken: request.continuationToken
    });
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

  searchPublicNotes(query: string): Promise<PublicNoteListItemResponse[]> {
    return apiClient.getList<PublicNoteListItemResponse>(`${NOTES_URL}/search`, { q: query });
  },

  getPublicNoteSearchIndex(): Promise<PublicSearchIndexResponse> {
    return apiClient.getSingle<PublicSearchIndexResponse>(`${NOTES_URL}/search-index`);
  }
};
