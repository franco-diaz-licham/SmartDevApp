import { useEffect, useMemo, useState } from 'react';
import type { BaseQuery, QueryFilter } from '@/lib/api/api.types';
import { useArticlesUiStore } from '../stores/articlesUi.store';
import type { ArticlesUiState } from '../stores/articlesUi.store';
import { allArticlesCategory, allArticleTypes } from '../utils/articleContent';

type ArticleQueryFilterField = 'category' | 'articleType';

type ArticleFilter = QueryFilter & {
  field: ArticleQueryFilterField;
  operator: Extract<QueryFilter['operator'], 'equals'>;
  value: string;
};

type ArticlesQuerySource = Pick<ArticlesUiState, 'publishedDateSortDirection' | 'searchTerm' | 'selectedCategory' | 'selectedArticleType'>;

const articlesSearchDebounceMs = 300;

const useDebouncedValue = <TValue>(value: TValue, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debouncedValue;
};

export const selectArticlesQueryParams = ({ publishedDateSortDirection, searchTerm, selectedCategory, selectedArticleType }: ArticlesQuerySource): BaseQuery => {
  const filters: ArticleFilter[] = [];

  if (selectedCategory !== allArticlesCategory) {
    filters.push({
      field: 'category',
      operator: 'equals',
      value: selectedCategory
    });
  }

  if (selectedArticleType !== allArticleTypes) {
    filters.push({
      field: 'articleType',
      operator: 'equals',
      value: selectedArticleType
    });
  }

  return {
    pageSize: 30,
    sortBy: 'publishedAt',
    sortDirection: publishedDateSortDirection,
    searchTerm: searchTerm.trim() || null,
    filterMatch: filters.length > 0 ? 'all' : null,
    filters
  };
};

export const useArticlesQueryParams = () => {
  const searchTerm = useArticlesUiStore((state) => state.searchTerm);
  const selectedCategory = useArticlesUiStore((state) => state.selectedCategory);
  const selectedArticleType = useArticlesUiStore((state) => state.selectedArticleType);
  const publishedDateSortDirection = useArticlesUiStore((state) => state.publishedDateSortDirection);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, articlesSearchDebounceMs);
  return useMemo(
    () => selectArticlesQueryParams({ publishedDateSortDirection, searchTerm: debouncedSearchTerm, selectedCategory, selectedArticleType }),
    [debouncedSearchTerm, publishedDateSortDirection, selectedArticleType, selectedCategory]
  );
};
