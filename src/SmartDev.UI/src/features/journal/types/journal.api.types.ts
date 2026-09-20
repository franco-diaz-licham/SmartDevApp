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
  summary: string | null;
  entryType: JournalEntryTypeModel;
  status: JournalEntryStatusModel;
  tags: JournalTagResponse[];
  company: JournalCompanyResponse | null;
  workplaceContext: string | null;
  outcome: string | null;
  impact: string | null;
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
  decisions: string[];
  blockers: string[];
  nextActions: string[];
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
  summary: string | null;
  company: JournalCompanyRequestDto | null;
  workplaceContext: string | null;
  outcome: string | null;
  impact: string | null;
  collaborators: string[];
  confidence: JournalConfidenceModel;
  relatedArticles: JournalRelatedArticleRequestDto[];
  decisions: string[];
  blockers: string[];
  nextActions: string[];
  occurredOn: string;
}

export interface JournalSaveResultResponse {
  entryId: string;
}
