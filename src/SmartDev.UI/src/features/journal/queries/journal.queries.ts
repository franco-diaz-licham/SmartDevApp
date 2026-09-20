import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapJournalDetailResponseToEntryFormModel, mapJournalDetailResponseToModel, mapJournalListItemResponseToModel } from '../mappers/journal.mapper';
import { journalService } from '../services/journal.services';

export const journalKeys = {
  all: ['journal'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  list: (query: BaseQuery) => [...journalKeys.lists(), 'private', query] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  detail: (entryId: string) => [...journalKeys.details(), 'private', entryId] as const,
  entry: (entryId: string) => [...journalKeys.details(), 'entry', entryId] as const
};

export const useJournalEntriesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 30,
    ...query
  };

  return useInfiniteQuery({
    queryKey: journalKeys.list(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await journalService.getEntries({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapJournalListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

export const useJournalEntryQuery = (entryId: string, enabled = true) =>
  useQuery({
    queryKey: journalKeys.detail(entryId),
    queryFn: async () => mapJournalDetailResponseToModel(await journalService.getEntryById(entryId)),
    enabled: enabled && entryId.trim().length > 0
  });

export const useJournalEntryFormQuery = (entryId: string, enabled = true) =>
  useQuery({
    queryKey: journalKeys.entry(entryId),
    queryFn: async () => mapJournalDetailResponseToEntryFormModel(await journalService.getEntryById(entryId)),
    enabled: enabled && entryId.trim().length > 0
  });
