import type { PageResult } from '@/lib/api/api.types';

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
}

export interface CreateNoteResponseDto {
  noteId: string;
  slug: string;
}
