import { useEffect, useMemo, useState } from 'react';
import type { BaseQuery, QueryFilter } from '@/lib/api/api.types';
import type { JournalUiState } from '../stores/journalUi.store';
import { useJournalUiStore } from '../stores/journalUi.store';
import { allJournalCompanies, allJournalStatuses, allJournalTypes } from '../utils/journalContent';

type JournalQuerySource = Pick<JournalUiState, 'occurredDateSortDirection' | 'occurredFrom' | 'occurredTo' | 'searchTerm' | 'selectedCompany' | 'selectedEntryType' | 'selectedStatus'>;

type JournalFilterField = 'company' | 'entryType' | 'occurredOn' | 'status';

type JournalFilter = QueryFilter & {
  field: JournalFilterField;
  operator: Extract<QueryFilter['operator'], 'equals' | 'greaterThanOrEqual' | 'lessThanOrEqual'>;
  value: string;
};

const searchDebounceMs = 300;

const useDebouncedValue = <TValue>(value: TValue, delayMs: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debouncedValue;
};

export const selectJournalQueryParams = ({ occurredDateSortDirection, occurredFrom, occurredTo, searchTerm, selectedCompany, selectedEntryType, selectedStatus }: JournalQuerySource): BaseQuery => {
  const filters: JournalFilter[] = [];

  if (selectedCompany !== allJournalCompanies) {
    filters.push({ field: 'company', operator: 'equals', value: selectedCompany });
  }

  if (selectedEntryType !== allJournalTypes) {
    filters.push({ field: 'entryType', operator: 'equals', value: selectedEntryType });
  }

  if (selectedStatus !== allJournalStatuses) {
    filters.push({ field: 'status', operator: 'equals', value: selectedStatus });
  }

  if (occurredFrom.trim()) {
    filters.push({ field: 'occurredOn', operator: 'greaterThanOrEqual', value: occurredFrom.trim() });
  }

  if (occurredTo.trim()) {
    filters.push({ field: 'occurredOn', operator: 'lessThanOrEqual', value: occurredTo.trim() });
  }

  return {
    pageSize: 30,
    sortBy: 'occurredOn',
    sortDirection: occurredDateSortDirection,
    searchTerm: searchTerm.trim() || null,
    filterMatch: filters.length > 0 ? 'all' : null,
    filters
  };
};

export const useJournalQueryParams = () => {
  const searchTerm = useJournalUiStore((state) => state.searchTerm);
  const selectedCompany = useJournalUiStore((state) => state.selectedCompany);
  const selectedEntryType = useJournalUiStore((state) => state.selectedEntryType);
  const selectedStatus = useJournalUiStore((state) => state.selectedStatus);
  const occurredFrom = useJournalUiStore((state) => state.occurredFrom);
  const occurredTo = useJournalUiStore((state) => state.occurredTo);
  const occurredDateSortDirection = useJournalUiStore((state) => state.occurredDateSortDirection);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, searchDebounceMs);

  return useMemo(
    () => selectJournalQueryParams({ occurredDateSortDirection, occurredFrom, occurredTo, searchTerm: debouncedSearchTerm, selectedCompany, selectedEntryType, selectedStatus }),
    [debouncedSearchTerm, occurredDateSortDirection, occurredFrom, occurredTo, selectedCompany, selectedEntryType, selectedStatus]
  );
};
