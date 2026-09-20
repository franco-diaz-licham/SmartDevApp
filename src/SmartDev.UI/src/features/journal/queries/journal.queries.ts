import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapJournalDetailResponseToEntryFormModel, mapJournalDetailResponseToModel, mapJournalListItemResponseToModel } from '../mappers/journal.mapper';
import { journalService } from '../services/journal.services';

export const journalKeys = {
  all: ['journal'] as const,
  lists: () => [...journalKeys.all, 'list'] as const,
  ownerList: (query: BaseQuery) => [...journalKeys.lists(), 'owner', query] as const,
  details: () => [...journalKeys.all, 'detail'] as const,
  ownerDetail: (entryId: string) => [...journalKeys.details(), 'owner', entryId] as const,
  ownerEntry: (entryId: string) => [...journalKeys.details(), 'owner-entry', entryId] as const
};

export const useOwnerJournalEntriesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 30,
    ...query
  };

  return useInfiniteQuery({
    queryKey: journalKeys.ownerList(initialQuery),
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

export const useOwnerJournalEntryQuery = (entryId: string, enabled = true) =>
  useQuery({
    queryKey: journalKeys.ownerDetail(entryId),
    queryFn: async () => mapJournalDetailResponseToModel(await journalService.getEntryById(entryId)),
    enabled: enabled && entryId.trim().length > 0
  });

export const useOwnerJournalEntryFormQuery = (entryId: string, enabled = true) =>
  useQuery({
    queryKey: journalKeys.ownerEntry(entryId),
    queryFn: async () => mapJournalDetailResponseToEntryFormModel(await journalService.getEntryById(entryId)),
    enabled: enabled && entryId.trim().length > 0
  });
