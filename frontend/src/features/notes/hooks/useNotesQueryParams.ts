import { useEffect, useMemo, useState } from 'react';
import type { BaseQuery, QueryFilter } from '@/lib/api/api.types';
import { useNotesUiStore } from '../stores/notesUi.store';
import type { NotesUiState } from '../stores/notesUi.store';
import { allNotesCategory } from '../utils/noteContent';

type NoteQueryFilterField = 'category';

type NoteCategoryFilter = QueryFilter & {
  field: NoteQueryFilterField;
  operator: Extract<QueryFilter['operator'], 'equals'>;
  value: string;
};

type NotesQuerySource = Pick<NotesUiState, 'searchTerm' | 'selectedCategory'>;

const notesSearchDebounceMs = 300;

const useDebouncedValue = <TValue>(value: TValue, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debouncedValue;
};

export const selectNotesQueryParams = ({ searchTerm, selectedCategory }: NotesQuerySource): BaseQuery => {
  const filters: NoteCategoryFilter[] =
    selectedCategory === allNotesCategory
      ? []
      : [
          {
            field: 'category',
            operator: 'equals',
            value: selectedCategory
          }
        ];

  return {
    pageSize: 30,
    searchTerm: searchTerm.trim() || null,
    filterMatch: filters.length > 0 ? 'all' : null,
    filters
  };
};

export const useNotesQueryParams = () => {
  const searchTerm = useNotesUiStore((state) => state.searchTerm);
  const selectedCategory = useNotesUiStore((state) => state.selectedCategory);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, notesSearchDebounceMs);
  return useMemo(() => selectNotesQueryParams({ searchTerm: debouncedSearchTerm, selectedCategory }), [debouncedSearchTerm, selectedCategory]);
};
