import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { BaseQuery } from '@/lib/api/api.types';
import { mapPublicNoteDetailResponseToEntryModel, mapPublicNoteDetailResponseToModel, mapPublicNoteListItemResponseToModel, mapPublicSearchIndexResponseToModel } from '../mappers/note.mapper';
import { noteService } from '../services/note.services';

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  publicList: (query: BaseQuery) => [...noteKeys.lists(), 'public', query] as const,
  ownerList: (query: BaseQuery) => [...noteKeys.lists(), 'owner', query] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  publicDetail: (noteId: string) => [...noteKeys.details(), 'public', noteId] as const,
  ownerDetail: (noteId: string) => [...noteKeys.details(), 'owner', noteId] as const,
  ownerEntry: (noteId: string) => [...noteKeys.details(), 'owner-entry', noteId] as const,
  publicCategories: (query: BaseQuery) => [...noteKeys.all, 'public-categories', query] as const,
  ownerCategories: (query: BaseQuery) => [...noteKeys.all, 'owner-categories', query] as const,
  publicTags: (query: BaseQuery) => [...noteKeys.all, 'public-tags', query] as const,
  publicSearch: (query: BaseQuery) => [...noteKeys.all, 'public-search', query] as const,
  publicSearchIndex: () => [...noteKeys.all, 'public-search-index'] as const
};

/**
 * Loads the public notes feed as an infinite query.
 *
 * @param query - Optional filters, search terms, sorting, and page sizing.
 * @param enabled - Set to false when the current route or auth mode should not
 * issue a public feed request.
 * @returns React Query infinite-query state for mapped public note list pages.
 */
export const usePublicNotesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: noteKeys.publicList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await noteService.getPublicNotes({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

/**
 * Loads the signed-in owner's notes feed as an infinite query.
 *
 * @param query - Optional filters, search terms, sorting, and page sizing.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query infinite-query state for mapped owner note list pages.
 */
export const useOwnerNotesQuery = (query: BaseQuery = {}, enabled = true) => {
  const initialQuery = {
    pageSize: 20,
    ...query
  };

  return useInfiniteQuery({
    queryKey: noteKeys.ownerList(initialQuery),
    queryFn: async ({ pageParam }) => {
      const page = await noteService.getOwnerNotes({
        ...initialQuery,
        continuationToken: pageParam
      });

      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.continuationToken,
    enabled
  });
};

/**
 * Searches public notes when a non-empty search term is present.
 *
 * @param query - Public note query values that include the search term.
 * @returns React Query state for mapped public note search results.
 */
export const usePublicNoteSearchQuery = (query: BaseQuery) =>
  useQuery({
    queryKey: noteKeys.publicSearch(query),
    queryFn: async () => {
      const page = await noteService.searchPublicNotes(query);
      return {
        ...page,
        items: page.items.map(mapPublicNoteListItemResponseToModel)
      };
    },
    enabled: Boolean(query.searchTerm?.trim())
  });

/**
 * Loads one public note detail by id.
 *
 * @param noteId - Note identifier from the route.
 * @param enabled - Set to false when owner mode is active or auth is not ready.
 * @returns React Query state for the mapped public note detail.
 */
export const usePublicNoteQuery = (noteId: string, enabled = true) =>
  useQuery({
    queryKey: noteKeys.publicDetail(noteId),
    queryFn: async () => mapPublicNoteDetailResponseToModel(await noteService.getPublicNoteById(noteId)),
    enabled: enabled && noteId.trim().length > 0
  });

/**
 * Loads one owner note detail in editable entry form shape.
 *
 * @param noteId - Note identifier from the route.
 * @returns React Query state for the mapped editable note entry.
 */
export const useOwnerNoteEntryQuery = (noteId: string) =>
  useQuery({
    queryKey: noteKeys.ownerEntry(noteId),
    queryFn: async () => mapPublicNoteDetailResponseToEntryModel(await noteService.getOwnerNoteById(noteId)),
    enabled: noteId.trim().length > 0
  });

/**
 * Loads one owner note detail by id.
 *
 * @param noteId - Note identifier from the route.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query state for the mapped owner note detail.
 */
export const useOwnerNoteQuery = (noteId: string, enabled = true) =>
  useQuery({
    queryKey: noteKeys.ownerDetail(noteId),
    queryFn: async () => mapPublicNoteDetailResponseToModel(await noteService.getOwnerNoteById(noteId)),
    enabled: enabled && noteId.trim().length > 0
  });

/**
 * Loads public note categories used by note navigation and filters.
 *
 * @param query - Optional paging or filtering values for category results.
 * @returns React Query state for public note categories.
 */
export const usePublicNoteCategoriesQuery = (query: BaseQuery = {}, enabled = true) =>
  useQuery({
    queryKey: noteKeys.publicCategories(query),
    queryFn: () => noteService.getPublicNoteCategories(query),
    enabled
  });

/**
 * Loads owner note categories used by note navigation and filters.
 *
 * @param query - Optional paging or filtering values for category results.
 * @param enabled - Set to false when public preview mode is active or auth is
 * not ready.
 * @returns React Query state for owner note categories.
 */
export const useOwnerNoteCategoriesQuery = (query: BaseQuery = {}, enabled = true) =>
  useQuery({
    queryKey: noteKeys.ownerCategories(query),
    queryFn: () => noteService.getOwnerNoteCategories(query),
    enabled
  });

/**
 * Loads public note tags used by note navigation and filters.
 *
 * @param query - Optional paging or filtering values for tag results.
 * @returns React Query state for public note tags.
 */
export const usePublicNoteTagsQuery = (query: BaseQuery = {}) =>
  useQuery({
    queryKey: noteKeys.publicTags(query),
    queryFn: () => noteService.getPublicNoteTags(query)
  });

/**
 * Loads the public search index used for fast client-side note discovery.
 *
 * @returns React Query state for the mapped public note search index.
 */
export const usePublicNoteSearchIndexQuery = () =>
  useQuery({
    queryKey: noteKeys.publicSearchIndex(),
    queryFn: async () => mapPublicSearchIndexResponseToModel(await noteService.getPublicNoteSearchIndex())
  });
