import type {
  PublicNoteCategoryResponse,
  PublicNoteDetailResponse,
  PublicNoteListItemResponse,
  PublicNoteSearchDocumentResponse,
  PublicNoteTagResponse,
  PublicRelatedProjectReferenceResponse,
  PublicSearchIndexResponse
} from '../types/note.api.types';
import type { PublicNoteCategoryModel, PublicNoteDetailModel, PublicNoteListItemModel, PublicNoteSearchDocumentModel, PublicNoteTagModel, PublicRelatedProjectReferenceModel, PublicSearchIndexModel } from '../types/note.types';

const toNullableDate = (value: string | null): Date | null => (value ? new Date(value) : null);

export const mapPublicNoteCategoryResponseToModel = (category: PublicNoteCategoryResponse): PublicNoteCategoryModel => ({
  slug: category.slug,
  displayName: category.displayName
});

export const mapPublicNoteTagResponseToModel = (tag: PublicNoteTagResponse): PublicNoteTagModel => ({
  slug: tag.slug,
  displayName: tag.displayName
});

export const mapPublicRelatedProjectReferenceResponseToModel = (project: PublicRelatedProjectReferenceResponse): PublicRelatedProjectReferenceModel => ({
  projectId: project.projectId,
  label: project.label
});

export const mapPublicNoteListItemResponseToModel = (note: PublicNoteListItemResponse): PublicNoteListItemModel => ({
  id: note.id,
  slug: note.slug,
  title: note.title,
  summary: note.summary,
  category: mapPublicNoteCategoryResponseToModel(note.category),
  tags: note.tags.map(mapPublicNoteTagResponseToModel),
  updatedAt: toNullableDate(note.updatedAt),
  publishedAt: new Date(note.publishedAt)
});

export const mapPublicNoteDetailResponseToModel = (note: PublicNoteDetailResponse): PublicNoteDetailModel => ({
  ...mapPublicNoteListItemResponseToModel(note),
  bodyMarkdown: note.bodyMarkdown,
  relatedProjects: note.relatedProjects.map(mapPublicRelatedProjectReferenceResponseToModel)
});

export const mapPublicNoteSearchDocumentResponseToModel = (document: PublicNoteSearchDocumentResponse): PublicNoteSearchDocumentModel => ({
  id: document.id,
  type: document.type,
  slug: document.slug,
  title: document.title,
  summary: document.summary,
  category: document.category,
  tags: document.tags,
  bodyText: document.bodyText,
  url: document.url,
  updatedAt: toNullableDate(document.updatedAt),
  publishedAt: toNullableDate(document.publishedAt)
});

export const mapPublicSearchIndexResponseToModel = (response: PublicSearchIndexResponse): PublicSearchIndexModel => ({
  generatedAt: new Date(response.generatedAt),
  documents: response.documents.map(mapPublicNoteSearchDocumentResponseToModel)
});
