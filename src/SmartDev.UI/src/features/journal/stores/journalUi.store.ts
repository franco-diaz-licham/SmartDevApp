import { create } from 'zustand';
import type { JournalEntryStatusModel, JournalEntryTypeModel } from '../types/journal.types';
import { allJournalCompanies, allJournalStatuses, allJournalTypes } from '../utils/journalContent';

export type JournalSortDirection = 'asc' | 'desc';

export interface JournalUiState {
  searchTerm: string;
  selectedCompany: string;
  selectedEntryType: JournalEntryTypeModel | typeof allJournalTypes;
  selectedStatus: JournalEntryStatusModel | typeof allJournalStatuses;
  occurredFrom: string;
  occurredTo: string;
  occurredDateSortDirection: JournalSortDirection;
  setSearchTerm: (searchTerm: string) => void;
  selectCompany: (company: string) => void;
  selectEntryType: (entryType: JournalEntryTypeModel | typeof allJournalTypes) => void;
  selectStatus: (status: JournalEntryStatusModel | typeof allJournalStatuses) => void;
  setOccurredFrom: (occurredFrom: string) => void;
  setOccurredTo: (occurredTo: string) => void;
  setOccurredDateSortDirection: (sortDirection: JournalSortDirection) => void;
  resetFilters: () => void;
}

export const useJournalUiStore = create<JournalUiState>((set) => ({
  searchTerm: '',
  selectedCompany: allJournalCompanies,
  selectedEntryType: allJournalTypes,
  selectedStatus: allJournalStatuses,
  occurredFrom: '',
  occurredTo: '',
  occurredDateSortDirection: 'desc',
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  selectCompany: (selectedCompany) => set({ selectedCompany }),
  selectEntryType: (selectedEntryType) => set({ selectedEntryType }),
  selectStatus: (selectedStatus) => set({ selectedStatus }),
  setOccurredFrom: (occurredFrom) => set({ occurredFrom }),
  setOccurredTo: (occurredTo) => set({ occurredTo }),
  setOccurredDateSortDirection: (occurredDateSortDirection) => set({ occurredDateSortDirection }),
  resetFilters: () =>
    set({
      searchTerm: '',
      selectedCompany: allJournalCompanies,
      selectedEntryType: allJournalTypes,
      selectedStatus: allJournalStatuses,
      occurredFrom: '',
      occurredTo: '',
      occurredDateSortDirection: 'desc'
    })
}));
