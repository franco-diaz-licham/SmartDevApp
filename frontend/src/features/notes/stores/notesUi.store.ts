import { create } from 'zustand';
import { allNotesCategory } from '../utils/noteContent';

export interface NotesUiState {
  searchTerm: string;
  selectedCategory: string;
  resetFilters: () => void;
  selectCategory: (category: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export const useNotesUiStore = create<NotesUiState>((set) => ({
  searchTerm: '',
  selectedCategory: allNotesCategory,

  resetFilters: () => {
    set({
      searchTerm: '',
      selectedCategory: allNotesCategory
    });
  },

  selectCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
  }
}));
