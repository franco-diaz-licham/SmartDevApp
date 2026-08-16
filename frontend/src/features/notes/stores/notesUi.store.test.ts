import { beforeEach, describe, expect, test } from 'vitest';
import { allNotesCategory } from '../utils/noteContent';
import { selectNotesQueryParams } from '../hooks/useNotesQueryParams';
import { useNotesUiStore } from './notesUi.store';

describe('useNotesUiStore', () => {
  beforeEach(() => {
    useNotesUiStore.getState().resetFilters();
  });

  test('derives default query params from empty UI state', () => {
    expect(selectNotesQueryParams(useNotesUiStore.getState())).toEqual({
      pageSize: 30,
      searchTerm: null,
      filterMatch: null,
      filters: []
    });
  });

  test('derives query params from search and selected category', () => {
    useNotesUiStore.getState().setSearchTerm(' cosmos ');
    useNotesUiStore.getState().selectCategory('Backend');

    expect(selectNotesQueryParams(useNotesUiStore.getState())).toEqual({
      pageSize: 30,
      searchTerm: 'cosmos',
      filterMatch: 'all',
      filters: [
        {
          field: 'category',
          operator: 'equals',
          value: 'Backend'
        }
      ]
    });
  });

  test('resets filter UI state', () => {
    useNotesUiStore.getState().setSearchTerm('cosmos');
    useNotesUiStore.getState().selectCategory('Backend');

    useNotesUiStore.getState().resetFilters();

    expect(useNotesUiStore.getState().searchTerm).toBe('');
    expect(useNotesUiStore.getState().selectedCategory).toBe(allNotesCategory);
  });
});
