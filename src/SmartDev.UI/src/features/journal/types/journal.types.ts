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
  confidence: JournalConfidenceModel;
  occurredOn: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface JournalDetailModel extends JournalListItemModel {
  bodyMarkdown: string;
  collaborators: string[];
  relatedJournalEntries: JournalRelatedJournalEntryModel[];
  archivedAt: Date | null;
}

export interface JournalRelatedJournalEntryModel {
  entryId: string;
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
  collaborators: string;
  confidence: JournalConfidenceModel;
  relatedJournalEntries: JournalRelatedJournalEntryModel[];
  occurredOn: string;
}

export interface JournalSaveResultModel {
  entryId: string;
}
