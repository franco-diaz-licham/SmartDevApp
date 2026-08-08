import { apiClient } from '@/lib/api/apiClient';
import type { BaseQuery } from '@/lib/api/api.types';
import type {
  CreateNoteRequestDto,
  CreateNoteResponseDto,
  OwnerNoteDetailResponse,
  OwnerNoteListPageResponse,
  PublicNoteCategoryPageResponse,
  PublicNoteDetailResponse,
  PublicNoteListItemResponse,
  PublicNoteListPageResponse,
  PublicNoteSearchPageResponse,
  PublicNoteTagPageResponse,
  PublicSearchIndexResponse,
  UpdateNoteRequestDto,
  UpdateNoteResponseDto
} from '../types/note.api.types';

const NOTES_URL = '/notes';
const OWNER_NOTES_URL = '/owner/notes';

export const noteService = {
  getPublicNotes(request: BaseQuery = {}): Promise<PublicNoteListPageResponse> {
    return apiClient.getPage<PublicNoteListItemResponse, BaseQuery>(NOTES_URL, request);
  },

  getOwnerNotes(request: BaseQuery = {}): Promise<OwnerNoteListPageResponse> {
    return apiClient.getPage<PublicNoteListItemResponse, BaseQuery>(OWNER_NOTES_URL, request);
  },

  getOwnerNoteById(noteId: string): Promise<OwnerNoteDetailResponse> {
    return apiClient.getSingle<OwnerNoteDetailResponse>(`${OWNER_NOTES_URL}/${encodeURIComponent(noteId)}`);
  },

  getPublicNoteBySlug(slug: string): Promise<PublicNoteDetailResponse> {
    return apiClient.getSingle<PublicNoteDetailResponse>(`${NOTES_URL}/${encodeURIComponent(slug)}`);
  },

  getPublicNoteCategories(request: BaseQuery = {}): Promise<PublicNoteCategoryPageResponse> {
    return apiClient.getPage<string, BaseQuery>(`${NOTES_URL}/categories`, request);
  },

  getPublicNoteTags(request: BaseQuery = {}): Promise<PublicNoteTagPageResponse> {
    return apiClient.getPage<string, BaseQuery>(`${NOTES_URL}/tags`, request);
  },

  searchPublicNotes(request: BaseQuery = {}): Promise<PublicNoteSearchPageResponse> {
    return apiClient.getPage<PublicNoteListItemResponse, BaseQuery>(`${NOTES_URL}/search`, request);
  },

  getPublicNoteSearchIndex(): Promise<PublicSearchIndexResponse> {
    return apiClient.getSingle<PublicSearchIndexResponse>(`${NOTES_URL}/search-index`);
  },

  createNote(request: CreateNoteRequestDto): Promise<CreateNoteResponseDto> {
    return apiClient.post<CreateNoteResponseDto>(OWNER_NOTES_URL, request);
  },

  updateNote(noteId: string, request: UpdateNoteRequestDto): Promise<UpdateNoteResponseDto> {
    return apiClient.put<UpdateNoteResponseDto>(`${OWNER_NOTES_URL}/${encodeURIComponent(noteId)}`, request);
  }
};
