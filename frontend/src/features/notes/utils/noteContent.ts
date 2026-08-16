export interface NoteSectionModel {
  id: string;
  title: string;
  level: number;
}

export const allNotesCategory = 'All notes';

export const getNoteSectionId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getUniqueNoteSectionId = (title: string, usedIds: Map<string, number>) => {
  const baseId = getNoteSectionId(title) || 'section';
  const nextCount = usedIds.get(baseId) ?? 0;
  usedIds.set(baseId, nextCount + 1);
  return nextCount === 0 ? baseId : `${baseId}-${nextCount + 1}`;
};

export const getNoteSections = (markdown: string): NoteSectionModel[] => {
  const usedIds = new Map<string, number>();
  const sectionMatches = markdown
    .split('\n')
    .map((line) => /^(#{1,4})\s+(.+)$/.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null);

  const sections = sectionMatches.map((match) => ({
    id: getUniqueNoteSectionId(match[2], usedIds),
    title: match[2],
    level: match[1].length
  }));

  return [{ id: 'overview', title: 'Overview', level: 1 }, ...sections];
};

export const formatNoteDate = (date: Date | null) =>
  date?.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) ?? 'Draft';

export const getNoteCategories = (notes: { category: { displayName: string } }[]) => {
  const categoryNames = notes.map((note) => note.category.displayName);
  const sortedCategories = Array.from(new Set(categoryNames)).sort((left, right) => left.localeCompare(right));
  return [allNotesCategory, ...sortedCategories];
};
