import { useEffect, useMemo, useState } from 'react';
import type { BaseQuery, QueryFilter } from '@/lib/api/api.types';
import { useArticlesUiStore } from '../stores/articlesUi.store';
import type { ArticlesUiState } from '../stores/articlesUi.store';
import { allArticlesCategory } from '../utils/articleContent';

type ArticleQueryFilterField = 'category';

type ArticleCategoryFilter = QueryFilter & {
  field: ArticleQueryFilterField;
  operator: Extract<QueryFilter['operator'], 'equals'>;
  value: string;
};

type ArticlesQuerySource = Pick<ArticlesUiState, 'searchTerm' | 'selectedCategory'>;

const articlesSearchDebounceMs = 300;

const useDebouncedValue = <TValue>(value: TValue, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debouncedValue;
};

export const selectArticlesQueryParams = ({ searchTerm, selectedCategory }: ArticlesQuerySource): BaseQuery => {
  const filters: ArticleCategoryFilter[] =
    selectedCategory === allArticlesCategory
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

export const useArticlesQueryParams = () => {
  const searchTerm = useArticlesUiStore((state) => state.searchTerm);
  const selectedCategory = useArticlesUiStore((state) => state.selectedCategory);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, articlesSearchDebounceMs);
  return useMemo(() => selectArticlesQueryParams({ searchTerm: debouncedSearchTerm, selectedCategory }), [debouncedSearchTerm, selectedCategory]);
};
