import type {
  PublicNoteCategoryResponse,
  PublicNoteDetailResponse,
  PublicNoteListItemResponse,
  PublicNoteSearchDocumentResponse,
  PublicNoteTagResponse,
  PublicRelatedProjectReferenceResponse,
  PublicSearchIndexResponse
} from '../types/note.api.types';
import type {
  NoteEntryModel,
  NoteSaveResultModel,
  PublicNoteCategoryModel,
  PublicNoteDetailModel,
  PublicNoteListItemModel,
  PublicNoteSearchDocumentModel,
  PublicNoteTagModel,
  PublicRelatedProjectReferenceModel,
  PublicSearchIndexModel
} from '../types/note.types';
import type { CreateNoteCategoryDto, CreateNoteRequestDto, CreateNoteResponseDto, CreateNoteTagDto, UpdateNoteRequestDto, UpdateNoteResponseDto } from '../types/note.api.types';

const toNullableDate = (value: string | null): Date | null => (value ? new Date(value) : null);

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const toCreateNoteCategoryDto = (displayName: string): CreateNoteCategoryDto => ({
  slug: toSlug(displayName),
  displayName: displayName.trim()
});

const toCreateNoteTagDto = (displayName: string): CreateNoteTagDto => ({
  slug: toSlug(displayName),
  displayName: displayName.trim()
});

const mapTagTextToCreateNoteTagDtos = (value: string) => {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map(toCreateNoteTagDto);
};

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

export const mapPublicNoteDetailResponseToEntryModel = (note: PublicNoteDetailResponse): NoteEntryModel => ({
  title: note.title,
  slug: note.slug,
  summary: note.summary,
  category: note.category.displayName,
  tags: note.tags.map((tag) => tag.displayName).join(', '),
  bodyMarkdown: note.bodyMarkdown
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

const mapNoteEntryModelToRequestDto = (note: NoteEntryModel): CreateNoteRequestDto => ({
  title: note.title,
  slug: note.slug,
  summary: note.summary,
  category: toCreateNoteCategoryDto(note.category),
  tags: mapTagTextToCreateNoteTagDtos(note.tags),
  bodyMarkdown: note.bodyMarkdown
});

export const mapNoteEntryModelToCreateRequestDto = (note: NoteEntryModel): CreateNoteRequestDto => mapNoteEntryModelToRequestDto(note);

export const mapNoteEntryModelToUpdateRequestDto = (note: NoteEntryModel): UpdateNoteRequestDto => mapNoteEntryModelToRequestDto(note);

export const mapCreateNoteResponseDtoToModel = (response: CreateNoteResponseDto): NoteSaveResultModel => ({
  noteId: response.noteId,
  slug: response.slug
});

export const mapUpdateNoteResponseDtoToModel = (response: UpdateNoteResponseDto): NoteSaveResultModel => ({
  noteId: response.noteId,
  slug: response.slug
});
