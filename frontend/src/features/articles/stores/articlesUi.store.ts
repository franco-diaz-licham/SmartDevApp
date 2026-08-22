import { create } from 'zustand';
import { allArticlesCategory } from '../utils/articleContent';

export type ArticlePublishedDateSortDirection = 'desc' | 'asc';

export interface ArticlesUiState {
  publishedDateSortDirection: ArticlePublishedDateSortDirection;
  searchTerm: string;
  selectedCategory: string;
  resetFilters: () => void;
  selectCategory: (category: string) => void;
  setPublishedDateSortDirection: (sortDirection: ArticlePublishedDateSortDirection) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export const useArticlesUiStore = create<ArticlesUiState>((set) => ({
  publishedDateSortDirection: 'desc',
  searchTerm: '',
  selectedCategory: allArticlesCategory,

  resetFilters: () => {
    set({
      publishedDateSortDirection: 'desc',
      searchTerm: '',
      selectedCategory: allArticlesCategory
    });
  },

  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  setPublishedDateSortDirection: (publishedDateSortDirection) => {
    set({ publishedDateSortDirection });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  }
}));
