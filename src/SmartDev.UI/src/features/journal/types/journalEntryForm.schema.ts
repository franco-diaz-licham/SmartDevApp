import { z } from 'zod';
import type { JournalEntryFormModel } from './journal.types';

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export const journalEntryBodyTemplate = `## What I did

## Outcome

## Impact

## Decisions

## Blockers

## Next actions
`;

export const journalEntryFormLimits = {
  title: 160,
  tags: 500,
  bodyMarkdown: 200_000,
  companyName: 160,
  companyRoleTitle: 160,
  collaborators: 500
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
  companyName: z.string().trim().max(journalEntryFormLimits.companyName, `Company must be ${journalEntryFormLimits.companyName} characters or less.`),
  companyRoleTitle: z.string().trim().max(journalEntryFormLimits.companyRoleTitle, `Role title must be ${journalEntryFormLimits.companyRoleTitle} characters or less.`),
  collaborators: z.string().trim().max(journalEntryFormLimits.collaborators, `Collaborators must be ${journalEntryFormLimits.collaborators} characters or less.`),
  confidence: z.enum(journalConfidenceOptions),
  relatedJournalEntries: z.array(z.object({ entryId: z.string().trim().min(1), title: z.string().trim().min(1) })),
  occurredOn: z.string().trim().min(1, 'Date is required.')
}) satisfies z.ZodType<JournalEntryFormModel>;

export const defaultJournalEntryFormValues: JournalEntryFormModel = {
  title: '',
  bodyMarkdown: journalEntryBodyTemplate,
  entryType: 'Note',
  status: 'Active',
  tags: '',
  companyName: '',
  companyRoleTitle: '',
  collaborators: '',
  confidence: 'Confirmed',
  relatedJournalEntries: [],
  occurredOn: todayIsoDate()
};

export type JournalEntryFormErrors = Partial<Record<keyof JournalEntryFormModel, string>>;
