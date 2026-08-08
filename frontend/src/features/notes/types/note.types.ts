export interface PublicNoteCategoryModel {
  slug: string;
  displayName: string;
}

export interface PublicNoteTagModel {
  slug: string;
  displayName: string;
}

export interface PublicRelatedProjectReferenceModel {
  projectId: string;
  label: string;
}

export interface PublicNoteListItemModel {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: PublicNoteCategoryModel;
  tags: PublicNoteTagModel[];
  updatedAt: Date | null;
  publishedAt: Date;
}

export interface PublicNoteDetailModel extends PublicNoteListItemModel {
  bodyMarkdown: string;
  relatedProjects: PublicRelatedProjectReferenceModel[];
}

export interface PublicNoteSearchDocumentModel {
  id: string;
  type: 'note';
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  bodyText: string;
  url: string;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

export interface PublicSearchIndexModel {
  generatedAt: Date;
  documents: PublicNoteSearchDocumentModel[];
}

export interface NoteEntryModel {
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string;
  bodyMarkdown: string;
}

export interface NoteSaveResultModel {
  noteId: string;
  slug: string;
}
