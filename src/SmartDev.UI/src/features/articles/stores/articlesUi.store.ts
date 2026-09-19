import { create } from 'zustand';
import { allArticlesCategory, allArticleTypes } from '../utils/articleContent';
import type { ArticleTypeModel } from '../types/article.types';

export type ArticlePublishedDateSortDirection = 'desc' | 'asc';

export interface ArticlesUiState {
  publishedDateSortDirection: ArticlePublishedDateSortDirection;
  searchTerm: string;
  selectedCategory: string;
  selectedArticleType: ArticleTypeModel | typeof allArticleTypes;
  resetFilters: () => void;
  selectCategory: (category: string) => void;
  selectArticleType: (articleType: ArticleTypeModel | typeof allArticleTypes) => void;
  setPublishedDateSortDirection: (sortDirection: ArticlePublishedDateSortDirection) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export const useArticlesUiStore = create<ArticlesUiState>((set) => ({
  publishedDateSortDirection: 'desc',
  searchTerm: '',
  selectedCategory: allArticlesCategory,
  selectedArticleType: allArticleTypes,

  resetFilters: () => {
    set({
      publishedDateSortDirection: 'desc',
      searchTerm: '',
      selectedCategory: allArticlesCategory,
      selectedArticleType: allArticleTypes
    });
  },

  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  selectArticleType: (selectedArticleType) => {
    set({ selectedArticleType });
  },

  setPublishedDateSortDirection: (publishedDateSortDirection) => {
    set({ publishedDateSortDirection });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  }
}));
