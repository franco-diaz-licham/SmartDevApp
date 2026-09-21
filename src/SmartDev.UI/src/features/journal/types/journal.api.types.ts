import type { JournalConfidenceModel, JournalEntryStatusModel, JournalEntryTypeModel } from './journal.types';

export interface JournalCompanyResponse {
  name: string;
  roleTitle: string | null;
}

export interface JournalTagResponse {
  slug: string;
  displayName: string;
}

export interface JournalListItemResponse {
  id: string;
  title: string;
  entryType: JournalEntryTypeModel;
  status: JournalEntryStatusModel;
  tags: JournalTagResponse[];
  company: JournalCompanyResponse | null;
  confidence: JournalConfidenceModel;
  occurredOn: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface JournalRelatedArticleResponse {
  articleId: string;
  title: string;
}

export interface JournalDetailResponse extends JournalListItemResponse {
  bodyMarkdown: string;
  collaborators: string[];
  relatedArticles: JournalRelatedArticleResponse[];
  archivedAt: string | null;
}

export interface JournalCompanyRequestDto {
  name: string;
  roleTitle: string | null;
}

export interface JournalTagRequestDto {
  slug: string;
  displayName: string;
}

export interface JournalRelatedArticleRequestDto {
  articleId: string;
  title: string;
}

export interface JournalEntryRequestDto {
  title: string;
  bodyMarkdown: string;
  entryType: JournalEntryTypeModel;
  status: JournalEntryStatusModel;
  tags: JournalTagRequestDto[];
  company: JournalCompanyRequestDto | null;
  collaborators: string[];
  confidence: JournalConfidenceModel;
  relatedArticles: JournalRelatedArticleRequestDto[];
  occurredOn: string;
}

export interface JournalSaveResultResponse {
  entryId: string;
}
