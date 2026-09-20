import { z } from 'zod';
import type { JournalEntryFormModel } from './journal.types';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const journalEntryFormLimits = {
  title: 160,
  summary: 500,
  tags: 500,
  bodyMarkdown: 200_000,
  companyName: 160,
  companyRoleTitle: 160,
  workplaceContext: 160,
  outcome: 160,
  impact: 500,
  collaborators: 500,
  notes: 1_500
} as const;

export const journalEntryTypeOptions = ['Note', 'DailyNote', 'ImplementationPlan', 'Decision', 'DebuggingLog', 'LearningNote', 'Retrospective', 'ReleaseNote'] as const;

export const journalStatusOptions = ['Active', 'Blocked', 'Resolved', 'Deferred', 'Archived'] as const;

export const journalConfidenceOptions = ['Confirmed', 'Tentative', 'NeedsFollowUp'] as const;

export const journalEntryFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(journalEntryFormLimits.title, `Title must be ${journalEntryFormLimits.title} characters or less.`),
  bodyMarkdown: z.string().trim().min(1, 'Body is required.').max(journalEntryFormLimits.bodyMarkdown, `Body must be ${journalEntryFormLimits.bodyMarkdown} characters or less.`),
  entryType: z.enum(journalEntryTypeOptions),
  status: z.enum(journalStatusOptions),
  tags: z.string().trim().max(journalEntryFormLimits.tags, `Tags must be ${journalEntryFormLimits.tags} characters or less.`),
  summary: z.string().trim().max(journalEntryFormLimits.summary, `Summary must be ${journalEntryFormLimits.summary} characters or less.`),
  companyName: z.string().trim().max(journalEntryFormLimits.companyName, `Company must be ${journalEntryFormLimits.companyName} characters or less.`),
  companyRoleTitle: z.string().trim().max(journalEntryFormLimits.companyRoleTitle, `Role title must be ${journalEntryFormLimits.companyRoleTitle} characters or less.`),
  workplaceContext: z.string().trim().max(journalEntryFormLimits.workplaceContext, `Workplace context must be ${journalEntryFormLimits.workplaceContext} characters or less.`),
  outcome: z.string().trim().max(journalEntryFormLimits.outcome, `Outcome must be ${journalEntryFormLimits.outcome} characters or less.`),
  impact: z.string().trim().max(journalEntryFormLimits.impact, `Impact must be ${journalEntryFormLimits.impact} characters or less.`),
  collaborators: z.string().trim().max(journalEntryFormLimits.collaborators, `Collaborators must be ${journalEntryFormLimits.collaborators} characters or less.`),
  confidence: z.enum(journalConfidenceOptions),
  decisions: z.string().trim().max(journalEntryFormLimits.notes, `Decisions must be ${journalEntryFormLimits.notes} characters or less.`),
  blockers: z.string().trim().max(journalEntryFormLimits.notes, `Blockers must be ${journalEntryFormLimits.notes} characters or less.`),
  nextActions: z.string().trim().max(journalEntryFormLimits.notes, `Next actions must be ${journalEntryFormLimits.notes} characters or less.`),
  occurredOn: z.string().trim().min(1, 'Date is required.')
}) satisfies z.ZodType<JournalEntryFormModel>;

export const defaultJournalEntryFormValues: JournalEntryFormModel = {
  title: '',
  bodyMarkdown: '',
  entryType: 'Note',
  status: 'Active',
  tags: '',
  summary: '',
  companyName: '',
  companyRoleTitle: '',
  workplaceContext: '',
  outcome: '',
  impact: '',
  collaborators: '',
  confidence: 'Confirmed',
  decisions: '',
  blockers: '',
  nextActions: '',
  occurredOn: todayIsoDate()
};

export type JournalEntryFormErrors = Partial<Record<keyof JournalEntryFormModel, string>>;
