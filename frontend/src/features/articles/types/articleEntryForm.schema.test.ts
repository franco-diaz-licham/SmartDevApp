import { describe, expect, test } from 'vitest';
import { articleEntryFormLimits, articleEntryFormSchema, defaultArticleEntryFormValues } from './articleEntryForm.schema';

const createValidEntry = (bodyMarkdown: string) => ({
  ...defaultArticleEntryFormValues,
  title: 'Cloud concepts',
  slug: 'cloud-concepts',
  summary: 'An in-depth cloud report.',
  category: 'Cloud',
  tags: 'azure',
  bodyMarkdown
});

describe('articleEntryFormSchema', () => {
  test('accepts an article body at the 200,000 character limit', () => {
    expect(articleEntryFormLimits.bodyMarkdown).toBe(200_000);
    expect(articleEntryFormSchema.safeParse(createValidEntry('a'.repeat(200_000))).success).toBe(true);
  });

  test('rejects an article body over the character limit', () => {
    const result = articleEntryFormSchema.safeParse(createValidEntry('a'.repeat(200_001)));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(expect.objectContaining({
        path: ['bodyMarkdown'],
        message: 'Body must be 200000 characters or less.'
      }));
    }
  });
});
