export interface ArticleSectionModel {
  id: string;
  title: string;
  level: number;
}

export const allArticlesCategory = 'All articles';

export const getArticleSectionId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getUniqueArticleSectionId = (title: string, usedIds: Map<string, number>) => {
  const baseId = getArticleSectionId(title) || 'section';
  const nextCount = usedIds.get(baseId) ?? 0;
  usedIds.set(baseId, nextCount + 1);
  return nextCount === 0 ? baseId : `${baseId}-${nextCount + 1}`;
};

export const getArticleSections = (markdown: string): ArticleSectionModel[] => {
  const usedIds = new Map<string, number>();
  const sectionMatches = markdown
    .split('\n')
    .map((line) => /^(#{1,4})\s+(.+)$/.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null);

  const sections = sectionMatches.map((match) => ({
    id: getUniqueArticleSectionId(match[2], usedIds),
    title: match[2],
    level: match[1].length
  }));

  return [{ id: 'overview', title: 'Overview', level: 1 }, ...sections];
};

export const formatArticleDate = (date: Date | null) =>
  date?.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) ?? 'Draft';
