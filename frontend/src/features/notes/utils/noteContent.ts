import type { PublicNoteListItemModel } from '../types/note.types';

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

export const getNoteSections = (markdown: string): NoteSectionModel[] => {
  const sectionMatches = markdown
    .split('\n')
    .map((line) => /^(#{2,4})\s+(.+)$/.exec(line.trim()))
    .filter((match): match is RegExpExecArray => match !== null);

  const sections = sectionMatches.map((match) => ({
    id: getNoteSectionId(match[2]) || 'overview',
    title: match[2],
    level: match[1].length
  }));

  return [{ id: 'overview', title: 'Overview', level: 2 }, ...sections];
};

export const formatNoteDate = (date: Date | null) =>
  date?.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) ?? 'Draft';

export const getNoteCategories = (notes: PublicNoteListItemModel[]) => {
  const categoryNames = notes.map((note) => note.category.displayName);
  const sortedCategories = Array.from(new Set(categoryNames)).sort((left, right) => left.localeCompare(right));
  return [allNotesCategory, ...sortedCategories];
};

export const getFilteredNotes = (notes: PublicNoteListItemModel[], selectedCategory: string, searchTerm: string) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return notes.filter((note) => {
    const searchableText = `${note.title} ${note.summary} ${note.category.displayName} ${note.tags.map((tag) => tag.displayName).join(' ')}`;
    const matchesCategory = selectedCategory === allNotesCategory || note.category.displayName === selectedCategory;
    const matchesSearch = normalizedSearch.length === 0 || searchableText.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });
};
