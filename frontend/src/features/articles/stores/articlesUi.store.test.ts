import { beforeEach, describe, expect, test } from 'vitest';
import { allArticlesCategory, allArticleTypes } from '../utils/articleContent';
import { selectArticlesQueryParams } from '../hooks/useArticlesQueryParams';
import { useArticlesUiStore } from './articlesUi.store';

describe('useArticlesUiStore', () => {
  beforeEach(() => {
    useArticlesUiStore.getState().resetFilters();
  });

  test('derives default query params from empty UI state', () => {
    expect(selectArticlesQueryParams(useArticlesUiStore.getState())).toEqual({
      pageSize: 30,
      sortBy: 'publishedAt',
      sortDirection: 'desc',
      searchTerm: null,
      filterMatch: null,
      filters: []
    });
  });

  test('derives query params from search, selected category, and selected article type', () => {
    useArticlesUiStore.getState().setSearchTerm(' cosmos ');
    useArticlesUiStore.getState().selectCategory('Backend');
    useArticlesUiStore.getState().selectArticleType('Note');
    useArticlesUiStore.getState().setPublishedDateSortDirection('asc');

    expect(selectArticlesQueryParams(useArticlesUiStore.getState())).toEqual({
      pageSize: 30,
      sortBy: 'publishedAt',
      sortDirection: 'asc',
      searchTerm: 'cosmos',
      filterMatch: 'all',
      filters: [
        {
          field: 'category',
          operator: 'equals',
          value: 'Backend'
        },
        {
          field: 'articleType',
          operator: 'equals',
          value: 'Note'
        }
      ]
    });
  });

  test('resets filter UI state', () => {
    useArticlesUiStore.getState().setSearchTerm('cosmos');
    useArticlesUiStore.getState().selectCategory('Backend');
    useArticlesUiStore.getState().selectArticleType('Note');
    useArticlesUiStore.getState().setPublishedDateSortDirection('asc');

    useArticlesUiStore.getState().resetFilters();

    expect(useArticlesUiStore.getState().publishedDateSortDirection).toBe('desc');
    expect(useArticlesUiStore.getState().searchTerm).toBe('');
    expect(useArticlesUiStore.getState().selectedCategory).toBe(allArticlesCategory);
    expect(useArticlesUiStore.getState().selectedArticleType).toBe(allArticleTypes);
  });
});
