import { useEffect, useMemo, useState } from 'react';
import type { BaseQuery, QueryFilter } from '@/lib/api/api.types';
import type { JournalUiState } from '../stores/journalUi.store';
import { useJournalUiStore } from '../stores/journalUi.store';
import { allJournalStatuses, allJournalTypes } from '../utils/journalContent';

type JournalQuerySource = Pick<JournalUiState, 'occurredDateSortDirection' | 'searchTerm' | 'selectedEntryType' | 'selectedStatus'>;

type JournalFilterField = 'entryType' | 'status';

type JournalFilter = QueryFilter & {
  field: JournalFilterField;
  operator: Extract<QueryFilter['operator'], 'equals'>;
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

export const selectJournalQueryParams = ({ occurredDateSortDirection, searchTerm, selectedEntryType, selectedStatus }: JournalQuerySource): BaseQuery => {
  const filters: JournalFilter[] = [];

  if (selectedEntryType !== allJournalTypes) {
    filters.push({ field: 'entryType', operator: 'equals', value: selectedEntryType });
  }

  if (selectedStatus !== allJournalStatuses) {
    filters.push({ field: 'status', operator: 'equals', value: selectedStatus });
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
  const selectedEntryType = useJournalUiStore((state) => state.selectedEntryType);
  const selectedStatus = useJournalUiStore((state) => state.selectedStatus);
  const occurredDateSortDirection = useJournalUiStore((state) => state.occurredDateSortDirection);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, searchDebounceMs);

  return useMemo(
    () => selectJournalQueryParams({ occurredDateSortDirection, searchTerm: debouncedSearchTerm, selectedEntryType, selectedStatus }),
    [debouncedSearchTerm, occurredDateSortDirection, selectedEntryType, selectedStatus]
  );
};
