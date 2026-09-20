export type JournalEntryTypeModel = 'Note' | 'DailyNote' | 'ImplementationPlan' | 'Decision' | 'DebuggingLog' | 'LearningNote' | 'Retrospective' | 'ReleaseNote';

export type JournalEntryStatusModel = 'Active' | 'Blocked' | 'Resolved' | 'Deferred' | 'Archived';

export type JournalConfidenceModel = 'Confirmed' | 'Tentative' | 'NeedsFollowUp';

export interface JournalCompanyModel {
  name: string;
  roleTitle: string | null;
}

export interface JournalTagModel {
  slug: string;
  displayName: string;
}

export interface JournalListItemModel {
  id: string;
  title: string;
  entryType: JournalEntryTypeModel;
  status: JournalEntryStatusModel;
  tags: JournalTagModel[];
  company: JournalCompanyModel | null;
  workplaceContext: string | null;
  outcome: string | null;
  impact: string | null;
  confidence: JournalConfidenceModel;
  occurredOn: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface JournalDetailModel extends JournalListItemModel {
  bodyMarkdown: string;
  collaborators: string[];
  relatedArticles: JournalRelatedArticleModel[];
  decisions: string[];
  blockers: string[];
  nextActions: string[];
  archivedAt: Date | null;
}

export interface JournalRelatedArticleModel {
  articleId: string;
  title: string;
}

export interface JournalEntryFormModel {
  title: string;
  bodyMarkdown: string;
  entryType: JournalEntryTypeModel;
  status: JournalEntryStatusModel;
  tags: string;
  companyName: string;
  companyRoleTitle: string;
  workplaceContext: string;
  outcome: string;
  impact: string;
  collaborators: string;
  confidence: JournalConfidenceModel;
  decisions: string;
  blockers: string;
  nextActions: string;
  occurredOn: string;
}

export interface JournalSaveResultModel {
  entryId: string;
}
