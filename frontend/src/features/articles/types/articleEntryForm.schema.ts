import { z } from 'zod';
import type { ArticleEntryModel } from './article.types';

export const articleEntryFormLimits = {
  title: 160,
  slug: 120,
  summary: 500,
  category: 120,
  tags: 500,
  bodyMarkdown: 50_000
} as const;

export const articleStatusOptions = ['Draft', 'Published', 'Archived'] as const;

export const articleVisibilityOptions = ['Private', 'Public'] as const;

export const articleEntryFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(articleEntryFormLimits.title, `Title must be ${articleEntryFormLimits.title} characters or less.`),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required.')
    .max(articleEntryFormLimits.slug, `Slug must be ${articleEntryFormLimits.slug} characters or less.`)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  summary: z.string().trim().min(1, 'Summary is required.').max(articleEntryFormLimits.summary, `Summary must be ${articleEntryFormLimits.summary} characters or less.`),
  category: z.string().trim().min(1, 'Category is required.').max(articleEntryFormLimits.category, `Category must be ${articleEntryFormLimits.category} characters or less.`),
  tags: z.string().trim().min(1, 'At least one tag is required.').max(articleEntryFormLimits.tags, `Tags must be ${articleEntryFormLimits.tags} characters or less.`),
  bodyMarkdown: z.string().trim().min(1, 'Body is required.').max(articleEntryFormLimits.bodyMarkdown, `Body must be ${articleEntryFormLimits.bodyMarkdown} characters or less.`),
  status: z.enum(articleStatusOptions),
  visibility: z.enum(articleVisibilityOptions)
}) satisfies z.ZodType<ArticleEntryModel>;

export const defaultArticleEntryFormValues: ArticleEntryModel = {
  title: '',
  slug: '',
  summary: '',
  category: '',
  tags: '',
  bodyMarkdown: '',
  status: 'Draft',
  visibility: 'Private'
};

export type ArticleEntryFormErrors = Partial<Record<keyof ArticleEntryModel, string>>;
