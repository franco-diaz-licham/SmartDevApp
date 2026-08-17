import { beforeEach, describe, expect, test } from 'vitest';
import { allArticlesCategory } from '../utils/articleContent';
import { selectArticlesQueryParams } from '../hooks/useArticlesQueryParams';
import { useArticlesUiStore } from './articlesUi.store';

describe('useArticlesUiStore', () => {
  beforeEach(() => {
    useArticlesUiStore.getState().resetFilters();
  });

  test('derives default query params from empty UI state', () => {
    expect(selectArticlesQueryParams(useArticlesUiStore.getState())).toEqual({
      pageSize: 30,
      searchTerm: null,
      filterMatch: null,
      filters: []
    });
  });

  test('derives query params from search and selected category', () => {
    useArticlesUiStore.getState().setSearchTerm(' cosmos ');
    useArticlesUiStore.getState().selectCategory('Backend');

    expect(selectArticlesQueryParams(useArticlesUiStore.getState())).toEqual({
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
    useArticlesUiStore.getState().setSearchTerm('cosmos');
    useArticlesUiStore.getState().selectCategory('Backend');

    useArticlesUiStore.getState().resetFilters();

    expect(useArticlesUiStore.getState().searchTerm).toBe('');
    expect(useArticlesUiStore.getState().selectedCategory).toBe(allArticlesCategory);
  });
});
