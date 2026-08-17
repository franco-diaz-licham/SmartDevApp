import { create } from 'zustand';
import { allArticlesCategory } from '../utils/articleContent';

export interface ArticlesUiState {
  searchTerm: string;
  selectedCategory: string;
  resetFilters: () => void;
  selectCategory: (category: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export const useArticlesUiStore = create<ArticlesUiState>((set) => ({
  searchTerm: '',
  selectedCategory: allArticlesCategory,

  resetFilters: () => {
    set({
      searchTerm: '',
      selectedCategory: allArticlesCategory
    });
  },

  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  }
}));
