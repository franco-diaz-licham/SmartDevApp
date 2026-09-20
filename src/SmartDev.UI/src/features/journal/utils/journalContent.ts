import type { JournalConfidenceModel, JournalEntryStatusModel, JournalEntryTypeModel } from '../types/journal.types';

export const allJournalTypes = 'All types';
export const allJournalStatuses = 'All statuses';

export const getJournalTypeLabel = (entryType: JournalEntryTypeModel) =>
  ({
    Note: 'Note',
    DailyNote: 'Daily note',
    ImplementationPlan: 'Implementation plan',
    Decision: 'Decision',
    DebuggingLog: 'Debugging log',
    LearningNote: 'Learning note',
    Retrospective: 'Retrospective',
    ReleaseNote: 'Release note'
  })[entryType];

export const getJournalStatusLabel = (status: JournalEntryStatusModel) => status;

export const getJournalConfidenceLabel = (confidence: JournalConfidenceModel) =>
  ({
    Confirmed: 'Confirmed',
    Tentative: 'Tentative',
    NeedsFollowUp: 'Needs follow-up'
  })[confidence];

export const formatJournalDate = (date: string | Date | null | undefined) => {
  if (!date) return 'Not set';
  const parsed = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date;
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
};
