import { z } from 'zod';
import type { NoteEntryModel } from './note.types';

export const noteEntryFormLimits = {
  title: 160,
  slug: 120,
  summary: 500,
  category: 120,
  tags: 500,
  bodyMarkdown: 50_000
} as const;

export const noteEntryFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(noteEntryFormLimits.title, `Title must be ${noteEntryFormLimits.title} characters or less.`),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .max(noteEntryFormLimits.slug, `Slug must be ${noteEntryFormLimits.slug} characters or less.`)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  summary: z.string().trim().min(1, 'Summary is required.').max(noteEntryFormLimits.summary, `Summary must be ${noteEntryFormLimits.summary} characters or less.`),
  category: z.string().trim().min(1, 'Category is required.').max(noteEntryFormLimits.category, `Category must be ${noteEntryFormLimits.category} characters or less.`),
  tags: z.string().trim().min(1, 'At least one tag is required.').max(noteEntryFormLimits.tags, `Tags must be ${noteEntryFormLimits.tags} characters or less.`),
  bodyMarkdown: z.string().trim().min(1, 'Body is required.').max(noteEntryFormLimits.bodyMarkdown, `Body must be ${noteEntryFormLimits.bodyMarkdown} characters or less.`)
}) satisfies z.ZodType<NoteEntryModel>;

export const defaultNoteEntryFormValues: NoteEntryModel = {
  title: '',
  slug: '',
  summary: '',
  category: '',
  tags: '',
  bodyMarkdown: ''
};

export type NoteEntryFormErrors = Partial<Record<keyof NoteEntryModel, string>>;
