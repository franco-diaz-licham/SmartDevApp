import type { PageResult } from '@/lib/api/api.types';

export type NoteStatusDto = 'Draft' | 'Published' | 'Archived';

export type NoteVisibilityDto = 'Private' | 'Public';

export interface PublicNoteCategoryResponse {
  slug: string;
  displayName: string;
}

export interface PublicNoteTagResponse {
  slug: string;
  displayName: string;
}

export interface PublicRelatedProjectReferenceResponse {
  projectId: string;
  label: string;
}

export interface PublicNoteListItemResponse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: PublicNoteCategoryResponse;
  tags: PublicNoteTagResponse[];
  status: NoteStatusDto;
  visibility: NoteVisibilityDto;
  updatedAt: string | null;
  publishedAt: string;
}

export interface PublicNoteDetailResponse extends PublicNoteListItemResponse {
  bodyMarkdown: string;
  relatedProjects: PublicRelatedProjectReferenceResponse[];
}

export interface PublicNoteSearchDocumentResponse {
  id: string;
  type: 'note';
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  bodyText: string;
  url: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface PublicSearchIndexResponse {
  generatedAt: string;
  documents: PublicNoteSearchDocumentResponse[];
}

export type PublicNoteListPageResponse = PageResult<PublicNoteListItemResponse>;

export type OwnerNoteListPageResponse = PageResult<PublicNoteListItemResponse>;

export type OwnerNoteDetailResponse = PublicNoteDetailResponse;

export type PublicNoteCategoryPageResponse = PageResult<string>;

export type PublicNoteTagPageResponse = PageResult<string>;

export type PublicNoteSearchPageResponse = PageResult<PublicNoteListItemResponse>;

export interface CreateNoteCategoryDto {
  slug: string;
  displayName: string;
}

export interface CreateNoteTagDto {
  slug: string;
  displayName: string;
}

export interface CreateNoteRequestDto {
  title: string;
  slug: string;
  summary: string;
  category: CreateNoteCategoryDto;
  tags: CreateNoteTagDto[];
  bodyMarkdown: string;
  status: NoteStatusDto;
  visibility: NoteVisibilityDto;
}

export interface CreateNoteResponseDto {
  noteId: string;
  slug: string;
}

export type UpdateNoteRequestDto = CreateNoteRequestDto;

export type UpdateNoteResponseDto = CreateNoteResponseDto;
