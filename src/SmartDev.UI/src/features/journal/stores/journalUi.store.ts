import { create } from 'zustand';
import type { JournalEntryStatusModel, JournalEntryTypeModel } from '../types/journal.types';
import { allJournalStatuses, allJournalTypes } from '../utils/journalContent';

export type JournalSortDirection = 'asc' | 'desc';

export interface JournalUiState {
  searchTerm: string;
  selectedEntryType: JournalEntryTypeModel | typeof allJournalTypes;
  selectedStatus: JournalEntryStatusModel | typeof allJournalStatuses;
  occurredDateSortDirection: JournalSortDirection;
  setSearchTerm: (searchTerm: string) => void;
  selectEntryType: (entryType: JournalEntryTypeModel | typeof allJournalTypes) => void;
  selectStatus: (status: JournalEntryStatusModel | typeof allJournalStatuses) => void;
  setOccurredDateSortDirection: (sortDirection: JournalSortDirection) => void;
  resetFilters: () => void;
}

export const useJournalUiStore = create<JournalUiState>((set) => ({
  searchTerm: '',
  selectedEntryType: allJournalTypes,
  selectedStatus: allJournalStatuses,
  occurredDateSortDirection: 'desc',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  selectEntryType: (selectedEntryType) => set({ selectedEntryType }),
  selectStatus: (selectedStatus) => set({ selectedStatus }),
  setOccurredDateSortDirection: (occurredDateSortDirection) => set({ occurredDateSortDirection }),
  resetFilters: () =>
    set({
      searchTerm: '',
      selectedEntryType: allJournalTypes,
      selectedStatus: allJournalStatuses,
      occurredDateSortDirection: 'desc'
    })
}));
